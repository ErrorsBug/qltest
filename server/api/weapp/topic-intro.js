var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var weappAuth = require('../../middleware/auth/1.0.0/weapp-auth');
var lo = require('lodash');

const pageTopicIntro = (req, res, next) => {
    /* 请求可能需要的参数*/
    const topicId = lo.get(req, 'query.topicId');
    const businessId = lo.get(req, 'query.topicId');
    const userId = lo.get(req, 'rSession.user.userId');
    let liveId;
    let channelId;

    /* 最终会返回的数据*/
    let responseData = {};

    /* 获取话题基本信息*/
    const getTopic = () => {
        const params = {
            topicId: topicId,
            userId: userId,
            caller: 'weapp',
            businessId: businessId,
            weappVer: lo.get(req, 'query.weappVer'),
        };

        proxy.parallelPromise([
            [conf.weiboApi.topic.get, params, conf.weiboApi.secret],
        ], req).then(result => {
            // 获取到liveId、channelId和话题基本信息
            liveId = lo.get(result, '0.data.topicPo.liveId');
            channelId = lo.get(result, '0.data.topicPo.channelId');

            responseData.topicView = lo.get(result, '0.data');
            // 若话题已被删除则返回错误信息
            if (lo.get(result, '0.data.topicPo.status') == 'delete' || lo.get(result, '0.state.code') == 10001) {
                resProcessor.jsonp(req, res, {
                    state: {
                        code:10001,
                        msg: '话题不存在',
                    },
                });
            } else {
                getInfo()
            }
        }).catch(err => {
            console.error(err);
        });
    }

    /* 获取剩余信息*/
    const getInfo = () => {
        /* 请求参数*/
        let params = {
            topicId: topicId,
            liveId: liveId,
            userId: userId,
            channelId,
            pageNum: 1,
            pageSize: 20,
            caller: 'weapp',
            weappVer: lo.get(req, 'query.weappVer'),
        };

        /* 请求接口*/
        let tasks = [
            [conf.weiboApi.topic.profile, params, conf.weiboApi.secret],
            [conf.weiboApi.topic.auth, params, conf.weiboApi.secret],
            [conf.weiboApi.user.power, params, conf.weiboApi.secret],
            [conf.weiboApi.share.qualify, params, conf.weiboApi.secret],
            [conf.baseApi.channel.vipInfo, params, conf.baseApi.secret],
            [conf.weiboApi.live.get, params, conf.wechatApi.secret],
            [conf.baseApi.channel.isBlack, params, conf.wechatApi.secret],
            [conf.baseApi.live.vipChargeInfo, params, conf.wechatApi.secret],
        ];

        /* 如果是频道话题则添加频道信息接口*/
        if (typeof channelId === 'string') {
            params.channelId = channelId;
            tasks = tasks.concat([
                [conf.weiboApi.channel.info, params, conf.weiboApi.secret],
            ]);
        };

        /* 请求接口*/
        proxy.parallelPromise(tasks, req).then(function (results) {
            /* 放入返回数据*/
            responseData.profile = lo.get(results, '0.data', {});
            responseData.isAuth = lo.get(results, '1.data', {});
            responseData.power = lo.get(results, '2.data', {});
            responseData.qualify = lo.get(results, '3.data', {});
            responseData.vipInfo = lo.get(results, '4.data') || {};
            responseData.live = lo.get(results, '5.data') || {};
            responseData.blackInfo = lo.get(results, '6.data') || {};
            responseData.vipChargeInfo = lo.get(results, '7.data.vipChargeconfig') || [];
            responseData.serverTime = Date.now()


            /* 频道信息放入返回数据*/
            if (channelId) {
                responseData.channel = lo.get(results, '8.data', {});
            }
            /* 如果是加密话题，不将password返回到前端*/
            if (responseData.topicView && responseData.topicView.topicPo) {
                responseData.topicView.topicPo.password = null;
            }

            /* 返回数据*/
            resProcessor.jsonp(req, res, responseData);
        }).catch(function (err) {
            resProcessor.jsonp(req, res, {
                code: 500,
                msg: '请求错误',
            });
            console.error(err);
        });

    }

    getTopic();
};

/**
 * 免费话题报名
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function enterPublic(req, res, next) {
    let params = {
        topicId: lo.get(req, 'query.topicId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.weiboApi.topic.enterPublic, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, result);
    }, conf.weiboApi.secret, req);
}

/**
 * 加密话题报名
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function enterEncrypt(req, res, next) {
    var params = _.pick(req.query, 'topicId', 'password');
    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weapp';
    params.weappVer = lo.get(req, 'query.weappVer');

    proxy.apiProxy(conf.weiboApi.topic.enterEncrypt, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, result);
    }, conf.weiboApi.secret, req);
}

/**
 * 免费系列课下单
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function buyFreeChannel(req, res, next) {
    var params = {
        chargeConfigId: lo.get(req, 'query.chargeConfigId'),
        userId: lo.get(req, 'rSession.user.userId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.apiProxy(
        conf.weiboApi.channel.orderFree,
        params,
        function (err, body) {
            if (err) {
                res.resProcessor.error500(req, res, err);
                return;
            }
            resProcessor.jsonp(req, res, body);
        }, conf.weiboApi.secret, req);
}

module.exports = [
    // 话题介绍页初始数据
    ['GET', '/api/weapp/page/topic/intro', weappAuth(), pageTopicIntro],
    // 免费话题报名
    ['GET', '/api/weapp/topic/enterPublic', weappAuth(), enterPublic],
    // 加密话题报名
    ['GET', '/api/weapp/topic/enterEncrypt', weappAuth(), enterEncrypt],
    // 购买免费频道
    ['GET', '/api/weapp/channel/buyFreeChannel', weappAuth(), buyFreeChannel],
]
