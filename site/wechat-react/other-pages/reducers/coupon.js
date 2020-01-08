import {
    SET_CHANNEL_DISCOUNT_CODE,
    SET_TOPIC_DISCOUNT_CODE,
    INIT_TOPIC_DISCOUNT_CODE_INFO,
    INIT_TOPIC_DISCOUNT_CODE,
    INIT_CHANNEL_DISCOUNT_CODE_INFO,
    INIT_CHANNEL_DISCOUNT_CODE,
    INIT_VIP_DISCOUNT_CODE_INFO,
    INIT_VIP_DISCOUNT_CODE,
    INIT_SEND_COUPON_INFO,
    INIT_CREATE_COUPON_INFO,
    INIT_COUPON_POWER,
    INIT_COUPON_INFO,
} from '../actions/coupon';


const initState = {
    topicDiscountCodeInfo: {},
    topicDiscountCode: {},
    channelDiscountCodeInfo: {},
    channelDiscountCode: {},
    vipDiscountCodeInfo: {},
    vipDiscountCode: {},
    sendCouponInfo: {},
    createCouponInfo: {}
};

export function coupon(state = initState, action) {
    switch (action.type) {
        case INIT_COUPON_POWER:
            return {
                ...state,
                power: action.power
            };
        // case SET_TOPIC_DISCOUNT_CODE:
        //     return {
        //         ...state,
        //         topicDiscountCode: action.topicDiscountCode
        //     };
        case INIT_TOPIC_DISCOUNT_CODE_INFO:
            return {
                ...state,
                topicDiscountCodeInfo: action.topicDiscountCodeInfo
            };
        case INIT_TOPIC_DISCOUNT_CODE:
            return {
                ...state,
                topicDiscountCode: action.topicDiscountCode
            };
        case INIT_CHANNEL_DISCOUNT_CODE_INFO:
            return {
                ...state,
                channelDiscountCodeInfo: action.channelDiscountCodeInfo
            };
        case INIT_CHANNEL_DISCOUNT_CODE:
            return {
                ...state,
                channelDiscountCode: action.channelDiscountCode
            };
        case INIT_VIP_DISCOUNT_CODE_INFO:
            return {
                ...state,
                vipDiscountCodeInfo: action.vipDiscountCodeInfo
            };
        case INIT_VIP_DISCOUNT_CODE:
            return {
                ...state,
                vipDiscountCode: action.vipDiscountCode
            };
        case INIT_SEND_COUPON_INFO:
            return {
                ...state,
                sendCouponInfo: action.sendCouponInfo,
            };
        case INIT_CREATE_COUPON_INFO:
            return {
                ...state,
                initCreateCouponInfo: action.initCreateCouponInfo
            };
        case INIT_COUPON_INFO:
            return {
                ...state,
                couponInfo: action.couponInfo
            };
        default:
            return state;
    }
}

