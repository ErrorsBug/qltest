var _ = require('underscore'),
    lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    conf = require('../../conf');


/**
 * 精选专题列表分页接口
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-26T14:08:18+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var themeList = function(req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size
        }
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.themeList, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var themeListHotEntity = function(req, res, next) {
    var params = {
        themeId: req.query.themeId,
        page: {
            page: req.query.page,
            size: req.query.size
        }
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.themeListHotEntity, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


/**
 * 查询直播间（可以批量查询）最新的两个话题
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-27T09:58:40+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var themeListNewestTopic = function(req, res, next) {
    var params = {
        liveIds: req.query.liveIds
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.themeListNewestTopic, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


module.exports = [
    ['GET', '/api/wechat/theme/list', clientParams(), appAuth(), wxAuth(), themeList],

    ['GET', '/api/wechat/theme/list-hot-entity', clientParams(), appAuth(), wxAuth(), themeListHotEntity],

    ['GET', '/api/wechat/theme/list-newest-topic', clientParams(), appAuth(), wxAuth(), themeListNewestTopic]
];
