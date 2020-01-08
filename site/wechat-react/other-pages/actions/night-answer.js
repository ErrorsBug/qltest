
import { api } from './common';

export const NIGHT_ANSWER_INTRO = 'NIGHT_ANSWER_INTRO';
export const NIGHT_ANSWER_SHOW = 'NIGHT_ANSWER_SHOW';
export const SET_NIGHT_ANSWER_SHOW_PAGE_NUM = 'SET_NIGHT_ANSWER_SHOW_PAGE_NUM';
export const FETCH_NIGHT_ANSWER_SHOW_LIST = 'FETCH_NIGHT_ANSWER_SHOW_LIST';
export const SET_NIGHT_ANSWER_ANSWER_LIST = 'SET_NIGHT_ANSWER_ANSWER_LIST';


export function initNightAnswer (audioInfo) {
    return {
        type: NIGHT_ANSWER_INTRO,
        audioInfo
    }
}
export function nightAnswerShowList (nightAnswerShow) {
    return {
        type: NIGHT_ANSWER_SHOW,
        nightAnswerShow
    }
}
export function setPageNum (pageNum) {
    return {
        type: SET_NIGHT_ANSWER_SHOW_PAGE_NUM,
        pageNum
    }
};
export function getInitAnswer (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            url: '/api/wechat/night-answer/getInitAnswer',
            body: {
                topicId
            }
        });
        dispatch(getAnswerList(result.data.list||{}));
        return result.data.list;
    }
};
export function getAnswerList (answer) {
    return {
        type: SET_NIGHT_ANSWER_ANSWER_LIST,
        answer
    }
};
// 获取初始音频信息
export function getInitAudio(topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: '/api/wechat/night-answer/getTopicInfo',
            body: {
                topicId
            }
        });
        dispatch(initNightAnswer(result.data.topic||{}));

        return result.data.topic;
    };
};
// 获取下一页话题
export function fetchShowList (page, size, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            method: "POST",
            url: '/api/wechat/night-answer/fetchShowList',
            body: {
                page,
                size,
            }
        });
        dispatch({
            type: FETCH_NIGHT_ANSWER_SHOW_LIST,
            nightAnswerShow: result.data.list || []
        });

        dispatch(setPageNum(page));

        return result.data.list
    }
};
//获取夜答话题
export function fetchFirstShowList (page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            url: '/api/wechat/night-answer/fetchShowList',
            body: {
                page,
                size,
            }
        });
        return result.data.list
    }
};
export function getCommentList (topicId,pageSize,pageNum){
    return async (dispatch,getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            url: '/api/wechat/night-answer/getCommentList',
            body: {
                topicId,
                pageNum,
                pageSize
            }
        });
        return result.data
    }
};
export function getUserInfo (){
    return async (dispatch,getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            url: '/api/wechat/night-answer/getUserInfo',
        });
        return result.data.user
    }
};
export function addComment (topicId,content){
    return async (dispatch,getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            url: '/api/wechat/night-answer/addComment',
            body: {
                topicId,
                content
            }
        });
        return result
    }
};
//点赞
export function like (businessId,businessType,status){
    return async (dispatch,getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: "POST",
            url: '/api/wechat/night-answer/like',
            body: {
                businessId,
                businessType,
                status
            }
        });
        if(result.state.code === 0){
            return true
        }
    }
};





