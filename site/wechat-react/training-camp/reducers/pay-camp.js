
import {
    INIT_PAY_INFO
} from '../actions/camp'

const initData = {
    initPayInfo: {}
};

export function payCamp (state = initData, action) {
    switch (action.type) {

        case INIT_PAY_INFO:
            return { ...state, initPayInfo:action.payload };

        default:
            return state
    }
}
