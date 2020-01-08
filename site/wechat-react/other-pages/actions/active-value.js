import { api } from './common';

export const INIT_MINE_LIVE_DATA = 'INIT_MINE_LIVE_DATA';
export const INIT_MINE_WALLET = 'INIT_MINE_WALLET';

// 初始化liveId
export function initMyLive (liveData) {
	return {
		type: INIT_MINE_LIVE_DATA,
		liveData
	}
};

export function getMyLive() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/live/mine',
			body: {
				
			}
		});
		dispatch(initMyLive(result.data&&result.data.entityPo||{}));
		return result;
	};
}

export function getPower (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/user/power',
            body: {
                liveId, 
            },
            method: 'GET',
		});
		
        return result && result.data && result.data.powerEntity
    }
};

export function getActiveInfo (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/active/getActiveInfo',
            body: {
                liveId, 
			},
			method: "GET"
		});
		
        return result && result.data 
    }
};

export function getFinishLiveList (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/active/getFinishLiveList',
            body: {
                liveId, 
			},
			method: "GET"
		});
        return result && result.data && result.data.dataList
    }
};