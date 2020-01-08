var lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

/**
 * 获取三方直播间绑定信息
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getOpsLiveInfo = (params, req) => {
	return proxy.parallelPromise([
		['liveInfo', conf.baseApi.ops.liveInfo, params, conf.baseApi.secret]
	], req);
}


module.exports = [

	['GET', '/api/wechat/ops/live-info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ops.liveInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/ops/live-push', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ops.livePush, conf.baseApi.secret)],
    ['POST', '/api/wechat/ops/refresh-fans', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ops.refreshFans, conf.baseApi.secret)],
];


module.exports.getOpsLiveInfo = getOpsLiveInfo;
