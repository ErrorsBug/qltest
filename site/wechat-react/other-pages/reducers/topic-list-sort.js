import {
    APPEND_TOPIC_SORT_LIST,
    APPEND_TOPIC_SORT_LIST_PAGE,
    CHANGE_TOPIC_SORT_WEIGHT,
} from '../actions/topic-list-sort'

const initState = {
    topicList: [],
    topicPageNum: 1,
    topicPageSize: 30,
};

export function topicListSort (state = initState, action) {

    switch (action.type) {

        case APPEND_TOPIC_SORT_LIST:
            return { ...state, ...{topicList: [...state.topicList, ...action.topicList]},...{state:action} };

        case CHANGE_TOPIC_SORT_WEIGHT:
            return { ...state, ...{topicList: action.topicList}};

        case APPEND_TOPIC_SORT_LIST_PAGE:
            return {...state , ...{topicPageNum:action.topicPageNum} };

        default:
            return state;
    }
}
