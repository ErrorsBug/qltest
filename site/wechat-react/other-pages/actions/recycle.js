import {api} from './common'

export async function getTopicList(params) {
	const result = await api({
		url: '/api/wechat/live/getTopic',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function getChannelList(params) {
	const result = await api({
		url: '/api/wechat/live/getChannel',
		body: {...params, isCamp: "N", tagId: ""},
		method: 'POST'
	});
	return result;
}

export async function getCampList(params) {
	const result = await api({
		url: '/api/wechat/checkInCamp/campList',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function getNewCampList(params) {
	const result = await api({
		url: '/api/wechat/training/listCamp',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function hideTopic(params) {
	const result = await api({
		url: '/api/wechat/channel/hide-topic',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function hideChannel(params) {
	const result = await api({
		url: '/api/wechat/channel/changeDisplay',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function hideNewCamp(params) {
	const result = await api({
		url: '/api/wechat/training/updateCampStatus',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function hideCamp(params) {
	const result = await api({
		url: '/api/wechat/checkInCamp/campDisplay',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function deleteChannel(params) {
	const result = await api({
		url: '/api/wechat/channel/delete',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function deleteNewCamp(params) {
	const result = await api({
		url: '/api/wechat/training/deleteCamp',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function deleteCamp(params) {
	const result = await api({
		url: '/api/wechat/checkInCamp/deleteCamp',
		body: {...params},
		method: 'POST'
	});
	return result;
}

export async function endTopic(params) {
	const result = await api({
		url: '/api/wechat/topic/end-topic',
		body: {...params},
		method: 'GET'
	});
	return result;
}

export async function deleteTopic(params) {
	const result = await api({
		url: '/api/wechat/channel/delete-topic',
		body: {...params},
		method: 'GET'
	});
	return result;
}

//http://m.test2.qlchat.com/api/wechat/topic/end-topic?topicId=2000000300850003
//http://m.test2.qlchat.com/api/wechat/channel/delete-topic?topicId=2000000300850005
//http://localhost:5689/api/wechat/channel/delete-topic?topicId=2000000300850005
//http://localhost:5689/api/wechat/topic/delete-topic?topicId=2000000300850003
//http://localhost:5689/api/wechat/channel/delete-topic?topicId=2000000300850024
