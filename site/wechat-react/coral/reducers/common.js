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

    // 记录系统时间
    sysTime: null,
    
    // 虚拟二维码链接
    virtualQrcodeUrl: '',

    payment: {
        showDialog: false
    },

	userInfo: {
    },

    power:{

    },
	// 是否关注公众号及二维码弹出逻辑判断
	subscribe: '',
    
    isLiveAdmin: null,
    liveAdminOverDue: null,
    cookies: null,
    ee:{a:true},
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
                userInfo: action.userInfo || {}
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
                isLiveAdmin: action.data.isLiveAdmin,
                liveAdminOverDue: action.data.liveAdminOverDue,
            }
        case 'SET_COOKIES':
            return {
                ...state,
                cookies: action.cookies
            }
        default:
            return state
    }
}
