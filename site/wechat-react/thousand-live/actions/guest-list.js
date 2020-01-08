import { api } from './common';

export const topicGuestList = (topicId, invitedId) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            method: 'POST',
            getStore,
            showLoading:false,
            url: '/api/wechat/topic/topicGuestList',
            body: {
                topicId ,
                invitedId
            }
        });

        return result;
    }
}

export const deleteTopicTitle = (topicId, invitedId) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading:false,
            url: '/api/wechat/topic/deleteTopicTitle',
            body: {
                topicId,
                invitedId
            }
        });

        return result;
    }
}

export const setTopicTitle = (topicId, role, invitedId, title) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading:false,
            url: '/api/wechat/topic/setTopicTitle',
            body: {
                topicId,
                role,
                invitedId,
                title
            }
        });

        return result;
    }
}

export const historyGuestList = (topicId) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading:false,
            url: '/api/wechat/topic/historyGuestList',
            body: {
                topicId
            }
        });

        return result;
    }
}

export const deleteHistoryRecord = (topicId, historyId) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading:false,
            url: '/api/wechat/topic/deleteHistoryRecord',
            body: {
                topicId,
                historyId
            }
        });

        return result;
    }
}

export const setHistoryTitle = (topicId, historyId, role, title) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading:false,
            url: '/api/wechat/topic/setHistoryTitle',
            body: {
                topicId,
                historyId,
                role,
                title
            }
        });

        return result;
    }
}

export const getLiveRole = (liveId) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/liveRole',
            body: {
                liveId
            }
        })
        return result;
    }
}