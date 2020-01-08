var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');


/**
 * 获取banner列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var getBanners = function(req, res, next) {

    proxy.apiProxy(conf.baseApi.getBanners, {twUserTag: lo.get(req, 'query.twUserTag', '')}, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}


function getStsAuth (req, res, next) {
    proxy.apiProxy(conf.baseApi.ossAuth, { userId: req.rSession.user.userId }, (err, result) => {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.baseApi.secret, req);
}

module.exports = [
    ['GET', '/api/wechat/banners', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getBanners, conf.baseApi.secret)],
    // 获取视频上传凭据和地址
    ['GET', '/api/video/oss/video/get', wxAuth(), requestProcess(conf.baseApi.oss.video.get, conf.baseApi.secret)],
    // 刷新视频上传凭据和地址
    ['POST', '/api/video/oss/video/refresh', wxAuth(), requestProcess(conf.baseApi.oss.video.refresh, conf.baseApi.secret)],
    ['GET', '/api/wechat/common/getStsAuth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ossAuth, conf.baseApi.secret)],
    // 获取视频上传凭据和地址
    ['GET', '/api/video/oss/video/get', wxAuth(), requestProcess(conf.baseApi.oss.video.get, conf.baseApi.secret)],
    // 刷新视频上传凭据和地址
    ['POST', '/api/video/oss/video/refresh', wxAuth(), requestProcess(conf.baseApi.oss.video.refresh, conf.baseApi.secret)],
    ['POST', '/api/wechat/make-order', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.pay.order, conf.baseApi.secret)],
    ['GET', '/api/wechat/selectResult', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.pay.result, conf.baseApi.secret)],
    ['GET', '/api/wechat/user/info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.info, conf.baseApi.secret)],
    ['GET', '/api/wechat/get-qrcode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getQr, conf.baseApi.secret)],
    ['GET', '/api/wechat/get-topic-qrcode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getTopicQr, conf.baseApi.secret)],
    ['GET', '/api/wechat/user/power', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.power, conf.baseApi.secret)],
	// 获取用户是否创建直播间
	['POST', '/api/wechat/user/getCreateLiveStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.getCreateLiveStatus, conf.baseApi.secret)],
	['POST', '/api/wechat/user/getAppIdByType', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.getAppIdByType, conf.baseApi.secret)],
	// 获取是否三方白名单
    ['POST', '/api/wechat/thirdParty/isWhite', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.thirdParty.isWhite, conf.baseApi.secret)],
    ['POST', '/api/wechat/sendValidCode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.sendValidCode, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkValidCode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkValidCode, conf.baseApi.secret)],
    ['GET', '/api/wechat/getCousePayPaster', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getCousePayPaster, conf.baseApi.secret)],
    // 是否官方直播间
    ['GET', '/api/wechat/isQlLive', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.isQlLive, conf.baseApi.secret)],
    //获取独立域名getDomainUrl
    ['POST', '/api/wechat/getDomainUrl', clientParams(), appAuth(), requestProcess(conf.baseApi.getDomainUrl, conf.baseApi.secret)],
    // 获取描述列表
    ['POST', '/api/wechat/getDesc', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getDesc, conf.baseApi.secret)],
    // 订阅直播间通知
    ['GET', '/api/wechat/subscribe', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.subscribe, conf.baseApi.secret)],
    // 新功能白名单
    ['POST', '/api/wechat/isFunctionWhite', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.isFunctionWhite, conf.baseApi.secret)],
]
