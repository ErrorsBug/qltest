import {
    UPDATE_REPRINT_CHANNEL_LIST,
    CLEAR_REPRINT_CHANNEL_LIST,
    UPDATE_CHANNEL_TYPES,
    UP_OR_DOWN_SHELF,
    DELETE_COURSE,
} from '../actions/reprint'

const initData = {
    /* 转载系列课列表 */
    reprintChannelList: [],

    /* 系列课分类列表 */
    channelTypes: [],
};

export function reprint(state = initData, action) {
    switch (action.type) {

        case UPDATE_REPRINT_CHANNEL_LIST:
            return {
                ...state,
                reprintChannelList: [...action.list]
            };

        case CLEAR_REPRINT_CHANNEL_LIST:
            return {
                ...state,
                reprintChannelList: [],
            };
        
        case UPDATE_CHANNEL_TYPES:
            return {
                ...state,
                channelTypes: action.list,
            }    
        
        case UP_OR_DOWN_SHELF:
            return {
                ...state,
                reprintChannelList: state.reprintChannelList.map(item => {
                    if (item.id === action.id) {
                        item.upOrDown = action.upOrDown
                    }
                    return item
                })
            }    

        case DELETE_COURSE:
            return {
                ...state,
                reprintChannelList: state.reprintChannelList.filter(item => {
                    return item.id !== action.id
                })
            }    

        default:
            return state
    }
}
