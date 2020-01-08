/**
 * Created by dylanssg on 2017/10/26.
 */
import { api } from './common';

export const INIT_THIS_MONTH = 'INIT_THIS_MONTH';


// 历史业绩
export function performanceList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/achievementList',
			body: params
		});

		return result;
	};
}

// 业绩明细
export function performanceDetailsList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/achievementDetailList',
			body: params
		});

		return result;
	};
}

// 个人某月业绩
export function getMyPersonMonthAchievement(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/getMyPersonMonthAchievement',
			body: params
		});

		return result;
	};
}