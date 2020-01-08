import { INVITE_DATA } from '../actions/experience' 
const initData = {
    inviteNodeCodeList: null, 
  };
export function experience (state = initData, action) {
    switch (action.type) {
        case INVITE_DATA:
            return { ...state, ...action.data };
        default:
            return state
    }
}

