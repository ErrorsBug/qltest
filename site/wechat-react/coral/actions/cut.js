/**
 * Created by qingxia on 2018/03/01.
 */
import { api } from './common';
import { get } from 'lodash';

export const INIT_CUT_DATA = 'INIT_CUT_DATA';
export const INIT_CUT_COURSE_INFO = 'INIT_CUT_COURSE_INFO';

// 初始化砍价信息
export function initCutData (cutInfoData) {
	return {
		type: INIT_CUT_DATA,
		cutInfoData
	}
}
//getShareCutCourseInfo
export function initShareCutCourseInfo (courseCutInfo) {
	return {
		type: INIT_CUT_COURSE_INFO,
		courseCutInfo
	}
}

/*发起砍价助力*/
export function startCutRecord(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/coral/createShareCutApplyRecord',
			body: params
		});

		return result;
	};
}

/* 获取砍价信息 */
export function getCutInfoRecord(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/coral/getLastShareCutApplyRecord',
			body: params
        });
        dispatch(initCutData(get(result,'data.applyRecordDto',{})));

		return result;
	};
}

/* 获取砍价好友助力列表信息 */
export function getAssistCutList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/coral/getAssistCutList',
			body: params
		});

		return result;
	};
}

/* 获取课程是否参与了砍价活动 */
export function getShareCutCourseInfo(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/coral/getShareCutCourseInfo',
			body: params
		});

		dispatch(initShareCutCourseInfo(get(result,'data.info',{})));

		return result;
	};
}


/*砍价好友助力请求*/
export function assistCut(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/coral/assistCut',
			body: params
		});

		return result;
	};
}

