import { api } from "./common";

export const GET_UNREAD_COUNT = "GET_UNREAD_COUNT";
export const CLEAR_TAB_UNREAD = "CLEAR_TAB_UNREAD";
export const SWITCH_TAB = "SWITCH_TAB";
export const GET_MESSAGE_LIST = "GET_MESSAGE_LIST";
export const GET_TOP_MESSAGE = "GET_TOP_MESSAGE";
export const CLOSE_AD = "CLOSE_AD";
export const READ_MESSAGE = 'READ_MESSAGE';

/**
 * 获取未读消息数量
 * @param {number} liveId 直播间ID
 */
export function getUnreadCount(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/transfer/h5/live/message/countUnread",
            body: { liveId }
        });

        if (result.state.code === 0) {
            const data = result.data.countMap;
            dispatch({
                type: GET_UNREAD_COUNT,
                payload: data
            });
        }
        return result;
    };
}

/**
 * 获取对应消息的消息列表
 * @param {string} liveId 直播间Id
 * @param {number} type 类型 1=学员互动; 2=平台通知; 3=平台活动; 4=置顶消息
 * @param {number} page 分页
 */
export function getMessageList(liveId, type, page = 1) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/transfer/h5/live/message/list",
            body: {
                liveId,
                type,
                page: {
                    page: page,
                    size: 20
                }
            }
        });

        if (result.state.code === 0) {
            const data = result.data.messageList;
            dispatch({
                type: GET_MESSAGE_LIST,
                payload: {
                    messageList: data,
                    type
                }
            });
        }
        return result;
    };
}

/**
 * 获取指定消息
 * @param {string} liveId 直播间Id
 */
export function getTopMessage(liveId, page = 1) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/transfer/h5/live/message/list",
            body: {
                liveId,
                type: 4,
                page: {
                    page: page,
                    size: 20
                }
            }
        });

        if (result.state.code === 0) {
            const data = result.data.messageList;
            dispatch({
                type: GET_TOP_MESSAGE,
                payload: {
                    topMessage: data[0]
                }
            });
        }
        return result;
    };
}

/**
 * 读取消息
 * @param {*} liveId 直播间id
 * @param {*} type 消息tab类型
 * @param {*} messageId 消息id
 * @param {*} readType 读取类型
 */
export function readMessage(liveId, type, messageId, readType = "id") {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/transfer/h5/live/message/read",
            body: {
                liveId,
                type,
                messageId,
                readType
            }
        });
        if(result.state.code === 0 && readType === 'id') {
            dispatch({
                type: READ_MESSAGE,
                payload: {
                    type,
                    messageId
                }
            })
        }
        return result;
    };
}

/**
 * 清空tab未读数量
 * @param {number} tabType 消息类型 1：学员互动 2：平台通知 3：平台活动
 */
export function clearTabUnread(tabType) {
    return {
        type: CLEAR_TAB_UNREAD,
        payload: tabType
    };
}

/**
 * 切换tab
 * @param {number} tabKey  tab类型
 */
export function switchTab(tabKey, count, showToast) {
    if (showToast) {
        window.toast(`${count}条未读消息`);
    }
    return {
        type: SWITCH_TAB,
        payload: tabKey
    };
}

export function closeAd() {
    return {
        type: CLOSE_AD
    };
}
