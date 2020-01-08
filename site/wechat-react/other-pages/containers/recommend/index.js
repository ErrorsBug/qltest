const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Swiper from 'react-swipe';
import { autobind, throttle } from 'core-decorators'
import classNames from 'classnames';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import TabBar from 'components/tabbar';
import CategoryMenu from './components/category-menu';
import { locationTo, getVal,delCookie} from 'components/util';
import { fillParams } from 'components/url-utils';
import { share } from 'components/wx-utils';
import { showShareSuccessModal } from 'components/dialogs-colorful/share-success'
import animation from 'components/animation';
import detect from 'components/detect';

import Indicator from './components/swiper-indicator';
import CourseList from './components/course-list'
// import FullWidthBtn from 'components/full-width-btn';
// import SecondMenu from './components/second-menu';
import RecommendModal from './components/recommend-modal';
// import TopSearchBar from './components/top-search-bar';
import ArticleWall from './components/article-wall';
import HotBlock from './components/hot-block';
// import QlchatFocusAds from 'components/qlchat-focus-ads';

import NightAnswer from './components/night-answer';
import Boutique from './components/boutique';
import Exclusive from './components/exclusive';
import Master from './components/master';
import Classify from './components/classify';
import Rank from './components/rank';
import Interest from './components/interest';
import PlaceHolder from './components/placeholder';
import GuestYouLike from './components/guest-you-like';
import PublicClass from './components/public-class'
import NewUserGift, { getNewUserGiftData } from 'components/new-user-gift';
import KnowledgeNews from './components/knowledge-news'
import BookRegion from './components/book-region'
import UniversityCommunity from './components/university-community'
import WinAppDiversion from './components/win-app-diversion';
import Child from './components/child';
import Camp from './components/camp';
import { MediaPlayerCover } from 'components/media-player-cover';
import Picture from 'ql-react-picture';

// actions
import {
    getIndexData,
    initInterest,
    initCourseList,
    fetchCourseList,
    fetchBanners,
    fetchCategoryList,
    changeCategory,
    setCourseOffset,
    fetchFlag,
    userBindKaiFang,
    fetchIsMineNew,
    fetchHotLives,
    fetchCenterPopup,
    fetchArticleList,
    showHotTagSection,
    clearHotTags,
    fetchAndInsertTopCourseList,
    getIconList,
    fetchNightAnswerInfo,
    getNewGroup,
    
} from '../../actions/recommend';

import {
    liveGetSubscribeInfo
} from '../../actions/live'
import {
    getQr,
    getQlchatSubscribeStatus,
    getQlchatQrcode,
    api,
    getCourseAuditionList
} from '../../actions/common'
import { request } from 'common_actions/common';
import exposure from 'components/exposure';



@autobind
class Recommend extends Component {

    constructor(props) {
        super(props);

        this.handleCategoryClick = this.handleCategoryClick.bind(this);
        this.handleRefreshBtnClick = this.handleRefreshBtnClick.bind(this);
    }

    state = {
        pageTitle: '千聊优课精选',
        activeBannerIndex: 0,
        activeHeadMenuIndex: 0,
        isNoMoreCourse: false,
        isNoRefreshCourse: false,
        isMineNewSession: "N",
        visitTimes: 0,
        secondCategoryList: [],

        // 是否显示推荐弹窗
        showRecommendModal: false,
        // 推荐弹窗信息
        recommendModal: {
            url: '',
            link: '',
            id: '',
        },

        showArticles: false,

        /* 关注千聊二维码 */
        qrcodeUrl: '',

        showQlchatAds: false,
        isFocusThree: false,
        isFocusQlchat: false,
        threeQrcode: '', // 三方二维码
        qlchatQrcode: '', // 官方二维码
        // 首页数据
        indexData: [],
        // 兴趣相投
        interestData: null,
        isReverseToDailyBtn: false,
        backTopShow: false,

        // 顶部是否收缩
        isHeaderShrink: false,

        // 新人礼包
        isShowNewUserGift: false,
        hideSearch: false,
        bookObj:{},

        // app福利弹窗
        isShowWinAppDiversion: false,
        appActivity: undefined,
        // 试听
        bsId: '',
        type: '',
        playStatus: '',
        idx: -1,
        //社区话题列表
        listTopic:[]
    }

    data = {
        lastScrollTop: 0,
        isLocaScroll: false,
    }

    componentWillMount() {
        this.recordVisitTimes();
    }

    async componentDidMount() {
        // 删除旧cookie记录
        try {
            delCookie('lastVisit')
        } catch (error) {
            
        }
        

        /**
         * 单页路由切换及浏览器返回，会导致props.categoryId不等于url.tagId，导致页面数据与url不对应
         * 需做修正
         */
        let isCategoryIdUnequalUrlTagId = false;
        if (typeof location !== 'undefined' && (this.props.location.query.tagId || 0) != this.props.categoryId) {
            isCategoryIdUnequalUrlTagId = true;
            this.props.changeCategory(this.props.location.query.tagId || 0);
            await new Promise(resolve => setTimeout(resolve));
        }

        this.isSubs = localStorage.getItem("isSubscribe") && Number(localStorage.getItem("isSubscribe")) >= 3 ? false : true;

        this.setState({
            isSubscribe: localStorage.getItem("isSubscribe") && Number(localStorage.getItem("isSubscribe")) >= 3 ? false : true,
            tabbarHeight: this.tabbar && findDOMNode(this.tabbar).clientHeight || 0
        });

        // console.log(this.props.hotLives);
        if (!this.props.hotLives || (this.props.hotLives && this.props.hotLives.length === 0)) {
            this.props.fetchHotLives(this.props.categoryId);
        }

        this.initIndexData();
        this.initInterest();
        this.initCategoryList();
        this.initBanners().then(() => {
            // 第一个banner打曝光日志
            setTimeout(() => {
                exposure.collect({
                    wrap: 'recommend-swiper',
                    className: 'on-visible-banner',
                });
            }, 1000);
        });
        this.initIconList()
        isCategoryIdUnequalUrlTagId && this.initCourseList();
        this.initRecommendModal();
        this.initIsMineNew();
        // this.initHashChange();
        // this.initFocusAds();

        //暂时关闭夜答相关功能
        //this.initNightShow();

        // 暂时下线Ab测试相关功能
        // this.initArticles();
        this.initShare()

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);

        // 设置首页渠道session给其他页面统计用
        this.setTraceSession(this.props.categoryId);

        // 初始化是否有新课程（个人中心小红点）
        this.initIsMineNewSession();

        const kfAppId = this.props.location.query.kfAppId;
        const kfOpenId = this.props.location.query.kfOpenId;
        if (kfAppId && kfOpenId) {
            this.props.userBindKaiFang(kfAppId, kfOpenId);
        }

