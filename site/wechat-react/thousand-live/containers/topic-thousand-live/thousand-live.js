const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { autobind, throttle, deprecated } from 'core-decorators';
import { EventEmitter } from 'events';
import { get } from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import openApp from 'components/open-app';
import GroupEntranceBar from 'components/group-entrance-bar';

import Page from 'components/page';
import {
	locationTo,
	imgUrlFormat,
    getCookie,
    delCookie,
	wait,
	setLocalStorageArrayItem,
	localStorageSPListAdd,
	htmlTransferGlobal,
    updatePercentageComplete,
    updateLearningTime,
    updateTopicInChannelVisit,
    isNextDay,
    setLocalStorage,
    randomShareText,
    getVal,
    isFromLiveCenter, 
    setCookie
} from 'components/util';
import { fillParams } from 'components/url-utils';
import Detect from 'components/detect';
import LanternSlide from './components/lantern-slide';
import BottomSpeakBar from './components/bottom-speak-bar';
import BottomSpeakBarClient from './components/bottom-speak-bar-client';
import BottomControlDialog from './components/bottom-control-dialog';
import SpeakListVideo from './components/speak-list-video';
import LuckyMoney from './components/lucky-money';
import TopLiveBar from './components/top-live-bar';
import ShareRankCard from './components/share-rank-card';
import VideoPlayer from './components/dialogs/video-player';
import SomebodyTyping from './components/somebody-typing';
import DiplomaDialog from './components/diploma-dialog';
import QrCode from 'components/qrcode';
import TipsCard from 'components/tips-card';
import { ScholarshipDialog } from 'components/scholarship-menu';
import InfoCard from './components/info-card';
import RedPackCard from "./components/redpack-card";
import BottomQrcode from './components/bottom-qrcode';
import AppDownloadBar from 'components/thousand-live-app-download-bar/app-download-bar';
import JobReminder from 'components/job-reminder';
import JobListDialog from 'components/dialogs-colorful/job-list-dialog'
import TryListenStatusBar from 'components/try-listen-status-bar';
import TryListenShareMask from 'components/try-listen-share-mask';

import { Confirm} from 'components/dialog';
import { share } from 'components/wx-utils';
import { AudioPlayer } from 'components/audio-player';
import CommentList from './components/comment-list';
import QuestionList from './components/question-list';
import BeginQrcodeDialog from './components/dialogs/begin-qrcode';
import FollowQrcode from './components/dialogs/follow-qrcode';
import RewardCard from './components/reward-card';
// import CommencementQrcode from './components/dialogs/commencement-qrcode';
import { showShareSuccessModal } from 'components/dialogs-colorful/share-success';
import ArchivementCardBtn from 'components/archivement-card/button';
import ArchivementCardModal from 'components/archivement-card/modal';

import BarrageList from './components/barrage-list';
import BarrageLuckyMoney from './components/barrage-lucky-money';
import ControlButton from './components/control-button';
import PushTopicDialog from 'components/dialogs-colorful/push-dialogs/topic';
import SpeakMsgFirstQrDialog from './components/dialogs/speak-msg-first-dialog';
import RedpackDialog from './components/redpack-dialog';

import EditMyTitleDialog from './components/dialogs/edit-my-title';
import BottomEditTitle from './components/bottom-edit-title';
import GoToReplyBtn from './components/go-to-reply-btn';
import IncrFansFocusGuideDialog from './components/incr-fans-focus-guide-dialog';
import CourseListDialog from './components/course-list-dialog';
import SubscriptionBar from 'components/subscription-bar';
import animation from 'components/animation'
import { eventLog,logPayTrace } from 'components/log-util';
import FunctionTips from './components/function-tips';
import { fixScroll, resetScroll } from 'components/fix-scroll';
import AppDownloadConfirm from 'components/app-download-confirm';
import InviteFriendsToListen from 'components/invite-friends-to-listen';
// import drawRewardCard from './components/drawRewardCard';
import BackTuitionDialog from 'components/back-tuition-dialog';

import { doPay, isServiceWhiteLive, getQlLiveIds, subscribeStatus, isFollow as checkFollow, whatQrcodeShouldIGet, getUserTopicRole, checkShareStatus, fetchShareRecord, uploadTaskPoint, request,  } from 'common_actions/common'
import { topicJodLists, isAuthChannel,getCommunity } from 'common_actions/common';
import { getCouponForIntro, getPacketDetail, updatePacketPopStatus } from 'common_actions/coupon';

import {
	getShareRate,
} from 'common_actions/live';

import { getPersonCourseInfo } from "common_actions/coral";
import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import {
    dispatchFetchRelationInfo,
    uploadImage,
    uploadRec,
    uploadAudio,
    uploadDoc,
    getSysTime,
    getUserInfo,
    getCreateLiveStatus,
    isLiveAdmin,
    getQr,
} from 'thousand_live_actions/common';


import {
    setMute,
    setRewordDisplay,
    setRewordDisplayStatus,
    followLive,
    setCanAddSpeak,
    updateMute,
    getGuestList,
    saveFile,
    getLikesSet,
    bindShareKey,
    setTitle,
    fetchEndTopic,
    addPageUv,
    pushAchievementCardToUser,
    setCanPopDownloadBar,
    toggleAppDownloadOpen,
    fetchQrImageConfig,
    fetchChargeStatus,
    fetchLastOrNextTopic,
    initDiplomaMes,
    fetchRewardQRCode,
    userBindKaiFang,
    dispatchGetShareCommentConfig,
    dispatchSaveShareCommentConfig,
    getRelayDelSpeakIdList
} from 'thousand_live_actions/thousand-live-common';

import { getChannelInfo,getJoinCampInfo, studyTopic, dispatchGetCourseConfig } from '../../actions/thousand-live-common';

import {
    addTopicSpeak,
    getTopicSpeakList,
    revokeTopicSpeak,
    fetchShareRankCardItems,
    getMyQualify,
    addComment,
    deleteComment,
    fetchCommentList,
    appendQuetionList,
    getQuestionList,
    bannedToPost,
    changeSpeaker,
    AssemblyAudio,
    textOrAudioSwitch,
    updateTextOpen,
    updateAudioOpen,
    loadTargetSpeakById,
	clearReplySpeak,
    addTopicListMsg,
    updateTopicListMsg,
    delTopicListMsg,
    getPPT,
    initBarrageList,
    deleteBarrageItem,
    updateCommentList,
    updateCommentIndex,
    setCommentCacheModel,
    getOutlineList,
    updateOutline,
    getTopicAutoShare,
    getChannelAutoShare,
    fetchTotalSpeakList,
    receiveRedEnvelope,
    getMyReceiveDetail,
    updateRedEnvelope,
    // getPersonCourseInfo,
    oneTimePushSubcirbeStatus,
    getCouponAllCount,
    addShareComment
} from 'thousand_live_actions/thousand-live-normal';



import {
    liveBanned ,
    getIsQlLive,
    setUniversityCurrentCourse,
} from 'thousand_live_actions/live';
import { startSocket } from 'thousand_live_actions/websocket';


import { apiService } from 'components/api-service';
import DialogMoreUserInfo from 'components/dialogs-colorful/more-user-info/index';

// 语音速度档次
const AUDIO_SPEED_RATE_MAP = [0.7, 1, 1.2, 1.5, 2];

@autobind
class ThousandLive extends Component {

    data = {
        liveId: '0',
        topicId: '0',

        // 是否在加载下一页
        loadingNext: false,
        //进入页面的时间戳
        currentTimeMillis:0,
        // 正在播放中音频所在消息流下标
        audioIndex:null,
        // 新加载一批发言的长度
        // newSpeakLength: 0,
        // 话题列表的dom
        listDom: null,

        listContainer: null,
        // 前一个话题列表的高度
        prevHeight: 0,
        // 加载指定speak的时候用到
        scrollToTargetSpeakId: 0,
        // 播放音频次数
        playTimes: 0,
        // 显示回到播放位置防止触发次数太多
        handleDelayTime: true,
        // 音频列表
        audioUrlList : [],
        // 记录最后一次滚动操作时间
        lastScrollTime: 0,
        // 防止频繁记录
        recordTimeout:true,

        //成就卡推送判断参数
        pushCompliteInfo:null,
        pushCompliteEnable:false,
        allRecordNum:null,
        listenRecordNum:null,
        officialLiveIds: [
            "100000081018489",
            "350000015224402",
            "310000089253623",
            "320000087047591",
            "320000078131430",
            "290000205389044"
        ],
        // 毕业证相关参数
        listenRecordSecond: 0, // 收听总时间
        allRecordSecond: 0, // 音频总时长
        end: false, //是否已经听完最后一条
        hasDiplomaCard: false, //是否已经拥有毕业证
        isShow: true,
        homeworkList: [],
        // 获取首屏消息流的反向
        beforeOrAfter:false,
    }

    state = {
        //显示操作弹框
        showControlDialog:false,
        //显示直播推送弹框
        showPushTopicDialog: false,

        // 是否显示留资弹窗
        isDialogMoreInfoVisible: false,

        //显示底部编辑头衔的操作条
        showBottomEditTitle: false,
        //显示修改头衔弹窗
        showEditTitleDialog: false,

        //显示选择回到直播间主页还是系列课主页

	    currentPPTFileId: '',

        //防暴力点击
        isCanClick:true,

        /*播放音频相关*/
        //音频播放路径f
        audioUrl:'',
        playStatus:'pause',
        playSecond:0,
        //正在播放的音频消息Id
        audioMsgId:'',
        // 音频是否正在加载
        audioLoading:false,
        //音频时长
        audioDuration:0,
        //播放过的音频
        recordReaded:{},
        // 是否显示赞赏弹框
        showLuckyMoney: false,
        // 显示直播盒
        showLiveBox: false,
        // 显示回到播放位置
        showGotoPlaying: false,
        //粘贴图片
        pasteImgUrl:'',
        // 自动播放新消息
        autoPlayMsg:true,
        /*加载数据相关*/
        //加载第一条数据时间戳
        loadFirstTime:'1120752000000',
        //是否正在加载数据
        isLoadingForumList:false,

        /*赞赏的用户ID*/
        payForId: null,
        payForPortrait: null,
        payForName: null,

        /*是否在回复某个对象*/
        feedbackTarget: null,

        /*撤回相关参数*/
        revokeId: 0 ,
        revokeCreateBy: 0,
        revokeName : '',
        revokeType: null,

        /*弹出层视频播放*/
        openVideoplayer: false,
        videoUrl: '',

        /*评论列表弹出*/
        showCommentList: false,
        /*问题列表弹出*/
        showQuestionList: false,
        /*弹幕列表弹出*/
        showBarrageList: true,

        /*显示二维码弹框*/
        showDialog: false,
        /*显示关注直播间二维码弹框*/
        showFollowDialog: false,
        /* 点击开课提醒弹窗二维码 */
        showCommencementDialog: false,

        /*显示关注直播间提示*/
        showFollowTips: false,
        /* 录音状态*/
        recordingStatus:'ready',
        /* 录音状态*/
        bottomTabType:'',
        /* 消息流是否添加最小高度 用于触发滚动*/
        hasMinHeight:false,
        // 有没有直播间
        hasNotLive:false,
        // 判断是否已获取到评论列表
        gotComments: false,
        // 是否专业版
        isLiveAdmin: '',
        // 分享成功关注二维码
        shareQrcodeUrl:'',
        shareQrAppId: '',
        // 是否弹出成就卡模态窗
        showArchivementCardBtn: false,
        showArchivementCardModal: false,

        // 详情页左下角按钮信息
        showIncrFansFocusGuideDialog: false,
        isOfficialLive: false,
        incrFansFocusGuideConfigs: null,

        // 是否显示红点
        dot: false,
        // 是否显示课程列表弹窗
        showCourseListDialog: true,
	    mountCourseListDialog: false,
	    // 播放速度
	    audioSpeedRate: 1,
        // 是否服务号白名单对应直播间
        isWhiteLive: 'N',
        // 倍速按钮反馈动画
	    audioSpeedBtnAct: false,
	    // 是否显示试听引导购买按钮
        showAuditionGuidePurchaseBtn: false,
        // 信息流首条弹码
        speakMsgFirstQrCode: '',
        // 信息流首页弹码的appid
        speakMsgFirstAppId: '',
        // 信息流首页弹码状态
        showSpeakMsgFirstQrcode: false,
        // 是否展示毕业证弹窗
        showDiplomaDialog: true,
        // 话题分销相关数据
        shareData: null,
        // 详情页底部二维码弹出锁（在用户发言的时候锁住，防止用户发言的时候弹出）
        bottomQrcodeLock: true,

        isShowAppDownloadConfirm: false,

        userTopicRole: undefined,

        isQlLive: 'N', //是否官方直播间

        // rewardCardQrCode: '',//成功打赏之后的画卡二维码链接
        // rewardCardCardUrl: '',// 成功打赏之后的画卡链接

        topLiveBarSwitch: 'default',// 切换顶部topLiveBar内容

        distributionPercent: 0,//获取分销比例
        // B端总语音类发言列表
        totalAudioSpeakList: [],
        // 课堂红包数据列表
        redEnvelopeList: [],
        // 珊瑚课程信息
        coralInfo: null,

        // 是否有资格邀请好友免费听,Y/N
        canInvite: '',
        // 邀请剩余人数
        remaining: 0,
		// 免费听邀请id
        inviteFreeShareId: '',
        // 一次性订阅
        oneTimePushSubcirbeStatus: {},

        showRedPackCard:false,
        channelCharge:[],

        showBackTuition: false, //是否展示拉人返学费按钮
        joinCampInfo:{},

        // 邀请详情 see http://showdoc.corp.qlchat.com/web/#/1?page_id=2656
        inviteDetail: {},
        // 分享遮罩
        tryListenMask: {
            headImageList: [],
            qrUrl: ''
        },
        canShowBeginDialog: '', //是否可以显示一进页面就弹倒计时二维码弹窗（如果在有平台优惠券弹窗的情况下是不允许弹的）,‘’表示未请求，‘N’表示不行，‘Y’表示可以
        //用户是否有创建直播间
        isHasLive: false,
        getHasLive: false,

        missionDetail: {}, // 拉人返学费数据
        isShareCommentLiveSwitch: false, // 是否关闭整个直播间上墙
        showGroupEntrance: false, // 显示社群入口
    }

    event = new EventEmitter();

    // 图片懒加载的待加载列表
    lazyImgs = [];
    // 列表是否需要更新
    hasNewList = false;
    // 滚动的方向
    scrollDirection = '';
    // 当前列表的第一个发言
    firstSpeakItem = null;
    // 上一个滚动的位置
    preScrollTop=0;
    // 是否允许修复位置
    enableFix = true;

    constructor(props) {
        super(props);
    }

    /*******************************    图片懒加载 start    *****************************/

    getChildContext() {
        return {
            lazyImg: {
                push: this.pushImgToLazyImgs,
                remove: this.removeImgToLazyImg,
            }
        }
    }

    /**
     * 添加图片到lazyImgs列表中
     * @param {*} ref 图片的ref
     */
    pushImgToLazyImgs(ref) {
        if (!this.refs.topicListContainer) {
            this.lazyImgs.push(ref);
            return;
        }

        if (!this.isImgCanLoad(findDOMNode(this.refs.topicListContainer), ref)) {
            this.lazyImgs.push(ref);
        }
    }

    /**
     * 通过图片一个唯一标识删除图片
     * @param {*} id 图片id
     */
    removeImgToLazyImg(id) {
        this.lazyImgs = this.lazyImgs.filter(item => item.getAttribute('id').trim() != id);
    }

    @throttle(300)
    initLazyImgLinstener(target) {
        if (!target) {
            return;
        }
        const st = target.scrollTop;
        const height = target.clientHeight;

        this.lazyImgs.forEach(item => {
            const pos = item.parentNode.parentNode.parentNode.parentNode.offsetTop;
            const itemHeight = item.parentNode.parentNode.parentNode.parentNode.clientHeight;
            if (pos < height + st + itemHeight && pos >  st - itemHeight) {
                item.src = item.getAttribute('data-real-src');
            }
        });
    }

    isImgCanLoad(target, imgDom) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = imgDom.parentNode.parentNode.parentNode.parentNode.offsetTop;
        const itemHeight = imgDom.parentNode.parentNode.parentNode.parentNode.clientHeight;

