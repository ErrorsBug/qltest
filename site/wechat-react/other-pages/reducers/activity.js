import {

} from '../actions/mine'

import {
    INIT_ADDRESS_PERMISSIO,
    INIT_MY_ADDRESS_INFO,
    INIT_ADDRESS_FONT_OBJECT
} from '../actions/activity-common'

const initState = {
    addressInfo: {name: "", phone: "", address: ""},
    addressPermission: "N",
    addressFontObject: { 
        topFont: "",
        bottomFont: "",
        blankFont: "",
        maxGiveNum: 0,
    }
};

export function activity (state = initState, action) {
    switch (action.type) {  
        case INIT_ADDRESS_PERMISSIO:
            return { ...state, addressPermission: action.data};
        case INIT_MY_ADDRESS_INFO:
            return { ...state, addressInfo: action.data};
        case INIT_ADDRESS_FONT_OBJECT:
            return { ...state, addressFontObject: action.data};
        
        default:
            return state;
    }
}