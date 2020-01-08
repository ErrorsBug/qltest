var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

module.exports = [
	// 用户积分信息
	['POST', '/api/wechat/point/getPointUserInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.pointApi.getPointUserInfo, conf.pointApi.secret)],
	// 单个礼品信息
	['POST', '/api/wechat/point/giftInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.pointApi.giftInfo, conf.pointApi.secret)],
	// 做任务
	['POST', '/api/wechat/point/doAssignment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.pointApi.doAssignment, conf.pointApi.secret)],
	// 兑换礼品
	['POST', '/api/wechat/point/exchangeGift', clientParams(), appAuth(), wxAuth(), requestProcess(conf.pointApi.exchangeGift, conf.pointApi.secret)],
]

