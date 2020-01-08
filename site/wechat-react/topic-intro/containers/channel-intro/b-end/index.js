const isNode = typeof window === 'undefined';

import React, { Component, Fragment  } from 'react';
// import PropTypes from 'prop-types';
import { findDOMNode,createPortal } from 'react-dom';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import { autobind, throttle } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { BottomDialog, Confirm, MiddleDialog } from 'components/dialog';
import PyramidDialog from 'components/dialogs-colorful/pyramid';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import CompanyDialog from 'components/dialogs-colorful/company';
import TeacherCupDialog from 'components/dialogs-colorful/teacher-cup';
import QRImg from 'components/qr-img';
import DoctorDialog from 'components/dialogs-colorful/doctor';
// import animation from 'components/animation';
import LiveVDialog from 'components/dialogs-colorful/live-v';
import HotHeart from 'components/dialogs-colorful/hot-heart';
import Spokesperson from 'components/dialogs-colorful/spokesperson';
import Detect from 'components/detect';
// import { showShareSuccessModal } from 'components/dialogs-colorful/share-success';
import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';
import FollowDialog from 'components/follow-dialog';

import ButtonRow from './components/button';
import ConsultList from './components/consult-list';
import GroupingList from './components/grouping-list';
import GroupPost from './components/group-post';
import BottomPayDialog from './components/bottom-pay-dialog';
import BottomCouponListDialog from './components/bottom-coupon-list-dialog';
import BottomControl from './components/bottom-control-dialog';
import SymbolList from 'components/dialogs-colorful/symbol-list';
// import FocusQlGuide from './components/focus-ql-guide';
// import QlFocusGuideDialog from 'components/dialogs-colorful/focusql-guide';
import ReceiveCouponDialog from './components/receive-coupon-dialog';
import PromoRank from './components/promo-rank';
import ReprintBtn from './components/reprint-btn';
import OperatePlat from './components/operate-plat';

import PushChannelDialog from 'components/dialogs-colorful/push-dialogs/channel';
import ActionSheet from 'components/action-sheet';
import { AudioSlicePlayer } from 'components/audio-player';
// import SubscriptionBar from 'components/subscription-bar';
import XiumiEditorH5 from "components/xiumi-editor-h5";
import SpecialsCountDown from '../../../components/specials-count-down';
import BackTuitionLabel from '../../../components/back-tuition-label';
import TrainingCampEnd from '../c-end/components/training-camp-end';
import CampDetail from '../c-end/components/camp-detail';
import TopOptimizeBar from '../../../../components/top-optimize-bar';

import CommonInput from 'components/common-input';
import ShortKnowledgeTip from "../../../../components/short-knowledge-tip";
import { apiService } from 'components/api-service';

import {
    locationTo,
    formatDate,
    formatMoney,
    digitFloor2,
    isBeginning,
    timeAfter,
    digitFormat,
    getVieoSrcFromIframe,
    replaceWrapWord,
    dangerHtml,
    refreshPageData,
    imgUrlFormat,
    getCookie,
    setCookie,
    updateUrl,
    timeAfterMixWeek,
    localStorageSPListAdd,
    getVal,
    timeBefore,
    handleAjaxResult,
    randomShareText,
    baiduAutoPush,
    getCourseHtmlInfo
} from 'components/util';

import { fillParams } from 'components/url-utils'
import { share } from 'components/wx-utils';

import {
    doPay,
    getCousePayPaster,
    getDomainUrl,
    subscribeStatus,
    isFollow,
    whatQrcodeShouldIGet,
    subAterSign,
    uploadTaskPoint,
    request,
    checkEnterprise,
    getCommunity
} from 'common_actions/common';
import {
    getCoralQRcode,
} from 'common_actions/coral';
import {
	bindOfficialKey,
    getMyCoralIdentity,
    getQrCode,
    fetchAndUpdateSysTime,
    fetchCourseTag
} from '../../../actions/common';
import {
    getEditorSummary
} from '../../../actions/editor';

import {
    isCollected,
    addCollect,
    cancelCollect,
	getTryListen,
	checkDuplicateBuy,
	fetchQlQrcode,
    getAuth,
    getIfHideGroupInfo,
    getJoinCampInfo,
    getCurrentPeriod,
} from '../../../actions/channel-intro';

import {
    sendConsult,
    getConsultSelected,
    consultPraise,
    setConsultList,
} from 'actions/consult'

import { logPayTrace, logGroupTrace, eventLog } from 'components/log-util';
import { fixScroll, resetScroll } from 'components/fix-scroll';
import EmptyPage from 'components/empty-page';

// actions
import {
    initChannelInfo,
    initIsBlack,
    initIsSubscribe,
    initLiveRole,
    initChargeConfigs,
    fetchPayUser,
    initVipInfo,
    fetchCourseList,
    getCourseList,
    setCoursePageNum,
    updatePushNum,
    updateFollowChannel,
    switchFree,
    updateCourseData,
    fetchRemoveCourse,
    fetchDeleteCourse,
    fetchSingleBuy,
    fetchFreeBuy,
    fetchEndCourse,
    getGiftId,
    channelCreateGroup,
    getChannelGroupResult,
    getChannelGroupSelf,
    getChannelGroupingList,
    channelCount,
    bindLiveShare,
    updateOrderNowStatus,
    callActivityLog,
    getOpenPayGroupResult,
    fetchCouponListAction,
    updateCouponInfo,
    onChangeTopicHidden,

    activityCodeExist,
    activityCodeBind,
    getPromotion,

    newBeginTopic,

    fetchMediaCouponDetail,
    receiveMediaCoupon,
    fetchIsReceivedCoupon,
    fetchMediaCouponList,

    getShareCutCourseInfo,

    getCouponBoxCourseInfo,
    getApplyRecord,

} from '../../../actions/channel';

import {
    fetchGetQr,
    getRealStatus,
    getCheckUser,
    getLiveSymbol,
    addPageUv,
    getLiveInfo,
    getGuideQrSetting,
	hideTopic,
	getIsOrNotListen
} from '../../../actions/live';

// actions
import {
    channelAutoDistributionInfo,
    channelAutoShareQualify,
} from '../../../actions/channel-distribution';
import {
    reply,
    removeReply,
	getEvaluationData,
    getIsOpenEvaluate,
    getEvaluationList
} from '../../../actions/evaluation';

import {
    userBindKaiFang,
} from 'actions/recommend';

import { countSharePayCache } from 'actions/channel-group';

import {
    checkUser
} from '../../../../live-studio/actions/collection';

// methods
import * as CommonMethods from './methods/common';
import * as EventMethods from './methods/event';

import ComplainFooter from './components/complain-footer';
// import Stars from '../evaluation/components/stars'
// import { coupon } from '../../reducers/coupon';

import ChannelEvalueBar from './components/channel-evalued'
import Timer from 'components/timer';
import CouponDialog from 'components/coupon-dialog';
import CouponInDetail from 'components/coupon-in-detail';
import Evaluate from '../../../components/evaluate';
import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import IntroGroupBar from "components/intro-group-bar";

@autobind
class Channel extends Component {
    constructor(props) {
        super(props);

        this.data.channelId = Number(props.location.query.channelId);
        this.data.targetCouponId = this.props.location.query.couponId;
        // 官方直播间
        this.data.officialLiveIds = [
            "100000081018489",
            "350000015224402",
            "310000089253623",
            "320000087047591",
            "320000078131430",
            "290000205389044",
        ];

        const that = this;
        bindMethodThis(CommonMethods)
        bindMethodThis(EventMethods)

        // 给方法绑定this
        function bindMethodThis(methods) {
            for (var method in methods) {
                if (methods.hasOwnProperty(method)) {
                    that[method] = methods[method].bind(that)
                }
            }
        }

    }

    state = {
        // 控制系列课简介的展开和收起
        // isFoldIntro: this.initIntroFold(),
        isFoldIntro: false,

        // 控制B端操作平台是否升起
        isShowOperatePlat: false,

        // intro | course | message
        currentTab: "intro",

        // 当此属性为true的时候，tab会一直粘在顶部
        tabStick: false,

        // 是否显示系列课有效期
        isShowChargePeriod: this.isShowChargePeriod(),
        // 是否灵活按月支付
        isChargeByPeriod: this.isChargeByPeriod(),
        // 是否有更多课程
        isNoMoreCourse: false,
        // 是否弹出支付框
        isOpenPayDialog: false,
        // 是否弹出优惠码列表
        isOpenCouponListDialog: false,
        // 优惠券列表
        couponList: [],
        // 是否展示加载完的提示
        notShowLoaded: false,
        // 课程设置弹窗状态是否显示
        isOpenCourseSettingDialog: false,
        // 课程设置参数
        courseSettingData: {},
        // 分销shareKey
        sharekey: '',
        // 是否课程列表已加载（解决数据没回来前显示空的提示的问题）
        isCourseListLoaded: false,
        // 是否参与人信息已加载（解决数据没回来前显示参与人为0的问题）
        isJoinedDataLoaded: false,
        // // 咨询框输入信息
        // consultInfo: '',
        // 是否显示关注二维码
        isShowFollowQR: false,
        // 二维码地址
        qrcodeUrl: '',
        focusAppId: '',
        // 当前选中的会员类型（赠礼弹框）
        curCharge: 0,
        // 赠礼数量
        giftCount: 1,
        // 购买礼物后的礼物ID
        giftId: null,
        // 赠礼按钮是否禁用
        isGiftDisable: false,
        // 单节购买输入框价格
        singleBuyInputValue: '',
        // 是否显示定制券领券框
        couponDialogShow: false,
        // 定制券金额
        couponMoney: 0,
        // 使用定制券开始时间
        startDate: null,
        // 使用定制券截止时间
        endDate: null,

        //移出输入框价格
        moveOutInputValue:'',

        postTimeOver:false,

        topicCount:"",
        // 是否开始邀请卡角标动画
        doShareCardAnimation: false,
        pageUrl: '',

        //营销工具列表是否显示
        isShowMarketList:false,
        joinCampInfo:{},


        //实名认证弹框是否显示
        isShowRealName:false,
        realNameStatus:'unwrite',//unwrite=未填写， auditing=已填写审核中，audited=已审核，auditBack=审核驳回
        isPop:false,
        symbolList:[],
        isShowVBox:false,
        isShowTBox:false,
        isShowHotBox:false,
        isShowDaiBox:false,
        isShowDoctorBox: false,

        // 动态剩余推送次数
        timelineRemainTimes: 0,
        // 显示金字塔弹框
        showPyramidDialog : false,

        // 控制分享卡的动画
        shareTagGifEnd: false,
	    // 显示千聊二维码
	    showQlQRCode: false,
        qlQRCode: '',
        qlQRAppId: '',


        // 分享成功二维码
        shareQrcodeUrl: '',
        // 填写过表单
        notFilled: null,
        // 增粉二维码
        incrFansQrcodeUrl: '',

        // 是否载入视频简介iframe
        showVideoIframe: false,

        //显示系列课推送弹框
        showPushChannelDialog: false,
	    // 右上角分享按钮
	    showUncertainShareBtn: false,
	    showShareToEarnBtn: false,
	    showMyInvitationCardBtn: false,
	    showShareCoralBtn: false,

        shwoChannelTipsDialog: false,

	    // 珊瑚计划推广弹窗相关
	    showCoralPromoDialog: false,
	    coralPromotionPanelNav: 'tutorial',
	    coralPushData: {},

        // C端听课优化 头图继续播放
        continuePlayText: '',

        // 单节购买话题 购买系列课弹窗 临时话题信息
        buyChannelDialogTopicItem: null,

        newBeginTopicTimeStr: "即将更新",
        newBeginTopic: {},

        // 当前选中的价格配置
        activeChargeIndex: 0,

        // 是否显示自媒体转载系列课优惠券弹窗
        isShowMediaCouponDialog: false,
        // 自媒体转载课优惠券
        mediaCoupon: {},
        // 显示三方服务号的二维码的状态
        showThreeQrcode: false,
        // 三方二维码
        threeQrcode: '',
        shouldShowThreeQrcode: false, // 判断是否设置了店铺引流

        // 显示回到顶部的aside浮动
        showGoToTop: false,
        isCollected: false,


        // 真正展示出来的课程列表
        courseList: [],
        // 课程tab选课组件
        courseTabList: [],
        currentCourseTab: 0,
        showCourseTab: false,
        showCourseTabChoser: false,

        isShowIncrFansQrcodeDialog: false,

        showGroupingInfo: false,

        // 课程折叠状态
        courseFold: true,
        // 课程显示全部
        courseShowAll: true,
        // 课程数量足够多，可以显示全部标签
        topicNumIsOk: false,
        // 留言弹窗
        consultPop: false,
        isOrNotListen: false, //是否畅听直播间
        audioStatus: 'stop',
        percent: 0,

        // 重复购买提示
        // 显示关注千聊公众号的弹窗
        isShowQlQrcodeDialog: false,
        // 已经购买过的相同系列课的id
        alreadyBuyChannelId: '',
        // 千聊公众号二维码链接url
        qlqrcodeUrl: '',
        qlAppId: '',

        cutAnimate: true,
        showCutTimer: true,
        // 是否开启自动领取，默认开启，就是页面刚进来的时候需要自动领取优惠券，如果是在介绍中点击那个优惠券的话这个开关需要关闭，见onReceiveClick方法
        isAutoReceive: true,
        isShowShareGetCouponActivity:false,
        treasureCouponInfo:{},
        treasureCouponRecord:{},

        followDialogTitle: '',
        followDialogDesc: '',
        followDialogOption: {},

        replyContent: '',
		currentRelyIndex: '',
		showReplyInput: false,
        replyPlaceholder: '',

        // 有效评价过滤开关
        evaluateHasValidFilter: false,
        /** 拉人返学费相关 **/
		showBackTuitionLabel: false, // 是否显示拉人返学费面板
		inviteReturnConfig: {}, //拉人返学费邀请配置
        /****************/
        // 训练营最近的信息
        campInfo: {},
        realNameInfo: {},

        // 企业认证
        isCompany: false,
        enterprisePo: {},

        courseOptimizeNum: 0, // 课程剩余优化数
        
        communityInfo: null, // 社群信息
		groupHasBeenClosed: true, // 關閉社群入口
		isShowGroupDialog: false, // 显示社群弹窗
    };

    data = {
        channelId: '',
        sourceNo: 'qldefault',
        cancelPayTexts: [
            {
                text: '亲，你真的忍心放弃吗？长按下方二维码关注，可找聊妹进一步了解课程内容↓ ↓ ↓',
                channel: 'channelCancelPayA',
            },
            {
                text: '亲，你真的忍心放弃吗？长按下方二维码关注，可以获取更多优质大V课程，还有神秘惊喜哦↓ ↓ ↓',
                channel: 'channelCancelPayB',
            },
            {
                text: '亲，你真的忍心放弃吗？长按下方二维码关注，聊妹为你打造量身课程，还可以和聊妹咨询哦！',
                channel: 'channelCancelPayC',
            },
        ]
    }

    componentWillMount() {
        // 初始化价格配置，取首个有效状态的价格配置信息
        let chargeConfigs = this.props.chargeConfigs;
        if (chargeConfigs) {
            for (let i in chargeConfigs) {
                if (chargeConfigs[i].status === 'Y') {
                    this.setState({
                        activeChargeIndex: i
                    })
                    break;
                }
            }
        }
    }

    initShowKnowledgeTip = async () => {
        let storage = localStorage.getItem('showKnowledgeTip');
        let key = 'channel'+this.props.channelInfo.channelId;
        let times = storage && JSON.parse(storage)[key] || 0;
        if (times > 2) return ;
        let result = await apiService.post({
            url: '/h5/dataStat/getCourseIndexStatus',
            body: {
                businessId: this.data.channelId,
                type: 'channel'
            }
        })
        if (result.state.code == 0) {
            times ++;
            if (result.data.knowledgeStatus != 'Y' && times < 3 && Date.now() < new Date('2019-06-18').valueOf()) {
                localStorage.setItem('showKnowledgeTip', JSON.stringify({
                    [key]: times
                }))
            }
            this.setState({
                showKnowledgeTip: result.data.knowledgeStatus != 'Y' && times < 3 && Date.now() < new Date('2019-06-18').valueOf()
            })
            setTimeout(() => {
                this.setState({
                    showKnowledgeTip: false
                })
            }, 4000)
        }
    }

