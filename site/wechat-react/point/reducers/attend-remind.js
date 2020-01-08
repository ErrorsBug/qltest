import { GET_ATTEND_REMIND_SETTING } from "../actions/attend-remind";

const initData = {};

export function attendRemind(state = initData, action) {
    switch (action.type) {
        case GET_ATTEND_REMIND_SETTING:
            return { ...state, openStatus: action.openStatus };
        default:
            return state;
    }
}
