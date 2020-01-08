const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
// import { BottomDialog, Confirm } from 'components/dialog';
import { locationTo, imgUrlFormat,  digitFormat, formatDate, dangerHtml, getCookie, sortBy, isFromLiveCenter } from 'components/util';
import { share } from 'components/wx-utils';

import Swiper from 'react-swipe';
import Indicator from './swiper-indicator';
// import LiveChannelItem from './components/channel-item'
// import LiveTopicItem from './components/topic-item'
import { fillParams } from 'components/url-utils'

import SymbolList from './components/symbol-list';
import PyramidDialog from 'components/dialogs-colorful/pyramid';
import QRImg from 'components/qr-img';
import TeacherCupDialog from 'components/dialogs-colorful/teacher-cup';
import LiveVDialog from 'components/dialogs-colorful/live-v';
import HotHeart from 'components/dialogs-colorful/hot-heart';
import Spokesperson from 'components/dialogs-colorful/spokesperson';
import TopicActionSheet from './components/topic-bottom-actionsheet';
import TrainingActionSheet from '../checkin-camp-list/components/training-bottom-action';
import ChannelActionSheet from './components/channel-bottom-actionsheet';
import GroupBottomActionSheet from './components/group-bottom-actionsheet';
import CheckinCampActionSheet from '../checkin-camp-list/components/checkin-camp-bottom-actionsheet';
import { FunctionBtn } from './components/function-menu'
import { FunctionMenu } from 'components/studio-index/components/function-menu';

// import LiveFocusQrDialog from 'components/dialogs-colorful/focus-qrcode';
import CommunityGuideModal from 'components/community-guide-modal';
import FollowDialog from './components/follow-dialog';

import MiniCheckinCampList from './components/mini-checkin-camp-list';
import MiniTrainingList from './components/mini-training-list';
import MiniTopicList from './components/mini-topic-list';
import MiniChannelList from './components/mini-channel-list';
import MiniTimeLineList from './components/mini-timeline-list';
import MiniKnowledgeList from './components/mini-knowledge-list';
import MiniGroupList from './components/mini-group-list';
import TopSearchBar from './components/top-search-bar';
import MiddlePageDialog from './components/middle-page-dialog';
import Picture from 'ql-react-picture';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import CompanyDialog from 'components/dialogs-colorful/company'

import BottomBrand from "components/bottom-brand";

import { render } from 'components/indep-render';

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
    getLiveMiddlepageCourse,
    // getWhiteForNewLiveIndex
    toggleDisplayMenu,
    getCustomLiveFunctions
} from '../../actions/live';

import {
    getUnreadCount
} from '../../actions/notice-center';
import { whatQrcodeShouldIGet, getCommunity, request, isFunctionWhite, checkEnterprise } from 'common_actions/common';
import { getDomainUrl } from "../../../actions/common";

import { fetchPageShare } from '../../actions/live-studio';

import {
    fetchCheckinCampList,
    fetchTrainingList
} from '../../actions/live-studio';
import { autobind } from 'core-decorators';
import MiddleDialog from 'components/dialog/middle-dialog';
import TopTabBar from './components/top-tab-bar';
import MiniTrainingListV2 from './components/mini-training-list-v2';

// 列表中的模块都不显示时，展示空样式
const EMPTY_CHECK_LIST = ["channel", "topic", "camp", "training"]

@autobind
class StudioLiveMain extends Component {

