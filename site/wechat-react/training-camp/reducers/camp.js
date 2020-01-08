
import {
    INIT_CAMP_INFO,
    INIT_CAMP_COURSE,
    SET_CAMP_COURSE_LIST,
    SET_STU_QUARTER_NUM,
} from '../actions/camp'

const initData = {
    trainCampPo: {},
    recentCourse: [],

    courseList: [],
    courseNoMore: false,
    coursePage: 1,
    
    stuQuarterNum: {
        current: 0,
        max: 0,
    },
};

export function camp (state = initData, action) {
    switch (action.type) {

        case INIT_CAMP_INFO:
            return { ...state, trainCampPo: action.payload };
        case INIT_CAMP_COURSE:
            return { ...state, recentCourse: action.payload.recentTopics };
        case SET_STU_QUARTER_NUM:
            return { ...state, stuQuarterNum: action.payload};
        
        case SET_CAMP_COURSE_LIST:
            const courseList = state.courseList
            typeof action.payload == 'object' && action.payload.map((item) => {
                courseList.push(item)
            })
            return { 
                ...state, 
                courseList: courseList,
                courseNoMore: action.payload && action.payload.length && action.payload.length < 20,
                coursePage: state.coursePage + 1,
            };
        default:
            return state
    }
}
