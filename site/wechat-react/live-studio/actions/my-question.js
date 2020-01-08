import { api } from './common';

export const UPDATE_QUESTION_LIST = 'STUDIO-MY-QUESTION/UPDATE_QUESTION_LIST'

export function updateQuestionList(data){
    return {
        type: UPDATE_QUESTION_LIST,
        data,
    }
}

export function fetchQuestionList(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/studio/my-question',
            body: params
        });
        return result;
    };
}
