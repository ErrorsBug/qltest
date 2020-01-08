import {
	INIT_EVALUATION_DATA,
	INIT_USER_POWER,
	INIT_LABEL_LIST,
	INIT_STATUS,
	INIT_IS_OPEN_EVALUATION,
	GET_EVALUATION_LIST,
} from '../actions/evaluation'

const initState = {
	evaluationData: {},
	userPower: {},
	// 所有评论
	evaluationList: {
		status: '',
		data: undefined,
		page: {
			size: 10,
		}
	},
	// 有效评论
	evaluationListValid: {
		status: '',
		data: undefined,
		page: {
			size: 10,
		}
	},
	labelList: {},
	isEvaluated: '',
	isOpen: null,
};

const ACTION_HANDLERS = {
	[INIT_EVALUATION_DATA]: (state, action) => {
		if (action.evaluationData) {
			let evaluateNum = parseInt(action.evaluationData.evaluateNum) || 0;
			let evaluateNumStr;
			if (evaluateNum > 999) {
				evaluateNumStr = '999+';
			} else {
				evaluateNumStr = evaluateNum + '';
			} 
			action.evaluationData = {
				...action.evaluationData,
				evaluateNum,
				evaluateNumStr,
			}
		}
		return {...state, evaluationData: action.evaluationData}
	},
	[INIT_USER_POWER]: (state, action) => {return {...state, userPower: action.userPower}},
	[GET_EVALUATION_LIST]: (state, action) => {
		const storeKey = action.hasValidFilter ? 'evaluationListValid' : 'evaluationList';
		return {
			...state,
			[storeKey]: action.data,
		};
	},
	[INIT_LABEL_LIST]: (state, action) => {return {...state, labelList: action.labelList}},
	[INIT_STATUS]: (state, action) => {return {...state, isEvaluated: action.status}},
	[INIT_IS_OPEN_EVALUATION]: (state, action) => {return {...state, isOpen: action.isOpen}},
};

export function evaluation (state = initState, action) {

	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state

}
