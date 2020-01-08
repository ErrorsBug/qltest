//INIT_CUT_DATA
import {
    INIT_CUT_DATA,
    INIT_CUT_COURSE_INFO,
} from '../actions/cut'
const initState = {
    cutInfoData:{},
    courseCutInfo:{},
};

export function cut (state = initState, action) {
    switch (action.type) {
        case INIT_CUT_DATA:
            return { ...state, cutInfoData: action.cutInfoData };
        case INIT_CUT_COURSE_INFO:
            return { ...state, courseCutInfo: action.courseCutInfo };
        default:
            return state;
    }
}
