import { api } from './common';

export const INIT_CHANNEL_INFO = 'INIT_CHANNEL_INFO';
export const CHANNEL_MARKET_INTRO = 'CHANNEL_MARKET_INTRO';

/**
 * 初始化拼课详情页内容
 * 
 * @export
 * @param {{}} initData 拼课详情页数据
 * @returns action
 */
export function initChannelInfo (initData) {
    return {
        type: INIT_CHANNEL_INFO,
        initData
    }
}


/**
 * 获取channal详情
 *
 */
export function fetchChannelInfo (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/channel/info',
			body: {
				...params
			}
        });
        if (result.state.code === 0) {
            dispatch(initChannelInfo({...result.data}))
        }
	}
}

export function getGroupListByChannelId(params) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/getGroupListByChannelId',
            body: {
                ...params
            },
            method: 'POST',

        });
        if (result.state.code === 0) {
            return result.data
        }
    };
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
        if (result.state.code === 0) {
            dispatch({
                type: CHANNEL_MARKET_INTRO,
                marketInfo: result.data
            });
            return result.data
        }
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

export function checkLiveRole (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method:"POST",
            url: '/api/wechat/channel/liveRole',
            body: params,
        });
        if (result.state.code === 0) {
            return result.data
        }
    }
};
