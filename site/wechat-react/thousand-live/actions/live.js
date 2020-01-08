import { api } from './common';
export const INIT_LIVE_INFO = 'INIT_LIVE_INFO';
export const GET_IS_QLLIVE = 'GET_IS_QLLIVE';


// 初始化直播间信息
export function initLiveInfo (liveInfo) {
    return {
        type: INIT_LIVE_INFO,
        liveInfo
    }
};




export function fetchGetQr(channel, liveId, channelId, topicId ,toUserId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/get-qr',
            body: {
                channel, 
                liveId, 
                channelId, 
                topicId ,
                toUserId
            }
        });

        return result;
    };
}

export function GetMiddlePageQr(param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/get-qr',
            body: {
                ...param
            }
        });

        return result;
    };
}

export function liveBanned(bannedUserId, isEnable, liveId, userId ) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/banned',
            body: {
                bannedUserId,
                isEnable, 
                liveId, 
                userId 
            }
        });

        return result;
    };
}

export function getMyCenterInfo(topicId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/mine/get-self-center',
			body: {
				topicId
			}
		});

		return result;
	};
}

/**
 * 获取动态剩余推送次数
 * 
 * @export
 * @param {string} businessId 
 * @param {string} type 
 */
export function fetchTimelineRemainTimes(businessId, type, topicId){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/restPushTimes', 
            body: { businessId, type, topicId },
            method: 'POST',
        });

        return result;
    }
}

/**
 * 是否官方直播间
 * 
 * @export
 * @param {string} liveId
 */
export function getIsQlLive (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/isQlLive',
            body: {
                liveId
            },
            method: 'GET'
        })
        
        return result 
    }
}

/**
 * @export
 * @param {string} businessId
 * @param {string} type
 */
export function getEditorSummary (businessId, type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showWarningTips: false,
            showLoading: false,
	        errorResolve: true,
            url: '/api/wechat/ueditor/getSummary',
            body: {
                businessId,
                type
            },
            method: 'POST'
        })
        
        return result 
    }
}

/**
 * 发送邀请-话题嘉宾
 * @param {*} params 
 */
export async function topicInvite (params) {
    const result = await api({
        url: '/api/wechat/topic/topicInvite',
        body: params,
        method: 'POST'
    })
    return result 
}

/**
 * 发送邀请-话题嘉宾
 * @param {*} params 
 */
export async function getTopicInvite (params) {
    const result = await api({
        url: '/api/wechat/topic/getTopicInvite',
        body: params,
        method: 'POST'
    })
    return result 
}

// 获取公众号是否关注
export const getAppIdByType = async (params) => {
    const result = await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/user/getAppIdByType',
        body: params
    })
    return result;
}

// 获取公众号信息
export async function getQrInfo (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/get-qrcode',
        body: params,
        method: 'GET',
    });
};


// 获取公众号信息
export async function setUniversityCurrentCourse (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/setCurrentId',
        body: params,
        method: 'POST',
    });
};