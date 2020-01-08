/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-12 17:09:06 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-20 16:27:23
 */
import { api } from './common';

/*
 * prefix - JOIN_LIST
 * 避免类型名称冲突
 * */
export const JOIN_LIST_UPDATE_LIST = 'JOIN_LIST_UPDATE_LIST'
export const JOIN_LIST_UPDATE_PAGE = 'JOIN_LIST_UPDATE_PAGE'
export const JOIN_LIST_UPDATE_COUNT = 'JOIN_LIST_UPDATE_COUNT'
export const JOIN_LIST_CLEAR_LIST = 'JOIN_LIST_CLEAR_LIST'
export const JOIN_LIST_KICK_OUT = 'JOIN_LIST_KICK_OUT'
export const JOIN_LIST_GO_BLACK = 'JOIN_LIST_GO_BLACK'

/**
 * 更新列表
 * 
 * @export
 * @param {Array<any>} list  列表数据
 * @returns 
 */
export function updateList(list) {
    return {
        type: JOIN_LIST_UPDATE_LIST,
        list,
    }
}

export function updatePage(page){
    return {
        type:JOIN_LIST_UPDATE_PAGE,
        page,
    }
}

/**
 * 更新报名人数
 * 
 * @export
 * @param {number} count 报名人数
 * @returns 
 */
export function updateAuthCount(count) {
    return {
        type: JOIN_LIST_UPDATE_COUNT,
        count,
    }
}

/**
 * 清空列表
 * 
 * @export
 * @returns 
 */
export function clearList() {
    return { type: JOIN_LIST_CLEAR_LIST }
}

/**
 * 获取话题报名人数
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchTopicAuthCount(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/authCount',
            body: params
        })

        return result;
    };
}

/**
 * 获取打卡训练营报名人数
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchCampAuthCount(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: "/api/wechat/checkInCamp/campAuthNum",
            body: params
        })

        return result;
    };
}


/**
 * 获取系列课报名人数
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchChannelAuthCount(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/channel/authCount',
            body: params
        })

        return result;
    };
}

/**
 * 获取VIP报名人数
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchVipAuthCount(params) {
    return async (dispatch, getStore) => {        
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/vip/authCount',
            body: params
        })

        return result;
    };
}
/**
 * 获取定制VIP报名人数
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchCustomVipAuthCount(params) {
    return async (dispatch, getStore) => {        
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/customVip/authCount',
            body: params
        })

        return result;
    };
}

/**
 * 获取话题报名列表
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchTopicAuthList(params) {
    return async (dispatch, getStore) => {
        const {page,size} = getStore().joinList
        params.page = page
        params.size = size
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/authList',
            body: params
        })

        return result;
    };
}

/**
 * 获取训练营报名列表
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchCampAuthList(params) {
    return async (dispatch, getStore) => {
        const {page,size} = getStore().joinList
        params.page = page
        params.size = size
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/checkInCamp/getAuthUserList',
            body: params
        })

        return result;
    };
}

/**
 * 获取系列课报名列表
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchChannelAuthList(params) {
    return async (dispatch, getStore) => {
        const {page,size} = getStore().joinList
        params.page = page
        params.size = size
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/channel/authList',
            body: params
        })

        return result;
    };
}

/**
 * 获取VIP报名列表
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function fetchVipAuthList(params) {
    return async (dispatch, getStore) => {
        const {page,size} = getStore().joinList
        params.page = page
        params.size = size
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/vip/authList',
            body: params
        })

        return result;
    };
}

/**
 * 获取定制vip报名用户
 */
export function fetchCustomVipAuthList(params) {
    return async (dispatch, getStore) => {
        const {page,size} = getStore().joinList
        params.page = page
        params.size = size
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getCustomVipAuthList',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: params
        })
        return result;
    }
}

/**
 * （取消）踢出直播间操作
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function performKick(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/kick',
            body: params
        })

        return result;
    };
}

//vip踢出和取消踢出直播间操作
export function performVipKick(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/vip/kick',
            body: params
        })
        return result;
    }
}

//训练营踢出和取消踢出直播间操作
export function performCampKick(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/checkInCamp/setUserKickout',
            body: params
        })
        return result;
    }
}

/**
 * （取消）踢出操作
 * @param {object} params
 */
export function kickOut (params) {
    return {
        type: JOIN_LIST_KICK_OUT,
        params,
    }
}

/**
 * （取消）拉黑
 * @param {object} params 
 */
export function goBlack (params) {
    return {
        type: JOIN_LIST_GO_BLACK,
        params,
    }
}

/**
 * （取消）拉黑操作
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function performBlack(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/black',
            body: params
        })

        return result;
    };
}

/**
 * 检查是否是系列课
 * @param {string} businessId
 * @param {string} type
 */
export function isRelayChannel(businessId, type){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/relayStatus',
            body: {businessId, type}
        });

        return result;
    }
}