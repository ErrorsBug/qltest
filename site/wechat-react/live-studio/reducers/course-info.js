
import {
    INIT_TOPIC_DATA,
    INIT_CHANNEL_DATA,
    INIT_CAMP_DATA,
} from '../actions/course-info'


var initState = {
    // 话题基本数据
    topicInfo: null,
    // 系列课基本数据
    channelInfo: null,
    // 训练营基本数据
    campInfo: null
}

export function courseInfo(state = initState, action) {
    switch (action.type) {
        case INIT_TOPIC_DATA:
            return {
                ...state,
                topicInfo: {...action.pageData}
            }
        case INIT_CHANNEL_DATA:
            return {
                ...state,
                channelInfo: {...action.pageData}
            }
        case INIT_CAMP_DATA: 
            return {
                ...state,
                campInfo: {...action.pageData}
            }
        default:
            return state;
    }
};
