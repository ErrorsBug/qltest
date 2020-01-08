import {
    GET_GENERAL_VIP_INFO,
    GET_CUSTOM_VIP_INFO,
} from '../actions/vip'



export function vip(state = {}, action) {
    return {
        generalVip: generalVip(state.generalVip, action),
        customVip: customVip(state.customVip, action),
    }
}



function generalVip(state = {
    status: '',
    data: null,
    message: '',
}, action) {
    switch (action.type) {
        case GET_GENERAL_VIP_INFO:
            return {
                ...state,
                ...action.data
            };

        default:
            return state;
    }
}



function customVip(state = {
    status: '',
    data: null,
    message: '',
}, action) {
    switch (action.type) {
        case GET_CUSTOM_VIP_INFO:
            return {
                ...state,
                ...action.data
            };

        default:
            return state;
    }
}
