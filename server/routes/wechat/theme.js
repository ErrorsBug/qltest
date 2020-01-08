var path = require('path'),
    _ = require('underscore'),
    lo = require('lodash'),
    async = require('async'),

    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),

    proxy = require('../../components/proxy/proxy'),
    resProcessor = require('../../components/res-processor/res-processor'),
    htmlProcessor = require('../../components/html-processor/html-processor'),
    conf = require('../../conf');


/**
 * 热门专题推荐
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-14T12:53:06+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageTheme(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/theme/theme.html'),
        options = {
            filePath: filePath,
            fillVars: {
                THEMEDATA: {}
            },
            renderData: {

            }
        };

    var params = {
        page: {
            page: 1,
            size: 20
        }
    };

    // params.userId = req.rSession.user.userId;

    async.parallel([function(callback) {
        proxy.apiProxy(conf.baseApi.themeList, params, callback, conf.baseApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.fillVars.THEMEDATA = {
            themeLength: lo.get(results, '0.data.dataList.length', 0),
            page: params.page,
        };
        options.renderData.themes = lo.get(results, '0.data.dataList', []);
        options.fillVars.NOWTIME = new Date().getTime();
        htmlProcessor(req, res, next, options);
    });
}

/**
 * 系列课专题页
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-24T17:17:17+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageThemeChannel(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/theme-channel/theme-channel.html'),
        options = {
            filePath: filePath,
            fillVars: {
                THEMEDATA: {},
            },
            renderData: {

            }
        };

    var params = {
        themeId: req.query.id,
        page: {
            page: 1,
            size: 20
        }
    };

    params.userId = req.rSession.user.userId;


    async.parallel([function(callback) {
        proxy.apiProxy(conf.baseApi.themeListHotEntity, params, callback, conf.baseApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.fillVars.THEMEDATA = {
            entityLength: lo.get(results, '0.data.themeLibs.length', 0),
            page: params.page,
        };
        options.fillVars.NOWTIME = new Date().getTime();
        options.renderData.theme = lo.get(results, '0.data', {});
        htmlProcessor(req, res, next, options);
    });
}


/**
 * 直播间专题页
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-24T17:17:32+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageThemeLive(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/theme-live/theme-live.html'),
        options = {
            filePath: filePath,
            renderData: {

            },
            fillVars: {
                THEMEDATA: {},
            },
        };

    var params = {
        themeId: req.query.id,
        page: {
            page: 1,
            size: 10
        }
    };

    params.userId = req.rSession.user.userId;


    async.parallel([function(callback) {
        proxy.apiProxy(conf.baseApi.themeListHotEntity, params, callback, conf.baseApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.fillVars.THEMEDATA = {
            entityLength: lo.get(results, '0.data.themeLibs.length', 0),
            page: params.page,
            entityIds: (lo.get(results, '0.data.themeLibs', []) || []).map(function(item) {
                return item.liveId;
            })
        };
        options.fillVars.NOWTIME = new Date().getTime();
        options.renderData.theme = lo.get(results, '0.data', {});
        htmlProcessor(req, res, next, options);
    });
}

/**
 * 话题专题页
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-24T20:02:01+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function pageThemeTopic(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/theme-topic/theme-topic.html'),
        options = {
            filePath: filePath,
            renderData: {

            },
            fillVars: {
                THEMEDATA: {},
            },
        };


    var params = {
        themeId: req.query.id,
        page: {
            page: 1,
            size: 20
        }
    };

    params.userId = req.rSession.user.userId;


    async.parallel([function(callback) {
        proxy.apiProxy(conf.baseApi.themeListHotEntity, params, callback, conf.baseApi.secret, req);
    }], function(err, results) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        options.fillVars.THEMEDATA = {
            entityLength: lo.get(results, '0.data.themeLibs.length', 0),
            page: params.page,
        };
        options.fillVars.NOWTIME = new Date().getTime();
        options.renderData.theme = lo.get(results, '0.data', {});
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

    // 精选专题列表
    ['GET', '/wechat/page/theme', wxAuth(), pageTheme],

    // 系列课专题页
    ['GET', '/wechat/page/theme/channel', wxAuth(), pageThemeChannel],

    // 直播间专题页
    ['GET', '/wechat/page/theme/live', wxAuth(), pageThemeLive],

    // 话题专题页
    ['GET', '/wechat/page/theme/topic', wxAuth(), pageThemeTopic]
];
