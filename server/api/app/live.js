var _ = require('underscore'),
    lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    conf = require('../../conf');

/**
 * 按tagid 查询正在进行的话题列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var listNewsTopicsByTagId = function (req, res, next) {
    var params = _.pick(req.query, 'tagId');

    params.page = {
        page: req.query.page,
        size: req.query.size
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.live.listNewsTopicsByTagId, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

/**
 * 按tagid 查询正在进行的话题列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var listHistTopicByTagId = function (req, res, next) {
    var params = _.pick(req.query, 'tagId');

    params.page = {
        page: req.query.page,
        size: req.query.size
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.live.listHistTopicByTagId, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

/**
 * 查询热门推荐话题
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var listHotTopic = function (req, res, next) {
    var params = _.pick(req.query, 'index');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.appApi.live.listHotEntity, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.appApi.secret, req);
};

/**
 * 查询直播间最新话题
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-16T10:17:18+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var listNewestTopic = function (req, res, next) {
    var params = _.pick(req.query, 'liveId');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.appApi.live.listNewestTopic, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.appApi.secret, req);
};

/**
 * 查询热门推荐直播间
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var listHotLive = function (req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size
        }
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.appApi.live.listHotLives, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.appApi.secret, req);
};

/**
 * 查询最新直播间
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-16T10:17:18+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var listNewestLive = function (req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size
        }
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.appApi.live.listNewestLives, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.appApi.secret, req);
};

/**
 * 关注直播间
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-16T16:33:32+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var liveFocus = function (req, res, next) {
    var params = _.pick(req.query, 'liveId', 'status');

    params.userId = lo.get(req, 'rSession.user.userId');

    if (!params.status) {
        params.status = req.query.flag;
    }

    proxy.apiProxy(conf.baseApi.liveFocus, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

/**
 * 获取直播中心话题跳转地址
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-24T05:23:04+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var liveRedirect = function (req, res, next) {
    var params = _.pick(req.query, 'topicId');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.live.liveRedirect, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};



module.exports = [
    ['GET', '/api/app/live/list-news-topic-by-tagid', clientParams(), appAuth(), listNewsTopicsByTagId],
    ['GET', '/api/app/live/list-hist-topic-by-tagid', clientParams(), appAuth(), listHistTopicByTagId],
    ['GET', '/api/app/live/list-hot-topic', clientParams(), appAuth(), listHotTopic],
    ['GET', '/api/app/live/list-newest-topic', clientParams(), appAuth(), listNewestTopic],
    ['GET', '/api/app/live/list-newest-live', clientParams(), appAuth(), listNewestLive],
    ['GET', '/api/app/live/list-hot-live', clientParams(), appAuth(), listHotLive],
    ['GET', '/api/app/live/focus', clientParams(), appAuth(), liveFocus],
    ['GET', '/api/app/live/redirect', clientParams(), appAuth(), liveRedirect],
    // ['GET', '/api/app/live/doAttention', clientParams(), appAuth(), liveDoAttention],
];
