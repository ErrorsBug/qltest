import {
    INIT_LIVE_INFO,
} from '../actions/live';

var initState = {

    liveInfo:{
        entity: {
            id: 0
        }
    },
}

export function live(state = initState, action) {
    let timeline ;
    switch (action.type) {
        case INIT_LIVE_INFO:
            return {
                ...state,
                liveInfo: action.data
            }
        default:
            return state;
    }
};
