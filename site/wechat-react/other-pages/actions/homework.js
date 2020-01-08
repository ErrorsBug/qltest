/**
 * Created by dylanssg on 2017/6/20.
 */
import { api } from './common';

export const INIT_HOMEWORK_INFO = 'INIT_HOMEWORK_INFO';
export const INIT_HOMEWORK_POWER = 'INIT_HOMEWORK_POWER';
export const INIT_SUBSCRIBE = 'INIT_SUBSCRIBE';
export const SET_HOMEWORK_TITLE = 'SET_HOMEWORK_TITLE';
export const SET_HOMEWORK_RELATIED_TOPICID = 'SET_HOMEWORK_RELATIED_TOPICID';
export const SET_HOMEWORK_AUDIO = 'SET_HOMEWORK_AUDIO';
export const SET_HOMEWORK_CONTENT = 'SET_HOMEWORK_CONTENT';
export const SET_HOMEWORK_TARGET = 'SET_HOMEWORK_TARGET';
export const GET_MINE_ANSWERD_HOMEWORK = 'GET_MINE_ANSWERD_HOMEWORK';


export function initHomeworkInfo (info) {
	console.log(info, 'info')
	return {
		type: INIT_HOMEWORK_INFO,
		info
	}
}

export function initSubscribeInfo(subscribeInfo) {
	return {
		type: INIT_SUBSCRIBE,
		subscribeInfo
	}
}

export function initHomeworkPower (power) {
	return {
		type: INIT_HOMEWORK_POWER,
		power
	}
}

export function setHomeworkTitle(title) {
	return (dispatch, getStore) => {

		dispatch({
			type: SET_HOMEWORK_TITLE,
			title
		});

	};
}

export function setHomeworkContent(content) {
	return (dispatch, getStore) => {

		dispatch({
			type: SET_HOMEWORK_CONTENT,
			content
		});

	};
}

export function setHomeworkAudio(audio) {
	return (dispatch, getStore) => {

		dispatch({
			type: SET_HOMEWORK_AUDIO,
			audio
		});

	};
}

export function setHomeworkRelatedCourse(topic) {
	return (dispatch, getStore) => {

		dispatch({
			type: SET_HOMEWORK_RELATIED_TOPICID,
			topic
		});

	};
}

export function setHomeworkTarget(target) {
	return (dispatch, getStore) => {

		dispatch({
			type: SET_HOMEWORK_TARGET,
			// all=所有用户,topic=报名话题的用户
			target
		});

	};
}


export function getTopicListByChannel(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/homework/getTopicListByChannel',
			body: params
		});

		return result;
	};
}

export function saveHomework(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/save',
			body: params
		});

		return result;
	};
}

export function getArrangedList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/homework/getArrangedList',
			body: params
		});

		return result;
	};
}

export function getAnsweredList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/homework/getAnsweredList',
			body: params
		});

		return result;
	};
}

export function saveAnswer(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/saveAnswer',
			body: params
		});

		return result;
	};
}

export function getMineAnsteredHomework(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/getAnsweredList',
			body: params,
		});

		if (result.state.code == 0) {
			return result;
		} 

		// if (result.state.code != 200) {
		// 	return result;
		// } else {
		// 	if (typeof cb == "function") {
		// 		cb(cbParams)
		// 	}
		// 	return result;
		// }
	};
}

export function getMyAnsweredList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/homework/getMyAnsweredList',
			body: params
		});

		return result;
	};
}

export function like(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/like',
			body: params
		});

		return result;
	};
}

export function essence(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/channel/camp/answer/setPrime',
			body: params
		});

		return result;
	};
}

export function getMyAnswer(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/homework/getMyAnswer',
			body: params
		});

		return result;
	};
}

export function deleteHomework(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/deleteHomework',
			body: params
		});

		return result;
	};
}

export function deleteAnswer(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/deleteAnswer',
			body: params
		});

		return result;
	};
}

export function deleteComment(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/deleteComment',
			body: params
		});

		return result;
	};
}

export function addComment(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/addComment',
			body: params
		});

		return result;
	};
}

export function fetchGetQr(channel, liveId, channelId, topicId ,toUserId, showQl) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/get-qr',
            body: {
                channel, 
                liveId, 
                channelId, 
                topicId ,
                toUserId ,
				showQl
            }
        });

        return result;
    };
}

export function getMaxPushCount(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/homework/getMaxPushCount',
			body: params
		});

		return result;
	};
}

export function pushHomework(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/homework/pushHomework',
			body: params
		});

		return result;
	};
}



/**
 * 获取允许交作业状态
 *
 * @export
 * @param {string} topicId
 * @returns
 */
export function getAnswerAuth(topicId) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/homework/addAnswerAuth',
			method: 'POST',
			showLoading: true,
			body: {
				topicId
			}
		});

		return result;
	};
};

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


/**
 * 根据channelId获取期数信息
 * @export
 * @param {*} campId
 * @returns
 */
export async function getPeriodByChannel(channelId) {
	return await api({
		showLoading: true,
		url: '/api/wechat/channel/currentPeriod',
		body: {
			channelId
		},
		method: 'POST',
	});
}


/**
 *
 * 用户当天打卡状态
 * @export
 * @param {*} params
 * @returns
 */
export async function fetchCampAffairStatus(params) {
	return await api({
		showLoading: true,
		method: 'POST',
		url: '/api/wechat/training/getAffairStatus',
		body: params
	});
}