    async componentDidMount() {
        window.brige = this
        window.findDOMNode = findDOMNode

        this.sendPV();
        this.props.fetchAndUpdateSysTime();

        this.delayVideoIframe();

        this.initChannelInfo();
        this.initPayUser();
        this.initCourseList();
        this.initConsultList();
        this.isAutoPay();
        this.isOpenPayDialog();
        this.checkOrderNow();
        this.initCoupon();
        this.initShare();
        const kfAppId=this.props.location.query.kfAppId;
        const kfOpenId=this.props.location.query.kfOpenId;
        if(kfAppId&&kfOpenId){
            // 绑定分销关系
            await this.doShareBind();
            this.props.userBindKaiFang(kfAppId,kfOpenId);
        }else{
            // 绑定分销关系
            this.doShareBind();
        }
	    this.checkIsFollow();//关注二维码
        this.initContinuePlayButton();
        this.props.addPageUv('', this.props.channelInfo.liveId,'liveUv', this.props.location.query.pro_cl || getCookie('channelNo') || '');

        refreshPageData();
        setTimeout(() => {
            this.fixImgSize();
        }, 0);

        this.doShareCardAnimation();

        this.initLiveSymbol();
        this.initRealStatus();


        // 初始化是否收藏系列课
        this.initIsCollected()

        this.setState({
            pageUrl: typeof location != 'undefined' && location.href,
            couponCode: this.props.location.query.couponCode,
            codeId: this.props.location.query.codeId,
        });

        this.props.getEvaluationData({
            channelId: this.data.channelId
        });

        // 如果是前端路由，这个页面好像没有前端路由过来的
        if (!this.props.evaluationIsOpen) {
            await this.props.getIsOpenEvaluate(this.props.channelInfo.liveId);
        }

        var sourceNo = "qldefault";
        if (this.props.location && this.props.location.query && this.props.location.query.sourceNo) {
            sourceNo = this.props.location.query.sourceNo;
            this.data.sourceNo = this.props.location.query.sourceNo;
        }

        this.props.channelCount({
            channelId: this.props.channelInfo.channelId,
            lshareKey: this.props.myShareQualify&& this.props.myShareQualify.type==='live' ? this.props.myShareQualify.shareKey : "",
            shareKey: this.state.sharekey ? this.state.sharekey : "",
            sourceNo: sourceNo
        });

        if(this.props.location.query.officialKey){
        	this.props.bindOfficialKey({
		        officialKey: this.props.location.query.officialKey
            });
        }
        this.initShareBtn();

        // 活动定制券领取弹窗
        this.showCustomCouponDialog();
        //砍价功能
        this.getShareCutCourseInfo();

        this.checkUser();
        this.newBeginTopic()
        // 初始化自媒体转载系列课优惠券弹窗
        this.initMediaCouponInfo();

        //获取是否隐藏拼团模块
        this.initGroupingInfo();

        this.ajaxGetLiveInfo();

        this.ajaxFetchGetQr();
        //获取引流设置
        this.ajaxGetGuideQrSetting();
        this.initFootPrint()

        this.initCourseTabList();

        this.getIsOrNotListen();

        this.getTryListen();

        this.checkDuplicateBuyStatus();

        this.fetchQlQrcode();

        //判断是否进入页面弹出推送弹框；
        this.initPushChannelDialog();

        this.initFocusConfirm();
        //判断是否从支付成功页面进来
        this.ifFromFinishPage();

        this.initButtonAnimate();
        //分享得券开宝箱活动
        this.initTreasureCoupon();
        // 获取富文本简介
        this.getEditorSummary();

        this.ajaxGetCourseOptimizeNum();

        // tab滚动事件
        this.initSrollEvent()

        this.getCampInfo();

        // 返学费初始化状态
        this.initInviteReturnInfo()

        this.getCompany();

        this.initShowKnowledgeTip();

		const desc = this.state.channelDesc && this.state.channelDesc.lectuerInfo && this.state.channelDesc.lectuerInfo.find(item => item.type === 'text')
		this.initHtmlInfo({
			businessId: this.props.channelInfo.channelId,
			businessType: 'channel',
			businessName: this.props.channelInfo.name, 
			liveName: this.props.channelInfo.liveName, 
			intro: desc && desc.content || ''
		});

	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-box');
        }, 1000);
    }

    componentDidUpdate(preProps,preState) {
        // 如果富文本修改过系列课简介，则需要重置分享(珊瑚的除外)
        if (!this.isUpdateShare && this.isEditorSummary && sessionStorage.getItem('trace_page') != 'coral') {
            this.isUpdateShare = true;
            this.initShare();
        }
    }
    
	async initHtmlInfo (params = {}) {
		const courseTag = await this.props.fetchCourseTag(params.businessId, params.businessType)
		const config = getCourseHtmlInfo(Object.assign({}, params, courseTag))
		if (config) {
			this.setState(config)
		}
		setTimeout(() => {
			baiduAutoPush()
		}, 0);
	}

    // 获取返学费信息
	initInviteReturnInfo = async() => {
		await request({
			url: '/api/wechat/transfer/h5/invite/return/inviteReturnInfo',
			body: {
				businessId: this.data.channelId,
				businessType: 'channel',
			}
		}).then(async(res) => {
			if(res.state.code) throw Error(res.state.msg)
			if(res.data) {
                let showBackTuitionLabel = false
                let inviteReturnConfig = {}
                // B端开启了
                if(res.data.inviteReturnConfig && res.data.inviteReturnConfig.status == 'Y'){
                    showBackTuitionLabel = true
                    inviteReturnConfig = res.data.inviteReturnConfig
                }

				this.setState({ showBackTuitionLabel, inviteReturnConfig})
			}
		}).catch(err => {
			console.log(err);
		})
	}

    // 获取训练营信息
    async getCampInfo(){
        if(this.props.channelInfo.channelId){
            const { data = {} } = await this.props.getCurrentPeriod({
                channelId: this.data.channelId
            });
            const res = await this.props.getJoinCampInfo({
                channelId: this.props.channelInfo.channelId
            })
            this.setState({
                campInfo: data || {},
                joinCampInfo: res.data || {},
            })
            console.log('RES',data);
            
            this.dispatchGetCommunity(this.isCamp);
        
        }

    }

    // 判断是否显示训练营信息
	get isCamp(){
        const { joinCampInfo } = this.state;
        if (joinCampInfo.isNewCamp == 'Y') {
			return true
        } else {
            if(Object.is(joinCampInfo.isCamp,'Y') && Object.is(joinCampInfo.hasPeriod,'Y') ){
                return true;
            }
            if(Object.is(joinCampInfo.joinCamp,"Y")){
                return true
            }

        }
		return false;
    }

	sendPV(){
		// 手动打PV，并给页面所有事件统计加上mark字段
		if(typeof _qla !== 'undefined'){
			const mark = 'be';
			_qla('pv', {
				mark
			});
			_qla.set('mark', mark)
		}
	}

    initButtonAnimate(){
        setTimeout(()=>{
            this.setState({
                cutAnimate:false,
            })
        },7000);

    }
    cutTimerFinish(){
        this.setState({ showCutTimer:false });

    }
    initFocusConfirm(){
        const focusMethod = this.props.location.query.focusMethod;
        if(focusMethod){
            if(focusMethod === 'one'&&!this.props.isLiveFocus){
                this.refs.focusOneDialog.show();
                eventLog({
		            category: 'focusLiveMethod',
		            action: 'success',
		            business_id: this.data.channelId,
		            business_type: 'channel',
		            method: 'one',
                });
            }else if(focusMethod === 'two'&&this.props.isLiveFocus){
                this.refs.focusTwoDialog.show();
                eventLog({
		            category: 'focusLiveMethod',
		            action: 'success',
		            business_id: this.data.channelId,
		            business_type: 'channel',
		            method: 'two',
                });
            }else if(focusMethod === 'confirm'&&this.props.isLiveFocus){
                this.refs.focusCancelDialog.show();
                eventLog({
		            category: 'focusLiveMethod',
		            action: 'success',
		            business_id: this.data.channelId,
		            business_type: 'channel',
		            method: 'confirm',
                });
            }else if(focusMethod === 'normal'){
                eventLog({
                    category: 'focusLiveMethod',
		            action: 'success',
		            business_id: this.data.channelId,
		            business_type: 'channel',
                    method: 'normal',
                });
            }
        }
    }

    async initTreasureCoupon(){
        const treasureCouponInfo = await this.props.getCouponBoxCourseInfo(this.data.channelId);
        if(treasureCouponInfo.personNum){
            const treasureCouponRecord = await this.props.getApplyRecord(this.data.channelId);
            let domainResult= await this.props.getDomainUrl({
                type:'couponBox',
            });
            let isTreasureShowed = false;
            let TreasureShowedCourse = getCookie('TreasureShowedCourse');
            if(TreasureShowedCourse){
                TreasureShowedCourse = TreasureShowedCourse.split(',');
                let thisTargetArray = TreasureShowedCourse.filter((item)=>{
                    return Number(item) === this.data.channelId;
                });
                if(thisTargetArray.length>0){
                    isTreasureShowed = true;
                }else{
                    TreasureShowedCourse.push(this.data.channelId);
                    setCookie('TreasureShowedCourse',TreasureShowedCourse.join(","),1);
                }
            }else{
                TreasureShowedCourse = this.data.channelId;
                setCookie('TreasureShowedCourse',TreasureShowedCourse,1);
            }
            // 自动弹起支付弹窗或者有可用优惠券的情况不显示分享得券的弹窗
            let openpay = this.props.location.query.openpay === 'Y' ? true : false
            let couponList = this.state.couponList

            this.setState({
                treasureCouponInfo,
                isShowShareGetCouponActivity : !openpay && !couponList.length && !this.props.power.allowMGLive && treasureCouponInfo.isFloatBox==='Y'&&!this.isBought && !treasureCouponRecord.id&& !/.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page')) &&!isTreasureShowed ?true:false,
                treasureCouponRecord,
                domainUrl : domainResult.data.domainUrl,
            });
        }

    }

    ifFromFinishPage(){
        if (this.props.location.query.finishPay === 'Y'){
            setTimeout(() => {
                this.tabHandle('course');
            }, 500);
        }
    }

    initPushChannelDialog () {

        let { openStatus } = this.props.location.query;
        if (openStatus === 'Y' || openStatus === 'y') {
            this.setState({
                showPushChannelDialog: true
            })
        }
    }
    // 跳转到推送课程页面
    pushChannel(){
        locationTo(`/wechat/page/live-push-message?channelId=${this.props.channelInfo.channelId}`)
    }
    //获取试听列表
    getTryListen = async () => {
        if (!this.isClientBRelay()) {
            return ;
        }
        const {sourceChannelId} = this.props.channelInfo;
        if (sourceChannelId) {
            const result = await this.props.getTryListen(sourceChannelId);
            handleAjaxResult(result, (data) => {
                this.audition =  data.audition
            })
            if (!this.audioPlayer) {
                this.audioPlayer = new AudioSlicePlayer((percent) => {
                    this.setState({
                        percent: percent
                    })
                },() => {
                    this.setState({
                        audioStatus: 'stop'
                    })
                },() => {
                    window.toast('媒体文件加载出错');
                })
            }
        }
    }
    // 处理试听动作
    handleTryListen = async () => {
        if (!this.audition) {
            window.toast('暂无媒体文件！');
            return ;
        }
        const {audioStatus} = this.state;
        if (audioStatus == 'playing') {
            this.audioPlayer.pause()
            this.setState({
                audioStatus: 'pause'
            })
        } else {
            if (audioStatus == 'pause') {
                this.audioPlayer.resume();
            } else {
                this.audioPlayer.play(this.audition.contentList, this.audition.totalSeconds)
            }
            this.setState({
                audioStatus: 'playing'
            })
        }
    }

    // 判断是否已经购买过相同的系列课
    checkDuplicateBuyStatus = async () => {
        const result = await this.props.checkDuplicateBuy(this.props.channelInfo.channelId);
        if (result.state.code === 0) {
            this.setState({
                alreadyBuyChannelId: result.data.alreadyBuyChannelId
            });
        }
    }

    // 获取千聊公众号的二维码链接
    fetchQlQrcode = async () => {
        const result = await this.props.fetchQlQrcode();
        if (result.state.code === 0) {
            this.setState({
                qlqrcodeUrl: result.data.qrUrl
            });
        }
    }

    // 跳转至已经购买过的系列课主页
    gotoChannelBought = () => {
        if (this.state.alreadyBuyChannelId) {
            locationTo(`/live/channel/channelPage/${this.state.alreadyBuyChannelId}.htm`);
        }
    }

    getIsOrNotListen = async () => {
        if (!this.isClientBRelay()) {
            return ;
        }
        const {liveId} = this.props.channelInfo;
        if (liveId) {
            const result = await this.props.getIsOrNotListen({
                liveId: liveId,
                channelId: this.props.channelInfo.channelId
            });
            if (result && result.state && result.state.code == 0) {
                this.setState({
                    isOrNotListen: result.data.isListen == "Y" ? true : false
                })
            } else {
                window.toast(result.state.msg);
            }
        }
    }
    //b端转载课
    isClientBRelay = () => {
        return this.props.channelInfo.isRelay == 'Y' && this.props.power.allowMGLive
    }

    initCourseTabList = () => {
        let topicNum = this.props.channelInfo.topicNum
        let dataLength = 0
        let dataList = []
        if(topicNum > 20) {
            this.setState({topicNumIsOk: true});
            dataList.push('全部');
        }
        while(topicNum - 20 > 0) {
            dataList.push(String(dataLength * 20 + 1) + '～' + String(dataLength * 20 + 20) + '位')
            topicNum -= 20
            dataLength ++
        }
        // 防止出现101位～101位的情况
        if(dataLength * 20 + 1 == this.props.channelInfo.topicNum){
            dataList.push(String(this.props.channelInfo.topicNum) + '位')
        }else {
            dataList.push(String(dataLength * 20 + 1) + '～' + String(this.props.channelInfo.topicNum) + '位')
        }

        this.setState({
            courseTabList: dataList
        })

    }

    initFootPrint = () => {
        localStorageSPListAdd('footPrint', this.data.channelId, 'channel', 100)
    }

    initSrollEvent = () => {
        this.scrollNode = findDOMNode(this.refs.scrollBox)
        this.courseAnchor = findDOMNode(this.refs.courseAnchor)
        this.messageAnchor = findDOMNode(this.refs.consultList)
        this.scrollWrap = findDOMNode(this.refs.scrollWrap)
        this.scrollNode.addEventListener('scroll', this.scrollHandle)

        setTimeout(() => {
            if (this.introAnchor.clientHeight > 1900) {
                this.setState({
                    isFoldIntro: true
                })
            }
        }, 1500)
        setTimeout(() => {
            this.tabDom && this.computeContenHeight()
        }, 0);
    }

    // 计算内容高度 当内容不足一屏时，补充内容高度 (注：当存在tab栏时)
    computeContenHeight () {

        // 当课程切换正逆序时，内容不足滚动条会上滚
		const wrapEl = document.querySelector('.co-scroll-to-load main');
		if (!wrapEl) return;
		const tabEl = document.querySelector('.co-scroll-to-load .tab');
		if (!tabEl) return;
		wrapEl.style.minHeight = tabEl.offsetTop + this.scrollNode.clientHeight + 'px';
        return;

        const contentHeight = this.introAnchor.clientHeight
        let pb = 120
        if (contentHeight < this.scrollNode.clientHeight - this.tabDom.clientHeight) {
            pb = this.scrollNode.clientHeight - this.introAnchor.clientHeight - this.tabDom.clientHeight
        }
        this.scrollNode.style.paddingBottom = `${pb}px`
    }
    async initGroupingInfo(){
		let result = await this.props.getIfHideGroupInfo({
			liveId: this.props.channelInfo.liveId,
		});
		if(!this.isBought
			&& (this.props.marketsetInfo.discountStatus === 'P' || this.props.marketsetInfo.discountStatus === 'GP')
			&& result.data.isHide !=='Y'){
    		this.setState({
				showGroupingInfo: true,
		    });
	    }
	}

    initIsCollected = async () => {
        const result = await this.props.isCollected({
            type: "channel",
            businessId: this.data.channelId
        })
        if(result && result.data && result.data.isCollected === 'Y') {
            this.setState({isCollected: true})
        }
    }

    @throttle(300)
    scrollHandle() {    

        if (!this.state.tabStick && this.introAnchor && this.scrollNode.scrollTop >= (this.tabDom.offsetTop + this.scrollWrap.offsetTop)) {
            this.setState({
                tabStick: true,
                showGoToTop: true
            })
        } else if (this.state.tabStick && this.introAnchor && this.scrollNode.scrollTop < (this.tabDom.offsetTop + this.scrollWrap.offsetTop)) {
            this.setState({
                tabStick: false,
                showGoToTop: false
            })
        }
    }

    tabHandle(key) {

        setTimeout(() => {
            this.setState({
                currentTab: key
            }, async () => {
                if (key === 'evaluate' && !this.getEvaluationListObj().data) {
                    await this.loadEvaluateList();
                }
                setTimeout(() => {
                    // this.computeContenHeight()
                    try {
                        this.scrollNode.scrollTop = this.tabDom.offsetTop
                    } catch (error) {
                        console.error(error);
                    }
                }, 0)
            })
        },150);

        if(window._qla) {
            _qla('click', {
                region: "channel",
                pos: "tab",
                tab: key,
            })
        }
    }

    getEvaluationListObj = () => {
		return this.state.evaluateHasValidFilter ? this.props.evaluation.evaluationListValid : this.props.evaluation.evaluationList;
	}

	onClickValidFilter = () => {
		this.setState({evaluateHasValidFilter: !this.state.evaluateHasValidFilter}, () => {
			if (!this.getEvaluationListObj().data) this.loadEvaluateList();
		});
	}

	loadEvaluateList = isContinue => {
		return this.props.getEvaluationList({
			channelId: this.props.channelInfo.channelId,
			isContinue,
			hasValidFilter: this.state.evaluateHasValidFilter,
		});
	}

    componentWillUnmount() {
        resetScroll();
    }

    ajaxGetLiveInfo = () => {
        this.props.getLiveInfo(this.props.channelInfo.liveId)
    }

    async newBeginTopic() {
        const result = await this.props.newBeginTopic({channelId: this.data.channelId})
        if(result && result.data && result.data.topic && result.data.topic.startTime) {
            let str = timeAfterMixWeek(result.data.topic.startTime);
            if (str === '进行中') {
                str = '正在';
            }
            this.setState({
                newBeginTopicTimeStr: str + "直播" + "第" + (this.state.topicCount + 1) + "节",
                newBeginTopic: result.data.topic
            })
        } else if(this.props.courseList && this.props.courseList.length != 0){
            if(this.props.channelInfo.topicCount < this.props.channelInfo.planCount) {
                this.setState({ newBeginTopicTimeStr: "等待更新"})
            } else {
                this.setState({ newBeginTopicTimeStr: "更新完结"})
            }
        }
    }

    initShareBtn(){
        // if(this.props.channelInfo.isRelay === 'Y'){
        //     //转载系列课不显示右上角按钮
        //     return;
        // }
        if(this.isFreeChannel){
	        this.setState({
		        showMyInvitationCardBtn: true
	        })
        }else if(this.isDistribution && this.props.coralPercent && this.props.liveRole !== 'creater'){
            // 如果是课代表和珊瑚计划的叠加态，就显示薛定谔的分享按钮
            this.initCoralShare();
            this.setState({
                showUncertainShareBtn: true
            });
        }else if(this.isDistribution){
	        // 如果只是直播间课代表或者系列课课代表
	        this.setState({
		        showShareToEarnBtn: true
	        });
        }else if(this.props.coralPercent && this.props.liveRole !== 'creater'){
            // 如果只有珊瑚计划身份
            this.initCoralShare();
	        this.setState({
		        showShareCoralBtn: true
	        });
        }else if(this.isOpenAutoShare){
	        // 如果开启了自动分销
            this.setState({
                showShareToEarnBtn: true
            });
        }else{
	        this.setState({
		        showMyInvitationCardBtn: true
	        })
        }
    }

    delayVideoIframe() {
        setTimeout(() => {
            this.setState({
                showVideoIframe: true,
            })
        }, 3000);
    }

    /**
     * 绑定直播间分销关系
     */
    async doShareBind() {
        // 存在分销参数，则注入到请求参数中
        let lshareKey = this.props.location.query.lshareKey;
        let taskCardShare = this.props.location.query.taskCardShare === 'Y' ? true : false;

        if (taskCardShare || lshareKey) {
            const result = await this.props.bindLiveShare(this.props.channelInfo.liveId, lshareKey, taskCardShare ? 'taskCardShare' : '');

            // 绑定成功时触发事件日志
			if (result && result.data && result.data.bind === 'Y') {
                eventLog({
                    category: 'shareBind',
                    action:'success',
                    business_id: this.data.channelId,
                    business_type: 'channel',
                });
			}
        }
    }

    initCoupon() {
        if (this.props.power.allowMGLive || (this.props.vipInfo && (this.props.vipInfo.isVip === 'Y' || this.props.vipInfo.isCustomVip === 'Y'))) {
            return;
        }

        if (this.props.chargeConfigs[0].amount >= (this.props.channelSatus.minMoney || 0)) {
            // 未付费，或者已付费的按月收费系列课，获取优惠券列表
            if (!this.props.chargeStatus || (this.props.chargeStatus && this.props.channelInfo.chargeType === 'flexible')) {
                this.fetchCouponList();

                // 已付费的按月系列课不需要弹出框
                if (this.props.chargeStatus && this.props.channelInfo.chargeType === 'flexible') {
                    return;
                }
                // TODO: 产品要求进入页面不需要自动弹出弹框 -- C端产品：吴琼
                // this.setState({
                //     isOpenPayDialog: true
                // });
            }
        }else if ( this.props.channelInfo.isRelay === 'Y' && !this.props.chargeStatus) {
            // 针对自媒体转载系列课优惠券
            this.fetchCouponList();
        }

    }


    /**
     * 是否免费系列课
     */
    get isFreeChannel() {
        const cfg = this.props.chargeConfigs;
        if (!cfg || cfg.length === 0) {
            return false;
        }

        return this.props.channelInfo.chargeType === 'absolutely' && cfg[0].amount == 0;
    }

    /**
     * 是否分销
     */
    get isDistribution() {
        return (this.props.myShareQualify && this.props.myShareQualify.shareEarningPercent>0)
    }

	/**
	 * 获取课代表分成比例,可以用于判断课程授权分销，直播间授权分销，自动分销
	 */
    get distributionShareEarningPercent(){
        return (this.props.myShareQualify && this.props.myShareQualify.shareEarningPercent) ||'';
    }

	/**
	 * 是否开启自动分销
	 */
	get isOpenAutoShare() {
		return this.props.myShareQualify && this.props.isOpenShare == 'Y';
    }

	/**
	 * 是否已购买
	 */
	get isBought(){
		return this.props.chargeStatus || this.props.vipInfo && (this.props.vipInfo.isVip === 'Y' || this.props.vipInfo.isCustomVip === 'Y')
	}

    /*
    *砍价功能
    */
    async getShareCutCourseInfo(){
        let result=await this.props.getShareCutCourseInfo({
            businessId:this.props.location.query.channelId,
        });
        if(this.props.courseCutInfo.personNum){
            let domainResult= await this.props.getDomainUrl({
                type:'shareCut',
            });
            this.setState({
                domainUrl : domainResult.data.domainUrl,
            })
        }

    }

    /**
     * 检查是否需要填表
     */
    async checkUser() {
        // 因为可能续费，所以购买了系列课还是可以填表的
        if (this.props.power.allowMGLive|| this.props.isLiveAdmin != 'Y') {
            return;
        }

        let config = await this.props.checkUser({ liveId: this.props.channelInfo.liveId,businessType:'channel',businessId:this.props.location.query.channelId });
        if (config) {
            this.setState({
                notFilled: config
            })

            if (sessionStorage.getItem("passCollect") == config.id) {
                if (sessionStorage.getItem("saveCollect") == config.id && !this.props.chargeStatus) {
                    this.setState({
                        isOpenPayDialog:true
                    })
                }
            }
        }
    }

    doShareCardAnimation() {
        this.setState({
            doShareCardAnimation: true
        });
    }

    onImageLoaded(e) {
        e = e || window.event;
        e.target.style.width = e.target.width >= 600 ? '100%' : (e.target.width*window.dpr + 'px');
    }

    fixImgSize() {
        let imgs = document.querySelectorAll('.desc-image');

        Array.prototype.map.call(imgs, (item) => {
            if (item.complete) {
                item.style.width = item.width >= 600 ? '100%' : (item.width*window.dpr + 'px');
            }
        });

    }

    // 初始化系列课基本信息
    async initChannelInfo() {
        this.setState({
            topicCount:this.props.channelInfo.topicCount,
        });
        if (!this.props.channelInfo || !this.props.channelInfo.name) {
            // initChannelInfo()
        }
    }

    // 初始化直播间认证标识信息
    async initLiveSymbol() {
        let result = await this.props.getLiveSymbol(this.props.channelInfo.liveId);
        this.setState({
            symbolList: result.data.symbolList || [],
        });
    }

    // 初始化实名认证状态信息
    async initRealStatus() {
        if (this.props.liveRole == 'creater') {
            let statusresult = await this.props.getRealStatus(this.props.channelInfo.liveId,"topic");
            let { data } = await this.props.getCheckUser();
            const newReal = (data && data.status) || 'no';
            const oldReal = statusresult.data && statusresult.data.status || 'unwrite';
            this.setState({
                realNameInfo: statusresult.data || {},
                realNameStatus: oldReal,
                isPop: statusresult.data.isPop,
                checkUserStatus: newReal,
            });
        }
    }

    // 初始化付费用户信息
    async initPayUser() {
        if (!this.props.payUserCount) {
            await this.props.fetchPayUser(this.data.channelId, this.props.channelInfo.liveId);

            this.setState({
                isJoinedDataLoaded: true,
            });
        }
        if(this.props.location.query.shareKey){
            this.setState({
                shareKey:this.props.location.query.shareKey
            })
        }
    }

    /**
     * 是否自动购买系列课
     */
    isAutoPay() {
        const autopay = this.props.location.query.autopay;
        if (autopay === 'Y' &&
            this.props.channelInfo.chargeType === 'absolutely' &&
            !(this.props.chargeStatus || this.props.vipInfo && this.props.vipInfo.isVip === 'Y' || this.props.power.allowMGLive)) {
                if (Detect.os.phone) {
                    wx.ready(() => {
                        this.doAutoPay(autopay)
                    });
                } else {
                    setTimeout(() => {
                        this.doAutoPay(autopay)
                    }, 1000);
                }
        }
    }

    /**
     * 是否自动唤起支付弹窗
     */
    isOpenPayDialog(){
        // 不显示分享得券的弹窗的情况
        // 按时收费openpay=Y无效
        // 固定收费openpay=Y，对B端（创建者、管理员、嘉宾）、已报名用户、直播间VIP、定制VIP无效
        let openpay = this.props.location.query.openpay === 'Y' ? true : false
        if(this.props.channelInfo.chargeType === 'absolutely' && openpay){
            if (!(this.props.power.allowSpeak || this.props.power.allowMGLive) && !this.isBought) {
                this.setState({
                    isOpenPayDialog: true
                })
            }
        }
    }

    /* 是否满足购买条件 */
    get ableOrder(){
        /* 频道为固定收费 */
        const chargeTypeAbsolutely = this.props.channelInfo.chargeType === 'absolutely'
        const isVip = this.props.vipInfo && this.props.vipInfo.isVip === 'Y'
        /* 是否已拥有此频道 */
        const ownChannel = this.props.chargeStatus || isVip || this.props.power.allowMGLive

        return chargeTypeAbsolutely && !ownChannel
    }

    /* 检查是否需要立即购买 */
    checkOrderNow(){
        if(!this.props.orderNow||!this.ableOrder){
            return false
        } else{

            if (Detect.os.phone) {
                wx.ready(() => {
                    this.doAutoPay()
                });
            } else {
                setTimeout(() => {
                    this.doAutoPay()
                }, 1000);
            }
        }
    }

    doAutoPay(autopay) {
        let price = this.props.chargeConfigs[0].discountStatus=='Y'?
            this.props.chargeConfigs[0].discount:
            this.props.chargeConfigs[0].amount;

        let id = this.props.chargeConfigs[0].id;

        let payMoney = !this.props.channelSatus.couponId ? price :
                        (price > this.props.channelSatus.qlCouponMoney) ? (price - this.props.channelSatus.qlCouponMoney).toFixed(2) : 0;

        this.payChannel(id, payMoney);
    }

    /**
     * 打包赠礼
     */
    async onSubmitGift() {
        if (this.state.isGiftDisable) {
            return;
        }

        const curConfig = this.props.chargeConfigs[this.state.curCharge];
        let unitAmount = curConfig.discountStatus === 'Y' ? curConfig.discount : curConfig.amount;

        try {
            await this.props.doPay({
                liveId: this.props.channelInfo.liveId,
                giftCount: this.state.giftCount,
                channelNo: this.data.sourceNo,
                type: 'GIFT_CHANNEL',
                chargeConfigId: curConfig.id,
                total_fee: (unitAmount * this.state.giftCount).toFixed(2),
                shareKey: this.props.location.query.shareKey || '',
                ch: this.props.location.query.ch || this.props.location.query.wcl || '',
	            officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey: (this.props.location.query.source=="coral"? this.props.userId:""),
                callback: async (orderId) => {

                    logPayTrace({
                        id: this.data.channelId,
                        type: 'channel',
                        payType: 'GIFT_CHANNEL',
                    });

                    const result = await this.props.getGiftId(orderId);

                    if (result.state.code == 0) {
                        this.setState({
                            giftId: result.data.orderGiftId
                        });
                    }

                    this.refs.giftDialog.hide();
                    this.refs.giftTipDialog.show();
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 加减赠礼数量
     */
    onChangeCount(type) {
        if (type === 'increase') {
            if (this.checkGiftValid(Number(this.state.giftCount) + 1)) {
                this.setState({
                    giftCount: Number(this.state.giftCount) + 1,
                    isGiftDisable: false,
                });
            }
        } else if (type === 'decrease' && this.state.giftCount > 1) {
            if (this.checkGiftValid(Number(this.state.giftCount) - 1)) {
                this.setState({
                    giftCount: Number(this.state.giftCount) - 1
                });
            }
        }
    }

    /**
     * 赠礼数量输入框内容改变
     */
    onInputCount(e) {
        const event = e || event;
        if (event.target.value == 0) {
            this.setState({
                giftCount: event.target.value,
                isGiftDisable: true
            });
            return;
        }
        if (/^[0-9]*$/.test(event.target.value)) {
            if (this.checkGiftValid(event.target.value)) {
                this.setState({
                    giftCount: event.target.value,
                    isGiftDisable: false,
                });
            }
        } else {
            window.toast('请输入正确的数字');
        }

    }

    /**
     * 测试赠礼数量和价格是否合理
     */
    checkGiftValid(count) {
        const curConfig = this.props.chargeConfigs[this.state.curCharge];
        let unitAmount = curConfig.discountStatus === 'Y' ? curConfig.discount : curConfig.amount;
        if (count * unitAmount > 50000) {
            window.toast('单次付费金额最大50000元');
            return false;
        } else if (count > 999) {
            window.toast('单次购买数量最多999个');
            return false;
        } else {
            return true;
        }
    }

    /**
     * 改变赠礼选择的会员类型
     * @param {any} type increase(增加) | decrease(减少)
     *
     * @memberOf Channel
     */
    onChangeMemberType(type) {
        const max = this.props.chargeConfigs && this.props.chargeConfigs.length || 0;

        if (type === 'increase' && this.state.curCharge < max-1) {
            this.setState({
                curCharge: Number(this.state.curCharge) + 1
            });
        } else if (type === 'decrease' && this.state.curCharge > 0) {
            this.setState({
                curCharge: Number(this.state.curCharge) - 1
            });
        }

        setTimeout(() => {
            if(!this.checkGiftValid(this.state.giftCount)) {
                this.setState({
                    giftCount: 1
                });
            }
        }, 0);
    }

    //营销工具方法
    marketFunc(){
        if(this.state.isShowMarketList){
            this.setState({
                isShowMarketList:false,
            })
        }else{
            this.setState({
                isShowMarketList:true,
            })
        }
    }

    async initCourseList() {
        // 初始化课程列表
        if (this.props.courseList.length < 1) {
            let result = await this.props.fetchCourseList(
                this.data.channelId,
                this.props.channelInfo.liveId,
                this.props.coursePageNum,
                this.props.coursePageSize,
                false,
                'Y'
            );
            this.setState({
                isCourseListLoaded: true,
                courseList: result
            });
            if(this.state.newBeginTopic.startTime) {
                let str = timeAfterMixWeek(result?.data?.topic?.startTime);
                if (str === '进行中') {
                    str = '正在';
                }
                this.setState({
                    newBeginTopicTimeStr: str + "直播" + "第" + (this.state.topicCount + 1) + "节",
                })
            } else if(this.props.courseList && this.props.courseList.length != 0){
                if(this.props.channelInfo.topicCount < this.props.channelInfo.planCount) {
                    this.setState({ newBeginTopicTimeStr: "等待更新"})
                } else {
                    this.setState({ newBeginTopicTimeStr: "更新完结"})
                }
            }


	        if(!this.props.chargeStatus && (!this.props.vipInfo || (this.props.vipInfo.isVip !== 'Y' && this.props.vipInfo.isCustomVip !== 'Y')) && result.length && result.some(d => d.isAuditionOpen === 'Y')){
		        // 未购买并且有免费试听课
		        this.setState({
			        continuePlayText: "免费试听"
		        })
	        }

            // 初始数据不够分页，则结束分页加载更多
            if (result.length < this.props.coursePageSize) {
                console.log("result:", result, 'result.length:', result.length);
                console.log("this.props.coursePageSize:", this.props.coursePageSize);
                this.setState({
                    isNoMoreCourse: true,
                },() => {
                    this.messageAnchor = findDOMNode(this.refs.consultList)
                });

                if (!result.length) {
                    this.setState({
                        notShowLoaded: true,
                    });
                }
            }
        }
    }

    startGetCourse(chosenCourseTabIndex) {
        // 课程数量大于20，显示全部标签
        if(this.state.topicNumIsOk){
            if(chosenCourseTabIndex === 0){
                this.setState({
                    courseList: this.props.courseList
                })
            }else {
                this.getCourseList(chosenCourseTabIndex)
            }
        }else {
            this.getCourseList(chosenCourseTabIndex + 1)
        }
    }

    async getCourseList(index){
        const dataList = await this.props.getCourseList(
            this.data.channelId,
            this.props.channelInfo.liveId,
            index,
            this.props.coursePageSize,
        );
        this.setState({
            courseList: dataList
        });
    }

    async initConsultList() {
        if (this.props.consultList.length < 1) {
            const result = await this.props.getConsultSelected(this.data.channelId, 'channel', false)

            if (result.data.consultList) {
                this.props.setConsultList(result.data.consultList)

                setTimeout(() => {
                    this.messageAnchor = findDOMNode(this.refs.consultList)
                }, 200);
            }
        }
    }

	// 判断是否是官方直播间
	async isQlLive(){
		return new Promise(async(resolve) => {
			if(this.isQlLiveData){
				resolve(this.isQlLiveData)
				return
			}
			await request({
				url: '/api/wechat/isQlLive',
				body: { liveId: this.props.channelInfo.liveId }
			}).then(res => {
				let isQlLive = getVal(res, 'data.isQlLive', '')
				this.isQlLiveData = isQlLive
				resolve(isQlLive)
			})
		})
	}

    async initShare() {
        let wxqltitle = this.props.channelInfo.name;
        // 分享的描述语被富文本编辑过的直接写死为“点击看好课>>>”
        let descript = this.isEditorSummary ? '点击看好课>>>' : this.props.channelInfo.description;
        let wxqlimgurl = imgUrlFormat(this.props.channelInfo.headImage, '?x-oss-process=image/resize,w_100,h_100,limit_1');
        let friendstr = wxqltitle;
        //let shareUrl = window.location.origin + this.props.location.pathname + `?channelId=${this.data.channelId}`;
        wxqlimgurl = shareBgWaterMark(wxqlimgurl, 'study');

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + `?channelId=${this.data.channelId}`;
		let pre = `/wechat/page/live/${this.props.channelInfo.liveId}?isBackFromShare=Y&wcl=middlepage`;
        const shareObj = randomShareText({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            shareUrl: target,
        })

        
        if(this.props.myShareQualify&&this.props.myShareQualify.shareKey&&this.props.myShareQualify.type === 'channel'){
            shareObj.title = "我推荐-" + shareObj.title;
            shareObj.timelineTitle  = "我推荐-" + `《${wxqltitle}》`;
            shareObj.shareUrl = shareObj.shareUrl + "&shareKey=" + this.props.myShareQualify.shareKey + "&sourceNo=link";
        }else if(this.props.myShareQualify&&this.props.myShareQualify.shareKey&&this.props.myShareQualify.type === 'live'){
            shareObj.title = "我推荐-" + shareObj.title;
            shareObj.timelineTitle  = "我推荐-" + `《${wxqltitle}》`;
            shareObj.shareUrl = shareObj.shareUrl + "&lshareKey=" + this.props.myShareQualify.shareKey + "&sourceNo=link";
        } else {
            shareObj.shareUrl = shareObj.shareUrl + "&sourceNo=link";
        }

        /* 从微信活动页跳转过来的，分享过程url要去掉isFromWechatCouponPage，否则支付金额将错误*/
        shareObj.shareUrl = fillParams({}, shareObj.shareUrl, ['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']);
        /*****/
        /* 带参wcl和ch，两者保留 */
        if (this.props.location.query.ch) {
            shareObj.shareUrl = fillParams({ch: this.props.location.query.ch}, shareObj.shareUrl);
        }
        if (this.props.location.query.wcl) {
            shareObj.shareUrl = fillParams({wcl: this.props.location.query.wcl}, shareObj.shareUrl);
        }
        /*****/

		if (this.props.location.query.psKey || await this.isQlLive() === 'Y') {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
		}

        const { isSubscribe, isLiveAdmin } = this.props
        let onShareComplete = () => {

            console.log('share completed!')

            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })
        }
        if (isLiveAdmin === 'N' && !isSubscribe && this.props.isShowQl) {
            /* 分享成功的回调函数 */
            onShareComplete = this.onShareComplete.bind(this)
            // this.fetchShareQr()
        }

        

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        console.log('分享信息: ', shareObj)
        share({
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: onShareComplete,
        });
    }

	async initCoralShare() {
		let wxqltitle = '我推荐-' + this.props.channelInfo.name;
		let descript = this.props.channelInfo.description;
		let wxqlimgurl = imgUrlFormat(this.props.channelInfo.headImage, '?x-oss-process=image/resize,w_100,h_100,limit_1');
		let friendstr = wxqltitle;
		let shareUrl = window.location.origin + this.props.location.pathname + `?channelId=${this.data.channelId}&officialKey=${this.props.userInfo.userId}&pro_cl=coral`;

		share({
			title: wxqltitle,
			timelineTitle: friendstr,
			desc: descript,
			timelineDesc: friendstr, // 分享到朋友圈单独定制
			imgUrl: wxqlimgurl,
			shareUrl: shareUrl,
		});
	}

    async onShareComplete() {
        const res = await whatQrcodeShouldIGet({
			isBindThird: this.props.isBindThird,
			isFocusThree: this.props.isFocusThree,
			isRecommend: /.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page')),
			options: {
				channel: '116',
				liveId: this.props.channelInfo.liveId,
				channelId: this.data.channelId,
				subscribe: this.props.isSubscribe,
			}
		});
		if(res){
			const followDialogOption = this.state.followDialogOption
			followDialogOption.appId = res.appId
			followDialogOption.traceData =  'channelShareFocusQrcode',
			followDialogOption.channel =  '116'
			this.setState({
				qrcodeUrl: res.url,
				followDialogTitle: '分享成功',
                followDialogDesc: '关注我们，发现更多优质好课',
				followDialogOption
			}, () => {
				this.followDialogDom.show()
			})
		}
    }

    async loadMoreCourse(next) {
		if (this.state.currentTab == 'evaluate') {
			await this.loadEvaluateList(true);
		}
		if (this.state.currentTab == 'course') {
            const result = await this.props.fetchCourseList(
                this.data.channelId,
                this.props.channelInfo.liveId,
                this.props.coursePageNum + 1,
                this.props.coursePageSize,
                false,
                'Y'
            );

            this.setState({
                courseList: this.props.courseList,
            })
            // 是否没有更多
            if (result && result.length < this.props.coursePageSize) {
                console.log("result2:", result, 'result.length:', result.length);
                console.log("this.props.coursePageSize2:", this.props.coursePageSize);
                this.setState({
                    isNoMoreCourse: true,
                }, () => {
                    this.messageAnchor = findDOMNode(this.refs.consultList)
                });
            }
		}

        next && next();
    }

	get isNoMore () {
		switch (this.state.currentTab) {
			case 'course':
				return this.state.isNoMoreCourse
			case 'evaluate':
				return this.getEvaluationListObj().status === 'end'
			default:
				return true
		}
    }

    get isDisable() {
        if (this.state.currentTab == "course" && !(this.state.topicNumIsOk === true && this.state.courseShowAll === true && this.state.courseFold === false)) return true;

        if (this.state.currentTab == 'evaluate' && this.getEvaluationListObj().status === 'end') return true;
    }

    // 参与人数点击处理
    handleJoineWrapClick() {
        if (this.props.power.allowMGTopic || this.props.power.allowMGLive) {
            locationTo(`/wechat/page/join-list/channel?id=${this.data.channelId}`);
            // window.location.href = `/live/channel/memberList.htm?channelId=${this.data.channelId}`;
            return;
        }

        return;
    }

    // 打开课程设置
    handleCourseSettingOpen = (courseData) => {
        this.setState({
            isOpenCourseSettingDialog: true,
            courseSettingData: courseData,
        });
    }

    handleSingleBuyInputChange(e) {
        e = e || window.event;
        // this.setState({
        //     courseSettingData: {
        //         ...this.state.courseSettingData,
        //         money: e.target.value * 100
        //     }
        // });
        this.setState({
            singleBuyInputValue: e.target.value
        });
    }

    handleMoveOutInputChange(e) {
        e = e || window.event;
        // this.setState({
        //     courseSettingData: {
        //         ...this.state.courseSettingData,
        //         money: e.target.value * 100
        //     }
        // });
        this.setState({
            moveOutInputValue: e.target.value
        });
    }

    handleMoveOutInputClean(){
        this.setState({
            moveOutInputValue:'',
        });
    }
    handlesingleInputClean(){
        this.setState({
            singleBuyInputValue:'',
        });
    }

    async onTopicHidden(type) {
        let result = null;

        if (type == 'hide') {
            result = await this.props.hideTopic(this.state.courseSettingData.id, 'N')
        } else if (type == 'show') {
            result = await this.props.hideTopic(this.state.courseSettingData.id, 'Y')
        }
        if (result.state.code == 0) {
            window.toast('操作成功')
            let displayStatus = type == 'hide' ? 'N' : 'Y';
            this.props.onChangeTopicHidden(this.state.courseSettingData.id, displayStatus);
            this.setState({
                courseSettingData: { ...this.state.courseSettingData, displayStatus },
                courseList: this.state.courseList.map(item => {
                    return {
                        ...item,
                        displayStatus: item.id === this.state.courseSettingData.id ? displayStatus : item.displayStatus
                    };
                })
            });
        } else {
            window.toast(result.state.msg);
        }
    }

    // 处理课程设置项
    async handleCourseSettingItemClick(key, nowStatus,topicType) {
        let status = nowStatus ? 'N' : 'Y';
        let courseId = this.state.courseSettingData.id;

        switch (key) {
            case 'hide':
                await this.onTopicHidden('hide')
                this.handleCourseSettingClose();
                break;
            
            case 'show':
                await this.onTopicHidden('show')
                this.handleCourseSettingClose();
                break;

            // 免费试听
            case 'audition':
                // 提交设置
                let result = await this.props.switchFree(courseId, status, true);

                if (result && result.state && result.state.code === 0) {
                    this.props.updateCourseData(courseId, {
                        isAuditionOpen: status,
                    });

                    this.setState({
                        courseSettingData: {
                            ...this.state.courseSettingData,
                            isAuditionOpen: status,
                        },
                    });
                    let { courseList } = this.state;
                    let newCourseList = courseList.map(item => {
                        if (item.id == courseId) return {
                            ...item,
                            isAuditionOpen: status
                        }
                        return item;
                    })
                    this.setState({
                        courseList: newCourseList
                    })
                }

                break;
            case 'singleBuy':
                if (status === 'N') {
                    this.doSingleBuy();
                } else {
                    this.onSingleBuy();
                }
                break;
            // 移出课程
            case 'remove':
                if(topicType=="charge"){
                    this.onMoveOut();
                }else{
                    window.confirmDialog('确认移出该课程吗？', async () => {
                        let result = await this.props.fetchRemoveCourse(courseId, "", true);
                        console.log(getVal(result,'state.code',-1));
                        if (getVal(result,'state.code',-1) == '0') {
                            this.setState({
                                courseList: this.state.courseList.filter(item => item.id != courseId)
                            });

                        }
                    });

                }
                this.handleCourseSettingClose();
                break;
            // 课程排序
            case 'sort':
                window.location.href = `/wechat/page/channel-topic-sort/${this.data.channelId}`;
                this.handleCourseSettingClose();
                break;
            // 删除课程
            case 'delete':
                if (this.state.courseSettingData.authNum > 0) {
                    window.simpleDialog({
                        msg: '该话题已有报名记录，仅可隐藏，不可删除',
                        buttons: 'cancel',
                        onCancel: () => null
                    })

                    return;
                }
                this.refs.deleteTopicDialog.show();
                this.refs.deleteTopicDialog.onBtnClick = async (tag) => {
                    if (tag === 'confirm') {
                        await this.props.fetchDeleteCourse(courseId, true);
                        this.refs.deleteTopicDialog.hide();
                    }else{
                        this.refs.deleteTopicDialog.hide();
                    }
                }
                this.handleCourseSettingClose();
                break;
            case 'end':
                this.refs.overTopicDialog.show();
                this.refs.overTopicDialog.onBtnClick = async (tag) => {
                    if (tag === 'confirm') {
                        let res = await this.props.fetchEndCourse(courseId, true);
                        if (res.state.code == 0) {
                            let courseList = this.state.courseList.map(item => {
                                if (item.id == courseId) {
                                    item.status = "ended"
                                }
                                return item;
                            })
                            this.setState({
                                courseList
                            })
                        }
                        this.refs.overTopicDialog.hide();
                    }else{
                        this.refs.overTopicDialog.hide();
                    }
                }
                this.handleCourseSettingClose();
                break;
            case 'relay':
                if (this.state.courseSettingData.isSingleBuy != 'Y') {
                    this.refs.dialogRelay.show();
                } else {
                    window.location.href = `/relay/setup.htm?topicId=` + courseId;
                }
                break;
        }

        // this.handleCourseSettingClose();
    }

    // 关闭课程设置
    handleCourseSettingClose() {
        this.setState({
            isOpenCourseSettingDialog: false,
        });
    }

    // 购买点击打开弹窗
    handleBuyBtnClick() {
        // 判断是否已经购买了相同的系列课
        if (this.state.alreadyBuyChannelId) {
            this.refs.haveBoughtDialog.show();
            return;
        }
        //判断是否开启和关注三方服务号 未关注三方服务号且video-admin设置了引流
        if (this.props.isBindThird && !this.props.isFocusThree && this.state.shouldShowThreeQrcode) {
            this.setState({
                showThreeQrcode: true
            })
        } else {
            this.setState({
                isOpenPayDialog: true,
            });
        }
    }

    // 关闭购买弹窗
    handleClosePayDialog() {
        this.setState({
            isOpenPayDialog: false,
        });
    }

    onSelectCouponList() {
        this.setState({
            isOpenPayDialog: false,
            isOpenCouponListDialog: true,
        })
    }

    onCloseCouponList() {
        this.setState({
            isOpenCouponListDialog: false,
        })
    }

    onBackCouponList() {
        this.setState({
            isOpenCouponListDialog: false,
            isOpenPayDialog: true,
        })
    }

    onSelectedCouponItem() {
        this.setState({
            isOpenPayDialog: true,
            isOpenCouponListDialog: false,
        })

        if (this.state.couponList instanceof Array) {
            const activeCouponItem = this.state.couponList.filter(item => item.active)[0];
            this.props.updateCouponInfo(activeCouponItem.money, activeCouponItem.couponId, activeCouponItem.couponType, activeCouponItem.minMoney);
        }
    }

    async fetchCouponList() {
        let result;
        const isRelayChannel = this.props.channelInfo.isRelay === 'Y';
        if (isRelayChannel) {
            // 获取转载系列课的优惠券列表
            result = await this.props.fetchMediaCouponList({channelId: this.data.channelId});
        } else {
            result = await this.props.fetchCouponListAction('channel', this.data.channelId, this.props.channelInfo.liveId);
        }
        if (result.state.code == 0) {
            // 如果是自媒体转载系列课，过滤掉那些还没到开始日期的优惠券
            if (isRelayChannel) {
                let sysTime = this.props.sysTime || Date.now();
                result.data.couponList = result.data.couponList.filter((coupon) => {
                    return (sysTime >= (new Date(coupon.startTime)).getTime())
                });
            }
            let maxIndex = 0;
            let maxItem;
            // result.data.couponList.push({
            //     couponId: "2000000014300763",
            //     couponType: "channel",
            //     money: 4,
            //     overTime: 1509171221000
            // });

            let chargeInfo = this.getChargeInfo();

            // 区分url传参
            if (!this.data.targetCouponId) {
                this.setState({
                    couponList: result.data.couponList
                });

                setTimeout(() => {
                    this.setOptimalCoupon();
                })

            } else {
                let price = chargeInfo.discountStatus === 'Y' ? chargeInfo.discount : chargeInfo.amount;
                result.data.couponList.forEach((item, index) => {
                    // 过滤掉不符合最低价格要求的

                    if (item.minMoney && price < item.minMoney) return;
                    if (item.couponId == this.data.targetCouponId) {
                        maxItem = item;
                        maxIndex = index;
                    }
                })

                const list = result.data.couponList.map((item, index) => ({ ...item, active: index == maxIndex }))

                if (maxItem) {
                    this.props.updateCouponInfo(maxItem.money, maxItem.couponId, maxItem.couponType);
                } else {
                    this.props.updateCouponInfo('', '', '');
                }

                this.setState({
                    couponList: list
                });
            }
        }
    }

    scrollTopHandle = () => {

        if(window._qla) {_qla('click', {region: "channel",pos: "aside", type: 'to-top',})};
        this.setState({
            showCourseTabChoser: false,
            showCourseTab: false,
        })
        if(this.scrollNode) {
            this.scrollNode.scrollTop = 0
        }
    }

    // 优惠券列表点击处理，设置active
    onCoupnoItemClick(couponId) {
        const list = this.state.couponList.map(item => {
            item.active = item.couponId == couponId;
            return item;
        });

        this.setState({
            couponList: list
        });
    }

    // 展开按钮点击处理
    handleExpandBtnClick = () => {
        this.setState({
            isFoldIntro: false,
        });
    }
    // 简介收起按钮点击处理
    handleCollapseBtnClick() {
        this.setState({
            isFoldIntro: true,
        });
        setTimeout(()=>{this.tabHandle('course');},0)
    }
    // 课程收起按钮点击处理
    courseHandleCollapseBtnClick() {
        this.setState({courseFold: !this.state.courseFold});
        setTimeout(()=>{this.tabHandle('message');},0)
    }
    //新建单课
    async createNewTopic() {
        if(this.state.isPop&& !this.state.isRealName){
            this.setState({
                isShowRealName:true,
            });
        }
    }

    //关注逻辑弹框的点击关注取关方法
    dialogHandleFocusBtn(e){
        const focusMethod = this.props.location.query.focusMethod;
        if(focusMethod === 'one'&&!this.props.isLiveFocus){
            this.refs.focusOneDialog.hide();
            eventLog({
                category: 'focusLiveMethod',
                action: 'success',
                business_id: this.data.channelId,
                business_type: 'channel',
                method: 'one-btn',
            });
        }else if(focusMethod === 'two'&&this.props.isLiveFocus){
            this.refs.focusTwoDialog.hide();
            eventLog({
                category: 'focusLiveMethod',
                action: 'success',
                business_id: this.data.channelId,
                business_type: 'channel',
                method: 'two-btn',
            });
        }else if(focusMethod === 'confirm'&&this.props.isLiveFocus){
            this.refs.focusCancelDialog.hide();
            eventLog({
                category: 'focusLiveMethod',
                action: 'success',
                business_id: this.data.channelId,
                business_type: 'channel',
                method: 'confirm-btn',
            });
        }
        this.handleFocusBtnClick(e);
    }

    // 关注按钮点击
    async handleFocusBtnClick(e) {
        e.stopPropagation();
        e.preventDefault();

        const {
            isLiveAdmin,
            channelInfo,
            // 标记是否是关注事件值是true，取消的事件值是false
            isLiveFocus,
            isSubscribe,
            isBindThird,
            isFocusThree,


            updateFollowChannel,
            fetchGetQr,
        } = this.props;

        // 关注请求
        await updateFollowChannel(channelInfo.liveId, isLiveFocus);

        if (!isLiveFocus) {
            const _res = await whatQrcodeShouldIGet({
                isBindThird,
                isFocusThree,
                isRecommend: /.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page')),
                options: {
                    subscribe: isSubscribe,
                    channel: '209',
                    liveId: this.props.channelInfo.liveId,
                    channelId: this.data.channelId,
                }
            });
            if(_res){
                const followDialogOption = this.state.followDialogOption
                followDialogOption.appId = _res.appId
                followDialogOption.traceData =  'channelFocusQrcode',
                followDialogOption.channel =  '209'

                this.setState({
                    qlqrcodeUrl: _res.url,
                    followDialogTitle: '关注我们',
                    followDialogDesc: '接收开课提醒、优惠福利再也不怕漏掉精彩内容了',
                    followDialogOption
                }, () => {
                    this.followDialogDom.show()
                })
            }
        }
    }

    //实名认证的按钮点击事件
    handleRealNameBtnClick(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isShowRealName : true,
        });
    }
    closeRealName(){
        this.setState({
            isShowRealName : false,
        });
    }

    //加v的按钮点击事件
    handleVClick(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isShowVBox : true,
        });
    }
    closeVBox(){
        this.setState({
            isShowVBox : false,
        });
    }

        //加t的按钮点击事件
    handleTClick(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isShowTBox : true,
        });
    }

    closeTBox(){
        this.setState({
            isShowTBox : false,
        });
    }


        //热门的按钮点击事件
    async handleHotClick(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isShowHotBox : true,
        });
    }

    async closeHotBox(){
        this.setState({
            isShowHotBox : false,
        });
    }

        //代言人的按钮点击事件
    async handleDaiClick(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isShowDaiBox : true,
        });
    }

    async closeDaiBox(){
        this.setState({
            isShowDaiBox : false,
        });
    }

    showDoctorDialogHandle = (e) => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isShowDoctorBox : true
        })
    }

    closeDoctorDialogHandle = () => {
        this.setState({
            isShowDoctorBox : false
        })
    }

    // 是否0元系列课
    isZeroMoney() {
        // 固定收费且金额为0
        return this.props.channelInfo.chargeType === 'absolutely' &&
            this.props.chargeConfigs && this.props.chargeConfigs.length &&
            this.props.chargeConfigs[0].amount === 0;
    }

    initIntroFold() {
        // c端
        if (!this.props.liveRole) {
            // 判断是否付费
            if (this.props.chargeStatus || this.props.vipInfo && this.props.vipInfo.isVip === 'Y') {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }

    // 是否展示有效期信息
    isShowChargePeriod() {
        // 直播间vip不显示有效期
        if (this.props.vipInfo.isVip === 'Y') {
            return false;
        }

        // 已付费 且付费类型为按时收费
        if (this.props.chargeStatus && this.props.channelInfo.chargeType === 'flexible') {
            return true;
        }

        return false;
    }

    // 是否灵活按月支付
    isChargeByPeriod() {
        return this.props.channelInfo.chargeType === 'flexible';
    }

    // 是否显示优惠码按钮
    isCouponLinkShow() {
        if (this.props.channelInfo.isCouponOpen === 'Y' &&
            (this.props.chargeConfigs[0].amount > 0 && this.props.channelInfo.chargeType === 'absolutely' ||
                this.props.channelInfo.chargeType === 'flexible')) {
            return true;
        }
    }

    // 获取单节的价格
    getPerCoursePrice(chargeInfo, courseNum) {
        if (!courseNum) {
            return 0;
        }

        if (chargeInfo.discountStatus === 'Y') {
            return chargeInfo.discount / courseNum;
        }

        return chargeInfo.amount / courseNum;
    }

    // 按分类获取简介内容
    getDescByCategory(category) {
        let desc = this.props.desc;

        return desc[category] || [];
    }

    /* 打印活动日志 已过期 */
    // activityLog(type){
    //     if(this.props.orderNow){
    //         this.props.updateOrderNowStatus(false)
    //         this.props.callActivityLog(type, this.data.channelId)
    //     }
    // }

	jumpToFinishPay = () => {
		let path
		if(this.props.location.query.actId) {
			path = '/wechat/page/finish-pay?liveId=' + this.props.channelInfo.liveId +
				'&type=channel&id=' + this.data.channelId + "&actId=" + this.props.location.query.actId;
		} else {
			if(this.props.channelInfo.chargeType === 'flexible') {
				path = '/wechat/page/finish-pay?liveId=' + this.props.channelInfo.liveId +
					'&type=channel&id=' + this.data.channelId + '&flexible=Y';
			} else {
				path = '/wechat/page/finish-pay?liveId=' + this.props.channelInfo.liveId +
					'&type=channel&id=' + this.data.channelId;
			}
		}
		locationTo(path)
	}

    // 系列课支付
    payChannel(chargeConfigId, amount) {
        // 判断是否已经购买了相同的系列课
        if (this.state.alreadyBuyChannelId) {

            this.setState({
                isOpenPayDialog: false
            }, () => {
                this.refs.haveBoughtDialog.show();
            });

            return;
        }

        const that = this;

        const {
            notFilled
        } = this.state
        // 如果没填过表且不是跳过填表状态 则需要填表 表单前置
        if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
            locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelSatus.couponId || this.data.targetCouponId||''}${amount === 0?'&auth=Y':''}`);
            return;
        }

        /* 购买系列课*/
        this.props.doPay({
            liveId: this.props.channelInfo.liveId,
            chargeConfigId: chargeConfigId,
            total_fee: amount || 0,
            channelNo: this.data.sourceNo,
            type: 'CHANNEL',
            topicId: '0',
	        ch: this.props.location.query.ch || this.props.location.query.wcl || '',
            shareKey: this.props.location.query.shareKey||'',
            couponId: this.props.channelSatus.couponId || this.data.targetCouponId,
            couponType: this.props.channelSatus.couponType,
            officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey: (this.props.location.query.source=="coral"? this.props.userId:""),
            /**是否上一个页面来着微信活动页面Y=是N=不是 */
            isFromWechatCouponPage: this.props.location.query.isFromWechatCouponPage || '',
            /******/
            callback: () => {
                logPayTrace({
                    id: this.data.channelId,
                    type: 'channel',
                    payType: 'CHANNEL',
                });
                this.onSuccessPayment();
            },
            onPayFree: (result) => {
                window.toast('报名成功');

	            eventLog({
		            category: 'joinchannel',
		            action: 'success',
		            business_id: this.data.channelId,
		            business_type: 'channel',
		            business_pay_type: 'CHANNEL',
                });

                this.onSuccessPayment('Y');
            },
            onCancel: this.onCancelPayment
        });

        // if (result && result.state.msg) {
        //     if(result && result.state.code == 10001 ) {
        //         window.location.href = updateUrl(window.location.href);
        //     }
        //     window.toast(result.state.msg);
        // } else {
        //     window.toast('报名失败，请稍后重试');
        // }
    }

    onCancelPayment() {
        if ((this.props.liveLevel === 'normal' && !this.props.isBindThird) || (this.data.officialLiveIds && this.data.officialLiveIds.find(item => item == this.props.channelInfo.liveId) != undefined)) {
            // 已经关注千聊就不跳转
            if (this.props.isSubscribe) {
                return;
            }

            const randomIndex = getVal(this.props, 'userInfo.userId', '0').slice(-1) % 3;
            eventLog({
                category: 'cancelPayText',
                action: this.data.cancelPayTexts[randomIndex].channel,
            });

            locationTo(`/wechat/page/focus-ql?redirect_url=${encodeURIComponent(window.location.href)}&channel=${this.data.cancelPayTexts[randomIndex].channel}&liveId=${this.props.channelInfo.liveId}&channelId=${this.data.channelId}`);
        }
    }

	// 支付完成
	async onSuccessPayment(payFree = 'N') {
		/**
		 * 支付报名成功后引导关注千聊
		 * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
		 * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
		 * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
         * 4、珊瑚来源的支付成功后，判断是否关注珊瑚公众号，没关注则返回珊瑚公众号二维码
		 */
		try {
            let qrUrl = '';
            const tracePage = sessionStorage.getItem('trace_page');
            if(this.props.location.query.officialKey||tracePage=="coral"){
                qrUrl = await getCoralQRcode({
                    channel:'subAfterSignCoral',
                    liveId: this.props.channelInfo.liveId,
                    channelId: this.data.channelId,
                });
                if (qrUrl) {
                    qrUrl.channel = 'subAfterSignCoral'
                }
            }else{
                qrUrl = await subAterSign('subAfterSignA',this.props.channelInfo.liveId, {channelId: this.data.channelId})
                if (qrUrl) {
                    qrUrl.channel = 'subAfterSignA'
                }
            }

            const {
                notFilled
            } = this.state
            // 如果没填过表且不是跳过填表状态 则需要填表 表单后置
            if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != notFilled.id) {
                locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelSatus.couponId || this.data.targetCouponId||''}&auth=${payFree}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&qrChannel=${qrUrl.channel}` : ''}`);
            } else {
                if(qrUrl){
                    locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.channelInfo.liveId}&payFree=${payFree}&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}`)
                }else {
                    const result = await this.props.getCousePayPaster({
                        businessId: this.data.channelId,
                        type: 'channel',
                    });
    
                    if (result.state.code == 0 && result.data.link) {
                        locationTo(result.data.link);
                    } else {
                        // 跳转到完成支付页面
                        this.jumpToFinishPay()
                    }
                }
            }
		} catch (error) {
			console.error(error);
		}
    }


    async checkIsFollow(){
        const {
            isLiveAdmin,
            channelInfo,
            isLiveFocus,
            isSubscribe,
            isBindThird,
            isFocusThree,

            chargeStatus,
            vipInfo,

            updateFollowChannel,
            fetchGetQr,
        } = this.props;
        console.log("isLiveAdmin:"+isLiveAdmin);


        if (chargeStatus || (vipInfo && vipInfo.isVip === 'Y')) {
            const _result = await whatQrcodeShouldIGet({
                isBindThird: this.props.isBindThird,
                isFocusThree: this.props.isFocusThree,
                options: {
                    subscribe: this.props.isSubscribe,
                    channel: '101',
                    channelId: this.data.channelId,
                    liveId: this.props.channelInfo.liveId,
                }
            })
            if(_result){
                this.setState({
                    qrcodeUrl: _result.url,
                    focusAppId: _result.appId,
                })
                // this.showFollowQR();
            }
        }


	    if(!isSubscribe && !this.props.power.allowMGLive && isLiveAdmin === 'N'){
		    // 如果没关注千聊，获取千聊二维码
		    this.getQlQRCode();
	    }
    }

    showFollowQR(){
        this.setState({
            isShowFollowQR : true
        });
    }
    closeFollowQR(){
        this.setState({
            isShowFollowQR : false
        });
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

    // 获取企业认证信息
    async getCompany(){
		const { data = {} } = await checkEnterprise({liveId: this.props.channelInfo.liveId});
		this.setState({
			enterprisePo: data
		});
	}

    /**
     * 二维码弹框点击判断
     * @param {Event} e
     */
    onQrCodeTouch(e) {
        const event = e.nativeEvent;
        const appDom = document.querySelector('#app');
        const qrConfirm = document.querySelector('.qrcode-wrap');

        const qrHeight = qrConfirm.clientHeight;
        const qrWidth = qrConfirm.clientWidth;
        const appHeight = appDom.clientHeight;
        const appWidth = appDom.clientWidth;
        const pointX = event.changedTouches[0].clientX;
        const pointY = event.changedTouches[0].clientY;

        const top = (appHeight - qrHeight) / 2;
        const bottom = (appHeight - qrHeight) / 2 + qrHeight;
        const left = (appWidth - qrWidth) / 2;
        const right = (appWidth - qrWidth) / 2 + qrWidth;

        if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
            this.closeFollowQR();
        }
    }

    // 获取自动分销邀请码
    async getAutoShareKey(){
        let result = await this.props.channelAutoShareQualify(this.data.channelId);
        if(result&&result.state.code === 0){
            window.location.href = '/wechat/page/share-card-channel/' + this.data.channelId + '?shareKey=' + result.data.channelAutoQualify.shareKey ;
        }else if(result&&result.state){
            window.toast(result.state.msg);
        }else{
            window.toast("获取失败，请稍后再试");
        }
    }

    /* 点击咨询按钮事件*/
    onClickConsult() {
        if(window._qla) {_qla('click', {region: "channel",pos: "bottom", type: 'consult'})};

        locationTo('/wechat/page/channel-consult?channelId=' + this.data.channelId)
    }

    /*点击发起拼课*/
    onClickPin(discountStatus){
	    if(this.props.groupInfoSelf&&this.props.groupInfoSelf.channelGroupPo&&this.props.groupInfoSelf.channelGroupPo.groupStatus=="ING"){
		    const groupId=this.props.groupInfoSelf.channelGroupPo.id;
		    locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${groupId}&type=sponser`);
	    }else if(discountStatus === 'P'){
            this.refs.pinDialog.show();
        }else if(discountStatus === 'GP'){
	        this.props.doPay({
		        liveId: this.props.channelInfo.liveId,
		        chargeConfigId: this.props.chargeConfigs[0].id,
		        total_fee: this.props.chargeConfigs[0].discount,
		        channelNo: this.data.sourceNo,
		        type: 'CHANNEL',
		        payType: 'group_leader',
		        topicId: '0',
		        ch: this.props.location.query.ch || this.props.location.query.wcl || '',
		        shareKey: this.props.location.query.shareKey||'',
		        officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey: (this.props.location.query.source=="coral"? this.props.userId:""),
		        callback: async () => {

			        logPayTrace({
				        id: this.data.channelId,
				        type: 'channel',
				        payType: 'CHANNEL_GROUP_LEADER',
			        });

			        if(this.props.location.query.sourceNo === 'link'){
				        this.props.countSharePayCache(this.props.chargeConfigs[0].discount * 100);
			        }

			        let result = await this.props.getOpenPayGroupResult(this.props.channelInfo.channelId);
                    if(result.state.code === 0){
	                    locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${result.data.channelGroupPo.id}&type=sponser`);
                    }else{
                        window.toast(result.state.msg)
                    }

		        },
                onCancel: this.onCancelPayment
	        });
        }
    }

    async timeFinish(){
        var result = await this.props.getChannelGroupingList(this.data.channelId);
    }

    postTimeFinish(){
        this.setState({
            postTimeOver:true,
        });
    }

    onClosePinDialog() {
        this.refs.pinDialog.hide();
    }

    //拼课支付
    async onClickPinPay(){
        var groupId=this.props.location.query.groupId
        var chargeConfigId=this.props.chargeConfigs[0].id;
        this.props.doPay({
            liveId: this.props.channelInfo.liveId,
            chargeConfigId: chargeConfigId,
            total_fee: this.props.chargeConfigs[0].discount,
            channelNo: this.data.sourceNo,
            type: 'CHANNEL',
            topicId: '0',
	        ch: this.props.location.query.ch || this.props.location.query.wcl || '',
            shareKey: this.props.location.query.shareKey || '',
            groupId:groupId,
	        officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey: (this.props.location.query.source=="coral"? this.props.userId:""),
            callback: async () => {
                logPayTrace({
                    id: this.data.channelId,
                    type: 'channel',
                    payType: 'CHANNEL_GROUP',
                });
	            if(this.props.location.query.sourceNo === 'link') {
		            this.props.countSharePayCache(this.props.chargeConfigs[0].discount * 100);
	            }
	            this.checkGroupFunc(groupId);


            },
            onCancel: this.onCancelPayment
        });
    }

    //拼课列表支付
    async onGroupPay(groupId,amount){
        this.props.doPay({
            liveId: this.props.channelInfo.liveId,
            chargeConfigId: this.props.chargeConfigs[0].id,
            total_fee: amount,
            channelNo: this.data.sourceNo,
            type: 'CHANNEL',
            topicId: '0',
	        ch: this.props.location.query.ch || this.props.location.query.wcl || '',
            shareKey: this.props.location.query.shareKey || '',
            groupId:groupId,
	        officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey: (this.props.location.query.source=="coral"? this.props.userId:""),
            callback:async () => {
                logPayTrace({
                    id: this.data.channelId,
                    type: 'channel',
                    payType: 'CHANNEL_GROUP',
                });
	            if(this.props.location.query.sourceNo === 'link') {
		            this.props.countSharePayCache(amount * 100);
	            }

	            this.checkGroupFunc(groupId);

            },
            onCancel: this.onCancelPayment
        });
    }

    async checkGroupFunc(groupId){
        let result = await this.props.getChannelGroupResult(this.data.channelId,groupId);
        if(result.data.result=="SUCCESS"){
            window.toast("拼课成功");
            setTimeout(() => {
                locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${groupId}&type=success`);
            }, 150);
        }else if(result.data.result=="OTHERS"){
            window.toast("参团人数已满，已为您自动匹配参团");
            setTimeout(() => {
                locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${result.data.groupId}&type=success`);
            }, 150);
        }else{
            setTimeout(() => {
                window.location.reload(true);
            }, 150);
        }
    }

    //获取三方二维码
    ajaxFetchGetQr = async () => {
        const result = await this.props.fetchGetQr('selfMediaBuyChannelGuide',this.props.channelInfo.liveId,this.data.channelId,'','','N');
        if (result && result.state && result.state.code === 0) {
            this.setState({
                threeQrcode: result.data.qrUrl
            })
        }
    }

    /* 点击提交咨询按钮事件*/
    // async onConfirmConsultClick() {
    //     // 无内容过滤
    //     if (this.state.consultInfo.length <= 0) {
    //         window.toast('咨询留言不能为空');
    //         return false;
    //     }
    //     const result = await this.props.sendConsult(this.state.consultInfo, this.data.channelId, 'channel')
    //     if (result.state.code === 0) {
    //         this.setState({
    //             consultInfo: '',
    //         })
    //     }
    //     this.refs.consult.hide();
    //     window.toast('提交咨询成功')
    // }

    /* 点击立即发起拼课按钮事件*/
    async onConfirmPinClick() {

            const result = await this.props.channelCreateGroup(this.data.channelId)
            if (result.state.code === 0) {
                logGroupTrace({
                    id: this.data.channelId,
                    type: 'channel',
                });
                window.toast('发起拼课成功')
                const result = await this.props.getChannelGroupSelf(this.data.channelId)
                const groupId=result.data&&result.data.channelGroupPo&&result.data.channelGroupPo.id;
                locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${groupId}&type=sponser`);
            }else{
                window.toast(result.state.msg)
            }
            this.refs.consult.hide();

    }

    onConsultPraiseClick(id, like) {
        if (like === 'Y') {
            window.toast('您已经点过赞')
            return
        }
        this.props.consultPraise(id)
    }

    onShowConsultPop(){
        document.querySelector('.scroll-box').style.overflowY = 'hidden';
        this.setState({consultPop: true})
    }

    onHideConsultPop(){
        document.querySelector('.scroll-box').style.overflowY = 'auto';
        this.setState({consultPop: false})
    }

    onCloseGiftDialog() {
        this.refs.giftDialog.hide();
    }

    openGiftDialog() {
        this.refs.giftDialog.show();
    }

    openGiftTipDialog() {
        this.refs.giftTipDialog.show();
    }

    onCloseGiftTipDialog() {
        this.refs.giftTipDialog.hide();
    }



    closeIncrFansQrcodeDialog() {
        this.setState({
            isShowIncrFansQrcodeDialog: false
        });
    }

    openIncrFansQrcodeDialog() {
        this.setState({
            isShowIncrFansQrcodeDialog: true
        });
    }

    onShareCardClick() {
        locationTo(`/wechat/page/sharecard?type=channel&channelId=${this.data.channelId}&liveId=${this.props.channelInfo.liveId}&sourceNo=${this.props.location.query.sourceNo||'link'}`);
    }

    // 获取千聊二维码
    async getQlQRCode(){
        const result = await whatQrcodeShouldIGet({
            isBindThird: this.props.isBindThird,
            isFocusThree: this.props.isFocusThree,
            options: {
                subscribe: this.props.isSubscribe,
                channel: 'serintro',
                channelId: this.data.channelId,
                liveId: this.props.channelInfo.liveId,
            }
        })

	    // if (result.state && result.state.code == '0') {
		//     this.setState({
		// 	    qlQRCode: qrcode
		//     });
	    // }
        if(result){
		    this.setState({
                qlQRCode: result.url,
                qlQRAppId: result.appId,
			    showQlQRCode: true
		    })
        }
    }

    // 活动订制券的领取弹窗
    async showCustomCouponDialog() {
        if(this.props.location && this.props.location.query && this.props.location.query.activityCodeId && !this.props.power.allowMGLive && !this.props.power.allowSpeak) {
            const exist = await this.props.activityCodeExist(this.data.channelId, this.props.location.query.activityCodeId)
            if(exist && exist.data && exist.data.existsCode === 0) {
                const result  = await this.props.getPromotion(this.props.location.query.activityCodeId);
                if(result.state.code === 0){
                    this.setState({
                        couponMoney: result.data.promotionDto.money/100,
                        startDate: formatDate(result.data.promotionDto.startDate).replace(/-/g,'.'),
                        endDate: result.data.promotionDto.endDate ?
                            formatDate(result.data.promotionDto.endDate, '有效期至MM月dd日') :
                            `领取后${result.data.promotionDto.useDay}天内使用`,
                        couponDialogShow: true,
                    })
                }
            }
        }
    }

    async collectHandle() {
        if(this.state.isCollected) {
            const result = await this.props.cancelCollect({
                type: "channel",
                businessId: this.data.channelId
            })
            if(result) {
                window.toast('取消收藏', 1000, 'unlike')
                this.setState({isCollected: false})
            }
        } else {
            this.whatQrcodeShouldIShow();
            const result = await this.props.addCollect({
                type: "channel",
                businessId: this.data.channelId
            })
            if(result) {
                window.toast('添加收藏', 1000, 'unlike')
                this.setState({isCollected: true})
            }
        }
        if(window._qla) {_qla('click', {region: "channel",pos: "bottom", type: this.state.isCollected ? 'add-collect' : 'cancel-collect',})};
    }

    /**
     *
     */
    async whatQrcodeShouldIShow() {
        let {
            isLiveAdmin,
            channelInfo,
            // 标记是否是关注事件值是true，取消的事件值是false
            isLiveFocus,
            isSubscribe,
            isBindThird,
            isFocusThree,

            fetchGetQr,
        } = this.props;

        console.log(`
            是否已经关注了直播间  ${isLiveFocus}
            是否是专业版  ${isLiveAdmin}
            是否关注千聊  ${isSubscribe}
            是否绑定三方  ${isBindThird}
            是否关注三方  ${isFocusThree}
            直播间类型    ${this.props.liveLevel}
        `);

        // 非sass，排除官方直播间
        if (this.props.liveLevel === 'normal' || (this.data.officialLiveIds && this.data.officialLiveIds.find(item => item == this.props.channelInfo.liveId) != undefined)) {
            if (/.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page'))) {
                if(!isSubscribe) {
                    this.fetchAndShowIncrFansQrcode({ channelInfo, isShowQl: 'Y' });
                }
            } else {
                if (!isFocusThree) {
                    if (isBindThird) {
                        this.fetchAndShowIncrFansQrcode({ channelInfo, isShowQl: 'N' });
                    } else if (!isSubscribe) {
                        this.fetchAndShowIncrFansQrcode({ channelInfo, isShowQl: 'Y' });
                    }
                } else {
                    if (!isSubscribe) {
                        this.fetchAndShowIncrFansQrcode({ channelInfo, isShowQl: 'Y' });
                    }
                }
            }
        }
    }

    // 获取并显示二维码
    async fetchAndShowIncrFansQrcode({ channelInfo, isShowQl }) {
        var result = await this.props.fetchGetQr("collectChannel", channelInfo.liveId, this.data.channelId, "", "", isShowQl);
        if (result.state && result.state.code == '0') {
            this.qrcodeType = isShowQl === 'Y' ? 'qianliao' : 'sanfang';
            eventLog({
                category: 'collectChannel',
                action: this.qrcodeType,
                business_id: this.props.channelInfo.liveId,
            })

            this.setState({
                incrFansQrcodeUrl: result.data.qrUrl
            })
            this.openIncrFansQrcodeDialog();
        }
    }


    async fetchCoupon(){
        const codeId = await this.props.activityCodeBind(this.data.channelId, this.props.location.query.activityCodeId)
        this.setState({couponDialogShow: false});
        if(codeId && codeId.data && codeId.data.code) {
            setTimeout(function() {
                window.location.href = updateUrl(window.location.href)
            }, 300)
        }
    }

    closeCouponPop(){
        this.setState({couponDialogShow: false})

        if (this.props.location.query) {

        }
    }

    initContinuePlayButton = () => {

        if(this.props.chargeStatus || this.props.vipInfo && this.props.vipInfo.isVip === 'Y') {

            let channelHistoy = JSON.parse(window.localStorage.getItem("channel_topic_history")) || []
            let getTopicId = false
            if(channelHistoy.length > 0) {
                channelHistoy.map((item) => {
                    if(item.cid == this.data.channelId) {
                        getTopicId = true
                        this.setState({
                            lastViewdTopicId: item.tid
                        })
                    }
                })
            }

            if (getTopicId) {
                // 拿到了这条系列课的历史听课信息
                this.setState({
                    continuePlayText: "继续听课"
                })
            } else {
                // 没拿到这条系列课的历史听课信息 跳第一个课
                this.setState({
                    continuePlayText: "开始听课"
                })
            }
        } else {
            // 未购买
            this.setState({
                continuePlayText: "报名听课"
            })
        }
    }

    continuePlayClick = () => {
        // 取首个有效状态的价格配置信息
        let chargeInfo = this.props.chargeConfigs.filter((item) => {
            if (item.status === 'Y') {
                return true;
            }
            return false;
        });
        chargeInfo = chargeInfo.length && chargeInfo[0] || {};

        let channelHistoy = JSON.parse(window.localStorage.getItem("channel_topic_history")) || []
        let lastTopicId = false
        if(channelHistoy.length > 0) {
            channelHistoy.map((item) => {
                if(item.cid == this.data.channelId) {
                    lastTopicId = item.tid
                }
            })
        }

        if( !this.state.isCourseListLoaded
            || (this.props.courseList && this.props.courseList.length == 0)
            && (this.props.chargeStatus || this.props.vipInfo.isVip == "Y")
        ) {
            console.log("即将开课");
            window.toast("系列课暂无课程")
            return
        }

        if(this.props.chargeStatus || this.props.vipInfo && (this.props.vipInfo.isVip === 'Y' || this.props.vipInfo.isCustomVip === 'Y')) {
            // 已购买

            // 拿到了这条系列课的历史听课信息
            if(lastTopicId || this.state.lastViewdTopicId){
                locationTo(`/topic/details?topicId=${lastTopicId || this.state.lastViewdTopicId}`)
            } else {
                // 跳第一个课
                if(this.props.courseList && this.props.courseList[0] && this.props.courseList[0].id) {
                    locationTo(`/topic/details?topicId=${this.props.courseList[0].id}`)
                } else {
                    window.toast("系列课暂无课程")
                    return
                }
            }
        } else {
            // 未购买
            if(chargeInfo.amount == 0) {
                console.log("免费课直接报名");
                // 免费课 直接报名
                this.payChannel(chargeInfo.id)
            } else {
                if(this.state.continuePlayText === '免费试听'){
                    const urls = this.state.courseList.map(c => (c.isAuditionOpen === 'Y' ? `/topic/details?topicId=${c.id}` : false));
                    locationTo(urls[0])
                }
                // 收费课  复杂的收费逻辑
                // 如果已经购买过相同的系列课，弹出提示信息,否则走正常的收费流程
                else if (this.state.alreadyBuyChannelId) {
                    this.refs.haveBoughtDialog.show();
                } else {
                    this.refs.buyChannelDialog.show();
                }
            }
        }
    }

    hideBuyChannelDialog = () => {
        // 如果是单节付费的话题，打开这个弹窗的时候，显示弹窗的时候会在data中塞入数据
        setTimeout(() => {
            this.setState({
                buyChannelDialogTopicItem: null
            })
        }, 200);
        this.refs.buyChannelDialog.hide()
    }

    async backIndexFunc(){
        eventLog({
            category: 'backLiveIndex',
            action:'success',
            business_id: this.data.channelId,
            business_type: 'channel',
        });
        setTimeout(() => {
            locationTo('/wechat/page/live/' + this.props.channelInfo.liveId);
        },150);
    }

    courseListItemClick = (e, item) => {
        if (this.props.power.allowMGLive) {
            if(e.target.className == "topic-play-con" || e.target.className == "icon-play") {
                locationTo(`/topic/details?topicId=${item.id}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}`)
            } else {
                locationTo(`/wechat/page/topic-intro?topicId=${item.id}${this.props.location.query.shareKey ? "&shareKey=" + this.props.location.query.shareKey : ""}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}` )
            }
        } else {
            locationTo(`/topic/details?topicId=${item.id}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}`)
        }
    }
    /**
     * 判断是否白名单并跳转话题
     *
     * @param {any} id
     * @memberof Channel
     */
    async isAuthTopic(id) {
        let result = await this.props.getAuth(id);
        if (getVal(result, 'data.isAuth', false)) {
            locationTo(`/topic/details?topicId=${id}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}`)
        }

    }

    /**
     * 获取当前系列课价格信息
     */
    getChargeInfo() {
        let chargeConfigs = this.props.chargeConfigs;

        if (!chargeConfigs) return {};
        return chargeConfigs[this.state.activeChargeIndex] || {};
    }

    /**
     * 改变价格配置，改变后自动匹配最优优惠券
     */
    changeChargeIndex(index) {
        this.setState({
            activeChargeIndex: index
        })

        setTimeout(() => {
            this.setOptimalCoupon();
        })
    }

    /**
     * 设置当前价格配置的最优优惠券
     */
    setOptimalCoupon() {
        let couponList = this.state.couponList;
        if (!(couponList instanceof Array)) return;
        let optimalCoupon = null;
        const isRelayChannel = this.props.channelInfo.isRelay === 'Y';
        if (isRelayChannel) {
            // 转载系列课默认使用金额最大的优惠券，后端接口返回的优惠券列表第一张金额最大
            optimalCoupon = couponList[0];
        } else {
            // 从小到大排序
            couponList = [...couponList].sort((l, r) => {
                return l.money <= r.money ? -1  : 1;
            });

            let chargeInfo = this.getChargeInfo(),
                curPrice = chargeInfo.discountStatus === 'Y' ? chargeInfo.discount : chargeInfo.amount;

            for (let i in couponList) {
                let coupon = couponList[i];
                if (coupon.minMoney && coupon.minMoney > curPrice) continue; // 过滤最低使用价格
                if (coupon.money >= curPrice) {
                    // 选出第一张大于等于当前价格的
                    optimalCoupon = coupon;
                    break;
                }
                optimalCoupon = coupon;
            }
        }

        if (optimalCoupon) {
            // 设置active
            this.onCoupnoItemClick(optimalCoupon.couponId);

            // 选定优惠券之后的各个价格变动
            setTimeout(() => {
                this.props.updateCouponInfo(optimalCoupon.money, optimalCoupon.couponId, optimalCoupon.couponType, optimalCoupon.minMoney);
            })
        } else {
            // 清空不符合的优惠券
            this.props.updateCouponInfo('', '', '','');
        }
    }


    /*--- 自媒体版转载系列课优惠券 ---*/
    openMediaCouponDialog = () => {
        this.setState({
            isShowMediaCouponDialog: true
        });
    }

    closeMediaCouponDialog = () => {
        this.setState({
            isShowMediaCouponDialog: false
        });
    }

    receiveMediaCoupon = async () => {
        const {mediaCoupon} = this.state;
        const result = await this.props.receiveMediaCoupon({codeId: mediaCoupon.id});
        if (result.state.code === 0) {
            window.toast('领取成功');
            // 如果已经到达优惠券的开始日期，则刷新优惠券数据
            if (Date.now() >= (new Date(mediaCoupon.startTime)).getTime()) {
                this.fetchCouponList();
            }
        } else {
            window.toast(result.state.msg);
        }
        // 关闭弹窗
        this.closeMediaCouponDialog();
    }

    courseTabClickHandle = (item) => {
        for(let i = 0; i < this.state.courseTabList.length; i++ ) {
            if(this.state.courseTabList[i] == item) {
                this.setState({
                    currentCourseTab: i,
                    showCourseTabChoser: false,
                    showCourseTab: false,
                    courseShowAll: i === 0,
                })
                this.tabHandle("course")
                this.startGetCourse(i)
            }
        }
    }

    toLiveHandle = () => {
        if(window._qla) {_qla('click', {region: "channel",pos: "bottom", type: 'live'})};

        locationTo(`/wechat/page/live/${this.props.channelInfo.liveId}${this.props.location.query.auditStatus ? "?auditStatus=" + this.props.location.query.auditStatus : ""}`)
    }

    initMediaCouponInfo = async () => {
        const { liveRole,
                channelInfo,
                vipInfo,
                chargeStatus,
                location,
                fetchMediaCouponDetail,
                fetchIsReceivedCoupon,
            } = this.props;

        // 优惠券只针对访问转载系列课的C端非VIP用户且未购买的用户
        if (!liveRole && channelInfo.isRelay === 'Y' && vipInfo.isVip === 'N' && !chargeStatus) {
            const couponCode = location.query.couponCode;
            // 链接中必须带有优惠券id参数
            if (couponCode !== undefined) {
                const result = await fetchMediaCouponDetail({codeId: couponCode});
                if (result.state.code === 0) {
                    const coupon = result.data.relayChannelCouponDto;
                    // 存在这张优惠券
                    if (coupon) {
                        // 优惠码未启用
                        if (coupon.status === 'N') {
                            // window.toast('该优惠券还未启用~');
                            return;
                        }
                        // 优惠券已被领完
                        if (coupon.bindNum >= coupon.codeNum) {
                            // window.toast('该优惠券已被领完啦~');
                            return;
                        }
                        // 优惠券已经过期
                        const endTime = coupon.endTime;
                        if (endTime) {
                            const endTimeDate = new Date(endTime);
                            if (Date.now() > endTimeDate.getTime()) {
                                // window.toast('该优惠券已经过期啦~');
                                return;
                            }
                        }
                        // 已经领取过该优惠券
                        const receiveStatResult = await fetchIsReceivedCoupon({codeId: couponCode});
                        if (receiveStatResult.state.code === 0) {
                            if (receiveStatResult.data.flag) {
                                // window.toast('您已经领过该优惠券，不能重复领取哦~');
                                return;
                            }
                        } else {
                            // 请求失败
                            console.error(receiveStatResult.state.msg);
                        }
                        // 符合条件，开始弹窗让用户领取优惠券
                        this.setState({
                            mediaCoupon: {...coupon}
                        });
                        this.openMediaCouponDialog();
                    } else {
                        // 该优惠券不存在或者已经被删除
                        // window.toast('该优惠券不存在或已被删除~');
                    }
                } else {
                    window.toast(result.state.msg);
                }
            }
        }

    }

    closeShareGetCouponActivity(){
        this.setState({
            isShowShareGetCouponActivity:false,
        });
    }

    /*--- 自媒体版转载系列课优惠券 ---*/
	async showCoralPromoDialog(){

		if(this.state.coralPushData.businessId){
			this.setState({
				showCoralPromoDialog: true
			});
		}else{
			// 取首个有效状态的价格配置信息
			let chargeInfo = this.props.chargeConfigs.filter((item) => {
				return item.status === 'Y';
			});
			chargeInfo = chargeInfo.length ? chargeInfo[0] : {};
			this.setState({
				showCoralPromoDialog: true,
				coralPushData: {
					businessId: this.props.channelInfo.channelId,
					businessName: this.props.channelInfo.name,
					businessType: 'CHANNEL',
					liveName: this.props.channelInfo.liveName,
					businessImage: this.props.channelInfo.headImage,
					amount: formatMoney((chargeInfo.discountStatus && chargeInfo.discountStatus !=="N" ? chargeInfo.discount : chargeInfo.amount), 0.01),
					percent: this.props.coralPercent
				}
			});
		}
		this.initCoralShare();
	}
	switchCoralPromotionPanelNav(type){
		this.setState({
			coralPromotionPanelNav: type
		})
	}
	onCoralPromoDialogClose(e){
		this.setState({
			showCoralPromoDialog: false
		});
		// if(!this.state.showShareCoralBtn){
		//     // 如果不是只有珊瑚计划，就设回默认分享状态
			// this.initShare();
        // }
    }


	uncertainShareBtnClickHandle(){
		if(this.data.coralShareSheetList){
			this.actionSheet.show(this.data.coralShareSheetList);
			return;
		}

		// 取首个有效状态的价格配置信息
		let chargeInfo = this.props.chargeConfigs.filter((item) => {
		    return item.status === 'Y';
		});
		chargeInfo = chargeInfo.length ? chargeInfo[0] : {};
		const price = chargeInfo.discountStatus !== 'N' ? chargeInfo.discount : chargeInfo.amount;
		this.data.coralShareSheetList = [
			{
				name: '使用珊瑚计划分享赚',
				strong: `${formatMoney(price * this.props.coralPercent)}元`,
				action: _ => {
					this.showCoralPromoDialog();
					this.initCoralShare();
                }
			},
			{
				name: '使用课代表分享赚',
				strong: `${formatMoney(price * this.distributionShareEarningPercent)}元`,
				action: _ => this.onShareCardClick()
			}
		];

		this.actionSheet.show(this.data.coralShareSheetList);
    }

    handleButtonPress() {
        this.buttonPressTimer = setTimeout(() => {
            eventLog({
                category: 'longPressQrcode',
                action: this.qrcodeType,
                business_id: this.props.channelInfo.liveId,
            })
        }, 1500);
    }

    handleButtonRelease() {
        clearTimeout(this.buttonPressTimer);
    }

    /**
     * 点击“查看购买记录”
     */
    viewBoughtRecords(){
        const haveFollowedQl = this.props.isSubscribe;
        // 已经关注了千聊公众号，直接跳转至购买记录页面，否则弹出千聊公众号的二维码
        if (haveFollowedQl) {
            locationTo('/live/entity/myPurchaseRecord.htm');
        } else {
            this.refs.haveBoughtDialog.hide();
            // this.setState({
            //     isShowQlQrcodeDialog: true,
            // });
			this.setState({
                followDialogTitle: '关注我们',
                followDialogDesc: '接收开课提醒、优惠福利再也不怕漏掉精彩内容了',
			}, () => {
				this.followDialogDom.show()
			})
        }
    }

    /**判断文案显示支持回听还是包月回听,还是为空 */
    ifShowPermanentPlayback(){
        if (!this.isFreeChannel && this.props.vipInfo.isVip == 'Y' && Number(this.props.vipInfo.expiryTime) > new Date().getTime() && this.props.channelInfo.isRelay) {
            return '';
        }
        if (this.props.channelInfo.chargeType === 'flexible') {
            return 'month'
        }
        return 'permanent'
    }

    /** 是否可以领取优惠券，未付费和按月直播间、非转播、非管理员可以领取 */
    get isCanReceiveCoupon() {
        return (!this.props.chargeStatus || (this.props.chargeStatus && this.props.channelInfo.chargeType === 'flexible')) && this.props.channelInfo.isRelay != 'Y'&&!this.props.power.allowMGLive
    }

    /** 介绍中的优惠券点击领取 */
    onReceiveClick(codePo) {
        if (this.isCanReceiveCoupon) {
            this.setState({
                codeId: codePo.id,
                couponCode: '',
                isAutoReceive: false,
            }, () => {
                this.couponDialogDom.onIntroReceiveClick();
            });
        }
    }

    onGotoSet(){
        locationTo(`/wechat/page/coupon-code/list/channel/${this.data.channelId}`);
    }

    getEditorSummary = async () => {
        let result = await this.props.getEditorSummary(this.data.channelId, 'channel');
        if (result.state.code == 0) {
            this.isEditorSummary = true
            this.setState({
                channelDesc: result.data.content
            })
        }
    }

	replyHandle (index, target) {
		this.refs['reply-input'].focus();
		// setTimeout(() => {
		// 	findDOMNode(this.refs['reply-input-box']).scrollIntoView();
		// 	document.body.scrollTop = 700;
		// 	window.scrollTop = 700;
        // },1000);
		setTimeout(() => {
			this.scrollReplyTargetIntoView(target);
		}, 300);
		this.setState({
			currentRelyIndex: index,
			replyContent: '',
			replyPlaceholder: `回复：${this.getEvaluationListObj().data[index].userName}`,
			showReplyInput: true
		}, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        });
    }

	scrollReplyTargetIntoView(target){
		// 滑到容器最底部
		if(!target) return false;
		const boundingBottomDiff = this.scrollNode.getBoundingClientRect().bottom - target.getBoundingClientRect().bottom - this.refs['reply-input-box'].clientHeight;
		this.scrollNode.scrollTop = this.scrollNode.scrollTop - boundingBottomDiff;
	}

    async removeReplyHandle (index) {
        const evaluationItem = this.getEvaluationListObj().data[index];
        const res = await this.props.removeReply({evaluateId: evaluationItem.id})
        if (res.state.code == 0) {
            this.updateEvaluationList(evaluationItem.id, {
                replyContent: '',
                replyType: 'N',
            });
            this.setState({})
        } else {
			window.toast(res.state.msg);
        }
    }

	changeReplyContent(e){
		if(e.currentTarget.value.length > 500) return false;
		this.setState({
			replyContent: e.currentTarget.value
		});
	}

	async sendReplyHandle () {
		if(this.state.replyContent){
            const evaluationItem = this.getEvaluationListObj().data[this.state.currentRelyIndex];
			const res = await this.props.reply({
				evaluateId: evaluationItem.id,
				replyContent: this.state.replyContent
            });
            if (res.state.code == 0) {
                this.updateEvaluationList(evaluationItem.id, {
                    replyContent: this.state.replyContent,
                    replyType: 'Y',
                });

                this.setState({
                    replyContent: '',
                    showReplyInput: false
                });
            } else {
                window.toast(res.state.msg);
            }
		}else{
			window.toast('请输入回复内容！');
		}
    }

    // 蛋疼的需求耦合，此处要更新两个评论列表
    updateEvaluationList = (id, obj) => {
        const updateList = list => {
            list && list.some && list.some(item => {
                if (item.id == id) {
                    Object.assign(item, obj)
                    return true;
                }
            })
        }
        updateList(this.props.evaluation.evaluationList.data);
        updateList(this.props.evaluation.evaluationListValid.data);
    }

    ajaxGetCourseOptimizeNum = async () => {
        let result = await apiService.post({
            url: '/h5/dataStat/getCourseOptimizeNum',
            body: {
                businessId: this.data.channelId,
                businessType: 'channel'
            }
        })
        if (result.state.code == 0) {
            this.setState({
                courseOptimizeNum: result.data.num
            })
        }
    }

    async dispatchGetCommunity(isCamp) {
        const res = await getCommunity(this.props.channelInfo.liveId, 'channel', this.data.channelId.toString());
        if(res) {
            this.setState({
                communityInfo: res
            })
            this.getGroupShow();
        }
    }

    // 判断是否显示社群入口
    getGroupShow() {
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                let communityRecord = JSON.parse(communityList).includes(`${this.props.channelInfo.liveId}_${this.data.channelId}`);
                console.log(communityRecord);
                if(!communityRecord){
                    this.setState({
                        groupHasBeenClosed: false       
                    })
                } 
            } catch (error) {
                console.log(error);
            }
        };
    }

    onGroupEntranceClose() {
        this.setState({
            groupHasBeenClosed: true
        });
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                communityList = JSON.parse(communityList);
                let hasRecord = communityList.includes(`${this.props.channelInfo.liveId}_${this.data.channelId}`);
                if(hasRecord === false) {
                    communityList.push(`${this.props.channelInfo.liveId}_${this.data.channelId}`);
                }
                window.sessionStorage.setItem('SHOW_COMMUNITY_LIST_INTRO', JSON.stringify(communityList));
            } catch (error) {
                console.log('ERR',error);
            }
        };
    }

    render = () => {
        // console.log(this.props.evaluationIsOpen);
        let { channelInfo, chargeConfigs, power, evaluationData } = this.props;
        let curConfig = chargeConfigs[this.state.curCharge] || {};

        // 取首个有效状态的价格配置信息
        let chargeInfo = this.getChargeInfo();

        // 计算每个课程的价格
        let perCourseMount = this.getPerCoursePrice(chargeInfo, channelInfo.planCount || channelInfo.topicCount);

        // 简介信息处理
        let descInfo = this.getDescByCategory('desc');
        let lectuerInfo = this.getDescByCategory('lectuerInfo');
        let fitPeopleInfo = this.getDescByCategory('suitable');
        let willGetInfo = this.getDescByCategory('gain');
        let videoInfo = this.getDescByCategory('videoDesc');

        let distributionInfo = this.props.channelAutoDistributionInfo.data || {};
        let shareSysInfo=this.props.shareSysInfo||{};

        let rate = 100
        if(evaluationData.score != 0) {
            rate = evaluationData.score * 20
        }


        // 过滤不可用coupon
        let avaliableCouponList = [];
        let price = chargeInfo.discountStatus =='Y' ? chargeInfo.discount : chargeInfo.amount;
        this.state.couponList && this.state.couponList.forEach(coupon => {
            if (coupon.minMoney && price < coupon.minMoney) return;
            avaliableCouponList.push(coupon);
        });

        let isTabbarShow = this.state.tabStick ? 'btn-lower-offset' : '';

        let evaluateNumStr = this.props.evaluationData.evaluateNumStr;
        evaluateNumStr == 0 && (evaluateNumStr = '');

        const { campInfo } = this.state;

        let coursePriceBox = typeof document != "undefined" ? document.querySelector('.course-price-box'):null;
        return (
            <Page 
				title={this.state.htmlTitle || channelInfo.name}
				description={this.state.htmlDescription || ''}
				keyword={this.state.htmlKeywords || ''}
                className='channel-container' 
                banpv={true}
                >
                <div className={`channel-container-content`}>
                <TopOptimizeBar businessId={this.data.channelId} businessType="channel" num={this.state.courseOptimizeNum}/>

                <div className="scroll-wrap" ref="scrollWrap" >
                {
                    (!/(course|message)/.test(this.state.currentTab) && this.state.showUncertainShareBtn) &&
                    <div className={"share-tag uncertain on-log " + isTabbarShow}
                         onClick={this.uncertainShareBtnClickHandle}
                         data-log-name="生成邀请卡"
                         data-log-region="share-tag"
                         data-log-pos="uncertain"
                         data-log-status={this.isBought ? 'bought' : ''}
                    >
                        分享赚
                        {/* 生成邀请卡 */}
                    </div>
                }
                {
                    this.state.showKnowledgeTip ?
                        <div className="knowledge-wrap" style={{
                            position: "absolute",
                            zIndex: 100,
                            right: 0
                        }}>
                            <ShortKnowledgeTip borC="B"/>
                        </div> : null
                }

                {
                    (!/(course|message)/.test(this.state.currentTab) && this.state.showShareToEarnBtn) &&
                        <div className={"share-tag share-to-earn on-log " + isTabbarShow}
                             onClick={ () => {this.onShareCardClick()} }
                             data-log-name="生成邀请卡"
                             data-log-region="share-tag"
                             data-log-pos="share-to-earn"
                             data-log-status={this.isBought ? 'bought' : ''}
                        >
                            <div className="final-tag"></div>
                                <div className="tip">
                                赚{
                                    this.isDistribution ?
                                    (chargeInfo.discount ? (this.distributionShareEarningPercent / 100 * chargeInfo.discount).toFixed(2) : (this.distributionShareEarningPercent / 100 * chargeInfo.amount).toFixed(2))
                                    :
                                    (
                                        this.props.coralPercent ?
                                            (chargeInfo.discount ? (this.props.coralPercent / 100 * chargeInfo.discount).toFixed(2) : (this.props.coralPercent / 100 * chargeInfo.amount).toFixed(2))
                                            :
                                            (chargeInfo.discount ? (distributionInfo.autoSharePercent / 100 * chargeInfo.discount).toFixed(2) : (distributionInfo.autoSharePercent / 100 * chargeInfo.amount).toFixed(2))
                                            // (distributionInfo.autoSharePercent / 100 * perCourseMount >= 0.01 ? formatMoney(Number(distributionInfo.autoSharePercent * perCourseMount)) : 0)
                                    )
                                }元
                                {/* 生成邀请卡 */}
                            </div>
                        </div>
                }
                {
                    (!/(course|message)/.test(this.state.currentTab) && this.state.showShareCoralBtn) &&
                        <div className={"share-tag coral-share on-log " + isTabbarShow}
                             onClick={ () => {this.showCoralPromoDialog()} }
                             data-log-name="生成邀请卡"
                             data-log-region="share-tag"
                             data-log-pos="coral-share"
                             data-log-status={this.isBought ? 'bought' : ''}
                        >
                            分享 | 赚{chargeInfo.discountStatus&&chargeInfo.discountStatus!="N"?(this.props.coralPercent / 100 * chargeInfo.discount).toFixed(2):(this.props.coralPercent / 100 * chargeInfo.amount).toFixed(2)}元
                            {/* 生成邀请卡 */}
                        </div>
                }
                {
                    (!/(course|message)/.test(this.state.currentTab) && this.state.showMyInvitationCardBtn) &&
                        <div className={"share-tag my-invitation-card on-log " + isTabbarShow}
                             onClick={ () => {this.onShareCardClick()} }
                             data-log-name="生成邀请卡"
                             data-log-region="share-tag"
                             data-log-pos="my-invitation-card"
                             data-log-status={this.isBought ? 'bought' : ''}
                        >
                            <div className="final-tag"></div>
                        </div>
                }
                <ScrollToLoad
                    ref="scrollBox"
                    className={`scroll-box ${this.state.showCourseTabChoser ? "disableScroll" : ""}`}
                    toBottomHeight={1000}
                    notShowLoaded={true}
                    loadNext={this.loadMoreCourse.bind(this)}
                    noMore={this.isNoMore}
                    disable={this.isDisable}
                    footer={(<ComplainFooter channelId={this.data.channelId} pageUrl={this.state.pageUrl} liveId={this.props.channelInfo.liveId}/>)}
                >

                    {/* 页面头图块内容 耦合太多页面逻辑，不适合抽出 */}
                    <div className='channel-header'>
                        {/* 背景图*/}
                        <div className="head-icon-wrap">
                            <img className="head-icon" src={`${imgUrlFormat(channelInfo.headImage, '@750w_469h_1e_1c_2o')}`}/>
                            {
                                !this.props.liveRole ?
                                    <div className="continue-play-con">
                                        <div className="continue-play on-log"
                                            onClick={() => {this.continuePlayClick()}}
                                            data-log-region="banner-continue-play"
                                             data-log-status={this.isBought ? 'bought' : ''}
                                            data-log-ispay={this.props.chargeStatus ? "Y" : "N"}
                                            data-log-isfirstplay={this.state.lastViewdTopicId? "N" : "Y"}
                                            data-log-isstart={
                                                this.state.isCourseListLoaded
                                                && this.props.courseList
                                                && this.props.courseList.length > 0
                                                && this.props.courseList[0].startTime < this.props.common.sysTime ?
                                                "Y" : "N"
                                            }
                                        >
                                            <div className="continue-play-icon"></div>
                                            {
                                                <div className="play-desc">
                                                    {
                                                        this.state.isCourseListLoaded
                                                            && this.props.courseList
                                                            && this.props.courseList.length > 0
                                                            && this.props.courseList[0].startTime < this.props.common.sysTime
                                                            || (!this.props.chargeStatus && this.props.vipInfo.isVip == "N") ?
                                                            this.state.continuePlayText
                                                            : "即将开课"
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                : null
                            }
                        </div>
                        <div className="header-bg" />
                        <div className="head-bottom-box">
                            <div className="channel-count">
                                <div className="joined-wrap" onClick={this.handleJoineWrapClick}>
                                    <div className="pics">
                                        {
                                            this.props.payUserHeadImages.slice(0, 3).map((item, index) => {
                                                if (item.headImgUrl) {
                                                    return (
                                                        <div key={`joined-pics${index}`} className="pic" style={{
                                                            backgroundImage: `url(${imgUrlFormat(item.headImgUrl, '@42w_42h_1e_1c_2o')})`,
                                                            left: '-' + (index * 10) + "px"
                                                        }}
                                                        />
                                                    );
                                                }
                                                return null;
                                            })
                                        }
                                    </div>
                                    <div className="num-tip">
                                        <span className='people-logo'></span>
                                        <span className="num">{this.props.payUserCount}次</span>
                                        <span className="tip">学习</span>
                                    </div>
                                </div>

                            </div>
                            {this.state.showCutTimer&&this.props.marketsetInfo.discountStatus ==='K'&&this.props.marketsetInfo.startTime <= this.props.common.sysTime &&this.props.marketsetInfo.endTime > this.props.common.sysTime&&<div className="overTimeTip">
                                距活动结束
                                <Timer typeStyle ='timer-style-day'
                                    durationtime={this.props.marketsetInfo.endTime - this.props.common.sysTime }
                                    onFinish={this.cutTimerFinish}
                                    notSecond = {true}
                                />
                            </div>}
                        </div>

                    </div>

                    <SpecialsCountDown
                            channelId={this.data.channelId}
                            isY={ this.props.marketsetInfo && this.props.marketsetInfo.discountStatus === 'Y'}
                        >
                            <Fragment>
                                {
                                    coursePriceBox ?
                                    createPortal(
                                        <Fragment>
                                            {
                                            this.state.isChargeByPeriod ?
                                            <div className="price-wrap">
                                                <div className="price">￥{formatMoney(chargeInfo.amount, 1)} <span className="month">/ {chargeInfo.chargeMonths}月</span></div>
                                            </div>
                                            :
                                            chargeInfo.discountStatus === 'UNLOCK' ?
	                                            (
		                                            <div className="price-wrap">
			                                            {chargeInfo.amount ?
				                                            <div className="price">￥{formatMoney(chargeInfo.discount, 1)}</div>
				                                            :
				                                            <div className="price">免费</div>
			                                            }
		                                            </div>
	                                            )
	                                            :
	                                            ( chargeInfo.discountStatus === 'P' || chargeInfo.discountStatus === 'GP'||(chargeInfo.discountStatus == "K"&&this.state.showCutTimer&&this.props.marketsetInfo.startTime <= this.props.common.sysTime &&this.props.marketsetInfo.endTime > this.props.common.sysTime)) ?
	                                                <div className="price-wrap">
	                                                    {
	                                                        chargeInfo.discountStatus == "P" || chargeInfo.discountStatus === 'GP' ?
	                                                        <div className="group-tag group-price"><span>拼课价</span></div>
	                                                        :
	                                                        (
	                                                            chargeInfo.discountStatus == "K"?
	                                                            <div className="group-tag group-price"><span>限时砍价</span></div>
	                                                            :
	                                                            null
	                                                        )
	
	                                                    }
	                                                    <div className="price">{chargeInfo.discount<=0?'免费':'￥'+formatMoney(chargeInfo.discount, 1)}</div>
	                                                    {chargeInfo.discountStatus == "P" || chargeInfo.discountStatus === 'GP' ? <div className="group-tag to-group">{chargeInfo.groupNum}人成团</div> : ""}
	                                                    <div className="old-price">￥{formatMoney(chargeInfo.amount, 1)}</div>
	                                                </div>
	                                                :
	                                                <div className="price-wrap">
	                                                    {chargeInfo.amount ?
	                                                        <div className="price">￥{formatMoney(chargeInfo.amount, 1)}</div>
	                                                        :
	                                                        <div className="price">免费</div>
	                                                    }
	                                                </div>
                                            }
                                        </Fragment>
                                        ,
                                        coursePriceBox
                                    )
                                    :null

                                }
                            </Fragment>
                        </SpecialsCountDown>

                    {
                        this.props.chargeStatus && !power.allowMGLive ?
                            <div className="channel-info flex-con">
                                <div className="left">
                                    <div className='title'>
                                    {
                                        channelInfo.flag ? <span className="girl-college">{channelInfo.flag}</span> : null
                                    }{channelInfo.name}</div>
                                    <div className="topic-count">
                                        {this.state.newBeginTopicTimeStr}
                                        {
                                            this.props.channelInfo.planCount ?
                                                <span>  |  共{
                                                    // this.props.channelInfo.planCount > this.state.topicCount ? this.props.channelInfo.planCount : this.state.topicCount
                                                    (this.state.newBeginTopic.startTime && this.state.topicCount >= this.props.channelInfo.planCount) ? this.state.topicCount + 1 : this.props.channelInfo.planCount
                                                }节课</span>
                                                : null
                                        }
                                    </div>
                                    {
                                        this.state.isShowChargePeriod ?
                                            <div className="valid-period-wrap">
                                                <div className="period">有效期：{formatDate(this.props.chargeStatus.expiryTime, 'yyyy-MM-dd')}</div>
                                                <div className="recharge-btn" onClick={this.handleBuyBtnClick}>续费</div>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                                {
                                    (!power.allowMGLive && !!chargeConfigs && chargeConfigs.length > 0 && chargeConfigs[0].amount > 0) ?
                                        <div className="right-con">
                                            <div className="gift-con on-log"
                                                 onClick={this.openGiftDialog}
                                                 data-log-name="赠好友"
                                                 data-log-region="gift-con"
                                            >
                                                <div className="icon_gift_logo"></div>
                                                <div className="gift-text">赠好友</div>
                                            </div>
                                        </div>
                                        : null
                                }
                            </div>
                            :
                            <div className="channel-info">
                                <div className='title'>
                                    {   channelInfo.flag ?
                                        <span className="girl-college">{channelInfo.flag}</span> : null}
                                    {channelInfo.isRelay === 'Y' && this.props.liveRole ? <span className="is-relay">转载</span> : null}
                                    {this.isCamp && <span>训练营</span>}
							        {`${this.isCamp ? (`【${campInfo.periodPo.name}】`) : ''}${channelInfo.name}`}
                                </div>
                                <div className="flex-con">
                                    <div className="left">
                                        <div className="topic-count">
                                            {this.state.newBeginTopicTimeStr}
                                            {
                                                this.props.channelInfo.planCount ?
                                                    <span>  |  共{
                                                    // this.props.channelInfo.planCount > this.state.topicCount ? this.props.channelInfo.planCount : this.state.topicCount
                                                    (this.state.newBeginTopic.startTime && this.state.topicCount >= this.props.channelInfo.planCount) ? this.state.topicCount + 1 : this.props.channelInfo.planCount
                                                }节课</span>
                                                    : null
                                            }
                                        </div>

                                        {/* portal的传送层，勿删！！！ */}
                                        <div className="course-price-box"></div>
                                        {
                                            this.isCamp &&
                                            <TrainingCampEnd
                                                startTime={formatDate(campInfo.periodPo.startTime, 'yyyy-MM-dd')}
                                                endTime={formatDate(campInfo.periodPo.signupEndTime, 'yyyy-MM-dd')} />
                                        }

                                        {
                                            (chargeInfo.discountStatus === 'P' || chargeInfo.discountStatus === 'GP') &&
                                            <div className="group-tip">
                                                {
                                                    shareSysInfo && distributionInfo.isOpenShare === 'Y' &&
                                                    (
	                                                    this.isDistribution ?
                                                            <div className="commission">邀请拼课佣金：<span>赚￥{chargeInfo.discount ? (this.distributionShareEarningPercent / 100 * chargeInfo.discount).toFixed(2) : (this.props.distributionShareEarningPercent / 100 * chargeInfo.amount).toFixed(2)}</span></div>
                                                            :
                                                            (
	                                                            this.props.coralPercent ?
                                                                    <div className="commission">邀请拼课佣金：<span>赚￥{chargeInfo.discount ? (this.props.coralPercent / 100 * chargeInfo.discount).toFixed(2) : (this.props.coralPercent / 100 * chargeInfo.amount).toFixed(2)}</span></div>
		                                                            :
                                                                    <div className="commission">邀请拼课佣金：<span>赚￥{distributionInfo.autoSharePercent / 100 * chargeInfo.discount >= 0.01 ? formatMoney(Number(distributionInfo.autoSharePercent * chargeInfo.discount)) : 0}</span></div>
                                                            )
                                                    )
                                                }
                                            </div>
                                        }
                                    </div>
                                    {
                                        (!power.allowMGLive && !!chargeConfigs && chargeConfigs.length > 0 && chargeConfigs[0].amount > 0) ?
                                            <div className="right-con">
                                                <div className="gift-con on-log"
                                                     onClick={this.openGiftDialog}
                                                     data-log-name="赠好友"
                                                     data-log-region="gift-con"
                                                >
                                                    <div className="icon_gift_logo"></div>
                                                    <div className="gift-text">赠好友</div>
                                                </div>
                                            </div>
                                        : null
                                    }

                                </div>
                            </div>
                        }



                    {
                        !this.props.liveRole &&
                        <div className='evalue-info icon_enter on-log'
                             onClick={() => { this.setState({ shwoChannelTipsDialog: true }) }}
                             data-log-name="打开服务说明"
                             data-log-region="evalue-info"
                             data-log-status={this.isBought ? 'bought' : ''}
                        >
                            {
                                this.ifShowPermanentPlayback() && <span className='check-before'>{this.ifShowPermanentPlayback() === 'month' ? '支持回听' : '支持回听'}</span>
                            }
                            {
                                this.isCouponLinkShow() && <span className='coupon-before'>支持优惠</span>
                            }
                            {
                                (!this.isFreeChannel && this.props.channelInfo.isRelay == 'Y') ? <span className='vip-unuse'>会员不可用</span> : this.props.vipInfo.isOpenVip == "Y" && <span className='vip-before'>会员免费听</span>
                            }
                        </div>
                    }

                    {/* 评价框 */}
                    {
                        // evaluationData && evaluationData.evaluateNum > 0 && this.props.evaluationIsOpen == 'Y' && !this.isFreeChannel && <ChannelEvalueBar
                        //     channelId={this.data.channelId}
                        //     evaluation={evaluationData}
                        // />
                    }

                    {/*分销排行榜*/}
                    {
                        this.props.channelInfo.isOpenShareRank === 'Y' &&
                        <PromoRank
                            channelId={this.data.channelId}
                        />
                    }

                    {/* c端：直播间信息 */}
                    {!this.props.liveRole || this.props.liveRole ?
                        !this.props.liveRole ?
                            <div className="live-info fx-mg">
                                <a href={`/wechat/page/live/${this.props.channelInfo.liveId}${this.props.location.query.auditStatus ? "?auditStatus=" + this.props.location.query.auditStatus : ""}`}
                                   className="on-log"
                                   data-log-name="进入直播间"
                                   data-log-region="live-info"
                                   data-log-status={this.isBought ? 'bought' : ''}
                                >
                                    <div className="live-info-wrap">
                                        <div className="live-desc">
                                            <div className="live-icon" style={{
                                                backgroundImage: `url(${imgUrlFormat(channelInfo.liveHeadImageUrl, '@62w_62h_1e_1c_2o')})`,
                                            }}
                                            />
                                            <div className='title'>{channelInfo.liveName}</div>
                                            <SymbolList className="symbol-list"
                                                isCompany={this.state.enterprisePo.status == 'Y'}
                                                symbolList={[...this.state.symbolList]}
                                                isReal={this.state.checkUserStatus == 'pass'}
                                                isLiveCreator={this.props.liveRole == 'creater'}
                                                isallowGLive={this.props.power.allowMGLive}
                                                handleRealNameBtnClick={this.handleRealNameBtnClick}
                                                showPyramidDialog={this.showPyramidDialog}
                                                handleVClick={this.handleVClick}
                                                handleTClick={this.handleTClick}
                                                handleDoctorBtnClick={this.showDoctorDialogHandle}
                                                handleHotClick={this.handleHotClick}
                                                handleDaiClick={this.handleDaiClick}
                                            />
                                        </div>

                                        {this.props.isLiveFocus ?

                                            <div onClick={this.handleFocusBtnClick} className="follow-btn followed">
                                                <div className="btn-text">取消关注</div>
                                            </div>
                                            :

                                        <div onClick={this.handleFocusBtnClick}
                                             className="follow-btn on-log"
                                             data-log-name="关注"
                                             data-log-region="follow-btn"
                                             data-log-status={this.isBought ? 'bought' : ''}
                                        >
                                            <div className="add-icon" />
                                            <div className="btn-text">关注</div>
                                        </div>

                                        }
                                    </div>
                                </a>
                            </div>
                            :
                            <div className="live-info">
                                <a href={`/wechat/page/live/${this.props.channelInfo.liveId}${this.props.location.query.auditStatus ? "?auditStatus=" + this.props.location.query.auditStatus : ""}`}
                                   className="on-log"
                                   data-log-name="进入直播间"
                                   data-log-region="live-info"
                                   data-log-status={this.isBought ? 'bought' : ''}
                                >
                                    <div className="live-info-wrap icon_enter">
                                        <div className="live-desc">
                                            <div className="live-icon" style={{
                                                backgroundImage: `url(${imgUrlFormat(channelInfo.liveHeadImageUrl, '@62w_62h_1e_1c_2o')})`,
                                            }}
                                            />
                                            <div className='title'>{channelInfo.liveName}</div>
                                            <SymbolList
                                                isCompany={this.state.isCompany}
                                                symbolList={[...this.state.symbolList]}
                                                isReal={this.state.checkUserStatus == 'pass'}
                                                isallowGLive={this.props.power.allowMGLive}
                                                isLiveCreator={this.props.liveRole == 'creater'}
                                                handleRealNameBtnClick={this.handleRealNameBtnClick}
                                                showPyramidDialog={this.showPyramidDialog}
                                                handleVClick={this.handleVClick}
                                                handleDoctorBtnClick={this.showDoctorDialogHandle}
                                                handleTClick={this.handleTClick}
                                                handleHotClick={this.handleHotClick}
                                                handleDaiClick={this.handleDaiClick}
                                            />
                                        </div>
                                        <span className="link-icon icon_enter" />
                                    </div>
                                </a>
                            </div>
                        : null
                    }

                    {/* 拼课 */}
                    {
                        (chargeInfo.discountStatus=="P" || chargeInfo.discountStatus === 'GP') &&
                        (this.props.power.allowMGLive||
                            (!this.props.chargeStatus &&!(this.props.vipInfo && this.props.vipInfo.isVip === 'Y'))
                        ) && this.state.showGroupingInfo
                            ?
                                (
                                    // 管理员 创建者不用看到详细的拼课
                                    !this.props.liveRole && this.props.location.query.groupId ?
                                        <GroupPost
                                            groupInfo={this.props.groupInfo&&this.props.groupInfo.channelGroupPo}
                                            currentTime={this.props.groupInfo&&this.props.groupInfo.currentServerTime}
                                            endTime={this.props.groupInfo&&this.props.groupInfo.endTime}
                                            groupId={this.props.location.query.groupId}
                                            isTimeOver={this.state.postTimeOver}
                                            leaderName={this.props.groupInfo.channelGroupPo.leaderName}
                                            timeFinish={this.postTimeFinish.bind(this)}/>
                                    :
                                    <GroupingList
                                        groupingListItem={this.props.groupinglist&&this.props.groupinglist.groupList?this.props.groupinglist.groupList:[]}
                                        groupPayFunc={this.onGroupPay.bind(this)}
                                        discountMoney={chargeInfo.discount}
                                        currentTime={this.props.groupinglist&&this.props.groupinglist.currentServerTime}
                                        client={this.props.liveRole ? 'B' : 'C'}
                                        timeFinish={this.timeFinish.bind(this)}
                                        liveRole={this.props.liveRole}
                                        channelId={this.data.channelId}
                                        liveId={this.props.channelInfo.liveId}
                                        creatorId={this.props.groupInfoSelf&&this.props.groupInfoSelf.channelGroupPo&&this.props.groupInfoSelf.channelGroupPo.userId}
                                    />
                                )
                            :
                        null
                    }



                    {/*切换课程的tab */}
                    {
                        <div className={`p-intro-tab`} ref={dom => this.tabDom = dom}>
                            <div
                                className={`tab-item on-log${this.state.currentTab == "intro" ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "intro")}
                                data-log-name="简介"
                                data-log-region="tab-item"
                                data-log-pos="intro"
                                data-log-status={this.isBought ? 'bought' : ''}
                                >{this.isCamp ? '训练营介绍' : '课程介绍'}</div>
                            <div
                                className={`tab-item on-log${this.state.currentTab == "course" ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "course")}
                                data-log-name="课程"
                                data-log-region="tab-item"
                                data-log-pos="course"
                                data-log-status={this.isBought ? 'bought' : ''}
                                >{this.isCamp ? '课程目录' : '听课列表'}</div>
                            <div
                                className={`tab-item on-log${this.state.currentTab == "evaluate" ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "evaluate")}
                                data-log-name="用户评价"
                                data-log-region="tab-item"
                                data-log-pos="evaluate"
                                data-log-status={this.isBought ? 'bought' : ''}
                                >用户评价<span className="eval-num">{evaluateNumStr}</span></div>
                        </div>
                    }
                    {/* 会多出来的按个tab */}
                    {
                        this.state.tabStick && <div className={`p-intro-tab stick`}>
                            <div
                                className={`tab-item on-log${ (this.state.currentTab == "intro") ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "intro")}
                                data-log-name="简介"
                                data-log-region="tab-item"
                                data-log-pos="intro"
                                data-log-status={this.isBought ? 'bought' : ''}
                            >{this.isCamp ? '训练营介绍' : '课程介绍'}</div>
                            <div
                                className={`tab-item on-log${ (this.state.currentTab == "course") ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "course")}
                                data-log-name="课程"
                                data-log-region="tab-item"
                                data-log-pos="course"
                                data-log-status={this.isBought ? 'bought' : ''}
                            >{this.isCamp ? '课程目录' : '听课列表'}</div>
                            <div
                                className={`tab-item on-log${this.state.currentTab == "evaluate" ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "evaluate")}
                                data-log-name="用户评价"
                                data-log-region="tab-item"
                                data-log-pos="evaluate"
                                data-log-status={this.isBought ? 'bought' : ''}
                            >用户评价<span className="eval-num">{evaluateNumStr}</span></div>
                        </div>
                    }
                    {/* 定位到课程的时候还会再多出一个tab */}
                    {
                        this.props.channelInfo.topicNum > 20 && (this.state.showCourseTab || this.state.showCourseTabChoser) && <div className={`course-tab`}>
                            <div className="tab-head">课程</div>
                            <div className="chose"
                                onClick={() => {
                                    this.setState({showCourseTabChoser: !this.state.showCourseTabChoser})
                                }}
                            >
                                {this.state.courseTabList[this.state.currentCourseTab]}
                            <span className={`${this.state.showCourseTabChoser ? "icon-up" : "icon-down"}`}></span></div>
                        </div>
                    }
                    {
                        (this.state.showCourseTabChoser && this.props.channelInfo.topicNum > 20) && <div className="course-tab-choser-bg" onClick={() => {this.setState({showCourseTabChoser: false})}}>
                            <div className="course-tab-choser" onClick={(e) => {e.stopPropagation(); e.preventDefault()}}>
                                {this.state.courseTabList.map((item) => (
                                    <div
                                        className={`course-tab-item${this.state.courseTabList[this.state.currentCourseTab] == item ? " active" : "" }`}
                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); this.courseTabClickHandle(item)}}
                                    >{item}</div>
                                ))}
                            </div>
                        </div>
                    }

                    <div className="introAnchor" ref={dom => this.introAnchor = dom}>

						{/* 课程介绍 */}
						{
                            this.state.currentTab === "intro" && (
                                <div className="intro">
                                    {
                                        <div className={`intro${this.state.isFoldIntro? " fold" : ""}`}>
                                        {/* 拉人返学费介绍 */}
                                        { this.state.showBackTuitionLabel &&
                                            <BackTuitionLabel
                                                inviteReturnConfig = {this.state.inviteReturnConfig}
                                                fromB = {true}
                                            />
                                        }
                                        {/*优惠码标签*/}
                                        <CouponInDetail
                                            businessType={ 'channel' }
                                            businessId={ this.data.channelId }
                                            onReceiveClick={ this.onReceiveClick }
                                            onGotoSet = {this.onGotoSet}
                                        />

                                            {!this.state.channelDesc && videoInfo.length ?
                                                <div className="video-info intro-block">
                                                    <div className="head">
                                                        {/* <div className="icon video-icon" /> */}
                                                        <div>视频简介</div>
                                                    </div>
                                                    <div className="content video-wrap">
                                                        {videoInfo.map((item, index) => {
                                                            switch (item.type) {
                                                                case 'video':
                                                                    return (
                                                                        this.state.showVideoIframe ? (
                                                                            /(\.mp4)$/.test(item.content) ?
                                                                             <video className='video-mp4'  src={item.content}  controls/>
                                                                            :
                                                                            <div className="iframe-wrap" key={`iframe-wrap-${index}`}>
                                                                                <div className="bd-tp"></div>
                                                                                <div className="bd-rt"></div>
                                                                                <div className="bd-bt"></div>
                                                                                <div className="bd-lt"></div>
                                                                                <iframe is frameBorder="0" width="100%" height="100%" id="imIf" name="imIf" src={getVieoSrcFromIframe(item.content.replace(/(http:\/\/)/, '//'))} allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" />
                                                                            </div>
                                                                        ): (
                                                                            <div className="iframe-tip"></div>
                                                                        )
                                                                    );
                                                            }
                                                        })}
                                                    </div>
                                                    <div className="video-tip">建议在wifi环境下播放</div>
                                                </div>
                                            : null
                                            }
                                            {
                                                this.state.channelDesc ?
                                                <div className={`desc intro-block ${videoInfo.length > 0 ? '' : 'top-no-video'}`}>
                                                    <div className="head">
                                                        <div>简介</div>
                                                    </div>
                                                    <XiumiEditorH5 content={this.state.channelDesc} />
                                                </div>
                                                :
                                                descInfo.length ?
                                                <div className={`desc intro-block ${videoInfo.length > 0 ? '' : 'top-no-video'}`}>
                                                    <div className="head">
                                                        <div>简介</div>
                                                    </div>
                                                    <div className="content">
                                                        {descInfo.map((item, index) => {
                                                            switch (item.type) {
                                                                case 'image':
                                                                    return <img className='desc-image'
                                                                        onLoad={this.onImageLoaded}
                                                                        key={`desc-item-${index}`}
                                                                        src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                                                case 'text':
                                                                    return <p key={`desc-item-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                                : this.props.power.allowMGLive
                                                    ? <div className="desc intro-block">
                                                        <div className="head">
                                                            <div>简介</div>
                                                        </div>
                                                        <EmptyPage mini />
                                                    </div>
                                                    : null
                                            }
                                            {!this.state.channelDesc && lectuerInfo.length ?

                                                <div className="about-lectuer intro-block">
                                                    <div className="head">
                                                        {/* <div className="icon lectuer-icon" /> */}
                                                        <div>关于讲师</div>
                                                    </div>
                                                    <div className="content">
                                                        {lectuerInfo.map((item, index) => {
                                                            switch (item.type) {
                                                                case 'image':
                                                                    return <img className='desc-image'
                                                                        onLoad={this.onImageLoaded}
                                                                        key={`desc-item-t-${index}`}
                                                                        src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                                                case 'text':
                                                                    return <p key={`desc-item-t-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            :  null
                                            }
                                            {!this.state.channelDesc && fitPeopleInfo.length ?

                                                <div className="fit-people intro-block">
                                                    <div className="head">
                                                        {/* <div className="icon fit-icon" /> */}
                                                        <div>适合人群</div>
                                                    </div>
                                                    <div className="content">
                                                        {fitPeopleInfo.map((item, index) => {
                                                            switch (item.type) {
                                                                case 'image':
                                                                    return <img className='desc-image'
                                                                                onLoad={this.onImageLoaded}
                                                                                key={`desc-item-p-${index}`}
                                                                                src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                                                case 'text':
                                                                    return <p key={`desc-item-p-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            : null
                                            }
                                            {!this.state.channelDesc && willGetInfo.length ?

                                                <div className="will-get intro-block">
                                                    <div className="head">
                                                        {/* <div className="icon will-get-icon" /> */}
                                                        <div>你将获得</div>
                                                    </div>
                                                    <div className="content">
                                                        {willGetInfo.map((item, index) => {
                                                            switch (item.type) {
                                                                case 'image':
                                                                    return <img ref='descImage' className='desc-image'
                                                                                onLoad={this.onImageLoaded}
                                                                                key={`desc-item-g-${index}`}
                                                                                src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                                                case 'text':
                                                                    return <p key={`desc-item-g-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            : null
                                            }

                                            <div style={{background: "#fff"}}>
                                                <IntroGroupBar
                                                    padding="0 0.533333rem 0"
                                                    communityInfo={this.state.communityInfo} 
                                                    hasBeenClosed={this.state.groupHasBeenClosed}
                                                    allowMGLive={this.props.power.allowMGLive}
                                                    onClose={this.onGroupEntranceClose}
                                                    onModal={() => {this.setState({isShowGroupDialog: true})}}
                                                />      
                                            </div>
                    

                                            {this.isFreeChannel ? null : (
                                                <div className="note intro-block">
                                                    <div className="head">
                                                        {/* <div className="icon note-icon"></div> */}
                                                        <div>购买须知</div>
                                                    </div>
                                                    <div className="content">
                                                        {
                                                            this.props.channelInfo.purchaseNotes ?
                                                                <p dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(this.props.channelInfo.purchaseNotes))} />
                                                            :
                                                                <p>
                                                                    1. 该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时学习，也可反复回听 <br/>
                                                                    {
                                                                        this.props.isLiveAdmin === 'Y' ? '2. 购买课程后关注我们的服务号，可在菜单里进入听课' : '2. 购买课程后关注千聊公众号，可在菜单【已购买课程】里进入听课'
                                                                    }<br />
                                                                    3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅 <br/>
                                                                    4. 该课程听课权益跟随支付购买微信账号ID，不支持更换（赠礼课程除外）<br/>
                                                                    5. 如有其它疑问，可点击左下角“咨询”按钮，与内容供应商沟通后再购买 <br/>
                                                                </p>
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            {/* 训练营详情 */}
									        {this.isCamp && <CampDetail periodPo={campInfo.periodPo || {}} planCount={this.props.channelInfo.planCount} isNewCamp={this.state.joinCampInfo.isNewCamp}/>}

                                            {
                                                this.state.isFoldIntro ?
                                                    <div
                                                        className='intro-unfold on-log'
                                                        onClick={this.handleExpandBtnClick}
                                                        data-log-name="展开内容"
                                                        data-log-region="channel-intro"
                                                        data-log-type="unfold-intro-info"
                                                    >
                                                        <div className="jianbian"></div>
                                                        <div className="white-block">展开内容 <span className='icon_down'></span></div>
                                                    </div>
                                                :
                                                    <div className='intro-fold' onClick={this.handleCollapseBtnClick}>
                                                        <div className="fold-text">收起内容 <span className='icon_up'></span></div>
                                                    </div>
                                            }
                                        </div>
                                    }


                                    {
                                        this.state.showQlQRCode &&
                                        <div className='ql-qrcode'>
                                            <span className="btn-close icon_cross" onClick={() => this.setState({showQlQRCode: false})}></span>
                                            <div className="tip-container">
                                                <div className="title">购课后，如何学习课程？</div>
                                                <div className="tip">关注我们的公众号，从底部菜单进入，即可随时听课</div>
                                                <div className="btn">长按识别二维码 ></div>
                                            </div>
                                            <div className="img-container">
                                                <QRImg
                                                    src = {this.state.qlQRCode}
                                                    traceData = "channelQrcode"
                                                    channel = "serintro"
                                                    appId = {this.state.qlQRAppId}
                                                    className="qrcode"
                                                />
                                            </div>
                                        </div>
                                    }

                                    {
                                        !!this.props.consultList.length &&
                                        <ConsultList
                                            consultList={this.props.consultList}
                                            onConsultPraiseClick={this.onConsultPraiseClick}
                                            onShowConsultPop={this.onShowConsultPop}
                                            sysTime={this.props.sysTime}
                                            ref="consultList"
                                        />
                                    }
                                </div>
                            )
                        }

						{/* 课程列表 */}
						{
							this.state.currentTab === "course" && (
								<div className="course">
                                     <div className={`course-list-wrap intro-block ${this.state.topicNumIsOk && (this.state.courseShowAll ? (this.state.courseFold ? 'fold' : 'unfold') : '')}`} ref="courseAnchor">
                                        <div className="course-head">
                                            {/* <div className="icon note-icon" /> */}
                                            <span>课程</span>

                                            {
                                                this.props.channelInfo.topicNum > 20 && <div className="chose"
                                                    onClick={() => {
                                                        this.tabHandle('course')
                                                        this.setState({ showCourseTabChoser: !this.state.showCourseTabChoser })
                                                    }}
                                                >
                                                    {this.state.courseTabList[this.state.currentCourseTab]}
                                                    <span className={`${this.state.showCourseTabChoser ? "icon-up" : "icon-down"}`}></span>
                                                </div>
                                            }
                                        </div>

                                        <ul className="course-list">
                                            {
                                                this.props.courseList.length ? this.state.courseList.map((item, index) =>
                                                    <div
                                                        className="course on-log"
                                                        data-log-name="channel-course-item"
                                                        data-log-region="channel-course-item"
                                                        data-log-pos={index}
                                                        data-log-status={this.isBought ? 'bought' : ''}
                                                        key={`course-item-${index}`}
                                                        onClick={(e) => {this.courseListItemClick.call(this, e, item)}}

                                                    >
                                                        <div className="course-img-con">
                                                            <div className="course-img">
                                                                <img src={`${imgUrlFormat(item.backgroundUrl, '@148h_240w_1e_1c_2o')}`} />
                                                                {
                                                                    item.displayStatus == 'N' &&
                                                                    <span className="show-hide-icon icon_hidden" />
                                                                }
                                                                {
                                                                    item.style == 'video' ?
                                                                        <span className='topic-style-tag video-tag'></span> :
                                                                    item.style == 'audio' ?
                                                                        <span className='topic-style-tag audio-tag'></span> :
                                                                    item.style == 'audioGraphic' ?
                                                                        <span className='topic-style-tag audio-graphic-tag'></span> :
                                                                    item.style == 'videoGraphic' ?
                                                                        <span className='topic-style-tag video-graphic-tag'></span> :
                                                                    null
                                                                }
                                                                {
                                                                    this.props.liveRole
                                                                    || (
                                                                        this.props.chargeStatus
                                                                        || item.isAuditionOpen === 'Y'
                                                                        || (this.props.vipInfo && this.props.vipInfo.isVip === 'Y')
                                                                    ) ?
                                                                        <div className="topic-play-con">
                                                                            <span className="icon-play"></span>
                                                                        </div>
                                                                    :
                                                                        ""
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="course-detail">
                                                            <div className="title">
                                                                <div className="text-con">{item.topic}</div>
                                                                {
                                                                    this.props.channelInfo.isRelay !== 'Y' && this.props.liveRole && <div className="admin-con" onClick={(e) => { e.stopPropagation(); e.preventDefault(); this.handleCourseSettingOpen(item); return false; }}><span className="admin"></span></div>
                                                                }
                                                            </div>
                                                            <div className="second-con">
                                                                <span className="begin-date"> {formatDate(item.startTimeStamp, 'MM月dd日 hh:mm')}</span>
                                                            </div>
                                                            <div className="third-con">
                                                                <div className="status-info">
                                                                    {
                                                                        (
                                                                            item.status === 'beginning' &&
                                                                            !/^(audioGraphic|videoGraphic)$/.test(item.style) &&
                                                                            this.props.common.sysTime - item.startTimeStamp < 7200000
                                                                        ) ?


                                                                        isBeginning(item.startTimeStamp, this.props.common.sysTime) ?

                                                                                <div className="beginning">
                                                                                    <div className="beginning-icon" />
                                                                                    <div>进行中</div>
                                                                                </div>
                                                                            :
                                                                                <div className="after-date">
                                                                                    <div className="time-icon" />
                                                                                    <div className="time-text">{timeAfter(item.startTimeStamp, this.props.common.sysTime)}</div>
                                                                                </div>


                                                                        : null

                                                                    }
                                                                    <span className="joined-num">{digitFormat(item.browseNum || 0)}次学习 </span>
                                                                {
                                                                        item.isAuditionOpen === 'Y' ?
                                                                        <div className="try-listen">试听</div>
                                                                        :item.isSingleBuy === 'Y' ?
                                                                            <div className="course-money">￥{formatMoney(item.money)}</div>
                                                                        :null
                                                                }

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : this.state.isCourseListLoaded ?
                                                        <div className="no-course">
                                                            {
                                                                this.props.liveRole ?
                                                                    <EmptyPage mini imgKey="noCourse" emptyMessage="您还没有开课哦，马上开讲吧" />
                                                                :
                                                                        <div className="tip">第一节课即将开讲，敬请期待</div>

                                                            }
                                                        </div> : null

                                            }
                                        </ul>
                                        {
                                            this.state.topicNumIsOk && (
                                                this.state.courseShowAll ?
                                                (this.state.courseFold ?
                                                <div className='course-fold on-log'
                                                    onClick={()=>{this.setState({courseFold: !this.state.courseFold})}}
                                                    data-log-name="展开课程"
                                                    data-log-region="course-fold"
                                                    data-log-status={this.isBought ? 'bought' : ''}
                                                >
                                                    <div className="jianbian"></div>
                                                    <div className="white-block">展开内容 <span className='icon_down'></span></div>
                                                </div>
                                                :
                                                <div className='course-unfold' onClick={this.courseHandleCollapseBtnClick}>
                                                    收起内容 <span className='icon_up'></span>
                                                </div>)
                                                : null
                                            )
                                        }
                                    </div>
								</div>
							)
                        }

						{/* 用户评价 */}
						{
							this.state.currentTab === "evaluate" && (
                                <Evaluate
                                    isAuth={true}
                                    reply={this.replyHandle.bind(this)}
                                    removeReply={this.removeReplyHandle.bind(this)}
                                    hasValidFilter={this.state.evaluateHasValidFilter}
                                    onClickValidFilter={this.onClickValidFilter}
                                />
                            )
						}
                    </div>

                </ScrollToLoad>
                </div>
                {
                        this.props.liveRole &&
                        <aside
                            className="operate-up-btn on-log"
                            data-log-region="operate-up-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({isShowOperatePlat: true});
                            }
                        }>
                            <img src={require('./img/operation-icon.png')} />
                            <span>操作</span>
                        </aside>
                    }
                    {
                        this.state.treasureCouponInfo.personNum && //是否有配置分享得券活动
                        !this.props.power.allowMGLive && //管理员
                        !this.isBought &&//是否已购买，白名单。。。
                        !/.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page')) &&//是否是来自中心页
                        <aside
                            className="treasure-icon-box on-log on-visible"
                            onClick={(e) => {
                                e.stopPropagation();
                                if(!this.state.treasureCouponRecord.id){
                                    locationTo(`${this.state.domainUrl}activity/page/share-get-coupon?businessType=CHANNEL&businessId=${this.data.channelId}`)
                                } else{
                                    locationTo(`${this.state.domainUrl}activity/page/share-get-coupon?businessId=${this.data.channelId}&businessType=CHANNEL&recordId=${this.state.treasureCouponRecord.id}`);
                                }

                            }}
                            data-log-region="channel-intro"
                            data-log-pos="treasure-get-coupon-icon"
                            data-log-name="分享得券活动icon"
                        >
                        </aside>
                    }


                </div>

                {
                    this.props.channelInfo.isShowRelayTag === 'Y' && !this.props.liveRole &&
                    <ReprintBtn
                        profit={this.props.channelInfo.relayProfit}
                        channelId={this.data.channelId}
                        liveId={this.props.channelInfo.liveId}
                    />
                }

                <BottomDialog
                    className="operate-plat"
                    show={this.state.isShowOperatePlat}
                    theme='empty'
                    close={ true }
                    onClose={ () => {this.setState({isShowOperatePlat: false})} }
                >
                    <OperatePlat
                        show={this.state.isShowOperatePlat}
                        close={() => this.setState({isShowOperatePlat: false})}
                        chargeConfigs={chargeConfigs}
                        isCamp={ this.isCamp }
                        channelInfo={this.props.channelInfo}
                        channelId={this.data.channelId}
                        marketFunc={this.marketFunc.bind(this)}
                        isShowMarketList={this.state.isShowMarketList}
                        chargeType={this.props.channelInfo.chargeType}
                        couponsetInfo={this.props.couponsetInfo}
                        marketsetInfo={this.props.marketsetInfo}
                        isOpenShare={this.props.isOpenShare}
                        isRelay={this.props.channelInfo.isRelay === 'Y'}
                        createNewTopic={this.createNewTopic}
                        isPop={this.state.isPop}
                        realNameStatus={this.state.realNameStatus}
                        power={this.props.power}
                        handleJoineWrapClick={this.handleJoineWrapClick}
                        showPushChannelDialog={this.showPushChannelDialog.bind(this)}
                        pushChannel = {this.pushChannel.bind(this)}
                    />
                </BottomDialog>

                 <ButtonRow
                    chargeType={this.props.channelInfo.chargeType}
                    isRelay={this.props.channelInfo.isRelay}
                    chargeConfigs={chargeConfigs}
                    vipInfo={this.props.vipInfo}
                    isCouponLinkShow={this.isCouponLinkShow()}
                    sourceChannelId={this.props.channelInfo.sourceChannelId}
                    channelId={this.data.channelId}
                    onBuyBtnClick={this.handleBuyBtnClick}
                    onBuyFreeBtnClick={this.payChannel}
                    client={this.props.liveRole ? 'B' : 'C'}
                    chargeStatus={this.props.chargeStatus}
                    channelSatus={this.props.channelSatus}
                    groupId={this.props.location.query.groupId}
                    groupcreateId={this.props.groupInfoSelf&&this.props.groupInfoSelf.channelGroupPo&&this.props.groupInfoSelf.channelGroupPo.id}
                    discountStatus={chargeInfo.discountStatus}
                    discount={chargeInfo.discount}
                    onClickConsult={() => { this.onClickConsult() }}
                    onClickPin={() => { this.onClickPin(chargeInfo.discountStatus) }}
                    onClickPinPay={() => { this.onClickPinPay() }}
                    shareKey={this.props.location.query.shareKey}

                    isLiked={this.state.isCollected}
                    likeHandle={this.collectHandle}

                    continuePlayClick={this.continuePlayClick}
                    toLiveHandle={this.toLiveHandle}
                    isOrNotListen={this.state.isOrNotListen}
                    authStatus={this.props.channelInfo.authStatus}
                    audioStatus={this.state.audioStatus}
                    percent={this.state.percent}
                    handleTryListen={this.handleTryListen}

                    cutInfo={this.props.courseCutInfo}
                    domainUrlCut = {this.state.domainUrl}
                    userId = {this.props.userInfo.userId}
                    cutAnimate = {this.state.cutAnimate}
                    isShowCutButton = {this.state.showCutTimer&&this.props.marketsetInfo.discountStatus ==='K'&&this.props.marketsetInfo.startTime <= this.props.common.sysTime &&this.props.marketsetInfo.endTime > this.props.common.sysTime}

                    isBought={this.isBought}
                 />

                {/* 推送系列课 */}
                {
                    this.props.liveRole ?
                    <PushChannelDialog
                        channelId={this.data.channelId}
                        liveId={this.props.channelInfo.liveId}
                        isShow={this.state.showPushChannelDialog}
                        hide={this.hidePushChannelDialog}
                    />
                    : null
                }

                {
                    !this.props.liveRole &&
                    <aside className="operation-icon-group">
                        {
                            false && <section className={"icons-wrap icon-live " + (this.state.showGoToTop ? 'top' : 'bottom')} onClick={() => { if (window._qla) { _qla('click', { region: "channel", pos: "aside", type: 'to-search', }) }; locationTo(`/wechat/page/search`) }}>
                                <img src={require('./img/search.png')} />
                            </section>
                        }
                        {
                            this.state.showGoToTop &&
                            <section className="icons-wrap on-log"
                                     onClick={this.scrollTopHandle}
                                     data-log-name="回到顶部"
                                     data-log-region="operation-icon-group"
                                     data-log-pos="to-top"
                                     data-log-status={this.isBought ? 'bought' : ''}
                            >
                                <img src={require('./img/to-top.png')} />
                            </section>
                        }
                    </aside>
                }

                {/*留言弹窗*/}
                <div className={"consult-dialog-container " + (this.state.consultPop ? '' : 'hide')}>
                    <ReactCSSTransitionGroup
                                transitionName="consult-dialog-background"
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={300}
                    >
                        {
                            this.state.consultPop?
                                <div className="cc-bg" onClick={this.onHideConsultPop} ></div>
                            :null
                        }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                            transitionName="consult-bottom-dialog-content"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                    >
                    {this.state.consultPop ?
                    <div className="content">
                        <h1>
                            <div>留言 <var className='num'>{this.props.consultList.length}</var></div>
                            <span onClick={this.onHideConsultPop}><i className="icon_delete"></i></span>
                        </h1>
                        <div className="section-container">
                        {
                            this.props.consultList.map((val, index) => {
                                return <section key={`consult-${index}`}>
                                    <aside>
                                        <img src={`${imgUrlFormat(val.headImgUrl,'?x-oss-process=image/resize,w_100,h_100,limit_1')}`} alt="" />
                                    </aside>
                                    <main className='consult-content'>
                                        <article>
                                            <div className="name-container">
                                                <h2>{val.name}</h2>
                                                <span className='time'>{timeBefore(val.replyTime, this.props.sysTime)}</span>
                                            </div>
                                            <p>{val.content}</p>
                                            <span
                                                className={val.isLike === 'Y' ? 'like ed' : 'like'}
                                                onClick={() => { this.onConsultPraiseClick(val.id, val.isLike) }}
                                            >
                                                {val.praise}
                                            </span>
                                        </article>
                                        {
                                            val.isReply === 'Y' &&
                                            <blockquote>
                                                <div className="reply-container">
                                                    <h2>直播间回复</h2>
                                                    <span>{timeBefore(val.replyTime, this.props.sysTime)}</span>
                                                </div>
                                                <p>{val.replyContent}</p>
                                            </blockquote>
                                        }
                                    </main>
                                </section>
                            })
                        }
                        </div>
                    </div>:null
                }
                    </ReactCSSTransitionGroup>
                </div>
                {/*********/}

                <BottomDialog
                    className='channel-tips-dialog'
                    show={this.state.shwoChannelTipsDialog}
                    theme='empty'
                    close={ true }
                    onClose={ () => {this.setState({shwoChannelTipsDialog: false})} }
                >
                    <div className="main">
                        <div className="title">服务说明</div>
                        <ul>
                            {this.ifShowPermanentPlayback() &&
                            <li className="forever">
                                <div className="title2">{this.ifShowPermanentPlayback() === 'month' ? '支持回听' : '支持回听'}</div>
                                <div className="des">{this.ifShowPermanentPlayback() === 'month' ? '课程包月期间免费不限次回听，可在个人中心下找到' : '本课程可支持回听，可在个人中心找到听过的课程'}</div>
                            </li>
                            }
                            {
                                this.isCouponLinkShow() && <li className="coupon">
                                    <div className="title2">支持优惠 <span className="float-right" onClick={() => {locationTo(`/wechat/page/coupon-code/exchange/channel/${this.data.channelId}${this.props.location.query.shareKey? '?shareKey=' + this.props.location.query.shareKey: ''}`)}}>优惠码兑换<span className='icon_enter'></span></span></div>
                                    <div className="des">本课程支持使用优惠券，直播间拥有最终解释权</div>
                                </li>
                            }
                            {
                                (!this.isFreeChannel && this.props.channelInfo.isRelay == 'Y') ?
                                <li className="vip-tip unuse">
                                    <div className="title2">会员不可用 <span className="float-right" onClick={() => { locationTo('/wechat/page/live-vip-details?liveId=' + this.props.channelInfo.liveId)}}>{this.props.vipInfo.isVip === 'Y' ? "查看会员" : "购买VIP会员"}<span className='icon_enter'></span></span></div>
                                    <div className="des">其他直播间转播课，直播间VIP不支持免费收听</div>
                                </li>:
                                this.props.vipInfo.isOpenVip == "Y" && <li className="vip-tip free">
                                    <div className="title2">会员免费听 <span className="float-right" onClick={() => { locationTo('/wechat/page/live-vip-details?liveId=' + this.props.channelInfo.liveId)}}>{this.props.vipInfo.isVip === 'Y' ? "查看会员" : "购买VIP会员"}<span className='icon_enter'></span></span></div>
                                    <div className="des">购买成为直播间VIP会员，即可全场免费听</div>
                                </li>
                            }

                        </ul>
                        <div className="btn-close" onClick={() => {this.setState({shwoChannelTipsDialog: false})}}>关闭</div>
                    </div>
                </BottomDialog>

                <Confirm
                    className="single-buy-dialog"
                    ref='singleBuyDialog'
                    title={`请输入单节购买的金额`}
                    titleTheme='white'
                    buttonTheme='line'
                    onBtnClick={this.handleConfirmSingleBuy}
                    buttons='cancel-confirm'
                >
                    <div className="single-buy-input-wrap">
                        <CommonInput type="number" noplaceholder="金额（元）" noIntoView={true} onChange={this.handleSingleBuyInputChange} value={this.state.singleBuyInputValue || ''} />
                        <span className="input-icon"  onClick={this.handlesingleInputClean.bind(this)}></span>
                    </div>
                </Confirm>

                <Confirm
                    className="move-out-dialog"
                    ref='moveOutDialog'
                    title={`课程移出需设置价格`}
                    titleTheme='white'
                    buttonTheme='line'
                    onBtnClick={this.handleConfirmMoveOut}
                    buttons='cancel-confirm'
                >
                    <div className="single-buy-input-wrap">
                        <CommonInput type="number" ref="singleBuyInput" placeholder="金额（元）" noIntoView={true} onChange={this.handleMoveOutInputChange} value={this.state.moveOutInputValue || ''} />
                        <span className="input-icon" onClick={this.handleMoveOutInputClean.bind(this)}></span>
                    </div>
                </Confirm>

                <Confirm
                    className="over-topic-dialog"
                    ref='overTopicDialog'
                    title={`结束直播`}
                    titleTheme='white'
                    buttonTheme='line'
                    buttons='cancel-confirm'
                >
                    <ul className='over-topic-tips' >
                        <li>结束直播后，讲师嘉宾将不能继续发言。</li>
                        <li>结束本次直播，用户将从头开始回顾。</li>
                        <li>若在话题开播前结束直播，将导致该话题门票收益无法提现。</li>
                    </ul>
                </Confirm>

                {/* 活动优惠券弹窗 */}
                { this.state.couponDialogShow &&
                    <div className="coupon-dialog-container receive-coupon-dialog">
                        <div className="c-d-bg" onClick={this.closeCouponPop}></div>
                        <div className="c-d-content">
                            <div className="receive-coupon-container">

                                <div className="receive-coupon-body">
                                    <i className="icon_close" onClick={this.closeCouponPop}></i>

                                    <div className="top-section">
                                        <div className="coupon-amount">
                                            <div className="amount"><em>{this.state.couponMoney}</em></div>
                                        </div>
                                        <div className="coupon-type-tip">课程抵用券</div>
                                    </div>
                                    <div className="bottom-section">
                                        <div className="coupon-validity">
                                            {this.state.endDate}
                                        </div>

                                        <div className="receive-button on-log" role="button" data-log-region="get-act-coupon-btn" onClick={this.fetchCoupon}>马上领取</div>

                                        <div className="coupon-from">
                                            仅限该课程使用
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }

                <Confirm
                    className="over-topic-dialog"
                    ref='deleteTopicDialog'
                    title={`删除话题`}
                    titleTheme='white'
                    buttonTheme='line'
                    buttons='cancel-confirm'
                >
                    <ul className='over-topic-tips' >
                        <li>删除后话题将不能恢复。</li>
                        <li>话题中若有待结算金额，将无法提现。</li>
                    </ul>
                </Confirm>


                {/* 支付*/}
                <BottomPayDialog
                    isShow={this.state.isOpenPayDialog}
                    chargeType={this.props.channelInfo.chargeType}
                    chargeConfigs={chargeConfigs/* [{amount:6,chargeMonths:1,id:11111,status:"Y",discountStatus:"Y",discount:2},{amount:9,chargeMonths:2,id:333,status:"Y",discountStatus:"Y",discount:7}]*/}
                    activeChargeIndex={this.state.activeChargeIndex}
                    changeChargeIndex={this.changeChargeIndex}
                    couponId={this.props.channelSatus.couponId}
                    qlCouponMoney={this.props.channelSatus.qlCouponMoney}
                    minMoney={this.props.channelSatus.minMoney || 0}
                    onCloseSettings={this.handleClosePayDialog}
                    payChannel={this.payChannel}
                    onSelectCouponList={this.onSelectCouponList}
                    fetchCouponList={this.fetchCouponList}
                    isRelay={this.props.channelInfo.isRelay}
                    isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice}
                />
                <BottomCouponListDialog
                    isShow={this.state.isOpenCouponListDialog}
                    onCloseCouponList={this.onCloseCouponList}
                    onBackCouponList={this.onBackCouponList}
                    onSelectedCouponItem={this.onSelectedCouponItem}
                    list={avaliableCouponList}
                    name={channelInfo.name}
                    liveName={channelInfo.liveName}
                    onItemClick={this.onCoupnoItemClick}
                />
                <BottomControl
                    show={this.state.isOpenCourseSettingDialog}
                    close
                    courseSettingData={this.state.courseSettingData}
                    onItemClick={this.handleCourseSettingItemClick}
                    onClose={this.handleCourseSettingClose}
                    isZeroMoney={this.isZeroMoney()}
                />


                <Confirm
                    ref='dialogRelay'
                    buttons='cancel'
                    title='转播设置'
                    cancelText="知道了"
                >

                    <main className='dialog-main'>
                        <div className="confirm-content">
                            该话题需要先设置价格，支持单节购买后，才可以上架到转播市场，点击“操作”即可设置，快去设置吧~
                        </div>
                    </main>
                </Confirm>

                <Confirm
                    ref='pinDialog'
                    buttons='confirm'
                    onClose={this.onClosePinDialog.bind(this)}
                    confirmText="免费发起拼课"
                    onBtnClick={() => { this.onConfirmPinClick() }}
                >
                    <main className='dialog-main pin-dialog'>
                        <div className="confirm-top pin-top">
                           邀请<span> {this.props.chargeConfigs[0] ? (this.props.chargeConfigs[0].groupNum-1 || 0) : 0}</span>人拼课
                        </div>
                        <div className="confirm-content pin-content">
                           你将获得价值<span>￥{chargeInfo.amount}</span>的免费听课机会
                        </div>
                    </main>
                </Confirm>

                <MiddleDialog
                    show={this.state.isShowFollowQR}
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="follow-dialog"
                    onClose={this.closeFollowQR.bind(this)}
                >
                    <div className='qrcode-wrap'>
                        <span onClick={this.closeFollowQR.bind(this)} className="close icon_delete"></span>
                        {
                            this.props.chargeStatus ?
                                <span className="qr_title"><i className="icon_checked" />报名成功</span>
                                : null
                        }
                        <div style={{ pointerEvents: !Detect.os.phone && 'none' }}
                            className='qrcode-image'
                            onTouchStart={this.onQrCodeTouch.bind(this)}
                        >
                        <QRImg
                            src={this.state.qrcodeUrl}
                            traceData="channelFocusQrcode"
                            channel = "101"
                            appId={this.state.focusAppId}
                        />
                        </div>

                        <p className='qrcode-tip' style={{ display: Detect.os.phone && 'none' }}>扫描上图识别二维码，关注服务号<br />就会在开播前提醒你观看哦~ </p>
                        <p className='qrcode-tip'>扫码后，刷新页面即可收听</p>
                    </div>
                </MiddleDialog>

                {/* 分享得券的弹框  */}
                <MiddleDialog
                    show={this.state.isShowShareGetCouponActivity}
                    className="share-coupon-activity-dialog"
                    onClose={this.closeShareGetCouponActivity.bind(this)}
                >
                    <div className={`content`}>
                        <div className="message-top">
                            <div className="message_1">真是太走运了！</div>
                        </div>

                        <div className="message-bottom">
                            <div className="tip">恭喜您!<br/>获得一个{formatMoney(this.state.treasureCouponInfo.totalCouponMoney||0)}元宝箱！</div>
                            <div className="btn on-log on-visible"
                            onClick={()=>{
                                locationTo(`${this.state.domainUrl}activity/page/share-get-coupon?businessType=CHANNEL&businessId=${this.data.channelId}`)
                            }}
                            data-log-region="channel-intro"
                            data-log-pos="treasure-get-coupon-box"
                            data-log-name="分享得券活动box"></div>
                        </div>

                    </div>
                </MiddleDialog>


                {/* 实名认证弹框  */}
                {/*
                <RealNameDialog
                    show = {this.state.isShowRealName}
                    onClose = {this.closeRealName.bind(this)}
                    realNameStatus = {this.state.realNameStatus}
                    liveId = {this.props.channelInfo.liveId}
                />
                */}

                {/* 实名认证弹窗 */}
                <NewRealNameDialog
					show = {this.state.isShowRealName}
					onClose = {this.closeRealName.bind(this)}
					realNameStatus = {this.state.realNameInfo.status||'unwrite'}
					checkUserStatus = { this.state.checkUserStatus }
					isClose={true}
					liveId = {this.props.channelInfo.liveId}
				/>

                 {/* 企业认证弹窗 */}
                 <CompanyDialog
                    show = {this.state.isCompany}
                    enterprisePo={this.state.enterprisePo}
                    onClose = {this.closeCompany}
                />

                {/* 直播间加V  */}
                <LiveVDialog
                    show = {this.state.isShowVBox}
                    onClose = {this.closeVBox.bind(this)}
                />

                {/* 教师节弹框  */}
                <TeacherCupDialog
                    show = {this.state.isShowTBox}
                    onClose = {this.closeTBox.bind(this)}
                />


                {/*金字塔弹框  */}
                <PyramidDialog
                    show = {this.state.showPyramidDialog}
                    onClose = {this.closePyramidDialog}
                />

                <DoctorDialog
                    show = {this.state.isShowDoctorBox}
                    onClose = {this.closeDoctorDialogHandle}
                />

                {/* 热心拥趸  */}
                <HotHeart
                    show = {this.state.isShowHotBox}
                    onClose = {this.closeHotBox.bind(this)}
                />

                {/* 代言人  */}
                <Spokesperson
                    show = {this.state.isShowDaiBox}
                    onClose = {this.closeDaiBox.bind(this)}
                />


                {/* 自媒体转载系列课领券弹框 */}
                <ReceiveCouponDialog
                    coupon={{...this.state.mediaCoupon}}
                    onReceiveCoupon={this.receiveMediaCoupon}
                    show={this.state.isShowMediaCouponDialog}
                    onClose={this.closeMediaCouponDialog}
                />


                <Confirm
                    ref='giftTipDialog'
                    theme='empty'
                    onClose={this.onCloseGiftTipDialog}
                    buttons='none'
                >
                    <main className='gift-dialog-container'>
                        <header>您的赠礼已包装好~</header>

                        <p className='gift-tip'>了解赠礼的后续领取情况<br/>请在<span>「我的购买记录」</span>中查看</p>

                        <footer>
                            <a href={`/wechat/page/channel/gift/${this.state.giftId}?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.location.query.channelId}`} className='gift-button'>查看赠礼</a>
                        </footer>
                    </main>
                </Confirm>

                <Confirm
                    ref='giftDialog'
                    theme='empty'
                    close={true}
                    onClose={this.onCloseGiftDialog}
                    buttons='none'
                >
                    <main className='gift-dialog-container'>
                        <header>{channelInfo.name}</header>

                        <p className='title-sm'>赠礼将于90天后过期<br />过期未领取的课程将不退回</p>

                        <section className='form-content'>
                            {/*会员类型*/}
                            {
                                channelInfo.chargeType === 'flexible' ?
                                    <div className='form-row'>
                                        <label className='full-title'>会员类型</label>

                                        <div className='member-type'>
                                            <i className='left icon_audio_play' onClick={() => {this.onChangeMemberType('decrease')}}></i>
                                            <span className='middle-content'>
                                                ￥{curConfig.amount} / {curConfig.chargeMonths}个月会员
                                            </span>
                                            <i className='right icon_audio_play' onClick={() => {this.onChangeMemberType('increase')}}></i>
                                        </div>
                                    </div>
                                    : ''
                            }

                            {/*赠送数量*/}
                            <div className="form-row flex-row">
                                <label>赠送数量</label>
                                <div className="gift-counter">
                                    <div className='counter'>
                                        <i className='left' onClick={() => {this.onChangeCount('decrease')}}>-</i>
                                        <span className='gift-count'>
                                            <CommonInput type="text" noIntoView={true} value={this.state.giftCount} onChange={this.onInputCount} />
                                        </span>
                                        <i className='right' onClick={() => {this.onChangeCount('increase')}}>+</i>
                                    </div>
                                </div>
                            </div>

                            {/*合计*/}
                            <div className='form-row flex-row'>
                                <label>合计</label>
                                <div className='text-content'>
                                    ￥
                                    {
                                        chargeInfo.discountStatus === 'Y' ?
                                            (chargeInfo.discount * this.state.giftCount).toFixed(2)
                                            :
                                            (curConfig.amount * this.state.giftCount).toFixed(2)
                                    }
                                </div>
                            </div>
                        </section>
                        <footer>
                            <span className={`gift-button ${this.state.isGiftDisable && 'disable'}`} onClick={this.onSubmitGift}>打包{this.state.giftCount}份赠礼</span>
                        </footer>
                    </main>
                </Confirm>


                <Confirm
                    ref='buyChannelDialog'
                    theme='empty'
                    close={true}
                    onClose={() => {this.hideBuyChannelDialog();}}
                    buttons='none'
                >
                    <main className='buy-channel-dialog'>
                        <p className="des">你还没有购买本课程，<br/> 购买后支持回听 </p>

                        <div className="red-btn"
                             onClick={() => {this.hideBuyChannelDialog(); this.handleBuyBtnClick()}}
                        >购买系列课 </div>
                        {
                            chargeInfo.discountStatus == "GP" ?
                                <div className="white-btn" onClick={() => {this.hideBuyChannelDialog(); this.onClickPin("GP")}}>一键开团：￥{chargeInfo.discount}</div>
                                :
                                chargeInfo.discountStatus == "P" ?
                                    <div className="white-btn" onClick={() => {this.hideBuyChannelDialog(); this.onClickPin("P")}}>免费拼课</div>
                                    :
                                    null
                        }
                        {/* 未购买系列课者 点击话题列表中的单节付费课的时候 会多出这样一个东西 */}
                        {
                            this.state.buyChannelDialogTopicItem  ?
                                <div
                                    className="white-btn"
                                    onClick={() => {
                                        locationTo(`/wechat/page/topic-intro?topicId=${this.state.buyChannelDialogTopicItem.id}${this.props.location.query.shareKey ? "&shareKey=" + this.props.location.query.shareKey : ""}`)
                                        this.hideBuyChannelDialog();
                                    }}
                                >
                                    单节购买：￥{this.state.buyChannelDialogTopicItem.money/100}
                                </div>
                            : null
                        }
                    </main>
                </Confirm>

                {
                    this.state.isShowIncrFansQrcodeDialog &&
                        <section className="incr-fans-qrcode-dialog">
                            <aside className="dialog-bg" onClick={ this.closeIncrFansQrcodeDialog }></aside>

                            <main className="qrcode-main">
                                <img src={ require('./img/qrcode-bg.png') } className="qrcdoe-main-bg"/>
                                <section className="qrcode-content-wrap">
                                    <img
                                        src={ this.state.incrFansQrcodeUrl }
                                        className="qrcode-img"
                                        onTouchStart={ this.handleButtonPress }
                                        onTouchEnd={this.handleButtonRelease}
                                    />
                                </section>
                                <span className="close-qrcode-dialog icon_cancel" onClick={ this.closeIncrFansQrcodeDialog }></span>
                            </main>
                        </section>
                }

                {
	                this.props.coralPercent &&
                    <CoralPromoDialog
                        show={this.state.showCoralPromoDialog}
                        close={this.onCoralPromoDialogClose}
                        nav={this.state.coralPromotionPanelNav}
                        switchNav={this.switchCoralPromotionPanelNav}

                        courseData={this.state.coralPushData}
                        officialKey={this.props.userInfo.userId}
                        userInfo = {this.props.userInfo}
                    />
                }

                <ActionSheet
                    ref={c => {this.actionSheet = c;}}
                />

                {
                    this.state.showThreeQrcode ?
                    <div className="three-qrcode" onClick={this.hideThreeQrcode}>
                        <div className="three-qrcode-inner" onClick={(e) => {e.stopPropagation()}}>
                            <div className="close" onClick={this.hideThreeQrcode}></div>
                            <div className="header">
                                <img className="avatar" src={this.props.liveInfo.logo}/>
                            </div>
                            <div className="body">
                                <div className="name">{this.props.liveInfo.name}</div>
                                <img className="qrcode" src={this.state.threeQrcode}/>
                                <div className="info">
                                    长按识别关注我们，接收开课提醒
                                </div>
                            </div>
                        </div>
                    </div> : null
                }

                {/* 提示已经购买过相同的课程 */}
                <Confirm
                    ref='haveBoughtDialog'
                    theme='empty'
                    close={true}
                    onClose={() => { this.refs.haveBoughtDialog.hide(); }}
                    buttons='none'
                >
                    <main className='buy-channel-dialog have-bought-dialog'>
                        <p className="des"><strong>您已购买该课程，请直接进入学习</strong></p>
                        <div className="red-btn" onClick={() => { this.gotoChannelBought(); }}>进入课程</div>
                        <div className="view-bought-records"><a href="javascript:void(0)" onClick={this.viewBoughtRecords}>查看购买记录</a></div>
                    </main>
                </Confirm>

				{/* 关注千聊微信公众号 */}
				<FollowDialog
					ref={ dom => dom && (this.followDialogDom = dom) }
                    title={ this.state.followDialogTitle }
                    desc={ this.state.followDialogDesc }
                    qrUrl={this.state.qlqrcodeUrl}
                    option={ this.state.followDialogOption }
				/>

                {/* 关注渠道2，确定关注直播间弹框 */}
                <Confirm
                    ref='focusOneDialog'
                    theme='empty'
                    close={true}
                    onClose={() => { this.refs.focusOneDialog.hide(); }}
                    buttons='none'
                >
                    <main className='focus-dialog-main'>
                        <div className="massage">是否关注该直播间？</div>
                        <div className="tips">接收更多同类课程</div>
                        <div className="btn"  onClick={this.dialogHandleFocusBtn}>确认关注</div>
                    </main>
                </Confirm>

                {/* 关注渠道3，取消关注直播间弹框 */}
                <Confirm
                    ref='focusTwoDialog'
                    theme='empty'
                    close={true}
                    onClose={() => { this.refs.focusTwoDialog.hide(); }}
                    buttons='none'
                >
                    <main className='focus-dialog-main'>
                        <div className="massage">是否继续关注该直播间？</div>
                        <div className="tips">接收更多同类课程</div>
                        <div className="btn" onClick={this.dialogHandleFocusBtn}> 取消关注</div>
                    </main>
                </Confirm>
                {/* 公众号的取消关注直播间入口，取消关注直播间的确认弹框*/}
                <Confirm
                    ref='focusCancelDialog'
                    theme='empty'
                    close={true}
                    onClose={() => { this.refs.focusCancelDialog.hide(); }}
                    buttons='none'
                >
                    <main className='focus-dialog-main'>
                        <div className="massage">是否确认取消关注该直播间？</div>
                        <div className="tips">接收更多同类课程</div>
                        <div className="btn" onClick={this.dialogHandleFocusBtn}> 取消关注</div>
                    </main>
                </Confirm>

                {/* 优惠券弹框 */}
                {
                    (this.state.couponCode || this.state.codeId) && this.isCanReceiveCoupon &&
                        <CouponDialog
                            ref={ dom => dom && (this.couponDialogDom = dom.getWrappedInstance()) }
                            isAutoReceive={ this.state.isAutoReceive }
                            businessType={'channel'}
                            businessId={this.data.channelId}
                            businessName={ this.props.channelInfo.name }
                            couponCode={ this.state.couponCode }
                            codeId={ this.state.codeId }
                            liveId={ this.props.channelInfo.liveId }
                            liveName={ this.props.channelInfo.liveName }
                            isLiveAdmin={ this.props.isLiveAdmin }
                        />
                }

                <div className={`reply-input-box${this.state.showReplyInput ? ' show' : ''}`} ref="reply-input-box">
                    <div className="input-wrap">
                        <CommonInput type="text" ref="reply-input" noIntoView={true} placeholder={this.state.replyPlaceholder} value={this.state.replyContent} onChange={this.changeReplyContent.bind(this)} onBlur={() => {!this.state.replyContent && this.setState({showReplyInput: false})}} onFocus={() => setTimeout(() => findDOMNode(this.refs['reply-input-box']).scrollIntoView(),300)} />
                    </div>
                    <span
                        className={ `send-btn on-log on-visible${this.state.replyContent ? '' : ' disable'}`}
                        data-log-region="channel-comment-send-btn"
                        data-log-pos={this.state.currentRelyIndex}
                        onClick={this.state.replyContent ? this.sendReplyHandle.bind(this) : () => {}}>发送</span>
                </div>

                <MiddleDialog
					show={this.state.isShowGroupDialog}
					title = "如何开启社群?"
					buttons="cancel"
					buttonTheme="line"
					cancelText="我知道了"
					onBtnClick={() => {this.setState({
						isShowGroupDialog: false
					})}}
					className="channel-dialog group-entrance-understand-dialog"
				>
					<div className="content">
						<p>
							可登陆千聊PC端后台社群首页，选择关联类型为打卡。
						</p>
						<br />
						<p>
							关联后，你的学员将会通过打卡首页的社群入口加入微信群。
						</p>
						<br />
						<p>
							通过开启社群，能更好的帮助老师沉淀学员，<span>提升课程触达率和转化率。</span>
						</p>
					</div>
				</MiddleDialog>
                
            </Page>
        );
    }

    hideThreeQrcode = () => {
        this.setState({
            showThreeQrcode: false
        })
    }

    ajaxGetGuideQrSetting = async () => {
        const result = await this.props.getGuideQrSetting(this.props.channelInfo.liveId);
        if (result && result.state && result.state.code == 0 ) {
            this.setState({
                shouldShowThreeQrcode: result.data.isOpen == 'Y'? true : false
            })
        } else {
            window.toast(result.state.msg);
        }
    }
}


function mapStateToProps(state) {
    return {
        sysTime: getVal(state, 'common.sysTime',''),
        userInfo: state.common.userInfo,
        channelInfo: state.channel.channelInfo,
        isLiveAdmin: state.common.isLiveAdmin,
        liveLevel: state.common.liveLevel,
        isBlack: state.channel.isBlack,
        chargeStatus: state.channel.chargeStatus,
        isSubscribe: state.channel.isSubscribe,
        isFocusThree: state.channel.isFocusThree,
        isBindThird: state.channel.isBindThird,
        isShowQl: state.channel.isShowQl,
        liveRole: state.channel.liveRole,
        chargeConfigs: state.channel.chargeConfigs,
        payUserCount: state.channel.payUserCount,
        payUserHeadImages: state.channel.payUserHeadImages,
        vipInfo: state.channel.vipInfo,
        isLiveFocus: state.channel.isLiveFocus,
        desc: state.channel.desc,
        groupinglist:state.channel.groupingList||{},
        groupInfo:state.channel.groupInfo||{},
        groupInfoSelf:state.channel.groupInfoSelf||{},
        courseList: state.channel.courseList,
        coursePageNum: state.channel.coursePageNum,
        coursePageSize: state.channel.coursePageSize,
        common: state.common,
        power: state.channel.power,
        channelSatus: state.channel.channelSatus||{},
        payment: state.common.payment,
        showPaymentDialog: state.common.payment.showDialog,
        myShareQualify: state.channel.myShareQualify,
	    coralPercent: state.channel.coralPercent,
        isOpenShare: state.channel.isOpenShare,
        consultList: state.channel.consultList,
        evaluationIsOpen: state.evaluation.isOpen,
        couponsetInfo: state.channel.couponsetInfo||{},
        marketsetInfo: state.channel.marketsetInfo||{},
        orderNow: state.channel.orderNow,
	    channelAutoDistributionInfo: state.channelDistribution.channelAutoDistributionInfo,
        shareSysInfo:state.channelDistribution.shareSysInfo,
        liveInfo: state.live.liveInfo.entity,
        courseCutInfo: state.channel.courseCutInfo,
        evaluation: state.evaluation,

		//会员信息
		isMember: getVal(state, 'memberInfo.isMember') === 'Y',
		isMemberPrice: getVal(state, 'channelIntro.isMemberPrice') === 'Y',
        evaluationData: state.evaluation.evaluationData || {},
    }
}

const mapActionToProps = {
    initChannelInfo,
    initIsBlack,
    initIsSubscribe,
    initLiveRole,
    initChargeConfigs,
    fetchPayUser,
    initVipInfo,
    fetchCourseList,
    getCourseList,
    updatePushNum,
    updateFollowChannel,
    switchFree,
    updateCourseData,
    fetchRemoveCourse,
    fetchDeleteCourse,
    fetchSingleBuy,
    fetchFreeBuy,
    doPay,
    fetchEndCourse,
    fetchGetQr,
    channelAutoShareQualify,
    sendConsult,
    getConsultSelected,
    setConsultList,
    consultPraise,
    getGiftId,
    channelCreateGroup,
    getChannelGroupResult,
    getChannelGroupSelf,
    getChannelGroupingList,
	getEvaluationData,
    getIsOpenEvaluate,
    getRealStatus,
    getCheckUser,
    getLiveSymbol,
    userBindKaiFang,
    channelCount,
    bindLiveShare,
    addPageUv,
    updateOrderNowStatus,
    callActivityLog,
	getOpenPayGroupResult,
	countSharePayCache,
    fetchCouponListAction,
    updateCouponInfo,
    checkUser,
    hideTopic,
    onChangeTopicHidden,
    bindOfficialKey,
	getMyCoralIdentity,
    activityCodeExist,
    activityCodeBind,
    getPromotion,
    newBeginTopic,
    fetchMediaCouponDetail,
    receiveMediaCoupon,
    fetchIsReceivedCoupon,
    fetchMediaCouponList,
    isCollected,
    addCollect,
    cancelCollect,
    getCousePayPaster,
    getLiveInfo,
    getGuideQrSetting,
    getIsOrNotListen,
    getTryListen,
    getShareCutCourseInfo,
    checkDuplicateBuy,
    fetchQlQrcode,
    getDomainUrl,
    subscribeStatus,
    isFollow,
    getCouponBoxCourseInfo,
    getApplyRecord,
    getAuth,
    getEditorSummary,
    getQrCode,
    reply,
    removeReply,
    getEvaluationList,
    getIfHideGroupInfo,
    getJoinCampInfo,
    getCurrentPeriod,
    fetchAndUpdateSysTime,
    fetchCourseTag
}

module.exports = connect(mapStateToProps, mapActionToProps)(Channel);
