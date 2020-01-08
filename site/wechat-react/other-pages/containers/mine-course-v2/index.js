import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames'

import Page from 'components/page';
import TabBar from 'components/tabbar';
import ScrollToLoad from 'components/scrollToLoad';
import BottomDialog from 'components/dialog/bottom-dialog';
import GuestYouLike from 'components/guest-you-like';
import NewUserGift, { getNewUserGiftData } from 'components/new-user-gift';
import EmptyPage from 'components/empty-page';
import Picture from 'ql-react-picture';
import BooksItem from 'components/books-item'
import LearningRecord from '../../components/learning-record'

import { purchaseCourse, planCourse, recentCourse, courseAlert, liveOnList, learnInfo } from '../../actions/mine';
import QfuEnterBar from 'components/qfu-enter-bar'

import { getVal, locationTo, formatDate, dateJudge, formatMoney,getAudioTimeShow,digitFormat } from 'components/util';
import { fillParams } from 'components/url-utils';
import { getCourseList } from '../../actions/channel' 
import {
    fetchIsMineNew,
    viewMore,
    userBindKaiFang,
    myCourseAd,
    buyCampList,
} from '../../actions/recommend';
import { parse } from "querystring";

import {
    getQlchatSubscribeStatus,
    getQlchatQrcode,
    getUserInfo,
    api
} from '../../actions/common';

import {
    fetchMemberInfo
} from '../../actions/member'
import { request } from 'common_actions/common';

import {getLearnEverydayNewData} from '../../actions/live';
import { get } from 'lodash';
import { showPhonAuthGuide } from 'components/phone-auth';
import CampAd from 'components/camp-ad'
import CampItem from './components/camp-item'
import CampRecommend from './components/camp-recommend'
import HorizontalScrolling from 'components/horizontal-scrolling'
import { judgeShowPhoneAuthGuide } from 'components/phone-auth/index';

const tabList = [
    {
        value: '订阅',
        href: '/wechat/page/learn-everyday?wcl=lc_course_dailylearning&f=course',
        region: 'tag-menu',
        pos: 'subscribe',
    },
    {
        value: '最近学习',
        href: '/wechat/page/mine/course?activeTag=recent',
        region: 'tag-menu',
        pos: 'recent',
    },
    {
        value: '已购课程',
        href: '/wechat/page/mine/course?activeTag=purchased',
        region: 'tag-menu',
        pos: 'purchased',
    },
    {
        value: '我的体验营',
        href: '/wechat/page/mine/course?activeTag=ufwCamp',
        region: 'tag-menu',
        pos: 'ufwCamp',
    },
    {
        value: '我的听书',
        href: '/wechat/page/mine/course?activeTag=books',
        region: 'tag-menu',
        pos: 'books',
    },
]

@autobind
class MineCourse extends Component {

    data = {
        pageSize: 20,
        unit: {
            s: 1,
            m: 60,
            h: 60 * 60,
            d: 60 * 60 * 24,
            week: 60 * 60 * 24 * 7
        },
        timer: null,
        progressList: {},
        channelRecord: {},
        growAssignments: undefined // 成长任务列表
    }

    state = {
        // 个人中心定制课程小红点状态
        isMineNewSession: "N",

        // recent(最近学习) purchased（已购课程） 
        activeTag: this.props.location.query.activeTag || 'recent',

        // recent(最近学习列表)
        chosnHomeworkList: [],
        showHomeworkDialog: false,

        recentList: [
            // {
            //     id: "2000000352308292",
            //     topic: "国民穿搭导师：教你穿出优势，用美赢得机会",
            //     backgroundUrl: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg@296h_480w_1e_1c_2o",
            //     lastLearnTime: new Date('2018/06/05').getTime(),
            //     endRate: 33,
            //     homeworks: [
            //         {
            //             id: "1111111",
            //             title: "这是第一份作业"
            //         },
            //         {
            //             id: "1111111",
            //             title: "这是第二份作业"
            //         },
            //     ]
            // },
        ],
        recentPage: 1,
        recentNoMore: false,

        // purchased（已购课程）
        purchasedList: [
            // {
            //     bussinessId: "222222cc222",
            //     type: "名字很长的系列课",
            //     title: "channel",
            //     pic: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg@296h_480w_1e_1c_2o",
            //     money: "22",
            //     time: "1511745720000",
            //     learningCount: "22",
            //     topicCount: "22",
            //     hasFile: true,
            // },
        ],
        purchasedPage: 1,
        purchasedNoMore: false,


        // 推荐列表 (免费专区)
        recommendFreeList: [],
        recommendFreePage: 1,
        recommendFreeNoMore: false,

        // 推荐列表 (低价专区)
        recommendLowList: [],
        recommendLowPage: 1,
        recommendLowNoMore: false,

		showQlchatAds: false,
		isFocusThree: false,
		isFocusQlchat: false,
		threeQrcode: '', // 三方二维码
        qlchatQrcode: '', // 官方二维码

        isShowNewUserGift: false,
        isHaveNewDataInLearnEveryday: 'N' , //每天学是否有最新信息
        knowLists: [],
        learnInfo: {
            learnTotalTime: 0,
            todayLearnTime: 0,
            notFinishCount: 0
        },
        growAssignmentTexts: undefined,
        campList: [],
        noPurchasedData: false,
        campAdObj: {},
        tabIdx: ''
    }

    async componentDidMount() {
        const idx = tabList.findIndex((item) => Object.is(item.pos,  this.state.activeTag))
        console.log(idx, 'idx=======')
        this.setState({
            tabIdx: idx
        })
        this.getCampAd();
        this.windowPopStateHandle()

        // 小红点标识状态相关
        this.initIsMineNew();
        this.initIsMineNewSession();
        // 初始化进度
        this.initProgress()

        // 缓存读取 数据列表
        this.initDataList()

        if(Object.is(this.state.activeTag, 'ufwCamp')) {
            this.buyCampList();
        } else {
            this.loadRecent()
            this.loadPurchased()
            this.getKnowBook();
        }

        this.isHaveNewDataInLearnEveryday()

        await this.props.getUserInfo(undefined, undefined, {_: Math.random()}); // random避免从二级页面返回读缓存

        // 初始化手机绑定弹窗
        this.initShowPhoneBinding();

        // this.getLearnInfo();

        // 关闭直播中状态显示
        // this.loadLiveOn()

        this.setTraceSession()
        this.props.fetchMemberInfo()

        // this.initFocusAds();

        getNewUserGiftData().then(res => this.setState(res));

        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);

