
import { api } from './common';

export const INIT_OPS_LIVE_INFO = 'INIT_OPS_LIVE_INFO';
export const UPDATE_LEFT_PUSH_NUM = 'UPDATE_LEFT_PUSH_NUM';

// 初始化三方绑定直播间信息
export const initOpsLiveInfo = function (opsLiveInfo) {
    return {
        type: INIT_OPS_LIVE_INFO,
        opsLiveInfo,
    };
};

// 更新剩余推送次数
export const updateLeftPushNum = function(leftPushNum) {
    return {
        type: UPDATE_LEFT_PUSH_NUM,
        leftPushNum,
    };
};

/**
 * 获取三方直播间绑定信息
 * @param  {[type]} liveId [description]
 * @return {[type]}        [description]
 */
export const fetchOpsLiveInfo = function(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/ops/live-info',
            body: {
                liveId,
            }
        });

        initOpsLiveInfo(result && result.data && result.data.info || {});

        return result;
    };
}

// 推送三方直播间
export function pushOpsLive (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: "POST",
            url: '/api/wechat/ops/live-push',
            body: {
                liveId,
            }
        });

        return result;
    };
};


// 刷新粉丝数
export function refreshFanNum(liveId, appId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: "POST",
            url: '/api/wechat/ops/refresh-fans',
            body: {
                liveId, appId,
            }
        });

        return result;
    };
}

// 查询导粉后交易的明细
export function fansDetail(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: "POST",
            url: '/api/wechat/live/funsDetail',
            body: {
                liveId,
            }
        });

        return result;
    };
}

// 导粉交易记录(分页)
export function funsBusiList(liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: "POST",
            url: '/api/wechat/live/funsBusiList',
            body: {
                liveId,
                page,
                size: 20,
            }
        });

        return result;
    };
}
