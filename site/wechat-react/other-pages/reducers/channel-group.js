import { 
    INIT_CHANNEL_GROUP,
    SET_GROUP_PAY_LIST,
} from '../actions/channel-group';

const initData = {
    // 拼课基本信息
    groupInfo: {},

    // 拼课参与人列表
    groupPayList: [],
};

export function channelGroup (state = initData, action) {
    switch (action.type) {
        case INIT_CHANNEL_GROUP:
            return { ...state, groupInfo: action.initData }
    
        case SET_GROUP_PAY_LIST:
            return { ...state, groupPayList: action.list }

        default:
            return state;
    }
}
