
import {
    INIT_MY_INDENTITY,
    INIT_REAL_NAME_VERIFY_STATUS,
} from '../actions/mine'
const initState = {
    myIdentity:{},
};

export function mine (state = initState, action) {
    switch (action.type) {
        case INIT_MY_INDENTITY:
            return { ...state, myIdentity: action.myIdentity };
        case INIT_REAL_NAME_VERIFY_STATUS:
            return { ...state, realNameVerifyStatus: action.realNameVerifyStatus }
        default:
            return state;
    }
}
