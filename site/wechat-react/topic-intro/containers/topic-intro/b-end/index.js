import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { autobind, throttle } from 'core-decorators';
import { eventLog } from 'components/log-util';

// components
import { formatDate, imgUrlFormat, formatMoney, locationTo, htmlTransferGlobal, getVal, getCookie, wait, handleAjaxResult, randomShareText, baiduAutoPush, getCourseHtmlInfo } from 'components/util';
import { fillParams } from 'components/url-utils'
import ScrollToLoad from 'components/scrollToLoad';
// import animation from 'components/animation'
import Page from 'components/page';
import { share } from 'components/wx-utils';
import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';
// import { showShareSuccessModal } from 'components/dialogs-colorful/share-success'
import PushTopicDialog from 'components/dialogs-colorful/push-dialogs/topic';
import ActionSheet from 'components/action-sheet';
import { Confirm } from 'components/dialog';
import BackTuitionLabel from '../../../components/back-tuition-label';
import SubscriptionBar from 'components/subscription-bar';
// import QRImg from 'components/qr-img';
import CouponDialog from 'components/coupon-dialog';
import CouponInDetail from 'components/coupon-in-detail';
import FollowDialog from 'components/follow-dialog';

import RelayDialog from './components/relay-dialog';
import TopicInfo from './components/topic-info-container'
import BottomMenus from './components/bottom-menus'
import ConsultDialog from './components/consult-dialog'
// import TopicEvaluate from './components/topic-evaluate';
import CourseIntro from './components/course-intro';
import LiveInfo from './components/live-info';
import TopicList from './components/topic-list';
import FollowQlCode from './components/follow-ql-qrcode';
import ComplainFooter from './components/complain-footer';
import GiftDialog from './components/gift-dialog';
import ConsultModule from './components/consult-module';
import ShareRank from './components/share-rank';
import BtnShareCard from './components/topic-info-container/btn-share-card';
// import PromoRank from './components/promo-rank';
import Evaluate from '../../../components/evaluate';
import TopOptimizeBar from '../../../../components/top-optimize-bar';

// actions
import {
    userIsOrNotCustomVip,
    tripartiteLeadPowder,
    subscribeStatus,
    isFollow as checkFollow,
    whatQrcodeShouldIGet,
    subAterSign,
    uploadTaskPoint,
    request,
    checkEnterprise,
    getCommunity
} from 'common_actions/common'
import { 
    getCoralQRcode,
} from 'common_actions/coral'

import {
    getEditorSummary
} from '../../../actions/editor';

import {
    fetchInitData,
    getTopic,
    consultPraise,
    checkUser,
    getRealStatus,
    getCheckUser,
    userBindKaiFang,
    followLive,
    topicTaskCardAuth,
    getTopicAutoShare,
    bindShareKey,
} from '../../../actions/topic-intro';

import {
    getQr,
    bindOfficialKey,
    getIsOrNotListen,
    getQrCode,
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
} from '../../../actions/channel';

import {
    reply,
    removeReply,
    getEvaluationList,
    getEvaluationData,
    getIsOpenEvaluate
} from '../../../actions/evaluation';
import { apiService } from 'components/api-service/index';

import IntroGroupBar from "components/intro-group-bar";

@autobind
class TopicIntro extends Component {

    state = {
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
        // 是否显示定制vip样式
        showVipIcon:false,

        // 是否开启自动领取，默认开启，就是页面刚进来的时候需要自动领取优惠券，如果是在介绍中点击那个优惠券的话这个开关需要关闭，见onReceiveClick方法
        isAutoReceive: true,

        //分享二维码相关
        shareQrAppId: '',
        shareQrcodeUrl: '',

        // 千聊公众号二维码链接url
        qlqrcodeUrl: '',
		followDialogTitle: '',
		followDialogDesc: '',
        followDialogOption: {},
        
        currentTab: "intro",
        
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

        courseOptimizeNum: 0, // 课程待优化的个数
                
        communityInfo: null, // 社群信息
		groupHasBeenClosed: true, // 關閉社群入口
		isShowGroupDialog: false, // 显示社群弹窗
    };

    data = {
        channelNo : '',
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
    tabDom = null

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

    componentDidMount() {
        /***************************/
        // 注意需要userid的接口请求要放在fetchInitData判断里面！！
        /***************************/
        this.fetchInitData();
        /***************************/
        // 注意需要userid的接口请求要放在fetchInitData判断里面！！
        /***************************/


        this.initTopicList();
        this.getEditorSummary();
        
		this.initHtmlInfo({
			businessId: this.props.topicId,
			businessType: 'topic',
			businessName: htmlTransferGlobal(this.props.topicInfo.topic), 
			liveName: this.props.topicInfo.liveName, 
			intro: this.props.topicInfo.guestIntr || ''
		});

	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-box');
        }, 1000);
        
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

