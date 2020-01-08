import { get } from 'lodash';
import { api } from './common';

export const INIT_EVALUATION_DATA = 'INIT_EVALUATION_DATA';
export const INIT_USER_POWER = 'INIT_USER_POWER';
export const INIT_LABEL_LIST = 'INIT_LABEL_LIST';
export const INIT_STATUS = 'INIT_STATUS';
export const INIT_IS_OPEN_EVALUATION = 'INIT_IS_OPEN_EVALUATION';
export const GET_EVALUATION_LIST = 'GET_EVALUATION_LIST';


export function initEvaluationData (evaluationData) {
	return {
		type: INIT_EVALUATION_DATA,
		evaluationData
	}
}

/* 根据topicId或者获取课程标题，评价人数，评价分数 */
export function getEvaluationData(params) {
   return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
	        method: 'POST',
	        showLoading: false,
            url: '/api/wechat/evaluation/get',
	        body: params
        });

	   dispatch(initEvaluationData(get(result,'data',{})));

	   return result;
    };
}

export function initUserPower (userPower) {
	return {
		type: INIT_USER_POWER,
		userPower
	}
}

/* 获取用户超能力 */
export function getUserPower() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/evaluation/getPower',
		});

		dispatch(initEvaluationData(get(result,'data.powerEntity',{})));

		return result;
	};
}

/*获取评价列表*/
export function getEvaluationList({
	isContinue, // 是否继续加载
	hasValidFilter, // 有效评价过滤开关
	...params
}) {
	return async (dispatch, getStore) => {
		const storeKey = hasValidFilter ? 'evaluationListValid' : 'evaluationList';
		const asyncObj = getStore().evaluation[storeKey];
		if (/pending|end/.test(asyncObj.status)) return;

		const page = {...asyncObj.page, ...params.page};
		page.page = isContinue && asyncObj.data ? page.page + 1 : 1;
		params.page = page;

		params.onlyContent = hasValidFilter ? 'Y' : 'N';

		dispatch({
			type: GET_EVALUATION_LIST,
			hasValidFilter,
			data: {
				...asyncObj,
				status: 'pending'
			}
		})

		return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/getList',
			body: params
		}).then(res => {
			if (res.state.code) throw Error(res.state.msg);

			const list = res.data.list || [];
			const status = list.length < page.size ? 'end' : 'success';
			
			const asyncObj = getStore().evaluation[storeKey];

			dispatch({
				type: GET_EVALUATION_LIST,
				hasValidFilter,
				data: {
					...asyncObj,
					data: isContinue ? (asyncObj.data || []).concat(list) : list,
					status,
					page,
				}
			})
		}).catch(err => {
			console.log(err);

			dispatch({
				type: GET_EVALUATION_LIST,
				hasValidFilter,
				data: {
					...getStore().evaluation[storeKey],
					status: ''
				}
			})
		})
	}
}

export function initLabelList(labelList) {
	return {
		type: INIT_LABEL_LIST,
		labelList
	}
}

/*回复评价*/
export function reply(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/reply',
			body: params
		});

		return result;
	}
}

/*撤销评价*/
export function removeReply(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/removeReply',
			body: params
		});

		return result;
	}
}

export function initStatus(status) {
	return {
		type: INIT_STATUS,
		status
	}
}

/*获取是否已评价*/
export function getStatus(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/getStatus',
			body: params
		});


		dispatch(initStatus(get(result,'data.evaluateStatus','N')));

		return result;
	}
}

/*提交评价*/
export function create(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/evaluation/add',
			body: params
		});


		return result;
	}
}

/*查看是否可评价*/
export function getEvaluableStatus(topicId){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/isEvaluable',
			body: {
				topicId
			}
		});


		return result;
	}
}

/*初始化是否开启了评论*/ 
export function initIsOpenEvaluate(isOpen) {
	return {
		type: INIT_IS_OPEN_EVALUATION,
		isOpen
	};
}
/*获取是否开启了评论*/
export function getIsOpenEvaluate(liveId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'GET',
			showLoading: false,
			url: '/api/wechat/evaluation/getIsOpenEvaluate',
			body: {
				liveId
			}
		});
		if (result && result.state && result.state.code == 0) {
			dispatch(initIsOpenEvaluate(result.data.isOpenEvaluate));
		}

		return result;
	};
};
/*更新评论开关*/
export function updateIsOpenEvaluate(liveId, isOpen) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/evaluation/updateIsOpenEvaluate',
			body: {
				liveId,
				isOpen
			}
		});
		if (result && result.state && result.state.code == 0) {
			dispatch(initIsOpenEvaluate(isOpen));
		}

		return result;
	};
};