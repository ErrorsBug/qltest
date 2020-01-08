// @flow
const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
// import { BottomDialog, Confirm } from 'components/dialog';//发现没用到就注释了20181002
import { locationTo, imgUrlFormat,  digitFormat, formatDate, dangerHtml, isFromLiveCenter, getCookie} from 'components/util';
import { share } from 'components/wx-utils';
import { getQr,  } from 'actions/common';

import Swiper from 'react-swipe';
import Indicator from './swiper-indicator';
// import LiveChannelItem from './components/channel-item'//发现没用到就注释了20181002
// import LiveTopicItem from './components/topic-item'//发现没用到就注释了20181002

import SymbolList from 'components/dialogs-colorful/symbol-list';
import PyramidDialog from 'components/dialogs-colorful/pyramid';
import DoctorDialog from 'components/dialogs-colorful/doctor';
// import RealNameDialog from 'components/dialogs-colorful/real-name';
import TeacherCupDialog from 'components/dialogs-colorful/teacher-cup';
import LiveVDialog from 'components/dialogs-colorful/live-v';
import HotHeart from 'components/dialogs-colorful/hot-heart';
import QRImg from 'components/qr-img';
import Spokesperson from 'components/dialogs-colorful/spokesperson';
// import { showShareSuccessModal } from 'components/dialogs-colorful/share-success';//发现没用到就注释了20181002
// import SubscriptionBar from 'components/subscription-bar';//发现没用到就注释了20181002
// import MiddlePageDialog from './components/middle-page-dialog';

import TopicActionSheet from './components/topic-bottom-actionsheet';
import ChannelActionSheet from './components/channel-bottom-actionsheet';
import TrainingActionSheet from '../checkin-camp-list/components/training-bottom-action';
import CheckinCampActionSheet from '../checkin-camp-list/components/checkin-camp-bottom-actionsheet';
import { FunctionBtn } from './components/function-menu'
import { FunctionMenu} from 'components/studio-index/components/function-menu'
import { fillParams } from 'components/url-utils'
import CommunityGuideModal from 'components/community-guide-modal';


// import LiveFocusQrDialog from 'components/dialogs-colorful/focus-qrcode';//发现没用到就注释了20181002

import MiniCheckinCampList from './components/mini-checkin-camp-list';
import MiniTopicList from './components/mini-topic-list';
import MiniChannelList from './components/mini-channel-list';
import MiniTimeLineList from './components/mini-timeline-list';
import MiniKnowledgeList from './components/mini-knowledge-list';
import MiniTrainingList from './components/mini-training-list';
import MiniTrainingListV2 from './components/mini-training-list-v2';
import MiniGroupList from './components/mini-group-list';
import TopSearchBar from './components/top-search-bar';

import FollowDialog from './components/follow-dialog';
import Picture from 'ql-react-picture';
import BottomBrand from "components/bottom-brand";
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import CompanyDialog from 'components/dialogs-colorful/company'

// actions
import {
    changeTimelineIdx,
    changeChannelIdx,
    changeTopicIdx,

    loadTimeline,
    liveFocus,
    getChannelNumAndTopicNum,
    getLiveInfo,
    getPower,
    getChannel,
    getTopic,
    getLiveIntroPhoto,
    liveGetQr,
    liveSetAlert,
    liveGetSubscribeInfo,
    liveGetFollowInfo,
    initBannerList,
    initLiveSymbolList,
    getRealStatus,
    getCheckUser,
    liveGetFollowNum,
    setAuditedStatues,
    initLiveShareQualify,
    bindLiveShare,
    getUserInfo,
    userBindKaiFang,
    addPageUv,
    toggleDisplayMenu,
    getLiveMiddlepageCourse,
    // getWhiteForNewLiveIndex
} from '../../actions/live';
import {
    getUnreadCount
} from '../../actions/notice-center';

import { whatQrcodeShouldIGet, getCommunity, request, isFunctionWhite, checkEnterprise } from 'common_actions/common';

import {
    fetchCheckinCampList,
    fetchThreeCacheTime,
    fetchTrainingList
} from '../../actions/live-studio';
import {
    dispatchFetchRelationInfo
} from '../../actions/common';

import {
    subscribeStatus,
    isFollow,
    fetchRelationInfo
} from 'common_actions/common'

import { render } from 'components/indep-render';
import GroupBottomActionSheet from './components/group-bottom-actionsheet';
import { autobind, throttle } from 'core-decorators';
import MiddleDialog from 'components/dialog/middle-dialog';
import TopTabBar from './components/top-tab-bar';
const BASE_ADMIN_FUNCS = ["course_table", "vip", "whisper_question", "introduce"];


@autobind
class BaseLiveMain extends Component {

    constructor(props, context) {
        super(props, context);
        this.liveId = this.props.params.liveId
        this.showFunctionMenu=this.showFunctionMenu.bind(this)
    }

    state = {
        timeline: [],
        timelineIdx: 0,

        activeBannerIndex: 0,
        showInfo: false,
        isBindThird: false,
        showThirdQrBlock: false,
        showQrDialog: false,

        focusQrCode: '',
        focusQrCodeAppId: '',
        topTipQrCode: false,
        topTipQrCodeAppId: '',
        thirdQrCode: false,

        // liveRealStatus  是否通过实名认证
        // realNameStatus: "unwrite", //unwrite=未填写， auditing=已填写审核中，audited=已审核，auditBack=审核驳回
        isShowRealName: false,
        isPop:false,
        isShowVBox:false,
        isShowTBox:false,
        isShowHotBox:false,
        isShowDaiBox:false,
        isShowPyramidBox: false,
        isShowDoctor: false,
        // 是否展示引导分享的弹层（部分页面分享链接返回后，没关注的用弹出）
        isShowMiddlePage: false,
        1: '',

        showTopTopic: false,
        showLiveFocusQrDialog: false,
        showLiveTopTipDialog: false,
        // 当前选中的Topic
        activeTopic: null,
        bannersFlag: 0,
        activeChannel: null,
        // 是否显示底部弹框
        showTopicActionSheet: false,
        showChannelActionSheet: false,
        showCheckinCampActionSheet: false,
        showTrainingActionSheet: false,
        showGroupActionSheet: false,
        // 埋点
        channelIndex: 0,
        checkinCampIndex: 0,
        trainingIndex: 0,
        topicIndex: 0,

        showTip: false,
        isOfficial: false,

        // 打卡训练营模块
        checkinCampList: [],
        // 训练营模块
        trainingList: [],
        // 菜单模块
        functionItem: [
        ],
        isFunctionMenuShow: 'Y',

        /* 功能菜单是否可见 */
        functionMenuVisible: false,

        followDialogTitle: '',
        followDialogDesc: '',
        followDialogOption: {
            channel: 'home',
            traceData: 'baseLiveFocusQrcode'
        },

        // 社群引导
        showCommunityGuideModal: false,
        modalType: '',
        existCommunity: false,
        communityCode: '',
        communityName: '',

        // 短知识列表
        knowledgeList: undefined,
        checkUserStatus: 'no',
        isRealName: false,
        isCompany: false,
        enterprisePo:{},

        // 用户好友关系
        relationInfo: undefined,
        isShowGroupDialog: false,

        communityInfo: null, // 社群信息
        showCourseTab: false, // 显示课程吸顶导航栏
        currentTopTab: null, // 当前视野内最顶部的模块
        showLiveQrcodeDialog: false,  // 直播间二维码弹窗
        showCancelFocusDialog: false, // 取消关注二次确认弹窗
        hasLiveVip: false,
        liveisBindApp: false,
        liveBindGong: false,
        liveAppQrCode: null,
        tabList: []
    }

    data = {
        fromRecommend : false,

        newTimelineLen : 2,
        newTopicLen: 5,
        newChannelLen: 5,

        ifGetLiveIntro: false,
        symbolListEmpty: true,

        activeCamp: null,
        activeTrainging: null,
        // 页面访问来源
        from: this.props.location.query.from,

        userId: '',

        
    }

    addBtnDom = null;

    pageRef = null;

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    async componentDidMount() {

        // const whiteResult = await getWhiteForNewLiveIndex()
        // let isWhite = false
        // if(whiteResult && whiteResult.data && whiteResult.data.dataList) {
        //     let whiteList = whiteResult.data.dataList
        //     for (var index = 0; index < whiteList.length; index++) {
        //         if(this.liveId == whiteList[index]) {
        //             isWhite = true
        //         }
        //     }
        // }

        // if(!isWhite && !this.props.location.query.allow) {
        //     location.href = location.origin + "/live/" + this.liveId + ".htm"
        // }

        this.addBtnDom = document.querySelector('#newCourseBtn');

        if(!this.props.liveInfo.entity.id) {
            await this.props.getLiveInfo(this.liveId)
        }

        if(!this.props.power.liveId) {
            await this.props.getPower(this.liveId)
        }

        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
        }
        
        this.data.userId = getCookie('userId');

        if (this.props.createBy) {
            this.setState({
                isLiveCreator: this.props.createBy == this.data.userId
            });
        }

        this.initRealStatus();

        this.getCompany();

        // // 打卡训练营模块
        // fetchCheckinCampList({
        //     liveId: this.liveId,
        //     page: {
        //         page: 1,
        //         pageSize: 20
        //     },
        //     showDisplay: 'N', // 是否显示已经隐藏掉的打卡
        // })().then((result) => {
        //     if (result.state.code === 0) {
        //         const list = result.data.liveCampList || [];
        //         if (list.length) {
        //             this.setState((prevState) => {
        //                 return {
        //                     checkinCampList: [
        //                         ...prevState.checkinCampList,
        //                         ...list,
        //                     ]
        //                 }
        //             });
        //         }
        //     }
        // });

        // this.handleFetchTrainingList()

