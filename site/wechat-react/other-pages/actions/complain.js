import { api } from './common';

export const GET_REASON_TYPES = 'GET_REASON_TYPES'
export const SAVE_COMPLAIN = 'SAVE_COMPLAIN'

/* 获取投诉原因类型*/
export function getReasonTypes() {
   return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/complain/getReasonType',
        });

        dispatch({
            type: GET_REASON_TYPES,
        })
        return result;
    };
}

/* 新增用户投诉 */
export function saveComplain(reqArg) {
       return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/complain/saveComplain',
            body: reqArg,
        });
        return result;
    };
}