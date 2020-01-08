import {
    UPDATE_PROFIT_OVERVIEW,
    UPDATE_PROFIT_RECORDS,
    UPDATE_PROFIT_RECORD_CHANNEL,
    UPDATE_PROFIT_RECORD_TOPIC,
    UPDATE_PROFIT_DETAIL_CHANNEL,
    INIT_PAGE_DATA,

    CLEAR_PROFIT_OVERVIEW,
    CLEAR_PROFIT_RECORDS,
    CLEAR_PROFIT_RECORD_CHANNEL,
    CLEAR_PROFIT_RECORD_TOPIC,
    CLEAR_PROFIT_DETAIL_CHANNEL,
    CLEAR_MEDIA_PROFIT_RECORDS,

    UPDATE_PROFIT_RECORD_TECHNO_CHANNEL,
    UPDATE_CHANNEL_DETAIL,
    UPDATE_MEDIA_PROFIT_RECORDS,

    UPDATE_PROFIT_DISPLAYSTATUS,

    UPDATE_PROFIT_RECOMMEND_CHANNEL,
    UPDATE_PROFIT_RECOMMEND_TOPIC,
    UPDATE_PROFIT_RECOMMEND_TOTAL
} from '../actions/profit'

const initState = {
    // 总收益
    total: null,
    // 已提现金额
    withdrawn: null,
    // 可提现金额
    deposit: null,
    // 待结算金额
    checking: null,
    // 是否显示公对公打款
    isShowKey: false,

    // 收益流水
    records: [],
    recordsPage: 1,
    recordsSize: 20,
    recordTotal: null,
    recordChecking: null,

    // 收益列表
    recordChannel: [],
    recordTopic: [],
    technoChannel: [],

    pageNum: 1,
    pageSize: 20,

    pageTechnoNum: 1,
    pageTechnoSize:20,



    // 收益详情
    detailChannel: [],
    detailChannelPage: 1,
    detailChannelSize: 20,

    // 单个系列课详情
    channelName: '',
    channelId: '',
    channelImg: '',
    chargeconfigList: {},
    sharePercent: '',

    // 单个系列课的媒体投放受益流水
    mediaProfitRecords: [],

    // 千聊推荐 分页
    recommendTotal: {},
    recommendChannelList: [],
    recommendTopicList: [],
    recommendChannelPage: 1,
    recommendChannelSize: 20,
    recommendTopicPage: 1,
    recommendTopicSize: 20,
};

export function profit(state = initState, action) {
    switch (action.type) {
        case INIT_PAGE_DATA:
            return {
                ...state,
                ...action.pageData,
            }
        case UPDATE_PROFIT_OVERVIEW:
            return {
                ...state,
                total: action.totalMoney,
                withdrawn: action.withdrawalsMoney,
                deposit: action.balanceMoney,
                checking: action.beAccountBalance,
                isShowKey: action.isShowKey,
                displayStatus: action.displayStatus
            }

        case UPDATE_PROFIT_RECORDS:
            return {
                ...state,
                records: state.records.concat(action.list),
                recordsPage: state.recordsPage + 1,
                recordTotal: action.totalIncome,
                recordChecking: action.beAccountMoney,
            }

        case UPDATE_PROFIT_RECORD_CHANNEL:
            return {
                ...state,
                recordChannel: state.recordChannel.concat(action.channelList),
            }
        
        case UPDATE_PROFIT_RECORD_TECHNO_CHANNEL:
            return {
                ...state,
                technoChannel: state.technoChannel.concat(action.knowledgeList),
            }

        case UPDATE_PROFIT_RECORD_TOPIC:
            return {
                ...state,
                recordTopic: state.recordTopic.concat(action.topicList),
            }

        case UPDATE_PROFIT_DETAIL_CHANNEL:
            return {
                ...state,
                detailChannel: state.detailChannel.concat(action.list),
                detailChannelPage: state.detailChannelPage + 1,
            }

        case CLEAR_PROFIT_OVERVIEW:
            return {
                ...state,
                total: null,
                withdrawn: null,
                deposit: null,
                checking: null,
                isShowKey: false,
            }

        case CLEAR_PROFIT_RECORDS:
            return {
                ...state,
                records: [],
                recordsPage: 1,
            }

        case CLEAR_PROFIT_RECORD_CHANNEL:
            return {
                ...state,
                recordChannel: [],
                pageNum: 1,
                currentTimeMillis: null,
            }

        case CLEAR_PROFIT_RECORD_TOPIC:
            return {
                ...state,
                recordTopic: [],
                pageNum: 1,
                currentTimeMillis: null,
            }

        case CLEAR_PROFIT_DETAIL_CHANNEL:
            return {
                ...state,
                detailChannel: [],
                detailChannelPage: 1,
            }
        case UPDATE_CHANNEL_DETAIL:
            return {
                ...state,
                channelId: action.channelDetail.channelId,
                channelName: action.channelDetail.channelName,
                channelImg: action.channelDetail.channelImg,
                chargeconfigList: {...action.channelDetail.chargeconfigList},
                sharePercent: action.channelDetail.mySharePercent,
                chargeType: action.channelDetail.chargeType,
            }
        case UPDATE_MEDIA_PROFIT_RECORDS:
            return {
                ...state,
                mediaProfitRecords: state.mediaProfitRecords.concat(action.mediaProfitRecords),
            }
        case CLEAR_MEDIA_PROFIT_RECORDS:
            return {
                ...state,
                mediaProfitRecords: [],
            }
        case UPDATE_PROFIT_DISPLAYSTATUS:
            return {
                ...state,
                displayStatus: action.displayStatus
            }
        case UPDATE_PROFIT_RECOMMEND_CHANNEL:
            return {
                ...state,
                recommendChannelList: state.recommendChannelList.concat(action.list),
            }
        case UPDATE_PROFIT_RECOMMEND_TOPIC:
            return {
                ...state,
                recommendTopicList: state.recommendTopicList.concat(action.list),
            }
        case UPDATE_PROFIT_RECOMMEND_TOTAL:
            return {
                ...state,
                recommendTotal: action.data,
            }
        default:
            return state;
    }
}
