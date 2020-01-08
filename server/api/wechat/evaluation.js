var lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
	appAuth = require('../../middleware/auth/1.0.0/app-auth'),
	clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

const getEvaluationData = (params, req) => {
	if(params.topicId) return proxy.parallelPromise([
		['evaluationData', conf.baseApi.topic.getEvaluation, params, conf.baseApi.secret]
	], req);
	else if(params.channelId) return proxy.parallelPromise([
		['evaluationData', conf.baseApi.channel.getEvaluation, params, conf.baseApi.secret]
	], req);
	else return Promise.reject('缺少参数');
};

const evaluationData = (req,res,next) => {
	let params = lo.get(req, 'body');


	getEvaluationData(params, req).then((data) => {
		resProcessor.jsonp(req, res, data.evaluationData);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const getUserPower = (params, req) => {
	if(params.topicId) return proxy.parallelPromise([
		['userPower', conf.wechatApi.common.getPower, params, conf.baseApi.secret]
	], req);
	else if(params.channelId) return proxy.parallelPromise([
		['userPower', conf.wechatApi.common.getPower, params, conf.baseApi.secret]
	], req);
	else return Promise.reject('缺少参数');
};

const UserPower = (req,res,next) => {
	let params = lo.get(req, 'params');
	params.userId = req.rSession.user.userId;

	getUserPower(params, req).then((data) => {
		resProcessor.jsonp(req, res, data.userPower);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const getEvaluationList = (params, req) => {
    params = params || {};
	params.onlyContent || (params.onlyContent = 'N');
	return proxy.parallelPromise([
		['evaluationList', conf.wechatApi.evaluation.getList, params, conf.baseApi.secret]
	], req);
};

const evaluationList = (req,res,next) => {
	let params = lo.get(req, 'body');

	getEvaluationList(params, req).then((data) => {
		resProcessor.jsonp(req, res, data.evaluationList);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const getLabelList = (params, req) => {
	return proxy.parallelPromise([
		['labelList', conf.wechatApi.evaluation.getLabelList, params, conf.baseApi.secret]
	], req);
};

const labelList = (req,res,next) => {
	getEvaluationList({}, req).then((data) => {
		resProcessor.jsonp(req, res, data.labelList);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};


const reply = (req,res,next) => {
	let params = lo.get(req, 'body');
	params.userId = req.rSession.user.userId;


	proxy.parallelPromise([
		['reply', conf.wechatApi.evaluation.reply, params, conf.baseApi.secret]
	], req).then((data) => {
		resProcessor.jsonp(req, res, data.reply);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const getStatus = (params, req) => {
	return proxy.parallelPromise([
		['status', conf.wechatApi.evaluation.getStatus, params, conf.baseApi.secret]
	], req);
};

const status = (req,res,next) => {
	let params = lo.get(req, 'body');
	params.userId = req.rSession.user.userId;

	getStatus(params, req).then((data) => {
		resProcessor.jsonp(req, res, data.status);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const create = (req,res,next) => {
	let params = lo.get(req, 'body');
	// params.userId = '100011764000002';
	params.userId = req.rSession.user.userId;

	proxy.parallelPromise([
		['add', conf.wechatApi.evaluation.add, params, conf.baseApi.secret]
	], req).then((data) => {
		resProcessor.jsonp(req, res, data.add);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const isOpen = (params, req) => {
	return proxy.parallelPromise([
		['isOpen', conf.wechatApi.evaluation.isOpenEvaluate, params, conf.baseApi.secret]
	], req);
};

const getIsOpenMiddleware = async (req, res, next) => {
	var params = {
		liveId: req.query.liveId
	};
	try {
		let result = await isOpen(params, req);
		// store.dispatch(initIsOpenEvaluate(lo.get(result, 'isOpen.data.isOpenEvaluate')));
		resProcessor.jsonp(req, res, lo.get(result, 'isOpen'));
	} catch(err) {
		console.error(err);
	}
}

const updateIsOpenMiddleware = (req, res, next) => {
	let {liveId, isOpen} = req.body;

	let params = {
		liveId,
		isOpenEvaluate: isOpen
	};
	proxy.apiProxy(conf.wechatApi.evaluation.updateIsOpenEvaluate, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

module.exports = [

	['POST', '/api/wechat/evaluation/get', wxAuth(), evaluationData],
	['GET', '/api/wechat/evaluation/getPower', wxAuth(), UserPower],
	['POST', '/api/wechat/evaluation/getList', evaluationList],
	['POST', '/api/wechat/evaluation/getLabelList', wxAuth(), labelList],
	['POST', '/api/wechat/evaluation/reply', wxAuth(), reply],
	['POST', '/api/wechat/evaluation/getStatus', wxAuth(), status],
	['POST', '/api/wechat/evaluation/add', wxAuth(), create],
	['POST','/api/wechat/evaluation/isEvaluable', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.evaluation.isEvaluable, conf.baseApi.secret)],
	['POST','/api/wechat/evaluation/removeReply', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.evaluation.removeReply, conf.baseApi.secret)],
	['POST', '/api/wechat/evaluation/updateIsOpenEvaluate', wxAuth(), updateIsOpenMiddleware],
	['POST', '/api/wechat/evaluation/getEdit', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.evaluation.get, conf.baseApi.secret)],
	['GET', '/api/wechat/evaluation/getIsOpenEvaluate', wxAuth(), getIsOpenMiddleware],
	['POST', '/api/wechat/evaluation/getEvalMsgRedDot', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.evaluation.getEvalMsgRedDot, conf.baseApi.secret)],
	['POST', '/api/wechat/evaluation/cleanEvalMsgRedDot', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.evaluation.cleanEvalMsgRedDot, conf.baseApi.secret)],
];


module.exports.getEvaluationData = getEvaluationData;
module.exports.getUserPower = getUserPower;
module.exports.getEvaluationList = getEvaluationList;
module.exports.getLabelList = getLabelList;
module.exports.getStatus = getStatus;
module.exports.isOpen = isOpen;
