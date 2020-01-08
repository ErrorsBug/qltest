import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import {
	initPayInfo,
	initCampInfo,
	initCampCourse,
} from '../../../site/wechat-react/training-camp/actions/camp';



export async function initPayCampData(req, res, store) {

	const userId = lo.get(req, 'rSession.user.userId');
	const code = lo.get(req, 'query.CPcode', '');
	const campId = lo.get(req, 'query.campId', '');
	const ch = lo.get(req, 'query.ch');

	const params = {
		randCode: code,
		userId: lo.get(req, 'rSession.user.userId'),
		campId: campId,
	}
	const result = await proxy.parallelPromise([
		['isBuy', conf.baseApi.camp.isBuyCamp, { userId, campId }, conf.baseApi.secret],
		['payInfo',conf.baseApi.camp.campPrice, params, conf.baseApi.secret],
		['trainCampPo', conf.baseApi.camp.campInfo, { userId, id: req.query.campId }, conf.baseApi.secret],
	], req);
	let info = lo.get(result, 'payInfo.data', {});
	let trainCampPo = lo.get(result, 'trainCampPo.data.trainCampPo', {});

	const isBuy = lo.get(result, 'isBuy.data.isBuy')
	
	if (isBuy == 'Y') {
		if(ch) {
			res.redirect('/wechat/page/camp/' + req.query.campId + '?actId=' + trainCampPo.activityCode + '&ch=' + ch);
		} else {
			res.redirect('/wechat/page/camp/' + req.query.campId + '?actId=' + trainCampPo.activityCode);
		}
		return false
	}

	store.dispatch(initPayInfo(info));
	store.dispatch(initCampInfo(trainCampPo));

	return store;
}


export async function campHandle (req, res, store) {
	
	const userId = lo.get(req, 'rSession.user.userId');
	const campId = lo.get(req, 'params.campId');
	const ch = lo.get(req, 'query.ch');

	if(!campId) {
		res.render('404')
		return false
	}

	const data = await proxy.parallelPromise([
		['isBuy', conf.baseApi.camp.isBuyCamp, { userId, campId }, conf.baseApi.secret],
		['trainCampPo', conf.baseApi.camp.campInfo, { userId, id: campId }, conf.baseApi.secret],
		['recentTopics', conf.baseApi.camp.campCourse, { userId, trainId: campId }, conf.baseApi.secret],
	], req);

	const isBuy = lo.get(data, 'isBuy.data.isBuy')
	const trainCampPo = lo.get(data, 'trainCampPo.data.trainCampPo')
	const recentTopics = lo.get(data, 'recentTopics.data', []) || []

	if (isBuy != 'Y') {
		if(ch) {
			res.redirect('http://hd1.qianliao.net/wechat/page/activity/tuiwen-hd?actId=' + trainCampPo.activityCode + '&campId=' + campId + '&ch=' + ch);
		} else {
			res.redirect('http://hd1.qianliao.net/wechat/page/activity/tuiwen-hd?actId=' + trainCampPo.activityCode + '&campId=' + campId);
		}
		return false
	}

	store.dispatch(initCampInfo(trainCampPo));
	store.dispatch(initCampCourse(recentTopics));

	return store;
}


export async function campJoinPower (req, res, store) {
	const userId = lo.get(req, 'rSession.user.userId');
	const campId = lo.get(req, 'query.campId');
	if(!campId) {
		res.render('404')
		return false
	}
	const data = await proxy.parallelPromise([
		['isBuy', conf.baseApi.camp.isBuyCamp, { userId, campId }, conf.baseApi.secret],
		['trainCampPo', conf.baseApi.camp.campInfo, { userId, id: campId }, conf.baseApi.secret],
	], req);
	const isBuy = lo.get(data, 'isBuy.data.isBuy')
	const trainCampPo = lo.get(data, 'trainCampPo.data.trainCampPo')
	if (isBuy != 'Y') {
		res.redirect('http://hd1.qianliao.net/wechat/page/activity/tuiwen-hd?actId=' + trainCampPo.activityCode + '&campId=' + campId);
		return false
	}
	return store;
}