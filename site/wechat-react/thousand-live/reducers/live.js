import {
    INIT_LIVE_INFO,
} from '../actions/live';

var initState = {
    live:[],
}

export function live(state = initState, action) {

    switch (action.type) {
        case INIT_LIVE_INFO:
            return {
                ...state,
                liveInfo: action.liveInfo
            }
        
        default:
            return state;
    }
};
