import { api } from './common';

export const BACKSTAGE_LIVE_LIST = 'BACKSTAGE_LIVE_LIST';
export const BACKSTAGE_LIVE_INFO = 'BACKSTAGE_LIVE_INFO';

export function initLiveList(creater,manager){
	return {
		type: BACKSTAGE_LIVE_LIST,		
		creater: creater||[],
		manager: manager ||[],

	}
}

export function initBackstage(liveInfo){
	return {
		type: BACKSTAGE_LIVE_INFO,		
        liveInfo: liveInfo||{},
	}
}


export function getRealStatus(liveId,type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getRealStatus',
            body: {liveId,type},
        });

        return result;
    };
}

export function getCheckUser(params={}){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/checkUser',
            body: {...params},
        });

        return result;
    };
}

// 获取企业信息
export async function checkEnterprise(params){
    return await api({
        url: '/api/wechat/live/checkEnterprise',
        body: params,
    });
}

export function getLiveCommentNum(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
			getStore,
			method:'POST',
            showLoading: false,
            url: '/api/wechat/comment/getLiveCommentNum',
            body: {liveId},
        });

        return result;
    };
}

