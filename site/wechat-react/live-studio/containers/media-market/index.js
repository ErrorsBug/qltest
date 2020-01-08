import React, { Component } from 'react';
import { api } from '../../actions/common';
import PropTypes, { element } from 'prop-types';
import { connect } from 'react-redux';
import Page from 'components/page';
import BottomDialog from 'components/dialog/bottom-dialog';
import MiddleDialog from 'components/dialog/middle-dialog';
import Confirm from 'components/dialog/confirm';
import ReprintPushBox from 'components/dialogs-colorful/reprint-push-box';

import { getVal, handleAjaxResult, formatDate, locationTo } from 'components/util';
import { autobind } from 'core-decorators';

import TopBar from './components/top-bar';
import BottomBar from './components/bottom-bar';
import MarketChannelItem from './components/market-channel-item';
import ManageChannelItem from './components/manage-channel-item';
import ApplyAgent from './components/apply-agent';
import ReprintModal from './components/reprint-modal';
import ScrollToLoad from 'components/scrollToLoad';
import ChannelItemCard from './components/channel-item-card';
import SearchPanel from './components/search-panel';

import { live } from '../../reducers/live';
import { check } from 'graphql-anywhere/lib/src/utilities';
import { share } from 'components/wx-utils';
import { AudioSlicePlayer } from 'components/audio-player';

import Carousel from 'components/carousel';

// import EditToolBar from './components/edit-tool-bar';

const MEDIA_MARKET = 'media_market';
const APPLY_AGENT = 'apply_agent';
const MARKET_EDIT = 'market_edit';
const MEDIA = 'media';
const AGENT = 'agent';
 
@autobind
export class MediaMarket extends Component {
//   static propTypes = {
//     prop: PropTypes
//   }

    constructor(props) {
        super(props);

        const isShowSearch = /search/.test(location.hash);
        // 如果进入页面就显示搜索面板，在在浏览器history中添加一条记录
        if (isShowSearch) {
            const curPath = location.href;
            window.history.replaceState(null, null,location.pathname + location.search);
            window.history.pushState(null, null, curPath);
        }

        this.state = {
            // 顶部标签
            marketTabList: [],
            reprintTabList: [{name: '全部', id: ''}],
            // 当前激活标签
            currentMarketTypeTab: '',
            currentManageTypeTab: '',
            curTabScrollLeft: 0,

            // 知识商城banners
            marketBanners: [],

            // 高分成课程列表
            highDivisionCourses: [],
            // 当前页数
            currentMarketPage: 1,
            currentManagePage: 1,
            pageSize: 20,
            hasMore: true,
            
            // 系列课列表数据
            marketChannelList:[],
            reprintChannelList:[],
            // 是否正在加载列表
            loading: true,
            // 当前转载的系列课信息
            currentReprintChannel: {},
            // 当前操作的系列课信息
            currentEditChannel:{},
            
            // 底部标签
            currentBottomTab: MEDIA_MARKET,
            bottomBarList: [],

            // 转载弹框
            showReprintModal: false,
            // 转载提示弹框
            showReprintTipModal: false,
            // 转载成功提示弹框
            showReprintSuccessModal: false,
            // 选择直播间弹窗
            showSelectLiveModal: false,
            // 是否显示搜索历史面板
            showSearchHistory: /search/.test(location.hash),
            // 推广弹框
            showPromotionModal: false,
            // 推广数据
            promotionData: {},

            // 用户信息
            userInfo: {
                // 当前选择的直播间
                liveId: null,
                // 要切换的直播间
                curSelectedLiveId: null,
                // 商城类别：自媒体商城 media, 一级代理商城，agent
                marketType: getVal(props, 'location.query.agentId') ? AGENT : MEDIA,
                // 用户级别：普通用户normal, 自媒体用户：selfMedia, 一级代理商 superAgent，二级分销商agent，二级分销商待开通none-agent, 
                userAdminLevel: null,
                // 是否有商城操作权限
                hasEditPower: null,
                // 用户昵称
                name: null,
                // 用户头像
                headImgUrl: null,
                // 要切换的直播间用户头像和名称
                curSelectedUserImg: null,
                curSelectedUserName: null,
                // 用户创建的直播间列表
                creatLiveList: [],
                // 用户管理的直播间列表
                manageLiveList: [],
                percent: 70,
            },

            // 一级代理商信息
            agentInfo: {
                agentId: getVal(props, 'location.query.agentId') || null,
                isExit: null,
                name: null,
                isSelf: null,
            },

            // 二级代理申请信息
            applyData: {
                // 二级代理id
                id: null,
                // 姓名
                name: '',
                // 手机号
                mobile: '',
                // 用户id
                userId:	null,
                // 一级分销商id
                agentId: null,
                // 是否申请过
                isApply: 'N',
                //分成比例
                agentPercent: 0,
            },

            // 搜索参数
            searchParams: {
                channelName: '',
                orderBuyNumber: '',
                orderPrice: '',
                orderEndRate: '',
                orderReward: ''
            },

            currentAudio: -1, //当前播放音频
            audioStatus: 'stop',
            audioPercent: 0,
            currentPlayTab: '',
        }
    }

    get liveId() {
        return this.state.userInfo.liveId;
    }

    get agentId() {
        return this.state.agentInfo.agentId;
    }

    get marketType() {
        return this.state.userInfo.marketType;
    }

    componentDidMount = async () => {
        // this.refs.confirmDown.show();
        // 这里只能拿到用户本身的直播间Id，对于管理员用户，无法拿到其登录的直播间ID，
        // 故改为由URL传入liveID
        // 产品说先改回原来的逻辑
        this.fetchBanners();
        await this.initState();
        this.checkIsChannelSelected()
        this.initShare();
        if (this.props.location.query.tab == 'market_edit') {
            this.setState({
                currentBottomTab: 'market_edit'
            }, () => {
                this.getReprintChannelList({tagId: this.state.currentManageTypeTab});
            });
        }
    }

    initShare() {
        
        share({
            appTitle: '知识通商城',
            timelineTitle: '知识共享时代，加入千聊知识通，一起做大内容变现事业，传播智慧，享受分成',
            desc: '知识共享时代，加入千聊知识通，一起做大内容变现事业，享受分成',
            shareUrl: location.origin + location.pathname,
            imgUrl: 'https://img.qlchat.com/qlLive/wx-share/market-logo.png'
        })
    }

    // 获取首页的banners
    async fetchBanners() {
        const result = await api({
            url: '/api/wechat/studio/knowledgeBannersList',
            method: 'POST',
            body: {
                caller: 'h5'
            }
        });
        if (result.state.code === 0) {
            this.setState({
                marketBanners: [...result.data.bannerList]
            });
        }
    }

    // 获取首页滚动的高分成课程数据
    async fetchActivityCourses() {
        const result = await api({
            url: '/api/wechat/studio/activityCoursesList',
            method: 'POST',
            body: {
                liveId: this.state.userInfo.liveId,
                type: 'all',
                page: {
                    page: 1,
                    size: 10
                }
            }
        });
        if (result.state.code === 0) {
            this.setState({
                highDivisionCourses: [...result.data.courseList]
            });
        }
    }

