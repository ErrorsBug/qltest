var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var weappAuth = require('../../middleware/auth/1.0.0/weapp-auth');
var lo = require('lodash');
const requestProcess = require('../../middleware/request-process/request-process');

/**
 * 获取首页banner和分类数据
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const indexData = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        tagId: 0,
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
        isMore: "N",
        offset: 0,
        pageSize: 20,
	    twUserTag: lo.get(req, 'query.twUserTag', ''), // getBanners使用
    };

    proxy.parallelPromise([
        ['banners', conf.baseApi.getBanners, { userId: lo.get(req, 'rSession.user.userId', ''), weappVer: lo.get(req, 'query.weappVer'),caller:'weapp'}, conf.baseApi.secret],
        ['hotLives', conf.baseApi.recommend.hotLives, { ...params, page: { page: 1, size: 8 } }, conf.baseApi.secret],
        ['isAudit', conf.baseApi.auditState, { weappVer: lo.get(req, 'query.weappVer'),caller: 'weapp' }, conf.baseApi.secret],
        ['categoryList', conf.baseApi.homeTag, params, conf.baseApi.secret],
    ], req).then(results => {
        resProcessor.jsonp(req, res, {
            state: {
                code: 0,
                msg: '操作成功'
            },
            data: results
        });
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
}

var getHotLives = function (req, res, next) {
    var params = {
        isMore: "N",
        tagId: req.query.tagId,
        userId: req.rSession.user.userId,
        weappVer: lo.get(req, 'query.weappVer'),
        caller:'weapp',
        page: {
            page: 1,
            size: 8,
        }
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.hotLives, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

module.exports = [
    // 话题介绍页初始数据
    ['GET', '/api/weapp/index-data', weappAuth(), indexData],
    
    ['GET', '/api/weapp/hot-lives', weappAuth(), getHotLives],

    // 获取小程序带参二维码
    ['GET', '/api/weapp/qrcode', weappAuth(), requestProcess(conf.baseApi.weapp.getWeappQr, conf.baseApi.secret)],

    // 获取带参二维码scene的参数
    ['GET', '/api/weapp/scene-info', weappAuth(), requestProcess(conf.baseApi.weapp.getSceneInfo, conf.baseApi.secret)],

    // 获取返利课上级订单
    ['GET', '/api/weapp/parent-charge-id', weappAuth(), requestProcess(conf.baseApi.weapp.getParentChargeId, conf.baseApi.secret)],

     // 首页点击查看更多
     ['POST', '/api/weapp/view-more', weappAuth(), requestProcess(conf.baseApi.viewMoreCourses, conf.baseApi.secret)],

	// 首页初始化数据
	['GET', '/api/weapp/init-index-data', weappAuth(), requestProcess(conf.baseApi.recommend.initIndexData, conf.baseApi.secret)],

    // 首页兴趣相投
	['GET', '/api/weapp/init-index-interest', weappAuth(), requestProcess(conf.baseApi.recommend.initIndexInterest, conf.baseApi.secret)],

	// 获取用户vip信息
    ['GET', '/api/weapp/user-vip-info', weappAuth(), requestProcess(conf.baseApi.topic.userVipInfo, conf.baseApi.secret)],
    // 获取首页图标列表
	['GET', '/api/weapp/iconList', weappAuth(), requestProcess(conf.baseApi.recommend.iconList, conf.baseApi.secret)],
    // 免费系列课自动报名
    ['POST', '/api/weapp/authFreeChannel', weappAuth(), requestProcess(conf.baseApi.recommend.authFreeChannel, conf.baseApi.secret)],
    // ios端首页免费课程列表
    ['POST', '/api/weapp/iosFreeCourses', requestProcess(conf.baseApi.recommend.iosFreeCourses, conf.baseApi.secret)],
]
