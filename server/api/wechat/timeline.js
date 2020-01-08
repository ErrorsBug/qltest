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

const getPower = (params, req) => {
	return proxy.parallelPromise([
		['power', conf.baseApi.user.power, params, conf.baseApi.secret],
	], req);
};

const getLikeList = (params, req) => {
	return proxy.parallelPromise([
		['likeList', conf.baseApi.user.power, params, conf.baseApi.secret],
	], req);
};

const getLiveList = (params, req) => {
	return proxy.parallelPromise([
		['focusLiveList', conf.baseApi.findLiveEntity, {type: "follower", simple: 'Y', ...params}, conf.baseApi.secret],
	], req);
};
const getTimelineList = (params, req) => {
	return proxy.parallelPromise([
		['timeline', conf.baseApi.timeline.getTimelineList, params, conf.baseApi.secret],
	], req);
}
const getTimelineTypes = (params, req) => {
	return proxy.parallelPromise([
		['homeworkList', conf.baseApi.homework.getArrangedList, params, conf.baseApi.secret],
		['topicList', conf.baseApi.timeline.getTopicList, params, conf.baseApi.secret],
		['channelList', conf.baseApi.channel.getChannelIdList, params, conf.baseApi.secret],
	], req);
};

const getNewLikeNum = (params, req) => {
	return proxy.parallelPromise([
		['newLikeNum', conf.baseApi.timeline.getNewLikeNum, params, conf.baseApi.secret],
	], req);
}
const getNewLikeList = (params, req) => {
	return proxy.parallelPromise([
		['newLikeList', conf.baseApi.timeline.getNewLikeList, params, conf.baseApi.secret],
	], req);
}

const initTimeline = async function (req, res, next) {
	const userId = lo.get(req, 'rSession.user.userId')
	let params = {
		...lo.get(req, 'body'),
		userId: userId,
		liveId: 0
	}

	const myLive = await proxy.parallelPromise([
		['myLive', conf.baseApi.live.my, params, conf.baseApi.secret],
	], req);

	const liveId = lo.get(myLive, 'myLive.data.entityPo.id')
    if (liveId) {
	    params.liveId = liveId;
    }

	const data = await proxy.parallelPromise([
		['power', conf.baseApi.user.power, params, conf.baseApi.secret],
		['focusLiveList', conf.baseApi.findLiveEntity, {type: "follower", page: {page: 1, size: 30}, simple: 'Y', ...params}, conf.baseApi.secret],
	], req)

	var newLikeNumData = await getNewLikeNum({
		liveId: liveId,
		userId: userId,
	}, req)

	const newLikeNum = lo.get(newLikeNumData, 'newLikeNum.data.likeNum')
	const power = lo.get(data, "power.data.powerEntity")

	const myAdminLives = lo.get(myLive, 'myLive.data.entityPo')
	const myFocusLives = lo.get(data, 'focusLiveList.data.liveEntityPos')

	resProcessor.jsonp(req, res, {
		data: {
			userId: params.userId,
			liveId: params.liveId,
			myAdminLives,
			myFocusLives,
			power,
			newLikeNum,
		},
		state: {
			code: 0,
			msg: "操作成功"
		}
	});

}

var liveFocus = function (req, res, next) {
	let params = {
		liveId: lo.get(req, 'query.liveId'),
		status: lo.get(req, 'query.status'),
		userId: lo.get(req, 'rSession.user.userId'),
	}

    if (!params.status) {
        params.status = req.query.flag;
    }

    proxy.apiProxy(conf.baseApi.liveFocus, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var getLiveId = function (req, res, next) {
	let params = {
		userId: lo.get(req, 'rSession.user.userId'),
	}

    proxy.apiProxy(conf.baseApi.live.my, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var focusList = function (req, res, next) {
	let params = {
		type: "follower",
		userId: lo.get(req, 'rSession.user.userId'),
		page: {
			page: req.query.page,
			size: 30,
		}
	}
	params.userId = lo.get(req, 'rSession.user.userId');
	proxy.apiProxy(conf.baseApi.findLiveEntity, {...params, simple: 'Y'}, function (err, body) {
		if (err) {
			resProcessor.error500(req, res, err);
			return;
		}
		resProcessor.jsonp(req, res, body);
	}, conf.baseApi.secret, req);
};


module.exports = [

	['POST', '/api/wechat/timeline/getTopicList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.timeline.getTopicList, conf.wechatApi.secret)],
	['POST', '/api/wechat/timeline/getHomeworkList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.getArrangedList, conf.wechatApi.secret)],
	['POST', '/api/wechat/timeline/getChannelIdList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getChannelIdList, conf.wechatApi.secret)],

    // findLiveEntity用来获取关注的直播间列表的
	['POST', '/api/wechat/live/findLiveEntity', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.live.my, conf.wechatApi.secret)],

	['POST', '/api/wechat/timeline/deleteTimeline', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.deleteTimeline, conf.baseApi.secret)],

	['POST', '/api/wechat/timeline/getTimelineList', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.getTimelineList, conf.baseApi.secret)],

	['POST', '/api/wechat/timeline/initTimeline', clientParams(), appAuth(), wxAuth(), initTimeline],


	['GET', '/api/wechat/timeline/focus', clientParams(), appAuth(), wxAuth(), liveFocus],
	['GET', '/api/wechat/timeline/focusList', clientParams(), appAuth(), wxAuth(), focusList],

	['GET', '/api/wechat/timeline/getLiveId', clientParams(), appAuth(), wxAuth(), getLiveId],


	['POST', '/api/wechat/timeline/times', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.times, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/creteTimeline', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.creteTimeline, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/restPushTimes', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.restPushTimes, conf.baseApi.secret)],

	['POST', '/api/wechat/timeline/getNewLikeNum', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.getNewLikeNum, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/getNewLikeList', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.getNewLikeList, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/setNewLikeToRead', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.setNewLikeToRead, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/like', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.like, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/deleteTimeline', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.deleteTimeline, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/getDataForCreateTimeline', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.getDataForCreateTimeline, conf.baseApi.secret)],
	['POST', '/api/wechat/timeline/onekeyUpdateAlert', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.timeline.onekeyUpdateAlert, conf.baseApi.secret)],
];


module.exports.getMyLive = getMyLive;
module.exports.getPower = getPower;
module.exports.getLikeList = getLikeList;
module.exports.getTimelineTypes = getTimelineTypes;
module.exports.getTimelineList = getTimelineList;
module.exports.getNewLikeNum = getNewLikeNum;
module.exports.getNewLikeList = getNewLikeList;

module.exports.getLiveList = getLiveList;
