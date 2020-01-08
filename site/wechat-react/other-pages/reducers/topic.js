import {
    // SET_TOPIC_INFO,
    INIT_TOPIC_INFO,
    APPEND_TOPIC_DISTRIBUTION_LIST
} from '../actions/topic';

var initState = {
    // sessionId
    sid: '',
    // 话题基本数据
    topicInfo: {},
    topicDistributionList: [],
}

export function topic(state = initState, action) {
    switch (action.type) {
        case INIT_TOPIC_INFO:
            return {
                ...state,
                topicInfo: action.topicInfo
            }
        case APPEND_TOPIC_DISTRIBUTION_LIST:
            return { ...state, ...{topicDistributionList: action.distributionList}}

        default:
            return state;
    }
};
