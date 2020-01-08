import { api } from './common';
import { getVal } from 'components/util';

export const GET_USER_COMMENT_LIST = 'GET_USER_COMMENT_LIST';
export const GET_USER_COURSE_EVAL_LIST = 'GET_USER_COURSE_EVAL_LIST';



/**
 * @param {string} businessType 红点类型 bCommentList=课程评论详情红点 cCommentList=c端评论列表红点 cReplyList=c端回复列表红点
 * @param {array} businessIds 
 */
export function cleanCommentRedDot(businessType, businessIds) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/comment/cleanCommentRedDot',
            body: {
                businessType,
                businessIds,
            }
        });
    };
};

/**
 * 获取音视频图文评论列表
 *
 * @export
 * @param {string} topicId
 * @param {string} type
 */
export function getGraphicCommentList({ businessId, time, page, size, position = 'before' }){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/topic/discussList',
			body: { businessId, time, page, size, position },
			method: 'POST',
		});

		return result;
	}
}

/**
 * 添加音视频图文新评论
 *
 * @export
 * @param {string} channelId
 * @param {string} type
 */
export function addGraphicComment({ businessId, content, parentId = 0, type = 'videoGraphic', playTime}){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			url: '/api/wechat/topic/addDiscuss',
			body: { businessId, content, parentId, type, playTime },
			method: 'POST',
		});

		return result;
	}
}




/**
 * 获取c端用户的评论列表
 */
export function getUserCommentList(isContinue) {
    return async (dispatch, getStore) => {
		const commentList = getVal(getStore(), 'messages.commentList');
		if (commentList.status === 'pending'
			|| commentList.status === 'end' && isContinue
		) return;

		let page = {...commentList.page};
		page.page = isContinue && commentList.data ? page.page + 1 : 1;

		dispatch({
			type: GET_USER_COMMENT_LIST,
			data: {
				status: 'pending'
			}
		});
        const result = await api({
            dispatch,
            getStore,
			showLoading: false,
			errorResolve: true,
            method: 'POST',
            url: '/api/wechat/comment/getUserCommentList',
            body: {
                page,
            }
        }).then(res => {
			if (res.state.code) throw Error(res.state.msg);

			let list = res.data.comments || [];
			return {
				status: list.length < page.size ? 'end' : 'success',
                data: isContinue ? commentList.data.concat(list) : list,
				page,	
			}
		}).catch(err => {
			return {
				status: 'error',
				message: err.message,
			}
		})

		dispatch({
			type: GET_USER_COMMENT_LIST,
			data: result
		});

		return result;
    };
};



/**
 * 获取未评价课程列表
 */
export function getUserCourseEvalList(isContinue) {
    return async (dispatch, getStore) => {
		const courseEvalList = getVal(getStore(), 'messages.courseEvalList');
		if (courseEvalList.status === 'pending'
			|| courseEvalList.status === 'end' && isContinue
		) return;

		let page = {...courseEvalList.page};
		page.page = isContinue ? page.page + 1 : 1;

		dispatch({
			type: GET_USER_COURSE_EVAL_LIST,
			data: {
				status: 'pending'
			}
		});
        const result = await api({
            dispatch,
            getStore,
			showLoading: false,
			errorResolve: true,
            method: 'POST',
            url: '/api/wechat/mine/unevaluated',
            body: {
                page,
            }
        }).then(res => {
			if (res.state.code) throw Error(res.state.msg);

			let list = res.data.topicList || [];
			return {
				status: list.length < page.size ? 'end' : 'success',
                data: isContinue ? courseEvalList.data.concat(list) : list,
				page,	
			}
		}).catch(err => {
			return {
				status: 'error',
				message: err.message,
			}
		})

		dispatch({
			type: GET_USER_COURSE_EVAL_LIST,
			data: result
		});

		return result;
    };
};