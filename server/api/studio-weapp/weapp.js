var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
var lo = require('lodash');

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
        caller: 'studio-weapp',
        weappVer: lo.get(req, 'query.weappVer'),
        isMore: "N",
        offset: 0,
        pageSize: 20,
	    twUserTag: lo.get(req, 'query.twUserTag', ''), // getBanners使用
    };

    proxy.parallelPromise([
        ['banners', conf.baseApi.getBanners, params, conf.baseApi.secret],
        ['hotLives', conf.baseApi.recommend.hotLives, { ...params, page: { page: 1, size: 8 } }, conf.baseApi.secret],
        ['isAudit', conf.baseApi.auditState, params, conf.baseApi.secret],
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
        caller: 'studio-weapp',
        weappVer: lo.get(req, 'query.weappVer'),
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
    ['GET', '/api/studio-weapp/index-data', studioWeappAuth(), indexData],
    
    ['GET', '/api/studio-weapp/hot-lives', studioWeappAuth(), getHotLives],

]
