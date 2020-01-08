
import {
    TOAST,
    LOADING,
    SYSTIME,
    SET_STS_AUTH,
    TOGGLE_PAYMENT_DIALOG,
    USERINFO,
    UPDATE_USER_POWER,
    UPDATE_VIDEO_UPLOAD_AUTH,
    UPDATE_VIDEO_UPLOAD_STATUS,
    UPDATE_VIDEO_UPLOAD_PROGRESS,
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
        user: {}
    },
    //获取权限
    power: {},
    videoAuth: {},
    duration: 0,
    videoStatus: "",
    // 视频上传进度
    videoUploadProgress: 0
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
        case UPDATE_USER_POWER:
            return {
                ...state,
                power: action.power
            };
        case USERINFO:
            return {
                ...state,
                ...{
                    userInfo: action.userInfo
                }
            };
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
                videoUploadProgress: action.percent || 0
            }


        default:
            return state
    }
}
