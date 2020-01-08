
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';
import TwoLevelLabel from './components/two-level-label';
import HeadBanner from './components/banner'
import SortStatus from './components/sort-status'
import { autobind } from 'core-decorators'
import CommonCourseItem from 'components/common-course-item';
import { locationTo } from 'components/util';
import NewUserGift, { getNewUserGiftData } from 'components/new-user-gift';

import { 
    fetchCourseList,
    switchLabelGetCourseList,
    getFreeAllTag,
    getFreeListBanner
} from '../../actions/free-recommend';

@autobind
class FreeRecommend extends Component {
    state = {
        isNoMoreCourse: false,
        noneData:false,//没有数据空页面的状态
        firstTag: [],
        nowFirstTagId: null, // 当前选中标签id
        sortIdx: 0, 

        isShowNewUserGift: false,
    }
    data = {
        pageSize: 20, // 加载课程每页20个
        firstTagData: [],
        initTagId: null, // 初始化加载课程对应的tag id
        firstTagBoxHeight: 0, // 一级标签高度
        scrollClientHeight: 0, // 滚动节点可视高度（不包括padding）
        scrollTop: 0, // 起始滚动高度
        scrollHeight:0, // 滚动总高度
        leftDis: 0, // 只加载一页的剩余可滚动的高度
    }
    async componentDidMount() {
        this.data.firstTagBoxHeight = findDOMNode(this.refs.twoLevelLabel).clientHeight;
        share({
            title: '免费精品课程尽在【千聊】',
            timelineTitle: '免费精品课程尽在【千聊】',
            desc: '最全面热门的精品课程免费听！一起来听听吧！',
            timelineDesc: '最全面热门的精品课程免费听！一起来听听吧！', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/ql-logo-2.png'
        });
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);
        this.setTraceSession();

        getNewUserGiftData().then(res => this.setState(res));

