import { apiService } from '../components/api-service'

export const UPDATE_REPRINT_CHANNEL_LIST = 'COURSE/UPDATE_REPRINT_CHANNEL_LIST'
export const CLEAR_REPRINT_CHANNEL_LIST = 'COURSE/CLEAR_REPRINT_CHANNEL_LIST'
export const UPDATE_CHANNEL_TYPES = 'COURSE/UPDATE_CHANNEL_TYPES'
export const UP_OR_DOWN_SHELF = 'COURSE/UP_OR_DOWN_SHELF'
export const DELETE_COURSE = 'COURSE/DELETE_COURSE'

/* 获取转载系列课列表 */
export function fetchReprintChannelList(params) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/relayChannels',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            return result.data.liveChannels
        }
    }
}

/* 更新转载系列课列表 */
export function updateReprintChannelList(list) {
    return {
        type: UPDATE_REPRINT_CHANNEL_LIST,
        list,
    }
}

/* 清空转载系列课列表 */
export function clearReprintChannelList(list) {
    return {
        type: CLEAR_REPRINT_CHANNEL_LIST,
        list,
    }
}

/* 获取直播间的系列课分类 */
export function fetchChannelTypes(params) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/channel/getChannelTags',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            dispatch(updateChannelTypes(result.data.channelTagList))
            return result.data.channelTagList
        }
    }
}

export function addChannelTypes(params) {
    return async (dispatch, getStore) => {
        const channelTypes = getStore().reprint.channelTypes
        const result = await apiService.post({
            url: '/h5/channel/addChannelTag',
            body: params,
            showError: true,
        });
        if (result.state.code === 0) {
            const newTypes = [...channelTypes, {id: result.data.channelTagId, name: result.data.channelTagName}]
            dispatch(updateChannelTypes(newTypes))
        }
        return result;
    }
}

/* 更新直播间的系列课分类 */
export function updateChannelTypes(list) {
    return {
        type: UPDATE_CHANNEL_TYPES,
        list,
    }
}

/* 请求上下架系列课 */
export function PostUpOrDownShelf(params) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/upOrDown',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            dispatch(upOrDownShelf(params.channelId, params.type))
        }
    }
}

/* 上下架系列课 */
export function upOrDownShelf(id, upOrDown) {
    return {
        type: UP_OR_DOWN_SHELF,
        id,
        upOrDown,
    }
}

/* 请求删除课程 */
export function PostDeleteCourse(params) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/remove',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            dispatch(deleteCourse(params.channelId))
        }
    }
}

/* 请求删除课程 */
export function deleteCourse(id) {
    return {
        type: DELETE_COURSE,
        id,
    }
}