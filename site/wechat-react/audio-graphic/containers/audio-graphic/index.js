const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { autobind, throttle} from 'core-decorators';
import Page from 'components/page';
import { isQlchat } from 'components/envi';
import appSdk from 'components/app-sdk';
import {handleAjaxResult, isFromLiveCenter} from 'components/util';

import { share } from 'components/wx-utils';
import { eventLog ,logPayTrace} from 'components/log-util';
import {
	locationTo,
	getCookie,
	formatMoney,
	setLocalStorageArrayItem,
	localStorageSPListAdd,
	getVal,
    updateTopicInChannelVisit,
    randomShareText
} from 'components/util';
import ScrollToLoad from 'components/scrollToLoad';
import { showShareSuccessModal } from 'components/dialogs-colorful/share-success'

import TopicIntro from './components/topic-intro';
import DiscussList from './components/discuss-list';
import CommentBar from './components/comment-bar';
import PageBottom from './components/page-bottom';

import AudioBanner from './components/media-box/audio';
import VideoBanner from './components/media-box/video';
import VideoTipsBar from './components/media-box/video-tips-bar';
import PayForTopic from './components/pay-for-topic';
import GotoNext from './components/goto-next';
import PushTopicDialog from 'components/dialogs-colorful/push-dialogs/topic';
// import AppDownloadBar from 'components/thousand-live-app-download-bar/app-download-bar';
import ComplainFooter from './components/complain-footer';
import CourseListDialog from './components/course-list-dialog';


import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';
import ActionSheet from 'components/action-sheet';

import { doPay, getOfficialLiveIds, isServiceWhiteLive, subscribeStatus, isFollow, uploadTaskPoint, getCommunity } from 'common_actions/common'
import {
    getQr,
	bindOfficialKey,
	getMyCoralIdentity
} from 'thousand_live_actions/common';
import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import {
    addPageUv,
    bindShareKey,
    isSubscribe,
    getJoinCampInfo,
    studyTopic
} from 'thousand_live_actions/thousand-live-common';

import {
    bannedToPost,
} from 'thousand_live_actions/thousand-live-normal';

import {
    fetchMediaUrl,
} from 'thousand_live_actions/thousand-live-av';

import {
    getTopicInfo,
    initChannelInfo,
    getChannelStatus,
    addDiscuss,
    getDiscussList,
    deleteDiscuss,
    discussLike,
    pushAchievementCardToUser,
    isLiveAdmin,
    getLastOrNextTopic,
    getIsOrNotListen,
    getRelayDelSpeakIdList,
    channelAutoShareQualify,
    dispatchGetShareCommentConfig, 
    dispatchSaveShareCommentConfig
} from '../../actions/audio-graphic';
import {
    addShareComment
} from '../../actions/common';

import {
    checkUser
} from '../../../live-studio/actions/collection';

import {
    topicTaskCardAuth
} from '../../../topic-intro/actions/topic-intro';

import {
    getEditorSummary
} from '../../actions/editor';
import ShareConfigSwitch from './components/share-config-switch';
import Confirm from 'components/dialog/confirm';


import GroupEntranceBar from 'components/group-entrance-bar';

@autobind
class AudioGraphic extends Component {

    data = {

    }

    state = {
        transitionEnter: false,
        //是否还有更多
        isNoMore: false,
        //显示直播推送弹框
        showPushTopicDialog: false,
        // 是否开始邀请卡角标动画
        doShareCardAnimation: false,
        
        // 显示评论框
        showReplyBox: false,
        toggleReplyBox: true,
        // 支付话题弹框
        showPayTopic:false,
        // 去下一个话题
        showGotoNext: false,
        // 填写过表单
        notFilled: null,
        // 成就卡浮层按钮和弹出模态窗
        showArchivementCardBtn: false,
        showArchivementCardModal: false,

	    showUncertainShareBtn: false,
	    showMyInvitationCardBtn: false,
        showShareCoralBtn: false,

	    showCoralPromoDialog: false,
	    coralPromotionPanelNav: 'tutorial',
	    coralPushData: {},

        // 页面地址
        pageUrl: '',
        // 上一课id
        lastTopicId:'',
        // 下一课id
        nextTopicId: '',
	    // 显示课程列表
	    showCourseListDialog: true,
	    mountCourseListDialog: false,
	    // 系列课课程列表
        courseList: [],

        // 是否专业版
        isLiveAdmin: '',
        // 是否官方直播间
        isOfficialLive: '',
        // 是否直播间白名单
        isWhiteLive: '',
        isPlay: false,
        // 是否关闭整个直播间
        isShareCommentLiveSwitch: false,
    }


    constructor(props) {
        super(props)
        console.log(location.href);
    }

    getEditorSummary = async () => {
        let result = await this.props.getEditorSummary(this.data.topicId, 'topic');
        if (result.state.code == 0) {
            this.setState({
                topicDesc: result.data.content
            })
        }
    }

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    async componentDidMount() {
        // 获取频道信息
        // this.initChannelInfo();
        // 初始化参数
        this.initData();
        // 获取评论列表
        await this.initCommentList();

        // 初始化下一课按钮
        // 只有系列课内的课程才需要调用次函数
        if (this.props.topicInfo.channelId) {
            this.initLastOrNextTopic();
        }

        // // 获取是否专业版
        // this.data.initLiveAdminPromise = this.initLiveAdmin()

        // 绑定分销关系
        if (this.props.location.query.lshareKey) {
            this.props.bindShareKey(this.props.topicInfo.liveId, this.props.location.query.lshareKey);
        }

        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
		}



