import { api } from './common';

// 每天学学习信息列表
export async function getUserLearnInfo (date) {
    return await api({
        showLoading: false,
        url: '/api/wechat/live/getUserLearnInfo',
        body: {
            date,
            page: {
                page: 1,
                size: 100
            }
        },
        method: 'POST',
    });
};

// 每天学关注列表
export async function getUserFocusInfo () {
    return await api({
        showLoading: false,
        url: '/api/wechat/live/getUserFocusInfo',
        body: {},
        method: 'POST',
    });
};

// 订阅
export async function liveAlert(liveId, status = 'Y') {
    return await api({
        showLoading: false,
        url: '/api/wechat/live/alert',
        body: { liveId, status },
        method: 'POST',
    });
}

// 获取用户偏好标签列表
export async function getLivecenterTags(params) {
	return await api({
        showLoading: false,
        method: 'POST',
        body: params,
        url: '/api/live/center/livecenterTags',
    });
}

// 保存用户偏好标签列表
export async function saveUserTag(params) {
	return await api({
        showLoading: false,
        method: 'POST',
        body: params,
        url: '/api/live/center/saveUserTag',
    });
}

// 模拟群聊
export async function simulateChatGroup(params) {
	return await api({
        showLoading: false,
        method: 'POST',
        body: params,
        url: '/api/wechat/live/simulateChatGroup',
    });
}