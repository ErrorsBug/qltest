import {
  FETCH_HIGH_BONUS_ITEM,
  FETCH_MODULE_COURSE_LIST,
  FETCH_RECOMMEND_MODULE,
  FETCH_TOP_TEN_COURSE,
  UPDATE_RELAY
} from "../actions/recommend";

let initData = {
    moduleCourseList: {
        list: []
    },
    recommendModule: {
        list: []
    },
    hightBonusItem: {
        list: []
    },
    topTenCourse: {
        list: []
    }
}

export function recommend (state = initData, action) {
    switch (action.type) {
        case FETCH_MODULE_COURSE_LIST:
            return {
                ...state,
                moduleCourseList: action.moduleCourseList
            }
        
        case FETCH_RECOMMEND_MODULE:
            return {
                ...state,
                recommendModule: action.recommendModule,
            }
        
        case FETCH_HIGH_BONUS_ITEM:
            return {
                ...state,
                hightBonusItem: action.hightBonusItem
            }
        
        case FETCH_TOP_TEN_COURSE:
            return {
                ...state,
                topTenCourse: action.topTenCourse
            }

        case UPDATE_RELAY:
            let {channelInfo, list} = action.payload;

            let l = state[list];
            if (list == 'moduleCourseList') {
                return {
                    ...state,
                    [action.payload.list]: {
                        list: l.list.map(courses => {
                            courses.courseList = courses.courseList.map((course) => {
                                if (course.tweetId == channelInfo.tweetId) {
                                    course.isRelay = 'Y',
                                    course.relayChannelId = channelInfo.relayChannelId
                                }
                                return course;
                            })
                            return courses;
                        })
                    }
                }
            } else {
                return {
                    ...state,
                    [action.payload.list]: {
                        ...state[list],
                        list: l.list.map(course => {
                            if (course.tweetId == channelInfo.tweetId) {
                                course.isRelay = 'Y';
                                course.relayChannelId = channelInfo.relayChannelId
                            }
                            return course;
                        }),

                    }
                }
            }
        default: 
            return state
    }
}
