import { api } from './common';

export const APPEND_FINISH_PAY_DATA = 'APPEND_FINISH_PAY_DATA';

// 服务端渲染 初始化支付完成后的数据
export const finishPayData = function (data) {
    return {
        type: APPEND_FINISH_PAY_DATA,
        finishPayData: { ...data }
    };
};
// 获取系列课自动分销邀请码在channel-distribution
// 获取话题自动分销邀请码
export function topicAutoShareQualify (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/getTopicAutoQualify',
            body: {
                topicId
            }
        });

        return result;
    };
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