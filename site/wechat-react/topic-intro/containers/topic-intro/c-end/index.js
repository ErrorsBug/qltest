import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { autobind, throttle } from 'core-decorators';
import { eventLog } from 'components/log-util';
import { isQlchat } from 'components/envi';
import { get } from 'lodash';

// components

import { formatDate, locationTo, htmlTransferGlobal, getVal, getCookie, wait, handleAjaxResult,
    isFromLiveCenter, getLocalStorage, setLocalStorage, imgUrlFormat, isNextDay, formatMoney,
    filterOrderChannel, randomShareText, formatNumber, baiduAutoPush, setCookie, getCourseHtmlInfo } from 'components/util';
import { fillParams, getUrlParams } from 'components/url-utils';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { share } from 'components/wx-utils';
import { Confirm } from 'components/dialog';
import CouponDialog from 'components/coupon-dialog';
import CommunityGuideModal from 'components/community-guide-modal';

import PasterQrcode from './components/paster-qrcode';
// import ComplainFooter from './components/complain-footer';
import BottomBrand from "components/bottom-brand";
import IntroHeader from '../../../components/cend-intro-header';
import OperateMenu from 'components/operate-menu/v2';
import LiveInfo from 'components/live-info';
import IntroQrCodeDialog from 'components/intro-qrCode-dialog'
import InviteFriendsToListen from 'components/invite-friends-to-listen';
import SpecialsCountDown from '../../../components/specials-count-down';
import CourseDatial from '../../../components/course-details';
import { apiService } from 'components/api-service';
import ComeFromAct from '../../../components/come-from-activity';



import BottomMenus from './components/bottom-menus';
import CourseIntro from './components/course-intro';
import GiftDialog from './components/gift-dialog';
import ConsultModule from './components/consult-module';
import CouponBtn from '../../../components/coupon-btn';
import ShareBtn from '../../../components/share-btn';
import GuestYouLike from 'components/guest-you-like';
import Evaluate from '../../../components/evaluate';
import MemberBlock from '../../../components/member-block';
import CouponLists from '../../../components/coupon-lists';
import AppDownloadBar from 'components/app-download-bar';

import ActCouponDialog from '../../channel-intro/c-end/components/act-coupon-dialog';
import ChannelCourseIntro from '../../channel-intro/c-end/components/course-Intro';
import BackTuition from '../../../components/back-tuition-bannner';
import BackTuitionLabel from '../../../components/back-tuition-label';
import BackTuitionDialog from 'components/back-tuition-dialog';
// import InviteLearn from "../../../components/invite-learn";
import BooksUI from './components/books-ui'

// actions
import {
    userIsOrNotCustomVip,
    tripartiteLeadPowder,
    subscribeStatus,
    isFollow as checkFollow,
    whatQrcodeShouldIGet,
    subAterSign,
    getAllConfig,
    request,
    checkShareStatus,
    fetchShareRecord,
    uploadTaskPoint,
    getUserInfo,
    getCommunity,
    getReceiveInfo,
    ifGetCousePayPasterLink,
    checkEnterprise,
    dispatchFetchRelationInfo
} from 'common_actions/common'

import {
    fetchCouponListAction,
    getPacketDetail,
} from 'common_actions/coupon';
import { getPersonCourseInfo, getCoralQRcode } from "common_actions/coral";

import {
    getShareRate,
    getPlatFormQualify,
} from 'common_actions/live';

import {
    fetchInitData,
    getTopic,
    consultPraise,
    checkUser,
    getRealStatus,
    userBindKaiFang,
    topicTaskCardAuth,
    getTopicAutoShare,
    bindShareKey,
    selectCouponIdx,
    getChannelGroupResult
} from '../../../actions/topic-intro';

import {
    getQr,
    bindOfficialKey,
    getIsOrNotListen,
    followLive,
    getQrCode,
    getMyQualify,
    isShowMemberLine,
    fetchPayBackReturnMoney,
    fetchCourseTag
} from '../../../actions/common';

import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import {
    publicApply,
    addPageUv,
} from 'thousand_live_actions/thousand-live-common';

import {
    getEvaluableStatus,
} from 'thousand_live_actions/evaluation';

import {
    checkDuplicateBuy,
    fetchQlQrcode,
} from '../../../../other-pages/actions/channel';

import {
    isCollected,
    addCollect,
    cancelCollect
} from '../../../../other-pages/actions/mine';

import {
    getEditorSummary
} from '../../../actions/editor';

import {
    getEvaluationList,
    getEvaluationData,
    getIsOpenEvaluate
} from '../../../actions/evaluation';

import {
	getChannelProfile
} from '../../../actions/channel';

import {
    channelTaskCardAuth,
    getIsAuthChannel,
    fetchPayUser,
} from '../../../actions/channel-intro';
import HomeFloatButton from "components/home-float-button";
import UniversityStatusHoc from '../../../components/university-auth'
import UniversityBlock from '../../../components/university-block'
import UniversityCollege from '../../../components/university-college'
import AddUniversityCourse from '../../../hoc/uni-join-course'
import MiddleDialog from 'components/dialog/middle-dialog';
import IntroGroupBar from "components/intro-group-bar";
import DialogMoreUserInfo from 'components/dialogs-colorful/more-user-info/index';

@UniversityStatusHoc
@AddUniversityCourse
@autobind
class TopicIntro extends Component {

    state = {
        // 标记是否已获取初始信息
        hasFetchInitData: false,
        
        // 是否开启评价
        isOpenEvaluate: false,
        // 是否开启vip
        isOpenVip: false,
        // 是否允许评价
        canStatus: 'N',

        topicList: [],
        // 显示珊瑚弹框
        coralPushVersible: false,
        //显示课程推送弹框
        showPushTopicDialog: false,
        // 是否显示滚动到顶部
        showGoToTop: false,
        // 珊瑚计划推广弹窗相关
        showCoralPromoDialog: false,
        coralPromotionPanelNav: 'tutorial',
        coralPushData: {},
        // 显示tab模块
        showTabModule: false,
        tabKey: '',

        showBottomMenu:false,
        isOrNotListen: 'N', // 是否畅听直播间

        autoSharePercent: '', // 自动分销比例
        
        // 重复购买提示
        // 显示关注千聊公众号的弹窗
        isShowQlQrcodeDialog: false,
        // 已经购买过的相同系列课的id
        alreadyBuyChannelId: '',
        // 千聊公众号二维码链接url
        qrcodeUrl: '',
        // 是否显示定制vip样式
        showVipIcon:false,

        // 是否开启自动领取，默认开启，就是页面刚进来的时候需要自动领取优惠券，如果是在介绍中点击那个优惠券的话这个开关需要关闭，见onReceiveClick方法
        isAutoReceive: true,

        // 是否已收藏
        isCollected: false,

        // ‘更多’菜单配置
        operateMenuConfig: [],

        // 直播状态（plan-未开始；beginning-直播中；complete-已完成（直播完进入互动环节; ended-已结束
        liveStatus: '',
        // 是否有分销
        distribution: false,
        // 分销赚多少钱
        shareMoney: 0,
        followDialogType: '',
        followDialogOption: {},
        
        currentTab: "intro",
        
        // 是否有资格邀请好友免费听
        canInvite: false,
        // 剩余邀请人数
        remaining: 0,
		// 免费听邀请id
        inviteFreeShareId: '',
        // 显示当前单课优惠券列表
        isCoupons: false,
        // 优惠券列表
        couponList: [],
        // 优惠券列表是否为第一次渲染
        isOnce: false,
        // 拼课详情
        groupResult: {},

        // 有效评价过滤开关
        evaluateHasValidFilter: false,
        
        // 优惠券列表展示专用
        couponListType: 'topic',
        couponUsePrice: 0,
        
        coralInfo: {},
        
        // 更多操作按钮提示
        isShowOperateMenuTips: false,

        // 直播间社群引导信息
        showCommunityGuideModal: false,
        modalType: '',
        existLiveCommunity: false,
        liveCommunityCode: '',
        liveCommunityName: '',

        // 话题社群
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
        audienceCount: 0,

        isApp: isQlchat(),
        
        showInviteDialog: false,
		inviteInfo: {},
        // 平台通用券（奖学金）Id相关
		schloarshipPacketId: '',
        /****************/
        
        isFromLiveCenter: isFromLiveCenter(),
        
        // 企业认证信息
        enterprisePo: {},
        // 是否弹起了付费信息框
        isOpenPayDialog: false,

        communityInfo: null, // 社群信息
		groupHasBeenClosed: true, // 關閉社群入口
        isShowGroupDialog: false, // 显示社群弹窗
    }

    get isUnHome(){
		const isUnHome =  getUrlParams('isUnHome', '')
		return Object.is(isUnHome, 'Y');
	}

    data = {
        channelNo : '',
        missionDetail: {}, // 拉人返学费数据
        cacheCouponList: {}, // 优惠券列表存储
    };

    // 页面的滚动体
    scrollPage = null
    // 咨询弹框
    dialogConsult = null
    // 赠礼弹框
    giftDialog = null
    // 转播弹框
    relayDialog = null
    // 底部
    bottomMenus = null
    // 话题介绍
    courseIntro = null
    // 精选留言
    consultRef = null
    // 更多课程
    topicList = null
    // tab模块
    tabToModule = null

    componentWillMount() {
        if (this.props.topicInfo.status === 'delete') {
            // 话题被删除 前端和后端拦截双重保障
            locationTo(`/wechat/page/link-not-found?type=topic&liveId=${this.props.topicInfo.liveId}`);
            return false;
        }
        if (typeof(document) != 'undefined') {
            this.data.channelNo = this.props.location.query.pro_cl || getCookie('channelNo') || '';
        }
    }

    isInviteAuditionUserId () {
        if (!this.inviteAuditionUserId) return ;
		console.log(this.props.location.query.inviteAuditionUserId, 'inviteId')
		this.setState({
			showInviteDialog: this.inviteAuditionUserId != getCookie('userId') ? true : false
		})
    }
    
    async handleInvite () {
        if (!this.inviteAuditionUserId || this.inviteAuditionUserId == getCookie('userId')) return ;
		try {
			let inviteInfo = await this.ajaxInviteInfo();
			this.setState({
				inviteInfo
			})
            let result = await this.ajaxSaveInvite(inviteInfo.topicId)
            this.isInviteAuditionUserId();
		} catch (error) {
			console.error(error);
		}
	}