        // 话题统计
        let pageUvType = ['liveUv'];
        if (this.props.isAuth) {
            // 报名的人提交浏览统计
            pageUvType.push('topicOnline');
        }
        this.props.addPageUv(this.data.topicId, this.props.topicInfo.liveId, pageUvType, this.props.location.query.pro_cl || getCookie('channelNo') || '',this.props.location.query.shareKey ||'' );

        // 绑定官方课代表
	    if(this.props.location.query.officialKey){
		    this.props.bindOfficialKey({
			    officialKey: this.props.location.query.officialKey
		    });
	    }

	    this.initShareBtn();
        
        this.setState({
            pageUrl: typeof location != 'undefined' && location.href
        });

        if (this.props.topicInfo.style == 'videoGraphic') {
            this.videoBox = document.querySelector('.media-box');
            window.videoBox = this.videoBox;
        }

        this.topicTaskCardAuth();
        
        this.initBrowseHistory();
        this.getIsOrNotListen();
        this.getRelayDelSpeakIdList();
        this.initOfficialLive();
        this.initLiveAdmin();
        this.initShare();


	    // 记录系列课内课程访问信息
	    if(this.props.topicInfo.channelId){
            updateTopicInChannelVisit(this.props.topicInfo)
            this.initCampInfo();
        }
        
        this.getEditorSummary();

