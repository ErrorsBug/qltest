import { api } from './common';

export const SET_CONSULT_LIST = 'SET_CONSULT_LIST'
export const SET_CONSULT_PRAISE = 'SET_CONSULT_PRAISE'

/* 提交咨询*/
export function sendConsult(content, topicId, type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/consult/send',
            body: { content, topicId, type },
            method: 'POST',
        });
        return result;
    }
}

/* 获取精选咨询*/
export function getConsultSelected(topicId, type, showLoading = true) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/consult/selected',
            body: { topicId, type },
            method: 'GET',
        });
        return result;
    }
}

/* */
export function consultPraise(id) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/consult/praise',
            body: { id },
            method: 'POST',
        });
        if (result.state.code === 0) {
            dispatch(setConsultPraise(id))
        }
        return result;
    }
}

export function setConsultList(consultList) {
    return {
        type: SET_CONSULT_LIST,
        consultList,
    }
}

export function setConsultPraise(id) {
    return {
        type: SET_CONSULT_PRAISE,
        id,
    }
}

export function getIsLiveAdmin(channelId, topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/isLiveAdmin',
            body: {channelId, topicId},
            method: 'POST'
        });
        return result;
    }
}
