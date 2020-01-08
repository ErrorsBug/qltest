import { api, request } from './common';
import {
	locationTo,
	getVal,
} from 'components/util';
import {
	setIsLiveAdmin,
} from './common';

export const INIT_THOUSAND_LIVE_TOPIC_INFO = 'INIT_THOUSAND_LIVE_TOPIC_INFO';
export const INIT_POWER = 'INIT_POWER';
export const ADD_FORUM_SPEAK = 'ADD_FORUM_SPEAK';
export const INIT_PAGE_DATA = 'INIT_PAGE_DATA';
export const ADD_DEL_SPEAK = 'ADD_DEL_SPEAK';
export const THOUSAND_LIVE_SET_LSHARE_KEY = 'THOUSAND_LIVE_SET_LSHARE_KEY';



// 初始化话题信息
export function initTopicInfo (topicInfo) {
	return {
		type: INIT_THOUSAND_LIVE_TOPIC_INFO,
		topicInfo
	}
}

export function addForumSpeakList (totalSpeakList) {
	return {
		type: ADD_FORUM_SPEAK,
		totalSpeakList
	}
}

export function addDelSpeakIdList (delSpeakIdList) {
	return {
		type: ADD_DEL_SPEAK,
		delSpeakIdList
	}
}

export function initPageData (pageData) {
	return {
		type: INIT_PAGE_DATA,
		pageData
	}
}

/**
 * 设置用户分销关系
 */
export function setLshareKey(lshareKey) {
	return {
		type: THOUSAND_LIVE_SET_LSHARE_KEY,
		lshareKey,
	};
}

// 是否畅听直播间
// export function getIsOrNotListen(params) {
//     return async (dispatch, getStore) => {
//         const result = await api({
//             dispatch,
//             getStore,
//             showLoading: false,
//             method: 'POST',
//             url: '/api/wechat/live/isOrNotListen',
//             body: {
//                 ...params
//             }
//         })
//         return result;
//     }
// }

// 获取媒体vid
export function fetchMediaUrl(topicId, sourceTopicId) {
    const params = {
        topicId
    }
    if (sourceTopicId && sourceTopicId !== topicId) {
        params.topicId = sourceTopicId
        params.relayTopicId = topicId
    }
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/media-url',
			method: 'GET',
			showLoading: false,
			body: params
		})

		return result;
	};
}

// 获取媒体真实地址
export function getMediaActualUrl(topicId, sourceTopicId) {
    const params = {
        topicId
    }
    if (sourceTopicId && sourceTopicId !== topicId) {
        params.topicId = sourceTopicId
        params.relayTopicId = topicId
    }
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/getMediaActualUrl',
			method: 'POST',
			showLoading: false,
			body: params
		});
		if (getVal(result, 'state.code') !== 0) {
			try {
				typeof _qla != 'undefined' && _qla('commonlog', {
					logType: 'error',
					category:'videoUrlError',
					event:'videoUrlError',
					data:JSON.stringify(result),
					urlParams:JSON.stringify(params)
				});
			} catch (error) {
			}
		}
		return result;
	};
}

//获取系列课课程列表
export function fetchCourseList({channelId, liveId, pageNum = 1, pageSize = 100 }) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/topic-list',
			body: {
				channelId,
				liveId,
				clientType: 'weixin',
				pageNum,
				pageSize,
			}
		});
		return result;
	};
}

//收藏
export function addCollect({businessId, type}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			method: 'POST',
			url: '/api/wechat/mine/addCollect',
			body: {
				businessId,
				type
			}
		});
		return result;
	};
}

//取消收藏
export function cancelCollect({businessId, type}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			method: 'POST',
			url: '/api/wechat/mine/cancelCollect',
			body: {
				businessId,
				type
			}
		});
		return result;
	};
}

//是否已收藏
export function isCollected({businessId, type}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/mine/isCollected',
			body: {
				businessId,
				type
			}
		});
		return result;
	};
}

//获取话题简介
export function getTopicProfile({topicId}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/topic/profile',
			body: {
				topicId
			}
		});
		return result;
	};
}

