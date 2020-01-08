import { api } from './common';
export const INIT_COURSE = 'INIT_COURSE';
export const SET_PAGE_NUM = 'SET_PAGE_NUM';
export const EDIT_COURSE = 'EDIT_COURSE';
export const EDIT_ALL_COURSE = 'EDIT_ALL_COURSE';

export function initCourse (data) {
	return {
		type: INIT_COURSE,
		data
	}
}

export function setPageNum (pageNum) {
    return {
        type: SET_PAGE_NUM,
        pageNum
    }
};

export function editAllCourse (data) {
    return async (dispatch, getStore) => {
        dispatch({
            type: EDIT_ALL_COURSE,
            data,
        });
    }
};

export function editCourse (data, id) {
    return async (dispatch, getStore) => {
        dispatch({
            type: EDIT_COURSE,
            data,
            id,
        });
    }
};

export function auditCourse (liveId,page,size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/excellentCourse/auditCourse',
            body: {
                liveId,
                page,
                size,
            },
            method: 'POST',
        });
        dispatch(initCourse(result.data));
        dispatch(setPageNum(page));

        return result.data.courseList;
    }
};
export function courseAudit (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/excellentCourse/courseAudit',
            body: {...param},
            method: 'POST',
		});
        return result 
    }
};
export function quickAudit (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/excellentCourse/quickAudit',
            body: {
                liveId,
            },
            method: 'POST',
		});
        return result 
    }
};




