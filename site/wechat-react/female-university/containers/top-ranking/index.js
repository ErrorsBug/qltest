import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import TopHead from './components/top-head';
import ScrollToLoad from 'components/scrollToLoad';
import CourseItem from '../../components/course-item';
import BooksItem from '../../components/books-item';
import NavTab from './components/nav-tab'
import RollingDownNav from 'components/rolling-down-nav'
import { getUrlParams } from 'components/url-utils';
import { getRankList, getMenuMapNode, handleRankBg, addStudentCourseBatch, listChildren } from '../../actions/home'
import UserHoc from '../../components/user-hoc'
import JoinHoc from '../../components/join-dialog/join-hoc';
import JoinDialog from '../../components/join-dialog';
import { createPortal } from 'react-dom'
import { locationTo } from 'components/util'

@UserHoc
@JoinHoc
@autobind
class TopRanking extends Component {
    state = {
        isNoMore: false,
        selectIdx: 0,
        dataList: [],
        rankBg: {},
        isAllJoin: false,
        isBtnJoin: false,
        title: ''
    }
    // 未加入的userId
    unJoinList = []
    // 获取热门排行类型
    get topType (){
        return getUrlParams('rankStatus')
    }
    componentDidMount() {
        this.getRankNodeInfo();
        this.initData();
        this.getMenuMapNode();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('tr-scroll-box');
        typeof _qla != 'undefined' && _qla.bindBrowseScroll('tr-scroll-box');
    }
    // 获取热门图书和课程排行背景信息
    async getMenuMapNode() {
        const res = await getMenuMapNode({ nodeCodeList: ["QL_NZDX_SY_RANK_COURSE_BG", 'QL_NZDX_SY_RANK_BOOK_BG'] });
        const rankBg = handleRankBg(res);
        this.setState({
            rankBg: Object.is(this.topType, 'course') ? rankBg.rankCourseBg : rankBg.rankBookBg
        })
    }
    // 初始化获取数据
    async initData(isAll){
        const { dataList } = await getRankList({
            courseType: this.topType,
            timeType: isAll ? 'ALL' : 'WEEK'
        })
        let arr = dataList || [];
        const isAllJoin = arr.findIndex((item) => !Object.is(item.isJoin, 'Y'));
        arr.forEach((item) => {
            const courId = item.topicId || item.channelId || item.courseId;
            !Object.is(item.isJoin, 'Y') && this.unJoinList.push({ businessId: courId, businessType: item.courseType });
        });
        this.setState({
            dataList: arr,
            isAllJoin: !!arr.length && isAllJoin <= -1
        })
    }
    // 获取排行榜节点信息
    async getRankNodeInfo() {
        const nodeCode = Object.is(this.topType, 'course') ? 'QL_NZDX_SY_RANK_COURSE_BG' : 'QL_NZDX_SY_RANK_BOOK_BG';
        const { dataList } = await listChildren({ nodeCode:"QL_NZDX_SY_RANK" })
        if(dataList && !!dataList.length){
            const idx = dataList.findIndex((item) => Object.is(item.nodeCode, nodeCode))
            this.setState({
                title: dataList[idx].title
            })
        }
    }
    // 切换排行数据
    changeSwitch(idx) {
        this.setState({
            selectIdx: idx,
            // isAllJoin: false
        }, () => {
            this.unJoinList = [];
            this.initData(idx === 1);
        })
    }
    // 加入课单
    async handleStudyPlan(courId, type, isJoin, isHome){
        await this.props.handleStudyPlan(courId, type, isJoin, isHome)
        this.unJoinList = this.unJoinList.filter((item) => !Object.is(item.businessId, courId))
        if(!this.unJoinList.length){
            this.setState({isAllJoin: true})
        }
    }
    // 一键加入按钮
    async addJoinCourse(){
        const { isAllJoin, dataList } = this.state;
        if(isAllJoin){
            locationTo('/wechat/page/university/my-course-list');
            return false;
        }
        if(!this.unJoinList.length) return false;
        const res = await addStudentCourseBatch({
            courseList: this.unJoinList
        })
        if(res){
            dataList.map((item) => {
                item.isJoin = "Y"
                return item
            })
            this.unJoinList = [];
            this.setState({
                isAllJoin: true,
                dataList: dataList,
                isBtnJoin: true
            })
        } else {
            window.toast("加入课表失败")
        }
    }
    renderResult() {
        const { dataList, selectIdx } = this.state;
        const { isShowDialog, close, joinPlan, handleStudyPlan, ...otherProps } = this.props;
        if(Object.is(this.topType, 'course')){
            const courses = dataList.map((item, index) => (
                <CourseItem
                    key={ index } 
                    { ...item } 
                    idx={ index }
                    isShowCate
                    isShowRank
                    resize={{ w: 160, h: 202 }}
                    handleStudyPlan={ this.handleStudyPlan }
                    className="tr-top-item"
                    { ...otherProps } />
            ))
            return courses
        } else if(Object.is(this.topType, 'book')) {
            return <BooksItem 
                    lists={ dataList } 
                    handleStudyPlan={ this.handleStudyPlan }
                    isOne 
                    isHideNum 
                    selectIdx={ selectIdx }
                    isShowRank
                    { ...otherProps } />
        }
    }
    render(){
        const { isNoMore, selectIdx, rankBg, isAllJoin, isBtnJoin, title } = this.state;
        const { isShowDialog, close, joinPlan } = this.props;
        return (
            <Page title={ title } className="tr-top-box">
                <section className="tr-scroll-box" style={{ background: rankBg.keyB }}>
                    <TopHead headImg={ rankBg.keyA } title={ title } />
                    <div className="tr-top-content" style={{ background: rankBg.keyB }}>
                        <RollingDownNav 
                            style={{ background: rankBg.keyB }}
                            scrollNode="tr-scroll-box"
                            innerClass="tr-nav-inner"
                            outerClass="tr-nav-box" >
                            <NavTab 
                                idx={selectIdx} 
                                type={ this.topType }
                                addJoinCourse={ this.addJoinCourse }
                                isAllJoin={ isAllJoin } 
                                isBtnJoin={ isBtnJoin }
                                changeSwitch={ this.changeSwitch } />
                        </RollingDownNav>
                        <div className="tr-top-conts">{ this.renderResult() }</div>
                    </div>
                </section>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(TopRanking);