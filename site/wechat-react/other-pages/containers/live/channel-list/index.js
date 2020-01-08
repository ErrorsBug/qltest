const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
import { BottomDialog, Confirm } from 'components/dialog';
import { locationTo, imgUrlFormat } from 'components/util';
import { share } from 'components/wx-utils';

// components
import ScrollToLoad from 'components/scrollToLoad';
import TabBar from './components/head-tab-bar';
import ChannelItem from '../components/channel-item';
import ChannelActionSheet from '../components/channel-bottom-actionsheet';
import Loading from '@ql-feat/loading';

// actions
import {
    initLiveShareQualify,
} from '../../../actions/live';


@graphql(gql`
    query ChannelTags($liveId: String, $type: String) {
        # 获取系列课分类列表
        channelTags(liveId: $liveId, type: $type) {
            # 分类ID
            id
            # 分类名称
            name
            # 状态
            status
            # 移动后系列课分类位置
            targetNum
        }

        # 权限
        power(liveId: $liveId) {
            allowMGLive
        }

        # 直播间信息
        liveInfo(liveId: $liveId) {
            entity {
                name
                introduce
                logo
            }
        }
    }
`, {
    options: props => ({
        variables: {
            liveId: props.params.liveId,
            type: null
        },
        ssr: false
    })
})
@withApollo
@autobind
class ChannelList extends Component {

    constructor(props, context) {
        super(props, context);

        this.liveId = props.params.liveId;
    }

    state = {
        activeTab: '0',

        noneOne: false,
        noMore: false,

        activeList: [],

        showActionSheet: false,
        activeChannel: null,
    }
    
    data = {
        page: 1,
    }

    async componentDidMount() {
        this.doFetchList('0');
        this.origin = location.origin;

        await this.props.initLiveShareQualify(this.liveId);

        setTimeout(() => {
            const {
                entity: {
                    name,
                    introduce,
                    logo
                }
            } = this.props.data.liveInfo;
    
            if(this.props.shareQualify && this.props.shareQualify.id) {
                share({
                    title: "我推荐-" + name,
                    timelineTitle: name,
                    desc: introduce,
                    timelineDesc: "我推荐-欢迎大家关注直播间:" + name, // 分享到朋友圈单独定制
                    imgUrl: logo,
                    shareUrl: this.origin + '/' + this.props.shareQualify.shareUrl,
                });
            } else {
                share({
                    title: name,
                    timelineTitle: name,
                    desc: introduce,
                    timelineDesc: "欢迎大家关注直播间:" + name, // 分享到朋友圈单独定制
                    imgUrl: logo,
                });
            }
        }, 1000);
    }

    onChangeTab(tagId) {
        this.setState({
            activeTab: tagId,
            activeList: [],
            noMore: false,
            noneOne: false,
        });

        this.data.page = 1;

        this.doFetchList(tagId);
    }

    async doFetchList(type = '0', next) {
        const result = await this.props.client.query({
            query: gql`
                query ChannelList($liveId: String, $tagId: String, $isCamp: String, $page: Int, $size: Int) {
                    # 获取系列课列表
                    channelList(liveId: $liveId, tagId: $tagId, isCamp: $isCamp, page: $page, size: $size) {
                        # 系列课ID
                        id
                        name
                        headImage
                        beginTopicNum
                        planCount
                        learningNum
                        displayStatus
                        isRelay
                        chargeConfigs {
                            id
                            createBy
                            createTime
                            updateTime
                            channelId
                            chargeMonths
                            amount
                            status
                            discount
                            discountStatus
                            groupNum
                        }
                    }
                }
            `,
            variables: {
                liveId: this.liveId,
                page: this.data.page++,
                size: 20,
                isCamp: 'N',
                tagId: type
            },
            options: {
                fetchPolicy: 'network-only'
            }
        });

        if (result.data && result.data.channelList && result.data.channelList.length < 20) {
            this.setState({
                noMore: true,
                activeList: [...this.state.activeList, ...result.data.channelList],
            }, () => next && next());
            return;
        } else {
            this.setState({
                activeList: [...this.state.activeList, ...result.data.channelList],
            }, () => next && next());
        }

        if (this.state.activeList.length === 0) {
            this.setState({
                noneOne: true
            }, () => next && next());
            return;
        }
    }

    openBottomMenu(e, channelItem) {
        e.stopPropagation();

        this.setState({
            showActionSheet: true,
            activeChannel: channelItem
        });
    }

    hideActionSheet() {
        this.setState({
            showActionSheet: false
        });
    }

    onChannelDisplayChange(channelItem) {
        this.setState({
            activeList: this.state.activeList.map(item => {
                if (item.id == channelItem.id) {
                    return { ...item, ...channelItem};
                }

                return item;
            })
        });
    }

    onChannelTagComplete(tagId, channelId) {
        if (tagId != this.state.activeTab) {
            this.setState({
                activeList: this.state.activeList.filter(item => item.id != channelId)
            });
        }
    }

    onChannelDelete(channelId) {
        this.setState({
            activeList: this.state.activeList.filter(item => item.id != channelId)
        });
    }

    render() {
        let { loading, channelTags, power } = this.props.data;
        const { noneOne, noMore, activeTab, activeList } = this.state;

        if (loading) {
            return <Loading show={ true } />;
        }

        return (
            <Page title={"系列课列表"} className='live-channel-list-container' >
                {
                    channelTags && channelTags.length > 0 &&
                        <TabBar
                            tabItem={ channelTags }
                            activeTab={ activeTab }
                            onChangeTab={ this.onChangeTab }
                        />
                }
                <div className={'scroll-container new-channel ' + (channelTags && channelTags.length > 0 && 'has-top')}>
                    <ScrollToLoad
                        toBottomHeight={ 1000 }
                        loadNext={ next => this.doFetchList(this.state.activeTab, next) }
                        noneOne={ noneOne }
                        noMore={ noMore }
                        className='scroll-to-load'
                    >
                        {
                            activeList && activeList.map(item => {
                                if (power.allowMGLive || item.displayStatus == 'Y') {
                                    return (
                                        <ChannelItem
                                            key={ `active-channel-item-${ item.id }` }
                                            power={ power }
                                            title={ item.name }
                                            logo={ item.headImage }
                                            courseNum={ item.beginTopicNum || 0 }
                                            courseTotal={ item.learningNum || 0 }
                                            learnNum={ item.learningNum || 0 }
                                            chargeConfigs={ item.chargeConfigs }
                                            openBottomMenu={ e => this.openBottomMenu(e, item) }
                                            channelId={ item.id }
                                            hide={ item.displayStatus == 'N' }
                                            isRelay={item.isRelay}
                                        />
                                    )
                                } else {
                                    return null;
                                }
                            })
                        }
                    </ScrollToLoad>
                </div>

                <ChannelActionSheet
                    show={ this.state.showActionSheet }
                    liveId={ this.liveId }
                    hideActionSheet={ this.hideActionSheet }
                    activeChannel={ this.state.activeChannel }
                    activeTag={ this.state.activeTab }
                    onChannelDisplayChange={ this.onChannelDisplayChange }
                    onChannelTagComplete={ this.onChannelTagComplete }
                    onChannelDelete={ this.onChannelDelete }
                />
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
        shareQualify: state.live.shareQualify,
    }
}

const mapActionToProps = {
    initLiveShareQualify,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelList);