    async ajaxInviteInfo () {
		if (!this.inviteAuditionUserId) return;
		try {
			let result = await apiService.post({
				url: '/h5/invite/audition/inviteInfo',
				body: {
					inviteAuditionUserId: this.inviteAuditionUserId,
					channelId: this.props.topicInfo.channelId
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

    async componentDidMount() {

        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
		}

        /***************************/
        // 注意需要userid的接口请求要放在fetchInitData判断里面！！
        /***************************/
        await this.fetchInitData();
        /***************************/
        // 注意需要userid的接口请求要放在fetchInitData判断里面！！
        /***************************/

        
        if(!this.props.topicSummary && !this.props.topicInfo.remark && !this.props.profile.length && this.props.topicInfo.channelId){
            this.getChannelEditorSummary();
        }
        
        const config = await getAllConfig({ liveId: this.props.liveId });

        // C端用户获取直播间和话题是否有关联社群
        if (!this.props.power.allowMGLive) {
            let data = await getCommunity(this.props.liveId, 'topic', this.props.topicId);
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
        if(this.props.topicInfo && this.props.topicInfo.channelId){
            this.initChannelIntroHeader();
        }

        this.getCompany();

        
		// 10s后简化推广赚按钮
		setTimeout(() => {
            this.setState({
                shareBtnSimplify: true
			})
        }, 10000);
        
        // 获取好友关系
        this.props.dispatchFetchRelationInfo({userId: this.props.userId});
        this.dispatchGetCommunity();
        
		this.initHtmlInfo({
			businessId: this.props.topicId,
			businessType: 'topic',
			businessName: htmlTransferGlobal(this.props.topicInfo.topic), 
			liveName: this.props.topicInfo.liveName, 
			intro: this.props.topicInfo.guestIntr || ''
		});
    }

    componentDidUpdate(preProps,preState) {
        if (!this.isUpdateShare && this.props.platformShareRate && this.props.platformShareRate != preProps.platformShareRate) {
            // 重置页面分享。
            this.isUpdateShare = true;
            this.initShare();
        }
    }

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
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

    // 获取企业认证信息
    async getCompany(){
		const { data = {} } = await checkEnterprise({liveId: this.props.liveId,});
		this.setState({
			enterprisePo: data
		});
    }

    initScrollEvent () {
        this.mainContainer = findDOMNode(this.scrollEl)
        if(this.mainContainer){
            this.introHeaderHeight = findDOMNode(this.refs.introHeader).clientHeight
            this.mainContainer.addEventListener('scroll', this.scrollHandle)
            setTimeout(() => {
                this.tabDom && this.computeContenHeight()
            }, 0);
        }
    }

    // 计算内容高度 当内容不足一屏时，补充内容高度 (注：当存在tab栏时)
    computeContenHeight () {

        // 当课程切换正逆序时，内容不足滚动条会上滚
		const wrapEl = document.querySelector('.co-scroll-to-load main');
		if (!wrapEl) return;
		const tabEl = document.querySelector('.co-scroll-to-load .tab');
		if (!tabEl) return;
		wrapEl.style.minHeight = tabEl.offsetTop + this.mainContainer.clientHeight + 'px';
		return;

        const contentHeight = this.introAnchorDom.clientHeight
        let pb = 120
        if (contentHeight < this.mainContainer.clientHeight - this.tabDom.clientHeight) {
            pb = this.mainContainer.clientHeight - this.introAnchorDom.clientHeight - this.tabDom.clientHeight
        }
        this.mainContainer.style.paddingBottom = `${pb}px`
    }

	@throttle(300)
    scrollHandle () {
    
		if (this.SlideStateTimer) {
			clearTimeout(this.SlideStateTimer)
		}

		this.SlideStateTimer = setTimeout(() => {
			this.setState({
				isScrollRolling: false
			})
		}, 300);

        const state = {}
        
        if (!this.state.tabStick && this.tabDom && this.mainContainer.scrollTop >= this.tabDom.offsetTop) {
			state.tabStick = true
        } else if (this.state.tabStick && this.tabDom && this.mainContainer.scrollTop < this.tabDom.offsetTop) {
			state.tabStick = false
		}
        
        if (this.props.curChannelCoupon || this.props.curTopicCoupon) {

            const couponButtonRef = findDOMNode(this.couponButtonRef);

            if(!this.introAnchor){
	            this.introAnchor = findDOMNode(this.introContentEl)
            }

            if (!this.couponButtonTop && couponButtonRef) {
                this.couponButtonTop = couponButtonRef.offsetTop + this.introAnchor.offsetTop
            }

            if (!this.state.isCouponBtnFixed && this.couponButtonTop && this.couponButtonTop - this.mainContainer.scrollTop <= this.introHeaderHeight) {
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

    getChannelEditorSummary = async () => {
        const result = await this.props.getEditorSummary(this.props.topicInfo.channelId, 'channel');
        const channelSummary = getVal(result, 'data.content')
        if (result.state.code === 0 && channelSummary) {
            this.setState({
                channelSummary,
                showChannelIntro: true,
            })
        }else{
            const channelProfileRes = await getChannelProfile({
                channelId: this.props.topicInfo.channelId
            });
            const channelProfile = getVal(channelProfileRes, 'data.descriptions', {});
            if(channelProfileRes.state.code === 0 && channelProfile){
                this.setState({
	                channelProfile,
	                showChannelIntro: true,
                })
            }else{
                this.setState({
	                showChannelIntro: true,
                })
            }
        }
    };

    // 判断是否已经购买过相同的系列课
    checkDuplicateBuyStatus = async () => {
        const channelId = this.props.topicInfo.channelId;
        // 只有系列课内的课程才需要检查系列课的重复购买情况
        if (channelId) {
            const result = await this.props.checkDuplicateBuy(channelId);
            if (result.state.code === 0) {
                this.setState({
                    alreadyBuyChannelId: result.data.alreadyBuyChannelId
                });
            }
        }
    }

    // 获取千聊公众号的二维码链接
    fetchQlQrcode = async () => {
        /** 珊瑚来源不引导关注 */
        if(this.tracePage=="coral"){
            return false;
        }
        const result = await this.props.fetchQlQrcode();
        if (result.state.code === 0) {
            this.setState({
                qrcodeUrl: result.data.qrUrl
            });
        }
    }

    // 弹出重复购买的提示信息
    promptDuplicateBuy = () => {
        if (this.state.alreadyBuyChannelId) {
            this.refs.haveBoughtDialog.show();
            return false;
        }
        return true;
    }

    // 跳转至已经购买过的系列课主页
    gotoChannelBought = () => {
        if (this.state.alreadyBuyChannelId) {
            locationTo(`/live/channel/channelPage/${this.state.alreadyBuyChannelId}.htm`);
        }
    }

    getIsOrNotListen = async () => {

        const result = await this.props.getIsOrNotListen({
            liveId: this.props.liveId,
            topicId: this.props.topicId
        });
        handleAjaxResult(result, (data) => {
            this.setState({
                isOrNotListen: data.isListen
            })
        })
    }

	sendPV(){
		// 手动打PV，并给页面所有事件统计加上mark字段
		if(typeof _qla !== 'undefined'){
			const mark = isFromLiveCenter() ? `ce-${(this.props.isAuthTopic || this.isVip) ? 'bought' : 'unbought'}` : 'be';
			const userTag = this.props.userTag;
			_qla('pv', {
				mark,
                userTag,
			});
			_qla.set('mark', mark);
			_qla.set('userTag', userTag);
		}
	}

    // 初始化基础数据
    async fetchInitData() {
        const topicId = this.props.topicId;
        const liveId = this.props.liveId;
        const channelId = this.props.channelId;
        const campId = this.props.campId;
        // 获取初始数据
        const a = await this.props.fetchInitData({ topicId, liveId, campId, channelId, isCoral:(this.tracePage==='coral')});
        this.sendPV();
		this.setState({hasFetchInitData: true});
        this.initTopicAuth();
        await this.props.getUserInfo();

        this.setState({
            isOpenEvaluate: this.props.liveInfo.entityExtend.isOpenEvaluate,
            isOpenVip: this.props.liveInfo.entityExtend.isOpenVip == 'Y',
            showBottomMenu: !this.state.isApp && true,
            couponCode: this.props.location.query.couponCode,
            codeId: this.props.location.query.codeId,
			isShowInviteFriendsListenGuide: !this.state.isApp && isNextDay('inviteFriendsListenGuide'),
			isQlLive: await this.isQlLive() === 'Y'
        });
        

        this.chooseShare();
        
        
	    
        /***************************/
        // 只有登录才有的操作
        /***************************/
        if (getCookie('userId') && !this.state.isApp) {
            
            // this.initCoralPushData();
            this.isCheckUser();
            this.initEvaluableStatus();
            this.getIsOrNotListen();
            this.checkDuplicateBuyStatus();
            
            this.initCustomizedVipBtn();
            this.checkShareStatus();
            this.initMemberBlock()
            this.handleGetChannelGroupResult()
            if(this.isAutoShareOnly && !this.props.topicInfo.channelId){
                this.getTopicAutoShare();
            }
            // 绑定分销关系
            await this.bindlShareKey();
            
            //officialKey，就绑定关系
            if(this.props.location.query.officialKey){
                this.props.bindOfficialKey({
                    officialKey: this.props.location.query.officialKey
                });
            }
            await this.initUserBindKaiFang();
            this.fetchQlQrcode();
            // 是否显示转播
            if (this.props.relayConfig.showWelcome === 'Y') {
                this.relayDialog.show();
            }
            
            this.initFocusConfirm();

            // 初始化珊瑚课程信息
            // this.initCoralInfo()
            
            // 试听课获取是否已购系列课状态
            if (this.props.topicInfo.isAuditionOpen === 'Y' && channelId) {
                this.props.getIsAuthChannel(channelId);
            }

            // 收费话题绑定千聊平台分销
            this.getShareRate();
            this.props.getPlatFormQualify({liveId: this.props.topicInfo.liveId})// 获取平台分销中的平台比例

            // 返学费初始化状态
            this.initInviteReturnInfo()
            // 返学费领取状态（拿到missionId用于下单）
            this.getReceiveInfo()

            this.handleInvite()
            // 介绍页显示发平台通用券按钮
            setTimeout(_=>{
                this.getPacketDetail();
            }, 1000)

            this.props.getEvaluationData({
                topicId
            })

            await this.props.getIsOpenEvaluate(this.props.liveId)
            
        }
        


        // 话题统计
        this.addPageUv();

        if (!this.state.isApp) {
            this.initOperateMenuConfig();
        }

        this.initIsCollected();

        this.setState({
            liveStatus: this.getLiveStatus()
        })

        //初始化滚动事件
        this.initScrollEvent()
        
        // 手动触发打曝光日志
	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.collectVisible();
	    }, 10);
		// 绑定滚动区捕捉曝光日志
	    setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-container');
		    typeof _qla != 'undefined' && _qla.bindBrowseScroll('scroll-container');// 等大数据处理再上
        }, 1000);
    }

    // 绑定分销关系
    async bindlShareKey(){
        let lshareKey = this.props.location.query.lshareKey;
        let taskCardShare = this.props.location.query.taskCardShare === 'Y' ? true : false;
        if (taskCardShare || lshareKey) {
            await this.props.bindShareKey(this.props.topicInfo.liveId, lshareKey, taskCardShare ? 'taskCardShare' : (isFromLiveCenter() || this.props.location.query.sourceNo) === 'livecenter' ? 'livecenter' : '');
        }
    }

    //重置分享，用这个方法，因为要判断珊瑚分享
    chooseShare(){
        if(this.tracePage === 'coral'){
            this.initCoralShare();
        }else{
            this.initShare();
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
                key: 'couponCode',
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
                key: 'gift',
                name: '赠好友',
                qlicon: 'present',
                onClick: this.onClickMore_gift,
                className: 'on-log on-visible',
                'data-log-name': '更多-赠好友',
                'data-log-region': 'more_gift',
            }
        ]

        let topicInfo = this.props.topicInfo;

        // 不显示优惠码兑换
        if (this.props.isAuthTopic ||
            this.props.power.allowSpeak ||
            topicInfo.isRelay === "Y" ||
            (topicInfo.channelId && topicInfo.isSingleBuy !== "Y") ||
            topicInfo.campId ||
            !this.props.topicInfo.money
        ) {
            operateMenuConfig = operateMenuConfig.filter(item => item.key !== 'couponCode')
        }

        // 不显示赠好友
        if (!topicInfo.money ||
            topicInfo.campId ||
            topicInfo.channelId
        ) {
            operateMenuConfig = operateMenuConfig.filter(item => item.key !== 'gift')
        }

        this.setState({
            operateMenuConfig,
        })

        // 已注册大于7天的用户弹出更多按钮提示
        if (this.props.userId && !getLocalStorage('NO_TOPIC_INTRO_OPERATE_MENU_TIPS')) {
            setTimeout(() => {
                this.props.getUserInfo().then(res => {
                    const createTime = getVal(res, 'data.user.createTime');
                    if (createTime && Date.now() - createTime > 604800000) {
                        this.setState({
                            isShowOperateMenuTips: true,
                        })
                    }
                }).catch(err => {})
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

    // 判断是否有访问话题的权限
    async initTopicAuth() {
        if ((this.props.topicInfo.displayStatus == 'N' || this.props.channelDisplayStatus == 'N') && !this.props.isAuthTopic) {
            // 如果话题隐藏，且没有访问权限，则跳出页面；
            locationTo(`/wechat/page/topic-hide?liveId=${this.props.topicInfo.liveId}`);
            return false;
        } else if (this.props.blackInfo.type) {
            // 如果被拉黑；
            let blackType = this.props.blackInfo.type;
            let url = '';
            if (blackType === 'live') {
                url = `/wechat/page/is-black?liveId=${this.props.topicInfo.liveId}&isLive=true`;
            } else if(blackType === 'user') {
                url = '/black.html?code=inactived';
            } else {
                url = `/wechat/page/is-black?liveId=${this.props.topicInfo.liveId}`;
            }

            locationTo(url);
            return false;
        }

    }



    // 初始化推荐话题
    async initTopicList() {
        let topicList = await this.props.getTopic(this.props.liveId, 1);
        this.setState({
            topicList
        })
    }

    async getTopicAutoShare(){
    	const res = await this.props.getTopicAutoShare({
		    topicId: this.props.topicId
	    });
    	if(res.state.code === 0){
    		this.setState({
			    autoSharePercent: res.data.percent
		    })
	    }
    }
    
	async initMemberBlock () {
		const params = {
			businessId: this.props.topicInfo.id,
			businessType: "topic",
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
                memberCourseReceive: res.data.isMemberSendCourse === 'Y'
			})
        }
    }
    // 判断是否是拼课
    async handleGetChannelGroupResult() {
        let res = await this.props.getChannelGroupResult(this.props.channelId)
        if (res.state.code === 0) {
            this.setState({
                groupResult: res.data
            })
        }
    }
    /**
	 *
	 * 话题统计
	 * @memberof TopicIntro
	 */
	async addPageUv(){
	    await wait(3500);
		this.props.addPageUv(this.props.topicId, this.props.liveId, ['topicIntro', 'liveUv'], this.data.channelNo, this.props.location.query.shareKey ||'');
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

    shareParamsTryListen = () => {
        if (!this.props.topicInfo.channelId) return '';
        if (this.props.isAuthChannel == 'Y') return '';
        return this.props.topicInfo.isAuditionOpen == 'Y' ? '&inviteAuditionUserId=' + getCookie('userId') : ''
    }

    /**
     *
     * 初始化分享
     *
     * @memberof TopicIntro
     */
    async initShare() {

        let wxqltitle = this.props.topicInfo.topic;
        let descript = this.props.topicInfo.liveName;
        let wxqlimgurl = this.props.topicInfo.backgroundUrl ? imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,w_100,h_100,limit_1') : "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        // let shareUrl = window.location.origin + this.props.location.pathname + '?topicId=' + this.props.topicId + "&pro_cl=link";

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + '?topicId=' + this.props.topicId + "&pro_cl=link" + this.shareParamsTryListen();
		let pre = `/wechat/page/live/${this.props.liveId}?isBackFromShare=Y&wcl=middlepage`;

        if (this.props.topicInfo.status == "ended") {
            wxqlimgurl=shareBgWaterMark(wxqlimgurl,'study');
        }else if( Number(this.props.topicInfo.startTime) >  Number(this.props.sysTime) ){
            wxqlimgurl=shareBgWaterMark(wxqlimgurl,'plan');
        }else{
            wxqlimgurl=shareBgWaterMark(wxqlimgurl,'start');
        };

        const shareObj = randomShareText({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            shareUrl: target,
        })

        // 有登录才初始化更多信息
        if (this.props.userId) {
            if (this.props.myShareQualify && this.props.myShareQualify.shareKey && this.props.myShareQualify.type == 'live') {
                shareObj.title = "我推荐-" + shareObj.title;
                shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
                shareObj.shareUrl += "&lshareKey=" + this.props.myShareQualify.shareKey;
            }else if(this.props.myShareQualify && this.props.myShareQualify.shareKey && this.props.myShareQualify.type == 'topic'){
                shareObj.title = "我推荐-" + shareObj.title;
                shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
                shareObj.shareUrl += "&shareKey=" + this.props.myShareQualify.shareKey;
            } else if (this.props.topicInfo.isAuditionOpen === 'Y') {
                // 免费试听的文案
                shareObj.title = this.props.topicInfo.topic;
                shareObj.desc = `${this.props.userInfo.name}送你一堂试听课`;
                shareObj.timelineTitle = shareObj.title;
                wxqlimgurl = this.props.topicInfo.channelImg;
                wxqlimgurl=shareBgWaterMark(this.props.topicInfo.channelImg,'study');
            }
            if (this.props.platformShareRate) {
                shareObj.shareUrl += "&wcl=pshare&psKey=" + this.props.userId;
            }

        }

        // 如果是听书
        if (this.props.isListenBook) {
            shareObj.title = this.props.topicInfo.topic
            shareObj.desc = this.props.topicInfo.bookDescription
            shareObj.timelineTitle = shareObj.title + "|" + shareObj.desc
            wxqlimgurl = imgUrlFormat(this.props.topicInfo.bookHeadImage, '?x-oss-process=image/resize,w_100,h_100,limit_1')
        }

        /* 从微信活动页跳转过来的，分享过程url要去掉isFromWechatCouponPage，否则支付金额将错误*/
        shareObj.shareUrl = fillParams({ isUnHome: 'N' }, shareObj.shareUrl, ['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']);
        /*****/

        /* 带参wcl和ch，两者保留 */
        if (this.props.location.query.ch) {
            shareObj.shareUrl = fillParams({ch: this.props.location.query.ch, isUnHome: 'N'}, shareObj.shareUrl);
        }
        if (this.props.location.query.wcl) {
            shareObj.shareUrl = fillParams({wcl: this.props.location.query.wcl, isUnHome: 'N'}, shareObj.shareUrl);
        }
        /*****/

		if (this.props.location.query.psKey || ( this.props.userId&&await this.isQlLive() === 'Y')) {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
        }
        

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;
        
        console.log('分享信息: ', shareObj,wxqlimgurl)
        let shareOptions = {
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: this.onShareComplete,
        }
        share(shareOptions);
    }


	/**
	 * 已废弃这个判断，现在都是用珊瑚来源判断
	 * 是否只有珊瑚计划一个身份(非课代表非直播间创建者)
	 *
	 * @memberof TopicIntro
	 */
    // get isCoral(){//只要有珊瑚计划，就默认显示珊瑚计划20180323
	//     const { coralPercent, liveRole } = this.props;
    //     return coralPercent && liveRole !== 'creater';
    // }
	/**
	 *
	 * 是否只有自动分销
	 *
	 * @memberof TopicIntro
	 */
    get isAutoShareOnly(){
	    const { myShareQualify, coralPercent, topicInfo } = this.props;
	    const hasLShareKey = myShareQualify && myShareQualify.shareKey && myShareQualify.status === 'live';

	    return !hasLShareKey && myShareQualify.joinType ==='auto' && !coralPercent && topicInfo.isAutoshareOpen === 'Y';
    }
	/**
	 *
	 * 初始化珊瑚计划分享
	 *
	 * @memberof TopicIntro
	 */
	initCoralShare(){
		const wxqltitle = '我推荐-' + this.props.topicInfo.topic;
		const descript = this.props.topicInfo.liveName;
		const wxqlimgurl = this.props.topicInfo.backgroundUrl ? imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,w_100,h_100,limit_1') : 'https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png';
		const friendstr = wxqltitle;
		// const shareUrl = fillParams({
		// 	officialKey: this.props.userId,
		// 	pro_cl: 'link'
        // });

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = fillParams({
            isUnHome: 'N',
			officialKey: this.props.userId,
			pro_cl: 'link'
        });
        if (this.props.topicInfo.isAuditionOpen === 'Y') {
            // 免费试听的文案
            wxqltitle = this.props.topicInfo.topic;
            descript = `${this.props.userInfo.name}送你一堂试听课`;
            friendstr = wxqltitle;
            wxqlimgurl = this.props.topicInfo.channelImg;
        }
        target = fillParams({ isUnHome: 'N' },target,['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']);
		const pre = `/wechat/page/live/${this.props.liveId}?isBackFromShare=Y&wcl=middlepage${this.shareParamsTryListen()}`;

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        const shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(target))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

		share({
			title: wxqltitle,
			timelineTitle: friendstr,
			desc: descript,
			timelineDesc: friendstr, // 分享到朋友圈单独定制
			imgUrl: wxqlimgurl,
			shareUrl: shareUrl,
		});
    }

	/**
	 * 获取课代表分成比例,可以用于判断课程授权分销，直播间授权分销，自动分销
	 *
	 * @readonly
	 *
	 * @memberOf Channel
	 */
	get distributionPercent(){
		return (this.props.myShareQualify && this.props.myShareQualify.shareEarningPercent) || '';
    }

    /**
     * 获取价格
     * @readonly
     * @memberof TopicIntro
     */
    get Price(){
        if(this.props.topicInfo.channelId){
            return this.props.channelChargeConfigs[0] && this.props.channelChargeConfigs[0].amount || 0
        }
        return formatMoney(this.props.topicInfo.money);
    }

    // 分享成功回调使用
    async onShareComplete() {

		// 学分任务达成触发点
		uploadTaskPoint({
            assignmentPoint: 'grow_share_course',
        })
        
        /** 珊瑚来源不引导关注 */
        if(this.tracePage=="coral"){
            return false;
        }

        let shareMoney, distribution;

        if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelChargeConfigs[0]) {
            // 如果没有开启单节购买
            if (this.props.channelChargeConfigs[0].discountStatus === 'N') {
                shareMoney = this.props.channelChargeConfigs[0].amount*100;
            } else {
                shareMoney = this.props.channelChargeConfigs[0].discount*100
            }
        } else {
            shareMoney = this.props.topicInfo.money;
        }

        distribution = !!this.distributionPercent;
        if (isFromLiveCenter() && this.props.platformShareRate) {
            // 如果是平台分销，则优先单课价格。
            distribution = true;
            
            shareMoney = shareMoney * (this.props.platformShareRate / 100);
            this.setState({
                shareMoney
            })
            
        }else{
            shareMoney = shareMoney * (this.distributionPercent / 100);
            this.setState({
                shareMoney
            })
            
        }

        
        /**
		 * shareDistribution: 有分销的分享二维码弹窗
		 * shareNoDistribution: 无分销的分享二维码弹窗
		 */
		this.setState({
			followDialogType: distribution ? 'shareDistribution' : 'shareNoDistribution'
		})
        // C端有分销弹1007，无分销走三方导粉配置
		if(distribution){
            const config = await getAllConfig({liveId: this.props.liveId});
			if (!this.props.isSubscribe.subscribe && config.data.isWhite === 'N') {
                const qrcodeUrl = await this.props.getQrCode({
                    channel: '1007',
                    topicId: this.props.topicId,
                    liveId: this.props.liveId,
                    showQl: 'Y'
                })
    
                this.setState({qrcodeUrl,
                    followDialogOption: {
                        traceData: 'topicIntroShareQrcode',
                        channel: '1007',
                    }
                }, () => {
                    this.introQrCodeDialogDom.show()
                })
			}
		}else {
            const result = await whatQrcodeShouldIGet({
                isBindThird: this.props.isSubscribe.isBindThird,
                isFocusThree: this.props.isSubscribe.isFocusThree,
                options: {
                    subscribe: this.props.isSubscribe.subscribe,
                    channel: '115',
                    liveId: this.props.liveId,
                    topicId: this.props.location.query.topicId,
                }
            })
            if(result){
                this.setState({
                    qrcodeUrl: result.url,
                    followDialogOption: {
                        traceData: 'topicIntroShareQrcode',
                        channel: '115',
                        appId: result.appId
                    }
                },() => {
                    this.introQrCodeDialogDom.show()
                })
            }
        }
    }

    onClickCloseQrCodeDialog(){
        this.introQrCodeDialogDom.hide();
        if (this.state.existLiveCommunity) {
            this.setState({
                showCommunityGuideModal: true,
                modalType: 'joinCommunity'
            });
        }
    }

    // 显示咨询弹框, focus是否自动聚焦输入框
    showConsult(focus = false) {
        if(window._qla) {_qla('click', {region: "topic",pos: "bottom", type: 'consult'})};

        this.dialogConsult.show(focus);
        this.scrollPage.style.overflowY = 'hidden';
    }

    // 弹窗消失后底部元素滚动状态恢复
    changeContainerScrollState(){
        this.scrollPage.style.overflowY = 'auto';
    }




    // 初始化珊瑚弹框数据
    // initCoralPushData(){
	// 	if(this.props.coral.percent){
	// 		this.setState({
	// 			coralPushData: {
	// 				businessId: this.props.topicInfo.id,
	// 				businessType: 'TOPIC',
	// 				businessName: this.props.topicInfo.topic,
	// 				liveName: this.props.topicInfo.liveName,
	// 				businessImage: this.props.topicInfo.backgroundUrl,
	// 				amount: this.props.topicInfo.money,
    //                 percent: this.props.coral.percent
	// 			}
	// 		});
	// 	}

    // }

    //弹出推送课程弹框
    showPushTopicDialog()  {
        this.setState({
            showPushTopicDialog: true,
        });
    }

    //关闭推送课程弹框
    hidePushTopicDialog() {
        this.setState({
            showPushTopicDialog: false,
        });
    }

    // 滚动到顶部
    onScrollToTop() {
        this.startScrollToTop();
    }
    startScrollToTop() {
        if (!this.scrollPage) {
            requestAnimationFrame(this.startScrollToTop);
            return;
        }

        if (this.scrollPage.scrollTop > 0) {
            this.scrollPage.scrollTop -= 100;

            requestAnimationFrame(this.startScrollToTop);
        }
    }

    scrollListener(e) {
        let scrollTop = e.target.scrollTop;

        if (scrollTop > 300 && !this.state.showGoToTop) {
            this.setState({
                showGoToTop: true
            })
        } else if (scrollTop <= 300 && this.state.showGoToTop) {
            this.setState({
                showGoToTop: false
            })
        }
    }

    // 支付成功后的跳转处理
    async onSuccessPayment({codeChannel='',type='', orderId=''}={}){
    
		const {
			isNeedCollect
        } = this.props
		// 插入最新表单后置业务 如有表单填写 则把链接跳转|二维码展示 统统放到表单之后执行
        const isGoForm = isNeedCollect && isNeedCollect.isWrite == 'N' && isNeedCollect.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != isNeedCollect.id
        
		// 最新导粉逻辑调整(12/25)
		// 如果有配置支付后跳转链接
		// 则跳转 不执行后面导粉逻辑
		const resLink = await this.props.ifGetCousePayPasterLink ({
			businessId: this.props.topicId,
			type: 'topic'
        })
        
        if (resLink) {
            if (isGoForm) {
                locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=topic&topicId=${this.props.topicId}${
					`&jumpUrl=${encodeURIComponent(resLink)}`
                }`)
            } else {
				locationTo(resLink)
            }
            return
        }
        
        /**
         * 支付报名成功后引导关注千聊
         * 1、珊瑚来源的支付成功后，优先走珊瑚逻辑， 判断是否关注珊瑚公众号，没关注则返回珊瑚公众号二维码
         * 2、珊瑚之后，判断是否有参与返学费的，有的话跳转到返学费的支付落地页面
         * 3、有关注二维码返回或者是开启社群，则跳到支付成功页面。
         */

        let communityInfo = await this.gotoCommunity();
        let qrUrl = '';
        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"|| this.tracePage==='coral'){
            qrUrl = await getCoralQRcode({
                channel:'subAfterSignCoral',
                liveId: this.props.liveId,
                channelId: this.props.channelId,
                topicId: this.props.topicId,
            });
            
            if (qrUrl) {
                qrUrl.channel = 'subAfterSignCoral'
            }
        }else{
            /* 新增返学费落地页，优先级在珊瑚逻辑之下 */
            if(this.state.showBackTuitionLabel){
                await fetchPayBackReturnMoney(orderId).then(bol => {
                    if(bol){
                        const jumpUrl = `/wechat/page/pay-success?orderId=${orderId}`
                        if (isGoForm) {
                            locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=topic&topicId=${this.props.topicId}${
                                `&jumpUrl=${encodeURIComponent(jumpUrl)}`
                            }`)
                        } else {
                            locationTo(jumpUrl)
                        }
                        return
                    }
                })
            }
            /************************************/

            let channel = codeChannel || 'subAfterSignA'
            let params = {
                channelId: this.props.channelId || '',
                topicId: this.props.topicId,
            }
            // 如果是有开启社群，则需要传id请求二维码
            if (communityInfo.showStatus == 'Y') {
                params.communityCode = communityInfo.communityCode
            }
            qrUrl = await subAterSign(channel,this.props.liveId, params)
            if (qrUrl) {
                qrUrl.channel = channel
            }
        }
        