        //liveBanner
        if(this.props.bannerList.length < 1) {
            const result = await this.props.initBannerList(this.liveId)
            if(result) {
                this.setState({
                    bannersFlag: this.state.bannersFlag + 1,
                })
            }
        }

        // this.props.getChannelNumAndTopicNum(this.liveId)
        this.props.getTopic(this.liveId, this.props.topicPage)
        this.props.getChannel(this.liveId, this.props.channelPage, '', 'N')
        // 获取两个短知识入口
        request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/getKnowledgeListByLiveId',
            body: {
                liveId: this.liveId,
                bOrC: this.props.power.allowMGLive ? 'B' : 'C',
                page: {
                    page: 1,
                    size: 20
                }
            }
        }).then(res => {
            this.setState({knowledgeList: res.data.list})
        }).catch(err => {})

        // 优先绑定直播间分销
        if(this.props.location.query.lshareKey || this.props.location.query.shareKey) {
            await this.props.bindLiveShare(this.liveId , this.props.location.query.lshareKey || this.props.location.query.shareKey )
            this.props.liveFocus("Y", this.liveId)
        }

        //这个要在 liveFocus 前
        if(this.props.location.query.kfAppId && this.props.location.query.kfOpenId) {
            this.props.userBindKaiFang(this.props.location.query.kfAppId, this.props.location.query.kfOpenId)
            this.props.liveFocus("Y", this.liveId)
        }


        //liveFocus
        if(this.props.focusStatues.subscribe === undefined) {
            this.props.liveGetSubscribeInfo(this.liveId),
            this.props.liveGetFollowInfo(this.liveId)
        }

        //liveSymbol
        if(this.props.symbolList.length < 1) {
            const result = await this.props.initLiveSymbolList(this.liveId)
        }

        //liveTimeline
        if(this.props.timeline.length < 1) {
            await this.props.loadTimeline(this.props.timelinePage, 0, this.liveId)
        }
        this.setState({
            timeline: this.props.timeline.slice(0, 8)
        })


        this.props.liveGetFollowNum(this.liveId)

        const isRecommend =/.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page'));
        this.data.fromRecommend = isRecommend

        await this.props.initLiveShareQualify(this.liveId)

        /*------------------- 这里是一段关于分享的逻辑（手动分割线开始） -------------------*/

        const { subscribe, isShowQl } = this.props.focusStatues
       
        let onShareComplete = () => { }
        /* 如果没关注千聊，又不是白名单，呵呵，您的二维码即将上桌 */
        if (!subscribe && isShowQl) {
            /* 分享成功的回调函数 */
            onShareComplete = this.onShareComplete.bind(this)
            this.fetchShareQr()
        }

        const params = {}
        // 没有简介，设置默认描述 并复写ch
        if (!this.props.liveInfo.entity.introduce) {
            params.ch = 'shareNormal'
        }
        if(this.props.shareQualify && this.props.shareQualify.id) {
            share({
                title: "我推荐-" + this.props.liveInfo.entity.name,
                timelineTitle: this.props.liveInfo.entity.name,
                desc: this.props.liveInfo.entity.introduce || '直播间海量好内容，由千聊免费开课工具生成。',
                timelineDesc: "我推荐-欢迎大家关注直播间:" + this.props.liveInfo.entity.name, // 分享到朋友圈单独定制
                imgUrl: this.props.liveInfo.entity.logo,
                shareUrl: fillParams(params, (location.origin + "/" + this.props.shareQualify.shareUrl), ['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']),
                successFn: onShareComplete,
            });
        } else {
            share({
                title: this.props.liveInfo.entity.name,
                timelineTitle: this.props.liveInfo.entity.name,
                desc: this.props.liveInfo.entity.introduce || '直播间海量好内容，由千聊免费开课工具生成。',
                timelineDesc: "欢迎大家关注直播间:" + this.props.liveInfo.entity.name, // 分享到朋友圈单独定制
                imgUrl: this.props.liveInfo.entity.logo,
                successFn: onShareComplete,
                shareUrl: fillParams(params, (window.location.href), ['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']),
            });
        }

        // 拿用户名和头像
        const userResult = await this.props.getUserInfo();

        /*------------------- 这里是一段关于分享的逻辑（手动分割线结束） -------------------*/

        if(this.props.location.query.openId) {
            if(userResult.user.openId == this.props.location.query.openId) {
                this.props.liveFocus("Y", this.liveId)
            }
        }
        
        // 如果是从分享链接返回到此页面,则进入处理弹层
        if (this.props.location.query.isBackFromShare === 'Y' && this.tracePage !== 'coral') {
            await this.handleBackFromShare();
        }

        
        if (this.props.location.query.auditStatus == 'pass') {
            // 饼饼的需求--通过 208 和 205 扫码的 第三方公众号 ，后端无法自动关注，需要前端关注
            this.props.liveFocus("Y", this.liveId)
        }


        this.props.addPageUv('', this.liveId,'liveUv', this.props.location.query.pro_cl || getCookie('channelNo') || '');

        // setInterval(() => {
        //     this.changeTimelineHandle()
        // }, 3000)

        switch (this.liveId) {
            case "100000081018489":
            case "350000015224402":
            case "310000089253623":
            case "320000087047591":
            case "320000078131430":
            case "290000205389044":
                this.setState({
                    isOfficial: true
                })
            default:
                break;
        }


        // 显示顶部绿条,并且现在距离上次弹码的时间间隔大于规定的时间
        const local = JSON.parse(localStorage.getItem('__TRIPARTITE_LEAD_POWER'))
        if(local !== null){
            const res = await fetchThreeCacheTime(this.liveId)
            if(new Date().getTime() - local.lastTime >  res.data.subTimeStep){
                this.setState({
                    showTopTopic: true
                })
            }
        }else {
            this.setState({
                showTopTopic: true
            })
        }

        if(isFromLiveCenter()){
            // 清除C端来源标识
            sessionStorage.removeItem('trace_page');
        }

        // 获取好友关系
        this.getRelationInfo();
        // 获取通知中心未读消息
        this.getUnreadCount();

        
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);
        
        


        // C端用户获取是否直播间有关联社群
        if (!this.props.power.allowMGLive) {
            try{
                const data = await getCommunity(this.liveId, 'live', this.liveId);
                this.setState({
                    existCommunity: data.showStatus == 'Y',
                    communityCode: data.communityCode,
                    communityName: data.communityName,
                }, () => {
                    if (this.state.existCommunity && this.data.from == 'templateMsg') {
                        this.setState({
                            showCommunityGuideModal: true,
                            modalType: 'followLive'
                        });
                    }
                });
            }catch(err) {
            }
        }

        this.dispatchGetCommunity();

 
        this.getPageConfig();
        // 获取直播间模块
        await this.handleFetchTrainingList()
        await this.fetchCampList();
        this.getTagLists();
        this.genTabList();
        this.getHasLiveVip();
        this.getLiveApp();
    }

    genTabList() {
        let arr = [];
        if(this.props.channelList.length > 0) {
            arr.push({
                name: "系列课",
                ele: "channel-list",
                region: "topMenuChannel"    
            })
        }
        if(this.state.trainingList.length > 0) {
            arr.push({
                name: "训练营",
                ele: "training-list",
                region: "topMenuCamp"   
            })
        }
        if(this.state.checkinCampList.length > 0) {
            arr.push({
                name: "打卡",
                ele: "checkin-camp-list",
                region: "topMenuOldCamp"     
            });
        }
        if(this.props.topicList.length > 0) {
            arr.push({
                name: "单课",
                ele: "new-topic",
                region: "topMenuTopic"  
            })   
        }
        this.setState({
            tabList: arr
        });
    }

    async fetchCampList(tagId, paginate = true) {
        // 打卡训练营模块
        const result = await fetchCheckinCampList({
            liveId: this.liveId,
            tagId,
            page: {
                page: 1,
                pageSize: 20
            }
        })()
        if (result.state.code === 0) {
            const list = result.data.liveCampList || [];
            if (list.length >= 0) {
                this.setState((prevState) => {
                    return {
                        checkinCampList: paginate ? [
                            ...prevState.checkinCampList,
                            ...list,
                        ] : [...list]
                    }
                });
            }
            return list;
        }
    }

    /**
     * 是否是白名单 再去请求
     */
    async handleFetchTrainingList(tagId, paginate = true) {
        //训练营模块
        const result = await fetchTrainingList({
            liveId: this.liveId,
            tagId,
            page: {
                page: 1,
                pageSize: 20
            },
            status: "Y"
            // status: this.props.power.allowMGLive ? '': 'Y' // B端展示全部 C端不展示
        })()
        if (result.state.code === 0) {
            const list = result.data.dataList || []; // 需要看字段
            if (list.length >= 0) {
                await this.setState((prevState) => {
                    return {
                        trainingList: paginate ? [
                            ...prevState.trainingList,
                            ...list,
                        ] : [...list]
                    }
                });
            }
            return list;
        }
    }


    handleBackFromShare = async () => {
        const liveMiddlepageCourse = await this.props.getLiveMiddlepageCourse(this.liveId)
        const userIdLen = this.props.userInfo.userId.length;
        const ABtestForA = this.props.userInfo.userId && Number(this.props.userInfo.userId.substr(userIdLen-1, userIdLen)) < 5;
        const qrCodeUrl = await whatQrcodeShouldIGet({  
            isBindThird: this.props.focusStatues.isBindThird,
            isFocusThree: this.props.focusStatues.isFocusThree,
            isRecommend: this.data.fromRecommend,
            options: {
                subscribe: this.props.focusStatues.subscribe, 
                channel: ABtestForA ? 'middlepageA' : 'middlepage',
                liveId: this.props.liveId,
                topicId: liveMiddlepageCourse.businessType === 'topic' ? liveMiddlepageCourse.businessId : undefined,
                channelId: liveMiddlepageCourse.businessType === 'channel' ? liveMiddlepageCourse.businessId : undefined,
            }
        })
        
        // 并且没有关注公众号，则弹窗引导
        if (qrCodeUrl) {
            this.setState({middlePageQrcodeUrl: qrCodeUrl.url, middlePageAppId: qrCodeUrl.appId}, () => this.toggleShowGuideToFocusDialog());
        }
    }

    async fetchThreeCacheTime(){
        const res = await fetchThreeCacheTime(this.liveId)
        return res.data.subTimeStep
    }

    async fetchShareQr() {
        const result = await this.props.liveGetQr(this.props.liveId, '114', 'Y')
        this.setState({ shareQrcodeUrl: result }) 
    }

    onShareComplete() {
        if (this.state.shareQrcodeUrl) {
            this.setState({
                qrcodeBoxType:'shareNoDistribution',
                focusQrCode: this.state.shareQrcodeUrl,
                followDialogOption: {
                    traceData: '102',
                    channel: '102'
                },
                followDialogTitle: '分享成功',
                followDialogDesc: '关注我们，发现更多优质好课',
            }, () => {
                this.followDialogDom.show()
            })
        }
    }

    openTopTipDialogHandle = async () => {
        if(!this.state.topTipQrCode) {
            const result = await whatQrcodeShouldIGet({
                isBindThird: this.props.focusStatues.isBindThird,
                isFocusThree: this.props.focusStatues.isFocusThree,
                isRecommend: this.data.fromRecommend,
                options: {
                    subscribe: this.props.focusStatues.subscribe, 
                    channel: '205',
                    liveId: this.props.liveId
                }
            })
            if(result) {
                this.setState({
                    topTipQrCode: result.url,
                    topTipQrCodeAppId: result.appId,
                    showLiveTopTipDialog: true
                })
            }
        } else {
            this.setState({
                showLiveTopTipDialog: true
            })
        }

    }

    showTopicActionSheet = () => {
        this.setState({
            showTopicActionSheet: true
        });
    }

    hideTopicActionSheet = () => {
        this.setState({
            showTopicActionSheet: false
        });
    }

    showChannelActionSheet = () => {
        this.setState({
            showChannelActionSheet: true
        });
    }

    hideChannelActionSheet = () => {
        this.setState({
            showChannelActionSheet: false
        });
    }

    showGroupActionSheet = e => {
        e.stopPropagation();
        this.setState({
            showGroupActionSheet: true
        });
    }

    hideGroupActionSheet = () => {
        this.setState({
            showGroupActionSheet: false
        });
    }


    closeTopTipDialogHandle = () => {
        this.setState({
            showLiveTopTipDialog: false,
        })
    }
    closeLiveFocusQrDialog = () => {
        this.setState({
            showLiveFocusQrDialog: false
        })
    }

    async getCompany(){
		const { data = {} } = await checkEnterprise({liveId: this.props.liveId});
		this.setState({
			enterprisePo: data
		})
	}

    async initRealStatus(){
        if (this.props.createBy == this.data.userId) {
            let statusresult = await this.props.getRealStatus(this.props.liveId, 'topic');
            let { data } = await this.props.getCheckUser();
            const newReal = (data && data.status) || 'no';
            const oldReal = statusresult.data && statusresult.data.status || 'unwrite'
            this.setState({
                checkUserStatus: newReal,
            });
            this.props.setAuditedStatues(oldReal)
        }
    }

    relateTypeText = (key) => {
        switch (key) {
            case "homework":
                return "作业"
            case "topic":
                return "课程"
            case "channel":
                return "系列课"
            default:
                break;
        }
    }

    symbolList = () => {
        let realNameIdentity = false
        for (var index = 0; index < this.props.symbolList.length; index++) {
            if(this.props.symbolList[index].key == "identity") {
                realNameIdentity = true
            }
        }
        return (
            <div className="symbolList">
                {
                    this.props.symbolList.map((item, index) => {
                        return item.key != "identity" ? <div className="symbol" key={item.key + "-symbol"}>{item.key}</div> : ""
                    })
                }
                {
                    <div className="symbol">{realNameIdentity? "已认证" : "未认证"}</div>
                }
            </div>
        )
    }

    //实名认证的按钮点击事件
    handleRealNameBtnClick = () => {
        this.setState({
            isShowRealName : true,
        });
    }

    closeRealName = () => {
        this.setState({
            isShowRealName : false,
        });
    }

    //加v的按钮点击事件
    handleVClick = () => {
        this.setState({
            isShowVBox : true,
        });
    }
    closeVBox = () => {
        this.setState({
            isShowVBox : false,
        });
    }

    //加t的按钮点击事件
    handleTClick = () => {
        this.setState({
            isShowTBox : true,
        });
    }

    closeTBox = () => {
        this.setState({
            isShowTBox : false,
        });
    }

    //热门的按钮点击事件
    handleHotClick = () => {
        this.setState({
            isShowHotBox : true,
        });
    }

    closeHotBox = () => {
        this.setState({
            isShowHotBox : false,
        });
    }
    pyramidClick = () => {
        this.setState({
            isShowPyramidBox: true,
        })
    }
    closePyramid = () => {
        this.setState({
            isShowPyramidBox: false,
        })
    }
        //代言人的按钮点击事件
    handleDaiClick = () => {
        this.setState({
            isShowDaiBox : true,
        });
    }

    closeDaiBox = () => {
        this.setState({
            isShowDaiBox : false,
        });
    }

    handleDoctorBtnClick = () => {
        this.setState({
            isShowDoctor: true
        })
    }

    closeDoctorBtnHandle = () => {
        this.setState({
            isShowDoctor: false
        })
    }

    changeTimelineHandle = async () => {
        const listLength = this.data.newTimelineLen
        if(this.props.timeline && this.props.timelineIdx < this.props.timeline.length - listLength) {
            this.props.changeTimelineIdx(this.props.timelineIdx + listLength)
        } else {
            this.props.changeTimelineIdx(this.props.timelineIdx + listLength - this.props.timeline.length)
        }

    }

    changeChannelHandle = async () => {
        const listLength = this.data.newChannelLen
        if(this.props.noMoreChannel) {
            if(this.props.channelList && this.props.channelIdx < this.props.channelList.length - listLength) {
                this.props.changeChannelIdx(this.props.channelIdx + listLength)
            } else {
                this.props.changeChannelIdx(this.props.channelIdx + listLength - this.props.channelList.length)
            }
        } else {
            if(this.props.channelList && this.props.channelIdx > (this.props.channelPage - 1) * 20 - 2 * listLength) {
                await this.props.getChannel(this.props.liveId, this.props.channelPage, '', 'N')
                this.props.changeChannelIdx(this.props.channelIdx + listLength)
            } else {
                this.props.changeChannelIdx(this.props.channelIdx + listLength)
            }
        }
    }

    changeTopicHandle = async () => {
        var listLength = this.data.newTopicLen
        if(this.props.noMoreTopic) {
            if(this.props.topicList && this.props.topicIdx < this.props.topicList.length - listLength) {
                this.props.changeTopicIdx(this.props.topicIdx + listLength)
            } else {
                this.props.changeTopicIdx(this.props.topicIdx + listLength - this.props.topicList.length)
            }
        } else {
            if(this.props.topicList && this.props.topicIdx > (this.props.topicPage - 1) * 20 - 2 * listLength) {
                await this.props.getTopic(this.props.liveId, this.props.topicPage)
                this.props.changeTopicIdx(this.props.topicIdx + listLength)
            } else {
                this.props.changeTopicIdx(this.props.topicIdx + listLength)
            }
        }
    }

    gotoHandle = (url, type, businessId) => {
        switch(type) {
            case "channel":
                locationTo("/live/channel/channelPage/" + businessId + ".htm");
                break
            case 'topic':
                locationTo("/wechat/page/topic-intro?topicId="+ businessId);
                break;
            case 'none':
                break;
            default:
                locationTo(url)
                break;
        }
    }

    //banner 相关
    onSwiped(index) {
        this.setState({
            activeBannerIndex: this.props.bannerList.length == 2 ? index%2 : index
        });
    }
    handleIdicatorItemClick(e, index) {
        if (this.refs && this.refs.swiperObj && this.refs.swiperObj.swipe) {
            this.refs.swiperObj.swipe.slide(index, 50);
        }
    }
    focusHandle = async () => {
        const focusState = this.props.focusStatues.isFollow ?  (this.props.focusStatues.isAlert ? 'pass' : 'attention_pass') : (this.props.focusStatues.isAlert ? null : 'no_pass');
        let showToast = false;
        this.setState({
            showTopTopic: false
        })
        // 丧心病狂的二维码关注逻辑
        // 不，已经超脱丧心病狂了
        // 不不，你错了，何止超脱丧心病狂，简直丧尽天良
        // 看开点就好
        // const isFollow = await this.props.liveFocus(
        //     this.props.focusStatues.isFollow ? "N" : "Y",
        //     this.props.liveId
        // )
        /** 珊瑚来源不引导关注 */
        if (!(focusState === "pass")  && this.tracePage !== 'coral') {
            const result = await whatQrcodeShouldIGet({
                isBindThird: this.props.focusStatues.isBindThird,
                isFocusThree: this.props.focusStatues.isFocusThree,
                isRecommend: this.data.fromRecommend,
                options: {
                    subscribe: this.props.focusStatues.subscribe, 
                    channel: '101',
                    liveId: this.props.liveId
                }
            })
            if(result){
                let followDialogOption = {
                    channel: '101',
                    traceData: 'baseLiveFocusQrcode'
                }
                followDialogOption.appId = result.appId
                this.setState({
                    qrcodeBoxType:'focusClick',
                    focusQrCode: result.url,
                    followDialogOption,
                    followDialogTitle: '关注我们',
                    followDialogDesc: '接收开课提醒、优惠福利再也不怕漏掉精彩内容了',
                }, () => {
                    this.followDialogDom.show()
                })
            } else {
                showToast = true;
            }
        }
        const res = await this.props.liveFocus(
            focusState === "pass" ? "N" : "Y",
            this.props.liveId
        )
        if(res && showToast === true) {
            if(focusState === "no_pass") {
                window.toast("关注成功，可以在公众号接收直播间信息啦~");
                this.joinCommunityConfirm();
            } else if (focusState === "attention_pass") {
                window.toast("订阅成功，可以在公众号接收直播间信息啦~");
                this.joinCommunityConfirm();
            }
        }
        
        if(this.state.showCancelFocusDialog) {
            this.setState({
                showCancelFocusDialog: false  
            })
        }
    }

    onClickFocus() {
        const focusState = this.props.focusStatues.isFollow ?  (this.props.focusStatues.isAlert ? 'pass' : 'attention_pass') : (this.props.focusStatues.isAlert ? null : 'no_pass');
        if(focusState === "pass" ) {
            this.setState({
                showCancelFocusDialog: true
            })
        } else {
            this.focusHandle();
        }
    }

    async focusLiveConfirm(isFollow){
        await this.props.liveFocus(
            this.props.focusStatues.isFollow ? "N" : "Y",
            this.props.liveId
        );
        if (this.state.existCommunity) {
            this.setState({
                showCommunityGuideModal: true,
                modalType: 'followLive'
            });
        }
    }

    toggleCommunityGuideModal = () => {
        this.setState({
            showCommunityGuideModal: !this.state.showCommunityGuideModal
        });
    }

    joinCommunityConfirm = () => {
        if (this.state.existCommunity) {
            this.setState({
                showCommunityGuideModal: true,
                modalType: 'joinCommunity'
            });
        }
    }

    isVerificationLive = () => {
        let verification = false

        for (var index = 0; index < this.props.symbolList.length; index++) {
            if(this.props.symbolList[index].key === "livev") {
                verification = true
            }
        }

        return verification
    }
    verificationTime = () => {
        let verificationTime = 0

            for (var index = 0; index < this.props.symbolList.length; index++) {
                if(this.props.symbolList[index].key === "livev") {
                    verificationTime = this.props.symbolList[index].time
                }
            }

        return verificationTime
    }

    gotoInfoHandle = () => {
        this.props.router.push("/wechat/page/live/info/" + this.liveId)
    }


    thirdQrBlockHandle = () => {
            this.setState({
                thirdQrCode: this.props.liveInfo.entity.qrCode,
                showThirdQrBlock: !this.state.showThirdQrBlock,
            })
    }

    closeThirdQrBlockHandle = (e) => {
        if(e.target.className == "third-qr-back") {
            this.setState({
                showInfo: true,
                showThirdQrBlock: false
            })
        }
    }

    alertHandle = async () => {
        const isAlert = await this.props.liveSetAlert(this.props.liveId, this.props.focusStatues.isAlert ? "N" : "Y")
        if(isAlert && !this.props.focusStatues.subscribe) {
            const qrCode = await this.props.liveGetQr(this.props.liveId, 102, "N")
            this.setState({
                focusQrCode: qrCode,
                followDialogTitle: '关注我们',
                followDialogDesc: '接收开课提醒、优惠福利再也不怕漏掉精彩内容了',
                followDialogOption: {
                    traceData: 'channelFocusQrcode',
                    channel: '102'
                }
            }, () => {
                this.followDialogDom.show()
            })
        }
    }

    topTipHandel = (e) => {
        if(e.target.className == "right" || e.target.className == "icon_cross") {
            this.setState({
                showTopTopic: false
            })
        } else {
            this.openTopTipDialogHandle()
        }

    }

    openTopicBottomMenu = (e, item, index) => {
        e.stopPropagation();

        this.setState({
            activeTopic: item,
            showTopicActionSheet: true,
            topicIndex: index + 1
        });
    }

    onChangeTopicHidden = (displayStatus) => {
        this.setState({
            activeTopic: {
                ...this.state.activeTopic,
                displayStatus
            }
        });
    }

    openChannelBottomMenu = (e, item, index) => {
        e.stopPropagation();

        this.setState({
            activeChannel: item,
            showChannelActionSheet: true,
            channelIndex: index + 1
        });
    }

    onToggleDisplayMenu = (e, showMenuStatus) => {
        e && e.stopPropagation();

        this.props.toggleDisplayMenu(this.liveId, showMenuStatus);
        
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    loadMoreTopic = async () => {
        await this.props.getTopic(this.props.liveId, this.props.topicPage + 1)
    }
    loadMoreChannel = async () => {
        await this.props.getChannel(this.props.liveId, this.props.channelPage + 1, '', 'N')
    }

    functionClickHandle(item) {
        switch (item.code) {
            case 'course_table':
                this.gotoHandle("/wechat/page/live/courseTable/" + this.props.liveId);
                break
            case 'vip':
                this.gotoHandle("/wechat/page/live-vip?liveId=" + this.props.liveId + '&shareKey=' + ((this.props.shareQualify && this.props.shareQualify.shareKey) ? this.props.shareQualify.shareKey : ''));
                break
            case 'whisper_question':
                this.gotoHandle("/wechat/page/live/question/" + this.props.liveId)
                break
            case 'introduce':
                this.gotoHandle(`/wechat/page/live/info/${this.props.liveId}`)
                break

        }
    }
    
    /*----- 直播间首页新增打卡训练营模块 -----*/

    /**
     * 显示页面底部的训练营操作弹框
     * @param {*object} camp 
     */
    displayCheckinCampActionSheet = (camp, index) => {
        this.data.activeCamp = camp;
        this.setState({
            showCheckinCampActionSheet: true,
            checkinCampIndex: index + 1
        });
    }

    /**
     * 隐藏页面底部的训练营操作弹框
     */
    hideCheckinCampActionSheet = () => {
        this.setState({
            showCheckinCampActionSheet: false
        });
    }

    /**
     * 显示或隐藏训练营的回调
     * @param {*string} status 'Y' or 'N' 
     */
    onCampDisplayChange = (status) => {
        const activeCamp = this.data.activeCamp;
        this.setState({
            checkinCampList: this.state.checkinCampList.map((camp) => {
                if (camp.campId === activeCamp.campId) {
                    camp.displayStatus = status;
                }
                return camp;
            })
        });
    }

    /**
     * 删除训练营的回调
     */
    onCampDelete = () => {
        const activeCamp = this.data.activeCamp;
        this.setState({
            checkinCampList: this.state.checkinCampList.filter((camp) => {
                return camp.campId != activeCamp.campId;
            })
        });
    }

    /*----- 直播间首页新增训练营模块 -----*/
    /**
     * 显示页面底部的训练营操作弹框
     * @param {*object} camp 
     */
    displayTrainingActionSheet = (camp, index) => {
        this.data.activeTrainging = camp;
        this.setState({
            showTrainingActionSheet: true,
            trainingIndex: index + 1
        });
    }

    /**
     * 隐藏页面底部的训练营操作弹框
     */
    hideCheckinTrainingActionSheet = () => {
        this.setState({
            showTrainingActionSheet: false
        });
    }


    /**
     * 显示或隐藏训练营的回调
     * @param {*string} status 'Y' or 'N' 
     */
    onTrainingDisplayChange = (status) => {
        const activeCamp = this.data.activeTrainging;
        this.setState({
            trainingList: this.state.trainingList.map((camp) => {
                if (camp.id === activeCamp.id) {
                    camp.status = status;
                }
                return camp;
            })
        });
    }

    /**
     * 删除训练营的回调
     */
    onTrainingDelete = () => {
        const activeCamp = this.data.activeTrainging;
        this.setState({
            trainingList: this.state.trainingList.filter((camp) => {
                return camp.id != activeCamp.id;
            })
        });
    }

    showFunctionMenu(state) {
        this.setState({ functionMenuVisible: state })
    }
    
    toggleShowGuideToFocusDialog = () => {
        this.setState({isShowMiddlePage: !this.state.isShowMiddlePage});
    }

    // 显示企业认证信息
    handleCompany = () => {
        this.setState({
            isCompany: true
        });
    }

    // 关闭企业认证信息
    closeCompany = () => {
        this.setState({
            isCompany: false
        });
    }

    // 获取用户好友关系
    async getRelationInfo() {
        await this.props.dispatchFetchRelationInfo({userId: this.props.userInfo.userId});
    }

    // 进入通知中心
    goNoticeCenter = () => {
        locationTo('/wechat/page/notice-center?liveId='+this.liveId);
    }
    // 获取通知中心未读消息数量
    getUnreadCount = () => {
        return ;
        this.props.getUnreadCount(this.liveId);
    }

    calUnreadNum = (unreadMap) => {
        let sum = 0;
        Object.keys(unreadMap).forEach(key  => {
            sum += unreadMap[key];
        });
        return sum;
    }
    // 展示通知中心引导
    showNoticeCenterGuide() {
        if(this.props.power.allowMGLive && !localStorage.getItem("live-tip-notice-center")) {
            let destroy = render(
                <div 
                    style={
                        {
                            'position': 'absolute',
                            'height': '100%', 
                            'width': '100%',
                            'background': 'rgba(0,0,0,.7)',
                            'zIndex': '9'
                        }
                    }
                    onClick={
                        () => {
                            destroy();
                            localStorage.setItem("live-tip-notice-center", "Y");
                        }
                    }
                >
                    <img 
                        style={{
                            'width': '7.12rem',
                            'height': '3.0667rem',
                            'position': 'absolute',
                            'top': '.173333rem',
                            'right': '0.226667rem'
                        }}
                        src={require('./img/notice-guide-center.png')}
                        alt=""/>
                    <img 
                        style={{
                            'width': '4.52rem',
                            'height': '1.8267rem',
                            'position': 'absolute',
                            'top': '6.32rem',
                            'left': '50%',
                            'transform': 'translateX(-50%)'
                        }}
                        src={require('./img/notice-guide-click.png')}
                        alt=""/>
                </div>
            );
        }
    }

    async dispatchGetCommunity() {
        const res = await getCommunity(this.liveId, 'live', this.liveId);
        if(res) {
            this.setState({
                communityInfo: res
            });
            if(res.communityId) {
                const info = await request.post({
                    url: '/api/wechat/community/get',
                    body: {
                        id: res.communityId 
                    }
                })
                if(info.state.code === 0) {
                    const infoData = info.data;
                    this.setState({
                        communityInfo: {
                            createTime: infoData.createTime,
                            communityId: infoData.id,
                            communityCode: infoData.communityCode,
                            communityName: infoData.name,
                            showStatus: infoData.showStatus,
                            pushStatus: infoData.pushStatus,
                            invitedGroupMemberTotal: infoData.invitedGroupMemberTotal
                        }
                    });
                }
            }
        }
    }

    async changeCommunityShowStatus(status) {
          // 修改社群开启状态
          request.post({
            url: '/api/wechat/community/update',
            body: {
                id: this.state.communityInfo.communityId.toString(),
                name: this.state.communityInfo.communityName,
                liveId: this.liveId,
                businessId: this.liveId,
                type:'live',
                showStatus: status,
                pushStatus: this.state.communityInfo.pushStatus
            }
        }).then(res => {
            this.dispatchGetCommunity();
            this.hideGroupActionSheet();
        }).catch(err => {})
    }

    onClickGroup() { 
        let group = this.state.communityInfo;
        console.log('GROIUOP:',group)
        if(this.props.power.allowMGLive) { // B端
            if(group.communityCode) { // 绑定了直播间
                locationTo(`/wechat/page/community-qrcode?liveId=${this.liveId}&communityCode=${group.communityCode}`)
            } else {

            }
        } else { // C端
            if(group.communityCode) {
                locationTo(`/wechat/page/community-qrcode?liveId=${this.liveId}&communityCode=${group.communityCode}`)
            }
        }
    }

    toggleCommunityShowStatus() {
        if(this.state.communityInfo) {
            this.changeCommunityShowStatus(this.state.communityInfo.showStatus === 'Y' ? 'N' : 'Y');
        }
    }
    
    // TODO...使用防抖装饰器会造成合成事件对象复用问题
    // @throttle(300)
    scrollHandler(e) {
        if(!e.target.classList.contains("live-container")) return ;
        if(!this.state.tabList[0]) return ;
        const firstModuleDOM = document.querySelector(`.${this.state.tabList[0].ele}`);
        const top = e.target.scrollTop;
        let cur = null;
        if(firstModuleDOM.offsetTop <= top) {
            this.setState({
                showCourseTab: true
            });

            let tabBarHeight = (document.querySelector('.live-main-top-tab-bar') && document.querySelector('.live-main-top-tab-bar').offsetHeight) || 0;

            for(let i = 0; i < this.state.tabList.length; i ++) {
                let m = document.querySelector(`.${this.state.tabList[i].ele}`);
                if(!m) continue;
                let mo = m.offsetTop - (tabBarHeight + 10);
                if(top >= mo) {
                    cur = this.state.tabList[i].ele;
                } 
            }
            this.setState({
                currentTopTab: cur
            });

        } else {
            this.setState({
                showCourseTab: false
            })
        }
        
    }


    onTab(ele) {
        let element = document.querySelector(`.${ele} .anchor`);
        element && element.scrollIntoView({behavior: 'smooth', block: 'start'})
     }

    onAvartarClick() {
        if(this.props.power.allowMGLive) return ;
        locationTo(`/wechat/page/live/info/${this.liveId}`);
    }    

    onAvartarClick() {
        if(this.props.power.allowMGLive) return ;
        locationTo(`/wechat/page/live/info/${this.liveId}`);
    }    

    async getTagLists(type = ["topic", "liveCamp", "camp", "channel"], curTag = 0, callback) {
        const courseList = type;
        const requestList = [];
        courseList.forEach(key => {
            requestList.push(request.post({
                url: '/api/wechat/transfer/h5/businessTag/tagList',
                body: {
                    liveId: this.liveId,
                    businessType: key
                }
            }))
        });
        Promise.all(requestList).then((res) => {
            let tags = {};
            let currentTags = {};
            res.forEach((item, index) => {
                if(item.state.code === 0) {
                    let k = courseList[index] === "camp" ? "training" : courseList[index];
                    tags[`${k}Tags`] = item.data.tagList;
                    currentTags[`current${k}Tag`] = 0;
                    // 是否存在tag， 不存在则变成全部
                    let flag = item.data.tagList.find(tag => tag.id == curTag);
                    currentTags[`current${k}Tag`] = flag ? curTag : 0;
                }
            });
            this.setState({
                ...tags,
                ...currentTags
            }, () => {
                typeof callback === "function" && callback(currentTags);
            });
        }).catch(err => console.log(err));
    }

    /**
     * 切换标签
     * @param {string} type 课程类型 
     * @param {string|number} tagId 标签
     */
    // @throttle(2000)
    async onTagSwitch(type, tagId) {
    let res;
        try {
            switch(type) {
                case "channel":
                    res = await this.props.getChannel(this.liveId, this.props.channelPage, tagId, 'N', false);
                    break;
                case "checkinCamp":
                    res = await this.fetchCampList(tagId, false);
                    break;
                case "training":
                    res = await this.handleFetchTrainingList(tagId, false)
                    break;
                case "topic":
                    res = await this.props.getTopic(this.liveId, this.props.topicPage, tagId, false);
                    break;
                default:
                    return ;
            }            
            if(res) {
                let key;
                if(type === "checkinCamp") {
                    key = 'currentliveCampTag';
                } else {
                   key = `current${type}Tag`;
                }
                this.setState({
                    [key]: tagId
                });
            }
        } catch (error) {
            console.log(error);
        }
    }    

    // 直播间是否开通通用会员或者定制会员
    async getHasLiveVip() {
        request.post({
            url: '/api/wechat/transfer/h5/live/revonsitution/hasLiveVip',
            body: {
                liveId: this.liveId,
                source: 'h5',
                displayStatus: 'Y'
            }
        }).then(res => {
            if(res.state.code === 0) {
                this.setState({
                    hasLiveVip: res.data.hasLiveVip
                });
            }
        }).catch(err => {console.log(err)});
    }
    
    // 获取是否绑定公众号
    async getLiveisBindApp() {
        const res = await request.post({
            url: '/api/wechat/transfer/h5/live/revonsitution/liveIsBindApp',
            body: {
                liveId: this.liveId
            }
        })
        if(res.state.code === 0) {
            return res.data;
        }
    }

    // 获取是否上传公众号
    async getBindGong() {
        const res = await request.post({
            url: '/api/wechat/transfer/h5/live/revonsitution/getUploadAppInfo',
            body: {
                liveId: this.liveId
            }
        })   
        if(res.state.code === 0) return res;
    }

    async getBindAppQrCode(appId) {
        const res = await request.post({
            url: '/api/wechat/transfer/h5/live/getQr',
            body: {
                liveId: this.liveId,
                channel: 'home',
                showQl: 'N',
                appId
            }
        });
        if(res.state.code === 0) return res;
    }

    /**
     * 获取直播间公众号绑定情况 
     * 优先查找绑定公众号，无绑定公众号再查找上传公众号
     * */ 
    async getLiveApp() {
        const live  = await this.getLiveisBindApp();
        if(live.appId) {
            if(live.liveIsBindApp === true) {
                this.setState({
                    liveisBindApp: true,
                })
                const qr = await this.getBindAppQrCode(live.appId);
                if(qr.state.code === 0) {
                    this.setState({
                        liveAppQrCode: qr.data.qrUrl
                    });
                }
            }
            return ;
        }
        const gong = await this.getBindGong();
        if(gong.state.code === 0) {
            if(gong.data.liveEntityPo) {
                this.setState({
                    liveBindGong: true,
                    liveAppQrCode: gong.data.liveEntityPo.qrCode
                })
            }
        }
    }
    
    // 获取页面配置， 此处主要获取功能区配置
    async getPageConfig() {
        const res = await request.post({
            url: '/api/wechat/transfer/h5/live/admin/page-config',
            body: {
                liveId: this.liveId
            }
        });
        if(res.state.code === 0) {
            const liveFuncs = (res.data.config && res.data.config.liveFunction) || {};
            let list = [];
            if(liveFuncs && liveFuncs.functions) {
                list = liveFuncs.functions.filter(item => item.isShow === "Y");
            }
            this.setState({
                functionItem: list,
                isFunctionMenuShow: liveFuncs.isShow === "Y"
            })
            return res.data;
        }
    }

    getMenuItemImg(code) {
        let img;
        switch(code){
            case "introduce":
                img = "introduction"
                break;
            case "whisper_question":
                img = "question"
                break;
            case "vip":
                img = "member"
                break;
            case "course_table":
                img = "timetable"
                break;
            default:
                img = code;
        }
        return <Picture src={`https://img.qlchat.com/qlLive/liveCommon/moduleIcon/icon-${img}.png`} resize={{w:'90', h: "90", limit: '1'}}  />
    }

    render() {
        let entityExtend = (this.props.liveInfo && this.props.liveInfo.entityExtend) || { funcMenuShow: 'Y' };
        const { liveInfo = {}, power } = this.props;
        const {functionItem, isFunctionMenuShow} = this.state;
        const trainingConfig = liveInfo.training || {};
        const focusState = this.props.focusStatues.isFollow ?  (this.props.focusStatues.isAlert ? 'pass' : 'attention_pass') : (this.props.focusStatues.isAlert ? null : 'no_pass');
        
        return (
            <Page title={this.props.liveInfo && this.props.liveInfo.entity && this.props.liveInfo.entity.name ? this.props.liveInfo.entity.name : "直播间主页" } className='live-main' onScroll={this.scrollHandler}>
                <TopTabBar 
                    show={this.state.showCourseTab} 
                    tabs={this.state.tabList} 
                    currentTab={this.state.currentTopTab} onTab={this.onTab}
                />
                {
                    this.props.power.allowMGLive &&
                    
                        <FunctionMenu
                            key='menu'
                            liveId={this.liveId}
                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                            functionMenuVisible={this.state.functionMenuVisible}
                            shortDomainUrl = {this.state.shortDomainUrl}
                        />
                    
                }
                {
                    this.props.power.allowMGLive && this.addBtnDom ?
                    createPortal(
                        <FunctionBtn
                            key='btn'
                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                        />,
                        this.addBtnDom
                    ) : null
                    
                }
                <div className={`live-container co-scroll-to-load`}>
                    {
                        this.state.showTopTopic && !this.props.power.allowMGLive && this.props.focusStatues.isFollow && this.props.focusStatues.isShowQl && !this.props.focusStatues.subscribe&& this.tracePage !== 'coral' ?
                            <div className="top-tip" onClick={this.topTipHandel}>
                                <div className="left">
                                    <span className="icon_warning"></span>暂时无法收到新课提醒，点击恢复
                                </div>
                                <div className="right">
                                    <span className="icon_cross"></span>
                                </div>
                            </div>
                        : ""
                    }
                    {/* <div className="bg-wrap"> */}
                    <TopSearchBar 
                        liveisBindApp={this.state.liveisBindApp}
                        onQrCode={() => {this.setState({showLiveQrcodeDialog: true})}}
                        shareQualify={this.props.shareQualify}
                        hasLiveVip={this.state.hasLiveVip}
                        isBindApp={!!this.state.liveAppQrCode}
                        allowMGLive={this.props.power.allowMGLive} 
                        newMessageCount={this.calUnreadNum(this.props.unreadMap)}
                        onClickNoticeCenter={this.goNoticeCenter}  
                        liveId={this.liveId} 
                    />
                    <div className="header-bar">
                        <div className="left-con">
                            <div className="live-log on-log" data-log-region="head" onClick={this.onAvartarClick}>
                                <div className="c-abs-pic-wrap"><Picture src={this.props.liveInfo.entity.logo} placeholder={true} resize={{w:'100',h:"100"}} /></div>
                            </div>
                            <div className="live-header-middle-con">
                                <div className={`live-name ${this.props.power.allowMGLive ? "b-end" : ""}`}>
                                    <div className="name">{this.props.liveInfo.entity.name}</div>
                                </div>
                                    <SymbolList className="symbol-list"
                                        symbolList={[...this.props.symbolList]}
                                        isCompany = { Object.is(this.state.enterprisePo.status, 'Y') }
                                        isReal={this.state.checkUserStatus == 'pass'}
                                        isallowGLive={this.props.power.allowMGLive}
                                        isLiveCreator={this.state.isLiveCreator}
                                        handleRealNameBtnClick={this.handleRealNameBtnClick}
                                        showPyramidDialog={this.pyramidClick}
                                        handleVClick={this.handleVClick}
                                        handleTClick={this.handleTClick}
                                        handleHotClick={this.handleHotClick}
                                        handleDaiClick={this.handleDaiClick}
                                        handleCompany={ this.handleCompany }
                                        handleDoctorBtnClick={this.handleDoctorBtnClick}
                                    />
                                {
                                    this.props.liveInfo.entity.fansNum > 0  && !this.state.isOfficial ?
                                        <div className="focus-num">{digitFormat(this.props.liveInfo.entity.fansNum)}人关注</div>
                                    : ""
                                }
                            </div>
                        </div>
                        <div className="right-con">
                            {
                                !this.props.power.allowMGLive && focusState !== undefined ?
                                    <div
                                        className={`on-log ${focusState === "pass" ? "focus-tag focused" : "focus-tag"}`}
                                        onClick={this.onClickFocus}
                                        log-region = {
                                            `${focusState === "pass" ? "cancel-focus" : ""} 
                                            ${focusState === "attention_pass" ? "subscriber" : ""} 
                                            ${focusState === "no_pass" ? "focus" : ""}`
                                        }
                                    >
                                        {
                                            focusState === "no_pass" && "关注"
                                        }
                                        {
                                            focusState === "attention_pass" && "订阅动态"
                                        }
                                        {
                                            focusState === "pass" && "取消关注"
                                        }
                                    </div> : ""
                            }
                            <div className="live-name-btn-wrap">
                                {
                                    this.props.power.allowMGLive &&
                                    <>
                                        <Link className='live-name-btn on-log on-visible' data-log-region="fitUp" to={`/wechat/page/live-studio/custom/${this.props.liveId}`}><img src={require('./img/custom.png')} alt=""/></Link>
                                      
                                        <Link className='live-name-btn on-log on-visible' data-log-region="QRcode" data-log-pos="B" to={`/wechat/page/service-number-docking?liveId=${this.props.liveId}`}><img src={require('./img/qr.png')} alt=""/></Link>

                                        <Link className='live-name-btn on-log on-visible' data-log-region="shareLiveCard" data-log-pos="B"  to={`/wechat/page/sharecard?type=live&liveId=${this.props.liveId}`}><img src={require('./img/invite.png')} alt=""/></Link>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                    {
                        // C端页面，没有轮播图不显示轮播图模块
                        (!this.props.power.allowMGLive && this.props.bannerList.length <= 0) ?
                        null :
                    <div className="banner-wrap">
                        <div className="banner">
                        {
                            this.props.bannerList.length > 1 ?
                                <Swiper
                                    ref="swiperObj"
                                    className='banner-swiper'
                                    key={this.state.bannersFlag}
                                    swipeOptions={{ auto: 5000, callback: this.onSwiped.bind(this) }}
                                >
                                    {
                                        this.props.bannerList.map((item, index) => (
                                            <div
                                                key={`banner-swiper-item${index}`}
                                                className='banner-swiper-item on-log on-visible'
                                                data-log-region="banner"
                                                onClick={this.gotoHandle.bind(this, item.link, item.type, item.businessId)}
                                            >
                                                <span style={{ backgroundImage: `url(${item.imgUrl}?x-oss-process=image/resize,m_fill,limit_1,w_710,h_206)` }}></span>
                                            </div>
                                        ))
                                    }
                                </Swiper>
                                : 
                                <div className="banner-container">
                                    {
                                        this.props.bannerList.length > 0 ? this.props.bannerList.map((item, index) => (
                                            <div
                                                key={`banner-item${index}`}
                                                className='banner-item on-log on-visible'
                                                data-log-region="banner"
                                                onClick={this.gotoHandle.bind(this, item.link, item.type, item.businessId)}
                                            >
                                                <span>
                                                    <div className="banner-pic-wrap"><Picture src={item.imgUrl} placeholder={true} resize={{w:'710', h: '206', m: "fill"}}/></div>
                                                </span>
                                            </div>
                                        ))
                                            : this.props.liveInfo.entity.headerBgUrl ?
                                                <div
                                                    key={`banner-item`}
                                                    className='banner-item on-log on-visible'
                                                    data-log-region="banner"
                                                >
                                                    <span>
                                                        <div className="banner-pic-wrap"><Picture src={this.props.liveInfo.entity.headerBgUrl} placeholder={true} resize={{w:'710', h: '206', m: "fill"}} /></div>
                                                    </span>
                                                </div>
                                                :
                                                <div
                                                    key={`banner-item`}
                                                    className='banner-item on-log on-visible'
                                                    data-log-region="banner"
                                                >
                                                    <span>
                                                        <div className="banner-pic-wrap"><Picture src="https://img.qlchat.com/qlLive/activity/image/XWGRSQI9-JUD2-5BDP-1574251608851-O3149GB9FPS7.png" placeholder={true} resize={{w:'710', h: '206', m: "fill"}} /> /></div>
                                                    </span>
                                                </div>

                                    }
                                </div>
                                

                        }
                        {
                            this.props.bannerList.length > 1 &&
                            <Indicator
                                size={this.props.bannerList.length}
                                activeIndex={this.state.activeBannerIndex}
                                onItemClick={this.handleIdicatorItemClick.bind(this)}>
                            </Indicator>
                        }
                        {
                            this.props.power.allowMGLive ?
                                <div className="edit on-log on-visible" data-log-region="editBanner" onClick={this.gotoHandle.bind(this, "/wechat/page/live/banner/" + this.props.liveId)}>编辑</div> : ""
                        }
                    </div>
                    </div>
    }
                    {
                        !power.allowMGLive && (isFunctionMenuShow !== true || !functionItem || functionItem.length <= 0 || functionItem.filter(item => item.isShow === "Y").length <= 0) ? 
                        null
                        :
                        <div className="menu">
                            {
                                (isFunctionMenuShow === true && functionItem && functionItem.length > 0 && functionItem.filter(item => item.isShow === "Y").length > 0) ?
                                    <div className="menu-container">
                                        {
                                            this.state.functionItem.filter(item => {return BASE_ADMIN_FUNCS.includes(item.code) && item.isShow === 'Y'}).map(item => {
                                                
                                                return <div
                                                    key={`menu-tab-${item.code}`}
                                                    className="menu-item on-log on-visible"
                                                    onClick={()=>{this.functionClickHandle(item)}}
                                                    data-log-region="live-menu"
                                                    data-log-pos={item.code}
                                                    data-log-name={item.name}
                                                    data-log-business_type="tab"
                                                    data-log-business_id={item.name}
                                                >
                                                    <div className="img">
                                                        <div className="c-abs-pic-wrap">
                                                            {this.getMenuItemImg(item.code)}
                                                        </div>
                                                    </div>
                                                    <div className="text">
                                                        {item.name}
                                                    </div>
                                                </div>
                                                    

                                            })
                                        }
                                       
                                    </div>
                                : 
                                    power.allowMGLive ?
                                    <div className="menu-empty-wrap" onClick={() => {locationTo(`/wechat/page/live-studio/custom/${this.liveId}`)}}>
                                        <div className="menu-empty">
                                            <div className="icon"><img src={require('./img/add_btn.png')} alt=""/></div>
                                            <div className="content">
                                                <p className="title">你未设置功能区，<a href="javascript:void(0)">前往设置 ></a></p>
                                                <p className="desc">可以自定义课程专辑：“特惠课程”、“精选课程”等</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null                                
                            }


                        </div>
                    }


                    {
                        !!this.state.knowledgeList &&
                        <MiniKnowledgeList
                            knowledgeList={this.state.knowledgeList.slice(0, 20)}
                            showPlayNumStatus={"Y"}
                            onLinkClick={locationTo.bind(this, "/wechat/page/short-knowledge/video-list?liveId=" + this.props.liveId)}
                        />
                    }

                    {
                        <MiniTimeLineList
                            title={ '最新动态' }
                            timeline={ this.props.timeline.slice(0, 2)}
                            power={ this.props.power }
                            liveId={this.props.liveId}
                            onLinkToEdit={ locationTo.bind(this, '/wechat/page/timeline/choose-type?liveId=' + this.liveId) }
                            onLinkClick={ locationTo.bind(this, "/wechat/page/live/timeline/" + this.props.liveId) }
                        />
                    }
                    {
                        <MiniChannelList
                            tags={this.state.channelTags}
                            currentTag={this.state.currentchannelTag}
                            onSwitch={this.onTagSwitch}
                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=channel`)}}
                            onSort={() => {locationTo(`/wechat/page/channel-sort/${this.liveId}`)}}
                            title={ '系列课' }
                            channelList={ this.props.channelList.filter(item => item.displayStatus === 'Y') }
                            auditStatus = {this.props.location.query.auditStatus || ''}
                            power={ this.props.power }
                            sysTime={ this.props.sysTime }
                            openChannelBottomMenu={ this.openChannelBottomMenu }
                            noMore={ this.props.noMoreChannel }
                            onLinkClick={ locationTo.bind(this, `/wechat/page/live-channel-list/${this.props.liveId}`) }
                            loadMoreChannel={ this.loadMoreChannel }
                        />
                    }

                    {
                        <MiniTrainingListV2 
                            tags={this.state.trainingTags}
                            currentTag={this.state.currenttrainingTag}
                            onSwitch={this.onTagSwitch}
                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=camp`)}}
                            onSort={() => {locationTo(`/wechat/page/course-sort?liveId=${this.liveId}&type=camp`)}}
                            title={ '训练营' }
                            trainingList={ this.state.trainingList }
                            clientRole={this.props.power.allowMGLive ? 'B' : 'C'}
                            sysTime={ this.props.sysTime }
                            power={ this.props.power }
                            onLinkToEdit={ locationTo.bind(this, '/wechat/page/timeline/choose-type?liveId=' + this.liveId) }
                            onLinkClick={ locationTo.bind(this, "/wechat/page/live-studio/training-list/" + this.props.liveId) }
                            openTrainingBottomMenu={ this.displayTrainingActionSheet }
                        />
                    }

                    {
                        <MiniCheckinCampList
                            tags={this.state.liveCampTags}
                            currentTag={this.state.currentliveCampTag}
                            onSwitch={this.onTagSwitch}
                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=liveCamp`)}}
                            onSort={() => {locationTo(`/wechat/page/course-sort?liveId=${this.liveId}&type=liveCamp`)}}
                            title={ '打卡' }
                            checkinCampList={ this.state.checkinCampList.filter(item => item.displayStatus === 'Y') }
                            power={ this.props.power }
                            sysTime={ this.props.sysTime }
                            openCheckinCampBottomMenu={ this.displayCheckinCampActionSheet }
                            liveId={this.props.liveId}
                        />
                    }
                    
                    {
                        <MiniTopicList
                            tags={this.state.topicTags}
                            currentTag={this.state.currenttopicTag}
                            onSwitch={this.onTagSwitch}
                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=topic`)}}
                            onSort={() => {locationTo(`/wechat/page/topics-sort/${this.liveId}`)}}
                            title={ '单课' }
                            topicList={ this.props.topicList.filter(item => item.displayStatus === 'Y') }
                            auditStatus = {this.props.location.query.auditStatus || ''}
                            power={ this.props.power }
                            sysTime={ this.props.sysTime }
                            openTopicBottomMenu={ this.openTopicBottomMenu }
                            noMore={ this.props.noMoreTopic }
                            onLinkClick={ locationTo.bind(this, `/wechat/page/live-topic-list/${this.props.liveId}`) }
                            loadMoreTopic={ this.loadMoreTopic }
                        />
                    }

                    <MiniGroupList
                        key={ `page-menu-community` }
                        title={'我的社群'}
                        openBottomMenu={this.showGroupActionSheet}
                        group={this.state.communityInfo}
                        power={this.props.power}
                        isShowCreateTime = {"Y"}    
                        isShowJoinNum = {"Y"} 
                        onClickGroup={this.onClickGroup}
                        onClickOpenGroup={() => {this.setState({isShowGroupDialog: true})}}  
                    />

                        {
                        (this.state.trainingList && this.state.trainingList.length <= 0) && 
                        (this.props.channelList && this.props.channelList.length <= 0) && 
                        (this.state.checkinCampList && this.state.checkinCampList.length <= 0) && 
                        (this.props.topicList && this.props.topicList.length <= 0) && 
                        <div className="course-empty-placeholder">
                            <img src={require('./img/empty.png')} alt=""/>
                            <p>还没有创建课程哦</p>
                        </div>
                    }


                    {!this.props.power.allowMGLive&&
                        <BottomBrand 
                            liveId={this.props.liveId} 
                            chtype="create-live_live" 
                            liveisBindApp={this.state.liveisBindApp}
                            onFocusUs={() => {this.setState({showLiveQrcodeDialog: true})}}
                            createAdvance={true}
                        ></BottomBrand>}
                </div>

                {
                    this.state.showInfo ?
                        <div className="liveIntro-back" onClick={this.closeInfoHandle}>
                            <div className={this.props.liveInfo.entity.qrCode ? "live-intro-con show-third" : "live-intro-con"}>
                                <div className="top">
                                    <div className="head-block">
                                        <img src={imgUrlFormat(this.props.liveInfo.entity.logo, '@130w_130h_1e_1c_2o')} />
                                    </div>
                                </div>
                                {
                                    this.state.showThirdQrBlock ?
                                        <div className="third-qr live-intro show-third">
                                            <img src={this.state.thirdQrCode} />
                                            <div className="text">长按二维码关注公众号</div>
                                        </div>
                                    :
                                    <div className={this.props.liveInfo.entity.qrCode ? "live-intro show-third" : "live-intro"}>
                                        <div className="title">{this.props.liveInfo.entity.name}</div>
                                        <div className="intro" dangerouslySetInnerHTML={dangerHtml(this.props.liveInfo.entity.introduce && this.props.liveInfo.entity.introduce.replace(/\n/g, '<br/>'))}></div>
                                        <div className="intro-photo">
                                            {this.props.liveIntroPhotoList.map((item) => {
                                                return (
                                                    <div className="intro-photo" key={"intro-photo-" + item.sortNum}>
                                                        <img src={item.url} alt="" />
                                                        <div className="msg">{item.msg}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {
                                            this.isVerificationLive() ?
                                                <div className="verification-info">
                                                    <div className="v-title">认证信息</div>
                                                    <div className="v-time">认证日期： {formatDate(this.verificationTime(), 'yyyy年MM月dd日')}完成千聊直播间认证</div>
                                                    <div className="v-des">认证说明： 千聊直播间认证是千聊官方对于直播间创建者身份和资质的真实性和合法性进行甄别和核实的过程。千聊是给创建者提供在线分享的工具和平台。</div>
                                                </div>
                                            : ""
                                        }
                                    </div>
                                }


                                {
                                    this.props.liveInfo.entity.qrCode ?
                                        <div className="third" onClick={this.thirdQrBlockHandle}>
                                            {
                                                this.state.showThirdQrBlock ?
                                                    <div>返回直播间简介</div>
                                                :
                                                <div><span className="focus-third"></span> 关注公众号</div>
                                            }
                                        </div> : ""
                                }

                            </div>
                            {

                            }
                        </div>

                    : ""
                }

                {
                    this.state.showCheckinCampActionSheet &&
                    <CheckinCampActionSheet
                        show={this.state.showCheckinCampActionSheet}
                        activeCamp={this.data.activeCamp}
                        hideActionSheet={this.hideCheckinCampActionSheet}
                        onCampDelete={this.onCampDelete}
                        onCampDisplayChange={this.onCampDisplayChange}
                        index={this.state.checkinCampIndex}
                        liveId={this.liveId} 
                        updateCheckinCamp={() => {this.fetchCampList(this.state.currentliveCampTag, false)}}    
                        onChangeTag={ 
                            () => {
                                this.getTagLists(['liveCamp'], this.state.currentliveCampTag, (tag) => {
                                    this.onTagSwitch("checkinCamp",tag["currentliveCampTag"])
                                });
                            }
                        }
                    />
                }
                {
                    this.state.showTrainingActionSheet &&
                    <TrainingActionSheet
                        show={this.state.showTrainingActionSheet}
                        activeCamp={this.data.activeTrainging}
                        hideActionSheet={this.hideCheckinTrainingActionSheet}
                        onCampDelete={this.onTrainingDelete}
                        onCampDisplayChange={this.onTrainingDisplayChange}
                        index={this.state.trainingIndex}
                        onChangeTag={ 
                            () => {
                                this.getTagLists(['camp'], this.state.currenttrainingTag, (tag) => {
                                    this.onTagSwitch("training",tag["currenttrainingTag"])
                                });
                            }
                        }
                        liveId={this.liveId} />
                }

                {
                    this.state.showTopicActionSheet &&
                    <TopicActionSheet
                        liveId={ this.props.liveId }
                        show={ this.state.showTopicActionSheet }
                        hideActionSheet={ this.hideTopicActionSheet }
                        activeTopic={ this.state.activeTopic }
                        index={this.state.topicIndex}
                        onChangeTopicHidden={ this.onChangeTopicHidden }
                        onChangeTag={ 
                            () => {
                                this.getTagLists(['topic'], this.state.currenttopicTag, (tag) => {
                                    this.onTagSwitch("topic",tag["currenttopicTag"])
                                });
                            }
                        }
                    />
                }

                <ChannelActionSheet
                    show={ this.state.showChannelActionSheet }
                    liveId={ String(this.props.liveId) }
                    hideActionSheet={ this.hideChannelActionSheet }
                    activeChannel={ this.state.activeChannel }
                    index={this.state.channelIndex}
                    activeTag={ '0' }
                    onChangeTag={
                        () => {
                            this.getTagLists(['channel'], this.state.currentchannelTag, (tag) => {
                                this.onTagSwitch("channel",tag["currentchannelTag"])
                            });
                        }
                    }
                />

                <GroupBottomActionSheet 
                    show={ this.state.showGroupActionSheet }
                    liveId={ String(this.props.liveId) }
                    hideActionSheet={ this.hideGroupActionSheet }
                    communityInfo={this.state.communityInfo}
                    toggleShowStatus={this.toggleCommunityShowStatus}
                />

                {/* 实名认证弹框  */}
				<NewRealNameDialog
                    close={true}
                    show = {this.state.isShowRealName}
                    onClose = {this.closeRealName.bind(this)}
                    realNameStatus = {this.props.auditedStatues || 'unwrite'}
                    checkUserStatus = { this.state.checkUserStatus }
                    isClose={true}
                    isLiveCreator={this.state.isLiveCreator}
                    liveId = {this.props.liveId}
                />

                {/* 企业弹窗 */}
                <CompanyDialog
                    show = {this.state.isCompany}
                    enterprisePo={this.state.enterprisePo}
                    onClose = {this.closeCompany}/>

                {/* 直播间加V  */}
                <LiveVDialog
                    show={this.state.isShowVBox}
                    onClose={this.closeVBox.bind(this)}
                />

                {/* 教师节弹框  */}
                <TeacherCupDialog
                    show={this.state.isShowTBox}
                    onClose={this.closeTBox.bind(this)}
                />


                {/*金字塔弹框  */}
                <PyramidDialog
                    show={this.state.isShowPyramidBox}
                    onClose={this.closePyramid}
                />

                <DoctorDialog
                    show={this.state.isShowDoctor}
                    onClose={this.closeDoctorBtnHandle}
                />


                {/* 热心拥趸  */}
                <HotHeart
                    show={this.state.isShowHotBox}
                    onClose={this.closeHotBox.bind(this)}
                />

                {/* 代言人  */}
                <Spokesperson
                    show={this.state.isShowDaiBox}
                    onClose={this.closeDaiBox.bind(this)}
                />


                {/* 关注公众号 */}
                <FollowDialog 
                    ref={ dom => dom && (this.followDialogDom = dom) }
                    title={ this.state.followDialogTitle }
                    desc={ this.state.followDialogDesc }
                    qrUrl={ this.state.focusQrCode }
                    relationInfo={this.state.relationInfo}
                    option={ this.state.followDialogOption }
                    qrcodeBoxType={this.state.qrcodeBoxType}
                    joinCommunityConfirm={this.joinCommunityConfirm}
                    focusLiveConfirm = {this.focusLiveConfirm.bind(this)}
                    relationInfo = {this.props.relationInfo}
				/>

                {/* C端添加社群引导组件 */}
                {
                    !this.props.power.allowMGLive && this.state.existCommunity &&
                    <CommunityGuideModal 
                        liveId={this.liveId}
                        show={this.state.showCommunityGuideModal}
                        type={this.state.modalType}
                        groupName={this.state.communityName}
                        communityCode={this.state.communityCode}
                        onClose={this.toggleCommunityGuideModal}
                    />
                }

                {
                    this.state.showLiveTopTipDialog ?
                        <div className="topTip-qrCode-dialog-back" onClick={this.closeTopTipDialogHandle}>
                            <div className="topTip-qrCode-dialog">
                                <div className="head-img-con">
                                    <img className="headImg" src={imgUrlFormat(this.props.liveInfo.entity.logo, '@130w_130h_1e_1c_2o')} alt="" />
                                </div>
                                <div className="title">{this.props.liveInfo.entity.name}</div>
                                <div className="text">仅差一步就可以收到我的开课提醒啦</div>
                                <QRImg 
                                    src={this.state.topTipQrCode}
                                    traceData="baseLiveFocusQlchatQrcode"
                                    channel="205"
                                    appId={this.state.topTipQrCodeAppId}
                                    className="qrCode"
                                />
                                <div className="bottom">长按扫描二维码，开启服务</div>
                            </div>
                        </div> : ""
                }

                <MiddleDialog
					show={this.state.isShowGroupDialog}
					title = "如何开启社群?"
					buttons="cancel"
					buttonTheme="line"
					cancelText="我知道了"
					onBtnClick={() => {this.setState({
						isShowGroupDialog: false
					})}}
					className="live-group-dialog group-entrance-understand-dialog"
				>
					<div className="content">
                        <p>
							可登陆千聊PC端后台社群首页<span>（http://v.qianliao.tv)</span>
                            社群首页，选择关联类型为直播间。
						</p>
						<br />
						<p>
							关联后，你的学员将会通过直播间首页的社群入口加入微信群。
						</p>
						<br />
						<p>
                            通过开启社群，能更好的帮助老师沉淀学员，提升课程触达率和转化率。
						</p>
					</div>
				</MiddleDialog>

                <MiddleDialog
                    show={this.state.showLiveQrcodeDialog}
                    close={true}
                    buttons="none"
                    onClose={() => {this.setState({showLiveQrcodeDialog: false})}}
					className="live-qrcode-dialog"
				>
					<div className="content">
						<div className="avartar"><img src={this.props.liveInfo.entity.logo} /></div>
                        <p className="name">
                            {this.liveName}
                        </p>
                        <p className="desc">
                            这是我的公众号，关注查看更多干货内容，一对一交流
                        </p>
                        <div className="qrcode">
                        {
                            this.state.liveAppQrCode && 
                            <img src={this.state.liveAppQrCode} />
                        }
                        </div>
                        <p className="tip">长按识别二维码</p>
					</div>
				</MiddleDialog>

                <MiddleDialog
                    show={this.state.showCancelFocusDialog}
                    close={true}
                    buttons="none"
                    onClose={() => {this.setState({showCancelFocusDialog: false})}}
					className="cancel-focus-dialog"
				>
					<div className="content">
                        <p className="title">确定要取消关注吗？</p>
                        <p className="desc">取消关注后，你将无法收到新课上架，课程促销，优惠券派送等信息</p>
                        <div className="btn-wrap">
                            <div className="btn ghost" onClick={() => {this.setState({showCancelFocusDialog: false})}}>再想想</div>
                            <div className="btn" onClick={this.focusHandle}>确定</div>
                        </div>
					</div>
				</MiddleDialog>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        power: state.live.power,
        liveInfo: state.live.liveInfo,
        createBy: state.live.liveInfo.entity.createBy,
        symbolList: state.live.liveSymbol,
        focusStatues: state.live.focusStatues,
        liveId: state.live.liveInfo && state.live.liveInfo.entity && state.live.liveInfo.entity.id,
        sysTime: state.common.sysTime,

        auditedStatues: state.live.auditedStatues,

        timeline: state.live.timeline,
        timelineIdx: state.live.timelineIdx,
        timelinePage: state.live.timelinePage,
        noMoreTimeline: state.live.noMoreTimeline,

        topicList: state.live.topicList,
        topicIdx: state.live.topicIdx,
        topicPage: state.live.topicPage,
        noMoreTopic: state.live.noMoreTopic,

        checkinCampList: state.live.checkinCampList,
        channelList: state.live.channelList,
        channelIdx: state.live.channelIdx,
        channelPage: state.live.channelPage,
        noMoreChannel: state.live.noMoreChannel,

        topicNum: state.live.topicNum,
        channelNum: state.live.channelNum,
        liveIntroPhotoList: state.live.liveIntroPhotoList,

        bannerList: state.live.mgrBannerList,

        shareQualify: state.live.shareQualify,
        userInfo: state.live.userInfo || {},
        liveMiddlepageCourse: state.live.liveMiddlepageCourse,
        relationInfo: state.common.relationInfo,
        unreadMap: state.noticeCenter.unreadMap,
    }
}

const mapActionToProps = {
    liveFocus,
    loadTimeline,
    changeTimelineIdx,
    changeChannelIdx,
    changeTopicIdx,
    getChannelNumAndTopicNum,
    getLiveInfo,
    getPower,
    getChannel,
    getTopic,
    getLiveIntroPhoto,
    liveGetQr,
    liveSetAlert,
    liveGetSubscribeInfo,
    liveGetFollowInfo,
    initBannerList,
    initLiveSymbolList,
    getRealStatus,
    getCheckUser,
    liveGetFollowNum,
    setAuditedStatues,
    initLiveShareQualify,
    bindLiveShare,
    getUserInfo,
    userBindKaiFang,
    addPageUv,
    toggleDisplayMenu,
    subscribeStatus,
    isFollow,
    getQr,
    getLiveMiddlepageCourse,
    fetchRelationInfo,
    dispatchFetchRelationInfo,
    getUnreadCount,
}

module.exports = connect(mapStateToProps, mapActionToProps)(BaseLiveMain);
