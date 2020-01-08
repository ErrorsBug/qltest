/**
 *
 * @author Dylan
 * @date 2018/10/23
 */
export const INIT_MEMBER_INFO = 'INIT_MEMBER_INFO';
export const INIT_SOURCE_USER_INFO = 'INIT_SOURCE_USER_INFO';
export const INIT_MEMBER_CENTER_DATA = 'INIT_MEMBER_CENTER_DATA';

import { request } from 'common_actions/common';

export function initMemberInfo(info){
	return {
		type: INIT_MEMBER_INFO,
		info
	}
}

export function initSourceUserInfo(info){
	return {
		type: INIT_SOURCE_USER_INFO,
		info
	}
}

export function initMemberCenterData(data){
	return {
		type: INIT_MEMBER_CENTER_DATA,
		data
	}
}

// 获取课程信息
export function updateMemberInfo(params) {
    return async (dispatch, getStore) => {
		const memberInfo = await request({
			url: '/api/wechat/member/memberInfo',
			method: 'POST'
		});

		dispatch(initMemberInfo(memberInfo))
    };
}