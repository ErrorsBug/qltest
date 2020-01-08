const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { throttle } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';
import classnames from 'classnames';

import CourseList from './components/course-list';
import TwoLevelLabel from './components/two-level-label';

// actions
import { 
    fetchCourseList,
    switchLabelGetCourseList
} from '../../actions/low-price-recommend';
import { getTwoLevelTag } from '../../actions/recommend';

class LowPriceRecommend extends Component {

    state = {
        isNoMoreCourse: false,
        noneData:false,//没有数据空页面的状态
        firstTag: [],
        secondTag: [],
        nowFirstTagId: null, // 当前选中标签id
        nowSecondTagId: null,
        displayFirstTag: true,
    }
    data = {
        pageSize: 20, // 加载课程每页20个
        firstTagData: [],
        secondTagData: [],
        initTagId: null, // 初始化加载课程对应的tag id
        firstTagBoxHeight: 0,
        scrollClientHeight: 0,
        scrollTop: 0,
        scrollHeight:0,
        leftDis: 0,
        nowScrollTop: 0, // 当前滚动高度
        scrollTopToHide: null, // 当前需要滚动多少距离则隐藏一级标签
        scrollTopToSHow: null, // 当前需要滚动多少距离则显示一级标签
    }

    async componentDidMount() {
        this.data.firstTagBoxHeight = findDOMNode(this.refs.twoLevelLabel).clientHeight;

        share({
            title: '低价精品课程尽在【千聊】',
            timelineTitle: '低价精品课程尽在【千聊】',
            desc: '最全面热门的精品课程低价听！一起来听听吧！',
            timelineDesc: '最全面热门的精品课程低价听！一起来听听吧！', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/ql-logo-2.png'
        });

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);

        this.setTraceSession();

