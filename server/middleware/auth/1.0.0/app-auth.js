var _ = require('underscore'),

    auth = require('./auth'),

    proxy = require('../../../components/proxy/proxy'),
    envi = require('../../../components/envi/envi'),
    resProcessor = require('../../../components/res-processor/res-processor'),

    conf = require('../../../conf');


/**
 * 在路由中添加该方法对app客户端用户登录验证
 * @param  {Object} options 配置项
 *     options.expires           Number           session失效时间，单位秒（s)，选填，默认24小时
 *     options.successRedirect   String           验证成功时的跳转路由字符串。可选，若配置，则跳转到该路由，否则继续执行
 *     options.failureRedirect   String/Function  验证失败时的跳转路由字符串或方法。 若不配置，则不论验证是否通过，均放行
 * @return {[type]}         [description]
 */
var validate = function(opts) {
    opts = opts || {};

    // 验证用户是否登录
    opts.isLogined = function(req, res) {
        var rs = req.rSession || {},
            username = (req.body.username || '').trim(),
            password = (req.body.password || '').trim();

        return rs.user && rs.user.userType === 'app' &&
            ((username && rs.user.username === username) || !username);
    };
    opts.checkUser = function(username, password, req, res, done) {
        let userId = '100000012000002'; // 小强 dev1, 各位大佬留情，为啥别人都是注释掉，我的就删掉

        if (conf.localUserId) {
            userId = conf.localUserId;
        }
        // 作为本地调试
        if (req.get('Host').indexOf('qlchat') < 0 && conf.mode === 'development') {
        // if(true) {
            done(null, {
                "userType": 'app', // 标识是微信登录
                "userId": "2000000545210049", // dev2
                "openId": "o5Ovl1FqFfn8PuBxSRA7SBy04xwE",
                "unionId": "oJ8gu1KC4cuAE3XnuDxBpV99sYXs",
                "headImgUrl": "http://img.qlchat.com/qlLive/userHeadImg/7PACRS47-GZ3J-ITWN-1479908935934-DDWBDGYRID5A.jpg",
                "account": null,
                "mobile": null,
                "email": null,
                "name": "dodomond**",
                "appId": null,
                "mgForums": [],
                "mgLives": []
            });

            return;
        }
        // userId sid 为空验证
        if (!username || !password) {
            req.tipMessage = '用户username或password为空';
            done(null, null);
            return;
        }

        var params = {
            userId: username,
            sid: password
        };

        proxy.apiProxy(conf.appApi.checkLogin, params, function(err, body) {
            if (err) {
                done(err, null);
                return;
            }

            // 验证成功
            if (body && body.state && body.state.code === 0) {
                // 回填username、userType标识
                var userObj = _.extend({
                    userType: 'app', // 标识是app登录
                    username: username
                }, body.data);
                // console.log(body.data, 'body.data=================')
                done(null, userObj);

                // 验证失败
            } else {
                req.tipMessage = body && body.state && body.state.msg;
                console.error('[app checkUser login] params:', params, ' response:', JSON.stringify(body));
                done(null, null);
            }
        }, conf.appApi.secret, req);
    };

    return function(req, res, next) {

        // console.log('[client params] ', req.clientParams);

        // req.body.username = '100003978001750';
        // req.body.password = '0c4273e235904da3a9065e2d8b766c98';

        // 非app环境直接跳过验证
        // if (!envi.getQlchatVersion(req) && !opts.isApp) {
        if (!envi.getQlchatVersion(req)) {
            next();
            return;
        }

        req.body.username = getAppPageQueryParam(req, 'userId') || getAppPageQueryParam(req, 'userid');
        req.body.password = getAppPageQueryParam(req, 'sid');
        auth.validate(opts)(req, res, next);
    };
};


/**
 * 获取app页面中的参数
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-08-09T17:17:49+0800
 * @param    {[type]}                           req [description]
 * @param    {[type]}                           key  要获取的参数的key值
 * @return   {[type]}                               [description]
 */
function getAppPageQueryParam(req, key) {
    var keyV = req.query[key];

    if (!keyV) {
        keyV = req.body[key];
    }

    if (!keyV && req.clientParams) {
        keyV = req.clientParams[key];
    }

    if (keyV === 'undefined') {
        keyV = undefined;
    }
    // console.log(req.clientParams, 'req.clientParams=========', keyV, req.rSession)
    return keyV;
}

module.exports = validate;
module.exports.required = auth.required;
module.exports.validate = validate;
