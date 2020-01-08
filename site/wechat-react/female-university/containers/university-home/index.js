const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';
import LiveCourse from '../../components/live-course';
import UniversityIntro from './components/university-intro';
import CollegaList from './components/collega-list';
import LearningCamp from './components/learning-camp';
import ListTopic from './components/list-topic';
import ClassInfo from './components/class-info';
import MustClass from './components/must-class';
import NewCourse from './components/new-course';
import LibraryCourse from './components/library-course';
import Footer from '../../components/footer';
import JoinDialog from '../../components/join-dialog';
import JoinHoc from '../../components/join-dialog/join-hoc';
import PosterCard from './components/poster-card';
import TabBar from 'components/tabbar';
import CardHoc from '../../components/card-hoc';
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils';
import { createPortal } from 'react-dom'
import NoticeCard from '../../components/notice-card'
import FlagBox from './components/flag-box';
import EntryGroup from './components/entry-group';
import GroupCard from '../../components/group-card';
import PortalCom from '../../components/portal-com';
import TopRanking from './components/top-ranking';
import { 
    getMenuNode,
    listChildren,
    listStudyCamp,
    listCurrentCourse,
    getRankList,
    handleRankBg,
    updateCommunity,
    getWithChildren } from '../../actions/home';
import { getSysTime } from '../../actions/common'
import { getRecentLearn, cardInviteBuyUser, delCardInviteBuyUser,  } from '../../actions/family'
import { getCookie } from 'components/util';
import { userBindKaiFang } from "../../../actions/common";
import { examIsJoin } from "../../actions/exam";
import { request } from 'common_actions/common';
import CourseExamDialog from '../../components/course-exam-dialog';
import ShadowLayout from './components/shadow-layout'
import RecentlyStudied from './components/recently-studied'
import TabNav from './components/tab-nav'
import FamilyDialog from './components/family-dialog'
import TipsAnimate from './components/tips-animate'
import ConfigMap from '../../hoc/config-map'

@ConfigMap
@CardHoc()
@JoinHoc
@autobind
class Home extends Component {
    state = {
        isOnce: null,
        universityObj: {},
        academyList: [],
        liveObj: {},
        campObj: [],
        compulsoryObj: {},
        newObj: {},
        booksObj: {},
        campList: [],
        bulletinList: [],
        sysTime: 0,
        allLists: [],
        isShowNotic: false,
        showGroup: this.isGroup,
        showClassInfo: this.isGroup,
        rankList: [],
        rankCourseBg: {},
        rankBookBg: {},
        rankCourseList: [],
        rankBookList: [],
        isMarkCommunity:false,
        isFamilyCard: false,
        iconList: [],
        recentList: [],
        isTips: false,
        isExamJoin: false,
        userList: []
    }
    page = {
        page: 1,
        size: 3,
    }
    get isTab(){
        return getUrlParams("isTab", "")
    }
    get isGroup(){
        const isGroup = typeof document != 'undefined' && getUrlParams("isGroup", "")
        return Object.is(isGroup, 'Y')
    }
  
