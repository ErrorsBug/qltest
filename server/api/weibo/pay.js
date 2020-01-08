var _ = require('underscore'),
    lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    weiboAuth = require('../../middleware/auth/1.0.0/weibo-auth'),
    conf = require('../../conf');


/**
 * 微博下单接口（返回支付跳转地址）
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-01T11:10:47+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var pay = function(req, res, next) {
    var params = _.pick(req.body, 'chargeConfigId', 'giftCount', 'return_url', 'toUserId', 'topicId', 'total_fee', 'type', 'isWall', 'docId');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    if (!params.return_url) {
        params.return_url = req.get('referer') || req.get('Referrer');
    }

    // 这里参数校验交给后端

    proxy.apiProxy(conf.weiboApi.pay, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
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
var selectResult = function(req, res, next) {
    var params = _.pick(req.body, 'orderId');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    // 这里参数校验交给后端
    proxy.apiProxy(conf.weiboApi.getPayResult, params, function(err, body) {
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
function orderFree (req, res, next) {
    var params = _.pick(req.body, 'chargeConfigId');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.channel.orderFree, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
}

module.exports = [
    // 下订单
    ['POST', '/api/weibo/pay', weiboAuth(), pay],

    // 获取支付结果
    ['POST', '/api/weibo/selectResult', weiboAuth(), selectResult],

    ['POST', '/api/weibo/orderFree', weiboAuth(), orderFree],
];