        getNewUserGiftData().then(res => this.setState(res));

        this.onSwiperTransitionEnd();
        this.initScrollContainerScrollEvent();
        this.getBookLists();
        this.getListTopic();
        this.initWinAppDiversion();

        this.initMediaPlayer();
    }

    // 初始化隐藏播放器（用于试听）
    initMediaPlayer() {
        let updateStatus = (status) => {
            if (this.playStatus === status) {
                return false;
            }
            this.setState({
                playStatus: status
            })
        }
        this.mediaPlayer = new MediaPlayerCover({updateStatus});
    }

    initWinAppDiversion = () => {
        request.post({
            url: '/api/wechat/transfer/h5/appActivity/getAppActivity',
            body: {
                type: 'welfare',
            },
        }).then(res => {
            const appActivity = res.data.appActivityPo;
            if (!appActivity) return;
            if (!WinAppDiversion.ifCanShow(appActivity.id)) return;

            this.setState({
                isShowWinAppDiversion: true,
                appActivity,
            })
        }).catch(err => {})
    }

    onClickWinAppDiversion = () => {
        if (detect.os.ios) {
            locationTo(this.state.appActivity.iosDownloadUrl);
        } else {
            locationTo(this.state.appActivity.androidDownloadUrl);
        }
    }

    closeWinAppDiversion = () => {
        this.setState({
            isShowWinAppDiversion: false,
        })
        WinAppDiversion.handleClose(this.state.appActivity.id);
    }

    // 获取听书数据
    async getBookLists(){
        const { data = {} } = await api({
            url: '/api/wechat/books/lists',
            method: 'GET',
            body: {
                page: 1,
                size: 1,
            }
        })
        this.setState({
            bookObj: data && data.bookList && data.bookList[0]
        })
    }

    // 获取大学社区
    async getListTopic(){
        const { data = {} } = await api({
            url: '/api/wechat/transfer/shortKnowledgeApi/community/listTopic',
            method: 'GET',
            body: {
                source:'ufw',
                page: 1,
                size: 3,
            }
        })
        this.setState({
            listTopic: data && data.dataList
        })
    }
    // 初始化页面滚动事件
    initScrollContainerScrollEvent(){
        let scrollBoxDom = findDOMNode(this.refs.scrollBox);
        scrollBoxDom.addEventListener('scroll', this.scrollHandler)
    }

    @throttle(200)
    scrollHandler(e){
        if(!!e && !!e.target){
            let scrollTop = e.target.scrollTop
            let mainHeight = e.target.querySelector('main').clientHeight
            let containerHeight = e.target.offsetHeight
            // ios上滚动到底部或者顶部的时候有弹性，会造成bug
            if(scrollTop <= 0 || scrollTop >= mainHeight - containerHeight - 10){
                e.preventDefault()
                e.stopPropagation()
                return
            }
            if(this.data.isLocaScroll){return}
            this.data.isLocaScroll=true
            if(scrollTop > this.data.lastScrollTop) {
                // if(this.data.scrollDirection === 'down'){
                //     return
                // }
                this.data.scrollDirection = 'down'
                if(!this.state.hideSearch){
                    this.setState({hideSearch: true})
                }
            }else if(scrollTop < this.data.lastScrollTop){ 
                // if(this.data.scrollDirection === 'up'){
                //     return
                // }
                this.data.scrollDirection = 'up'
                if(this.state.hideSearch){
                    this.setState({hideSearch: false})
                }
            }
            this.data.lastScrollTop = e.target.scrollTop
            this.data.isLocaScroll=false
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextTagId = getVal(nextProps, 'location.query.tagId');
        // 监听url参数变化切换tagId
        if (getVal(this.props, 'location.query.tagId') != nextTagId) {
            this.handleCategoryClick(nextTagId || 0);
        }
    }

    initHashChange() {
        window.onhashchange = () => {
            if (location.hash == '') {
                this.handleCategoryClick(0, false, null);
                this.categoryMeny.menuScrollTo(0);
            }
        }
    }

    async initIndexData(){
        if(!this.props.indexData.length){
            this.props.getIndexData({
                twUserTag: this.props.location.query.twUserTag || '',
            });
        }
        // if (res.state.code === 0 && res.data.regions && res.data.regions.length) {
        //     this.setState({
        //         indexData: res.data.regions
        //     });
        // }
    }

    async initInterest() {
        const res = await this.props.initInterest();
        if (res.state.code === 0 && res.data.courses.length) {
            this.setState({
                interestData: res.data
            });
        }
    }

    /**
     * 获取关注状态
     * 1.优先关注垂直号
     * 2.次关注千聊
     * 3.引导下载app
     */
    // initFocusAds = async () => {
    //     // 是否显示顶部广告
    //     let showQlchatAds = this.state.showQlchatAds;

    // 	try {
    //         let lastCloseDate = Number(localStorage.getItem('__lastCloseAdDate'));
    //         let closeAdCount = Number(localStorage.getItem('__closeAdCount')) || 0;

    //         // const timeStr = await this.getIsResetAppGuideRule();
    //         const timeStr = '2018/04/11';
    //         const resetTimeStamp = new Date(timeStr).getTime();
    //         const nowTimeStamp = Date.now();
    //         // 关闭广告条的那天凌晨0点
    //         const endOfThatDayTimeStamp = new Date(dayjs(lastCloseDate).format('YYYY/MM/DD')).getTime();

    //         if (lastCloseDate && lastCloseDate < resetTimeStamp && nowTimeStamp > resetTimeStamp) {
    //             // 最后关闭广告条的时间如果在重置的时间之前，并且现在时间在重置时间之后，即已经开始本次重置，则显示广告条
    //             showQlchatAds = true;
    //             // 并且重置关闭次数
    //             localStorage.setItem('__closeAdCount', 0);
    //         } else if (closeAdCount == 0) {
    //             // 如果未关闭过广告条就显示广告条
    //             showQlchatAds = true;
    //         } else if (closeAdCount == 1) {
    //             // 如果关闭过广告条，判断现在已经过了关闭那天就显示广告条
    //             showQlchatAds = nowTimeStamp > endOfThatDayTimeStamp + 86400000;
    //         } else if (closeAdCount == 2) {
    //             // 如果关闭过广告条，判断现在已经过了关闭3天后，显示广告条
    //             showQlchatAds = nowTimeStamp > endOfThatDayTimeStamp + 86400000 * 3;
    //         } else if (closeAdCount == 3) {
    //             // 如果关闭过广告条，判断现在已经过了关闭3天后，显示广告条
    //             showQlchatAds = nowTimeStamp > endOfThatDayTimeStamp + 86400000 * 7;
    //         } else if (closeAdCount >= 4) {
    //             // 如果关闭过广告条，判断现在已经过了关闭4天后，不显示广告条
    //             showQlchatAds = false;
    //             return;
    //         }
    // 	} catch (e) {}

    // 	let subscribeStatus = await this.props.getQlchatSubscribeStatus()

    // 	let isFocusThree = subscribeStatus.isFocusThree,
    // 		isFocusQlchat = subscribeStatus.subscribe || !subscribeStatus.isShowQl;

    // 	this.setState({
    // 		isFocusThree,
    // 		isFocusQlchat
    // 	})

    // 	// 获取三方二维码
    // 	if (!isFocusThree) {
    // 		let threeQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374', showQl: 'N' });
    // 		threeQrcode && this.setState({
    // 			threeQrcode
    // 		})
    // 	}

    // 	// 获取官方二维码
    // 	if (!isFocusQlchat) {
    // 		let qlchatQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374'});
    // 		qlchatQrcode && this.setState({
    // 			qlchatQrcode
    // 		})
    // 	}

    // 	this.setState({ showQlchatAds })
    // }

    componentWillUnmount() {
        // this.props.clearHotTags()
        if(this.mediaPlayer){
            this.mediaPlayer.pause();
        }
        
    }


    async initIconList() {
        if (this.props.iconList && this.props.iconList.length < 1) {
            const result = await this.props.getIconList()
        }
    }

    async getQrcode() {
        const result = await this.props.getQr({
            channel: '113',
            showQl: 'Y',
        })
        this.setState({
            qrcodeUrl: result.data && result.data.qrUrl || ''
        })
    }

    async initShare() {
        // 千聊大咖来也的直播间id
        const DEFAULT_LIVE = '350000015224402'
        const result = await this.props.liveGetSubscribeInfo()

        let successFn = () => {
            console.log('shared!')
        }
        if (!result.subscribe) {
            successFn = this.onShareComplete
        }
        this.getQrcode()

        share({
            title: '千聊-凝聚每个认真之人的力量',
            timelineTitle: '千聊-凝聚每个认真之人的力量，2亿人在用的知识学习平台',
            desc: '2亿人在用的知识学习平台',
            timelineDesc: '千聊-凝聚每个认真之人的力量，2亿人在用的知识学习平台', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/activity/image/7JEKE2L2-44H5-3JHN-1562313091323-E8GJA3C8BYXE.png',
            shareUrl: window.location.origin + this.getShareUrl(),
            successFn,
        });
    }

    onShareComplete() {
        if (this.state.qrcodeUrl) {
            showShareSuccessModal({
                url: this.state.qrcodeUrl,
                traceData: 'recommend-center-focus', channel : '113', appId : ''
            })
        }
    }

    /** 根据userId决定是否要展示热门分类区*/
    showHotTagSectionByUserId() {
        if (this.props.showHotTag) {
            return
        }
        let userId = Number(this.props.userId)
        if (userId % 2 === 0) {
            this.props.showHotTagSection()
        }
    }

    async initArticles() {
        if (!this.props.articles.length) {
            await this.props.fetchArticleList({
                page: 1,
                size: 12
            })
        }
        this.setState({
            showArticles: true
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

    // 初始化个人中心小红点信息状态
    initIsMineNew() {
        this.props.fetchIsMineNew();
    }

    setTraceSession(categoryId) {
        let tracePage = '';
        if (String(categoryId) === '0') {
            tracePage = 'recommend';
        } else {
            tracePage = 'recommend_tag_' + categoryId;
        }
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', tracePage);
    }

    handleIdicatorItemClick(e, index) {
        if (this.refs && this.refs.swiperObj && this.refs.swiperObj.swipe) {
            this.refs.swiperObj.swipe.slide(index, 50);
        }
    }
    handleBannerClick(b, index) {
        let url = fillParams({
            name: 'banner',
            pos: index,
        }, b.url);
        locationTo(url);
    }

    // 刷新按钮点击事件处理
    async handleRefreshBtnClick() {

        if (this.isCanRefresh) {
            return;
        }

        this.isCanRefresh = true;


        let fetchOffset = (this.props.courseData[this.props.categoryId] || []).length;

        let result = await this.props.fetchAndInsertTopCourseList(
            this.props.categoryId,
            fetchOffset,
            10,
            false
        );

        let newOffset = this.props.courseOffset + (result && result.length || 0);
        this.props.setCourseOffset(newOffset);

        this.isCanRefresh = false;


        // 一条数据都没有
        if (!result || result.length === 0) {
            window.toast('全部已更新');

            this.setState({
                isNoRefreshCourse: true,
            });
            return;
        }

        window.toast('内容已更新');

        // 是否没有更多
        if (result && result.length < 10) {

            this.setState({
                isNoRefreshCourse: true,
            });
        }

        setTimeout(() => {
            let courseListWrapDom = findDOMNode(this.refs.courseListWrap);
            let offsetTopPos = courseListWrapDom.offsetTop;
            let scrollBoxDom = findDOMNode(this.refs.scrollBox);
            scrollBoxDom.scrollTop = offsetTopPos;
        }, 0);

        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    // 更改分类
    handleCategoryClick(categoryId, isSubMenuItem, e) {
        if (isSubMenuItem && isSubMenuItem.preventDefault) {
            e = isSubMenuItem;
            isSubMenuItem = false;
        }

        if (categoryId != this.props.categoryId) {
            this.replaceUrl(categoryId);

            this.setPageTitle(categoryId);

            // 打印分类pv日志
            this.categoryPvLog();

            // 设置首页渠道session给其他页面统计用
            this.setTraceSession(categoryId);

            // 初始化课程指针为0
            this.props.setCourseOffset(0);

            // 更改分类
            this.props.changeCategory(categoryId);

            // 重新获取热门直播间数据
            this.props.fetchHotLives(categoryId);

            setTimeout(() => {
                let scrollBoxDom = findDOMNode(this.refs.scrollBox);
                scrollBoxDom.scrollTop = 0;
                this.data.lastScrollTop=0
            }, 0);

            setTimeout(() => {
                // 重新初始化上拉加载状态
                this.setState({
                    isNoMoreCourse: false,
                    isNoRefreshCourse: false,
                });

                // 初始化课程列表
                this.initCourseList();

                if (!isSubMenuItem) {
                    // 初始化二级目录
                    this.initSecondMenu(categoryId);
                }

                if (categoryId != 0) {
                    window.location.replace("#subItem")
                }
            }, 0);
        }
    }

    categoryPvLog() {
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla('pv', {

            });
        }, 0);
    }

    getCategoryTitle(categoryId) {
        let categoryTitle = '';

        this.props.categoryList.map(item => {
            if (String(item.id) === String(categoryId)) {
                categoryTitle = item.name;
            }
        });

        return categoryTitle;
    }

    // 替换当前url地址
    replaceUrl(categoryId) {
        let query = this.props.router.location.query;
        let search = '';
        let url = '';

        if (('' + categoryId) === '0') {
            delete query.tagId;
        } else {
            query = { ...query,
                tagId: categoryId
            };
        }

        url = fillParams(query, this.props.router.location.pathname);

        // 品类间变化replace，主页品类切换push
        if (this.props.categoryId > 0 && categoryId > 0) {
            this.props.router.replace(url);
        } else {
            this.props.router.push(url);
        }
    }

    getShareUrl() {
        let query = { ...this.props.router.location.query
        };
        let search = '';
        let url = '';

        delete query.tagId;

        return fillParams(query, this.props.router.location.pathname);
    }

    onSwiped(index) {
        this.setState({
            activeBannerIndex: index
        });
    }

    onSwiperTransitionEnd = () => {
        exposure.collect({
            wrap: 'recommend-swiper',
            className: 'on-visible-banner',
        });
    }

    //当两个swiper-item的时候，index会出现0-3四个index，造成底部Indicator显示不准确，故使用节点渲染时的index
    onHeadMenuSwiped(index, ele) {
        this.setState({
            activeHeadMenuIndex: Number(ele.dataset.actualIndex)
        });
    }

    async initCategoryList() {
        if (this.props.categoryList.length < 1) {
            await this.props.fetchCategoryList();
        }
        if (this.props.categoryId) {
            this.initSecondMenu(this.props.categoryId);
        }

        this.setPageTitle(this.props.categoryId);
    }

    async initBanners() {
        if (this.props.banners.length < 1) {
            await this.props.fetchBanners({
	            twUserTag: this.props.location.query.twUserTag || ''
            });

            this.bannersFlag = this.bannersFlag || 1;

            this.bannersFlag += 1;
        }
    }

    async initCourseList() {
        let courseList = this.getCourseList();
        let result;

        // 初始化课程列表
        if (courseList.length < 1) {
            let fetchOffset = (this.props.courseData[this.props.categoryId] || []).length;
            result = await this.props.fetchCourseList(
                this.props.categoryId,
                fetchOffset,
                this.props.coursePageSize,
                false
            );

            this.props.setCourseOffset((result && result.length || 0));
        } else {
            this.props.setCourseOffset(courseList.length);
        }

        // 初始数据不够分页，则结束分页加载更多
        // courseList = this.getCourseList();
        if (courseList.length && courseList.length < this.props.coursePageSize ||
            result && result.length < this.props.coursePageSize
        ) {
            this.setState({
                isNoMoreCourse: true,
                isNoRefreshCourse: true,
            });
        }

        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    // async initFlag() {
    //     if (this.props.isShowFlag) {
    //         await this.props.fetchFlag();
    //     }
    // };

    async loadMoreCourse(next) {
        let nextCourses = this.getNextCourseList(this.props.coursePageSize);
        let result;

        if (this.props.courseOffset === 0) {
            next && next();
            return;
        }

        if (!nextCourses.length) {
            let fetchOffset = (this.props.courseData[this.props.categoryId] || []).length;

            result = await this.props.fetchCourseList(
                this.props.categoryId,
                fetchOffset,
                this.props.coursePageSize,
                false
            );
            let newOffset = this.props.courseOffset + (result && result.length || 0);
            this.props.setCourseOffset(newOffset);
        } else {
            let newOffset = this.props.courseOffset + nextCourses.length;
            this.props.setCourseOffset(newOffset);
        }

        next && next();

        // 是否没有更多
        if (result && result.length < this.props.coursePageSize) {
            this.setState({
                isNoMoreCourse: true,
                isNoRefreshCourse: true,
            });
        }
    }

    // 获取下一页分页数据
    getNextCourseList(pageSize) {
        let {
            courseData
        } = this.props;

        return (courseData[this.props.categoryId] || []).slice(this.props.courseOffset, pageSize + this.props.courseOffset);
    }

    // 获取要显示在页面上的课程列表（根据分页参数决定显示数量）
    getCourseList() {
        let {
            courseData
        } = this.props;

        return (courseData[this.props.categoryId] || []).slice(0, this.props.courseOffset || this.props.coursePageSize);
    }


    closeSubscribeFunc() {
        if (localStorage.getItem("isSubscribe")) {
            var i = Number(localStorage.getItem("isSubscribe"));
            if (Number(localStorage.getItem("isSubscribe")) <= 3) {
                i++;
            }
            localStorage.setItem('isSubscribe', i);
        } else {
            localStorage.setItem('isSubscribe', 1);
        }
        this.setState({
            isSubscribe: false,
        });

    }

    // 获取banner展示el
    getRecommendHeaderBannerEl() {
        let {
            banners
        } = this.props;
        return (
            <div className='recommend-header'>
                <Swiper
                    ref="swiperObj"
                    className='recommend-swiper'
                    key={this.bannersFlag}
                    swipeOptions={{
                        auto: 5000,
                        callback: this.onSwiped.bind(this),
                        transitionEnd: this.onSwiperTransitionEnd,
                    }}
                >
                    {
                        banners.map((item, index) => (
                            <div
                                key={`recommend-swiper-item${index}`}
                                data-url={`${item.url}`}
                                onClick={e => {
                                    this.handleBannerClick(item, index);
                                }}
                                className='recommend-swiper-item on-log on-visible-banner'
                                data-log-region="banner"
                                data-log-pos={index}
                                data-log-business_id={item.mainId}
                                data-log-name={item.topic}
                                data-log-business_type={item.type}>
                                <span>
                                    <div className="c-abs-pic-wrap">
                                        <Picture
                                            src={item.backgroundUrl}
                                            placeholder={true}
                                            resize={{
                                                w: 668,
                                                h:200
                                            }}
                                        />
                                    </div>
                                </span>
                            </div>
                        ))
                    }
                </Swiper>

                <Indicator
                    size={banners.length}
                    activeIndex={this.state.activeBannerIndex}
                    onItemClick={this.handleIdicatorItemClick.bind(this)}>
                </Indicator>
            </div>
        );
    }
    // 获取头部操作菜单
    getHeadMenuEl() {
        let iconList = [...this.props.iconList];

        // 首页样式 2.0
        // 列表扩充到11项 前5个与后6个均使用不同样式
        const topFive = iconList.splice(0, 5)

        return (
            <div className="head-menu">

                <div className="head-menu-top">
                    {
                        topFive.map((icon, iconIndex) => (
                            <div className="menu-item on-log"
                                onClick={()=>this.onClickHeadMenu(icon.url)}
                                data-log-region="head-menu"
                                data-log-pos={icon.id}
                                data-log-name={icon.title}
                                key={`swiper-item${iconIndex}`}
                                >
                                <div className="icon-con">
                                    <div className="menu-icon">
                                        <div className="c-abs-pic-wrap">
                                            <Picture src={icon.icon}
                                                     placeholder={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="menu-title">{icon.title}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* <div className="head-menu-other">
                    {
                        iconList.map((icon,iconIndex)=>(
                            <div className="o-menu-item on-log"
                                onClick={()=>this.onClickHeadMenu(icon.url)}
                                data-log-region="head-menu"
                                data-log-pos={icon.id}
                                data-log-name={icon.title}
                                key={`swiper-item${iconIndex}`}
                                >
                                <div className="icon-con">
                                    <div className="c-abs-pic-wrap">
                                        <Picture src={icon.icon}
                                                 placeholder={true}
                                                 resize={{
	                                                 w: 160,
	                                                 h:117
                                                 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div> */}
            </div>
        );
    }

    onClickHeadMenu = (url = '') => {
        // 检测到切换tag的话，不跳url
        let tagId = url.match(/\/wechat\/page\/recommend\?tagId=(\d*)/);
        if (tagId) {
            return this.handleCategoryClick(tagId[1]);
        }
        locationTo(url);
    }

    // 记录用户单次回话进入推荐页的次数，只在第一次做滚动菜单动画
    recordVisitTimes() {
        var storage,
            key = 'visitRecommendTimes',
            times;
        if (typeof window != 'undefined' && window.sessionStorage) {
            storage = window.sessionStorage;
            times = storage.getItem('visitRecommendTimes');

            !times ? times = 1 : times++;
            storage.setItem('visitRecommendTimes', times);
            this.setState((state, props) => {
                return {
                    visitTimes: times
                }
            });
        }
        //  else {
        //     console.log('浏览器不支持storage');
        // }
    }

    initSecondMenu(categoryId) {
        if (!categoryId) {
            this.setState({
                secondCategoryList: []
            });
            return false;
        }
        const categoryList = [...this.props.categoryList];
        let secondCategoryList = [];

        for (let i = 0; i < categoryList.length; i++) {
            let item = categoryList[i];
            if (item.id === categoryId) {
                // 将此一级分类划分到全部这个二级分类
                secondCategoryList.push({
                    ...item,
                    name: '精选',
                });
            }
            if (item && item.id === categoryId && item.parentId !== '0') {
                // 证明categoryId是二级分类，从当前分类获取父级分类重新执行函数
                this.initSecondMenu(item.parentId);
                return;
            }
            if (item.parentId === categoryId) {
                // 证明categoryId是一级分类
                secondCategoryList.push(item);
            }
        }

        secondCategoryList.parentId = categoryId;
        this.setState({
            secondCategoryList
        }, () => {
            const itemEl = document.querySelector('.category-menu .active');
            if (!itemEl) return;
            const listEl = this.categoryMenuList;
            if (!listEl) return;

            animation.add({
                startValue: listEl.scrollLeft,
                endValue: itemEl.offsetLeft - (listEl.offsetWidth - itemEl.offsetWidth) / 2,
                duration: 200,
                step: l => {
                    listEl.scrollLeft = l;
                }
            })
        });
    }

    /* 初始化推荐弹窗 */
    async initRecommendModal() {
        const result = await this.props.fetchCenterPopup()
        if (!result.data.box) {
            return false
        }
        await this.setState({
            recommendModal: result.data.box,
        })

        if (this.compareRecommendModalUrl) {
            /* 暂存当前的trace_page */
            this.cache = {
                tracePage: this.tracePage
            }
            this.loadRecommendModal()
        }
    }

    /**
     * 对比localStorage决定是否需要弹窗，返回一个boolean值
     *
     * 1. 对比图片id，请求到的图片id和localStorage中不一样，返回true
     * 2.
     *
     * @readonly
     * @memberof Recommend
     */
    get compareRecommendModalUrl() {
        try {
            let local = localStorage.getItem('recommend_modal')
            if (!local) {
                return true
            }

            local = JSON.parse(local)

            /*
             * 对比id和时间
             *
             * 如果图片id有改变 - 弹出弹窗
             * 如果上次弹出在24小时前 - 弹出弹窗
             */
            // const imageChange = local.id !== this.state.recommendModal.id
            const overTime = parseInt(local.showTime) + 1000 * 60 * 60 * 24 < Date.now()

            return overTime
        } catch (error) {
            console.error(error)
        }
    }

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    /* 加载弹窗图片，在图片加载完成后展示 */
    loadRecommendModal = () => {
        const $image = new Image()
        $image.crossOrigin = 'Anonymous'
        $image.src = this.state.recommendModal.imageUrl
        $image.onload = () => {
            this.showRecommendModal()
        }
    }

    /**
     * 展示弹窗
     * 1. 首先设置sessionStorage的trace_page改变曝光日志的来源页面
     * 2. 同步展示弹窗（异步设置state可能在弹窗展示前打出曝光日志）
     * 3. 手动打曝光日志(异步确保dom渲染完毕)
     *
     * @memberof Recommend
     */
    showRecommendModal = async () => {
        this.tracePage = 'recommend-pop-up'
        await this.setState({
            showRecommendModal: true
        })
        // this.tracePage = this.cache ? this.cache.tracePage : 'recommend'
        try {
            const recommendModal = JSON.stringify({
                ...this.state.recommendModal,
                showTime: Date.now(),
            })
            window.localStorage && localStorage.setItem('recommend_modal', recommendModal)
        } catch (e) {
            console.error(e)
        }
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }

    /**
     * 隐藏弹窗
     * 1. 同步方法隐藏弹窗
     * 2. 将之前cache的trace_page重新设置到sessionStorage
     * 3. 保存本次的弹窗信息到localStorage，以便下次做对比
     *
     * @memberof Recommend
     */
    hideRecommendModal = async (remain) => {
        await this.setState({
            showRecommendModal: false
        })
        this.tracePage = this.cache ? this.cache.tracePage : 'recommend'
        // try{
        //     const recommendModal = JSON.stringify({
        //         ...this.state.recommendModal,
        //         showTime: Date.now(),
        //     })
        //     window.localStorage && localStorage.setItem('recommend_modal', recommendModal)
        // }catch(e){
        //     console.error(e)
        // }
    }

    getCategoryList = () => {
        let list = this.props.categoryList
        // if(list && list.length > 1 && list[1].type !== 'couponCenter') {
        //     let firstCategory = list.shift()
        //     if(list && list.length > 0 && !list[0].activity) {
        //         list.unshift({
        //             type: "couponCenter",
        //         })
        //     }
        //     list.unshift(firstCategory)
        // }
        return list
    }
    capsule() {
        if (this.props.capsuleIcon && this.props.capsuleIcon.icon) {
            return (
                <div 
                    className="train-camp-menu on-log"
                    data-log-region="capsule"
                >
                    <div style={{backgroundImage: 'url(' + this.props.capsuleIcon.icon + ')'}} onClick={()=> {locationTo(this.props.capsuleIcon.url)}}></div>
                </div>
            )
        }
    }

    // closeQlchatAds = () => {
    //     // session内不再显示
    // 	try {
    //         // const maxAge = new Date(dayjs().format('YYYY/MM/DD 23:59:59')).getTime();
    //         let closeAdCount = localStorage.getItem('__closeAdCount') || 0;
    //         closeAdCount = Number(closeAdCount);

    //         closeAdCount++;

    //         localStorage.setItem('__lastCloseAdDate', Date.now());
    //         localStorage.setItem('__closeAdCount', closeAdCount);
    //     } catch (e) {}

    //     this.setState({
    //         showQlchatAds: false
    //     })
    // }

    // /**
    //  * 获取是否重设显示app推广缓存规则
    //  * @returns {string} timeStr 时间字符串 eg: YY/MM/DD
    //  */
    // async getIsResetAppGuideRule() {
    //     try {
    //         const result = await this.props.isResetAppGuideRule();            
    //         if (getVal(result, 'state.code') == 0) {
    //             return getVal(result, 'data.time');
    //         }

    //         return '';
    //     } catch (error) {
    //         console.error(error);
    //         return '';
    //     }
    // }

    // /**
    //  * 是否显示顶部广告条
    //  */
    // get showAdBar() {
    //     const constShowGoodieBag = this.isSubs 
    //         && this.props.isShowFlag 
    //         && this.props.isShowFlag.isHot == "Y" 
    //         && this.props.isShowFlag.isOrder != "Y";

    //     return this.state.showQlchatAds && !constShowGoodieBag;
    // }

	getMoreBtnTapHandle(data){
		const regionCode = data.code || '';
		const name = data.name || '';
		if(regionCode){
		    locationTo(`/wechat/page/recommend/view-more?regionCode=${regionCode}&name=${encodeURIComponent(name)}`)
		}
	}

	courseItemTapHandle(course,query = {}){
        let url;
        // 判断是否为试听课
        // if(!!course.auditionTopicId){
        //     // if (course.style && course.style.indexOf('video') > -1) {
        //     //     url = `/wechat/page/topic-simple-video?topicId=${course.auditionTopicId}`
        //     // } else {
        //     //     url = `/topic/details-listening?topicId=${course.auditionTopicId}`
        //     // }
        //     url = `/topic/details?topicId=${course.auditionTopicId}`;
        // } else 
        {
            if(query.name ){
                if(course.url){
                    if(course.businessType === 'ufw_camp'){
                        locationTo(course.url);
                        return false
                    }
                    let reg = /\?/g;
                    const flag = reg.test(course.url);
                    const curUrl = flag ? `${course.url}&name=${query.name}&pos=${ query.pos}` : `${course.url}?name=${query.name}&pos=${ query.pos}`
                    locationTo(curUrl);
                    return;
                }
                if(course.businessType === 'channel'){
                    url = `/live/channel/channelPage/${course.businessId}.htm?name=${query.name}&pos=${ query.pos}`;
                }else if(course.style === 'normal' || course.style === 'ppt'){
                    url = `/topic/details?topicId=${course.businessId}&name=${query.name}&pos=${ query.pos}`
                }else{
                    url = `/topic/details-video?topicId=${course.businessId}&name=${query.name}&pos=${ query.pos}`;
                }
            }else {
                if(course.url){
                    locationTo(course.url);
                    return;
                }
                if(course.businessType === 'channel'){
                    url = `/live/channel/channelPage/${course.businessId}.htm`;
                }else if(course.style === 'normal' || course.style === 'ppt'){
                    url = `/topic/details?topicId=${course.businessId}`
                }else{
                    url = `/topic/details-video?topicId=${course.businessId}`;
                }
            }
        }
        locationTo(url);
    }

    toDailyBtnTapHandle() {
        this.refs.scrollBox.scrollContainer.scrollTop = 0;
    }


    @throttle(1000)
    updateShow(value) {
        if (value === this.state.backTopShow) {
            return false;
        }
        this.setState({
            backTopShow: value
        })
    }

    onScroll(e, distanceScroll, topicPageHight, distanceScrollCount, scrollContainerBoundingRect) {

        if (this.props.categoryId === 0) {

            const tar = e.currentTarget
            // 超过一屏显示 返回顶部按钮
            if (tar.scrollTop > tar.clientHeight - this.state.tabbarHeight) {
                this.updateShow(true)
            } else {
                this.updateShow(false)
            }
                
            const courseListWrapRect = this.refs.courseListWrap.getBoundingClientRect();
            if (courseListWrapRect.top - (scrollContainerBoundingRect.top + scrollContainerBoundingRect.height) < 0 && !this.state.isReverseToDailyBtn) {
                // 第一次滚到每日精选时初始化
                if (!this.courseListInited) {
                    this.courseListInited = true;
                    this.initCourseList();
                }
            } 
        }

    }

    onClickCategotyItem = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.handleCategoryClick(id);
    }

    setPageTitle(categoryId) {
        if (categoryId == 0) return this.setState({
            pageTitle: '千聊优课精选'
        });
        this.props.categoryList.some(item => {
            if (item.id === categoryId) {
                if (item.parentId > 0) {
                    this.setPageTitle(item.parentId);
                } else {
                    this.setState({
                        pageTitle: item.name
                    });
                }
                return true;
            }
        })
    }

    // 跳转相应的tab
    toTab(adUrl){
        typeof _qla != 'undefined' && _qla('click', {
            region:'know-page',
        });
        setTimeout(() => {
            locationTo(adUrl);
        },500)
        
    }
    //
    async auditionPlaying(type,id,idx){      
        if (this.data.id && this.data.id == id) {
            this.mediaPlayer.resume();
        } else {
            this.data.id = id;
            this.mediaPlayer.pause();
            this.setState({
                bsId: id,
                type: type,
                idx:idx,
                // playStatus: 'loading'
            },)
            try {
                const res = await getCourseAuditionList({
                    businessId: id,
                    businessType: type.toUpperCase(),
                })
                let list = getVal(res, 'data.result.contentList', [])
                let msg = getVal(res, 'state.msg', '')
                if (list.length) {
                    let totalSeconds = getVal(res,'data.result.totalSeconds',0)
                    this.mediaPlayer.mediaPlayerUpdate(list, totalSeconds, type == 'topic', type == 'topic' ?  300 : null);
                    this.mediaPlayer.play();
                    
                } else {
                    window.toast("暂未开课，先试听其他课吧~")
                    this.data.id = '';
                    this.setState({
                        bsId: '',
                        type: '',
                        idx: -1,
                        playStatus: 'stop'
                    })
                }
            } catch (error) {
                window.toast("网络请求超时~")
                this.data.id = '';
                this.setState({
                    bsId: '',
                    type: '',
                    idx: -1,
                    playStatus: 'stop'
                })
            }
        }
    }
    // 试听暂停
    auditionPause(){
        this.mediaPlayer.pause();
    }

    render() {
        let originCourseList = this.getCourseList();

        let courseList = originCourseList.filter(item => item.displayStatus != 'N');

        const showGoodieBag = this.props.categoryId === 0 && this.state.isSubscribe && this.props.isShowFlag && this.props.isShowFlag.isHot == "Y" && this.props.isShowFlag.isOrder != "Y";

        const cln = classNames('recommend-container',
            this.props.categoryId > 0 ? 'page-category' : 'page-main');
        const hotTabs = this.props.categoryList.filter((item) => (!!item.adText && !!item.adUrl));

        return (
            <Page title={this.state.pageTitle} className={cln}>
                
                <CategoryMenu
                    className='category-menu'
                    ref={ dom => this.categoryMeny = dom }
                    items={this.getCategoryList()}
                    activeId={this.props.categoryId}
                    onItemClick={this.handleCategoryClick}
                    autoScroll={this.props.categoryId === 0 && this.state.visitTimes === 1}
                    hideSearch = {this.state.hideSearch}
                    isOne={ this.props.categoryId === 0 }
                >
                     {
                        this.props.categoryId > 0 &&
                        <div className="category-menu-box-container">
                            <div className="category-menu-box">
                                <div className="category-menu">
                                {
                                    this.state.secondCategoryList.map((item, index) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className={`category-item${item.id == this.props.categoryId ? ' active' : ''}`}
                                                onClick={this.onClickCategotyItem}
                                                data-index={index}
                                                data-id={item.id}
                                            >
                                                {item.name}
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </div>
                    }
                </CategoryMenu>
                {/* {
                    !!this.state.secondCategoryList.length &&
                    <SecondMenu
                        list={this.state.secondCategoryList}
                        activeId={this.props.categoryId}
                        onItemClick={this.handleCategoryClick}
                    />
                } */}

                <div className={`scroll-container`}>
                
                    <ScrollToLoad
                        ref="scrollBox"
                        toBottomHeight={500}
                        loadNext={this.loadMoreCourse}
                        noMore={this.state.isNoMoreCourse}
                        scrollToDo={this.onScroll}
                    >       
                        {/* {
                            this.props.categoryId > 0 ||
                            <TopSearchBar/>
                        } */}
                        <div className={`scroll-padding-top ${(this.props.categoryId == 0 && this.state.hideSearch) ? 'min' : '' } ${this.props.categoryId > 0 && !this.state.hideSearch ? ' other' : ''} `}></div>

                        { this.props.categoryId == 0 && !!hotTabs.length && (
                            <div className="category-hot on-log on-visible" 
                                data-log-region="know-page"
                                data-log-pos="know-1" onClick={ () => this.toTab(hotTabs[0].adUrl) }>
                                <div className="hot-title" data-tag={ hotTabs[0].name }>{ hotTabs[0].adText }</div>
                            </div>
                        ) }

                        {
                            this.props.categoryId === 0 ?
                                this.getRecommendHeaderBannerEl() : null
                        }
                        {
                            this.props.categoryId === 0 ?
                                this.getHeadMenuEl() : null
                        }
                        {/* {
                            // 公开课
                            this.props.categoryId === 0 && !!this.props.indexData.length && this.props.indexData.map((d, index) => {
                                if(d.type === 'freePublic' && !!d.freePublicCourse && !!d.freePublicCourse.topicId){
                                    
                                }
                            })
                        } */}

                        {/* 知识新闻 */}
                        {/* {
                            this.props.categoryId === 0 && !!this.props.indexData.length && this.props.indexData.map((d, index) => {
                                if(d.type === 'news' && d.newsList && !!d.newsList.length && !!d.newsList[0].topicList){
                                    return (<KnowledgeNews key={index} name={ d.name } topicList={d.newsList[0].topicList || []}/>)
                                }
                            })
                        } */}

                        {
                            // 胶囊位
                            this.props.categoryId === 0 && this.capsule()
                        }

                        {
                            this.props.categoryId === 0 && this.props.indexData.length === 0 && courseList.length === 0 &&
                                <PlaceHolder />
                        }                        
                        {
	                        this.props.categoryId === 0 && !!this.props.indexData.length && this.props.indexData.map((d, i) => { 
	                            if(d.type === 'nightchat' && d.courses.length){
		                            return (
			                            // 夜答
                                        <NightAnswer
                                            key={i}
                                            info={d}
                                            
                                            courseItemTapHandle={this.courseItemTapHandle}
                                        />
		                            )
                                }else if(d.type === 'boutique' && d.courses.length){
		                            return (
                                        // 精品课程
                                        <Boutique
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            courseItemTapHandle={this.courseItemTapHandle}
                                        />
                                    )
                                }
                                else if(d.type === 'freePublic' && !!d.freePublicCourse && !!d.freePublicCourse.topicId){
                                    return (<PublicClass key={i} secondName={ d.secondName } {...d}/>)
                                }
                                else if(d.type === 'news' && d.newsList && !!d.newsList.length && !!d.newsList[0].topicList){
                                    return (<KnowledgeNews key={i} name={ d.name } topicList={d.newsList[0].topicList || []}/>)
                                }
                                else if(d.type === 'book' && this.state.bookObj && this.state.bookObj.bookList && !!this.state.bookObj.bookList.length){
		                            return (
                                        // 听书
                                        <BookRegion
                                            key={i}
                                            books={this.state.bookObj || {}}
                                            name={ d.name }
                                        />
		                            )
	                            }else if(d.type === 'exclusive' && d.courses.length){
		                            return (
                                        <Exclusive
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            playing={ this.auditionPlaying }
                                            auditionPause={ this.auditionPause }
                                            playStatus={ this.state.playStatus }
                                            bsId={ this.state.bsId }
                                            type={ this.state.type }
                                            selctId={ this.state.idx }
                                            courseItemTapHandle={this.courseItemTapHandle}

                                        />
		                            )
	                            }else if(d.type === 'master' && d.courses.length){
		                            return (
                                        <Master
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            playing={ this.auditionPlaying }
                                            selctId={ this.state.idx }
                                            auditionPause={ this.auditionPause }
                                            playStatus={ this.state.playStatus }
                                            bsId={ this.state.bsId }
                                            type={ this.state.type }
                                            courseItemTapHandle={this.courseItemTapHandle}

                                        />
		                            )
	                            }else if(d.type === 'classify' && d.courses.length){
		                            return (
                                        <Classify
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            playing={ this.auditionPlaying }
                                            selctId={ this.state.idx }
                                            auditionPause={ this.auditionPause }
                                            playStatus={ this.state.playStatus }
                                            bsId={ this.state.bsId }
                                            type={ this.state.type }
                                            courseItemTapHandle={this.courseItemTapHandle}

                                        />
		                            )
	                            }else if((d.type === 'recommend' || d.type === "campAds") && d.courses && d.courses.length){
                                    const flag = d.type == "campAds"
		                            return (
		                                d.courses.map((c, i) => (
                                            <div className={ `recommend-ad-space on-log on-visible ${ d.type }` }
                                                 key={i}
                                                 data-log-region={d.code}
                                                 data-log-name={d.name}
                                                 data-log-id={c.businessId}
                                                 data-log-type={c.businessType}
                                            >
                                                <Picture
                                                     src={c.indexLogo}
                                                     placeholder={true}
                                                     onClick={_=> this.courseItemTapHandle(c,{
                                                        name: d.code,
                                                        pos: i
                                                     })}
                                                />
                                            </div>
		                                ))
		                            )
                                }else if(d.type === 'interest' && this.state.interestData && this.state.interestData.courses && this.state.interestData.courses.length){
	                                return (
                                        <Interest
                                            key={i}
                                            interestData={this.state.interestData}
                                            courseItemTapHandle={this.courseItemTapHandle}
                                        />
                                    )
                                } else if (d.type === 'favorite') {
                                    return <GuestYouLike key={i} />
                                } else if (d.type === 'rank' && d.courses && d.courses.length) {
                                    return (
                                        <Rank
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            playing={ this.auditionPlaying }
                                            selctId={ this.state.idx }
                                            auditionPause={ this.auditionPause }
                                            playStatus={ this.state.playStatus }
                                            bsId={ this.state.bsId }
                                            type={ this.state.type }
                                            courseItemTapHandle={this.courseItemTapHandle}
                                        />
                                    )
                                }else if(d.type === 'child' && d.courses?.length > 2){
                                    return (
                                        <Child
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            courseItemTapHandle={this.courseItemTapHandle}
                                        />
                                    )
                                }else if(d.type === 'camp' && d.courses?.length > 3){
                                    return (
                                        <Camp
                                            key={i}
                                            info={d}
                                            getMoreBtnTapHandle={this.getMoreBtnTapHandle}
                                            courseItemTapHandle={this.courseItemTapHandle}
                                        />
                                    )
                                }else if(d.type === 'univ_community'&&this.state.listTopic?.length>0){
		                            return (
                                        // 听书
                                        <UniversityCommunity
                                            listTopic={this.state.listTopic}
                                            key={i}
                                            {...d}
                                        />
		                            )
	                            }
                            })
                        }

                        {
                            this.props.categoryId === 0 && this.props.showHotTag &&
                            <ArticleWall
                                list={this.props.articles}
                                locationTo={locationTo}
                                show={this.state.showArticles}
                            />
                        }

                        {
                            this.props.categoryId === 0 && this.props.showHotTag &&
                            <HotBlock/>
                        }

                        <div ref="courseListWrap"
                             className={`list-wrap ${this.props.categoryId === 0 ? "need-margin on-visible" : "sub-class"}`}
                             style={{minHeight: 1}}
                             data-log-region="course-list-wrap"
                             data-log-name="每日精选"
                        >
                            {
                                this.props.categoryId === 0 && courseList && !!courseList.length && 
                                <div className="block-header">
                                    <span className="title">每日精选</span>
                                </div>
                            }
                            {
	                            courseList && !!courseList.length &&
                                <CourseList
                                    items={courseList}
                                    tagId={this.props.categoryId}
                                    categoryList={this.props.categoryList}
                                    hotLives={this.props.hotLives}
                                    showRefreshBtn={!this.state.isNoRefreshCourse}
                                    onRefreshBtnClick={this.handleRefreshBtnClick}
                                    playing={ this.auditionPlaying }
                                    auditionPause={ this.auditionPause }
                                    playStatus={ this.state.playStatus }
                                    selctId={ this.state.idx }
                                    bsId={ this.state.bsId }
                                    type={ this.state.type }
                                    name={this.props.categoryId === 0 ? 'jingxuan' : ''}
                                />
                            }
                        </div>
                    </ScrollToLoad>
                </div>
                {
                   this.props.categoryId === 0 && 
                   <TabBar
                       ref={ e => this.tabbar = e }
                       activeTab="recommend"
                       isMineNew={this.props.isMineNew && this.props.isMineNew.isPushNew == "Y" ? true : false}
                       isMineNewSession={this.state.isMineNewSession}
                   />
                }
                {
	                this.props.categoryId === 0 && this.state.backTopShow &&
                    <div className="to-daily-btn reverse" onClick={this.toDailyBtnTapHandle}></div>
                }

                {// 弹窗优先级：app福利，新人礼包，推荐
                    this.state.isShowWinAppDiversion
                        ?
                        <WinAppDiversion
                            activity={this.state.appActivity}
                            onClickClose={this.closeWinAppDiversion}
                            onClickImg={this.onClickWinAppDiversion}
                        />
                        :
                        this.state.isShowNewUserGift
                            ?
                            <NewUserGift
                                courseList={this.state.newUserGiftCourseList}
                                onClose={() => this.setState({isShowNewUserGift: false})}
                                expiresDay={this.state.newUserGiftExpiresDay}
                            />
                            :
                            this.state.showRecommendModal
                                ?
                                <RecommendModal
                                    {...this.state.recommendModal}
                                    hide={this.hideRecommendModal}
                                />
                                :
                                false
                }
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        indexData: state.recommend.indexData,
        banners: state.recommend.banners,
        courseData: state.recommend.courseData,
        coursePageSize: state.recommend.coursePageSize,
        courseOffset: state.recommend.courseOffset,
        categoryList: state.recommend.categoryList,
        categoryId: state.recommend.categoryId,
        isShowFlag: state.recommend.isShowFlag,
        isMineNew: state.recommend.isMineNew,
        showHotTag: state.recommend.showHotTag,
        hotLives: state.recommend.hotLives,
        articles: state.recommend.articles,
        userId: state.common.cookies.userId,
        iconList: state.recommend.iconList,
        capsuleIcon: state.recommend.capsuleIcon,
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
    getIndexData,
    initInterest,
    initCourseList,
    fetchCourseList,
    fetchBanners,
    fetchCategoryList,
    changeCategory,
    setCourseOffset,
    fetchFlag,
    userBindKaiFang,
    fetchIsMineNew,
    fetchHotLives,
    fetchCenterPopup,
    fetchArticleList,
    showHotTagSection,
    clearHotTags,
    fetchAndInsertTopCourseList,
    liveGetSubscribeInfo,
    getQr,
    fetchNightAnswerInfo,
    getIconList,
    getNewGroup,
    getQlchatSubscribeStatus,
    getQlchatQrcode,
}

module.exports = connect(mapStateToProps, mapActionToProps)(Recommend);