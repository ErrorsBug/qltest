const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';

import CourseList from './components/course-list'

// actions
import { fetchCourseList } from '../../actions/charge-recommend';

class ChargeRecommend extends Component {

    state = {
        isNoMoreCourse: false,
        noneData:false,//没有数据空页面的状态
    }

    componentDidMount() {
        this.initCourseList();

        share({
            title: '精品知识就在千聊',
            timelineTitle: '好知识就在千聊--海量专家、老师、达人正在为您分享',
            desc: '海量专家、老师、达人正在为您分享',
            timelineDesc: '海量专家、老师、达人正在为您分享', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/ql-logo-2.png'
        });

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);

        this.setTraceSession();
    }

    setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', 'charge-recommend');
    }

    async initCourseList() {
        // 初始化课程列表
        if (this.props.courseList.length < 1) {
            const result = await this.props.fetchCourseList(
                this.props.coursePageNum,
                this.props.coursePageSize,
                true,
            );
        }

        // 初始数据不够分页，则结束分页加载更多
        if (this.props.courseList.length <= 0) {
            this.setState({
                noneData: true
            });
        }
    }

    async loadMoreCourse(next) {
        const result = await this.props.fetchCourseList(
            this.props.coursePageNum + 1,
            this.props.coursePageSize,
            false,
        );

        next && next();

        // 是否没有更多
        if (result && result.length < this.props.coursePageSize) {
            this.setState({
                isNoMoreCourse: true
            });
        }
    }

    render() {

        let { courseList } = this.props;

        let newCourseList = courseList.filter(item => item.displayStatus != 'N');

        return (
            <Page title="大师课" className='charge-recommend-container'>
                <ScrollToLoad
                    className="scroll-box"
                    toBottomHeight={500}
                    noneOne={this.state.noneData}
                    loadNext={ this.loadMoreCourse.bind(this) }
                    noMore={ this.state.isNoMoreCourse } >

                    <div className="list-wrap">
                        <CourseList
                            items={ newCourseList }
                        />
                    </div>
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        courseList: state.chargeRecommend.courseList,
        coursePageSize: state.chargeRecommend.coursePageSize,
        coursePageNum: state.chargeRecommend.coursePageNum
    }
}

const mapActionToProps = {
    fetchCourseList
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChargeRecommend);
