const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { findDOMNode } from 'react-dom';
import { autobind, throttle } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Page from 'components/page';
import { locationTo ,imgUrlFormat, getCookie, delCookie, setLocalStorageArrayItem, localStorageSPListAdd, miniprogramReady, updateTopicInChannelVisit, isNextDay, setLocalStorage, randomShareText, setCookie } from 'components/util';
import Detect from 'components/detect';
import { ScholarshipDialog } from 'components/scholarship-menu';
import BottomSpeakBar from './components/bottom-speak-bar';
import BottomControlDialog from './components/bottom-control-dialog';
import MediaBox from './components/media-box';
import SpeakListVideo from './components/speak-list-video';
import InviteFriendsToListen from 'components/invite-friends-to-listen';
import LuckyMoney from './components/lucky-money';
import DiplomaDialog from './components/diploma-dialog';
import BottomSpeakBarClient from './components/bottom-speak-bar-client';
import TopLiveBar from './components/top-live-bar';
import RedpackDialog from './components/redpack-dialog';
import BarrageLuckyMoney from './components/barrage-lucky-money';
import { showShareSuccessModal } from 'components/dialogs-colorful/share-success'
import IncrFansFocusGuideDialog from './components/incr-fans-focus-guide-dialog';
import CourseListDialog from './components/course-list-dialog';
import RewardCard from './components/reward-card';
import TipsCard from 'components/tips-card';
import RedPackCard from "./components/redpack-card";
import { share } from 'components/wx-utils';
import { AudioPlayer } from 'components/audio-player';
import { fixScroll, resetScroll } from 'components/fix-scroll';
import ArchivementCardModal from 'components/archivement-card/modal';
import animation from 'components/animation';
import ShareRankCard from './components/share-rank-card';
import AppDownloadConfirm from 'components/app-download-confirm';
import BackTuitionDialog from 'components/back-tuition-dialog';
import FollowQrcode from './components/dialogs/follow-qrcode';
import JobReminder from 'components/job-reminder';
import TryListenStatusBar from 'components/try-listen-status-bar';
import TryListenShareMask from 'components/try-listen-share-mask';
import { apiService } from 'components/api-service';
import openApp from 'components/open-app';

import { doPay, isServiceWhiteLive, getOfficialLiveIds, subscribeStatus, isFollow as checkFollow, whatQrcodeShouldIGet, getQlLiveIds, getUserTopicRole, checkShareStatus, fetchShareRecord, request, isAuthChannel, getCommunity } from 'common_actions/common'
import { getCouponForIntro, getPacketDetail, updatePacketPopStatus  } from 'common_actions/coupon';
import {
	getShareRate,
} from 'common_actions/live';

import { getPersonCourseInfo } from "common_actions/coral";
import {
    uploadImage,
    uploadRec,
    getSysTime,
    getQr,
    getUserInfo,
    uploadTaskPoint,
    addLikeIt,
    getLike
} from '../../actions/common';

import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import {
    clearForumSpsakList,
    setMute,
    setRewordDisplay,
    setRewordDisplayStatus,
    followLive,
    setCanAddSpeak,
    updateMute,
    getGuestList,
    bindShareKey,
    fetchEndTopic,
    addPageUv,
    pushAchievementCardToUser,
    toggleAppDownloadOpen,
    setCanPopDownloadBar,
    isSubscribe,
    fetchQrImageConfig,
	fetchLastOrNextTopic,
    fetchChargeStatus,
    fetchRewardQRCode,
    initDiplomaMes,
    userBindKaiFang,
    getChannelInfo,
    getJoinCampInfo,
    studyTopic,
    saveFile,
    getRelayDelSpeakIdList
} from 'thousand_live_actions/thousand-live-common';

import {
    uploadDoc,
} from 'thousand_live_actions/common';


import {
    loadTargetSpeakById,
    fetchShareRankCardItems,
    getMyQualify,
    getTopicAutoShare,
    getChannelAutoShare,
    receiveRedEnvelope,
    getMyReceiveDetail,
    updateRedEnvelope,
    getCouponAllCount,
} from '../../actions/thousand-live-normal';

import {
    addForumSpeak,
    getForumSpeakList,
    revokeForumSpeak,
    toggleTeacherOnly,
    // fetchMediaUrl,
    setLiveVolume,
} from '../../actions/thousand-live-av';

import { getMediaActualUrl } from '../../../video-course/actions/video';

import { getVal, isFromLiveCenter } from 'components/util';

import GroupEntranceBar from 'components/group-entrance-bar';

import { liveBanned, setUniversityCurrentCourse } from '../../actions/live';
import { startSocket } from '../../actions/websocket';
import DialogMoreUserInfo from 'components/dialogs-colorful/more-user-info/index';

const Button = props => {
    const redirect = () => {
        locationTo(props.href)
    }

    let className = `option-button ${props.logPos} on-log on-visible`;

    return (
        <a className={className + ' ' + props.className}
            onClick={ props.href ? redirect : props.onClick }
            data-log-region={ props.logRegion }
            data-log-pos={ props.logPos }
        >
            <div className="icon-wrap">
                {
                    props.remaining > 0 && <div className="remaining"><span>{`${10 - props.remaining}`}</span> /10</div>
                }
                {
	                props.count > 0 &&
                    <div className="count">{props.count}</div>
                }
            </div>
            {
                props.redpoint && 
                    <aside className="red-point"></aside>
            }
            <span className="content">{ props.text }</span>
        </a>
    )
}


// 语音速度档次
const AUDIO_SPEED_RATE_MAP = [0.7, 1, 1.2, 1.5, 2];

@autobind
class ThousandLiveVideo extends Component {

    constructor(props) {
        super(props);
    }

    data = {
        liveId: '0',
        topicId: '0',
        // 是否在加载下一页
        loadingNext: false,
        //进入页面的时间戳
        currentTimeMillis:0,
        // 正在播放中音频所在消息流下标
        audioIndex:null,

        //成就卡推送判断参数
        pushCompliteInfo:null,
        pushCompliteEnable:false,
        allRecordNum:null,
        listenDone:false,
        listenRecordSecond: 0,
        hasDiplomaCard: false, //是否已经拥有毕业证
        // 显示回到播放位置防止触发次数太多
        handleDelayTime: true,
        // 音频列表
        audioUrlList: [],
        // 记录最后一次滚动操作时间
        lastScrollTime: 0,
        // 防止频繁记录
        recordTimeout: true,
        // 记下本次自动滚动的音频ref
        autoPlayAudioIndex: null,
        officialLiveIds: [
            "100000081018489",
            "350000015224402",
            "310000089253623",
            "320000087047591",
            "320000078131430",
            "290000205389044",
        ],
        missionDetail: {}, // 拉人返学费数据
    }


    state = {
        showControlDialog:false,//显示操作弹框
        startTime:Number(this.props.topicInfo.startTime),
        endTime:Number(this.props.topicInfo.endTime),

        // 是否显示留资弹窗
        isDialogMoreInfoVisible: false,

        isCanClick:true,//防暴力点击

        /*播放音频相关*/
        audioUrl:'',//音频播放路径
        playStatus:'stop',
        playSecond:0,
        audioDuration:0,//音频时长
        // 音频是否正在加载
        audioLoading:false,

        showLuckyMoney: false,// 是否显示赞赏弹框
        showLiveBox: true, // 显示直播盒
        // 显示回到播放位置
        showGotoPlaying: false,

        /*加载数据相关*/
        loadFirstTime:'1120752000000',//加载第一条数据时间戳
        isLoadingForumList:false, //是否正在加载数据

        /*赞赏的用户ID*/
        payForId: null,
        payForPortrait: null,
        payForName: null,

        /*是否在回复某个对象*/
        feedbackTarget: null,

        /*是否滚动加载到最后一页*/
        isLastSpeak: false,

        /*禁言相关参数*/
        revokeId: 0 ,
        revokeCreateBy: 0,

        /* 录音状态*/
        bottomTabType:'',

        /* 成就卡弹窗和浮层按钮 */
        showArchivementCardBtn: false,
        showArchivementCardModal: false,

        showIncrFansFocusGuideDialog: false,
        incrFansFocusGuideConfigs: null,
        isOfficialLive: '',
        isWhiteLive: '',

        // 是否显示红点
        dot: false,
        // 是否显示课程列表弹窗
        showCourseListDialog: true,
        mountCourseListDialog: false,
	    // 播放速度
	    audioSpeedRate: 1,
	    // 倍速按钮反馈动画
	    audioSpeedBtnAct: false,
	    // 是否显示试听引导购买按钮
        showAuditionGuidePurchaseBtn: false,
        
        // 分享二维码相关
        shareQrcodeUrl: '',
        shareQrAppId: '',
        // 是否展示毕业证弹窗
        showDiplomaDialog: true,
        // 话题分销相关数据
        shareData: null,

        isShowAppDownloadConfirm: false,

        userTopicRole: undefined,
        distributionPercent: 0,//获取分销比例
        // 课堂红包数据列表
        redEnvelopeList: [],

        // 是否有资格邀请好友免费听,Y/N
        canInvite: '',
        // 剩余邀请名额
        remaining: 0,
		// 免费听邀请id
		inviteFreeShareId: '',
        showFollowDialog:false,
        showRedPackCard:false,
        channelCharge:[],
        showBackTuition: false, //是否展示拉人返学费按钮
        joinCampInfo: {},

        // 邀请详情 see http://showdoc.corp.qlchat.com/web/#/1?page_id=2656
        inviteDetail: {},
        // 分享遮罩
        tryListenMask: {
            headImageList: [],
            qrUrl: ''
        },
        //用户是否有创建直播间
        isHasLive: false,
        getHasLive: false,
        showGroupEntrance: false, // 显示社群入口
    }

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

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    async componentDidMount() {
        await this.initSpeakList();
        // 初始化当前用户听过的秒数
        if(localStorage[`listenRecord_${this.props.userId}`]){
            if(JSON.parse(localStorage[`listenRecord_${this.props.userId}`])[`${this.props.location.query.topicId}`]){
                this.data.listenRecordSecond = JSON.parse(localStorage[`listenRecord_${this.props.userId}`])[`${this.props.location.query.topicId}`].second
            }
        }

         // 删除旧cookie记录
         try {
            delCookie('lastVisit')
        } catch (error) {
            
        }
        
        fixScroll('#main-scroll-area');
        this.miniprogramRedirect();

        // 初始化页面state
        await this.initState();

        // 绑定分销关系
        if (this.props.location.query.lshareKey) {
            this.props.bindShareKey(this.props.topicInfo.liveId, this.props.location.query.lshareKey);
        }
        if(this.props.location.query.kfAppId && this.props.location.query.kfOpenId) {
            this.props.userBindKaiFang(this.props.location.query.kfAppId, this.props.location.query.kfOpenId)
        }

        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
		}

