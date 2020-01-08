import { api } from './common';
import { getVal } from 'components/util';

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const ACTIVE_IMAGE = 'ACTIVE_IMAGE';
export const UPDATE_IMAGE_LIST = 'UPDATE_IMAGE_LIST';
export const ADD_AUDIO = 'ADD_AUDIO';
export const DELETE_AUDIO = 'DELETE_AUDIO';
export const MOVE_AUDIO = 'MOVE_AUDIO';
export const TOTAL_SECOND = 'TOTAL_SECOND';
export const ADD_TEXT_CONTENT = 'ADD_TEXT_CONTENT';
export const INIT_DATA = 'INIT_DATA';

// 将上传的图片存到store
export function pushImage(imgList, init = false){
    return (dispatch, getStore) => {
        dispatch({
            type: UPLOAD_IMAGE,
            imgList,
            init
        })
    }
}

// 存储当前选中的照片的信息
export function saveActiveImage(img){
    return (dispatch, getStore) => {
        dispatch({
            type: ACTIVE_IMAGE,
            img
        })
    }
}

// 更新store里面的imageList
export function updateImageList(_type, index){
    return (dispatch, getStore) => {
        dispatch({
            type: UPDATE_IMAGE_LIST,
            _type,
            index
        })
    }
}

// 增加录音
export function addAudio(audioObj, init = false){
    return (dispatch, getStore) => {
        dispatch({
            type: ADD_AUDIO,
            audioObj,
            init
        })
    }
}

// 删除录音
export function deleteAudio(index){
    return (dispatch, getStore) => {
        dispatch({
            type: DELETE_AUDIO,
            index
        })
    }
}

// 移动录音位置
export function moveAudio(move, index){
    return (dispatch, getStore) => {
        dispatch({
            type: MOVE_AUDIO,
            move,
            index
        })
    }
}

// 计算录音总长
export function computeTotalSecond(second, init = false){
    return (dispatch, getStore) => {
        dispatch({
            type: TOTAL_SECOND,
            second,
            init
        })
    }
}

// 增加文字描述
export function addText(text, init = false){
    return (dispatch, getStore) => {
        dispatch({
            type: ADD_TEXT_CONTENT,
            text,
            init,
        })
    }
}

// 获取数据（node端）
export function initData(data){
    return {
        type: INIT_DATA,
        data
    }
}

// 初始化数据（浏览器端）
export function uploadData(data){
    return (dispatch, getStore) => {
        dispatch({
            type: INIT_DATA,
            data,
        })
    }
}


/** 视频列表相关 */

//获取视频列表
export function getVideoList(liveId, bOrC, pageSize, pageNum){
    return async (dispatch, getStore) => {
		const result = await api({
            dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/short/videoList',
			body: {
                liveId,
                bOrC,
                page: {
                    page: pageNum,
                    size: pageSize
                }
			}
		});
		return result;
	};
    
}

//删除短知识
export function deleteKnowledge(params){
    return async (dispatch, getStore) => {
		const result = await api({
            dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/short/delete',
			body: params
		});
		return result;
	};
    
}

//获取短知识
export function getKnowledge(params){
    return async (dispatch, getStore) => {
		const result = await api({
            dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/short/getKnowledgeInfo',
			body: params
		});
		return result;
	};
    
}

//获取评论 
export function getKnowledgeComment(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/short/getKnowledgeComment',
            body: params
        });
        return result;
    };
}


// 添加评论
export function addKnowledgeComment(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/short/addKnowledgeComment',
            body: params
        });
        return result;
    };
}

// 获取点赞信息 
export function getLike(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/likesList',
            body: params
        });
        return result;
    };
}

//取消点赞 
export function cancelLikeIt(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/cancelLikes',
            body: params
        });
        return result;
    };
}


// 点赞 
export function addLikeIt(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/likes',
            body: params
        });
        return result;
    };
}

// 获取是否已关注直播间
// /api/wechat/channel/is-live-focus
export function isFocusLive(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'GET',
            showLoading: false,
            url: '/api/wechat/channel/is-live-focus',
            body: params
        });
        return result;
    };
}

// 关注直播间
export function fetchFocusLive(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'GET',
            showLoading: false,
            url: '/api/wechat/channel/live-focus',
            body: params
        });
        return result;
    };
}

//按类型统计 
export function setStatNum(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/short/statNum',
            body: params
        });
        return result;
    };
}


export function setCommentHideStatus(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/short/setCommentHideStatus',
            body: params
        });
        return result;
    };
}

export function getWatchRecord(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/short/getWatchRecord',
            body: params
        });
        return result;
    };
}