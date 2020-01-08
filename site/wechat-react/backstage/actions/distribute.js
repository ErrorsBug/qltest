import { api } from './common';

export function getShareUsersLive(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'POST',
            url: '/api/wechat/distribute/shareUsersLive',
            body: params,
        });

        return result;
    };
}

export function updateShareStatus(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'POST',
            url: '/api/wechat/distribute/updateShareStatus',
            body: params,
        });

        return result;
    };
}


export function getShareUsersLiveCount(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'POST',
            url: '/api/wechat/distribute/shareUsersLiveCount',
            body: params,
        });

        return result;
    };
}

export function getShareLiveManage(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'POST',
            url: '/api/wechat/distribute/shareManage',
            body: params,
        });

        return result;
    };
}

export function setLiveShareStatus(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'POST',
            url: '/api/wechat/distribute/changelock',
            body: params,
        });

        return result;
    };
}

export function deleteLiveAuthShare(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'POST',
            url: '/api/wechat/distribute/removeShare',
            body: params,
        });

        return result;
    };
}


export function getTopic (liveId, pageNum) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/distribute/shareTopicList',
            body: {
                liveId, 
                page: {
                    page: pageNum,
                    size: 20,
                },
            },
            method: 'POST',
        });
        
        return result && result.data && result.data.shareTopic
    }
};

// 获取全部则不填tagId
export function getChannel(liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/channelDistributionIndexList',
            body: {
                liveId,
                pageNum: page,
                pageSize: 20,
            },
        });
        
        return result && result.data && result.data.list
    }
};


export function liveInfo (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/Info',
            body: {
                liveId,
            },
            method: 'GET',
        });
        return result && result.data
    }
};