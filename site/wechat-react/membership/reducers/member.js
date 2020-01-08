/**
 *
 * @author Dylan
 * @date 2018/10/23
 */
import {
	INIT_MEMBER_INFO,
	INIT_SOURCE_USER_INFO,
	INIT_MEMBER_CENTER_DATA,
} from '../actions/member';

const initState = {
	info: {},
	centerInitData: {},
};

const ACTION_HANDLERS = {
	[INIT_MEMBER_INFO]: (state, action) => {
		return {
			...state,
			info: action.info
		}
	},
	[INIT_SOURCE_USER_INFO]: (state, action) => {
		return {
			...state,
			sourceUserInfo: action.info
		}
	},
	[INIT_MEMBER_CENTER_DATA]: (state, action) => {
		return {
			...state,
			centerInitData: action.data
		}
	}
};

export function member (state = initState, action) {

	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state

}
