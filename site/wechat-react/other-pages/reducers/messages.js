import {
    GET_USER_COMMENT_LIST,
    GET_USER_COURSE_EVAL_LIST,
} from 'common_actions/messages';



export function messages(state = {}, action) {
    return {
        commentList: commentList(state.commentList, action),
        courseEvalList: courseEvalList(state.courseEvalList, action),
    }
}



function commentList(state = {
    status: '',
    data: null,
    page: {size: 10},
}, action) {
    if (action.type === GET_USER_COMMENT_LIST) {
        return {
            ...state,
            ...action.data
        };
    }

    return state;
}



function courseEvalList(state = {
    status: '',
    data: null,
    page: {size: 10},
}, action) {
    if (action.type === GET_USER_COURSE_EVAL_LIST) {
        return {
            ...state,
            ...action.data
        };
    }
    
    return state;
}