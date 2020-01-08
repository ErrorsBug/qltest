import {
    UPDATE_COURSE_LIST,
    CLEAR_COURSE_LIST,
    UPDATE_COURSE_TAG_LIST,
    UPDATE_CHANNEL_TYPES,
    SET_REPRINT_INFO,
    SET_PROMOTION_INFO,
} from '../actions/course'

const initData = {
    /* 系列课列表 */
    courseList: [],

    /* 系列课分类列表 */
    channelTypes: [],
    
    /* 课程标签列表 */
    tagList: [],

    reprintChannelInfo: {
        tweetId: null,
        reprintLiveId: null,
        reprintLiveName: null,
        reprintChannelId: null,
        reprintChannelName: null,
        reprintChannelImg: null,
        reprintChannelAmount: null,
        reprintChannelDiscount: null,
        selfMediaPercent: null,
        selfMediaProfit: null,
        index: null,
        discountStatus: null,
        chargeMonths: null,
    },

    promotionData: {
        shareUrl: null,
        percent: null,
        data: {
            businessImage: null,
            businessId: null,
            businessName: null,
            amount: null,
        }
    }
};

export function course(state = initData, action) {
    switch (action.type) {

        case UPDATE_COURSE_LIST:
            return {
                ...state,
                courseList: [...action.list]
                //list: state.list.concat(action.list),
            };

        case CLEAR_COURSE_LIST:
            return {
                ...state,
                courseList: [],
            };
        
        case UPDATE_COURSE_TAG_LIST:
            return {
                ...state,
                tagList: action.list,
            };
        
        case UPDATE_CHANNEL_TYPES:
            return {
                ...state,
                channelTypes: action.list,
            }    
        case SET_REPRINT_INFO: 
            return  {
                ...state,
                reprintChannelInfo: {...action.info}
            }
        case SET_PROMOTION_INFO:
            return {
                ...state,
                promotionData:{ ...state.promotionData , ...action.pomotionData}
            }
        default:
            return state
    }
}
