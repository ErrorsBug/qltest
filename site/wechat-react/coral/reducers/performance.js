import {
	INIT_THIS_MONTH,
} from '../actions/performance'

const initState = {
	/* 礼包信息 */
	thisMonth: {}
};

const performanceSwitch = {
	[INIT_THIS_MONTH]: (state, action) => {
		return { ...state, thisMonth: action.thisMonth, }
	},
};

export function performance(state = initState, action) {
	const handle = performanceSwitch[action.type];
	return handle ? handle(state, action) : state
}
