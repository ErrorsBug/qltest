/**
 * Created by dylanssg on 2017/6/20.
 */
import {
	INIT_HOMEWORK_INFO,
	INIT_HOMEWORK_POWER,
	SET_HOMEWORK_TITLE,
	SET_HOMEWORK_CONTENT,
	SET_HOMEWORK_AUDIO,
	SET_HOMEWORK_RELATIED_TOPICID,
	SET_HOMEWORK_TARGET,
	INIT_SUBSCRIBE,
} from '../actions/homework'

const initState = {
	info: {
		target: 'all'
	},
	power: {}
};

const ACTION_HANDLERS = {
	[INIT_HOMEWORK_INFO]: (state, action) => {
		return {
			...state,
			info: Object.assign({}, state.info, action.info)}
		},
	[INIT_HOMEWORK_POWER]: (state, action) => {return {...state, power: action.power}},
	[INIT_SUBSCRIBE]: (state, action) => {return {...state, subscribe: action.subscribeInfo}},
	[SET_HOMEWORK_TITLE]: (state, action) => {
		let info = {...state.info};
		info.title = action.title;
		return {...state, info}
	},
	[SET_HOMEWORK_CONTENT]: (state, action) => {
		let info = {...state.info};
		info.content = action.content;
		return {...state, info}
	},
	[SET_HOMEWORK_AUDIO]: (state, action) => {
		let info = {...state.info};
		info.audioList = [action.audio];
		return {...state, info}
	},
	[SET_HOMEWORK_RELATIED_TOPICID]: (state, action) => {
		let info = {...state.info};
		info.topicId = action.topic.topicId;
		info.topicName = action.topic.name;
		return {...state, info}
	},
	[SET_HOMEWORK_TARGET]: (state, action) => {
		let info = Object.assign({}, state.info, {
			target: action.target
		});
		return {...state, info}
	},
};

export function homework (state = initState, action) {

	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state

}
