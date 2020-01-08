
import { api } from './common';

export const INIT_CHARGE_RECOMMEND_COURSE_LIST = 'INIT_CHARGE_RECOMMEND_COURSE_LIST';
export const SET_CHARGE_RECOMMEND_COURSE_PAGE_NUM = 'SET_CHARGE_RECOMMEND_COURSE_PAGE_NUM';

export const FETCH_CHARGE_RECOMMEND_COURSE_LIST = 'FETCH_CHARGE_RECOMMEND_COURSE_LIST';


// 初始化课程列表
export function initCourseList (courseList) {
    return {
        type: INIT_CHARGE_RECOMMEND_COURSE_LIST,
        courseList
    }
};

// 设置课程列表分页页码
export function setCoursePageNum (coursePageNum) {
    return {
        type: SET_CHARGE_RECOMMEND_COURSE_PAGE_NUM,
        coursePageNum
    }
};

// 获取下一页话题
export function fetchCourseList (page, size, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/recommend/charge/course-list',
            body: {
                page,
                size,
            }
        });

        dispatch({
            type: FETCH_CHARGE_RECOMMEND_COURSE_LIST,
            courseList: result.data && result.data.dataList || []
        });

        dispatch(setCoursePageNum(page));

        return result.data.dataList
    }
};
