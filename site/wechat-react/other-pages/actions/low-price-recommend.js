
import { api } from './common';

export const INIT_LOW_PRICE_RECOMMEND_COURSE_LIST = 'INIT_LOW_PRICE_RECOMMEND_COURSE_LIST';
export const SET_LOW_PRICE_RECOMMEND_COURSE_PAGE_NUM = 'SET_LOW_PRICE_RECOMMEND_COURSE_PAGE_NUM';

export const FETCH_LOW_PRICE_RECOMMEND_COURSE_LIST = 'FETCH_LOW_PRICE_RECOMMEND_COURSE_LIST';
export const SWITCH_LABEL_LOW_PRICE_RECOMMEND_COURSE_LIST = 'SWITCH_LABEL_LOW_PRICE_RECOMMEND_COURSE_LIST';

// 初始化课程列表
export function initCourseList (courseList) {
    return {
        type: INIT_LOW_PRICE_RECOMMEND_COURSE_LIST,
        courseList
    }
};

// 设置课程列表分页页码
export function setCoursePageNum (coursePageNum) {
    return {
        type: SET_LOW_PRICE_RECOMMEND_COURSE_PAGE_NUM,
        coursePageNum
    }
};

// 获取下一页话题
export function fetchCourseList (page, size, tagId, showLoading) {

    return async (dispatch, getStore) => {
        const result = await getLowPriceCourse(page, size, tagId, dispatch, getStore, showLoading);
        dispatch({
            type: FETCH_LOW_PRICE_RECOMMEND_COURSE_LIST,
            courseList: result.data && result.data.dataList || []
        });

        dispatch(setCoursePageNum(page));

        return result.data&&result.data.dataList
    };
};
// 切换标签时获取话题
export function switchLabelGetCourseList(page, size, tagId, showLoading) {
    return async (dispatch, getStore) => {
        const result = await getLowPriceCourse(page, size, tagId, dispatch, getStore, showLoading);
        dispatch({
            type: SWITCH_LABEL_LOW_PRICE_RECOMMEND_COURSE_LIST,
            courseList: result.data && result.data.dataList || []
        });

        dispatch(setCoursePageNum(page));

        return result.data&&result.data.dataList
    };
}

// 获取某标签的第几页的话题
async function getLowPriceCourse(page, size, tagId, dispatch, getStore, showLoading) {
    const res = await api({
        dispatch,
        getStore,
        showLoading,
        url: '/api/wechat/recommend/low-price/course-list-with-class',
        body: {
            page,
            size,
            tagId
        }
    });
    return res;
}