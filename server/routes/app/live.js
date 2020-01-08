var path = require('path'),
    _ = require('underscore'),
    async = require('async'),
    lo = require('lodash'),

    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),

    proxy = require('../../components/proxy/proxy'),
    resProcessor = require('../../components/res-processor/res-processor'),
    htmlProcessor = require('../../components/html-processor/html-processor'),
    conf = require('../../conf');


/**
 * 直播中心
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-14T12:53:06+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageCenter(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/app/page/live-center/live-center.html');
    var options = {
            filePath: filePath,
            fillVars: {

            },
            renderData: {
                topics: [],
                banners: [],
                showBannerNum: false
            }
        };

    // htmlProcessor(req, res, next, options);return;

    var params = {
        tagId: req.query.tagId,
        page: {
            page: 1,
            size: 20,
        },
    };

    async.parallel([function(callback) {
        proxy.apiProxy(conf.baseApi.live.listNewsTopicsByTagId, params, callback, conf.baseApi.secret, req);
    }, function(callback) {
        proxy.apiProxy(conf.baseApi.live.listHistTopicByTagId, params, callback, conf.baseApi.secret, req);
    }, function(callback) {
        proxy.apiProxy(conf.baseApi.live.listBanner, {twUserTag: lo.get(req, 'query.twUserTag', '')}, callback, conf.baseApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.renderData.topics = results[0] && results[0].data && results[0].data.topics || false;
        options.renderData.banners = results[2] && results[2].data && results[2].data.banners || [];
        options.renderData.showBannerNum = options.renderData.banners.length > 1 ? true: false;

        options.fillVars.TOPICSDATA = {
            topicLength: options.renderData.topics && options.renderData.topics.length,
            // topics: results[0] && results[0].data && results[0].data.topics || [],
            page: params.page
        };
        options.fillVars.HISTTOPICSDATA = {
            topics: results[1] && results[1].data && results[1].data.topics || [],
            page: params.page,
        };
        // options.fillVars.BANNERS = results[2] && results[2].data && results[2].data.banners;
        options.fillVars.NOWTIME = new Date().getTime();

        htmlProcessor(req, res, next, options);
    });
}

/**
 * 最新入驻直播间
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-15T17:06:04+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageNewest(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/app/page/live-newest/live-newest.html');
    var options = {
            filePath: filePath,
            fillVars: {
                LIVESDATA: {},
            },
            renderData: {
                // banners: null,
                livesList: [],
            },
        };

    // htmlProcessor(req, res, next, options);return;

    var params = {
        page: {
            page: 1,
            size: 20,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    async.parallel([function(callback) {
        proxy.apiProxy(conf.appApi.live.listNewestLives, params, callback, conf.appApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.renderData.livesList = results[0] && results[0].data && results[0].data.resultList || null;
        options.fillVars.LIVESDATA = {
            page: params.page,
        };
        // options.renderData.banners = results[1].data && results[1].data.banners;

        htmlProcessor(req, res, next, options);
    });
}

/**
 * 热门推荐直播间
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-15T17:06:04+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageHot(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/app/page/live-hot/live-hot.html'),
        options = {
            filePath: filePath,
            fillVars: {
                LIVESDATA: {},
            },
            renderData: {
                // banners: null,
                livesList: [],
            },
        };

    // htmlProcessor(req, res, next, options);return;

    var params = {
        page: {
            page: 1,
            size: 20,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    async.parallel([function(callback) {
        proxy.apiProxy(conf.appApi.live.listHotLives, params, callback, conf.appApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.renderData.livesList = results[0] && results[0].data && results[0].data.resultList || null;
        options.fillVars.LIVESDATA = {
            page: params.page,
        };
        // options.renderData.banners = results[1].data && results[1].data.banners;

        htmlProcessor(req, res, next, options);
    });
}


/**
 * routes配置，配置格式如下：
 * routes = [
 *     ['get', '/abc', fun1, [fun2, fun3, ...]],
 *     ['post', '/abcd', fun1, fun2],
 *     ...
 * ]
 */
module.exports = [

    // 直播中心 (废弃)
    ['GET', '/app/page/live/center', clientParams(), appAuth(), pageCenter],

    // 最新入驻
    ['GET', '/app/page/live/newest', clientParams(), appAuth(), pageNewest],

    // 热门推荐
    ['GET', '/app/page/live/hot', clientParams(), appAuth(), pageHot],

    // 专题推荐
    // ['GET', '/app/page/live/theme', clientParams(), appAuth(), pageTheme],

];
