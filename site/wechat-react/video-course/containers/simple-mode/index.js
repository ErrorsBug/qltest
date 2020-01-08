import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Detect from 'components/detect';
import { get } from 'lodash';
import Page from 'components/page';
import {
	locationTo,
	getCookie,
	delCookie,
	formatMoney,
	getVal,
	digitFormat,
	sleep,
	isFromLiveCenter,
	updateTopicInChannelVisit,
	randomShareText,
	setCookie
} from 'components/util';

import {
	getUrlParams,
	query2string,
} from 'components/url-utils';

import { share } from 'components/wx-utils';

import VideoPlayer from './components/video-player';
import { ScholarshipDialog } from 'components/scholarship-menu';
import SpeakContainer from './components/speak-container';
import CourseList from './components/course-list';
import CourseListDialog from './components/course-list-dialog';
import SimpleControlDialog from 'components/simple-control-dialog';
import IntroDialog from '../../../thousand-live/containers/topic-listening/components/intro-dialog';
import InviteFriendsToListen from 'components/invite-friends-to-listen';
import ReceiveListOfInviteFriendsToListen from '../../../thousand-live/containers/topic-listening/components/invite-friend-receive-list';
import CommentDialog from 'components/graphic-course-comment-dialog';
import IsBuyDialog from 'components/dialog/is-buy-dialog';
import AppDownloadConfirm from 'components/app-download-confirm';
import CollectVisible from 'components/collect-visible';
import GuestYouLike from 'components/guest-you-like';
import BackTuitionDialog from 'components/back-tuition-dialog';
import JobReminder from 'components/job-reminder';
import { apiService } from "components/api-service";
import AppDownloadBar from 'components/app-download-bar';
import openApp from 'components/open-app';
import IncrFansFocusGuideDialog from './components/incr-fans-focus-guide-dialog';


import {
	fetchAndUpdateSysTime,
	dispatchFetchRelationInfo,
	getUserInfo
} from '../../../actions/common';
import {
	initSimpleModeData,
	fetchCourseList,
	graphicCommentCount,
	getEditorSummary,
	getJoinCampInfo,
	studyTopic,
} from '../../actions/video';
import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import {
    getTopicProfile,
	getChannelProfile,
	addPageUv,
	getReceiveTopicList,
	userBindKaiFang
} from 'thousand_live_actions/thousand-live-common';
import { getPacketDetail, updatePacketPopStatus } from 'common_actions/coupon';
import {
	bindLiveShare,
} from 'thousand_live_actions/thousand-live-normal';

import {
	getQlLiveIds,
    isServiceWhiteLive,
	checkShareStatus,
	fetchShareRecord,
	getReceiveInfo,
	isAuthChannel,
	uploadTaskPoint,
	request,
 } from 'common_actions/common';
 import { getPersonCourseInfo } from "common_actions/coral";
 

import  {getChannelInfo, fetchQrImageConfig, addShareComment, dispatchGetShareCommentConfig} from '../../actions/common'

import TryListenStatusBar from 'components/try-listen-status-bar';
import TryListenShareMask from 'components/try-listen-share-mask';

import {
    setUniversityCurrentCourse,
} from 'thousand_live_actions/live';

import GroupEntranceBar from 'components/group-entrance-bar';
import { getCommunity } from 'common_actions/common';
import DialogMoreUserInfo from 'components/dialogs-colorful/more-user-info/index';

function mapStateToProps (state) {
	return {
		sysTime: state.common.sysTime,
		topicInfo: state.video.topicInfo,
		lshareKey: state.video.lshareKey,
		topicProfile: state.thousandLive.topicProfile,
		channelProfile: state.thousandLive.channelProfile,
		isLiveAdmin: state.video && state.video.isLiveAdmin,
		power: getVal(state, 'video.power', {}),
		userId: state.common.userInfo.user.userId,
		userInfo: state.common.userInfo.user,
		isSubscribe: state.common.isSubscribe,
		liveInfo: state.video && state.video.liveInfo
	}
}

const mapActionToProps = {
	fetchAndUpdateSysTime,
	initSimpleModeData,
	fetchCourseList,
	getTopicProfile,
	getUserInfo,
	getChannelProfile,
	addPageUv,
	graphicCommentCount,
	getQlLiveIds,
	isServiceWhiteLive,
	getEditorSummary,
	userBindKaiFang,
	getChannelInfo,
	fetchQrImageConfig,
	addShareComment,
	dispatchGetShareCommentConfig
};

