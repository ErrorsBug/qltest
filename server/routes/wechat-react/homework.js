/**
 * Created by dylanssg on 2017/6/23.
 */
import lo from 'lodash';

import {
	initUserInfo,
} from '../../../site/wechat-react/other-pages/actions/common';
import {
	initHomeworkInfo,
	initHomeworkPower,
	initSubscribeInfo,
} from '../../../site/wechat-react/other-pages/actions/homework';

import homeworkApi from '../../api/wechat/homework';
import topicApi from '../../api/wechat/topic';
import { render } from 'react-dom';

// homeworkApi.getSubscribe

export async function initInfo(req, res, store) {
	try{
		store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));
		if(req.query.kfAppId && req.query.kfOpenId ) {
			homeworkApi.userBindKaiFang({
				kfAppId: req.query.kfAppId,
				kfOpenId: req.query.kfOpenId,
				userId: lo.get(req, 'rSession.user.userId', '')
			}, req);
		}
		if(req.query.id){

			//获取作业详情
			let result = await homeworkApi.getInfo({
				id: req.query.id,
				userId: lo.get(req, 'rSession.user.userId', '')
			}, req);
			if(lo.get(result, 'homeworkInfo.state.code', '') !==  0){
				res.redirect(`e//wechat/paghomework/error?liveId=${lo.get(result, 'homeworkInfo.data.liveId', '')}`);
				return false;
			}

			// 如果作业类型是考试、题目的
			if (lo.get(result, 'homeworkInfo.data.type', 'default') !==  'default') {
				res.redirect(`/wechat/page/homework-exam?id=${req.query.id}&topicId=${lo.get(result, 'homeworkInfo.data.topicId')}`);
				return false;
			}

			store.dispatch(initHomeworkInfo(lo.get(result, 'homeworkInfo.data', {})));

			//获取直播间权限
			let power = await homeworkApi.getPower({
					topicId: lo.get(result, 'homeworkInfo.data.topicId'),
					liveId: lo.get(result, 'homeworkInfo.data.liveId', ''),
					userId: lo.get(req, 'rSession.user.userId', '')
				}, req);

			store.dispatch(initHomeworkPower(lo.get(power, 'power.data.powerEntity', {})));

			//详情页获取二维码弹出信息
			if(req.url.match('details')){
				let subscribe = await homeworkApi.getSubscribe({
					liveId: lo.get(result, 'homeworkInfo.data.liveId', ''),
					userId: lo.get(req, 'rSession.user.userId', '')
				}, req);

				store.dispatch(initSubscribeInfo(lo.get(subscribe, 'isSubscribe.data', '')))
			}

		}else{
			store.dispatch(initHomeworkInfo({
				...lo.get(req, 'query', {}),
				target: 'all'
			}));
		}
	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function initManage(req, res, store) {
	try{
		store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));

		const userId = lo.get(req, 'rSession.user.userId', '');
		let liveId = lo.get(req, 'query.liveId', '');
		let allowMGLive;
		if(liveId){
			//获取直播间权限
			let power = await homeworkApi.getPower({
				liveId: liveId,
				userId: userId
			}, req);
			allowMGLive = lo.get(power, 'power.data.powerEntity.allowMGLive', false);
		}

		//链接没带liveId或者没有直播间权限，直接获取自己创建的直播间
		if(!liveId || !allowMGLive){
			//获取自己创建的直播间
			let result = await homeworkApi.getMyLiveRoom({
				userId: userId
			}, req);
			liveId = lo.get(result, 'myLive.data.entityPo.id', '');
			if(liveId){
				// 已经创建直播间
				res.redirect(`/wechat/page/homework/manage?liveId=${liveId}`);
				return false;
			}else{
				// 还没创建直播间
				res.redirect(`/wechat/page/backstage?liveId=&restime=${Date.now()}`);
				return false;
			}
		}

	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function homeworkExamHandler (req, res, store) {
	try{
		const topicId = req.query.topicId
		if(topicId){

			const params = {
				topicId,
				userId: lo.get(req, 'rSession.user.userId', '')
			}

			//获取作业详情
			const topicAuth = await topicApi.isAuth(params, req);
			if(!lo.get(topicAuth, 'data.isAuth', false)){
				const camp = await topicApi.getCampByTopicId(params, req)
				const channelId = lo.get(camp, 'data.campPeriod.channelId')
				if (channelId) {
					res.redirect(`/wechat/page/channel-intro?channelId=${channelId}`);
				} else {
					res.redirect(`/wechat/page/topic-intro?topicId=${topicId}`);
				}
				return false
			}
		}
	} catch(err) {
		console.error(err);
	}

	return store;
}