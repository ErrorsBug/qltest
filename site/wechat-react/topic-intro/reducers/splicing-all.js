import { 
    INIT_CHANNEL_INFO,
    CHANNEL_MARKET_INTRO
} from '../actions/splicing-all'

const initData = {
    // 拼课基本信息
    channelInfo: {
        channel: {}
    },

    // 拼课信息
    marketInfo: {}
};

export function splicingAll (state = initData, action) {
    switch (action.type) {
        case INIT_CHANNEL_INFO:
            return { ...state, channelInfo: action.initData }
    
        case CHANNEL_MARKET_INTRO:
            return { ...state, marketInfo: action.marketInfo }
        default:
            return state;
    }
}
