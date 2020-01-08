/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-12 17:09:02 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-20 16:47:43
 */
import {
    JOIN_LIST_UPDATE_LIST,
    JOIN_LIST_UPDATE_PAGE,
    JOIN_LIST_UPDATE_COUNT,
    JOIN_LIST_CLEAR_LIST,
    JOIN_LIST_KICK_OUT,
    JOIN_LIST_GO_BLACK,
} from '../actions/join-list'

const initState = {
    /* 列表相关 */
    list: [],
    page: 1,
    size: 20,
    /* 报名人数 */
    count: null,
};

const ACTION_HANDLERS = {
    [JOIN_LIST_UPDATE_LIST]: (state, action) => {
        return { ...state, list: state.list.concat(action.list) }
    },
    [JOIN_LIST_UPDATE_PAGE]: (state, action) => {
        return { ...state, page: action.page }
    },
    [JOIN_LIST_UPDATE_COUNT]: (state, action) => {
        return { ...state, count: action.count }
    },
    [JOIN_LIST_CLEAR_LIST]: (state, action) => {
        return { ...state, list: [] }
    },
    [JOIN_LIST_KICK_OUT]: (state, action) => {
        const list = state.list.map(item => {
            if (item.userId == action.params.targetUserId) {
                item.kickOutStatus = action.params.status
            }

            return item;
        });

        return { ...state, list }
    },
    [JOIN_LIST_GO_BLACK]: (state, action) => {
        const list = state.list.map(item => {
            if (item.userId == action.params.targetUserId) {
                item.blackListStatus = action.params.status
            }

            return item;
        });

        return { ...state, list }
    }
};

/**
 * 报名列表reducer
 * 
 * @export
 * @param {any} [state=initState] 
 * @param {any} action 
 * @returns 
 */
export function joinList(state = initState, action) {
    const handler = ACTION_HANDLERS[action.type];
    /* 如果存在action对应操作，更新状态并返回，否则返回当前状态 */
    return handler ? handler(state, action) : state
}
