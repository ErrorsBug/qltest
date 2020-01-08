
import {
    TOAST,
    LOADING,
    USERINFO,
    SET_LIVE_LIST_MODAL_SHOW,
    SET_LOGIN_MODAL_SHOW,
    SET_PROMOTION_MODAL_SHOW,
    SET_REPRINT_MODAL_SHOW,
    INIT_STATE,
    SET_LIVE_INFO,
    SET_USER_INFO,
    SET_USER_IDENTITY,
    UPDATA_CREATOR_LIVE_LIST,
    UPDATE_AGENT_INFO,
    NAV_COURSE_MODULE
} from '../actions/common'

const initData = {

    // toast
    toast: {
        show: false,
        msg: '',
        timeout: 1000,
    },

    // loading显示状态
    loading: false,

    // 是否有管理权限
    relayAuth: null,

    // 当前用户信息
    userInfo: {
        userId: null,
        headImgUrl: null,
        name: null,
        openId: null, 
    },

    // 当前账户信息
    accountInfo: {
        // 是否有知识通账号
        accountStatus: null,
        // 是否转载过系列课
        hasRelayChannel: null,
        // 一级代理 id
        agentId: null,
    },

    liveInfo: {
        liveId: null,
        liveName: null,
        headImg: null,
        nickName: null,
        isBindThird: null,
    },

    userMgrLiveList: {
        creatorList: [],
        managerList: [],
    },

    agentInfo: {
        agentId: null,
        isExist: null,
        agentName: null,
        isSelf: null,
    },

    /**
     * 用户身份
     * 未登陆：not-login
     * 无直播间：none-live
     * 普通B端用户：normal
     * 知识通用户：knowledge
     * 二级代理：agent
     * 一级代理：super-agent
     */
    userIdentity: 'not-login',

    modal: {
        showLiveListModal: 'N',
        showLoginModal: 'N',
        showPromotionModal: 'N',
        showReprintModal: 'N',
    },

    pushStatus: null,
    // 推荐首页课程模块导航
    moduleList: []

};

export function common(state = initData, action) {
    switch (action.type) {

        case TOAST:
            return { ...state, ...{ toast: action.payload } };

        case LOADING:
            return { ...state, ...{ loading: action.status } };

        case USERINFO:
            return {
                ...state,
                ...{
                    userInfo: action.userInfo,
                },
            };
        case SET_LOGIN_MODAL_SHOW: 
            return {
                ...state,
                modal: {
                    ...state.modal,
                    showLoginModal: action.show
                }
            };
        case SET_LIVE_LIST_MODAL_SHOW: 
            return {
                ...state,
                modal: {
                    ...state.modal,
                    showLiveListModal: action.show
                }
            };
        case SET_PROMOTION_MODAL_SHOW: 
            return {
                ...state,
                modal: {
                    ...state.modal,
                    showPromotionModal: action.show
                }
            }
        case INIT_STATE:
            // console.log(action)
            return {
                ...state,
                liveInfo: {...state.liveInfo, ...action.data.liveInfo},
                agentInfo: {...state.agentInfo, ...action.data.agentInfo},
                userMgrLiveList: {...state.userMgrLiveList, ...action.data.userMgrLiveList},
                accountInfo: {...state.accountInfo, ...action.data.accountInfo},
                relayAuth: action.data.relayAuth,
                pushStatus: action.data.pushStatus,
            }
        case SET_LIVE_INFO:
            return {
                ...state,
                liveInfo: {...state.liveInfo, ...action.liveInfo},
                relayAuth: action.relayAuth,
            }
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: {...state.userInfo, ...action.userInfo}
            }

        case SET_USER_IDENTITY: 
            return {
                ...state,
                userIdentity: action.identity
            }
    

        case SET_REPRINT_MODAL_SHOW: 
            // console.log(action.show)
            return {
                ...state,
                modal: {
                    ...state.modal,
                    showReprintModal: action.show
                }
            }
        
        case UPDATA_CREATOR_LIVE_LIST:
            return {
                ...state,
                userMgrLiveList: {
                    ...state.userMgrLiveList,
                    creatorList: [...action.list]
                }
            }

        case UPDATE_AGENT_INFO:
            return {
                ...state,
                agentInfo: { ...action.agentInfo}
            }

        case NAV_COURSE_MODULE:
            return {
                ...state,
                moduleList: action.moduleList
            }
        
        default:
            return state
    }
}
