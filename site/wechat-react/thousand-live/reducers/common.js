
import {
    TOAST,
    LOADING,
    SYSTIME,
    SET_STS_AUTH,
    TOGGLE_PAYMENT_DIALOG,
    USERINFO,
    SET_IS_LIVE_ADMIN,
    ADD_DEL_SPEAK,
    GET_QLSHAREKEY,
    GET_MY_IDENTITY,
    GET_RELATIONINFO
} from '../actions/common'

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

    // 珊瑚计划课程
    qlsharekey: {},
    coralIdentity: {},

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
            
        case SET_IS_LIVE_ADMIN:
            return {
                ...state,
                isLiveAdmin: action.data.isLiveAdmin,
                liveAdminOverDue: action.data.liveAdminOverDue,
            }

        case GET_QLSHAREKEY:
            return {
                ...state,
                qlsharekey: action.data
            }

        case GET_MY_IDENTITY: 
            return {
                ...state,
                coralIdentity: action.data
            }
        case SET_SHARE_RATE: 
            return {
                ...state,
                platformShareRate: action.shareRate
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
