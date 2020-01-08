
import {
    TOAST,
    LOADING,
    SYSTIME,
    SET_STS_AUTH,
    TOGGLE_PAYMENT_DIALOG,
    USERINFO,
    SET_IS_LIVE_ADMIN,
    IS_WHITE
} from '../actions/common'

import {
    INIT_PAGE_DATA
} from '../actions/topic-intro'
import {
    SET_SHARE_RATE,
    SET_PLATFORM_SHARE_QUALIFY,
} from 'common_actions/live'

import {
    GET_RELATIONINFO
} from 'common_actions/common'


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
    // 是否专业版
    isLiveAdmin: null,
    liveAdminOverDue: null,

    // 是否白名单
    isWhite: '',
    // 平台分销比例（个人）
    platformShareRate: 0,
    // 平台分销比例（平台）
    platformShareQualify: 0,
};

export function common (state = initData, action) {
    switch (action.type) {

        case TOAST:
            return { ...state, ...{ toast: action.payload } };

        case LOADING:
            return { ...state, ...{ loading: action.status } };

        case SYSTIME:
            return {...state, ...{sysTime: action.sysTime}};
        case INIT_PAGE_DATA:
            if (action.pageData && action.pageData.sysTimestamp) {
                return {...state, sysTime: action.pageData.sysTimestamp};
            } else {
                return state;
            }

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
            
        case SET_IS_LIVE_ADMIN:
            return {
                ...state,
                isLiveAdmin: action.data.isLiveAdmin,
                liveAdminOverDue: action.data.liveAdminOverDue,
            }

        case IS_WHITE: 
            return {
                ...state,
                isWhite: action.isWhite
            }
        case SET_SHARE_RATE: 
            return {
                ...state,
                platformShareRate: action.shareRate
            }
        case SET_PLATFORM_SHARE_QUALIFY: 
            return {
                ...state,
                platformShareQualify: action.shareRate
            }
        case GET_RELATIONINFO:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}
