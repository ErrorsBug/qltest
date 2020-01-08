import {
    INIT_CHARGE_RECOMMEND_COURSE_LIST,
    SET_CHARGE_RECOMMEND_COURSE_PAGE_NUM,
    FETCH_CHARGE_RECOMMEND_COURSE_LIST,
} from '../actions/charge-recommend'

const initState = {
    courseList: [],
    coursePageNum: 1,
    coursePageSize: 20,
};

export function chargeRecommend (state = initState, action) {
    switch (action.type) {
        case INIT_CHARGE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: action.courseList.filter(item => item.displayStatus != 'N')} };

        case SET_CHARGE_RECOMMEND_COURSE_PAGE_NUM:
            return { ...state, ...{coursePageNum: action.coursePageNum} };

        case FETCH_CHARGE_RECOMMEND_COURSE_LIST:
            const newList = action.courseList ? action.courseList.filter(item => item.displayStatus != 'N') : [];
            return { ...state, ...{courseList: [...state.courseList, ...newList]} };

        default:
            return state;
    }
}
