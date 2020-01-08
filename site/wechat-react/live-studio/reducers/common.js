
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
    SET_IS_LIVE_MEDIA,
    SET_LIVE_PRICE,
    IS_LOGIN,
    GET_LIVE_ENTITY,
    GET_RELATIONINFO,
    
} from '../actions/common'
import {UPDATE_USERINFO} from '../../actions/common'

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

    // 虚拟二维码链接
    virtualQrcodeUrl: '',

    payment: {
        showDialog: false
    },

    userInfo: {
        user: {}
    },

    power: {

    },
    // 是否关注公众号及二维码弹出逻辑判断
    subscribe: {

    },
    // 是否专业版
    isLiveAdmin: null,
    liveAdminOverDue: null,
};

export function common(state = initData, action) {
    switch (action.type) {

        case TOAST:
            return { ...state, ...{ toast: action.payload } };

        case LOADING:
            return { ...state, ...{ loading: action.status } };

        case SYSTIME:
            return { ...state, ...{ sysTime: action.sysTime } };

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
                liveId: action.data.liveId,
                liveName: action.data.liveName,
                isLiveAdmin: action.data ? action.data.isLiveAdmin : 'N',
                liveAdminStart: action.data ? action.data.liveAdminStart : 0,
                liveAdminOverDue: action.data ? action.data.liveAdminOverDue : 0,
            }
        case SET_IS_LIVE_MEDIA:
            return {
                ...state,
                isLiveMedia: action.data.isLiveMedia,
            }
        case SET_LIVE_PRICE:
            return {
                ...state,
                livePrice: action.data.livePrice
            }
        case IS_LOGIN: {
            return {
                ...state,
                isLogin: action.isLogin
            }
        }
        case GET_LIVE_ENTITY: 
            return {
                ...state,
                ...action.liveEntity
            }
        case GET_RELATIONINFO:
            return {
                ...state,
                ...action.payload
            }
        case UPDATE_USERINFO:
            return {
                ...state,
                userInfo: {
                    user: {
                        ...action.userInfo
                    }
                } 
            }
        default:
            return state
    }
}
