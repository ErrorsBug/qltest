var _ = require('underscore'),
    crypto = require('crypto'),

    auth = require('./auth'),

    envi = require('../../../components/envi/envi'),
    urlUtils = require('../../../components/url-utils/url-utils'),
    weiboUtils = require('../../../components/weibo-utils/weibo-utils'),
    proxy = require('../../../components/proxy/proxy'),
    resProcessor = require('../../../components/res-processor/res-processor'),

    cookieTimeout = 60 * 60 * 24 * 1000,

    // 旧项目生成的cookie的sessionId对应的key
    jsessionIdCookieKey = 'QLZB_SESSIONID',

    conf = require('../../../conf');


/**
 * 判断是否登录
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-13T14:12:05+0800
 * @param    {[type]}                           req [description]
 * @return   {Boolean}                              [description]
 */
function isLogined(req, res) {
    var rs = req.rSession || {};

    return rs.user && rs.user.userType === 'weibo';
}

/**
 * 获取用户信息验证登录方法
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-13T14:08:44+0800
 * @param    {[type]}                           username [description]
 * @param    {[type]}                           password [description]
 * @param    {[type]}                           req      [description]
 * @param    {[type]}                           res      [description]
 * @param    {Function}                         done     [description]
 * @return   {[type]}                                    [description]
 */
function checkUser(username, password, req, res, done) {


    // 作为本地调试
    if (conf.localUserId || conf.mode === 'development') {
        let userId = '100000012000002'; // 小强 dev1, 各位大佬留情，为啥别人都是注释掉，我的就删掉

        if (conf.localUserId) {
            userId = conf.localUserId;
        }


        done(null, {
            userId,
            "userType": 'weibo', // 标识是微博登录
            "openId": null,
            "unionId": null,
            "headImgUrl": "http://img.qlchat.com/qlLive/userHeadImg/9E945CAA-EE92-43DE-8366-E9D172C50F07-IWFR9HVG6W.jpg",
            "account": null,
            "mobile": null,
            "email": null,
            "name": "fisherwj",
            "appId": null,
            "mgForums": [],
            "mgLives": []
        });

        return;
    }


    var params = _.pick(req.query, 'code', 'state');

    var pageUrl = (conf.mode === 'prod'? 'https': req.protocol) + '://' + req.get('Host') + req.originalUrl;
    var originPageUrl = urlUtils.fillParams({

    }, pageUrl, ['code']);

    params.redirectUrl = originPageUrl;

    if (params.code) {
        proxy.apiProxy(conf.weiboApi.checkLogin, params, function(err, body) {
            if (err) {
                done(err, null);
                return;
            }

            // 验证成功
            if (body && body.state && body.state.code === 0) {
                // 回填usertype标识
                var userObj = _.extend({
                    userType: 'weibo', // 标识是微博登录
                }, body.data && body.data.user || {});

                // 兼容旧项目，写入jsession的cookie
                if (body.data && body.data.cookie) {
                    res.cookie(jsessionIdCookieKey, body.data.cookie, {
                        maxAge: cookieTimeout, //expires * 1000, // 毫秒
                        httpOnly: true,
                    });
                }

                // 成功写入session
                done(null, userObj);

                // 验证失败
            } else {
                req.tipMessage = body && body.state && body.state.msg;
                console.error('[weibo user login] params:', params, ' response:', JSON.stringify(body));
                done(null, null);
            }
        }, conf.weiboApi.secret, req);
    } else {
        done(null, null);
    }
}


/**
 * 验证失败路由处理
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-13T14:11:20+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function failureRedirect(req, res, next) {
    var path = req.path,
        // isPage = path.indexOf('/page/') > -1,
        isApi = path.indexOf('/api/') > -1,
        // ua = req.headers['user-agent'].toLowerCase(),
        loginPageUrl = '/page/login';

    // 接口提示
    if (isApi) {
        req.authFailureData = {
            state: {
                code: 110,
                msg: '无权限访问'
            },
            data: {
                url: '/page/login'
            }
        };
        resProcessor.forbidden(req, res, req.authFailureData);

        // 其它情况
    } else {
        var refer = req.get('referer') || req.get('referrer'),
            pageUrl = (conf.mode === 'prod'? 'https': req.protocol) + '://' + req.get('Host') + req.originalUrl;

        // 直接授权登录
        if (envi.isWeibo(req) || (refer && (refer.indexOf('sina.') > -1 || refer.indexOf('weibo.') > -1))) {
            pageUrl = weiboUtils.getAuthLoginUrl(pageUrl);
            res.redirect(pageUrl);

        // 其它情况去到登录页
        } else {
            // 记录来源页面地址
            req.flash('_loginRedirectUrl', pageUrl);

            // 去到微信微博登录页
            res.redirect(loginPageUrl);
        }
    }
}

/**
 * 在路由中添加该方法对微博客户端用户登录验证
 * 注：该中间件提供绕过该验证中间件方式------req._skipWeiboAuth = true;
 * @param  {Object} options 配置项
 *     options.expires           Number           session失效时间，单位秒（s)，选填，默认24小时
 *     options.successRedirect   String           验证成功时的跳转路由字符串。可选，若配置，则跳转到该路由，否则继续执行
 *     options.failureRedirect   String/Function  验证失败时的跳转路由字符串或方法。 若不配置，则不论验证是否通过，均放行
 * @return {[type]}         [description]
 */
var validate = function(opts) {
    opts = opts || {};

    // 验证用户是否登录
    opts.isLogined = isLogined;

    // 获取用户信息登录
    opts.checkUser = checkUser;

    // 默认跳转失败时去到的页面
    opts.failureRedirect = opts.failureRedirect || failureRedirect;


    return function(req, res, next) {
        // 提供绕过中间件机制
        if (req._skipWeiboAuth) {
            next();
            return;
        }

        auth.validate(opts)(req, res, next);
    };
};

module.exports = validate;
module.exports.required = auth.required;
module.exports.validate = validate;
