import { api } from './common';

export const GET_EDITOR_SUMMARY = 'GET_EDITOR_SUMMARY';
export const ADD_EDITOR_SUMMARY = 'ADD_EDITOR_SUMMARY';

/**
 * @argument [string] businessId
 * 
 */
export function getEditorSummary(businessId, type){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips: false,
            url: '/api/wechat/ueditor/getSummary', 
            body: { 
                businessId,
                type
             },
            method: 'POST',
	        errorResolve: true,
        });

        return result
    }
}

export function addEditorSummary(businessId, type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips: false,
            url: '/api/wechat/ueditor/addSummary',
            body: {
                businessId,
                type
            },
            method: 'POST',
        })

        if (result.state.code == 0) {
            return result;
        }
    }
}