import { api } from './common';

export const CHANNEL_STATISTICS_TOTAL = 'CHANNEL_STATISTICS_TOTAL';
export const CHANNEL_STATISTICS_BASE_DISTRIBUTION = 'CHANNEL_STATISTICS_BASE_DISTRIBUTION';

export const CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_INIT = 'CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_INIT';
export const CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_RENAME = 'CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_RENAME';
export const CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_ADD = 'CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_ADD';
export const CHANNEL_STATISTICS_INVITER_INIT = 'CHANNEL_STATISTICS_INVITER_INIT';

export const CHANNEL_STATISTICS_ALL_DATA = 'CHANNEL_STATISTICS_ALL_DATA'

export const INIT_CHANNEL_LIST = 'INIT_CHANNEL_LIST'

function add (x, y) {
    return x + y
}

function addNum (data, type) {
    return data.getSourceList && data.getSourceList.list && data.getSourceList.list.map(item => item[type]).reduce(add, 0)
}
export function initAllData (data) {
    // 需要为数据汇总 统计访客数据拿渠道数据
    data.totalDataView = Object.assign({}, data.totalDataView, {
        viewTotal: addNum(data, 'viewTotal'), // 独立访客数
        authCount: data.businessType === 'topic' && data.isSingleBuy == 'Y'? 0 : addNum(data, 'authTotal'), // 报名人数
        listenTotal: addNum(data, 'listenTotal') // 听课累计人数
    })
    return {
        type: CHANNEL_STATISTICS_ALL_DATA,
        data
    }
}

export function initChannelList (data) {
    return {
        type: INIT_CHANNEL_LIST,
        data
    }
}


export function initTotalDataDetail (info) {
    return {
        type: CHANNEL_STATISTICS_TOTAL,
        info
    }
}
export function initBaseDistributionData (info) {
    return {
        type: CHANNEL_STATISTICS_BASE_DISTRIBUTION,
        info
    }
}
export function initPopularizeDistributionData (info) {
    return {
        type: CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_INIT,
        info
    }
}
export function initInviterData (info) {
    return {
        type: CHANNEL_STATISTICS_INVITER_INIT,
        info
    }
}

// 增加推广渠道
export function addSource  (businessId, businessType, liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/addSource',
            method: "POST",
            body: {
                businessId,
                businessType,
                liveId
            }
        });
        return result;
    }
};

// 修改推广渠道名字
export function changeSourceName (id, liveId, name, businessType) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/changeSorceName',
            method: "POST",
            body: {
                id,
                liveId,
                name,
                businessType
            }
        });

        return result;
    }
};

// 系列课数据统计 邀请数据接口
export function getAllInviteDate (channelId, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/getAllInviteDate',
            method: "POST",
            body: {
                channelId,
                page,
                size
            }
        });

        return result.data;
    }
};


// 获取系列课或者话题的待优化点状态
export async function getChannelOrTopicOptimize (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/getChannelOrTopicOptimize',
        body: params,
        method: 'POST',
    });
};