    // 点击横向滚动的高分成课程
    handleActivityCourseClick(event) {
        const selectedLiveId = this.state.userInfo.liveId;
        const courseIndex = +event.target.getAttribute('data-index');
        const course = this.state.highDivisionCourses[courseIndex];
        let jumpUrl = '';
        if (this.props.sysTime >= course.startTime) {
            // 点击的是正在进行的活动课程，跳转至高分成活动页面的"进行中"Tab
            jumpUrl = '/wechat/page/live-studio/media-market/high-division-activity?tab=activity-underway';
        } else {
            // 点击的是还未开始的活动课程，跳转至高分成活动页面的"预告"Tab
            jumpUrl = '/wechat/page/live-studio/media-market/high-division-activity?tab=activity-notice';
        }
        if (selectedLiveId) {
            jumpUrl += `&selectedLiveId=${selectedLiveId}`;
        }
        locationTo(jumpUrl);
    }

    /* 检测是否有selecedChannelId，如果有则需要打开页面后默认展示对应系列课的转载弹窗 */
    async checkIsChannelSelected() {
        try {
            const selectedChannelId = this.props.location.query.selectedChannelId
            const { marketChannelList } = this.state

            if (selectedChannelId) {
                let channelItem = null
                let channelIndex = -1
                /* 首先在已加载的列表中查看是否有这个系列课，有的话直接打开弹窗，否则请求系列课数据 */
                marketChannelList.find((item, index) => {
                    if (item.businessId == selectedChannelId) {
                        channelItem = item
                        channelIndex = index
                        return true
                    }
                    return false
                })
                
                if (!channelItem) {
                    const result = await api({
                        url: '/api/wechat/studio/mediaMarket/getRelayInfo',
                        method: 'GET',
                        body: {
                            channelId: selectedChannelId,
                        },
                    });

                    if (result.state.code !== 0) {
                        throw new Error('请求系列课信息失败')
                    }

                    channelItem = result.data.relayInfo
                    channelIndex = 0

                    /* 请求到数据后把这节系列课插入到列表顶端 */
                    const { marketChannelList } = this.state
                    marketChannelList.unshift(channelItem)
                    this.setState({ marketChannelList })
                }

                /* 因为modal组件需要的数据是处理过的，因此在这里做一个转换过去 */
                const reprintChannelInfo = {
                    index: channelIndex,
                    tweetId: channelItem.tweetId,
                    reprintLiveId: channelItem.liveId,
                    reprintLiveName: channelItem.liveName,
                    reprintChannelId: channelItem.businessId,
                    reprintChannelName: channelItem.businessName,
                    reprintChannelImg: channelItem.businessHeadImg,
                    reprintChannelAmount: channelItem.amount,
                    selfMediaPercent: channelItem.selfMediaPercent,
                    selfMediaProfit: channelItem.selfMediaProfit,
                    chargeMonths: channelItem.chargeMonths,
                }
                this.showReprintModal(reprintChannelInfo)
            }    
        } catch (error) {
            console.error('打开默认系列课的转载框失败：', error)
        }
    }

    myLiveEntity = async () => {
        const result = await api({
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/studio/myLiveEntity',
        });
        handleAjaxResult(result, (data) => {
            this.setState({
                liveEntity: data.entityPo
            })
        })
    }

