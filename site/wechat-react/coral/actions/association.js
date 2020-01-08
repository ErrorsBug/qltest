/**
 * Created by dylanssg on 2017/10/26.
 */
import { api } from './common';

/* 社群列表 */
export function getMyCommunityList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/getMyCommunityList',
			body: params
		});

		return result;
	};
}

/* 潜在用户个数 */
export function getMyTemporaryRefCount(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/getMyTemporaryRefCount',
			body: params
		});

		return result;
	};
}

/* 社群人员个数 */
export function getMyCommunityCount(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/getMyCommunityCount',
			body: params
		});

		return result;
	};
}

/* 潜在用户列表 */
export function getMyTemporaryRefList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/getMyTemporaryRefList',
			body: params
		});

		return result;
	};
}