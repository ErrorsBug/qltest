/**
 *
 * @author Dylan
 * @date 2018/7/19
 */
var lo = require('lodash'),
	resProcessor = require('../../components/res-processor/res-processor'),
	proxy = require('../../components/proxy/proxy'),
	wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
	appAuth = require('../../middleware/auth/1.0.0/app-auth'),
	clientParams = require('../../middleware/client-params/client-params'),
	requestProcess = require('../../middleware/request-process/request-process'),
	conf = require('../../conf');

async function addBullet(req, res, next){
	try {
		const params = {
			userId: lo.get(req, 'rSession.user.userId',''),
			liveId: lo.get(req, 'body.liveId', ''),
			businessId: lo.get(req, 'body.topicId', ''),
			topicId: lo.get(req, 'body.topicId', ''),
			style: lo.get(req, 'body.style', ''),
			playTime: lo.get(req, 'body.playTime', ''),
			content: lo.get(req, 'body.content', ''),
		};

		let url;
		if(params.style === 'audioGraphic'){
			url = conf.baseApi.topic.addDiscuss;
			params.type = 'audioGraphic';
			params.parentId = 0;
		}else if(params.style === 'audio'){
			url = conf.baseApi.topic.addForumSpeak;
			params.type = 'text';
			params.second = '';
			params.isReplay = 'N';
			params.relateId = '';
		}else if(params.style === 'normal' || params.style === 'ppt'){
			url = conf.baseApi.comment.add;
			params.type = 'text';
			params.isQuestion = 'N';
		} else {
			return resProcessor.forbidden(req, res, {
				state: {
					code: 500,
					msg: 'style参数错误'
				}
			});
		}
		let result = await proxy.apiProxyPromise(url, params, conf.baseApi.secret);
		if (result && result.data) {
			result = {
				...result,
				data: {
					bullet: result.data.discuss || result.data.speak || result.data.liveCommentView // 输出兼容
				}
			}
		} 
		resProcessor.jsonp(req, res, result);
	} catch (err) {
		resProcessor.error500(req, res, err);
	}
}


async function getBullets(req, res, next){
	try {
		const body = req.body || {};
		const params = {
			userId: lo.get(req, 'rSession.user.userId',''),
			topicId: body.topicId,
			style: body.style,
			startTime: body.startTime,
			endTime: body.endTime,
			count: body.count,
		}

		let result;
		if (body.style === 'audioGraphic') {
			params.businessId = body.topicId;
			result = await proxy.apiProxyPromise(conf.baseApi.bullet.getAudioGraphicBullet, params, conf.baseApi.secret);
			if (result && result.data) {
				result = {
					...result,
					data: {
						list: result.data.discussList
					}
				}
			} 
		} else if (body.style === 'audio') {
			result = await proxy.apiProxyPromise(conf.baseApi.bullet.getAudioBullet, params, conf.baseApi.secret);
			if (result && result.data) {
				result = {
					...result,
					data: {
						list: result.data.forumList
					}
				}
			} 
		} else if (body.style === 'normal' || body.style === 'ppt') {
			params.isQuestion = body.isQuestion;
			result = await proxy.apiProxyPromise(conf.baseApi.bullet.getCommonBullet, params, conf.baseApi.secret);
			if (result && result.data) {
				result = {
					...result,
					data: {
						list: result.data.liveComment
					}
				}
			} 
		} else {
			return resProcessor.forbidden(req, res, {
				state: {
					code: 500,
					msg: 'style参数错误'
				}
			});
		}

		resProcessor.jsonp(req, res, result);
	} catch (err) {
		resProcessor.error500(req, res, err);
	}
}


module.exports = [
	['POST', '/api/wechat/bullet/add', clientParams(), appAuth(), wxAuth(), addBullet],
	['POST', '/api/wechat/bullet/get', clientParams(), appAuth(), wxAuth(), getBullets],
];