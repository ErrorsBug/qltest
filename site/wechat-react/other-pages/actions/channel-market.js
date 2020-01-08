
import { api } from './common';

export const CHANNEL_MARKET_INTRO = 'CHANNEL_MARKET_INTRO';


export function initChannelMarket (marketInfo) {
    return {
        type: CHANNEL_MARKET_INTRO,
        marketInfo
    }
}

// 获取介绍内容
export function getChannelMarket (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/getChannelMarket',
            body: {
                channelId
            }
        });
        dispatch({
            type: CHANNEL_MARKET_INTRO,
            marketInfo: result.data
        });
        

        return result.data;
    }
};


export function saveChannelMarket (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method:"POST",
            url: '/api/wechat/channel/setChannelMarket',
            body: params,
        });

 

        return result
    }
};

//专业版conf.adminApi.adminFlag
export function getIsLiveAdmin(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/isLiveAdmin',
            body: {channelId},
            method: 'POST'
        });
        return result;
    }
}