        this.getShareCommentConfig();
        
	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
	    }, 1000);
    }

    async initOfficialLive() {
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
        } catch (error) {
            console.error(error);
        }
    }

    getIsOrNotListen = async () => {
        const result = await this.props.getIsOrNotListen({
            liveId: this.props.topicInfo.liveId,
            topicId: this.props.topicInfo.id
        });
        handleAjaxResult(result, (data) => {
            this.setState({
                isOrNotListen: data.isListen
            })
        })
    }
    
    componentWillUnmount() {
    }

    getRelayDelSpeakIdList = () => {
        this.props.getRelayDelSpeakIdList({
            topicId: this.props.location.query.topicId,
            type: 'discuss'
        })
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

	initShareBtn(){
        if((this.props.topicInfo.isAuditionOpen !== 'Y' && this.props.topicInfo.isSingleBuy === 'Y')  || !isFromLiveCenter()){
            //不是试听并且是单节付费才显示右上角分享按钮
            if(this.props.lshareKey.shareKey && (this.props.coralPercent && this.props.liveRole !== 'creater')){
	            // 如果是课代表和珊瑚计划的叠加态，就显示薛定谔的分享按钮
	            this.setState({
                    showUncertainShareBtn: true
                })
            }else if(this.props.lshareKey.shareKey){
	            this.setState({
		            showMyInvitationCardBtn: true
                })
            }else if(this.props.coralPercent && this.props.liveRole !== 'creater'){
                this.initCoralShare();
	            this.setState({
		            showShareCoralBtn: true
                })
            }else{
	            this.setState({
		            showMyInvitationCardBtn: true
                })
            }
        }
		// 如果有千聊直通车lshareKey并且不是试听，就判断是否是官方课代表
		// if(this.props.topicInfo.isAuditionOpen !== 'Y'){
		// 	if(this.props.lshareKey.shareKey){
		// 		this.setState({
		// 			showMyInvitationCardBtn: true
		// 		})
		// 	}else if(this.props.qlshareKey && this.props.topicInfo.createBy !== this.props.userId){
		// 		this.getMyCoralIdentity();
		// 	}else{
		// 		this.setState({
		// 			showMyInvitationCardBtn: true
		// 		})
		// 	}
		// }
    }

	// async getMyCoralIdentity(){
	// 	const res = await this.props.getMyCoralIdentity();
	// 	if(res.state.code === 0 && res.data.percent){
	// 		this.setState({
	// 			showShareCoralBtn: true,
	// 			coralPushData: {
	// 				businessId: this.props.topicInfo.id,
	// 				businessName: this.props.topicInfo.topic,
	// 				liveName: this.props.topicInfo.liveName,
	// 				businessImage: this.props.topicInfo.backgroundUrl,
	// 				amount: this.props.topicInfo.money,
     //                percent: this.props.coralPercent
	// 			}
	// 		});
	// 		await this.data.initLiveAdminPromise;
	// 		this.initCoralShare();
	// 	}else{
	// 		this.setState({
	// 			showMyInvitationCardBtn: true
	// 		})
	// 	}
	//
	// }
    
    async initLiveAdmin() {
        const result = await this.props.isLiveAdmin(this.props.topicInfo.liveId)
        this.setState({ isLiveAdmin: result.data.isLiveAdmin })
        // const isSubscribeInfo = await this.props.isSubscribe(this.props.topicInfo.liveId)

        // // 打卡训练营内课程不需调用此api
        // if (!this.props.topicInfo.campId) {
        //     this.checkUser();
        // }
    }


    /**
     *
     * 初始化参数
     * @memberof AudioGraphic
     */
    initData(){
        this.data = {
            ...this.data,
            topicId: this.props.location.query.topicId || '0',
            liveId: this.props.topicInfo.liveId || '0',
            currentTimeMillis: this.props.topicInfo.currentTimeMillis,
        }
        
        this.dispatchGetCommunity()

    }

    async initTopicInfo(){

        let result = await this.props.getTopicInfo(this.props.location.query.topicId);

    }
    async initChannelInfo(){
        this.props.initChannelInfo(this.props.topicInfo.channelId);
        // this.props.getChannelStatus(this.props.topicInfo.channelId);
    }




    /**
     *
     * 初始化分享
     *
     * @memberof ThousandLive
     */
    initShare(isSubscribeInfo) {
        let wxqltitle = this.props.topicInfo.topic;
        let descript = '点击链接即可参加';
        let wxqlimgurl = `https://img.qlchat.com/qlLive/liveCommon/${this.props.topicInfo.style=='audioGraphic'?'audio-graphic-topic':'video-graphic-topic'}.jpg`;
        let friendstr = wxqltitle;

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.location.pathname + '?topicId=' + this.data.topicId + "&pro_cl=link";
		let pre = `/wechat/page/live/${this.props.topicInfo.liveId}?isBackFromShare=Y&wcl=middlepage`;
        wxqlimgurl=shareBgWaterMark(wxqlimgurl,'study');
        const shareObj = randomShareText({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            shareUrl: target,
        })

        if(this.props.lshareKey&&this.props.lshareKey.shareKey){
            shareObj.title = "我推荐-" + shareObj.title;
            shareObj.timelineTitle  = "我推荐-" + `《${wxqltitle}》`;
            shareObj.shareUrl = shareObj.shareUrl + "&lshareKey=" + this.props.lshareKey.shareKey;
        }

        let onShareComplete = () => {
            console.log('share completed!')

            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })

            // 转发课程链接生成分享评论
            this.addShareComment();
        }
        const isLiveAdmin = this.state

        if (isSubscribeInfo) {
            const { isShowQl, subscribe } = isSubscribeInfo
            if ((this.state.isLiveAdmin === 'N') && (!subscribe) && isShowQl) {
                onShareComplete = this.onShareComplete
            }
        }
        
        if (this.props.location.query.psKey || this.state.isOfficialLive === "Y") {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
        }
		
        

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;
        
        console.log('分享信息: ', shareObj)
        share({
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: onShareComplete,
        });

        appSdk.shareConfig({
            content: shareObj.shareUrl,
            title: shareObj.title,
            desc: descript,
            thumbImage: wxqlimgurl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
            // success: onShareComplete, // 分享完不需要弹二维码
        });
    }

	/**
	 *
	 * 初始化珊瑚计划分享
	 *
	 * @memberof ThousandLive
	 */
	initCoralShare() {
		let wxqltitle = '我推荐-' + this.props.topicInfo.topic;
		let descript = '点击链接即可参加';
		let wxqlimgurl = `https://img.qlchat.com/qlLive/liveCommon/${this.props.topicInfo.style=='audioGraphic'?'audio-graphic-topic':'video-graphic-topic'}.jpg`;
		let friendstr = wxqltitle;
		let shareUrl = window.location.origin + this.props.location.pathname + '?topicId=' + this.data.topicId + `&officialKey=${this.props.userId}&pro_cl=link`;

		share({
			title: wxqltitle,
			timelineTitle: friendstr,
			desc: descript,
			timelineDesc: friendstr, // 分享到朋友圈单独定制
			imgUrl: wxqlimgurl,
			shareUrl: shareUrl,
		});

		appSdk.shareConfig({
			content: shareUrl,
			title: wxqltitle,
			desc: descript,
			thumbImage: wxqlimgurl,
			success: (res) => {
				console.log('分享成功！res:', res);
			}
		});
	}

    async getShareQr() {
        const result = await this.props.getQr({
            channel: '115',
            topicId: this.data.topicId,
            showQl: 'Y',
        })

        this.setState({
            shareQrcodeUrl: result.data.qrUrl ,
            shareQrAppId: result.data.appId
        })
    }

    async onShareComplete() {
        if(this.tracePage === 'coral'){
            return false;
        }
        await this.getShareQr();
        if (this.state.shareQrcodeUrl) {
            showShareSuccessModal({
                url: this.state.shareQrcodeUrl ,
                traceData: 'audioGraphicShareQrcode',
                channel: '115',
                appId: this.state.shareQrAppId
            })
        }
    }

     /**
     * 检查是否需要填表
     *
     * @memberof checkUser
     */
    async checkUser() {
        if (this.props.power.allowMGLive|| this.state.isLiveAdmin != 'Y' || this.props.isAuth) {
            return;
        }

        let config = await this.props.checkUser({ liveId: this.props.topicInfo.liveId,businessType:'channel',businessId:this.props.topicInfo.channelId });
        if (config) {
            this.setState({
                notFilled: config
            })

            if (sessionStorage.getItem("passCollect") == config.id) {
                if (sessionStorage.getItem("saveCollect") == config.id) {
                    this.payForTopic();
                    sessionStorage.removeItem("saveCollect");
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

    // 弹出推送直播弹框(改版后是跳转页面)
    pushTopic(){
        locationTo(`/wechat/page/live-push-message?channelId=${this.props.topicInfo.channelId || ''}&topicId=${this.props.topicInfo.id}&isSingleBuy=${this.props.topicInfo.isSingleBuy}`)
    }

    //关闭推送直播弹框
    hidePushTopicDialog() {
        this.setState({
            showPushTopicDialog: false,
        });
    }

    // 邀请卡跳转
    onShareCardClick(){
        locationTo(`/wechat/page/sharecard?type=topic&topicId=${this.props.topicInfo.id}&${this.props.topicInfo.liveId}`)
    }

    //推送成就卡
    async pushCompliteCard (){
        await this.props.pushAchievementCardToUser();
    }


    /**
     * 获取评论列表
     *
     * @memberof AudioGraphic
     */
    async initCommentList(){
        let getDataTime = Date.now();
        if (this.data.currentTimeMillis > getDataTime) {
            getDataTime = this.data.currentTimeMillis;
        }
        let result = await this.props.getDiscussList({businessId:this.data.topicId, size:30, page:1, position:'before', time:getDataTime + 1200000});
    }


    /**
     * 发表评论
     *
     * @param {any} text
     * @returns
     * @memberof AudioGraphic
     */
    async addTopicComment(content) {
        let result = await this.props.addDiscuss({
            content,
            parentId: this.state.replyId || 0,
            businessId: this.data.topicId,
            type: this.props.topicInfo.style || 'audioGraphic',
            playTime: this.props.topicInfo.style === 'audioGraphic' ? this.getAudioPlayerCurrentTime() : 0,
        });

        if (result && result.state && result.state.code == '0'){
            this.setState({
                showReplyBox:false,
                replyId:'',
                replyName : '',
            })

            window.toast('发送成功')

            // let discussList = findDOMNode(this.refs.discussList);

            this.discussList.scrollIntoView(true);

            // 打印发送日志
            eventLog({
                category: 'comment-audioGraphic-send',
                action: 'success',
            });

        } else {
            // 打印发送日志
            eventLog({
                category: 'comment-audioGraphic-send',
                action: 'failed',
            });
        }
        return result;
    }

    async loadNextComments(next) {
        if (this.props.discussList.length < 1) {
            next&&next();
            return false;
        }
        this.disableTransition();
        const lastIndex = this.props.discussList.length - 1;
        const timestamp = this.props.discussList[lastIndex].createTime;
        const result = await this.props.getDiscussList({businessId:this.data.topicId, size:30, page:1, position:'before',time: timestamp});
        if (result.data && result.data.discussList.length < 10) {
            this.setState({
                isNoMore: true,
            })
        }

        next&&next();
    }

    disableTransition() {
        this.setState({
            transitionEnter: false,
        });
    }


    replyDiscuss(item){
        this.setState({
            showReplyBox:item.show,
            replyId:item.id,
            replyName : item.userName,
        })

        if (item.show){
            // 兼容手机 使用第三方输入法，自动弹起键盘被挡住
            setTimeout(() => {
                // let textInput = findDOMNode(this.refs.commentBar);
                this.commentBar.scrollIntoView(true);
            }, 550);
        }

        if(item.commentItemIndex >= 0 && this.discussList[`commentItemRef-${item.commentItemIndex}`]){
	        const boundingBottomDiff = this.scrollContainerRef.getBoundingClientRect().bottom - this.discussList[`commentItemRef-${item.commentItemIndex}`].getBoundingClientRect().bottom;
	        this.scrollContainerRef.scrollTop = this.scrollContainerRef.scrollTop - boundingBottomDiff;
        }
    }

    payForTopic(){
        const {
            notFilled
        } = this.state
        // 如果没填过表且不是跳过填表状态 则需要填表 表单前置
        if (notFilled && notFilled.scene == 'buyBefore' && notFilled.isWrite == 'N' && sessionStorage.getItem("passCollect") != notFilled.id ) {
            locationTo(`/wechat/page/live-studio/service-form/${this.props.topicInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=topic-channel&channelId=${this.props.topicInfo.channelId}&topicId=${this.props.topicInfo.id}`);
            return;
        }

        // app 调起支付
        if (isQlchat()) {
            appSdk.pay({
                type: "COURSE_FEE",
            	totalFee: this.props.topicInfo.money,
            	topicId: this.props.topicInfo.id,
            	liveId: this.props.topicInfo.liveId,
            	success: () => {
                    logPayTrace({
                        id: this.props.topicInfo.id,
                        type: 'topic',
                        payType: 'COURSE_FEE',
                    });
                    // 如果没填过表且不是跳过填表状态 则需要填表 表单后置
                    if (notFilled && notFilled.scene == 'buyAfter' && notFilled.isWrite == 'N' && sessionStorage.getItem("passCollect") != notFilled.id ) {
                        locationTo(`/wechat/page/live-studio/service-form/${this.props.topicInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=topic-channel&channelId=${this.props.topicInfo.channelId}&topicId=${this.props.topicInfo.id}`);
                    } else {
                        // 延迟刷新，避免状态延迟
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 2500);   
                    }
                },
                fail: (err) => {
                    console.error('qlchat pay err:', err);
                }
            });

        // 微信及H5支付
        } else {
            this.props.doPay({
                type: 'COURSE_FEE',
                total_fee: this.props.topicInfo.money,
                topicId: this.props.topicInfo.id,
                liveId: this.props.topicInfo.liveId,
                officialKey: this.props.location.query.officialKey || '',
                callback: () => {
                    logPayTrace({
                        id: this.props.topicInfo.id,
                        type: 'topic',
                        payType: 'COURSE_FEE',
                    });

                    // 延迟刷新，避免状态延迟
                    setTimeout(() => {
                        // window.location.reload(true);
                        
                        // 如果没填过表且不是跳过填表状态 则需要填表 表单后置
                        if (notFilled && notFilled.scene == 'buyAfter' && notFilled.isWrite == 'N' && sessionStorage.getItem("passCollect") != notFilled.id ) {
                            locationTo(`/wechat/page/live-studio/service-form/${this.props.topicInfo.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=topic-channel&channelId=${this.props.topicInfo.channelId}&topicId=${this.props.topicInfo.id}`);
                        }
                    }, 2500);
                },
            });
        }
    }


    showPayTopic() {
        this.setState({
            showPayTopic: true
        })
    }
    onClosePayTopic() {
        this.setState({
            showPayTopic: false
        })
    }
    showGotoNext() {
        this.setState({
            showGotoNext: true
        })
    }
    onCloseGotoNext() {
        this.setState({
            showGotoNext: false
        })
    }

    /**
     * 触发输入框焦点
     *
     * @memberof AudioGraphic
     */
    async toggleReplyBox() {
        await this.setState({
            toggleReplyBox: false
        })
        this.setState({
            toggleReplyBox: true
        })
        // 兼容手机 使用第三方输入法，自动弹起键盘被挡住
        setTimeout(() => {
            // let textInput = findDOMNode(this.refs.commentBar);
            this.commentBar.scrollIntoView(true);
        }, 350);
    }

    get isC() {
        return !this.props.power.allowSpeak
    }

    get appStyle() {
        return 'top'
    }

    get canShowBar() {
        return this.state.isLiveAdmin == 'N' || (this.state.isLiveAdmin == 'Y' && this.props.topicInfo.isOpenAppDownload == 'Y') || false
    }

    getArchivementCardBtn(){
        this.setState({
            ...this.state,
            showArchivementCardBtn: true
        })
    }

    getArchivementCardModal(){
        this.setState({
            ...this.state,
            showArchivementCardModal: true
        });
    }

    hideArchivementCardModal(){
        this.setState({
            ...this.state,
            showArchivementCardModal: false
        })
    }

    backIndexFunc(){
        eventLog({
            category: 'backLiveIndex',
            action:'success',
            business_id: this.data.topicId,
            business_type: 'topic',
        });
        setTimeout(() => {
            const url = '/wechat/page/live/' + this.data.liveId;
            const weappUrl = '/pages/live-index/live-index?liveId=' + this.data.liveId;

            locationTo(url, weappUrl);
        },150);
    }
    
    // 获取下一节课
    async initLastOrNextTopic(){
        let result = await this.props.getLastOrNextTopic(this.props.topicInfo.id);
        this.setState({
            lastTopicId:result.data.lastTopicId,
            nextTopicId:result.data.nextTopicId,
        })
    }

	/**
	 * 珊瑚计划推广弹框
	 */
	async showCoralPromoDialog(){

		if(this.state.coralPushData.businessId){
			this.setState({
				showCoralPromoDialog: true
			});
		}else{
			this.setState({
				showCoralPromoDialog: true,
				coralPushData: {
					businessId: this.props.topicInfo.id,
					businessName: this.props.topicInfo.topic,
					liveName: this.props.topicInfo.liveName,
					businessImage: this.props.topicInfo.backgroundUrl,
					amount: this.props.topicInfo.money,
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
		if(!this.state.showShareCoralBtn){
			this.initShare();
        }
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
				strong: `${formatMoney(this.props.topicInfo.money * (this.props.lshareKey.shareEarningPercent / 100))}元`,
				action: _ => this.onShareCardClick()
			}
		];

		this.actionSheet.show(this.data.coralShareSheetList);
    }
    



    // 从开放平台过来的用户要绑定三方和关注直播间
    async topicTaskCardAuth() {
        if (this.props.isAuth) {
            return false;
        }
        let s = getVal(this.props, 'location.query.s', '');
        let t = getVal(this.props, 'location.query.t', '');
        let sign = getVal(this.props, 'location.query.sign', '');
        let shareKey = getVal(this.props, 'location.query.shareKey', '');
        let channelNo= getVal(this.props, 'location.query.pro_cl')|| getCookie('pro_cl');

        if (s == 'taskcard') {
            let result = await this.props.topicTaskCardAuth({
                s,
                t,
                sign,
                topicId: this.props.location.query.topicId,
                shareKey,
                channelNo
            });
            if (result.state && result.state.code == 0) {
                // 延迟刷新，避免状态延迟
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
            }
            // this.props.followLive(this.props.liveId, 'Y');

        }
    }
    
	showCourseListDialog(){
		if(!this.state.mountCourseListDialog){
			this.setState({
				mountCourseListDialog: true
			})
		}else{
			this.setState({
				showCourseListDialog: true
			})
		}
	}

	hideCourseListDialog(){
		this.setState({
			showCourseListDialog: false
		})
	}

	setCourseList(courseList){
		this.setState({
			courseList
		});
	}

	getAudioPlayerCurrentTime(){
		const time = getVal(this, 'audioBannerRef.wrappedInstance.audioPlayerControllerRef.audioPlayer.currentTime', 0);
		return Math.floor(time);
    }
    // 播放状态
    playStatus(isPlay){
        this.setState({
            isPlay: !isPlay
        })
    }

    // 获取用户加入训练营信息
	async initCampInfo(){
		const { data = {} } = await getJoinCampInfo({
            channelId: this.props.topicInfo.channelId,
        })

        // 新训练营 增加学习打卡记录
        if (data.isNewCamp === 'Y') {
            studyTopic({
                channelId: this.props.topicInfo.channelId,
                topicId: this.data.topicId
            })
        }
    }
    
    async addShareComment() {
        const res = await this.getShareCommentConfig();
        if(res && res.flag !== 'Y') return ;
        this.props.addShareComment({
            userId: this.props.userId,
            liveId: this.props.topicInfo.liveId,
            topicId: this.props.topicInfo.id
        });
    }

    async getShareCommentConfig() {
        const res = await this.props.dispatchGetShareCommentConfig({
            liveId: this.props.topicInfo.liveId,
            topicId: this.props.topicInfo.id
        });
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
        this.setState({isShareCommentLiveSwitch: false});
        if(e === 'confirm') {
            await this.saveShareCommentConfig();
            this.getShareCommentConfig();
            this.refs.shareCommentSwitchRef.hide();
        }
    }


    // 获取课程对应的社群信息
    async dispatchGetCommunity() {
        try {
            const res = await getCommunity(this.data.liveId, 'topic', this.props.topicInfo.id)
            if(res) {
                res.communityCode && this.setState({
                    communityInfo: res
                }, () => {
                    this.getGroupShow();
                });
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
                if(!communityRecord){
                    this.setState({
                        showGroupEntrance: true
                    })
                } 
            } catch (error) {
                console.log(error);
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
        const { topicInfo, sysTime } = this.props
        return (
            <Page title={this.props.topicInfo.topic || '音频图文话题'} className="audio-grapic flex-body">
                {/* <AppDownloadBar
                    isC={ !this.props.power.allowMGLive }
                    liveId={ this.props.topicInfo.liveId }
                    topicId={this.data.topicId}
                    isLiveAdmin={ this.state.isLiveAdmin }
                    isOfficialLive={ this.state.isOfficialLive }
                    isWhiteLive={ this.state.isWhiteLive }
                    style={'top'}
                /> */}
                <div className="flex-other">
                    {
                    topicInfo.style === 'videoGraphic' &&
                    <VideoBanner
                        // ref='videoBanner'
                        onShareCardClick={this.onShareCardClick}
                        showPayTopic={this.showPayTopic}
                        showPushTopicDialog={this.showPushTopicDialog}
                        showMyInvitationCardBtn={this.state.showMyInvitationCardBtn}
                        showUncertainShareBtn={this.state.showUncertainShareBtn}
                        uncertainShareBtnClickHandle={this.uncertainShareBtnClickHandle}
                        doShareCardAnimation={this.state.doShareCardAnimation}
                        showShareCoralBtn={this.state.showShareCoralBtn}
                        showCoralPromoDialog={this.showCoralPromoDialog}
                        coralPercent={this.props.coralPercent}
                        shareEarningPercent={this.props.lshareKey.shareEarningPercent}
                    />
                    }
                </div>
                <div className="flex-main-h">
                    <ScrollToLoad
                        className={"comment-scroll-box"}
                        // ref="srcollBox"
                        ref={r => this.scrollContainerRef = r}
                        toBottomHeight={300}
                        notShowLoaded = {true}
                        loadNext={ this.loadNextComments }
                        noMore={this.state.isNoMore}
                        footer={(<ComplainFooter  topicId={this.data.topicId} pageUrl={this.state.pageUrl} isLiveAdmin={this.state.isLiveAdmin}/>)}
                    >

                        {
                            topicInfo.style === 'videoGraphic' &&
                            <VideoTipsBar
                                onShareCardClick={this.onShareCardClick}
                                // showPushTopicDialog={this.showPushTopicDialog}
                                pushTopic={this.pushTopic}
                                showMyInvitationCardBtn={this.state.showMyInvitationCardBtn}
                            />
                        }

                        {
                            topicInfo.style === 'audioGraphic' &&
                            <AudioBanner
                                showPayTopic = {this.showPayTopic}
                                showGotoNext = {this.showGotoNext}
                                pushCompliteFun={this.pushCompliteCard}
                                getArchivementCardBtn={this.getArchivementCardBtn}
                                getArchivementCardModal={this.getArchivementCardModal}
                                pushTopic={this.pushTopic}
                                onShareCardClick={this.onShareCardClick}
                                showCoralPromoDialog={this.showCoralPromoDialog}
                                location={this.props.location}
                                showUncertainShareBtn={this.state.showUncertainShareBtn}
                                uncertainShareBtnClickHandle={this.uncertainShareBtnClickHandle}
                                showMyInvitationCardBtn={this.state.showMyInvitationCardBtn}
                                doShareCardAnimation={this.state.doShareCardAnimation}
                                showShareCoralBtn={this.state.showShareCoralBtn}
                                coralPercent={this.props.coralPercent}
                                lastTopicId = {this.state.lastTopicId}
                                nextTopicId = {this.state.nextTopicId}
                                showCourseListDialog={this.showCourseListDialog}
                                courseList={this.state.courseList}
                                ref={c => (this.audioBannerRef = c)}
                                shareEarningPercent={this.props.lshareKey.shareEarningPercent}
                                playStatus={ this.playStatus }
                            />
                        }

                    

                        {/* 话题介绍模块 */}
                        <TopicIntro
                            topicInfo = {this.props.topicInfo}
                            channelInfo = {this.props.channelInfo}
                            profileList = {this.props.profileList}
                            power = {this.props.power}
                            vipInfo = {this.props.vipInfo}
                            chargeStatus = {this.props.chargeStatus}
                            topicDesc={this.state.topicDesc}
                        />


                        
                        <GroupEntranceBar 
                            communityInfo={this.state.communityInfo}
                            businessId={this.data.topicId}
                            liveId={this.data.liveId}
                            onClose={this.onGroupEntranceClose}
                            hasBeenClosed={!this.state.showGroupEntrance}
                            padding=".4rem .4rem .133333rem"
                        />
                        

                        <ReactCSSTransitionGroup
                            transitionName="thousand-live-animation-commentListItem"
                            transitionEnterTimeout={350}
                            transitionLeaveTimeout={350}
                            transitionEnter={this.state.transitionEnter}
                        >
                            <DiscussList
                                ref={ dom => this.discussList = dom }
                                discussList = {this.props.discussList}
                                delSpeakIdList={this.props.delSpeakIdList}
                                currentTimeMillis = {this.props.currentTimeMillis}
                                deleteDiscuss={this.props.deleteDiscuss}
                                replyDiscuss={this.replyDiscuss}
                                bannedToPost={this.props.bannedToPost}
                                userId={this.props.userId }
                                power={this.props.power}
                                topicId = {this.props.location.query.topicId}
                                liveId = {this.props.topicInfo.liveId}
                                discussLike={this.props.discussLike}
                                liveRole={this.props.liveRole}
                                isAuth = {this.props.isAuth}
                                showPayTopic = {this.showPayTopic}
                                toggleReplyBox = {this.toggleReplyBox}
                                shareConfigSwitchElement={
                                    this.props.power.allowMGLive &&
                                    <ShareConfigSwitch
                                        flag={this.props.shareCommentConfigFlag}
                                        onSwitch={this.onShareCommentSwitch}
                                    ></ShareConfigSwitch>
                                }
                            />
                        </ReactCSSTransitionGroup>

                        
                    </ScrollToLoad>

                    {/* 课程数据邀请卡需求调整 */}
                    {/* <div className="float-back-index-btn on-log" data-log-region="float-back-index-btn"   onClick={this.backIndexFunc.bind(this)}>
                        <span className="icon"></span>
                        <span>回直播间</span>
                    </div> */}
                    <div className="float-btn-back-home on-log" data-log-region="float-back-index-btn"   onClick={this.backIndexFunc.bind(this)}></div>
                </div>

                <div className="flex-other">
                    {
                        (this.state.showReplyBox || (this.props.isAuth && !this.props.power.allowMGLive))?
                        (this.state.toggleReplyBox?<CommentBar
                            ref={ dom => this.commentBar = dom }
                            // ref='commentBar'
                            addTopicComment = {this.addTopicComment}
                            replyName={this.state.replyName}
                            />
                        :null )
                        :
                        <PageBottom
                            power = {this.props.power}
                            isAuth = {this.props.isAuth}
                            channelInfo = {this.props.channelInfo}
                            channelStatus = {this.props.channelStatus}
                            topicInfo = {this.props.topicInfo}
                            payForTopic = {this.payForTopic}
                            shareKey = {this.props.location.query.shareKey||''}
                            isOrNotListen={this.state.isOrNotListen}
                            isClientBListen={this.props.isClientBListen}
                            isRelay={this.props.topicInfo.isRelay}
                            isRelayChannel={this.props.topicInfo.isRelayChannel}
                        />
                    }

                </div>

                {/*{*/}
                    {/*this.state.showArchivementCardModal ?*/}
                    {/*<ArchivementCardModal */}
                        {/*hideModal={this.hideArchivementCardModal.bind(this)} */}
                        {/*archivementCardUrl={`/wechat/page/studentComplitedTopic?topicId=${this.data.topicId}&liveId=${this.data.liveId}`} />*/}
                    {/*: null*/}
                {/*}*/}

                {/*{*/}
                    {/*this.state.showArchivementCardBtn ?*/}
                    {/*<ArchivementCardBtn*/}
                        {/*archivementCardUrl={`/wechat/page/studentComplitedTopic?topicId=${this.data.topicId}&liveId=${this.data.liveId}`} />*/}
                    {/*: null*/}

                {/*}*/}


                {/*有管理权限才请求*/}
                {
                    this.props.power.allowMGLive ?
                    <PushTopicDialog
                        topicId={this.props.topicInfo.id}
                        liveId={this.props.topicInfo.liveId}
                        isShow={this.state.showPushTopicDialog}
                        hide={this.hidePushTopicDialog}
                    />
                    : null
                }

                <PayForTopic
                    onClose = {this.onClosePayTopic}
                    show = {this.state.showPayTopic}
                    topicId = {this.props.topicInfo.id}
                    payForTopic = {this.payForTopic}
                    topicInfo = {this.props.topicInfo}
                    channelInfo = {this.props.channelInfo}
                    shareKey = {this.props.location.query.shareKey||''}
                />

                <GotoNext
                    onClose = {this.onCloseGotoNext}
                    show = {this.state.showGotoNext}
                    topicId={this.props.topicInfo.id}
                    nextTopicId = {this.state.nextTopicId}
                    shareKey = {this.props.location.query.shareKey||''}
                />

	            {/*{*/}
		            {/*this.state.coralPushVersible && this.props.qlshareKey &&*/}
                    {/*<CoralPushBox*/}
                        {/*datas={this.state.coralPushData}*/}
                        {/*officialKey={this.props.userId}*/}
                        {/*shareKey={this.props.qlshareKey}*/}
                        {/*onClose={this.onCloseCoralPushBox.bind(this)}/>*/}
	            {/*}*/}
	            {
		            this.props.isPersonCourse &&
                    <CoralPromoDialog
                        show={this.state.showCoralPromoDialog}
                        close={this.onCoralPromoDialogClose}
                        nav={this.state.coralPromotionPanelNav}
                        switchNav={this.switchCoralPromotionPanelNav}
                        courseData={this.state.coralPushData}
                        officialKey={this.props.userId}
                    />
	            }

                <ActionSheet
                    ref={c => {this.actionSheet = c;}}
                />

	            {
		            this.state.mountCourseListDialog &&
                    <CourseListDialog
                        topicInfo = {this.props.topicInfo}
                        showCourseListDialog = {this.state.showCourseListDialog}
                        hideCourseListDialog = {this.hideCourseListDialog}
                        onCloseSettings = {this.hideControlDialog}
                        setCourseList={this.setCourseList}
                        isPlay={ this.state.isPlay }
                        isBussiness={this.props.power.allowSpeak || this.props.power.allowMGLive}
                    />
	            }
                {/* {
	                this.props.topicInfo.isAuditionOpen === 'Y' && !this.props.power.allowMGLive && this.props.topicInfo.channelId &&
                    <div className="audition-tip">
                        <span>免费试听中，购买系列课收听全部课程。</span>
                        <div className="buy-btn" onClick={ () => locationTo(
			                `/live/channel/channelPage/${this.props.channelInfo.channel.channelId}.htm?autopay=Y&shareKey=${this.props.location.query.shareKey || ''}`,
			                `/pages/channel-index/channel-index?channelId=${this.props.channelInfo.channel.channelId}&shareKey=${this.props.location.query.shareKey || ''}`
		                ) }>立即购买</div>
                    </div>
                } */}


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



function mapStateToProps (state) {
    return {
        sysTime: state.common.sysTime,
        sid: state.thousandLive.sid,
        topicInfo: state.thousandLive.topicInfo,
        profileList: state.thousandLive.profile,
        channelInfo: state.thousandLive.channelInfo,
        channelStatus: state.thousandLive.channelStatus,
        discussList: state.thousandLive.discussList,
        delSpeakIdList: state.thousandLive.delSpeakIdList,
        power: state.thousandLive.power,
        isAuth: state.thousandLive.isAuth,
        userId: state.thousandLive.userId || null,
        isLogin: state.thousandLive.isLogin,
        currentTimeMillis: state.thousandLive.currentTimeMillis,
        lshareKey: state.thousandLive.lshareKey || {},
	    isPersonCourse: state.thousandLive.isPersonCourse,
        coralPercent: state.thousandLive.coralPercent,
        vipInfo: state.thousandLive.vipInfo,
        chargeStatus: state.thousandLive.chargeStatus,
        pushCompliteInfo: state.thousandLive.pushCompliteInfo,
        isSubscribeInfo: state.thousandLive.isSubscribe,
        liveRole: state.thousandLive.liveRole,
        isClientBListen: state.thousandLive.clientBListen,
        shareCommentConfigFlag: state.thousandLive.shareCommentConfigFlag
    }
}

const mapActionToProps = {
    getTopicInfo,
    initChannelInfo,
    getChannelStatus,
    bannedToPost,
    doPay,
    fetchMediaUrl,
    addPageUv,
    addDiscuss,
    getDiscussList,
    deleteDiscuss,
    discussLike,
    bindShareKey,
    pushAchievementCardToUser,
    isLiveAdmin,
    getQr,
    isSubscribe,
    checkUser,
	bindOfficialKey,
    getMyCoralIdentity,
    getLastOrNextTopic,
    getIsOrNotListen,
    getRelayDelSpeakIdList,
    topicTaskCardAuth,
    getOfficialLiveIds,
    isServiceWhiteLive,
    subscribeStatus,
    isFollow,
    channelAutoShareQualify,
    getEditorSummary,
    addShareComment,
    dispatchGetShareCommentConfig,
    dispatchSaveShareCommentConfig
};

module.exports = connect(mapStateToProps, mapActionToProps)(AudioGraphic);