        await this.initTag();
        await this.initCourseList();
        await this.props.getFreeListBanner(); 
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
        this.data.leftDis = this.data.scrollHeight - this.data.scrollClientHeight - this.data.scrollTop;
    }
    setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', 'free-recommend');
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
        this.changeTags();
    }
    changeTags(){
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
        const { sortIdx } = this.state;
        const order = this.onChangeSrot(sortIdx);
        const result = await this.props.fetchCourseList(
            this.props.coursePageNum + 1,
            this.props.coursePageSize,
            this.state.nowFirstTagId,
            false,
            order,
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
        var firstTagData = this.data.firstTagData;
        this.props.twoLevelAllTags.forEach((item, index) => {
            if (item.parentId == 0) {
                firstTagData.push({
                    labelName: item.name,
                    sign: item.id
                });
            }
        });
        if (/tagId=(\d+)/.test(location.search)) {
            this.data.initTagId = RegExp.$1;
        } else {
            this.data.initTagId = this.data.firstTagData[0].sign;
        }
        this.setState({
            firstTag: this.data.firstTagData,
            nowFirstTagId: this.data.initTagId,
        });
    }
    // 点击一级标签切换
    switchFirstTag(tagId) {
        if (tagId == this.state.nowFirstTagId) {
            return false;
        }
        this.setState({
            isNoMoreCourse: false,
            nowFirstTagId:tagId,
            noneData: false,
            sortIdx: 0,
        }, async () => {
            this.props.router.replace('/wechat/page/free-recommend?tagId=' + tagId);
            if(!tagId || tagId == 1){
                await this.props.getFreeListBanner(); 
            }
            await this.props.switchLabelGetCourseList(1, this.data.pageSize, tagId, true);
            this.changeTags();
            this.getScrollHeight();
        });
        
    }
    // 前端路由进入该页初始化菜单
    async initTag() {
        if (this.props.twoLevelAllTags && this.props.twoLevelAllTags.length < 1) {
            await this.props.getFreeAllTag();
        }
        this.arrangeTag();
    }
    // 选择排序
    onSort(idx){
        const order = this.onChangeSrot(idx);
        this.setState({
            isNoMoreCourse: false,
            noneData: false,
            sortIdx: idx,
        }, async () => {
            await this.props.switchLabelGetCourseList(1, this.data.pageSize, this.state.nowFirstTagId, true,order);
            this.changeTags();
            this.getScrollHeight();
        })
    }

    onChangeSrot(idx){
        let order;
        switch (idx) {
            case 1:
                order = 'hot'
                break;
            case 2:
                order = 'comment'
                break;
        }
        return order
    }
    // 跳转
    onCourse(course, i){
        let url = '';
        // if(!!course.firstTopicId){
        //     url = `/topic/details?topicId=${course.firstTopicId}&name=免费专区&pos=${i}`
        // } else 
        {
            url = course.businessType === 'channel'
            ?
            `/wechat/page/channel-intro?channelId=${course.businessId}&name=免费专区&pos=${i}`
            :
            `/wechat/page/topic-intro?topicId=${course.businessId}&name=免费专区&pos=${i}`;
        }
        locationTo(url);
        
    }
    render() {
        let { courseList, listBanner } = this.props;
        let newCourseList = courseList.filter(item => item.displayStatus != 'N');
        const { sortIdx, nowFirstTagId, firstTag , noneData, isNoMoreCourse } = this.state;
        const cls = classnames('scroll-box',{
            'scroll-other': nowFirstTagId != 1
        })
        return (
            <Page title="免费专区" className='free-recommend-container'>
                <div className="free-recommend-menu">
                    <div className="back-home" onClick={() => { locationTo('/wechat/page/recommend') }}>
                        <i className="icon-arrow"></i><span>首页</span>
                    </div>
                    <TwoLevelLabel
                        ref = "twoLevelLabel"
                        firstListInfo = {firstTag}
                        firstLiClassName = "free-low-f-menu-li"
                        firstSectionClassName = "free-low-f-menu-section"
                        firstUlClassName='free-low-f-menu-ul'
                        firstLabelClickFunc = {this.switchFirstTag}
                        nowFirstLabel = {nowFirstTagId}
                        containerClass={classnames('free-low-contain')}
                    />
                </div>
                {/* 排序 */}
                { nowFirstTagId != 1 && <SortStatus  sortIdx={ sortIdx } onSort={ this.onSort } />}
                <ScrollToLoad
                    ref = "scrollToLoad"
                    className={cls}
                    toBottomHeight={500}
                    noneOne={noneData}
                    loadNext={ this.loadMoreCourse }
                    noMore={ isNoMoreCourse }>
                    {/* banner区域 */}
                    { !!listBanner.length && nowFirstTagId == 1 && <HeadBanner banners={listBanner} />}
                    <div className="list-wrap">
                        { newCourseList.map((course,index) => (
                            <CommonCourseItem
                                key={index}
                                className="on-visible on-log"
                                data-log-region={`topic_list_${course.id}`}
                                data-log-pos= { index }
                                data-log-tag_id={nowFirstTagId}
                                data-log-business_id={course.businessId}
                                data-log-name={course.businessName}
                                data-log-business_type={course.type}
                                onClick={e => this.onCourse(course, index)}
                                data={course}
                            />
                        )) }
                    </div>
                </ScrollToLoad>

                {
                    this.state.isShowNewUserGift &&
                    <NewUserGift
                        courseList={this.state.newUserGiftCourseList}
                        onClose={() => this.setState({isShowNewUserGift: false})}
                        expiresDay={this.state.newUserGiftExpiresDay}
                    />
                }
            </Page>
        );
    }
}

function mapStateToProps ({ freeRecommend }) {
    const  { courseList,coursePageSize,coursePageNum,allTags,listBanner } = freeRecommend;
    return {
        courseList: courseList,
        coursePageSize: coursePageSize,
        coursePageNum: coursePageNum,
        twoLevelAllTags: allTags,
        listBanner: listBanner
    }
}

const mapActionToProps = {
    fetchCourseList,
    switchLabelGetCourseList,
    getFreeAllTag,
    getFreeListBanner
};

module.exports = connect(mapStateToProps, mapActionToProps)(FreeRecommend);
