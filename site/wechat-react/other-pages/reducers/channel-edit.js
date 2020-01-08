
import { 
    CHANNEL_MARKET_INTRO,
} from '../actions/channel-market';

const initData = {
    channelMarketInfo:{},
};

export function channelMarket (state = initData, action) {
    switch (action.type) {
        case CHANNEL_MARKET_INTRO:
            return { ...state, channelMarketInfo: action.marketInfo }

        default:
            return state;
    }
}
