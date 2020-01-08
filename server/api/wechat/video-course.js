/**
 *
 * @author Dylan
 * @date 2018/5/18
 */
var lo = require('lodash'),

	resProcessor = require('../../components/res-processor/res-processor'),
	proxy = require('../../components/proxy/proxy'),
	wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
	appAuth = require('../../middleware/auth/1.0.0/app-auth'),
	clientParams = require('../../middleware/client-params/client-params'),
	conf = require('../../conf'),
	requestProcess = require('../../middleware/request-process/request-process');

const getMyLive = (params, req) => {
	return proxy.parallelPromise([
		['myLive', conf.baseApi.live.my, params, conf.baseApi.secret]
	], req);
}


var getMyWallet = async (params, req) => {

	return proxy.parallelPromise([
		['myWallet', conf.baseApi.my.wallet, params, conf.baseApi.secret],
	], req);


}

const initSimpleVideo = async (req, res, next) => {
	const params = {
		userId: lo.get(req, 'rSession.user.userId'),
		topicId: lo.get(req, 'body.topicId'),
		businessId: lo.get(req, 'body.topicId'),
		type: 'topic'
	};

	const firstRes = await proxy.parallelPromise([
		['topicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret],
		['power', conf.baseApi.user.power, params, conf.baseApi.secret],
		['kickOutRes', conf.baseApi.isKickOut, params, conf.baseApi.secret],
	], req);

	const topicPo = lo.get(firstRes, 'topicInfo.data.topicPo', {});
	const liveId = topicPo.liveId || '';

	topicPo.currentTimeMillis = Date.now();

	const secondParams = {
		sessionId: req.rSession.sessionId,
		userId: params.userId,
		topicId: params.topicId,
		liveId: lo.get(firstRes, 'topicInfo.data.topicPo.liveId', null),
		channelNo: lo.get(req, 'query.pro_cl') || lo.get(req, 'cookies.pro_cl'),
	};

	if (topicPo.sourceTopicId) {
		secondParams.sourceTopicId = topicPo.sourceTopicId;
	}

	const secondRes= await proxy.parallelPromise([
		['liveInfo', conf.baseApi.live.get, secondParams, conf.baseApi.secret],
		['blackInfo', conf.baseApi.channel.isBlack, secondParams, conf.baseApi.secret],
		['topicAuth', conf.baseApi.topic.topicAuth, secondParams, conf.baseApi.secret],
		['lShareKey', conf.baseApi.share.qualify, {liveId: secondParams.liveId, userId: secondParams.userId,}, conf.baseApi.secret],
		['isLiveAdmin', conf.adminApi.adminFlag, secondParams, conf.adminApi.secret],
		['isFollow', conf.baseApi.live.isFollow, secondParams, conf.baseApi.secret],
		['isSubscribe', conf.baseApi.user.isSubscribe, secondParams, conf.baseApi.secret],
	], req);

	resProcessor.jsonp(req, res, {
		userId: params.userId,
		sid: secondParams.sessionId,
		...firstRes,
		...secondRes
	})
};

module.exports = [

	['POST', '/api/wechat/video/initSimpleModeData', clientParams(), appAuth(), wxAuth(), initSimpleVideo],

];


module.exports.getMyLive = getMyLive;
module.exports.getMyWallet = getMyWallet;
