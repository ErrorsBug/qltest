import { api } from './common';
import { request } from 'common_actions/common';

export const INIT_MY_INDENTITY = 'INIT_MY_INDENTITY';

export const INIT_REAL_NAME_VERIFY_STATUS = 'INIT_REAL_NAME_VERIFY_STATUS';

export function initMyIndentity(myIdentity){
	return {
		type:INIT_MY_INDENTITY,		
		myIdentity: myIdentity||{identity:'123',percent:'erwewrewrew'},
	}
}
//获取是否购买过99礼包，即身份信息查询
export function getMyIdentity() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getMyIdentity',
		});
		dispatch(initMyIndentity(result.data));
		return result;
	};
}


// purchaseCourse, recentCourse
export function purchaseCourse (param, showLoading) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading,
			url: '/api/wechat/mine/purchaseCourse',
			body: {...param}
		});
	}
}

export function recentCourse (param, showLoading) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading,
			url: '/api/wechat/mine/recentCourse',
			body: {...param}
		});
	}
}

/**
 * 查询实名验证的当前状态
 */
export function checkRealNameVerifyStatus() {
	return async (dispatch, getState) => {
		const res = await request({
			url: '/api/wechat/transfer/h5/identity/checkUser',
			method: 'POST',
			body: {}
		});
		if (res.state.code === 0) {
			const { status } = res.data;
			dispatch({
				type: INIT_REAL_NAME_VERIFY_STATUS,
				realNameVerifyStatus: status
			});
		} else {
			window.toast(res.state.msg);
		}
	}
}