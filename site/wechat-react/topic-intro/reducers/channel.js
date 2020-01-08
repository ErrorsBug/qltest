import {
    INIT_CHANNEL_INFO,
    IS_CHANNEL_BLACK,
    CHANNEL_CHARGE_STATUS,
    IS_CHANNEL_SUBSCRIBE,
    IS_CHANNEL_FOLLOWTHIRD,
    IS_CHANNEL_BINDTHIRD,
    IS_CHANNEL_SHOWQL,
    CHANNEL_LIVE_ROLE,
    CHANNEL_CHARGE_CONFIGS,
    INIT_CHANNEL_PAY_USER_COUNT,
    INIT_CHANNEL_PAY_USER_IMAGES,
    CHANNEL_VIP_INFO,
    CHANNEL_IS_LIVE_FOCUS,
    CHANNEL_DESC,
    FETCH_CHANNEL_COURSE_LIST,
    SET_CHANNEL_COURSE_PAGE_NUM,
    CHANNEL_INIT_POWER,
    CHANNEL_UPDATE_COURSE_DATA,
    CHANNEL_REMOVE_COURSE,
    CHANNEL_INIT_CHANNEL_SATUS,
    CHANNEL_SHARE_KEY,
    MY_SHARE_QUALIFY,
    SET_CHANNEL_INFO,
    SET_CHANNEL_DISCOUNT_CODE,
    OPEN_AUTO_SHARE,
    CHANNEL_GROUPING_LIST,
    CHANNEL_GROUP_INFO,
    CHANNEL_GROUP_INFO_SELF,
    INIT_CHANNEL_MARKETSET_INFO,
    INIT_CHANNEL_COUPONSET_INFO,
    UPDATE_ORDER_NOW_STATUS,
    UPDATE_COUPON_INFO,
    CHANGE_TOPIC_DISPLAY,
	CHANNEL_QL_SHARE_KEY,
    CHANNEL_CORAL_IDENTITY,
    INIT_CUT_COURSE_INFO,//砍价
    INIT_DISCOUNT_EXTENDPO,
} from '../actions/channel';

import {
    SET_CONSULT_LIST,
    SET_CONSULT_PRAISE,
} from '../actions/consult'

const initState = {
    // 系列课基本信息
    channelInfo: {},
    // 是否被拉黑
    isBlack: '',
    // 付费状态
    chargeStatus: null,
    // 是否关注公众号
    isSubscribe: false,
    // 是否关注三方平台
    isFocusThree: false,
    // 直播间是否绑定三方平台
    isBindThird: false,
    // 直播间白名单
    isShowQl:false,
    // （直播间）角色权限
    liveRole: '',
    // 系列课收费配置
    chargeConfigs: [],
    // 付费用户数量
    payUserCount: 0,
    // 付费用户图片列表
    payUserHeadImages: [],
    // vip信息
    vipInfo: {},
    // 是否关注直播间
    isLiveFocus: false,
    //拼课列表
    groupingList:{},
    //拼课详情
    groupInfo:{},

    groupInfoSelf:{},


    // 系列课简介
    desc: {},
    // 课程列表
    courseList: [],
    // 课程列表分页数据
    coursePageNum: 1,
    coursePageSize: 20,
    // 用户权限
    power: {},
    // 优惠码使用状态,
    channelSatus: {},
    // 千聊直通车shareKey
	qlshareKey: '',
    // 官方课代表分成比例
	coralPercent: '',
    // 系列课是否开启自动分销
    isOpenShare:'N',

    consultList: [],
    // 是否立即下单
    orderNow: false,
    courseCutInfo:{},

    //分销课代表
    myShareQualify:{},
};

