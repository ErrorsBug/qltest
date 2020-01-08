import {
    UPDATE_QUESTION_LIST,
} from '../actions/my-question'

const initState = {
    /* 问题列表 */
    questionList: [],
}

const actionHandle = {
    [UPDATE_QUESTION_LIST]: (state, action) => {
        console.log(action)
        return { ...state, questionList: action.data, }
    },
}

export function myQuestion(state = initState, action) {
    const handle = actionHandle[action.type]
    return handle ? handle(state, action) : state
}
