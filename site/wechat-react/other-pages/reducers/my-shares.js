import {
    APPEND_MY_SHARE_LIVE,
    APPEND_MY_SHARE_TOPIC,
    APPEND_MY_SHARE_CHANNEL,
} from '../actions/my-shares'

const initState = {
    liveShareList:[],
    topicShareList:[],
    channelShareList:[],
};

export function myShareList (state = initState, action) {
    switch (action.type) {

        case APPEND_MY_SHARE_LIVE:
            return { 
                ...state,
                liveShareList: state.liveShareList.concat(action.myShareList),
            };
        case APPEND_MY_SHARE_TOPIC:
            return { 
                ...state,
                topicShareList: state.topicShareList.concat(action.myShareList),
            };
        case APPEND_MY_SHARE_CHANNEL:
            return {
                ...state,
                channelShareList: state.channelShareList.concat(action.myShareList),
            };


        default:
            return state;
    }
}
