/**
 * Created by dylanssg on 2017/6/22.
 */
var lo = require('lodash'),
	resProcessor = require('../../components/res-processor/res-processor'),
	proxy = require('../../components/proxy/proxy'),
	wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
	appAuth = require('../../middleware/auth/1.0.0/app-auth'),
	clientParams = require('../../middleware/client-params/client-params'),
	conf = require('../../conf'),
	requestProcess = require('../../middleware/request-process/request-process');

const getInfo = (params, req) => {
	return proxy.parallelPromise([
		['homeworkInfo', conf.baseApi.homework.get, params, conf.baseApi.secret]
	], req);
};

const info = (req,res,next) => {
	let params = lo.get(req, 'body');
	params.userId = lo.get(req, 'rSession.user.userId');

	getInfo(params, req).then((data) => {
		resProcessor.jsonp(req, res, data);
	}).catch((err) => {
		console.error(err);
		resProcessor.error500(req, res, err);
	});

};

const getMyLiveRoom = (params, req) => {
	return proxy.parallelPromise([
		['myLive', conf.baseApi.live.my, params, conf.baseApi.secret],
	], req);
};

const getPower = (params, req) => {
	return proxy.parallelPromise([
		['power', conf.baseApi.user.power, params, conf.baseApi.secret],
	], req);
};

const getSubscribe = (params, req) => {
	return proxy.parallelPromise([
		['isSubscribe', conf.baseApi.homework.isSubscribe, params, conf.baseApi.secret],
	], req);
}

const userBindKaiFang = (params, req) => {
	return proxy.parallelPromise([
		['userBindKaiFang', conf.baseApi.userBindKaiFang, params, conf.baseApi.secret],
	], req);
}



module.exports = [
	['POST','/api/wechat/homework/getTopicListByChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.getTopicListByChannel, conf.baseApi.secret)],
	['POST','/api/wechat/homework/save', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.save, conf.baseApi.secret)],
	['POST','/api/wechat/homework/getArrangedList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.getArrangedList, conf.baseApi.secret)],
	['POST','/api/wechat/homework/get', clientParams(), appAuth(), wxAuth(), info],
	['POST','/api/wechat/homework/saveAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.saveAnswer, conf.baseApi.secret)],
	['POST','/api/wechat/homework/getMyAnsweredList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.myAnsweredList, conf.baseApi.secret)],
	['POST','/api/wechat/homework/getAnsweredList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.answeredList, conf.baseApi.secret)],
	['POST','/api/wechat/homework/like', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.like, conf.baseApi.secret)],
	['POST','/api/wechat/homework/getMyAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.myAnswer, conf.baseApi.secret)],
	['POST','/api/wechat/homework/deleteHomework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.deleteHomework, conf.baseApi.secret)],
	['POST','/api/wechat/homework/deleteAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.deleteAnswer, conf.baseApi.secret)],
	['POST','/api/wechat/homework/deleteComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.deleteComment, conf.baseApi.secret)],
	['POST','/api/wechat/homework/addComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.addComment, conf.baseApi.secret)],
	['POST','/api/wechat/homework/visitDetailLog', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.visitDetailLog, conf.baseApi.secret)],
	['POST','/api/wechat/homework/getMaxPushCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.getMaxPushCount, conf.baseApi.secret)],
	['POST','/api/wechat/homework/pushHomework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.pushHomework, conf.baseApi.secret)],
	['POST','/api/wechat/homework/addAnswerAuth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.addAnswerAuth, conf.baseApi.secret)],
	['POST','/api/wechat/homework/getVideoPlayInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.getVideoPlayInfo, conf.baseApi.secret)],

	// 获取考试信息
	['POST','/api/wechat/homework/exam/getExam', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.getExam, conf.homeworkApi.secret)],
	// 开始考试
	['POST','/api/wechat/homework/exam/startExam', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.startExam, conf.homeworkApi.secret)],
	// 保存考试
	['POST','/api/wechat/homework/exam/saveAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.saveAnswer, conf.homeworkApi.secret)],
	// 结束考试
	['POST','/api/wechat/homework/exam/endExam', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.endExam, conf.homeworkApi.secret)],
	// 获取考试信息 (成就卡)
	['POST','/api/wechat/homework/exam/getUserExamInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.getUserExamInfo, conf.homeworkApi.secret)],
	// 查看解析
	['POST','/api/wechat/homework/exam/showAnalysis', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.showAnalysis, conf.homeworkApi.secret)],

	// 作业相关
	['POST','/api/wechat/homework/camp/examQuestionHomework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.camp.examQuestionHomework, conf.homeworkApi.secret)],
	['POST','/api/wechat/homework/camp/startHomework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.camp.startHomework, conf.homeworkApi.secret)],
	['POST','/api/wechat/homework/camp/endHomework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.camp.endHomework, conf.homeworkApi.secret)],
	['POST','/api/wechat/homework/camp/saveAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.camp.saveAnswer, conf.homeworkApi.secret)],
	['POST','/api/wechat/homework/camp/getUserAnswerInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.camp.getUserAnswerInfo, conf.homeworkApi.secret)],
	['POST','/api/wechat/homework/camp/showAnalysis', clientParams(), appAuth(), wxAuth(), requestProcess(conf.homeworkApi.camp.showAnalysis, conf.homeworkApi.secret)],
];

module.exports.getInfo = getInfo;
module.exports.getMyLiveRoom = getMyLiveRoom;
module.exports.getPower = getPower;
module.exports.getSubscribe = getSubscribe;
module.exports.userBindKaiFang = userBindKaiFang;