        // 初始化话题或者系列课的分销信息
        this.initAutoShare()

        this.hasLive();

        // 话题统计
	    this.props.addPageUv(this.data.topicId, this.props.topicInfo.liveId, ['topicOnline', 'liveUv'], this.props.location.query.pro_cl || getCookie('channelNo') || '');

	    this.props.getGuestList(this.data.topicId);//加载嘉宾列表

        this.initAudio();
        // 分享初始化
        this.initSubscribe()
        // 获取请好友免费听资格
        this.checkShareStatus();
        // 初始化
        this.initInviteReturnInfo();
        // 获取分享榜数据
        this.initShareRankCard()

        this.initShareBtnStatus();
        this.getLikeStatus();

        // 上传初始化
        this.initStsInfo();

        this.initAutoFixed();

        // 初始化珊瑚课程信息
        this.initCoralInfo()


        if (this.props.topicInfo.status !== 'ended') {
            this.props.startSocket(this.props.sid, this.props.topicInfo.sourceTopicId || this.props.topicInfo.id, this.props.currentUserId,this.data.currentTimeMillis);
        }
        // this.setSpeakLoadFromWhere();

        


        this.initBrowseHistory()
        

        //推送成就卡初始化
        // this.initPushCompliteCard();

        //毕业证
        this.initDiplomaCard()

        //是否显示红点
        this.redDotShow()

	    // 初始化试听引导购买按钮
	    this.initGuidePurchaseBtnInAudition();

	    // 记录系列课内课程访问信息
	    if(this.props.topicInfo.channelId){
		    updateTopicInChannelVisit(this.props.topicInfo)
        }
        
        if(!!this.props.topicInfo.channelId){
            this.initCampInfo();
        }

        this.initUserTopicRole();

        //获取优惠券数目
        this.initCouponCount();
        //获取优惠券是否显示
        this.initCouponOpen();

        this.setState({
            showRedPackCard : (Number(this.props.topicInfo.startTime)-90000) <=  Number(this.data.currentTimeMillis)
        });
        this.initChannelInfo();

        // 收费话题绑定千聊平台分销
        this.getShareRate();
        this.initInviteFriendsListenRemindTips()
        this.ajaxGetInviteDetail();
        this.ajaxCanInviteAudition();
        this.ajaxSaveInvite();
        this.isAuthChannel();
        this.dispatchGetCommunity();

        setTimeout(_=>{
            // 详情页显示平台通用券弹窗
            this.getPacketDetail()
            
            setUniversityCurrentCourse({
                businessId: this.props.topicInfo.isBook ==='Y'? this.data.topicId : (!!this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.data.topicId),
                businessType: this.props.topicInfo.isBook ==='Y'? 'topic' : (!!this.props.topicInfo.channelId? 'channel':'topic'),
                currentId: this.data.topicId,
            });
        },3000)

