import {
    GET_UNREAD_COUNT,
    CLEAR_TAB_UNREAD,
    SWITCH_TAB,
    GET_MESSAGE_LIST,
    GET_TOP_MESSAGE,
    CLOSE_AD,
    READ_MESSAGE
} from "common_actions/notice-center";

const initState = {
    currentTabKey: null,
    unreadMap: {
        //消息类型 1：学员互动 2：平台通知 3：平台活动
        "1": 0,
        "2": 0,
        "3": 0
    },
    pageMap: {
        "1": 1,
        "2": 1,
        "3": 1
    },
    // messageList 为 Object，因为不同type的list后端数据以键值对形式返回
    messageList: {
        "1": {
            data: [],
            page: 1,
            nomore: false,
            none: false
        },
        "2": {
            data: [],
            page: 1,
            nomore: false,
            none: false
        },
        "3": {
            data: [],
            page: 1,
            nomore: false,
            none: false
        }
    },
    // 置顶消息
    topMessage: {},
    showAd: false
};

export function noticeCenter(state = initState, action) {
    switch (action.type) {
        case GET_UNREAD_COUNT:
            return { ...state, unreadMap: action.payload };

        case CLEAR_TAB_UNREAD:
            const originUnread = JSON.parse(JSON.stringify(state.unreadMap));
            originUnread[action.payload] = 0;
            return { ...state, unreadMap: originUnread };

        case SWITCH_TAB:
            return { ...state, currentTabKey: action.payload };

        case GET_MESSAGE_LIST:
            /**
             * 非常恶心，待优化
             * Immutable.js了解一下？
             */
            return {
                ...state,
                messageList: {
                    ...state.messageList,
                    [action.payload.type]: {
                        data: state.messageList[
                            action.payload.type
                        ].data.concat(action.payload.messageList),
                        page: state.messageList[action.payload.type].page + 1,
                        none:
                            state.messageList[action.payload.type].data.length +
                                action.payload.messageList.length ===
                            0,
                        nomore: action.payload.messageList.length < 20
                    }
                }
            };

        case GET_TOP_MESSAGE:
            return {
                ...state,
                topMessage: action.payload.topMessage,
                showAd: true
            };

        case CLOSE_AD:
            return {
                ...state,
                showAd: false
            };
        case READ_MESSAGE:
            const originList = state.messageList[action.payload.type];
            originList.data.forEach(item => {
                if (item.id === action.payload.messageId) {
                    item.isRead = "Y";
                }
            });
            return {
                ...state,
                messageList: {
                    ...state.messageList,
                    [action.payload.type]: originList
                }
            };
        default:
            return state;
    }
}
