import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode, createPortal } from 'react-dom';
import { autobind, throttle } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Detect from 'components/detect';
import { apiService } from 'components/api-service';
import { get } from 'lodash';
import { isQlchat } from 'components/envi';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
// import ComplainFooter from './components/complain-footer';
import BottomBrand from "components/bottom-brand";
import { Confirm, MiddleDialog } from 'components/dialog';
// import CommunitySuspension from 'components/community-suspension';
import CommunityGuideModal from 'components/community-guide-modal';
import RidingLantern from 'components/riding-latern';

import IntroHeader from '../../../components/cend-intro-header';
import GroupingInfo from './components/grouping-info';
import ShareBtn from '../../../components/share-btn';
import PasterQrcode from './components/paster-qrcode';
import PaymentDetailsDialog from '../../../components/payment-details-dialog';
import InviteCourseDialog from './components/invite-course-dialog';
import SpecialsCountDown from '../../../components/specials-count-down';
import BottomPurchasePanel from './components/bottom-purchase-panel';
import ConsultList from './components/consult-list';
import ActCouponDialog from './components/act-coupon-dialog';
import ReceiveCouponDialog from './components/receive-coupon-dialog';
// import FollowDialog from 'components/follow-dialog';
import IntroQrCodeDialog from 'components/intro-qrCode-dialog'
import InviteFriendsToListen from 'components/invite-friends-to-listen';
import CourseIntro from './components/course-Intro';
import CouponBtn from '../../../components/coupon-btn';
import CouponDialog from 'components/coupon-dialog';
import MemberBlock from '../../../components/member-block';
import CouponLists from '../../../components/coupon-lists';
import CourseDatial from '../../../components/course-details';
import BackTuition from '../../../components/back-tuition-bannner';
import BackTuitionLabel from '../../../components/back-tuition-label';
import BackTuitionDialog from 'components/back-tuition-dialog';
import TrainingCampEnd from './components/training-camp-end';
import CampDetail from './components/camp-detail';
import EmptyPage from 'components/empty-page';
import ComeFromAct from '../../../components/come-from-activity';
import AppDownloadBar from 'components/app-download-bar';
// import InviteLearn from "../../../components/invite-learn";
import UniversityBlock from '../../../components/university-block'
import IntersectionMount from 'components/intersection-mount';
import AddUniversityCourse from '../../../hoc/uni-join-course'

import {
	locationTo,
	formatMoney,
	imgUrlFormat,
	updateUrl,
	localStorageSPListAdd,
	getVal,
	timeBefore,
	isFromLiveCenter,
	formatDate,
	getLocalStorage,
	setLocalStorage,
	filterOrderChannel,
	isNextDay,
	executeFunAccordingToStorage,
	getCookie,
	sleep,
    formatCountdown,
	randomShareText,
	htmlTransferGlobal,
	isLogined,
	formatNumber,
	baiduAutoPush,
	getCourseHtmlInfo
} from 'components/util';
import openApp from 'components/open-app';



import { fillParams, getUrlParams } from 'components/url-utils'
import { share } from 'components/wx-utils';

import {
	doPay,
	getDomainUrl,
	whatQrcodeShouldIGet,
	subAterSign,
	getLiveStudioTypes,
	checkShareStatus,
	fetchShareRecord,
	uploadTaskPoint,
	request,
	getUserInfo,
	ifGetCousePayPasterLink,
	getCommunity,
	checkEnterprise,
	dispatchFetchRelationInfo
} from 'common_actions/common'

import {
	getShareRate,
	getPlatFormQualify,
} from 'common_actions/live';

import { getPacketDetail } from 'common_actions/coupon'
import { getPersonCourseInfo, getCoralQRcode } from "common_actions/coral";
import {
	bindOfficialKey,
	followLive,
	getQrCode,
	getMyQualify,
	isShowMemberLine,
	fetchPayBackReturnMoney,
	fetchAndUpdateSysTime,
	fetchCourseTag
} from '../../../actions/common';
import {
	getCouponDetail
} from '../../../actions/coupon'
import {
	fetchInitData,
	channelCreateGroup,
	getChannelGroupResult,
	getMyGroupInfo,
	updateChannelGroupingList,
	fetchTopicList,
	bindLiveShare,
	updateChannelAuth,
	fetchMediaCouponList,
	fetchCouponListAction,
	updateCouponInfo,
	getConsultSelected,
	consultPraise,
	getOpenPayGroupResult,
	countSharePayCache,
	updateChannelCouponStatus,
	fetchMediaCouponDetail,
	fetchIsReceivedCoupon,
	receiveMediaCoupon,
	getIfHideGroupInfo,
	channelTaskCardAuth,
	initChargeStatus,
	joinPeriod,
    fetchUnlockProgress,
    unlockCourseBindUserRef,
    isSubscribeAppId
} from '../../../actions/channel-intro'

import {
	isCollected,
	addCollect,
	cancelCollect
} from '../../../../other-pages/actions/mine';

import {
	getAuth
} from '../../../../other-pages/actions/topic';

import { getPeriodByChannel, newJoinPeriod, getCampUserInfo } from '../../../actions/training'

import { logGroupTrace, eventLog } from 'components/log-util';
import LiveInfo from 'components/live-info';
import TopicList from '../../../components/topic-list';
import OperateMenu from 'components/operate-menu/v2';
import GuestYouLike from 'components/guest-you-like';
import Evaluate from '../../../components/evaluate';

import {
	// getEvaluationData,
	getEvaluationList,
	// getIsOpenEvaluate
} from '../../../actions/evaluation';

import {
	userBindKaiFang,
} from 'actions/recommend';
import {
	getGiftId,
} from '../../../actions/channel';

import {
	checkUser
} from '../../../../live-studio/actions/collection';

import {
	selectCouponIdx
} from '../../../actions/topic-intro';

import {fetchSubscribeStatus} from '../../../../actions/common'


// import {
// 	updateMemberInfo
// } from '../../../../membership/actions/member';

import {
	fetchChannelInfo
} from '../../../actions/splicing-all';

import FissionCardDialog from './components/fission-card-dialog'
import FissionFailDialog from './components/fission-fail-dialog'
import FissionGroupDialog from './components/fission-group-dialog'
import UniversityStatusHoc from '../../../components/university-auth'
import UniversityCollege from '../../../components/university-college'
import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import IntroGroupBar from "components/intro-group-bar";

@UniversityStatusHoc
@AddUniversityCourse
@autobind
class Channel extends Component {
	constructor(props) {
		super(props);
		this.data.channelId = Number(this.props.location.query.channelId);
		this.data.targetCouponId = this.props.location.query.couponId;
		this.data.unlockUserId = this.props.location.query.unlockUserId;
	}

	state = {
		// 标记是否已获取初始信息
		hasFetchInitData: false,
		// 是否App
        isApp: isQlchat(),

		// 课程列表正序对象
		topicList: {
			status: '', // '' | success | end
			data: undefined,
			pageSize: 20,
		},

		isTopicListDesc: false,

		// 课程列表倒序对象
		topicListDesc: {
			status: '',
			data: undefined,
			pageSize: 20,
		},

		// 是否弹出支付框
		isOpenPayDialog: false,
		// 是否弹出优惠码列表
		isOpenCouponListDialog: false,
		// 优惠券列表
		couponList: [],

		// 是否已收藏
		isCollected: false,

		// ‘更多’菜单配置
		operateMenuConfig: [],
		// 是否在砍价活动时间内
		isWithinShareCut: false,
		// 试听话题
		auditionOpenCourse: null,
		// 赠礼数量
		giftCount: 1,
		// 当前选中的会员类型（赠礼弹框）
		curCharge: 0,
		// 赠礼按钮是否禁用
		isGiftDisable: false,
		// 留言列表
		consultList: [],
		consultPop: false,

		showGroupingInfo: false,
		// 是否开启自动领取，默认开启，就是页面刚进来的时候需要自动领取优惠券，如果是在介绍中点击那个优惠券的话这个开关需要关闭，见onReceiveClick方法
		isAutoReceive: true,
		couponCode: this.props.location.query.couponCode,
		codeId: this.props.location.query.codeId,

		mountBottomPurchasePanel: false,
		// 是否显示自媒体转载系列课优惠券弹窗
		isShowMediaCouponDialog: false,

		// 关注直播间后的公众号二维码
		qrcodeUrl: '',
		followDialogType: '',
		followDialogOption: {},

		// intro | course
		currentTab: "intro",
		introMount: true,
		// 当此属性为true的时候，tab会一直粘在顶部
		tabStick: false,

		// 生成邀请卡按钮移动
		shareBtnMove: false,

		// 分销赚多少钱
		shareMoney: 0,

		// 是否有资格邀请好友免费听
		canInvite: false,
		// 免费听邀请id
		inviteFreeShareId: '',
		// 显示当前单课优惠券列表
		isCoupons: false,
		// 优惠券列表是否为第一次渲染
		isOnce: false,
		passTime: 15,
		isPass: false,
		passDate: '',
		groupResult: '', //用户参团信息

		// 有效评价过滤开关
		evaluateHasValidFilter: false,
		coralInfo: {},

		activeChargeIndex: 0, // 当前选中的付费类型
		// 更多操作按钮提示
		isShowOperateMenuTips: false,

		// 优惠券列表展示专用
		couponUsePrice: 0,

		// 训练营最近的信息
		campInfo: {},
		// 用户加入训练营信息
		joinCampInfo: {},

		// 社群引导信息
		existCommunity: false,
		communityCode: '',
		communityName: '',

		// 是否展示请好友听引导
		isShowInviteFriendsListenGuide: false,
		/** 拉人返学费相关 **/
		showBackTuitionBanner: false, // 是否显示拉人返学费banner
		showBackTuitionLabel: false, // 是否显示拉人返学费面板
		inviteReturnConfig: {}, //拉人返学费邀请配置
		/****************/

		// 社群引导
		showCommunityGuideModal: false,
		modalType: '',
		existLiveCommunity: false,
		liveCommunityCode: '',
		liveCommunityName: '',
		inviteDetail: {

		},
		showInviteDialog: false,
		inviteInfo: {},

		// 平台通用券（奖学金）id相关
		schloarshipPacketId: '',
		/****************/
		enterprisePo: {},
		isFromLiveCenter: isFromLiveCenter(),

        // 一元购解锁程度
        unlockInfo: {
            isNeedToUnlock: 'N',
            limitCount: 0,
            currentCount: 0
        },
        userUnlockProcess: {},
		showFissionGroupBar: false,
		isLoading: false,
		
        communityInfo: null, // 社群信息
		groupHasBeenClosed: true, // 關閉社群入口
		isShowGroupDialog: false, // 显示社群弹窗
	};

	data = {
		channelId: '',
		sourceNo: this.props.location.query.sourceNo || 'qldefault',
		reNewTip: false, //续费成功提示
		couponBtnRight: 0,
		// 直播间配置
		liveConfig:null,
		missionDetail: {}, // 拉人返学费数据
        unlockUserId: ''
	};

	get isUnHome(){
		const isUnHome =  getUrlParams('isUnHome', '')
		return Object.is(isUnHome, 'Y');
	}

	async componentDidMount() {
		this.props.fetchAndUpdateSysTime();
		this.initMediaCouponInfo();
		this.ajaxInviteDetail();
		this.isInviteAuditionUserId();
		this.handleInvite();
		this.getCompany();
		this.fetchUnlockProgress();
		this.bindUnlockCourseUserRef()
	
		// 初始化绑定三方和关注操作
		await this.initFollow()

		if (this.props.location.query.officialKey || this.props.location.query.source == "coral") {
			this.tracePage = 'coral'
		}

		/**
		 * 接口请求要么放到fetchInitData里面要么在initData返回后再请求，别再写在上面了
		 * */

		await this.props.fetchInitData({
			channelId: this.data.channelId,
			liveId: this.props.liveId,
			groupId: this.props.location.query.groupId,
			isCamp: this.props.channelInfo.isCamp,
			isCoral: (this.tracePage === 'coral'),
			// 分销类型
			discountStatus: this.props.marketingInfo.discountStatus
		});
		this.sendPV();
		const initCouponPromise = this.initCoupon();
		const initTopicListPromise = this.initTopicList();
		this.initChannelAuth();
		this.getCompany();

		this.setState({
			hasFetchInitData: true,
			currentTab: this.isBought ? "course" : "intro",
			isShowInviteFriendsListenGuide: isNextDay('inviteFriendsListenGuide'),
			isQlLive: await this.isQlLive(),
		}, () => {
			this.setState({
				isLoading: true
			})
			// 手动触发打曝光日志
			setTimeout(() => {
				typeof _qla != 'undefined' && _qla.collectVisible();
			}, 50);
			// 绑定滚动区捕捉曝光日志
			setTimeout(() => {
				typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
				typeof _qla != 'undefined' && _qla.bindBrowseScroll('co-scroll-to-load');
			}, 1000);

		});

		// 初始化珊瑚课程信息
		// this.initCoralInfo();
		// 初始化拼团
		this.initGroupingInfo();

		this.initShareCut();
		this.initOperateMenuConfig();
		this.dispatchGetCommunity();

		if(this.props.userId){
			// 有登录才初始化的模块

			// 请好友免费听检验分享状态, 要等话题列表返回后才能初始化
			initTopicListPromise.then(() => {
				this.checkShareStatus();
			});
			this.props.getUserInfo()
			// 返学费初始化状态
			this.initInviteReturnInfo();
			this.initIsCollected(); // 在initOperateMenuConfig之后
			// 千聊会员条
			this.initMemberBlock();

			this.props.getShareRate({ businessId: this.data.channelId, businessType: 'CHANNEL' });
			this.props.getPlatFormQualify({ liveId: this.props.liveId })// 获取平台分销中的平台比例

			this.getGroupResult();

			// 如果是按时收费才请求这个 续费的接口
			if(this.props.channelInfo.chargeType === 'flexible' && this.isBought) {
				this.fetchChargeStatus()
			}

			// 留言
			this.initConsultList();

			// 介绍页显示发平台通用券按钮
			setTimeout(_ => {
				this.getPacketDetail();
			}, 1000)
			this.props.dispatchFetchRelationInfo({userId: this.props.userId})
		}
        // 待查
		// this.props.getEvaluationData({
		// 	channelId: this.data.channelId
		// })
		// 待查
		// await this.props.getIsOpenEvaluate(this.props.liveId)
		// 待查
		// await this.props.updateMemberInfo()
			
		this.judgeFissionCourseIds()
		// 进入页面，若解锁状态为待解锁，直接弹出分享弹窗
		if(this.state.unlockInfo && this.state.unlockInfo.unlockStatus === 'wait') {
			this.handleShowFissionCard();
		}
		

		// tab滚动事件
		this.initSrollEvent()

		// 数据回来后再装载某些组件
		if(this.isBought){
			this.setState({
				currentTab: 'course',
				courseMount: true
			})
		}

		setTimeout(() => {
			// 手动触发打曝光日志
			setTimeout(() => {
				typeof _qla != 'undefined' && _qla.collectVisible();
			}, 50);
		}, 2000);

		// 添加足迹
		localStorageSPListAdd('footPrint', this.data.channelId, 'channel', 100);

		// 计算优惠券的right
		let portalContainer = document.querySelector('.portal-container');

		const contianerWidth = portalContainer && portalContainer.getBoundingClientRect().width;
		if (contianerWidth >= 640) {	// 为了兼容fixed布局在PC端显示时，超出container
			this.data.couponBtnRight = (document.body.offsetWidth - contianerWidth) / 2 + 41
		}

		// C端用户获取系列课是否有关联社群
		this.initCommunity();

		// 支付须在优惠券列表返回后调起
		initCouponPromise.then(() => {
			console.log('优惠券列表ok')
			this.checkUser();
			this.isAutoPay();
		})

		// 自动唤起请好友免费听弹窗
		executeFunAccordingToStorage('inviteCourseDialog', 'Y', () => { this.inviteCourseDialogEle.show() }, 10)

		// 10s后简化推广赚按钮
		setTimeout(() => {
			this.setState({
				shareBtnSimplify: true
			})
		}, 10000);

		await this.initLiveConfig();
		// 绑定邀请关系
        await this.bindUnlockCourseUserRef()
        // 初始化分享
        if(this.chargeConfig.discountStatus === 'UNLOCK') {
            this.initShare()
	        if (this.props.isAuthChannel) {
				try {
					this.scrollNode.scrollTop = this.tabDom.offsetTop;
				} catch (error) {
					console.error(error);
				}
			}
		}

		const desc = this.props.channelDesc && this.props.channelDesc.lectuerInfo && this.props.channelDesc.lectuerInfo.find(item => item.type === 'text')
		this.initHtmlInfo({
			businessId: this.data.channelId,
			businessType: 'channel',
			businessName: this.props.channelInfo.name, 
			liveName: this.props.channelInfo.liveName, 
			intro: desc && desc.content || ''
		});
	}