        await this.initTag();
        await this.initCourseList();
        this.getScrollHeight();
    }
    // 获取滚动DOM高度
    getScrollHeight() {
        let dom = findDOMNode(this.refs.scrollToLoad);
        dom.scrollTop = 0;

        let paddingTop = 0;
        switch(Number(document.documentElement.getAttribute('data-dpr'))) {
            case 1:
                paddingTop = 40;
                break;
            case 2: 
                paddingTop = 80;
                break;
            case 3:
                paddingTop = 120;
                break;
            default: 
                paddingTop = 40;
        }

        this.data.scrollClientHeight = dom.clientHeight - 1.6 * parseInt(document.documentElement.style.fontSize) - paddingTop;
        this.data.scrollTop = dom.scrollTop;
        this.data.scrollHeight = dom.children[0].scrollHeight;
        if (dom.children.length > 1) {
            this.data.scrollHeight += dom.children[1].clientHeight;
        }
        // console.log(this.data.scrollClientHeight,this.data.scrollTop,this.data.scrollHeight);
        this.data.leftDis = this.data.scrollHeight - this.data.scrollClientHeight - this.data.scrollTop;
    }
    setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', 'low-price-recommend');
    }

    async initCourseList() {
        // 初始化课程列表
        if (this.props.courseList.length < 1) {
            const result = await this.props.fetchCourseList(
                this.props.coursePageNum,
                this.props.coursePageSize,
                this.data.initTagId,
                true,
            );
        }

        // 初始数据不够分页，则结束分页加载更多
        if (this.props.courseList.length <= 0) {
            this.setState({
                noneData: true,
                isNoMoreCourse: false
            });
        } else if (this.props.courseList.length < this.props.coursePageSize) {
            this.setState({
                isNoMoreCourse: true,
                noneData: false
            });
        }
    }

    async loadMoreCourse(next) {
        const result = await this.props.fetchCourseList(
            this.props.coursePageNum + 1,
            this.props.coursePageSize,
            this.state.nowSecondTagId,
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
    // 整合菜单栏的数据
    arrangeTag() {
        var firstTagData = this.data.firstTagData,
            secondTagData = this.data.secondTagData;

        this.props.twoLevelAllTags.forEach((item, index) => {
            if (item.parentId == 0) {
                firstTagData.push({
                    labelName: item.name,
                    sign: item.id
                });
            }
        });
        firstTagData.forEach((item, index) => {
            secondTagData.push([{
                labelName: '全部',
                sign: item.sign,
                belongParentIndex: index
            }]);
        });
        this.props.twoLevelAllTags.forEach((item, index) => {
            if (item.parentId != 0) {
                for (let i = 0, l = firstTagData.length; i < l; i++) {
                    if (item.parentId == firstTagData[i].sign) {
                        secondTagData[i].push({
                            labelName: item.name,
                            sign: item.id,
                            belongParentIndex: i,
                        });
                        break;
                    }
                }
            }
        });
        // this.data.initTagId = this.data.firstTagData[0].sign;

        // if (!isNode && typeof window.sessionStorage != 'undefined') {
        //     let tracePage = sessionStorage.getItem('trace_page'),
        //         storageTagId = sessionStorage.getItem('free_recommend_second_tag_id');
        //     console.log('storageTagId', storageTagId);
        //     if (storageTagId) {
        //         this.data.initTagId = storageTagId;
        //     } else {
        //         sessionStorage.setItem('free_recommend_second_tag_id', this.data.initTagId);
        //     }
        // }
        // console.log('this.data.initTagId:  ', this.data.initTagId);
        let secondTagIndex;
        if (/tagId=(\d+)/.test(location.search)) {
            this.data.initTagId = RegExp.$1;
        } else {
            this.data.initTagId = this.data.firstTagData[0].sign;
        }

        secondTagData.some((item, index) => {
            for (let j = 0, il = item.length; j < il; j++) {
                if (item[j].sign == this.data.initTagId) {
                    secondTagIndex = index;
                    return true;
                }
            }
        });

        this.setState({
            firstTag: this.data.firstTagData,
            secondTag: this.data.secondTagData[secondTagIndex],
            nowFirstTagId: this.data.firstTagData[secondTagIndex].sign,
            nowSecondTagId: this.data.initTagId
        });
    }
    // 点击一级标签切换
    async switchFirstTag(tagId) {
        if (tagId == this.state.nowFirstTagId) {
            return false;
        }

        this.setState({
            isNoMoreCourse: false,
        });
        // this.setStorageTagId(tagId);
        this.props.router.replace('/wechat/page/low-price-recommend?tagId=' + tagId);

        this.setState({
            displayFirstTag: true
        });
        await this.props.switchLabelGetCourseList(1, this.data.pageSize, tagId, true);

        this.getScrollHeight();

        var index;
        for (let i = 0, l = this.data.firstTagData.length; i < l; i++) {
            if (tagId == this.data.firstTagData[i].sign) {
                index = i;
                break;
            }
        }

        this.setState({
            nowFirstTagId: tagId,
            nowSecondTagId: tagId, // 点击一级标签二级标签也为一级标签
            secondTag: this.data.secondTagData[index],
            noneData: false
        });
        // 初始数据不够分页，则结束分页加载更多
        if (this.props.courseList.length <= 0) {
            this.setState({
                noneData: true,
                isNoMoreCourse: false
            });
        } else if (this.props.courseList.length < this.props.coursePageSize) {
            this.setState({
                isNoMoreCourse: true,
                noneData: false
            });
        } else {
            this.setState({
                isNoMoreCourse: false,
                noneData: false
            });
        }
    }
    // 点击二级标签切换
    async switchSecondTag(tagId, parentIndex) {
        if (tagId == this.state.nowSecondTagId) {
            return false;
        }

        this.setState({
            isNoMoreCourse: false,
        });
        // this.setStorageTagId(tagId);
        this.props.router.replace('/wechat/page/low-price-recommend?tagId=' + tagId);

        await this.props.switchLabelGetCourseList(1, this.data.pageSize, tagId, true);

        this.getScrollHeight();

        this.setState({
            nowFirstTagId: this.data.firstTagData[parentIndex].sign,
            nowSecondTagId: tagId,
            noneData: false
        });
        // 初始数据不够分页，则结束分页加载更多
        if (this.props.courseList.length <= 0) {
            this.setState({
                noneData: true,
                isNoMoreCourse: false
            });
        } else if (this.props.courseList.length < this.props.coursePageSize) {
            this.setState({
                isNoMoreCourse: true,
                noneData: false
            });
        } else {
            this.setState({
                isNoMoreCourse: false,
                noneData: false
            });
        }
    }
    // 前端路由进入该页初始化菜单
    async initTag() {
        if (this.props.twoLevelAllTags && this.props.twoLevelAllTags.length < 1) {
            await this.props.getTwoLevelTag('low');
        }
        this.arrangeTag();
    }
    //滚动课程
    @throttle(10, { trailing: true, leading: true })
    scrollCourse(e, scrollDistance, clientHeight, scrollHeight) {
        // this.refs['testBox'].innerHTML = scrollDistance+ '  '+clientHeight+'  '+scrollHeight;
        if (scrollDistance < 0 || scrollDistance+clientHeight > scrollHeight) {
            return;
        }

        if (this.data.leftDis < 2 * Math.floor(this.data.firstTagBoxHeight)) {
            this.setState({
                displayFirstTag: true
            });
        }/* else if (Math.floor(scrollDistance) < Math.floor(this.data.firstTagBoxHeight)) {
            this.setState({
                displayFirstTag: true
            });
        } else {
            this.setState({
                displayFirstTag: false
            });
        }*/else if (this.state.displayFirstTag) {
            this.data.scrollTopToShow = null;
            if (!this.data.scrollTopToHide || this.data.scrollTopToHide > scrollDistance + this.data.firstTagBoxHeight) {
                this.data.scrollTopToHide = scrollDistance + this.data.firstTagBoxHeight; // 当前滚动距离+一级标签高度
            } else {
                // 若当前滚动距离大于需要隐藏标签的高度了
                if (scrollDistance > this.data.scrollTopToHide) {
                    this.setState({
                        displayFirstTag: false
                    });
                }
            }

        } else {
            this.data.scrollTopToHide = null;
            if (!this.data.scrollTopToShow || this.data.scrollTopToShow < scrollDistance - this.data.firstTagBoxHeight) {
                this.data.scrollTopToShow = (scrollDistance - this.data.firstTagBoxHeight < 0) ? 1 : scrollDistance - this.data.firstTagBoxHeight; // 当前滚动距离-一级标签高度
            }
            // 若当前滚动距离小于需要显示标签的高度了
            if (scrollDistance < this.data.scrollTopToShow) {
                this.setState({
                    displayFirstTag: true
                });
            }
        }
    }
    // 设置sessionStorage tag id
    // setStorageTagId(tagId) {
    //     if (!isNode && typeof window.sessionStorage != 'undefined') {
    //         sessionStorage.setItem('free_recommend_second_tag_id', tagId);
    //     }
    // }
    render() {
        let { courseList } = this.props;

        return (
            <Page title="低价专区" className='low-price-rcm-container'>
                <TwoLevelLabel
                    ref = "twoLevelLabel"
                    firstListInfo = {this.state.firstTag}
                    firstLiClassName = "free-low-f-menu-li"
                    firstSectionClassName = "free-low-f-menu-section"
                    firstUlClassName='free-low-f-menu-ul'
                    secondListInfo = {this.state.secondTag}
                    secondLiClassName = "free-low-s-menu-li"
                    secondSectionClassName = "free-low-s-menu-section"
                    secondUlClassName='free-low-s-menu-ul'
                    firstLabelClickFunc = {this.switchFirstTag.bind(this)}
                    secondLabelClickFunc = {this.switchSecondTag.bind(this)}
                    nowFirstLabel = {this.state.nowFirstTagId}
                    nowSecondLabel = {this.state.nowSecondTagId}
                    containerClass = {classnames('free-low-contain', {'pick-up': !this.state.displayFirstTag})}
                />
                <ScrollToLoad
                    ref= "scrollToLoad"
                    className={classnames("scroll-box")}
                    toBottomHeight={500}
                    noneOne={this.state.noneData}
                    loadNext={ this.loadMoreCourse.bind(this) }
                    noMore={ this.state.isNoMoreCourse }
                    scrollToDo={this.scrollCourse.bind(this)} >

                    

                    <div className="list-wrap">
                        <CourseList
                            items={ courseList }
                        />
                    </div>
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        courseList: state.lowPriceRecommend.courseList,
        coursePageSize: state.lowPriceRecommend.coursePageSize,
        coursePageNum: state.lowPriceRecommend.coursePageNum,
        twoLevelAllTags: state.recommend.twoLevelAllTags,
    }
}

const mapActionToProps = {
    fetchCourseList,
    switchLabelGetCourseList,
    getTwoLevelTag,
};

module.exports = connect(mapStateToProps, mapActionToProps)(LowPriceRecommend);
