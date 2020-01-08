
import { 
    GIFT_PACKAGE_INFO,
} from '../actions/exclusive-gift-package';

const initData = {
    giftPackage:{},
};

export function exclusiveGiftPackage (state = initData, action) {
    switch (action.type) {
        case GIFT_PACKAGE_INFO:
            return { ...state, giftPackage: action.info }

        default:
            return state;
    }
}
