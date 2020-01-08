import { api } from '../../actions/common';

export const INIT_CAMP_INFO = 'INIT_CAMP_INFO';
export const INIT_CAMP_COURSE = 'INIT_CAMP_COURSE';
export const SET_CAMP_COURSE_LIST = 'SET_CAMP_COURSE_LIST';
export const INIT_PAY_INFO = 'INIT_PAY_INFO';
export const SET_STU_QUARTER_NUM = 'SET_STU_QUARTER_NUM';


export function initCampInfo (payload) {
    return {
        type: INIT_CAMP_INFO,
        payload
    }
};
export function initCampCourse (payload) {
    return {
        type: INIT_CAMP_COURSE,
        payload
    }
};
export function setCampCourseList (payload) {
    return {
        type: SET_CAMP_COURSE_LIST,
        payload
    }
};
export function initPayInfo (payload){
    return {
        type: INIT_PAY_INFO,
        payload
    }
};

export function setStuQuarterNum (payload){
    return {
        type: SET_STU_QUARTER_NUM,
        payload
    }
};

export function getCampInfo (id) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/camp/campInfo',
            body: {id: id}
        });
        if(result && result.data && result.data.trainCampPo) {
            dispatch(initCampInfo(result.data.trainCampPo))
        }
        return result;
    };
};
export function fetchCampInfo (id) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/camp/campInfo',
            body: {id: id}
        });
        return result;
    };
};
export function getCampCourse (trainId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/camp/campCourse',
            body: {trainId}
        });
        if(result && result.data && (result.data.last || result.data.future)) {
            dispatch(initCampCourse({last: result.data.last, future: result.data.future}))
        }
        return result;
    };
};
export function getCampCourseList (trainId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/camp/campCourseList',
            body: {
                trainId,
                page,
            }
        });
        if(result && result.data && result.data.topics) {
            dispatch(setCampCourseList(result.data.topics))
        }
        return result;
    };
};


// export function fetchGetQr(channel, liveId, channelId, topicId ,toUserId) {
    // return async (dispatch, getStore) => {
    //     const result = await api({
    //         dispatch,
    //         getStore,
    //         showLoading: false,
    //         url: '/api/wechat/live/get-qr',
    //         body: {
    //         }
    //     });

    //     return result;
    // };
// }

export function fetchPayInfo (campId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            body: {
                campId
            },
            url: '/api/wechat/camp/payInfo',
        });
        return result;
    };
};
export function getFailReason () {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/pay/getFailReason',
        });
        return result;
    };
};
export function saveFailReason (contentId,remark,orderCode) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            body:{
                contentId,
                remark,
                orderCode
            },
            url: '/api/wechat/pay/saveFailReason',
        });
        return result;
    };
};



export function fetchTestList (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            body: {
                topicId,
            },
            url: '/api/wechat/camp/fetchTestList',
        });
        return result;
    }
};
export function confirmAnswer (answer,topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            body: {
                answer,
                topicId,
            },
            url: '/api/wechat/camp/confirmAnswer',
        });
        return result;
    }
};
export function getMyAnswer (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/camp/getMyAnswer',
            body: {
                topicId,
            },
        });
        return result;
    }
};
export function getUserInfo () {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/camp/getUser',
        });
        return result;
    }
};

export function getExceUserList (trainId, periodId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/camp/exceUser',
            body: {
                trainId,
                periodId,
            },
        });
        return result;
    }
};
export function getExceUser (id) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/camp/exceUser',
            body: {
                id
            },
        });
        return result;
    }
};

export function preview (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/camp/preview',
            body: {
                topicId,
            },
        });
        return result;
    }
};

export function markLearnTopic (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/camp/learnTopic',
            body: {
                topicId,
            },
        });
        return result;
    }
};

export function activityCodeBind (businessId, promotionId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/activityCode/bind',
            body: {
                businessType: "channel",
                businessId,
                promotionId,
            }
        })
    }
}

export function activityCouponObj (codeId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/coupon/activityCouponObj',
            body: {
                codeId
            }
        })
    }
}