    constructor(props, context) {
        super(props, context);
        this.liveId = this.props.params.liveId
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
        focusQrAppId: '',
        topTipQrCode: false,
        topTipAppId: '',
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

        showTopTopic: true,
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
        show1ActionSheet: false,
        // 是否展示引导分享的弹层（部分页面分享链接返回后，没关注的用弹出）
        isShowMiddlePage: false,
        middlePageQrcodeUrl: '',

        // 埋点
        channelIndex: 0,
        checkinCampIndex: 0,
        trainingIndex: 0,
        topicIndex: 0,

        isOfficial: false,

        // 打卡训练营模块
        checkinCampList: [],
        // 训练营模块
        trainingList: [],

        /* 功能菜单是否可见 */
        functionMenuVisible: false,

        followDialogTitle: '',
        followDialogDesc: '',
        followDialogOption: {
            channel: '101',
            traceData: 'studioLiveFocusQrcode'
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
        enterprisePo: {},

        communityInfo: null, // 社群信息
        isShowGroupDialog: false, // 显示加入社群弹窗
        showCourseTab: false, // 显示课程吸顶导航栏
        currentTopTab: null, // 当前视野内最顶部的模块
        showLiveQrcodeDialog: false,  // 直播间二维码弹窗
        showCancelFocusDialog: false, // 取消关注二次确认弹窗
        showGroupActionSheet: false,
        tabList: [],
        hasLiveVip: false,
        liveisBindApp: false,
        liveBindGong: false,
        liveAppQrCode: null
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
        console.log(`
        =======================
           尊贵的专业版用户您好！
        =======================
        `);

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

        //liveBanner
        if(this.props.bannerList.length < 1) {
            const result = await this.props.initBannerList(this.liveId)
            if(result) {
                this.setState({
                    bannersFlag: this.state.bannersFlag + 1,
                })
            }
        }

        this.props.getCustomLiveFunctions({liveId: this.liveId});

        // this.props.getChannelNumAndTopicNum(this.liveId)
        this.props.getTopic(this.liveId, this.props.topicPage)
        this.props.getChannel(this.liveId, this.props.channelPage, '', 'N')
        // this.props.getTraining(this.liveId, this.props.trainingPage);
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

        //这个要在 liveFocus 前
        if(this.props.location.query.kfAppId && this.props.location.query.kfOpenId) {
            this.props.userBindKaiFang(this.props.location.query.kfAppId, this.props.location.query.kfOpenId)
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

        if(this.props.location.query.lshareKey || this.props.location.query.shareKey) {
            await this.props.bindLiveShare(this.liveId , this.props.location.query.lshareKey || this.props.location.query.shareKey )
            this.props.liveFocus("Y", this.liveId)
        }

        this.initShare()
        this.getDomain('shortKnowledge');

        if(this.props.location.query.auditStatus==="pass"){
            this.props.liveFocus("Y", this.liveId)
        }

        this.props.addPageUv('', this.liveId,'liveUv', this.props.location.query.pro_cl || getCookie('channelNo') || '');

        // setInterval(() => {
        //     this.changeTimelineHandle()
        // }, 3000)

        // 官方直播间不显示关注人数
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

	    if(isFromLiveCenter()){
		    // 清除C端来源标识
		    sessionStorage.removeItem('trace_page');
	    }
        
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);

        // 拿用户名和头像
        await this.props.getUserInfo();


        // 如果是从分享链接返回到此页面，并且没有关注公众号，则弹层引导
        if (this.props.location.query.isBackFromShare === 'Y' && this.tracePage !== 'coral') {
            await this.handleBackFromShare();
        }

        // C端用户获取是否直播间有关联社群
        if (!this.props.power.allowMGLive) {
            try {
                const data = await getCommunity(this.liveId, 'live', this.liveId);
                this.setState({
                    existCommunity: data && data.showStatus == 'Y',
                    communityCode: data && data.communityCode,
                    communityName: data && data.communityName,
                }, () => {
                    if (this.state.existCommunity && this.data.from == 'templateMsg') {
                        this.setState({
                            showCommunityGuideModal: true,
                            modalType: 'followLive'
                        });
                    }
                });
            } catch(err) {
            }
        }

        this.dispatchGetCommunity();


        // 获取直播间模块
        await this.handleFetchTrainingList()
        await this.fetchCampList();
        this.getTagLists();
        this.genTabList();
        this.getHasLiveVip();
        this.getLiveApp();
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

    genTabList() {
        this.addBtnDom = document.querySelector('#newCourseBtn');
        const {
            topic={},
            channel={},
            camp={},
            training={},
        } = this.props.liveInfo
        
        let pageMenu = [
            { itemCode: 'topic', ...topic },
            { itemCode: 'channel', ...channel },
            { itemCode: 'camp', ...camp},
            { itemCode: 'training', ...training},
        ]

        pageMenu = pageMenu.sort(sortBy('sort',true))
        let tablist = [];
        pageMenu.forEach(item => {
            if(item.isShow === "Y") {
                switch(item.itemCode) {
                    case "camp":
                        if(this.state.checkinCampList.length > 0) {
                            tablist.push({
                                name: item.name,
                                ele: "checkin-camp-list",
                                region: "topMenuOldCamp"
                            });
                        }
                        break;
                    case "channel":
                        tablist.push({
                            name: item.name,
                            ele: "channel-list",
                            region: "topMenuChannel"
                        });
                        break;
                    case "training":
                        if(this.state.trainingList.length > 0) {
                            tablist.push({
                                name: item.name,
                                ele: "training-list",
                                region: "topMenuCamp"
                            });
                        }
                        break;
                    case "topic":
                        tablist.push({
                            name: item.name,
                            ele: "new-topic",
                            region: "topMenuTopic"  
                        });
                        break;
                    default:
                        break;
                }
            }
        });
        this.setState({
            tabList: tablist
        })
    }
    /**
     * 是否是白名单 再去请求
     */
    async handleFetchTrainingList(tagId, paginate = true) {
        // 训练营模块
        const result = await fetchTrainingList({
            liveId: this.liveId,
            tagId,
            page: {
                page: 1,
                pageSize: 20
            },
            status: 'Y'
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

    async initShare() {
        await Promise.all([
            this.props.initLiveShareQualify(this.liveId),
            this.props.fetchPageShare({ liveId: this.liveId })
        ])
        
        /* 分享配置 */
        const shareOption = {
            title: this.liveName,
            timelineTitle: this.liveName,
            desc: this.props.liveInfo.entity.introduce,
            timelineDesc: "欢迎大家关注直播间:" + this.liveName, 
            imgUrl: this.props.liveInfo.entity.logo,
        }

        /* 带分销的分享 */
        if (this.props.shareQualify && this.props.shareQualify.id) {
            shareOption.title = "我推荐-" + this.liveName
            shareOption.timelineDesc = "我推荐-欢迎大家关注直播间:" + this.liveName // 分享到朋友圈单独定制
            shareOption.shareUrl = location.origin + "/" + this.props.shareQualify.shareUrl
            shareOption.shareUrl = fillParams({}, shareOption.shareUrl, ['isFromWechatCouponPage','kfOpenId','kfAppId','auditStatus']);
        }

        /* 页面自定义的分享 */
        const { title = '', introduce = '', url='' } = (this.props.pageShare || {})
        
        if (title) {
            shareOption.title = title
            shareOption.timelineTitle = title
            shareOption.timelineDesc = title
        }
        if (introduce) {
            shareOption.desc = introduce
        }
        if (url) {
            shareOption.imgUrl = url
        }

        share(shareOption)
    }

    openTopTipDialogHandle = async () => {
        this.setState({
            showLiveTopTipDialog: true
        })
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
                    topTipAppId: result.appId,
                })
            }
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
            showLiveTopTipDialog: false
        })
    }
    closeLiveFocusQrDialog = () => {
        this.setState({
            showLiveFocusQrDialog: false
        })
    }

