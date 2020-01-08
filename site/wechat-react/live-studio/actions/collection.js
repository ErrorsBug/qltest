import { api } from './common'

/* 查询城市 */
export function regionSelect(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/region-select',
        });
        
        return result
    }
}
/* 保存学员信息 */
export function saveStudentInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/save-student-info',
        });
        
        return result
    }
}
/* 查询学员是否填写过 */
export function checkUser(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/check-user',
        });
        
        return result && result.data && result.data.config
    }
}
/* 查询填表信息 */
export function fetchFormFields(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/get-form-fields',
        });

        return result
    }
}

/* 查询学生已经填表信息 */
export function getUserDetail(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/get-user-detail',
        });

        return result
    }
}
