
import {
    INIT_PAGE_DATA,
    UPDATE_LOCAL_VALUE
} from '../actions/topic-intro-edit'


var initState = {
    // 话题基本数据
    topicInfo: {},
}

export function topicIntroEdit(state = initState, action) {
    switch (action.type) {
        case INIT_PAGE_DATA:
            return {
                ...state,
                ...action.pageData,
            }
        case UPDATE_LOCAL_VALUE:

            let {key, value} = action.payload;

            let {topicInfo} = state;
            topicInfo[key] = value;
            return {
                ...state,
                topicInfo: {
                    ...topicInfo
                }
            }
        default:
            return state;
    }
};
