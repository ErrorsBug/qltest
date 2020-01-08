let _ = require('underscore');
let resProcessor = require('../../components/res-processor/res-processor');
let proxy = require('../../components/proxy/proxy');
let studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
let conf = require('../../conf');
const requestProcess = require('../../middleware/request-process/request-process')

/**
 * 微博下单接口（返回支付跳转地址）
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-01T11:10:47+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var order = function (req, res, next) {
    var params = _.pick(req.query, 'chargeConfigId', 'giftCount', 'return_url', 'toUserId', 'topicId', 'total_fee', 'type', 'isWall', 'docId','source','ifboth', 'shareKey', 'ch');

    params.userId = req.rSession.user.userId;
    params.caller = 'weapp';
    params.weappVer = req.query.weappVer;


    // 这里参数校验交给后端

    proxy.apiProxy(conf.baseApi.pay.order, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


/**
 * 微博下单接口（返回支付跳转地址）
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-01T11:10:47+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var selectResult = function (req, res, next) {
    var params = _.pick(req.query, 'orderId');

    params.userId = req.rSession.user.userId;
    params.caller = 'weapp';
    params.weappVer = req.query.weappVer;

    // 这里参数校验交给后端
    proxy.apiProxy(conf.weiboApi.getPayResult, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 * 购买免费系列课
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function orderFree(req, res, next) {
    var params = _.pick(req.query, 'chargeConfigId', 'caller', 'weappVer');

    params.userId = req.rSession.user.userId;

    proxy.apiProxy(conf.weiboApi.channel.orderFree, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
}

module.exports = [
    // 下订单
    ['GET', '/api/studio-weapp/order', studioWeappAuth(), order],
    // 获取支付结果
    ['GET', '/api/studio-weapp/selectResult', studioWeappAuth(), selectResult],
    // 购买免费系列课
    ['GET', '/api/studio-weapp/orderFree', studioWeappAuth(), orderFree],
    // 获取三方小程序支付方式
    ['GET', '/api/studio-weapp/getOpsPayType', studioWeappAuth(), requestProcess(conf.baseApi.pay.getOpsPayType, conf.baseApi.secret)],
];
