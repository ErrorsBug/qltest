import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { autobind, throttle } from "core-decorators";
import classnames from "classnames";

import TryListenStatusBar from "components/try-listen-status-bar";
import TryListenShareMask from "components/try-listen-share-mask";
import { get } from "lodash";

import Page from "components/page";
import { MiddleDialog } from "components/dialog";
import { share } from "components/wx-utils";
import ScrollToLoad from "components/scrollToLoad";
import {
    formatDate,
    locationTo,
    updatePageData,
    imgUrlFormat,
    getCookie,
    delCookie,
    wait,
    setLocalStorageArrayItem,
    getVal,
    validLegal,
    normalFilter,
    localStorageSPListAdd,
    sleep,
    updateTopicInChannelVisit,
    formatMoney,
    isFromLiveCenter,
    randomShareText,
    setCookie
} from "components/util";
import { getUrlParams } from 'components/url-utils';

// import AppDownloadBar from "components/thousand-live-app-download-bar/app-download-bar";
import CollectVisible from "components/collect-visible";

import { ScholarshipDialog } from "components/scholarship-menu";
import InviteFriendsToListen from "components/invite-friends-to-listen";
import TopicAudioPlayer from "./components/topic-audio-player";
import ReceiveListOfInviteFriendsToListen from "./components/invite-friend-receive-list";
import TopicIntro from "./components/topic-intro";
import CommentInput from "./components/comment-input";
import CommentList from "./components/comment-list";
import LanternSlide from "./components/lantern-slide";
import CourseListDialog from "./components/course-list-dialog";
import IntroDialog from "./components/intro-dialog";
import GraphicCommentDialog from "components/graphic-course-comment-dialog";
import IsBuyDialog from "components/dialog/is-buy-dialog";
import AppDownloadConfirm from "components/app-download-confirm";
import BulletScreen from "components/bullet-screen";
import GuestYouLike from "components/guest-you-like";
import JobReminder from "components/job-reminder";
import BackTuitionDialog from "components/back-tuition-dialog";
import { apiService } from "components/api-service";
import AppDownloadBar from 'components/app-download-bar';
import openApp from 'components/open-app';
import IncrFansFocusGuideDialog from '../topic-thousand-live/components/incr-fans-focus-guide-dialog';

import {
    shareBgWaterMark
} from 'thousand_live_components/share-format';
import {
    fetchCommentList,
    addComment,
    fetchTotalSpeakList,
    updateCommentIndex,
    getPPT,
    graphicCommentCount,
    bindLiveShare
} from "thousand_live_actions/thousand-live-normal";

import { fetchMediaUrl } from "thousand_live_actions/thousand-live-av";

import {
    isLiveAdmin,
    getCreateLiveStatus,
    getLiveLevelInfo,
    getWeappCode,
    getQr,
    getUserInfo,
    userBindKaiFang,
    fetchQrImageConfig
} from "thousand_live_actions/common";

import { getEditorSummary, setUniversityCurrentCourse } from "thousand_live_actions/live";

import {
    fetchLastOrNextTopic,
    getChannelInfo,
    getTopicProfile,
    getChannelProfile,
    addPageUv,
    getAuth,
    getJoinCampInfo,
    studyTopic,
    dispatchGetShareCommentConfig
    // getLike,
} from "../../actions/thousand-live-common";
import { getPacketDetail, updatePacketPopStatus } from "common_actions/coupon";

import {
    getTopicRoleList,
    checkShareStatus,
    fetchShareRecord,
    getReceiveInfo,
    isAuthChannel,
    request,
    getServerTime,
    uploadTaskPoint,
    getOfficialLiveIds,
    isServiceWhiteLive,
    getCommunity
} from "common_actions/common";

import { getPersonCourseInfo } from "common_actions/coral";
import { bindOfficialKey, } from "../../../actions/common";
import { getLike, addLikeIt , addShareComment} from "../../actions/common";
import HomeFloatButton from "components/home-float-button";
import GroupEntranceBar from 'components/group-entrance-bar';
import DialogMoreUserInfo from 'components/dialogs-colorful/more-user-info/index';

@autobind
class TopicListening extends Component {
    data = {
        liveId: "0",
        topicId: "0",

        // 是否在加载下一页
        loadingNext: false,
        //进入页面的时间戳
        currentTimeMillis: 0,
        // 正在播放中音频所在消息流下标
        audioIndex: null,
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
        // 记录最后一次滚动操作时间
        lastScrollTime: 0,
        // 显示后台收听按钮
        showBackstage: false,
        missionDetail: {} // 拉人返学费数据
    };

