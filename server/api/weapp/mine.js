var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var weappAuth = require('../../middleware/auth/1.0.0/weapp-auth');
var lo = require('lodash');
var requestProcess = require('../../middleware/request-process/request-process');

/**
 * 获取参与的话题
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const myJoinTopicData = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.parallelPromise([
        [conf.baseApi.myJoinTopicData, params, conf.baseApi.secret],
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

const getFollowerLive = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'follower',
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.parallelPromise([
        [conf.baseApi.findLiveEntity, params, conf.baseApi.secret],
    ], req).then(results => {
        resProcessor.jsonp(req, res, results && results[0] || {});
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};


const getFollowerInit = (req, res, next) => {
    let params = [{
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'creater',
        page: {
            page: 1,
            size: 20
        },
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    },
    {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'manager',
        page: {
            page: 1,
            size: 20
        },
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    },
    {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'follower',
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    }];
    let responseData = {};
    proxy.parallelPromise([
        [conf.baseApi.findLiveEntity, params[0], conf.baseApi.secret],
        [conf.baseApi.findLiveEntity, params[1], conf.baseApi.secret],
        [conf.baseApi.findLiveEntity, params[2], conf.baseApi.secret],
    ], req).then(results => {
        responseData.creater =results && results[0] || {};
        responseData.manager =results && results[1] || {};
        responseData.follower =results && results[2] || {};

        resProcessor.jsonp(req, res,responseData );
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};


const getPurchaseRecord = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        type: req.query.type,
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.parallelPromise([
        [conf.baseApi.getPurchaseRecord, params, conf.baseApi.secret],
    ], req).then(results => {
        resProcessor.jsonp(req, res, results && results[0] || {});
    }).catch(function (err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};


module.exports = [
    // 我参与的话题列表
    ['GET', '/api/weapp/mine/joined-topic', weappAuth(), myJoinTopicData],

    // 我关注的直播间
    ['GET', '/api/weapp/mine/follower-live', weappAuth(), getFollowerLive],
    // 我关注的直播间 begin
    ['GET', '/api/weapp/mine/follower-init', weappAuth(), getFollowerInit],

    // 获取购买记录列表
    ['GET', '/api/weapp/mine/purchase-record', weappAuth(), getPurchaseRecord],
    
    // 个人中心数据概览
    ['GET', '/api/weapp/mine/preview', weappAuth(), requestProcess(conf.baseApi.selfCenter, conf.baseApi.secret)],
    
    // 最近学习
    ['GET', '/api/weapp/mine/recent-learning', weappAuth(), requestProcess(conf.baseApi.recentLearning, conf.baseApi.secret)],

    // vip购买记录
    ['GET', '/api/weapp/mine/vip-purchase-record', weappAuth(), requestProcess(conf.baseApi.vipPurchaseRecord, conf.baseApi.secret)],

    // 提交用户信息和设备信息
    ['POST', '/api/weapp/mine/feedback-info', weappAuth(), requestProcess(conf.baseApi.feedbackInfo, conf.baseApi.secret)],

    // 获取对应业务优惠券
    ['GET', '/api/weapp/mine/coupon-list-by-business', weappAuth(), requestProcess(conf.couponApi.coupon.myCouponList, conf.couponApi.secret)],

    // 获取我的优惠券列表的每个类型的总个数
    ['GET', '/api/weapp/mine/coupon-count', weappAuth(), requestProcess(conf.couponApi.coupon.queryCouponCount, conf.couponApi.secret)],

    // 获取对应类型优惠券
    ['GET', '/api/weapp/mine/coupon-list-by-type', weappAuth(), requestProcess(conf.couponApi.coupon.queryCouponListByType, conf.couponApi.secret)],
]