    getEditorSummary = async () => {
        let result = await this.props.getEditorSummary(this.props.topicId, 'topic');
        if (result.state.code == 0) {
            this.setState({
                topicDesc: result.data.content
            })
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

    /**
     * 点击“查看购买记录”
     */
    viewBoughtRecords(){
        const haveFollowedQl = this.props.isSubscribe.subscribe;
        // 已经关注了千聊公众号，直接跳转至购买记录页面，否则弹出千聊公众号的二维码
        if (haveFollowedQl) {
            locationTo('/live/entity/myPurchaseRecord.htm');
        } else {
            this.refs.haveBoughtDialog.hide();
            this.setState({
                followDialogTitle: '关注我们',
                followDialogDesc: '接收开课提醒、优惠福利再也不怕漏掉精彩内容了',
                followDialogOption: {}
            }, () => {
                this.followDialogDom.show()
            })
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
			const mark = 'be'
			_qla('pv', {
				mark
			});
			_qla.set('mark', mark)
		}
	}

    // 初始化基础数据
    async fetchInitData() {
        const topicId = this.props.topicId;
        const liveId = this.props.liveId;
        const channelId = this.props.channelId;
        const campId = this.props.campId;
        const tracePage = sessionStorage.getItem('trace_page');
        // 获取初始数据
        await this.props.fetchInitData({ topicId, liveId, campId, channelId, isCoral:(tracePage==='coral')});
        this.sendPV();
        this.initTopicAuth();
        
		

		

        this.setState({
            isOpenEvaluate: this.props.liveInfo.entityExtend.isOpenEvaluate,
            isOpenVip: this.props.liveInfo.entityExtend.isOpenVip == 'Y',
            showBottomMenu: true,
            couponCode: this.props.location.query.couponCode,
            codeId: this.props.location.query.codeId,
        });

	    if(this.tracePage ==='coral'){
        	this.initCoralShare();
	    }else{
		    this.initShare();
	    }

        
        /***************************/
        // 只有登录才有的操作
        /***************************/
        if (this.props.userId) {
            // this.initCoralPushData();
            this.isCheckUser();
            this.initEvaluableStatus();
            // 绑定分销关系
            await this.bindlShareKey();
            
            this.initUserBindKaiFang();
            this.topicTaskCardAuth();
            this.getIsOrNotListen();
            this.checkDuplicateBuyStatus();
            this.fetchQlQrcode();
            this.initCustomizedVipBtn();
            if(this.isAutoShareOnly){
                this.getTopicAutoShare();
            }
            
            //officialKey，就绑定关系
            if(this.props.location.query.officialKey){
                this.props.bindOfficialKey({
                    officialKey: this.props.location.query.officialKey
                });
            }
            // 是否显示转播
            if (this.props.relayConfig.showWelcome === 'Y') {
                this.relayDialog.show();
            }
            
            this.initFocusConfirm();
            
            this.initScrollTab();
            // 返学费初始化状态
            this.initInviteReturnInfo()

            this.props.getEvaluationData({
                topicId
            })
            await this.props.getIsOpenEvaluate(this.props.liveId)

            this.dispatchGetCommunity();

            this.ajaxGetCourseOptimizeNum();
        }

        // 话题统计
        this.addPageUv();
        
    }

     // 获取返学费信息
	initInviteReturnInfo = async() => {
		await request({
			url: '/api/wechat/transfer/h5/invite/return/inviteReturnInfo',
			body: {
				businessId: this.props.channelId || this.props.topicId,
				businessType: this.props.channelId ? 'channel' : 'topic',
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

    // 绑定分销关系
    async bindlShareKey(){
        let lsharekey = this.props.location.query.lshareKey;
        let taskCardShare = this.props.location.query.taskCardShare === 'Y' ? true : false;
        if (taskCardShare || lsharekey) {
            await this.props.bindShareKey(this.props.topicInfo.liveId, lsharekey, taskCardShare ? 'taskCardShare' : '');
        }
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

    /**
	 *
	 * 话题统计
	 * @memberof TopicIntro
	 */
	async addPageUv(){
	    await wait(3500);
		this.props.addPageUv(this.props.topicId, this.props.liveId, ['topicIntro', 'liveUv'], this.data.channelNo, this.props.location.query.shareKey ||'');
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
                body: { liveId: this.props.liveId }
            }).then(res => {
                let isQlLive = getVal(res, 'data.isQlLive', '')
                this.isQlLiveData = isQlLive
                resolve(isQlLive)
            })
        })
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
        let wxqlimgurl = this.props.topicInfo.backgroundUrl ?imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,w_100,h_100,limit_1') : "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        // let shareUrl = window.location.origin + this.props.location.pathname + '?topicId=' + this.props.topicId + "&pro_cl=link";

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + '?topicId=' + this.props.topicId + "&pro_cl=link";
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
            desc: descript,
            shareUrl: target,
            timelineTitle: friendstr,
        })

        let onShareComplete = null
        // 有登录才初始化更多信息
        if (this.props.userId) {
            if (this.props.myShareQualify && this.props.myShareQualify.shareKey && this.props.myShareQualify.type == 'live') {
                shareObj.title = "我推荐-" + shareObj.title;
                shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
                shareObj.shareUrl = shareObj.shareUrl + "&lshareKey=" + this.props.myShareQualify.shareKey;
            }else if(this.props.myShareQualify && this.props.myShareQualify.shareKey && this.props.myShareQualify.type == 'topic'){
                shareObj.title = "我推荐-" + shareObj.title;
                shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
                shareObj.shareUrl += "&shareKey=" + this.props.myShareQualify.shareKey;
            }

            // /**
            //  * 分享回调需满足条件：
            //  * 1. 非专业版直播间
            //  * 2. 未关注千聊
            //  * 3. 非白名单账号
            //  */
            // const { isLiveAdmin } = this.props.isLiveAdmin;
            // const { isShowQl, subscribe } = this.props.isSubscribe;

            // // if (isLiveAdmin === 'N' && !subscribe && isShowQl) {
            // //     onShareComplete = this.onShareComplete
            // //     this.getShareQr()
            // // }
            // this.getShareQr()
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

        // B端分享此页面加个标识
        if(this.props.power.allowMGLive || this.props.power.allowSpeak){
	        shareObj.shareUrl = fillParams({fromOld: '1'}, shareObj.shareUrl);
        }
        /*****/
        
		if (this.props.location.query.psKey || ( this.props.userId && await this.isQlLive() === 'Y')) {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
		}

        
        
        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        console.log('分享信息: ', shareObj,wxqlimgurl)
        share({
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: this.onShareComplete,
        });
    }
	/**
	 *
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
	    const hasLShareKey = myShareQualify && myShareQualify.shareKey && myShareQualify.type === 'live';

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
		const wxqlimgurl = this.props.topicInfo.backgroundUrl ?imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,w_100,h_100,limit_1') : 'https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png';
		const friendstr = wxqltitle;
		let shareUrl = fillParams({
			officialKey: this.props.userId,
			pro_cl: 'link'
        });
        shareUrl = fillParams({},shareUrl,['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']);

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
	get distributionShareEarningPercent(){
		return (this.props.myShareQualify && this.props.myShareQualify.shareEarningPercent) || '';
	}

	onShareCardClick(){
		const lshareKey = getVal(this.props, 'location.query.lshareKey', '');
		const sourceNo = getVal(this.props, 'location.query.sourceNo', '');
		locationTo(`/wechat/page/sharecard?type=topic&topicId=${this.props.topicInfo.id}&liveId=${this.props.topicInfo.liveId}&lshareKey=${lshareKey}&sourceNo=${sourceNo}`);
	}

    // 分享成功回调使用
    async onShareComplete() {
        
		// 学分任务达成触发点
		uploadTaskPoint({
            assignmentPoint: 'grow_share_course',
        })
        
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
                followDialogTitle: '分享成功',
                followDialogDesc: '关注我们，发现更多优质好课',
                followDialogOption: {
                    traceData: 'topicIntroShareQrcode',
                    channel: '115',
                    appId: result.appId
                }
             },() => {
                this.followDialogDom.show()
            })
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
    
    // 跳转到话题推送页面
    pushTopic(){
        locationTo(`/wechat/page/live-push-message?channelId=${this.props.channelId || ''}&topicId=${this.props.topicId}&isSingleBuy=${this.props.topicInfo.isSingleBuy}`)
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


	// 免费话题 报名并进入话题
	async authTopic() {
		if (!this.props.isAuthTopic) {
            const {
                isNeedCollect
            } = this.props
            // 报名前判断是否需要采集信息，需要则跳转 表单前置
			if (isNeedCollect && isNeedCollect.isWrite == 'N' && isNeedCollect.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != isNeedCollect.id) {
				locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=topic&topicId=${this.props.topicId}&auth=Y`)
				return false;
			}

			let shareKey = this.props.location.query.shareKey||this.props.location.query.lshareKey||'';
			var result = await this.props.publicApply(this.props.topicId, shareKey, this.data.channelNo || 'qldefault');
			sessionStorage.removeItem("saveCollect");
		}

		/**
		 * 支付报名成功后引导关注千聊
		 * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
		 * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
		 * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
		 * 4、珊瑚来源的支付成功后，判断是否关注珊瑚公众号，没关注则返回珊瑚公众号二维码
         */
        let qrUrl = '';
        const tracePage = sessionStorage.getItem('trace_page');
        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"||tracePage ==='coral'){
            qrUrl = await getCoralQRcode({
                channel:'subAfterSignCoral',
                liveId: this.props.topicInfo.liveId,
                channelId: this.props.channelId,
                topicId: this.props.topicId,
            });
        }else{
            qrUrl = await subAterSign('subAfterSign',this.props.liveId, {channelId: this.props.channelId || '', topicId: this.props.topicId})
        }
		if(qrUrl){
			locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.liveId}&payFree=${this.props.topicInfo.type === 'charge' ? 'N' : 'Y'}&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}`)
		}else {
			locationTo(`/topic/details?topicId=${this.props.topicId}&sourceNo=${this.props.location.query.sourceNo || ''}&fromOld=${this.props.location.query.fromOld || ''}`)
		}
	}

    // 购买系列课
    buyChannel() {
        this.bottomMenus && this.bottomMenus.onBuyChannel();
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
	switchCoralPromotionPanelNav(type){
		this.setState({
			coralPromotionPanelNav: type
		})
	}
	onCoralPromoDialogClose(e){
		this.setState({
			showCoralPromoDialog: false
		});
		// if(!this.isCoralOnly){
		// 	this.initShare();
		// }
	}

	uncertainShareBtnClickHandle(){
		if(this.data.coralShareSheetList){
			this.actionSheet.show(this.data.coralShareSheetList);
			return;
		}

		this.data.coralShareSheetList = [
			{
				name: '使用珊瑚计划分享赚',
				strong: `${formatMoney(this.props.topicInfo.money * (this.props.coralPercent / 100))}元`,
				action: _ => {
					this.showCoralPromoDialog();
					this.initCoralShare();
				}
			},
			{
				name: '使用课代表分享赚',
				strong: `${formatMoney(this.props.topicInfo.money * (this.distributionShareEarningPercent / 100))}元`,
				action: _ => this.onShareCardClick()
			}
		];

		this.actionSheet.show(this.data.coralShareSheetList);
    }

    // 页面滚动的tab切换
    initScrollTab() {
        this.scrollPage = findDOMNode(this.scrollWrapEl)
        this.scrollPage.addEventListener('scroll', this.tabScrollHandle)
        
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
		wrapEl.style.minHeight = tabEl.offsetTop + this.scrollPage.clientHeight + 'px';
        return;
        
        const contentHeight = this.introAnchorDom.clientHeight
        let pb = 120
        if (contentHeight < this.scrollPage.clientHeight - this.tabDom.clientHeight) {
            pb = this.scrollPage.clientHeight - this.introAnchorDom.clientHeight - this.tabDom.clientHeight
        }
        this.scrollPage.style.paddingBottom = `${pb}px`
    }

    @throttle(300)
    tabScrollHandle(e) {

        const state = {}
        if (this.scrollPage.scrollTop > 300 && !this.state.showGoToTop) {
            state.showGoToTop = true
        } else if (this.scrollPage.scrollTop <= 300 && this.state.showGoToTop) {
            state.showGoToTop = false
        }

        // 判断是否显示tab
        if (!this.state.tabStick && this.introAnchorDom && this.scrollPage.scrollTop >= this.tabDom.offsetTop) {
			state.tabStick = true
        } else if (this.state.tabStick && this.introAnchorDom && this.scrollPage.scrollTop < this.tabDom.offsetTop) {
			state.tabStick = false
        }
        
        this.setState(state)
    }

    // 检查是否填表
    isCheckUser() {
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
    initUserBindKaiFang() {
        let kfAppId = getVal(this.props, 'location.query.kfAppId', '');
        let kfOpenId = getVal(this.props, 'location.query.kfOpenId', '');
        let auditStatus = getVal(this.props, 'location.query.auditStatus', '');
        //  如果有auditStatus，则不走这段逻辑
        if (kfAppId && kfOpenId && !auditStatus) {
            this.props.userBindKaiFang({
                kfAppId,
                kfOpenId
            });

            // 如果没关注则关注直播间
            if (!this.props.isFollow.isFollow) {
                this.props.followLive(this.props.liveId, 'Y');
            }

        }
    }


    // 从开放平台过来的用户要绑定三方和关注直播间
    topicTaskCardAuth() {
        if (this.props.isAuthTopic) {
            return false;
        }
        let s = getVal(this.props, 'location.query.s', '');
        let t = getVal(this.props, 'location.query.t', '');
        let sign = getVal(this.props, 'location.query.sign', '');
        let shareKey = getVal(this.props, 'location.query.shareKey', '');
        let channelNo= this.data.channelNo;

        if (s == 'taskcard') {
            this.props.topicTaskCardAuth({
                s,
                t,
                sign,
                topicId: this.props.topicId,
                shareKey,
                channelNo
            });
            this.props.followLive(this.props.liveId, 'Y');

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


    async handleFocusBtnClick(state){
        await this.props.followLive(this.props.liveId, state);
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

    //关注逻辑弹框的点击关注取关方法
    dialogHandleFocusBtn(e){
        const focusMethod = this.props.location.query.focusMethod;
        const isLiveFocus = this.props.isFollow.isFollow;
        if(focusMethod === 'one'&&!isLiveFocus){
            this.refs.focusOneDialog.hide();
            eventLog({
                category: 'focusLiveMethod',
                action: 'success',
                business_id: this.props.topicId,
                business_type: 'topic',
                method: 'one-btn',
            });
        }else if(focusMethod === 'two'&&isLiveFocus){
            this.refs.focusTwoDialog.hide();
            eventLog({
                category: 'focusLiveMethod',
                action: 'success',
                business_id: this.props.topicId,
                business_type: 'topic',
                method: 'two-btn',
            });
        }else if(focusMethod === 'confirm'&&isLiveFocus){
            this.refs.focusCancelDialog.hide();
            eventLog({
                category: 'focusLiveMethod',
                action: 'success',
                business_id: this.props.topicId,
                business_type: 'topic',
                method: 'confirm-btn',
            });
        }
        this.handleFocusBtnClick(e);
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

    onGotoSet() {
        locationTo(`/wechat/page/coupon-code/list/topic/${this.props.topicId}`);
    }
    
	tabHandle(key) {
        setTimeout(() => {
            this.setState({
                currentTab: key
            }, async () => {
                if (key === 'evaluate' && !this.getEvaluationListObj().data) {
                    await this.loadEvaluateList()
                }
                setTimeout(() => {
                    // this.computeContenHeight()
                    this.scrollPage.scrollTop = this.tabDom.offsetTop
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
        return this.state.currentTab == 'evaluate' && this.getEvaluationListObj().status === 'end'
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
		const boundingBottomDiff = this.scrollPage.getBoundingClientRect().bottom - target.getBoundingClientRect().bottom - this.refs['reply-input-box'].clientHeight;
		this.scrollPage.scrollTop = this.scrollPage.scrollTop - boundingBottomDiff;
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
                businessId: this.props.topicId,
                businessType: 'topic'
            }
        })
        if (result.state.code == 0) {
            this.setState({
                courseOptimizeNum: result.data.num
            })
        }
    }

    async dispatchGetCommunity() {
        const res = await getCommunity(this.props.topicInfo.liveId, 'topic', this.props.topicId);
        if(res) {
            this.setState({
                communityInfo: res
            });
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
    
	// 授权
	loginHandle = () => {
		location.href = '/api/wx/login?redirect_url=' + encodeURIComponent(location.href);
	}

    render() {
        let evaluateNumStr = this.props.evaluationData.evaluateNumStr;
        evaluateNumStr == 0 && (evaluateNumStr = '');
        return (
            <Page 
				title={this.state.htmlTitle || htmlTransferGlobal(this.props.topicInfo.topic)}
				description={this.state.htmlDescription || ''}
				keyword={this.state.htmlKeywords || ''}
                className="topic-intro-page flex-body" 
                banpv={true}
                >
            
                {/* 订阅条 */ }
                <SubscriptionBar
                    show = {this.state.showSubscriptionBar}
                    close = {this.hideSubscriptionBar}
                    subscribe = {this.subscribe}
                />
                {
                    (this.props.topicInfo.isSingleBuy == 'Y' && this.props.topicInfo.channelId) || !this.props.topicInfo.channelId ? <TopOptimizeBar businessId={this.props.topicId} businessType='topic' num={this.state.courseOptimizeNum}/> : null

                }

                <div className="scroll-load-wrap">
                <ScrollToLoad
                    className="scroll-container scroll-box"
                    toBottomHeight={300}
                    disable={this.isDisable}
                    loadNext={this.loadMore}
                    noMore={this.isNoMore}
					hideNoMorePic={true}
                    ref={ dom => this.scrollWrapEl = dom }
                    footer={(<ComplainFooter
                        topicId = {this.props.topicId}
                        isLiveAdmin = {this.props.isLiveAdmin}
                        liveId = {this.props.topicInfo.liveId}
                    />)}
                >
                    
                    <BtnShareCard
                        lShareKey = {(this.props.myShareQualify.type==='live'&& this.props.myShareQualify.joinType !=='auto' &&this.props.myShareQualify)||''}
                        shareKey = {(this.props.myShareQualify.type==='topic'&& this.props.myShareQualify.joinType !=='auto' &&this.props.myShareQualify)||''}
                        topicInfo = {this.props.topicInfo}
                        coral = {this.props.coral}
                        onCoralShare = {this.showCoralPromoDialog}
                        uncertainShareBtnClickHandle = {this.uncertainShareBtnClickHandle}
                        distributionShareEarningPercent = {this.distributionShareEarningPercent}
                        autoSharePercent = {this.props.myShareQualify.joinType ==='auto' && this.props.myShareQualify.shareEarningPercent}
                        liveRole = {this.props.liveRole}
                        isTabbarShow = {this.state.showTabModule}
                        channelId = {this.props.channelId}
                    ></BtnShareCard>
                    <TopicInfo
                        showCoralPromoDialog = {this.showCoralPromoDialog}
                        isOpenVip = {this.state.isOpenVip}
                        onGiftClick={ this.giftDialog && this.giftDialog.show }
                        authTopic={ this.authTopic }
                        buyChannel={ this.buyChannel }
                        uncertainShareBtnClickHandle={this.uncertainShareBtnClickHandle}
                    />

                    {
                        this.props.topicInfo.isShareOpen === 'Y'  &&
                            <ShareRank />
                    }

                    {/*切换课程的tab */}
                    <div className="p-intro-tab" ref = {dom => { this.tabDom = dom}}>
                        <div 
                            className={`tab-item on-log${this.state.currentTab == "intro" ? " active" : ""}`}
                            onClick={this.tabHandle.bind(this, "intro")}
                            data-log-name="课程介绍"
                            data-log-region="tab-to-modul"
                            data-log-pos="intro"
                            data-log-status="bought"
                            >课程介绍</div>
                        {/* <div 
                            className={`tab-item on-log${this.state.currentTab == "list" ? " active" : ""}`}
                            onClick={this.tabHandle.bind(this, "list")}
                            data-log-name="更多课程"
                            data-log-region="tab-item"
                            data-log-pos="list"
                            >课程介绍</div> */}
                        <div 
                            className={`tab-item on-log${this.state.currentTab == "evaluate" ? " active" : ""}`}
                            onClick={this.tabHandle.bind(this, "evaluate")}
                            data-log-name="用户评价"
                            data-log-region="tab-to-modul"
                            data-log-pos="evaluate"
                            data-log-status="bought"
                            >用户评价<span className="eval-num">{evaluateNumStr}</span></div>
                    </div>
					
                    {/* 会多出来的按个tab */}
                    {
                        this.state.tabStick && <div className={`p-intro-tab stick`}>
                            <div
                                className={`tab-item on-log${ (this.state.currentTab == "intro") ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "intro")}
                                data-log-name="课程介绍"
                                data-log-region="tab-to-modul"
                                data-log-pos="intro"
                                data-log-status="bought"
                            >课程介绍</div>
                            {/* <div
                                className={`tab-item on-log${ (this.state.currentTab == "list") ? " active" : ""}`}
                                onClick={this.tabHandle.bind(this, "list")}
                                data-log-name="更多课程"
                                data-log-region="tab-item"
                                data-log-pos="list"
                            >更多课程</div> */}
							<div 
								className={`tab-item on-log${this.state.currentTab == "evaluate" ? " active" : ""}`}
								onClick={this.tabHandle.bind(this, "evaluate")}
								data-log-name="用户评价"
								data-log-region="tab-to-module"
								data-log-pos="evaluate"
                                data-log-status="bought"
								>用户评价<span className="eval-num">{evaluateNumStr}</span></div>
                        </div>
                    }
                    
					{/*  内容主体 */}
					<div ref = {dom => { this.introAnchorDom = dom}}>
                        
                        {/* 课程介绍 */}
                        {
                            this.state.currentTab === "intro" && (
                                <div className="intro">
                                    {/* 拉人返学费介绍 */}
                                    { this.state.showBackTuitionLabel && 
                                        <BackTuitionLabel
                                            inviteReturnConfig = {this.state.inviteReturnConfig}
                                            fromB = {true}
                                        /> 
                                    }
                                    {/* {
                                        this.props.topicInfo.isShareOpen === 'Y' && this.props.topicInfo.type === 'charge' &&
                                            <PromoRank
                                                topicId={this.props.topicId}
                                            />
                                    } */}

                                    {/* 评论条 */}
                                    {/* {
                                        (this.state.isOpenEvaluate && this.state.canStatus == 'Y' && this.props.topicInfo.status == "ended" && this.props.topicInfo.type == "charge") &&
                                            <TopicEvaluate
                                                evaluation = {this.props.evaluation}
                                                topicId = {this.props.topicId}
                                            />
                                    } */}

                                    {/* 话题介绍内容 */}
                                    <CourseIntro
                                        introRef={ dom => this.courseIntro = dom }
                                        topicInfo = {this.props.topicInfo}
                                        profileList = {this.props.profile}
                                        topicDesc={this.state.topicDesc}
                                    >
                                        {
                                            ((this.isCanReceiveCoupon||this.props.power.allowMGTopic)&& this.props.userId)?
                                                <CouponInDetail
                                                    businessType={ 'topic' }
                                                    businessId={ this.props.topicInfo.id }
                                                    onReceiveClick={ this.onReceiveClick }
                                                    onGotoSet ={this.onGotoSet}
                                                />
                                            :null
                                        }
                                    </CourseIntro>

                                    {
                                        this.props.channelId &&
                                            <div className='quick-link-bar icon_enter'
                                                onClick={() => { locationTo(`/live/channel/channelPage/${this.props.channelId}.htm`) }}
                                            >
                                                <span className="title">所属系列课：</span>
                                                <span className="content">{this.props.topicInfo.channelName}</span>
                                            </div>
                                    }

                                    {
                                        this.props.topicInfo.campId &&
                                            <div className='quick-link-bar icon_enter'
                                                onClick={() => { locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`) }}
                                            >
                                                <span className="title">所属打卡训练营：</span>
                                                <span className="content">{this.props.topicInfo.campName}</span>
                                            </div>
                                    }

                                    {/* 加密话题关注公众号信息 */}
                                    {
                                        (this.props.topicInfo.type=="encrypt" && this.props.liveInfo.entity && this.props.liveInfo.entity.subscriptionName )?
                                        <div className='quick-link-bar'>
                                            <span className="tips">本课程由公众号【{this.props.liveInfo.entity.subscriptionName}】举办，如有疑问，请联系举办方</span>
                                        </div>
                                        :null
                                    }

                                    <LiveInfo
                                        topicInfo = { this.props.topicInfo }
                                        liveInfo = { this.props.liveInfo }
                                        getRealStatus = { this.props.getRealStatus }
                                        getCheckUser={ this.props.getCheckUser }
                                        power = { this.props.power }
                                        liveRole={ this.props.liveRole }
                                        auditStatus = {this.props.location.query.auditStatus || ''}
                                        groupComponent={
                                            <div style={{background: "#fff"}}>
                                                <IntroGroupBar
                                                    padding=".53333rem"
                                                    communityInfo={this.state.communityInfo} 
                                                    hasBeenClosed={this.state.groupHasBeenClosed}
                                                    allowMGLive={this.props.power.allowMGLive}
                                                    onClose={this.onGroupEntranceClose}
                                                    onModal={() => {this.setState({isShowGroupDialog: true})}}
                                                />      
                                            </div>
                                        }
                                    />

                                    <ConsultModule
                                        consultRef={ dom => this.consultModule = dom }
                                        showConsult = {this.showConsult}
                                        consultPraise = {this.props.consultPraise}
                                    />


                                    {/* 二维码关注模块 */}
                                    <FollowQlCode/>


                                    {/* <ComplainFooter
                                        topicId = {this.props.topicId}
                                        isLiveAdmin = {this.props.isLiveAdmin}
                                        liveId = {this.props.topicInfo.liveId}
                                    /> */}
                                </div>
                            )
                        }
                        
						{/* 推荐课程 */}
						{
							this.state.currentTab === "list" && (
                                <TopicList
                                    topicListRef={ dom => this.topicList = dom }
                                    topicList = {this.state.topicList}
                                    topicId = {this.props.topicId}
                                    liveId = {this.props.liveId}
                                    auditStatus = {this.props.location.query.auditStatus || ''}
                                    sourceNo={this.props.location.query.sourceNo}
                                    fromOld={this.props.location.query.fromOld}
                                />
                            )
						}

						{/* 用户评价 */}
						{
							this.state.currentTab === "evaluate" && (
                                <Evaluate
                                    isAuth={true} 
                                    courseType="topic"
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
               {/* 底部按钮栏 */}
                {
                    this.state.showBottomMenu ?  
                        this.props.isLogined ?
                        <BottomMenus
                            ref={ dom => dom && (this.bottomMenus = dom.getWrappedInstance()) }
                            showGoToTop={ this.state.showGoToTop }
                            onConsultClick = { e => this.showConsult(true) }
                            showPushTopicDialog = {this.showPushTopicDialog}
                            pushTopic = {this.pushTopic}
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
                            sourceNo={this.props.location.query.sourceNo}
                            fromOld={this.props.location.query.fromOld}
                            userId={this.props.userId}
                        />
                        :
                        <div className="button-row">
                            <span className="btn-lg color-excited on-log on-visible"
                                data-log-region="topic-login-btn"
                                onClick={this.loginHandle}
                                >登录</span>
                        </div>
                    : null
                }

	            <ActionSheet
		            ref={c => {this.actionSheet = c;}}
	            />

	            {
		            this.props.coralPercent &&
		            <CoralPromoDialog
			            show={this.state.showCoralPromoDialog}
			            close={this.onCoralPromoDialogClose}
			            nav={this.state.coralPromotionPanelNav}
			            switchNav={this.switchCoralPromotionPanelNav}

			            courseData={this.state.coralPushData}
                        officialKey={this.props.userId}
		            />
	            }

                {/* 咨询弹框 */}
                <ConsultDialog
                    key='consult-dialog'
                    ref={ dom => dom && (this.dialogConsult = dom.getWrappedInstance()) }
                    changeContainerScrollState={this.changeContainerScrollState}
                />

                {
                    // 有管理权限才请求
                    this.props.power.allowMGTopic &&
                    <PushTopicDialog
                        topicId={this.props.topicInfo.id}
                        liveId={this.props.topicInfo.liveId}
                        isShow={this.state.showPushTopicDialog}
                        hide={this.hidePushTopicDialog}
                    />
                }

                {/* 赠礼弹框 */}
                <GiftDialog
                    ref={ dom => dom && (this.giftDialog = dom.getWrappedInstance()) }
                    userId={this.props.userId}
                />

                {/* 转播弹框 */}
                <RelayDialog
                    ref={ dom => this.relayDialog = dom }
                    topicName={ this.props.topicInfo.topic }
                    topicType={ this.props.topicInfo.type }
                    profitRatio={ this.props.relayConfig.profitRatio }
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
                        <div className="red-btn" onClick={() => { this.gotoChannelBought(); }}>进入课程</div>
                        <div className="view-bought-records"><a href="javascript:void(0)" onClick={this.viewBoughtRecords}>查看购买记录</a></div>
                    </main>
                </Confirm>
                
				{/* 关注千聊微信公众号  logtodo ???? */}
				<FollowDialog 
					ref={ dom => dom && (this.followDialogDom = dom) }
                    title={ this.state.followDialogTitle }
                    desc={ this.state.followDialogDesc }
                    qrUrl={this.state.qlqrcodeUrl}
                    option={ this.state.followDialogOption }
					className="on-visible"
					data-log-region="visible-topicBFollow"
					data-log-pos="visible-210"
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
                        <div className="btn"  onClick={this.dialogHandleFocusBtn.bind(this,"Y")}>确认关注</div>
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
                        <div className="btn" onClick={this.dialogHandleFocusBtn.bind(this,"N")}> 取消关注</div>
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
                        <div className="btn" onClick={this.dialogHandleFocusBtn.bind(this,"N")}> 取消关注</div>
                    </main>
                </Confirm>

                {/* 优惠券弹框 */}
                {
                    (this.state.couponCode || this.state.codeId) && this.isCanReceiveCoupon && !(this.props.power.allowMGLive || this.props.power.allowSpeak)&&
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
                
                <div className={`reply-input-box${this.state.showReplyInput ? ' show' : ''}`} ref="reply-input-box">
                    <div className="input-wrap">
                        <input type="text" ref="reply-input" placeholder={this.state.replyPlaceholder} value={this.state.replyContent} onChange={this.changeReplyContent.bind(this)} onBlur={() => {!this.state.replyContent && this.setState({showReplyInput: false})}} onFocus={() => setTimeout(() => findDOMNode(this.refs['reply-input-box']).scrollIntoView(),300)} />
                    </div>
                    <span 
                        className={ `send-btn on-log on-visible${this.state.replyContent ? '' : ' disable'}`} 
                        data-log-region="topic-comment-send-btn"
                        data-log-pos={this.state.currentRelyIndex}
                        onClick={this.state.replyContent ? this.sendReplyHandle.bind(this) : () => {}}>发送</span>
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        sysTime: getVal(state, 'topicIntro.sysTimestamp',getVal(state, 'common.sysTime')),
        userId: getVal(state, 'topicIntro.userId'),
        topicId: getVal(state, 'topicIntro.topicInfo.id'),
        campId: getVal(state, 'topicIntro.topicInfo.campId', ''),
        liveId: getVal(state, 'topicIntro.topicInfo.liveId'),
        channelId: getVal(state, 'topicIntro.channelId'),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        liveInfo : getVal(state, 'topicIntro.liveInfo', {}),
        profile : getVal(state, 'topicIntro.profile', {}),
        evaluation: getVal(state, 'topicIntro.evaluation'),
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
        channelDisplayStatus: getVal(state, 'topicIntro.channelInfo.channel.displayStatus', 'Y'),
		isOpenEvaluation: state.evaluation.isOpen === 'Y',
        isFollow:getVal(state, 'topicIntro.isFollow',{}),
        evaluation: state.evaluation,
        evaluationData: state.evaluation.evaluationData || {},
        isLogined: getVal(state, 'topicIntro.isLogined'),
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
    getEditorSummary,
    getQrCode,
    getEvaluationList,
    getEvaluationData,
    reply,
    removeReply,
    getIsOpenEvaluate,
    getCheckUser,
    fetchCourseTag
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicIntro);
