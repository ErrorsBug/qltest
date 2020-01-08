import {
   SHARE_CARDINFO_VIP,
   SHARE_CARDINFO_CHANNEL
} from '../actions/share-card'

const initState = {
    cardInfo:{}
};

export function shareCardVip (state = initState, action) {
    switch (action.type) {

        case SHARE_CARDINFO_VIP:
            return { 
                ...state,
                cardInfo: action.cardInfo,
            };


        default:
            return state;
    }
}

export function shareCardChannel (state = initState, action) {
    switch (action.type) {

        case SHARE_CARDINFO_CHANNEL:
            return { 
                ...state,
                cardInfo: action.cardInfo,
            };


        default:
            return state;
    }
}

