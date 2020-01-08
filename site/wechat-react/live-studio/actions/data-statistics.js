import { api } from './common';

// 获取数据总览统计数据
export async function getLiveData (liveId) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/getLiveData',
        body: {liveId},
        method: 'POST',
    });
};

// 获取数据总览统计话题数据
export async function getAllStatTopicList (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/getAllStatTopicList',
        body: params,
        method: 'POST',
    });
};

// 获取数据总览统计系列课数据
export async function getAllStatChannelList (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/getAllStatChannelList',
        body: params,
        method: 'POST',
    });
};

// 忽略优化
export async function setOptimize (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/setOptimize',
        body: params,
        method: 'POST',
    });
};

// 获取提高课程指数状态
export async function getCourseIndexStatus (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/getCourseIndexStatus',
        body: params,
        method: 'POST',
    });
};