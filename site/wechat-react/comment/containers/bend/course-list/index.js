import React, { Component } from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import ScrollView from 'components/scroll-view';

import { request } from 'common_actions/common';
import { timeBefore } from 'components/util';
import { collectVisible } from 'components/collect-visible';


class BendCourseList extends Component {
    state = {
        courseList: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            }
        }
    }

    componentDidMount() {
        this.getCourseList();

        typeof _qla === 'undefined' || _qla.bindVisibleScroll('co-scroll-view');
    }

    render() {
        let { courseList } = this.state;

        return <Page title="课程评论" className="comment-course-list">
            <ScrollView
                onScrollBottom={() => this.getCourseList(true)}
                status={courseList.data && courseList.data.length === 0 ? undefined : this.state.courseList.status}
            >
                {
                    !courseList.data
                    ?
                    false
                    :
                    courseList.data.length === 0
                    ?
                    <div className="list-empty">
                        <div></div>
                        <p>没有任何消息哦</p>
                    </div>
                    :
                    courseList.data.map((item, index) => {
                        return <div key={index}
                            className="message-item on-log on-visible"
                            data-log-region="course-item"
                            data-log-pos={index}
                            onClick={() => this.onClickCourseItem(index)}
                        >
                            <div className="img" style={{backgroundImage: `url(${item.topicLogo}@160w_100h_1e_1c_2o)`}}>
                                {
                                    item.newsNum > 0 &&
                                    <div className="unread">{item.newsNum > 999 ? '999+' : item.newsNum}</div>
                                }
                            </div>
                            <div className="info">
                                <div className="main">
                                    <div className="title">{item.topicName}</div>
                                </div>
                                <div className="desc">
                                    <div className="icon icon-comment-48"></div>
                                    <div className="content">
                                        {item.commentNum}
                                    </div>
                                    <div className="time">{timeBefore(item.time)}</div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </ScrollView>
        </Page>
    }

    getCourseList = async isContinue => {
        if (/pending|end/.test(this.state.courseList.status)) return;

        const page = {
            ...this.state.courseList.page
        };
        page.page = isContinue && this.state.courseList.data ? page.page + 1 : 1;

        this.setState({
            courseList: {
                ...this.state.courseList,
                status: 'pending',
            }
        })

        request({
            url: '/api/wechat/comment/getLiveCourseList',
            method: 'POST',
            body: {
                liveId: this.props.location.query.liveId,
                page,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            let list = res.data.topics || [];

            this.setState({
                courseList: {
                    ...this.state.courseList,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? this.state.courseList.data.concat(list) : list,
                    page,
                }
            })

            collectVisible();

        }).catch(err => {
            console.error(err);
            window.toast(err.message);
            this.setState({
                courseList: {
                    ...this.state.courseList,
                    status: '',
                }
            })
        })
    }

    onClickCourseItem = index => {
        const course = this.state.courseList.data[index];
        setTimeout(() => {
            this.props.router.push(`/wechat/page/comment/bend-course-details?liveId=${this.props.location.query.liveId}&topicId=${course.topicId}`);
        }, 10)
    }
}




function mapStateToProps(state) {
    return state
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(BendCourseList);