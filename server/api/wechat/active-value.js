var lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');



module.exports = [
	['GET', '/api/wechat/active/getActiveInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.active.getActiveInfo, conf.wechatApi.secret)],
	['GET', '/api/wechat/active/getFinishLiveList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.active.getFinishLiveList, conf.wechatApi.secret)],
    ['GET', '/api/wechat/active/getRankList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.active.getRankList, conf.wechatApi.secret)],
];