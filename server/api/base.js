var _ = require('underscore'),

    resProcessor = require('../components/res-processor/res-processor'),
    proxy = require('../components/proxy/proxy'),
    wxAuth = require('../middleware/auth/1.0.0/wx-auth'),
    weiboAuth = require('../middleware/auth/1.0.0/weibo-auth'),
    conf = require('../conf');

/**
 * 获取系统时间
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var sysTime = function(req, res, next) {

    resProcessor.jsonp(req, res, {
        state: {
            code: 0
        },
        data: {
            sysTime: new Date().getTime()
        }
    });
};


module.exports = [
    // 微信登录授权接口
    ['GET', '/api/base/sys-time', sysTime],
    // 健康检查
    ['GET', '/api/base/healthy-detect', (req, res, next) => res.send('nice')]
];
