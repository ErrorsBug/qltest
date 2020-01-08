/**
 * Created by dylanssg on 2017/10/26.
 */
import { api } from './common';

export const INIT_ACCOUNT_DATA = 'INIT_ACCOUNT_DATA';

// 初始化accountData
export function initAccountData (accountData) {
	return {
		type: INIT_ACCOUNT_DATA,
		accountData
	}
}

export function getAccountData() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getAccountData',
		});
		dispatch(initAccountData(result.data));
		return result;
	};
}


/* 提现记录列表 */
export function getWithdrawtList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/getWithdrawtList',
			body: params
		});

		return result;
	};
}


/* 申请提现 */
export function personWithdraw(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/coral/personWithdraw',
			body: params
		});

		return result;
	};
}

/* 获取用户信息 */
export function getTargetUserInfo(userId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/user/info',
			body: {
				userId
			},
		});

		return result
	}
}

/* 获取推荐人信息 */
export function getMyCacheParent(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/coral/getMyCacheParent',
			body: params
		});

		return result;
	};
}

/* 更换推荐人 */
export function updateCacheParent(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/coral/updateCacheParent',
			body: params
		});

		return result;
	};
}

/* 是否隐藏推荐人 */
export function isHideReferrer(parentId){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/coral/isHideReferrer',
			body: {
				parentId
			}
		});

		return result;
	};
}

/* 申请提现(重试) */
export function personReWithdraw(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/coral/personReWithdraw',
			body: params
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