
import { 
    NIGHT_ANSWER_INTRO,
    NIGHT_ANSWER_SHOW,
    SET_NIGHT_ANSWER_SHOW_PAGE_NUM,
    FETCH_NIGHT_ANSWER_SHOW_LIST,
    SET_NIGHT_ANSWER_ANSWER_LIST,
} from '../actions/night-answer';

const initData = {
    nightAnswerAudioInfo:{},
    nightAnswerShow: [],
    audioAnswerList: [],
    pageNum: 1,
    pageSize: 20,
};

export function nightAnswer (state = initData, action) {
    switch (action.type) {
        case NIGHT_ANSWER_INTRO:
            return { ...state, nightAnswerAudioInfo: action.audioInfo }
        case SET_NIGHT_ANSWER_ANSWER_LIST:
            return { ...state, audioAnswerList: action.answer }
        case NIGHT_ANSWER_SHOW:
            return {...state, nightAnswerShow: action.nightAnswerShow}
        case SET_NIGHT_ANSWER_SHOW_PAGE_NUM:
            return { ...state, pageNum: action.pageNum };
        case FETCH_NIGHT_ANSWER_SHOW_LIST:
            const newList = action.nightAnswerShow ? action.nightAnswerShow : [];
            return { ...state, ...{nightAnswerShow: [...state.nightAnswerShow, ...newList]} };
        default:
            return state;
    }
}
