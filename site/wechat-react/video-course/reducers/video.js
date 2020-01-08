import {
	INIT_THOUSAND_LIVE_TOPIC_INFO,
	INIT_POWER,
	ADD_FORUM_SPEAK,
	INIT_PAGE_DATA,
	ADD_DEL_SPEAK,
} from '../actions/video';

import {
	THOUSAND_LIVE_SET_LSHARE_KEY,
	SET_IS_LIVE_ADMIN,
} from '../actions/common';

const initState = {
	sid: '',
	// 话题基本数据
	topicInfo: {},
	// 用户权限
	power: {
		allowSpeak:false,
		allowMGLive :false,
		allowDelComment:false,
	},
	//发言列表数据（当前显示的发言列表）
	forumSpeakList: [],
	lshareKey: {},
};

const ACTION_HANDLERS = {
	[INIT_THOUSAND_LIVE_TOPIC_INFO]: (state, action) => {
		return {
			...state,
			topicInfo: action.topicInfo,
		}
	},
	[INIT_POWER]: (state, action) => {
		return {
			...state,
			power: {...state.power, ...action.parmas},
		}
	},
	[ADD_FORUM_SPEAK]: (state, action) => {
		const totalSpeakList = [...action.totalSpeakList];
		let forumSpeakList = state.forumSpeakList.length === 0 ? totalSpeakList : state.forumSpeakList;

		return {
			...state,
			totalSpeakList,
			forumSpeakList: totalSpeakList.slice(state.curSpeakIndex, state.curSpeakIndex + forumSpeakList.length+1)
		}
	},
	[ADD_DEL_SPEAK]: (state, action) => {
		return {
			...state,
			delSpeakIdList: action.delSpeakIdList
		}
	},
	[INIT_PAGE_DATA]: (state, action) => {
		return {
			...state,
			...action.pageData,
		}
	},
	[THOUSAND_LIVE_SET_LSHARE_KEY]: (state, action) => {
		return {
			...state,
			lshareKey: action.lshareKey,
		}
	},
	[SET_IS_LIVE_ADMIN]: (state, action) => {
		return {
			...state,
			isLiveAdmin: action.data.isLiveAdmin,
			liveAdminOverDue: action.data.liveAdminOverDue,
		}
	},
};

export function video (state = initState, action) {

	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state

}
