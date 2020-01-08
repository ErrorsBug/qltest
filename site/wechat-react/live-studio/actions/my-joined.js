import { api } from './common';

export function getJoinedTopicList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/studio/my-joined',
            body: params
        });
        return result;
    };
}