        const kfAppId = this.props.location.query.kfAppId;
        const kfOpenId = this.props.location.query.kfOpenId;
        if (kfAppId && kfOpenId) {
            request.post({
                url: '/api/wechat/live/userBindKaiFang',
                body: {
                    kfAppId, kfOpenId
                }
            }).catch(err => {})
        }

    }

    componentDidUpdate () {
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.location.query.activeTag !== this.props.location.query.activeTag){
            if(Object.is(this.state.activeTag, 'ufwCamp')) {
                this.buyCampList();
            } else {
                this.loadPurchased();
            }
            this.getCampAd();
        }
    }

	// 初始化绑定手机号弹窗
	initShowPhoneBinding = () => {
        const { mobile } = this.props.userInfo || {};
        // 绑定手机号提示（据留资2.0需求更改，条件设为：当用户手机号为空且tab在“我的课程”和“个人中心”之间的总切换次数每满5次之时显示）
        if (!mobile && judgeShowPhoneAuthGuide()) {
            showPhonAuthGuide().then(res => {
                if (res) locationTo('/wechat/page/phone-auth');
            })
        }
	}

    // 获取知识小课数据
    async getKnowBook(){
        try {
            const res = await api({
                url: '/api/wechat/know/book',
                method: 'POST',
                body: {
                    page:  1,
                    size:  20,
                }
            });
            this.setState({
                knowLists: (res.data && res.data.dataList) || []
            })
        } catch (error) {
            console.log(error);
        }
    }

    isHaveNewDataInLearnEveryday = async() => {
        let isHaveNewDataInLearnEveryday = await getLearnEverydayNewData()
        this.setState({isHaveNewDataInLearnEveryday})
    }
    

    initDataList () {
        const sysTime = this.props.sysTime
        const recentList = JSON.parse(localStorage.getItem('recent-list')) || []
        let params = {}

        if (recentList.length > 0) {
            recentList.map((item) => item.timeDiff = this.timeDiffConver(sysTime, item.lastLearnTime))
            params.recentList = recentList
        }

        // if (purchasedList.length > 0) {
        //     params.purchasedList = purchasedList
        // }

        this.setState(params)
    }

    initProgress () {
        let progress = localStorage.getItem('coursePercentageCompleteRecord')
        let channelRecord = localStorage.getItem('lastTopicInChannelVisitRecord')
        this.data.progressList = progress ? JSON.parse(progress) : {}
        this.data.channelRecord = channelRecord ? JSON.parse(channelRecord) : {}
    }

    setTraceSession() {
        let query = parse(location.search.slice(1));
        if (query.activeTag != 'books') {
            typeof window.sessionStorage != 'undefined' && sessionStorage.removeItem('trace_page');
            return 
        }
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', "mine-course");
    }

    // 时间差转化
    timeDiffConver (nowTime, lastTime) {
        if (!nowTime || !lastTime) {
            return ''
        }
        const unit = this.data.unit
        let now = new Date(nowTime)
        let last = new Date(lastTime)

        // 是否一个月
        const newTime = new Date(nowTime)
        newTime.setMonth(newTime.getMonth() - 1)

        if (newTime.getTime() >= last.getTime()) {
            return {
                isSevenDay: true,
                str: formatDate(last, 'yyyy-MM-dd')
            }
        }

        const diff = Math.floor((now.getTime() - last.getTime()) / 1000)
        
        if (diff >= unit.week) {
            return {
                isSevenDay: true,
                str: `${Math.floor(diff / unit.week)}周前`
            }
        } else if (diff >= unit.d) {
            const d = Math.floor(diff / unit.d)
            return {
                isSevenDay: d >= 7,
                str: `${d}天前`
            }
        } else if (diff >= unit.h) {
            return {
                isSevenDay: false,
                str: `${Math.floor(diff / unit.h)}小时前`
            }
        } else {
            return {
                isSevenDay: false,
                str: `${Math.floor(diff / unit.m)}分钟前`
            }
        }
    }

    // 加载最近学习列表
    loadRecent = async (next) => {
        let {
            recentList,
            recentPage,
            recentNoMore
        } = this.state
        let resultList = []
        let state = {}

        if (!recentNoMore) {
            let time = 0
            if(this.state.recentList.length > 0 && recentPage !== 1) {
                time = this.state.recentList[this.state.recentList.length - 1].lastLearnTime
            }
    
            const result = await this.props.recentCourse({
                pageSize: 20,
                time: time,
                beforeOrAfter: "before"
            }, recentPage !== 1)
    
            const dataList = recentPage !== 1 ? [...this.state.recentList] : []
            if(result && result.data && result.data.learningList && result.data.learningList.length > 0) {
                resultList = result.data.learningList
            }

            const nowTime = result.data && result.data.time

            resultList.map((item) => {
                item.timeDiff = this.timeDiffConver(nowTime, item.lastLearnTime)
                dataList.push(item)
            })

            if (recentPage === 1 && dataList.length > 0) {
                localStorage.setItem('recent-list', JSON.stringify(dataList))
            }

            state = {
                recentPage: this.state.recentPage + 1,
                recentList: dataList,
                recentNoMore: resultList.length < this.data.pageSize,
            }
    
            recentNoMore = true
        }

        // 当没有最近学习列表时 加载推荐列表
        if (recentList.length === 0 && resultList.length === 0 && recentNoMore) {
            const result = await this.props.viewMore({
                page: {
                    page: this.state.recommendFreePage, 
                    size: this.data.pageSize
                },
                regionCode: 'mfzq',
	            twUserTag: this.props.location.query.twUserTag || '',
            })

            const dataList = [...this.state.recommendFreeList]
            if(result && result.data && result.data.dataList && result.data.dataList.length > 0) {
                resultList = result.data.dataList
            }
    
            resultList.map((item) => {
                dataList.push(item)
            })
            state = {
                recommendFreeList: dataList,
                recommendFreePage: this.state.recommendFreePage + 1,
                recommendFreeNoMore: resultList.length < this.data.pageSize,
	            noRecentData: true,
            }
    
        }
        this.setState(state, () => {
            next && next();
        });
    }

    // 加载已购课程列表
    loadPurchased = async (next) => {
        let {
            purchasedList,
            purchasedPage,
            purchasedNoMore
        } = this.state
        let resultList = []
        let state = {}
        if(!purchasedNoMore &&Object.is(this.state.activeTag,'ufwCamp')){
            this.buyCampList(next);
            return false
        }
        if (!purchasedNoMore) {
            const parmas = {
                page: {
                    page : this.state.purchasedPage,
                    size : this.data.pageSize,
                }
            }
            if(Object.is(this.state.activeTag,'books')){
                parmas.purchaseTypeList = ['book']
            }
            const result = await this.props.purchaseCourse(parmas, purchasedPage !== 1)

            const dataList = purchasedPage !== 1 ? [...this.state.purchasedList] : []
            if(result && result.data && result.data.list && result.data.list.length > 0) {
                resultList = result.data.list
            }

            resultList.map((item) => {
                dataList.push(item)
            })

            if (purchasedPage === 1 && dataList.length > 0) {
                localStorage.setItem('purchased-list', JSON.stringify(dataList))
            }
            state = {
                purchasedPage: this.state.purchasedPage + 1,
                purchasedList: dataList,
                purchasedNoMore: resultList.length < this.data.pageSize,
            }
            purchasedNoMore = true
        }

        // 当没有已购列表时 加载推荐列表
        if (purchasedList.length === 0 && resultList.length === 0 && purchasedNoMore) {
            const result = await this.props.viewMore({
                page: {
                    page: this.state.recommendLowPage, 
                    size: this.data.pageSize
                },
                regionCode: 'dijia',
	            twUserTag: this.props.location.query.twUserTag || '',
            })
            
            const dataList = [...this.state.recommendLowList];
            if(result && result.data && result.data.dataList && result.data.dataList.length > 0) {
                resultList = result.data.dataList
            }
    
            resultList.map((item) => {
                dataList.push(item)
            })
            
            state = {
                recommendLowList: dataList,
                recommendLowPage: this.state.recommendLowPage + 1,
                recommendLowNoMore: resultList.length < this.data.pageSize,
	            noPurchasedData: true,
            }
    
        } 
        this.setState(state, () => {
            next && next();
        });
    }


    tagHandle = () => {
        const activeTag = this.props.location.query.activeTag
        console.log(activeTag, 'activeTag=============')
        this.setState({
            activeTag: activeTag,
        })
    }

    windowPopStateHandle = () => {

        if(this.props.location.query.activeTag) {
            this.setState({
                activeTag: this.props.location.query.activeTag
            })
        }

        window.addEventListener('popstate', this.tagHandle);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.tagHandle);
    }

    tagClickHandle = (tabIdx) => {
        if(!tabIdx && tabIdx != 0) return false
        const key = tabList[tabIdx].pos
        const url = tabList[tabIdx].href
        if(Object.is(this.state.activeTag,key)) return false;
        if(Object.is(key, 'subscribe')) {
            this.props.router.push(url)
            return false
        }
        this.setState({
            activeTag: key,
            purchasedPage: 1,
            purchasedList: [],
            purchasedNoMore: false,
            noPurchasedData: false,
            campList: [],
            tabIdx: tabIdx
        },() => {
            this.props.router.push(url)
            this.setTraceSession();
        })

        if (typeof _qla != 'undefined') {
            _qla('pv', {});
        }
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    // 获取课程广告位
    getCampAd = async () => {
        const { activeTag } = this.state
        let params = {
            type: ''
        }
        if(Object.is(activeTag, 'recent')) {
            params.type = 'study'
        }
        if(Object.is(activeTag, 'purchased')) {
            params.type = 'course'
        }
        if(Object.is(activeTag, 'ufwCamp')) {
            params.type = 'camp'
        }
        if(Object.is(activeTag, 'books')) {
            params.type = 'book'
        }
        const res = await myCourseAd(params)
        this.setState({
            campAdObj: res || {}
        })
    }

    // 获取已购体验营
    buyCampList = async (next) => {
        const { dataList } = await buyCampList({ page : this.state.purchasedPage, size : this.data.pageSize })
        const list = dataList || []
        if(list.length >0 && list.length < this.data.pageSize){
            this.setState({
                purchasedNoMore: true,
            })
        } 
        const newList = [...this.state.campList, ...list]
        this.setState({
            purchasedPage: this.state.purchasedPage + 1,
            campList: newList,
            noPurchasedData: !newList.length,
        }, () => {
            next && next();
        })
    }

    recentListHomeworkHandle = (homeWorkList) => {
        if(homeWorkList && homeWorkList.length == 1) {
            locationTo("/wechat/page/homework/details?id=" + homeWorkList[0].id)
            return 
        }

        const dataList = []
        homeWorkList.map((item, index) => {
            dataList.push({
                key: item.id,
                content: item.title,
                show: true,
            })
        })

        this.setState({
            chosnHomeworkList: dataList,
            showHomeworkDialog: true,
        })
    }

    goToTopicDetails = (e, item) => {
        if(e.target.className != "homeWork" && !Object.is(item.isBook, 'Y')) {
            locationTo(`/topic/details?topicId=${item.id}`)
        } else {
            locationTo(`/wechat/page/topic-intro?topicId=${item.id}`)
        }
    }
    goToTopicIntro = (e, item) => {
        locationTo(`/wechat/page/topic-intro?topicId=${item.id}`)
    }

    goToCourse = async (e, item) => {
        let url = ''

        if(item.type === 'channel'){
            url = `/wechat/page/channel-intro?channelId=${item.bussinessId}${item.isNewCamp === 'Y' ? '&channelType=camp' : ''}`
        } else if(item.type === 'topic'){
            url = `/wechat/page/topic-intro-cend-auth?topicId=${item.bussinessId}`
        } else if(item.url){
            typeof _qla != 'undefined' && _qla('click', {
                region:'know-more',
            });
            url = item.url;
        }
        locationTo(url);
    }

    goToCourseIntro = async (e, item, wcl) => {
        let url;
        
        if (item.url) {
            url = item.url;
            if (wcl) {
                url = fillParams({wcl},url)
            }
			locationTo(url);
			return;
		}

		if(item.businessType === 'channel'){
			url = `/live/channel/channelPage/${item.businessId}.htm?wcl=${wcl}`;
		}else if(item.style === 'normal' || item.style === 'ppt'){
			url = `/topic/details?topicId=${item.businessId}&wcl=${wcl}`
		}else{
			url = `/topic/details-video?topicId=${item.businessId}&wcl=${wcl}`;
		}
		locationTo(url);
    }


    /**
     * 跳转去群岛图书馆
     */
    gotoLibrary = (e) => {
        const ch = e.currentTarget.dataset.ch;
        locationTo(`https://smartislands.dachensky.com/library/recommend?ch=${ch}`);
    }

    renderPurchaseSuffix(item) {
        const isLearning = item.playRate > 0 && item.playRate < 100;
        if(item.playRate === undefined || item.playRate === null || item.playRate === 0) {
            return (
                <div className={["progress", isLearning ? "learning" : null].join(' ')}>
                    <div className="progress-status-wrap">
                        <span className="progress-status">已学{item.playRate || 0}%</span>
                        <div className="progress-desc">
                            <div 
                                className="opt-btn start-study on-log on-visible"
                                data-log-region="purchased"
                                data-log-pos="start"
                            >开始学习<i className="arrow-white"></i></div>
                        </div> 
                    </div>

                </div>
            );
        } else if(item.playRate > 0 && item.playRate < 100) {
            return (
                <div className={["progress", isLearning ? "learning" : null].join(' ')}>
                    <div className="progress-status-wrap">
                        <span className="progress-status">已学{item.playRate || 0}%</span>
                        
                    </div>
                    <div className="progress-bar">
                        <span className="current-progress" style={{'width': `${item.playRate}%`}}></span>
                    </div>
                </div>
            );
        } else if (item.playRate === 100) {
            return <div className={["progress", isLearning ? "learning" : null].join(' ')}>
                    <div className="progress-status-wrap">
                        <span className="progress-status">已学{item.playRate || 0}%</span>
                        
                    </div>
                    <div className="progress-desc">
                        <div 
                            className="opt-btn invite-friend" 
                            onClick={e => {e.stopPropagation();locationTo(`/wechat/page/sharecard?type=${item.type}&${item.type}Id=${item.bussinessId}&liveId=${item.liveId}&lshareKey=&sourceNo=`)}}
                            data-log-region="purchased"
                            data-log-pos="share"
                        ><i className="icon-wechat"></i>邀请好友学</div>
                    </div> 
                </div>
        }
    }

    renderEmpty = (desc, code) => {
        return (
            <Fragment>
                {
	                code === 'recent' && !!this.state.recommendFreeList.length &&
                    <ScrollToLoad
                        className={"recommend-list co-scroll-to-load " + (this.state.showQlchatAds ? "more-top": "")}
                        loadNext={this.loadRecent}
                        noMore={this.state.recommendFreeNoMore}
                    >
                        <div className="gradient-bg">
                        {/* <MemberEntry 
                            className="on-visible on-log" 
                            data-log-region="member-entry"
                            data-log-pos="recent"
                            data-log-name="会员入口" 
                            memberInfo={this.props.memberInfo} 
                        /> */}

                        <EmptyPage mini className="empty-portal" imgKey="noCourse" emptyMessage={desc} />
                        <QfuEnterBar
                            activeTag={this.state.activeTag}
                        />
                        {  this.state.campAdObj.nodeCode && <CampAd isNoData={ true } {...this.state.campAdObj}  />}
                        {/* 推荐列表 */}
                        {
                            this.renderRecommendList('recommendFreeList')
                        }
                        </div>
                        

                    </ScrollToLoad>
                }
                {
	                (code === 'purchased' || code === 'books' || code === 'ufwCamp') && (!!this.state.recommendLowList.length || !this.state.campList.length) &&
                    <ScrollToLoad
                        className={"recommend-list co-scroll-to-load " + (this.state.showQlchatAds ? "more-top": "")}
                        loadNext={this.loadPurchased}
                        noMore={(this.state.recommendLowNoMore && !!this.state.purchasedList.length) || code === 'ufwCamp' || code === 'books'}
                    >
                        <div className="gradient-bg">
                            {/* {
                                code === 'purchased' && 
                                <MemberEntry 
                                    className="on-visible on-log" 
                                    data-log-region="member-entry"
                                    data-log-pos="purchased"
                                    data-log-name="会员入口" 
                                    memberInfo={this.props.memberInfo} 
                                />
                            } */}
                            
                            <EmptyPage mini={(code === 'purchased' || code === 'books' || code === 'ufwCamp')} className="empty-portal"  imgKey={(code === 'purchased' || code === 'books' || code === 'ufwCamp') ? 'noCourse' : 'noContent'} emptyMessage={desc} />
                            <QfuEnterBar
                                activeTag={this.state.activeTag}
                            />
                            { code !== 'ufwCamp' && this.state.campAdObj.nodeCode && <CampAd isNoData={ true } {...this.state.campAdObj}  />}
                            {/* 推荐列表 */}
                            {
                                code === 'purchased' && this.renderRecommendList('recommendLowList')
                            }
                            { this.state.campAdObj.nodeCode && code === 'ufwCamp' && (
                                <div className="camp-recommend-data">
                                    <h4>推荐体验营</h4>
                                    <CampRecommend { ...this.state.campAdObj } />
                                </div>
                            ) }
                        </div>

                    </ScrollToLoad>
                }
            </Fragment>
        );
    };

    priceOrDiscount (item) {
        let { money, discount } = item

        if (money === 0) {
            return <p className="discount">免费</p>
        }

        if (discount < 0) {
            return <p className="discount">￥{ formatMoney(money) }</p>
        }

        return (
            <p className="discount"><span className="original">￥{formatMoney(money)}</span>{ discount > 0 ? '￥' + formatMoney(discount) : (discount === 0 ? '免费' : '') }</p>
        )
    }

    renderRecommendList = (list) => {
        let wcl = list === 'recommendLowList' ? 'promotion_purchased-null' : 'promotion_recent-null';
        return this.state[list] && this.state[list].length > 0 && (
            <div className={ `recommend-list ${ list === 'recommendLowList' ? '' : 'promotion_recent-null' }` }>
                <p className="recommend-title">为你推荐</p>
                {
                    this.state[list].map((item, index) =>  (
                            <div className="recommend-item on-visible on-log" key={`recommend-item-${index}`} 
                                 data-log-course-id={item.id}
                                 data-log-region="recommend-list"
                                 data-log-pos={list}
                                 data-log-name="推荐列表"
                                 data-log-index={index}
                                 onClick={(e) => { this.goToCourseIntro(e, item, wcl) }}>
                            <div className="img-box">
                                <img className="headImg" src={`${item.logo}@296h_480w_1e_1c_2o`} alt=""/>
                                <p className="img-desc">{item.learningNum >= 10000 ? (item.learningNum / 10000).toFixed(1) + "万" : item.learningNum}次学习</p>
                            </div>
                            <div className="info">
                                <div className="title">{item.businessName}</div>
                                <p className="name">{item.remark || item.liveName}</p>
                                <div className="desc">
                                    <p>{item.businessType === 'channel' ? item.topicCount + '课' : '单次课'}</p>
                                    {
                                        this.priceOrDiscount(item)
                                    }
                                </div>
                            </div>
                            </div>
                        )
                    )
                }
            </div>
        )
    }


    async toEval (e, item) {
        e.stopPropagation();
        e.preventDefault();
        if (!this.props.userInfo.userId) {
            await this.props.getUserInfo();
        }

        if (this.props.userInfo.isBind === 'N') {
            if (await showPhonAuthGuide()) {
                locationTo(`/wechat/page/phone-auth?redirect=${encodeURIComponent(`/wechat/page/evaluation-create/${item.id}`)}`)
            }
            return;
        }

        locationTo(`/wechat/page/evaluation-create/${item.id}`)
    }

    // 去往知识小课
    goKnow(id){
        typeof _qla != 'undefined' && _qla('click', {
            region:'know-more',
        });
        if(id){
            locationTo(`https://kids.nicebooker.com/parent-child/course-detail?courseId=${ id }`)
            // locationTo(`http://m.dev1.qlchat.com/parent-child/course-detail?courseId=${ id }`)
        } else {
            locationTo(`https://kids.nicebooker.com/parent-child/bookshelf`);
            // locationTo(`http://m.dev1.qlchat.com/parent-child/bookshelf`);
        }
        
    }

    renderCourseList = () => {
        const { progressList } = this.data;
        switch (this.state.activeTag) {
            case "recent":
                if(this.state.noRecentData) {
                    return this.renderEmpty('还没有学习过课程哦', 'recent')
                }

                // 添加分类标签 (七天前)
                let isTimeSlot1 = false
                let isTimeSlot2 = false
                let timeSlot = (item, index, isValue) => {

                    if (isTimeSlot1 && isTimeSlot2) {
                        return false
                    }

                    if (this.state.recentList[0].timeDiff.isSevenDay) {
                        isTimeSlot1 = true
                        isTimeSlot2 = true
                        return false
                    }

                    if (index === 0 || !item.timeDiff.isSevenDay) {
                        return false
                    }

                    if (isValue) {
                        isTimeSlot1 = true
                    } else {
                        isTimeSlot2 = true
                    }
                    
                    if (isValue) return true
                    else return <p className="seven-day">7天前</p>
                }
                return (
                    <div className={'recent-list co-scroll-to-load' + (this.state.showQlchatAds ? "more-top": "")}>
                        <div className="gradient-bg">

                        {/* {
                            this.state.liveOn > 0 && (
                                <div className="head" onClick={ this.toggleOldBeltNew }>
                                    <embed className="icon-playnow" src={ require('./imgs/study_icon_playnow.svg') } />
                                    <div className="word-scroll" ref="word-scroll">
                                        <p className="word-scroll-content">{ this.state.liveOn > 1 ? `${this.state.liveOn}节课直播中` : `${this.state.liveOnList[0].topic}` }</p>
                                    </div>
                                    <div className="enter-live">
                                        {
                                            this.state.liveOn === 1 ? (<span>进入直播</span>) : (<span onClick={ () => { locationTo(`/wechat/page/mine/course?activeTag=liveon`) }}>查看详情</span>)
                                        }
                                        <embed className="icon-next" src={ require('./imgs/study_icon_next.svg') } />
                                    </div>
                                </div>
                            )
                        } */}


                        {/* <MemberEntry 
                            className="on-visible on-log" 
                            data-log-region="member-entry"
                            data-log-pos="recent"
                            data-log-name="会员入口" 
                            memberInfo={this.props.memberInfo} 
                        /> */}
                        {/* <LearningRecord 
                            odd={parseInt(this.props.userInfo.userId) % 2}
                            listenInfo={this.state.learnInfo}
                            award={this.state.growAssignmentTexts}
                            onClickPoint={this.goMyPoint}
                        /> */}
                        <QfuEnterBar
                            activeTag={this.state.activeTag}
                        />
                        { this.state.campAdObj.nodeCode && !!this.state.recentList.length && <CampAd isNoData={ false } {...this.state.campAdObj}  />}
                        {/* 群岛图书馆入口 */}
                        {/* <img data-ch="1450085" className="library-entrance" alt="" src="https://img.qlchat.com/qlLive/business/E55KCCMK-RHYC-ZXSB-1559617125709-2BTLBB3148XT.gif" onClick={this.gotoLibrary} /> */}
                        {
	                        !this.state.recentList.length && !this.state.noRecentData ?
                            <div className="list-data-loading">拼命加载课程介绍中.<div className="dynamic-ellipsis">..</div></div>
                            :
                            this.state.recentList.map((item, index) => {
                                const cls = classnames({
                                    'recent-book': Object.is(item.isBook, 'Y'),
                                    'no-border' : timeSlot(item, index, true)
                                })
                                return (
                                    <div className={`recent-item on-log on-visible ${cls}`} key={`recent-item-${index}`} 
                                        data-log-course-id={item.id}
                                        data-log-region="recentList"
                                        data-log-pos={index}
                                        data-log-status={ 'seven-' + (item.timeDiff.isSevenDay ? 'outside' : 'inside') }
                                        data-log-name="最近学习"
                                        onClick={(e) => { 
                                        if(e.target.className != "homeWork on-log")  {
                                            this.goToTopicDetails(e, item)
                                        }
                                        
                                    }}>
                                        {
                                            timeSlot(item, index)
                                        }
                                        <div className="headImg">
                                            <div className="c-abs-pic-wrap"><Picture src={item.backgroundUrl} placeholder={true} resize={{w:'162',h:`${ Object.is(item.isBook, 'Y') ? '207' : '102' }`}} /></div>
                                        </div>
                                        <div className="info">
                                            <div className="title">{item.topic}</div>
                                            <div className="desc">
                                                <p>{progressList[item.id] ? (progressList[item.id] >= 1 ? '已学完' : `已学${ (progressList[item.id] * 100).toFixed(2)}%`) : `${item.browsNum >= 10000 ? (item.browsNum / 10000).toFixed(1) + "万" : item.browsNum}次学习`} | {item.timeDiff.str}</p>
                                                {
                                                    item.canEval === 'Y' && item.isAuditionOpen !== 'Y' && (
                                                        <span 
                                                            className="to-eval on-log"
                                                            data-log-region="recent-to-eval"
                                                            data-log-pos={item.id}
                                                            onClick={ (e) => { this.toEval(e, item) } }>去评价</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                       
                        <div className="list-status">
                            {/* {
                                this.state.recentNoMore &&
                                <span>没有更多了</span>
                            } */}
                            {
	                            !this.state.recentNoMore && !!this.state.recentList.length &&
                                <div onClick={() => this.loadRecent()}>
                                    <span>更多已学课程</span>
                                </div>
                            }
                        </div>

                        {
                            !!this.state.recentList[0] &&
                            <GuestYouLike
                                businessType="topic"
                                businessId={this.state.recentList[0].id}
                                dimensionType="buy"
                                urlParams={{
                                    wcl: 'promotion_recent',
                                }}
                                type="mini"
                                render={children => 
                                    <div>
                                        <div className="section-title">猜你喜欢</div>
                                        {children}
                                    </div>
                                }
                                getDataLogPos={p => `recent-${p}`}
                            />
                        }
                        </div>
                    </div>
                )
            case "purchased": // 已购课程
                const { knowLists } = this.state;
                if(this.state.noPurchasedData && !knowLists.length) {
                    return this.renderEmpty('还没有购买过课程哦', 'purchased')
                }
                return (
                    <div className={'purchased-list co-scroll-to-load' + (this.state.showQlchatAds ? "more-top": "")}>
                        <div className="gradient-bg">
                            {/* <MemberEntry 
                                className="on-visible on-log" 
                                data-log-region="member-entry"
                                data-log-pos="purchased"
                                data-log-name="会员入口" 
                                memberInfo={this.props.memberInfo} 
                            /> */}
                            {/* <img data-ch="1450086" src="https://img.qlchat.com/qlLive/business/E55KCCMK-RHYC-ZXSB-1559617125709-2BTLBB3148XT.gif" className="library-entrance" alt="" onClick={this.gotoLibrary} /> */}
                            {/* <LearningRecord 
                                odd={parseInt(this.props.userInfo.userId) % 2}
                                listenInfo={this.state.learnInfo}
                                award={this.state.growAssignmentTexts}
                                onClickPoint={this.goMyPoint}
                            /> */}

                            <p className="learn-data-tip">
                                *学习数据每天更新一次
                            </p>

                            <QfuEnterBar
                                activeTag={this.state.activeTag}
                            />
                            { this.state.campAdObj.nodeCode && !!this.state.purchasedList.length && <CampAd isNoData={ false } {...this.state.campAdObj}  />}
                            {/* 芝士小课 */}
                            { !!knowLists.length &&
                                <>
                                    <div className="pur-title">
                                        <h3 className="know-title">芝士小课</h3>
                                        <div className="know-more on-log"
                                            data-log-region="know-more"
                                            data-log-pos="0"
                                            data-log-type="芝士小课"
                                            data-log-name="已购课程"
                                            onClick={ () => { this.goKnow() }}>全部已购</div>
                                    </div>
                                    <div className="purchased-item purchased-know on-log on-visible" 
                                            data-log-region="know-one"
                                            data-log-pos={1}
                                            data-log-type="芝士小课"
                                            data-log-name="已购课程"
                                            onClick={(e) => {this.goKnow(knowLists[0].id)}}
                                    >   
                                        <div className="img-wrap">
                                            <div className="headImg">
                                                <div className="c-abs-pic-wrap">
                                                    <Picture 
                                                        src={knowLists[0].headImage} 
                                                        resize={{w:'240',h:'150'}}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="info">
                                            <div className="title">{knowLists[0].name} </div>
                                            <div className="other-info">
                                                <div className="topicNum">
                                                    { knowLists[0].learnLessonName ? `正在学习中：${ knowLists[0].learnLessonName }` : '去学习' }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }

                            { !!this.state.purchasedList.length && !!knowLists.length  && (
                                <div className="pur-title">
                                    <h3 className="know-title">千聊</h3>
                                </div>
                            ) }
                            {
                                !this.state.purchasedList.length && !this.state.noPurchasedData ?
                                    <div className="list-data-loading">拼命加载课程介绍中.<div className="dynamic-ellipsis">..</div></div>
                                    :
                                this.state.purchasedList.map((item, index) => (
                                    <div className="purchased-item on-log on-visible" 
                                        data-log-course-id={item.bussinessId}
                                        data-log-region="purchased"
                                        data-log-pos={index}
                                        data-log-type={item.type}
                                        data-log-name="已购课程"
                                        data-log-status={this.getLogStatus(item.playRate)}
                                        key={`purchased-item-${index}`}
                                        onClick={(e) => {this.goToCourse(e, item)}}
                                    >   
                                        <div className="img-wrap">
                                            <div className="headImg">
                                                <div className="c-abs-pic-wrap"><Picture src={item.pic} /></div>
                                            </div>
                                            {
                                                item.payType === 'qlchat_free' &&
                                                <span className="new-user-gift">新人礼包</span>
                                            }
                                            {
                                                (item.payType === 'ufw_camp' || item.payType === 'UFW_CAMP') &&
                                                <span className="new-user-gift">体验营</span>
                                            }
                                        </div>

                                        <div className="info">
                                            <div 
                                                className={ classnames('title',{
                                                    "channel": Object.is(item.type, 'channel'),
                                                    "camp": (Object.is(item.isCamp, 'Y') && Object.is(item.hasPeriod, "Y")) || Object.is(item.joinCamp,"Y"),
                                                })} 
                                                data-type={ Object.is(item.type, 'channel') ? ((Object.is(item.isCamp, 'Y') && Object.is(item.hasPeriod, "Y")) || Object.is(item.joinCamp,"Y") ? "训练营" : '系列课') : ''}>
                                                {item.title} 
                                                {item.hasFile && <span className='file-icon'></span>}
                                            </div>

                                            <div className="other-info">
                                                <div className="topicNum"
                                                >
                                                    {
                                                        Object.is(item.type, 'channel') ? ((Object.is(item.isCamp, 'Y') && Object.is(item.hasPeriod, "Y")) || Object.is(item.joinCamp,"Y") ? "训练营" : '系列课') : ( Object.is(item.type, 'topic') ? '单课' : '')
                                                    }
                                                    {' | '}
                                                    {/* { item.type === "channel" ? `共更新${item.beginTopicCount}课` : (progressList[item.bussinessId] ? ( progressList[item.bussinessId] >= 1 ? '已学完' : `已学${ (progressList[item.bussinessId] * 100).toFixed(2) }%` ) : `${item.learningCount >= 10000 ? (item.learningCount / 10000).toFixed(1) + "万" : item.learningCount}次学习`) } */}
                                                    { item.type === "channel" ? `共更新${item.beginTopicCount}课` :  `${item.learningCount >= 10000 ? (item.learningCount / 10000).toFixed(1) + "万" : item.learningCount}次学习` }
                                                </div>
                                                {
                                                    item.payType === 'qlchat_free' &&
                                                    <div className="new-user-gift-expires">
                                                        {
                                                            item.expiryTime >= this.props.sysTime
                                                            ?
                                                            `${formatDate(item.expiryTime, 'yyyy-MM-dd')}前免费听`
                                                            :
                                                            '已过期'
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            {
                                                this.renderPurchaseSuffix(item) 
                                            }
 
                                        </div>
                                    </div>)
                                )
                            }
                            
                            <div className="list-status ">
                                {/* {
                                    this.state.purchasedNoMore &&
                                    <span>没有更多了</span>

                                } */}
                                {
                                    !this.state.purchasedNoMore && !!this.state.purchasedList.length &&
                                    <div onClick={() => this.loadPurchased()}>
                                        <span>更多已购课程</span>
                                    </div>
                                }
                            </div>

                            {
                                (!!this.state.purchasedList[0]) &&
                                <GuestYouLike
                                    businessType={this.state.purchasedList[0].type}
                                    businessId={this.state.purchasedList[0].bussinessId}
                                    dimensionType="buy"
                                    urlParams={{
                                        wcl: 'promotion_purchased',
                                    }}
                                    type="mini"
                                    render={children => 
                                        <div>
                                            <div className="section-title">猜你喜欢</div>
                                            {children}
                                        </div>
                                    }
                                    getDataLogPos={p => `purchased-${p}`}
                                />
                            }
                        </div>
                    </div>
                )

            case "books": // 已购听书
                if(this.state.noPurchasedData) {
                    return this.renderEmpty('暂无听书', 'books')
                }
                return (
                    <div className={'books-list co-scroll-to-load' + (this.state.showQlchatAds ? "more-top" : "")}>
                        <QfuEnterBar
                            activeTag={this.state.activeTag}
                        />
                        { this.state.campAdObj.nodeCode && !!this.state.purchasedList.length &&  <CampAd isNoData={ false } {...this.state.campAdObj}  />}
                        {
	                        !this.state.purchasedList.length && !this.state.noPurchasedData ?
                                <div className="list-data-loading">拼命加载听书中.<div className="dynamic-ellipsis">..</div></div>
		                        :
                            this.state.purchasedList.map((item, index) => (
                                <BooksItem 
                                    name={item.title} 
                                    description={item.description}
                                    iconUrl={ item.pic }
                                    learningNum={item.learningCount }
                                    duration={ item.duration }
                                    id={ item.bussinessId }
                                    key={ index } />
                            ))
                        }
                        <div className="list-status">
                            {
                                this.state.purchasedNoMore &&
                                <span>没有更多了</span>

                            }
                            {
	                            !this.state.purchasedNoMore && !!this.state.purchasedList.length &&
                                <div onClick={() => this.loadPurchased()}>更多已购听书</div>
                            }
                        </div>
                    </div>
                )

            case "ufwCamp": // 我的体验营
                if(this.state.noPurchasedData) {
                    return this.renderEmpty('暂无报名记录哦', 'ufwCamp')
                }
                return (
                    <div className={'mine-camp-list co-scroll-to-load' + (this.state.showQlchatAds ? "more-top" : "")}>
                        <QfuEnterBar
                            activeTag={this.state.activeTag}
                        />
                        {
	                        !this.state.campList.length && !this.state.noPurchasedData ?
                                <div className="list-data-loading">拼命加载听书中.<div className="dynamic-ellipsis">..</div></div>
		                        :
                            this.state.campList.map((item, index) => (
                                <CampItem key={ index } { ...item } />
                            ))
                        }
                        
                        <div className="list-status">
                            {
                                this.state.purchasedNoMore &&
                                <span className="list-status-gray">没有更多了</span>
                            }
                            {
	                            !this.state.purchasedNoMore && !!this.state.campList.length &&
                                <div onClick={() => this.buyCampList()}>更多体验营</div>
                            }
                        </div>
                    </div>
                )
            default:
                break;
        }
    }

    homeworkListHandle = (e) => {
        locationTo("/wechat/page/homework/details?id=" + e)
    }

    hideHomeworkList = (e) => {
        this.setState({
            showHomeworkDialog: false,
            chosnHomeworkList: []
        })
    }

    // 初始化是否有新课程（个人中心小红点）
    initIsMineNewSession() {
        var newPointList = {};
        if (localStorage.getItem('newPointList')) {
            newPointList = JSON.parse(localStorage.getItem('newPointList'));
            if (newPointList["个人中心_课程定制"] && newPointList["个人中心_课程定制"].length <= 0) {
                this.setState({
                    isMineNewSession: "Y",
                });
            }
        } else {
            this.setState({
                isMineNewSession: "Y",
            });
        };
    }
    initIsMineNew() {
        this.props.fetchIsMineNew();
    }

   

    onChangeVisiable(show) {
		this.setState({
			showQlchatAds: show
		})
    }

    // 获取学习信息
    async getLearnInfo() {
        try {
            const result = await this.props.learnInfo();
            if(result.state.code === 0) {
                this.setState({
                    learnInfo: result.data
                });
                this.getGrowAssignment();
            }
        } catch (error) {
        }   
    }

    // 获取成长任务列表
    async getGrowAssignment() {
        // 获取任务列表
        request({
            url: '/api/wechat/transfer/pointApi/point/getPointAssignmentUserList',
            method: 'POST',
            throwWhenInvalid: true,
        }).then(res => {
            console.log('RES',res);
            if(res.data && res.data.assignmentUserList) {
                const list = res.data.assignmentUserList.growPointAssignmentList;
                const texts = this.getGrowAssignmentText(this.state.learnInfo.learnTotalTime, list);
                this.setState({
                    growAssignmentTexts: texts
                })
            }
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * 获取成长任务奖励文案
     * @param {*} time 学习市场
     * @param {*} list 成长任务列表
     */
    getGrowAssignmentText(totalLearn, list) {
        const li = list.filter(item => {
            return /^(learn_)/.test(item.assignmentCode)
        }).map(item => {
            let time;
            switch(item.assignmentCode) {
                case "learn_one_hour":
                    time = 1;
                    break;
                case "learn_five_hour":
                    time = 5;
                    break;
                case "learn_eight_hour":
                    time = 8;
                    break;
                case "learn_ten_hour":
                    time = 10;
                    break;
                case "learn_thirty_hour":
                    time = 30;
                    break;
                case "learn_fifty_hour":
                    time = 50;
                    break;
                default:
                    time = 50;
            }
            
            return {
                point: item.point,
                time: time
            };
        });
        const hours = totalLearn / 3600;
        for(let i = 0; i < li.length; i ++) {
            if(hours < li[i].time) {
                return li[i];
            }
        }
        return li[li.length - 1];
    }

    goMyPoint() {
        locationTo('/wechat/page/point/mine');
    }

    getLogStatus(playRate) {
        if(playRate === 0) {
            return 'start'
        } else if(playRate === 100) {
            return 'finished'
        } else if(playRate > 0 && playRate < 100) {
            return 'learning'
        } else {
            return 'start'
        }
    }

    render() {
        return (
            <Page title={`${this.state.activeTag !== 'liveOn' ? "我的课程" : "正在直播"}`} className="my-course-page-v2 flex-body">

                {
                    this.state.activeTag !== 'liveon' && !!this.state.tabIdx && (
                        <div className={"tag-menu"}>
                            <HorizontalScrolling className="tag-menu-list"  tagIdx={ this.state.tabIdx } lists={ tabList } changeTag={ this.tagClickHandle } />
                        </div>
                    )
                }
                
                
                <div className="flex-main-h">
                    { this.renderCourseList() }
                </div>
                
                {/* 传送使用 */}
                <div className="qfu-enter-bottom flex-other"></div>

                <BottomDialog
                    show={this.state.showHomeworkDialog}
                    theme={'list'}
                    items={this.state.chosnHomeworkList}
                    title={"作业列表"}
                    close={true}
                    onClose={this.hideHomeworkList}
                    onItemClick={this.homeworkListHandle}
                />

                {
                    this.state.isShowNewUserGift &&
                    <NewUserGift
                        courseList={this.state.newUserGiftCourseList}
                        onClose={() => this.setState({isShowNewUserGift: false})}
                        expiresDay={this.state.newUserGiftExpiresDay}
                    />
                }

                <TabBar
                    activeTab={"discover"}
                    isMineNew={this.props.isMineNew && this.props.isMineNew.isPushNew == "Y" ? true : false}
                    isMineNewSession={this.state.isMineNewSession}
                />

            </Page>
        );
    }
}

const MemberEntry = ({memberInfo: {level, courseNum, isMember}, className, ...props}) => {

    if (typeof level === 'undefined') return null

    let text = '开通会员，购课享8折福利'
    let btnText = '立即开通'
    let jumpUrl = '/wechat/page/membership-center'

    if (isMember === 'Y') {
        if (level === 1) {
            text = '开通正式会员，享受免费大师课'
        } else if (level === 2) {
            if (courseNum > 0) {
                text = '您有2门免费大师课未领取'
                btnText = '立即领取'
                jumpUrl = '/wechat/page/membership-master'
            } else return null
        }
    }

    return (
        <div 
             className={
                classnames('member-entry', className)
             }
             {...props}
             onClick={() => {locationTo(jumpUrl)}}>
            <div className="member-entry-content">
                <span className="member_icon"></span>
                <p className="txt">{text}</p>
            </div>
            <div className="open-member-btn">{btnText}</div>
        </div>
    )
}

MineCourse.propTypes = {

};

function mapStateToProps (state) {
    return {
        isMineNew: state.recommend.isMineNew,
        sysTime: state.common.sysTime,
        memberInfo: get(state, 'memberInfo'),
        userInfo: get(state, 'common.userInfo.user', {})
    }
}

const mapActionToProps = {
    purchaseCourse, planCourse, recentCourse, courseAlert,
    viewMore,
    fetchIsMineNew,
    getQlchatSubscribeStatus,
    getQlchatQrcode,
    getCourseList,
    fetchMemberInfo,
    getUserInfo,
    userBindKaiFang,
    learnInfo
}

module.exports = connect(mapStateToProps, mapActionToProps)(MineCourse);
