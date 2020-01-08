import {
    APPEND_CHANNEL_SORT_LIST,
    APPEND_CHANNEL_SORT_LIST_PAGE,
    CHANGE_CHANNEL_SORT_WEIGHT,
} from '../actions/channel-list-sort'

const initState = {
    channelList: [],
    channelPageNum: 1,
    channelPageSize: 30,
};

export function channelListSort (state = initState, action) {

    switch (action.type) {

        case APPEND_CHANNEL_SORT_LIST:
            return { ...state, ...{channelList: [...state.channelList, ...action.channelList]} };

        case CHANGE_CHANNEL_SORT_WEIGHT:
            return { ...state, ...{channelList: action.channelList} };

        case APPEND_CHANNEL_SORT_LIST_PAGE:
            return {...state , ...{channelPageNum:action.channelPageNum} };

        default:
            return state;
    }
}