        // 曝光日志收集
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 1000);
    }

    /***********************开始平台通用券（奖学金）相关***************************/
	
	// 详情页显示平台通用券弹窗
	getPacketDetail = async()=>{
        let topicInfo = this.props.topicInfo
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
			}
		})
	}
    /***********************结束奖学金相关***************************/

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


    async initShareBtnStatus() {
        try {
            let shareBtnStatus = "share",
                shareRemaining = 0;
            /**
             * 请好友免费听的用户的条件是：
             * 1、C端，该话题是系列课下的，不是单节付费，不是试听课
             * 2、开启了邀请分享功能且还有剩余名额
             * 3、系列课是付费的且自己已经购买，或者自己是vip（这点后端接口会判断）
             */
            if (
                !this.props.power.allowSpeak &&
                !this.props.power.allowMGLive &&
                this.props.topicInfo.channelId &&
                this.props.topicInfo.isAuditionOpen !== "Y" &&
                this.props.topicInfo.isSingleBuy !== "Y"
            ) {
                const result = await checkShareStatus({
                    channelId: this.props.topicInfo.channelId,
                    topicId: this.data.topicId
                });
                if (result.state.code === 0) {
                    // 开启了邀请分享功能且还有剩余名额
                    if (
                        result.data.isOpenInviteFree === "Y" &&
                        result.data.remaining > 0
                    ) {
                        shareBtnStatus = "invite";
                        shareRemaining = result.data.remaining;
                    }
                }
            }
            this.setState({ shareBtnStatus, shareRemaining });
        } catch (err) {
            console.error(err);
        }
        this.setState({ _hasGetShareBtnStatus: true });
    }

    // 对我有用  （ 点赞和取消点赞 ）
    async likeClick(){
        let likeObj = this.state.likeObj;
        let type = 'news';
        let status = false;
        status = !likeObj.likes;
        if(status){
        let likeResult = await this.props.addLikeIt({
            topicId: this.data.topicId,
            speakId: this.data.topicId,
            type,
        });
        if(likeResult.state.code === 0){
            
            likeObj.likesNum = likeResult.data.likesNum;
            likeObj.likes = status;
            this.setState({
                likeObj,
            });
        }
        
        }
        window.toast('已支持，好内容发给好友一起听');
    }

    // 对我有用状态  （ 点赞状态 ）
    async getLikeStatus(){
        let result = await this.props.getLike({speakIds: this.data.topicId});
        if(result?.state?.code === 0){
            this.setState({
                likeObj: (result?.data?.speaks && result?.data?.speaks[0]) || [],
            });
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

    async miniprogramRedirect() {
        const isMiniProgramEnv = await miniprogramReady();
        console.log('isMiniProgramEnv ---- ', isMiniProgramEnv)

        if (this.props.weappLinkTo && typeof window != 'undefined' && isMiniProgramEnv) {
            wx.miniProgram.redirectTo({ url: this.props.weappLinkTo });
        }
    }

    /**
	 *
	 * 初始化分享榜
	 * @memberof ThousandLive
	 */
    async initShareRankCard(){
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

    initBrowseHistory = () => {
        // 如果是系列课的话题 记录在这个系列课中看到哪一个话题了
        if(this.props.topicInfo.channelId) {
            setLocalStorageArrayItem("channel_topic_history", "cid", this.props.topicInfo.channelId, {
                cid: this.props.topicInfo.channelId,
                tid: this.props.topicInfo.id,
            }, true, 20)
            if(!this.props.isCampCourse) {
                localStorageSPListAdd('footPrint', this.props.topicInfo.channelId, 'channel', 100)
            }
        } else {
            localStorageSPListAdd('footPrint', this.data.topicId, 'topic', 100)
        }
        

        //推送成就卡初始化
        // this.initPushCompliteCard();
        this.initIsOfficial();
    }


    // 获取是否可以平台分销
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

    async initIsOfficial() {
        try {
            const [isWhiteLive, officialLiveIds] = await Promise.all([
                this.props.isServiceWhiteLive(this.props.topicInfo.liveId),
                this.props.getOfficialLiveIds(),
            ]);

            let isOfficial = 'N';
            let isWhite = 'N';

            if (getVal(officialLiveIds, 'state.code') == 0) {
                isOfficial = getVal(officialLiveIds, 'data.dataList', []).includes(this.props.topicInfo.liveId);
                isOfficial = isOfficial ? 'Y' : 'N';
            }

            if (getVal(isWhiteLive, 'state.code') == 0) {
                isWhite = getVal(isWhiteLive, 'data.isWhite', 'N');
            }

            this.setState({
                isOfficialLive: isOfficial,
                isWhiteLive: isWhite,
            }, () => {
                this.initShare()
            });

            // 初始化左下角按钮配置
            this.fetchQrImageConfig();
        } catch (error) {
            console.error(error);
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

    // 初始化左下角按钮配置
    async fetchQrImageConfig() {
        try {
            const result = await this.props.fetchQrImageConfig({ topicId: this.data.topicId });

            if (result.state.code == 0) {
                this.setState({
                    incrFansFocusGuideConfigs: getVal(result, 'data.info')
                });
            }
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    @throttle(300)
    initLazyImgLinstener() {
        let target = this.refs.topicListContainer;
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
        const pos = imgDom.offsetTop;
        const itemHeight = imgDom.clientHeight;

        if (pos < height + st + itemHeight && pos >  st - itemHeight) {
            imgDom.src = imgDom.getAttribute('data-real-src');
            return true;
        } else {
            return false;
        }
    }

    componentWillReceiveProps(nextProps) {
        (nextProps.insertNewMsg && nextProps.insertNewMsg != this.props.insertNewMsg ) && this.newMsgScroll();

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
        if (!this.hasNewList || prevProps.forumSpeakList.length === 0) {
            return;
        }

        const prevId = prevProps.forumSpeakList[0].id;
        this.firstSpeakItem = findDOMNode(this.refs.speakList.refs[`forum-item-${prevId}`]) || this.firstSpeakItem;
        this.hasNewList = false;
        this.listAutoFix();

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
        if (!this.data.listDom) {
            return;
        }
        console.log('列表更新，修正位置', this.scrollDirection);

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

                this.data.listDom.scrollTop = this.lastSpeakItem.offsetTop - this.data.listDom.clientHeight + 300;
                this.data.listDom.style['-webkit-overflow-scrolling'] = 'touch';

                if (!this.data.loadingNext) {
                    this.scrollDirection = '';
                    this.lastSpeakItem = null;
                }
            }, 50);
        }
    }

    //推送成就卡
    async pushCompliteCard (){
        if(!this.props.isCampCourse) {
            await this.props.pushAchievementCardToUser();
        }
    }

    ifFirstVisit(){
        const visitedTopicId = new Set( localStorage.getItem('visitedTopicId') && localStorage.getItem('visitedTopicId').split(',') || []);
        if (visitedTopicId.size === 0) {
            visitedTopicId.add(this.props.topicInfo.id);
            localStorage.setItem('visitedTopicId', [...visitedTopicId]);
            return true;
        } else {
            if (visitedTopicId.has(this.props.topicInfo.id)) {
                return false
            } else {
                visitedTopicId.add(this.props.topicInfo.id);
                localStorage.setItem('visitedTopicId', [...visitedTopicId]);
                return true
            }
        }
    }

    async initState(){
        this.data = {
            ...this.data,
            topicId: this.props.location.query.topicId || '0',
            liveId: this.props.topicInfo.liveId || '0',
            currentTimeMillis: this.props.topicInfo.currentTimeMillis
        }

        this.setState({
            isLastSpeak:this.props.forumSpeakList.length < 30,
            startTime:Number(this.props.topicInfo.startTime),
            endTime:Number(this.props.topicInfo.endTime),
        })

        this.props.setRewordDisplayStatus(this.props.topicInfo.barrageFlag);
        this.props.updateMute(this.props.topicInfo.isBanned);
        await this.initUserInfo();
        this.initDialogMoreUserInfo();
    }

    // 获取用户基本信息
    async initUserInfo(){
        await this.props.getUserInfo(this.props.userId, this.data.topicId);
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

    async initSubscribe() {
        await this.props.isSubscribe(this.data.liveId)
        this.initShare()
    }

    isAuthChannel = async () => {
        let result = await isAuthChannel(this.props.topicInfo.channelId);
        this.setState({
            isAuthChannel: result
        }, () => {
            this.initShare();
        })
    }

    shareParamsTryListen = () => {
        if (!this.props.topicInfo.channelId) return '';
        if (this.state.isAuthChannel == 'Y') return '';
        return this.props.topicInfo.isAuditionOpen == 'Y' ? '&inviteAuditionUserId=' + getCookie('userId') : ''
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
            console.log(result);
            
        } catch (error) {
            console.error(error);
        }
    }

    async initShare() {
        let wxqltitle = this.props.topicInfo.topic;
        let descript = this.props.topicInfo.liveName;
        let wxqlimgurl = "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        // let shareUrl = window.location.origin + this.props.location.pathname + '?topicId=' + this.data.topicId + '&fromOld=1&pro_cl=link';

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + '?topicId=' + this.data.topicId + '&fromOld=1&pro_cl=link' + await this.shareParamsTryListen();
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


        if(this.props.lshareKey && this.props.lshareKey.shareKey && this.props.lshareKey.status == 'Y' ){
            shareObj.title = "我推荐-" + shareObj.title;
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
        
        if (this.props.location.query.psKey || this.state.isOfficialLive === "Y") {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
        }

        const { isSubscribeInfo, isLiveAdmin } = this.props
        let onShareComplete = () => {
            console.log('share completed!')

            if (this.props.topicInfo.isAuditionOpen == 'Y') {
                window._qla && window._qla('event', {
                    category: 'auditionShare',
                    action: 'success',
                });
            }

            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })
        }
        console.log(isSubscribeInfo, isLiveAdmin)
        console.log('专业版', isLiveAdmin)
        console.log('关注千聊', isSubscribeInfo.subscribe)
        console.log('直播间白名单', isSubscribeInfo.isShowQl)
        if ((isLiveAdmin === 'N') && (!isSubscribeInfo.subscribe) && isSubscribeInfo.isShowQl) {
            /* 分享成功的回调函数 */
            onShareComplete = this.onShareComplete.bind(this)
            this.fetchShareQr()
        }
		
       

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        console.log('分享信息: ', shareObj)
        let shareOptions = {
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: onShareComplete,
        }
        share(shareOptions);
    }

    async fetchShareQr() {
        if(this.tracePage === 'coral'){
            return false;
        }
        const result = await whatQrcodeShouldIGet({
            isBindThird: this.props.isSubscribeInfo.isBindThird,
            isFocusThree: this.props.isSubscribeInfo.isFocusThree,
            options: {
                subscribe: this.props.isSubscribeInfo.subscribe,
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

    onShareComplete() {
        console.log(this.state.shareQrcodeUrl)
        if (this.state.shareQrcodeUrl) {
            showShareSuccessModal({
                url: this.state.shareQrcodeUrl,
                traceData: 'thousandLiveVideoShareQrcode',
                channel: "115",
                appId: this.state.shareQrAppId
            })
        }
    }


    // oss上传初始化
    initStsInfo() {
        console.log('init stat info ---- ', !(Detect.os.phone && Detect.os.weixin));
        if(!(Detect.os.phone && Detect.os.weixin)){
            const script = document.createElement('script');
            script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
            document.body.appendChild(script);
        }
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

    /**
     *
     * 显示回到频道
     *
     * @memberof ThousandLiveVideo
     */
    changgeLiveBox = (e)=>{
        this.setState({
            showLiveBox:!this.state.showLiveBox,
            showControlDialog: false
        })
    }

    async initSpeakList() {
        //获取第一批发言
        await this.getForumSpeakList()
        if (this.props.forumSpeakList.length < 30) {
            this.props.setCanAddSpeak(true);
        }
        // 如果是转载课，则获取被删除的发言id列表   
        if (this.props.topicInfo.isRelay == 'Y') {
            
            this.props.getRelayDelSpeakIdList({
                topicId: this.props.location.query.topicId,
                type: 'forum'
            })
        }
    }

    // 加载发言数据
    getForumSpeakList = async (time='1120752000000',beforeOrAfter = 'after') =>{
        if(!this.state.isLoadingForumList){
            this.setState({
                isLoadingForumList : true,
            })
            let result = await this.props.getForumSpeakList(this.props.location.query.topicId,time,beforeOrAfter,this.props.teacherOnly?'Y':'N',!this.props.showReword);
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
     * @memberof ThousandLiveVideo
     */
    scrollMsgToView(index, withAnimation) {
        let msgDom = findDOMNode(this.refs.speakList.refs['forum-item-'+ index]);
        if (!msgDom) {
            return;
        }

        // 自动滚动不触发用户滚动逻辑
        this.data.recordTimeout = false;

	    if (withAnimation) {
            const doAnimate = () => {
                let startValue = this.refs.topicListContainer.scrollTop,
                    endValue = msgDom.offsetTop - (this.refs.topicListContainer.clientHeight / 2) + (msgDom.clientHeight / 2);

                animation.add({
                    startValue,
                    endValue,
                    step: (v) => {
                        this.refs.topicListContainer.scrollTop = v;
                    },
                    oncomplete: () => {
                        let newEndValue = msgDom.offsetTop - (this.refs.topicListContainer.clientHeight / 2) + (msgDom.clientHeight / 2);
                        if (newEndValue != endValue) {
                            doAnimate();
                        } else {
                            this.data.recordTimeout = true;
                        }
                    }
                });
            };

            doAnimate();
	    } else {
		    setTimeout(() => {
                msgDom.scrollIntoView(true);//自动滚动到视窗内
                
                this.data.recordTimeout = true;
		    }, 300);
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
                return lastSpeakItem;
            }
        }

        return null;
    }

    
    handleScrollSpeakList() {
        this.initLazyImgLinstener();
        this.scrollLoadForumList();
    }

    // 滚动加载发言数据
    @throttle(300)
    async scrollLoadForumList() {
        // 锁判断
        if (this.data.loadingNext) {
            return;
        }

        if ( this.props.forumSpeakList.length <= 0 ){
            this.data.loadingNext = false;
           return;
        }

        let el = this.refs.topicListContainer;
        if (!el) {
            return;
        }

        // 正在加载·锁
        this.data.loadingNext = true;

        let pageHeight = el.clientHeight,
            domHeight = el.scrollHeight,
            scrollTop = el.scrollTop,
            ddt = domHeight - scrollTop - pageHeight;

        // 显示回到播放位置
        this.showGotoPlayHandle(pageHeight, scrollTop);

        if (scrollTop <= 0 && this.props.forumSpeakList[0].type != 'start') {
            this.scrollDirection = 'toTop';
            await this.getForumSpeakList(this.props.forumSpeakList[0].createTime,'before');
            // 获取成功打赏之后的卡片二维码链接（这里也写是因为避免初始化加载的信息流没有红包的，但是滚动触发的时候有了)
            // this.initRewardCardQrUrl()

        } else if (ddt < 300) {
            this.scrollDirection = 'toBottom';

            if (this.data.listDom) {
                this.lastSpeakItem = this.getLastValidItem();
            }
            await this.getForumSpeakList(this.props.forumSpeakList[this.props.forumSpeakList.length - 1].createTime);
            // 获取成功打赏之后的卡片二维码链接（这里也写是因为避免初始化加载的信息流没有红包的，但是滚动触发的时候有了)
            // this.initRewardCardQrUrl()
        }

        // 正在加载·开锁
        setTimeout(() => {
            this.data.loadingNext = false;
        })
        
    }

    /**
     * 记录最后一次手动滚动的时间点，1000ms间隔
     */
    async recordScrollTime(e) {
        if (this.data.recordTimeout) {
            // console.log('user scroll')
            this.data.recordTimeout = false;
            this.data.lastScrollTime = Date.now();
            this.data.autoPlayAudioIndex = null;

            setTimeout(() => {
                this.data.recordTimeout = true;
            }, 1000);
        }
    }

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

    /**
     * 回到播放位置滚动处理
     *
     * @param {any} topicPageHight
     * @param {any} distanceScroll
     *
     * @memberof ThousandLiveVideo
     */
    showGotoPlayHandle(topicPageHight, distanceScroll) {
        if (this.data.audioIndex && this.data.handleDelayTime) {
            this.data.handleDelayTime = false;
            setTimeout(() => {
                this.data.handleDelayTime = true;
            }, 1000);

            let msgDom = findDOMNode(this.refs.speakList.refs['forum-item-' + this.data.audioIndex]);
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

    // 加载第一条数据
    loadFirstMsg = async (e) => {
        await this.props.clearForumSpsakList();
        await this.getForumSpeakList(this.state.loadFirstTime);
        this.setState({
            showControlDialog:false,
            isLastSpeak: false,
        })
        this.props.setCanAddSpeak(false);
        if (this.props.totalSpeakList.length > 1) {
            this.scrollToSpeak(this.props.totalSpeakList[1].id);
        }
        window.toast("已回到第一条内容");

    }

    // 加载最新的数据
    loadLastMsg = async (showTip = true) => {
        await this.props.clearForumSpsakList();
        await this.getForumSpeakList(Date.now()+86400000,'before');
        this.setState({
            showControlDialog:false,
            isLastSpeak: true,
        })
        this.props.setCanAddSpeak(true);
        this.scrollToLast(showTip);

    }

    // 滚动到最后
    scrollToLast(showTip = true) {
        try {
            // TODO 如果最后一条没有id，就获取倒数第二条，这个还没做
            this.scrollMsgToView(this.props.forumSpeakList.slice(-1)[0].id);
            showTip && window.toast("已到达最后一条内容");

        } catch (error) {
            console.log(error)
        }
    }

    // 新消息滚动到底部
    async newMsgScroll() {
        let speakListDom = findDOMNode(this.refs.speakList);
        let distanceScrollCount = speakListDom.scrollHeight,
            distanceScroll = speakListDom.scrollTop,
            topicPageHight = speakListDom.clientHeight,
            ddt = distanceScrollCount - distanceScroll - topicPageHight,
            defaultToBottomHeight = 600;
        // ddt: 页面滚动距离底部的距离，如果小于defaultToBottomHeight则在新消息进来时滚动到底部
        if (this.props.canAddSpeak && ddt < defaultToBottomHeight) {
            // this.scrollMsgToView(this.props.forumSpeakList.length - 1);
            this.scrollToLast(false);
        }


    }

    /**
     * 滚动到指定发言请用这个方法
     *
     * @param {any} speakId
     * @returns
     *
     * @memberof ThousandLiveVideo
     */
    async scrollToSpeak(speakId, animation) {
        if (!this.props.forumSpeakList) {
            return;
        }

        // 当前列表是否有目标发言
        let hadThisSpeak = this.props.forumSpeakList.some(item => item.id == speakId);

        console.log(hadThisSpeak, speakId);
        if (hadThisSpeak) {
            // 滚动到该发言
            this.scrollMsgToView(speakId, animation);
        }
    }



    // 添加发言
    addForumSpeak = async (type,content,second,isShowLoading = true) => {
        let isReplay = this.state.feedbackTarget ? 'Y' : 'N';
        let relateId = this.state.feedbackTarget ? this.state.feedbackTarget.id : '';
        const playTime = this.props.topicInfo.style === 'audio' ? this.getAudioPlayerCurrentTime() : 0;
        let imageTextCard = null

        if (type === 'image-text-card') {
            imageTextCard = content
            content = ''
        }

        let result = await this.props.addForumSpeak(this.data.topicId, type, content, second||'', isReplay, relateId,isShowLoading, playTime, imageTextCard);

        this.setState({
            feedbackTarget : null,
        })
        if(result.state.code != 0){
            window.toast(result.state.msg);
        }
        if (!this.state.isLastSpeak) {
            await this.loadLastMsg(false);
        }
        setTimeout(() => {
            this.scrollToLast(false);
        }, 0);
        return result;
    }



    // PC添加新图片
    addSpeakImagePc = async (event) => {
        const file = event.target.files[0]
        try {
            const filePath = await this.props.uploadImage(file,"liveComment");
            this.setState({
                filePath: filePath,
            });
            if (filePath) {
                this.addForumSpeak("image",filePath);
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
                this.setState({
                    localUrls : res.localIds
                })
                this.wxImgUpload();
            },
            cancel:  (res) => {
            }
        });

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
            let currentRedEnvelope = redEnvelopeList.find(item => item.id == props.relateId)
            if(currentRedEnvelope){
                this.redpackDialogEle.show(props, currentRedEnvelope)
            }else {
                const result = await getMyReceiveDetail(props.relateId)
                let item = {
                    ...result.detailDto,
                    id: props.relateId,
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
        locationTo(`/wechat/page/sharecard?wcl=redEnvelope&redEnvelopeId=${id}&type=${type}&${type}Id=${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}&liveId=${this.data.liveId}`)
    }

    locationToCoupon(){
        let type = 'topic'
        if(this.props.topicInfo.channelId){
            type = 'channel'
        }
        locationTo(`/wechat/page/coupon-code/list/${type}/${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}`)
    }

    /************课堂红包相关结束***************/

    async wxImgUpload(){
		if(this.state.localUrls.length > 0){
	        var loaclUrl = this.state.localUrls.shift();
            window.loading(true);
        	wx.uploadImage({
			    localId: loaclUrl,
			    isShowProgressTips: 0,
			    success: async  (res) => {
                    await this.addForumSpeak("imageId",res.serverId);
                    if(this.state.localUrls.length > 0){
                        this.wxImgUpload();
                    }
			    },
			    fail: (res) => {
                    window.toast("部分图片上传失败，请重新选择");
			    },
                complete: (res) => {
                    window.loading(false);
                }
			});
		}
	};


   /********** 录音部分 start **********/

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
            },1000);
            callback();
       }
   }










    /********** 录音部分 end **********/

    /********** 播放音频部分 start **********/
    initAudio(){
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on("timeupdate",this.audioTimeupdate);
        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);
    }

    audioTimeupdate(e){
        this.setState({
            playSecond:this.audioPlayer.currentTime,
            audioDuration:this.audioPlayer.duration
        })

        if(this.state.audioLoading){
            this.setState({
                audioLoading : false,
            })
        }
    }

    audioEnded(e){
        this.props.setLiveVolume(1);

        let nextAudioMsg = this.nextAudio();

        this.setState({
            playSecond:0,
            audioDuration:0.01,
            playStatus:'ready',
            audioLoading:false,
            audioUrl: '',
            audioMsgId:'',
        });

        if (nextAudioMsg){
            this.playAudio(nextAudioMsg.id, true);
        }

        //成就卡推送
        // compliteCardPush();
    }

    audioPause(e){
        this.props.setLiveVolume(1);
        this.setState({
            playStatus:'pause',
        })
    }

    /**
     * 获取下一条音频
     *
     * @readonly
     *
     * @memberof ThousandLiveVideo
     */
    nextAudio(){
        let nextAudioMsg;
        // 音频列表
        let audioList = this.props.totalSpeakList.filter((item) => {
            return /(audio|mic\-audio)/gi.test(item.type);
        })
        this.data.audioUrlList = audioList;
        let audioIndex = audioList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        audioIndex++;
        if (audioIndex < audioList.length) {
            nextAudioMsg = audioList[audioIndex];
        }else{
            nextAudioMsg = false;
        }

        return nextAudioMsg;
    }
    
    audioPlaying(e) {
        this.setState({
            playStatus:'play',
            audioLoading: false,
        });

        //预加载
        let nextAudioMsg = this.nextAudio();
        if (nextAudioMsg) {
            this.audioPlayer.preLoad(nextAudioMsg.content);
        }


        /**
         * 延时执行，防止自动滚动过程中改变消息数目
         */
        setTimeout(() => {
            this.tryLoadMsg();
        }, 400);
    }

    /**
     * 连续播放兼容
     * 播放音频时检测是否最后一条是否还有后续数据，加载下一页
     *
     * @param {any} url
     * @memberof ThousandLiveVideo
     */
    async tryLoadMsg(){
        let arrIndex = this.data.audioUrlList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });
        if (!this.props.noMore && arrIndex > -1  && arrIndex  ==  this.data.audioUrlList.length - 1 ) {
            console.log('当前最后一条音频，尝试加载更多');
            await this.getForumSpeakList({time:this.props.forumSpeakList[this.props.forumSpeakList.length - 1].createTime});

            // 加载完后若有新的需要滚动到的音频，滚
            let needGotoPlayingMsg = Date.now() - this.data.lastScrollTime > 10000;

            if (needGotoPlayingMsg && this.data.autoPlayAudioIndex) {
                // 根据旧的audioIndex获取下一条index
                let preIndex = 0;
                this.props.forumSpeakList.find((item, index) => {
                    if (item.id == this.data.autoPlayAudioIndex) {
                        preIndex = index;
                    }
                    return false;
                });

                let next = this.props.forumSpeakList.slice(preIndex + 1).find(item => {
                    return /(audio|mic\-audio)/gi.test(item.type);
                });

                if (next && !this.state.audioUrl) {
                    this.playAudio(next.id, true);
                }
            }
        }
    }


    /**
     *
     * 回到播放位置
     *
     * @memberof ThousandLiveVideo
     */
    gotoPlayingMsg(){
        this.scrollToSpeak(this.state.audioMsgId, true);
    }


    // 播放音频
    async playAudio(id, needGotoPlayingMsg) {

        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.totalSpeakList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.totalSpeakList[audioIndex];
        // 获取音频路径
        let url = audioMsg.content;


        if(this.state.audioMsgId != id){
            this.setState({
                playSecond:0,
                audioDuration:0,
                audioUrl:url,
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.volume=1;
            this.audioPlayer.play(url);
        } else {
            this.setState({
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.resume();
        }
        
        // 记录音频播放ref
        this.data.audioIndex = id;

        this.setState({
            audioLoading : true,
        });



        if (needGotoPlayingMsg) {
            /**
             * 10秒前无滚动操作，将跳到正在播放的音频的位置
             */
            needGotoPlayingMsg = Date.now() - this.data.lastScrollTime > 10000;
            
            if (needGotoPlayingMsg) {
                // 记下本次自动滚动的音频ref
                this.data.autoPlayAudioIndex = id;
                this.gotoPlayingMsg();
            }
        }
    }

    // 暂停音频
    async pauseAudio(){
        this.audioPlayer.pause();
        this.setState({
            playStatus:'pause'
        })
    }

    // 拖放音频
    async setAudioSeek(percent){
        this.audioPlayer.pause();
        let currentTime = parseInt(this.state.audioDuration * percent / 100);
        this.audioPlayer.currentTime = currentTime;
        this.audioPlayer.seek(currentTime);
        this.audioPlayer.resume();
        this.setState({
            playStatus:'play'
        });
    }

    /********** 播放音频部分 end **********/

    // 实时记录收听秒数
    saveSecondRecord(){
        // 训练营课程或者来自C端用户不弹毕业证
        if(this.props.isCampCourse && isFromLiveCenter()&&this.props.topicInfo.style!=='audio') {
            return
        }
        this.data.listenRecordSecond += 3
        let listenRecord = {}
        if ( localStorage.getItem(`listenRecord_${this.props.userId}`) ) {
            listenRecord = JSON.parse(localStorage[`listenRecord_${this.props.userId}`]);
        };
        if(listenRecord[`${this.data.topicId}`]){
            listenRecord[`${this.data.topicId}`] = {
                ...listenRecord[`${this.data.topicId}`],
                second: this.data.listenRecordSecond,
            }
        }else {
            listenRecord[`${this.data.topicId}`] = {
                end: false,
                second: this.data.listenRecordSecond,
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

    // 毕业证弹窗判断
    diplomaShow(){
        // 训练营课程或者来自C端用户不弹毕业证
        if(this.props.isCampCourse && isFromLiveCenter() && this.props.topicInfo.style !== 'audio') {
            return
        }
        // 已经有毕业证，不继续执行
        if(this.data.hasDiplomaCard){
            return
        }
        this.data.listenDone = true
        let listenRecord={};
        if ( localStorage.getItem(`listenRecord_${this.props.userId}`) ) {
            listenRecord = JSON.parse(localStorage[`listenRecord_${this.props.userId}`]);
        };
        // 先删除再插入，保证插入时间排序正常
        if(listenRecord[`${this.data.topicId}`]){
            delete listenRecord[`${this.data.topicId}`];
        }
        // 存储已听秒数
        listenRecord[`${this.data.topicId}`] = {
            end: this.data.listenDone,
            second: this.data.listenRecordSecond
        };

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
        if (!this.props.power.allowSpeak&&
            (this.props.topicInfo.status === 'ended'||this.props.beforeOrAfter==="after")&&
            this.data.listenRecordSecond/this.props.topicInfo.duration > 0.7) {
                this.topLiveBarEle.getWrappedInstance().marqueeScroll()
        }
    }

    // 显示毕业证弹窗
    showDiploma(diplomaData){
        this.diplomaDialog.show(diplomaData)
    }

    // 隐藏毕业证弹窗
    hideDiploma(){
        this.diplomaDialog.hide()
    }

    //成就卡推送判断
    // compliteCardPush(){

    //     if(!this.data.pushCompliteEnable){
    //         var listenRecordNum={};
    //         this.data.listenRecordNum++;
    //         if ( localStorage.getItem(`listenRecordNum_${this.props.userId}`) ) {
    //             listenRecordNum = JSON.parse(localStorage[`listenRecordNum_${this.props.userId}`]);
    //         };
    //         console.log(listenRecordNum[`${this.data.topicId}`]);
    //         // 先删除再插入，保证插入时间排序正常
    //         if(listenRecordNum[`${this.data.topicId}`]){
    //             delete listenRecordNum[`${this.data.topicId}`];
    //         }
    //         listenRecordNum[`${this.data.topicId}`] = this.data.listenRecordNum ;

    //             // 最多保留9个话题记录;
    //             if(Object.keys(listenRecordNum).length > 9){
    //                 let DeleteFirst = true;
    //                 for (let key of Object.keys(listenRecordNum)) {
    //                     if(DeleteFirst){
    //                         delete listenRecordNum[key];
    //                         DeleteFirst = false;
    //                         break;
    //                     }
    //                 }
    //             }

    //         localStorage.setItem(`listenRecordNum_${this.props.userId}`,JSON.stringify(listenRecordNum));


    //         if(!this.props.power.allowSpeak&&
    //         (this.props.topicInfo.status === 'ended'||this.props.beforeOrAfter==="after")&&
    //         this.data.pushCompliteInfo.status!="Y"&&
    //         this.data.pushCompliteInfo.status!="C"&&
    //         Math.floor(this.data.listenRecordNum/this.data.allRecordNum)>50){
    //             console.log("push");//推送c端成就卡
    //             this.props.pushAchievementCardToUser();
    //             this.data.pushCompliteInfo.status="Y";
    //             this.data.pushCompliteEnable=true;
    //         }
    //     }
    // }

    


    // 显示红包消息
    setRewordDisplay = async (status) =>{
        let result = await this.props.setRewordDisplay(status,this.data.topicId);
    }

    async toggleTeacherOnly(status){
        await this.props.toggleTeacherOnly(status);
        await this.props.clearForumSpsakList();
        await this.getForumSpeakList(this.state.loadFirstTime);
        this.setState({
            showControlDialog:false,
            isLastSpeak:false
        })
        this.props.setCanAddSpeak(false);
        let msgDom = findDOMNode(this.refs.speakList.refs['forum-item-0']);

        if (!msgDom) {
            return;
        }
        setTimeout(function(){
            msgDom.scrollIntoView(true);//自动滚动到视窗内
        },300)

    }

    /**
     * 关闭赞赏弹框
     *
     * @memberOf ThousandLiveVideo
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
     * @memberOf ThousandLiveVideo
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
     * @memberOf ThousandLiveVideo
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
                    // this.initRewardCardQrUrl();
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
     * @memberOf ThousandLiveVideo
     */
    onFeedback(speakItem) {
        this.refs.speakBar.switchTab('text');
        this.setState({
            feedbackTarget: speakItem
        });
    }

    /**
     * 底部发言栏状态切换
     *
     *
     * @memberOf ThousandLiveVideo
     */
    onSwitchTab(type) {
        this.setState({
            bottomTabType : type
        })
        if (type === '') {
            this.setState({
                feedbackTarget: null
            });
        }
    }

    closeBottomBar(e){
        if(this.props.power.allowSpeak && this.props.topicInfo.status != 'ended'){
            this.setState({
                feedbackTarget : null,
            });
            this.refs.speakBar.switchTab('');
        }
    }


    /*推送成就卡*/
    // async initPushCompliteCard(){
    //     this.data.allRecordNum = this.props.getnowTopicVideoCount;
    //     var listenRecordNum={};
    //     if ( localStorage.getItem(`listenRecordNum_${this.props.userId}`) ) {
    //         listenRecordNum = JSON.parse(localStorage[`listenRecordNum_${this.props.userId}`]);
    //     };
    //     console.log(listenRecordNum[`${this.data.topicId}`]);
    //     if(listenRecordNum[`${this.data.topicId}`]){
    //         this.data.listenRecordNum=listenRecordNum[`${this.data.topicId}`];
    //     }else{
    //         this.data.listenRecordNum=0;
    //     }
    
    //     this.data.pushCompliteInfo=(this.props.pushCompliteInfo && this.props.pushCompliteInfo.achievementCardRecord) || {};//pushAchievementCardToUser
    //     //非管理员，结束或开播2小时，没有推送过, 完播率大于50%
    //     if(!this.props.power.allowSpeak&&
    //     (this.props.topicInfo.status === 'ended'||this.props.beforeOrAfter==="after")&&
    //     this.data.pushCompliteInfo.status!="Y"&&
    //     this.data.pushCompliteInfo.status!="C"&&
    //     Math.floor(this.data.listenRecordNum/this.data.allRecordNum)>50){
    //         this.props.pushAchievementCardToUser();
    //         this.data.pushCompliteInfo.status="Y";
    //         console.log("push");//推送c端成就卡
    //         this.data.pushCompliteEnable=true;
    //     }

    // }


    // 毕业证
    async initDiplomaCard(){

        // 训练营课程或者来自C端用户不弹毕业证
        if(this.props.isCampCourse && isFromLiveCenter() && this.props.topicInfo.style !== 'audio') {
            return
        }
        //非管理员，且有了毕业证才显示，还没获得毕业证则继续统计时长
        const diplomaMes = await initDiplomaMes(this.data.topicId)
        if(!this.props.power.allowSpeak){
            if(diplomaMes && diplomaMes.learningDays){
                this.data.hasDiplomaCard = true
                this.topLiveBarEle.getWrappedInstance().marqueeScroll(diplomaMes)
            }else {
                var listenRecord={};
                if ( localStorage.getItem(`listenRecord_${this.props.userId}`) ) {
                    listenRecord = JSON.parse(localStorage[`listenRecord_${this.props.userId}`]);
                };
                if(listenRecord[`${this.data.topicId}`]){
                    this.data.listenRecordSecond=listenRecord[`${this.data.topicId}`].second
                    this.data.listenDone = listenRecord[`${this.data.topicId}`].end
                }else{
                    this.data.listenRecordSecond=0;
                }
            }
        }
    }


    get isC() {
        return !this.props.power.allowSpeak
    }

    get appStyle() {
        return 'mid'
    }

    get canShowBar() {
        return this.props.isLiveAdmin == 'N' || (this.props.isLiveAdmin == 'Y' && this.props.topicInfo.isOpenAppDownload != 'N')
    }

    getArchivementCardBtn(){
        this.setState({
            showArchivementCardBtn: true
        })
    }

    getArchivementCardModal(videoPlayer){

	    // 去掉成就卡

        // 暂停视频并隐藏video标签，解决微信浏览器的video怪异行为
        // if (videoPlayer) {
        //     videoPlayer.pause();
        //     let videoTag = document.getElementsByTagName('video')[0];
        //     videoTag.style.display = 'none';
        //     this.videoTag = videoTag;
        // }
        // this.setState({
        //     showArchivementCardModal: true
        // });
    }

    hideArchivementCardModal(){
        // 恢复video标签
        if (this.videoTag) {
            this.videoTag.style.display = 'block';
            this.videoTag = null;
        }
        this.setState({
            showArchivementCardModal: false
        });
    }

    
	@throttle(1000)
	audioSpeedBtnClickHandle(){
		let index = AUDIO_SPEED_RATE_MAP.indexOf(this.state.audioSpeedRate) + 1;
		if(index >= AUDIO_SPEED_RATE_MAP.length){
			index = 0;
		}
        // this.audioPlayer.playbackRate = AUDIO_SPEED_RATE_MAP[index];
        this.refPlayer.changePlaybackRate(AUDIO_SPEED_RATE_MAP[index]);
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

    async gotoNextCourse(){
        const { channelId } = this.props.topicInfo;
	    if (!channelId) {
	        return false;
        }
        const res = await this.props.fetchLastOrNextTopic({
            topicId: this.data.topicId,
            type: 'all',
        });
        if (res.state.code === 0 && res.data.nextTopicId) {
            const { data: { nextTopicId } } = res;
            try {
                const resCourseList = await request({
                    url: "/api/wechat/transfer/h5/topic/list",
                    method: "POST",
                    body: {
                        channelId,
                    }
                });
                if (resCourseList.state.code == 0) {
                    const courseList = resCourseList.data.topicList;
                    // 判断下节课是否为所属系列课的第二节课，若是，则在跳转链接带上显示弹窗的参数
                    const isSecondTopic = courseList.map(d => d.id).indexOf(nextTopicId) === 1;
                    locationTo(`/topic/details?topicId=${nextTopicId}${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
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
        this.refPlayer && this.refPlayer.pause();
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

	getAudioPlayerCurrentTime(){
		const time = this.refPlayer.refAudioPlayer.audio ? (this.refPlayer.refAudioPlayer.audio.currentTime || 0) : 0
		return Math.floor(time);
    }

    /***********************开始拉人返学费相关***************************/

    // 打开返学费弹窗
	openBackTuitionDialog = ()=>{
		this.backTuitionDialogEle.show({
            inviteTotal: this.data.missionDetail.inviteTotal,
            returnMoney: this.data.missionDetail.returnMoney,
            expireTime: this.data.missionDetail.expireTime,
            missionId: this.data.missionDetail.missionId,
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
					this.data.missionDetail = missionDetail
					if(missionDetail.status == 'N' && missionDetail.expireTime > Date.now()){
						showBackTuition = true
					}
				}
                this.setState({showBackTuition})
                // 拉人返现需要重置
                if(showBackTuition) {
                    this.backTuitionDialogEle.initShare({
                        data: this.props.topicInfo,
                        missionId: this.data.missionDetail.missionId,
                        type: this.props.topicInfo.channelId ? 'channel' : 'topic',
                    })
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
        this.setState({canInvite,remaining})
    }

    // 打开请好友免费听弹窗（首先获取分享id）
    async openInviteFriendsToListenDialog(){
        const result = await fetchShareRecord({
            channelId: this.props.topicInfo.channelId,
            topicId: this.props.topicInfo.id,
        })
        if(result.state.code === 0){
            this.setState({inviteFreeShareId: result.data.inviteFreeShareId})
            this.inviteFriendsToListenDialog.show(this.props.topicInfo, this.state.showBackTuition ? this.data.missionDetail: null)
        }
    }
    // 是否为训练营
    get isCamp(){
        const { topicInfo, power } = this.props;
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
    
    /***********************结束请好友免费听相关***************************/

    async ajaxGetInviteDetail () {
        if (!this.props.topicInfo.channelId) return ;
        try {
            let result = await apiService.post({
                url: '/h5/invite/audition/inviteMissionInfo',
                body: {
                    channelId: this.props.topicInfo.channelId
                }
            })
            console.log('/h5/invite/audition/inviteMissionInfo', result);
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
            console.log('/h5/invite/audition/inviteList', result)
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
            console.log('onClickTryListenBar', inviteList)
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
                let hasRecord = communityList.includes(`${this.data.liveId}_${this.data.topicId}`);
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
        // console.log(`当前消息数目：${this.props.forumSpeakList.length}/${this.props.totalSpeakList.length}`);
        const showFollowBtn = !this.props.power.allowSpeak && !this.props.isFollow && !this.props.power.allowMGLive;
        const node = document.querySelector(".flex-main-s");
        const isCend = isFromLiveCenter();

        // 判断当前用户角色
        const liveRole = this.props.power.allowMGLive ? this.props.liveInfo.entity.createBy == this.props.userId ? 'creator' : 'manager' : '';

        return (
            <Page  title={this.props.topicInfo.topic}  className="thousand-live thousand-live-video flex-body">
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
                        <MediaBox
                            topicInfo={this.props.topicInfo}
                            sysTime={this.props.sysTime}
                            getSysTimeAction={this.props.getSysTime}
                            fetchMediaUrlAction={this.props.fetchMediaUrl}
                            volume={this.props.liveVolume}
                            power={this.props.power}
                            userId ={this.props.userId}
                            compliteStatus={(this.props.pushCompliteInfo && this.props.pushCompliteInfo.achievementCardRecord) || {}}
                            pushCompliteFun={this.pushCompliteCard}
                            getArchivementCardBtn={this.getArchivementCardBtn}
                            getArchivementCardModal={this.getArchivementCardModal}
                            interactiveAudioPlayStatus={this.state.playStatus}
                            pauseInteractiveAudio={this.pauseAudio}
                            gotoNextCourse={this.gotoNextCourse}
                            saveSecondRecord = {this.saveSecondRecord}
                            diplomaShow = {this.diplomaShow}
                            canInvite = {this.state.canInvite}
                            ref={r => this.refPlayer = r}
                        />
                    </div>
                    {/*顶部模块*/}
                    {/* isCampCourse 属性用于来自训练营的课程不进行系列课主页跳转 */}
                    <TopLiveBar
                        ref = {el => this.topLiveBarEle = el}
                        topicInfo = {this.props.topicInfo}
                        browseNum = {this.props.browseNum}
                        power = {this.props.power}
                        isFollow = {this.props.isFollow}
                        currentTimeMillis = {this.data.currentTimeMillis}
                        liveId = {this.data.liveId}
                        changgeLiveBox = {this.changgeLiveBox}
                        showLiveBox={this.state.showLiveBox}
                        liveLogo = {this.props.liveInfo.entity.logo}
                        followLive = {this.followLive}
                        isCampCourse = {this.props.isCampCourse}
                        auditStatus = {this.props.location.query.auditStatus || ''}
                        showDiploma = {this.showDiploma}
                        userName = {this.props.userInfo.user.name}
                        second = {this.data.listenRecordSecond}
                        shareData={this.state.shareData}
                        coralInfo = {this.state.coralInfo}
                        canInvite = {this.state.canInvite}
                        remaining = {this.state.remaining}
                        openInviteFriendsToListenDialog={this.openInviteFriendsToListenDialog}
                        platformShareRate={this.props.platformShareRate}
                        channelCharge={this.state.channelCharge}
                        userId={this.props.userId}
                        isShowRemindTips={this.state.isShowRemindTips}
                        /**拉人返学费相关 */
                        openBackTuitionDialog = {this.openBackTuitionDialog}
                        returnMoney = {this.data.missionDetail.returnMoney || 0}
                        showBackTuition = {this.state.showBackTuition}
                        /************/
                        renderProp={
                            () => {
                                const { shareRemaining, shareBtnStatus } = this.state;
                                const { topicInfo } = this.props;
                                return (
                                    <div className="share-button-wrap">
                                        <Button 
                                            text='邀请卡'
                                            href = { `/wechat/page/sharecard?type=topic&topicId=${topicInfo.id}&liveId=${topicInfo.liveId}` }
                                            onClick={this.likeClick}
                                            logRegion="option-btn"
                                            logPos="share"
                                        /> 
                                        {
                                            shareBtnStatus === 'invite' ?
                                            <Button 
                                                text='请好友听' 
                                                onClick={this.openInviteFriendsToListenDialog}
                                                logRegion="voice-simple"
                                                logPos="invite-listen"
                                                remaining = {shareRemaining}
                                            /> : null}
                                    </div>
                                    
                                )
                            }
                        }
                    />
                </div>

                


                <div className='flex-main-h topic-main-box'>

                    {/*录音时遮挡层*/}
                    {
                        this.state.bottomTabType != ''?
                        <div className="recording-cover"  onClick={this.closeBottomBar}></div>
                        :null
                    }
                    <div
                        className="flex-main-s topic-main-flex topic-main-scroll-box"
                        id="main-scroll-area"
                        onScroll={this.handleScrollSpeakList}
                        onTouchMove={e=>{this.handleScrollSpeakList(e); this.recordScrollTime();}}
                        onWheel={e=>{this.handleScrollSpeakList(e); this.recordScrollTime();}}
                        ref='topicListContainer'
                    >
                        {/*滚动到顶部才显示*/}
                        {
                            (!this.props.topicInfo.campId && this.props.forumSpeakList[0] && this.props.forumSpeakList[0].type == 'start')?
                            /*话题信息卡片（分享榜）*/
                            <div ref="topInfoCards">
                                {/*分享榜*/}
                                <ShareRankCard
                                    topicInfo={this.props.topicInfo}
                                    cardItems={this.props.shareRankCardItems}
                                    shareData={this.state.shareData}
                                    distributionPercent = {this.state.distributionPercent}
                                    power={this.props.power}
                                    userId={this.props.userId}
                                    platformShareRate = {this.props.platformShareRate}
                                    channelCharge = {this.state.channelCharge}
                                />
                            </div>:null
                        }
                        {/*听课指南*/}
                        <TipsCard  type="create-live" chtype={`create-live_${this.props.topicInfo.style}`} />

                        {/*课堂红包指南 */}
                        {this.props.power.allowSpeak&&this.props.topicInfo.status != 'ended'&&this.state.showRedPackCard&&<RedPackCard locationToRedpack={this.locationToRedpack} />}
                 
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
                            delSpeakIdList={this.props.delSpeakIdList}
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
                            topicStyle = {this.props.topicInfo.style}
                            isEnableReward = {this.props.topicInfo.isEnableReward}
                            revokeForumSpeak = {this.props.revokeForumSpeak}
                            liveBanned = {this.props.liveBanned}
                            topicId = {this.props.location.query.topicId}
                            liveId = {this.props.topicInfo.liveId}
                            audioLoading={this.state.audioLoading}
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

                    <BarrageLuckyMoney
                        isAbsolute = { true }
                        rewardBulletList = {this.props.rewardBulletList}
                        isShowBullet = {this.props.isShowBullet}
                        isShootBullet = {this.props.isShootBullet}
                    />

                    {
                        this.state.showGotoPlaying ?
                        <div className="btn-goto-playing" onClick={this.gotoPlayingMsg} >
                            回到播放位置
                        </div> : null
                    }

                    <div className="operation-area">
                        {
                            (this.props.topicInfo.style === 'audio' && !this.props.power.allowSpeak && this.props.topicInfo.startTime < this.props.sysTime)?
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
                        {
                            this.props.topicInfo.style === 'audio' && Date.now() - this.props.topicInfo.startTime >= this.props.topicInfo.duration &&
                            <div className={`audio-speed-btn on-log${this.state.audioSpeedBtnAct ? ' act' : ''}`}
                                 onClick={this.audioSpeedBtnClickHandle}
                                 data-log-name="语速变更"
                                 data-log-region="audio-speed-btn"
                                 data-log-pos="audio-speed-btn"
                            >
                                <div className="rate">{this.state.audioSpeedRate % 1 === 0 ? `${this.state.audioSpeedRate}.0` : this.state.audioSpeedRate}</div>
                                <div className="tip">倍速播放</div>
                            </div>
                        }
	                    {
		                    this.props.topicInfo.channelId &&
                            <div className="course-list-btn on-log"
                                 onClick={this.showCourseListDialog}
                                 data-log-name="课程列表"
                                 data-log-region="course-list-btn"
                                 data-log-pos="course-list-btn"
                            >
                                <div className="tip">课程列表</div>
                            </div>
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
                            !this.props.power.allowMGLive && !this.props.power.allowSpeak && (this.state.isOfficialLive === 'Y' || (this.props.isLiveAdmin === 'N' && this.state.isWhiteLive === 'N')) ?
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
                </div>



                <div className="flex-other">
                    {/*底部发言块*/}
                    {
                        (this.props.topicInfo.isAuditionOpen == 'Y' && this.state.isAuthChannel == 'N' && this.state.canInviteAudition == 'Y'  && !this.props.power.allowMGLive && !this.props.power.allowSpeak) ?
                        //<TryListenStatusBar count={this.state.inviteDetail.inviteNum} total={this.state.inviteDetail.inviteTotal} onClick={this.onClickTryListenBar}/>
                        (null)
                        :(this.props.power.allowSpeak && this.props.topicInfo.status != 'ended')?
                        <BottomSpeakBar
                            ref='speakBar'
                            showControlDialog = {this.showControlDialog}
                            power = {this.props.power}
                            addForumSpeak = {this.addForumSpeak}
                            addSpeakImagePc = {this.addSpeakImagePc}
                            addSpeakImageWx = {this.addSpeakImageWx}
                            recordingStatus = {this.state.recordingStatus}
                            recSecond = {this.state.recSecond}
                            playingRecTemp = {this.state.playingRecTemp}
                            startRec = {this.startRec}
                            stopRec = {this.stopRec}
                            playRec = {this.playRec}
                            pauseRec = {this.pauseRec}
                            resetRec = {this.resetRec}
                            sendRec = {this.sendRec}
                            liveId = {this.data.liveId}
                            feedbackTarget = {this.state.feedbackTarget}
                            onSwitchTab = {this.onSwitchTab}
                            uploadRec = {this.props.uploadRec}
                            pauseAudio = {this.pauseAudio}
                            clickTooFast = {this.clickTooFast}
                            topicStyle={this.props.topicInfo.style}
                            userInfo = {this.props.userInfo.user}
                            isRelayChannel={this.props.topicInfo.isRelayChannel}
                            locationToRedpack = {this.locationToRedpack}
                            uploadDoc={this.props.uploadDoc}
                            saveFile={this.props.saveFile}
                            isLiveAdmin={this.props.isLiveAdmin}
                            canShowNewFuncTips={true}
                        /> :
                        <BottomSpeakBarClient
                            dot={this.state.dot}
                            topicInfo = {this.props.topicInfo}
                            showControlDialog = {this.showControlDialog}
                            addForumSpeak = {this.addForumSpeak}
                            mute = {this.props.mute}
                            topicEnded = {this.props.topicInfo.status == 'ended'}
                            topicStyle = {this.props.topicInfo.style}
                            onIncrFansActivityBtnClick={ this.onIncrFansActivityBtnClick }
                            isOfficialLive={ this.state.isOfficialLive }
                            incrFansFocusGuideConfigs={ this.state.incrFansFocusGuideConfigs }
                            getAudioPlayerCurrentTime={this.getAudioPlayerCurrentTime}
                            isHasLive = {this.state.isHasLive}
                        />
                    }
                </div>

                <ReactCSSTransitionGroup
                    transitionName="thousand-live-animation-oprationList"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {
                        this.state.showControlDialog ?
                        <BottomControlDialog
                            dot={this.state.dot}
                            topicInfo = {this.props.topicInfo}
                            showCourseListDialog={this.showCourseListDialog}
                            isShow = {this.state.showControlDialog}
                            mute = {this.props.mute}
                            showReword = {this.props.showReword}
                            setMute = {this.props.setMute}
                            setRewordDisplay = {this.setRewordDisplay}
                            onCloseSettings = {this.hideControlDialog}
                            liveId = {this.data.liveId}
                            teacherOnly = {this.props.teacherOnly}
                            toggleTeacherOnly = {this.toggleTeacherOnly}
                            topicId = {this.data.topicId}
                            loadFirstMsg = {this.loadFirstMsg}
                            loadLastMsg = {this.loadLastMsg}
                            power = {this.props.power}
                            currentUserId = {this.props.currentUserId}
                            topicStatus = {this.props.topicInfo.status}
                            fetchEndTopic={this.props.fetchEndTopic}
                            isOpenAppDownload={this.props.topicInfo.isOpenAppDownload}
                            toggleAppDownloadOpen={this.props.toggleAppDownloadOpen}
                            isCampCourse={this.props.isCampCourse}
                            auditStatus = {this.props.location.query.auditStatus || ''}
                            changgeLiveBox = {this.changgeLiveBox}
                            showLiveBox = {this.state.showLiveBox}
                        />:null
                    }
                </ReactCSSTransitionGroup>

                {/*课程列表弹窗*/}
                {
                    this.state.mountCourseListDialog &&
                    <CourseListDialog
                        topicInfo = {this.props.topicInfo}
                        showCourseListDialog = {this.state.showCourseListDialog}
                        hideCourseListDialog = {this.hideCourseListDialog}
                        onCloseSettings = {this.hideControlDialog}
                        isBussiness={this.props.power.allowSpeak || this.props.power.allowMGLive}
                    />
                }
                
                {/*赞赏弹框*/}
                {
                    this.state.showLuckyMoney &&
                        <LuckyMoney
                            rewardPrice = {this.props.liveInfo.entityExtend.rewardPrice}
                            rewardIntroduce = {this.props.liveInfo.entityExtend.rewardIntroduce}
                            payForHead={ imgUrlFormat(this.state.payForPortrait, '?x-oss-process=image/resize,h_50,w_50,m_fill') }
                            payForName={ this.state.payForName }
                            onHideRewardClick={ this.onCloseReward }
                            onRewardItemClick={ this.onRewardItemClick }
                            showRewardCard = {this.showRewardCard}
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
                
                {
                    !this.props.isCampCourse && this.state.showArchivementCardModal ? <ArchivementCardModal
                                                                hideModal={this.hideArchivementCardModal.bind(this)}
                                                                archivementCardUrl={`/wechat/page/studentComplitedTopic?topicId=${this.data.topicId}&liveId=${this.data.liveId}`} />
                                                        : null
                }

                {/*{*/}
                    {/*!this.props.isCampCourse && this.state.showArchivementCardBtn ? <ArchivementCardBtn*/}
                                                                {/*archivementCardUrl={`/wechat/page/studentComplitedTopic?topicId=${this.data.topicId}&liveId=${this.data.liveId}`} />*/}
                                                        {/*: null*/}

                {/*}*/}

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
                    topicInfo = {this.props.topicInfo}
                    openRedpack = {this.openRedpack}
                    unLockRequest = {this.unLockRequest}
                    isBindThird={this.props.isSubscribe.isBindThird}
                    userId={this.props.userId}
                    platformShareRate = {this.props.platformShareRate}
                />

                {/* 邀请好友免费听弹窗 */}
                <InviteFriendsToListen
					ref = {el => this.inviteFriendsToListenDialog = el}
                    inviteFreeShareId = {this.state.inviteFreeShareId}
                    //关闭弹窗后重新初始化分享
                    onClose = {this.initShare}
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

                <FollowQrcode showDialog={this.state.showFollowDialog} onClose={this.closeFollowLive} focusLiveClick={this.focusLiveClick}/>
                { (node && this.isCamp && this.getLiveStatus()) && <JobReminder channelId={ this.props.topicInfo.channelId } topicId={this.data.topicId} targetNode={ node } /> }

                {
                    this.state.tryListenMask.show ?
                    <TryListenShareMask {...this.state.inviteDetail}
                    isBindThird={this.props.isSubscribe.isBindThird}
                    isFocusThree={this.props.isSubscribe.isFocusThree}
                    channelId={this.props.topicInfo.channelId}
                    liveId={this.data.liveId}
                    topicId={this.data.topicId}
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
            </Page>
        );
    }

    componentWillUnmount() {
        resetScroll();
    }
}

ThousandLiveVideo.propTypes = {

};
ThousandLiveVideo.childContextTypes = {
  lazyImg: PropTypes.object
};

function mapStateToProps (state) {
    return {
        sid: state.thousandLive.sid,
        weappLinkTo: state.thousandLive.weappLinkTo,
        topicInfo: state.thousandLive.topicInfo,
        userInfo: state.common.userInfo,
        shareRankCardItems: state.thousandLive.shareRankCardItems,
        forumSpeakList: state.thousandLive.forumSpeakList,
        totalSpeakList: state.thousandLive.totalSpeakList,
        rewardBulletList: state.thousandLive.rewardBulletList,
        isShowBullet:state.thousandLive.isShowBullet,
        isShootBullet:state.thousandLive.isShootBullet,
        sysTime: state.common.sysTime,
        liveVolume: state.thousandLive.liveVolume,
        mute: state.thousandLive.mute,
        beforeOrAfter: state.thousandLive.beforeOrAfter,
        showReword: state.thousandLive.showReword,
        teacherOnly: state.thousandLive.teacherOnly,
        power: state.thousandLive.power,
        isFollow: state.thousandLive.isFollow,
        canAddSpeak: state.thousandLive.canAddSpeak,
        fromWhere: state.thousandLive.fromWhere,
        currentUserId: state.thousandLive.currentUserId,
        browseNum: state.thousandLive.browseNum,
        liveInfo:state.thousandLive.liveInfo,
        userId:state.thousandLive.userId,
        inviteListArr: state.thousandLive.inviteListArr,
        insertNewMsg: state.thousandLive.insertNewMsg,
        lshareKey: state.thousandLive.lshareKey,
        pushCompliteInfo: state.thousandLive.pushCompliteInfo,
        popAppDownloadBar: state.thousandLive.popAppDownloadBar,
        isLiveAdmin: state.common.isLiveAdmin,
        isSubscribeInfo: state.thousandLive.isSubscribe,
        isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',/** 这里的训练营是之前c端活动的，不是常用的训练营。判断训练营，用campId */
        delSpeakIdList: state.thousandLive.delSpeakIdList,
        platformShareRate: state.common.platformShareRate,
    }
}

const mapActionToProps = {
    getUserInfo,
    addForumSpeak,
    getForumSpeakList,
    clearForumSpsakList,
    uploadImage,
    uploadRec,
    getSysTime,
    revokeForumSpeak,
    startSocket,
    setMute,
    toggleTeacherOnly,
    setRewordDisplay,
    setRewordDisplayStatus,
    doPay,
    fetchMediaUrl: getMediaActualUrl,
    followLive,
    setCanAddSpeak,
    updateMute,
    liveBanned,
    setLiveVolume,
    getGuestList,
    bindShareKey,
    fetchEndTopic,
    addPageUv,
    pushAchievementCardToUser,
    setCanPopDownloadBar,
    toggleAppDownloadOpen,
    getQr,
    isSubscribe,
    loadTargetSpeakById,
    fetchQrImageConfig,
    isServiceWhiteLive,
    subscribeStatus,
    checkFollow,
	fetchLastOrNextTopic,
    getOfficialLiveIds,
    fetchChargeStatus,
    fetchShareRankCardItems,
    getMyQualify,
    getQlLiveIds,
    getUserTopicRole,
    userBindKaiFang,
    updateRedEnvelope,
    uploadDoc,
    saveFile,
    getChannelInfo,
    getShareRate,
    addLikeIt,
    getLike,
    getRelayDelSpeakIdList
 
}

module.exports = connect(mapStateToProps, mapActionToProps)(ThousandLiveVideo);
