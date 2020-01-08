
import {
    INIT_PAGE_DATA,
    UPDATE_COUPON_INFO,
    UPDATE_SELECTED_CHARGE_CONFIG,
    UPDATE_FOLLOW_LIVE,
    FETCH_CONSULT_LIST,
    FETCH_SHARE_LIST,
    UPDATE_CONSULT_PRAISE,
    UPDATE_COLLECT,
    UPDATE_TOPICAUTH,
    INIT_POWER,
    UPDATE_TOPIC_CURRENT_COUPON_INFO,
    UPDATE_TOPIC_COUPON_INFO_ID,
    SELECT_COUPON_INDEX,
    UPDATE_TOPIC_IS_MEMBER_PRICE,
} from '../actions/topic-intro'


var initState = {
    // 用户id
    userId:'',
    // 话题基本数据
    topicInfo: {},
    // 直播间数据
    liveInfo: {
        followNum: 0,
        topicNun:0,
    },
    evaluation: {
        evaluateNum: 0,
        score:0,
    },
    // 话题介绍
    profile:[],

    // --- 优惠券所需数据
    // 话题优惠券列表
    topicCouponList: [],
    // 系列课优惠券列表
    channelCouponList: [],
    // 当前选中的话题优惠券
    curTopicCoupon: null,
    // 当前选中的系列课优惠券
    curChannelCoupon: null,
    // 选中的系列课票价
    curChargeConfig: null,
    // 当前选中的优惠券
    curCoupon: null,

    //分销课代表关系
    myShareQualify:{},

    // 珊瑚计划分销身份
    coral: {},
    // 权限
    power:{},

    // --- 咨询留言数据
    // 咨询留言列表
    consultList: [],
    consultPage: 0,
    consultSize: 20,
    consultNoMore: false,
    consultStatus: '', // pending|success|end

    // 转播信息
    relayConfig: {
        // 是否转播
        isRelay: "N",
        // 分成比例
        profitRatio: 0,
        // 是否想显示转播
        showWelcome: "N",
    },
    // 优惠券下标
    selIdx: 0,
    // 分享榜列表
    shareList: [],
}

export function topicIntro(state = initState, action) {
    switch (action.type) {
        case INIT_PAGE_DATA:
            return {
                ...state,
                ...action.pageData,
            }
        case UPDATE_TOPIC_CURRENT_COUPON_INFO:
            return {
                ...state,
                ...action.couponInfo
            }
        case UPDATE_SELECTED_CHARGE_CONFIG:
            return {
                ...state,
                curChargeConfig: action.chargeConfig
            }
        case UPDATE_FOLLOW_LIVE:
            return {
                ...state,
                isFollow: { ...state.isFollow, isFollow: action.isFollow },
                liveInfo: { ...state.liveInfo , followNum: action.isFollow ? state.liveInfo.followNum + 1 :  state.liveInfo.followNum - 1 }
                
            }
        case FETCH_CONSULT_LIST: 
            if (action.status === 'pending') {
                return {
                    ...state,
                    consultStatus: 'pending'
                }
            }
            return {
                ...state,
                consultList: [...state.consultList, ...action.consultList],
                consultPage: action.page,
                consultSize: action.size,
                consultNoMore: action.noMore,
                consultStatus: action.status, // pending|success|end
            }
        case UPDATE_CONSULT_PRAISE:
            let list = state.consultList.map(item => {
                if (action.id == item.id) {
                    item.isLike = 'Y';
                    item.praise = item.praise + 1;
                }
                return item;
            })
            return {
                ...state,
                consultList: list,
            }
        case FETCH_SHARE_LIST:
            return {
                ...state,
                shareList: action.shareUser
            }
        case UPDATE_COLLECT:
            return {
                ...state,
                isNeedCollect: action.isNeedCollect
            }
        case UPDATE_TOPICAUTH:
            return {
                ...state,
                isAuthTopic: action.topicAuth
            }
	    case INIT_POWER:
		    return {
			    ...state,
			    power: action.power
            }
        case UPDATE_TOPIC_COUPON_INFO_ID:
            if (action.couseType === 'channel') {
                return {
                    ...state,
                    curChannelCoupon: {...state.curChannelCoupon, useRefId: action.useRefId}
                }
            } else {
                return {
                    ...state,
                    curTopicCoupon: {...state.curTopicCoupon, useRefId: action.useRefId}
                }
            }
        case SELECT_COUPON_INDEX:
            return{
                ...state,
                selIdx: action.selIdx
            }
        case UPDATE_TOPIC_IS_MEMBER_PRICE:
            return {
                ...state,
                isMemberPrice: action.isMemberPrice
            }
        default:
            return state;
    }
};
