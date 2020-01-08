import { api } from './common';

export const INIT_CURRENT_LIVE = 'INIT_CURRENT_LIVE'
export const INIT_TIMELINE_LIST = 'INIT_TIMELINE_LIST'
export const INIT_LIVE_LIST = 'INIT_LIVE_LIST'

export const INIT_NEW_LIKE_NUM = 'INIT_NEW_LIKE_NUM'
export const INIT_NEW_LIKE_LIST = 'INIT_NEW_LIKE_LIST'
export const INIT_POWER = 'INIT_POWER'
export const INIT_LIVEID = 'INIT_LIVEID'
export const LIKE_ACTION = 'LIKE_ACTION'

export const INIT_TIMELINE_CHANCE = 'INIT_TIMELINE_CHANCE'
export const INIT_CHOOSE_TIMELINE_TYPE= 'INIT_CHOOSE_TIMELINE_TYPE'

export const CREATE_TIMELINE = 'CREATE_TIMELINE'
export const DELETE_TIMELINE = 'DELETE_TIMELINE'

export const LOAD_TOPIC_LIST = 'LOAD_TOPIC_LIST'
export const LOAD_HOMEWORK_LIST = 'LOAD_HOMEWORK_LIST'
export const LOAD_CHANNEL_LIST = 'LOAD_CHANNEL_LIST'
export const LOAD_FOCUS_LIVES_LIST = 'LOAD_FOCUS_LIVES_LIST'
export const LOAD_TIMELINE_LIST = 'LOAD_TIMELINE_LIST'
export const CLEAN_TIMELINE_LIST = 'CLEAN_TIMELINE_LIST'

export function initTimelineList(data) {
    return {
        type: INIT_TIMELINE_LIST,
        data,
    };
}
export function initLiveList(data) {
    return {
        type: INIT_LIVE_LIST,
        data,
    };
}
export function initCurrentLive(data) {
    return {
        type: INIT_CURRENT_LIVE,
        data,
    };
}
export function initChooseTimelineTypes(data) {
    return {
        type: INIT_CHOOSE_TIMELINE_TYPE,
        data,
    };
}
export function initPower(data) {
    return {
        type: INIT_POWER,
        data,
    };
}

export function initLiveId(data) {
    return {
        type: INIT_LIVEID,
        data,
    };
}



export function initNewLikeNum(data) {
    return {
        type: INIT_NEW_LIKE_NUM,
        data,
    };
}

export function likeAction(data) {
    return {
        type: LIKE_ACTION,
        data,
    };
}

export function deleteTimelineAction(data) {
    return {
        type: DELETE_TIMELINE,
        data,
    };
}

export function cleanTimelineList(data) {
    return {
        type: CLEAN_TIMELINE_LIST,
        data,
    };
}




export function loadChannelList(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/getChannelIdList',
            body: { liveId },
            method: 'POST',
        });

        dispatch({
            type: LOAD_CHANNEL_LIST,
            data: result && result.data && result.data.courseList  || []
        });
        return result;
    }
}


export function loadTopicList(liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getTopicList',
            body: { liveId, page },
            method: 'POST',
        });

        dispatch({
            type: LOAD_TOPIC_LIST,
            data: result && result.data && result.data.topicList  || []
        });

        return result && result.data;
    }
}
export function loadHomeworkList(liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getHomeworkList',
            body: { liveId, page },
            method: 'POST',
        });

        dispatch({
            type: LOAD_HOMEWORK_LIST,
            data: result && result.data && result.data.list  || []
        });
        return result && result.data;
    }
}
export function loadFocusList(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/getChannelIdList',
            body: { liveId },
            method: 'POST',
        });


        return result;
    }
}



export function getLiveId() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/timeline/getLiveId',
            method: 'GET',
        });

        dispatch({
            type: INIT_LIVEID,
            data: result && result.data && result.data.entityPo && result.data.entityPo.id  || []
        });

        return result && result.data;
    }
}


export function setLiveId(liveId) {
    return async (dispatch, getStore) => {
        // const result = await api({
        //     dispatch,
        //     getStore,
        //     url: '/api/wechat/timeline/getLiveId',
        //     method: 'GET',
        // });

        dispatch(initLiveId(liveId));

    }
}


export function liveFocus(liveId,cancelFlag) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/timeline/focus",
            body: {
                liveId,
                status: cancelFlag
            }
        });
        if(result && result.data) {
            return result && result.data
        }
    }
}

export function focusList(page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: "/api/wechat/timeline/focusList",
            body: {
                page
            }
        });

        if(result && result.data && result.data.liveEntityPos) {
            return result.data.liveEntityPos
        }
    }
}

export function timelineLike(feedId, status, index) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/timeline/like",
            body: {
                feedId,
                status
            },
            method: 'POST',
        });

        if(result && result.data ) {

            dispatch(likeAction({
                status, index
            }))

            return result.data.code == 200
        }
    }
}

export function getNewLikeList(liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/timeline/getNewLikeList",
            body: {
                liveId,
                page
            },
            method: 'POST',
        });

        if(result && result.data && result.data.likelist ) {
            return result.data.likelist
        }
    }
}

export function setNewLikeToRead(liveId, ids) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/timeline/setNewLikeToRead",
            body: {
                liveId,
                ids
            },
            method: 'POST',
        });

        dispatch(initNewLikeNum({newLikeNum: 0}))

        if(result && result.data ) {
            return result.data
        }
    }
}


export function initTimeline(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/initTimeline',
            body: { params },
            method: 'POST',
        });


        if(result && result.data) {
            const va = result.data
            dispatch(initPower({
                power: va.power
            }))
            dispatch(initLiveList({ 
                myAdminLives: [va.myAdminLives],
                myFocusLives: va.myFocusLives
            }));
            dispatch(initCurrentLive({ myCurrentLiveId: va.liveId, userId: va.userId }));   
            dispatch(initNewLikeNum({newLikeNum: va.newLikeNum}))
        }
        return result;
    }
}


export function loadMoreTimeline(page, time) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getTimelineList',
            body: {
                beforeOrAfter: "before",
                page: {
                    page: page,
                    size: 20
                },
                time,
            },
            method: 'POST',
        });

        if(result && result.data) {
            dispatch({
                type: LOAD_TIMELINE_LIST,
                data: result && result.data && result.data.list
            })
        }
        return result && result.data && result.data.list
    }
}


export function pushTimeline(content, liveId, relateId, relateType){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/timeline/creteTimeline', 
            body: { content, liveId, relateId, relateType },
            method: 'POST',
        });

        if(result) {
            return result
        }
    }
}

export function getDataForCreateTimeline(businessId, type){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getDataForCreateTimeline', 
            body: { businessId, type },
            method: 'POST',
        });

        if(result && result.data) {
            return result.data
        }
    }
}

export function restPushTimes(businessId, type){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/restPushTimes', 
            body: { businessId, type },
            method: 'POST',
        });

        return result;
    }
}



export function deleteTimeLine(feedId, index){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/deleteTimeLine', 
            body: { feedId },
            method: 'POST',
        });

        if (result && result.data) {
            if (result.data.code === 200) {
                dispatch(deleteTimelineAction({
                    index,
                    feedId,
                }))
            }

        }

        return result;
    }
}

/**
 * 一键订阅，一键屏蔽
 */
export async function onekeyUpdateAlert(params){
    return await api({
        showLoading: false,
        url: '/api/wechat/timeline/onekeyUpdateAlert', 
        body: params,
        method: 'POST',
    });
}

