var _ = require('underscore'),
    lo = require('lodash'),
    crypto = require('crypto'),

    auth = require('./auth'),

    envi = require('../../../components/envi/envi'),
    proxy = require('../../../components/proxy/proxy'),
    resProcessor = require('../../../components/res-processor/res-processor'),
    urlUtils = require('../../../components/url-utils/url-utils'),
    wxUtils = require('../../../components/wx-utils/wx-utils'),

    conf = require('../../../conf'),

    cookieTimeout = 60 * 60 * 24 * 1000,

    // 旧项目生成的cookie的sessionId对应的key
    jsessionIdCookieKey = 'QLZB_SESSIONID',
    redis3xSession = require('../../../middleware/redis3x-session/redis3x-session'),
    // sessionid 加密因子
    sessionidFeed = 'QiAnLiAo03251450aES';


/**
 * 根据code验证用户
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-30T16:06:13+0800
 * @param    {[type]}                           username [description]
 * @param    {[type]}                           password [description]
 * @param    {[type]}                           req      [description]
 * @param    {[type]}                           res      [description]
 * @param    {Function}                         done     [description]
 * @return   {[type]}                                    [description]
 */
async function checkUser(username, password, req, res, done) {

    // 知识店铺授权后走千聊静默授权流程过来
    if (req.query._kltoqlca) {
        let params = _.pick(req.query, 'code', 'loginType', 'state');
        //用来静默授权后绑定unionId使用
        let userId = lo.get(req, 'query._klUserId','');
        if(userId){
            params.userId = userId;
        }
        proxy.apiProxy(conf.baseApi.bindAndGetUserInfo, params, function(err, body) {
            if (err) {
                done(err, null);
                return;
            }

            // 验证成功
            if (body && body.state && body.state.code === 0) {
                // 回填usertype标识
                var userObj = _.extend({
                    userType: 'studio-weapp', // 标识是微信登录
                }, body.data && body.data.user || {});

                let bindParams = _.pick(req.query, 'appId', 'merchantOpenId');
                bindParams.qlchatUserId = userObj.userId;
                proxy.apiProxy(conf.weappApi.bindUser, bindParams, function(err, body) {
                    if (body && body.state && body.state.code === 0) {
                        // 成功写入session
                        done(null, userObj);
                    } else {
                        done(null, null);
                    }
                }, conf.weappApi.secret);

                // 验证失败
            } else {
                req.tipMessage = body && body.state && body.state.msg;
                done(null, null);
            }
        }, conf.baseApi.secret, req);
    } else {
        done(null, null);
    }
}



/**
 * 在路由中添加该方法对微信客户端用户登录验证
 * @param  {Object} options 配置项
 *     options.expires           Number           session失效时间，单位秒（s)，选填，默认24小时
 *     options.successRedirect   String           验证成功时的跳转路由字符串。可选，若配置，则跳转到该路由，否则继续执行
 *     options.failureRedirect   String/Function  验证失败时的跳转路由字符串或方法。 若不配置，则不论验证是否通过，均放行
 *     options.allowFree        Boolean     是否放行，若为true,则不登录仍然放行
 * @return {[type]}         [description]
 */
var validate = function(opts) {
    opts = opts || {};
    // 验证用户是否登录
    opts.isLogined = function(req, res) {
        var rs = req.rSession || {};
        // if (!req.rSession) {
        //     return false;
        // }

        // return rs.user && rs.user.userType === 'weixin';
        if (opts.ignoreSession) {
            return false;
        }
        return rs.user && rs.user.userType === 'studio-weapp';

    };
    // 获取用户信息登录
    opts.checkUser = function(username, password, req, res, done) {
        var code = req.query.code;
         if (code) {
            // 根据微信授权码(req.query.code)获取用户信息验证
            checkUser(username, password, req, res, done);
        } else {
            done(null, null);
        }
    };

    // 默认跳转失败时去到的页面
    opts.failureRedirect = opts.failureRedirect || async function(req, res, next) {
        var path = req.path,
            isApi = path.indexOf('/api/') > -1,
            ua = (req.headers['user-agent'] || '').toLowerCase(),
            wxLoginPageUrl = '/page/login';

        var pageUrl = 'https' + '://' + req.get('Host') + req.originalUrl;
        // 从知识店铺授权过来，调用接口获取知识店铺unionid的state,走千聊静默授权
        if (req.query.code && req.query._klca) {
            let params = _.pick(req.query, 'code', 'loginType', 'state');
            let state = null;
            let userId = '';
            try {
                let result = await proxy.apiProxyPromise(conf.baseApi.knowledgeCodeAuth, params, conf.baseApi.secret);
                if (result && result.state && result.state.code === 0) {
                    state = result.data.state;
                    userId = result.data.userId;
                }
            } catch (err) {
                console.error(err);
            }

            pageUrl = urlUtils.fillParams({
                _kltoqlca: '1', // 内部标识参数，标识是经过了知识店铺授权再经过千聊静态授权而来
                _klUserId:userId, //用来静默授权后绑定unionId使用
            }, pageUrl, ['code', 'loginType', 'state', 'authDataKey', '_klca']);

            wxUtils.goKnowledgeToQlCodeAuth(req, res, pageUrl, state);
        return;
        }

        pageUrl = urlUtils.fillParams({

        }, pageUrl, ['code', 'state', 'authDataKey', '_klca', '_kltoqlca', '_klUserId']);
        wxUtils.goWxAuth(req, res, pageUrl);

    };

    return function(req, res, next) {
        var sid = lo.get(req, 'query.sid') || lo.get(req, 'body.sid');

        const isApi = /api/.test(req.path);
        if (isApi) {
            if (sid) {
                redis3xSession.getSessionBySid(req, sid).then(function(rs) {
                    req.rSession = rs;
                    auth.required(opts)(req, res, next);
                }, function(err) {
                    auth.required(opts)(req, res, next);
                    console.error(err);

                }).catch(function(err) {
                    auth.required(opts)(req, res, next);
                    console.error(err);

                });
            } else {
                auth.required(opts)(req, res, next);
            }
        } else {
            auth.validate(opts)(req, res, next);
        }


    };
};


module.exports = validate;
module.exports.required = auth.required;
module.exports.validate = validate;
