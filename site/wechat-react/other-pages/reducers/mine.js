import {
	INIT_MINE_LIVE_DATA,
    INIT_MINE_WALLET
} from '../actions/mine'

const initState = {
	liveData: {},
    walletData: {},
};

export function mine (state = initState, action) {
    switch (action.type) {
        case INIT_MINE_LIVE_DATA:

            return { ...state, liveData: action.liveData};
        case INIT_MINE_WALLET:

            return {...state, walletData: action.walletData};
        default:
            return state;
    }
}
