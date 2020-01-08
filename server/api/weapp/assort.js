var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var weappAuth = require('../../middleware/auth/1.0.0/weapp-auth');
var lo = require('lodash');


/**
 * 获取大分类页初始化数据
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const getInitData = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        parentId: lo.get(req, 'query.tagId'),
        tagId: lo.get(req, 'query.tagId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.parallelPromise([
        [conf.baseApi.getTagList, params, conf.baseApi.secret],
        [conf.baseApi.getBanners, {...params, twUserTag: lo.get(req, 'query.twUserTag', '')}, conf.baseApi.secret],
        [conf.baseApi.getRecommendTopics,  lo.extend({}, params, {page: {page: 1, size: 100}}), conf.baseApi.secret],
        [conf.baseApi.getHotLives,  lo.extend({}, params, {page: {page: 1, size: 4}, isMore: 'N'}), conf.baseApi.secret],
        [conf.baseApi.getHotChannels, lo.extend({}, params, {page: {page: 1, size: 100}}), conf.baseApi.secret],
    ], req).then(results => {
        let nowTime = new Date().getTime();

        resProcessor.jsonp(req, res, {
            state: {
                code: 0,
                msg: '操作成功'
            },
            data: {
                results, nowTime
            }
        });
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};

const getAssortHotLive = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        tagId: lo.get(req, 'query.tagId'),
        isMore: 'Y',
        weappVer: lo.get(req, 'query.weappVer'),
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'weapp'
    };

    proxy.parallelPromise([
        [conf.baseApi.getHotLives, params, conf.baseApi.secret]
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
};

const getSpeciesTopics = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        tagId: lo.get(req, 'query.tagId'),
        weappVer: lo.get(req, 'query.weappVer'),
        page: {
            page: lo.get(req, 'query.page'),
            size: lo.get(req, 'query.size')
        },
        caller: 'weapp'
    };

    proxy.parallelPromise([
        [conf.baseApi.getHotTopics, params, conf.baseApi.secret],
    ], req).then(results => {
        let nowTime = new Date().getTime();
        resProcessor.jsonp(req, res, {
            state: {
                code: 0,
                msg: '操作成功'
            },
            data: {
                results, nowTime
            }
        });
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};

const getSpeciesInitData = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        parentId: lo.get(req, 'query.parentTagId'),
        tagId: lo.get(req, 'query.tagId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.parallelPromise([
        [conf.baseApi.getTagList, params, conf.baseApi.secret],
        [conf.baseApi.getHotTopics,  lo.extend({}, params, {page: {page: lo.get(req, 'query.page'), size: lo.get(req, 'query.size')}}), conf.baseApi.secret],
    ], req).then(results => {
        let nowTime = new Date().getTime();
        resProcessor.jsonp(req, res, {
            state: {
                code: 0,
                msg: '操作成功'
            },
            data: {
                results, nowTime
            }
        });
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};

var chargeCourseList = function (req, res, next) {
    var params = {
        // page: {
        //     page: lo.get(req, 'query.page'),
        //     size: lo.get(req, 'query.size'),
        // },
        offset: req.query.offset,
        pageSize: req.query.pageSize,
        tagId: req.query.tagId,
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.indexRecommend, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}


module.exports = [
    // 获取购买记录列表
    ['GET', '/api/weapp/assort/init-data', weappAuth(), getInitData],

    // 推荐课程列表
    ['GET', '/api/weapp/assort/charge/course-list', weappAuth(), chargeCourseList],
]
