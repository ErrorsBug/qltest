import {
    INIT_LIVE_SHARE_QUALIFY,
    INIT_ADMIN_FLAG,
    DISTRIBUTION_INFO,
    LIVE_DISTRIBUTION_INFO,
    TOPIC_DISTRIBUTION_INFO,
    CHANNEL_DISTRIBUTION_INFO
} from "../actions/distribution";

const initData = {
    qlLiveShareQualify: {},
    adminFlag: {}
};

export function distribution(state = initData, action) {
    switch (action.type) {
        case INIT_LIVE_SHARE_QUALIFY:
            return {
                ...state,
                qlLiveShareQualify: action.data
            };

        case INIT_ADMIN_FLAG:
            return {
                ...state,
                adminFlag: action.data
            };

        case DISTRIBUTION_INFO:
            return {
                ...state,
                distributionInfo: action.distributionInfo
            };

        case LIVE_DISTRIBUTION_INFO:
            return {
                ...state,
                liveDistributionInfo: action.liveDistributionInfo
            };

        case TOPIC_DISTRIBUTION_INFO:
            return {
                ...state,
                topicDistributionInfo: action.topicDistributionInfo
            };

        case CHANNEL_DISTRIBUTION_INFO:
            return {
                ...state,
                channelDistributionInfo: action.channelDistributionInfo
            };

        default:
            return state;
    }
}
