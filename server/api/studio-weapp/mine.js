var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
var lo = require('lodash');
var requestProcess = require('../../middleware/request-process/request-process');

const getFollowerLive = (req, res, next) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'follower',
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'studio-weapp',
        weappVer: req.query.weappVer,
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
        caller: 'studio-weapp',
        weappVer: req.query.weappVer,        
    },
    {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'manager',
        page: {
            page: 1,
            size: 20
        },
        caller: 'studio-weapp',
        weappVer: req.query.weappVer,        
    },
    {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'follower',
        page: {
            page: req.query.page,
            size: req.query.size
        },
        caller: 'studio-weapp',
        weappVer: req.query.weappVer,        
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

module.exports = [
    // 我参与的话题列
    ['GET', '/api/studio-weapp/mine/joined-topic', studioWeappAuth(), requestProcess(conf.baseApi.myJoinTopicData, conf.baseApi.secret)],

    // 我关注的直播间
    ['GET', '/api/studio-weapp/mine/follower-live', studioWeappAuth(), getFollowerLive],
    // 我关注的直播间 begin
    ['GET', '/api/studio-weapp/mine/follower-init', studioWeappAuth(), getFollowerInit],

    // 获取购买记录列表
    ['GET', '/api/studio-weapp/mine/purchase-record', studioWeappAuth(), requestProcess(conf.baseApi.getPurchaseRecord, conf.baseApi.secret)],
    
    // 个人中心数据概览
    ['GET', '/api/studio-weapp/mine/preview', studioWeappAuth(), requestProcess(conf.baseApi.selfCenter, conf.baseApi.secret)],
    
    // 最近学习
    ['GET', '/api/studio-weapp/mine/recent-learning', studioWeappAuth(), requestProcess(conf.baseApi.recentLearning, conf.baseApi.secret)],

    // vip购买记录
    ['GET', '/api/studio-weapp/mine/vip-purchase-record', studioWeappAuth(), requestProcess(conf.baseApi.vipPurchaseRecord, conf.baseApi.secret)],

]