export function channel (state = initState, action) {
    switch (action.type) {
        case INIT_CHANNEL_INFO:
            return { ...state, channelInfo: action.channelInfo};
        case IS_CHANNEL_BLACK:
            return {...state, isBlack: action.isBlack};
        case CHANNEL_CHARGE_STATUS:
            return {...state, chargeStatus: action.chargeStatus};
        case IS_CHANNEL_SUBSCRIBE:
            return {...state, isSubscribe: action.isSubscribe};
        case IS_CHANNEL_FOLLOWTHIRD:
            return {...state, isFocusThree: action.isFocusThree};
        case IS_CHANNEL_BINDTHIRD:
            return { ...state, isBindThird: action.isBindThird };
        case IS_CHANNEL_SHOWQL:
            return { ...state, isShowQl: action.isShowQl };
        case CHANNEL_LIVE_ROLE:
            return {...state, liveRole: action.liveRole};
        case CHANNEL_CHARGE_CONFIGS:
            return {...state, chargeConfigs: action.chargeConfigs};
        case INIT_CHANNEL_PAY_USER_COUNT:
            return {...state, payUserCount: action.payUserCount};
        case INIT_CHANNEL_PAY_USER_IMAGES:
            return {...state, payUserHeadImages: action.payUserHeadImages};

        case INIT_CHANNEL_MARKETSET_INFO:
            return {...state, marketsetInfo: action.marketsetInfo};
        case INIT_CHANNEL_COUPONSET_INFO:
            return {...state, couponsetInfo: action.couponsetInfo};

        case CHANNEL_VIP_INFO:
            return {...state, vipInfo: action.vipInfo};
        case CHANNEL_IS_LIVE_FOCUS:
            return {...state, isLiveFocus: action.isLiveFocus};
        case CHANNEL_DESC:
            return {...state, desc: action.desc};
        case SET_CHANNEL_COURSE_PAGE_NUM:
            return { ...state, coursePageNum: action.coursePageNum};

        case FETCH_CHANNEL_COURSE_LIST:
            return { ...state, courseList: [...state.courseList, ...action.courseList]};
        case CHANNEL_INIT_POWER:
            return {...state, power: action.power};
        case CHANNEL_UPDATE_COURSE_DATA:
            return {...state, courseList: state.courseList.map((item) => {
                if (item.id == action.id) {
                    return {...item, ...action.courseData};
                }
                return item;
            })};
        case CHANNEL_REMOVE_COURSE:
            return {...state, courseList: state.courseList.filter((item) => {
                if (item.id === action.id) {
                    return false;
                }

                return true;
            })};
        case CHANNEL_INIT_CHANNEL_SATUS:
            // 接口返回字段不统一，这里冗余couponId和couponType
            action.channelSatus = action.channelSatus || {};
            action.channelSatus.couponId = action.channelSatus.codeId;
            action.channelSatus.couponType = action.channelSatus.codeType;
            
            return {...state, channelSatus: action.channelSatus};

        case CHANNEL_SHARE_KEY:
            return {...state, cshareKey: action.cshareKey};

        case MY_SHARE_QUALIFY:
            return {...state, myShareQualify: action.myShareQualify};


	    case CHANNEL_QL_SHARE_KEY:
		    return {...state, qlshareKey: action.qlshareKey};

	    case CHANNEL_CORAL_IDENTITY:
		    return { ...state, coralPercent: action.percent, isPersonCourse: action.isPersonCourse };

        case SET_CHANNEL_INFO:
            return {
                ...state,
                channelInfo: action.channelInfo,
            };

        case SET_CHANNEL_DISCOUNT_CODE:
            return {
                ...state,
                channelDiscountCode: action.channelDiscountCode
            };

        case OPEN_AUTO_SHARE:
            return {
                ...state,
                isOpenShare: action.isOpenShare
            };


        case CHANNEL_GROUPING_LIST:
            return {
                ...state,
                groupingList:action.groupingList,
            };

        case CHANNEL_GROUP_INFO:
            return {
                ...state,
                groupInfo:action.groupInfo,
            };

        case CHANNEL_GROUP_INFO_SELF:
            return {
                ...state,
                groupInfoSelf:action.groupInfoSelf,
            };

        case SET_CONSULT_LIST:
            return {
                ...state,
                consultList: action.consultList,
            };
        case SET_CONSULT_PRAISE:
            return {
                ...state,
                consultList: state.consultList.map((val, index) => {
                    if (val.id === action.id) {
                        return { ...val, isLike: 'Y', praise: val.praise+1 }
                    }
                    return val
                }),
            };
        case INIT_CHANNEL_INFO:
            return {
                ...state,
                channelInfo: action.channelInfo
            }
        case UPDATE_ORDER_NOW_STATUS:
            return {
                ...state,
                orderNow: action.status,
            }
        case UPDATE_COUPON_INFO:
            return {
                ...state,
                channelSatus: {
                    ...state.channelSatus,
                    isHaveCoupon: true,
                    qlCouponMoney: action.qlCouponMoney,
                    couponId: action.couponId,
                    couponType: action.couponType,
                    minMoney: action.minMoney,
                }
            };
        case CHANGE_TOPIC_DISPLAY:
            return {
                ...state,
                courseList: state.courseList.map(item => {
                    return {
                        ...item,
                        displayStatus: action.topicId == item.id ? action.displayStatus : item.displayStatus
                    }
                })
            };
        case INIT_CUT_COURSE_INFO:
            return { ...state, courseCutInfo: action.courseCutInfo };
        case INIT_DISCOUNT_EXTENDPO:
            return { ...state, discountExtendPo: action.discountExtendPo };
        default:
            return state;
    }
}
