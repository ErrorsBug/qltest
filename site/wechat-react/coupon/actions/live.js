import { api } from './common';
export const INIT_LIVE_INFO = 'INIT_LIVE_INFO';

// 初始化直播间信息
export function initLiveInfo (data) {
    return {
        type: INIT_LIVE_INFO,
        data
    }
};

export function getLiveInfo(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/Info',
            body: { liveId },
            method: 'GET',
        });

        return result;
    }
}
