var lo = require('lodash'),
    
    rawBody = require('../middleware/raw-body/raw-body'),
    resProcessor = require('../components/res-processor/res-processor'),
    proxy = require('../components/proxy/proxy'),
    conf = require('../conf');

/**
 * 微博消息验证接口
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-16T14:01:31+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function weiboMessageValidate (req, res, next) {
    var params = req.query || {};

    proxy.apiProxy(conf.weiboApi.messageValidate, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        if (lo.get(body, 'state.code') === 0) {
            res.status(200).send(body.data.echostr);
        } else {
            res.status(403).send('验证失败！');
        }

    }, conf.weiboApi.secret);
}

/**
 * 微博消息处理接口
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-19T13:46:26+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function weiboMessageSend (req, res, next) {
    var params = req.query;

    params.poststr = req.rawBody;

    proxy.apiProxy(conf.weiboApi.messageValidate, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        res.status(200).send(body.data.echostr);
    }, conf.weiboApi.secret);
}

module.exports = [
    // 微博消息验证接口
    ['GET', '/api/message/weibo', weiboMessageValidate],

    ['POST', '/api/message/weibo', rawBody(), weiboMessageSend]
];
