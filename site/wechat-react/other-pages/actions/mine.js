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

export function getMySubscribe() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/recommend/get-mine-subscribe',
		});

		return result;
	};
}

export function getMyCenter(userId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/mine/get-self-center',
			body: {
				userId
			}
		});

		return result;
	};
}

export function getMyWallet() {
		return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/mine/get-my-wallet',
			body: {

			}
		});

		dispatch(initMyWallet(result.data||{}));
				return result;
	};
}

export function getUnevaluatedList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
				url: '/api/wechat/mine/unevaluated',
			body: params
		});
				return result;
	};
}

// 初始化liveId
export function initMyWallet (walletData) {
	return {
		type: INIT_MINE_WALLET,
		walletData
	}
};
export function getJoinedTopicList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/mine/joined-topic',
			body: params
		});
		return result
	};
}

// 分类型查询我的优惠券列表
export function queryCouponListByType(params) {
	return async (dispatch, getStore) => {
		const result = api({
			dispatch,
			getStore,
			url: '/api/wechat/mine/queryCouponListByType',
			body: {
				type: params.type,
				status: params.status,
                page: params.page,
                liveId: params.liveId,
				size: params.size || 20,
			}
		});
		return result
	}
}

// 获取各个状态列表的数量
export function queryCouponListCount (liveId) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			url: '/api/wechat/mine/queryCouponCount',
			body: {
                liveId: liveId
            }
		});
	}
}

// 是否有进入珊瑚计划权限
export function getCoralAccess () {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/coral/access',
			body: {}
		});
	}
}






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
export function planCourse (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/mine/planCourse',
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
export function courseAlert (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/courseAlert',
			body: {...param}
		});
	}
}

export function liveOnList (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/mine/liveOnList',
			body: {...param}
		});
	}
}

/**
 * 获取今日未打卡训练营的总数
 */
export function getNotCheckinCount(params){	
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/checkInCamp/notCheckinCount',
            body: {...params}
        });
    }
}



export function collectList (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/collectList',
			body: {...param}
		});
	}
}
export function addCollect (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/addCollect',
			body: {...param}
		});
	}
}
export function isCollected (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/isCollected',
			body: {...param}
		});
	}
}
export function cancelCollect (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/cancelCollect',
			body: {...param}
		});
	}
}
export function footprintList (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/footprintList',
			body: {...param}
		});
	}
}
export function similarCourseList (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/similarCourseList',
			body: {...param}
		});
	}
}

export function myDistributionAccount (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/myDistributionAccount',
			body: param
		});
	}
}

export function distributionAccountWithdraw (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading:true,
			method: 'POST',
			url: '/api/wechat/distributionAccountWithdraw',
			body: param
		});
	}
}

export function joinQlchatVipCooperation (param) {
	return api({
		showLoading: true,
		method: 'POST',
		url: '/api/wechat/mine/joinQlchatVip',
		body: param
	});
}

// 学习信息
export function learnInfo () {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/transfer/h5/live/learnInfo'
		});
	}
}