    state = {
        showWeappCode: false,
        weapp: "",
        commentNum: this.props.topicInfo.commentNum,
        showInput: false,
        commentInputValue: "",
        commentLength: 20,
        isNoMore: false, //是否还有更多
        // 是否专业版
        isLiveAdmin: "",
        // 有没有直播间
        hasNotLive: false,
        // ppt列表图
        pptList: [],
        // 选中的pptId
        currentPPTFileId: "",
        // 显示课程列表
        showCourseListDialog: false,
        mountCourseListDialog: true,
        // 课程列表
        courseList: [],
        isOfficialLive: "",
        isWhiteLive: "",
        // 系列课名称
        channelName: "",

        mountGraphicCommentDialog: false,
        showGraphicCommentDialog: false,

        graphicCommentCount: 0,

        isShowAppDownloadConfirm: false,

        roleList: [],

        // 播放器当前播放时间
        playerCurrentTime: null,

        // 没有课程简介数据
        noProfileData: false,

        // 分享按钮状态
        shareBtnStatus: "",
        // 请好友免费听剩余邀请名额
        shareRemaining: 0,

        /**请好友免费听相关 */
        inviteFreeShareId: "", // 请好友免费听分享id
        remaining: 0, //剩余赠送名额
        userList: [], //领取用户列表
        canListenByShare: false, //此话题是否通过请好友免费听获取
        rank: 0, // 请好友免费听领取排名
        /************/

        playerStatus: "",
        showBackTuition: false, //是否展示拉人返学费按钮
        joinCampInfo: {},
        inviteFreeMissionId: "", // 邀请好友听的 拉人返学费
        isPlay: false,
        topicManuscript: null,

        inviteDetail: {},

        tryListenMask: {
            show: false
        },

        //用户是否有创建直播间
        isHasLive: false,
        getHasLive: false,

        likeObj:{
            likes: false,
            likesNum: 0,
            speakId: "0",

        },
        tipsShow: false,
        chargeConfig: '',
        teacherUrl: '',
        showGroupEntrance: false, // 显示社群入口
        
        // 是否显示留资弹窗
        isDialogMoreInfoVisible: false,
    };

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem("trace_page");
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem("trace_page", tp);
    }

    get isEven(){ // true: B类型； false: A类型
        if(typeof document != 'undefined'){
            const userId = getCookie("userId");
            const lastNum = userId.split("")[userId.length -1];
            let flag = lastNum % 2 == 0
            return flag;
        }
        return false
        
    }

    // 当前课程是否为试听
    get isAudition(){
       return this.state.isAuthChannel === 'N' &&  this.props.topicInfo.isAuditionOpen === "Y";
    }
    // 判断是否存在系列课
    get isChannel(){
        return !!this.props.topicInfo.channelId;
    }
    get isUnHome(){
        const isUnHome = getUrlParams("isUnHome", '')
        return Object.is(isUnHome, 'Y')
    }
    async componentDidMount() {
        // 删除旧cookie记录
        try {
            delCookie('lastVisit')
        } catch (error) {
            
        }

        this.initAlbum();
        this.initState();
        this.initComment();
        this.initChannelInfo();
        this.isAuthChannel();
        if (this.props.isListenBook) {
            this.initTopicManuscript()
        }
        
        this.getLikeStatus();

        this.hasLive();
        if (
            this.props.location.query.officialKey ||
            this.props.location.query.source == "coral"
        ) {
            this.tracePage = "coral";
        }
        //officialKey，就绑定关系
        if (this.props.location.query.officialKey) {
            this.props.bindOfficialKey({
                officialKey: this.props.location.query.officialKey
            });
        }
        // 初始化状态
        this.initOfficialLive();

        await this.props.getUserInfo();

        this.initDialogMoreUserInfo();

        // 初始化请好友免费听领取状态
        this.initReceiveStatus();
        // 初始化底部分享按钮状态
        this.initShareBtnStatus();
        // 初始化拉人返学费
        this.initInviteReturnInfo();

        // 获取有没有创建直播间
        await this.getCreateLiveStatus();

        if(this.isNewsTopic ){
            // 我觉得有用  点赞的提示
            this.setState({
                tipsShow: localStorage.getItem("likeTipsShow", "N") !== 'N'
            });
            
            this.state.tipsShow && setTimeout(() => {
                this.setState({
                    tipsShow: false,
                });
                localStorage.setItem("likeTipsShow", "N");
            }, 3000);
        }

        // 等小程序支持跳转再恢复功能
        this.isBtnListenBackendVisible();

        this.getProfile();

        try {
            const result = await this.props.fetchQrImageConfig({ topicId: this.data.topicId });
            if (result.state.code == 0) {
                this.setState({
                    incrFansFocusGuideConfigs: getVal(result, 'data.info')
                });
            }
        } catch (error) {
            
        }

        this.dispatchGetCommunity();

        // 足迹页的浏览记录
        // localStorageSPListAdd('footPrint', this.data.topicId, 'topic', 100)
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != "undefined" && _qla.collectVisible();
        }, 0);

        if (this.props.topicInfo.style === "audioGraphic") {
            this.initGraphicCommentCount();
        }

        // 话题统计
        this.addPageUv();

        // 记录系列课内课程访问信息
        if (this.props.topicInfo.channelId) {
            updateTopicInChannelVisit(this.props.topicInfo);
        }

        this.initTopicRoleList();
        // 绑定直播间分销关系
        this.bindLiveShare();

        // 初始化珊瑚课程信息
        this.initCoralInfo();

        this.ajaxGetInviteDetail();

        this.ajaxCanInviteAudition();
        
        this.ajaxSaveInvite();

        if(this.isNewsTopic){
            this.getTeacherUrl();
        }
        
        // 绑定滚动区捕捉曝光日志
        setTimeout(() => {
            typeof _qla != "undefined" && _qla.bindVisibleScroll("flex-main-h");
        }, 1000);
        if (!!this.props.topicInfo.channelId) {
            this.initCampInfo();
        }

        setTimeout(_ => {
            // 详情页显示平台通用券弹窗
            this.getPacketDetail();
            
            setUniversityCurrentCourse({
                businessId: this.props.topicInfo.isBook ==='Y'? this.data.topicId : (!!this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.data.topicId),
                businessType: this.props.topicInfo.isBook ==='Y'? 'topic' : (!!this.props.topicInfo.channelId? 'channel':'topic'),
                currentId: this.data.topicId,
            });
        }, 3000);
    }

    async componentWillReceiveProps(nextProps) {
        if (this.data.topicId !== nextProps.location.query.topicId) {
            this.data.topicId = nextProps.location.query.topicId;

            this.getProfile();
        }
    }

    componentWillMount() {
        this.props.updateCommentIndex(0);
        
    }

    // 是否显示留资弹窗
    initDialogMoreUserInfo = () => {
        const { userInfo, location: { query: { showDialogMoreInfo } }, power: { allowMGLive } } = this.props;
        // 首要条件：C端用户资料手机为空，且未主动关闭弹窗
        // 次要条件：该页面由微信推送链接进入（携带wcl标识）或其为第二节课上课页
        const isDialogMoreInfoVisible = !allowMGLive && !userInfo.mobile && getCookie('showDialogMoreInfo') !== 'N' && showDialogMoreInfo === 'Y';

        this.setState({
            isDialogMoreInfoVisible,
        });
    }

    // 获取名师解惑跳转url
    async getTeacherUrl(){
        const { data } = await request({
			url: '/api/wechat/topic/getTeacherDisabuseUrl',
			method: 'POST',
			body: {}
        })
        this.setState({
            teacherUrl: data?.url || ''
        })
    }

    async initTopicManuscript () {
		const res = await request({
			url: '/api/wechat/topic/bookProfile',
			method: 'POST',
			body: {
				topicId: this.data.topicId
			}
        })

		if (res && res.state.code === 0) {
			this.setState({
				topicManuscript: res.data.profileList
			})
		}
    }
    /***********************开始平台通用券（奖学金）相关***************************/

    // 详情页显示平台通用券弹窗
    getPacketDetail = async () => {
        let topicInfo = this.props.topicInfo;
        await getPacketDetail({
            businessId: topicInfo.channelId || topicInfo.id
        }).then(res => {
            // 返回的是空或者是空对象表明接口请求错误或者不是官方直播间且没有平台分销比例，不执行以下操作
            if (!res || JSON.stringify(res) === "{}") {
                return;
            }
            if (get(res, "state.code")) {
                throw new Error(res.state.msg);
            }
            let couponNum = get(res, "data.couponNum", 0); // 总数量
            let bindCouponNum = get(res, "data.bindCouponNum", 0); // 领取数量
            let popUpStatus = get(res, "data.popUpStatus"); // 是否已经弹窗
            let dayType = get(res, "data.dayType"); // 日期类型
            let fixDateEndTime = get(res, "data.fixDateEndTime"); // 固定日期结束时间
            // 弹窗弹起的条件：1、券未领完，2、未弹过窗，3、未过期
            if (
                couponNum &&
                bindCouponNum < couponNum &&
                popUpStatus === "N" &&
                !(dayType === "fixDate" && fixDateEndTime < Date.now())
            ) {
                let packetId = get(res, "data.id", "");
                this.scholarshipDialogEle.show(packetId);
                // 弹窗只弹一次，所以要调用后端接口将弹窗状态置为“已弹窗”
                updatePacketPopStatus(packetId);
            }
        });
    };
    /***********************结束奖学金相关***************************/

    // 获取用户加入训练营信息
    async initCampInfo() {
        const { data = {} } = await getJoinCampInfo({
            channelId: this.props.topicInfo.channelId
        });
        this.setState({
            joinCampInfo: data,
            isNewCamp: data.isNewCamp === 'Y',
        });
        // 新训练营 增加学习打卡记录
        if (data.isNewCamp === 'Y') {
            studyTopic({
                channelId: this.props.topicInfo.channelId,
                topicId: this.data.topicId
            })
        }
    }
    /**
     *
     * 初始化一些参数
     *
     * @memberof ThousandLive
     */
    initState() {
        this.data = {
            ...this.data,
            topicId: this.props.location.query.topicId || "0",
            liveId: this.props.topicInfo.liveId || "0",
            currentTimeMillis: this.props.topicInfo.currentTimeMillis
        };
    }

    // 初始化珊瑚课程信息
    async initCoralInfo() {
        let topicInfo = this.props.topicInfo;
        const result = await getPersonCourseInfo({
            businessType: topicInfo.channelId ? "channel" : "topic",
            businessId: topicInfo.channelId ? topicInfo.channelId : topicInfo.id
        });
        if (result.state.code === 0) {
            this.setState({ coralInfo: result.data });
        }
    }


    /** 初始化系列课信息 */
    async initChannelInfo() {
        if (!this.props.topicInfo.channelId) {
            return;
        }

        try {
            const result = await this.props.getChannelInfo({
                channelId: this.props.topicInfo.channelId
            });

            if (getVal(result, "state.code") == 0) {
                let chargeConfigs = getVal(result, "data.chargeConfigs", "")
                let chargeConfig = chargeConfigs[0] || {}
                this.setState({
                    channelName: getVal(result, "data.channel.name", ""),
                    chargeConfig: chargeConfig
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * 话题统计
     * @memberof ThousandLive
     */
    async addPageUv() {
        await sleep(3500);
        this.props.addPageUv(
            this.data.topicId,
            this.props.topicInfo.liveId,
            ["topicOnline", "liveUv"],
            this.props.location.query.pro_cl || getCookie("channelNo") || "",
            this.props.location.query.shareKey || ""
        );
    }

    async getProfile() {
        try {
            // 先获取话题，没有再获取系列课
            const [topicProfileRes, topicDescRes] = await Promise.all([
                this.props.getTopicProfile({
                    topicId: this.props.topicInfo.id
                }),
                this.props.getEditorSummary(this.data.topicId, "topic")
            ]);
            const topicDesc = getVal(topicDescRes, "data.content", "");
            if (topicDesc) {
                this.setState({
                    topicDesc
                });
            }
            if (
                !getVal(topicProfileRes, "data.TopicProfileList", []).length &&
                !this.props.topicInfo.remark &&
                !topicDesc
            ) {
                if (this.props.topicInfo.channelId) {
                    const [
                        channelProfileRes,
                        channelDescRes
                    ] = await Promise.all([
                        this.props.getChannelProfile({
                            channelId: this.props.topicInfo.channelId
                        }),
                        this.props.getEditorSummary(
                            this.props.topicInfo.channelId,
                            "channel"
                        )
                    ]);
                    const channelDesc = getVal(
                        channelDescRes,
                        "data.content",
                        ""
                    );
                    this.setState({
                        channelDesc
                    });
                    if (
                        !getVal(channelProfileRes, "data.descriptions.desc", [])
                            .length &&
                        !channelDesc
                    ) {
                        this.setState({
                            noProfileData: true
                        });
                    }
                } else {
                    this.setState({
                        noProfileData: true
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /***********************开始 请好友免费听相关**********************/

    // 底部分享按钮显示状态
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

    // 绑定直播间分销关系
    async bindLiveShare() {
        if (this.props.location.query.lshareKey) {
            await bindLiveShare(
                this.props.topicInfo.liveId,
                this.props.location.query.lshareKey
            );
        }
    }

    // 初始化请好友听领取状态
    async initReceiveStatus() {
        try {
            // 系列课已经购买，直接跳过
            if (await isAuthChannel(this.props.topicInfo.channelId) === "Y") {
                this.setState({ _hasGetReceiveStatus: true });
                return;
            }
            // 链接上带有inviteFreeShareId，说明是领取过好友分享的课然后跳转过来的
            let inviteFreeShareId =
                this.props.location.query.inviteFreeShareId || "";
            const result = await getReceiveInfo({
                inviteFreeShareId,
                topicId: this.data.topicId
            });
            if (result.state.code === 0) {
                // 如果接口返回的topicId不是这个页面的topicid，表明链接上的inviteFreeShareId是人为拼上去的，这种时候不做后续操作
                if (
                    (JSON.stringify(result.data) !== "{}" &&
                        result.data.topicId !== this.data.topicId) ||
                    JSON.stringify(result.data) === "{}"
                ) {
                    this.setState({ _hasGetReceiveStatus: true });
                    return;
                }
                let userList = result.data.userList;
                let rank = 0;
                if (userList && userList.length > 0) {
                    rank =
                        userList.findIndex(
                            item => item.userId == this.props.userId
                        ) + 1;
                }
                this.setState(
                    {
                        inviteFreeShareId: result.data.inviteFreeShareId,
                        canListenByShare: true,
                        remaining: result.data.remaining || 0,
                        userList: result.data.userList || [],
                        rank,
                        inviteFreeMissionId: result.data.missionId
                    },
                    () => {
                        // 重置分享
                        this.inviteFriendsToListenDialog.resetShare(
                            this.props.topicInfo
                        );
                    }
                );
            }
        } catch (err) {
            console.error(err);
        }
        this.setState({ _hasGetReceiveStatus: true });
    }

    // 打开请好友免费听弹窗（首先获取分享id）
    async openInviteFriendsToListenDialog() {
        const result = await fetchShareRecord({
            channelId: this.props.topicInfo.channelId,
            topicId: this.data.topicId
        });
        if (result.state.code === 0) {
            this.setState({ inviteFreeShareId: result.data.inviteFreeShareId });
            this.inviteFriendsToListenDialog.show(
                this.props.topicInfo,
                this.state.showBackTuition ? this.data.missionDetail : null
            );
        }
    }

    /***********************结束 请好友免费听相关**********************/

    // 对我有用状态  （ 点赞状态 ）
    async getLikeStatus(){
        let result = await this.props.getLike({speakIds: this.data.topicId});
        if(result?.state?.code === 0){
            this.setState({
                likeObj: (result?.data?.speaks && result?.data?.speaks[0]) || [],
            });
        }
        
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


    /** 初始化评论信息 */
    async initComment() {
        let getDataTime = Date.now();
        if (this.data.currentTimeMillis > getDataTime) {
            getDataTime = this.data.currentTimeMillis;
        }
        await this.props.fetchCommentList(
            this.data.topicId,
            this.data.liveId,
            getDataTime + 30000,
            "before"
        );
    }

    addComment = async value => {
        if (validLegal("text", "评论内容", value, 200, 0)) {
            let result = await this.props.addComment(
                normalFilter(value),
                "N",
                this.data.liveId,
                this.data.topicId,
                "text"
            );

            if (result && result.state && result.state.code == "0") {
                window.toast("评论发表成功！");

                let { commentNum } = this.state;
                commentNum += 1;

                this.domCommentList.refs.commentList.scrollIntoView();

                this.setState({
                    commentNum: commentNum,
                    showInput: false,
                    commentInputValue: ""
                });
            } else {
                window.toast(result.state.msg);
            }
        }
    };

    //后台收听按钮可不可见 1、未对接服务号 2、非专业版 3、非自媒体
    async isBtnListenBackendVisible() {
        let result = await this.props.getLiveLevelInfo(this.data.liveId);
        let level;

        if (result.data) {
            level = result.data.level;
        }

        this.setState({
            showBackstage:
                this.props.isSubscribe.isBindThird === false &&
                this.state.isLiveAdmin === "N" &&
                level === "normal"
        });
    }

    closeWeappCode = () => {
        this.setState({
            showWeappCode: false
        });
    };

    loadNextComments = async next => {
        const { commentLength } = this.state;
        const { commentIndex, commentList, topicInfo } = this.props;
        let { id, liveId } = topicInfo;
        let topicId = id;
        if (commentIndex + commentLength + 20 <= commentList.length) {
            this.setState({ commentLength: commentLength + 20 });
        } else {
            const lastIndex = commentList.length - 1;
            const timestamp = commentList[lastIndex].createTime;
            const result = await this.props.fetchCommentList(
                topicId,
                liveId,
                timestamp,
                "before"
            );
            this.setState({
                commentLength: commentList.length - commentIndex + result.length
            });
            if (result.length < 10) {
                this.setState({
                    isNoMore: true
                });
            }
        }
        next && next();
    };

    showInput = () => {
        this.setState({
            showInput: true
        });
    };

    handleInput = value => {
        this.setState({
            commentInputValue: value
        });
    };

    showMask = () => {
        this.setState({
            showInput: false
        });
    };

    showWeAppDialog = async () => {
        let result = await this.props.getWeappCode({
            width: 400,
            pageLink: `pages/topic-listening/topic-listening`,
            // pageLink: 'pages/index/index',
            scene: `topicId=${this.data.topicId}`
        });
        localStorage.setItem("hideBackendListenToolTip", "hide");
        this.setState({
            showWeappCode: true,
            weapp: "data:image/jpeg;base64," + result.base64Stream
        });
    };

    initedShare = false;

    get inviteAuditionUserId() {
        return this.props.location.query.inviteAuditionUserId;
    }

    ajaxSaveInvite = async () => {
        if (!this.inviteAuditionUserId) return;
        try {
            let result = await apiService.post({
                url: "/h5/invite/audition/saveInvite",
                body: {
                    inviteAuditionUserId: this.inviteAuditionUserId,
                    channelId: this.props.topicInfo.channelId,
                    topicId: this.props.topicInfo.id
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    isAuthChannel = async () => {
        let result = await isAuthChannel(this.props.topicInfo.channelId);
        this.setState({
            isAuthChannel: result
        }, () => {
            this.initShare()
        })
    }

    shareParamsTryListen = () => {
        if (!this.props.topicInfo.channelId) return '';
        if (this.state.isAuthChannel == 'Y') return '';
        return this.props.topicInfo.isAuditionOpen == "Y"
            ? "&inviteAuditionUserId=" + getCookie("userId")
            : "";
    };
    /**
     *
     * 初始化分享
     *
     * @memberof ThousandLive
     */
    initShare() {
        if (this.initedShare) {
            return;
        }
        // 拉人返学费分享
        if(this.state.showBackTuition){
            this.backTuitionDialogEle.initShare({
                data: this.props.topicInfo,
                missionId: this.data.missionDetail.missionId,
                type: this.props.topicInfo.channelId ? 'channel' : 'topic',
            })
            return
        }
        this.initedShare = true;
        let wxqltitle = this.props.topicInfo.topic;
        let descript = this.props.topicInfo.liveName;
        let wxqlimgurl = "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        // let shareUrl = window.location.origin + this.props.location.pathname + '?topicId=' + this.data.topicId + "&pro_cl=link";
        let isNl = "\n";

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
        let target =
            this.props.location.pathname +
            "?topicId=" +
            this.data.topicId +
            "&pro_cl=link" + this.shareParamsTryListen();
        let pre = `/wechat/page/live/${
            this.props.topicInfo.liveId
        }?isBackFromShare=Y&wcl=middlepage`;


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
            shareUrl: target,
            timelineTitle: friendstr,
        })


        if (this.props.lshareKey && this.props.lshareKey.shareKey) {
            shareObj.title = "我推荐-" + shareObj.title;
            shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
            shareObj.shareUr = shareObj.shareUr + "&lshareKey=" + this.props.lshareKey.shareKey;
        }else if (this.props.topicInfo.isAuditionOpen === "Y") {
            shareObj.title = this.props.topicInfo.topic;
            shareObj.desc = `${this.props.userInfo.name}送你一堂试听课`;
            shareObj.timelineTitle = shareObj.title;
            wxqlimgurl=shareBgWaterMark(this.props.topicInfo.channelImg,'study');
        }

        if (this.props.location.query.psKey || this.state.isOfficialLive === "Y") {
			pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
        }

        // 如果是听书
        if (this.props.isListenBook) {
            shareObj.timelineTitle = shareObj.title + "|" + shareObj.desc
            wxqlimgurl = imgUrlFormat(this.props.topicInfo.bookHeadImage, '?x-oss-process=image/resize,w_100,h_100,limit_1')
        }

        let onShareComplete = null
        /**
         * 分享回调需满足条件：
         * 1. 非专业版直播间
         * 3. 非白名单账号
         */
        const isLiveAdmin = this.state;
        const { isShowQl, subscribe } = this.props.isSubscribe;

        if (this.state.isLiveAdmin === "N" && !subscribe && isShowQl) {
            onShareComplete = this.onShareComplete;
            // this.getShareQr()
        }

        

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        shareObj.shareUrl = `${
            window.location.origin
        }/api/gos?target=${encodeURIComponent(
            encodeURIComponent(shareObj.shareUrl)
        )}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        console.log('分享信息: ', shareObj)
        let shareOptions = {
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: () => {
                if (this.props.topicInfo.isAuditionOpen == "Y") {
                    window._qla &&
                        window._qla("event", {
                            category: "auditionShare",
                            action: "success"
                        });
                }
                // 学分任务达成触发点
                uploadTaskPoint({
                    assignmentPoint: "grow_share_course"
                });
                console.log('分享成功');
                this.addShareComment();
                onShareComplete && onShareComplete();
            }
        };
        share(shareOptions);
    }


    // async getShareQr() {
    //     const result = await this.props.getQr({
    //         channel: '115',
    //         topicId: this.data.topicId,
    //         showQl: 'Y',
    //     })

    //     this.setState({ shareQrcodeUrl: result.data.qrUrl })
    // }

    getCreateLiveStatus = async () => {
        await wait(4000);

        if (this.props.isLogin) {
            let result = await Promise.all([
                this.props.isLiveAdmin(this.props.topicInfo.liveId),
                this.props.getCreateLiveStatus(this.props.topicInfo.id)
            ]);

            let isLiveAdmin = this.state.isLiveAdmin;
            let hasNotLive = this.state.hasNotLive;

            if(this.props.location.query.kfAppId && this.props.location.query.kfOpenId) {
                this.props.userBindKaiFang(this.props.location.query.kfAppId, this.props.location.query.kfOpenId)
            }

            if (getVal(result, "0.state.code") == 0) {
                isLiveAdmin = getVal(result, "0.data.isLiveAdmin", "N");
            }

            if (getVal(result, "1.state.code") == 0) {
                hasNotLive = getVal(result, "1.data.liveStatus");
            }

            this.setState(
                {
                    hasNotLive: hasNotLive != "Y",
                    isLiveAdmin
                },
                this.initShare
            )
        }
    }

    /**
     * 初始化轮播图
     *
     * @memberof TopicListening
     */
    async initAlbum() {
        let style = this.props.topicInfo.style;
        let result;
        let firstImg = {
            url: this.props.topicInfo.backgroundUrl,
            id: 0,
            fileId: 0
        };
        switch (style) {
            case "normal":
                result = await this.props.fetchTotalSpeakList({
                    type: "image",
                    topicId: this.props.topicInfo.id
                });
                if (result.state.code == 0) {
                    this.setState({
                        pptList: [
                            firstImg,
                            ...result.data.speakList.map(item => {
                                return { ...item, url: item.content };
                            })
                        ]
                    });
                }
                break;
            case "ppt":
                result = await this.props.getPPT({
                    status: "Y",
                    topicId: this.props.topicInfo.id
                });

                let currentPPTFileId = this.state.currentPPTFileId;
                if (result.state.code == 0) {
                    this.setState({
                        pptList: [firstImg, ...result.data.files],
                        currentPPTFileId:
                            !currentPPTFileId && result.data.files.length > 0
                                ? result.data.files[0].fileId
                                : currentPPTFileId
                    });
                }
                break;
        }
    }

    /**
     *
     * 切换到某张图片
     * @param {any} id
     * @memberof TopicListening
     */
    scrollToImg(id) {
        if (id) {
            this.setState({
                currentPPTFileId: id
            });
        }
    }

    showCourseListDialog() {
        if (!this.state.mountCourseListDialog) {
            this.setState({
                mountCourseListDialog: true
            });
        } else {
            this.setState(
                {
                    showCourseListDialog: true
                },
                () => {
                    const sameNode = document.querySelector(".select");
                    sameNode&&sameNode.scrollIntoView(true);
                }
            );
        }
    }

    hideCourseListDialog() {
        this.setState({
            showCourseListDialog: false
        });
    }

    setCourseList(courseList) {
        this.setState({
            courseList
        });
    }

    async initOfficialLive() {
        try {
            const [isWhiteLive, officialLiveIds] = await Promise.all([
                this.props.isServiceWhiteLive(this.props.topicInfo.liveId),
                this.props.getOfficialLiveIds()
            ]);

            let isOfficial = "N";
            let isWhite = "N";

            if (getVal(officialLiveIds, "state.code") == 0) {
                isOfficial = getVal(
                    officialLiveIds,
                    "data.dataList",
                    []
                ).includes(this.props.topicInfo.liveId);
                isOfficial = isOfficial ? "Y" : "N";
            }

            if (getVal(isWhiteLive, "state.code") == 0) {
                isWhite = getVal(isWhiteLive, "data.isWhite", "N");
            }

            console.log(isOfficial)

            this.setState({
                isOfficialLive: isOfficial,
                isWhiteLive: isWhite
            });
        } catch (error) {
            console.error(error);
        }
    }
    // 播放完成进入下个话题播放
    async gotoNextCourse() {
        if (!this.props.topicInfo.channelId) {
            return false;
        }
        const { topicInfo } = this.props;
        if (topicInfo && Object.is(topicInfo.isFreePublicCourse, "Y")) {
            return false;
        }
        const res = await this.props.fetchLastOrNextTopic({
            topicId: this.data.topicId,
            type: "all"
        })
        if (getVal(res, "state.code") == 0) {
            let nextId = getVal(res, "data.nextTopicId");
            let topicStyle = getVal(res, "data.topicStyle");
            // 如果是知识新闻类的话题 就会跳转至下一个音频极简页
            if (Object.is(topicInfo.isNewsTopic, "Y") && nextId) {
                locationTo(`/topic/details-listening?topicId=${nextId}`);
                return false;
            } else if (nextId) {
                const auth = await this.props.getAuth(nextId);
                const isAuth = auth.data && auth.data.isAuth;

                if (!isAuth) {
                    if(this.state.chargeConfig.discountStatus == 'UNLOCK') {
                        return
                    }
                    this.IsBuyDialog.show();
                    return;
                }

                // 判断下节课是否为所属系列课的第二节课，若是，则在跳转链接带上显示弹窗的参数
                const isSecondTopic = this.state.courseList.map(d => d.id).indexOf(nextId) === 1;

                switch (topicStyle) {
                    case "audio":
                    case "video":
                        locationTo(`/topic/details-video?topicId=${nextId}${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`);
                        break;

                    case "normal":
                    case "ppt":
                        locationTo(`/topic/details?topicId=${nextId}${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`);
                        break;

                    default:
                        locationTo(`/topic/details?topicId=${nextId}${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`);
                        break;
                }
            }
        }
    }

    /** 底部评论点击，弹出评论 */
    onClickCommentButton(type) {
        if (type === "interaction") {
            // 点击互动发言按钮，跳到对应的详情页
            switch (this.props.topicInfo.style) {
                case "video":
                case "audio":
                    locationTo(
                        "/topic/details-video?topicId=" +
                            this.props.topicInfo.id
                    );
                    break;
                case "normal":
                case "ppt":
                    locationTo(
                        "/topic/details?topicId=" +
                            this.props.topicInfo.id +
                            "&forbidLiveCenter=Y"
                    );
                    break;
            }
        } else if (type === "comment") {
            if (this.props.topicInfo.style === "audioGraphic") {
                this.showGraphicCommentDialog();
            } else {
                this.domCommentList.show();
            }
        }
    }


    /** 跳转到介绍页 */
    linkToIntro() {
        // locationTo(`/wechat/page/topic-intro?topicId=${this.props.topicInfo.id}`);
        this.domIntroDialog.show();
    }

    showGraphicCommentDialog() {
        this.setState({
            mountGraphicCommentDialog: true,
            showGraphicCommentDialog: true
        });
    }

    hideGraphicCommentDialog() {
        this.setState({
            showGraphicCommentDialog: false
        });
    }

    async initGraphicCommentCount() {
        const res = await this.props.graphicCommentCount({
            businessId: this.props.topicInfo.id
        });
        if (res.state.code === 0) {
            this.setState({
                graphicCommentCount: res.data.count || 0
            });
        }
    }

    addCommentCount() {
        this.setState({
            graphicCommentCount: this.state.graphicCommentCount + 1
        });
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
        this.refAudioPlayer.pauseAudio();
        // this.setState({ isShowAppDownloadConfirm: true });
		window.toast('打开千聊APP即可在后台收听')
		setTimeout(() => {
			this.goApp()
		}, 1000)
    };

    hideAppDownloadConfirm = () => {
        this.setState({ isShowAppDownloadConfirm: false });
    };

    initTopicRoleList = () => {
        getTopicRoleList(this.props.topicInfo.liveId, this.props.topicInfo.id)
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                let roleList = [];
                if (res.data) {
                    res.data.managerList &&
                        (roleList = roleList.concat(res.data.managerList));
                    res.data.guestList &&
                        (roleList = roleList.concat(res.data.guestList));
                }
                this.setState({
                    roleList
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    getAudioPlayerCurrentTime() {
        const time = this.refAudioPlayer.audioPlayer
            ? this.refAudioPlayer.audioPlayer.currentTime || 0
            : 0;
        return Math.floor(time);
    }

    onPlayerPlaying = () => {
        this.setState({
            playerStatus: "playing",
            isPlay: true
        });

        this.bulletScreen.play();

    };



    _gotoNextCourse = async () => {
        return this.gotoNextCourse();
    };

    getIsEvaluated() {
        if (!this._isEvaluatedPromise) {
            this._isEvaluatedPromise = request({
                url: "/api/wechat/transfer/h5/evaluate/getStatus",
                body: {
                    topicId: this.props.topicInfo.id
                }
            })
                .then(res => {
                    if (res.state.code) throw Error(res.state.msg);

                    return res.data.evaluateStatus !== "N";
                })
                .catch(err => {
                    return true;
                });
        }
        return this._isEvaluatedPromise;
    }

    getIsOpenEvaluate() {
        if (!this._isOpenEvaluatePromise) {
            this._isOpenEvaluatePromise = request({
                url: "/api/wechat/transfer/h5/live/entity/getIsOpenEvaluate",
                body: {
                    liveId: this.props.topicInfo.liveId
                }
            })
                .then(res => {
                    if (res.state.code) throw Error(res.state.msg);

                    return res.data.isOpenEvaluate === "Y";
                })
                .catch(err => {
                    return false;
                });
        }
        return this._isOpenEvaluatePromise;
    }

    onPlayerPause = () => {
        this.setState({
            isPlay: false
        });
        this.bulletScreen.pause();
    };

    onPlayerEnded = () => {
        this.setState({
            playerStatus: "ended",
            isPlay: false
        });
    };

    @throttle(1000)
    onPlayerTimeUpdate(currentTime) {
        this.setState({
            playerCurrentTime: currentTime
        });

        // 针对免费公开课要弹的提示
        if ((this.props.isListenBook || this.isFreePublicCourse) && this.props.topicInfo.duration > 120) {
            const rest = this.props.topicInfo.duration - currentTime;
            if (rest < 20) {
                // 在倒计时阶段会清除计时器
                (!this.state.isShowOperationTipsB ||
                    this._timerShowOperationTipsB) &&
                    this.controlOperationTips("B", true);
            } else {
                // 还在倒计时阶段不取消
                this.state.isShowOperationTipsB &&
                    !this._timerShowOperationTipsB &&
                    this.controlOperationTips("B", false);
            }

            if (rest < 10) {
                (!this.state.isShowOperationTipsA ||
                    this._timerShowOperationTipsA) &&
                    this.controlOperationTips("A", true);
            } else {
                this.state.isShowOperationTipsA &&
                    !this._timerShowOperationTipsA &&
                    this.controlOperationTips("A", false);
            }
        }
    }

    jumpToChannelIntro() {
        if (!this.props.topicInfo.channelId) {
            return;
        }
        let target = "";
        if (this.props.location.query.shareKey) {
            target += `&shareKey=${this.props.location.query.shareKey}`;
        }
        if (this.props.location.query.lshareKey) {
            target += `&lshareKey=${this.props.location.query.lshareKey}`;
        }
        // 如果其分享者（邀请他的人）拥有拉人返学费的资格 需要带上去missionId
        if (this.state.inviteFreeMissionId) {
            target += `&missionId=${this.state.inviteFreeMissionId}`;
        }
        locationTo(
            `/wechat/page/channel-intro?channelId=${
                this.props.topicInfo.channelId
            }${target}&sourceNo=invited`
        );
    }

    /**
     * 按钮操作提示控制器
     * @param {string} key 操作提示的唯一key
     * @param {number|boolean} ctrl 控制开关
     */
    controlOperationTips = (key, ctrl) => {
        const stateKey = `isShowOperationTips${key}`;
        const timeoutKey = `_timerShowOperationTips${key}`;
        if (!ctrl) {
            this.setState({ [stateKey]: false });
        } else if (typeof ctrl === "number" && ctrl > 0) {
            this.setState({ [stateKey]: true }, () => {
                this[timeoutKey] = setTimeout(() => {
                    this.setState({ [stateKey]: false });
                }, ctrl);
            });
        } else {
            clearTimeout(this[timeoutKey]);
            this[timeoutKey] = null;
            this.setState({ [stateKey]: true });
        }
    };

    // 是否免费公开课
    get isFreePublicCourse() {
        return this.props.topicInfo.isFreePublicCourse === "Y";
    }

    // 判断是否为知识新闻
    get isNewsTopic() {
        return this.props.topicInfo.isNewsTopic === "Y";
    }

    onChangeBulletScreenIsShowSendBar = isShow => {
        this.setState({ _bulletScreenIsShowSendBar: isShow });
    };
    // 是否为训练营
    get isCamp() {
        const { power } = this.props;
        const { joinCampInfo } = this.state;

        if (!power.allowSpeak && !power.allowMGLive) {
            if (
                Object.is(joinCampInfo.isCamp, "Y") &&
                Object.is(joinCampInfo.hasPeriod, "Y")
            ) {
                return true;
            }
            if (Object.is(joinCampInfo.joinCamp, "Y")) {
                return true;
            }
        }
        return false;
    }

    getLiveStatus() {
        let { startTime } = this.props.topicInfo;
        let { sysTime } = this.props;
        if (Number(sysTime) < Number(startTime)) {
            return false;
        }
        return true;
    }

    /***********************开始拉人返学费相关***************************/

    // 打开返学费弹窗
    openBackTuitionDialog = () => {
        this.backTuitionDialogEle.show({
            inviteTotal: this.data.missionDetail.inviteTotal,
            returnMoney: this.data.missionDetail.returnMoney,
            expireTime: this.data.missionDetail.expireTime,
            missionId: this.data.missionDetail.missionId,
            data: this.props.topicInfo,
            type: this.props.topicInfo.channelId ? "channel" : "topic"
        });
    };

    // 获取返学费信息
    initInviteReturnInfo = async () => {
        // 单节购买的课不支持返学费
        if (this.props.topicInfo.isSingleBuy === "Y") {
            return;
        }
        await request({
            url: "/api/wechat/transfer/h5/invite/return/inviteReturnInfo",
            body: {
                businessId:
                    this.props.topicInfo.channelId || this.props.topicInfo.id,
                businessType: this.props.topicInfo.channelId
                    ? "channel"
                    : "topic"
            }
        })
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                if (res.data) {
                    let showBackTuition = false;
                    if (
                        res.data.canInviteReturn == "Y" &&
                        res.data.hasMission == "Y"
                    ) {
                        let missionDetail = res.data.missionDetail;
                        this.data.missionDetail = missionDetail;
                        if (
                            missionDetail.status == "N" &&
                            missionDetail.expireTime > Date.now()
                        ) {
                            showBackTuition = true;
                            // 手动触发打曝光日志
                            setTimeout(() => {
                                typeof _qla != "undefined" &&
                                    _qla.collectVisible();
                            }, 100);
                        }
                    }
                    this.setState({ showBackTuition });
                    // 拉人返现需要重置
                    if (showBackTuition) {
                        this.initShare();
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
    /***********************结束拉人返学费相关***************************/

    async ajaxGetInviteDetail() {
        if (!this.props.topicInfo.channelId) return ;
        try {
            let result = await apiService.post({
                url: "/h5/invite/audition/inviteMissionInfo",
                body: {
                    channelId: this.props.topicInfo.channelId
                }
            });
            this.setState({
                inviteDetail: result.data.missionInfo
            });
        } catch (e) {
            console.error(e);
        }
    }

    async ajaxGetInviteList() {
        if (!this.props.topicInfo.channelId) return ;
        try {
            let result = await apiService.post({
                url: "/h5/invite/audition/inviteList",
                body: {
                    channelId: this.props.topicInfo.channelId
                }
            });
            return result.data.headImageList;
        } catch (error) {
            console.error(error);
        }
    }

    async onClickTryListenBar() {
        let { inviteNum, inviteTotal } = this.state.inviteDetail;
        if (inviteNum < inviteTotal) {
            this.ajaxGetInviteDetail();
            let inviteList = await this.ajaxGetInviteList();
            this.setState({
                tryListenMask: {
                    inviteList,
                    show: true
                }
            });
        } else {
            location.href = `/wechat/page/channel-intro?channelId=${
                this.props.topicInfo.channelId
            }&autopay=Y`;
        }
    }

    // 获取用户是否有创建的直播间
    async hasLive() {
        const result = await request({
            url: "/api/wechat/channel/getLiveList",
            method: "GET"
        });
        if (result.state.code === 0) {
            if (result.data.entityPo !== null) {
                this.setState({
                    isHasLive: true
                });
            }
        }
        this.setState({
            getHasLive: true
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

    async onIncrFansActivityBtnClick() {
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

    // 分享成功添加评论
    async addShareComment() {
        const res = await this.getShareCommentConfig();
        if(res && res.flag !== 'Y') return ;
        console.log('添加分享文案成功')
        this.props.addShareComment({
            userId: this.props.userId,
            liveId: this.props.liveInfo.entity.id,
            topicId: this.props.topicInfo.id
        });
    }

    async getShareCommentConfig() {
        const res = await this.props.dispatchGetShareCommentConfig({topicId: this.data.topicId, liveId: this.data.liveId});
        return res;
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
                if(!communityRecord) {
                    this.setState({
                        showGroupEntrance: true
                    });
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
        let { showWeappCode, weapp, showInput, commentInputValue } = this.state;
        let {commentList, isListenBook} = this.props;
        const node = document.querySelector(".flex-main-h");
        let isCend = isFromLiveCenter();
        const cls = classnames("topic-listening-page flex-body", {
            "topic-free-box": this.isFreePublicCourse
        });
        /**
         * app引导下载显示条件：非B端(老师、管理员、嘉宾) & (官方直播间 | (非专业版 & 非白名单直播间))
         */
        let isShowAppDownloadConfirmBtn =
            !this.props.power.allowMGLive &&
            !this.props.power.allowSpeak &&
            (this.state.isOfficialLive === "Y" || (this.state.isLiveAdmin === "N" && this.state.isWhiteLive === 'N'));

        const isShowPageFooter =
            this.state.isOfficialLive &&
            this.state._hasGetShareBtnStatus &&
            this.state._hasGetReceiveStatus;
        return (
            <Page
                title={this.props.topicInfo.topic}
                className={cls}
                ref={el => (this.pageRef = el)}
            >
                {/* <AppDownloadBar
                    isC={ true }
                    liveId={ this.props.topicInfo.liveId }
                    topicId={this.props.topicInfo.id}
                    isLiveAdmin={ this.state.isLiveAdmin }
                    isOfficialLive={ this.state.isOfficialLive }
                    isWhiteLive={ this.state.isWhiteLive }
                    style={'bottom'}
                /> */}
                {
                    !this.isUnHome && this.state.isOfficialLive === "Y" && !this.props.power.allowMGLive && !this.props.power.allowSpeak && <AppDownloadBar topicId={this.props.topicInfo.id} style="button" />
                }

                
                <IncrFansFocusGuideDialog
                    show={ this.state.showIncrFansFocusGuideDialog }
                    onClose={ this.onCloseIncrFansDialog }
                    incrFansFocusGuideConfigs={ this.state.incrFansFocusGuideConfigs }
                />

                <div className="flex-main-h page-container">
                    {
                        this.state.incrFansFocusGuideConfigs &&
                            <aside 
                                className='incr-fans-activity-btn on-log' 
                                onClick={ this.onIncrFansActivityBtnClick }
                                data-log-region='topicDetailFocusGuide'
                            >
                                <img src={ this.state.incrFansFocusGuideConfigs.button } />
                            </aside>
                    }
                    

                    {/* 通过领取好友分享的免费听课程获取 */}
                    {this.state.canListenByShare ? (
                        <div className="can-listen-by-share-container">
                            <p>
                                你是第{this.state.rank}个抢到的，
                                <em
                                    onClick={() => {
                                        this.receiveListOfInviteFriendsToListenDialog.show();
                                    }}
                                >
                                    看看还有谁抢到了>>
                                </em>
                            </p>
                            {this.state.remaining > 0 ? (
                                <p>
                                    剩余{this.state.remaining}
                                    个名额，点击右上角“…”分享给你的好友
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                    <div className="topic-player-container">
                        <div className="topic-info-wrap">
                            <div className="topic-info-box">
                                {this.state.pptList.length ? (
                                    <LanternSlide
                                        isShow={true}
                                        pptList={this.state.pptList}
                                        currentFileId={
                                            this.state.currentPPTFileId
                                        }
                                    />
                                ) : (
                                    <div className="topic-banner" onClick={ () => {
                                        !!this.state.teacherUrl && locationTo(this.state.teacherUrl)
                                    } }>
                                        <img
                                            src={`${
                                                this.props.topicInfo
                                                    .backgroundUrl
                                            }?x-oss-process=image/resize,h_375,w_600,m_fill,limit_0`}
                                            alt=""
                                        />
                                    </div>
                                )}
                                <div className="topic-name elli-text">
                                    {this.props.topicInfo.topic}
                                </div>
                                <BulletScreen
                                    ref={r => (this.bulletScreen = r)}
                                    topicInfo={this.props.topicInfo}
                                    bulletScreenControllerWrap={
                                        this.bulletScreenControllerWrapRef
                                    }
                                    mainContainer={
                                        this.pageRef &&
                                        this.pageRef.containerRef
                                    }
                                    currentTime={this.state.playerCurrentTime}
                                    roleList={this.state.roleList}
                                    userInfo={this.props.userInfo}
                                    playerStatus={this.state.playerStatus}
                                    onChangeIsShowSendBar={
                                        this.onChangeBulletScreenIsShowSendBar
                                    }
                                />
                            </div>
	                        
                            {
                                isListenBook && (this.props.topicInfo.bookConfigJumpUrl ? (
                                        <div
                                            className="live-name on-log"
                                            data-log-region="goto-live-index"
                                            onClick={() => locationTo(this.props.topicInfo.bookConfigJumpUrl)}>
                                            一起看书<i className="icon_enter"></i>
                                            </div>
                                    ) : (
                                        <div
                                            className="live-name placeholder">
                                            </div>
                                    )
                                )
                            }

                            {
                                !isListenBook && (
                                    this.isFreePublicCourse ? ( // 公开课个免费试听
                                        <div
                                            className="topic-own on-log"
                                            data-log-region="free-public-course"
                                            onClick={() => locationTo(this.props.topicInfo.channelUrl)}>
                                            <p><span>点击进入课程：{this.props.topicInfo.channelName}</span></p>
                                        </div>
                                    ) : (
                                        this.isNewsTopic ? null :
                                        (!this.isChannel && !window.sessionStorage?.getItem('freeColumnJumpUrl')
                                        ?
                                        <div className="live-name on-log"
                                            data-log-region="goto-live-index"
                                            onClick={() => locationTo(`/wechat/page/live/${this.props.topicInfo.liveId}`)}>
                                            {this.props.topicInfo.liveName}<i className="icon_enter"></i>
                                        </div>
                                        :
                                        <div
                                            className={ `topic-own audition on-log` }
                                            data-log-region="free-open-class"
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
                                                    do{
                                                        if(window.sessionStorage?.getItem('freeColumnWords')){
                                                            <span>{window.sessionStorage.getItem('freeColumnWords')}</span>
                                                        }else if(!this.isAudition){
                                                            <span>点击进入课程：{this.props.topicInfo.channelName}</span>
                                                        }else{
                                                            <span>免费试听中，点击了解完整课程内容</span>
                                                        }
                                                    }
                                                }
                                            </p>
                                        </div>
                                        // <div className="live-name on-log"
                                        //     data-log-region=""
                                        //     onClick={() => locationTo(this.props.topicInfo.channelUrl)}>查看所属系列课<i className="icon_enter"></i></div>
                                        )
                                    )
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

                            {/* 听书、知识新闻、公开课才显示 */}
                            {
                                !this.isUnHome && (isListenBook || this.isNewsTopic || this.isFreePublicCourse )?
                                    <HomeFloatButton style="top" />
                                    : null

                            }
                            
                            
                        </div>
                        <div
                            className="bullet-screen-controller-wrap"
                            ref={el =>
                                (this.bulletScreenControllerWrapRef = el)
                            }
                        />
                        <TopicAudioPlayer
                            topicInfo={this.props.topicInfo}
                            sysTime={this.props.sysTime}
                            topicId={this.props.topicInfo.id}
                            isLogin={this.props.isLogin}
                            showWeAppDialog={this.showWeAppDialog}
                            showBackstage={this.state.showBackstage}
                            isCampCourse={this.props.isCampCourse}
                            scrollToImg={this.scrollToImg}
                            showCourseListDialog={this.showCourseListDialog}
                            courseList={this.state.courseList}
                            gotoNextCourse={this._gotoNextCourse}
                            fetchTotalSpeakList={this.props.fetchTotalSpeakList}
                            fetchMediaUrl={this.props.fetchMediaUrl}
                            ref={r => (this.refAudioPlayer = r)}
                            onPlaying={this.onPlayerPlaying}
                            onPause={this.onPlayerPause}
                            onTimeUpdate={this.onPlayerTimeUpdate}
                            onEnded={this.onPlayerEnded}
                            shareBtnStatus = {this.state.shareBtnStatus}
                            isNewsTopic={ this.isNewsTopic }
                            isListenBook={isListenBook}
                            />
                    </div>

                    <GroupEntranceBar 
                        communityInfo={this.state.communityInfo}
                        businessId={this.data.topicId}
                        liveId={this.data.liveId}
                        onClose={this.onGroupEntranceClose}
                        hasBeenClosed={!this.state.showGroupEntrance}
                        padding=".533333rem"
                    />
                        

                    <TopicIntro
                        commentNum={this.state.commentNum}
                        linkToIntro={this.linkToIntro}
                        channelName={this.state.channelName}
                        topicName={this.props.topicInfo.topic}
                        topicIntro={this.props.topicInfo}
                        isNewsTopic={this.isNewsTopic}
                        isFreePublicCourse={this.isFreePublicCourse}
                        isListenBook={isListenBook}
                        /**拉人返学费 */
                        openBackTuitionDialog={this.openBackTuitionDialog}
                        showBackTuition={this.state.showBackTuition}
                        returnMoney={
                            Number(this.data.missionDetail.returnMoney) || 0
                        }
                        /*********/
                    />
                    {/* <ScrollToLoad
                        toBottomHeight={300}
                        loadNext={this.loadNextComments}
                        noneOne={ this.props.commentList.length === 0 }
                        notShowLoaded = {false}
                        noMore={this.state.isNoMore}
                        className='empty-comment'
                    >

                    </ScrollToLoad> */}

                    {
                        (this.tracePage!=="coral"&&!isListenBook && (!this.isFreePublicCourse && !this.isNewsTopic)) && (
                            <GuestYouLike
                                liveId={this.props.topicInfo.liveId}
                                businessType={ this.props.topicInfo.channelId ? 'channel' : 'topic' }
                                businessId={ this.props.topicInfo.channelId || this.props.topicInfo.id }
                                dimensionType="browse"
                                isShowQlvipEntry={this.state.isOfficialLive === "Y"}
                                urlParams={{
                                    wcl: 'promotion_details-listening',
                                    originID: this.props.topicInfo.id
                                }}
                                isShowAd={ this.state.isOfficialLive === "Y" }
                                render={children =>
                                    <div>
                                        <div className="section-title">
                                            <p>猜你喜欢</p>
                                        </div>
                                        {children}
                                    </div>
                                }
                            />
                        )
                    }

                    <div
                        className="mask"
                        style={{
                            display: showInput ? "block" : "none"
                        }}
                        onClick={this.showMask}
                    />
                </div>


                <div className="sider-bar">
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


                <div className="flex-other">
                    {
                        isShowPageFooter && (
                            <CollectVisible>
                                <CommentInput
                                    topicInfo={this.props.topicInfo}
                                    onCommentClick={this.onClickCommentButton}
                                    graphicCommentCount={
                                        this.state.graphicCommentCount
                                    }
                                    sysTime={this.props.sysTime}
                                    isShowAppDownloadConfirmBtn={
                                        isShowAppDownloadConfirmBtn
                                    }
                                    showAppDownloadConfirm={
                                        this.showAppDownloadConfirm
                                    }
                                    shareBtnStatus={this.state.shareBtnStatus}
                                    shareRemaining={this.state.shareRemaining}
                                    openInviteFriendsToListenDialog={
                                        this.openInviteFriendsToListenDialog
                                    }
                                    canListenByShare={
                                        this.state.canListenByShare
                                    }
                                    jumpToChannelIntro={this.jumpToChannelIntro}
                                    isFreePublicCourse={
                                        this.isFreePublicCourse
                                    }
                                    isNewsTopic = {this.isNewsTopic}
                                    likeClick ={ this.likeClick}
                                    likeObj = { this.state.likeObj }
                                    tipsShow={this.state.tipsShow}
                                    power = {this.props.power}
                                />
                            </CollectVisible>
                        )
                    }
                </div>
                <MiddleDialog
                    show={showWeappCode}
                    onClose={this.closeWeappCode}
                >
                    <div className="weapp-code-header">
                        长按识别小程序码 <br />
                        边聊微信边听
                    </div>
                    <img className="weapp-code" src={weapp} />
                </MiddleDialog>
                {this.state.mountCourseListDialog && (
                    <CourseListDialog
                        sysTime={this.props.sysTime}
                        topicInfo={this.props.topicInfo}
                        showCourseListDialog={this.state.showCourseListDialog}
                        hideCourseListDialog={this.hideCourseListDialog}
                        // onCloseSettings = {this.hideControlDialog}
                        setCourseList={this.setCourseList}
                        canListenByShare = {this.state.canListenByShare}
                        jumpToChannelIntro = {this.jumpToChannelIntro}
                        isNewsTopic={ this.isNewsTopic }
                        isPlay={ this.state.isPlay }
                        isListenBook={isListenBook}
                        isBussiness={this.props.power.allowSpeak || this.props.power.allowMGLive}
                    />
                )}
                <ReceiveListOfInviteFriendsToListen
                    ref={el =>
                        (this.receiveListOfInviteFriendsToListenDialog = el)
                    }
                    userList={this.state.userList}
                    remaining={this.state.remaining}
                />

                {/* {
		            this.props.topicInfo.isAuditionOpen === 'Y' && !this.props.power.allowMGLive && this.props.topicInfo.channelId &&
                    <div className="audition-tip">
                        <span>免费试听中，购买系列课收听全部课程。</span>
                        <div className="buy-btn" onClick={ () => locationTo(
				            `/live/channel/channelPage/${this.props.topicInfo.channelId}.htm?autopay=Y&shareKey=${this.props.location.query.shareKey || ''}`,
				            `/pages/channel-index/channel-index?channelId=${this.props.topicInfo.channelId}&shareKey=${this.props.location.query.shareKey || ''}`
			            ) }>立即购买</div>
                    </div>
	            } */}

                <CommentList
                    ref={value => {
                        this.domCommentList = value;
                    }}
                    data={commentList}
                    commentNum={this.state.commentNum}
                    onSendComment={this.addComment}
                    loadNextComments={this.loadNextComments}
                    noneOne={this.props.commentList.length === 0}
                    noMore={this.state.isNoMore}
                    topicStyle={this.props.topicInfo.style}
                    power={this.props.power}
                    isHasLive={this.state.isHasLive}
                    getHasLive={this.state.getHasLive}
                    isLiveAdmin={ this.state.isLiveAdmin }
                    isShowQl = {this.props.isSubscribe.isShowQl}
                />

                {/* 邀请好友免费听弹窗 */}
                <InviteFriendsToListen
                    ref={el => (this.inviteFriendsToListenDialog = el)}
                    inviteFreeShareId={this.state.inviteFreeShareId}
                    //关闭弹窗后重新初始化分享
                    onClose={this.initShare}
                    canListenByShare={this.state.canListenByShare}
                    userId={this.props.userId}
                    coralInfo={this.state.coralInfo}
                    source={this.props.location.query.source}
                />

                <IntroDialog
                    ref={dom => (this.domIntroDialog = dom)}
                    topicInfo={this.props.topicInfo}
                    topicProfile={this.props.topicProfile}
                    channelProfile={this.props.channelProfile}
                    noProfileData={this.state.noProfileData}
                    commentNum={this.state.commentNum}
                    topicDesc={this.state.topicDesc}
                    channelDesc={this.state.channelDesc}
                    isNewsTopic={ this.isNewsTopic }
                    isListenBook={isListenBook}
                    topicManuscript={this.state.topicManuscript}
                />

                {/* 拉人返学费弹窗 */}
                <BackTuitionDialog
                    ref={el => (this.backTuitionDialogEle = el)}
                    initShare={this.initShare}
                />

                {/* 奖学金分享弹窗 */}
                <ScholarshipDialog
                    ref={el => (this.scholarshipDialogEle = el)}
                    initShare={this.initShare}
                />

                <IsBuyDialog
                    title="试听已结束"
                    desc="购买系列课即可学习所有课程"
                    confirmText="购买系列课"
                    cancelText="查看课程介绍"
                    money={formatMoney(this.props.topicInfo.money)}
                    onBtnClick={() => {
                        locationTo(
                            `/live/channel/channelPage/${
                                this.props.topicInfo.channelId
                            }.htm`
                        );
                    }}
                    ref={dom => (this.IsBuyDialog = dom)}
                />

                {this.props.topicInfo.style === "audioGraphic" &&
                    this.state.mountGraphicCommentDialog && (
                        <GraphicCommentDialog
                            show={this.state.showGraphicCommentDialog}
                            topicId={this.props.topicInfo.id}
                            courseStyle="audioGraphic"
                            graphicCommentCount={this.state.graphicCommentCount}
                            hideCommentDialog={this.hideGraphicCommentDialog}
                            addCommentCount={this.addCommentCount}
                            getMediaPlayerCurrentTime={
                                this.getAudioPlayerCurrentTime
                            }
                            power={this.props.power}
                            getHasLive={this.state.getHasLive}
                            isHasLive={this.state.isHasLive}
                        />
                    )}

                {this.state.isShowAppDownloadConfirm && (
                    <AppDownloadConfirm
                        onClose={this.hideAppDownloadConfirm}
                        downloadUrl="http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1401379583238"
                    />
                )}

                {this.state.isShowOperationTipsA && !this.isAudition && (
                    <div className={ `operation-tips tips-1` }>
                        好内容不妨分享给亲友一起听！
                    </div>
                )}

                {isShowPageFooter &&
                    this.state.isShowOperationTipsB &&
                    !this.isAudition &&
                    !this.state._bulletScreenIsShowSendBar && (
                        <div className={ `operation-tips  ${ this.isAudition ? 'tips-anim' : '' } tips-2` }>
                            欢迎在此写下你的想法或收获哦！
                        </div>
                    )}
                {/* 作业提示 */}
                {node && this.isCamp && this.getLiveStatus() && (
                    <JobReminder
                        channelId={this.props.topicInfo.channelId}
                        topicId={this.data.topicId}
                        targetNode={node}
                    />
                )}

                {this.state.tryListenMask.show ? (
                    <TryListenShareMask
                        {...this.state.inviteDetail}
                        isBindThird={this.props.isSubscribe.isBindThird}
                        isFocusThree={this.props.isSubscribe.isFocusThree}
                        liveId={this.data.liveId}
                        topicId={this.data.topicId}
                        channelId={this.props.topicInfo.channelId}
                        subscribe={this.props.isSubscribe.subscribe}
                        imageList={this.state.tryListenMask.inviteList}
                        onClose={() => {
                            this.setState({
                                tryListenMask: {
                                    ...this.state.tryListenMask,
                                    show: false
                                }
                            });
                        }}
                    />
                ) : null}

                {/* 留资弹窗 */}
				<DialogMoreUserInfo
					visible={!!this.state.isDialogMoreInfoVisible}
					userId={this.props.userId || this.props.userInfo.userId}
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

TopicListening.propTypes = {};
function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime,
        userInfo: state.common.userInfo.user,
        power: state.thousandLive.power,
        topicInfo: state.thousandLive.topicInfo,
        commentList: state.thousandLive.commentList,
        commentIndex: state.thousandLive.commentIndex,
        isLogin: state.thousandLive.isLogin,
        isSubscribe: state.thousandLive.isSubscribe,
        lshareKey: state.thousandLive.lshareKey,
        isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',
        isListenBook: get(state, 'thousandLive.topicInfo.isBook') === 'Y',
        topicProfile: state.thousandLive.topicProfile,
        channelProfile: state.thousandLive.channelProfile,
        isLiveAdmin: state.common.isLiveAdmin,
        userId: state.thousandLive.userId,
        liveInfo: state.thousandLive.liveInfo
    };
}

const mapActionToProps = {
    fetchCommentList,
    fetchTotalSpeakList,
    addComment,
    updateCommentIndex,
    isLiveAdmin,
    getCreateLiveStatus,
    getLiveLevelInfo,
    getWeappCode,
    getQr,
    getPPT,
    getOfficialLiveIds,
    isServiceWhiteLive,
    fetchLastOrNextTopic,
    fetchMediaUrl,
    getChannelInfo,
    getTopicProfile,
    getChannelProfile,
    addPageUv,
    getAuth,
    graphicCommentCount,
    getEditorSummary,
    getUserInfo,
    bindOfficialKey,
    userBindKaiFang,
    getLike,
    addLikeIt,
    fetchQrImageConfig,
    addShareComment,
    dispatchGetShareCommentConfig
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(TopicListening);