    async initState(isSwitchLive = false) {

        let liveId = '';
        let marketType = this.marketType
        let userAdminLevel = 'normal';
        let liveLevelInfo = {};
        let agentInfo = this.state.agentInfo;
        let hasEditPower = 'N';
        let bottomBarList = [{ 
            id: MEDIA_MARKET,
            title: '知识商城',
            icon: 'media-market-icon',
            activeIcon: 'media-market-active-icon'
        }];

        this.myLiveEntity();

        // console.log('type:',marketType)
        switch (marketType) {
            case MEDIA:
                // console.log(1)
                liveId = isSwitchLive ? this.liveId : await this.getLiveId();
                if (!liveId) {
                    [liveLevelInfo] =await Promise.all([
                        this.getMarketChannelList(),
                        this.getUserInfo(),
                        this.getMarketChannelTagList(),
                    ])
                    break
                };
                [liveLevelInfo] =await Promise.all([ 
                    this.getLiveLevelInfo(liveId),
                    this.getMarketChannelList(),
                    this.getLiveTagList(),
                    this.getUserInfo(),
                    this.getMediaActive(),
                    this.getMarketChannelTagList(),
                ]);
                if (liveLevelInfo.level === 'selfMedia') {
                    userAdminLevel = 'selfMedia';
                } else if (liveLevelInfo.level === 'agent') {
                    userAdminLevel = 'agent';
                }
                break;
            case AGENT:
                [agentInfo, liveId]= await Promise.all([
                    this.getAgentInfo(this.agentId),
                    // {isExit: 'Y', isSelf: 'Y', name: '微知'},
                    isSwitchLive ? this.liveId : await this.getLiveId(),
                    // 'agent',
                ]);
                // console.log(agentInfo)
                if (agentInfo.isExist === 'N') {
                    window.location.href = '/404?time=' + Date.now();
                    break;
                }
                if (agentInfo.isSelf === 'Y') {
                    userAdminLevel = 'super-agent';
                    // console.log(3)
                    await Promise.all([ 
                        this.getLiveTagList(),
                        this.getMarketChannelList(),
                        this.getUserInfo(),
                        this.getMarketChannelTagList(),
                    ]);
                    break;

                } else {
                    // console.log(1)
                    if (!liveId) {
                        // console.log(4)
                        userAdminLevel = 'none-agent';
                        await Promise.all([ 
                            this.getMarketChannelList(),
                            this.getUserInfo(),
                            this.getApplyData(this.agentId),
                        ]);
                        break;
                    }
                    [liveLevelInfo] = await Promise.all([ 
                        this.getLiveLevelInfo(this.liveId),
                        this.getMarketChannelList(),
                        this.getLiveTagList(),
                        this.getUserInfo(),
                        this.getMediaActive(),
                        this.getMarketChannelTagList(),
                        this.getApplyData(this.agentId),
                    ]);
    
                    if (liveLevelInfo.level === 'selfMedia') {
                        userAdminLevel = 'selfMedia';
                        marketType = MEDIA;
                        break;
                    }
                    if (liveLevelInfo.level === 'agent') {
                        if (String(liveLevelInfo.agentId) === String(this.agentId)) {
                            userAdminLevel = 'agent';
                            break;
                        } else {
                            userAdminLevel = 'none-agent';
                            break;
                        }
                    }
                    userAdminLevel = 'none-agent';
                    break;
                }
            default:
                break;
        }

        hasEditPower = userAdminLevel === 'agent' || userAdminLevel === 'selfMedia' || userAdminLevel === 'super-agent';
        // userAdminLevel = 'none-agent'
        switch(userAdminLevel) {
            case 'super-agent':
                break;
            case 'none-agent':
                bottomBarList.push({
                    id: APPLY_AGENT,
                    title: '申请代理',
                    icon: 'apply-agent-icon',
                    activeIcon: 'apply-agent-active-icon',
                });
                break;
            default:
                bottomBarList.push({
                    id: MARKET_EDIT,
                    title: '转载管理',
                    icon: 'market-edit-icon',
                    activeIcon: 'market-edit-active-icon'
                });
                break;
        }
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                marketType,
                userAdminLevel,
                hasEditPower,
            },
            bottomBarList: [...bottomBarList],
            agentInfo,
        });
        if (!this.agentId && userAdminLevel != 'agent') {
            this.fetchActivityCourses();
        }
    }

    async getLiveId(){
        // // console.log(getVal(this.props, 'location.query.agentId'))
        let selectedLiveId = getVal(this.props, 'location.query.selectedLiveId') || '';
        let liveId = '';
        let localLiveId = '';
        let hasMgrAuth = "N";
        // 如果有selectedLiveId
        if (selectedLiveId !== '') {
            const result  = await this.getAdminPower(selectedLiveId);
            let hasMgrAuth = result.isMgrAuth;
            // console.log('hasMgrAuth:',hasMgrAuth)
            if (hasMgrAuth === 'Y') {
                liveId = selectedLiveId;
                await this.getAdminLiveListInfo();
            } else {
                liveId = await this.getLiveIdFromReq();
            }
        } else {
            switch(this.marketType) {
                case MEDIA:
                    localLiveId = localStorage.getItem("mediaLiveId") || '';
                    break;
                case AGENT:
                    localLiveId = localStorage.getItem(`agentLiveId-${this.agentId}`) || '';
                    break;
                default:
                    break;
            }

            if (localLiveId !== '') {
                liveId = localLiveId;
                await this.getAdminLiveListInfo();
                // console.log('a')
            } else {
                liveId = await this.getLiveIdFromReq();
                // console.log('b')
            }
        }

        const selectedUserInfo = this.getSelectedUserInfoByLiveId(liveId);
        // console.log('selectedUserInfo:',selectedUserInfo)
        await this.setState({ 
            userInfo: {
                ...this.state.userInfo,
                liveId,
                curSelectedLiveId: liveId,
                curSelectedUserName: selectedUserInfo.name,
                curSelectedUserImg: selectedUserInfo.headImg
            },
        });


        // console.log('getLiveId',liveId);
        // this.setLocalLiveId(liveId); 
        return liveId;
    }

    getSelectedUserInfoByLiveId(liveId) {
        const { creatLiveList = [], manageLiveList = [] } = this.state.userInfo;
        const liveList = [...creatLiveList, ...manageLiveList];
        // console.log(liveList)
        const curLiveInfo = liveList.find((liveInfo) =>liveInfo.liveId == liveId) || {};
        // console.log('curLiveInfo', curLiveInfo)

        return {
            name: curLiveInfo.nickName || null,
            headImg: curLiveInfo.headImg || null
        }
    }

    async getLiveIdFromReq() {
        let liveId = '';
        const liveListInfo = await this.getAdminLiveListInfo();
        const { creatLiveList, manageLiveList, myLiveId } = liveListInfo;
        const creatLength = creatLiveList.length;
        const manageLength = manageLiveList.length;

        if ((creatLength + manageLength) === 0) liveId = myLiveId;
        if ((creatLength + manageLength) >= 1) {
            liveId = creatLength > 0 ? creatLiveList[0].liveId : manageLiveList[0].liveId;
            if ((creatLength + manageLength) > 1) {
                await this.setState({ 
                    userInfo: {
                        ...this.state.userInfo,
                        curSelectedLiveId: liveId,
                    },
                    showSelectLiveModal: true,
                })
            }
        }
        return liveId
    }

    async getAdminLiveListInfo() {
        const result = await api({
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/myManageLive',
        });
        if (result.state.code !== 0) {
            window.toast("myManageLive接口错误");
        }

        const creatLiveList = getVal(result, 'data.result.creator') || [];
        const manageLiveList = getVal(result, 'data.result.manager') || [];
        const myLiveId = getVal(result, 'data.result.myLiveId') || '';

        await this.setState({ 
            userInfo: {
                ...this.state.userInfo,
                creatLiveList,
                manageLiveList,
            },
        })

        return {
            creatLiveList,
            manageLiveList,
            myLiveId,
        };
    }

    async getApplyData(agentId){
        const result = await api({
            method: 'POST',
            showLoading: false,
            body: { agentId },
            url: '/api/wechat/studio/mediaMarket/applyInfo',
        });

        const applyData = getVal(result, 'data.applyData') || {};
        const isApply = getVal(result, 'data.isApply') || 'N';
        const agentPercent = getVal(result, 'data.agentPercent') || 0;
        if (result.state.code === 0) {
            this.setState({ applyData: { ...this.state.applyData, ...applyData, isApply, agentPercent} })
            return result.data
        }

        // return null;
    }

    async getUserInfo() {
        const { curSelectedUserImg, curSelectedUserName } = this.state.userInfo;
        if (curSelectedUserImg && curSelectedUserName) {
            this.setState({
                userInfo: {
                    ...this.state.userInfo,
                    headImgUrl: curSelectedUserImg,
                    name: curSelectedUserName,
                }
            })
            return;
        }

        const result = await api({
            method: 'GET',
            showLoading: false,
            url: '/api/wechat/user/info',
        });

        // console.log('userInfo',result);
        
        if (result.state.code === 0) {
            this.setState({
                userInfo: {
                    ...this.state.userInfo,
                    headImgUrl: result.data.user.headImgUrl,
                    name: result.data.user.name,
                }
            })

            return result.data
        }
    }

    async getMediaActive() {
        const result = await api({
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/studio/mediaMarket/isActive',
            body: { liveId: this.liveId },
        });

        // console.log('avtive',result);
        
        if (result.state.code === 0) {
            this.setState({
                userInfo: {
                    ...this.state.userInfo,
                    percent: result.data.percent,
                }
            })

            return result.data
        }
    }

    async getLiveLevelInfo(liveId) {
        const result = await api({
            method: 'POST',
            showLoading: false,
            body: { liveId },
            url: '/api/wechat/live/level',
        });

        // console.log('getLiveLevelInfo',result)
        
        if (result.state.code === 0 ) {
            // this.setState({ liveId: result.data.liveId });
            return result.data
        }
    }

    async getAgentInfo(agentId){
        const result = await api({
            method: 'POST',
            showLoading: false,
            body: { agentId,},
            url: '/api/wechat/studio/mediaMarket/agentInfo',
        });

        // console.log('getAgentInfo',result)
        
        if (result.state.code === 0) {
            // this.setState({ liveId: result.data.liveId });
            return result.data.result
        }

        // return null;
    }

    async getAdminPower(liveId) {
        if (!liveId) {
            return;
        }
        
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/hasAdminPower',
            method: 'POST',
            body: {
                liveId: liveId,
            },
            showLoading: true,
        });
        // console.log(result);
        if (result.state.code === 0) {
            return result.data;
        }
    }

    async getLiveTagList(type = 'all') {
        
        const result = await api({
            url: "/api/wechat/live/channelTypeList",
            method: 'POST',
            body: {
                liveId: this.liveId,
                type,
            },
            showLoading: true,
        });
        const reprintTabList = getVal(result, 'data.channelTagList');
        this.setState({ reprintTabList: [{name: '全部', id: ''}, ...reprintTabList] });
        // console.log('liveTags:', result);
    }

    showLoading() {
        this.setState({ loading: true});
    }

    hideLoading() {
        this.setState({ loading: false});
    }

    async getReprintChannelList({tagId = '' , page = 1} = {}, loadMore = false) {
        this.showLoading();
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/getReprintChannelList',
            method: 'POST',
            body: {
                liveId: this.liveId,
                isRelay: 'Y',
                tagId,
                page: {
                    page,
                    size: this.state.pageSize,
                }
            },
            showLoading: true,
        });
        const reprintChannelList = getVal(result, 'data.liveChannels') || [];
        const hasMore = reprintChannelList.length >= this.state.pageSize;
        if (loadMore) {
            this.setState({ 
                reprintChannelList: [...this.state.reprintChannelList, ...reprintChannelList],
                hasMore,
            })
        } else {
            this.setState({ 
                reprintChannelList,
                hasMore,
             });
        }
        this.hideLoading();
        // console.log('reprintChannels: ', result);
    }
    
    async getMarketChannelList({
            liveId = this.liveId, 
            tagId = '', 
            page = 1, 
            channelName = '',
            orderBuyNumber = '',
            orderPrice = '',
            orderEndRate = '',
            orderReward = '',
        } = {}, 
        loadMore = false,
    ){

        this.showLoading();
        let isRecommend = 'N';
        if (tagId == 'isRecommend') {
            isRecommend = 'Y';
            tagId = '';
        }
        const userAdminLevel = this.state.userInfo.userAdminLevel
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/courseList',
            method: 'POST',
            body: {
                liveId,
                tagId,
                channelName,
                orderBuyNumber,
                orderPrice,
                orderEndRate,
                orderReward,
                isRecommend,
                agentId: this.agentId || "",
                pageNum: page,
                pageSize: this.state.pageSize,
            },
            showLoading: true,
        });
        const marketChannelList = getVal(result, 'data.channelList') || [];
        const hasMore = marketChannelList.length >= this.state.pageSize;
        if (loadMore) {
            this.setState({ 
                marketChannelList: [...this.state.marketChannelList, ...marketChannelList],
                hasMore,
            })
        } else {
            this.setState({ 
                marketChannelList,
                hasMore,
             });
        }
        // console.log('marketChannels: ',result);
        this.hideLoading();
        if (!this.audioSlicePlayer) {
            this.audioSlicePlayer = new AudioSlicePlayer((p) => {
                this.setState({
                    audioPercent: p
                })
            }, (e) => {
                this.setState({
                    audioStatus: 'ended',
                    audioPercent: 0
                })
            },(e) => {
                
            }, () => {
                this.setState({
                    audioStatus: 'pause'
                });
            });
        }
    }

    handleListen = (idx) => {
        if (this.state.currentPlayTab !== this.state.currentMarketTypeTab) {
            this.startListening(idx);
            return;
        }
        // 没有音频播放或暂停则开始播放
        if (this.state.audioStatus == 'ended') {   
            this.startListening(idx);
        // 已经有音频在播放，刚好是当前音频
        } else if (idx == this.state.currentAudio) {
            let {audioStatus} = this.state;
            if (audioStatus == 'pause') {
                this.audioSlicePlayer.resume();
                this.setState({
                    audioStatus: 'playing',
                    currentAudio: idx,
                })
            } else {
                this.audioSlicePlayer.pause();
                this.setState({
                    audioStatus: 'pause',
                    currentAudio: idx,
                })
            }
        // 已经有音频在播放切不是当前音频
        } else {
            this.setState({
                audioPercent: 0,
            })
            this.startListening(idx);
        }
    }

    startListening = (idx) => {
        let {audition} = this.state.marketChannelList[idx];
        if (!audition) {
            window.toast('暂无试听音频');
        } else {
            this.setState({
                audioStatus: 'playing',
                currentAudio: idx,
                audioPercent: 0,
                currentPlayTab: this.state.currentMarketTypeTab
            });
            this.audioSlicePlayer.play(audition.contentList, audition.totalSeconds);
        }
    }

    pauseListening = () => {
        this.audioSlicePlayer.pause();
    }

    async getMarketChannelTagList() {
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/courseTagList',
            method: 'POST',
            showLoading: true,
        });
        const marketTabList = getVal(result, 'data.tagList');
        this.setState({ marketTabList: [
            {name: '全部', id: ''},
            // {name: '推荐', id: 'isRecommend'},
            ...marketTabList
        ]});
    }

    async upOrDownCourse(type, channelId) {
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/upOrDownCourse',
            method: 'POST',
            body: {
                type,
                channelId: channelId,
            },
            showLoading: true,
        });

        if (result.state.code === 0) {
            const index = this.state.currentEditChannel.index;
            // console.log(index)
            let newList = [...this.state.reprintChannelList ]
            newList[index].upOrDown = type;
            this.setState({
                reprintChannelList: newList,
            })
            if ( type === 'down') {
                this.refs.confirmDown.hide();
            } else {
                this.refs.confirmUp.hide();
            }
            window.toast('操作成功');
        } else {
            window.toast(result.state.msg);
        }

        // console.log('upordown:', result);
        return result;
    }

    async reprintChannel(params = {relayLiveId:'', tagId:'' ,sourceChannelId:'', tweetId:''}) {
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/reprintChannel',
            method: 'POST',
            body:{
                ...params,
            },
            showLoading: true,
        });
        if (result.state.code === 0) {
            const index = this.state.currentReprintChannel.index;
            let newList = [...this.state.marketChannelList]
            newList[index].isRelay = 'Y';
            newList[index].relayChannelId = result.data.relayChannelId;
            this.setState({
                marketChannelList: newList,
                userInfo: {
                    liveId: result.data.liveId,
                    ...this.state.userInfo
                }
            })
            this.setReprintSuccessModal(true);
            window.toast('操作成功');
        } else {
            window.toast(result.state.msg);
        }
        return result;
    }

    async deleteReChannel(channelId) {
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/deleteReChannel',
            method: 'POST',
            body: {
                liveId: this.liveId,
                channelId
            },
            showLoading: true,
        });

        if (result.state.code === 0) {
            const index = this.state.currentEditChannel.index;
            // console.log(index)
            let newList = this.state.reprintChannelList.filter((item, idx) => idx !== index);
            this.setState({
                reprintChannelList: newList,
            })
            this.refs.confirmDelete.hide();
            window.toast('操作成功');
        } else {
            window.toast(result.state.msg);
        }

        // console.log('delete:', result);
    }

    async onTabChange(tabItem) {
        const bottomTab = this.state.currentBottomTab;

        switch(bottomTab) {
            case MEDIA_MARKET:
                await this.setState({
                    currentMarketTypeTab: String(tabItem.id),
                    currentMarketPage: 1,
                });
                this.getMarketChannelList({
                    tagId: this.state.currentMarketTypeTab,
                    ...this.state.searchParams,
                });
                
                break;
            case APPLY_AGENT:
                break;
            case MARKET_EDIT:
                await this.setState({
                    currentManageTypeTab: String(tabItem.id),
                    currentManagePage: 1,
                });
                this.getReprintChannelList({tagId: String(tabItem.id)});
                break;
        }

        // if (bottomTab === MEDIA_MARKET) {
        //     await this.setState({
        //         currentMarketTypeTab: String(tabItem.id),
        //         currentMarketPage: 1,
        //     });
        //     this.getMarketChannelList({tagId: String(tabItem.id)});
        // } else {
        //     await this.setState({
        //         currentManageTypeTab: String(tabItem.id),
        //         currentManagePage: 1,
        //     });
        //     this.getReprintChannelList({tagId: String(tabItem.id)});
        // }
    }

    async searchMarketChannels(resetTab = true) {

        let tagId = resetTab ? '' : this.state.currentMarketTypeTab;
        if (resetTab) {
            this.setState({
                currentMarketTypeTab: '',
                currentMarketPage: 1,
            })
            this._topBar.scorllToLeft();
        }

        this.getMarketChannelList({
            tagId,
            ...this.state.searchParams,
        });

    }

    // onSortBtnClick(sortItem) {
    //     this.setState({
    //         searchParams: {
    //             ...this.state.searchParams,
    //             orderBuyNumber: sortItem.type === 'orderBuyNumber' ? sortItem.sortOrder : '',
    //             orderPrice: sortItem.type === 'orderPrice' ? sortItem.sortOrder : '',
    //         }
    //     }, () => this.searchMarketChannels(false))
    // }

    onSortBtnClick(sortBy, sortOrder) {
        const sortParams = {
            orderBuyNumber: '',
            orderEndRate: '',
            orderPrice: '',
            orderReward: '',
        };
        switch (sortBy) {
            case 'sales': 
                sortParams.orderBuyNumber = sortOrder;
                break;
            case 'reward':
                sortParams.orderReward = sortOrder;
                break;
            case 'endRate': 
                sortParams.orderEndRate = sortOrder;
                break;
            case 'price':
                sortParams.orderPrice = sortOrder;
                break;
            default:
                break;
        }
        this.setState({
            searchParams: {
                ...this.state.searchParams,
                ...sortParams,
            }
        }, () => this.searchMarketChannels(false));
    }

    setSearchChannelNameAndSearch(channelName) {
        this.setState({
            searchParams :{
                ...this.state.searchParams,
                channelName: channelName,
            }
        }, this.searchMarketChannels);
    }

    setSearchChannelName(channelName) {
        this.setState({
            searchParams: {
                ...this.state.searchParams,
                channelName,
            }
        })
    }

    setSearchHistroyVisiable(isShow) {
        this.setState({ showSearchHistory: isShow });
    }

    async onBottomBarChange(id){
        // if (this.state.userInfo.userAdminLevel === 'normal') {
        //     window.toast("没有权限");
        //     return;
        // }

        if (id === this.state.currentBottomTab) {
            return;
        }
        switch(id) {
            case MEDIA_MARKET:
                await this.setState({
                    currentMarketPage: 1,
                });
                this.getMarketChannelList({tagId: this.state.currentMarketTypeTab});
                break;
            case APPLY_AGENT:
                break;
            case MARKET_EDIT:
                await this.setState({
                    currentManagePage: 1,
                });
                this.getReprintChannelList({tagId: this.state.currentManageTypeTab});
                break;

        }

        // if (id === MEDIA_MARKET) {
        //     await this.setState({
        //         currentMarketPage: 1,
        //     });
        //     this.getMarketChannelList({tagId: this.state.currentMarketTypeTab});
        // } else {
        //     await this.setState({
        //         currentManagePage: 1,
        //     });
        //     this.getReprintChannelList({tagId: this.state.currentManageTypeTab});
        // }
        this.setState({ currentBottomTab: id})
    }

    showApplyAgent() {
        this.setState({ currentBottomTab: APPLY_AGENT})
    }

    async submitApplyAgent() {
        const params = {
            name: this.state.applyData.name,
            mobile: this.state.applyData.mobile,
            applyId: this.state.applyData.id || '',
            agentId: this.agentId,
        }

        const result = await api({
            method: 'POST',
            showLoading: false,
            body: {
                ...params,
            },
            url: '/api/wechat/studio/mediaMarket/applyAgent',
        });

        // console.log('apply-agent',result);
        
        if (result.state.code === 0) {
            this.setState({
                userInfo: {
                    userAdminLevel: "none-agent",
                    hasEditPower: "Y",
                },
                applyData: {
                    ...this.state.applyData,
                    id: result.data.id,
                    isApply: 'Y',
                }
            })
            window.toast("申请已发送")
            return true;
        } else {
            window.toast(result.state.msg);
            return false;
        }
    }

    onClosePushBox(){
        this.setState({
            showPromotionModal:false,
        });
    }

    showReprintPushBox(promotionData) {
        this.setState({ 
            promotionData,
            showPromotionModal: true,
        })
    }

    async loadNext(callback) {
        const {
            currentBottomTab,
            currentMarketTypeTab,
            currentMarketPage,
            currentManageTypeTab,
            currentManagePage,
        } = this.state;
        if (currentBottomTab === MEDIA_MARKET) {
            await this.getMarketChannelList({ 
                tagId: currentMarketTypeTab, 
                page: currentMarketPage + 1,
            }, true);
            this.setState({ currentMarketPage: currentMarketPage + 1});
            callback();
        } else {
            await this.getReprintChannelList({
                tagId: currentManageTypeTab,
                page: currentManagePage + 1,
            }, true);
            this.setState({ currentManagePage: currentManagePage + 1});
            callback();
        }

    }

    showReprintModal(channelInfo) {
        // if (!this.state.userInfo.hasEditPower) {
        //     window.toast("没有权限");
        //     return;
        // }

        this.setState({
            showReprintModal: true,
            currentReprintChannel: {...channelInfo}
        });
    }

    closeReprintModal() {
        // console.log(1)
        this.setState({
            showReprintModal: false,
        })
    }

    setReprintTipModal(showReprintTipModal){
        this.setState({ showReprintTipModal, })
    }

    setReprintSuccessModal(showReprintSuccessModal) {
        this.setState({ showReprintSuccessModal })
    }   

    handleReprintSuccessBtnClick(tag){
        switch(tag) {
            case 'confirm':
                break;
            case 'cancel':
                this.setState({ currentBottomTab: MARKET_EDIT});
                this.getReprintChannelList({tagId: this.state.currentManageTypeTab});
                break;
            
        }
        this.setReprintSuccessModal(false);
        this.closeReprintModal();
    }

    async handleSelectLiveBtnClick(tag){
        const userInfo = this.state.userInfo;
        const { liveId, curSelectedLiveId, curSelectedUserImg, curSelectedUserName } = userInfo;

        switch(tag) {
            case 'confirm':
                {
                    let search = location.search.slice(1);
                    if (location.search.indexOf('selectedLiveId') > -1) {
                        search = search.replace(/selectedLiveId=\d+/, `selectedLiveId=${curSelectedLiveId}`)
                    } else if (search) {
                        search += `&selectedLiveId=${curSelectedLiveId}`
                    } else {
                        search = `selectedLiveId=${curSelectedLiveId}`
                    }
                    window.history.pushState(null, null, `${location.pathname}?${search}`);
                    this.setLocalLiveId(curSelectedLiveId);
                    // if (liveId === curSelectedLiveId) break;
                    // console.log(liveId)
                    await this.setState({ 
                        userInfo: { 
                            ...userInfo, 
                            liveId: curSelectedLiveId,
                        }
                    });
                    // this.getMarketChannelList();
                    this.getReprintChannelList();
                    // this.getLiveTagList();
                    // this.getUserInfo();
                    // this.getMediaActive();
                    // this.getMarketChannelTagList();
                    // if (this.agentId) this.getApplyData(this.agentId);
                    this.initState(true);
                }
                break;
            case 'cancel':
                break;
            
        }
        this.setState({showSelectLiveModal: false});
    }

    setLocalLiveId(liveId) {
        // console 
        if (this.marketType === MEDIA) {
            localStorage.setItem('mediaLiveId',liveId);
        } else if (this.marketType === AGENT) {
            // const agentId = getVal(props, 'location.query.agentId');
            localStorage.setItem(`agentLiveId-${this.agentId}`, liveId);
        }
    }

    async onDeleteBtnConfirm(tag) {
        const { channelId, index } = this.state.currentEditChannel
        if (tag === 'confirm') {
            this.deleteReChannel(channelId);
        }
    }

    async onDownBtnConfirm(tag) {
        const { channelId, index } = this.state.currentEditChannel
        if (tag === 'confirm') {
            this.upOrDownCourse('down', channelId);
        }
    }

    async onUpBtnConfirm(tag) {
        const { channelId, index } = this.state.currentEditChannel
        if (tag === 'confirm') {
            this.upOrDownCourse('up', channelId);
        }
    }

    showDeleteConfirm(channelInfo) {
        this.setState({ currentEditChannel: channelInfo });
        // console.log(channelInfo)
        this.refs.confirmDelete.show();
    }

    showDownConfirm(channelInfo) {
        this.setState({ currentEditChannel: channelInfo });
        // console.log(channelInfo)
        this.refs.confirmDown.show();
    }

    showUpConfirm(channelInfo) {
        this.setState({ currentEditChannel: channelInfo });
        // console.log(channelInfo)
        this.refs.confirmUp.show();
    }

    onApplyNameChange(e) {
        this.setState({ 
            applyData: {
                ...this.state.applyData,
                name: String(e.target.value),
            }
        })
    }

    onApplyMobileChange(e) {
        this.setState({
            applyData: {
                ...this.state.applyData,
                mobile: String(e.target.value),
            }
        })
    }
    onSelectLiveClick(liveInfo) {
        // console.log(liveInfo)
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                marketType: liveInfo.agentId === '' ? MEDIA : AGENT,
                curSelectedLiveId: liveInfo.liveId,
                curSelectedUserImg: liveInfo.headImg,
                curSelectedUserName: liveInfo.nickName,

            },
            agentInfo: {
                ...this.state.agentInfo,
                agentId: liveInfo.agentId !== '' ? liveInfo.agentId : null
            }

        });
    }

    showSelectLiveModal() {
        this.setState({showSelectLiveModal: true});
    }
    
    hideSelectLiveModal() {
        this.setState({ showSelectLiveModal: false });
    }

    scrollToDo() {
        if (this.state.currentBottomTab === MEDIA_MARKET) return;

        const target = document.querySelector('.inside-top-bar');
        const insideTopBarHide = this.state.insideTopBarHide
        const box = target.getBoundingClientRect();
        if (box.top < 0 && !insideTopBarHide) {
            this.setState({ insideTopBarHide: true });
        } else if (box.top > 0 && insideTopBarHide){
            this.setState({ insideTopBarHide: false });
        }
    }

    onTopBarScroll(curTabScrollLeft) {
        this.setState({ curTabScrollLeft });
    }

    // 高分成活动页面跳转
    jumpTo(url) {
        if (this.state.userInfo.liveId) {
            url += `?selectedLiveId=${this.state.userInfo.liveId}`;
        }
        locationTo(url);
    }

    render() {

        const {
            currentBottomTab,
            marketTabList,
            reprintTabList,
            currentMarketTypeTab,
            currentManageTypeTab,
            curTabScrollLeft,
            marketChannelList,
            reprintChannelList,
            hasMore,
            userInfo,
            applyData,
            loading,
            agentInfo,
            insideTopBarHide,
            showSearchHistory,
        } = this.state;


        const { 
            marketType, 
            userAdminLevel, 
            hasEditPower, 
            creatLiveList,
            manageLiveList, 
            liveId,
            curSelectedLiveId,
            percent,
        } = userInfo;
        // console.log('hasEditPower', hasEditPower);
        let tabList =  [];
        let activeTab = ''; 
        let isNoMore = false;
        let noneOne = false;
        let title = "知识通商城";
        let bottomText = null;
        let showOutSideTopBar = insideTopBarHide || currentBottomTab === MEDIA_MARKET
        
        const isEdit = currentBottomTab === MARKET_EDIT;


        if (this.agentId && userAdminLevel !== 'selfMedia') {
            title = userAdminLevel === 'agent' ? "我的分销" : this.state.agentInfo.name;
        }

        if (this.agentId && userAdminLevel !== 'selfMedia') {
            bottomText= `${this.state.agentInfo.name} | 千聊官方合作服务商`
        }

        switch(currentBottomTab) {
            case MEDIA_MARKET:
                tabList = marketTabList;
                activeTab = currentMarketTypeTab;
                isNoMore = marketChannelList.length > 0 && !hasMore;
                noneOne = marketChannelList.length === 0 && !loading;
                break;
            case APPLY_AGENT:
                tabList = [];
                break;
            case MARKET_EDIT:
                tabList = reprintTabList;
                activeTab = currentManageTypeTab;
                isNoMore = reprintChannelList.length > 0 && !hasMore;
                noneOne = reprintChannelList.length === 0 && !loading;
                break;
        }

        // if ( currentBottomTab === MEDIA_MARKET) {
        //     tabList = marketTabList;
        //     activeTab = currentMarketTypeTab;
        //     isNoMore = marketChannelList.length > 0 && !hasMore;
        //     noneOne = marketChannelList.length === 0
        // } else {
        //     tabList = reprintTabList;
        //     activeTab = currentManageTypeTab;
        //     isNoMore = reprintChannelList.length > 0 && !hasMore;
        //     noneOne = reprintChannelList.length === 0
        // }
        return (
            <Page className="media-market-container" title={title}>
                <TopBar
                    tabList={tabList}
                    // sortBtn='分成'
                    activeTab={activeTab}
                    // onSortChange={this.onSortChange}
                    onTabChange={this.onTabChange}
                    isAgentTop={false}
                    hide={!showOutSideTopBar}
                    currentBottomTab={currentBottomTab}
                    curTabScrollLeft={curTabScrollLeft}
                    onTopBarScroll={this.onTopBarScroll}
                    ref={ele => this._topBar = ele}
                />
                { 
                    currentBottomTab === APPLY_AGENT ?
                    <ApplyAgent
                        onApplyNameChange={this.onApplyNameChange}
                        onApplyMobileChange={this.onApplyMobileChange}
                        submitApplyAgent={this.submitApplyAgent}
                        {...applyData}
                    /> :
                    null
                }
                {
                    currentBottomTab === MEDIA_MARKET ? 
                    <SearchPanel
                        searchText={this.state.searchParams.channelName}
                        currentBottomTab={currentBottomTab}
                        showSearchHistory={showSearchHistory}
                        onSortBtnClick={this.onSortBtnClick}
                        searchMarketChannels={this.searchMarketChannels}
                        setSearchHistroyVisiable={this.setSearchHistroyVisiable}
                        setSearchChannelName={this.setSearchChannelName}
                        setSearchChannelNameAndSearch={this.setSearchChannelNameAndSearch}
                    /> :
                    null
                }
                <ScrollToLoad 
                    className={`list-container ${isEdit ? 'agent-list' : ""}`}
                    loadNext={this.loadNext}
                    noMore={isNoMore}
                    emptyPicIndex={3}
                    emptyMessage="暂无课程"
                    noneOne={noneOne}
                    scrollToDo={this.scrollToDo}
                    bottomText={bottomText}
                    // disableScroll={true}
                >             
                    {
                        isEdit ?
                        <div className="agent-user-info">
                            <div className="detail">
                                <div className="head-img" style={{backgroundImage: `url(${userInfo.headImgUrl})`}}></div>
                                <div className="info">
                                    <span className="name">{userInfo.name}</span>
                                    <span className="percent">我的分成比例：{percent}%</span>
                                </div>
                            </div>
                            <div className="link">
                                {
                                    this.state.liveEntity ? <a className="go-btn" href={`/wechat/page/live/${this.liveId}`}>进入知识店铺 <span className="icon_enter"></span></a> : null
                                }
                                {
                                    this.state.liveEntity ? <div className="select-btn" onClick={this.showSelectLiveModal}>选择直播间</div> : null
                                }
                            </div>
                        </div>
                        : null
                    }
                    <TopBar
                        tabList={tabList}
                        // sortBtn='分成'
                        activeTab={activeTab}
                        // onSortChange={this.onSortChange}
                        onTabChange={this.onTabChange}
                        isAgentTop={true}
                        className={'inside-top-bar'}
                        currentBottomTab={currentBottomTab}
                        hide={!isEdit}
                        onTopBarScroll={this.onTopBarScroll}
                        curTabScrollLeft={curTabScrollLeft}
                    /> 
                    {
                        this.state.currentBottomTab === MEDIA_MARKET ?
                        <div>
                            <div className="high-division-content">
                            {
                                this.state.marketBanners.length > 0 &&
                                <div className="banners-container">
                                    <Carousel options={{auto: 3000, continuous: true}}>
                                    {
                                        this.state.marketBanners.map((item, index) => {
                                            return (
                                                <div className="banner" key={index} onClick={() => { locationTo(item.url) }}>
                                                    <img alt="" src={`${item.backgroundUrl}@290h_750w_1e_1c_2o`} />
                                                </div>
                                            )
                                        })
                                    }
                                    </Carousel>
                                </div>
                            }
                                <div className="high-division-nav">
                                    <div className="nav-item" onClick={() => { this.jumpTo('/wechat/page/live-studio/media-market/top-ten-course') }}>
                                        <img src={require('./img/icon_hot.png')} alt="" />
                                        <span>热销排行</span>
                                    </div>
                                    <div className="nav-item" onClick={() => { this.jumpTo('/wechat/page/live-studio/media-market/favourable-course') }}>
                                        <img src={require('./img/icon_favourable.png')} alt="" />
                                        <span>特惠专区</span>
                                    </div>
                                    <div className="nav-item" onClick={() => { this.jumpTo('/wechat/page/live-studio/media-market/boutique-course') }}>
                                        <img src={require('./img/icon_boutique.png')} alt="" />
                                        <span>精品推荐</span>
                                    </div>
                                </div>
                                {
                                    this.state.highDivisionCourses.length > 0 && this.state.userInfo.userAdminLevel != 'agent' && !this.agentId &&
                                    <div className="high-division-courses">
                                        <h1 className="high-division-title">限时高分成</h1>
                                        <div className="activity-courses">
                                            <div className="activity-courses-container">
                                                <div className="content">
                                                {
                                                    this.state.highDivisionCourses.map((item, index) => {
                                                        return (
                                                            <div className="course-item" key={index} data-index={index} onClick={this.handleActivityCourseClick}>
                                                                <img className="head-image" alt="" src={`${item.businessHeadImg}@170h_280w_1e_1c_2o`} />
                                                                <div className="activity-date">{formatDate(item.startTime, 'MM.dd')}-{formatDate(item.endTime, 'MM.dd')}</div>
                                                                <div className="proportion">
                                                                    <span>活动高分成</span><em>{item.selfMediaPercent}%</em>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="market-courses">
                                <h1 className="market-courses-title">优质课程</h1>
                            {
                                this.state.marketChannelList.map((item, index) => {
                                    return <MarketChannelItem 
                                        index={index}
                                        key={item.businessId}
                                        // 三方推文id
                                        tweetId={item.tweetId}
                                        // 三方推文链接
                                        tweetUrl={item.url}
                                        // 当前直播间 liveId
                                        liveId={this.liveId}
                                        // 被转播的课程直播间 liveId
                                        reprintLiveId={item.liveId}
                                        // 被转载的直播间名称
                                        reprintLiveName={item.liveName}
                                        // 被转播的系列课 id
                                        reprintChannelId={item.businessId}
                                        // 转载方系列课Id
                                        relayChannelId={item.relayChannelId}
                                        // 被转播的系列课名称
                                        reprintChannelName={item.businessName}
                                        // 被转播的系列课头图
                                        reprintChannelImg={item.businessHeadImg}
                                        // 被转播的系列课原价
                                        reprintChannelAmount={item.amount}
                                        // 被转播的系列课优惠价 无
                                        reprintChannelDiscount={item.discount}
                                        // 当前直播间分成比例
                                        selfMediaPercent={item.selfMediaPercent}
                                        // 当前直播间分成收益
                                        selfMediaProfit={item.selfMediaProfit}
                                        chargeMonths={item.chargeMonths}
                                        // 学习次数
                                        learningNum={item.learningNum}
                                        // 是否是高分成活动课程
                                        isActivityCourse={item.isActivityCourse}
                                        // 推广操作
                                        showReprintPushBox={this.showReprintPushBox}
                                        // 是否可以转播
                                        isRelay={item.isRelay}
                                        onReprint={this.showReprintModal}
                                        setReprintTipModal={this.setReprintTipModal}
                                        hasEditPower={hasEditPower}
                                        discountStatus={item.discountStatus}
                                        userAdminLevel={this.state.userInfo.userAdminLevel}
                                        showApplyAgent={this.showApplyAgent}
                                        handleListen={this.handleListen}
                                        currentAudio={this.state.currentAudio}
                                        percent={this.state.audioPercent}
                                        audioStatus={this.state.audioStatus}
                                        currentPlayTab={this.state.currentPlayTab}
                                        currentMarketTypeTab={this.state.currentMarketTypeTab}
                                    />
                                })
                            }
                            </div>
                        </div>
                        : 
                        null
                    }
                    {
                        this.state.currentBottomTab === MARKET_EDIT ?
                        this.state.reprintChannelList.map((item, index) => {
                            return <ManageChannelItem 
                                index={index}
                                key={item.id}
                                // 三方推文id 
                                tweetId={item.tweetId}
                                // 三方推文链接 无
                                tweetUrl={item.tweetUrl}
                                // 三方推文名称
                                tweetTitle={item.tweetTitle}
                                // 当前直播间 liveId
                                liveId={this.liveId}
                                // 被转播的课程直播间 liveId
                                reprintLiveId={item.liveId}
                                // 被转载的直播间名称 
                                reprintLiveName={item.liveName}
                                // 被转播的系列课 id
                                reprintChannelId={item.id}
                                // 被转播的系列课名称
                                reprintChannelName={item.name}
                                // 被转播的系列课头图
                                reprintChannelImg={item.headImage}
                                // 被转播的系列课原价 无
                                reprintChannelAmount={item.amount}
                                // 被转播的系列课优惠价 无
                                reprintChannelDiscount={item.discount}
                                // 当前直播间分成比例
                                selfMediaPercent={item.selfMediaPercent}
                                // 当前直播间分成收益
                                selfMediaProfit={item.selfMediaProfit}
                                // 是否上下架 无
                                upOrDown={item.upOrDown}
                                // 订单数量
                                orderTotalNumber={item.orderTotalNumber}
                                chargeMonths={item.chargeMonths}
                                // 订单金额
                                orderTotalMoney={item.orderTotalMoney}
                                showReprintPushBox={this.showReprintPushBox}
                                showDeleteConfirm={this.showDeleteConfirm}
                                showDownConfirm={this.showDownConfirm}
                                showUpConfirm={this.showUpConfirm}
                                discountStatus={item.discountStatus}
                            />
                        }):
                        null
                    }
                </ScrollToLoad>

                {
                    this.state.userInfo.userAdminLevel !== 'super-agent' ?
                    <BottomBar 
                        barList={this.state.bottomBarList}
                        activeTab={currentBottomTab}
                        onChange={this.onBottomBarChange}
                    /> :
                    null
                }

                <ReprintModal 
                    liveId={this.liveId}
                    show={this.state.showReprintModal}
                    onClose={this.closeReprintModal}
                    channelInfo={this.state.currentReprintChannel}
                    channelTagList={this.state.reprintTabList}
                    reprintChannel={this.reprintChannel}
                />
                

                {
                    this.state.showPromotionModal&&
                    <ReprintPushBox 
                        {...this.state.promotionData}
                        onClose={this.onClosePushBox}
                    />
                }

                <MiddleDialog
                    show = { this.state.showReprintTipModal }
                    theme = 'empty'
                    close = {false}
                    onClose = {() => this.setReprintTipModal(false)}
                    buttons = 'cancel'
                    cancelText = '关闭'
                    buttonTheme ='line'
                    onBtnClick = {() => this.setReprintTipModal(false)}
                    className = "reprint-tips-modal"
                >
                    <div className = 'reprint-tips'>
                        <p className="tip-text">亲爱的用户，我们的运营人员将很快联系您洽谈合作事宜并为您开通权限。如有疑问，请添加自媒体版业务负责人微信:</p>
                        <img src="https://img.qlchat.com/qlLive/media-markt/kefuwx.png" alt="微信客服" className="wx-img"/>
                        <p className="wx-tip">长按识别二维码添加</p>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show = { this.state.showReprintSuccessModal }
                    theme = 'empty'
                    close = {false}
                    onClose = {() => this.setReprintSuccessModal(false)}
                    buttons = 'cancel-confirm'
                    cancelText = '查看列表'
                    confirmText = '继续转载'
                    buttonTheme ='line'
                    onBtnClick = {this.handleReprintSuccessBtnClick}
                    className = "reprint-success-modal"
                >
                    <div className = 'reprint-success'>
                        <div className="success-logo icon_checked"></div>
                        <span className="success-text">转载成功</span>
                        <span className="success-tip">该课程已成功转到你的直播间</span>
                        <div className="card"> 
                            <ChannelItemCard 
                                // 类型
                                itemType="reprint-item"
                                {...this.state.currentReprintChannel}
                            />
                        </div>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show = { this.state.showSelectLiveModal }
                    theme = 'empty'
                    close = {false}
                    onClose = {this.hideSelectLiveModal}
                    buttons = 'cancel-confirm'
                    cancelText = '取消'
                    confirmText = '确定'
                    buttonTheme ='line'
                    onBtnClick = {this.handleSelectLiveBtnClick}
                    className = "select-live-modal"
                >
                    <div className="title">选择直播间</div>
                    <div className={`live-list-container live-list-bottom-border ${creatLiveList && creatLiveList.length > 0 ? '' : 'hide' }`}>
                        <div className="list-title">我的直播间</div>
                        <ul className="list">
                            {
                                creatLiveList ?
                                creatLiveList.map((item) => {
                                    return <li 
                                        className={`list-item ${item.liveId === curSelectedLiveId ? 'selected' : ''}`} 
                                        key={item.liveId} 
                                        onClick={() => this.onSelectLiveClick(item)}
                                    >
                                        {item.liveName} 
                                        <span className={`icon_checked ${item.liveId === curSelectedLiveId ? '' : 'hide' }`}></span>
                                    </li>
                                })
                                :
                                null
                            }
                        </ul>
                    </div>
                    <div className={`live-list-container ${manageLiveList && manageLiveList.length > 0 ? '' : 'hide' }`}>
                        <div className="list-title">我管理的直播间</div>
                        <ul className="list">
                            {
                                manageLiveList ? 
                                manageLiveList.map((item) => {
                                    return <li 
                                        className={`list-item ${item.liveId === curSelectedLiveId ? 'selected' : ''}`} 
                                        key={item.liveId} 
                                        onClick={() => this.onSelectLiveClick(item)}
                                    >
                                        {item.liveName}
                                        <span className={`icon_checked ${item.liveId === curSelectedLiveId ? '' : 'hide' }`}></span>
                                    </li>
                                }) :
                                null
                            }
                        </ul>
                    </div>
                </MiddleDialog>

                <Confirm 
                    ref="confirmDelete"
                    buttons="cancel-confirm"
                    title="确定要从列表中删除此课程?"
                    buttonTheme="line"
                    className="confirm-modal"
                    onBtnClick={this.onDeleteBtnConfirm}
                >
                    <p className="info">删除后，您已使用推广的链接将失效，请权衡</p>
                </Confirm>

                <Confirm 
                    ref="confirmDown"
                    buttons="cancel-confirm"
                    title="确定要下架此课程?"
                    buttonTheme="line"
                    className="confirm-modal"
                    onBtnClick={this.onDownBtnConfirm}    
                >
                    <p className="info">下架后，该系列课将不再展示在您的知识店铺，已购买学员可正常学习</p>
                </Confirm>

                <Confirm 
                    ref="confirmUp"
                    buttons="cancel-confirm"
                    title="确定要重新上架此课程？"
                    buttonTheme="line"
                    className="confirm-modal"
                    onBtnClick={this.onUpBtnConfirm}
                />

            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
    userInfo: state.common.userInfo.user,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MediaMarket)
