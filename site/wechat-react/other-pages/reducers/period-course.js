import {
    INIT_PERIOD_COURSE_LIST,
    INIT_PERIOD_COURSE_INFO,
    INIT_PERIOD_SHARE_CARD,
    INIT_PERIOD_TABS,
	ADD_CLOCK_IN_TIME
} from '../actions/recommend'

const initState = {
    periodData:[],
    periodInfo: {},
    periodId:0,
    periodCardInfo:{},
    subscribeStatus:'',
    bigLabels: [],
    bigTags:[],
    smLabels:[],
};

export function periodCourse (state = initState, action) {
    switch (action.type) {
        case INIT_PERIOD_COURSE_LIST:
            return { ...state,periodId:action.periodData.periodId, periodData: [...state.periodData, action.periodData]};
        
        case INIT_PERIOD_SHARE_CARD:
            return {
                ...state,
                periodCardInfo: action.periodCardInfo
            };
        case INIT_PERIOD_TABS:
            return {
                ...state,
                subscribeStatus: action.status,
                hasMy: action.hasMy,
                bigLabels: action.bigLabels,
                bigTags:action.bigTags,
                smLabels:action.smLabels,
            };
        case INIT_PERIOD_COURSE_INFO:
            return {
                ...state,
                periodInfo: action.periodInfo
            };
        case ADD_CLOCK_IN_TIME:
            return {
                ...state,
	            periodInfo: Object.assign({}, state.periodInfo, {
		            isSignIn: 'Y',
		            signInNum: state.periodInfo.signInNum + 1
                })
            };
        default:
            return state;
    }
}
