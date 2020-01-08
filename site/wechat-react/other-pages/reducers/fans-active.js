import {
	INIT_OPS_LIVE_INFO,
    UPDATE_LEFT_PUSH_NUM,
} from '../actions/fans-active'

const initState = {
	opsLiveInfo: {},
};

export function fansActive (state = initState, action) {
    switch (action.type) {
        case INIT_OPS_LIVE_INFO:
            return { ...state, opsLiveInfo: action.opsLiveInfo || {}};
        case UPDATE_LEFT_PUSH_NUM:
            return {...state, opsLiveInfo: {...state.opsLiveInfo, leftPushNum: action.leftPushNum}};
        default:
            return state;
    }
}
