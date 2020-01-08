
import {
    INIT_SHOP_TAG_LIST,
    INIT_SHOP_COURSE_LIST,
    INIT_SHOP_BANNER_LIST,
    INIT_SHOP_RECOMMEND_LIST,
    INIT_PUSH_COURSE_LIST,
    INIT_PUSH_ORDER_LIST,
    INIT_THEMES,
    INIT_THEME,
    GET_IMG_URL_CONFIG
} from '../actions/shop';

const initState = {
	tagList: [],
    courseList: [],
    rankList: [],
    coursePushList: [],
    orderList: [],
    tagId: 0,
    themes: [],
    chartletUrl: {}
};

export function shop (state = initState, action) {
    switch (action.type) {
        case INIT_SHOP_TAG_LIST:
            return { ...state, tagList: action.tagList };
        case INIT_SHOP_COURSE_LIST:
            return { ...state, courseList: action.courseList };
        case INIT_PUSH_COURSE_LIST:
            return { ...state, coursePushList: [...state.coursePushList,...action.coursePushList ]};
        case INIT_PUSH_ORDER_LIST:
            return { ...state, orderList: [...state.orderList,...action.orderList ]};
        case INIT_THEMES:
            return { ...state, themes: action.themes};
        case INIT_THEME:
            return { ...state, theme: action.theme};
        case GET_IMG_URL_CONFIG:
            return { ...state, chartletUrl: action.chartletUrl};
        default:
            return state;
    }
}