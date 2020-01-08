import {
    INIT_LOW_PRICE_RECOMMEND_COURSE_LIST,
    SET_LOW_PRICE_RECOMMEND_COURSE_PAGE_NUM,
    FETCH_LOW_PRICE_RECOMMEND_COURSE_LIST,
    SWITCH_LABEL_LOW_PRICE_RECOMMEND_COURSE_LIST,
} from '../actions/low-price-recommend'

const initState = {
    courseList: [],
    coursePageNum: 1,
    coursePageSize: 20,
};

export function lowPriceRecommend (state = initState, action) {
    switch (action.type) {
        case INIT_LOW_PRICE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: action.courseList} };

        case SET_LOW_PRICE_RECOMMEND_COURSE_PAGE_NUM:
            return { ...state, ...{coursePageNum: action.coursePageNum} };

        case FETCH_LOW_PRICE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: [...state.courseList, ...action.courseList]} };
        //切换标签覆盖操作
        case SWITCH_LABEL_LOW_PRICE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: [...action.courseList]} };
        default:
            return state;
    }
}
