/**
 * Created by dylanssg on 2017/10/26.
 */
import {
	INIT_ACCOUNT_DATA
} from '../actions/account'

const initState = {
	/* 官方课代表账户信息 */
	accountData: {},
};

const actionHandle = {
	[INIT_ACCOUNT_DATA]: (state, action) => {
		return { ...state, accountData: action.accountData, }
	},
};

export function account(state = initState, action) {
	const handle = actionHandle[action.type];
	return handle ? handle(state, action) : state
}
