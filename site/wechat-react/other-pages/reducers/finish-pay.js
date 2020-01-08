import {APPEND_FINISH_PAY_DATA} from '../actions/finish-pay';

export const finishPayData = function (state = {
    type: '',
    id: '',
    shareKey: null,
    lShareKey: null,
    isOpenShare: null,
    paster: '',
    courseName: '',
    payAmount: '',
}, action) {
    switch (action.type) {
        case APPEND_FINISH_PAY_DATA: 
            return {...state, ...action.finishPayData};
        default: 
            return state;
    }
}