        if (pos < height + st + itemHeight && pos >  st - itemHeight) {
            imgDom.src = imgDom.getAttribute('data-real-src');
            return true;
        } else {
            return false;
        }
    }

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    /*******************************    图片懒加载 end    *****************************/
    async componentDidMount() {
        await this.initSpeakList();

        // 修正滚动露底
        fixScroll('#main-scroll-area');
        // 初始化页面state
        await this.initState();

        // 话题统计
        this.addPageUv();

        this.initBrowseHistory()

        // PPT初始化
        this.initPPT();

        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
        }

        // this.hasLive();

        this.dispatchGetCommunity();

        //加载嘉宾列表
        this.props.getGuestList(this.data.topicId);
        // 加载问题列表(只有allowSpeak的人才有)
        if(this.props.power.allowSpeak){
	        this.props.getQuestionList(this.data.topicId, '1120752000000');
        }
        this.initCommentAndBarrageList();

        // 打开websocket
        if (this.props.topicInfo.status !== 'ended') {
            this.initWebsocket();
        }

        //获取优惠券数目
        this.initCouponCount();
        // 初始化是否官方直播间判断
        this.initIsOfficial();

        // // 获取评论开关
        this.getShareCommentConfig();


        // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        /***************************************
         *
         *         !!!!! 注意 !!!!
         *
         *      需要userId 请求的接口放这里
         *
         *      ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
         *
        ****************************************/

        // 需要登录才能请求的方法
        if (this.props.isLogin) {
            this.hasLive();
            // 判断信息流第一条是否是提示信息，比如“上次看到这里”，这种时候页面上是肯定看不到分享榜的，按需求来说这种情况应该将topLiveBar切换到分享榜版本
            if(this.props.forumSpeakList[0] && this.props.forumSpeakList[0].type === 'prompt') {
                this.setState({topLiveBarSwitch: 'shareRank'})
            }


            // 绑定分销关系
            if (this.props.location.query.lshareKey) {
                await this.props.bindShareKey(this.props.topicInfo.liveId, this.props.location.query.lshareKey);
            }
            if(this.props.location.query.kfAppId && this.props.location.query.kfOpenId) {
                this.props.userBindKaiFang(this.props.location.query.kfAppId, this.props.location.query.kfOpenId)
            }

            
            // 初始化珊瑚课程信息
            this.initCoralInfo()
            // 初始化用户信息
            await this.initUserInfo();

            this.initDialogMoreUserInfo();

            // 上传初始化
            this.initStsInfo();
            
            // 获取用户好友关系
            this.fetchRelationInfo();
            
            // 获取有没有创建直播间
            this.getCreateLiveStatus();
            // 获取提纲列表
            this.getOutlineList();

            // 毕业证初始化
            this.initDiplomaCard()

            // 获取话题用户角色
            this.initUserTopicRole();

            // 获取请好友免费听资格
            this.checkShareStatus();

            // 拉人返学费初始化
            this.initInviteReturnInfo();

            // 获取分享榜数据
            this.initShareRankCard();

            this.getIsQlLive();

	        // 初始化话题或者系列课的分销信息
	        this.initAutoShare();

	        // 获取B端语音类发言总列表
            this.initTotalSpeakList();

            // 是否设置一次性订阅开播提醒
            this.fetchOneTimePushSubcirbeStatus();

            // 获取是否可以千聊平台分销
            this.getShareRate();

            //获取优惠券是否显示
            this.initCouponOpen();

            this.initChannelInfo();

            this.ajaxGetInviteDetail();
            this.isAuthChannel();
            this.ajaxCanInviteAudition();

            this.ajaxSaveInvite();

            // 统计学习时长 (页面停留时间)（积分相关）
            setInterval(() => {
                updateLearningTime({
                    setTime: 1
                })
            }, 1000);

            setTimeout(_=>{
                // 详情页显示平台通用券弹窗
                this.getPacketDetail()
                setUniversityCurrentCourse({
                    businessId: this.props.topicInfo.isBook ==='Y'? this.data.topicId : (!!this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.data.topicId),
                    businessType: this.props.topicInfo.isBook ==='Y'? 'topic' : (!!this.props.topicInfo.channelId? 'channel':'topic'),
                    currentId: this.data.topicId,
                });
            },3000)

        }
        /***************************************
         *      ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
         *      需要userId 请求的接口放这里
         *         !!!!! 注意 !!!!
         ****************************************/
        // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑



        // 自动播放状态
        this.initAutoPlay();

        //推送成就卡初始化
        // this.initPushCompliteCard();
        //是否显示红点
        this.redDotShow()

        this.getIsServiceWhiteLive();

        // 初始化试听引导购买按钮
        this.initGuidePurchaseBtnInAudition();

	    // 记录系列课内课程访问信息
	    if(this.props.topicInfo.channelId){
		    updateTopicInChannelVisit(this.props.topicInfo)
        }
        if(!!this.props.topicInfo.channelId){
            this.initCampInfo();
        }

        this.setState({
            showRedPackCard : (Number(this.props.topicInfo.startTime)-900000) <=  Number(this.data.currentTimeMillis)
        });
        this.initHomeworkList();
        this.initInviteFriendsListenRemindTips();

        // 曝光日志收集
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 1000);



    }

    /***********************开始平台通用券（奖学金）相关***************************/

	// 详情页显示平台通用券弹窗
	getPacketDetail = async()=>{
        let topicInfo = this.props.topicInfo
        // 是否可以显示一进页面就弹倒计时二维码弹窗（如果在有平台优惠券弹窗的情况下是不允许弹的）
        let canShowBeginDialog = 'Y'
		await getPacketDetail({businessId: topicInfo.channelId || topicInfo.id}).then(res => {
			// 返回的是空或者是空对象表明接口请求错误或者不是官方直播间且没有平台分销比例，不执行以下操作
			if(!res || JSON.stringify(res) === '{}'){
                return
            }
			if(get(res, 'state.code')){
				throw new Error(res.state.msg)
			}
			let couponNum = get(res, 'data.couponNum' ,0) // 总数量
            let bindCouponNum = get(res, 'data.bindCouponNum' ,0) // 领取数量
            let popUpStatus = get(res, 'data.popUpStatus') // 是否已经弹窗
            let dayType = get(res, 'data.dayType') // 日期类型
            let fixDateEndTime = get(res, 'data.fixDateEndTime') // 固定日期结束时间
            // 弹窗弹起的条件：1、券未领完，2、未弹过窗，3、未过期
            if(couponNum && bindCouponNum < couponNum && popUpStatus === 'N' && !(dayType === 'fixDate' && fixDateEndTime < Date.now())){
                let packetId = get(res, 'data.id', '')
                this.scholarshipDialogEle.show(packetId)
                // 弹窗只弹一次，所以要调用后端接口将弹窗状态置为“已弹窗”
                updatePacketPopStatus(packetId)
                canShowBeginDialog = 'N'
			}
        })
        this.setState({canShowBeginDialog})
	}
    /***********************结束奖学金相关***************************/

    // 获取作业数据
    async initHomeworkList(){
        if(this.props.topicInfo.channelId){
            const params = {
                channelId: this.props.topicInfo.channelId,
                topicId: this.data.topicId
            }
            const { data } = await topicJodLists(params);
            const topic = data.dataList && data.dataList.length > 0 && data.dataList.find(topic => topic.id === this.data.topicId)
            let homeworkList = []

            if (topic) {
                homeworkList = topic.homeworkList || []
            }
            this.setState({
                homeworkList,
            })  
        }
    }

    componentWillUnmount() {
        resetScroll();
        document.removeEventListener('click', this.closeBottomBar);
    }

    // // 初始化打赏之后的二维码链接
    // async initRewardCardQrUrl(){
    //     // 没有登录则不请求。保证免费话题正常访问
    //     if (!getVal(this.props.userInfo,'user.userId','')) {
    //     return false;
    //     }

    //     // 如果已经请求获取过了打赏的二维码链接，就直接跳过
    //     if(!this.state.rewardCardCardUrl){
    //         // 查找信息流上的红包信息是否有自己打赏的
    //         let redpack = this.props.forumSpeakList.find((item)=>{
    //             if(item.type === 'redpacket' && item.byAwardPersonUserName && item.byAwardPersonHeadImgUrl){
    //                 return true
    //             }
    //         })
    //         if(redpack){
    //             let qrUrl
    //             if(!this.state.rewardCardQrCode){
    //                 qrUrl = await fetchRewardQRCode('reward',this.props.topicInfo.id,this.props.topicInfo.liveId)
    //                 await this.setState({
    //                     rewardCardQrCode: qrUrl
    //                 })
    //             }else {
    //                 qrUrl = this.state.rewardCardQrCode
    //             }
    //             this.setState({
    //                 rewardCardCardUrl: await drawRewardCard(this.props.userInfo.user,{width: 500, height: 889},this.props.topicInfo, 'reward', qrUrl)
    //             })
    //         }
    //     }
    // }
    // 获取用户加入训练营信息
	async initCampInfo(){
		const { data = {} } = await getJoinCampInfo({
                channelId: this.props.topicInfo.channelId
        })
		this.setState({
            joinCampInfo: data,
            isNewCamp: data.isNewCamp === 'Y',
        })
        // 新训练营 增加学习打卡记录
        if (data.isNewCamp === 'Y') {
            studyTopic({
                channelId: this.props.topicInfo.channelId,
                topicId: this.data.topicId
            })
        }
	}

    // 是否设置一次性订阅开播提醒
    async fetchOneTimePushSubcirbeStatus(){
        try {
            const result = await oneTimePushSubcirbeStatus(this.props.topicInfo.id)
            if(result.state.code === 0){
                this.setState({oneTimePushSubcirbeStatus: result.data || {}})
            }
            this._hasFetchOneTimePushSubcirbeStatus = true
        } catch(err){
            console.error(err)
        }
    }

    // 切换课程的开课提醒状态
    switchRemindSubscibeStatus(status) {
        if (status == 'closed') {
            this.setState({
                oneTimePushSubcirbeStatus: {...oneTimePushSubcirbeStatus, subscribe: false}
            });
        } else if (status == 'opened') {
            this.setState({
                oneTimePushSubcirbeStatus: {...oneTimePushSubcirbeStatus, subscribe: true}
            });
        }
    }

    // 初始化珊瑚课程信息
    async initCoralInfo(){
        let topicInfo = this.props.topicInfo
        const result = await getPersonCourseInfo({
            businessType: topicInfo.channelId ? 'channel' : 'topic',
            businessId: topicInfo.channelId ? topicInfo.channelId : topicInfo.id
        })
        if(result.state.code === 0){
            this.setState({coralInfo: result.data})
        }
    }

    /**
     *初始化分销信息(如果是系列课内的话题就获取系列课的分销比例，其他都是获取话题的分销比例)
     *
     * @memberof ThousandLive
     */
    async initAutoShare(){
        let result, percent
        if(this.props.topicInfo.channelId){
            result = await getChannelAutoShare({channelId: this.props.topicInfo.channelId})
            if(result.state.code === 0){
                percent = result.data.isOpenShare === 'N' ? 0 : result.data.autoSharePercent
            }
        }else {
            result = await getTopicAutoShare({topicId: this.props.topicInfo.id})
            if(result.state.code === 0){
                percent = result.data.isAutoshareOpen === 'N' ? 0 : result.data.percent
            }
        }
        this.setState({
            distributionPercent: percent || 0
        })
    }

    async initCouponCount(){
        if(this.props.topicInfo.channelId){
            let resultCount = await getCouponAllCount(this.props.topicInfo.liveId,'channel',this.props.topicInfo.channelId);
            this.setState({
                couponCount : resultCount.data.count,
            });
        }else{
            let resultCount = await getCouponAllCount(this.props.topicInfo.liveId,'topic',this.props.topicInfo.id);
            this.setState({
                couponCount : resultCount.data.count,
            });
        }
    }


    async initCouponOpen(){
        if(this.props.topicInfo.channelId){
            let resultOpen = await getCouponForIntro(this.props.topicInfo.channelId,'channel');
            this.setState({
                isCouponOpen : getVal(resultOpen, 'data.codePo', false),
            });
        }else{
            let resultOpen = await getCouponForIntro(this.props.topicInfo.id,'topic');
            this.setState({
                isCouponOpen : getVal(resultOpen, 'data.codePo', false),
            });
        }

    }

    // 获取是否服务号白名单
    async getIsServiceWhiteLive() {
        try {
            const result = await this.props.isServiceWhiteLive(this.props.topicInfo.liveId);

            this.setState({
                isWhiteLive: getVal(result, 'data.isWhite', 'N')
            });
        } catch (error) {
            console.error(error);
        }
    }

    //是否显示红点
    redDotShow(){
        let dot = window.localStorage.getItem('dot')
        this.setState({
            dot: !dot && 1,
        })
        if(!dot){
            window.localStorage.setItem('dot','Y')
        }
    }
    //显示课程列表弹窗
    showCourseListDialog(){
        if(!this.state.mountCourseListDialog){
	        this.setState({
		        mountCourseListDialog: true
	        })
        }else{
	        this.setState({
		        showCourseListDialog: true
	        },() => {
                const sameNode = document.querySelector(".select");
                sameNode.scrollIntoView(true);
            })
        }
    }
    //隐藏课程列表弹窗
    hideCourseListDialog(){
        this.setState({
            showCourseListDialog: false
        })
    }

    getIsQlLive = () => {
        this.props.getIsQlLive(this.data.liveId)
        .then(res => {
            if (res.state.code == 0) {
                this.setState({
                    isQlLive: res.data.isQlLive
                })
            }
        })
    }

    // 绑定平台分销
    getShareRate() {
        if (!this.props.topicInfo || this.props.power.allowSpeak || this.props.power.allowMGLive) {
            return false;
        }
        if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y') {
            this.props.getShareRate({ businessId: this.props.topicInfo.channelId, businessType: 'CHANNEL' });
        } else if(this.props.topicInfo.type === 'charge') {
            this.props.getShareRate({businessId:this.data.topicId,businessType:'TOPIC'});
        }
    }

    initIsOfficialed = false

    async initIsOfficial() {
        try {
            let officialLiveIds = this.data.officialLiveIds;
            const result = await this.props.getQlLiveIds();

            if (getVal(result, 'state.code') == 0) {
                officialLiveIds = getVal(result, 'data.dataList', []);
            }

            const isOfficialLive = officialLiveIds.find(item => item == this.props.topicInfo.liveId) != undefined
            this.setState({ isOfficialLive, officialLiveIds }, () => {
                // 初始化左下角按钮配置

                this.fetchQrImageConfig();
                this.initIsOfficialed = true
                this.initShare()
            });
        } catch (error) {
            console.error(error);
        }
    }

    // 初始化左下角按钮配置
    async fetchQrImageConfig() {
        try {
            const result = await this.props.fetchQrImageConfig({ topicId: this.data.topicId });

            if (result.state.code == 0) {
                this.setState({
                    incrFansFocusGuideConfigs: getVal(result, 'data.info')
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    /** 系列课信息 */
    async initChannelInfo(){
        if(this.props.topicInfo.channelId) {
            try {
                const result = await this.props.getChannelInfo({
                    channelId: this.props.topicInfo.channelId
                });
                this.setState({
                    channelCharge: getVal(result, 'data.chargeConfigs',[]),
                });
            } catch (error) {
                console.error(error);
            }
        }

    }


    initBrowseHistory = () => {
        // 如果是系列课的话题 记录在这个系列课中看到哪一个话题了
        if(this.props.topicInfo.channelId) {
            setLocalStorageArrayItem("channel_topic_history", "cid", this.props.topicInfo.channelId, {
                cid: this.props.topicInfo.channelId,
                tid: this.props.topicInfo.id,
            }, true, 20)
            localStorageSPListAdd('footPrint', this.props.topicInfo.channelId, 'channel', 100)
        } else {
            localStorageSPListAdd('footPrint', this.data.topicId, 'topic', 100)
        }
    }


    /**
     *
     * 初始化一些参数
     *
     * @memberof ThousandLive
     */
    initState(){
        let recordReaded = {};

        if (localStorage.getItem('recordReaded')) {
            recordReaded = JSON.parse (localStorage['recordReaded']);
        };

        this.data = {
            ...this.data,
            topicId: this.props.location.query.topicId || '0',
            liveId: this.props.topicInfo.liveId || '0',
            currentTimeMillis: this.props.topicInfo.currentTimeMillis,
        }
        this.setState({
            recordReaded: { ...recordReaded },
        })

        this.props.setRewordDisplayStatus(this.props.topicInfo.barrageFlag);
        this.props.updateMute(this.props.topicInfo.isBanned);

        this.props.updateTextOpen(this.props.topicInfo.isTextOpen);
        this.props.updateAudioOpen(this.props.topicInfo.isAudioOpen);

    }

    async initCommentAndBarrageList() {
	    await wait(2000);
	    let getDataTime = Date.now();
        if (this.data.currentTimeMillis > getDataTime) {
            getDataTime = this.data.currentTimeMillis;
        }
        await this.props.fetchCommentList(this.data.topicId, this.data.liveId, getDataTime + 30000, 'before');
        this.setState({ gotComments: true});
        setTimeout(() => {
            this.props.initBarrageList(3);
        }, 500);

    }

    get inviteAuditionUserId () {
        return this.props.location.query.inviteAuditionUserId;
    }

    ajaxSaveInvite = async () => {
        if (!this.inviteAuditionUserId) return;
        try {
            let result = await apiService.post({
                url: '/h5/invite/audition/saveInvite',
                body: {
                    inviteAuditionUserId: this.inviteAuditionUserId,
                    channelId: this.props.topicInfo.channelId,
                    topicId: this.props.topicInfo.id
                }
            })
        } catch (error) {
            console.error(error);
        }
    }


    initedShare = false

    shareParamsTryListen = () => {
        if (!this.props.topicInfo.channelId) return '';
        if (this.state.isAuthChannel == 'Y') return '';
        return this.props.topicInfo.isAuditionOpen == 'Y' ? ('&inviteAuditionUserId=' + getCookie('userId')) : ''
    }

    isAuthChannel = async () => {
        let result = await isAuthChannel(this.props.topicInfo.channelId);
        this.setState({
            isAuthChannel: result
        }, () => {
            this.initShare()
        })
    }

    /**
     *
     * 初始化分享
     *
     * @memberof ThousandLive
     */
    async initShare() {
        if (this.initedShare) { return }
        if (!this.initIsOfficialed) { return }

        // 拉人返学费的分享
        if(this.state.showBackTuition){
            this.backTuitionDialogEle.initShare({
                data: this.props.topicInfo,
                missionId: this.state.missionDetail.missionId,
                type: this.props.topicInfo.channelId ? 'channel' : 'topic',
            })
            return
        }
        this.initedShare = true
        let wxqltitle = this.props.topicInfo.topic;
        let descript = this.props.topicInfo.liveName;
        let wxqlimgurl = "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        // let shareUrl = window.location.origin + this.props.location.pathname + '?topicId=' + this.data.topicId + "&pro_cl=link";

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + '?topicId=' + this.data.topicId + "&pro_cl=link" + await this.shareParamsTryListen();
		let pre = `/wechat/page/live/${this.props.topicInfo.liveId}?isBackFromShare=Y&wcl=middlepage`;

        if (this.props.topicInfo.status == "ended") {
            wxqlimgurl=shareBgWaterMark(wxqlimgurl,'study');
        }else if( Number(this.props.topicInfo.startTime) >  Number(this.data.currentTimeMillis) ){
            wxqlimgurl=shareBgWaterMark(wxqlimgurl,'plan');
        }else{
            wxqlimgurl=shareBgWaterMark(wxqlimgurl,'start');
        };

        const shareObj = randomShareText({
            title: wxqltitle,
            desc: descript,
            timelineTitle: friendstr,
            shareUrl: target,
        })

        if(this.props.lshareKey&&this.props.lshareKey.shareKey && this.props.lshareKey.status == 'Y' ){
            shareObj.title  = "我推荐-" + shareObj.title ;
            shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
            shareObj.shareUrl = shareObj.shareUrl + "&lshareKey=" + this.props.lshareKey.shareKey;

        } else if (this.props.topicInfo.isAuditionOpen === 'Y') {
            // 免费试听的文案
            shareObj.title = this.props.topicInfo.topic;
            shareObj.desc = `${this.props.userInfo.user.name}送你一堂试听课`;
            shareObj.timelineTitle = shareObj.title;
            wxqlimgurl=shareBgWaterMark(this.props.topicInfo.channelImg,'study');
        }
        if (this.props.platformShareRate && !this.props.power.allowSpeak && !this.props.power.allowMGLive) {
            shareObj.shareUrl = shareObj.shareUrl + "&wcl=pshare&psKey=" + this.props.userId;
        }

        if (this.props.location.query.psKey || this.state.isOfficialLive) {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
        }


        this.getShareQr()

        shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;
        
        let shareOptions = {
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: this.onShareComplete,
        }
        console.log('分享信息: ', shareOptions)
        share(shareOptions);
    }


    async getShareQr() {
        if(this.tracePage === 'coral'){
            return false;
        }
        const result = await whatQrcodeShouldIGet({
            isBindThird: this.props.isSubscribe.isBindThird,
            isFocusThree: this.props.isSubscribe.isFocusThree,
            options: {
                subscribe: this.props.isSubscribe.subscribe,
                channel: '115',
                liveId: this.props.topicInfo.liveId,
                topicId: this.props.location.query.topicId,
            }
        })
        if(result){
            this.setState({
                shareQrcodeUrl: result.url,
                shareQrAppId: result.appId,
            })
        }
    }

    async onShareComplete() {
        if (this.props.topicInfo.isAuditionOpen == 'Y') {
            window._qla && window._qla('event', {
                category: 'auditionShare',
                action: 'success',
            });
        }

        if (this.props.isLogin) {
            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })
        }

        if (this.state.shareQrcodeUrl) {
            showShareSuccessModal({
                url: this.state.shareQrcodeUrl,
                traceData: 'thousandLiveShareQrcode',
                channel: '115',
                appId: this.state.shareQrAppId
            })
        }
        // 分享完成添加分享评论
        await this.addShareComment();
        this.refs.commentList.loadNextComments();

    }

    /**
     *
     * 初始化PPT
     * 初始化时，如果没有PPT，默认收起
     * @memberof ThousandLive
     */
    async initPPT() {
        // 非PPT话题 ,C端用户不需要请求
        if(this.props.topicInfo.style =='normal' && !this.props.power.allowSpeak){
            return;
        }

        // 如果头部没有ppt轮播(非ppt模式)，延迟执行
        if(this.props.topicInfo.style !== 'ppt'){
	        await wait(5000);
        }

        await this.props.getPPT({
	        status: '',
	        topicId: this.data.topicId
        });
        this.setState({
            showLiveBox: this.props.power.allowSpeak || (!this.props.power.allowSpeak && this.props.pptList.length > 0),
            currentPPTFileId: this.props.pptList.length > 0 ? this.props.pptList[0].fileId : '',
        })
    }

	/**
	 *
	 * 初始化分享榜
	 * @memberof ThousandLive
	 */
    async initShareRankCard(){
        // await wait(2500);
        let businessType = this.props.topicInfo.channelId ? 'channel':'topic'
        let businessId = this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.data.topicId
        await this.props.fetchShareRankCardItems(businessId, businessType);
        const result = await this.props.getMyQualify(businessId,businessType)
        if(result.state.code === 0){
            this.setState({
                shareData: result.data.shareQualifyInfo
            })
        }
	}

	/**
	 *
	 * 话题统计
	 * @memberof ThousandLive
	 */
	async addPageUv(){
	    await wait(3500);
		this.props.addPageUv(this.data.topicId, this.props.topicInfo.liveId, ['topicOnline', 'liveUv'], this.props.location.query.pro_cl || getCookie('channelNo') || '', this.props.location.query.shareKey ||'');
    }

    /**
     *
     *
     * 上次看到这
     * @memberof ThousandLive
     */
    initLastVisitMsg() {
        if (!this.props.forumSpeakList.length) {
            return;
        }
        // 未开播的话题不判断上次播放进度
        if(this.props.topicInfo.status == 'beginning' && this.props.topicInfo.startTime > this.props.sysTime){
            return
        }
        try {
            let lastVisit = {};
            if ( localStorage.getItem('localLastVisit')) {
                lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
            };
            if (lastVisit[this.data.topicId] && !(this.props.power.allowSpeak && this.props.topicInfo.status == 'beginning' )&&this.state.beforeOrAfter == 'after') {
                let getMsgTime = lastVisit[this.data.topicId].speakTime;
                let lastVisitMsg = {
                    type : "prompt",
                    content : '上次看到这里了',
                    createTime : getMsgTime ,
                    id : getMsgTime,
                }
                this.setState({
                    hasMinHeight:true
                })
                this.props.addTopicListMsg([lastVisitMsg],false);
            }

            if (this.state.beforeOrAfter == 'before') {
                this.scrollToLast(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    // oss上传初始化
    initStsInfo() {
        if(!(Detect.os.weixin && Detect.os.ios)){
            const script = document.createElement('script');
            script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
            document.body.appendChild(script);
        }
    }

    /**
     * 开放平台返回带openId参数，校验与登录用户是否一致，主动关注直播间
     * 没关注才调用接口
     * @memberof ThousandLive
     */
    async initUserInfo(){
        // 获取用户基本信息
        await this.props.getUserInfo(this.props.userId, this.data.topicId);
        if(!this.props.isFollow && !this.props.power.allowMGLive){
            // 自动关注直播间
            if (this.props.location.query.openId && this.props.location.query.openId == this.props.userInfo.user.openId) {
                this.props.followLive(this.data.liveId);
            } else if (this.props.location.query.auditStatus == 'pass') {
                // 饼饼的需求--通过 208 和 205 扫码的 第三方公众号 ，后端无法自动关注，需要前端关注
                this.props.followLive(this.data.liveId,'Y','',false);
            }
        }
        // 获取成功打赏之后的卡片二维码链接（需要用到用户信息，所以写在这里）
        // this.initRewardCardQrUrl()
    }

    // 是否显示留资弹窗
    initDialogMoreUserInfo = () => {
        const { userInfo, location: { query: { wcl, showDialogMoreInfo } }, power: { allowMGLive } } = this.props;
        // 首要条件：C端用户资料手机为空，且未主动关闭弹窗
        // 次要条件：该页面由微信推送链接进入（携带wcl标识）或其为第二节课上课页
        const isDialogMoreInfoVisible = !allowMGLive && !userInfo.user.mobile && getCookie('showDialogMoreInfo') !== 'N' && (showDialogMoreInfo === 'Y' || wcl === 'push_course_start' || wcl === 'custom_course_start_2');
        this.setState({
            isDialogMoreInfoVisible,
        });
    }

	/**
	 * 初始化websocket
	 *
	 * @memberof ThousandLive
	 */
    async initWebsocket(){
        // await wait(3000);
		this.props.startSocket(this.props.sid, this.props.topicInfo.sourceTopicId || this.props.topicInfo.id, this.props.currentUserId,this.data.currentTimeMillis);
	}


    // 切换显示控制菜单
    showControlDialog = (e) => {
        this.setState({
            showControlDialog:true,
        })
    }
    hideControlDialog = (e) => {
        this.setState({
            showControlDialog:false,
        })
    }

    // 切换是否显示修改头衔弹窗
    showEditTitleDialog = () => {
        this.setState({
            showEditTitleDialog: true,
        })
    }
    hideEditTitleDialog = () => {
        this.setState({
            showEditTitleDialog: false,
        })
    }

    // 切换是否显示底部头衔修改菜单
    showBottomEditTitle = () => {
        this.setState({
            showBottomEditTitle: true,
        })
    }
    hideBottomEditTitle = () => {
        this.setState({
            showBottomEditTitle: false,
        })
    }

    /**
     *
     * 显示回到频道
     *
     * @memberof ThousandLive
     */
    changgeLiveBox = (e)=>{
        this.setState({
            showLiveBox:!this.state.showLiveBox,
            showControlDialog: false
        })
    }


    async initSpeakList() {
        // 删除旧cookie记录
        try {
            delCookie('lastVisit')
        } catch (error) {
            
        }

        // 判断加载发言的位置
        let getMsgTime = '1120752000000';
        // 获取发言的方向
        let beforeOrAfter = 'after';
        let lastVisit = {};
        if ( localStorage.getItem('localLastVisit')) {
            lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
        };
        let currentTimeMillis = this.props.sysTime;
        // 判断加载消息流位置
        // 该课程未开播
        if(currentTimeMillis < this.props.topicInfo.startTime && this.props.power && !this.props.power.allowSpeak){
            beforeOrAfter = 'after'
        // 该课程已开播且开播小于两小时
        }else if (this.props.topicInfo && this.props.topicInfo.status != "ended" && (currentTimeMillis <= (this.props.topicInfo.startTime + 7200000)|| (this.props.power && this.props.power.allowSpeak))) {
            getMsgTime = (currentTimeMillis > this.props.topicInfo.startTime) ? (currentTimeMillis + 3600000) : this.props.topicInfo.startTime ;
            beforeOrAfter = 'before' ;

        } else if (lastVisit[this.props.location.query.topicId]) {
            getMsgTime = lastVisit[this.props.location.query.topicId].speakTime;
        }

        //获取第一批发言
        await this.getTopicSpeakList({ time: getMsgTime, beforeOrAfter, clearList: true })
        
        this.setState({
            beforeOrAfter
        }, () => {
            //插入上次看到这
            this.initLastVisitMsg();
        })


        // 如果上次播放的音频被撤回，导致列表空数据，则加载第一页
        if(lastVisit[this.props.location.query.topicId]&&!this.props.forumSpeakList.length){
            await this.getTopicSpeakList({ clearList: true })
            this.setState({
                beforeOrAfter:'after'
            })
        }
        
    
        // 自动修正话题的滚动位置
        this.initAutoFixed();

        // 如果是转载课，则获取被删除的发言id列表   
        if (this.props.topicInfo.isRelay == 'Y') {
            
            this.props.getRelayDelSpeakIdList({
                topicId: this.props.location.query.topicId,
                type: 'speak'
            })
        }


        // 初始化当前用户听过的秒数和是否已经播放过最后一条语音
        if(localStorage[`listenRecord_${this.props.userId}`]){
            let listenStorage = JSON.parse(localStorage[`listenRecord_${this.props.userId}`])[`${this.props.location.query.topicId}`]
            if(listenStorage){
                this.data.end = listenStorage.end
                this.data.listenRecordSecond = listenStorage.second
            }
        }

        // 获取点赞配置
        this.props.getLikesSet(this.data.topicId);

        // 播放器初始化
        this.initAudio();
    }



    // 加载发言数据
    getTopicSpeakList = async ({time='1120752000000' , beforeOrAfter = 'after' , clearList = false } = {}) =>{
        if(!this.state.isLoadingForumList){
            this.setState({
                isLoadingForumList : true,
            })
            let result = await this.props.getTopicSpeakList(this.props.location.query.topicId,this.data.liveId,time,beforeOrAfter,!this.props.showReword,clearList,this.props.userId);
            this.setState({
                isLoadingForumList : false,
            })

            return result;
        }else{
            return null;
        }

    }

    /**
     * 滚动到某消息
     *
     * @param {any} index
     * @returns
     *
     * @memberof ThousandLive
     */
    scrollMsgToView(index, withAnimation, debugId, onAnimateEnd) {
        let msgDom = findDOMNode(this.refs.speakList.refs['forum-item-'+ index ]);

        if (!msgDom) {
            console.error('找不到需要滚动到的目标元素 -- msgDom=', msgDom, ' ref=', 'forum-item-'+ index);
            return;
        }

        if (debugId != 0 && msgDom.offsetTop === 0) {
            index = this.props.forumSpeakList[debugId-1].id;
            console.log('debugId, msgDom.offsetTop, index =', debugId, msgDom.offsetTop, index);
            this.scrollMsgToView(index, withAnimation, debugId-1);
            return;
        }

        if (withAnimation) {
            const doAnimate = () => {
                let endValue =  msgDom.offsetTop - (this.refs.topicListContainer.clientHeight / 2) + (msgDom.clientHeight / 2);
                if (withAnimation == 'top') {
                    endValue = msgDom.offsetTop;
                }
                let startValue = this.refs.topicListContainer.scrollTop;

                let aninId = animation.add({
                    startValue,
                    endValue,
                    step: (v) => {
                        this.refs.topicListContainer.scrollTop = v;
                    },
                    oncomplete: () => {
                        let newEndValue = msgDom.offsetTop - (this.refs.topicListContainer.clientHeight / 2) + (msgDom.clientHeight / 2);
                        if (withAnimation == 'top') {
                            newEndValue = msgDom.offsetTop;
                        }
                        if (newEndValue != endValue) {
                            doAnimate();
                        } else {
                            onAnimateEnd && onAnimateEnd();
                        }
                    }
                });
            }

            doAnimate();
	    }else{
            setTimeout(function () {
                msgDom.scrollIntoView(true);//自动滚动到视窗内
                onAnimateEnd && onAnimateEnd();
		    },300)
	    }

    }

    // 获取最后一个有效的item，列表中可能存在隐藏的元素，此时offsetTop是0，没法定位位置
    getLastValidItem() {
        let lastItemTop = 0;
        let lastSpeakItem = null;
        let index = this.props.forumSpeakList.length;
        while (index !== 0) {
            let lastItem = this.props.forumSpeakList[--index];
            lastSpeakItem = findDOMNode(this.refs.speakList.refs[`forum-item-${lastItem.id}`]);

            lastItemTop = lastSpeakItem && lastSpeakItem.offsetTop;

            if (lastItemTop && lastItemTop > 0) {
                return lastItem;
            }
        }

        return null;
    }

    // 判断分享榜是否出现在页面上，出现则将topLivebar切换成默认的，否则将切换成另一种（详情在TopLiveBar组件）
    shareRankEleifShowInPage(){
        // 如果页面上不存在分享榜，则不执行以下操作
        let shareRankEle = document.querySelector('.share-rank-card')
        if(!shareRankEle){
            return
        }
        let shareRankEleHeight = shareRankEle.offsetHeight // 分享榜高度
        let shareRankEleTop = shareRankEle.offsetTop // 分享榜顶部距离定位父元素顶部的高度
        let containerScrollTop = document.querySelector('#main-scroll-area').scrollTop // 父元素容器滚动条高度
        let containerHeight = document.querySelector('#main-scroll-area').offsetHeight // 父元素容器高度
        // 下边缘先出现 && 上边缘先出现
        if(containerScrollTop < shareRankEleHeight + shareRankEleTop && shareRankEleTop < containerHeight + containerScrollTop){
            this.setState({topLiveBarSwitch: 'default'})
        }else{
            this.setState({topLiveBarSwitch: 'shareRank'})
        }

    }

    async onTouchMoveSpeakList(e) {
        this.initLazyImgLinstener(e.target);
        this.shareRankEleifShowInPage()

        if (!this.enableFix) {
            return;
        }


        // 锁判断
        if (this.data.loadingNext) {
            return;
        }

        if( this.props.forumSpeakList.length <= 0 ){
            this.data.loadingNext = false;
           return ;
        }

        // 加上锁
        this.data.loadingNext = true;
        // this.listAutoFix()


        const event = e || window.event;
        const el = event.currentTarget || event.target;

        if(!el) {
            return;
        }

        const pageHeight = el.clientHeight;
        const scrollTop = el.scrollTop;
        const domHeight = el.scrollHeight;

        // 滚动距离底部的距离
        const ddt = domHeight - pageHeight - scrollTop;
        // 显示回到播放位置
        this.showGotoPlayHandle(pageHeight , scrollTop);

        if (this.data.listDom.scrollTop < 300 && this.props.forumSpeakList[0].type != 'start') {

            this.scrollDirection = 'toTop';
            await this.getTopicSpeakList({time:this.props.forumSpeakList[0].createTime,beforeOrAfter:'before'});
            // 获取成功打赏之后的卡片二维码链接（这里也写是因为避免初始化加载的信息流没有红包的，但是滚动触发的时候有了)
            // this.initRewardCardQrUrl()
        } else if (ddt < 300) {
            if (!this.props.noMore) {
                this.scrollDirection = 'toBottom';

                if (this.data.listDom) {
                    this.lastSpeakItem = this.getLastValidItem();
                }
                await this.getTopicSpeakList({time:this.props.forumSpeakList[this.props.forumSpeakList.length - 1].createTime});
                // 获取成功打赏之后的卡片二维码链接（这里也写是因为避免初始化加载的信息流没有红包的，但是滚动触发的时候有了)
                // this.initRewardCardQrUrl()
            }
        }

        // 解除锁
        if (Detect.os.ios) {
            // this.data.isIOSFixing = true;
            setTimeout(() => {
                // this.data.isIOSFixing = false;
                this.data.loadingNext = false;
            }, 200);
        } else {
            this.data.loadingNext = false;
        }
    }

    // 加载第一条数据
    loadFirstMsg = async (e) => {
        this.enableFix = false;
        window.loading(true);
        await this.getTopicSpeakList({clearList:true});
        this.setState({
            showControlDialog:false,
        })
        this.props.setCanAddSpeak(false);

        if (this.props.totalSpeakList.length > 1) {
            setTimeout(()=>{
                this.scrollToSpeak(this.props.totalSpeakList[1].id, false);
                window.loading(false);
                window.toast("已回到第一条内容");
                setTimeout(() => {
                    this.enableFix = true;
                }, 3000);
            },600)
        }

    }

    // 加载最新的数据
    loadLastMsg = async (showTip = true) => {
        this.enableFix = false;
        window.loading(true);
        if(showTip){
            this.setState({
                showControlDialog:false,
            })
        }
        if (this.props.canAddSpeak) {
            window.loading(false);
            this.scrollToLast(showTip);
            return;
        }
        await this.getTopicSpeakList({time:Date.now()+86400000 , beforeOrAfter:'before' , clearList:true});
        this.props.setCanAddSpeak(true);
        window.loading(false);
        setTimeout(() => {
            this.scrollToLast(showTip);
        }, 600);

    }

    // 滚动到最后
    scrollToLast(showTip = false) {
        try {
            if ( this.props.forumSpeakList.length < 1 ) {
                return;
            }
            this.enableFix = false;
            this.scrollMsgToView(
                this.props.forumSpeakList.slice(-1)[0].id,
                true,
                this.props.forumSpeakList.length-1,
                () => {
                    setTimeout(() => {
                        this.enableFix = true;
                    }, 2000);
                }
            )
            showTip && window.toast("已到达最后一条内容");
            setTimeout(()=>{
                this.setState({
                    showGotoPlaying: false
                });
            },300)

        } catch (error) {
            console.log(error)
        }
    }

    // 新消息滚动到底部
    async newMsgScroll() {
        let speakListDom = findDOMNode(this.refs.topicListContainer);
        let distanceScrollCount = speakListDom.scrollHeight,
            distanceScroll = speakListDom.scrollTop,
            topicPageHight = speakListDom.clientHeight,
            ddt = distanceScrollCount - distanceScroll - topicPageHight,
            defaultToBottomHeight = 600;
        // ddt: 页面滚动距离底部的距离，如果小于defaultToBottomHeight则在新消息进来时滚动到底部

        // 如果滚动到最后一页才能触发新小心滚动到底部
        let canScroll = this.props.forumSpeakList[this.props.forumSpeakList.length - 1].debugId == this.props.totalSpeakList.length - 1;

        if (canScroll && this.props.canAddSpeak && ddt < defaultToBottomHeight) {
            this.scrollToLast(false);
        }
        this.newAudioMsgPlay();
    }

    /**
     * 滚动到指定发言请用这个方法
     *
     * @param {any} speakId
     * @returns
     *
     * @memberof ThousandLive
     */
    async scrollToSpeak (speakId, animation) {
        if (!this.props.forumSpeakList) {
            return;
        }

        // 当前列表是否有目标发言
        let hadThisSpeak = this.props.forumSpeakList.some(item => item.id == speakId);

        if (hadThisSpeak) {
            // 滚动到该发言
            this.scrollMsgToView(speakId, animation);
        } else {
            // 加载到该发言然后再滚动到那里
            if (await this.props.loadTargetSpeakById(speakId)) {

                if (this.refs.speakList.refs[`forum-item-${speakId}`]) {
                    // 如果dom中已经加载完毕列表了，就直接跳转过去
                    this.scrollMsgToView(speakId, animation);
                } else {
                    // 这里获取完数据后界面可能未更新完毕，所以要用事件的形式，在页面更新完毕之后触发，而且要用once，避免注册一堆无用事件
                    this.event.once('onScrollToSpeakLoaded', e => {
                        this.scrollMsgToView(speakId, animation);
                    });

                    // 加载成功数据之后设置目标speakId，作用是在componentDidUpdate中确认加载了这个speakId的dom才触发上面绑定的那个事件
                    this.data.scrollToTargetSpeakId = speakId;
                }
            }
        }
    }

    /**
     *
     * 播放新语音消息
     *
     * @memberof ThousandLive
     */
    newAudioMsgPlay() {
        let newAudio = this.props.forumSpeakList[this.props.forumSpeakList.length - 1];

        // 当C端上麦，正在录音中不自动播放新语音
        if (this.state.recordingStatus == 'start') {
            return false;
        }

        //当新消息是音频，推送成就卡计算的总语音条数
        if(/^(audio|mic\-audio)/gi.test(newAudio.type)){
            this.data.allRecordNum++;
        }

        // 当新消息是音频且播放器没有播放时
        if (/^(audio|mic\-audio)/gi.test(newAudio.type) && this.state.autoPlayMsg && this.state.playStatus !='play' ) {
            this.playAudio(newAudio.id)
        }
    }
    /**
     *
     * 检查是否正在播放的音频是否被删除
     *
     * @memberof ThousandLive
     */
    checkPlayAudio(delMsg) {
        if (delMsg && delMsg.id &&
            /^(audio|mic\-audio)/gi.test(delMsg.type) &&
            delMsg.id == this.state.audioMsgId) {

            this.pauseAudio();
            window.toast('正在播放的语音已被撤回');

        }
    }


    // 添加发言
    addTopicSpeak = async (type,content,second = '',isShowLoading = true) => {
        let isReplay = this.state.feedbackTarget ? 'Y' : 'N';
        let commentId = '';
        let fileId = '';
        let imageTextCard = null
        if (this.props.topicInfo.style == 'ppt') {
            fileId = this.state.currentPPTFileId;
        }
        if (this.state.feedbackTarget){
            if ( this.state.feedbackTarget.type == 'replyMic' ) {
                commentId = this.state.feedbackTarget.userId;
                if(/(text)/.test(type)){
                    type = "mic-text";
                }else if(/(audioId)/.test(type)){
                    type = "mic-audio";
                }else if(/(pcAudio)/.test(type)){
                    type = "mic-pcAudioUrl";
                }
            } else {
                commentId = this.state.feedbackTarget.id;
            }
        }
        if (type === 'image-text-card') {
            imageTextCard = content
            content = ''
        }

        let result = await this.props.addTopicSpeak(this.data.topicId, this.data.liveId, type, content, fileId,second, isReplay, commentId,isShowLoading, imageTextCard);

        if (result && result.state && result.state.code === 0) {
            // 打印发送日志
            eventLog({
                category: (content || '').indexOf('.mp3') > -1 ? 'mp3-send': `${type}-send`,
                action: 'success',
            });

            // 回复问题区后重新弹开问题区
            if (this.state.feedbackTarget && this.state.feedbackTarget.type === "replyQuestion") {
                setTimeout(()=>{
                    this.showQuestionList();
                },1500)
            }
        } else {
            window.loading(false);
            // 打印发送日志
            eventLog({
                category: (content || '').indexOf('.mp3') > -1 ? 'mp3-send': `${type}-send`,
                action: 'failed',
            });
        }


        this.setState({
            feedbackTarget : null,
        })
        if(result && result.state && result.state.code != 0){
            window.toast(result.state.msg);
        }
        if (!this.props.canAddSpeak) {
            await this.loadLastMsg(false);
        }
        setTimeout(() => {
            this.scrollToLast(false);
        }, 0);
        return result;
    }

    async addTopicComment(text, isQuestion) {

	    // 计算当前音频段已播放秒数加上之前所有音频时长
	    const currentPlayTime = Math.floor(this.audioPlayer.currentTime || 0);
	    let totalPlayTime = 0;
	    this.state.audioMsgId && this.props.totalSpeakList.some((item) => {
		    if(item.type === 'audio' && item.id !== this.state.audioMsgId){
			    totalPlayTime += Number(item.second)
		    }
		    return item.id === this.state.audioMsgId
	    });
        totalPlayTime += currentPlayTime;

        // 被回复的评论id
        let parentId;
        if(this.state.feedbackTarget && this.state.feedbackTarget.id){
	        parentId = this.state.feedbackTarget.id;
        }

        let result = await this.props.addComment(text, isQuestion, this.data.liveId, this.data.topicId, 'text', totalPlayTime, parentId);

        if (result && result.state && result.state.code == '0'){
            // 打印发送日志
            eventLog({
                category: 'comment-text-send',
                action: 'success',
            });

        } else {
            // 打印发送日志
            eventLog({
                category: 'comment-text-send',
                action: 'failed',
            });
        }
        return result;
    }

    // 添加音频文件
    addSpeakVoice = async (event) => {
        const file = event.target.files[0]
        try {
            const filePath = await this.props.uploadRec(file,"liveComment");

            if (filePath) {
                this.addForumSpeak("voice",filePath);
            }


        } catch (error) {
            console.log(error);
        }
    }

    // PC添加新图片
    addSpeakImagePc = async (event) => {
        const file = event.target.files[0]
        event.target.value = '';
        try {
            const filePath = await this.props.uploadImage(file,"liveComment");
            if (filePath) {
                this.addTopicSpeak("image",filePath);
            }


        } catch (error) {
            console.log(error);
        }

    }

    // WX添加新图片
    addSpeakImageWx = async (event) => {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:  (res) =>  {
                this.wxImgUpload(res.localIds);
            },
            cancel:  (res) => {
            }
        });

    }

    async wxImgUpload(localIds) {
        while (localIds.length > 0){
	        let loaclUrl = localIds.shift();
            window.loading(true);
			await new Promise((resolve, reject) => {
				wx.uploadImage({
					localId: loaclUrl,
					isShowProgressTips: 0,
					success: async (res) => {
						await this.addTopicSpeak("imageId",res.serverId);
						resolve();
					},
					fail: (res) => {
						window.toast("部分图片上传失败，请重新选择");
						reject();
					},
					complete: (res) => {
						window.loading(false);
						resolve();
					}
				});
			})
		}
	};






    //防止暴力点击
    clickTooFast(callback){
        if(this.state.isCanClick){
                this.setState({
                    isCanClick:false
                })
                setTimeout(()=>{
                this.setState({
                        isCanClick:true
                    })
                },500);
                callback();
        }
    }




    /********** 播放音频部分 start **********/

    /**
     *
     * 进入页面后自动播放语音
     * 话题未结束，话题未开始，有发言权限不自动播放；
     * 直播开始后2小时内，则播放最后一条；
     * 其他播放第一条；
     *
     * 原判断[this.props.topicInfo.status == "beginning" && (this.props.topicInfo.currentTimeMillis <= (this.props.topicInfo.startTime + 7200000))]；
     * 使用 beforeOrAfter 做判断，是因为在node端已经处理判断加载数据了，条件符合。
     *
     * @memberof ThousandLive
     */
    autoplayFirstSpeakMsg() {
        let audioList = this.props.totalSpeakList.filter((item) => {
            return /^(audio|mic\-audio)/gi.test(item.type);
        });
        let listLength = audioList.length;
        if (this.props.power.allowSpeak && this.props.topicInfo.status == "beginning") {
            return;
        }
        if(this.props.topicInfo.startTime > this.props.sysTime){
            return
        }
        if (listLength > 0) {
            if (this.state.beforeOrAfter == 'before') {
                this.playAudio(audioList[listLength - 1].id);
                this.setState({
                    showGotoPlaying: false
                });
            } else {
                // 如果有历史记录且有记录播放秒数 则继续位置播放
                if ( localStorage.getItem('localLastVisit')) {
                    let lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
                    if (lastVisit[this.data.topicId] && lastVisit[this.data.topicId].speakId == audioList[0].id && lastVisit[this.data.topicId].currentTime) {
                        setTimeout(() => {
                            this.audioPlayer.seek(lastVisit[this.data.topicId].currentTime);
                        },500)
                    }
                };
                this.playAudio(audioList[0].id);

            }
        }
    }


    /**
     * 播放器初始化监听
     *
     *
     * @memberOf ThousandLive
     */
    initAudio(){
        this.audioPlayer = new AudioPlayer();

        this.audioPlayer.on("timeupdate",this.audioTimeupdate);
        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);
        this.audioPlayer.on('waiting', () => {
            this.recordMediaReaded();
        });

        this.autoplayFirstSpeakMsg();

    }
    
        
    audioTimeupdate(e) {
        this.audioTimeupdateHandle();
        this.updateLastVisit();
        this.updateMediaReaded();

    }

    // 音频播放基本处理
    @throttle(100)
    audioTimeupdateHandle() {
        this.setState({
            playSecond:this.audioPlayer.currentTime,
            audioDuration:this.audioPlayer.duration
        })
    }

    // 更新最后播放记录
    @throttle(2000)
    updateLastVisit() {
        this.rememberLastVisit();
        
    }


    /**
     * 每5秒内只能提交一次，防止频繁提交
     */
    @throttle(3000)
    updateMediaReaded() {
        this.recordMediaReaded();
        this.data.startLogTime = Date.now();
    }

    /**
     * 完播率
     * @param {any} [second=this.audioPlayer.currentTime] 
     * @memberof AudioPlayerController
     */
    recordMediaReaded(second = this.audioPlayer.currentTime) {
        if (!second || typeof(second) != 'number') {
            return false;
        }
        // @comment temporarily
        typeof _qla != 'undefined' && _qla('commonlog', {
            logType:'event',
            category: 'mediaPlayCompletion',
            business_id:this.state.audioMsgId,
            topicId: this.data.topicId,
            second: second,
            duration: (Date.now() - this.data.startLogTime) / 1000,
        });
    }


    async audioEnded(e){
        //毕业证
        this.diplomaShow()
        //成就卡推送
        // this.compliteCardPush();
        this.rememberImReaded(true);

        if (this.props.isLogin && typeof _qla != 'undefined' && this.state.audioMsgId) {
            this.recordMediaReaded();
        }

        let nextAudioMsg = this.nextAudio();
        this.setState({
            playSecond:0,
            audioDuration:0.01,
            playStatus:'ready',
            audioLoading:false,
            audioUrl:'',
            audioMsgId:''
        })


        if (nextAudioMsg){
            /**
             * 播放下一条前，重置播放速度
             */
            const currentSpeed = this.state.audioSpeedRate;

            this.audioPlayer.playbackRate = 1;
            this.setState({
                audioSpeedRatcurrentSpeed: 1,
            }, _=> {
                this.audioPlayer.playbackRate = currentSpeed;
                this.setState({
                    audioSpeedRate: currentSpeed
                }, () => {
                    this.playAudio(nextAudioMsg.id);
                })
            })
        } else {
            const result = await this.props.getSysTime();
            // 如果没有下一条音频，则需要判断
            // 1.音频互动
            // 2.是否已经结束 或者开课时间大于2小时
            // 满足以上条件就跳转到下一节课程
            if (this.props.topicInfo.status === 'ended' || result.data.sysTime > (this.props.topicInfo.startTime + 7200000)) {
                console.log('音频播放完毕了,是时候跳转去下一节课了');
                // this.gotoNextCourse();
            }
        }

    }

    audioPause(e){
        this.recordMediaReaded();
        this.rememberImReaded(false);
        this.setState({
            playStatus:'pause',
        })
    }

    audioPlaying(e){

        this.setState({
            playStatus:'play',
            audioLoading : false,
        })

        let nextAudioMsg = this.nextAudio();
        if (nextAudioMsg) {
            this.audioPlayer.preLoad(nextAudioMsg.content)  //预加载
        }
        this.tryLoadMsg();


        if (this.props.topicInfo.style == 'ppt') {
            let audioIndex = this.props.totalSpeakList.findIndex((item, index, arr) => {
                return item.id == this.state.audioMsgId;
            });
            if (audioIndex < 0) {
                return false;
            }
            let audioMsg = this.props.totalSpeakList[audioIndex];
            if (audioMsg.fileId) {
                this.setState({
                    currentPPTFileId: audioMsg.fileId,
                })
            }
        }

        this.data.startLogTime = Date.now();

        // 打印语音播放成功日志
        // eventLog({
        //     category: 'audio-play',
        //     action: 'success',
        // });
    }


    //成就卡推送判断   (已废弃)
    compliteCardPush(){

        if(!this.data.pushCompliteEnable){
            var listenRecordNum={};
            // 判断该音频是否已经被完整的听过
            var recordsReadString = localStorage.getItem('recordReaded');
            if (recordsReadString) {
                var recordsRead = JSON.parse(recordsReadString);
                var audioId = this.state.audioMsgId;
                if (String(recordsRead[audioId]).slice(-6) !== 'readed') {
                    this.data.listenRecordNum++;
                }
            }
            if ( localStorage.getItem(`listenRecordNum_${this.props.userId}`) ) {
                listenRecordNum = JSON.parse(localStorage[`listenRecordNum_${this.props.userId}`]);
            };
            // 先删除再插入，保证插入时间排序正常
            if(listenRecordNum[`${this.data.topicId}`]){
                delete listenRecordNum[`${this.data.topicId}`];
            }
            if(Math.floor(this.data.listenRecordNum/this.data.allRecordNum)>=1){
                listenRecordNum[`${this.data.topicId}`] = this.data.allRecordNum ;
            }else{
                listenRecordNum[`${this.data.topicId}`] = this.data.listenRecordNum ;
            }

            // 最多保留9个话题记录;
            if(Object.keys(listenRecordNum).length > 9){
                let DeleteFirst = true;
                for (let key of Object.keys(listenRecordNum)) {
                    if(DeleteFirst){
                        delete listenRecordNum[key];
                        DeleteFirst = false;
                        break;
                    }
                }
            }
            localStorage.setItem(`listenRecordNum_${this.props.userId}`,JSON.stringify(listenRecordNum));
            if(!this.props.power.allowSpeak&&
            (this.props.topicInfo.status === 'ended'||this.state.beforeOrAfter==="after")&&
            this.data.pushCompliteInfo.status!="Y"&&
            this.data.pushCompliteInfo.status!="C"&&
            this.data.listenRecordNum/this.data.allRecordNum > 0.5){
                this.setState({
                    ...this.state,
                    // showArchivementCardBtn: true
                });
                this.props.pushAchievementCardToUser();
                this.data.pushCompliteInfo.status="Y";
                this.data.pushCompliteEnable=true;
            }
        }

        // 听完了最后一条且已经推送了成就卡，弹出模态窗
        if (this.props.noMore && this.nextAudio() === false && this.data.pushCompliteEnable) {
            this.setState({
                ...this.state,
                showArchivementCardModal: true
            });
            this.data.pushCompliteEnable = false;
        }
    }

    // 实时记录收听秒数
    saveSecondRecord(){
        // 训练营课程或者来自C端用户不执行
        if(this.props.isCampCourse && isFromLiveCenter() && !this.props.isLogin) {
            return
        }
        this.data.listenRecordSecond += 2
        let listenRecord = {}
        if ( localStorage.getItem(`listenRecord_${this.props.userId}`) ) {
            listenRecord = JSON.parse(localStorage[`listenRecord_${this.props.userId}`]);
        };
        if(listenRecord[`${this.data.topicId}`]){
            listenRecord[`${this.data.topicId}`] = {
                ...listenRecord[`${this.data.topicId}`],
                second: this.data.listenRecordSecond,
                end: this.data.end
            }
        }else {
            listenRecord[`${this.data.topicId}`] = {
                num: 0,
                second: this.data.listenRecordSecond,
                end: this.data.end
            }
        }
        // 最多保留9个话题记录;
        if(Object.keys(listenRecord).length > 9){
            let DeleteFirst = true;
            for (let key of Object.keys(listenRecord)) {
                if(DeleteFirst){
                    delete listenRecord[key];
                    DeleteFirst = false;
                    break;
                }
            }
        }
        localStorage.setItem(`listenRecord_${this.props.userId}`,JSON.stringify(listenRecord));
    }

    // 毕业证弹窗判断
    diplomaShow(){
        // 训练营课程或者来自C端用户不弹毕业证
        if(this.props.isCampCourse && isFromLiveCenter() && !this.props.isLogin) {
            return
        }
        // 课程未结束或者开播不到两小时，则不计算
        if(!(this.props.topicInfo.status === 'ended' || (this.props.topicInfo.status == "beginning" && this.props.topicInfo.currentTimeMillis >= (this.props.topicInfo.startTime + 7200000)))){
            return
        }
        // 已经有毕业证，不继续执行
        if(this.data.hasDiplomaCard){
            return
        }
        let listenRecord={};
        // 判断该音频是否已经被完整的听过
        let recordsReadString = localStorage.getItem('recordReaded');
        if (recordsReadString) {
            let recordsRead = JSON.parse(recordsReadString);
            let audioId = this.state.audioMsgId;
            if (String(recordsRead[audioId]).slice(-6) !== 'readed') {
                this.data.listenRecordNum++;
            }
        }
        if ( localStorage.getItem(`listenRecord_${this.props.userId}`) ) {
            listenRecord = JSON.parse(localStorage[`listenRecord_${this.props.userId}`]);
        };
        // 先删除再插入，保证插入时间排序正常
        if(listenRecord[`${this.data.topicId}`]){
            delete listenRecord[`${this.data.topicId}`];
        }
        // 存储已听条数和秒数
        console.log(listenRecord,this.data.listenRecordSecond,this.data.listenRecordNum)
        // 判断是否已经听完最后一条音频
        if(this.nextAudio() === false){
            this.data.end = true
        }
        if(Math.floor(this.data.listenRecordNum/this.data.allRecordNum)>=1){
            listenRecord[`${this.data.topicId}`] = {
                num: this.data.allRecordNum,
                second: this.data.listenRecordSecond,
                end: this.data.end
            };
        }else{
            listenRecord[`${this.data.topicId}`] = {
                num: this.data.listenRecordNum,
                second: this.data.listenRecordSecond,
                end: this.data.end,
            };
        }

        // 最多保留20个话题记录;
        if(Object.keys(listenRecord).length > 20){
            let DeleteFirst = true;
            for (let key of Object.keys(listenRecord)) {
                if(DeleteFirst){
                    delete listenRecord[key];
                    DeleteFirst = false;
                    break;
                }
            }
        }
        localStorage.setItem(`listenRecord_${this.props.userId}`,JSON.stringify(listenRecord));

        // 听完了最后一条且用户听的时长>=总时长的70%
        if (!this.props.power.allowSpeak && this.data.end && this.data.listenRecordNum/this.data.allRecordNum > 0.7) {
                this.topLiveBarEle.getWrappedInstance().marqueeScroll()
        }
    }

    /**
     * 获取下一条音频
     *
     * @readonly
     *
     * @memberof ThousandLive
     */
    nextAudio(){
        let nextAudioMsg;
        // 音频列表
        let audioList = this.props.totalSpeakList.filter((item) => {
            return /(audio|mic\-audio)/gi.test(item.type);
        })
        // audioUrlList后面有个尝试加载下一页需要用到，减少遍历
        this.data.audioUrlList = audioList;

        let audioIndex = audioList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        // 如果找不到，audioIndex是为-1，就会又从第一条音频开始播放
        if(audioIndex < 0){
            return false
        }

        audioIndex++;
        if (audioIndex < audioList.length) {
            nextAudioMsg = audioList[audioIndex];
        }else{
            nextAudioMsg = false;
        }

        return nextAudioMsg;
    }



    /**
     * 统一播放音频方法
     *
     * @param {any} src
     *
     * @memberof ThousandLive
     */
    doPlayMsg(src){
        try {
            this.audioPlayer.pause();
        } catch (error) {
            console.log(error);
        }

        this.rememberImReaded();
        this.rememberLastVisit();




        this.setState({
            audioLoading : true,
        });


        this.audioPlayer.play(src);

        this.showFollowTipsHandle();

        let playTime = Date.now();
        if (playTime - this.data.lastScrollTime > 10000) {
            this.gotoPlayingMsg();
        }
    }

    /**
     * 显示关注提示和提交统计
     * 听了超过3条语音显示 关注提示
     * 听了超过30条语音 提交是指统计
     * @memberof ThousandLive
     */
    showFollowTipsHandle() {
        this.data.playTimes++;

        if (this.data.playTimes === 1) {
            this.props.setCanPopDownloadBar(true)
        }

        const showFollowBtn = !this.props.power.allowSpeak && !this.props.isFollow && !this.props.power.allowMGLive;
        // if (this.data.playTimes == 3) {
        //     this.setState({
        //         showFollowTips: true
        //     })
        // } else
        if (showFollowBtn && this.data.playTimes == 30) {
            // 打印
            eventLog({
                category: "nofollowAfterListen",
				action:"success",
				businessId:this.data.topicId,
				playTimes:this.data.playTimes
            });
        }
    }

    /**
     * 记录播放过音频
     *
     * @param {any} id
     *
     * @memberof ThousandLive
     */
    rememberImReaded(isRead = false) {
        let audioIndex = this.props.totalSpeakList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        if (audioIndex < 0) {
            return;
        }

        let audioMsg = this.props.totalSpeakList[audioIndex];


        let recordReaded = {};

        if ( localStorage.getItem('recordReaded') ) {
            recordReaded = JSON.parse(localStorage['recordReaded']);
        };



		if ( !recordReaded[audioMsg.id] ) {
			recordReaded[audioMsg.id] = new Date().getTime();
            this.setState({
                recordReaded : { ...recordReaded },
            })
			localStorage.setItem('recordReaded',JSON.stringify(recordReaded));
		} else if (isRead) {
            recordReaded[audioMsg.id] = new Date().getTime() + 'readed';
            this.setState({
                recordReaded : { ...recordReaded },
            })
			localStorage.setItem('recordReaded',JSON.stringify(recordReaded));
        }

	    this.updatePercentageComplete(recordReaded);
    };

    /**
     * 记录最后播放的音频
     * 这里使用cookie是因为服务端渲染拿不到localstorage
     * @param {any} id
     *
     * @memberof ThousandLive
     */
    async rememberLastVisit() {
        let audioIndex = this.props.totalSpeakList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        if (audioIndex < 0) {
            return;
        }

        let audioMsg = this.props.totalSpeakList[audioIndex];


        let lastVisit = {};
        let tempVisit = {};
        if ( localStorage.getItem('localLastVisit')) {
            lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
        };

        tempVisit['visitTime'] = Date.now();
        tempVisit['speakTime'] = audioMsg.createTime;
        tempVisit['speakId'] = audioMsg.id;
        tempVisit['currentTime'] = this.state.playSecond;
        tempVisit['duration'] = this.state.audioDuration;
        lastVisit[this.data.topicId] = tempVisit;

        //最多保留100个
        let lastVisitArr = Object.entries(lastVisit);
        lastVisitArr = lastVisitArr.sort((a, b) => {
            let rev = -1;
            a = a[1]['visitTime'];
            b = b[1]['visitTime'];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        
        })
        if (lastVisitArr.length > 100) {
            let key = lastVisitArr[lastVisitArr.length - 1][0];
            delete lastVisit[key]
        }

        localStorage.setItem('localLastVisit', JSON.stringify(lastVisit))
        
        // 记录用户当次收听的时长
        this.saveSecondRecord()
	};






    // 播放音频
    playAudio(id) {
        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.totalSpeakList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.totalSpeakList[audioIndex];
        // 获取音频路径
        let url = audioMsg.content;

        // let playUrl = await this.getPlayUrl(url);

        // 录音状态下播放音频会进入假录音
        if(this.refs.speakBar){
            if ( this.refs.speakBar.refs.speakRecording.state.recordingStatus != 'ready') {
                return false;
            }
        }


        if (this.state.audioMsgId != id) {
            this.setState({
                playSecond:0,
                audioDuration:0,
                audioUrl:url,
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            }, () => {
                this.audioPlayer.volume = 1;
                this.doPlayMsg(url);
            })
        } else {
            this.setState({
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.resume();
        }
    }

    // 暂停音频
    pauseAudio(){
        this.audioPlayer.pause();
        this.setState({
            playStatus: 'pause',
            audioLoading:false,
        })
    }

    // 拖放音频
    setAudioSeek(percent){
        this.audioPlayer.pause();
        let currentTime = parseInt(this.state.audioDuration * percent / 100);
        // this.audioPlayer.currentTime = currentTime;
        this.audioPlayer.seek(currentTime);
        this.audioPlayer.resume();
        this.setState({
            playStatus:'play'
        });
    }


    /**
     *
     * 初始化自动播放消息
     *
     * @memberof ThousandLive
     */
    initAutoPlay () {
        let status = true;
        if (this.props.power.allowSpeak) {
            status = false;
        };
        // 未开播的话题不自动播放
        if(this.props.topicInfo.status == 'beginning' && this.props.topicInfo.startTime > this.props.sysTime){
            status = false;
        }

        this.setState({
            autoPlayMsg: status
        })
    }

    /**
     * 连续播放兼容
     * 播放音频时检测是否最后一条是否还有后续数据，加载下一页
     *
     * @param {any} url
     * @memberof ThousandLive
     */
    tryLoadMsg(){
        let arrIndex = this.data.audioUrlList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });
        if (!this.props.noMore && arrIndex > -1  && arrIndex  ==  this.data.audioUrlList.length - 1 ){
            this.getTopicSpeakList({time:this.props.totalSpeakList[this.props.totalSpeakList.length - 1].createTime});
        }
    }

    /********** 播放音频部分 end **********/


    /********** 回到播放位置 start **********/




    /**
     *
     * 回到播放位置
     *
     * @memberof ThousandLive
     */
    gotoPlayingMsg(){
        this.scrollToSpeak(this.state.audioMsgId, true);
    }

    /**
     * 回到播放位置滚动处理
     *
     * @param {any} topicPageHight
     * @param {any} distanceScroll
     *
     * @memberof ThousandLive
     */
    showGotoPlayHandle (topicPageHight , distanceScroll){
        if (this.state.audioMsgId && this.data.handleDelayTime) {
            this.data.handleDelayTime = false;
            setTimeout(() => {
                this.data.handleDelayTime = true;
            },1000)
            let msgDom = findDOMNode(this.refs.speakList.refs['forum-item-' + this.state.audioMsgId]);
            if (!msgDom) {
                return;
            }
            let selfHeight = msgDom && msgDom.clientHeight;
            let selfTop = msgDom && msgDom.offsetTop;
            if (selfTop > topicPageHight + distanceScroll || selfTop < distanceScroll) {
                if (!this.state.showGotoPlaying && this.state.playStatus == 'play') {
                    this.setState({
                        showGotoPlaying : true
                    })
                    setTimeout(() => {
                        this.setState({
                            showGotoPlaying : false
                        })
                    },3000)
                }
            } else {
                this.setState({
                    showGotoPlaying : false
                })
            }

        }
    }


    setRecStatus(status) {
        this.setState({
            recordingStatus : status
        })
    }

    /********** 回到播放位置 end **********/

    // 显示红包消息
    setRewordDisplay = async (status) =>{
        let result = await this.props.setRewordDisplay(status,this.data.topicId);
    }

    // 打开首页信息流弹窗二维码
    showSpeakMsgFirstQrcode(qrCode, appId){
        this.setState({
            speakMsgFirstQrCode: qrCode,
            speakMsgFirstAppId: appId,
            showSpeakMsgFirstQrcode: true
        })
    }
    // 关闭首页信息流弹窗二维码
    hideSpeakMsgFirstQrcode(){
        this.setState({
            showSpeakMsgFirstQrcode: false
        })
    }

    /**
     * 关闭赞赏弹框
     *
     * @memberOf ThousandLive
     */
    onCloseReward() {
        this.setState({
            showLuckyMoney: false
        });
    }

    /**
     *
     * 打开赞赏弹框
     *
     * @memberOf ThousandLive
     */
    onOpenReward(userId, headImgUrl, name) {
        if(this.props.userId == userId){
            window.toast('不能赞赏自己');
        }else{
            this.setState({
                showLuckyMoney: true,
                payForId: userId,
                payForPortrait: headImgUrl,
                payForName: name,
            });
        }
    }

    /**
     * 赞赏金额点击事件
     *
     * @memberOf ThousandLive
     */
    onRewardItemClick(money) {
        if(this.props.userId == this.state.payForId){
            window.toast('不能赞赏自己');

        }else{
            this.props.doPay({
                type: 'REWARD',
                total_fee: money,
                topicId: this.data.topicId,
                liveId: this.data.liveId,
                toUserId: this.state.payForId,
                callback: () => {
                    logPayTrace({
                        id: this.data.topicId,
                        type: 'topic',
                        payType: 'REWARD',
                    });
                    // this.initRewardCardQrUrl()
                    this.onCloseReward();
                },
            })
        }
    }

    /**
     * 显示打赏画卡(未打赏的画卡)
     */
    showRewardCard(type){
        this.rewardCardEle.show(type)
    }

    /**
     * 回复评论
     *
     *
     * @memberOf ThousandLive
     */
    onFeedback(speakItem,showTextInput = false) {
        showTextInput && this.refs.speakBar &&  this.refs.speakBar.switchTab('text',true);
        this.setState({
            feedbackTarget: {...speakItem}
        });
    }

	/**
	 * 清除回复数据
	 *
	 *
	 * @memberOf ThousandLive
	 */
    clearFeedback(){
	    this.setState({
		    feedbackTarget: null
	    });
    }

    /**
     * 底部发言栏状态切换
     *
     *
     * @memberOf ThousandLive
     */
    onSwitchTab(type) {
        this.setState({
            bottomTabType : type
        })
        if (type != 'audio' && type != 'text' ) {
            this.setState({
                feedbackTarget: null
            });
        }
    }



    /**
     *
     * 收起底部发言区
     * @param {any} e
     *
     * @memberof ThousandLive
     */
    closeBottomBar(e) {
        const node = findDOMNode(this.refs.topicMainBox);
        const target = e.target || e.srcElement;
        const isInside = node.contains(target);

        if (isInside) {
            if(this.props.power.allowSpeak){
                this.refs.speakBar && this.refs.speakBar.switchTab('');
            } else {
                this.refs.speakBarClient && this.refs.speakBarClient.inputOnBlur();
                this.refs.speakBarClient && this.refs.speakBarClient.switchRecording();
            }
        }

    }


    /**
     *
     * 粘贴截图
     * @param {any} url
     *
     * @memberOf ThousandLive
     */
    showPasteBox (file,url) {
        this.setState({
            pasteFile : file,
            pasteImgUrl : url,
        })
        this.refs.dialogPaste.show();
    }

    /**
     * 发送截图
     *
     *
     * @memberOf ThousandLive
     */
    async sendPasteImg(tag){
        if(tag=="confirm"){
            const file = new File([this.state.pasteFile], 'filename.jpg');
            try {
                const filePath = await this.props.uploadImage(file,"liveComment");
                if (filePath) {
                    let result = await this.addTopicSpeak("image",filePath);
                    if (result.state && result.state.code == 0){
                        this.refs.dialogPaste.hide();
                    }
                }


            } catch (error) {
                console.log(error);
            }

        }else{
            this.refs.dialogPaste.hide();
        }
    }

    /**
     * 打开视频播放弹层
     */
    onOpenVideoPlayer(videoUrl) {
        this.setState({
            openVideoplayer: true,
            videoUrl
        });
    }

    /**
     * 关闭视频播放弹层
     */
    onCloseVideoPlayer() {
        this.setState({
            openVideoplayer: false
        });
    }

	onPPTSwiped = (currentPPTFileId) => {
		this.setState({
			currentPPTFileId
		});
	};


    /**
     *
     * 显示评论列表
     *
     * @memberof ThousandLive
     */
    showCommentList() {
        this.setState({
            showCommentList: true,
        });
    }

    /**
     *
     * 收起评论列表
     *
     * @memberof ThousandLive
     */
    hideCommentList() {
        this.setState({
            showCommentList: false,
            feedbackTarget:null,
        });
    }

    /**
     *
     * 显示问题列表
     *
     * @memberof ThousandLive
     */
    showQuestionList() {
        this.setState({
            showQuestionList: true,
        });
    }

    /**
     *
     * 收起问题列表
     *
     * @memberof ThousandLive
     */
    hideQuestionList() {
        this.setState({
            showQuestionList: false,
        });
    }

    controlBarrageList() {
        this.setState({
            showBarrageList: !this.state.showBarrageList,
        });
    }

    @deprecated
    onWhisperQuestionClick() {
        window.simpleDialog({
            title: '分成说明',
            msg: '问题被旁听后，提问者得0.49元，回答者得0.49元',
            buttons: 'cancel',
            cancelText: '关闭',
            onCancel: () => {
                console.log('cancel');
            }
        });
    }


    /**
     * 弹出关注二维码弹框
     */
    onPopQrcode() {
        this.setState({
            showDialog: true
        });
    }


    /*推送成就卡*/
    async initPushCompliteCard(){

        // 训练营课程不推成就卡
        if(this.props.isCampCourse) {
            return
        }

        this.data.allRecordNum = this.props.getnowTopicVideoCount.topicVideoCount;
        var listenRecordNum={};
        if ( localStorage.getItem(`listenRecordNum_${this.props.userId}`) ) {
            listenRecordNum = JSON.parse(localStorage[`listenRecordNum_${this.props.userId}`]);
        };
        if(listenRecordNum[`${this.data.topicId}`]){
            this.data.listenRecordNum=listenRecordNum[`${this.data.topicId}`];
        }else{
            this.data.listenRecordNum=0;
        }
        this.data.pushCompliteInfo=(this.props.pushCompliteInfo&&this.props.pushCompliteInfo.achievementCardRecord)||{};//pushAchievementCardToUser
        //非管理员，结束或开播2小时，没有推送过, 完播率大于50%

        if(!this.props.power.allowSpeak&&
        (this.props.topicInfo.status === 'ended'||this.state.beforeOrAfter==="after")&&
        this.data.pushCompliteInfo.status!="Y"&&
        this.data.pushCompliteInfo.status!="C"&&
        this.data.listenRecordNum / this.data.allRecordNum > 0.5){
            this.props.pushAchievementCardToUser();
            this.data.pushCompliteInfo.status="Y";
            this.data.pushCompliteEnable=true;
        }
        // if (this.data.pushCompliteInfo.status) {
        //     this.setState({
        //         showArchivementCardBtn: true
        //     });
        // }
    }

    // 毕业证
    async initDiplomaCard() {
        
        // 训练营课程或者来自C端用户不弹毕业证
        if(this.props.isCampCourse && isFromLiveCenter()) {
            return
        }
        // 课程未结束或者开播不到两小时，则不计算
        if(!(this.props.topicInfo.status === 'ended' || (this.props.topicInfo.status == "beginning" && this.props.topicInfo.currentTimeMillis >= (this.props.topicInfo.startTime + 7200000)))){
            return
        }
        //非管理员，且有了毕业证才显示，还没获得毕业证则继续统计时长
        const diplomaMes = await initDiplomaMes(this.data.topicId)
        if(!this.props.power.allowSpeak){
            if(diplomaMes && diplomaMes.learningDays){
                this.data.hasDiplomaCard = true
                this.topLiveBarEle.getWrappedInstance().marqueeScroll(diplomaMes)
            }else {
                this.data.allRecordNum = this.props.getnowTopicVideoCount.topicVideoCount;
                var listenRecord={};
                if ( localStorage.getItem(`listenRecord_${this.props.userId}`) ) {
                    listenRecord = JSON.parse(localStorage[`listenRecord_${this.props.userId}`]);
                };
                if(listenRecord[`${this.data.topicId}`]){
                    this.data.listenRecordNum=listenRecord[`${this.data.topicId}`].num
                }else{
                    this.data.listenRecordSecond=0;
                    this.data.listenRecordNum=0
                }
            }
        }
    }

    //弹出推送直播弹框
    showPushTopicDialog()  {
        this.setState({
            showPushTopicDialog: true,
        })
    }

    // 跳转到推送课程页面
    pushCourse(){
        locationTo(`/wechat/page/live-push-message?channelId=${this.props.topicInfo.channelId || ''}&topicId=${this.data.topicId}&isSingleBuy=${this.props.topicInfo.isSingleBuy}`)
    }

    //关闭推送直播弹框
    hidePushTopicDialog() {
        this.setState({
            showPushTopicDialog: false,
        });
    }

    // 打开详情页底部二维码锁（允许底部二维码弹出）
    openBottomQrcodeLock(){
        this.timer = setTimeout(()=>{
            this.setState({bottomQrcodeLock: true})
        },20000)
    }
    // 关闭详情页底部二维码锁（禁止底部二维码弹出）
    closeBottomQrcodeLock(){
        if(this.timer){
            clearTimeout(this.timer)
        }
        this.setState({bottomQrcodeLock: false})
    }

    componentWillReceiveProps(nextProps) {
        (nextProps.insertNewMsg && nextProps.insertNewMsg != this.props.insertNewMsg ) && this.newMsgScroll();
        (nextProps.delMsg && nextProps.delMsg != this.props.delMsg ) && this.checkPlayAudio(nextProps.delMsg);

        // 判断是否有列表需要更新
        if (this.props.forumSpeakList.length != nextProps.forumSpeakList.length) {
            this.hasNewList = true;
        } else if (!this.hasNewList) {
            for (let i=0; i<this.props.forumSpeakList.length; i++) {
                if (this.props.forumSpeakList[i].id != nextProps.forumSpeakList[i].id) {
                    this.hasNewList = true;
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.bottomTabType === '' && prevState.bottomTabType !== '') {
            document.removeEventListener('click', this.closeBottomBar);
        }

        if (this.state.bottomTabType !== '' && prevState.bottomTabType === '') {
            document.addEventListener('click', this.closeBottomBar, false);
        }

        if (!this.hasNewList || prevProps.forumSpeakList.length === 0) {
            return;
        }

        const prevId = prevProps.forumSpeakList[0].id;
        this.firstSpeakItem = findDOMNode(this.refs.speakList.refs[`forum-item-${prevId}`]) || this.firstSpeakItem;
        this.hasNewList = false;
        this.listAutoFix();
        // this.data.listDom.scrollTop = this.firstSpeakItem.offsetTop;
        // this.state.bottomTabType != '' && (this.props.power.allowSpeak || (!this.props.power.allowSpeak && this.props.isAudioOpen == 'Y'))?

        // 页面更新完成，触发事件
        // const names = this.event.eventNames();
        // names.forEach(name => this.event.emit(name));
        this.event.emit('onComponentDidUpdate');

        if (!this.isUpdateShare && this.props.platformShareRate && this.props.platformShareRate != prevProps.platformShareRate) {
            // 如果有平台分销则需要重置页面分享。
            this.isUpdateShare = true;
            this.initShare();
        }
    }

    // 修正话题的滚动位置
    initAutoFixed() {
        if (!this.props.forumSpeakList[0]) {
            return;
        }

        this.firstSpeakItem = findDOMNode(this.refs.speakList.refs[`forum-item-${this.props.forumSpeakList[0].id}`]) || this.firstSpeakItem;
        this.data.listDom = findDOMNode(this.refs.topicListContainer);
        this.preScrollTop = this.data.listDom.scrollTop;
        this.data.prevHeight = this.data.listDom.scrollHeight;
        this.listAutoFix();
    }

    // 修正话题的滚动位置 -- 循环修正
    listAutoFix () {
        if (!this.enableFix) {
            return;
        }
        if (!this.data.listDom) {
            return;
        }
        if (this.scrollDirection === 'toTop') {
            if (this.firstSpeakItem && this.firstSpeakItem.offsetTop > 25) {
                this.data.listDom.style['-webkit-overflow-scrolling'] = 'auto';
                setTimeout(() => {
                    if (!this.firstSpeakItem) return;

                    this.data.listDom.scrollTop = this.firstSpeakItem.offsetTop;
                    this.data.listDom.style['-webkit-overflow-scrolling'] = 'touch';
                    // 一定要这句，否则会产生抖动，因为列表中的某些item，比如文件的item，需要请求数据，然后item的高度会随结果改变，会影响其之后item的offsetTop
                    // 所以会多次调用这个fix函数，就会多次回到fix点，产生抖动
                    if (!this.data.loadingNext) {
                        this.firstSpeakItem = null;
                        this.scrollDirection = '';
                    }
                }, 50);
            }
        } else if (this.scrollDirection === 'toBottom') {
            this.data.listDom.style['-webkit-overflow-scrolling'] = 'auto';
            setTimeout(() => {
                if (!this.lastSpeakItem) return;

                const lastSpeakItemDom = findDOMNode(this.refs.speakList.refs[`forum-item-${this.lastSpeakItem.id}`]);
                if (lastSpeakItemDom) {
                    this.data.listDom.scrollTop = lastSpeakItemDom.offsetTop - this.data.listDom.clientHeight + 300
                    this.data.listDom.style['-webkit-overflow-scrolling'] = 'touch';
                }

                if (!this.data.loadingNext) {
                    this.scrollDirection = '';
                    this.lastSpeakItem = null;
                }
            }, 50);
        }
    }

	scrollToItem = (id) => {
		// this.refs.speakList.scrollToItem(id);
        this.scrollToSpeak(id, true);
    };

    hideArchivementCardModal(){
        this.setState({
            ...this.state,
            showArchivementCardModal: false
        });
    }



    /**
     *
     * 关注直播间判断
     *
     * @memberof ThousandLive
     */
    followLive() {
        this.props.followLive(this.data.liveId);
        this.setState({
            showFollowDialog: true
        });
    }
    closeFollowLive(){
        this.setState({
            showFollowDialog: false,
        });
    }
    focusLiveClick(){
        this.props.followLive(this.data.liveId);
    }

    // onFollowLiveQrcode() {
    //     this.setState({
    //         showCommencementDialog: true
    //     });

    // }

    /** 左下角关注引导点击事件 */
    onIncrFansActivityBtnClick () {
        if(this.state.incrFansFocusGuideConfigs.outsideChain === 'N') {
            this.setState({
                showIncrFansFocusGuideDialog: true
            })
        } else {
            locationTo(this.state.incrFansFocusGuideConfigs.qrCode);
        }
    }

    onCloseIncrFansDialog() {
        this.setState({
            showIncrFansFocusGuideDialog: false
        })
    }

    async getCreateLiveStatus(){
        await wait(4000);

        let result = await Promise.all([
            this.props.isLiveAdmin(this.data.liveId),
            this.props.getCreateLiveStatus(this.data.topicId),
        ]);

        let isLiveAdmin = this.state.isLiveAdmin;
        let hasNotLive = this.state.hasNotLive;

        if (getVal(result, '0.state.code') == 0) {
            isLiveAdmin = getVal(result, '0.data.isLiveAdmin', 'N')
        }

        if( getVal(result, '1.state.code') == 0){
            hasNotLive = getVal(result, '1.data.liveStatus')
        }

        this.setState({
            hasNotLive: hasNotLive != 'Y',
            isLiveAdmin,
        },this.initShare)
    }

    recordScrollTime() {
        if (this.data.recordTimeout) {
            this.data.recordTimeout = false;
            this.data.lastScrollTime = Date.now();
            setTimeout(() => {
                this.data.recordTimeout = true;
            },1000)
        }
    }

    get isC() {
        return !this.props.power.allowSpeak
    }

    get appStyle() {
        if (/(audio|video|ppt)$/.test(this.props.topicInfo.style)) {
            return 'mid'
        } else {
            return 'top'
        }
    }

    get canShowBar() {
        // 是否从首页进来
        let hadViewRecommond = false;

        if (typeof sessionStorage != 'undefined') {
            hadViewRecommond = /recommend/.test(sessionStorage.getItem('trace_page'))
        }

        // 是否收费
        // let isCharge = this.props.topicInfo.type === 'charge'

        // 非专业版才显示
        // return this.state.isLiveAdmin == 'N' && (hadViewRecommond || isCharge);
        // return (!this.state.isOfficialLive && this.state.isLiveAdmin == 'N')
        return hadViewRecommond ||
        (
            (
                (this.state.isLiveAdmin == 'Y' && this.state.isOfficialLive) || this.state.isLiveAdmin == 'N'
            )
            && this.state.isWhiteLive === 'N'
        )
    }


	@throttle(1000)
	audioSpeedBtnClickHandle(){
		let index = AUDIO_SPEED_RATE_MAP.indexOf(this.state.audioSpeedRate) + 1;
		if(index >= AUDIO_SPEED_RATE_MAP.length){
			index = 0;
		}
		this.audioPlayer.playbackRate = AUDIO_SPEED_RATE_MAP[index];
		this.setState({
			audioSpeedRate: AUDIO_SPEED_RATE_MAP[index],
			audioSpeedBtnAct: true,
		}, _=> {
			setTimeout(_=> {
				this.setState({
					audioSpeedBtnAct: false
				})
			},500);
		})
	}

	async initGuidePurchaseBtnInAudition(){
	    if(this.props.topicInfo.isAuditionOpen === 'Y' && !this.props.power.allowMGLive && this.props.topicInfo.channelId){
            const res = await this.props.fetchChargeStatus(this.props.topicInfo.channelId);
            if(res.state.code === 0 && !res.data.chargePos){
                this.setState({
                    showAuditionGuidePurchaseBtn: true
                })
            }
        }
    }

    /** 去下一节课程 */
    async gotoNextCourse(){
	    if(!this.props.topicInfo.channelId){
	        return false;
        }
        const res = await this.props.fetchLastOrNextTopic({
            topicId: this.data.topicId,
            type: 'all',
        });
        if (res.state.code === 0 && res.data.nextTopicId) {
	        locationTo(`/topic/details?topicId=${res.data.nextTopicId}`);
        }
    }


    // 请求提纲列表
    async getOutlineList() {
        let result = this.props.getOutlineList({
            topicId:this.data.topicId
        })
        console.log(result);
    }

    /************课堂红包相关开始***************/

    // 跳转到发红包页面
    locationToRedpack(){
        let channel = `${this.props.topicInfo.channelId?'&channelId='+this.props.topicInfo.channelId:''}`;
        let camp = `${this.props.topicInfo.campId?'&campId='+this.props.topicInfo.campId:''}`;
        locationTo(`/wechat/page/red-envelope?liveId=${this.props.topicInfo.liveId}${channel}${camp}&topicId=${this.props.topicInfo.id}&authNum=${this.props.topicInfo.browseNum}`)
    }

    // 红包点击
    async redpackClick(props, type, hasOpenedByMe){
        // 曝光日志收集
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
        // 过期红包和已经领完的红包不能点
        if(type === 'expiry'){
            window.toast(`该红包已过期`)
            return
        }
        if(type === 'empty'){
            window.toast(`该红包已领完`)
            return
        }
        // 自己已经点过红包
        if(hasOpenedByMe){
            // 请求锁
            if(this.openLock) {
                return
            }
            this.openLock = true
            let redEnvelopeList = this.state.redEnvelopeList
            // 从state中查找是否已经开启相应的红包，有的话直接拿数据，没有的话就请求接口并将数据存入state
            let currentRedEnvelope = redEnvelopeList.find(item => item.id == props.commentId)
            if(currentRedEnvelope){
                this.redpackDialogEle.show(props, currentRedEnvelope)
            }else {
                const result = await getMyReceiveDetail(props.commentId)
                let item = {
                    ...result.detailDto,
                    id: props.commentId,
                    money: result.detailDto && result.detailDto.realMoney || 0,
                }
                // 有正确的请求结果才存到state
                if(result && result.detailDto){
                    redEnvelopeList.push(item)
                    this.setState({redEnvelopeList})
                    this.redpackDialogEle.show(props, item)
                }
            }
        }else {
            this.redpackDialogEle.show(props)
        }
    }

    // 请求解锁
    unLockRequest(){
        this.openLock = false
    }

    // 打开红包
    async openRedpack(id){
        let redEnvelopeList = this.state.redEnvelopeList
        let result = await receiveRedEnvelope(id)
        await this.props.updateRedEnvelope(id, result.acceptResult)
        redEnvelopeList.push({
            id,
            ...result
        })
        this.setState({redEnvelopeList})
        return result
    }

    // 跳转到分享榜页面
    locationToShare(id){
        // 系列课下的话题，都跳转到系列课分享卡页面，其余跳转到话题分享卡页面
        let type = 'topic'
        if(this.props.topicInfo.channelId){
            type = 'channel'
        }
        locationTo(`/wechat/page/sharecard?wcl=redEnvelope&redEnvelopeId=${id}&type=${type}&${type}Id=${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}&liveId=${this.props.topicInfo.liveId}`)
    }

    locationToCoupon(){
        let type = 'topic'
        if(this.props.topicInfo.channelId){
            type = 'channel'
        }
        locationTo(`/wechat/page/coupon-code/list/${type}/${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}`)
    }

    /************课堂红包相关结束***************/

    // 提纲段落所在高亮显示
    getOutlistMark() {
        let scrollTop = this.refs.topicListContainer.scrollTop;
        let msgItem = this.props.forumSpeakList.find((item, index) => {
            let itemDom = this.refs.speakList.refs['forum-item-' + item.id];
            return itemDom && findDOMNode(this.refs.speakList.refs['forum-item-' + item.id]).offsetTop > scrollTop;
        })
        return msgItem;
    }

    // 显示毕业证弹窗
    showDiploma(diplomaData){
        this.diplomaDialog.show(diplomaData)
    }

    // 隐藏毕业证弹窗
    hideDiploma(){
        this.diplomaDialog.hide()
    }

    // 完成度记录
    updatePercentageComplete(recordReaded){
        const finishedCount = this.props.totalSpeakList.filter(l => {
            return /readed/.test(recordReaded[l.id]);
        }).length;
        if(finishedCount){
	        updatePercentageComplete({
                topicId: this.data.topicId,
                finished: finishedCount,
                total: this.state.totalAudioSpeakList.length
	        });
        }
    }

    // 关闭作业弹窗
    closeJobListDialog(){
        this.setState({
            showJobListDialog: false,
        })
    }

    // 显示作业弹窗
    showDislog(){
        this.setState({
            showJobListDialog: true,
        })
    }

	goApp () {
        const url = location.origin + '/wechat/page/topic-intro?topicId=' + this.props.topicInfo.id
        openApp({
            h5: url,
            ct: 'background',
            ckey: 'CK1424279504415',
        });
	}

    showAppDownloadConfirm = () => {
        this.pauseAudio();
        this.setState({isShowAppDownloadConfirm: true})
	}

	hideAppDownloadConfirm = () => {
		this.setState({isShowAppDownloadConfirm: false})
	}

    initUserTopicRole = () => {
        this.props.getUserTopicRole(this.data.topicId).then(res => {
            if (!res.state.code) {
                this.setState({
                    userTopicRole: res.data.role
                })
            }
        }).catch(err => {})
    }

	async initTotalSpeakList() {
		let result = await this.props.fetchTotalSpeakList({ type: 'audio', topicId: this.data.topicId });
		if (result.state && result.state.code === 0) {
			this.setState({
	            totalAudioSpeakList: result.data.speakList
            }, () => {
				if (localStorage.getItem('recordReaded')) {
					const recordReaded = JSON.parse (localStorage['recordReaded']);
					this.updatePercentageComplete(recordReaded);
				};
            });
		}

    }

    /***********************开始拉人返学费相关***************************/

    // 打开返学费弹窗
	openBackTuitionDialog = ()=>{
		this.backTuitionDialogEle.show({
            inviteTotal: this.state.missionDetail.inviteTotal,
            returnMoney: this.state.missionDetail.returnMoney,
            expireTime: this.state.missionDetail.expireTime,
            missionId: this.state.missionDetail.missionId,
            data: this.props.topicInfo,
            type: this.props.topicInfo.channelId ? 'channel' : 'topic'
        })
    }

    // 获取返学费信息
	initInviteReturnInfo = async() => {
        // 单节购买的课不支持返学费
        if(this.props.topicInfo.isSingleBuy === 'Y'){
            return
        }
		await request({
			url: '/api/wechat/transfer/h5/invite/return/inviteReturnInfo',
			body: {
				businessId: this.props.topicInfo.channelId || this.props.topicInfo.id,
				businessType: this.props.topicInfo.channelId ? 'channel' : 'topic',
			}
		}).then(res => {
			if(res.state.code) throw Error(res.state.msg)
			if(res.data) {
				let showBackTuition = false
				if(res.data.canInviteReturn == 'Y' && res.data.hasMission == 'Y'){
					let missionDetail = res.data.missionDetail
					if(missionDetail.status == 'N' && missionDetail.expireTime > Date.now()){
						showBackTuition = true
					}
				}
                this.setState({
                    showBackTuition,
                    missionDetail: getVal(res, 'data.missionDetail', {})
                })
                // 拉人返现需要重置
                if(showBackTuition) {
                    this.initShare()
                }
			}
		}).catch(err => {
			console.log(err);
		})
	}
    /***********************结束拉人返学费相关***************************/

    /***********************开始请好友免费听相关***************************/

    async checkShareStatus(){
        /**
         * 请好友免费听的用户的条件是：
         * 1、该话题是系列课下的，不是单节付费，不是试听课
         * 2、开启了邀请分享功能且还有剩余名额
         * 3、系列课是付费的且自己已经购买，或者自己是vip（这点后端接口会判断）
         */
        let canInvite = 'N',remaining = 0
        if (this.props.topicInfo.channelId && this.props.topicInfo.isAuditionOpen !== 'Y' && this.props.topicInfo.isSingleBuy !== 'Y'){
            const result = await checkShareStatus({
                channelId: this.props.topicInfo.channelId,
                topicId: this.props.topicInfo.id,
            })
            if(result.state.code === 0){
                if(result.data && result.data.isOpenInviteFree === 'Y' && result.data.remaining > 0){
                    canInvite = 'Y'
                    remaining = result.data.remaining
                }
            }
        }
        this.setState({canInvite, remaining})
    }

    // 打开请好友免费听弹窗（首先获取分享id）
    async openInviteFriendsToListenDialog(){
        const result = await fetchShareRecord({
            channelId: this.props.topicInfo.channelId,
            topicId: this.props.topicInfo.id,
        })
        if(result.state.code === 0){
            this.setState({inviteFreeShareId: result.data.inviteFreeShareId})
            this.inviteFriendsToListenDialog.show(this.props.topicInfo, this.state.showBackTuition ? this.state.missionDetail: null)
        }
    }
    // 是否为训练营
    get isCamp(){
        const { power } = this.props;
        const { joinCampInfo } = this.state;
        if(!power.allowSpeak && !power.allowMGLive){
            if(Object.is(joinCampInfo.isCamp,"Y") && Object.is(joinCampInfo.hasPeriod, 'Y')) {
                return true;
            }
            if(Object.is(joinCampInfo.joinCamp,"Y")){
                return true;
            }
        }
        return false
    }


    getLiveStatus() {
        let { startTime } = this.props.topicInfo;
        let { sysTime } = this.props;
        if (Number(sysTime) < Number(startTime)) {
            return false;
        }
        return true;

    }

    initInviteFriendsListenRemindTips () {
        const isShowRemindTips = isNextDay('inviteFriendsListenRemindTips')

        if (isShowRemindTips) {
            setLocalStorage('inviteFriendsListenRemindTips', new Date().getTime())
            this.setState({
                isShowRemindTips
            })
        }
    }

    async ajaxGetInviteDetail () {
        if (!this.props.topicInfo.channelId) return ;
        try {
            let result = await apiService.post({
                url: '/h5/invite/audition/inviteMissionInfo',
                body: {
                    channelId: this.props.topicInfo.channelId
                }
            })
            this.setState({
                inviteDetail: result.data.missionInfo
            })
        } catch (e) {
            console.error(e);
        }
    }

    async ajaxGetInviteList () {
        if (!this.props.topicInfo.channelId) return ;
        try {
            let result = await apiService.post({
                url: '/h5/invite/audition/inviteList',
                body: {
                    channelId: this.props.topicInfo.channelId,
                }
            })
            return result.data.headImageList
        } catch (error) {
            console.error(error);
        }
    }

    async onClickTryListenBar () {
        let { inviteNum, inviteTotal } = this.state.inviteDetail;
        if (inviteNum < inviteTotal) {
            this.ajaxGetInviteDetail();
            let inviteList = await this.ajaxGetInviteList()
            this.setState({
                tryListenMask: {
                    inviteList,
                    show: true
                }
            })
        } else {
            location.href = `/wechat/page/channel-intro?channelId=${this.props.topicInfo.channelId}&autopay=Y`
        }
    }

    async ajaxCanInviteAudition () {
        if (!this.props.topicInfo.isAuditionOpen) return ;
        if (!this.props.topicInfo.channelId) return ;
        try {
            let result = await apiService.post({
                url: '/h5/invite/audition/canInviteAudition',
                body: {
                    channelId: this.props.topicInfo.channelId
                }
            })
            if (result.state.code == 0) {
                this.setState({
                    canInviteAudition: result.data.canInviteAudition
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    // 判断是否已经显示过开播弹窗，已经显示过了就不再显示
    get isBeginDialogCanShow(){
        // 已经请求过就不再请求，缓存变化会改变返回值
        if(this.fetchIsBeginDialogCanShow){
            return this.data.isBeginDialogCanShow
        }
        let status = window.localStorage.getItem(`BEGINDIALOGSHOWSTATUS_${this.props.userId}`)
        this.data.isBeginDialogCanShow = true
        this.fetchIsBeginDialogCanShow = true
        if(!status){
            return true
        }
        status = JSON.parse(status)
        if(Array.isArray(status) && status.includes(this.props.topicInfo.id)){
            this.data.isBeginDialogCanShow = false
            return false
        }
        return true
    }

    /***********************结束请好友免费听相关***************************/
    
    // 获取用户是否有创建的直播间
    async hasLive(){
        const result = await request({
            url: '/api/wechat/channel/getLiveList',
            method: 'GET'
        });
        if(result.state.code === 0){
            if(result.data.entityPo !== null){
                this.setState({
                    isHasLive: true,
                })
            }
        }
        this.setState({
            getHasLive: true,
        });
    }
    
    /**
     * 好友关系 
     */ 
    // 添加分享评论
    async addShareComment() {
        const res = await this.getShareCommentConfig();
        if(res && res.flag !== 'Y') return ;
        await this.props.addShareComment({
            userId: this.props.userId,
            liveId: this.props.liveInfo.entity.id,
            topicId: this.props.topicInfo.id
        });
    }

    async fetchRelationInfo() {
        this.props.dispatchFetchRelationInfo({userId: this.props.userId});
    }

    async getShareCommentConfig() {
        const res = await this.props.dispatchGetShareCommentConfig({topicId: this.props.topicInfo.id, liveId: this.props.topicInfo.liveId});
        return res;
    }
    async saveShareCommentConfig() {
        let flag;
        if(this.props.shareCommentConfigFlag === 'Y') {
            flag = 'N';
        } else {
            flag = 'Y';
        }

        await this.props.dispatchSaveShareCommentConfig({topicId: this.props.topicInfo.id, liveId: this.props.topicInfo.liveId, closeLive: this.state.isShareCommentLiveSwitch === true ? 'Y' : 'N', flag});
    }

    // 修改评论分享开关
    @throttle(1000)
    async onShareCommentSwitch() {
        if(this.props.shareCommentConfigFlag === 'Y') {
            this.refs.shareCommentSwitchRef.show();
            return ;
        }
        await this.saveShareCommentConfig();
        this.getShareCommentConfig();
    }

    async onShareCommentSwitchOk(e) {
        this.setState({isShareCommentLiveSwitch: false})
        if(e === 'confirm') {
            await this.saveShareCommentConfig();
            this.getShareCommentConfig();
            this.refs.shareCommentSwitchRef.hide();
        }
    }

    // 获取课程对应的社群信息
    async dispatchGetCommunity() {
        try {
            const res = await getCommunity(this.data.liveId, 'topic', this.data.topicId)
            if(res) {
                res.communityCode && this.setState({
                    communityInfo: res
                });
                this.getGroupShow();
            }
        } catch (error) {
        }
    }

    // 判断是否显示社群入口
    getGroupShow() {
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                let communityRecord = JSON.parse(communityList).includes(`${this.data.liveId}_${this.data.topicId}`);
                !communityRecord && this.setState({
                    showGroupEntrance: true
                })
            } catch (error) {
                
            }
        };
    }

    onGroupEntranceClose() {
        this.setState({
            showGroupEntrance: false
        });
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                communityList = JSON.parse(communityList);
                let hasRecord = communityList.includes(item => item === `${this.data.liveId}_${this.data.topicId}`);
                console.log('RECORD',hasRecord)
                if(hasRecord === false) {
                    communityList.push(`${this.data.liveId}_${this.data.topicId}`);
                }
                window.sessionStorage.setItem('SHOW_COMMUNITY_LIST', JSON.stringify(communityList));
            } catch (error) {
                console.log('ERR',error);
            }
        };
    }

    render() {
        const isCend = isFromLiveCenter();
        const node = document.querySelector(".flex-main-s");
        // 判断当前用户角色
        const liveRole = this.props.power.allowMGLive ? this.props.liveInfo.entity.createBy == this.props.userId ? 'creator' : 'manager' : '';

        // 判断是否为B端用户且话题有效
        const showBottomAction = this.props.power.allowSpeak && this.props.topicInfo.status != 'ended';

        return (
            <Page title={htmlTransferGlobal(this.props.topicInfo.topic)}  className="thousand-live flex-body">
                {/* {
                    this.isC && this.canShowBar && (
                        <AppDownloadBar
                            topicId={this.props.topicInfo.id}
                            style={this.appStyle} />
                    )
                } */}
                {/* <AppDownloadBar
                    isC={ this.isC }
                    liveId={ this.props.topicInfo.liveId }
                    topicId={this.props.topicInfo.id}
                    isLiveAdmin={ this.state.isLiveAdmin }
                    isOfficialLive={ this.state.isOfficialLive ? 'Y' : 'N' }
                    isWhiteLive={ this.state.isWhiteLive }
                    style={this.appStyle}
                /> */}
                {/*{*/}
                    {/*!this.props.isCampCourse && this.state.showArchivementCardModal ? <ArchivementCardModal*/}
                                                                {/*hideModal={this.hideArchivementCardModal.bind(this)}*/}
                                                                {/*archivementCardUrl={`/wechat/page/studentComplitedTopic?topicId=${this.data.topicId}&liveId=${this.data.liveId}`} />*/}
                                                        {/*: null*/}
                {/*}*/}

                {/* 打赏卡片 */}
                <RewardCard
                    ref = {el => this.rewardCardEle = el}
                    userInfo = {this.props.userInfo.user}
                    topicInfo = {this.props.topicInfo}
                    // rewardCardCardUrl = {this.state.rewardCardCardUrl}
                />

                {/* 毕业证 */}
                <DiplomaDialog
                    ref = {el => this.diplomaDialog = el}
                    hideDiploma = {this.hideDiploma}
                    userInfo = {this.props.userInfo}
                    topicInfo = {this.props.topicInfo}
                />
                <div className="flex-other">
                    <div className={`${!this.state.showLiveBox?'hide-live-box':''}`}>
	                {
	                    this.props.topicInfo.style === 'ppt' &&
                        <LanternSlide
                            ref="lantern-slide"
                            currentFileId={this.state.currentPPTFileId}
                            onPPTSwiped={this.onPPTSwiped}
                            power={this.props.power}
                        />
	                }
                    </div>

                    {/*顶部模块*/}
                    <TopLiveBar
                        ref = {el => this.topLiveBarEle = el}
                        topicInfo = {this.props.topicInfo}
                        browseNum = {this.props.browseNum}
                        power = {this.props.power}
                        isFollow = {this.props.isFollow}
                        isAlert = {this.props.isAlert}
                        liveId = {this.data.liveId}
                        changgeLiveBox = {this.changgeLiveBox}
                        showLiveBox = {this.state.showLiveBox}
                        liveLogo = {this.props.topicInfo.liveLogo}
                        followLive = {this.followLive}
                        showFollowTips = {this.state.showFollowTips}
                        topicId = {this.props.topicInfo.id}
                        isCampCourse = {this.props.isCampCourse}
                        auditStatus = {this.props.location.query.auditStatus || ''}
                        showDiploma = {this.showDiploma}
                        userName = {this.props.userInfo.user.name}
                        second = {this.data.listenRecordSecond}
                        shareData={this.state.shareData}
                        style = {this.state.topLiveBarSwitch}
                        sysTime={this.props.sysTime}
                        coralInfo = {this.state.coralInfo}
                        canInvite = {this.state.canInvite}
                        remaining = {this.state.remaining}
                        openInviteFriendsToListenDialog={this.openInviteFriendsToListenDialog}
                        platformShareRate = {this.props.platformShareRate}
                        channelCharge={this.state.channelCharge}
                        userId={this.props.userId}
                        isShowRemindTips={this.state.isShowRemindTips}
                        /**拉人返学费相关 */
                        openBackTuitionDialog = {this.openBackTuitionDialog}
                        returnMoney = {this.state.missionDetail.returnMoney || 0}
                        showBackTuition = {this.state.showBackTuition}
                        missionId = {this.state.missionDetail.missionId}
                        showBubbleTips={this.state.showFirstBubbleTips === 'Y'}
                        onBubbleTipsShowed={(done) => {
                            this.setState({
                                showSecondBubbleTips: done ? 'Y' : 'N'
                            })
                        }}
                        /************/
                    />
                </div>



                <div className='flex-main-h topic-main-box' ref='topicMainBox'>

                    {/*录音时遮挡层*/}
                    {/* {
                        this.state.bottomTabType != '' && (this.props.power.allowSpeak || (!this.props.power.allowSpeak && this.props.isAudioOpen == 'Y'))?
                        <div className="recording-cover"  onClick={this.closeBottomBar}></div>
                        :null
                    } */}

                    <div className={`operation-area${showBottomAction ? '' : ' no-bottom-action'}`}>
                        {
                            this.props.power.allowSpeak ?
                            <div className={`question-box`}
                                onClick={this.showQuestionList}
                                data-log-region="question-box-btn"
                                data-log-pos="question-box-btn"
                                data-log-name="问题区"
                            >
                                <span className="on-log">问题区</span>
                            </div>
                            :
                            null
                        }

                        {
                            this.props.topicInfo.status != 'ended' &&
                            <GoToReplyBtn
                                userId = {this.props.userId}
                                topicId = {this.data.topicId}
                                power = {this.props.power}
                                totalSpeakList = {this.props.totalSpeakList}
                                currentReplySpeak = {this.props.currentReplySpeak}
                                clearReplySpeak = {this.props.clearReplySpeak}
                                scrollToItem = {this.scrollToItem}
                                // topicStatus = {this.props.topicInfo.status}
                            />
                        }

                        {
                            ( this.state.hasNotLive && this.state.isLiveAdmin != 'Y' && !this.isC ) ?
                            <div className="btn-create-live"
                                    onClick={() => { locationTo(`/wechat/page/backstage?ch=live`)} }
                            >
                            </div>
                            :null
                        }
                        {/* 未开播的话题不展示极简入口 */}
                        {
                            !(this.props.topicInfo.status == 'beginning' && this.props.topicInfo.startTime > this.props.sysTime) && this.props.getnowTopicVideoCount.topicVideoCount >= 20 ?
                            <div className="topic-listening-entry on-log"
                                data-log-name="进入极简模式"
                                data-log-region="topic-listening-entry"
                                onClick={() => {
                                    locationTo(`/topic/details-listening?topicId=${this.data.topicId}`)
                                }}
                            >
                                <div className="tip">只听老师</div>
                            </div>
                            :null
                        }
                        <div className={`audio-speed-btn on-log${this.state.audioSpeedBtnAct ? ' act' : ''}`}
                             onClick={this.audioSpeedBtnClickHandle}
                             data-log-name="语速变更"
                             data-log-region="audio-speed-btn"
                             data-log-pos="audio-speed-btn"
                        >
                            <div className="rate">{this.state.audioSpeedRate % 1 === 0 ? `${this.state.audioSpeedRate}.0` : this.state.audioSpeedRate}</div>
                            <div className="tip">倍速播放</div>
                        </div>
                        {
                            this.props.topicInfo.channelId &&
                            <div className="course-list-btn on-log"
                                 onClick={this.showCourseListDialog}
                                 data-log-name="课程列表"
                                 data-log-region="course-list-btn"
                                 data-log-pos="course-list-btn"
                            ><div className="tip">课程列表</div></div>
                        }
                        {
                            this.state.userTopicRole === '' && this.state.isNewCamp &&
                            <div className="btn-return-camp on-log"
                                onClick={() => locationTo(`/wechat/page/training-learn?channelId=${this.props.topicInfo.channelId}`)}
                                data-log-region="btn-return-camp"
                            >
                                <div className="tip">返回训练营</div>
                            </div>
                        }
                        {
                            /**
                             * app引导下载显示条件：非B端 & (官方直播间 | (非专业版 & 非白名单直播间))
                             */
                            !this.props.power.allowMGLive && !this.props.power.allowSpeak && (this.state.isOfficialLive || (this.state.isLiveAdmin === 'N' && this.state.isWhiteLive === 'N')) ?
                            <div className="app-download-btn on-log on-visible"
                                 onClick={this.goApp}
                                 data-log-name="极速听课"
                                 data-log-region="app-download-btn"
                                 data-log-pos="app-download-btn"
                            >
                                <div className="animation-icon"></div>
                                <div className="tip">后台播放</div>
                            </div>
                            : null
                        }

                    </div>
                    <div
                        className="flex-main-s topic-main-flex topic-main-scroll-box"
                        id="main-scroll-area"
                        onScroll={this.onTouchMoveSpeakList}
                        onTouchMove={(e)=>{this.onTouchMoveSpeakList(e);   this.recordScrollTime();  }}
                        onWheel={(e)=>{this.onTouchMoveSpeakList(e);   this.recordScrollTime();  }}
                        ref='topicListContainer'
                    >
                        {/*滚动到顶部才显示*/}
                        {
                            (this.props.forumSpeakList[0] && this.props.forumSpeakList[0].type == 'start')?
                            <div ref="topInfoCards">
                                {/*话题信息卡片（包含倒计时和开课提醒、直播推送、邀请嘉宾）*/}
                                <InfoCard
                                    topic={this.props.topicInfo.topic}
                                    sysTime={this.props.sysTime}
                                    startTime={this.props.topicInfo.startTime}
                                    status={this.props.topicInfo.status}
                                    allowMGLive={this.props.power.allowMGLive}
                                    isRelay={this.props.topicInfo.isRelay}
                                    id={this.props.topicInfo.id}
                                    liveId={this.props.topicInfo.liveId}
                                    isAlert={this.props.isAlert}
                                    setRemindAction={this.props.followLive}
                                    onPushBtnClick={this.pushCourse}
                                    // onFollowLiveQrcode = {this.onFollowLiveQrcode}
                                    switchRemindSubscibeStatus={this.switchRemindSubscibeStatus}
                                    oneTimePushSubcirbeStatus = {this.state.oneTimePushSubcirbeStatus}
                                    />
                                {/*分享榜*/}
                                {
                                    (!this.props.topicInfo.campId && getVal(this.props,'topicInfo.isShareOpen','') !== 'N')?
                                    <ShareRankCard
                                        topicInfo={this.props.topicInfo}
                                        cardItems={this.props.shareRankCardItems}
                                        shareData={this.state.shareData}
                                        power = {this.props.power}
                                        distributionPercent = {this.state.distributionPercent}
                                        coralInfo = {this.state.coralInfo}
                                        platformShareRate = {this.props.platformShareRate}
                                        channelCharge={this.state.channelCharge}
                                        userId={this.props.userId}
                                        missionId = {this.state.missionDetail.missionId}
                                    />
                                    :null
                                }
                                {/*听课指南*/}
                                <TipsCard  type="normal" />
                                {/*课堂红包指南 */}
                                {this.props.power.allowSpeak&&this.props.topicInfo.status != 'ended'&&this.state.showRedPackCard&&<RedPackCard locationToRedpack={this.locationToRedpack} />}
                            </div>
                            :null
                        }
                        
                        <GroupEntranceBar 
                            communityInfo={this.state.communityInfo}
                            businessId={this.data.topicId}
                            liveId={this.data.liveId}
                            onClose={this.onGroupEntranceClose}
                            hasBeenClosed={!this.state.showGroupEntrance}
                        />
                        
                        <SpeakListVideo
                            ref = 'speakList'
                            forumSpeakList = {this.props.forumSpeakList}
                            recordReaded = {this.state.recordReaded}
                            onRewardClick={ this.onOpenReward }
                            playAudio={this.playAudio}
                            pauseAudio={this.pauseAudio}
                            setAudioSeek={this.setAudioSeek}
                            playStatus={this.state.playStatus}
                            audioUrl={this.state.audioUrl}
                            audioMsgId={this.state.audioMsgId}
                            playSecond={this.state.playSecond}
                            audioDuration={this.state.audioDuration}
                            showReword={this.props.showReword}
                            power={this.props.power}
                            onFeedback={this.onFeedback}
                            userId={this.props.userId}
                            liveRole={liveRole}
                            inviteListArr={this.props.inviteListArr}
                            onOpenVideoPlayer={this.onOpenVideoPlayer}
                            openTitleMenu={this.showEditTitleDialog}
                            onWhisperQuestionClick={this.onWhisperQuestionClick}
                            topicListContainer={this.refs.topicListContainer}
                            addForumSpeak = {this.addTopicSpeak}
                            updateTopicListMsg={this.props.updateTopicListMsg}
                            delTopicListMsg={this.props.delTopicListMsg}
                            topicStyle = {this.props.topicInfo.style}
                            isEnableReward = {this.props.topicInfo.isEnableReward}
                            likesSet = {this.props.likesSet}
                            hasMinHeight = {this.state.hasMinHeight}
                            revokeForumSpeak = {this.props.revokeTopicSpeak}
                            liveBanned = {this.props.liveBanned}
                            topicId = {this.props.topicInfo.id}
                            liveId = {this.props.topicInfo.isRelay == 'Y' ? this.props.liveInfo.entity.id :this.props.topicInfo.liveId}
                            audioLoading = {this.state.audioLoading}
                            isLogin={this.props.isLogin}
                            delSpeakIdList={this.props.delSpeakIdList}
                            isRelayChannel={this.props.topicInfo.isRelayChannel}
                            showSpeakMsgFirstQrcode = {this.showSpeakMsgFirstQrcode}
                            updateOutline={this.props.updateOutline}
                            userInfo = {this.props.userInfo.user}
                            topicInfo = {this.props.topicInfo}
                            showRewardCard = {this.showRewardCard}
                            redpackClick = {this.redpackClick}
                            locationToShare = {this.locationToShare}
                            locationToCoupon = {this.locationToCoupon}
                            couponCount ={this.state.couponCount||0}
                            isCouponOpen = {this.state.isCouponOpen}
                            isCampCourse={!!this.props.topicInfo.campId}
                            channelCharge = {this.state.channelCharge}
                            tracePage = {this.tracePage}
                        />
                    </div>

                    <div className="chat-room">
                        {/*{*/}
                            {/*!this.props.isCampCourse && this.state.showArchivementCardBtn ? <ArchivementCardBtn*/}
                                                                    {/*archivementCardUrl={`/wechat/page/studentComplitedTopic?topicId=${this.data.topicId}&liveId=${this.data.liveId}`} />*/}
                                                              {/*: null*/}
                        {/*}*/}
                        <BarrageLuckyMoney
                            isAbsolute = { false }
                            rewardBulletList = {this.props.rewardBulletList}
                            isShowBullet = {this.props.isShowBullet}
                            isShootBullet = {this.props.isShootBullet}
                        />

                        <ReactCSSTransitionGroup
                            transitionName="thousand-live-animation-barrageList"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {
                                this.state.showBarrageList ?
                                <BarrageList
                                    showCommentList = { this.showCommentList }
                                    barrageList = { this.props.barrageList }
                                /> :
                                null
                            }
                        </ReactCSSTransitionGroup>
                        
                        {
                            showBottomAction ?
                            (
                                <div className="btn-area">
                                    <ControlButton
                                        buttonType = "business"
                                        handleBtnClick = { this.controlBarrageList }
                                        text = { this.state.showBarrageList ? '关' : '弹'}
                                    />
                                    <ControlButton
                                        buttonType = "business"
                                        handleBtnClick = { this.showCommentList }
                                        text = "讨论"
                                        isHasLive ={true}
                                    />
                                </div>
                            ) :
                            null
                        }

                    </div>

                    <SomebodyTyping
                        name = {this.props.whoTyping}
                    />

                    {
                        this.state.showGotoPlaying ?
                        <div className="btn-goto-playing" onClick={this.gotoPlayingMsg} >回到播放位置</div>
                        :null
                    }

                </div>

                <div className="flex-other">
                    {/*底部发言块*/}
                    {
                        !this.props.isLogin?
                            this.state.isLiveAdmin != 'Y' && <div className="bottom-login-btn"
                                onClick={() => {
                                    let redirect_url = window.location.href;
                                    window.location.replace(`/api/wx/login?topicId=${this.props.location.query.topicId}&knowledge=Y&redirect_url=${encodeURIComponent(redirect_url)}`);
                                }}
                            >点击报名后，可在app端同步收听此课程</div>
                        :
                        showBottomAction ?
                        <BottomSpeakBar
                            ref='speakBar'
                            showControlDialog = {this.showControlDialog}
                            power = {this.props.power}
                            addForumSpeak = {this.addTopicSpeak}
                            addSpeakImagePc = {this.addSpeakImagePc}
                            addSpeakImageWx = {this.addSpeakImageWx}
                            feedbackTarget = {this.state.feedbackTarget}
                            onSwitchTab = {this.onSwitchTab}
                            uploadDoc = {this.props.uploadDoc}
                            uploadRec = {this.props.uploadRec}
                            pauseAudio = {this.pauseAudio}
                            clickTooFast = {this.clickTooFast}
                            saveFile = {this.props.saveFile}
                            uploadAudio = {this.props.uploadAudio}
                            changeSpeaker = {this.props.changeSpeaker}
                            userInfo = {this.props.userInfo.user}
                            topicId={this.data.topicId}
                            liveId = {this.data.liveId}
                            showPasteBox = {this.showPasteBox}
                            topicStyle = {this.props.topicInfo.style}
                            addTopicListMsg={this.props.addTopicListMsg}
                            updateTopicListMsg={this.props.updateTopicListMsg}
                            delTopicListMsg={this.props.delTopicListMsg}
                            loadLastMsg={this.loadLastMsg}
                            getQuestionList={this.props.getQuestionList}
                            setRecStatus={this.setRecStatus}
                            isLiveAdmin={this.state.isLiveAdmin}
                            isRelayChannel={this.props.topicInfo.isRelayChannel}
                            currentPPTFileId={this.state.currentPPTFileId}
                            onPPTSwiped = {this.onPPTSwiped}
                            locationToRedpack = {this.locationToRedpack}
                            canShowNewFuncTips={this.state.showSecondBubbleTips === 'Y'}
                        /> :
                        <BottomSpeakBarClient
                            ref={ref => {this.refs.speakBarClient = ref}}
                            dot={this.state.dot}
                            topicInfo = {this.props.topicInfo}
                            showControlDialog = {this.showControlDialog}
                            addForumSpeak = {this.addTopicSpeak}
                            mute = {this.props.mute}
                            topicEnded = {this.props.topicInfo.status == 'ended'}
                            topicStyle = {this.props.topicInfo.style}
                            controlBarrageList = {this.controlBarrageList}
                            showCommentList = {this.showCommentList}
                            isAudioOpen = {this.props.isAudioOpen}
                            isTextOpen = {this.props.isTextOpen}
                            addTopicComment = {this.addTopicComment}
                            uploadRec = {this.props.uploadRec}
                            uploadAudio = {this.props.uploadAudio}
                            pauseAudio = {this.pauseAudio}
                            clickTooFast = {this.clickTooFast}
                            power = {this.props.power}
                            setRecStatus={this.setRecStatus}
                            showBarrageList = {this.state.showBarrageList}
                            onSwitchTab = {this.onSwitchTab}
                            onIncrFansActivityBtnClick={ this.onIncrFansActivityBtnClick }
                            isOfficialLive={ this.state.isOfficialLive }
                            incrFansFocusGuideConfigs={this.state.incrFansFocusGuideConfigs}
                            scrollToSpeak = {this.scrollToSpeak}
                            getTopicSpeakList = {this.getTopicSpeakList}
                            getOutlistMark = {this.getOutlistMark}
                            openBottomQrcodeLock = {this.openBottomQrcodeLock}
                            closeBottomQrcodeLock = {this.closeBottomQrcodeLock}
                            isHasLive = {this.state.isHasLive}
                        />
                    }
                </div>


                {/*<ReactCSSTransitionGroup
                    transitionName="thousand-live-animation-oprationList"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={100}>
                */}
                    {
                        this.state.showControlDialog ?
                        <BottomControlDialog
                            dot={this.state.dot}
                            topicInfo = {this.props.topicInfo}
                            showCourseListDialog={this.showCourseListDialog}
                            mute = {this.props.mute}
                            showReword = {this.props.showReword}
                            setMute = {this.props.setMute}
                            setRewordDisplay = {this.setRewordDisplay}
                            onCloseSettings = {this.hideControlDialog}
                            liveId = {this.data.liveId}
                            teacherOnly = {this.props.teacherOnly}
                            topicId = {this.data.topicId}
                            loadFirstMsg = {this.loadFirstMsg}
                            loadLastMsg = {this.loadLastMsg}
                            power = {this.props.power}
                            currentUserId = {this.props.currentUserId}
                            AssemblyAudio = { this.props.AssemblyAudio }
                            isAudioOpen = {this.props.isAudioOpen}
                            isTextOpen = {this.props.isTextOpen}
                            textOrAudioSwitch={this.props.textOrAudioSwitch }
                            fetchEndTopic={this.props.fetchEndTopic}
                            hasNotLive={this.state.hasNotLive}
                            isLiveAdmin={this.state.isLiveAdmin}
                            isOpenAppDownload={this.props.topicInfo.isOpenAppDownload}
                            toggleAppDownloadOpen={this.props.toggleAppDownloadOpen}
                            isCampCourse={this.props.isCampCourse}
                            isOfficialLive={this.state.isOfficialLive}
                            isWhiteLive={this.state.isWhiteLive}
                            auditStatus = {this.props.location.query.auditStatus || ''}
                            isQlLive={this.state.isQlLive}
                            changgeLiveBox = {this.changgeLiveBox}
                            showLiveBox={this.state.showLiveBox}
                        />:null
                    }
                {/*</ReactCSSTransitionGroup>*/}

                {/*课程列表弹窗*/}
                {
	                this.state.mountCourseListDialog &&
                    <CourseListDialog
                        topicInfo = {this.props.topicInfo}
                        showCourseListDialog = {this.state.showCourseListDialog}
                        hideCourseListDialog = {this.hideCourseListDialog}
                        onCloseSettings = {this.hideControlDialog}
                        isBussiness = {this.props.power.allowSpeak || this.props.power.allowMGLive}
                    />
                }

                {/*修改头衔*/}
                <EditMyTitleDialog
                    isShow = {this.state.showEditTitleDialog}
                    onCloseSettings = {this.hideEditTitleDialog}
                    openTitleMenu = {this.showBottomEditTitle}
                    userInfo={this.props.userInfo}
                    topicId={this.data.topicId}
                    title={this.props.inviteListArr[this.props.userId] ? this.props.inviteListArr[this.props.userId].title : '嘉宾'}
                />

                <BottomEditTitle
                    isShow = {this.state.showBottomEditTitle}
                    onCloseSettings = {this.hideBottomEditTitle}
                    titleTag = {this.props.inviteListArr[this.props.userId] ? this.props.inviteListArr[this.props.userId].title : '嘉宾'}
                    setTitle = {this.props.setTitle}
                    topicId = {this.data.topicId}
                    liveId = {this.data.liveId}
                    topicInviteId = {this.props.inviteListArr[this.props.userId] ? this.props.inviteListArr[this.props.userId].topicInviteId : 0}
                    userId = {this.props.currentUserId}
                />


                {/*赞赏弹框*/}
                {
                    this.state.showLuckyMoney &&
                        <LuckyMoney
                            rewardPrice={this.props.liveInfo.entityExtend.rewardPrice}
                            rewardIntroduce = {this.props.liveInfo.entityExtend.rewardIntroduce}
                            payForHead={ imgUrlFormat(this.state.payForPortrait, '?x-oss-process=image/resize,h_50,w_50,m_fill') }
                            payForName={ this.state.payForName }
                            onHideRewardClick={ this.onCloseReward }
                            onRewardItemClick={ this.onRewardItemClick }
                            rewardPic={this.props.liveInfo.entityExtend.rewardPic}
                            showRewardCard = {this.showRewardCard}
                        />
                }




                {/*上传截图*/}
                <Confirm
                    ref = 'dialogPaste'
                    title =  {'发送图片'}
                    onBtnClick={this.sendPasteImg}
                >
                    <main className='dialog-main'>
                        <div className="paste-img-box">
                            {
                                this.state.pasteImgUrl != ''?
                                <img src ={this.state.pasteImgUrl}/>
                                :null
                            }
                        </div>
                    </main>
                </Confirm>



                {/*弹出层视频播放*/}
                <VideoPlayer
                    show={this.state.openVideoplayer}
                    videoUrl={this.state.videoUrl}
                    onCloseVideoPlayer={this.onCloseVideoPlayer}
                >
                </VideoPlayer>

                {/*<ReactCSSTransitionGroup
                    transitionName="thousand-live-animation-oprationList"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}> */}
                    {
                        this.state.showCommentList ?
                        <CommentList
                            ref={ref => this.refs.commentList = ref}
                            commentList={this.props.commentList}
                            liveRole={liveRole}
                            gotComments={this.state.gotComments}
                            hideCommentList={this.hideCommentList}
                            commentNum={this.props.topicInfo.commentNum}
                            addTopicComment={this.addTopicComment}
                            deleteComment={this.props.deleteComment}
                            topicId={this.data.topicId}
                            liveId={this.data.liveId}
                            fetchCommentList={this.props.fetchCommentList}
                            userId={this.props.userId }
                            topicCreateBy={this.props.topicInfo.createBy}
                            bannedToPost={this.props.bannedToPost}
                            power={this.props.power}
                            topicStatus={this.props.topicInfo.status}
                            mute = {this.props.mute}
                            deleteBarrageItem = {this.props.deleteBarrageItem}
                            addTopicSpeak = {this.addTopicSpeak}
                            feedbackTarget = {this.state.feedbackTarget}
                            onFeedback={this.onFeedback}
                            clearFeedback={this.clearFeedback}
                            updateCommentList={this.props.updateCommentList}
                            updateCommentIndex={this.props.updateCommentIndex}
                            commentIndex={this.props.commentIndex}
                            setCommentCacheModel={this.props.setCommentCacheModel}
                            openCacheModel={this.props.openCacheModel}
                            topicStyle = {this.props.topicInfo.style}
                            isHasLive = {this.state.isHasLive}
                            getHasLive = {this.state.getHasLive}
                            isLiveAdmin = {this.state.isLiveAdmin}
                            isShowQl = {this.props.isSubscribe.isShowQl}
                            shareCommentConfigFlag = {this.props.shareCommentConfigFlag}
                            onShareCommentSwitch = {this.onShareCommentSwitch}
                        /> :
                        null
                    }
                {/*</ReactCSSTransitionGroup>*/}

                {/*<ReactCSSTransitionGroup
                    transitionName="thousand-live-animation-oprationList"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}> */}
                    {
                        this.state.showQuestionList ?
                        <QuestionList
                            appendQuetionList={this.props.appendQuetionList}
                            questionList={this.props.questionList}
                            topicId={this.data.topicId}
                            hideQuestionList={this.hideQuestionList}
                            onFeedback={this.onFeedback}
                        /> :null
                    }
                {/*</ReactCSSTransitionGroup>*/}

                {/* 开播前弹窗 大于15分钟 */}
                {/* 新增一个条件，在平台优惠券弹窗不弹出的时允许弹canShowBeginDialog=Y */}
                {/* 当留资弹窗显示时，该窗口暂时隐藏 */}
                {
                    this.state.canShowBeginDialog === 'Y' && this._hasFetchOneTimePushSubcirbeStatus && this.props.sysTime < (this.props.topicInfo.startTime - 900000) && this.props.topicInfo.status !== 'ended' && this.isBeginDialogCanShow && !this.state.isDialogMoreInfoVisible && 
                    <BeginQrcodeDialog
                        isLogin={this.props.isLogin}
                        shareData={this.state.shareData}
                        oneTimePushSubcirbeStatus={this.state.oneTimePushSubcirbeStatus}
                        platformShareRate = {this.props.platformShareRate}
                        channelCharge={this.state.channelCharge}
                        userId={this.props.userId}
                        tracePage = {this.tracePage}
                    />
                }
                
                {/* 留资弹窗 */}
				<DialogMoreUserInfo
					visible={!!this.state.isDialogMoreInfoVisible}
					userId={this.props.userId || this.props.userInfo.user.userId}
					onClose={() => {
                        // 当弹窗被主动关闭时，记录当前弹窗状态，有效期为1天
                        getCookie('showDialogMoreInfo') !== 'N' && setCookie('showDialogMoreInfo', 'N', 1);
						this.setState({isDialogMoreInfoVisible: false});
					}}
					onSuccess={() => this.setState({isDialogMoreInfoVisible: false})}
				/>

                <FollowQrcode 
                    showDialog={this.state.showFollowDialog} 
                    onClose={this.closeFollowLive} 
                    focusLiveClick={this.focusLiveClick}
                    relationInfo={this.props.relationInfo}
                />
                {/* <CommencementQrcode showDialog={this.state.showCommencementDialog}/> */}
                {/* 信息流首条弹码 */}
                <SpeakMsgFirstQrDialog
                    show={this.state.showSpeakMsgFirstQrcode}
                    onClose={this.hideSpeakMsgFirstQrcode}
                    qrCode={this.state.speakMsgFirstQrCode}
                    appId = {this.state.speakMsgFirstAppId}
                    traceData = 'thousandLiveSpeakMsgFirstQrcode'
                    channel = "202"
                />
                {/*有管理权限才请求*/}
                {
                    this.props.power.allowMGTopic?
                    <PushTopicDialog
                        topicId={this.props.topicInfo.id}
                        liveId={this.props.topicInfo.liveId}
                        isShow={this.state.showPushTopicDialog}
                        hide={this.hidePushTopicDialog}
                    />
                    :null
                }

                {/*引导图*/}
                <FunctionTips
                    allowMGTopic={this.props.power.allowMGTopic}
                    allowSpeak={this.props.power.allowSpeak}
                    isAudioOpen={this.props.topicInfo.isAudioOpen}
                    topicStyle={this.props.topicInfo.style}
                    topicStatus={this.props.topicInfo.status}
                    showLiveBox={this.state.showLiveBox}
                    onChangeStatus={(show) => {
                        this.setState({
                            showFirstBubbleTips: show ? 'N' : 'Y'
                        })
                    }}
                />
                { this.props.isLogin &&
                <BottomQrcode bottomQrcodeLock = {this.state.bottomQrcodeLock}
                    source={this.props.location.query.officialKey||this.props.location.query.source==='coral'?'coral':''}
                    officialKey = {this.props.location.query.officialKey? this.props.location.query.officialKey : this.props.userInfo.user.userId}
                /> }

                <IncrFansFocusGuideDialog
                    show={ this.state.showIncrFansFocusGuideDialog }
                    onClose={ this.onCloseIncrFansDialog }
                    incrFansFocusGuideConfigs={ this.state.incrFansFocusGuideConfigs }
                />

	            {/* {
		            this.state.showAuditionGuidePurchaseBtn &&
                    <div className="audition-tip">
                        <span>免费试听中，购买系列课收听全部课程。</span>
                        <div className="buy-btn" onClick={ () => locationTo(
				            `/live/channel/channelPage/${this.props.topicInfo.channelId}.htm?autopay=Y&shareKey=${this.props.location.query.shareKey || ''}`,
				            `/pages/channel-index/channel-index?channelId=${this.props.topicInfo.channelId}&shareKey=${this.props.location.query.shareKey || ''}`
			            ) }>立即购买</div>
                    </div>
                } */}

                {
					this.state.isShowAppDownloadConfirm &&
                    <AppDownloadConfirm
                        onClose={this.hideAppDownloadConfirm}
                        downloadUrl="http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1401381427411"
                    />
                }

                {/* 抢红包弹窗 */}
                <RedpackDialog
                    ref = {el => this.redpackDialogEle = el}
                    liveName = {this.props.liveInfo.entity.name}
                    power = {this.props.power}
                    isWhiteLive={this.state.isWhiteLive}
                    isLiveAdmin = {this.state.isLiveAdmin}
                    isBindThird = {this.props.isSubscribe.isBindThird}
                    topicInfo = {this.props.topicInfo}
                    openRedpack = {this.openRedpack}
                    unLockRequest={this.unLockRequest}
                    userId={this.props.userId}
                    platformShareRate = {this.props.platformShareRate}
                />

                {/* 邀请好友免费听弹窗 */}
                <InviteFriendsToListen
					ref = {el => this.inviteFriendsToListenDialog = el}
                    inviteFreeShareId = {this.state.inviteFreeShareId}
                    //关闭弹窗后重新初始化分享
                    onClose={this.initShare}
                    coralInfo = {this.state.coralInfo}
                    source={this.props.location.query.source}
                    userId={this.props.userId}
                    platformShareRate={this.props.platformShareRate}
				/>

                {/* 拉人返学费弹窗 */}
				<BackTuitionDialog
                    ref = {el => this.backTuitionDialogEle = el}
                    initShare = {this.initShare}
				/>

                {/* 奖学金分享弹窗 */}
                <ScholarshipDialog
                    ref = {el => this.scholarshipDialogEle = el}
                    initShare = {this.initShare}
                />

                { (this.isCamp && this.getLiveStatus()) &&
                    <JobReminder
                        showDislog={ this.showDislog }
                        channelId={ this.props.topicInfo.channelId }
                        topicId={this.data.topicId} targetNode={ node }>

                    </JobReminder>
                }
                { this.state.homeworkList && !!this.state.homeworkList.length && this.state.showJobListDialog &&
                    <JobListDialog isFixScroll={true} isShow={ true } onClose={this.closeJobListDialog} data={this.state.homeworkList || []} />
                }

                {
                    this.state.tryListenMask.show ?
                    <TryListenShareMask {...this.state.inviteDetail}
                        isBindThird={this.props.isSubscribe.isBindThird}
                        isFocusThree={this.props.isSubscribe.isFocusThree}
                        liveId={this.data.liveId}
                        topicId={this.data.topicId}
                        channelId={this.props.topicInfo.channelId}
                        subscribe={this.props.isSubscribe.subscribe}
                        imageList={this.state.tryListenMask.inviteList} onClose={() => {
                        this.setState({
                            tryListenMask: {
                                ...this.state.tryListenMask,
                                show: false
                            }
                        })
                    }}/> : null
                }

                {/*关闭分享上墙弹窗*/}
                <Confirm
                    ref = 'shareCommentSwitchRef'
                    buttons = 'cancel-confirm'
                    onBtnClick = {this.onShareCommentSwitchOk}
                    onClose = {() => {this.setState({isShareCommentLiveSwitch: false})}}
                >
                    <main className='share-comment-confirm-content'>
                        <p className="title">确定要关闭该课程的分享上墙功能吗？</p>
                        <p 
                            className="desc" 
                            onClick={() => {this.setState({isShareCommentLiveSwitch: !this.state.isShareCommentLiveSwitch})}}>
                            {
                                this.state.isShareCommentLiveSwitch ? 
                                <img className="check-icon" src={require('./img/checked.png')} alt=""/>:
                                <img className="check-icon" src={require('./img/check.png')} alt=""/>
                            }
                            直播间内所有课程都关闭
                        </p>
                    </main>
                </Confirm>

            </Page>
        );
    }
}

ThousandLive.propTypes = {

};
ThousandLive.childContextTypes = {
  lazyImg: PropTypes.object
};


function mapStateToProps (state) {
    return {
        sid: state.thousandLive.sid,
        noMore: state.thousandLive.noMoreSpeakList,  //仅用于加载信息流数据用
        userInfo: state.common.userInfo,
        topicInfo: state.thousandLive.topicInfo,
        shareRankCardItems: state.thousandLive.shareRankCardItems,
        forumSpeakList: state.thousandLive.forumSpeakList,
        totalSpeakList: state.thousandLive.totalSpeakList,
        rewardBulletList: state.thousandLive.rewardBulletList,
        isShowBullet:state.thousandLive.isShowBullet,
        isShootBullet:state.thousandLive.isShootBullet,
        sysTime: state.common.sysTime,
        liveVolume: state.thousandLive.liveVolume,
        mute: state.thousandLive.mute,
        showReword: state.thousandLive.showReword,
        teacherOnly: state.thousandLive.teacherOnly,
        power: state.thousandLive.power,
        isAlert: state.thousandLive.isAlert,
        isFollow: state.thousandLive.isFollow,
        canAddSpeak: state.thousandLive.canAddSpeak,
        fromWhere: state.thousandLive.fromWhere,
        currentUserId: state.thousandLive.currentUserId,
        browseNum: state.thousandLive.browseNum,
        liveInfo:state.thousandLive.liveInfo,
        userId:state.thousandLive.userId,
        inviteListArr: state.thousandLive.inviteListArr,
        insertNewMsg: state.thousandLive.insertNewMsg,
        commentList: state.thousandLive.commentList,
        questionList: state.thousandLive.questionList,
        whoTyping: state.thousandLive.whoTyping,
        lshareKey: state.thousandLive.lshareKey,
        isAudioOpen: state.thousandLive.isAudioOpen,
        isTextOpen: state.thousandLive.isTextOpen,
        currentReplySpeak: state.thousandLive.currentReplySpeak,
        pptList: state.thousandLive.pptList,
        likesSet: state.thousandLive.likesSet,
        delMsg: state.thousandLive.delMsg,
        barrageList: state.thousandLive.barrageList,
        isLogin: state.thousandLive.isLogin,
        commentIndex: state.thousandLive.commentIndex,
        openCacheModel: state.thousandLive.openCacheModel,
        pushCompliteInfo: state.thousandLive.pushCompliteInfo,
        getnowTopicVideoCount: state.thousandLive.getnowTopicVideoCount,
        popAppDownloadBar: state.thousandLive.popAppDownloadBar,
        isSubscribe:state.thousandLive.isSubscribe,
        isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',/** 这里的训练营是之前c端活动的，不是常用的训练营。判断训练营，用campId */
        delSpeakIdList: state.thousandLive.delSpeakIdList,
        platformShareRate: state.common.platformShareRate,
        relationInfo: state.common.relationInfo,
        shareCommentConfigFlag: state.thousandLive.shareCommentConfigFlag
    }
}

const mapActionToProps = {
    addTopicSpeak,
    getTopicSpeakList,
    uploadImage,
    uploadRec,
    getSysTime,
    revokeTopicSpeak,
    startSocket,
    setMute,
    setRewordDisplay,
    setRewordDisplayStatus,
    doPay,
    followLive,
    setCanAddSpeak,
    updateMute,
    liveBanned,
    getGuestList,
    uploadAudio,
    uploadDoc,
    fetchShareRankCardItems,
    getMyQualify,
    addComment,
    deleteComment,
    fetchCommentList,
    saveFile,
    getLikesSet,
    bannedToPost,
	getPPT,
    appendQuetionList,
    getQuestionList,
    changeSpeaker,
    getUserInfo,
    bindShareKey,
    AssemblyAudio,
    setTitle,
    textOrAudioSwitch,
    updateTextOpen,
    updateAudioOpen,
    loadTargetSpeakById,
    fetchEndTopic,
	clearReplySpeak,
    addTopicListMsg,
    updateTopicListMsg,
    delTopicListMsg,
    initBarrageList,
    deleteBarrageItem,
    updateCommentList,
    addPageUv,
    getCreateLiveStatus,
    updateCommentIndex,
    setCommentCacheModel,
    pushAchievementCardToUser,
    isLiveAdmin,
    setCanPopDownloadBar,
    toggleAppDownloadOpen,
    getQr,
    fetchQrImageConfig,
    isServiceWhiteLive,
    getQlLiveIds,
    subscribeStatus,
    checkFollow,
    fetchChargeStatus,
    fetchLastOrNextTopic,
    getOutlineList,
    updateOutline,
    getUserTopicRole,
    getIsQlLive,
    userBindKaiFang,
    getRelayDelSpeakIdList,
    fetchTotalSpeakList,
    updateRedEnvelope,
    getChannelInfo,
    getShareRate,
    addShareComment,
    dispatchFetchRelationInfo,
    dispatchGetShareCommentConfig,
    dispatchSaveShareCommentConfig,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ThousandLive);
