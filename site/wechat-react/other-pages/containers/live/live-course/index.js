const isNode = typeof window == 'undefined';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
import { BottomDialog, Confirm } from 'components/dialog';
import EmptyPage from 'components/empty-page';
import { locationTo, imgUrlFormat } from 'components/util';
import { share } from 'components/wx-utils';
import Loading from '@ql-feat/loading';

import CourseList from './components/course-list';

import withData from './graphql';

// actions
import {
    initLiveShareQualify,
} from 'actions/live';

@withData
@withApollo
@autobind
class LiveCourse extends Component {

    constructor(props, context) {
        super(props, context);

        this.liveId = props.router.params.liveId;
    }

    state = {
        noMorePurchaseCourse: false,
        noMorePlanCourse: false,
    }

    data = {
        pagePurchaseCourse: 1,
        pagePlanCourse: 1,
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
            } = this.props.liveInfo.liveInfo;
    
            if(this.props.shareQualify && this.props.shareQualify.id) {
                share({
                    
                    title: '我推荐-直播间"' + name + '"的课表',
                    desc: "这里有优质的直播间内容，快来查看吧",

                    timelineTitle: '我推荐-直播间"' + name + '"的课表',
                    timelineDesc: "这里有优质的直播间内容，快来查看吧", // 分享到朋友圈单独定制

                    imgUrl: logo,
                    shareUrl: this.origin + '/' + this.props.shareQualify.shareUrl,
                });
            } else {
                share({

                    title: '直播间"' + name + '"的课表',
                    desc: "这里有优质的直播间内容，快来查看吧",

                    timelineTitle: '直播间"' + name + '"的课表',
                    timelineDesc: "这里有优质的直播间内容，快来查看吧", // 分享到朋友圈单独定制

                    imgUrl: logo,
                });
            }
        }, 1000);
    }

    async onLoadMorePurchaseCourse() {
        const result = await this.props.fetchNextPurchaseCourse(this.data.pagePurchaseCourse++, 10, this.liveId)
        if (result.data.purchaseCourse.list.length < 10) {
            this.setState({
                noMorePurchaseCourse: true
            });
        }
    }

    async onLoadMorePlanCourse() {
        const result = await this.props.fetchNextPlanCourse(this.data.pagePlanCourse++, 10, this.liveId)
        if (result.data.planCourse.list.length < 10) {
            this.setState({
                noMorePurchaseCourse: true
            });
        }
    }

    get isEmptyPage() {
        const {
            purchaseCourse: {
                loading,
                purchaseCourse
            },
            liveInfo: {
                liveInfo
            },
            planCourseList: {
                planCourseList
            }
        } = this.props;

        if (
            (!planCourseList || planCourseList.length === 0)
            &&
            (!purchaseCourse || !purchaseCourse.list || purchaseCourse.list.length === 0)
        ) {
            return true;
        }
    }

    render() {
        const {
            purchaseCourse: {
                loading,
                purchaseCourse
            },
            liveInfo: {
                liveInfo
            },
            planCourseList: {
                planCourseList
            }
        } = this.props;

        const { noMorePlanCourse, noMorePurchaseCourse } = this.state;

        if (loading) {
            return <Loading show={ true } />;
        }

        return (
            <Page title={"课表"} className='live-course-container'>
                {
                    purchaseCourse && purchaseCourse.list && purchaseCourse.list.length > 0 &&
                        <div className='course-panel top'>
                            <header>
                                <span className='line-left'></span>
                                <span className='mid-title'>
                                    <img src={ require('../img/head-icon-paied.png') } alt="" />
                                    <span>已购课程</span>
                                </span>
                                <span className='line-right'></span>
                            </header>
        
                            <CourseList list={ purchaseCourse } style={ 1 } />
        
                            {
                                (!noMorePurchaseCourse && purchaseCourse.list.length > 0) &&
                                    <footer onClick={ this.onLoadMorePurchaseCourse }>
                                        查看更多
                                    </footer>
                            }
                        </div>
                }

                {
                    planCourseList && planCourseList.length > 0 &&
                        <div className='course-panel' >
                            <header>
                                <span className='line-left'></span>
                                <span className='mid-title'>
                                    <img src={ require('../img/head-icon-clock.png') } alt="" />
                                    <span>课程预告</span>
                                </span>
                                <span className='line-right'></span>
                            </header>
        
                            <CourseList list={ planCourseList } style={ 2 } />
                        </div>
                }

                {
                    !!this.isEmptyPage &&
                    <EmptyPage />
                }
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

module.exports = connect(mapStateToProps, mapActionToProps)(LiveCourse)
