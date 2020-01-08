/*
 * Created by qingxia on 2018/04/09.
 *     珊瑚计划授权页面
 */
import { api } from './common';
//备选课程列表
export function selectCourseList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'GET',
			showLoading: true,
			url: '/api/wechat/coral/getReserveCourseList',
			body: params
		});

		return result;
	};
}
//成功投放课程列表
export function launchCourseList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'GET',
			showLoading: true,
			url: '/api/wechat/coral/getLivePersonPartyCourseList',
			body: params
		});

		return result;
	};
}

//申请/取消推广
export function setCourseLaunch(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/coral/applyPush',
			body: params
		});

		return result;
	};
}

/* 获取系列课进入备选库的条件 */
export function getConditions(){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/studio/mediaMarket/getConditions',
		});

		return result;
	};
}