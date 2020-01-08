
import {
    BACKSTAGE_LIVE_LIST,
    BACKSTAGE_LIVE_INFO,
} from '../actions/live-back'
const initState = {
    creater: [],
    manager: [],
    liveInfo: {},
};

export function liveBack (state = initState, action) {
    switch (action.type) {
        case BACKSTAGE_LIVE_LIST:
            return { ...state, creater: action.creater , manager: action.manager };
        case BACKSTAGE_LIVE_INFO:
            return {...state, liveInfo: action.liveInfo };
        default:
            return state;
    }
}
