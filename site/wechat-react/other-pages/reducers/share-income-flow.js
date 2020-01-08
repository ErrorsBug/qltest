import {
    APPEND_SHARE_INCOMEFLOW,
    APPEND_INCOME_SHARE_LIST_TOPIC,
    APPEND_INCOME_SHARE_LIST_CHANNEL,
    APPEND_INCOME_SHARE_LIST_VIP,

    APPEND_INCOME_SHARE_DETAIL_TOPIC,
    APPEND_INCOME_SHARE_DETAIL_TOPIC_INFO,
    APPEND_INCOME_SHARE_DETAIL_VIP,
    APPEND_INCOME_SHARE_DETAIL_VIP_INFO,
    APPEND_INCOME_SHARE_DETAIL_CHANNEL,
    APPEND_INCOME_SHARE_DETAIL_CHANNEL_INFO,
} from '../actions/share-income-flow'

const initState = {
    shareFlowList:[],
    shareIncomeListTopic:[],
    shareIncomeListChannel:[],
    shareIncomeListVip:[],
    shareIncomeDetailTopic:[],
    shareIncomeDetailTopicInfo:{},
    shareIncomeDetailChannel:[],
    shareIncomeDetailChannelInfo:{},
    shareIncomeDetailVip:[],
    shareIncomeDetailVipInfo:{},
};

export function ShareIncomeFlow (state = initState, action) {
    switch (action.type) {

        case APPEND_SHARE_INCOMEFLOW:
            return {
                ...state,
                ...{shareFlowList: [...state.shareFlowList, ...action.shareFlowList]}
            };
        case APPEND_INCOME_SHARE_LIST_TOPIC:
            return {
                ...state,
                ...{shareIncomeListTopic: [...state.shareIncomeListTopic, ...action.shareIncomeListTopic]}
            };
        case APPEND_INCOME_SHARE_LIST_CHANNEL:
            return {
                ...state,
                ...{shareIncomeListChannel: [...state.shareIncomeListChannel, ...action.shareIncomeListChannel]}
            };
        case APPEND_INCOME_SHARE_LIST_VIP:
            return {
                ...state,
                ...{shareIncomeListVip: [...state.shareIncomeListVip, ...action.shareIncomeListVip]}
            };
        case APPEND_INCOME_SHARE_DETAIL_TOPIC_INFO:
            return {
                ...state,
                ...{shareIncomeDetailTopicInfo: action.shareEanringInfo}
            };
        case APPEND_INCOME_SHARE_DETAIL_TOPIC:
            return {
                ...state,
                ...{shareIncomeDetailTopic: [...state.shareIncomeDetailTopic, ...action.shareEanring]}
            };
        case APPEND_INCOME_SHARE_DETAIL_CHANNEL_INFO:
            return {
                ...state,
                ...{shareIncomeDetailChannelInfo: action.shareEanringInfo}
            };
        case APPEND_INCOME_SHARE_DETAIL_CHANNEL:
            return {
                ...state,
                ...{shareIncomeDetailChannel: [...state.shareIncomeDetailChannel, ...action.shareEanring]}
            };
        case APPEND_INCOME_SHARE_DETAIL_VIP_INFO:
            return {
                ...state,
                ...{shareIncomeDetailVipInfo: action.shareEanringInfo}
            };
        case APPEND_INCOME_SHARE_DETAIL_VIP:
            return {
                ...state,
                ...{shareIncomeDetailVip: [...state.shareIncomeDetailVip, ...action.shareEanring]}
            };



        default:
            return state;
    }
}
