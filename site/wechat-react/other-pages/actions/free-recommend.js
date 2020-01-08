
import { api } from './common';

export const INIT_FREE_RECOMMEND_COURSE_LIST = 'INIT_FREE_RECOMMEND_COURSE_LIST';
export const SET_FREE_RECOMMEND_COURSE_PAGE_NUM = 'SET_FREE_RECOMMEND_COURSE_PAGE_NUM';

export const FETCH_FREE_RECOMMEND_COURSE_LIST = 'FETCH_FREE_RECOMMEND_COURSE_LIST';
export const SWITCH_LABEL_FREE_RECOMMEND_COURSE_LIST = 'SWITCH_LABEL_FREE_RECOMMEND_COURSE_LIST';

export const GET_ALL_TAGS = Symbol("GET_ALL_TAGS");
export const GET_LIST_BANNER = Symbol("GET_LIST_BANNER");

// 初始化课程列表
export function initCourseList (courseList) {
    return {
        type: INIT_FREE_RECOMMEND_COURSE_LIST,
        courseList
    }
};

// 设置课程列表分页页码
export function setCoursePageNum (coursePageNum) {
    return {
        type: SET_FREE_RECOMMEND_COURSE_PAGE_NUM,
        coursePageNum
    }
};

// 获取下一页话题
export function fetchCourseList (page, size, tagId, showLoading, order) {
    return async (dispatch, getStore) => {
        let result = {};
        if(tagId != 1){
            result = await getFreeCourse(page, size, tagId, order, dispatch, getStore, showLoading);
        } else {
            result = await getFreeChoiceCourse(page, size, tagId, dispatch, getStore, showLoading);
        }
        dispatch({
            type: FETCH_FREE_RECOMMEND_COURSE_LIST,
            courseList: result.data && result.data.courseList || result.data.regions || []
        });
        dispatch(setCoursePageNum(page));
        return result.data && result.data.courseList || result.data.regions || []
    };
};
// 切换标签时获取话题
export function switchLabelGetCourseList(page, size, tagId, showLoading, order) {
    return async (dispatch, getStore) => {
        let result = {};
        await dispatch(setCoursePageNum(page));
        if(tagId != 1){
            result = await getFreeCourse(page, size, tagId,order, dispatch, getStore, showLoading);
        } else {
            result = await getFreeChoiceCourse(page, size, tagId, dispatch, getStore, showLoading);
        }
        dispatch({
            type: SWITCH_LABEL_FREE_RECOMMEND_COURSE_LIST,
            courseList: result.data && result.data.courseList || result.data.regions || []
        });
        
        return result.data && result.data.courseList || result.data.regions || []
    };
}

// 获取某标签的第几页的话题
async function getFreeCourse(page, size, tagId, order = 'new', dispatch, getStore, showLoading) {
    const res = await api({
        dispatch,
        getStore,
        showLoading,
        url: '/api/wechat/free-recommend/other-course',
        body: {
            page,
            size,
            tagId,
            order
        }
    });
    return res;
}

// 获取所有的tags
export function getFreeAllTag(type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/free-recommend/list-tags',
            body: {
                type
            },
        });
        if (result && result.data && result.data.tagList) {
            dispatch({
                type: GET_ALL_TAGS,
                courseList: result.data && [{name:'精选',id: 1,parentId:'0' },...result.data.tagList] || []
            })
        }
        return result;
    };
};


// 获取banner
export function getFreeListBanner(type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/free-recommend/list-banner',
            body: {
                type
            },
        });
        if (result && result.data && result.data.bannerList) {
            dispatch({
                type: GET_LIST_BANNER,
                courseList: result.data && result.data.bannerList || []
            })
        }
        return result;
    };
};

// 获取精选数据
async function getFreeChoiceCourse(page, size, tagId, dispatch, getStore, showLoading) {
    const res = await api({
        dispatch,
        getStore,
        showLoading,
        url: '/api/wechat/free-recommend/choice-course',
        body: {
            page,
            size,
            tagId
        }
    });
    return res;
}