    async getCompany(){
		const { data = {} } = await checkEnterprise({liveId: this.props.liveId,});
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
    // 显示公司信息
    handleCompany = () => {
        this.setState({
            isCompany: true
        })
    }
    closeCompany = () => {
        this.setState({
            isCompany: false
        })
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

    gotoHandle = (url, type, businessId) => {
        switch(type) {
            case "channel":
                locationTo("/live/channel/channelPage/" + businessId + ".htm");
                break
            case 'topic':
                locationTo("/wechat/page/topic-intro?topicId="+ businessId);
                break;
            case "training":
                locationTo("/wechat/page/training-intro?campId=" + businessId);
                break
            case 'liveCamp':
                locationTo("/wechat/page/camp-detail?campId="+ businessId);
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
        // const isFollow = await this.props.liveFocus(
        //     this.props.focusStatues.isFollow ? "N" : "Y",
        //     this.props.liveId
        // )
        /** 珊瑚来源不引导关注 */
        if(!(focusState === "pass")  && this.tracePage !== 'coral'){
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
                    traceData: 'studioLiveFocusQrcode'
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
        
        // if(this.props.focusStatues.isFollow) {
        // }
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

    // showInfoHandle = async () => {
    //     if (!this.data.ifGetLiveIntro) {
    //         const result = await this.props.getLiveIntroPhoto(this.props.liveId)
    //         if(result) {
    //             this.data.ifGetLiveIntro = true
    //             this.setState({
    //                 showInfo: true
    //             })
    //         }
    //     } else {
    //         this.setState({
    //             showInfo: true
    //         })
    //     }

    // }
    // closeInfoHandle = (e) => {
    //     if(e.target.className == "liveIntro-back") {
    //         this.setState({
    //             showInfo: false
    //         })
    //     }
    // }

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
                    traceData: 'studioLiveFocusQrcode',
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

    loadMoreTopic = async () => {
        await this.props.getTopic(this.props.liveId, this.props.topicPage + 1)
    }
    loadMoreChannel = async () => {
        await this.props.getChannel(this.props.liveId, this.props.channelPage + 1, '', 'N')
    }

    get liveTitle() {
        if (this.props.liveInfo.info && this.props.liveInfo.info.pageTitle){
            return this.props.liveInfo.info.pageTitle;
        }
        if (this.props.liveInfo.entityExtend && this.props.liveInfo.entityExtend.title) {
            return this.props.liveInfo.entityExtend.title;
        } else {
            return this.props.liveInfo &&
                   this.props.liveInfo.entity &&
                   this.props.liveInfo.entity.name || "直播间主页"
        }
    }

    get liveName() {
        return this.props.liveInfo &&
               this.props.liveInfo.entity &&
               this.props.liveInfo.entity.name || "直播间主页"
    }



    /**
     * 
     * 默认模块点击处理
     * @param {any} item 
     * @memberof StudioLiveMain
     */
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

    async getDomain(type){
        try{
            let result = await this.props.getDomainUrl({
                type,
            });
            if(result.state.code === 0){
                if(type === 'shortKnowledge'){
                    this.setState({
                        shortDomainUrl: result.data.domainUrl,
                    });
                }
            }
            console.log(result)
        }catch(err){
            console.log(err)
        }
        
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
        if(!unreadMap) return;
        let sum = 0;
        Object.keys(unreadMap).forEach(key  => {
            sum += unreadMap[key];
        });
        return sum;
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
          console.log('=====')
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
        }).catch(err => {console.log(',.,.,.,.',err)})
    }

    onClickGroup(group) { 
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

     onToggleDisplayMenu = (e, showMenuStatus) => {
        e && e.stopPropagation();

        this.props.toggleDisplayMenu(this.liveId, showMenuStatus);
        
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    onClickCourseOperate = async course => {
        if (course.tagId === undefined) {
            window.loading(true);
            await request.post({
                url: '/api/wechat/transfer/h5/businessTag/getTagId',
                body: {
                    businessType: this.props.businessType,
                    businessId: course.id,
                }
            }).then(res => {
                course.tagId = res.data.tagId || 0;
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                window.loading(false);
            })
        }
        this.setState({
            showBottomActionSheet: true,
            curOperateCourse: course,
        })
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
                    // 是否存在tag， 不存在则变成全部
                    let flag = item.data.tagList.find(tag => tag.id == curTag);
                    console.log('curTag', curTag, flag)
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
                    liveisBindApp: true
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
        const {
            liveFunction={},
            feed={},
            topic={},
            channel={},
            info={},
            camp={},
            training={},
            community:group = {},
            shortKnowledge = {}
        } = this.props.liveInfo

        let pageMenu = [
            { itemCode: 'feed', ...feed },
            { itemCode: 'group', sort:10, ...group},
            { itemCode: 'topic', ...topic },
            { itemCode: 'channel', ...channel },
            { itemCode: 'camp', ...camp},
            { itemCode: 'training', ...training},
            { itemCode: 'shortKnowledge', ...shortKnowledge},
        ]

        pageMenu = pageMenu.sort(sortBy('sort',true))

        const focusState = this.props.focusStatues.isFollow ?  (this.props.focusStatues.isAlert ? 'pass' : 'attention_pass') : (this.props.focusStatues.isAlert ? null : 'no_pass');

        return (
            <Page title={this.liveTitle} className='live-main' onScroll={this.scrollHandler}>
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
                    this.props.power.allowMGLive &&
                    this.addBtnDom ?
                    createPortal(
                        <FunctionBtn
                            key='btn'
                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                        />,
                        this.addBtnDom
                    ) : null
                }
                <div className="live-container co-scroll-to-load">
                      <TopSearchBar 
                        liveId={this.liveId}
                        liveisBindApp={this.state.liveisBindApp}
                        isBindApp={!!this.state.liveAppQrCode}
                        onQrCode={() => {this.setState({showLiveQrcodeDialog: true})}}
                        shareQualify={this.props.shareQualify}
                        hasLiveVip={this.state.hasLiveVip}
                        allowMGLive={this.props.power.allowMGLive} 
                        newMessageCount={this.calUnreadNum(this.props.unreadMap)}
                        onClickNoticeCenter={this.goNoticeCenter}  
                    />
                    {
                        info.isShow != 'N' ?
                        <div className="header-bar">
                            <div className="left-con">
                                <div className="live-log on-log" data-log-region="head" onClick={this.onAvartarClick}>
                                    <div className="c-abs-pic-wrap"><Picture src={this.props.liveInfo.entity.logo} placeholder={true}  resize={{w:'100', h: "100"}} /></div>
                                </div>
                                <div className="live-header-middle-con">
                                    <div className={`live-name ${this.props.power.allowMGLive ? "b-end" : ""}`}>
                                        <div className="name">{this.liveName}</div>
                                    </div>
                                    <SymbolList className="symbol-list"
                                            symbolList={this.props.symbolList}
                                            isallowGLive={this.props.power.allowMGLive}
                                            handleRealNameBtnClick={this.handleRealNameBtnClick}
                                            showPyramidDialog={this.pyramidClick}
                                            isReal={this.state.checkUserStatus == 'pass'}
                                            isLiveCreator={this.state.isLiveCreator}
                                            isCompany={Object.is(this.state.enterprisePo.status, 'Y')}
                                            handleVClick={this.handleVClick}
                                            handleTClick={this.handleTClick}
                                            handleHotClick={this.handleHotClick}
                                            handleDaiClick={this.handleDaiClick}
                                            handleCompany={ this.handleCompany }
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
                                        className={`on-log on-visible ${focusState === "pass" ? "focus-tag focused" : "focus-tag"}`}
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
                                        <div className='live-name-btn on-log on-visible' data-log-region="shareLiveCard" data-log-pos="B" onClick={() => {locationTo(`/wechat/page/sharecard?type=live&liveId=${this.props.liveId}`)}}><img src={require('./img/invite.png')} alt=""/></div>
                                    </>
                                }
                            </div>
                    </div>
                        </div>
                        :null    
                    }
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
                                                        <div className="banner-pic-wrap"><Picture src={item.imgUrl} placeholder={true} resize={{w:'710', h: '206', m:"fill", limit:"1"}} /></div>
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
                                                            <div className="banner-pic-wrap"><Picture src={this.props.liveInfo.entity.headerBgUrl} placeholder={true} resize={{w:'710', h: '206', m:"fill", limit:"1"}} /></div>
                                                        </span>
                                                    </div>
                                                    :
                                                    <div
                                                        key={`banner-item`}
                                                        className='banner-item on-log on-visible'
                                                        data-log-region="banner"
                                                    >
                                                        <span>
                                                            <div className="banner-pic-wrap">
                                                                <Picture src="https://img.qlchat.com/qlLive/activity/image/XWGRSQI9-JUD2-5BDP-1574251608851-O3149GB9FPS7.png"
                                                                placeholder={true}
                                                                resize={{w:'710', h: '206'}} />
                                                            </div>
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
                        !this.props.power.allowMGLive && (liveFunction.isShow !== 'Y' || !liveFunction.functions || liveFunction.functions.length <= 0 || liveFunction.functions.filter(item => item.isShow === 'Y').length <= 0) ?
                        null
                        :
                        <div className="menu">
                            {
                                liveFunction.functions && liveFunction.functions.length >0 && liveFunction.functions.filter(item => item.isShow === 'Y').length > 0 && liveFunction.isShow === 'Y' ?
                                <div className="menu-container">
                                {
                                    liveFunction.functions && liveFunction.functions.map(item => {
                                        if (item.isShow === 'Y') {
                                            if (item.icon) {
                                                return <div
                                                        key={`menu-tab-${item.code}`}
                                                        className="menu-item on-log on-visible"
                                                        onClick={()=>{locationTo(`/wechat/page/live-studio/module-custom/${item.code}?liveId=${this.props.router.params.liveId}`)}}
                                                        data-log-region="live-menu"
                                                        data-log-pos={item.code}
                                                        data-log-name={item.name}
                                                        data-log-business_type="tab"
                                                        data-log-business_id={item.name}
                                                    >
                                                        <div className="img">
                                                            <div className="c-abs-pic-wrap"><Picture src={item.icon} placeholder={true} resize={{w:'90', h:"90", limit: "1" }} /></div>
                                                        </div>
                                                        <div className="text">
                                                            {item.name}
                                                        </div>
                                                </div>
                                            } else {
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
                                            }
                                            

                                        }
                                    })
                                }
                                </div> 
                                : 
                                    this.props.power.allowMGLive ? 
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
                        pageMenu.map(item => {
                            switch (item.itemCode) {
                                case 'shortKnowledge':
                                    return (
                                        !!this.state.knowledgeList && item.isShow != 'N' ?
                                        <MiniKnowledgeList
                                            name={item.name}
                                            knowledgeList={this.state.knowledgeList.slice(0,20)}
                                            showPlayNumStatus={item.showPlayNumStatus}
                                            onLinkClick={locationTo.bind(this, "/wechat/page/short-knowledge/video-list?liveId=" + this.props.liveId)}
                                        />
                                        :null
                                    );
                                    
                                case 'group':
                                    return (
                                        item.isShow != 'N' ?
                                        <MiniGroupList
                                            key={ `page-menu-${item.itemCode}` }
                                            title={item.name}
                                            openBottomMenu={this.showGroupActionSheet}
                                            group={this.state.communityInfo}
                                            power={this.props.power}
                                            isShowCreateTime = {item.isShowCreateTime}    
                                            isShowJoinNum = {item.isShowJoinNum} 
                                            onClickGroup={this.onClickGroup}
                                            onClickOpenGroup={() => {this.setState({isShowGroupDialog: true})}}
                                        />
                                        :null
                                    );
                                case 'channel':
                                    return (
                                        item.isShow != 'N' ?
                                        <MiniChannelList
                                            tags={this.state.channelTags}
                                            currentTag={this.state.currentchannelTag}
                                            onSwitch={this.onTagSwitch}
                                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=channel`)}}
                                            onSort={() => {locationTo(`/wechat/page/channel-sort/${this.liveId}`)}}
                                            key={ `page-menu-${item.itemCode}` }
                                            title={ item.name }
                                            channelList={ this.props.channelList }
                                            power={ this.props.power }
                                            sysTime={ this.props.sysTime }
                                            openChannelBottomMenu={ this.openChannelBottomMenu }
                                            noMore={ this.props.noMoreChannel }
                                            onLinkClick={ locationTo.bind(this, "/wechat/page/live-channel-list/" + this.props.liveId) }
                                            loadMoreChannel={this.loadMoreChannel}
                                            showNum = {item.showNum||5}    
                                            isShowStudyNum = {item.isShowStudyNum}    
                                            isShowTopicNum = {item.isShowTopicNum}    
                                        />
                                        :null    
                                    )

                                case 'topic':
                                    return (
                                        item.isShow != 'N' ?
                                        <MiniTopicList
                                            tags={this.state.topicTags}
                                            currentTag={this.state.currenttopicTag}
                                            onSwitch={this.onTagSwitch}
                                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=topic`)}}
                                            onSort={() => {locationTo(`/wechat/page/topics-sort/${this.liveId}`)}}
                                            key={ `page-menu-${item.itemCode}` }
                                            title={ item.name }
                                            topicList={ this.props.topicList }
                                            power={ this.props.power }
                                            sysTime={ this.props.sysTime }
                                            openTopicBottomMenu={ this.openTopicBottomMenu }
                                            noMore={ this.props.noMoreTopic }
                                            onLinkClick={ locationTo.bind(this, "/wechat/page/live-topic-list/" + this.props.liveId) }
                                            loadMoreTopic={this.loadMoreTopic}
                                            showNum = {item.showNum||5}    
                                            isShowStudyNum = {item.isShowStudyNum}    
                                            />
                                        :null      
                                    )

                                case 'feed':
                                    return (
                                        item.isShow != 'N' && !!this.props.timeline?
                                        <MiniTimeLineList
                                            key={ `page-menu-${item.itemCode}` }
                                            title={ item.name }
                                            timeline={ this.props.timeline.slice(0, item.showNum ? item.showNum : 2) }
                                            power={ this.props.power }
                                            onLinkToEdit={ locationTo.bind(this, '/wechat/page/timeline/choose-type?liveId=' + this.liveId) }
                                            onLinkClick={ locationTo.bind(this, "/wechat/page/live/timeline/" + this.props.liveId) }
                                            showNum = {item.showNum}  
                                            liveId={this.props.liveId}
                                            />
                                        :null      
                                    )
                                case 'camp':
                                    return (
                                        item.isShow === 'Y' ?
                                        <MiniCheckinCampList
                                            tags={this.state.liveCampTags}
                                            currentTag={this.state.currentliveCampTag}
                                            onSwitch={this.onTagSwitch}
                                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=liveCamp`)}}
                                            onSort={() => {locationTo(`/wechat/page/course-sort?liveId=${this.liveId}&type=liveCamp`)}}
                                            key={ `page-menu-${item.itemCode}`}
                                            title={ item.name }
                                            checkinCampList={ this.state.checkinCampList }
                                            power={ this.props.power }
                                            sysTime={ this.props.sysTime }
                                            openCheckinCampBottomMenu={ this.displayCheckinCampActionSheet }
                                            liveId={ this.props.liveId }
                                            showNum = { item.showNum || 5 }
                                            isShowAuthNum = {item.isShowAuthNum}
                                            isShowAffairCount = {item.isShowAllAffairCount}
                                        />
                                        : null
                                    )
                                case 'training':
                                    return (
                                        item.isShow === 'Y' ?
                                        <MiniTrainingListV2 
                                            tags={this.state.trainingTags}
                                            currentTag={this.state.currenttrainingTag}
                                            onSwitch={this.onTagSwitch}
                                            onMore={() => {locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.liveId}&type=camp`)}}
                                            onSort={() => {locationTo(`/wechat/page/course-sort?liveId=${this.liveId}&type=camp`)}}
                                            key={ `page-menu-${item.itemCode}` }
                                            title={ item.name }
                                            trainingList={ this.state.trainingList }
                                            power={ this.props.power }
                                            sysTime={ this.props.sysTime }
                                            clientRole={this.props.power.allowMGLive ? 'B' : 'C'}
                                            openTrainingBottomMenu={ this.displayTrainingActionSheet }
                                            noMore={ this.props.noMoreTraining }
                                            onLinkClick={ locationTo.bind(this, "/wechat/page/live-studio/training-list/" + this.props.liveId) }
                                            showNum = {item.showNum||5}    
                                            // isShowStudyNum = {item.isShowStudyNum}    
                                        />
                                        : null
                                    )
                                default:
                                    break;
                            }
                        })
                    }

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

                    {
                        // (this.state.trainingList && this.state.trainingList.length <= 0) && 
                        // (this.props.channelList && this.props.channelList.length <= 0) && 
                        // (this.state.checkinCampList && this.state.checkinCampList.length <= 0) && 
                        // (this.props.topicList && this.props.topicList.length <= 0) && 
                        // <div className="guide-to-create">
                        //     点击立即创建课程
                        // </div>
                    }

                    {!this.props.power.allowMGLive&&
                        <BottomBrand 
                            liveId={this.props.liveId} 
                            chtype="create-live_live" 
                            liveisBindApp={this.state.liveisBindApp}
                            onFocusUs={() => {this.setState({showLiveQrcodeDialog: true})}}
                        ></BottomBrand>}
                </div>

                {
                    this.state.showInfo ?
                        <div className="liveIntro-back" onClick={this.closeInfoHandle}>
                            <div className={this.props.liveInfo.entity.qrCode ? "live-intro-con show-third" :   "live-intro-con"}>
                                <div className="top">
                                    <div className="head-block">
                                        <img src={imgUrlFormat(this.props.liveInfo.entity.logo, '@130w_130h_1e_1c_2o')} />
                                    </div>
                                    {/* {
                                        !this.props.power.allowMGLive && this.props.focusStatues.isFollow ?
                                            <div className="inform" onClick={this.alertHandle}>
                                        <span className="inform-span"></span>
                                        {this.props.focusStatues.isAlert ? "关闭" : "开启"}通知
                                            </div>
                                        : ""
                                    }                                    */}
                                </div>
                                {
                                    this.state.showThirdQrBlock ?
                                        <div className="third-qr live-intro show-third">
                                            <img src={this.state.thirdQrCode} />
                                            <div className="text">长按二维码关注公众号</div>
                                        </div>
                                    :
                                    <div className={this.props.liveInfo.entity.qrCode ? "live-intro show-third" : "live-intro"}>
                                        <div className="title">{this.liveName}</div>
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

                {/* {
                    this.state.showThirdQrBlock ?
                        <div className="third-qr-back" onClick={this.closeThirdQrBlockHandle}>
                    <div className="third-qr">
                    <img src={this.state.thirdQrCode} />
                    <div className="text">长按二维码关注公众号</div>
                    </div>
                        </div> : ""
                } */}

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
                    show = {this.state.isShowRealName}
                    onClose = {this.closeRealName.bind(this)}
                    realNameStatus = {this.props.auditedStatues || 'unwrite'}
                    checkUserStatus = { this.state.checkUserStatus }
                    isClose={true}
                    liveId = {this.props.liveId}/>
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

                {/*<LiveFocusQrDialog*/}
                    {/*show={this.state.showLiveFocusQrDialog}*/}
                    {/*onClose={this.closeLiveFocusQrDialog}*/}
                    {/*qrCode={this.state.focusQrCode}*/}
                    {/*traceData="studioLiveFocusQrcode"*/}
                    {/*channel="101"*/}
                    {/*appId={this.state.focusQrAppId}*/}
                {/*/>*/}

                {/* 关注公众号 */}
                <FollowDialog
                    ref={ dom => dom && (this.followDialogDom = dom) }
                    title={ this.state.followDialogTitle }
                    desc={ this.state.followDialogDesc }
                    qrUrl={ this.state.focusQrCode }
                    option={ this.state.followDialogOption }
                    qrcodeBoxType={this.state.qrcodeBoxType}
                    joinCommunityConfirm={this.joinCommunityConfirm}
                    focusLiveConfirm = {this.focusLiveConfirm.bind(this)}
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
                                <div className="title">{this.liveName}</div>
                                <div className="text">仅差一步就可以收到我的开课提醒啦</div>
                                <QRImg 
                                    src={this.state.topTipQrCode}
                                    traceData="studioLiveFocusQlchatQrcode"
                                    className="qrCode"
                                    channel="205"
                                    appId={this.state.topTipAppId}
                                />
                                {/* <img className="qrCode" src={this.state.topTipQrCode} /> */}
                                <div className="bottom">长按扫描二维码，开启服务</div>
                            </div>
                        </div> : ""
                }

                {
                    this.state.isShowMiddlePage &&
                    <MiddlePageDialog 
                        hide={this.toggleShowGuideToFocusDialog}
                        userInfo={this.props.userInfo}
                        liveMiddlepageCourse={this.props.liveMiddlepageCourse}
                        middlePageQrcodeUrl={this.state.middlePageQrcodeUrl}
                        appId={this.state.middlePageAppId}
                    />
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
        liveId: state.live.liveInfo.entity.id,
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

        channelList: state.live.channelList,
        channelIdx: state.live.channelIdx,
        channelPage: state.live.channelPage,
        noMoreChannel: state.live.noMoreChannel,

        topicNum: state.live.topicNum,
        channelNum: state.live.channelNum,
        liveIntroPhotoList: state.live.liveIntroPhotoList,

        bannerList: state.live.mgrBannerList,

        shareQualify: state.live.shareQualify,
        pageShare: state.liveStudio.pageShare,
        userInfo: state.live.userInfo || {},
        liveMiddlepageCourse: state.live.liveMiddlepageCourse,  

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
    liveGetFollowNum,
    setAuditedStatues,
    initLiveShareQualify,
    bindLiveShare,
    getUserInfo,
    userBindKaiFang,
    addPageUv,
    fetchPageShare,
    getLiveMiddlepageCourse,
    getCheckUser,
    getDomainUrl,
    getUnreadCount,
    toggleDisplayMenu,
    getCustomLiveFunctions
}
module.exports = connect(mapStateToProps, mapActionToProps)(StudioLiveMain);
