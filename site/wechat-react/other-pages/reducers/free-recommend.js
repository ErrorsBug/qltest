import {
    INIT_FREE_RECOMMEND_COURSE_LIST,
    SET_FREE_RECOMMEND_COURSE_PAGE_NUM,
    FETCH_FREE_RECOMMEND_COURSE_LIST,
    SWITCH_LABEL_FREE_RECOMMEND_COURSE_LIST,
    GET_ALL_TAGS,
    GET_LIST_BANNER
} from '../actions/free-recommend'

const initState = {
    courseList: [],
    coursePageNum: 1,
    coursePageSize: 20,
    allTags: [],
    listBanner: []
};

export function freeRecommend (state = initState, action) {
    switch (action.type) {
        case INIT_FREE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: action.courseList} };
        case SET_FREE_RECOMMEND_COURSE_PAGE_NUM:
            return { ...state, ...{coursePageNum: action.coursePageNum} };
        case FETCH_FREE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: [...state.courseList, ...action.courseList]} };
        //切换标签覆盖操作
        case SWITCH_LABEL_FREE_RECOMMEND_COURSE_LIST:
            return { ...state, ...{courseList: [...action.courseList]} };
        case GET_ALL_TAGS: 
            return { ...state,allTags: action.courseList }
        case GET_LIST_BANNER:
            return { ...state,listBanner: action.courseList }
        default:
            return state;
    }
}
