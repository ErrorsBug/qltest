import { 
    SET_UNOPENED_GROUPS,
    SET_OPENED_GROUPS,
    SET_LIVEID,
} from '../actions/channel-group-list';

const initState = {
    // 未开启的拼课列表
    unopenedGroups: [],
    // 已开启的拼课列表
    openedGroups: [],
    // 直播间id
    liveId: '',
};

export function channelGroupList (state = initState, action) {
    switch (action.type) {
        case SET_UNOPENED_GROUPS:
            return { ...state, unopenedGroups: action.unopenedGroups };
        case SET_OPENED_GROUPS:
            // console.log(action.openedGroups);
            return { ...state, openedGroups: action.openedGroups };
        case SET_LIVEID:
            return { ...state, liveId: action.liveId };
        default:
            return state;
    }
}