@autobind
class AudioGraphic extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

    data = {
		topicId: this.props.location.query.topicId,

		officialLiveIds: [
            "100000081018489",
            "350000015224402",
            "310000089253623",
            "320000087047591",
            "320000078131430",
            "290000205389044"
		],
		missionDetail: {}, // 拉人返学费数据
    };

    state = {
	    courseList: [],
		isReactiveMode: this.props.topicInfo.style === 'videoGraphic'? false : true, //视频互动 进入页面默认互动模式，视频录播按原逻辑
	    showCourseListDialog: false,
	    liveStatus: '',
		currentIndex:1,

	    reactiveAudioPlaying: false,
	    videoPlaying: false,


	    mountCommentDialog: false,
	    showCommentDialog: false,

	    // 视频图文总评论数
		graphicCommentCount: 0,
		
		isShowAppDownloadConfirm: false,

	    // 没有课程简介数据
		noProfileData: false,
		
		// 分享按钮状态
		shareBtnStatus: '',
		// 邀请剩余名额
		shareRemaining: 0,
		
		/**请好友免费听相关 */
        inviteFreeShareId: '', // 请好友免费听分享id
        remaining: 0, //剩余赠送名额
        userList: [], //领取用户列表
        canListenByShare: false, //此话题是否通过请好友免费听获取
        rank: 0, // 请好友免费听领取排名
		/************/
		
		coralInfo: {},
		showBackTuition: false, //是否展示拉人返学费按钮
		node: null,
		joinCampInfo:{},
		inviteFreeMissionId: '', // 邀请好友听的 拉人返学费
		isPlay: false,

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
        // 一元解锁解锁程度
        userUnlockProcess: {},
        // 系列课营销方式
		channelCharge: {},
		showShareCard: false,
		showInviteFirendListen: false,
		showIncrFansFocusGuideDialog: false,
		showGroupEntrance: false, // 显示社群入口
		operationAreaOffset: {},	// operation-area距离顶部基准的偏移量

		// 是否显示留资弹窗
		isDialogMoreInfoVisible: false,
	};

	get isUnHome(){
        const isUnHome = getUrlParams("isUnHome", '')
        return Object.is(isUnHome, 'Y')
    }
	
	get isEven(){ // true: B类型； false: A类型
		if(typeof document != 'undefined'){
			const userId = getCookie("userId");
			const lastNum = userId.split("")[userId.length -1];
			let flag = lastNum % 2 == 0
			return flag;
		}
		return false;
    }

	async componentWillReceiveProps(nextProps){
		if(this.data.topicId !== nextProps.location.query.topicId){
			// 无刷新跳到另一节课
			this.data.topicId = nextProps.location.query.topicId;

			// 清理旧数据
			this.setState({topicDesc: undefined});

			await this.props.initSimpleModeData({
				topicId: this.data.topicId
			});

			this.initPage();
			this.getProfile();
			if (!!this.props.topicInfo.channelId) {
				this.initCampInfo();
			}
			// 无刷新需要手动打PV
			if(typeof _qla !== 'undefined'){
				_qla('pv', {});
			}

			setUniversityCurrentCourse({
				businessId: this.props.topicInfo.isBook ==='Y'? this.data.topicId : (!!this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.data.topicId),
				businessType: this.props.topicInfo.isBook ==='Y'? 'topic' : (!!this.props.topicInfo.channelId? 'channel':'topic'),
				currentId: this.data.topicId,
			});

		}

		// 设置operation-area距离顶部基准块的偏移量
		const topicListNode = document.querySelector('.topic-list-container');	// top-list-container node
		const topContainerHeight = document.querySelector('.top-container').clientHeight;	// top-container高度
		
		this.setState({
			operationAreaOffset: {
				top: (topicListNode ? topContainerHeight + topicListNode.clientHeight : topContainerHeight),
			}
		});
	}

	async componentDidUpdate(prevProps, prevState){
		// 倒计时结束切换状态是重新初始化课程列表
		if(prevState.liveStatus === 'plan' && this.state.liveStatus === 'beginning'){
			await this.props.fetchAndUpdateSysTime();
			this.initCourseList();
		}
	}
	
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

	// 是否为训练营
	get isCamp(){
		const { power } = this.props;
		const { joinCampInfo = {} } = this.state;
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

	async componentDidMount() {
		// 删除旧cookie记录
        try {
            delCookie('lastVisit')
        } catch (error) {
            
		}
		
		if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
		}

        // document.oncontextmenu = new Function("return false;")
    	this.initPage();
		this.getProfile();
		if(this.contentContainer.clientHeight !== this.contentWrapper.clientHeight){
			this.contentContainer.style.height = this.contentWrapper.clientHeight + 'px';
			this.contentReactiveModeContainer.style.height = this.contentWrapper.clientHeight + 'px';
		}

		if(this.props.location.query.kfAppId && this.props.location.query.kfOpenId) {
			this.props.userBindKaiFang(this.props.location.query.kfAppId, this.props.location.query.kfOpenId)
		}

		this.hasLive();
		this.isAuthChannel();

		this.isAuthChannel();

		// 记录系列课内课程访问信息
		if(this.props.topicInfo.channelId){
			updateTopicInChannelVisit(this.props.topicInfo);
		}

		// 判断是否官方直播间
		this.initIsOfficial();

		await sleep(500);
		
		// 绑定直播间分销关系
		this.bindLiveShare();

		// 初始化珊瑚课程信息
		this.initCoralInfo();

		// 初始化拉人返学费
		this.initInviteReturnInfo();
		
		this.ajaxGetInviteDetail();
		this.ajaxCanInviteAudition();
		try {
			const qrimgResult = await this.props.fetchQrImageConfig({topicId: this.props.topicInfo.id});

			if(qrimgResult.state.code === 0) {
				this.setState({
					incrFansFocusGuideConfigs: qrimgResult.data.info
				}, () => {
					console.log('TOPIC INFO',this.state.incrFansFocusGuideConfigs);
				});
			}
			
		} catch (error) {
			
		}

		this.dispatchGetCommunity();

		this.ajaxSaveInvite();
		setTimeout(_=>{
			// 详情页显示平台通用券弹窗
			this.getPacketDetail()
		},3000)
  
		// 绑定滚动区捕捉曝光日志
	    setTimeout(() => {
			typeof _qla != 'undefined' && _qla.bindVisibleScroll('flex-main-s');
			
			}, 1000);
			
			this.setState({
				node: document.querySelector(".flex-main-s")
			})
			if(!!this.props.topicInfo.channelId){
				this.initCampInfo();
				let result = this.props.getChannelInfo({channelId: this.props.topicInfo.channelId}).then(res => {
					this.setState({
						channelCharge: getVal(res, 'data.chargeConfigs',[])[0] || {},
					});
				})
			}
        
        		
		setUniversityCurrentCourse({
			businessId: this.props.topicInfo.isBook ==='Y'? this.data.topicId : (!!this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.data.topicId),
            businessType: this.props.topicInfo.isBook ==='Y'? 'topic' : (!!this.props.topicInfo.channelId? 'channel':'topic'),
			currentId: this.data.topicId,
		});
        
    }

	
    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }


    async initPage(){
		this.initCourseList();
		
		await this.props.getUserInfo();

		this.initDialogMoreUserInfo();

		if (this.props.topicInfo.style === 'videoGraphic') {
			if(isFromLiveCenter()){//视频录播保持原来逻辑
				this.setState({
					isReactiveMode:false,
				})
			}
	    	this.initGraphicCommentCount();
	    }

		this.initShare();
		
		// 初始化请好友免费听领取状态
        this.initReceiveStatus();
        // 初始化底部分享按钮状态
		this.initShareBtnStatus();

		// 话题统计
		this.addPageUv();

		if(window.localStorage.getItem('_ROUTERPUSH') == 'Y' && window.localStorage.getItem('_RELOAD') == 'Y'){
			this.openInviteFriendsToListenDialog(true)
			window.localStorage.removeItem('_ROUTERPUSH')
			window.localStorage.removeItem('_RELOAD')
		}
		
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


	/*** 是否显示留资弹窗 ***/
	initDialogMoreUserInfo = () => {
        const { userInfo, location: { query: { wcl, showDialogMoreInfo } }, power: { allowMGLive } } = this.props;
        // 首要条件：C端用户资料手机为空，且未主动关闭弹窗
        // 次要条件：该页面由微信推送链接进入（携带wcl标识）或其为第二节课上课页
        const isDialogMoreInfoVisible = !allowMGLive && !userInfo.mobile && getCookie('showDialogMoreInfo') !== 'N' && (showDialogMoreInfo === 'Y' || wcl === 'push_course_start' || wcl === 'custom_course_start_2');

        this.setState({
            isDialogMoreInfoVisible,
        });
    }

	/**
	 *
	 * 话题统计
	 * @memberof ThousandLive
	 */
	async addPageUv(){
		await sleep(3500);
		this.props.addPageUv(this.data.topicId, this.props.topicInfo.liveId, ['topicOnline', 'liveUv'], this.props.location.query.pro_cl || getCookie('channelNo') || '', this.props.location.query.shareKey ||'');
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
	

	async initCourseList(){
		if(!this.props.topicInfo.channelId) {
			this.setState({
				courseList: [this.props.topicInfo],
				currentIndex: 1,
			});
			return false;
		}
		const res = await this.props.fetchCourseList({
			channelId: this.props.topicInfo.channelId,
			liveId: this.props.topicInfo.liveId,
			pageSize:99999,
		});
        let userUnlockProcess = res.data.userUnlockProcess || {}
        let currentIndex = res.data.topicList.findIndex(item => {
			return item.id === this.props.location.query.topicId;
		});
		let courseList = res.data.topicList
		// 请好友免费听相关
		const result = await getReceiveTopicList(this.props.topicInfo.channelId)
		let receiveList = result.data && result.data.list || []
		if(receiveList && receiveList.length > 0){
			courseList = courseList.map(item => {
				if(receiveList.find(i => i == item.id)){
					return {
						share: true,
						...item
					}
				}else {
					return {
						share: false,
						...item,
					}
				}
			})
		}
		if(res.state.code === 0) {
			this.setState({
				courseList: courseList,
				currentIndex: currentIndex + 1,
                userUnlockProcess
			})
		}
	}

	// 绑定直播间分销关系
    async bindLiveShare(){
        if(this.props.location.query.lshareKey){
            await bindLiveShare(this.props.topicInfo.liveId, this.props.location.query.lshareKey)
        }
    }


	updateLiveStatus(liveStatus){
		console.log("liveStatus:" + liveStatus);
		this.setState({
			liveStatus,
		})
		if(this.props.topicInfo.style === 'videoGraphic') {
			this.setState({
				isReactiveMode: liveStatus === 'beginning'
			});
		}
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
		if(this.state.isAuthChannel === 'Y') return '';
        return this.props.topicInfo.isAuditionOpen == 'Y' ? '&inviteAuditionUserId=' + getCookie('userId') : ''
	}
	// 判断是否为免费试听课
	get isAudition(){
		return this.state.isAuthChannel === 'N' &&  this.props.topicInfo.isAuditionOpen === "Y"
	}

	async initShare() {
		// 拉人免学费重置分享
		if(this.state.showBackTuition){
			this.backTuitionDialogEle.initShare({
                data: this.props.topicInfo,
                missionId: this.data.missionDetail.missionId,
                type: this.props.topicInfo.channelId ? 'channel' : 'topic',
            })
			return
		}
		let wxqltitle = this.props.topicInfo.topic;
		let descript = this.props.topicInfo.liveName;
		let wxqlimgurl = "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
		let friendstr = wxqltitle;

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
			timelineTitle: friendstr,
			desc: descript,
            shareUrl: target,
		})
		

		if(this.props.lshareKey && this.props.lshareKey.shareKey && this.props.lshareKey.status == 'Y' ){
			shareObj.title = "我推荐-" + shareObj.title;
			shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
			shareObj.shareUrl = shareObj.shareUrl + "&lshareKey=" + this.props.lshareKey.shareKey;
		} else if (this.props.topicInfo.isAuditionOpen === 'Y') {
			// 免费试听的文案
            shareObj.title = this.props.topicInfo.topic;
			shareObj.desc = `${this.props.userInfo.name}送你一堂试听课`;
            shareObj.timelineTitle = shareObj.title;
			wxqlimgurl=shareBgWaterMark(this.props.topicInfo.channelImg,'study');
		}

        if (this.props.location.query.psKey || this.state.isOfficialLive) {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
        }

		const { isSubscribeInfo, isLiveAdmin } = this.props
		let onShareComplete = () => {
			if (this.props.topicInfo.isAuditionOpen == 'Y') {
                window._qla && window._qla('event', {
                    category: 'auditionShare',
                    action: 'success',
                });
            }
			console.log('share completed!')
			
            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
			})
			
			// 分享完成添加分享评论
            this.dispatchAddShareComment();
            // this.refs.commentList.loadNextComments();
		}
		
        

		// 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
		shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;
		
        console.log('分享信息: ', shareObj,wxqlimgurl)
		let shareOptions = {
            ...shareObj,
			imgUrl: wxqlimgurl,
			successFn: onShareComplete,
		}
		share(shareOptions);
	}


	jumpToCourse({ style, id, startTime,status,isSingleBuy,isAuditionOpen, share }, isLock = false) {
	    // 解锁课不允许跳下一节课
	    if(isLock) {
	        return
        }
		// 请好友免费听，既不是领来的，且未开启试听，都直接返回
		if(this.state.canListenByShare && isAuditionOpen !== 'Y' && !share){
			return
		}

		// 获取即将跳转课程的index，据此来判断是非给跳转链接添加显示留资弹窗的参数
		// const jumpItemIndex = this.state.courseList.map(d => d.id).indexOf(id);

		// 点击同一个话题不跳转
		if (this.props.topicInfo.id != id) {
			const urlList = getUrlParams();
			delete urlList['showDialogMoreInfo'];
			const data = {
				...urlList,
				topicId: id,
			}
			const queryResult = query2string(data);
			if (/^(graphic)$/.test(style)) {
				// 小图文类型
				locationTo(`/wechat/page/detail-little-graphic?${queryResult}`);
				return true;
			}else if (/^audio/.test(style)) {
				locationTo(`/topic/details-listening?${queryResult}`);
				return true;
			}else if(/^(videoLive)$/.test(style)){
				locationTo(`/topic/details-live?${queryResult}`);
				return true;
			}else if (/^video/.test(style)) {
				window.localStorage.setItem('_ROUTERPUSH', 'Y')
				this.props.router.push(`/wechat/page/topic-simple-video?topicId=${id}&byhand=1`);
				return true;
			}  else if(/^(normal|ppt)$/.test(style)){
				locationTo(`/topic/details?${queryResult}`);
				return true;
			}  else {
				return false;
			}
		}
	}


	changeMode(){
    	this.setState({
				isReactiveMode: !this.state.isReactiveMode,
	    }, () => {
				const node = document.querySelector(".flex-main-s");
				const reNode = document.getElementById("main-scroll-area");
				this.setState({
					node:this.state.isReactiveMode ? reNode : node
				})
			})
			setTimeout(function(){
					typeof _qla != 'undefined' && _qla.collectVisible();
			}, 0);
	}

	showCourseListDialog(){
		this.setState({
			showCourseListDialog: true
		})
	}

	hideCourseListDialog(){
		this.setState({
			showCourseListDialog: false
		})
	}

	shareBtnClickHandle(){
		locationTo(`/wechat/page/sharecard?type=topic&topicId=${this.props.location.query.topicId}&lshareKey=${this.props.lshareKey.shareKey || ''}&liveId=${this.props.topicInfo.liveId}`)
	}

	async showTopicIntro() {
		this.domIntroDialog.show();
	}

	updateReactiveAudioPlayingStatus(status){
		this.setState({
			reactiveAudioPlaying: status
		})
	}

	updateVideoPlayingStatus(status){
		this.setState({
			videoPlaying: status
		})
	}



	async getProfile() {
        try {

	        const [topicProfileRes, topicDescRes] = await Promise.all([
		        this.props.getTopicProfile({ topicId: this.props.topicInfo.id }),
		        this.props.getEditorSummary(this.data.topicId, 'topic'),
	        ]);

			const topicDesc = getVal(topicDescRes, 'data.content', '');
			if(topicDesc){
				this.setState({
					topicDesc
				})
			}
	        if(!getVal(topicProfileRes, 'data.TopicProfileList', []).length && !this.props.topicInfo.remark && !topicDesc){

		        if (this.props.topicInfo.channelId) {
			        const [channelProfileRes, channelDescRes] = await Promise.all([
				        this.props.getChannelProfile({ channelId: this.props.topicInfo.channelId }),
				        this.props.getEditorSummary(this.props.topicInfo.channelId, 'channel'),
			        ]);
			        const channelDesc = getVal(channelDescRes, 'data.content', '');
			        this.setState({
				        channelDesc
			        });
			        if(!getVal(channelProfileRes, 'data.descriptions.desc', []).length && !channelDesc){
				        this.setState({
					        noProfileData: true,
				        })
			        }
		        }else{
			        this.setState({
				        noProfileData: true,
			        })
		        }

	        }
        } catch (error) {
            console.error(error);
        }
    }

	showCommentDialog(){
		this.setState({
			mountCommentDialog: true,
			showCommentDialog: true,
		})
	}

	hideCommentDialog(){
		this.setState({
			showCommentDialog: false,
		})
	}

	showDialog (dialogName) {
	 
		if(dialogName === 'IsBuyDialog') {
		    if(this.state.channelCharge.discountStatus == 'UNLOCK') {
		        return
            }
			this.IsBuyDialog.show()
		}
	}

	async initGraphicCommentCount(){
		const res = await this.props.graphicCommentCount({
			businessId: this.props.topicInfo.id
		});
		if(res.state.code === 0){
			this.setState({
				graphicCommentCount: res.data.count || 0
			})
		}
	}

	addCommentCount(){
		this.setState({
			graphicCommentCount: this.state.graphicCommentCount + 1
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
		let ins = this.refVideoPlayer;
		ins.videoPlayerRef && ins.videoPlayerRef.pause();
		window.toast('打开千聊APP即可在后台收听')
		setTimeout(() => {
			this.goApp()
		}, 1000);
		// this.setState({isShowAppDownloadConfirm: true})
	}


	hideAppDownloadConfirm = () => {
		this.setState({isShowAppDownloadConfirm: false})
	}
	
	async initIsOfficial() {
        try {
            let officialLiveIds = this.data.officialLiveIds;
			const result = await this.props.getQlLiveIds();
			const isWhiteLive = await this.props.isServiceWhiteLive(this.props.topicInfo.liveId)
			let isWhite = 'N'

            if (getVal(result, 'state.code') == 0) {
                officialLiveIds = getVal(result, 'data.dataList', []);
			}
			
            if (getVal(isWhiteLive, "state.code") == 0) {
                isWhite = getVal(isWhiteLive, "data.isWhite", "N");
            }

            const isOfficialLive = officialLiveIds.find(item => item == this.props.topicInfo.liveId) != undefined
            this.setState({ isOfficialLive, officialLiveIds, isWhiteLive: isWhite });
        } catch (error) {
            console.error(error);
		}

		this._hasGetOfficialLive = true;
		this.setState({});
    }

	getMediaPlayerCurrentTime(){
		const time = getVal(this, 'refVideoPlayer.canvasVideoPlayer.currentTime', 0);
		return Math.floor(time);
	}

	/***********************开始 请好友免费听相关**********************/

    // 底部分享按钮显示状态
    async initShareBtnStatus(){
		try{
			let shareBtnStatus = 'share',shareRemaining = 0,showShareCard = true, showInviteFirendListen = false
			/**
			 * 请好友免费听的用户的条件是：
			 * 1、C端，该话题是系列课下的，不是单节付费，不是试听课
			 * 2、开启了邀请分享功能且还有剩余名额
			 * 3、系列课是付费的且自己已经购买，或者自己是vip（这点后端接口会判断）
			 * 4、安卓机型且是本页面点击听课列表进行无刷新切换的，即页面链接参数含有byhand=1的，这种要屏蔽掉，因为这种通过pushState的在安卓上分享调不起来
			 */
			if(!this.props.power.allowSpeak && !this.props.power.allowMGLive && this.props.topicInfo.channelId && this.props.topicInfo.isAuditionOpen !== 'Y' && this.props.topicInfo.isSingleBuy !== 'Y'){
				const result = await checkShareStatus({
					channelId: this.props.topicInfo.channelId,
					topicId: this.data.topicId
				})
				if(result.state.code === 0){
					// 开启了邀请分享功能且还有剩余名额
					if(result.data.isOpenInviteFree === 'Y' && result.data.remaining > 0){
						shareBtnStatus = 'invite'
						shareRemaining = result.data.remaining
						// 可 请好友听 的情况， 显示请好友听按钮
						showInviteFirendListen = true
					}
				}
			}
			this.setState({shareBtnStatus, shareRemaining, showShareCard, showInviteFirendListen})
			// 手动触发打曝光日志
			setTimeout(() => {
				typeof _qla != 'undefined' && _qla.collectVisible();
			}, 50);
		}catch (error) {
            console.error(error);
		}
		this._hasGetShareBtnStatus = true;
		this.setState({})
	}

	isAuthChannel = async () => {
		if (!this.props.topicInfo.channelId) return 'N';
		let result =  await isAuthChannel(this.props.topicInfo.channelId);
		this.setState({
			isAuthChannel: result
		}, () => {
			this.initShare()
		})
	}

    // 初始化请好友听领取状态
    async initReceiveStatus(){
		try{
			// 系列课已经购买，直接跳过
			if(await isAuthChannel(this.props.topicInfo.channelId) === 'Y'){
				this._hasGetReceiveStatus = true;
				this.setState({})
				return
			}
			// 链接上带有inviteFreeShareId，说明是领取过好友分享的课然后跳转过来的
			let inviteFreeShareId = this.props.location.query.inviteFreeShareId || ''
			const result = await getReceiveInfo({inviteFreeShareId, topicId: this.props.topicInfo.id})
			if(result.state.code === 0){
				// 如果接口返回的topicId不是这个页面的topicid，表明链接上的inviteFreeShareId是人为拼上去的，这种时候不做后续操作
				if(JSON.stringify(result.data) !== '{}' && result.data.topicId !== this.props.topicInfo.id || JSON.stringify(result.data) === '{}' ){
					this._hasGetReceiveStatus = true;
					this.setState({})
					return
				}
				let userList = result.data.userList
				let rank = 0
				if(userList && userList.length > 0){
					rank = userList.findIndex(item => item.userId == this.props.userId) + 1
				}
				this.setState({
					inviteFreeShareId: result.data.inviteFreeShareId,
					canListenByShare: true,
					remaining: result.data.remaining || 0,
					userList: result.data.userList || [],
					rank,
					inviteFreeMissionId: result.data.missionId
				},()=>{
					// 重置分享
					this.inviteFriendsToListenDialog.resetShare(this.props.topicInfo)
				})
			}
		}catch (error) {
            console.error(error);
		}
		this._hasGetReceiveStatus = true;
		this.setState({})
    }

    // 打开请好友免费听弹窗（首先获取分享id）
	async openInviteFriendsToListenDialog(load = false){
		if(!load && Detect.os.android && window.localStorage.getItem('_ROUTERPUSH') == 'Y'){
			window.localStorage.setItem('_RELOAD', 'Y')
			window.location.reload()
			return
		}
		const result = await fetchShareRecord({
			channelId: this.props.topicInfo.channelId,
			topicId: this.props.topicInfo.id,
		})
		if(result.state.code === 0){
            this.setState({inviteFreeShareId: result.data.inviteFreeShareId})
            this.inviteFriendsToListenDialog.show(this.props.topicInfo, this.state.showBackTuition ? this.data.missionDetail: null)
		}
	}
	
	// 跳转到系列课介绍页
	jumpToChannelIntro(){
        if(!this.props.topicInfo.channelId){
            return
		}
		let target = ''
		if(this.props.location.query.shareKey){
			target += `&shareKey=${this.props.location.query.shareKey}`
		}
		if(this.props.location.query.lshareKey){
			target += `&lshareKey=${this.props.location.query.lshareKey}`
		}
		// 如果其分享者（邀请他的人）拥有拉人返学费的资格 需要带上去missionId
        if(this.state.inviteFreeMissionId) {
            target += `&missionId=${this.state.inviteFreeMissionId}`
        }
        locationTo(`/wechat/page/channel-intro?channelId=${this.props.topicInfo.channelId}${target}&sourceNo=invited&autopay=Y`)
	}
	
	getLiveStatus() {
		const { startTime } = this.props.topicInfo;
		const { sysTime } = this.props;
		if (sysTime < startTime) {
			return false;
		}
		return true
	}
	// 是否免费公开课
    get isFreePublicCourse() {
		return this.props.topicInfo.isFreePublicCourse === 'Y';
	}

	// 是否是知识新闻
	get isNewsTopic() {
		return this.props.topicInfo.isNewsTopic === 'Y';
	}

	// 是否存在系列课
	get isChannel (){
		return !!this.props.topicInfo.channelId
	}

	/***********************结束 请好友免费听相关**********************/
	
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
					this.initShare()
				}

			}
		}).catch(err => {
			console.log(err);
		})
	}

	// 播放状态
	playStatus(isPlay){
		console.log(isPlay, 'isPlay')
		this.setState({
			isPlay: isPlay
		})
	}
	/***********************结束拉人返学费相关***************************/
	
	async ajaxGetInviteDetail () {
		if (this.props.topicInfo.isAuditionOpen != 'Y') return ;
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
            let inviteList= await this.ajaxGetInviteList()
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
        if (this.props.topicInfo.isAuditionOpen != 'Y') return ;
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
	
	onIncrFansActivityBtnClick() {
        if(this.state.incrFansFocusGuideConfigs.outsideChain === 'N') {
            this.setState({
                showIncrFansFocusGuideDialog: true
            })
        } else {
            locationTo(this.state.incrFansFocusGuideConfigs.qrCode);
        }
	}

	onCloseIncrFansDialog() {
		console.log('fuck')
		this.setState({
			showIncrFansFocusGuideDialog: false
		})
	}

	async dispatchAddShareComment() {
		const res = await this.getShareCommentConfig();
		console.log('!!!!!!, SHareCommentConfig =======>>>', res);
        if(res && res.flag !== 'Y') return ;
		console.log('???????, SHareCommentConfig =======>>>', res);
        await this.props.addShareComment({
            userId: this.props.userId,
            liveId: this.props.liveInfo.entity.id,
            topicId: this.props.topicInfo.id
        });
	}

	async getShareCommentConfig() {
        const res = await this.props.dispatchGetShareCommentConfig({topicId: this.data.topicId, liveId: this.props.topicInfo.liveId});
        return res;
    }
	
    // 获取课程对应的社群信息
    async dispatchGetCommunity() {
        try {
            const res = await getCommunity(this.props.liveInfo.entity.id, 'topic', this.data.topicId)
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
				let communityRecord = JSON.parse(communityList).includes(`${this.props.liveInfo.entity.id}_${this.data.topicId}`);
                if(!communityRecord){
					this.setState({
						showGroupEntrance: true
					})
				} 
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
                let hasRecord = communityList.includes(`${this.props.liveInfo.entity.id}_${this.data.topicId}`);
                if(hasRecord === false) {
                    communityList.push(`${this.props.liveInfo.entity.id}_${this.data.topicId}`);
                }
                window.sessionStorage.setItem('SHOW_COMMUNITY_LIST', JSON.stringify(communityList));
            } catch (error) {
                console.log('ERR',error);
            }
        };
    }

    render() {
		/**
		 * app引导下载显示条件：非B端(老师、管理员、嘉宾) & (官方直播间 | (非专业版 & 非白名单直播间))
		 */
		let isShowAppDownloadConfirmBtn = !this.props.power.allowMGLive && !this.props.power.allowSpeak && (this.state.isOfficialLive || (this.props.isLiveAdmin === 'N' && this.state.isWhiteLive === 'N'));
		// let isShowShareBtn = this.state.userTopicRole || this.props.power.allowMGLive || !isCend;

        return (
			<Page title={this.props.topicInfo.topic} className="video-course-simple-mode">
				{
					!this.state.isReactiveMode && !this.isUnHome && this.state.isOfficialLive && !this.props.power.allowMGLive && !this.props.power.allowSpeak && <AppDownloadBar topicId={this.props.topicInfo.id} style="button"/>
				}
				{/* 通过领取好友分享的免费听课程获取 */}
				{
					this.state.canListenByShare ?
					<div className="can-listen-by-share-container">
						<p>你是第{this.state.rank}个抢到的，<em onClick={()=>{this.receiveListOfInviteFriendsToListenDialog.show()}}>看看还有谁抢到了>></em></p>
						{
							this.state.remaining > 0 ?
							<p>剩余{this.state.remaining}个名额，点击右上角“…”分享给你的好友</p> : null
						}
					</div> : null
				}
				
				<IncrFansFocusGuideDialog
					show={ this.state.showIncrFansFocusGuideDialog }
					onClose={ this.onCloseIncrFansDialog }
					incrFansFocusGuideConfigs={ this.state.incrFansFocusGuideConfigs }
				/>

				{
					this.state.incrFansFocusGuideConfigs &&
						(<aside 
							className='incr-fans-activity-btn on-log' 
							onClick={this.onIncrFansActivityBtnClick}
							data-log-region='topicDetailFocusGuide'
						>
							<img src={ this.state.incrFansFocusGuideConfigs.button } />
						</aside>)
				}
				
	            <VideoPlayer
		            topicId={this.props.topicInfo.id}
		            topicInfo={this.props.topicInfo}
		            courseList={this.state.courseList}
		            updateLiveStatus={this.updateLiveStatus}
					isUnHome={ this.isUnHome }
		            reactiveAudioPlaying={this.state.reactiveAudioPlaying}
								updateVideoPlayingStatus={this.updateVideoPlayingStatus}
								playStatus={ this.playStatus }
								autoPlay={this.props.location.query.autoPlay}
								showDialog={this.showDialog}
								isFreeListen={this.state.canListenByShare}
								ref={r => r && (this.refVideoPlayer = r.getWrappedInstance())}
	            />
	            <div className={`content-wrapper${this.state.isReactiveMode ? ' reactive-mode' : ''}`}
	                 ref={el => (this.contentWrapper = el)}
	            >

					<div className="content-container flex-body"
					     ref={el => (this.contentContainer = el)}
					>
						<div className="flex-main-s">
							<div className="topic-info">
								<div className="name">{this.props.topicInfo.topic}</div>
								{
									this.isFreePublicCourse ? (
										<div className="student-count">{digitFormat(this.props.topicInfo.browseNum || 0)}次学习</div>
									) : (
										<div
											className="live-enter on-log"
											data-log-region="room"
											onClick={() => {locationTo(`/wechat/page/live/${this.props.topicInfo.liveId}`)}}
											>
											直播间主页
											<div className="icon_enter"></div>
										</div>
									)
								}
								{
									 (this.isChannel || this.isFreePublicCourse || window.sessionStorage.getItem('freeColumnJumpUrl')) && (
										<div
											className={ `topic-own on-log audition` }
											data-log-region="free-public-course"
											onClick={() => {
												if(window.sessionStorage.getItem('freeColumnJumpUrl')){
													// 免费专栏过来的
													const freeColumnJumpUrl = sessionStorage.getItem('freeColumnJumpUrl');
													sessionStorage.removeItem('freeColumnJumpUrl')
													sessionStorage.removeItem('freeColumnWords')
													locationTo(freeColumnJumpUrl);
												}else{
													locationTo(this.props.topicInfo.channelUrl)
												}
											}}
										>
											<p>
												<i></i>
												{
													window.sessionStorage.getItem('freeColumnWords') ? 
														(<span>{window.sessionStorage.getItem('freeColumnWords')}</span>)
													: (this.isFreePublicCourse || !this.isAudition) ?
														(<span>点击进入课程：{this.props.topicInfo.channelName}</span>)
													:
														<span>免费试听中，点击了解完整课程内容</span>						
												}
											</p>
										</div>
									)
								}
								{/* 为了推广王不烦的课程，对于知识新闻类的话题，增加进入系列课的购买指引，为了尽快上线，文案和链接暂时固定 */}
								{
									this.isNewsTopic && this.props.topicInfo.entranceText && (
										<div
											className="topic-own on-log"
											data-log-region="news-topic"
											onClick={() => locationTo(this.props.topicInfo.newsUrl)}>
                                        	<p><span>{this.props.topicInfo.entranceText}</span></p>
										</div>
									)
                            	}
							</div>
							{
								!!this.state.courseList.length &&
								<CourseList
									topicInfo={this.props.topicInfo}
									sysTime={this.props.sysTime}
									courseList={this.state.courseList}
									jumpToCourse={this.jumpToCourse}
									showCourseListDialog={this.showCourseListDialog}
									canListenByShare={this.state.canListenByShare}
								/>
							}
							
                            <GroupEntranceBar 
                                communityInfo={this.state.communityInfo}
                                businessId={this.data.topicId}
                                liveId={this.props.topicInfo.liveId}
                                onClose={this.onGroupEntranceClose}
                                hasBeenClosed={!this.state.showGroupEntrance}
                            />
							{
								this.state.showBackTuition &&
								<CollectVisible>
									<div className="back-tuition on-log on-visible"
									onClick={this.openBackTuitionDialog}
									data-log-region="returnFee"
									>
										<div className="title back-tuition-title">待返学费￥{this.data.missionDetail.returnMoney || 0}</div>
										<div className="desc">
											<div className="name"></div>
											<div className="icon_enter"></div>
										</div>
									</div>
								</CollectVisible>
							}
							<div className="go-to-intro on-log"
							     onClick={this.showTopicIntro}
							     data-log-name="查看课程介绍"
							     data-log-region="course-intro"
							>
								<div className="title">查看课程简介</div>
								<div className="desc">
									<div className="name"></div>
									<div className="icon_enter"></div>
								</div>
							</div>

							{ this.tracePage!=="coral"&&!this.isFreePublicCourse && (
								<GuestYouLike
									liveId={this.props.topicInfo.liveId}
									businessType={ this.props.topicInfo.channelId ? 'channel' : 'topic' }
									businessId={ this.props.topicInfo.channelId || this.props.topicInfo.id }
									dimensionType="browse"
									isShowQlvipEntry={this.state.isOfficialLive}
									urlParams={{
										wcl: 'promotion_topic-simple-video',
										originID: this.props.topicInfo.id
									}}
									isShowAd={ this.state.isOfficialLive }
									render={children =>
										<div>
											<div className="section-title">猜你喜欢</div>
											{children}
										</div>
									}
								/>
							) }
						</div>
						{
							 // (this.props.topicInfo.isAuditionOpen == 'Y' && this.state.isAuthChannel == 'N' && this.state.canInviteAudition == 'Y'  && !this.props.power.allowMGLive && !this.props.power.allowSpeak) ?
							 // //<TryListenStatusBar count={this.state.inviteDetail.inviteNum} total={this.state.inviteDetail.inviteTotal} onClick={this.onClickTryListenBar}/>
							 // (null)
							 // :
							(this._hasGetOfficialLive && this._hasGetShareBtnStatus && this._hasGetReceiveStatus) &&
							<CollectVisible>
							{
								this.state.canListenByShare ?
								<InviteFreeMenu
									changeMode = {this.changeMode}
									liveStatus = {this.state.liveStatus}
									jumpToChannelIntro = {this.jumpToChannelIntro}
								/>:
								<div className={`control-panel flex-other${isShowAppDownloadConfirmBtn ? ' column' : ''}`}>
								{
									isShowAppDownloadConfirmBtn &&
									<div className="admin-btn on-log on-visible"
										onClick={this.showAppDownloadConfirm}
										data-log-name="极速听课按钮"
										data-log-region="admin-btn"
									><span></span>后台播放</div>
								}
								{
									this.state.shareBtnStatus === 'share' ?
									<div className="share-btn on-log"
										onClick={this.shareBtnClickHandle}
										data-log-name="分享按钮"
										data-log-region="share-btn"
									><span className="icon-share"></span>分享</div>
									:(
										this.state.shareBtnStatus === 'invite' ?
										<div className="invite-btn on-log on-visible"
											onClick={()=>{this.openInviteFriendsToListenDialog(false)}}
											data-log-name="分享按钮"
											data-log-region="video-simple"
											data-log-pos = "invite-listen"
										><span className="icon-invite">
											<span className="remaining">{`${10 - this.state.shareRemaining}/10`}</span>
										</span>请好友听</div> : null
									)
								}
								{
									this.props.topicInfo.style === 'videoGraphic' ?
										<div className="comment-btn on-log on-visible"
											onClick={this.showCommentDialog}
											data-log-name="切换上课模式按钮"
											data-log-region="reactive-btn"
										>
											<span className={`icon-comment`}>
												{
													this.state.graphicCommentCount > 0 &&
													<div className="comment-count">{this.state.graphicCommentCount}</div>
												}
											</span>
											评论
										</div>
										:
										<div className="reactive-btn on-log on-visible"
											onClick={this.changeMode}
											data-log-name="切换上课模式按钮"
											data-log-region="reactive-btn"
										><span className={`icon-reactive${this.state.liveStatus === 'beginning' ? ' red-spot' : ''}`}></span>互动模式</div>
								}
								<div className={`on-log on-visible`}
									onClick={() => { this.controlDialog.show()}}
									data-log-name="更多"
									data-log-region="btn-opration"
									data-log-pos="btn-opration-simple"
								><span className="icon-more"></span>更多</div>
							</div>
							}
							</CollectVisible>
						}
			            {
				            this.props.topicInfo.channelId && !!this.state.courseList.length &&
				            <CourseListDialog
					            isShow={this.state.showCourseListDialog}
					            hideCourseListDialog={this.hideCourseListDialog}
					            topicInfo={this.props.topicInfo}
					            sysTime={this.props.sysTime}
					            courseList={this.state.courseList}
								jumpToCourse={this.jumpToCourse}
								isPlay={ this.state.isPlay }
                                userUnlockProcess={this.state.userUnlockProcess}
					            isBussiness = {this.props.power.allowSpeak || this.props.power.allowMGLive}
				            />
			            }
						{
							this.props.topicInfo.style === 'videoGraphic' && this.state.mountCommentDialog &&
							<CommentDialog
								show={this.state.showCommentDialog}
								topicId={this.props.topicInfo.id}
								courseStyle="videoGraphic"
								graphicCommentCount={this.state.graphicCommentCount}
								hideCommentDialog={this.hideCommentDialog}
								addCommentCount={this.addCommentCount}
								getMediaPlayerCurrentTime={this.getMediaPlayerCurrentTime}
								power = {this.props.power}
								isHasLive= {this.state.isHasLive}
								getHasLive= {this.state.getHasLive}
							/>
						}
						<SimpleControlDialog 
							ref={r=>this.controlDialog = r}
							topicId={this.data.topicId}
							topicInfo={this.props.topicInfo}
							power = {this.props.power}
						
						/>
		            </div>
		            {/* 消息流模块  */}
		            <div className="content-container"
		                 ref={el => (this.contentReactiveModeContainer = el)}
		            >
			             <SpeakContainer
				             topicId={this.props.location.query.topicId}
							 changeMode={this.changeMode}
							 currentIndex={this.state.currentIndex}
				             updateReactiveAudioPlayingStatus={this.updateReactiveAudioPlayingStatus}
				             videoPlaying={this.state.videoPlaying}
				             isReactiveMode={this.state.isReactiveMode}
				             isEvaluationOpen = {this.state.isEvaluationOpen}
							 liveStatus={this.state.liveStatus}
							 isHasLive= {this.state.isHasLive}
							 getHasLive= {this.state.getHasLive}
							 groupComponent={(
								<GroupEntranceBar 
									communityInfo={this.state.communityInfo}
									businessId={this.data.topicId}
									liveId={this.props.topicInfo.liveId}
									onClose={this.onGroupEntranceClose}
									hasBeenClosed={!this.state.showGroupEntrance}
								/>
							)}
							 renderProp={() => 
								<div className="top-tools">
									{
										this.state.showShareCard === true ?
										<div className="tool-btn invitecard-btn"
											onClick={()=>{this.shareBtnClickHandle()}}
											data-log-name="邀请卡按钮"
											data-log-region="video-simple"
											data-log-pos = "invite-listen"
										><span className="tool-icon icon-invitecard"></span>邀请卡</div> : null
									}
									{
										this.state.showInviteFirendListen === true ?
										<div className="tool-btn invite-btn"
											onClick={()=>{this.openInviteFriendsToListenDialog(false)}}
											data-log-name="分享按钮"
											data-log-region="video-simple"
											data-log-pos = "invite-listen"
										><span className="tool-icon icon-invite">
											<span className="remaining"><span className="remaining-highlight">{10 - this.state.shareRemaining}</span>/10</span>
										</span>请好友听</div> : null
									}
								</div>
							 }
						 />
						 
						 <div className="operation-area" style={this.state.operationAreaOffset}>
							{
								/**
								 * app引导下载显示条件：非B端 & (官方直播间 | (非专业版 & 非白名单直播间))
								 */
								isShowAppDownloadConfirmBtn ?
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
							<div className="additional-action">
								{
									this.state.isNewCamp &&
									<div className="btn-item btn-return-camp on-log"
										onClick={() => locationTo(`/wechat/page/training-learn?channelId=${this.props.topicInfo.channelId}`)}
										data-log-region="btn-return-camp"
									>
										<div className="tip">返回训练营</div>
									</div>
								}
							</div>
						</div>
		             </div>
					 
	            </div>

				<div className="sider-bar">
					
                </div>

				<IntroDialog
					ref={ dom => this.domIntroDialog = dom }
					topicInfo={ this.props.topicInfo }
					topicProfile={ this.props.topicProfile }
					channelProfile={ this.props.channelProfile }
					noProfileData={this.state.noProfileData}
					commentNum={this.props.topicInfo.commentNum}
					topicDesc={this.state.topicDesc}
					channelDesc={this.state.channelDesc}
				/>
				<IsBuyDialog title="试听已结束"
							 desc="购买系列课即可学习所有课程"
							 confirmText="购买系列课"
							 cancelText="查看课程介绍"
							 money={formatMoney(this.props.topicInfo.money)}
							 onBtnClick={() => {locationTo(`/live/channel/channelPage/${this.props.topicInfo.channelId}.htm`);}}
							 ref={dom => this.IsBuyDialog = dom}
				></IsBuyDialog>

				{/* 邀请好友免费听弹窗 */}
                <InviteFriendsToListen
					ref = {el => this.inviteFriendsToListenDialog = el}
                    inviteFreeShareId = {this.state.inviteFreeShareId}
                    //关闭弹窗后重新初始化分享
                    onClose = {this.initShare}
					canListenByShare={this.state.canListenByShare}
					userId={this.props.userId}
					coralInfo = {this.state.coralInfo}
					source={this.props.location.query.source}
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

				<ReceiveListOfInviteFriendsToListen
                    ref = {el => this.receiveListOfInviteFriendsToListenDialog = el}
                    userList = {this.state.userList}
                    remaining = {this.state.remaining}
                />

				{
					this.state.isShowAppDownloadConfirm &&
					<AppDownloadConfirm
						onClose={this.hideAppDownloadConfirm}
						downloadUrl="http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1401379703606"
					/>
				}
						{ (this.state.node && this.isCamp && this.getLiveStatus()) && <JobReminder channelId={ this.props.topicInfo.channelId } topicId={this.data.topicId} targetNode={ this.state.node } />}

				{
                    this.state.tryListenMask.show ?
					<TryListenShareMask {...this.state.inviteDetail}
					isBindThird={this.props.isSubscribe.isBindThird}
                        isFocusThree={this.props.isSubscribe.isFocusThree}
                        liveId={this.props.topicInfo.liveId}
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

				{/* 留资弹窗 */}
				<DialogMoreUserInfo
					visible={!!this.state.isDialogMoreInfoVisible}
					userId={this.props.userId}
					onClose={() => {
						// 当弹窗被主动关闭时，记录当前弹窗状态，有效期为1天
                        getCookie('showDialogMoreInfo') !== 'N' && setCookie('showDialogMoreInfo', 'N', 1);
						this.setState({isDialogMoreInfoVisible: false});
					}}
					onSuccess={() => this.setState({isDialogMoreInfoVisible: false})}
				/>
            </Page>
        );
    }
}

// 请好友免费听底部按钮
const InviteFreeMenu = ({
	changeMode,
	liveStatus,
	jumpToChannelIntro
}) => {
	return (
		<div className={`control-panel flex-other invite-free-menu`}>
			<p>试听中，现在购买可解锁整个专辑</p>
			<div className="listen-by-buy-btn" onClick={jumpToChannelIntro}>立即购买</div>
		</div>
	)
}



module.exports = connect(mapStateToProps, mapActionToProps)(AudioGraphic);
