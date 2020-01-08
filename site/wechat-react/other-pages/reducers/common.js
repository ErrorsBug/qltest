
import {
    TOAST,
    LOADING,
    SYSTIME,
    SET_STS_AUTH,
    TOGGLE_PAYMENT_DIALOG,
    USERINFO,
    UPDATE_USER_POWER,
    INIT_SUBSCRIBE,
    SET_IS_LIVE_ADMIN,
    IS_QLCHAT_SUBSCRIBE,
    INIT_TOP_BANNER_SUBSCRIBE_INFO,
    SET_IS_QL_LIVE,
    SET_IS_SERVICE_WHITELIVE,
    SET_OFFICIAL_LIVE_ID,
    UPDATE_VIDEO_UPLOAD_AUTH,
    UPDATE_VIDEO_UPLOAD_STATUS,
    UPDATE_VIDEO_UPLOAD_PROGRESS,
} from '../actions/common'
import {
    INIT_APP_OPENID,
    UPDATE_USERINFO,
} from '../../actions/common';
import {
    SET_SHARE_RATE
} from 'common_actions/live'

const initData = {

    // toast
    toast: {
        show: false,
        msg: '',
        timeout: 1000,
    },

    // loading显示状态
    loading: false,

    // 记录系统时间
    sysTime: null,

    // 如果有登录过app，这个字段就有值
    appOpenId: '',
    
    // 虚拟二维码链接
    virtualQrcodeUrl: '',

    payment: {
        showDialog: false
    },

	userInfo: {
        user: {}
    },

    power:{

    },
	// 是否关注公众号及二维码弹出逻辑判断
	subscribe: {

    },
    
    isLiveAdmin: null,
    liveAdminOverDue: null,
    liveLevel: null,
    cookies: null,
    // 是否关注公众号
    isQlchatSubscribe: false,
    // 各页面顶部条关注逻辑参数
    topBannerSubscribeStatus: {

    },
    isQlLive:'',
    isWhiteLive:'',
    officialLiveId: '',
    // 平台分销比例
    platformShareRate:0,
};

export function common (state = initData, action) {
    switch (action.type) {

        case TOAST:
            return { ...state, ...{ toast: action.payload } };

        case LOADING:
            return { ...state, ...{ loading: action.status } };

        case SYSTIME:
            return {...state, ...{sysTime: action.sysTime}};

        case SET_STS_AUTH:
            return { ...state, ...{ stsAuth: action.stsAuth } };
        
        case TOGGLE_PAYMENT_DIALOG: 
            return { 
                ...state, 
                ...{
                    payment: {
                        showDialog: action.show,
                        qcodeId: action.qcodeId,
                        qcodeUrl: action.qcodeUrl,
                    }
                }
            };
        case USERINFO:
            return {
                ...state,
                ...{
                    userInfo: action.userInfo
                }
            };
        case UPDATE_USERINFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    user: {
                        ...state.userInfo.user,
                        ...action.userInfo,
                    }
                }
            }
        case UPDATE_USER_POWER:
            return {
                ...state,
                power: action.power
            };
        case INIT_SUBSCRIBE:
            return {
	            ...state,
	            subscribe: action.subscribeInfo
            };
        case SET_IS_LIVE_ADMIN:
            return {
                ...state,
                isLiveAdmin: action.data.isLiveAdmin,
                liveAdminOverDue: action.data.liveAdminOverDue,
                liveLevel: action.data.liveLevel,
            }
        case 'SET_COOKIES':
            return {
                ...state,
                cookies: action.cookies
            }
        case IS_QLCHAT_SUBSCRIBE:
            return {
                ...state,
                isQlchatSubscribe: action.payload.isQlchatSubscribe
            }
        case INIT_TOP_BANNER_SUBSCRIBE_INFO:
            return {
                ...state,
                topBannerSubscribeStatus: action.data
            }
        case INIT_APP_OPENID:
            return {
                ...state,
                appOpenId: action.appOpenId,
            }
        case SET_IS_QL_LIVE:
            return { ...state, isQlLive: action.data.isQlLive }

        case SET_IS_SERVICE_WHITELIVE:
            return { ...state, isWhiteLive: action.data.isWhite }

        case SET_OFFICIAL_LIVE_ID:
            return { ...state, officialLiveId: action.data }
        case SET_SHARE_RATE: 
            return {
                ...state,
                platformShareRate: action.shareRate
            }
        case UPDATE_VIDEO_UPLOAD_AUTH:
            return {
                ...state,
                ...{ 
                    videoAuth: action.videoAuth||{},
                    duration: action.duration||0 
                }
            };
        case UPDATE_VIDEO_UPLOAD_STATUS:
            return {
                ...state,
                videoStatus: action.status||'',
            };
        case UPDATE_VIDEO_UPLOAD_PROGRESS:
            return {
                ...state,
                videoUploadPercent: action.percent||'',
            };
            
        default:
            return state
    }
}