//极简页初始化数据获取
export function initSimpleModeData({topicId}) {
	return async (dispatch, getStore) => {
		const result = await request({
			url: '/api/wechat/video/initSimpleModeData',
			method: 'POST',
			body: {
				topicId
			}
		});

		const liveId = getVal(result, 'topicInfo.data.topicPo.liveId', null);
		const topicPo = getVal(result, 'topicInfo.data.topicPo', {});
		const power = getVal(result, 'power.data.powerEntity', null);
		const isKickOut = getVal(result, 'isKickOutRes.data.status');
		const topicExtendPo = getVal(result, 'topicInfo.data.topicExtendPo');

		if (isKickOut === true) {
			locationTo(`/wechat/page/link-not-found?type=topicOut&liveId=${liveId}`);
			return false;
		}

		// 话题已被删除
		if (topicPo.status === 'delete' || !topicPo.status) {
			locationTo(`/wechat/page/link-not-found?type=topic&liveId=${liveId}`);
			return false;
		}

		if (!getVal(result, 'topicAuth.data.isAuth', null)) {
			locationTo(`/wechat/page/topic-intro?topicId=${topicId}`);
			return false;
		}

		const initData = {
			sid: result.sid,
			power,
			isFollow: getVal(result, 'isFollow.data.isFollow', ''),
			liveInfo: getVal(result, 'liveInfo.data', {}),
			fromWhere: 'first',
			currentUserId: result.userId,
			browseNum: topicPo.browseNum,
			userId:result.userId,
			isLogin:true
		};

		dispatch(initTopicInfo({...topicPo, ...topicExtendPo}));
		dispatch(initPageData(initData));
		dispatch(setLshareKey(getVal(result, 'lShareKey.data.shareQualify', {}) || {}));
		dispatch(setIsLiveAdmin(getVal(result, 'isLiveAdmin.data', {}) || {}));

		console.log(result);
		return result;
	};
}

/*获取是否已评价*/
export function getEvaluationStatus(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/getStatus',
			body: params
		});


		// dispatch(initStatus(lo.get(result,'data.evaluateStatus','N')));

		return result;
	}
}

/*查看是否可评价*/
export function getIsEvaluable({topicId}){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/evaluation/isEvaluable',
			body: {
				topicId
			}
		});


		return result;
	}
}

/*获取是否开启了评论*/
export function getIsOpenEvaluate({liveId}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'GET',
			showLoading: false,
			url: '/api/wechat/evaluation/getIsOpenEvaluate',
			body: {
				liveId
			}
		});
		// if (result && result.state && result.state.code == 0) {
		// 	dispatch(initIsOpenEvaluate(result.data.isOpenEvaluate));
		// }

		return result;
	};
}

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
 * 评论点赞
 *
 * @export
 * @param {string} channelId
 * @param {string} type
 */
export function likeComment({ discussId, status = 'Y' }){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			url: '/api/wechat/topic/discussLike',
			body: {
				discussId,
				status,
			},
			method: 'POST',
		});

		return result;
	}
}

/**
 * 获取授权状态
 *
 * @export
 * @param {string} topicId
 * @returns
 */
export function getAuth(topicId) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/auth',
			method: 'GET',
			showLoading: false,
			body: {
				topicId
			}
		});

		return result;
	};
};

/**
 * 获取评论总数
 *
 * @export
 * @param {string} businessId
 * @returns
 */

export function graphicCommentCount({ businessId }){
	return async (dispatch, getStore) => {
		return await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/commentCount',
			method: 'POST',
			showLoading: false,
			body: {
				businessId
			}
		});
	};
}

/**
 * 获取富文本介绍页
 * 
 * @export 
 * @param {string} businessId
 * @param {string} type
 */

 export function getEditorSummary(businessId, type) {
	 return async (dispatch, getStore) => {
		 return await api({
			 dispatch,
			 getStore,
			 url: '/api/wechat/ueditor/getSummary',
			 method: 'POST',
			 showLoading: false,
			 showWarningTips: false,
			 errorResolve: true,
			 body: {
				 businessId,
				 type
			 }
		 })
	 }
 }


// 判断用户是否加入训练营
export async function getJoinCampInfo(params){
	const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/channel/joinCampInfo',
		body: params
	});
	return result;
}

/* 话题学习记录 */
export async function studyTopic(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/studyTopic',
        body: params
    });
}