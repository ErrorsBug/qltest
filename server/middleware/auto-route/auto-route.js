var conf = require('../../conf'),

    envi = require('../../components/envi/envi'),

    _ = require('underscore');

/**
 * 判断页面类型
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-07T14:24:45+0800
 * @param    {[type]}                           req [description]
 * @return   {[type]}                               [description]
 */
function getPageType(req) {
    var refer = req.get('referer'),
        pageType;

    // 微信平台或微信登录用户去到微信页面
    if (envi.isWeixin(req) ||
        // (req.rSession && req.rSession.user && req.rSession.user.userType === 'weixin')) {
        (req.rSession && req.rSession.user && req.rSession.user.userType !== 'weibo')) {

        pageType = 'weixin';

    // 微博平台或微博登录用户去到微博页面
    } else if (envi.isWeibo(req) ||
        (req.rSession && req.rSession.user && req.rSession.user.userType === 'weibo')) {

        pageType = 'weibo';

    // 从微博页面过来跳微博
    } else if (refer && (refer.indexOf('sina.') >-1 || refer.indexOf('weibo.') > -1)) {

        pageType = 'weibo';

    // 页面参数标识了微博登录去到微博登录
    } else if (req.query.client === 'weibo') {
        pageType = 'weibo';

    // 默认跳微信
    } else {

        pageType = 'weixin';
    }


    return pageType;
}

/**
 * 页面访问自动路由中间件，负责处理需要根据登录账户或ua是微信或微博而跳转到对应的路由。
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-28T15:31:31+0800
 * @param    {Object}     opts
 *      opts.weixin   ---- 微信页面路由/路由方法
 *      opts.weibo    ---- 微博页面路由/路由方法
 * @return   {[type]}    [description]
 */
function autoRoute (opts) {
    var options = opts || {};

    return function (req, res, next) {

        var pageType = getPageType(req);

        switch(pageType) {
            case 'weixin':
                _routeProcess(req, res, next, options.weixin);
                break;
            case 'weibo':
                _routeProcess(req, res, next, options.weibo);
                break;
        }
    };
}

/**
 * 路由处理
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 * @param  {String/Function}   des  为字符串时，作重定向跳转到字符串对应路由，为方法时，则路由交由方法处理，否则执行next
 * @return {[type]}        [description]
 */
function _routeProcess(req, res, next, des) {
    if ('string' === typeof des) {
        res.redirect(des);
    } else if ('function' === typeof des) {
        des(req, res, next);
    } else {
        next();
    }
}



/**
 * 页面访问自动路由中间件，负责处理需要根据登录账户或ua是微信或微博而跳转到对应的路由。
 * @Author   dodomon<dodomon@126.com>
 * @DateTime 2019-04-01 18:46:07+0800
 * @param    {Object}     opts
 *      opts.weixin   ---- 微信浏览器路由方法
 *      opts.other    ---- 其他浏览器路由方法
 * @return   {[type]}    [description]
 */
function autoDeviceRoute (opts) {
    var options = opts || {};

    return function (req, res, next) {

        if (envi.isWeixin(req)) {
            _routeProcess(req, res, next, options.weixin);
        } else {
            _routeProcess(req, res, next, options.other);
        }
    };
}



module.exports = autoRoute;
module.exports.autoDeviceRoute = autoDeviceRoute;



/**
 * 示例：
 *
 * // 对于需要登录授权的页面：
 * ['GET', '/some/common/page/to/A', autoRoute({
 *     weixin: wxAuth(),
 *     weibo: weiboAuth()
 * }), autoRoute({
 *     weixin: AWxPageHandle
 *     weibo: AWeiboPageHandle
 * })]
 *
 * // 对于不需要登录授权的页面：
 * ['GET', '/some/common/page/to/A', autoRoute({
 *     weixin: AWxPageHandle
 *     weibo: AWeiboPageHandle
 * })]
 *
 *
 */
