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
import ScrollToLoad from 'components/scrollToLoad';
import Loading from '@ql-feat/loading';

import QuestionList from './components/question-list';

// actions
import {
    initLiveShareQualify,
} from '../../../actions/live';


@graphql(gql`
    query LiveQuestion($page: Int, $size: Int = 20, $liveId: String) {
        questionList(page: $page, size: $size, liveId: $liveId) {
            # 用户ID
            userId
            # 用户名
            name
            # 用户头像
            headImgUrl
            # 简介
            introduce
            # 是否开启私问
            isWhisperOpen
            # 回答的问题数量
            answerNum
            # 旁听人数
            listenNum
            # 最近课程id
            topicId
            # 最近课程名
            topic
        }

        # 当前用户
        curUserInfo {
            userId
        }

        # 直播间信息
        liveInfo(liveId: $liveId) {
            entity {
                name
                introduce
                logo
            }
        }

        # 权限
        power(liveId: $liveId) {
            allowMGLive
        }
    }
`, {
    props: ({ ownProps, mutate, data, ...others }) => ({
        ...others,
        data,
        fetchNext(page, liveId) {
            return data.fetchMore({
                variables: {
                    page,
                    liveId,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return previousResult;
                    }

                    return {
                        ...previousResult,
                        questionList: [ ...previousResult.questionList, ...fetchMoreResult.questionList ]
                    }
                }
            })
        }
    }),
    options: props => {
        return {
            variables: {
                page: 1,
                liveId: props.params.liveId,
            },
            ssr: false
        }
    }
})
@withApollo
@autobind
class LiveQuestion extends Component {

    constructor(props, context) {
        super(props, context);

        this.liveId = props.params.liveId;
    }

    state = {
        noneOne: false,
        noMore: false,
        page: 1,
    }
    
    async componentDidMount() {
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
                    title: '我推荐-直播间"' + name + '"的问答',
                    desc: "这里有优质的直播间内容，快来查看吧",

                    timelineTitle: '我推荐-直播间"' + name + '"的问答',
                    timelineDesc: "这里有优质的直播间内容，快来查看吧", // 分享到朋友圈单独定制

                    imgUrl: logo,
                    shareUrl: this.origin + '/' + this.props.shareQualify.shareUrl,
                });
            } else {
                share({
                    title: '直播间"' + name + '"的问答',
                    desc: "这里有优质的直播间内容，快来查看吧",

                    timelineTitle: '直播间"' + name + '"的问答',
                    timelineDesc: "这里有优质的直播间内容，快来查看吧", // 分享到朋友圈单独定制

                    imgUrl: logo,
                });
            }
        }, 1000);
        
    }

    
    async doFetchList(next) {
        const result = await this.props.fetchNext(this.state.page + 1);

        this.setState({
            page: this.state.page + 1,
            noMore: result.data.questionList.length < 20
        });

        next();
    }

    render() {
        const { loading, questionList, curUserInfo, power } = this.props.data;

        if (loading) {
            return <Loading show={ true } />;
        }

        return (
            <Page title={"问答"} className='question-container'>
                <ScrollToLoad
                    toBottomHeight={ 1000 }
                    loadNext={ this.doFetchList }
                    noneOne={ this.state.noneOne }
                    noMore={ this.state.noMore }
                >
                    <QuestionList
                        power={ power }
                        list={ questionList }
                        curUserId={ curUserInfo.userId }
                        liveId={ this.liveId }
                    />
                </ScrollToLoad>
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

module.exports = connect(mapStateToProps, mapActionToProps)(LiveQuestion);
