import { 
    INIT_MEMBER_INFO,
} from '../actions/member'

export function memberInfo (state = {}, action) {
    switch (action.type) {
        case INIT_MEMBER_INFO:
            return { ...state, ...action.memberInfo }
        default:
            return state;
    }
}
