import {
    APPEND_CHANNEL_DISTRIBUTION_SETINFO,
    APPEND_CHANNEL_DISTRIBUTION_INDEX_LIST,
    APPEND_CHANNEL_DISTRIBUTION_LIST,
    CHANGE_REPRESENT_STATUS,
    DISTRIBUTION_INFO,
	APPEND_CHANNEL_DISTRIBUTION_SYSINFO
} from '../actions/channel-distribution'

const initState = {
    channelAutoDistributionInfo:{},
    channelDistributionIndexList: [],
    channelDistributionList: [],
    channelDistributionInfo: {},
	channelDistributionShareKey:''
};

export function channelDistribution (state = initState, action) {
    switch (action.type) {

        case APPEND_CHANNEL_DISTRIBUTION_SETINFO:
            return { ...state, ...{channelAutoDistributionInfo: action.distributionInfo}};

        case APPEND_CHANNEL_DISTRIBUTION_INDEX_LIST:
            return { ...state, ...{channelDistributionIndexList: action.distributionIndexList}};

        case APPEND_CHANNEL_DISTRIBUTION_LIST:
            return { ...state, ...{channelDistributionList: action.distributionList}};
        
        case DISTRIBUTION_INFO:
            return { ...state, ...{channelDistributionInfo: action.distributionInfo}};

        case APPEND_CHANNEL_DISTRIBUTION_SYSINFO:
            return { ...state, shareSysInfo: action.shareSysInfo };

        default:
            return state;
    }
}

export function changeRepresentStatus (state = {}, action) {
    switch (action.type) {

        case CHANGE_REPRESENT_STATUS:
            return { ...state, ...{representStatus: action.representStatus}};

        default:
            return state;
    }
}


