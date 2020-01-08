import {
    SET_CAMP_INFO,
    SET_CHANNEL_INFO,
    SET_TOPIC_INFO,
    SET_LIVE_INFO,
    SET_NEW_CAMP_INFO,
} from '../actions/connect-course'

var initState = {
    campInfo: {},
    channelInfo: {},
    topicInfo: {},
    liveInfo: {},
}

export function connectCourse (state = initState, action) {
    switch (action.type) {
        // 上传视频
        case SET_CAMP_INFO: 
            return {...state, campInfo: action.campInfo};
        case SET_NEW_CAMP_INFO:
            return {...state, campInfo: action.campInfo};
        case SET_CHANNEL_INFO: 
            return {...state, channelInfo: action.channelInfo};
        case SET_TOPIC_INFO: 
            return {...state, topicInfo: action.topicInfo};
        case SET_LIVE_INFO: 
            return {...state, liveInfo: action.liveInfo};
        default:
            return state
    }
}