		// 如果没填过表且不是跳过填表状态 则需要填表 表单后置
		if (isGoForm) {
            locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=topic&topicId=${this.props.topicId}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&qrChannel=${qrUrl.channel}` : ''}`)
        } else {
            let communityCode = getVal(communityInfo, 'communityCode');
            if(qrUrl||communityInfo.showStatus == 'Y'){
                locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.liveId}&payFree=${this.props.topicInfo.type === 'charge' ? 'N' : 'Y'}${qrUrl?`&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}`:''}&title=${encodeURIComponent(this.props.topicInfo.topic)}${communityCode?'&communityCode='+communityCode+'&liveId='+this.props.liveId:''}&isBook=${this.props.topicInfo.isBook}`)
            }else {
                const boughtRedirect = await this.getBoughtRedirect(type);
    
                locationTo(boughtRedirect || `/topic/details?topicId=${this.props.topicId}`)
            }
        }
    }

    // 任务邀请卡鉴权
    async topicTaskCardAuth() {
        if (this.props.isAuthTopic) {
            return false;
        }
        let s = getVal(this.props, 'location.query.s', '');
        let t = getVal(this.props, 'location.query.t', '');
        let sign = getVal(this.props, 'location.query.sign', '');
        let from = getVal(this.props, 'location.query.from', '');
        let shareKey = getVal(this.props, 'location.query.shareKey', '');
        let channelNo= this.data.channelNo;

        if (s == 'taskcard') {
            let result
            // 如果从系列课列表过来的，应请求系列课任务邀请卡鉴权的接口
            if(from === 'channel'){
                result = await channelTaskCardAuth({
                    s,
                    t,
                    sign,
                    channelId: this.props.channelId,
                })
            }else {
                result = await this.props.topicTaskCardAuth({
                    s,
                    t,
                    sign,
                    topicId: this.props.topicId,
                    shareKey,
                    channelNo
                });
            }
            if (result.state.code === 0) {
                this.onSuccessPayment({codeChannel:'subAfterSignB'});
            }
        }
    }

    async gotoCommunity() {
		try {
			let result = await request({
                url: '/api/wechat/community/getByBusiness',
                method: 'POST',
				body: {
					liveId: this.props.liveId,
					type: 'topic',
					businessId: this.props.topicId
				}
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
    

    // 免费话题 报名并进入话题
    async authTopic() {
        if (!this.props.isAuthTopic) {
            const {
                isNeedCollect
            } = this.props
            // 报名前判断是否需要采集信息，需要则跳转 表单前置
            if (isNeedCollect && isNeedCollect.isWrite == 'N' && isNeedCollect.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != isNeedCollect.id) {
                locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=topic&topicId=${this.props.topicId}&auth=${this.isFree ? 'Y' : 'N'}`)
                return false;
            }

            let shareKey = this.props.location.query.shareKey||this.props.location.query.lshareKey||'';
            var result = await this.props.publicApply(this.props.topicId, shareKey, this.data.channelNo || 'qldefault',this.props.location.query.redEnvelopeId);
            sessionStorage.removeItem("saveCollect");
        }
        
        this.onSuccessPayment({codeChannel:'subAfterSignB'});
    }

    // 如果有配置支付后跳转url，则跳转
    getBoughtRedirect = async (type) => {
        let businessType = type ? type : 'topic';
        const businessId = businessType === 'channel' ? this.props.channelId : this.props.topicId;

        const result = await request({
            url: '/api/wechat/getCousePayPaster',
            body: {
                type:businessType,
                businessId,
            }
        }).catch(err => {
            console.log(err);
        })

        const link = result && result.data && result.data.link;
        return link;
    }


	/**
	 * 珊瑚计划推广弹框
	 */
	async showCoralPromoDialog(){
        if(this.state.coralPushData.businessId){
            this.setState({
                showCoralPromoDialog: true,
            });
        }else{
            // 初始化珊瑚弹框数据
            this.setState({
                showCoralPromoDialog: true,
                coralPushData: {
                    businessId: this.props.topicInfo.id,
                    businessType: 'TOPIC',
                    businessName: this.props.topicInfo.topic,
                    liveName: this.props.topicInfo.liveName,
                    businessImage: this.props.topicInfo.backgroundUrl,
                    amount: this.props.topicInfo.money,
                    percent: this.props.coral.sharePercent
                }
            });
        }
	}


    // 检查是否填表
    isCheckUser() {
        console.log('准备支付')
        if (this.props.power.allowMGTopic || this.props.isAuthTopic ) {
            return false;
        }

		this.props.checkUser({
			liveId: this.props.liveId,
			businessId: this.props.channelId||this.props.topicId,
			businessType: this.props.channelId?'channel':'topic',
		})
    }

    // 获取是否可以评论
    async initEvaluableStatus() {
        let result = await this.props.getEvaluableStatus(this.props.topicId);
        let canStatus= getVal(result, 'data.canStatus', 'N');
        this.setState({
            canStatus
        })
    }

    // 从开放平台过来的用户要绑定三方和关注直播间
    async initUserBindKaiFang() {
        let kfAppId = getVal(this.props, 'location.query.kfAppId', '');
        let kfOpenId = getVal(this.props, 'location.query.kfOpenId', '');
        let auditStatus = getVal(this.props, 'location.query.auditStatus', '');
        let redEnvelopeId = getVal(this.props, 'location.query.redEnvelopeId', '');
        let taskCardShare = this.props.location.query.taskCardShare ? true : false
        //  如果有kfAppId,kfOpenId，自动绑定三方
        if (kfAppId && kfOpenId) {
            this.props.userBindKaiFang({
                kfAppId,
                kfOpenId
            });

        }
        // 链接上包含auditStatus=no_pass，关注不订阅，链接上包含auditStatus=pass，关注并且订阅，
		if(auditStatus == 'pass'){
			let businessType = taskCardShare ? 'taskCardShare' : (redEnvelopeId ? 'redEnvelope' : '')
			this.props.followLive(this.props.liveId, 'Y', auditStatus, {redEnvelopeId, businessType});
		}
    }

    // 判断是否定制vip课程会员
    async initCustomizedVipBtn() {

        let result = await this.props.userIsOrNotCustomVip(
            this.props.liveId,
            this.props.topicId,
        );

        if (result.data  && result.data.cVipId) {
            this.setState({
                showVipIcon:true
            })
        }
    }

    // 公众号关注直播间的逻辑
    initFocusConfirm(){
        const focusMethod = this.props.location.query.focusMethod;
        const isLiveFocus = this.props.isFollow.isFollow;
        if(focusMethod){
            if(focusMethod === 'one'&&!isLiveFocus){
                this.refs.focusOneDialog.show();
                eventLog({
                    category: 'focusLiveMethod',
                    action: 'success',
                    business_id: this.props.topicId,
                    business_type: 'topic',
                    method: 'one',
                });
            }else if(focusMethod === 'two'&&isLiveFocus){
                this.refs.focusTwoDialog.show();
                eventLog({
                    category: 'focusLiveMethod',
                    action: 'success',
                    business_id: this.props.topicId,
                    business_type: 'topic',
                    method: 'two',
                });
            }else if(focusMethod === 'confirm'&&isLiveFocus){
                this.refs.focusCancelDialog.show();
                eventLog({
                    category: 'focusLiveMethod',
                    action: 'success',
                    business_id: this.props.topicId,
                    business_type: 'topic',
                    method: 'confirm',
                });
            }else if(focusMethod === 'normal'){
                eventLog({
                    category: 'focusLiveMethod',
                    action: 'success',
                    business_id: this.props.topicId,
                    business_type: 'topic',
                    method: 'normal',
                });
            }
        }
    }
    
    /** 是否可以领取优惠券，没有进入话题的权限的可以获取优惠券 */
    get isCanReceiveCoupon() {
        return !this.props.isAuthTopic
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

    /**
	 * 是否免费
	 */
	get isFree() {
        return this.props.topicInfo.money == 0;
	}

	/**
	 * 是否转载
	 */
    get isRelay(){
        return this.props.topicInfo.isRelay === 'Y';
    }

	/**
	 * 是否vip
	 */
    get isVip(){
        return this.props.vipInfo.isVip === 'Y' && Number(this.props.vipInfo.expiryTime) > this.props.sysTime
    }

    /***********************开始请好友免费听相关***************************/

 async checkShareStatus(){
        /**
         * 请好友免费听的用户的条件是：
         * 1、该话题是系列课下的，不是单节付费，不是试听课
         * 2、开启了邀请分享功能且还有剩余名额
         * 3、系列课是付费的且自己已经购买，或者自己是vip（这点后端接口会判断）
         */
		if (this.props.topicInfo.channelId && this.props.topicInfo.isAuditionOpen !== 'Y' && this.props.topicInfo.isSingleBuy !== 'Y'){
			const result = await checkShareStatus({
                channelId: this.props.topicInfo.channelId,
			    topicId: this.props.topicId,
            })
			if(result.state.code === 0){
				this.setState({
                    canInvite: result.data.isOpenInviteFree === 'Y' && result.data.remaining > 0,
                    remaining: result.data.remaining || 0
				})
			}
		}
	}

    // 打开请好友免费听弹窗（首先获取分享id）
	async openInviteFriendsToListenDialog(){
		const result = await fetchShareRecord({
			channelId: this.props.topicInfo.channelId,
			topicId: this.props.topicId,
		})
		if(result.state.code === 0){
			this.setState({inviteFreeShareId: result.data.inviteFreeShareId})
			this.inviteFriendsToListenDialog.show(this.props.topicInfo, this.state.showBackTuitionBanner ? this.data.missionDetail: null)
		}
    }
    
    /***********************结束请好友免费听相关***************************/

    onClickFollowLive = async isFollow => {
        
        
        let businessType = this.props.location.query.taskCardShare ? 'taskCardShare' : (this.props.location.query.redEnvelopeId ? 'redEnvelope' : '')
        const focusState = this.props.isFollow.isFollow ?  (this.props.isFollow.isAlert ? 'pass' : 'attention_pass') : (this.props.isFollow.isAlert ? null : 'no_pass'); 
        let showToast = false;
        // 点击关注按钮的导粉二维码操作
        if (focusState !== "pass"){
            /** 珊瑚来源不引导关注 */
            if(this.tracePage=="coral"){
                this.setState({
                    followDialogType: 'focusliveConfirmClick',
                    followDialogOption: {}
                    },() => {
                    this.introQrCodeDialogDom.show()
                })
                return false;
            }
            const result = await whatQrcodeShouldIGet({
                isBindThird: this.props.isSubscribe.isBindThird,
                isFocusThree: this.props.isSubscribe.isFocusThree,
                options: {
                    subscribe: this.props.isSubscribe.subscribe,
                    channel: '210',
                    liveId: this.props.liveId,
                    topicId: this.props.location.query.topicId,
                }
            })
            if(result){
                this.setState({
                    qrcodeUrl: result.url,
                    followDialogType: 'focusClick',
                    followDialogOption: {
                         traceData: 'topicIntroFollowLiveQrcode',
                        channel: '210',
                        appId: result.appId
                    }
                },() => {
                    this.introQrCodeDialogDom.show()
                })
            } else {
                showToast = true;
            }
        }
        const res = await this.props.followLive(this.props.liveId, focusState === "pass" ? "N" : "Y", 'Y', businessType);
        if(res && showToast === true) {
            this.onClickCloseQrCodeDialog();
        }
        this.setState({
            showCancelFocusDialog: false
        });
        
    }

    
    onClickFocus() {
        const focusState = this.props.isFollow.isFollow ?  (this.props.isFollow.isAlert ? 'pass' : 'attention_pass') : (this.props.isFollow.isAlert ? null : 'no_pass');
        
        // if(this.props.focusStatues.isFollow) {
        // }
        if(focusState === "pass" ) {
            this.setState({
                showCancelFocusDialog: true
            })
        } else {
            this.onClickFollowLive();
        }
    }


    async focusLiveConfirm(isFollow){
        let businessType = this.props.location.query.taskCardShare ? 'taskCardShare' : (this.props.location.query.redEnvelopeId ? 'redEnvelope' : '')
        await this.props.followLive(this.props.liveId, isFollow ? 'Y' : 'N', 'Y', businessType);
        if (isFollow && this.state.existLiveCommunity) {
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

    initIsCollected = async () => {
        const result = await this.props.isCollected({
            type: "topic",
            businessId: this.props.topicId
        })
        if(result && result.data && result.data.isCollected === 'Y') {
            this.changeCollectedStatus(true);
        }
    }

	// // 初始化珊瑚课程信息
    // async initCoralInfo(){
    //     let topicInfo = this.props.topicInfo
    //     const result = await getPersonCourseInfo({
    //         businessType: topicInfo.channelId ? 'channel' : 'topic',
    //         businessId: topicInfo.channelId ? topicInfo.channelId : topicInfo.id
    //     })
    //     if(result.state.code === 0){
    //         this.setState({coralInfo: result.data})
    //     }
	// }

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
    }

    /**
     * ‘更多’菜单点击事件
     */
    onClickMore_home = () => {
        location.href = `/wechat/page/live/${this.props.liveId}`;
    }

    onClickMore_ask = () => {
        location.href = `/wechat/page/channel-consult?topicId=${this.props.topicId}`;
    }

    onClickMore_coupon = () => {
        location.href = `/wechat/page/coupon-code/exchange/topic/${this.props.topicId}?tracePage=liveCenter`;
    }

    onClickMore_collect = async () => {
        if(this.state.isCollected) {
            const result = await this.props.cancelCollect({
                type: "topic",
                businessId: this.props.topicId
            })
            if(result) {
                window.toast('已取消收藏', 2000, 'unlike')
                this.changeCollectedStatus(false);
            }
        } else {
            const result = await this.props.addCollect({
                type: "topic",
                businessId: this.props.topicId
            })
            if(result) {
                window.toast('已收藏', 2000, 'unlike')
                this.changeCollectedStatus(true);
            }
        }
    }

    onClickMore_gift = () => {
        this.giftDialog && this.giftDialog.show();

	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.collectVisible();
	    }, 10);
    }
    
    onClickMore_community = () => {
        if(this.props.isAuthTopic) {
			location.href = `/wechat/page/community-qrcode?liveId=${this.props.liveId}&communityCode=${this.state.communityInfo.communityCode}`;
		} else {
			this.setState({
				isShowGroupDialog: true
			});
		}
    }

    onClickTopicChannel = () => {
        locationTo(`/wechat/page/channel-intro?channelId=${this.props.topicInfo.channelId}`)
    }

    onClickTopicCamp = () => {
        locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`)
    }

    onGotoSet() {
        locationTo(`/live/coupon/codeList.htm?topicId=${this.props.topicId}`);
    }

    refreshCoupon = () => {
        // 再次刷新优惠券， 选取最大值
        this.bottomMenus.initCouponList()
    }

    // 获取用户优惠券列表
	async getCoupons(businessType, refresh = true){
        if (refresh) {
            const cache = this.data.cacheCouponList[businessType]
            if (cache) {
                    this.setState({
                        couponList: cache
                    })
                return cache
            }
        }   


        // 判断该课是否是官方直播间的课或者平台分销的课
        const status = await this.officalOrPlatform()
		// 官方直播间或者平台分销的直播间的比例
        const percent = await this.officalOrPlatformRate()
        const {
            topicInfo,
        } = this.props
        let parms = {}
        if(businessType === 'channel' && topicInfo.channelId){
            // 获取系列课优惠券列表
            parms = {
                liveId: topicInfo.liveId,
                businessType: 'channel',
                businessId: topicInfo.channelId
            }
        } else {
            // 获取话题优惠券列表
            parms = {
                liveId: this.props.liveId,
                businessType: 'topic',
                businessId: this.props.topicId
            }
        }
        parms.status = status
        parms.percent = percent
        const { data: { couponList } } = await this.props.fetchCouponListAction(parms);
        const arr = couponList.filter((item) => {
            // 如果是会员券且会员失效 则不展示
            if (item.couponType === 'member' && !this.props.isMember) {
                return false
            }
            // // 转载课过滤掉平台折扣券
			if(this.isRelay && item.couponType !== 'relay_channel'){
				return false
			}
			item.useRefId = item.couponId
			item.money = (Number(item.money) * 1000)/10;
			item.minMoney = formatNumber((item.minMoney || 0) * 100)
            return true
        });
        // 存储加载的优惠券列表
        this.data.cacheCouponList[businessType] = arr
        if (refresh) {
            this.setState({
                couponList: arr
            })
        }
        return arr
    }
    
    // 判断该课是否是官方直播间的课或者平台分销的课
	async officalOrPlatform(){
        return new Promise(async (resolve) => {
            let psCh = (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : ''
            if(await this.isQlLive() === 'Y'){
                resolve('qlLive')
            } else if(!this.data.missionDetail.missionId && psCh && this.props.platformShareRate) {
                resolve('platform')
            } else {
                resolve('')
            }
        })
	}

	// 官方直播间或者平台分销的直播间的比例
	async officalOrPlatformRate(){
        return new Promise(async(resolve)=>{
            let psCh = (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : ''
            // 如果是官方直播间，就拿官方直播间的比例，是平台分销的课就拿平台分销的比例，官方直播间和平台分销是互斥的
            if(await this.isQlLive() === 'Y'){
                await request({
                    url: '/api/wechat/transfer/h5/live/qlLiveSharePercent',
                    body: {
                        businessId: this.props.topicInfo.channelId || this.props.topicInfo.id,
                        businessType: this.props.topicInfo.channelId ? 'channel' : 'topic'
                    }
                }).then(res => {
                    resolve(get(res, 'data.sharePercent', 0))
                })
            }else if(!this.data.missionDetail.missionId && psCh && this.props.platformShareRate) {
                resolve(this.props.platformShareQualify)
            } else {
                resolve(0)
            }
        })
	}

	// 判断是否是官方直播间
	async isQlLive(){
        return new Promise(async(resolve)=>{
            if(this.isQlLiveData){
                resolve(this.isQlLiveData)
                return
            }
            await request({
                url: '/api/wechat/isQlLive',
                body: { liveId: this.props.topicInfo.liveId }
            }).then(res => {
                let isQlLive = get(res, 'data.isQlLive', '')
                this.isQlLiveData = isQlLive
                resolve(isQlLive)
            })
        })
    }
    
    // 获取直播状态
	getLiveStatus() {
		const { startTime, endTime, status, duration } = this.props.topicInfo;
		const { sysTime } = this.props;
		if (sysTime < startTime) {
			return 'plan';
		}

		// 回看状态
		if ((sysTime >= startTime + duration * 1000) && sysTime < endTime) {
			return 'complete';
		}

		if (status === 'ended' || sysTime >= endTime) {
			return 'ended';
		}

		return 'beginning';
    }
    // 展示优惠券
	showCoupon (coupon) {
        this.actCouponDialogRef.showCoupon(coupon)
    }
    // 隐藏优惠券列表
    hideCoupon(){
        this.setState({
            isCoupons: false,
            isOnce: true,
        })
    }
    // 显示优惠券列表
    showCouponList (couponListType, couponUsePrice) {
        this.setState({
            isCoupons: true,
            couponListType,
            couponUsePrice
        })
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
                    this.mainContainer.scrollTop = this.tabDom.offsetTop
                }, 0)
            })
		},150);
    }
    
	async loadMore(next){
		if (this.state.currentTab == 'evaluate') {
			await this.loadEvaluateList(true);
		}
		next();
	}

	get isNoMore () {
		switch (this.state.currentTab) {
			case 'evaluate':
				return this.getEvaluationListObj().status === 'end'
			default:
				return true
		}
    }

    get isDisable () {
        if (this.state.currentTab == 'evaluate' && this.getEvaluationListObj().status === 'end') return true;
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
            topicId: this.props.topicId,
			isContinue,
			hasValidFilter: this.state.evaluateHasValidFilter,
		});
    }
    
    // 绑定平台分销
    getShareRate() {
        if (!this.props.topicInfo) {
            return false;
        }
        if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y') {
            this.props.getShareRate({ businessId: this.props.topicInfo.channelId, businessType: 'CHANNEL' });
        } else if(this.props.topicInfo.type === 'charge') {
            this.props.getShareRate({ businessId: this.props.topicId, businessType: 'TOPIC' });
        }
    }

    /***********************开始奖学金相关***************************/
    // 跳转到发送奖学金页面
    jumpToScholarshipPage = ()=>{
        locationTo(`/wechat/page/send-platform-coupon?packetId=${this.state.schloarshipPacketId}`)
    }

    // 介绍页显示发平台通用券按钮
	getPacketDetail = async()=>{
		await getPacketDetail({ businessId: this.props.topicInfo.channelId || this.props.topicId }).then(res => {
            // 返回的是空或者是空对象表明接口请求错误或者不是官方直播间且没有平台分销比例，不执行以下操作
            if(!res || JSON.stringify(res) === '{}'){
                return
            }
			if(get(res, 'state.code')){
				throw new Error(res.state.msg)
            }
            let couponNum = get(res, 'data.couponNum' ,0) // 总数量
			let bindCouponNum = get(res, 'data.bindCouponNum' ,0) // 领取数量
			let dayType = get(res, 'data.dayType')// 日期类型
			let fixDateEndTime = get(res, 'data.fixDateEndTime', 0) //固定日期的结束时间
			// 券未领完且固定日期未过期
			if(couponNum && bindCouponNum < couponNum && !(dayType === 'fixDate' && fixDateEndTime < Date.now())){
				let operateMenuConfig = this.state.operateMenuConfig
				operateMenuConfig.push({
					name: '奖学金',
					icon: 'https://img.qlchat.com/qlLive/liveCommon/icon-schloarship.png',
					onClick: this.jumpToScholarshipPage,
					className: 'on-log on-visible schloarship',
					'data-log-name': '奖学金',
					'data-log-region': 'lucky',
				})
				this.setState({schloarshipPacketId: get(res, 'data.id', ''), operateMenuConfig})
			}
		})
	}
    /***********************结束奖学金相关***************************/

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
				businessId: this.props.topicInfo.channelId || this.props.topicId,
				businessType: this.props.topicInfo.channelId ? 'channel' : 'topic',
			}
		}).then(async(res) => {
			if(res.state.code) throw Error(res.state.msg)
			if(res.data) {
				let showBackTuitionBanner = false
                let showBackTuitionLabel = false
                let inviteReturnConfig = {}

				if(res.data.canInviteReturn == 'Y' && res.data.hasMission == 'Y'){
					let missionDetail = res.data.missionDetail
					this.data.missionDetail = missionDetail
					if(missionDetail.status == 'N' && missionDetail.expireTime > Date.now()){
						showBackTuitionBanner = true
					}
                // B端开启了，C端未开始任务，未购买且不是受邀者（受邀者链接上带有inviteReturnCouponId和couponType）
                } else if (res.data.canInviteReturn == 'Y' && res.data.hasMission == 'N' && !this.props.isAuthChannel
                    && !this.props.location.query.inviteReturnCouponId && !this.props.location.query.couponType){
                    showBackTuitionLabel = true
                    inviteReturnConfig = res.data.inviteReturnConfig
                }
                this.setState({showBackTuitionBanner, showBackTuitionLabel, inviteReturnConfig})
                let coupon = {}
				if(showBackTuitionLabel || showBackTuitionBanner){
					// 获取显示在介绍页的优惠码
					coupon = await this.getCouponForIntro()
					let inviteReturnCouponMoney = get(coupon, 'money', 0)
					this.setState({
						inviteReturnCouponMoney: formatMoney(inviteReturnCouponMoney)
					})
				}
                // 拉人返现需要重置
				if (showBackTuitionBanner) {
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
    
    // 初始化领取状态
    getReceiveInfo = async() => {
        try {
            const result = await getReceiveInfo({topicId: this.props.topicId})
            if(result.state.code === 0){
                if(result.data && result.data.missionId){
                    this.data.missionDetail.missionId = result.data.missionId
                }
            }else {
                throw Error(result.state.msg)
            }
        } catch(err){
            console.error(err)
        }
    }

    // 获取系列课的限时特价
    fetchSalePrice(){
        let salePrice = 0
        if(this.props.topicInfo.channelId){
            let charge = this.props.channelChargeConfigs[0]
            salePrice = this.props.showDiscount ? charge.discount : charge.amount
        }
		return salePrice
	}
    
    // 获取显示在介绍页的优惠码
	getCouponForIntro = async() => {
		return new Promise(async(resolve) => {
			await request({
				url: '/api/wechat/transfer/h5/coupon/queryCouponForIntro',
				body: {
					businessId: this.props.topicInfo.channelId || this.props.topicId,
				    businessType: this.props.topicInfo.channelId ? 'channel' : 'topic',
				}
			}).then(res=>{
				if(res.state.code) throw Error(res.state.msg)
				let codePo = get(res, 'data.codePo', {})
				resolve(codePo)
			}).catch(err=>{
				console.error(err)
				resolve({})
			})
		})
	}

    /***********************结束拉人返学费相关***************************/
    // 是否显示会员栏
    get isShowMemberBlock () {
        return !this.isFree && !Object.is(this.props.topicInfo.type, 'encrypt')
        && this.tracePage !=='coral'
        && !this.props.topicInfo.channelId
        && this.props.isMemberPrice
		// 未购买 | 是会员 & (课程为小课 | (正式会员 & 课程为大课 & 通过会员领课方式获得))
        && (!this.isBought || (this.props.isMember && (this.state.memberCourseType === 'free' || (this.props.memberInfo.level === 2 && this.state.memberCourseType === 'quality' && this.state.memberCourseReceive))))
        && !this.isVip && !this.isRelay
        // 已加载底部按钮
        && this.state.showBottomMenu
    }

	closeInviteFriendsListenGuide () {
		setLocalStorage('inviteFriendsListenGuide', new Date().getTime())
		this.setState({
			isShowInviteFriendsListenGuide: false
		})
    }
    // 获取系列课学习人数
    async initChannelIntroHeader(){
		const res = await this.props.fetchPayUser({
			channelId: this.props.channelId,
		});
		if(res.state.code === 0){
			this.setState({
				audienceCount: res.data.payUserCount
			});
		}
    }
    
    scrollingFunc(){
        this.setState({
          scrolling: 'Y',
        });
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
          this.setState({
            scrolling: 'S',
          });
        }, 300)
      }
    
    toggleOpenPayDialog = (isOpenPayDialog) => {
        this.setState({
            isOpenPayDialog
        })
    }

    showPaymentDetailsDialog = (coupon) => {
        console.log(coupon)
        if (coupon.businessType === 'topic') {
            this.bottomMenus.onBuyTopic()
        } else if (coupon.businessType === 'channel') {
            this.bottomMenus.onBuyChannel()
        }
    } 

    async dispatchGetCommunity() {
        const res = await getCommunity(this.props.topicInfo.liveId, 'topic', this.props.topicId);
        if(res) {
            this.setState({
                communityInfo: res
            });

            if (res.showStatus === 'Y') {
                let operateMenuConfig = this.state.operateMenuConfig
                operateMenuConfig.push({
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
    }

    // 判断是否显示社群入口
    getGroupShow() {
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                let communityRecord = JSON.parse(communityList).includes(`${this.props.topicInfo.liveId}_${this.props.topicId}`);
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
                let hasRecord = communityList.includes(`${this.props.topicInfo.liveId}_${this.props.topicId}`);
                if(hasRecord === false) {
                    communityList.push(`${this.props.topicInfo.liveId}_${this.props.topicId}`);
                }
                window.sessionStorage.setItem('SHOW_COMMUNITY_LIST_INTRO', JSON.stringify(communityList));
            } catch (error) {
                console.log('ERR',error);
            }
        };
    }
    

    render() {
        const isBought = this.props.isAuthTopic || this.isVip;
        let shareMoney,
            autoSharePercent = '';
        const isShowMemberBlock = this.isShowMemberBlock
        const { topicInfo, isListenBook } = this.props;
        if (isFromLiveCenter() && this.props.platformShareRate) {
            // 如果是平台分销，则优先单课价格。
            if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelChargeConfigs[0]) {
                // 如果没有开启单节购买
                if (this.props.channelChargeConfigs[0].discountStatus === 'N') {
                    shareMoney = this.props.channelChargeConfigs[0].amount*100;
                } else {
                    shareMoney = this.props.channelChargeConfigs[0].discount*100
                }
            } else {
                shareMoney = this.props.topicInfo.money;
            }
            
        } else {
            // 如果是普通分销，则优先系列课价格(因为系列课内话题不允许分销)
            if (this.props.channelChargeConfigs[0]) {    // 系列课内的话题
                if (this.props.channelChargeConfigs[0].discountStatus === 'N') {
                    shareMoney = this.props.channelChargeConfigs[0].amount*100;
                } else {
                    shareMoney = this.props.channelChargeConfigs[0].discount*100
                }
            } else {
                // 普通话题
                shareMoney = this.props.topicInfo.money;
            }
            autoSharePercent = (this.props.myShareQualify.joinType ==='auto' && this.props.myShareQualify.shareEarningPercent)||0;
        }

        let evaluateNumStr = this.props.evaluationData.evaluateNumStr;
        evaluateNumStr == 0 && (evaluateNumStr = '');

        let isShowOperateMenuTips = !isListenBook && this.state.isShowOperateMenuTips && !this.state._isShowActCouponDialog;
        return (
            <Page 
				title={this.state.htmlTitle || htmlTransferGlobal(this.props.topicInfo.topic)}
				description={this.state.htmlDescription || ''}
				keyword={this.state.htmlKeywords || ''}
                className="topic-intro-cend-page flex-body portal-container" 
                banpv={true}
                >
                {
                    //  !this.isUnHome && !this.state.isApp && this.state.isQlLive && !this.props.power.allowMGLive && !this.props.power.allowSpeak && <AppDownloadBar topicId={this.props.topicInfo.id} />
                }
                {/* 来自活动的按钮 */}
                <ComeFromAct />
                
                {/* 区分听书和话题详情 */}
                { !isListenBook && <ScrollToLoad
                    className="scroll-container scroll-box"
                    toBottomHeight={300}
                    disable={this.isDisable}
                    loadNext={this.loadMore}
                    noMore={this.isNoMore}
					hideNoMorePic={true}
                    ref={r => this.scrollEl = r}
                    scrollToDo={this.scrollingFunc.bind(this)}
                    footer={!this.props.power.allowMGLive?(<BottomBrand
                        topicId = {this.props.topicId}
                        liveId = {this.props.topicInfo.liveId}
                        chtype="create-live_topic"
                        createAdvance={true}
                    />):null}
                >
                    <IntroHeader
                        ref="introHeader"
                        type="topic"
                        banner={this.props.topicInfo.backgroundUrl}
                        isFree={this.isFree}
                        isRelay={this.isRelay}
                        isVip={this.isVip}
                        authTopic={this.authTopic}
                        liveStatus={this.state.liveStatus}
                        topicInfo={this.props.topicInfo}
                    />

                    <SpecialsCountDown
                        isBought={ isBought }
                        channelId={this.props.channelId}
                        isY={ this.props.channelChargeConfigs[0] && this.props.channelChargeConfigs[0].discountStatus === 'Y'}
						ref = {el => this.specialsCountDownEle = el}
                    >
                        {/* 拉人返学费banner */}
                        {
                            this.state.showBackTuitionBanner &&
                            <BackTuition
                                missionDetail = {this.data.missionDetail || {}}
                                openBackTuitionDialog = {this.openBackTuitionDialog}
                            />
                        }
                    </SpecialsCountDown>

                    <ShareBtn
                        userId={this.props.userId}
                        type="topic"
                        isUnHome={ this.isUnHome }
                        distributionPercent={this.distributionPercent}
                        coralPercent={(this.props.coral.isPersonCourse ==="Y" &&this.props.coral.sharePercent)||''}
                        price={shareMoney}
                        isFree={this.isFree}
                        liveId={this.props.topicInfo.liveId}
                        // 是否正在参与或者可以参与拉人返学费活动
						isBackTuition = {this.state.showBackTuitionBanner || this.state.showBackTuitionLabel}
                        isScrollRolling={this.state.isScrollRolling}
                        shareBtnSimplify={this.state.shareBtnSimplify}
                        
                        coralPushData={{
                            businessId: this.props.topicInfo.id,
                            businessType: 'TOPIC',
                            businessName: this.props.topicInfo.topic,
                            liveName: this.props.topicInfo.liveName,
                            businessImage: this.props.topicInfo.backgroundUrl,
                            amount: shareMoney,
                            percent: this.props.coral.sharePercent
                        }}
                        initShare={this.initShare}
                        initCoralShare={this.initCoralShare}
                        isQlLive={this.state.isQlLive}
                        tabStick={this.state.tabStick}
                        autoSharePercent={autoSharePercent}
                        topicInfo={this.props.topicInfo}
                        isAutoShareOpen={this.props.topicInfo.isAutoshareOpen}
                        coralLink={this.tracePage === 'coral'}
                        source={this.props.location.query.source}
                        platformShareRate = {this.props.platformShareRate}
                        missionId = {this.props.location.query.missionId || this.data.missionDetail.missionId}
                    />

                    <div className={ `intro-title ${ this.state.isQlLive && this.props.isUniCourse && this.props.isUniAuth ? 'minBtm' : '' }` }>
                        <p>
                            {
                                this.props.topicInfo.flag ? <span className="girl-college">{this.props.topicInfo.flag}</span> : null
                            }
                            {this.props.topicInfo.topic}
                        
                        </p>
                
                        <CourseDatial isTopic />
                        {
                            !this.props.isUniCourse && isShowMemberBlock && (
                                <MemberBlock
                                    businessId={this.props.topicInfo.id}
                                    businessType="topic"
                                    info={this.props.topicInfo}
                                    memberInfo={this.props.memberInfo}
                                    isMember={this.props.isMember}
                                    memberCourseType={this.state.memberCourseType}
									memberCourseReceive={this.state.memberCourseReceive}
                                    isFixBottom={true}
                                    isShow={this.state.tabStick}
                                    />
                            )
                        }
                        { this.props.isUniCourse && <UniversityBlock isUniAuth={ this.props.isUniAuth }  isShow={this.state.tabStick} /> }

                        {/* { this.state.isQlLive && this.props.isUniCourse && this.props.isUniAuth && <UniversityCollege { ...this.props.collegeInfo } /> } */}
                    </div>
                    
                    {
                        // !(this.state.isQlLive && this.props.isUniCourse) && 
                        !!this.props.liveInfo.entity && this.props.isAuthTopic &&
                        <div className="p-intro-section">
                            <LiveInfo
                                liveInfo={this.props.liveInfo}
                                power={this.props.power}
                                isFollow={this.props.isFollow.isFollow}
                                isAlert={this.props.isFollow.isAlert}
                                onClickFollow={this.onClickFocus}
                                auditStatus={this.props.location.query.auditStatus}
                                isBought={isBought}
                                enterprisePo={this.state.enterprisePo}
                                isCompany={this.state.enterprisePo.status == 'Y'}
                                tracePage = {this.tracePage}
                            />
                        </div>
                    }
                    
                    
                    {/*切换课程的tab */}
                    <div className={`p-intro-tab`} ref={dom => this.tabDom = dom}>
                        <div
                            className={`tab-item on-log${this.state.currentTab == "intro" ? " active" : ""}`}
                            onClick={this.tabHandle.bind(this, "intro")}
                            data-log-name="课程介绍"
                            data-log-region="tab-to-modul"
                            data-log-pos="intro"
                            data-log-status={isBought ? 'bought' : ''}
                            >课程介绍</div>
                        <div
                            className={`tab-item on-log${this.state.currentTab == "evaluate" ? " active" : ""}`}
                            onClick={this.tabHandle.bind(this, "evaluate")}
                            data-log-name="用户评价"
                            data-log-region="tab-to-modul"
                            data-log-pos="evaluate"
                            data-log-status={isBought ? 'bought' : ''}
                            >用户评价<span className="eval-num">{evaluateNumStr}</span></div>
                    </div>
					
                    {/* 会多出来的按个tab */}
                    {
                        this.state.tabStick && (
                            <div className={`p-intro-tab stick`}>
                                <div
                                    className={`tab-item on-log${ (this.state.currentTab == "intro") ? " active" : ""}`}
                                    onClick={this.tabHandle.bind(this, "intro")}
                                    data-log-name="课程介绍"
                                    data-log-region="tab-to-modul"
                                    data-log-pos="intro"
                                    data-log-status={isBought ? 'bought' : ''}
                                >课程介绍</div>
                                <div
                                    className={`tab-item on-log${this.state.currentTab == "evaluate" ? " active" : ""}`}
                                    onClick={this.tabHandle.bind(this, "evaluate")}
                                    data-log-name="用户评价"
                                    data-log-region="tab-to-modul"
                                    data-log-pos="evaluate"
                                    data-log-status={isBought ? 'bought' : ''}
                                    >用户评价<span className="eval-num">{evaluateNumStr}</span></div>
                            </div>
                        )
                    }
                    
					{/*  内容主体 */}
					<div ref={dom => this.introAnchorDom = dom}>

                        {/* 课程介绍 */}
                        {
                            this.state.currentTab === "intro" && (
                                <div className="intro">
                                    {/* 拉人返学费介绍 */}
                                    { this.state.showBackTuitionLabel &&
                                        <BackTuitionLabel
                                            maxReturnMoney = {this.fetchSalePrice() || this.Price}
                                            inviteReturnCouponMoney = {this.state.inviteReturnCouponMoney}
                                            inviteReturnConfig = {this.state.inviteReturnConfig}
                                            isMember={this.props.isMember}
                                            isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice && this.tracePage !=="coral"}
                                        />
                                    }
                                    
                                    {
                                        (this.props.topicInfo.remark || !!this.props.profile.length || this.props.topicSummary || !this.props.channelId) &&
                                            <div className="p-intro-section" ref={r => this.introContentEl = r}>
                                                <div className="p-intro-section-title">
                                                    <p>课程介绍</p>
                                                    {
	                                                    (this.props.channelChargeConfigs[0] && this.props.channelChargeConfigs[0].discountStatus === 'UNLOCK') ?
		                                                    null
		                                                    :
		                                                    (((this.isCanReceiveCoupon||this.props.power.allowMGTopic)&& this.props.userId)?
			                                                    <CouponBtn
				                                                    ref={r => this.couponButtonRef = r}
				                                                    businessType={ 'topic' }
				                                                    businessId={ this.props.topicInfo.id }
				                                                    channelId={ this.props.channelId }
				                                                    bindSuccess={this.refreshCoupon}
				                                                    showCoupon={ this.showCoupon }
				                                                    isFixed={ this.state.isCouponBtnFixed }
				                                                    style={ {top: this.introHeaderHeight + 'px'} }
				                                                    from="topicIntro"
                                                                    paymentDetailsShow={this.state.isOpenPayDialog}
			                                                    />
			                                                    :null
		                                                    )
                                                    }
                                                </div>

                                                <CourseIntro
                                                    topicInfo = {this.props.topicInfo}
                                                    profileList = {this.props.profile}
                                                    topicSummary={this.props.topicSummary}
                                                />

                                            </div>
                                    }

                                    {
                                        this.state.showChannelIntro &&
                                        <ChannelCourseIntro
                                            ref={r => this.introContentEl = r}
                                            channelSummary={this.state.channelSummary}
                                            channelDesc={this.state.channelProfile}
                                            isInTopicIntro={true}
                                        >
                                            {
	                                            (this.props.channelChargeConfigs[0] && this.props.channelChargeConfigs[0].discountStatus === 'UNLOCK') ?
		                                            null
		                                            :
		                                            (
			                                            (this.isCanReceiveCoupon || this.props.power.allowMGTopic) && this.props.userId &&
			                                            <CouponBtn
				                                            ref={r => this.couponButtonRef = r}
				                                            businessType={ 'topic' }
				                                            businessId={ this.props.topicInfo.id }
				                                            channelId={ this.props.channelId }
				                                            couponLists={this.state.couponList}
				                                            bindSuccess={this.refreshCoupon}
				                                            showCoupon={ this.showCoupon }
				                                            isMore={ Object.is(this.props.topicInfo.type, 'encrypt') || (!!this.props.topicInfo.channelId && Object.is(this.props.topicInfo.isSingleBuy,"Y")) }
				                                            isFixed={ this.state.isCouponBtnFixed }
				                                            style={ {top: this.introHeaderHeight + 'px'} }
				                                            from="topicIntro"
                                                            paymentDetailsShow={this.state.isOpenPayDialog}
			                                            />
		                                            )
                                            }
                                        </ChannelCourseIntro>
                                    }


                                    {
                                        // !(this.state.isQlLive && this.props.isUniCourse) && 
                                        !!this.props.liveInfo.entity && !this.props.isAuthTopic &&
                                        <div className="p-intro-section">
                                            <LiveInfo
                                                liveInfo={this.props.liveInfo}
                                                power={this.props.power}
                                                isFollow={this.props.isFollow.isFollow}
                                                isAlert={this.props.isFollow.isAlert}
                                                onClickFollow={this.onClickFocus}
                                                auditStatus={this.props.location.query.auditStatus}
                                                isBought={isBought}
                                                enterprisePo={this.state.enterprisePo}
                                                isCompany={this.state.enterprisePo.status == 'Y'}
                                                tracePage = {this.tracePage}
                                            />
                                        </div>
                                    }

                                    <div style={{background: "#fff"}}>
                                        <IntroGroupBar
                                            padding=".53333rem"
                                            communityInfo={this.state.communityInfo} 
                                            hasBeenClosed={this.state.groupHasBeenClosed}
                                            allowMGLive={this.props.power.allowMGLive}
                                            forceHidden={this.props.isAuthTopic}
                                            isBuy={this.props.isAuthTopic }
                                            onClose={this.onGroupEntranceClose}
                                            onModal={() => {this.setState({isShowGroupDialog: true})}}
                                        />      
                                    </div>
                                                
                                    <ConsultModule
                                        consultRef={ dom => this.consultModule = dom }
                                        showConsult = {this.showConsult}
                                        consultPraise = {this.props.consultPraise}
                                    />

                                    {
                                        !this.props.channelId && this.props.topicInfo.money ? (
                                            <div className="buy-explain">
                                                <span onClick={ () => {this.refs.buyExplainConfirmDialog.show()}}>购买须知</span>
                                            </div>
                                        ) : null
                                    }

                                    {
                                        this.tracePage!=="coral"&&this.state.hasFetchInitData &&
                                        <GuestYouLike
                                            liveId={this.props.topicInfo.liveId}
                                            businessType={ this.props.topicInfo.channelId ? 'channel' : 'topic' }
                                            businessId={ this.props.topicInfo.channelId || this.props.topicInfo.id }
											dimensionType={ isBought ? 'buy' : 'browse'}
                                            urlParams={{
                                                wcl: isBought ? `promotion_topic-intro-bought` : `promotion_topic-intro`,
                                                originID: this.props.topicInfo.id
                                            }}
                                            isShowAd={ this.state.isQlLive }
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

                                    {
                                        this.props.topicInfo.channelId &&
                                        <div className="p-intro-section">
                                            <div className="topic-channel" onClick={this.onClickTopicChannel}>
                                                <p>
                                                    所属系列课：<span>{this.props.topicInfo.channelName}</span>
                                                </p>
                                                <i className="icon_enter"></i>
                                            </div>
                                        </div>
                                    }

                                    {
                                        this.props.topicInfo.campId &&
                                        <div className="p-intro-section">
                                            <div className="topic-channel" onClick={this.onClickTopicCamp}>
                                                <p>
                                                    所属打卡训练营：<span>{this.props.topicInfo.campName}</span>
                                                </p>
                                                <i className="icon_enter"></i>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        }
                        
						{/* 用户评价 */}
						{
							this.state.currentTab === "evaluate" &&
                            <Evaluate
                                courseType="topic"
                                hasValidFilter={this.state.evaluateHasValidFilter}
								onClickValidFilter={this.onClickValidFilter}
                            />
						}
                    </div>



                    {/* 底部贴片二维码 */}
                    {
                        // !(this.state.isQlLive && this.props.isUniCourse) && 
                        !(this.tracePage=="coral") &&
                        <div className="paster-qrcode-wrap">
                            <PasterQrcode
                                relationInfo = {this.props.relationInfo}
                            />
                        </div>
                    }
                </ScrollToLoad> }

                {/* 听书详情页 */}
                { isListenBook &&
                    <div className="p-intro-section listen-book" onScroll={this.scrollingFunc.bind(this)} ref={r => this.introContentEl = r}>
                        <BooksUI
                            audienceCount={this.props.browsNum}
                            imgUrl={ topicInfo.bookHeadImage }
                            duration={ topicInfo.duration }
                            name={topicInfo.topic }
                            bookTagName={ topicInfo.bookTagName }
                            decs={topicInfo.bookDescription} />
                        <div className="p-intro-section-title">
                            <p>简介</p>
                            {
	                            (this.props.channelChargeConfigs[0] && this.props.channelChargeConfigs[0].discountStatus === 'UNLOCK') ?
		                            null
		                            :
		                            (
			                            !this.state.isApp && ((this.isCanReceiveCoupon||this.props.power.allowMGTopic)&& this.props.userId) ?
				                            <CouponBtn
					                            ref={r => this.couponButtonRef = r}
					                            businessType={ 'topic' }
					                            businessId={ this.props.topicInfo.id }
					                            channelId={ this.props.channelId }
					                            bindSuccess={this.refreshCoupon}
					                            showCoupon={ this.showCoupon }
					                            isFixed={ this.state.isCouponBtnFixed }
					                            style={ {top: this.introHeaderHeight + 'px'} }
					                            from="topicIntro"
                                                paymentDetailsShow={this.state.isOpenPayDialog}
				                            />
				                            :null
		                            )
                            }
                        </div>

                        <CourseIntro
                            topicInfo = {this.props.topicInfo}
                            profileList = {this.props.profile}
                            topicSummary={this.props.topicSummary}
                        />
                    </div>
                }

                {
                    // !(this.props.isUniCourse) && 
                    isShowOperateMenuTips &&
                    <div className={`operate-menu-tips${this.state.isFromLiveCenter ? ' more-bottom' : ''}`} onClick={this.closeOperateMenuTips}>
                        <div className="tips"></div>
                    </div>
                }

                {/*{*/}
					{/*!this.props.power.allowMGLive && this.state.existCommunity &&*/}
					{/*<CommunitySuspension */}
						{/*liveId={this.props.liveId}*/}
						{/*groupName={this.state.communityName}*/}
						{/*communityCode={this.state.communityCode}*/}
                        {/*// 出现悬浮会员栏时，操作按钮往上挪*/}
                        {/*isFixMemberBlock={isShowMemberBlock && this.state.tabStick}*/}
					{/*/>*/}
                {/*}*/}

                
                { !isListenBook && (
                    <OperateMenu
                        isUnHome={ this.isUnHome }
                        config={this.state.operateMenuConfig}
                        entryStyle={{zIndex: isShowOperateMenuTips ? 201 : ''}}
                        onClickEntry={this.closeOperateMenuTips}
                        // 出现悬浮会员栏时，操作按钮往上挪
                        isFixMemberBlock={(isShowMemberBlock || this.isUnHome) && this.state.tabStick}
                        showBackHome={this.state.isFromLiveCenter}
                        scrolling = { this.state.scrolling }
                    />
                ) }

                

                <GiftDialog
                    ref={ dom => dom && (this.giftDialog = dom.getWrappedInstance()) }
                    userId={this.props.userId}
                    tracePage={this.tracePage}
                />

                {/* 底部按钮栏 */}
	            {
		            this.state.showBottomMenu &&
		            <BottomMenus
			            ref={ dom => dom && (this.bottomMenus = dom.getWrappedInstance()) }
                        isUnHome={ this.isUnHome }
			            showGoToTop={ this.state.showGoToTop }
			            onConsultClick={ e => this.showConsult(true) }
			            showPushTopicDialog={this.showPushTopicDialog}
			            onScrollToTop={this.onScrollToTop}
			            authTopic={this.authTopic}
			            isOrNotListen={this.state.isOrNotListen}
			            sourceChannelId={this.props.sourceChannelId}
			            authStatus={this.props.authStatus}
			            channelNo={this.data.channelNo}
			            promptDuplicateBuy={this.promptDuplicateBuy}
			            showVipIcon={this.state.showVipIcon}
			            /**是否上一个页面来着微信活动页面 */
                        isFromWechatCouponPage={this.props.location.query.isFromWechatCouponPage || ''}
                        userId={this.props.userId}
                        redEnvelopeId = {this.props.location.query.redEnvelopeId}
                        canInvite = {this.state.canInvite}
                        remaining = {this.state.remaining}
                        fetchCouponList={this.getCoupons}
                        couponLists={this.state.couponList}
                        showCouponList={ this.showCouponList }
                        openInviteFriendsToListenDialog = {this.openInviteFriendsToListenDialog}
                        /** 任务邀请卡相关 **/
                        sign = {this.props.location.query.sign}
                        t = {this.props.location.query.t}
                        s = {this.props.location.query.s}
                        showDiscount = {this.props.showDiscount}
                        topicTaskCardAuth = {this.topicTaskCardAuth}
                        tracePage={this.tracePage}
                        /*****************/
                        groupResult = {this.state.groupResult}
                        onSuccessPayment={this.onSuccessPayment}
                        coralPercent = {this.props.coralPercent||''}
                        isBooks={ isListenBook }
                        isUniCourse={ this.props.isUniCourse &&
                         this.props.isUniAuth }
                        joinUniversityBtn={ this.props.joinUniversityBtn }
                        isJoinUni={ this.props.isJoinUni }
                        isAnimate={ this.props.isAnimate }
                        /* 拉人返学费相关 */
						openBackTuitionDialog = {this.openBackTuitionDialog}
						showBackTuitionBanner = {this.state.showBackTuitionBanner}
                        returnMoney = {this.data.missionDetail.returnMoney || 0}
                        missionId = {this.props.location.query.missionId || this.data.missionDetail.missionId}
                        showBackTuitionLabel = {this.state.showBackTuitionLabel}
                        /***************/
                        toggleOpenPayDialog={this.toggleOpenPayDialog}
		            />
                }
                
                {/* 邀请好友免费听弹窗 */}
                <InviteFriendsToListen
					ref = {el => this.inviteFriendsToListenDialog = el}
                    inviteFreeShareId = {this.state.inviteFreeShareId}
                    //关闭弹窗后重新初始化分享
                    onClose={this.chooseShare}
                    coralInfo = {this.props.coral}
                    source={this.props.location.query.source}
                    userId={this.props.userId}
                    platformShareRate = {this.props.platformShareRate}
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

                {/* 优惠券弹框 */}
                {
                    (this.state.couponCode || this.state.codeId) && this.isCanReceiveCoupon &&
                        <CouponDialog
                            ref={ dom => dom && (this.couponDialogDom = dom.getWrappedInstance()) }
                            isAutoReceive={ this.state.isAutoReceive }
                            businessType={'topic'}
                            businessId={ this.props.topicInfo.id }
                            businessName={ this.props.topicInfo.topic }
                            couponCode={ this.state.couponCode }
                            codeId={ this.state.codeId }
                            liveId={ this.props.liveId }
                            liveName={ this.props.liveInfo.entity.name }
                            isLiveAdmin={ this.props.isLiveAdmin.isLiveAdmin }
                        />
                }
                
	            {/* 活动优惠券弹窗 */}
				<ActCouponDialog
					ref={ ref => ref && (this.actCouponDialogRef = ref.getWrappedInstance()) }
					location={this.props.location}
                    onDisplayChange={isShow => isShow && this.setState({_isShowActCouponDialog: isShow})}
                    businessId =  {this.props.channelId||this.props.topicId}
                    businessType = {this.props.channelId?'channel':'topic'}
                    showPaymentDetailsDialog={this.showPaymentDetailsDialog}
					updateCouponList={this.getCoupons}
                     />

				{/* 分享后的弹码与关注直播间的弹码 */}
				<IntroQrCodeDialog
					ref={ dom => dom && (this.introQrCodeDialogDom = dom) }
					followDialogType = {this.state.followDialogType}
                    qrUrl={ this.state.qrcodeUrl }
                    shareMoney = {this.state.shareMoney}
                    option={ this.state.followDialogOption }
                    focusLiveConfirm={this.focusLiveConfirm}
                    onClose = {this.onClickCloseQrCodeDialog}
                    relationInfo={this.props.relationInfo}
					// className="on-visible"
					// data-log-region="visible-channelCFollow"
					// data-log-pos="visible-209"
				/>


    
				<Confirm
					ref="buyExplainConfirmDialog"
					buttons="confirm"
					confirmText="我知道了"
					className="buy-explain-dialog"
					onBtnClick={ () => { this.refs.buyExplainConfirmDialog.hide() } }
				>
					<main className='dialog-main'>
						<div className="confirm-top buy-explain-title">购买须知</div>
						<div className="confirm-content buy-explain-content">
							<p>1. 该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时学习，也可反复回听</p><br />
							<p>2. 购买课程后关注我们的服务号，可在菜单里进入听课</p><br />
                            <p>3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</p><br />
                            <p>4. 该课程听课权益跟随支付购买微信账号ID，不支持更换（赠礼课程除外）</p><br />
							<p>5. 如有其它疑问，可点击右下角“更多”按钮后选择“咨询”，与内容供应商沟通后再购买</p>
						</div>
					</main>
				</Confirm>

                {/* 优惠券列表弹窗 */}
                { this.state.isCoupons && (
                    <CouponLists
                        chargePrice={ this.state.couponUsePrice }
                        couponLists={ this.state.couponList }
                        hideCoupon={ this.hideCoupon }
                        businessId={ this.props.topicInfo.id }
                        couponListType={this.state.couponListType}
                        channelId={ this.props.channelId }
                        from="topic"
                        />
                ) }
                {/* 拉人返学费弹窗 */}
				<BackTuitionDialog
                    ref = {el => this.backTuitionDialogEle = el}
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
                
                { this.props.isListenBook && !this.state.isApp && <HomeFloatButton scrolling = { this.state.scrolling } /> }

				<MiddleDialog
					show={this.state.isShowGroupDialog}
					title = "什么是课程社群?"
					buttons="cancel"
					buttonTheme="line"
					cancelText="我知道了"
					onBtnClick={() => {this.setState({
						isShowGroupDialog: false
					})}}
					className="topic-dialog group-entrance-understand-dialog"
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
    }
}

function mapStateToProps (state) {
    return {
        sysTime: getVal(state, 'topicIntro.sysTimestamp',getVal(state, 'common.sysTime')),
        userId: getVal(state, 'common.userInfo.user.userId'),
        topicId: getVal(state, 'topicIntro.topicInfo.id'),
        campId: getVal(state, 'topicIntro.topicInfo.campId', ''),
        liveId: getVal(state, 'topicIntro.topicInfo.liveId'),
        channelId: getVal(state, 'topicIntro.channelId'),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        liveInfo : getVal(state, 'live.liveInfo', {}),
        isFollow: getVal(state, 'live.isFollow',{}),
        profile : getVal(state, 'topicIntro.profile', []),
        // evaluation: getVal(state, 'topicIntro.evaluation'),
        isSubscribe:getVal(state, 'topicIntro.isSubscribe',{}),
        isLiveAdmin:getVal(state, 'topicIntro.isLiveAdmin',{}),
        myShareQualify: getVal(state, 'topicIntro.myShareQualify',{}),
        coral:getVal(state, 'topicIntro.coral', {}),
        coralPercent: getVal(state, 'topicIntro.coral.sharePercent', ''),
        power:getVal(state, 'topicIntro.power', {}),
        relayConfig: getVal(state, 'topicIntro.relayConfig', {}),
        isAuthTopic: getVal(state, 'topicIntro.isAuthTopic', false),
        blackInfo: getVal(state, 'topicIntro.blackInfo', {}),
        isNeedCollect: getVal(state, 'topicIntro.isNeedCollect'),
        consultList: getVal(state, 'topicIntro.consultList', []),
        liveRole: getVal(state, 'topicIntro.liveRole', ''),
        authStatus: getVal(state, 'topicIntro.channelInfo.channel.authStatus'),
        sourceChannelId: getVal(state, 'topicIntro.channelInfo.channel.sourceChannelId'),
        vipInfo: getVal(state, 'topicIntro.userVipInfo', {}),
        userTag: getVal(state, 'topicIntro.userTag', ''),
        curChannelCoupon: getVal(state, 'topicIntro.curChannelCoupon'),
        curTopicCoupon: getVal(state, 'topicIntro.curTopicCoupon'),
        topicSummary: getVal(state, 'topicIntro.topicSummary', ''),
        browsNum:getVal(state, 'topicIntro.browsNum', ''),
        channelDisplayStatus: getVal(state, 'topicIntro.channelInfo.channel.displayStatus', 'Y'),
        channelChargeConfigs: getVal(state, 'topicIntro.channelInfo.chargeConfigs', {}),
        channelShareInfo: getVal(state, 'topicIntro.channelInfo.channel', {}),
		isOpenEvaluation: state.evaluation.isOpen === 'Y',
        evaluation: state.evaluation,
        evaluationData: state.evaluation.evaluationData || {},
        showDiscount: getVal(state,'channel.discountExtendPo.showDiscount',false),
        isListenBook: getVal(state, 'topicIntro.topicInfo.isBook') === 'Y',
		//会员信息
	    memberInfo: getVal(state, 'memberInfo' || {}),
		isMember: getVal(state, 'memberInfo.isMember') === 'Y',
        isMemberPrice: getVal(state, 'topicIntro.isMemberPrice') === 'Y',
        userInfo: state.common.userInfo.user,
        platformShareRate: state.common.platformShareRate,// 平台分销比例中的个人比例
        platformShareQualify: state.common.platformShareQualify,// 平台分销比例中平台的比例
        isAuthChannel: state.channelIntro.isAuthChannel,
        relationInfo: state.common.relationInfo
    }
}

const mapActionToProps = {
    topicTaskCardAuth,
    fetchInitData,
    subscribeStatus,
    checkFollow,
    getTopic,
    getQr,
    bindShareKey,
    bindOfficialKey,
    publicApply,
    consultPraise,
    checkUser,
    getEvaluableStatus,
    getRealStatus,
    userBindKaiFang,
    addPageUv,
    followLive,
    getIsOrNotListen,
    getTopicAutoShare,
    checkDuplicateBuy,
    fetchQlQrcode,
    userIsOrNotCustomVip,
    tripartiteLeadPowder,
    isCollected,
    addCollect,
    cancelCollect,
    getEditorSummary,
    getQrCode,
    getMyQualify,
    getEvaluationList,
    getEvaluationData,
    getIsOpenEvaluate,
    fetchCouponListAction,
    getIsAuthChannel,
    isShowMemberLine,
    selectCouponIdx,
    getChannelGroupResult,
    getShareRate,
    getPlatFormQualify,
    getUserInfo,
    ifGetCousePayPasterLink,
    fetchPayUser,
    dispatchFetchRelationInfo,
    fetchCourseTag
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicIntro);