    componentDidMount() {
        if(!this.props.homeData?.universityObj){
            this.getAll();
            this.initData();
            this.initUniversity();
            this.initXy();
        }else{
            let { allObj, liveObj, academyList, campObj ,newObj , universityObj, rankList, rankObj = {}, iconList  } = this.props.homeData;
            if(!!rankList.length){
                this.getRankTop();
            }
            const rankBg = handleRankBg(rankObj);
            this.setState({
                allLists: allObj || [],
                liveObj: !!liveObj && liveObj[0] || {},
                campObj: campObj && { decs: campObj.keyA, title: campObj.title } || {},
                newObj: newObj && {
                    title: newObj.title,
                    decs: newObj.keyA,
                    lists: newObj.children || [],
                } || {},
                universityObj: (!!universityObj && { unBg: universityObj.keyA,unBadge: universityObj.keyB }) || {},
                academyList: academyList || [],
                sysTime: this.props.sysTime,
                rankList: rankList || [],
                iconList: iconList || [],
                ...rankBg,
            });
        }
        this.handleLocalVisit();
        this.examIsJoin();
        this.getSysTime();
        this.initShow();
        this.initBaseInfo();
        this.bindAppKaiFang();
        this.getMark();
        this.getCommunityMark();
        this.cardInviteBuyUser();
        const tipsAnimate = sessionStorage.getItem('tipsAnimate')
        this.setState({
            isTips: !!tipsAnimate
        })
        if(!tipsAnimate){
            sessionStorage.setItem('tipsAnimate', 'Y')
        }
    }
    componentDidUpdate(nextProps){
        const { userInfo } = nextProps
        if(!!userInfo && !!userInfo.classId){
            this.initShare()
        }
    }
    // 初始化获取数
    async initData(){
        const [liveObj, campObj, newObj] = await Promise.all([
            listChildren({nodeCode:"QL_NZDX_SY_ZB"}),
            getMenuNode({nodeCode:"QL_NZDX_SY_XXY"}),
            getWithChildren({ nodeCode:"QL_NZDX_SY_HK", size:5, page: 1 }),
        ])
        this.setState({
            liveObj: liveObj && !!liveObj.dataList && liveObj.dataList[0] || {},
            campObj: campObj && campObj.menuNode && { decs: campObj.menuNode.keyA, title: campObj.menuNode.title } || {},
            newObj: newObj && newObj.menuNode && {
                title: newObj.menuNode.title,
                decs: newObj.menuNode.keyA,
                lists: newObj.menuNode.children || [],
            } || {},
        })
    }

    // 获取亲友卡带来的购买用户列表
    async cardInviteBuyUser() {
        const { userList } = await cardInviteBuyUser();
        this.setState({
            userList: userList || []
        })
    }

