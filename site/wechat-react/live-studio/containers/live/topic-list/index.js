const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Page from 'components/page';
import { share } from 'components/wx-utils';
import ScrollToLoad from 'components/scrollToLoad';
import TopicItem from '../components/topic-item';
import TopicActionSheet from '../components/topic-bottom-actionsheet';
import Loading from '@ql-feat/loading';
import {
    initLiveShareQualify,
    getPushNum,
} from '../../../actions/live';


const POWER_QUERY = `
    power(liveId: $liveId) {
        allowMGLive
    }
`;

const getTopicQuery = (fetchPower = false) => gql`
    query Topic($liveId: String, $page: Int, $size: Int) {
        # 话题列表
        topicList(liveId: $liveId, page: $page, size: $size) {
            # 话题ID
            id
            # 话题类型public=免费，charge=收费，encrypt=加密
            type
            # 话题状态beginning=开始中，ended=已结束，delete=删除
            status
            # 话题名称
            topic
            # 价格，分
            money
            # 话题开始时间
            startTime
            # 话题风格normal-讲座，ppt-PPt风格
            style
            # 背景图
            backgroundUrl
            # 话题浏览数
            browseNum
            # 转播
            isRelay
            displayStatus
        }

        # 直播间信息
        liveInfo(liveId: $liveId) {
            entity {
                name
                introduce
                logo
            }
        }

        ${fetchPower ? POWER_QUERY : ''}
    }
`

@graphql(getTopicQuery(true), {
    options: props => ({
        variables: {
            liveId: props.params.liveId,
            page: 1,
            size: 20
        },
        ssr: false
    }),
    props: ({ ownProps, mutate, data, ...others }) => ({
        ...others,
        data,
        fetchNext(page, liveId) {
            return data.fetchMore({
                query: getTopicQuery(false),
                variables: {
                    page,
                    liveId,
                    size: 20,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return previousResult;
                    }

                    return {
                        ...previousResult,
                        topicList: [ ...previousResult.topicList, ...fetchMoreResult.topicList ]
                    }
                }
            })
        }
    }),
})

@withApollo
@autobind
class ChannelList extends Component {

    constructor(props, context) {
        super(props, context);
        this.liveId = props.params.liveId;
    }

    state = {
        noneOne: false,
        noMore: false,
        activeTopic: null,
        showActionSheet: false,
    }

    data = {
        page: 1,
    }

    /**
     * 分享设置
     */
    setShareInfo = async () => {
        await this.props.initLiveShareQualify(this.liveId);
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
    }

    async componentDidMount() {
        this.origin = location.origin;
        this.props.getPushNum(this.liveId);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data.loading && !nextProps.data.loading) {
            this.setShareInfo();
        }
    }

    showActionSheet() {
        this.setState({
            showActionSheet: true
        });
    }

    hideActionSheet() {
        this.setState({
            showActionSheet: false
        });
    }

    async doFetchList(next) {

        const result = await this.props.fetchNext(++this.data.page, this.liveId);
        if (result.data.topicList.length < 20) {
            this.setState({
                noMore: true
            });
        }

        next && next();
    }

    resetDate() {
        this.data.page = 1;
        this.setState({
            noMore: false,
        });
    }

    openBottomMenu(e, topicItem) {
        e.stopPropagation();

        this.setState({
            activeTopic: topicItem
        });

        this.showActionSheet();
    }

    render() {
        const { loading, topicList, power } = this.props.data;

        if (loading) {
            return <Loading show={ true } />;
        }

        return (
            <Page title={"单课列表"} className='live-topic-list-container new-topic'>
                <ScrollToLoad
                    toBottomHeight={ 1000 }
                    loadNext={ this.doFetchList }
                    noneOne={ this.state.noneOne }
                    noMore={ this.state.noMore }
                    className='live-topic-list'
                >
                    {
                        topicList && topicList.map((item, index) => (
                            <TopicItem
                                key={ `topic-item-${index}` }
                                power={ power }
                                chargeType={ item.type }
                                money={ item.money }
                                status={ item.status }
                                startTime={ item.startTime }
                                timeNow={ +new Date }
                                topicStyle={ item.style }
                                logo={ item.backgroundUrl }
                                browseNum={ item.browseNum }
                                title={ item.topic }
                                openBottomMenu={ e => this.openBottomMenu(e, item) }
                                topicId={ item.id }
                                isRelay={ item.isRelay }
                            />
                        ))
                    }
                </ScrollToLoad>

                {
                    this.state.showActionSheet &&
                    <TopicActionSheet
                        ref='actionSheet'
                        show={ this.state.showActionSheet }
                        refresh={ this.props.data.refetch.bind(this) }
                        hideActionSheet={ this.hideActionSheet }
                        activeTopic={ this.state.activeTopic }
                        liveId={ this.liveId }
                        pushNum={ this.props.pushNum }
                    />
                }
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
        shareQualify: state.live.shareQualify,
        pushNum: state.live.todayPushNum,
    }
}

const mapActionToProps = {
    initLiveShareQualify,
    getPushNum,
}

export default connect(mapStateToProps, mapActionToProps)(ChannelList);
