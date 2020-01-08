import {
    GET_REASON_TYPES,
    SAVE_COMPLAIN,
} from '../actions/complain';

const initState = {
    result: {}
}

export function complain(state = initState, action) {
    switch (action.type) {
        case GET_REASON_TYPES:
            return state;
        default:
            return state;
    }
}