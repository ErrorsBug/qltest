import { 
    INIT_TRAINING_DATA,
    INIT_CAMP_PAGE_DATA,
    INIT_CAMP_TOPIC_MAP,
    INIT_PERIOD_CAHNNEL,
    INIT_CAMP_USER,
    INIT_AFFAIR_MAP,
    INIT_USER_AFFAIR,
    INIT_USER_REWORD,
} from '../actions/training'

let initState = {
    campInfo: {},
    topicMap: [],
    periodChannel: {},
    userInfo: {},
    affairMap: {}, // 用户打卡 补卡 有课
    userAffairInfo: {}, // 用户打卡信息
    userReword: [], // 用户打卡奖励
}

// 训练营详情
export function training (state = initState, action) {
    switch (action.type) {
        case INIT_TRAINING_DATA:
            return {
                ...state,
                ...action.data
            }
        case INIT_CAMP_PAGE_DATA:
            return { 
                ...state, 
                campInfo: action.campInfo 
        }
        case INIT_CAMP_TOPIC_MAP:
            return { 
                ...state, 
                topicMap: action.topicMap 
            }
        case INIT_PERIOD_CAHNNEL:
            return { 
                ...state, 
                periodChannel: action.periodChannel
            }
        case INIT_CAMP_USER:
            return { 
                ...state, 
                userInfo: action.campUserPo
            }
        case INIT_AFFAIR_MAP:
            return { 
                ...state, 
                affairMap: action.affairMap
            }
        case INIT_USER_AFFAIR:
            return { 
                ...state, 
                userAffairInfo: action.affairInfo
            }
        case INIT_USER_REWORD:
            return { 
                ...state, 
                userReword: action.userReword
            }
        default:
            return state;
    }
}

