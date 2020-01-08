import {
	INIT_EVALUATION_DATA,
	INIT_USER_POWER,
	INIT_EVALUATION_LIST,
	RESET_EVALUATION_LIST,
	INIT_LABEL_LIST,
	INIT_STATUS,
	INIT_IS_OPEN_EVALUATION,
} from '../actions/evaluation'

const initState = {
	evaluationData: {},
	userPower: {},
	evaluationList: [],
	labelList: {},
	isEvaluated: '',
	isOpen: null,
};

const ACTION_HANDLERS = {
	[INIT_EVALUATION_DATA]: (state, action) => {return {...state, evaluationData: action.evaluationData}},
	[INIT_USER_POWER]: (state, action) => {return {...state, userPower: action.userPower}},
	[INIT_EVALUATION_LIST]: (state, action) => {
		let evaluationList = [...state.evaluationList, ...action.evaluationList];
		return {...state, evaluationList}
	},
	[RESET_EVALUATION_LIST]: (state, action) => {return {...state, evaluationList:[]}},
	[INIT_LABEL_LIST]: (state, action) => {return {...state, labelList: action.labelList}},
	[INIT_STATUS]: (state, action) => {return {...state, isEvaluated: action.status}},
	[INIT_IS_OPEN_EVALUATION]: (state, action) => {return {...state, isOpen: action.isOpen}},
};

export function evaluation (state = initState, action) {

	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state

}
