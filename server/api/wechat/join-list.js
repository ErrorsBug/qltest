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


module.exports = [
	['POST','/api/wechat/topic/authCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authCount.topic, conf.baseApi.secret)],
	['POST','/api/wechat/channel/authCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authCount.channel, conf.baseApi.secret)],
    ['POST','/api/wechat/vip/authCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authCount.vip, conf.baseApi.secret)],
    ['POST','/api/wechat/customVip/authCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authCount.customVip, conf.baseApi.secret)],
    
	['POST','/api/wechat/topic/authList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authList.topic, conf.baseApi.secret)],
	['POST','/api/wechat/channel/authList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authList.channel, conf.baseApi.secret)],
    ['POST','/api/wechat/vip/authList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.authList.vip, conf.baseApi.secret)],
    
	['POST','/api/wechat/live/black', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.black, conf.baseApi.secret)],
	['POST','/api/wechat/topic/kick', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.kick, conf.baseApi.secret)],
	['POST','/api/wechat/vip/kick', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.vipKick, conf.baseApi.secret)],
	['POST','/api/wechat/topic/relayStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.relayStatus, conf.baseApi.secret)],
];