	isInviteAuditionUserId() {
		if (!this.inviteAuditionUserId) return;
		this.setState({
			showInviteDialog: this.inviteAuditionUserId != getCookie('userId') ? true : false
		})
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

	async ajaxInviteDetail() {
		if (!this.data.channelId) return;
		if (!this.state.auditionOpenCourse) return;
		try {
			let result = await apiService.post({
				url: '/h5/invite/audition/inviteMissionInfo',
				body: {
					channelId: this.data.channelId
				}
			})
			if (result.state.code == 0) {
				this.setState({
					inviteDetail: result.data.missionInfo
				})
			}
		} catch (e) {
			console.error(e)
		}
	}

	componentDidUpdate(preProps,preState) {
		if (!this.isUpdateShare && this.props.platformShareRate && this.props.platformShareRate != preProps.platformShareRate) {
			// 重置页面分享。
			this.isUpdateShare = true;
			this.initShare();
		}
		// 如果富文本修改过系列课简介，则需要重置分享(珊瑚的除外)
		if (!this.isUpdateShareBecauseEditorSummary && this.props.channelSummary && this.tracePage != "coral") {
			// 重置页面分享
			this.isUpdateShareBecauseEditorSummary = true
			this.initShare()
		}
	}

	get tracePage() {
		return window.sessionStorage && sessionStorage.getItem('trace_page')
	}

	set tracePage(tp) {
		window.sessionStorage && sessionStorage.setItem('trace_page', tp)
	}

	/***********************开始平台通用券（奖学金）相关***************************/
	// 跳转到发送奖学金页面
	jumpToScholarshipPage = () => {
		locationTo(`/wechat/page/send-platform-coupon?packetId=${this.state.schloarshipPacketId}`)
	}

	// 获取企业认证信息
	async getCompany(){
		const { data = {} } = await checkEnterprise({liveId: this.props.liveId,});
		this.setState({
			enterprisePo: data
		})
	}

	// 介绍页显示发平台通用券按钮
	getPacketDetail = async () => {
		await getPacketDetail({ businessId: this.data.channelId }).then(res => {
			// 返回的是空或者是空对象表明接口请求错误或者不是官方直播间且没有平台分销比例，不执行以下操作
			if (!res || JSON.stringify(res) === '{}') {
				return
			}
			if (get(res, 'state.code')) {
				throw new Error(res.state.msg)
			}
			let couponNum = get(res, 'data.couponNum', 0) // 总数量
			let bindCouponNum = get(res, 'data.bindCouponNum', 0) // 领取数量
			let dayType = get(res, 'data.dayType')// 日期类型
			let fixDateEndTime = get(res, 'data.fixDateEndTime', 0) //固定日期的结束时间
			// 券未领完且固定日期未过期
			if (couponNum && bindCouponNum < couponNum && !(dayType === 'fixDate' && fixDateEndTime < Date.now())) {
				let operateMenuConfig = this.state.operateMenuConfig
				operateMenuConfig.push({
					name: '奖学金',
					icon: 'https://img.qlchat.com/qlLive/liveCommon/icon-schloarship.png',
					onClick: this.jumpToScholarshipPage,
					className: 'on-log on-visible schloarship',
					'data-log-name': '奖学金',
					'data-log-region': 'lucky',
				})
				this.setState({ schloarshipPacketId: get(res, 'data.id', ''), operateMenuConfig })
			}
		})
	}
	/***********************结束奖学金相关***************************/

	// 获取用户优惠券列表
	async getCoupons() {
		// 判断该课是否是官方直播间的课或者平台分销的课
		const status = await this.officalOrPlatform()
		// 官方直播间或者平台分销的直播间的比例
		const percent = await this.officalOrPlatformRate()
		// 获取当前系列课所有的优惠券
		const { data: { couponList } } = await this.props.fetchCouponListAction('channel', this.data.channelId, this.props.liveId, status, percent);
		const arr = couponList.filter((item) => {
			// 如果是会员券且会员失效 则不展示
			if (item.couponType === 'member' && !this.props.isMember) {
				return false
			}
			// 转载课过滤掉平台折扣券
			if (this.isRelay && item.couponType !== 'relay_channel') {
				return false
			}
			item.useRefId = item.couponId
			console.log(formatMoney(item.money), 'item.money')
			item.money = (Number(item.money) * 1000) / 10;
			item.minMoney = formatNumber((item.minMoney || 0) * 100)
			return true
		});
		this.setState({
			couponList: arr
		})
	}

	// 判断该课是否是官方直播间的课或者平台分销的课
	async officalOrPlatform() {
		return new Promise(async (resolve) => {
			let psCh = (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : ''
			let isQlLive = await this.isQlLive()
			if (isQlLive) {
				resolve('qlLive')
			} else if (!this.data.missionDetail.missionId && psCh && this.props.platformShareRate) {
				resolve('platform')
			} else {
				resolve('')
			}
		})
	}

	// 官方直播间或者平台分销的直播间的比例
	async officalOrPlatformRate() {
		return new Promise(async (resolve) => {
			let psCh = (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : ''
			let isQlLive = await this.isQlLive()
			// 如果是官方直播间，就拿官方直播间的比例，是平台分销的课就拿平台分销的比例，官方直播间和平台分销是互斥的
			if (isQlLive) {
				await request({
					url: '/api/wechat/transfer/h5/live/qlLiveSharePercent',
					body: { businessId: this.data.channelId, businessType: 'channel' }
				}).then(res => {
					resolve(get(res, 'data.sharePercent', 0))
				})
			} else if (!this.data.missionDetail.missionId && psCh && this.props.platformShareRate) {
				resolve(this.props.platformShareQualify)
			} else {
				resolve(0)
			}
		})
	}

	// 判断是否是官方直播间
	async isQlLive() {
		return await getLiveStudioTypes({ liveId: this.props.liveId }).then(res => {
			return res.data && res.data.isOfficialLive
		})
	}

	async fetchChargeStatus() {
		let res = await initChargeStatus({
			channelId: this.data.channelId,
		})
		if (res.state && res.state.code == 0) {
			//已购买信息如果为空，则没有购买
			let chargePos = res.data.chargePos
			if (chargePos) {
				this.setState({
					isPass: true,
					passTime: Math.floor((chargePos.expiryTime - new Date().getTime()) / 86400000),
					passDate: formatDate(chargePos.expiryTime)
				})
			} else {
				this.setState({
					isPass: false
				})
			}
		}
	}

	// 初始化绑定三方和关注操作
	async initFollow() {
		const kfAppId = this.props.location.query.kfAppId;
		const kfOpenId = this.props.location.query.kfOpenId;
		const auditStatus = this.props.location.query.auditStatus || '';
		const isFollow = this.props.isFollow.isFollow;
		const redEnvelopeId = this.props.location.query.redEnvelopeId || '';
		const taskCardShare = this.props.location.query.taskCardShare ? true : false
		if (kfAppId && kfOpenId) {
			// 绑定分销关系
			this.doShareBind();
			this.props.userBindKaiFang(kfAppId, kfOpenId);
		} else {
			// 绑定分销关系
			this.doShareBind();
		}
		// 链接上包含auditStatus=no_pass，关注不订阅，链接上包含auditStatus=pass，关注并且订阅，
		if (auditStatus == 'pass') {
			let businessType = taskCardShare ? 'taskCardShare' : (redEnvelopeId ? 'redEnvelope' : '')
			this.props.followLive(this.props.liveId, 'Y', auditStatus, { redEnvelopeId, businessType });
		}
	}
	// 判断是否有访问系列课的权限
	initChannelAuth() {
		// 黑名单或者被踢了
		if(this.props.blackInfo === 'live'){
			locationTo('/black.html?code=inactived');
			return false;
		}else if(this.props.blackInfo){
			locationTo(`/wechat/page/link-not-found?type=channelOut&channelId=${this.data.channelId}`);
			return false;
		}
		if (this.props.channelInfo.displayStatus === 'N' && !this.props.isAuthChannel) {
			// 如果系列课隐藏，且没有访问权限，则跳出页面；
			locationTo(`/wechat/page/topic-hide?liveId=${this.props.liveId}`);
			return false;
		}
		if (this.props.channelInfo.status !== 'Y') {
			// 如果系列课被删除了，就回到直播间主页
			if (this.props.liveId) {
				locationTo('/wechat/page/live/' + this.props.liveId);
			} else {
				locationTo('/wechat/page/mine');
			}
			return false;
		}
		if (!this.props.isAuthChannel && this.isRelay && this.props.channelInfo.upOrDown === 'down') {
			// 如果转载系列课下架了，且没有访问权限，则跳出页面；
			locationTo(`/wechat/page/topic-hide?liveId=${this.props.liveId}`);
			return false;
		}
		if (this.props.channelInfo.status !== 'Y') {
			// 如果系列课被删除了，就回到直播间主页
			if (this.props.liveId) {
				locationTo('/wechat/page/live/' + this.props.liveId);
			} else {
				locationTo('/wechat/page/mine');
			}
			return false;
		}
		if (!this.props.isAuthChannel && this.isRelay && this.props.channelInfo.upOrDown === 'down') {
			// 如果转载系列课下架了，且没有访问权限，则跳出页面；
			locationTo(`/wechat/page/topic-hide?liveId=${this.props.liveId}`);
			return false;
		}
	}

	sendPV() {
		// 手动打PV，并给页面所有事件统计加上mark字段
		if (typeof _qla !== 'undefined') {
			const mark = isFromLiveCenter() ? `ce-${this.isBought ? 'bought' : 'unbought'}` : 'be';
			const userTag = this.props.userTag || '';
			_qla('pv', {
				mark,
				userTag,
			});
			_qla.set('mark', mark);
			_qla.set('userTag', userTag);
		}
	}

	initSrollEvent() {
		this.scrollNode = findDOMNode(this.scrollWrapEl)
		this.introHeaderHeight = findDOMNode(this.refs.introHeader).clientHeight
		this.scrollNode.addEventListener('scroll', this.scrollHandle)
		setTimeout(() => {
			this.tabDom && this.computeContenHeight()
		}, 0);
	}

	// 计算内容高度 当内容不足一屏时，补充内容高度 (注：当存在tab栏时)
	computeContenHeight() {

		// 当课程切换正逆序时，内容不足滚动条会上滚，改用minHeight实现
		const wrapEl = document.querySelector('.co-scroll-to-load main');
		if (!wrapEl) return;
		const tabEl = document.querySelector('.co-scroll-to-load .tab');
		if (!tabEl) return;
		wrapEl.style.minHeight = tabEl.offsetTop + this.scrollNode.clientHeight + 'px';
		return;

	}

	@throttle(200)
	scrollHandle() {

		if (this.SlideStateTimer) {
			clearTimeout(this.SlideStateTimer)
		}

		this.SlideStateTimer = setTimeout(() => {
			this.setState({
				isScrollRolling: false
			})
		}, 300);

		const state = {}
		if (!this.state.tabStick && this.introAnchorDom && this.scrollNode.scrollTop >= (this.tabDom.offsetTop + this.scrollNode.offsetTop)) {
			state.tabStick = true
		} else if (this.state.tabStick && this.introAnchorDom && this.scrollNode.scrollTop < (this.tabDom.offsetTop + this.scrollNode.offsetTop) ) {
			state.tabStick = false
		}

		if (this.props.curCoupon.id) {
			const couponButton = findDOMNode(this.couponButtonRef);

			if (!this.couponButtonTop && couponButton) {
				this.couponButtonTop = couponButton.offsetTop + this.introAnchorDom.offsetTop
			}

			if (!this.state.isCouponBtnFixed && this.couponButtonTop && this.couponButtonTop - this.scrollNode.scrollTop <= this.introHeaderHeight) {
				state.isCouponBtnFixed = true
			} else if (this.state.isCouponBtnFixed) {
				state.isCouponBtnFixed = false
			}
		}

		if (!this.state.isScrollRolling) {
			state.isScrollRolling = true
		}

		this.setState(state)
	}

	async initGroupingInfo() {
		const {discountStatus, isHide} = this.props.marketingInfo;
		if (!this.isBought
			&& (discountStatus === 'P' || discountStatus === 'GP')
			&& isHide !== 'Y') {
			this.setState({
				showGroupingInfo: true,
			});
		}
	}

	initOperateMenuConfig() {
		let operateMenuConfig = [
			{
				name: '直播间',
				icon: 'https://img.qlchat.com/qlLive/liveComment/D5E3JM7P-OEPN-D381-1550566991002-G1POUGIS1XEH.png',
				onClick: this.onClickMore_home,
				className: 'on-log on-visible',
				'data-log-name': '更多-直播间',
				'data-log-region': 'more_live-index',
			},
			{
				name: '咨询',
				qlicon: 'consult2',
				onClick: this.onClickMore_ask,
				className: 'on-log on-visible',
				'data-log-name': '更多-咨询',
				'data-log-region': 'more_consult',
			},
			{
				name: '优惠码兑换',
				qlicon: 'ticket',
				onClick: this.onClickMore_coupon,
				className: 'on-log on-visible',
				'data-log-name': '更多-优惠码兑换',
				'data-log-region': 'more_coupon-code',
			},
			{
				key: 'collect',
				name: '收藏', 
				onClick: this.onClickMore_collect,
                icon:'https://img.qlchat.com/qlLive/business/93KFQTYR-2TGR-2QVU-1573466628029-YH7DML722ARI.png',
				className: 'collect on-log on-visible',
				'data-log-name': '更多-收藏',
				'data-log-region': 'more_collect',
			},
			{
				name: '赠好友',
				qlicon: 'present',
				onClick: this.onClickMore_gift,
				className: 'on-log on-visible',
				'data-log-name': '更多-赠好友',
				'data-log-region': 'more_gift',
			},
			{
				name: '转载',
				qlicon: 'relay',
				onClick: this.onClickMore_relay,
				className: 'on-log on-visible',
				'data-log-name': '更多-转载',
				'data-log-region': 'more_relay',
			}
		]

		// 不显示优惠码兑换
		if ((this.props.isAuthChannel && this.props.channelInfo.chargeType !== 'flexible') || this.isVip || this.props.channelInfo.isCouponOpen !== 'Y' || this.isFree) {
			operateMenuConfig = operateMenuConfig.filter(item => item.name !== '优惠码兑换')
		}

		// 不显示赠好友
		if (!this.props.chargeConfigs || !this.props.chargeConfigs[0] || !(this.props.chargeConfigs[0].amount > 0)) {
			operateMenuConfig = operateMenuConfig.filter(item => item.name !== '赠好友')
		}

		// 不显示转载
		if (this.props.relayInfo.isShowRelayTag !== 'Y') {
			operateMenuConfig = operateMenuConfig.filter(item => item.name !== '转载')
		}

		this.setState({
			operateMenuConfig,
		})

		// 已注册大于7天的用户弹出更多按钮提示
		if (this.props.userId && !getLocalStorage('NO_TOPIC_INTRO_OPERATE_MENU_TIPS')) {
			setTimeout(() => {
				const createTime = this.props.userInfo.createTime;
				if (createTime && Date.now() - createTime > 604800000) {
					this.setState({
						isShowOperateMenuTips: true,
					})
				}
			}, 1000)
		}
	}

	closeOperateMenuTips = () => {
		if (!this.state.isShowOperateMenuTips) return;

		this.setState({
			isShowOperateMenuTips: false,
		})

		setLocalStorage('NO_TOPIC_INTRO_OPERATE_MENU_TIPS', 1);
	}

	shareParamsTryListen = () => {
		if (this.props.isAuthChannel) return '';
		return this.state.auditionOpenCourse ? ('&inviteAuditionUserId=' + getCookie('userId')) : ''
	}

	chooseShareReset(){
		if(this.tracePage === 'coral'){
			this.initCoralShare();
		}else{
			this.initShare();
		}
	}


	/**
	 * 获取直播间配置
	 *
	 * @returns
	 * @memberof Channel
	 */

	async initLiveConfig() {
		if (this.data.liveConfig) {
			return this.data.liveConfig;
		}
		let config = await getLiveStudioTypes({ liveId: this.props.liveId });
		this.data.liveConfig = getVal(config,'data',{});
		return config
	}

	async initShare() {
        // 一元解锁
        if(this.props.chargeConfigs && this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus == 'UNLOCK') {
            let unlockCourseInfo = this.props.unlockCourseInfo
            let channelInfo = this.props.channelInfo
            share({
                title: unlockCourseInfo.shareTitle || `嘀！入学报道！我在学《${channelInfo.name}》`,
                timelineTitle: unlockCourseInfo.shareTitle || `嘀！入学报道！我在学《${channelInfo.name}》`,
                desc: unlockCourseInfo.shareContent || `通过我分享的链接${unlockCourseInfo.discountAmount || 1}元报名,活动结束立刻恢复原价!`,
                imgUrl: unlockCourseInfo.shareImage || channelInfo.headImage,
                shareUrl: fillParams({unlockUserId: this.props.userInfo.userId, isUnHome: 'N'}, window.location.href),
            })
            return
        }

		let wxqltitle = this.props.channelInfo.name;
		// 分享的描述语被富文本编辑过的直接写死为“点击看好课>>>”
		let descript = this.props.channelSummary ? '点击看好课>>>' : this.props.channelInfo.description;
		let wxqlimgurl = imgUrlFormat(this.props.channelInfo.headImage, '?x-oss-process=image/resize,w_100,h_100,limit_1');
		let friendstr = wxqltitle;
		// let shareUrl = window.location.origin + this.props.location.pathname + `?channelId=${this.data.channelId}`;
		wxqlimgurl=shareBgWaterMark(wxqlimgurl,'study');

		// 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + `?channelId=${this.data.channelId}` + this.shareParamsTryListen();
		let pre = `/wechat/page/live/${this.props.channelInfo.liveId}?isBackFromShare=Y&wcl=middlepage`;

		const shareObj = randomShareText({
			title: wxqltitle,
			timelineTitle: friendstr,
			desc: descript,
            shareUrl: target,
        })


		if (this.props.myShareQualify && this.props.myShareQualify.shareKey && this.props.myShareQualify.type === 'channel') {
			shareObj.title = "我推荐-" + shareObj.title;
			shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
			shareObj.shareUrl += "&shareKey=" + this.props.myShareQualify.shareKey + "&sourceNo=link";
		} else if (this.props.myShareQualify && this.props.myShareQualify.shareKey && this.props.myShareQualify.type === 'live') {
			shareObj.title = "我推荐-" + shareObj.title;
			shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
			shareObj.shareUrl += "&lshareKey=" + this.props.myShareQualify.shareKey + "&sourceNo=link";
		} else if (this.state.auditionOpenCourse && !this.props.myShareQualify) {
			shareObj.title = this.props.channelInfo.name;
			shareObj.desc = `${this.props.userInfo.name}送你一堂试听课`,
			shareObj.timelineTitle  = shareObj.title;
			imgUrl = this.props.channelInfo.headImage
		} else {
			shareObj.shareUrl += "&sourceNo=link";
		}

		if (this.props.userId && this.props.platformShareRate) {
			shareObj.shareUrl += "&wcl=pshare&psKey=" + this.props.userId;
		}

		/* 从微信活动页跳转过来的，分享过程url要去掉isFromWechatCouponPage，否则支付金额将错误*/
		shareObj.shareUrl = fillParams({isUnHome: 'N'}, shareObj.shareUrl, ['isFromWechatCouponPage', 'kfOpenId', 'kfAppId', 'auditStatus']);
		/*****/
		/* 带参wcl和ch，两者保留 */
		if (this.props.location.query.ch) {
			shareObj.shareUrl = fillParams({ ch: this.props.location.query.ch, isUnHome: 'N' }, shareObj.shareUrl);
		}
		if (this.props.location.query.wcl) {
			shareObj.shareUrl = fillParams({ wcl: this.props.location.query.wcl, isUnHome: 'N' }, shareObj.shareUrl);
		}
		/*****/

		if (this.props.location.query.psKey || await this.isQlLive()) {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
		}
		
        
		// 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
		shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

		// 拉人返现需要重新配置
		// if (this.state.showBackTuitionBanner) {
		// 	let userInfo = await this.getUserInfo()
		// 	wxqltitle = `${userInfo.name}等你一起听`
		// 	descript = `课程标题《${this.props.channelInfo.name}》`
		// 	shareUrl = `${window.location.protocol}//${window.location.host}/wechat/page/channel-intro?${type}Id=${data.id}&missionId=${missionId}`
		// }
        console.log('分享信息: ', shareObj)
		let shareOptions = {
            ...shareObj,
			imgUrl: wxqlimgurl,
			successFn: this.onShareComplete,
		}
		share(shareOptions);
	}

	// 分享成功回调使用
	async onShareComplete() {

		// 学分任务达成触发点
		uploadTaskPoint({
			assignmentPoint: 'grow_share_course',
		})

		/** 珊瑚来源不引导关注 */
		if (this.tracePage == "coral") {
			return false;
		}

		let shareMoney, distribution;
		distribution = !!this.distributionPercent;
		if (this.props.marketingInfo.discountStatus !== 'N') {
			shareMoney = this.props.chargeConfigs[0].discount * 100
		} else {
			shareMoney = this.props.chargeConfigs[0].amount * 100
		}
		if (isFromLiveCenter() && this.props.platformShareRate) {
			distribution = true;
			shareMoney = shareMoney * (this.props.platformShareRate / 100)
		} else {
			shareMoney = shareMoney * (this.distributionPercent / 100)
		}
		this.setState({
			shareMoney,
		})

		/**
		 * shareDistribution: 有分销的分享二维码弹窗
		 * shareNoDistribution: 无分销的分享二维码弹窗
		 */
		this.setState({
			followDialogType: distribution ? 'shareDistribution' : 'shareNoDistribution'
		})

		// C端有分销弹1007，无分销走三方导粉配置
		if (distribution) {
			// 判断是否为白名单
			let config;
			if (!this.data.liveConfig) {
				config = await this.initLiveConfig();
			} else {
				config = this.data.liveConfig;
			}
			if (!this.props.isSubscribe && config.data.isWhite === 'N') {
				let qrcodeUrl
				if (!this.state.qrcodeUrl) {
					qrcodeUrl = await this.props.getQrCode({
						channel: '1007',
						channelId: this.data.channelId,
						liveId: this.props.liveId,
						showQl: 'Y'
					})
					if (qrcodeUrl) {
						const followDialogOption = this.state.followDialogOption
						followDialogOption.traceData = 'channelShareFocusQrcode',
							followDialogOption.channel = '1007'
						this.setState({
							qrcodeUrl,
							followDialogOption
						}, () => {
							this.introQrCodeDialogDom.show()
						})
					}
				}

			}
		} else {
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
			if (res) {
				const followDialogOption = this.state.followDialogOption
				followDialogOption.appId = res.appId
				followDialogOption.traceData = 'channelShareFocusQrcode',
					followDialogOption.channel = '116'
				this.setState({
					qrcodeUrl: res.url,
					followDialogOption
				}, () => {
					this.introQrCodeDialogDom.show()
				})
			}
		}
	}

	onClickCloseQrCodeDialog() {
		this.introQrCodeDialogDom.hide();
		if (this.state.existLiveCommunity) {
			this.setState({
				showCommunityGuideModal: true,
				modalType: 'joinCommunity'
			});
		}
	}

	initCoralShare() {
		let wxqltitle = '我推荐-' + this.props.channelInfo.name;
		let descript = this.props.channelInfo.description;
		let wxqlimgurl = imgUrlFormat(this.props.channelInfo.headImage, '?x-oss-process=image/resize,w_100,h_100,limit_1');
		let friendstr = wxqltitle;
		//let shareUrl = window.location.origin + this.props.location.pathname + `?channelId=${this.data.channelId}&officialKey=${this.props.userId}&pro_cl=coral`;

		if (this.state.auditionOpenCourse && !this.props.myShareQualify) {
			title = this.props.channelInfo.name;
			desc = `${this.props.userInfo.name}送你一堂试听课`,
			timelineTitle = title;
			imgUrl = this.props.channelInfo.headImage
		}
		// 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + `?channelId=${this.data.channelId}&officialKey=${this.props.userId}&pro_cl=coral` + this.shareParamsTryListen();;
		const pre = `/wechat/page/live/${this.props.channelInfo.liveId}?isBackFromShare=Y&wcl=middlepage`;

		/* 从微信活动页跳转过来的，分享过程url要去掉isFromWechatCouponPage，否则支付金额将错误*/
		target = fillParams({isUnHome: 'N'}, target, ['isFromWechatCouponPage', 'kfOpenId', 'kfAppId', 'auditStatus']);

		// 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
		const shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(target))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

		share({
			title: wxqltitle,
			timelineTitle: friendstr,
			desc: descript,
			imgUrl: wxqlimgurl,
			shareUrl: shareUrl,
		});
	}

	async initShareCut() {
		if (this.props.marketingInfo.discountStatus === 'K' && this.props.marketingInfo.startTime <= this.props.sysTimestamp && this.props.marketingInfo.endTime > this.props.sysTimestamp) {
			let leftSecond = Math.floor((this.props.marketingInfo.endTime - this.props.sysTimestamp) / 1000);

			this.setState({
				isWithinShareCut: true,
				scDay: ~~(leftSecond / (3600 * 24)),
				scHours: ~~(leftSecond % (3600 * 24) / 3600),
				scMinutes: ~~(leftSecond % 3600 / 60),
			});

			this.shareCutCountDownTimer = window.setInterval(_ => {
				if (leftSecond <= 0) {
					clearInterval(this.shareCutCountDownTimer);
					this.setState({
						isWithinShareCut: false
					});
					return false;
				}
				leftSecond--;
				if (leftSecond < 120 && leftSecond > 0) {
					return false;
				}
				this.setState({
					scDay: ~~(leftSecond / (3600 * 24)),
					scHours: ~~(leftSecond % (3600 * 24) / 3600),
					scMinutes: ~~(leftSecond % 3600 / 60),
				});
			}, 1000);
		}
		if (this.props.shareCutCourseInfo.personNum) {
			let domainResult = await this.props.getDomainUrl({
				type: 'shareCut',
			});
			this.setState({
				shareCutDomain: domainResult.data.domainUrl,
			})
		}
	}

	/**
	 * 绑定直播间分销关系
	 */
	async doShareBind() {
		// 存在分销参数，则注入到请求参数中
		let lshareKey = this.props.location.query.lshareKey;
		let taskCardShare = this.props.location.query.taskCardShare === 'Y' ? true : false;

		if (taskCardShare || lshareKey) {
			const result = await this.props.bindLiveShare({
				liveId: this.props.channelInfo.liveId,
				shareKey: lshareKey,
				sourceNo: taskCardShare ? 'taskCardShare' : (isFromLiveCenter() || this.props.location.query.sourceNo === 'livecenter') ? 'livecenter' : '',
			});

			// 绑定成功时触发事件日志
			if (result && result.data && result.data.bind === 'Y') {
				eventLog({
					category: 'shareBind',
					action: 'success',
					business_id: this.data.channelId,
					business_type: 'channel',
				});
			}
		}

		if (this.props.location.query.officialKey) {
			this.props.bindOfficialKey({
				officialKey: this.props.location.query.officialKey
			});
		}
	}

	async initMemberBlock() {

		const params = {
			businessId: this.props.channelInfo.channelId,
			businessType: "channel",
			shareKey: this.props.location.query.shareKey || "",
			officialKey: this.props.location.query.officialKey || '',
		}
		if (!this.props.isMember) {
			params.isCend = isFromLiveCenter() ? 'Y' : 'N'
		}

		let res = await this.props.isShowMemberLine(params)

		if (res.state.code === 0) {
			this.setState({
				memberCourseType: res.data.memberCourseType,
				memberCourseReceive: res.data.isMemberSendCourse === 'Y',
				canRelayChannelMemberDiscount: res.data.canRelayChannelMemberDiscount === 'Y'
			})
		}
	}

	/**
	 * 首个有效的价格配置信息
	 */
	get chargeConfig() {
		if (this.props.chargeConfigs.length) {
			return this.props.chargeConfigs.filter(config => {
				return config.status === 'Y';
			})[0] || null
		} else {
			return null;
		}
	}

	/**
	 * 是否免费系列课
	 */
	get isFree() {
		return this.chargeConfig && this.props.channelInfo.chargeType === 'absolutely' && this.chargeConfig.amount === 0;
	}

	/**
	 * 是否转载
	 */
	get isRelay() {
		return this.props.channelInfo.isRelay === 'Y';
	}

	/**
	 * 是否vip
	 */
	get isVip() {
		return this.props.vipInfo.isVip === 'Y' || this.props.vipInfo.isCustomVip === 'Y'
	}

	/**
	 * 获取课代表分成比例，可以用于判断课程授权分销，直播间授权分销，自动分销
	 */
	get distributionPercent() {
		return (this.props.myShareQualify && this.props.myShareQualify.shareEarningPercent) || '';
	}

	/**
	 * 获取珊瑚计划分成比例
	 */
	get coralPercent() {
		return this.props.coral.sharePercent
	}

	/**
	 * 是否已购买
	 */
	get isBought() {
		return this.props.isAuthChannel || (this.props.vipInfo && (this.props.vipInfo.isVip === 'Y' || this.props.vipInfo.isCustomVip === 'Y'))
	}

	initTopicList() {
		return this.fetchTopicList();
	}

	async fetchTopicList(isContinue) {
		const isTopicListDesc = this.state.isTopicListDesc;
		const stateKey = isTopicListDesc ? 'topicListDesc' : 'topicList';
		const asyncObj = this.state[stateKey];

		if (/pending|end/.test(asyncObj.status)) return;

		let pageNum = isContinue && asyncObj.pageNum ? asyncObj.pageNum + 1 : 1;

		this.setState({
			[stateKey]: {
				...asyncObj,
				status: 'pending',
			}
		})

		return request({
			url: '/api/wechat/channel/topic-list',
			body: {
				channelId: this.props.channelId,
				liveId: this.props.liveId,
				clientType: 'weixin',
				pageSize: asyncObj.pageSize,
				pageNum,
				asc: isTopicListDesc ? 'N' : '',
				displayStatus: '',
				showDisplay: 'N'
			},
		}).then(res => {
			if (res.state.code) throw Error(res.state.msg);
            const userUnlockProcess = res.data.userUnlockProcess || {}
			const list = res.data.topicList || [];
			const newData = isContinue ? (this.state[stateKey].data || []).concat(list) : list;

			// 设置序号
			if (isTopicListDesc) {
				let indexNum = this.props.channelInfo.topicNum || newData.length;
				newData.forEach((item, index) => {
					item.indexNum = indexNum--;
				})
			} else {
				newData.forEach((item, index) => {
					item.indexNum = index + 1;
				})
			}

			this.setState({
				[stateKey]: {
					...this.state[stateKey],
					status: list.length < asyncObj.pageSize ? 'end' : 'success',
					data: newData,
					pageNum,
				},
                userUnlockProcess
			})

			// 获取首节试听课程
			if (!isTopicListDesc && !this.state.auditionOpenCourse) {
				this.isAuditionOpen = false;
				list.some(t => {
					if (t.isAuditionOpen === 'Y') {
						this.isAuditionOpen =true;
						this.setState({
							auditionOpenCourse: t
						});
						return true;
					}
				});
			}

		}).catch(err => {
			console.error(err);
			this.setState({
				[stateKey]: {
					...this.state[stateKey],
					status: '',
				}
			})
		}).then(()=>{
			if(this.isAuditionOpen){
				this.chooseShareReset()
			}
		});
	}

	async loadMoreCourse(next) {
		if (this.state.currentTab == 'evaluate') {
			await this.loadEvaluateList(true);
		}
		if (this.state.currentTab == 'course') {
			await this.fetchTopicList(true);
		}
		next();
	}

	get isNoMore() {
		switch (this.state.currentTab) {
			case 'course':
				return this.isNoMoreCourse
			case 'evaluate':
				return this.getEvaluationListObj().status === 'end'
			default:
				return true
		}
	}

	get isNoMoreCourse() {
		return this.getTopicListObj().status === 'end';
	}

	get isDisable() {
		if (this.state.currentTab === 'evaluate' && this.getEvaluationListObj().status === 'end') return true;
	}

	initIsCollected = async () => {
		const result = await this.props.isCollected({
			type: "channel",
			businessId: this.data.channelId
		})
		if (result && result.data && result.data.isCollected === 'Y') {
			this.changeCollectedStatus(true);
		}
	}

	changeCollectedStatus = isCollected => {
		let operateMenuConfig = [...this.state.operateMenuConfig];
		operateMenuConfig = operateMenuConfig.map(item => item.key === 'collect' ? {
			key: 'collect',
			name: isCollected ? '取消收藏' : '收藏',
            icon:isCollected ? 'https://img.qlchat.com/qlLive/business/AG18WY99-L4BC-CYNB-1573466648685-SSY5HKX35149.png':'https://img.qlchat.com/qlLive/business/93KFQTYR-2TGR-2QVU-1573466628029-YH7DML722ARI.png',
			onClick: this.onClickMore_collect,
			className: isCollected ? 'collect collected on-log on-visible' : 'collect on-log on-visible',
			'data-log-name': isCollected ? '更多-取消收藏' : '更多-收藏',
			'data-log-region': isCollected ? 'more_cancel-collect' : 'more_collect',
		} : item);
		this.setState({
			operateMenuConfig,
			isCollected
		})
	};


	/**
	 * 是否自动购买系列课
	 */
	async isAutoPay() {
		// 如果页面会弹出领取优惠券，则不调起自动支付
		let isCouponResult = await this.props.isCouponResult;
	
		if (this.isBought || this.isPeriodEnd || !isCouponResult) return
		const autopay = this.props.location.query.autopay;
		if (autopay === 'Y' &&
			!(this.props.vipInfo && this.props.vipInfo.isVip === 'Y' || this.props.power.allowMGLive)) {

			autopay === 'Y' && window.history.replaceState(null, null, location.pathname + location.search.replace('&autopay=Y', ''))

			if (Detect.os.phone) {
				wx.ready(() => {
					this.handleBuyBtnClick()
				});
			} else {
				setTimeout(() => {
					this.handleBuyBtnClick()
				}, 1000);
			}
		}
	}

	/**
	 * 检查是否需要填表
	 */
	async checkUser() {
		// 因为可能续费，所以购买了系列课还是可以填表的
		if (this.props.power.allowMGLive||!this.props.userId) {
			return;
		}

		let config = await this.props.checkUser({ liveId: this.props.channelInfo.liveId, businessType: 'channel', businessId: this.props.location.query.channelId });
		if (config) {
			this.setState({
				notFilled: config
			})
			if (sessionStorage.getItem("passCollect") == config.id) {
				if (sessionStorage.getItem("saveCollect") == config.id && !this.props.isAuthChannel) {				
					// 需要判断是否是拼课的内容 自己创建拼课 createGroup 还是 拼进别人的课joinGroup
					if (sessionStorage.getItem("channelGroupCreate") == 1) {
						this.createGroup()
						sessionStorage.removeItem("channelGroupCreate")
					} else if (sessionStorage.getItem("channelGroupOther")) {
						let channelGroupOther = null
						try {
							channelGroupOther = JSON.parse(sessionStorage.getItem("channelGroupOther"))
							if (channelGroupOther && channelGroupOther.groupId) {
								this.joinGroup(channelGroupOther.groupId, channelGroupOther.discount)
							}
							sessionStorage.removeItem("channelGroupOther")
						} catch (error) {
							this.handleBuyBtnClick()
						}
					} else {	
						this.handleBuyBtnClick();
					}
					sessionStorage.removeItem("saveCollect");
				}
			}
		}
	}

	/**
	 * =========================== 拼课相关 ================================
	 */

	/*点击发起拼课*/
	createGroup() {
		const discountStatus = this.props.marketingInfo.discountStatus || '';
		let groupStatus = this.props.currentGroupInfo.groupStatus
		let payType = ''
		let groupId = ''
		// 一开始都没有 或者 已结束 或者 拼满了
		if (!groupStatus || groupStatus == "OVER" || groupStatus == "PASS") {
			payType = 'group_leader'
		} else {
			groupId = this.props.location.query.groupId
		}
		const {
			notFilled
		} = this.state
		// 如果没填过表且不是跳过填表状态 则需要填表 表单前置
		if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
			sessionStorage.setItem('channelGroupCreate', 1)
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&discount=P${discountStatus === 'P' ? '&auth=Y' : ''}`);
			return;
		}

		if (discountStatus === 'P') {
			this.refs.createFreeGroupConfirmDialog.show(); // 放开二次拼团弹框直接拼团
		} else if (discountStatus === 'GP') {
			this.props.doPay({
				liveId: this.props.channelInfo.liveId,
				chargeConfigId: this.chargeConfig.id,
				total_fee: this.chargeConfig.discount,
				channelNo: this.data.sourceNo,
				type: 'CHANNEL',
				payType,
				topicId: '0',
				groupId,
				ch: this.props.location.query.ch || this.props.location.query.wcl || '',
				shareKey: this.props.location.query.shareKey || '',
				officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey : (this.props.location.query.source == "coral" || this.tracePage == "coral" ? this.props.userId : ""),
				psKey: (this.props.platformShareRate && this.props.location.query.psKey && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? this.props.location.query.psKey : '',
				psCh: (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : '',
				callback: async () => {

					if (this.props.location.query.sourceNo === 'link') {
						this.props.countSharePayCache(this.props.chargeConfigs[0].discount * 100);
					}

					let result = await this.props.getOpenPayGroupResult(this.props.channelInfo.channelId);
					let jumpUrl = ''
					if (result.state.code === 0) {
						jumpUrl = `/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${result.data.channelGroupPo.id}&type=sponser`
					} else {
						window.toast(result.state.msg)
					}
					
					// 如果没填过表且不是跳过填表状态 则需要填表 表单后置
					if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != notFilled.id) {
						locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}${discountStatus === 'P' ? '&auth=Y' : ''}${jumpUrl ? '&jumpUrl=' + encodeURIComponent(jumpUrl) : ''}`);
					} else {
						jumpUrl && locationTo(jumpUrl)
					}

				},
				onCancel: this.onCancelPayment
			});
		}
	}

	updateChannelGroupingList() {
		this.props.updateChannelGroupingList(this.data.channelId)
	}

	onCloseFreeGroupConfirmDialog() {
		this.refs.createFreeGroupConfirmDialog.hide();
	}

	async getGroupResult() {
		let result = await request({
			url: '/api/wechat/channel/getGroupResult',
			body: {
				channelId: this.data.channelId
			}
		})
		if (result.state.code == 0) {
			this.setState({
				groupResult: result.data
			})
		} else {
			this.setState({
				groupResult: {}
			})
		}
	}

	async joinOtherGroup(groupId, discount) {
		let res = this.state.groupResult
		// 判断用户是否参团
		// 为空 说明没有参加过
		// 有ID了 说明参加过
		// result: FAIL 可以参加
		if (!res || res.result === 'FAIL' || !res.groupId) {
			this.joinGroup(groupId, discount)
		} else if (res.groupId) {
			window.toast('您已经参加当前课程的拼团，拼团期间不能拼其他团')
		}
	}

	// 加入已开的拼团
	async joinGroup(groupId, discount) {
		const { discountStatus = '' } = this.props.marketingInfo;
		const {
			notFilled
		} = this.state
		// 如果没填过表且不是跳过填表状态 则需要填表 表单前置
		if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
			sessionStorage.setItem('channelGroupOther', JSON.stringify({ groupId, discount }))
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}${discountStatus === 'P' ? '&auth=Y' : ''}`);
			return;
		}
		this.props.doPay({
			liveId: this.props.channelInfo.liveId,
			chargeConfigId: this.chargeConfig.id,
			total_fee: discount || this.chargeConfig.discount,
			channelNo: this.data.sourceNo,
			type: 'CHANNEL',
			topicId: '0',
			ch: this.props.location.query.ch || this.props.location.query.wcl || '',
			shareKey: this.props.location.query.shareKey || '',
			groupId: groupId,
			officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey : (this.props.location.query.source == "coral" || this.tracePage == "coral" ? this.props.userId : ""),
			psKey: (this.props.platformShareRate && this.props.location.query.psKey && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? this.props.location.query.psKey : '',
			psCh: (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : '',

			callback: async () => {
				if (this.props.location.query.sourceNo === 'link') {
					this.props.countSharePayCache(this.props.chargeConfigs[0].discount * 100);
				}
				this.checkGroupFunc(groupId);
			},
			onCancel: this.onCancelPayment
		});
	}

	async checkGroupFunc(groupId) {
		let result = await this.props.getChannelGroupResult(this.data.channelId, groupId);
		let jumpUrl = ''
		if (result.data.result == "SUCCESS") {
			jumpUrl = `/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${groupId}&type=success`
		}

		const {
			notFilled
		} = this.state
		// 如果没填过表且不是跳过填表状态 则需要填表 表单后置
		if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != notFilled.id) {
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}${discountStatus === 'P' ? '&auth=Y' : ''}${jumpUrl ? '&jumpUrl=' + encodeURIComponent(jumpUrl) : ''}`);
		} else {
			if (result.data.result == "SUCCESS") {
				setTimeout(() => {
					locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${groupId}&type=success`);
				}, 150);
			}
			else {
				setTimeout(() => {
					window.location.reload(true);
				}, 150);
			}
		}
	}

	/* 点击立即发起拼课按钮事件*/
	async onConfirmCreateFreeGroupClick() {

		const result = await this.props.channelCreateGroup(this.data.channelId);
		if (result.state.code === 0) {
			logGroupTrace({
				id: this.data.channelId,
				type: 'channel',
			});
			window.toast('发起拼团成功');
			const result = await this.props.getMyGroupInfo({
				channelId: this.data.channelId
			});
			const groupId = getVal(result, 'data.channelGroupPo.id', '');
			locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${groupId}&type=sponser`);
		} else {
			window.toast(result.state.msg);
		}
	}

	/**
	 * ------------------------------------------ /结束拼课相关 -----------------------------------------------------
	 */

	/**
	 * ------------------------------------------ 开始请好友免费听相关 -----------------------------------------------------
	 */

	// 初始化请好友免费听状态
	async checkShareStatus() {
		/**
         * 请好友免费听的用户的条件是：
         * 1、开启了邀请分享功能且还有剩余名额
         * 2、系列课是付费的且自己已经购买，或者自己是vip
		 * 3、该话题列表长度大于0
         */
		if ((this.props.isAuthChannel && !this.isFree || this.isVip) && this.state.topicList.data && this.state.topicList.data.length) {
			const result = await checkShareStatus({ channelId: this.data.channelId })
			if (result.state.code === 0) {
				this.setState({
					canInvite: result.data.isOpenInviteFree === 'Y' && result.data.remaining > 0,
				})
			}
		}
	}

	// 加载更多课程
	async loadMoreInviteCourse(next) {
		await this.fetchTopicList(true);
		next();
	}

	// 打开请好友免费听弹窗（首先获取分享id）
	async openInviteFriendsToListenDialog(topicObj) {
		const result = await fetchShareRecord({
			channelId: this.data.channelId,
			topicId: topicObj.id
		})
		if (result.state.code === 0) {
			this.setState({ inviteFreeShareId: result.data.inviteFreeShareId })
			this.inviteFriendsToListenDialog.show(topicObj, this.state.showBackTuitionBanner ? this.data.missionDetail : null)
		}
	}


	/**
	 * ------------------------------------------ 结束请好友免费听相关 -----------------------------------------------------
	 */

	/**
	 * ------------------------------------------ 开始拉人返学费相关 -----------------------------------------------------
	 */



	// 打开返学费弹窗
	openBackTuitionDialog = () => {
		this.backTuitionDialogEle.show({
			inviteTotal: this.data.missionDetail.inviteTotal,
			returnMoney: this.data.missionDetail.returnMoney,
			expireTime: this.data.missionDetail.expireTime,
			missionId: this.data.missionDetail.missionId,
			data: this.props.channelInfo,
			type: 'channel'
		})
	}

	// 获取返学费信息
	initInviteReturnInfo = async () => {
		await request({
			url: '/api/wechat/transfer/h5/invite/return/inviteReturnInfo',
			body: {
				businessId: this.data.channelId,
				businessType: 'channel',
			}
		}).then(async (res) => {
			if (res.state.code) throw Error(res.state.msg)
			if (res.data) {
				let showBackTuitionBanner = false
				let showBackTuitionLabel = false
				let inviteReturnConfig = {}
				if (res.data.canInviteReturn == 'Y' && res.data.hasMission == 'Y') {
					let missionDetail = res.data.missionDetail
					this.data.missionDetail = missionDetail
					if (missionDetail.status == 'N' && missionDetail.expireTime > Date.now()) {
						showBackTuitionBanner = true
					}
					// B端开启了，C端未开始任务，未购买且不是受邀者（受邀者链接上带有inviteReturnCouponId和couponType）
				} else if (res.data.canInviteReturn == 'Y' && res.data.hasMission == 'N' && !this.props.isAuthChannel
					&& !this.props.location.query.inviteReturnCouponId && !this.props.location.query.couponType) {
					showBackTuitionLabel = true
					inviteReturnConfig = res.data.inviteReturnConfig
				}

				this.setState({ showBackTuitionBanner, showBackTuitionLabel, inviteReturnConfig })
				let coupon = {}
				if (showBackTuitionLabel || showBackTuitionBanner) {
					// 获取显示在介绍页的优惠码
					coupon = await this.getCouponForIntro()
					let inviteReturnCouponMoney = get(coupon, 'money', 0)
					this.setState({
						inviteReturnCouponMoney: formatMoney(inviteReturnCouponMoney)
					})
				}
				// 拉人返现需要重置分享
				if (showBackTuitionBanner) {
					this.backTuitionDialogEle.initShare({
						data: this.props.channelInfo,
						missionId: this.data.missionDetail.missionId,
						type: 'channel',
					})
				}
			}
		}).catch(err => {
			console.log(err);
		})
	}

	// 获取限时特价
	fetchSalePrice() {
		let salePrice = 0
		let charge = this.props.chargeConfigs[0]
		salePrice = this.props.discountExtendPo.showDiscount ? charge.discount : charge.amount;
		return salePrice
	}

	// 获取显示在介绍页的优惠码
	getCouponForIntro = async () => {
		return new Promise(async (resolve) => {
			await request({
				url: '/api/wechat/transfer/h5/coupon/queryCouponForIntro',
				body: {
					businessId: this.data.channelId,
					businessType: 'channel',
				}
			}).then(res => {
				if (res.state.code) throw Error(res.state.msg)
				let codePo = get(res, 'data.codePo', {})
				resolve(codePo)
			}).catch(err => {
				console.error(err)
				resolve({})
			})
		})
	}
	/**
	 * ------------------------------------------ 结束拉人返学费相关 -----------------------------------------------------
	 */
	/**
	 * ============================================ 购买相关 =========================================
	 */

	async initCoupon() {
		if (isLogined()) {
			if (this.chargeConfig.amount > 0 && (!this.props.isAuthChannel || this.props.channelInfo.chargeType === 'flexible')) {
				// 未付费，或者已付费的按月收费系列课，获取优惠券列表
				await this.getCoupons()
			}
	
			// 针对自媒体转载系列课优惠券
			if (this.chargeConfig.amount > 0 && this.props.channelInfo.isRelay === 'Y' && !this.props.isAuthChannel) {
				await this.getCoupons();
			}
		}
		this.setState({
			mountBottomPurchasePanel: true,
		})
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

	/** 是否可以领取优惠券，未付费和按月直播间、非转播、非管理员可以领取 */
	get isCanReceiveCoupon() {
		return (!this.props.isAuthChannel || (this.props.isAuthChannel && this.props.channelInfo.chargeType === 'flexible')) && this.props.channelInfo.isRelay != 'Y' && !this.props.power.allowMGLive
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

	onGotoSet() {
		locationTo(`/live/channelCoupon/codeList.htm?channelId=${this.data.channelId}`);
	}

	// 任务邀请卡自动报名
	async authTaskCard() {
		const result = await channelTaskCardAuth({
			s: this.props.location.query.s,
			t: this.props.location.query.t,
			sign: this.props.location.query.sign,
			channelId: this.data.channelId,
		})
		if (result.state.code === 0) {
			this.onSuccessPayment('Y');
		}
	}

	// 系列课支付
	payChannel(chargeConfigId, amount) {
		// 判断是否购买了其他转载课 则不重复购买
		if (this.props.alreadyBuyChannelId && (this.props.alreadyBuyChannelId != this.data.channelId)) {
			this.refs.haveBoughtDialog.show();
			return;
		}

		const {
			notFilled
		} = this.state
		// 如果没填过表且不是跳过填表状态 则需要填表 表单前置
		if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelCouponStatus.couponId || this.data.targetCouponId || ''}${amount === 0 ? '&auth=Y' : ''}`);
			return;
		}

		let couponId = '';
		let couponType = '';
		let curCoupon = this.props.curCoupon;
		if (curCoupon.couponType !== 'app' && curCoupon.useRefId) {
			couponId = curCoupon.useRefId;
			couponType = curCoupon.couponType;
		}

		// 一元解锁的情况下
		if (this.props.chargeConfigs && this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === 'UNLOCK') {
            couponId = ''
            couponType = ''
        }

		const isOpenMemberBuy = this.props.isMember && this.props.isMemberPrice && this.tracePage !== "coral"
		// 拉人返学费的missionId
		let missionId = this.props.location.query.missionId || this.data.missionDetail && this.data.missionDetail.missionId || ''
		/* 购买系列课*/
		let payType = this.chargeConfig.discountStatus == 'UNLOCK' ? 'unlock' : isOpenMemberBuy ? 'MEMBER_COURSE' : ''
		
        this.props.doPay({
			missionId: missionId,
			liveId: this.props.channelInfo.liveId,
			chargeConfigId: chargeConfigId || this.chargeConfig.id,
			total_fee: 0,
			channelNo: this.data.sourceNo,
			type: 'CHANNEL',
			topicId: '0',
			payType: payType,
			ch: this.props.location.query.ch || this.props.location.query.wcl || '',
			shareKey: !this.state.showBackTuitionBanner && this.props.location.query.shareKey || '',// 有拉人返学费资格的时候支付不允许带上分销的shareKey
			couponId,
			couponType,
			officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey : (this.props.location.query.source == "coral" || this.tracePage == "coral" ? this.props.userId : ""),
			redEnvelopeId: this.props.location.query.redEnvelopeId, // 课堂红包id
			/**是否上一个页面来着微信活动页面Y=是N=不是 */
			isFromWechatCouponPage: this.props.location.query.isFromWechatCouponPage || '',
			psKey: (this.props.platformShareRate && this.props.location.query.psKey && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? this.props.location.query.psKey : '',
			psCh: (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : '',
			/******/
			callback: async (orderId) => {
				// 支付完成之后传一个orderId用于返学费的跳转
				this.onSuccessPayment('N', orderId);
			},
			onPayFree: (result) => {
				window.toast(this.data.reNewTip ? '续费成功' : '报名成功');

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
	    if (this.chargeConfig.discountStatus === 'UNLOCK') {
	        this.handleShowFissionDialog()
	        return
        }
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

	async gotoCommunity(params) {
		try {
			let result = await request({
				url: '/api/wechat/community/getByBusiness',
				method: 'POST',
				body: params
			})
			if (result.state.code == 0) {
				return {
					showStatus: result.data.showStatus,
					communityCode: result.data.communityCode
				}
			} else {
				console.log(result.state.msg);
				return {}
			}
		} catch (error) {
			console.error(error)
			return {}
		}
	}

	// 支付完成
	async onSuccessPayment(payFree, orderId = '') {
		this.props.updateChannelAuth();

		const {
			notFilled
		} = this.state
		// 插入最新表单后置业务 如有表单填写 则把链接跳转|二维码展示 统统放到表单之后执行
		const isGoForm = notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != notFilled.id

		// 如果是一元购解锁课
        if (this.chargeConfig.discountStatus === 'UNLOCK') {
            // 切换tab
            this.tabHandle("course")
            // 获取是否已经关注
            let isFollow = await isSubscribeAppId({
                appId: this.props.unlockCourseInfo.appId
            }).then(res => {
                if(res.state.code == 0) {
                    return res.data.isSubScribe === 'Y'
                }
            }).catch(err => {
                return false
			})
			
			if (isGoForm) {
				locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelCouponStatus.couponId || this.data.targetCouponId || ''}${payFree === 'Y' ? '&auth=Y' : ''}${
					!isFollow ? `&jumpUrl=${encodeURIComponent(`/wechat/page/fission-finish-pay?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&appId=${this.props.unlockCourseInfo.appId}`)}` : ''
				}`);
			} else {
				if (!isFollow) {
					locationTo(`/wechat/page/fission-finish-pay?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&appId=${this.props.unlockCourseInfo.appId}`)
				} else {
					this.props.fetchChannelInfo({
						channelId: this.data.channelId
					})
					this.fetchUnlockProgress()
					setTimeout(() => {
						window.location.reload(true);
					}, 150);
				}
			}
			return
		}
		this.setState({
			isOpenPayDialog: false,
			showGroupingInfo: false,
		});

		// 最新导粉逻辑调整(12/25)
		// 如果有配置支付后跳转链接
		// 则跳转 不执行后面导粉逻辑
		const resLink = await this.props.ifGetCousePayPasterLink({
			businessId: this.data.channelId,
			type: 'channel'
		})

		if (resLink) {
			if (isGoForm) {
				locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelCouponStatus.couponId || this.data.targetCouponId || ''}${payFree === 'Y' ? '&auth=Y' : ''}${
					`&jumpUrl=${encodeURIComponent(resLink)}`
				}`);
			} else {
				locationTo(resLink)
			}
			return
		}

		/**
         * 支付报名成功后引导关注千聊
		 * 优先：新训练营引导关注公众号
         * 1、珊瑚来源的支付成功后，优先走珊瑚逻辑， 判断是否关注珊瑚公众号，没关注则返回珊瑚公众号二维码
		 * 2、珊瑚之后，判断是否有参与返学费的，有的话跳转到返学费的支付落地页面
         * 3、有关注二维码返回或者是开启社群，则跳到支付成功页面。
         */

		let communityInfo = {}
		let qrUrl = '';
		const {joinCampInfo} = this.props
		// 新训练营
		if (joinCampInfo.isCamp === 'Y' && joinCampInfo.isNewCamp === 'Y') {

			let channel = ''
			if (payFree === 'Y') {
				channel = 'subAfterSignB'
			} else {
				channel = 'subAfterSignA'
			}
			let params = {
				channelId: this.data.channelId
			}

			if (joinCampInfo.isNewCamp === 'Y') {
				params.isNewCamp = true
				params.isOfficialLive = getVal(this.data, 'liveConfig.isOfficialLive', false);
				// 延迟1秒后再去请求二维码，后端的回调太慢，先临时兼容后端的bug
				sleep(1000);
			}
			params.campLiveId = this.props.campInfo.liveId

			// b端逻辑，报名成功后判断是否要去公众号关注二维码；
			qrUrl = await subAterSign(channel, this.props.channelInfo.liveId, params)

			if (qrUrl) {
				qrUrl.channel = channel
			}
		} else if (this.props.location.query.officialKey || this.tracePage == "coral") {
			qrUrl = await getCoralQRcode({
				channel: 'subAfterSignCoral',
				liveId: this.props.channelInfo.liveId,
				channelId: this.data.channelId,
			});
			if (qrUrl) {
				qrUrl.channel = 'subAfterSignCoral'
			}
		} else {
			/* 新增返学费落地页，优先级在珊瑚逻辑之下 */
			if (this.state.showBackTuitionLabel) {
				await fetchPayBackReturnMoney(orderId).then(bol => {
					if (bol) {
						const jumpUrl = `/wechat/page/pay-success?orderId=${orderId}`
						if (isGoForm) {
							locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelCouponStatus.couponId || this.data.targetCouponId || ''}${payFree === 'Y' ? '&auth=Y' : ''}${
								jumpUrl ? `&jumpUrl=${encodeURIComponent(jumpUrl)}` : ''
							}`);
						} else {
							locationTo(jumpUrl)
						}
						return
					}
				})
			}
			/*********************************/

			let channel = ''
			if (payFree === 'Y') {
				channel = 'subAfterSignB'
			} else {
				channel = 'subAfterSignA'
			}
			let params = {
				channelId: this.data.channelId
			}

			let communityParams = {}

			// 旧训练营
			if (joinCampInfo.isCamp === 'Y' && joinCampInfo.hasPeriod === 'Y') {
				communityParams = {
					liveId: this.props.liveId,
					type: 'camp',
					businessId: this.props.campInfo.periodPo.id
				}

				if (joinCampInfo.hasPeriod === 'Y') {
					communityInfo = await this.gotoCommunity(communityParams);
					params.isCampAndHasPeriod = true
					params.communityCode = communityInfo.communityCode
				}

				params.campLiveId = this.props.campInfo.liveId
			} else {
				communityParams = {
					liveId: this.props.liveId,
					type: 'channel',
					businessId: this.props.channelId
				}
				communityInfo = await this.gotoCommunity(communityParams);

				// 如果是有开启社群，则需要传id请求二维码
				if (communityInfo.showStatus == 'Y') {
					params.communityCode = communityInfo.communityCode
				}
			}

			// b端逻辑，报名成功后判断是否要去公众号关注二维码；
			qrUrl = await subAterSign(channel, this.props.channelInfo.liveId, params)
			if (qrUrl) {
				qrUrl.channel = channel
			}
		}

		// 如果没填过表且不是跳过填表状态 则需要填表 表单后置
		if (isGoForm) {
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${this.props.location.query.channelId}&couponId=${this.props.channelCouponStatus.couponId || this.data.targetCouponId || ''}${payFree === 'Y' ? '&auth=Y' : ''}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&qrChannel=${qrUrl.channel}` : ''}`);
		} else {
			let communityCode = getVal(communityInfo, 'communityCode');
	
			// 新训练营 且 已关注训练营公众号
			if (joinCampInfo.isNewCamp === 'Y' && !qrUrl) {
				this.enterNewCampSyudentInfo()
				return
			} else if (qrUrl || communityCode) {
				locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.channelInfo.liveId}&payFree=${payFree}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}` : ''}&title=${encodeURIComponent(this.props.channelInfo.name)}${communityCode ? '&communityCode=' + communityCode + '&liveId=' + this.props.liveId : ''}`)
				return
			} else {
				this.enterCourse();
			}
			// 支付完成之后如果页面不跳转就请求接口判断是否可以发平台优惠券
			if (payFree == 'N') {
				this.getPacketDetail();
			}
		}
	}
	handleBuyReBtnClick() {
		this.data.reNewTip = true
		this.handleBuyBtnClick()
	}

	get isHaveAvailableCoupon() {
		const { couponList } = this.state

		if (couponList.length > 0) {
			const charge = this.props.chargeConfigs[0]
			let price = (this.props.discountExtendPo.showDiscount ? charge.discount : charge.amount) * 100;
			// 判断是否有平台通用券
			const isHavePlatformCoupon = couponList.find(i => i.businessType === 'discount')
			const availableList = couponList.filter(coupon =>
				coupon.minMoney <= price
				&& (!coupon.overTime || this.props.sysTimestamp < coupon.overTime )
				&& coupon.couponType !== 'app'
			)
			if (isHavePlatformCoupon || availableList.length > 0) return true
		}

		return false
	}

	// 购买点击打开弹窗
	async handleBuyBtnClick() {

		// 判断是否已经购买了相同的系列课
		if (this.props.alreadyBuyChannelId && (this.props.alreadyBuyChannelId != this.data.channelId)) {
			this.refs.haveBoughtDialog.show();
			return;
		}

		// 如果是一元购直接弹起支付
        if(this.props.chargeConfigs && this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === 'UNLOCK') {
            this.payChannel();
            return
        }

		let appCoupon;

		let isHaveAvailableCoupon = false;
		let couponList = this.state.couponList;
		if (couponList && couponList.length > 0) {
			const charge = this.props.chargeConfigs[0]
			let price = (this.props.discountExtendPo.showDiscount ? charge.discount : charge.amount) * 100;
			// 判断是否有平台通用券
			const isHavePlatformCoupon = couponList.find(i => i.businessType === 'discount')

			const availableList = [];
			couponList.filter(coupon => {
				if (!availableList.length && coupon.couponType === 'app' && !appCoupon) appCoupon = coupon;

				if (coupon.minMoney <= price
				&& (!coupon.overTime || this.props.sysTimestamp < coupon.overTime )
				&& coupon.couponType !== 'app') availableList.push(coupon);
			})
			if (isHavePlatformCoupon || availableList.length > 0) isHaveAvailableCoupon = true
		}

		/**
		 * 首张可用券是app券，弹提示不弹选券窗
		 * 其他情况，弹选券窗
		 *
		 * 取消过提示则不再弹
		 */
		if (appCoupon) {
			if (!this._hasShowAppCouponGuide && await new Promise(resolve => {
				this._hasShowAppCouponGuide = true;

				typeof _qla !== 'undefined' && _qla('visible', {
					logs: JSON.stringify([
						{
							region: 'app-coupon-guide'
						}
					])
				});

				window.simpleDialog({
					msg: <div style={{wordBreak: 'break-word'}}>你有未使用的APP专享优惠券，可抵扣<span style={{color: '#f73657'}}>{formatMoney(appCoupon.money)}元</span>，请前往APP使用</div>,
					buttons: 'cancel-confirm',
					confirmText: '去APP使用',
					cancelText: '不用优惠券',
					onConfirm: () => {
						openApp({
							h5: location.href,
							ct: 'appzhuanshu',
							ckey: 'CK1422980938180',
						});
						resolve(true);
						typeof _qla !== 'undefined' && _qla('click', {
							region: 'app-coupon-guide-confirm'
						});
					},
					onCancel: () => {
						resolve(false);
						typeof _qla !== 'undefined' && _qla('click', {
							region: 'app-coupon-guide-cancel'
						});
					},
				})
			})) return;
		}

		// 有appCoupon却不使用，就原价买吧
		if (appCoupon) {
			this.payChannel();
			return;
		}

		// 是否打开二次确认弹框 （ 不是免费 | 按时收费 | 有优惠券 | 会员折扣 | 特价 ）
		if (
			!this.isFreeChannel && (
				(this.props.channelInfo.chargeType === 'flexible' && this.props.chargeConfigs.length > 1) ||
				(this.props.isMember && this.props.isMemberPrice && this.tracePage !== "coral") ||
				this.props.discountExtendPo.showDiscount ||
				isHaveAvailableCoupon 
			)
		) {
			this.setState({	
				isOpenPayDialog: true,
			});
		} else {
			this.payChannel();
		}
	}

	// 关闭购买弹窗
	handleClosePayDialog() {
		this.setState({
			isOpenPayDialog: false,
		});
	}

	// 跳转至已经购买过的系列课主页
	gotoChannelBought = () => {
		if (this.props.alreadyBuyChannelId) {
			locationTo(`/live/channel/channelPage/${this.props.alreadyBuyChannelId}.htm`);
		}
	};

	async bindCouponSuccess() {
		this.getCoupons();
	}

	/*--- 自媒体版转载系列课优惠券 ---*/
	openMediaCouponDialog = () => {
		this.setState({
			isShowMediaCouponDialog: true,
			_isShowMediaCouponDialog: true
		});
	};

	closeMediaCouponDialog = () => {
		this.setState({
			isShowMediaCouponDialog: false
		});
	};

	receiveMediaCoupon = async () => {
		const { mediaCoupon } = this.state;
		const result = await this.props.receiveMediaCoupon({ codeId: mediaCoupon.id });
		if (result.state.code === 0) {
			window.toast('领取成功');
			setTimeout(function () {
				window.location.href = updateUrl(window.location.href)
			}, 300)
		} else {
			window.toast(result.state.msg);
		}
		// 关闭弹窗
		this.closeMediaCouponDialog();
	}

	initMediaCouponInfo = async () => {
		const {
			channelInfo,
			location,
			fetchMediaCouponDetail,
			fetchIsReceivedCoupon,
		} = this.props;

		// 优惠券只针对访问转载系列课的C端非VIP用户且未购买的用户
		if (channelInfo.isRelay === 'Y' && !this.isVip && !this.props.isAuthChannel) {
			const couponCode = location.query.couponCode;
			// 链接中必须带有优惠券id参数
			if (couponCode !== undefined) {
				const result = await fetchMediaCouponDetail({ codeId: couponCode });
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
						const receiveStatResult = await fetchIsReceivedCoupon({ codeId: couponCode });
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
							mediaCoupon: { ...coupon }
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

	/**
	 * ------------------------------------------ /结束购买相关 -----------------------------------------------------
	 */


	onClickFollowLive = async isFollow => {
		
		let businessType = this.props.location.query.taskCardShare ? 'taskCardShare' : (this.props.location.query.redEnvelopeId ? 'redEnvelope' : '')
		const focusState = this.props.isFollow.isFollow ?  (this.props.isFollow.isAlert ? 'pass' : 'attention_pass') : (this.props.isFollow.isAlert ? null : 'no_pass'); 
        let showToast = false;
		// 点击关注按钮后的弹窗二维码
		if (focusState !== "pass") {
			/** 珊瑚来源不引导关注 */
			if (this.tracePage == "coral") {
				this.setState({
					followDialogType: 'focusliveConfirmClick',
					followDialogOption: {}
				}, () => {
					this.introQrCodeDialogDom.show()
				})
				return false;
			}
			// C端用户走三方导粉配置
			const _res = await whatQrcodeShouldIGet({
				isBindThird: this.props.isBindThird,
				isFocusThree: this.props.isFocusThree,
				isRecommend: /.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page')),
				options: {
					channel: '209',
					liveId: this.props.channelInfo.liveId,
					channelId: this.data.channelId,
					subscribe: this.props.isSubscribe,
				}
			});
			if (_res) {
				const followDialogOption = this.state.followDialogOption
				followDialogOption.appId = _res.appId
				followDialogOption.traceData = 'channelFocusQrcode',
					followDialogOption.channel = '209'
				this.setState({
					followDialogType: 'focusClick',
					qrcodeUrl: _res.url,
					followDialogOption
				}, () => {
					this.introQrCodeDialogDom.show()
				})
			} else {
				showToast = true;
			}
		}
		const res = await this.props.followLive(this.props.liveId, focusState !== "pass" ? 'Y' : 'N', 'Y', businessType);
		if(res && showToast === true) {
            this.onClickCloseQrCodeDialog();
        }
		this.setState({
			showCancelFocusDialog: false
		})
		
	}

    onClickFocus() {
        const focusState = this.props.isFollow.isFollow ?  (this.props.isFollow.isAlert ? 'pass' : 'attention_pass') : (this.props.isFollow.isAlert ? null : 'no_pass');
        
        if(focusState === "pass" ) {
            this.setState({
                showCancelFocusDialog: true
            })
        } else {
            this.onClickFollowLive();
        }
    }


	async focusLiveConfirm(isFollow) {
		let businessType = this.props.location.query.taskCardShare ? 'taskCardShare' : (this.props.location.query.redEnvelopeId ? 'redEnvelope' : '')
		await this.props.followLive(this.props.liveId, isFollow ? 'Y' : 'N', 'Y', businessType);
		if (isFollow && this.state.existCommunity) {
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


	onClickTopicItem = async (topic, isLock = false) => {
		// 一元解锁灰色的不许进入,且弹窗
		if(isLock) {
			if(this.props.isAuthChannel) {
				this.handleShowFissionCard()
			}
			return
		}

		// const { campInfo:{isJoinCamp ="N"},joinCampInfo } = this.state;
		// if(((Object.is(joinCampInfo.isCamp,'Y') && Object.is(joinCampInfo.hasPeriod,'Y')) || Object.is(isJoinCamp, "Y") ) && this.isFreeChannel){
		// 	if(this.isBought && Object.is(isJoinCamp, "N")){
		// 		try {
		// 			const res = await joinPeriod({
		// 				channelId: this.data.channelId
		// 			});
		// 		} catch (error) {
		// 			console.log(error);
		// 		}
		// 	}
		// 	locationTo(`/wechat/page/training-camp?channelId=${ this.data.channelId }`)
		// } else
		if (
			this.props.isAuthChannel
			|| topic.isAuditionOpen === 'Y'
			|| this.isVip
			|| topic.isAuthTopic
			|| topic.isUnlock
		) {
			// 多增加是否是新训练营 为开营的判断
			if (this.props.joinCampInfo && this.props.joinCampInfo.isNewCamp == 'Y' && topic.startTime > this.props.sysTimestamp) {
				window.toast('未到开课时间，请耐心等候，订阅千聊训练营公众号及时获得通知', 2000)
			} else {
				let url = `/topic/details?topicId=${topic.id}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}`
				if(this.isUnHome){
					url = `${ url }&isUnHome=Y`
				}
				locationTo(url)
			}
		} else {
			let s = getVal(this.props, 'location.query.s', '');
			let t = getVal(this.props, 'location.query.t', '');
			let sign = getVal(this.props, 'location.query.sign', '');
			let shareKey = getVal(this.props, 'location.query.shareKey', '');
			let taskcard = ''
			if (s == 'taskcard' && t && sign) {
				taskcard = `&s=${s}&t=${t}&sign=${sign}&from=channel`
			}
			let url = `/wechat/page/topic-intro?topicId=${topic.id}${shareKey ? "&shareKey=" + shareKey : ""}${taskcard}`
			if(this.isUnHome){
				url = `${ url }&isUnHome=Y`
			}
			locationTo(url);
			// this.refs.buyChannelDialog.show()
			this.isAuthTopic(topic.id);
		}
	};

	/**
	 * 判断是否白名单并跳转话题
	 *
	 * @param {any} id
	 * @memberof Channel
	 */
	async isAuthTopic(id) {
		console.log("isAuthTopic")
		let result = await this.props.getAuth(id);
		if (getVal(result, 'data.isAuth', false)) {
			locationTo(`/topic/details?topicId=${id}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}`)
		}

	}

	// getAutoFixedNavConfig = () => {
	//     return [
	//         {
	// 			name: '课程介绍',
	// 			selector: '.desc-content',
	// 			dataLogRegion: 'nav-desc-content',
	//         },
	//         {
	//             name: '课程列表',
	// 			selector: '.topic-list',
	// 			dataLogRegion: 'nav-topic-list',
	// 			show: this.state.topicList && this.state.topicList.length,
	// 			getActiveScrollTop: this.getTopicListNavActiveScrollTop,
	//         },
	//     ].filter(item => item.show !== false)
	// }

	/**
	 * 课程列表高度不足时，滚动高度足以显示第一个课程时，即激活课程列表tab
	 * 但此前提是课程介绍已被滚动出显示区域
	 *
	 * 由此得以下两个方法
	 */
	getTopicListNavActiveScrollTop = () => {
		let firstItem = document.querySelector('.p-intro-topic-list .item');

		let result = this.topicListEl.offsetTop - (this.scrollWrapEl.scrollContainer.clientHeight - (firstItem ? firstItem.offsetTop + firstItem.clientHeight : 0));
		return result;
	}

	judgeAutoFixedNavActiveIndex = (itemActiveScrollTopArr, wrapScrollTop, navInstance) => {
		let activeIndex;

		let preItemActiveScrollTop = -1;
		for (let i = 0; i < itemActiveScrollTopArr.length; i++) {
			if (wrapScrollTop >= itemActiveScrollTopArr[i] &&
				(i === 0 || wrapScrollTop >= preItemActiveScrollTop + navInstance.navEl.offsetHeight)) {
				activeIndex = i;
			} else {
				break;
			}
			preItemActiveScrollTop = itemActiveScrollTopArr[i];
		}

		return activeIndex;
	}

	getAutoFixedNavEl = selector => {
		// 购买页和已购页布局不一样，对浮动tab定位也不一样
		if (this.props.isAuthChannel) {
			if (selector === '.desc-content') {
				return this.descContentAuthEl && this.descContentAuthEl;
			} else if (selector === '.topic-list') {
				return this.topicListEl;
			}
		} else {
			if (selector === '.desc-content') {
				return this.descContentEl;
			} else if (selector === '.topic-list') {
				return this.topicListEl;
			}
		}
	}

	/**
	 * ‘更多’菜单点击事件
	 */
	onClickMore_home() {
		location.href = `/wechat/page/live/${this.props.liveId}`;
	}

	onClickMore_ask() {
		location.href = `/wechat/page/channel-consult?channelId=${this.data.channelId}`;
	}

	onClickMore_coupon() {
		location.href = `/wechat/page/coupon-code/exchange/channel/${this.data.channelId}?tracePage=liveCenter`;
	}

	async onClickMore_collect() {
		if (this.state.isCollected) {
			const result = await this.props.cancelCollect({
				type: "channel",
				businessId: this.data.channelId
			})
			if (result) {
				window.toast('已取消收藏', 2000, 'unlike')
				this.changeCollectedStatus(false);
			}
		} else {
			const result = await this.props.addCollect({
				type: "channel",
				businessId: this.data.channelId
			})
			if (result) {
				window.toast('已收藏', 2000, 'unlike')
				this.changeCollectedStatus(true);
			}
		}
	}

	openGiftTipDialog() {
		this.giftTipDialog.show();
	}

	onCloseGiftTipDialog() {
		this.giftTipDialog.hide();
	}

	onClickMore_gift() {
		this.giftDialog && this.giftDialog.show();
	}

	onClickMore_relay() {
		location.href = `/wechat/page/live-studio/media-market?selectedChannelId=${this.data.channelId}`;
	}

	onClickMore_community() {
		if(this.props.isAuthChannel) {
			location.href = `/wechat/page/community-qrcode?liveId=${this.props.channelInfo.liveId}&communityCode=${this.state.communityInfo.communityCode}`;
		} else {
			this.setState({
				isShowGroupDialog: true
			});
		}
	}

	//进入新训练营信息采集
	async enterNewCampSyudentInfo() {
		let res = await getPeriodByChannel(this.data.channelId)

		// 先判断用户是否加入了训练营 再判断用户是否有答应公约 最后跳学习页面
		if (res.state.code == 0 && res.data.isJoinCamp == 'N') {
			await newJoinPeriod(this.data.channelId)
			locationTo(`/wechat/page/training-student-info?channelId=${this.data.channelId}`)
		} else {
			let userInfo = await getCampUserInfo(this.data.channelId)
			if (userInfo.state.code == 0 && !userInfo.data.campUserPo.contractTime) {
				locationTo(`/wechat/page/training-student-info?channelId=${this.data.channelId}`)
			} else {
				locationTo(`/wechat/page/training-learn?channelId=${this.data.channelId}`)
			}
		}
	}

	async enterCourse() {
		const topicList = this.state.topicList.data || [];
		const { campInfo: { isJoinCamp = "N" }, joinCampInfo } = this.props;

		if (joinCampInfo.isNewCamp == 'Y') {
			// 新训练营判断
			this.enterNewCampSyudentInfo()
		} else if ((Object.is(joinCampInfo.isCamp, 'Y') && Object.is(joinCampInfo.hasPeriod, 'Y')) || Object.is(isJoinCamp, "Y")) {
			if (this.isBought && Object.is(isJoinCamp, "N")) {
				try {
					const res = await joinPeriod({
						channelId: this.data.channelId
					});
				} catch (error) {
					console.log(error);
				}
			}
			locationTo(`/wechat/page/training-camp?channelId=${this.data.channelId}`)
		} else if (topicList.length > 0 && topicList[0].id) {
			locationTo(`/topic/details?topicId=${topicList[0].id}`)
		} else {
			window.toast("系列课暂无课程");
			return;
		}
	}

	/**
	 * ============================================ 赠礼相关 =========================================
	 */

	/**
	 * 改变赠礼选择的会员类型
	 * @param {any} type increase(增加) | decrease(减少)
	 *
	 * @memberOf Channel
	 */
	onChangeMemberType(type) {
		const max = this.props.chargeConfigs && this.props.chargeConfigs.length || 0;

		if (type === 'increase' && this.state.curCharge < max - 1) {
			this.setState({
				curCharge: Number(this.state.curCharge) + 1
			});
		} else if (type === 'decrease' && this.state.curCharge > 0) {
			this.setState({
				curCharge: Number(this.state.curCharge) - 1
			});
		}

		setTimeout(() => {
			if (!this.checkGiftValid(this.state.giftCount)) {
				this.setState({
					giftCount: 1
				});
			}
		}, 0);
	}

	onCloseGiftDialog(e) {
		this.giftDialog.hide();

		// 点击事件才log
		e && window._qla && _qla('click', { name: '赠好友-关闭', region: "gift-close" });
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
				officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey : (this.props.location.query.source == "coral" || this.tracePage == "coral" ? this.props.userId : ""),
				psKey: (this.props.platformShareRate && this.props.location.query.psKey && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? this.props.location.query.psKey : '',
				psCh: (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : '',
				callback: async (orderId) => {

					const result = await this.props.getGiftId(orderId);

					if (result.state.code == 0) {
						this.setState({
							giftId: result.data.orderGiftId
						});
					}

					this.giftDialog.hide();
					this.giftTipDialog.show();
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
	 * --------------------------------------------------------- 结束赠礼相关 ---------------------------------------------------
	 */


	/**
	 * ============================================ 留言相关 =========================================
	 */

	async initConsultList() {
		const result = await this.props.getConsultSelected(this.data.channelId, 'channel', false);

		if (result.data.consultList) {
			this.setState({
				consultList: result.data.consultList
			})
			// setTimeout(() => {
			// 	this.messageAnchor = findDOMNode(this.refs.consultList)
			// }, 200);
		}
	}

	async onConsultPraiseClick(id, like) {
		if (like === 'Y') {
			window.toast('您已经点过赞')
			return
		}
		const res = await this.props.consultPraise(id);
		if (res.state.code === 0) {
			const consultList = [...this.state.consultList];
			consultList.some(c => {
				if (c.id === id) {
					c.isLike = 'Y';
					c.praise = Number(c.praise) + 1;
					return true;
				} else {
					return false;
				}
			});
			this.setState({ consultList })
		}
	}

	onShowConsultPop() {
		document.querySelector('.scroll-container').style.overflowY = 'hidden';
		this.setState({ consultPop: true })
	}

	onHideConsultPop() {
		document.querySelector('.scroll-container').style.overflowY = 'auto';
		this.setState({ consultPop: false })
	}

	/**
	 * --------------------------------------------------------- 结束留言相关 ---------------------------------------------------
	 */

	tabHandle(key) {
		setTimeout(() => {
			if(!this.state[`${key}Mount`]){
				const obj = {};
				obj[`${key}Mount`] = true;
				this.setState(obj);
			}
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
		}, 150);
	}

	getEvaluationListObj = () => {
		return this.state.evaluateHasValidFilter ? this.props.evaluation.evaluationListValid : this.props.evaluation.evaluationList;
	}

	onClickValidFilter = () => {
		this.setState({ evaluateHasValidFilter: !this.state.evaluateHasValidFilter }, () => {
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

	// 展示优惠券
	showCoupon(coupon) {
		this.actCouponDialogRef.showCoupon(coupon)
	}

	// 隐藏优惠券列表
	hideCoupon() {
		this.setState({
			isCoupons: false,
			isOnce: true,
		})
	}

	// 显示优惠券列表
	showCouponList(couponListType, couponUsePrice) {
		this.setState({
			isCoupons: true,
			couponUsePrice
		})
	}

	gotoShareCut() {
		const {
			notFilled
		} = this.state
		// 如果没填过表且不是跳过填表状态 则需要填表 表单前置
		if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel-cut&channelId=${this.props.location.query.channelId}&shareCutDomain=${encodeURIComponent(this.state.shareCutDomain)}`);
			return;
		}
		let url = `${this.state.shareCutDomain}activity/page/cut-price?businessType=CHANNEL&businessId=${this.props.location.query.channelId}&applyUserId=${this.props.userId}`;

		if (this.props.platformShareRate) {
			url = url + "&psKey=" + this.props.userId;
		}

		locationTo(url)
	}

	// 课程列表正倒序切换
	onClickTopicListSort = () => {
		this.setState({
			isTopicListDesc: !this.state.isTopicListDesc
		}, () => {
			// 还没有数据时请求
			if (!this.getTopicListObj().data) {
				this.fetchTopicList();
			}
		})
	}

	// 获取课程列表当前顺序的异步对象
	getTopicListObj = () => {
		return this.state[this.state.isTopicListDesc ? 'topicListDesc' : 'topicList']
	}

	toggleChargeIndex(activeChargeIndex) {
		this.setState({
			activeChargeIndex
		})
	}
	// 判断是否显示训练营信息
	get isCamp() {
		const { campInfo: { periodPo = {}, isJoinCamp = "N" }, joinCampInfo } = this.props;
		// 先判断时候是新训练营

		if (joinCampInfo.isNewCamp == 'Y') {
			return true
		} else {
			if (Object.is(joinCampInfo.isCamp, 'Y') && Object.is(joinCampInfo.hasPeriod, 'Y') && (periodPo && !!periodPo.name)) {
				return true;
			}
			if (!!periodPo && Object.is(isJoinCamp, "Y")) {
				return true
			}
		}
		return false;
	}

	closeInviteFriendsListenGuide() {
		setLocalStorage('inviteFriendsListenGuide', new Date().getTime())
		this.setState({
			isShowInviteFriendsListenGuide: false
		})
	}

	get isShowMemberBlock() {
		return !this.isFreeChannel
		// 非免费课并且(不是会员或者是会员且当前课是大师课并且还可以选课)
		&& this.tracePage !=='coral'
		&& this.props.isMemberPrice
		// 未购买 | 是会员 & (课程为小课 | (正式会员 & 课程为大课 & 通过会员领课方式获得))
		&& (!this.isBought || (this.props.isMember && (this.state.memberCourseType === 'free' || (this.props.memberInfo.level === 2 && this.state.memberCourseType === 'quality' && this.state.memberCourseReceive))))
		// 非vip && ( 有无转载配置 || 是否转载课 )
		&& !this.isVip && (this.state.canRelayChannelMemberDiscount || !this.isRelay)
		// 底部按钮已加载
		&& this.state.mountBottomPurchasePanel
	}

	get fixFissionBlock() {
		let { chargeConfigs = [], isAuthChannel, unlockCourseInfo } = this.props
		let { unlockInfo, showFissionGroupBar } = this.state
		const chargeInfo = chargeConfigs[0] || {};

		// 不是解锁课或者未买,不顶上去
		// 如果是解锁课,而且出现解锁进度的顶上去
		// 如果是解锁课,而且出现解锁进度 + 入群入口的顶两层
		let className = (chargeInfo.discountStatus !== 'UNLOCK' || !this.props.isAuthChannel) ? ''
			:
			(
				(unlockInfo.currentCount < unlockInfo.limitCount && chargeInfo.discountStatus === 'UNLOCK' && this.state.tabStick) ? 'fission-up' : ''

			)
		if(showFissionGroupBar && isAuthChannel && chargeInfo.discountStatus === 'UNLOCK' && unlockInfo.payType === 'unlock' && unlockCourseInfo.joinGroupUrl) {
			className = 'fission-bar-up ' + className
		}
		return className
	}

	get inviteAuditionUserId() {
		return this.props.location.query.inviteAuditionUserId;
	}

	// async ajaxGetUser () {
	// 	try {
	// 		let result = await apiService.post({
	// 			url: '/h5/user/get',
	// 			body: {
	// 				otherUserId: this.inviteAuditionUserId
	// 			}
	// 		})
	// 		console.log(result);
	// 		return result.data;
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	async ajaxInviteInfo() {
		if (!this.inviteAuditionUserId) return;
		if (!this.data.channelId) return;
		try {
			let result = await apiService.post({
				url: '/h5/invite/audition/inviteInfo',
				body: {
					inviteAuditionUserId: this.inviteAuditionUserId,
					channelId: this.props.channelInfo.channelId
				}
			})
			console.log('ajaxInviteInfo', result);
			if (result.state.code == 0) {
				return result.data;
			}
		} catch (error) {
			console.error(error)
		}
	}

	async ajaxSaveInvite(topicId) {
		if (!topicId) return;
		try {
			let result = await apiService.post({
				url: '/h5/invite/audition/saveInvite',
				body: {
					inviteAuditionUserId: this.inviteAuditionUserId,
					channelId: this.props.channelInfo.channelId,
					topicId: topicId
				}
			})
			console.log('saveinvite', result)
			if (result.state.code) {
				return result.data
			}
		} catch (error) {
			console.error(error)
		}
	}


	async handleInvite() {
		if (!this.inviteAuditionUserId || this.inviteAuditionUserId == getCookie('userId')) return;
		try {
			let inviteInfo = await this.ajaxInviteInfo();
			this.setState({
				inviteInfo
			})
			let result = await this.ajaxSaveInvite(inviteInfo.topicId)
		} catch (error) {
			console.error(error);
		}
	}

	scrollingFunc() {
		this.setState({
			scrolling: 'Y',
		});
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			this.setState({
				scrolling: 'S',
			});
		}, 300)
	}

	async initCommunity(){
		let data = await getCommunity(this.props.liveId, 'channel', this.props.channelId);
		if (data) {
			this.setState({
				existCommunity: data.showStatus == 'Y',
				communityCode: data.communityCode,
				communityName: data.communityName,
			});

			data = await getCommunity(this.props.liveId, 'live', this.props.liveId);
			this.setState({
				existLiveCommunity: data.showStatus == 'Y',
				liveCommunityCode: data.communityCode,
				liveCommunityName: data.communityName,
			});
		}
	}

	enterCampIntro() {
		locationTo(`/wechat/page/training-intro?campId=${this.props.campInfo.periodPo.campId}`)
	}

	get isPeriodEnd() {
		const { campInfo } = this.props
		return campInfo && campInfo.periodPo && (campInfo.periodPo.signupEndTime < this.props.sysTimestamp)
	}

    async fetchUnlockProgress() {
        if(!this.props.chargeConfigs[0] || this.props.chargeConfigs[0].discountStatus !== 'UNLOCK') {
	        return
        }
        let res = await fetchUnlockProgress({
            channelId: this.data.channelId,
        })
        if (res.state && res.state.code == 0) {
            this.setState({
                unlockInfo: {
                    isNeedToUnlock: 'N',
                    limitCount: 0,
                    currentCount: 0,
                    ...res.data,
                }
            })
        }
    }

	// 显示一元购支付失败后的弹窗
	handleShowFissionDialog() {
        this.refs.fissionFailDialog.show()
    }

    // 关闭一元购支付失败后的弹窗,用于兜底跳转与再次支付
	handleCloseFissionDialog() {
        this.refs.fissionFailDialog.hide()
    }

    // 显示一元购弹卡
    handleShowFissionCard() {
        this.refs.fissionCardDialog.show()
    }

    //
    bindUnlockCourseUserRef () {
	    if(this.data.unlockUserId)
            unlockCourseBindUserRef({
                userId: this.props.userInfo.userId,
                channelId: this.data.channelId,
                inviteUserId: this.data.unlockUserId
            })
    }

	// 查询缓存当前系列课id需不需要展示
	judgeFissionCourseIds() {
		let curChannelIds = window.localStorage.getItem('fissionCourseIds') || ''
		this.setState({
			showFissionGroupBar: curChannelIds.indexOf(this.data.channelId) < 0
		})
	}

	// 显示入群弹窗
	showFissionGroupDialog() {
		this.refs.fissionGroupDialog.show()
	}

	hideFissionGroupDialog(e) {
		if (e === 'cancel') {
			let curChannelIds = window.localStorage.getItem('fissionCourseIds') || ''
			if(curChannelIds.indexOf(this.data.channelId) > -1) {
				return
			}
			if(!curChannelIds) {
				window.localStorage.setItem('fissionCourseIds', this.data.channelId)
			} else {
				let arr = curChannelIds.split(',')
				arr.push(this.data.channelId)
				window.localStorage.setItem('fissionCourseIds', arr.join())
			}
			this.setState({
				showFissionGroupBar: false
			})
		} else {
			locationTo(this.props.unlockCourseInfo.joinGroupUrl || '/')
		}
	}

	async dispatchGetCommunity() {
		try {
			const res = await getCommunity(this.props.channelInfo.liveId, "channel", this.props.channelInfo.channelId);
			if(res) {
				this.setState({
					communityInfo: res
				});
				if (res.showStatus === 'Y') {
					let operateMenuConfig = this.state.operateMenuConfig
					operateMenuConfig.push(
						{
							name: '课程社群',
							icon: require('./img/icon-community.png'),
							onClick: this.onClickMore_community,
							className: 'on-log on-visible',
							'data-log-name': '更多-课程社群',
							'data-log-region': 'more_community',
						});
					this.setState({ operateMenuConfig });
				}
				this.getGroupShow();
			}
		} catch (error) {
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
	
	// 授权
	loginHandle = () => {
		location.href = '/api/wx/login?redirect_url=' + encodeURIComponent(location.href);
	}

	render = () => {
		// console.log('滚动状态： ', this.state.isScrollRolling)
		let { channelInfo, chargeConfigs, discountExtendPo } = this.props;
		const isBought = this.isBought;
		// 取首个有效状态的价格配置信息
		const chargeInfo = chargeConfigs[0]||{};
		// 组件内展示价格
		let price = chargeInfo.amount;
		if (chargeInfo.discountStatus === 'Y') {
			// 如果是设置了特价优惠，必须在活动范围内才是特价。
			if (discountExtendPo.showDiscount) {
				price = chargeInfo.discount;
			}
		} else if (chargeInfo.discountStatus !== 'N') {
			price = chargeInfo.discount;
		}

		const currChargeInfo = chargeConfigs[this.state.activeChargeIndex];

		let evaluateNumStr = this.props.evaluationData.evaluateNumStr;
		evaluateNumStr == 0 && (evaluateNumStr = '');

		let jsCourseIntroDom = document.querySelector('.js_course_intro_dom');

		let topicList = this.getTopicListObj().data || [];

		topicList = topicList.map(item => {
			return {
				...item,
				isUnlock: item.id == this.state.inviteDetail.lockTopicId
			}
		});

		// 领券后会刷新页面的，刷新前不显示更多操作按钮提示
		let isShowOperateMenuTips = this.state.isShowOperateMenuTips && !this.state._isShowMediaCouponDialog && !this.state._isShowActCouponDialog;

		const { campInfo } = this.props;

		const isShowMemberBlock = this.isShowMemberBlock
		return (
			<Page 
				title={this.state.htmlTitle || this.props.channelInfo.name}
				description={this.state.htmlDescription || ''}
				keyword={this.state.htmlKeywords || ''}
				className="cend-channel-container portal-container" 
				banpv={true}
				>
				{
					// 不是App 且 不是1元解锁课 且 是官方直播间 且 不是直播间管理员 且 不允许发言
                    // !this.state.isApp && !this.isUnHome && chargeInfo.discountStatus !== 'UNLOCK' && this.state.isQlLive && !this.props.power.allowMGLive && !this.props.power.allowSpeak && <AppDownloadBar channelId={this.props.channelInfo.channelId}/>
				}

				 {/* 来自活动的按钮 */}
				<ComeFromAct />
				
				
				<ScrollToLoad
					className="scroll-container scroll-box"
					toBottomHeight={300}
					loadNext={this.loadMoreCourse}
					disable={this.isDisable}
					noMore={this.isNoMore}
					hideNoMorePic={true}
					ref={r => this.scrollWrapEl = r}
					scrollToDo={this.scrollingFunc.bind(this)}
					footer={
						(
							<IntersectionMount>
								<BottomBrand channelId={this.props.channelInfo.channelId} liveId={this.props.channelInfo.liveId} chtype="create-live_channel" />
							</IntersectionMount>
						)
					}
				>
					<IntroHeader
						ref="introHeader"
						type="channel"
						banner={this.props.channelInfo.headImage}
						chargeType={this.props.channelInfo.chargeType}
						isFree={this.isFree}
						isRelay={this.isRelay}
						isVip={this.isVip}
						isAuthChannel={this.props.isAuthChannel}
						auditionOpenCourse={this.state.auditionOpenCourse}
						payChannel={this.payChannel}
						enterCourse={this.enterCourse}
					>
					</IntroHeader>
					{
						this.props.joinCampInfo.isNewCamp == 'Y' &&
						<RidingLantern content='已经购买其他期数的学员请勿重复购买课程' link=''/>
					}
					{
						this.state.hasFetchInitData &&
						<SpecialsCountDown
							channelId={this.data.channelId}
							sysTimestamp={this.props.sysTimestamp}
							marketingInfo={this.props.marketingInfo}
							groupResult={this.state.groupResult}
							joinLen={this.props.groupingList.length}
							isBought={this.isBought}
							ref={el => this.specialsCountDownEle = el}
						>
							{/* 拉人返学费banner */}
							{
								this.state.showBackTuitionBanner &&
								<BackTuition
									missionDetail={this.data.missionDetail || {}}
									openBackTuitionDialog={this.openBackTuitionDialog}
								/>
							}
						</SpecialsCountDown>
					}


					{
                        chargeInfo.discountStatus !== 'UNLOCK' && this.props.userId &&
						<ShareBtn
							userId={this.props.userId}
							type="channel"
							isUnHome={ this.isUnHome }
							distributionPercent={this.distributionPercent}
							coralPercent={(this.props.coral.isPersonCourse === "Y" && this.props.coral.sharePercent) || ''}
							isAutoShareOpen={this.props.autoShareInfo.isOpenShare}
							autoSharePercent={this.props.myShareQualify.joinType === 'auto' ? this.props.myShareQualify.shareEarningPercent : this.props.autoShareInfo.autoSharePercent}
							price={price * 100}
							isFree={this.isFree}
							liveId={this.props.channelInfo.liveId}
							// 是否正在参与或者可以参与拉人返学费活动
							isBackTuition={this.state.showBackTuitionBanner || this.state.showBackTuitionLabel}
							isScrollRolling={this.state.isScrollRolling}
							shareBtnSimplify={this.state.shareBtnSimplify}
							coralPushData={{
								businessId: this.props.channelInfo.channelId,
								businessName: this.props.channelInfo.name,
								businessType: 'CHANNEL',
								liveName: this.props.channelInfo.liveName,
								businessImage: this.props.channelInfo.headImage,
								amount: price * 100,
								percent: this.props.coral.sharePercent
								// amount: 99,
								// percent: 40,
							}}
							initShare={this.initShare}
							initCoralShare={this.initCoralShare}
							shareBtnMove={this.state.shareBtnMove}
							isQlLive={this.state.isQlLive}
							tabStick={this.state.tabStick}
							coralLink={this.tracePage === 'coral'}
							source={this.props.location.query.source}
							platformShareRate={this.props.platformShareRate}
							missionId={this.props.location.query.missionId || this.data.missionDetail && this.data.missionDetail.missionId || ''}
						/>
					}
					<div className={`channel-info ${!this.state.showGroupingInfo ? 'channel-info-btn' : ''} ${ this.state.isQlLive && this.props.isUniCourse && this.props.isUniAuth ? 'minBtm' : '' }`}>
						<div className="title">
							{
								channelInfo.flag ? <span className="girl-college">{channelInfo.flag}</span> : null
							}
							{this.isCamp && <span>训练营</span>}
							{`${this.isCamp ? (`【${campInfo.periodPo.name}】`) : ''}${this.props.channelInfo.name}`}
						</div>
						<div className="channel-tip">
							<CourseDatial />
							<div>
							</div>
						</div>
						{this.isCamp &&
							<TrainingCampEnd
								startTime={formatDate(campInfo.periodPo.startTime, 'yyyy-MM-dd')}
								endTime={formatDate(campInfo.periodPo.signupEndTime, 'yyyy-MM-dd')} />}
						{/* 如果是按实付费 且 过期不显示续费按钮 接近15天显示激活 不过期则一直显示时间 */}
						{
							this.props.channelInfo.chargeType === 'flexible' && this.state.isPass ?
								this.state.passTime <= 15 ?
									<div className="renewal-wrap active">
										<span className="renewal-title">
											{`${this.state.passTime}天后到期`}
										</span>
										<span className="out-click-side" onClick={this.handleBuyReBtnClick}>
											<span className="renewal-word">
												续费
											</span>
										</span>
									</div>
									: <div className="renewal-wrap">
										<span className="renewal-title">
											{`${this.state.passDate}到期`}
										</span>
										<span className="out-click-side" onClick={this.handleBuyReBtnClick}>
											<span className="renewal-word">
												续费
											</span>
										</span>
									</div>
								: null
						}
						{/* {
							this.state.isWithinShareCut &&
							<div className="share-cut-count-down">
								<div className="share-cut-count-down-container">
									<div className="timer-box-name">限时抢购</div>
									<div className="timer-box">
										<div className="tip">距结束还有</div>
										<div className="block">{this.state.scDay}</div>天&nbsp;:&nbsp;
										<div className="block">{this.state.scHours}</div>时&nbsp;:&nbsp;
										<div className="block">{this.state.scMinutes}</div>分
									</div>
								</div>
							</div>
						} */}

						{
						    // 1元解锁课隐藏会员价
                            !this.props.isUniCourse && chargeInfo.discountStatus !== 'UNLOCK' && isShowMemberBlock && (
								<MemberBlock
									businessId={this.props.channelInfo.channelId}
									businessType="channel"
									info={this.props.chargeConfigs}
									showDiscount={this.props.discountExtendPo.showDiscount}
									isK={this.props.discountExtendPo.isK}
									memberInfo={this.props.memberInfo}
									isMember={this.props.isMember}
									memberCourseType={this.state.memberCourseType}
									memberCourseReceive={this.state.memberCourseReceive}
									marketingInfo={this.props.marketingInfo}
									isFixBottom={true}
									isShow={this.state.tabStick}
								/>
							)
						}
						{ this.state.isLoading && this.props.isUniCourse && <UniversityBlock isUniAuth={ this.props.isUniAuth } isQlLive={ this.state.isQlLive && this.props.isUniAuth } isShow={this.state.tabStick} /> }
						
                        {
	                        (chargeInfo.discountStatus === 'UNLOCK' && this.state.unlockInfo.limitCount === null && this.state.unlockInfo.unlockStatus === 'success')  ?
		                        null
		                        :
		                        chargeInfo.discountStatus === 'UNLOCK' ?
                                <>
                                    {
                                        !this.props.isAuthChannel ?
                                            <div className="fission-intro-info">
                                                <p className="large"><i className="fission-intro-info-icon icon-tick"></i>第1步：支付{this.props.unlockCourseInfo.discountAmount}元，解锁第1节课</p>
                                                <p><i className="fission-intro-info-icon icon-star"></i>第2步：邀请{this.props.unlockCourseInfo.limitCount}人报名，免费解锁全部课程</p>
                                            </div>
                                            :
                                            <div className="fission-intro-info">
                                                <p><i className="fission-intro-info-icon icon-tick"></i>第1步：已解锁第1节课</p>
                                                <p className="large"><i className="fission-intro-info-icon icon-star"></i>第2步：邀请{this.state.unlockInfo.limitCount}人报名，免费解锁全部课程</p>
                                            </div>
                                    }
                                </>
                                :
                                null

						}

						{ this.state.isLoading && this.state.isQlLive && this.props.isUniCourse && this.props.isUniAuth && <UniversityCollege pos="channel" { ...this.props.collegeInfo } /> }
					</div>
					{
						!(this.state.isQlLive || this.props.isUniCourse) && 
						!!this.props.liveInfo.entity && this.props.isAuthChannel &&
						<div className="p-intro-section" ref={r => this.descContentAuthEl = r}>
							<LiveInfo
								liveInfo={this.props.liveInfo}
								power={this.props.power}
								isFollow={this.props.isFollow.isFollow}
								isAlert={this.props.isFollow.isAlert}
								onClickFollow={this.onClickFocus}
								auditStatus={this.props.location.query.auditStatus}
								isBought={this.isBought}
								isCompany = { Object.is(this.state.enterprisePo.status, 'Y')  }
								enterprisePo={ this.state.enterprisePo || {} }
								handleCompany={ this.handleCompany }
								tracePage={this.tracePage}
							/>
						</div>
					}

					{
						this.state.showGroupingInfo &&
						<GroupingInfo
							sysTimestamp={this.props.sysTimestamp}
							marketingInfo={this.props.marketingInfo}
							myGroupInfo={this.props.myGroupInfo}
							groupingList={this.props.groupingList}
							currentGroupInfo={this.props.currentGroupInfo}
							updateChannelGroupingList={this.updateChannelGroupingList}
							joinGroup={this.joinOtherGroup}
							userId={this.props.userId}
						/>
					}





					{/*切换课程的tab */}
					{
						<div 
							className="p-intro-tab" ref={dom => this.tabDom = dom}>
							<div
								className={`tab-item on-log${this.state.currentTab == "intro" ? " active" : ""}`}
								onClick={this.tabHandle.bind(this, "intro")}
								data-log-name="课程介绍"
								data-log-region="tab-item"
								data-log-pos="intro"
								data-log-status={this.isBought ? 'bought' : ''}
							>{this.isCamp ? '训练营介绍' : '课程介绍'}</div>
							<div
								className={`tab-item on-log${this.state.currentTab == "course" ? " active" : ""}`}
								onClick={this.tabHandle.bind(this, "course")}
								data-log-name="课程列表"
								data-log-region="tab-item"
								data-log-pos="course"
								data-log-status={this.isBought ? 'bought' : ''}
							>{this.isCamp ? '课程目录' : '听课列表'}{this.state.auditionOpenCourse && !this.isBought ? <span className="try-listen">试听</span> : ''}</div>
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
						this.state.tabStick && <div className={`p-intro-tab stick${this.state.isQlLive ? ' ql-live': ''}`}>
							<div
								className={`tab-item on-log${(this.state.currentTab == "intro") ? " active" : ""}`}
								onClick={this.tabHandle.bind(this, "intro")}
								data-log-name="课程介绍"
								data-log-region="tab-item"
								data-log-pos="intro"
								data-log-status={this.isBought ? 'bought' : ''}
							>{this.isCamp ? '训练营介绍' : '课程介绍'}</div>
							<div
								className={`tab-item on-log${(this.state.currentTab == "course") ? " active" : ""}`}
								onClick={this.tabHandle.bind(this, "course")}
								data-log-name="课程列表"
								data-log-region="tab-item"
								data-log-pos="course"
								data-log-status={this.isBought ? 'bought' : ''}
							>{this.isCamp ? '课程目录' : '听课列表'}{this.state.auditionOpenCourse && !this.isBought ? <span className="try-listen">试听</span> : ''}</div>
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
					{
					    // 一元解锁课不显示折扣
                        this.chargeConfig?.discountStatus != 'UNLOCK' ?
						// 进行dom插入 在课程介绍 听课列表里面动态插入
						isLogined() && jsCourseIntroDom && (createPortal(
							(!this.props.isAuthChannel || this.props.channelInfo.chargeType === 'flexible') && !this.isVip &&
							<CouponBtn
								ref={r => this.couponButtonRef = r}
								businessType="channel"
								businessId={this.data.channelId}
								bindSuccess={this.bindCouponSuccess}
								showCoupon={this.showCoupon}
								isMore={Object.is(channelInfo.chargeType, 'flexible')}
								isFixed={this.state.isCouponBtnFixed}
								style={{ top: this.introHeaderHeight + 'px', right: this.data.couponBtnRight + 'px' }}
								from="channelIntro"
								paymentDetailsShow={this.state.isOpenPayDialog}
							/>,
							jsCourseIntroDom
						))
                        :
                        null
					}
					{/*  内容主体 */}
					<div ref={dom => this.introAnchorDom = dom} className="main-content-body">

						{/* 课程介绍 */}
						{
							this.state.introMount && (
								<div className={`intro${this.state.currentTab === "intro" ? '' : ' hide'}`}>
									{/* tab-介绍 */}
									{/* 拉人返学费介绍 */}
									{this.state.showBackTuitionLabel &&
										<BackTuitionLabel
											maxReturnMoney={this.fetchSalePrice() || this.chargeConfig.amount}
											inviteReturnCouponMoney={this.state.inviteReturnCouponMoney}
											inviteReturnConfig={this.state.inviteReturnConfig}
											isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice && this.tracePage !== "coral"}
										/>
									}
									{/* 课程介绍 */}
									{
										// this.state.hasFetchInitData &&
										<CourseIntro
											ref={r => this.courseIntroRef = r}
											channelId={this.data.channelId}
											channelSummary={htmlTransferGlobal(this.props.channelSummary)}
											channelDesc={this.props.channelDesc}
										>

										</CourseIntro>
									}

									{/* 训练营详情 */}
									{this.isCamp && <CampDetail periodPo={campInfo.periodPo || {}} planCount={this.props.channelInfo.planCount} isNewCamp={this.props.joinCampInfo.isNewCamp}/>}
									{
										!(this.state.isQlLive || this.props.isUniCourse) && 
										!!this.props.liveInfo.entity && !this.props.isAuthChannel &&
										<div className="p-intro-section">
											<LiveInfo
												liveInfo={this.props.liveInfo}
												power={this.props.power}
												isFollow={this.props.isFollow.isFollow}
												isAlert={this.props.isFollow.isAlert}
												onClickFollow={this.onClickFocus}
												auditStatus={this.props.location.query.auditStatus}
												isBought={this.isBought}
												isCompany = { Object.is(this.state.enterprisePo.status, 'Y')  }
												enterprisePo={ this.state.enterprisePo || {} }
												handleCompany={ this.handleCompany }
												tracePage={this.tracePage}
											/>
										</div>
									}

									{
										!!this.state.consultList.length &&
										<ConsultList
											consultList={this.state.consultList}
											onConsultPraiseClick={this.onConsultPraiseClick}
											onShowConsultPop={this.onShowConsultPop}
											sysTime={this.props.sysTimestamp}
											ref="consultList"
										/>
									}

									<div style={{background: "#fff"}}>
										<IntroGroupBar
											padding="0 .533333rem 0"
											communityInfo={this.state.communityInfo} 
											hasBeenClosed={this.state.groupHasBeenClosed}
											forceHidden={this.props.isAuthChannel}
											isBuy={this.props.isAuthChannel}
											allowMGLive={this.props.power.allowMGLive}
											onClose={this.onGroupEntranceClose}
											onModal={() => {this.setState({isShowGroupDialog: true})}}
										/>      
									</div>

									{
										!this.isFreeChannel ? (
											<div className="buy-explain">
												<span onClick={() => { this.refs.buyExplainConfirmDialog.show() }}>购买须知</span>
											</div>
										) : null
									}

									{/* 猜你喜欢 */}
									{
										this.tracePage!=="coral" && this.state.hasFetchInitData && isLogined() &&
										<GuestYouLike
											liveId={this.props.channelInfo.liveId}
											businessType="channel"
											businessId={this.props.channelInfo.channelId}
											dimensionType={this.isBought ? 'buy' : 'browse'}
											isShowAd={ this.state.isQlLive }
											urlParams={{
												wcl: isBought ? `promotion_channel-intro-bought` : `promotion_channel-intro`,
												originID: this.props.channelInfo.channelId
											}}
											render={children =>
												<div className="p-intro-section">
													<div className="p-intro-section-title">
														<p>猜你喜欢</p>
													</div>
													{children}
												</div>
											}
										/>
									}

								</div>
							)
						}

						{/* 课程列表 */}
						{
							this.state.courseMount && (
								<div className={`course${this.state.currentTab === "course" ? '' : ' hide'}`}>
									{/* tab-课程 */}

									<div className="p-intro-section channel-topic-list" ref={r => this.topicListEl = r}>
										<div className="p-intro-section-title">
											<p>{this.isCamp ? '课程目录' : '课程列表'}</p>
											<div className={`sort${this.state.isTopicListDesc ? ' descending' : ''}`} onClick={this.onClickTopicListSort}>{this.state.isTopicListDesc ? ' 倒序' : '正序'}<span></span></div>
											<span className="js_course_intro_dom hidden"></span>
										</div>
										{
											topicList.length ?
												<TopicList
													list={topicList}
													onClickItem={this.onClickTopicItem}
                                                    isUnlockChannel={this.chargeConfig.discountStatus === 'UNLOCK'}
                                                    unlockInfo={this.state.unlockInfo}
													isShowAudition={ !this.isBought }
                                                    userUnlockProcess={this.state.userUnlockProcess}
												/>
												:
												<EmptyPage mini imgKey="noCourse" emptyMessage="暂无课程" />
										}
									</div>

								</div>
							)
						}

						{/* 用户评价 */}
						{
							this.state.evaluateMount &&
								<div className={`evaluate${this.state.currentTab === "evaluate" ? '' : ' hide'}`}>
									<Evaluate
										hasValidFilter={this.state.evaluateHasValidFilter}
										onClickValidFilter={this.onClickValidFilter}
									/>
								</div>
						}
					</div>

					{/* 贴片二维码 */}
					{
						!(this.state.isQlLive && this.props.isUniCourse) &&
						this.isNoMoreCourse &&
						!(this.tracePage == "coral") &&
						<div className="paster-qrcode-wrap">
							<PasterQrcode 
								relationInfo={this.props.relationInfo}
							/>
						</div>
					}

				</ScrollToLoad>

				{/* 如果是进行中的解锁课,且页面滑动到一半才显示解锁进度 */}
                {
	                this.state.unlockInfo.currentCount < this.state.unlockInfo.limitCount && chargeInfo.discountStatus === 'UNLOCK' && this.state.tabStick &&
                    <div className="fission-block" >邀请{this.state.unlockInfo.limitCount}人报名，免费解锁全部课程，已邀请{this.state.unlockInfo.currentCount}人</div>
                }

                {/* 已经买了的用户, 而且不是很久之前买的用户, 而且有配置进群url的 才显示 */}
				{
					this.state.showFissionGroupBar && this.props.isAuthChannel && chargeInfo.discountStatus === 'UNLOCK' && this.state.unlockInfo.payType === 'unlock' && this.props.unlockCourseInfo.joinGroupUrl &&
					<div className={`fission-enter-group on-log on-visible ${this.state.unlockInfo.currentCount < this.state.unlockInfo.limitCount && this.state.tabStick ? 'topper' : ''}`}
						 onClick={() => {locationTo(this.props.unlockCourseInfo.joinGroupUrl || '/')}}
						 data-log-region="deblocking_group"
						 data-log-pos="join">
						<div className="head">
							<img src={require('./img/icon-fissionGroup.png')}/>
						</div>
						<div className="main">
							<p className="title">加入班群</p>
							<p className="desc">担心学不好？和老师同学一起学。</p>
						</div>
						<div className="button">进群</div>
						<i className="close icon_cross on-log on-visible"
						   data-log-region="deblocking_group"
						   data-log-pos="close"
						   onClick={(e) => {e.stopPropagation();this.showFissionGroupDialog()}}></i>
					</div>
				}


                {
					this.state.mountBottomPurchasePanel ?
						this.props.isLogined ?
						<BottomPurchasePanel
							isAuthChannel={this.props.isAuthChannel}
							channelInfo={this.props.channelInfo}
							isShowOperateMenuTips={isShowOperateMenuTips}
							isFree={this.isFree}
							isCamp={this.isCamp}
							isVip={this.isVip}
							userId={this.props.userId}
							enterCourse={this.enterCourse}
							isUnHome={ this.isUnHome }
							isUniCourse={ this.props.isUniCourse && this.props.isUniAuth }
							joinUniversityBtn={ this.props.joinUniversityBtn }
							isJoinUni={ this.props.isJoinUni }
							isAnimate={ this.props.isAnimate }
							chargeInfo={currChargeInfo}
							channelCouponStatus={this.props.channelCouponStatus}
							marketingInfo={this.props.marketingInfo}
							sourceChannelId={this.props.channelInfo.sourceChannelId}
							channelId={this.data.channelId}
							myGroupInfo={this.props.myGroupInfo}
							createGroup={this.createGroup}
							joinGroup={this.joinGroup}
							onBuyBtnClick={this.handleBuyBtnClick}
							isWithinShareCut={this.state.isWithinShareCut}
							gotoShareCut={this.gotoShareCut}
							shareCutCourseInfo={this.props.shareCutCourseInfo}
							coupon={this.props.curCoupon}
							s={this.props.location.query.s}
							sign={this.props.location.query.sign}
							t={this.props.location.query.t}
							authTaskCard={this.authTaskCard}
							canInvite={this.state.canInvite}
							showDiscount={this.props.discountExtendPo.showDiscount}
							inviteFriends={() => { this.inviteCourseDialogEle.show() }}
							isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice && this.tracePage !== "coral"}
							groupingList={this.props.groupingList}
							groupStatus={this.props.currentGroupInfo.groupStatus}
							groupResult={this.state.groupResult}
							/**拉人免学费相关 */
							openBackTuitionDialog={this.openBackTuitionDialog}
							showBackTuitionBanner={this.state.showBackTuitionBanner}
							returnMoney={this.data.missionDetail.returnMoney || 0}
							/**************/
							auditionOpenCourse={this.state.auditionOpenCourse}
							enterCampIntro={this.enterCampIntro}
							isPeriodEnd={this.isPeriodEnd}
							tracePage={this.tracePage}
							unlockInfo={this.state.unlockInfo}
							onUnlockBtnClick={this.handleShowFissionCard}
						/>
						:
						<div className="channel-bottom-purchase-panel">
							<span className="buy-btn on-log on-visible"
								data-log-region="channel-login-btn"
								onClick={this.loginHandle}
								>登录</span>
						</div>
					: null
				}

				{/* 请好友免费听课程列表弹窗 */}
				<InviteCourseDialog
					ref={el => this.inviteCourseDialogEle = el}
					loadMore={this.loadMoreInviteCourse}
					noMore={this.isNoMoreCourse}
					topicList={topicList}
					openInviteFriendsToListenDialog={this.openInviteFriendsToListenDialog}
				/>

				<InviteFriendsToListen
					ref={el => this.inviteFriendsToListenDialog = el}
					inviteFreeShareId={this.state.inviteFreeShareId}
					//关闭弹窗后重新初始化分享
					onClose={this.chooseShareReset}
					channelId={this.data.channelId}
					userId={this.props.userId}
					platformShareRate={this.props.platformShareRate}
					coralInfo={this.props.coral}
					source={this.props.location.query.source}
				/>

				{/* 请好友听引导 */}
				{
					!(this.props.isUniCourse) && 
					this.state.isShowInviteFriendsListenGuide && this.state.canInvite && (
						<div className="invite-friends-listen-guide" onClick={this.closeInviteFriendsListenGuide}>
							<div className="guide-bg"></div>
							<div className="btn-box">
								<div className="btn">请好友听</div>
								<div></div>
							</div>
						</div>
					)
				}

				{
					!(this.props.isUniCourse) && 
					isShowOperateMenuTips &&
                    <div className={`operate-menu-tips${this.state.isFromLiveCenter ? ' more-bottom' : ''}`} onClick={this.closeOperateMenuTips}>
                        <div className="tips"></div>
                    </div>
				}

				{/* {
					!this.props.power.allowMGLive && this.state.existCommunity &&
					<CommunitySuspension
						liveId={this.props.liveId}
						groupName={this.state.communityName}
						communityCode={this.state.communityCode}
						// 出现悬浮会员栏时，操作按钮往上挪
						isFixMemberBlock={isShowMemberBlock && this.state.tabStick}
					/>
				} */}

				<OperateMenu
					isUnHome={ this.isUnHome }
					config={this.state.operateMenuConfig}
					entryStyle={{ zIndex: isShowOperateMenuTips ? 201 : '' }}
					onClickEntry={this.closeOperateMenuTips}
					// 出现悬浮会员栏时，操作按钮往上挪
					isFixMemberBlock={(isShowMemberBlock || this.isUnHome)  && this.state.tabStick}
					// 出现一元解锁进度栏时, 操作按钮往上挪
					fixFissionBlock={this.fixFissionBlock}
					haveSchloarship={this.state.schloarshipPacketId}
					showBackHome={this.state.isFromLiveCenter}
					scrolling={this.state.scrolling}
				/>

				<Confirm
					ref="buyExplainConfirmDialog"
					buttons="confirm"
					confirmText="我知道了"
					className="buy-explain-dialog"
					onBtnClick={() => { this.refs.buyExplainConfirmDialog.hide() }}
				>
					<main className='dialog-main'>
						<div className="confirm-top buy-explain-title">购买须知</div>
						<div className="confirm-content buy-explain-content">
							<p>1. 该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时学习，也可反复回听</p><br />
							<p>2. 购买课程后关注我们的服务号，可在菜单里进入听课</p><br />
							<p>3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</p><br />
							<p>4. 该课程听课权益跟随支付购买微信账号ID，不支持更换（赠礼课程除外）</p><br/>
							<p>5. 如有其它疑问，可点击右下角“更多”按钮后选择“咨询”，与内容供应商沟通后再购买</p>
						</div>
					</main>
				</Confirm>

				<Confirm
					ref='createFreeGroupConfirmDialog'
					buttons='confirm'
					onClose={this.onCloseFreeGroupConfirmDialog}
					confirmText="免费发起拼课"
					onBtnClick={this.onConfirmCreateFreeGroupClick}
				>
					<main className='dialog-main pin-dialog'>
						<div className="confirm-top pin-top">
							邀请<span> {this.props.chargeConfigs[0] ? (this.props.chargeConfigs[0].groupNum - 1 || 0) : 0}</span>人拼团
                        </div>
						<div className="confirm-content pin-content">
							你将获得该课程的免费听课机会
							<br />
							团员将以优惠价￥{chargeInfo.discount}购买
                        </div>
					</main>
				</Confirm>

				{/* 付费二次确认框 */}
				<PaymentDetailsDialog
					isShow={this.state.isOpenPayDialog}
					businessType="channel"
					fromPage="channel"
					chargeType={this.props.channelInfo.chargeType}
					chargeConfigs={this.props.chargeConfigs}
					curChannelCoupon={this.props.curCoupon}
					showCouponList={this.showCouponList}
					couponLists={this.state.couponList}
					showDiscount={this.props.discountExtendPo.showDiscount || false}
					toggleChargeIndex={this.toggleChargeIndex}
					onClose={this.handleClosePayDialog}
					pay={this.payChannel}
					isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice && this.tracePage !== "coral"}
				/>

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
						<div className="red-btn on-log on-visible"
							onClick={this.gotoChannelBought}
							data-log-name="进入课程"
							data-log-region="have-bought-dialog"
							data-log-pos="red-btn"
						>进入课程</div>
						<div className="view-bought-records"><a href="javascript:void(0)" onClick={() => locationTo('/live/entity/myPurchaseRecord.htm')}>查看购买记录</a></div>
					</main>
				</Confirm>

				<Confirm
					ref={el => (this.giftTipDialog = el)}
					theme='empty'
					onClose={this.onCloseGiftTipDialog}
					buttons='none'
				>
					<main className='gift-dialog-container'>
						<header>您的赠礼已包装好~</header>

						<p className='gift-tip'>了解赠礼的后续领取情况<br />请在<span>「我的购买记录」</span>中查看</p>

						<footer>
							<a href={`/wechat/page/channel/gift/${this.state.giftId}`} className='gift-button'>查看赠礼</a>
						</footer>
					</main>
				</Confirm>

				<Confirm
					ref={el => (this.giftDialog = el)}
					theme='empty'
					close={true}
					onClose={this.onCloseGiftDialog}
					buttons='none'
				>
					<main className='gift-dialog-container'>
						<header>{this.props.channelInfo.name}</header>

						<p className='title-sm'>赠礼将于90天后过期<br />过期未领取的课程将不退回</p>

						<section className='form-content'>
							{/*会员类型*/}
							{
								this.props.channelInfo.chargeType === 'flexible' ?
									<div className='form-row'>
										<label className='full-title'>会员类型</label>

										<div className='member-type'>
											<i className='left icon_audio_play' onClick={() => { this.onChangeMemberType('decrease') }}></i>
											<span className='middle-content'>
												￥{this.props.chargeConfigs[this.state.curCharge].amount} / {this.props.chargeConfigs[this.state.curCharge].chargeMonths}个月会员
                                            </span>
											<i className='right icon_audio_play' onClick={() => { this.onChangeMemberType('increase') }}></i>
										</div>
									</div>
									: ''
							}

							{/*赠送数量*/}
							<div className="form-row flex-row">
								<label>赠送数量</label>
								<div className="gift-counter">
									<div className='counter'>
										<i className='left on-log on-visible'
											data-log-name="赠好友-减1"
											data-log-region="gift-minus1"
											onClick={() => { this.onChangeCount('decrease') }}>-</i>
										<span className='gift-count'>
											<input type="text" value={this.state.giftCount} onChange={this.onInputCount} />
										</span>
										<i className='right on-log on-visible'
											data-log-name="赠好友-加1"
											data-log-region="gift-add1"
											onClick={() => { this.onChangeCount('increase') }}>+</i>
									</div>
								</div>
							</div>

							{/*合计*/}
							<div className='form-row flex-row'>
								<label>合计</label>
								<div className='text-content'>
									￥
									{/* 特价活动时间内且 没有限制数量，赠礼才能使用特价购买  */}
									{
										(this.props.discountExtendPo.showDiscount && !getVal(this.props, 'discountExtendPo.limitNum')) ?
											(chargeInfo.discount * this.state.giftCount).toFixed(2)
											:
											(this.props.chargeConfigs[this.state.curCharge].amount * this.state.giftCount).toFixed(2)
									}
								</div>
							</div>
						</section>
						<footer>
							<span className={`gift-button on-log on-visible ${this.state.isGiftDisable && 'disable'}`}
								data-log-name="赠好友-打包"
								data-log-region="gift-pack"
								onClick={this.onSubmitGift}>打包{this.state.giftCount}份赠礼</span>
						</footer>
					</main>
				</Confirm>


				{/*留言弹窗*/}
				{
					!!this.state.consultList.length &&
					<div className={"consult-dialog-container " + (this.state.consultPop ? '' : 'hide')}>
						<ReactCSSTransitionGroup
							transitionName="consult-dialog-background"
							transitionEnterTimeout={300}
							transitionLeaveTimeout={300}
						>
							{
								this.state.consultPop ?
									<div className="cc-bg" onClick={this.onHideConsultPop} ></div>
									: null
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
										<div>留言 <var className='num'>{this.state.consultList.length}</var></div>
										<span onClick={this.onHideConsultPop}><i className="icon_delete"></i></span>
									</h1>
									<div className="section-container">
										{
											this.state.consultList.map((val, index) => {
												return <section key={`consult-${index}`}>
													<aside>
														<img src={`${imgUrlFormat(val.headImgUrl, '?x-oss-process=image/resize,w_100,h_100,limit_1')}`} alt="" />
													</aside>
													<main className='consult-content'>
														<article>
															<div className="name-container">
																<h2>{val.name}</h2>
																<span className='time'>{timeBefore(val.replyTime, this.props.sysTimestamp)}</span>
															</div>
															<p>{val.content}</p>
															<span
																className={val.isLike === 'Y' ? 'like ed on-log' : 'like on-log'}
																data-log-region="consult-list-like-btn"
																data-log-pos={index}
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
								</div> : null
							}
						</ReactCSSTransitionGroup>
					</div>
				}

				{/* 自媒体转载系列课领券弹框 */}
				<ReceiveCouponDialog
					coupon={{ ...this.state.mediaCoupon }}
					onReceiveCoupon={this.receiveMediaCoupon}
					show={this.state.isShowMediaCouponDialog}
					onClose={this.closeMediaCouponDialog}
				/>

				{/* 优惠券弹框 */}
				{
					(this.state.couponCode || this.state.codeId) && this.isCanReceiveCoupon &&
					<CouponDialog
						ref={dom => dom && (this.couponDialogDom = dom.getWrappedInstance())}
						isAutoReceive={this.state.isAutoReceive}
						businessType={'channel'}
						businessId={this.data.channelId}
						businessName={this.props.channelInfo.name}
						couponCode={this.state.couponCode}
						codeId={this.state.codeId}
						liveId={this.props.channelInfo.liveId}
						liveName={this.props.channelInfo.liveName}
						isLiveAdmin={this.props.isLiveAdmin}
					/>
				}

				{/* 活动优惠券弹窗 */}
				<ActCouponDialog
					ref={ref => ref && (this.actCouponDialogRef = ref.getWrappedInstance())}
					location={this.props.location}
					onDisplayChange={isShow => isShow && this.setState({ _isShowActCouponDialog: isShow })}
					businessId={this.data.channelId}
					businessType={'channel'}
					payChannel={this.payChannel}
					showPaymentDetailsDialog={() => { this.setState({isOpenPayDialog: true}) }}
					updateCouponList={this.getCoupons}
				/>

				{/* 分享后的弹码与关注直播间的弹码 */}
				<IntroQrCodeDialog
					ref={dom => dom && (this.introQrCodeDialogDom = dom)}
					followDialogType={this.state.followDialogType}
					qrUrl={this.state.qrcodeUrl}
					option={this.state.followDialogOption}
					shareMoney={this.state.shareMoney}
					focusLiveConfirm={this.focusLiveConfirm}
					onClose={this.onClickCloseQrCodeDialog}
					relationInfo={this.props.relationInfo}
				// className="on-visible"
				// data-log-region="visible-channelCFollow"
				// data-log-pos="visible-209"
				/>
				{/* 优惠券列表弹窗 */}
				{this.state.isCoupons && (
					<CouponLists
						chargePrice={this.state.couponUsePrice}
						couponLists={this.state.couponList}
						couponListType="channel"
						hideCoupon={this.hideCoupon}
						from="channel"
						isOnce={this.state.isOnce}
						channelId={this.props.channelId}
					/>
				)}
				{/* 拉人返学费弹窗 */}
				<BackTuitionDialog
					ref={el => this.backTuitionDialogEle = el}

				/>

				{/* C端添加社群引导组件 */}
				{
					!this.props.power.allowMGLive && this.state.existLiveCommunity &&
					<CommunityGuideModal
						liveId={this.props.liveId}
						show={this.state.showCommunityGuideModal}
						type={this.state.modalType}
						groupName={this.state.liveCommunityName}
						communityCode={this.state.liveCommunityCode}
						onClose={this.toggleCommunityGuideModal}
					/>
				}
				{/* {
					this.state.showInviteDialog ?
					<InviteLearn info={this.state.inviteInfo} onClose={() => {
						this.setState({
							showInviteDialog: false
						})
					}}/> : null
				} */}

				{/* 一元购失败弹框  */}
                <FissionFailDialog ref='fissionFailDialog' unlockCourseInfo={this.props.unlockCourseInfo} chargeInfo={chargeInfo || {}} onBuyBtnClick={this.handleBuyBtnClick}/>

                {/* 一元购邀请卡 */}
                <FissionCardDialog ref='fissionCardDialog' unlockCourseInfo={this.props.unlockCourseInfo} userInfo={this.props.userInfo}/>

				{/* 一元购入群弹窗 */}
				<FissionGroupDialog ref='fissionGroupDialog'  onBtnClick={this.hideFissionGroupDialog}/>
				
				<MiddleDialog
					show={this.state.isShowGroupDialog}
					title = "什么是课程社群?"
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
							课程社群是直播间老师为了提升报名学员的学习效率，所设置的学习社群。
						</p>
						<br />
						<p>
							当你加入社群后，将能获得包括<span>上课提醒、学习氛围、和老师对话、反馈学习成果</span>等深度服务，帮助到你更好吸收所学知识。
						</p>
						<br />
						<p>
							马上报名课程，即可加入课程社群~
						</p>
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
                            <div className="btn" onClick={this.onClickFollowLive}>确定</div>
                        </div>
					</div>
				</MiddleDialog>
			</Page>
        );
    };

}


function mapStateToProps(state) {
	return {
		userId: state.channelIntro.userId,
		blackInfo: state.channelIntro.blackInfo,
		sysTimestamp: getVal(state, 'common.sysTime'),
		channelInfo: state.channelIntro.channelInfo,
		channelDesc: state.channelIntro.desc,
		myShareQualify: state.channelIntro.myShareQualify,
		coral: state.channelIntro.coral || {},
		autoShareInfo: state.channelIntro.autoShareInfo || {},
		channelId: state.channelIntro.channelId,
		liveId: state.channelIntro.liveId,
		chargeConfigs: state.channelIntro.chargeConfigs,
        unlockCourseInfo: state.channelIntro.unlockCourseInfo,
		groupinglist: state.channelIntro.groupingList || [],
		groupInfo: state.channelIntro.groupInfo || {},
		groupInfoSelf: state.channelIntro.groupInfoSelf || {},
		vipInfo: state.channelIntro.userVipInfo || {},
		liveInfo: state.live.liveInfo || {},
		isFollow: state.live.isFollow || {},
		power: state.channelIntro.power || {},
		// liveRole: state.channelIntro.liveRole,
		isAuthChannel: state.channelIntro.isAuthChannel === 'Y',
		channelCouponStatus: state.channelIntro.channelCouponStatus || {},
		marketingInfo: state.channelIntro.marketingInfo || {},
		myGroupInfo: state.channelIntro.myGroupInfo || {},
		groupingList: state.channelIntro.groupingList || {},
		currentGroupInfo: state.channelIntro.currentGroupInfo || {},
		alreadyBuyChannelId: state.channelIntro.alreadyBuyChannelId,
		shareCutCourseInfo: state.channelIntro.shareCutCourseInfo || {},
		relayInfo: state.channelIntro.relayInfo || {},
		isLiveAdmin: state.channelIntro.isLiveAdmin,
		isSubscribe: state.channelIntro.isSubscribe,
		isFocusThree: state.channelIntro.isFocusThree,
		isBindThird: state.channelIntro.isBindThird,
		userTag: state.channelIntro.userTag,
		curCoupon: state.channelIntro.curCoupon || {},
		// isOpenEvaluation: state.evaluation.isOpen === 'Y',
		channelSummary: state.channelIntro.channelSummary,
		//会员信息
		memberInfo: getVal(state, 'memberInfo', {}),
		isMember: getVal(state, 'memberInfo.isMember') === 'Y',
		isMemberPrice: getVal(state, 'channelIntro.isMemberPrice') === 'Y',
		evaluation: state.evaluation,
		evaluationData: state.evaluation.evaluationData || {},
		discountExtendPo: getVal(state, 'channel.discountExtendPo', {}),
		userInfo: state.common.userInfo,
		platformShareRate: state.common.platformShareRate, // 平台分销比例中的个人比例
		platformShareQualify: state.common.platformShareQualify,// 平台分销比例中平台的比例
		// 训练营信息
		campInfo: getVal(state, 'training.campInfo', {}),
		joinCampInfo: getVal(state, 'training.joinCampInfo', {}),
		isCouponResult: getVal(state, 'channelIntro.isCouponResult', false),
		relationInfo: state.common.relationInfo,
        isLogined: getVal(state, 'channelIntro.isLogined'),
	}
}

const mapActionToProps = {
	fetchInitData,
	channelCreateGroup,
	getChannelGroupResult,
	getMyGroupInfo,
	updateChannelGroupingList,
	followLive,
	fetchTopicList,
	isCollected,
	addCollect,
	cancelCollect,
	doPay,
	getAuth,
	getDomainUrl,
	bindLiveShare,
	updateChannelAuth,
	fetchMediaCouponList,
	fetchCouponListAction,
	updateCouponInfo,
	bindOfficialKey,
	getConsultSelected,
	consultPraise,
	getOpenPayGroupResult,
	countSharePayCache,
	updateChannelCouponStatus,
	fetchMediaCouponDetail,
	fetchIsReceivedCoupon,
	receiveMediaCoupon,
	getQrCode,
	userBindKaiFang,
	getMyQualify,
	checkUser,
	getCouponDetail,
	// getEvaluationData,
	getEvaluationList,
	// getIsOpenEvaluate,
	getIfHideGroupInfo,
	selectCouponIdx,
	// updateMemberInfo,
	isShowMemberLine,
	getShareRate,
	getPlatFormQualify,
	getUserInfo,
	getGiftId,
	ifGetCousePayPasterLink,
	fetchChannelInfo,
	dispatchFetchRelationInfo,
	fetchAndUpdateSysTime,
	fetchCourseTag
};

module.exports = connect(mapStateToProps, mapActionToProps)(Channel);
