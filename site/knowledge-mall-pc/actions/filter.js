import { apiService } from '../components/api-service';
import { UPDATE_COURSE_LIST, CLEAR_COURSE_LIST } from './course';
import { category } from '../containers/mall-index/style.scss';

export const UPDATE_FILTER_CONDITIONS = 'UPDATE_FILTER_CONDITIONS';
export const RESET_FILTER_CONDITIONS = 'RESET_FILTER_CONDITIONS';

export const FETCH_CATEGORY_LIST = 'FETCH_CATEGORY_LIST';

/**
 * 更新课程的筛选条件
 * @param {*object} conditions 新的筛选条件
 */
export function updateFilterConditions(conditions){
    return {
        type: UPDATE_FILTER_CONDITIONS,
        conditions
    }
}

/* 重置筛选条件 */
export function resetFilterConditions() {
    return {
        type: RESET_FILTER_CONDITIONS,
    }
}

/**
 * 获取知识通商城的分类数据
 * @param {*object} params 
 */
export function fetchCategoryList(params){
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/courseTagList',
            body: params,
            showError: true,
        });
        dispatch({
            type: FETCH_CATEGORY_LIST,
            payload: {
                categoryList: result.data.tagList
            }
        })
        return result;
    }
}

/**
 * 对知识通商城的课程进行搜索
 */
export function searchCourse(params){
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/courseList',
            body: params,
            showError: true
        });
        return result;
    }
}