    // 删除亲友卡弹窗
    async delCardInviteBuyUser() {
        try {
            await delCardInviteBuyUser();
        } catch (error) {}
        this.setState({
            userList: []
        })
    }
    // 是否参加测评
    async examIsJoin() {
        const { status } = await examIsJoin({})
        this.setState({
            isExamJoin: status === "Y"
        })
    }
    // 处理包房进度缓存
    async handleLocalVisit() {
        const { courses } = await getRecentLearn({ size: 2, page: 1 });
        if(courses && !!courses.length) {
            let lastVisit = JSON.parse(localStorage.getItem('localLastVisit') || 'null')
            const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || null;
            if(videoPlayHistory) {
                lastVisit = Object.assign((lastVisit || {}), videoPlayHistory)
            }
            let uniList = courses
            if(!!lastVisit) {
                uniList = courses.map((item) => {
                    const course = lastVisit[item.courseId]
                    if(course){
                        item.progress = (!!course.currentTime && !!course.duration) ? (`${ ((course.currentTime / course.duration) * 100).toFixed(1) }%`) : '学习中'
                    }
                    return { ...item}
                });
            }
            this.setState({
                recentList: uniList
            })
        } 
    }
    // 获取热门排行列表
    async getRankTop(){
        const { dataList: courseData } = await getRankList({
            courseType: 'course',
            timeType: 'WEEK'
        })
        const { dataList: bookData } = await getRankList({
            courseType: 'book',
            timeType: 'WEEK'
        })
        this.setState({
            rankCourseList: courseData || [],
            rankBookList: bookData || [],
        })
    }
    async initBaseInfo(){
        const [campListObj, bulletinObj] = await Promise.all([
            listStudyCamp(this.page),
            listCurrentCourse({ page: 1, size: 5 }),
        ])
        this.setState({
            campList: campListObj.dataList || [],
            bulletinList: bulletinObj.dataList || [],
            
        })
    }
    async getAll (){
        const res = await listChildren({nodeCode:"QL_NZDX_SY"});
        this.setState({
            allLists: res.dataList || [],
        })
    }
    async initUniversity(){
        const { menuNode } = await getMenuNode({nodeCode:"QL_NZDX_SY"})
        this.setState({
            universityObj: (!!menuNode && { unBg: menuNode.keyA,unBadge: menuNode.keyB }) || {},
        })
    }
    async initXy(){
        const { dataList = [] } = await listChildren({nodeCode:"QL_NZDX_SY_XY"});
        this.setState({
            academyList: dataList || []
        })
    }

    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }

    // 获取系统时间
    async getSysTime() {
        const { data } = await this.props.getSysTime()
        this.setState({
            sysTime: data.sysTime || new Date().getTime()
        })
    }
    async initShow() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/one/time/mark/getMark',
            method: 'POST',
            body: {
                type:'UNIVERSITY_AUTH_PAGE'
            }
        }).then(res => {
            let show = res?.data?.status;
            this.setState({
                isOnce:show==='N'?true:false
            })
           
		}).catch(err => {
			console.log(err);
        })
        
    }
    initShare() {
        const { userInfo } = this.props
        const params = {
            isTab: "N",
            wcl:'university_share'
        }
        if(userInfo.shareType && !Object.is(userInfo.shareType, "LEVEL_F")){
            params.userId = getCookie("userId")
        }
        let title = '千聊女子大学';
        let desc = '女性无需全能，但有无限可能。加入大学，追寻有能量的人，发现自我能量。';
        let shareUrl = fillParams(params,location.href,['couponCode'])
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl: shareUrl
        });
    }
    showHomeBtn() {
        request({
            url: '/api/wechat/transfer/shortKnowledgeApi/one/time/mark/setMark',
            method: 'POST',
            body: {
                type:'UNIVERSITY_AUTH_PAGE'
            }
        })
        this.setState({
            isOnce: false,
            isShowNotic: true
        })
    }
    goGroupShow() {
        this.setState({
            showGroup: true
        })
    }
    groupHide() {
        this.setMark();
    }
    hideCode(){
        this.setState({
            showGroup: false
        })
    }

    // 获取业务标记
    async getMark() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/one/time/mark/getMark',
            method: 'POST',
            body: {
                type:'UNIVERSITY_CLASS_QRCODE'
            }
        }).then(res => {
            let status = res?.data?.status;
            this.setState({
                showClassInfo:status==='Y'?false:true
            })
           
		}).catch(err => {
			console.log(err);
		})
    }
  
    //社区弹窗状态
    async getCommunityMark(){
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/one/time/mark/getMark',
            method: 'POST',
            body: {
                type:'UNIVERSITY_COMMUNITY'
            }
        }).then(res => {
            let status = res?.data?.status;
            this.setState({
                isMarkCommunity:status==='Y'?false:true
            },()=>{
                this.setTimeMark ()
            })
		}).catch(err => {
			console.log(err);
		})
    }
    // 倒计时
    setTimeMark () {
        if(this.state.isMarkCommunity) {
            setTimeout(() => {
                this.setMark("UNIVERSITY_COMMUNITY")
                this.setState({
                    isMarkCommunity:false
                })
            }, 5000)
        }
    }

    // 设置业务标记
    @throttle(3000)
    async setMark(type) {
        if (!type && !this.state.showClassInfo) {
            return false
        }
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/one/time/mark/setMark',
            method: 'POST',
            body: {
                type: type || 'UNIVERSITY_CLASS_QRCODE'
            }
        }).then(res => {
            let status = res?.data?.status;
            if(type) {
                 this.setState({
                    isMarkCommunity:false
                })
            } else {
                this.setState({
                    showClassInfo:status==='Y'?false:true
                })
            }
		}).catch(err => {
			console.log(err);
		})
    }

    // 关闭通知书
    close() {
        this.setState({
            isShowNotic: false,
        })
    }

    renderPage(){
        const { isOnce, academyList, liveObj, campObj, newObj, campList, bulletinList, recentList,
            rankCourseList, rankBookList, rankCourseBg, rankBookBg, iconList, isTips, isExamJoin,
            sysTime, allLists, isShowNotic, rankList, isMarkCommunity } = this.state;
        const { listTopicData, handleStudyPlan, isAnimite, curId, onAnimationEnd, userInfo = {}, url, ...otherProps  } = this.props;
        if(isOnce){
            return <PosterCard url={ url } isTab={ Object.is(this.isTab, 'Y') } showHomeBtn={ this.showHomeBtn } />
        } else if(Object.is(isOnce, false)) {
            // 绑定非window的滚动层 
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
            return (
                <section className={ `scroll-content-container ${ Object.is(this.isTab, 'Y') ? 'btm' : '' } ${ (isShowNotic || isMarkCommunity) ? 'hides' : '' }` }>
                    <div >
                        <TipsAnimate isTips={ !isTips } sysTime={ sysTime } name={ (userInfo && userInfo.userName) || '' } />
                        <UniversityIntro userInfo={ userInfo } isMarkCommunity={ isMarkCommunity } onAnimationEnd={ onAnimationEnd } isAnimite={ isAnimite } />
                        { allLists.map((item, index) => {
                            if(item.nodeCode === 'QL_NZDX_SY_ZJXX') {
                                return <RecentlyStudied btm={ item.keyF }  key={ index } isExamJoin={ isExamJoin } title={ item.title } recentList={ recentList } />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_XY'){  // 学院
                                return <CollegaList isTitle={ Object.is(item.keyE, 'Y') } btm={ item.keyF } key={ index } academyList={ academyList } />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_ZB'){  // 直播
                                return <LiveCourse isTitle={ Object.is(item.keyE, 'Y') } btm={ item.keyF || 48 } key={ index } sysTime={ sysTime } { ...liveObj } title={item.title} decs={item.keyA} className="un-live-btn"/>
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_QX'){  // 勤学公告
                                return <ClassInfo isTitle={ Object.is(item.keyE, 'Y') } btm={ item.keyF } key={ index } title={ item.title } classId={ userInfo.classId } bulletinList={ bulletinList } />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_FLAG_BG'){ // Flag 活动
                                return <FlagBox isTitle={ Object.is(item.keyE, 'Y') } btm={ item.keyF } key={ index } />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_BX'){ // 必须课
                                return <MustClass 
                                    isTitle={ Object.is(item.keyE, 'Y') }
                                    key={ index }
                                    btm={ item.keyF }
                                    isAnimite={ isAnimite }
                                    curId={ curId }
                                    { ...otherProps }
                                    onAnimationEnd={ onAnimationEnd }
                                    handleStudyPlan={ handleStudyPlan } />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_HK'){ // 最近好课
                                return <NewCourse  isTitle={ Object.is(item.keyE, 'Y') }  key={ index } { ...newObj } 
                                    isAnimite={ isAnimite }
                                    curId={ curId }
                                    btm={ item.keyF }
                                    { ...otherProps }
                                    onAnimationEnd={ onAnimationEnd }
                                    handleStudyPlan={ handleStudyPlan}/>
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_TS'){ // 图书馆
                                return  <LibraryCourse
                                    isTitle={ Object.is(item.keyE, 'Y') }
                                    key={ index }
                                    btm={ item.keyF }
                                    isAnimite={ isAnimite }
                                    curId={ curId }
                                    { ...otherProps }
                                    onAnimationEnd={ onAnimationEnd }
                                    handleStudyPlan={ handleStudyPlan} />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_XXY'){ // 学习营
                                return <LearningCamp isTitle={ Object.is(item.keyE, 'Y') } btm={ item.keyF } key={ index } { ...campObj } campList={ campList } sysTime={sysTime}/>
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_RMHT'){ // 热门话题
                                return <ListTopic 
                                        isTitle={ Object.is(item.keyE, 'Y') }  
                                        key={ index } 
                                        btm={ item.keyF }
                                        title={ item.title }
                                        decs={ item.keyA } 
                                        listTopicData={ listTopicData } />
                            }
                            if(item.nodeCode === 'QL_NZDX_SY_RANK'){// 排行榜
                                return <TopRanking 
                                    isTitle={ Object.is(item.keyE, 'Y') }
                                    key={ index }
                                    btm={ item.keyF }
                                    title={ item.title }
                                    decs={ item.keyA }
                                    rankList={ rankList } 
                                    rankCourseList={ rankCourseList } 
                                    rankCourseBg={ rankCourseBg }
                                    rankBookBg={ rankBookBg }
                                    rankBookList={ rankBookList } />
                            }
                            if(item.nodeCode == 'QL_NZDX_SY_ICON' && !!iconList.length) { // 功能icon区
                                return <TabNav btm={ item.keyF } key={ index } iconList={ iconList } />
                            }
                        }) }
                        <Footer className="un-home-top" />
                    </div>
                </section>
            )
        }
    }
    render(){
        const { isShowDialog, close, joinPlan, userInfo, configInfo } = this.props;
        const { showGroup, isOnce, isShowNotic, isMarkCommunity, showClassInfo, userList } = this.state
        return (
            <Page title="千聊女子大学" className={`un-home-box ${isShowDialog ? 'pointer-events-none':''}`}>
                {this.renderPage()}
                {
                    typeof document != 'undefined' && createPortal(
                        <JoinDialog 
                            isShowDialog={ isShowDialog } 
                            close={ close } 
                            joinPlan={joinPlan} />,
                            document.getElementById('app')
                        ) 
                }
                { typeof document != 'undefined' &&  <NoticeCard className={ Object.is(this.isTab, 'Y') ? 'btm' : '' } isShow={ isShowNotic } close={ this.close } /> }
               
                { 
                    typeof document != 'undefined' && Object.is(this.isTab, 'Y') && (
                    <TabBar  
                        activeTab='university'
                        isMineNew={false}
                        isMineNewSession={"N"} />) 
                }
                { typeof document != 'undefined' && userInfo.classId && showGroup && !isOnce && !isShowNotic &&
                    <PortalCom className="un-code-dialog">
                        <div className="un-code-show">
                            <span onClick={ this.hideCode }></span>
                            <GroupCard classId={ userInfo.classId } groupHide={this.groupHide} />
                        </div>
                    </PortalCom>
                } 
                {
                    typeof document != 'undefined' && !isShowNotic && createPortal(
                        <CourseExamDialog  nodeCode={"QL_PAGE_NZDX_SY"} region="un-home-exam-dialog"/>,
                            document.getElementById('app')
                        ) 
                }
                { typeof document != 'undefined' && isMarkCommunity && <ShadowLayout onClick={ () => {
                    this.setMark("UNIVERSITY_COMMUNITY");
                } } /> }

                { typeof document != 'undefined' && showClassInfo && <EntryGroup className={  Object.is(this.isTab, 'Y') ? 'btm' : '' } goGroupShow={ this.goGroupShow } groupHide={ this.groupHide } /> }
                { typeof document != 'undefined' && !!userList.length && <FamilyDialog expireTime={ userInfo.expireTime } month={ configInfo.UFW_CARD_INVITER_ADD_MONTH || 0 } userList={ userList } onFamilyClose={ this.delCardInviteBuyUser } /> }
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sysTime: state.common.sysTime,
        homeData: state.home.homeData,
        listTopicData:state.home.homeData.listTopicData
    }
};

const mapActionToProps = {
    getSysTime,
    userBindKaiFang,
    updateCommunity
};

module.exports = connect(mapStateToProps, mapActionToProps)(Home);