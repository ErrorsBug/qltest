import { api } from './common';

//订阅直播间通知
export function subscribe(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/subscribe', 
            body: params,
            method: 'GET',
        });

        return result;
    }
};

// 获取直播间关注数
export function liveGetFollowNum(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/followNum',
            body: { liveId },
            method: 'POST',
        });

        return result;
    }
};

// 获取直播间信息
export function getLiveInfo (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/liveInfo',
            body: {
                liveId
            }
        });
        return result;
    };
};

//默认关注直播间
export async function focusLive(status, liveId){
    return await api({
        url: "/api/wechat/live/follow",
        body: {
            status,
            liveId,
        },
        method: "POST"
    })
}