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
    // 用于判断是否需要从旧项目授权登录验证
    isCheckJsession = 'isCheckJsession',

    // sessionid 加密因子
    sessionidFeed = 'QiAnLiAo03251450aES';

var server = require('../../../server');
var redis = server.getRedisCluster();
var callerUtil = require('../../../components/caller-util');
var redisKeyTimeout = 864000;	// 一个月
var whiteHostList = [
	'act.qianliao.net',
	'localhost',
	'127.0.0.1'
]

/**
 * 根据code验证用户
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-30T16:06:13+0800
 * @param    {[type]}                           username [description]
 * @param    {[type]}                           password [description]
 * @param    {[type]}                           req      [description]
 * @param    {[type]}                           res      [description]
 * @param    {Function}                         done     [description]
 * @param    {Function}                         next     [中间件函数]
 * @return   {[type]}                                    [description]
 */
async function checkUser(username, password, req, res, done) {
    // 知识店铺过来，直接失败处理，让失败处理中调用接口获取知识店铺的unionId的state，然后走千聊静默授权
    if (req.query._klca) {
        done(null, null);
    // 知识店铺授权后走千聊静默授权流程过来
    } else if (req.query._kltoqlca) {
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
                    userType: 'weixin', // 标识是微信登录
                }, body.data && body.data.user || {});

                // 兼容旧项目，写入jsession的cookie
                if (body.data && body.data.cookie) {
                    res.cookie(jsessionIdCookieKey, body.data.cookie, {
                        maxAge: cookieTimeout, // expires * 1000, // 毫秒
                        httpOnly: true,
                    });
                    res.cookie(isCheckJsession, 'true', {
                        maxAge: cookieTimeout, // expires * 1000, // 毫秒
                        httpOnly: true,
                    });
				}

                // 成功插入redis
				var key = callerUtil(userId, req)
				redis.set(key, req.rSession.sessionId, function(err, data){
					done(null, userObj);
					redis.expire(key, redisKeyTimeout);
				});

                // 成功写入session
                // done(null, userObj);

                // 验证失败
            } else {
                req.tipMessage = body && body.state && body.state.msg;
                done(null, null);
            }
        }, conf.baseApi.secret, req);
    } else {
        // 非知识店铺授权过来，走千聊授权流程
        let params = _.pick(req.query, 'code', 'loginType', 'state');

        proxy.apiProxy(conf.wechatApi.checkLogin, params, function(err, body) {
            if (err) {
                done(err, null);
                return;
            }

            // 验证成功
            if (body && body.state && body.state.code === 0) {
                // 回填usertype标识
                var userObj = _.extend({
                    userType: 'weixin', // 标识是微信登录
                }, body.data && body.data.user || {});

                // 兼容旧项目，写入jsession的cookie
                if (body.data && body.data.cookie) {
                    res.cookie(jsessionIdCookieKey, body.data.cookie, {
                        maxAge: cookieTimeout, // expires * 1000, // 毫秒
                        httpOnly: true,
                    });
                    res.cookie(isCheckJsession, 'true', {
                        maxAge: cookieTimeout, // expires * 1000, // 毫秒
                        httpOnly: true,
                    });
                }
                // 成功插入redis
				var key = callerUtil(userObj.userId, req)
				redis.set(key, req.rSession.sessionId, function(err, data){
					done(null, userObj);
					redis.expire(key, redisKeyTimeout);
				});

                // 成功写入session
                // done(null, userObj);

                // 验证失败
            } else {
                req.tipMessage = body && body.state && body.state.msg;
                done(null, null);
            }
        }, conf.wechatApi.secret, req);
    }
}

/**
 * 兼容旧项目使有jessionid验证用户
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-30T16:39:23+0800
 * @param    {[type]}                           username [description]
 * @param    {[type]}                           password [description]
 * @param    {[type]}                           req      [description]
 * @param    {[type]}                           res      [description]
 * @param    {Function}                         done     [description]
 * @return   {[type]}                                    [description]
 */
function jsessionIdCheckUser(username, password, req, res, done) {
    var params = {
        cookieValue: req.cookies[jsessionIdCookieKey],
    };
    // 根据jsessionid获取用户信息
    proxy.apiProxy(conf.wechatApi.checkLoginFromJSessionId, params, function(err, body) {
        if (err) {
            done(err, null);
            return;
        }

        // 验证成功
        if (body && body.state && body.state.code === 0) {
            // 回填usertype标识
            var userObj = _.extend({
                userType: 'weixin', // 标识是微信登录
            }, body.data && body.data.user || {});

			// 成功插入redis
			var userId = lo.get(userObj, 'userId', '')
			if(userId) {
				var key = callerUtil(userId, req)
				redis.set(key, req.rSession.sessionId, function(err, data){
					done(null, userObj);
					redis.expire(key, redisKeyTimeout);
                });
                res.cookie(isCheckJsession, 'true', {
                    maxAge: cookieTimeout, // expires * 1000, // 毫秒
                    httpOnly: true,
                });
			}

            // 成功写入session
            // done(null, userObj);

            // 验证失败
        } else {
            req.tipMessage = body && body.state && body.state.msg;
            done(null, null);
        }
    }, conf.wechatApi.secret, req);
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
        if (!rs.user) {
            res.cookie(isCheckJsession, '', { expires: new Date(0)})
			return false
		}

		// 某些域名直接不检查redis
		if(whiteHostList.find((v) => {
			var host = req.hostname || req.headers['host'] || ''
			return host.indexOf(v) > -1
		}) || (conf.mode !== 'prod')) {
			return rs.user && rs.user.userType === 'weixin'
		}

		var userId = lo.get(rs, 'user.userId','')
		var key = callerUtil(userId, req)
		return new Promise(reslove => {
			redis.get(key, function (err, data) {
				// opts.redisExpireKey = key
				// opts.redisExpireValue = data
                // res.cookie(jsessionIdCookieKey, '', { expires: new Date(0)})
				if(!data) {
                    redis.set(key, rs.sessionId, function (err, data) {
                        reslove(rs.user && (rs.user.userType === 'weixin') && (data == rs.sessionId));
						redis.expire(key, redisKeyTimeout);
					});
                } else {
                    if (data !== rs.sessionId) {
                        res.cookie(isCheckJsession, '', { expires: new Date(0)})
                    }
                    reslove(rs.user && (rs.user.userType === 'weixin') && (data == rs.sessionId));
				}
			})
		})

        // return rs.user && rs.user.userType === 'weixin';
    };
    // 获取用户信息登录
    opts.checkUser = function(username, password, req, res, done) {
		var code = req.query.code;
		// 作为本地调试
        if (conf.localUserId || conf.mode === 'development') {

            // res.cookie(jsessionIdCookieKey, '4F2F79326F6476794335546863587961555A652B4A6171703554387376584370373149576656346B3234733D', {
            //     // maxAge: 0, //expires * 1000,
            //     httpOnly: true,
            // });


            let userId = '100000012000002'; // 小强 dev1, 各位大佬留情，为啥别人都是注释掉，我的就删掉

            if (conf.localUserId) {
                userId = conf.localUserId;
            }

	        // if(req.query.testuserid){
		     //    userId = req.query.testuserid
	        // }
			var key = callerUtil(userId, req)
			redis.set(key, req.rSession.sessionId, function(err, data){
				done(null, {
					'userType': 'weixin', // 标识是微信登录
					'unionId': 'o8YuyszTvnufDrSkFqID1LMFkmtw', // dodomon DEV1
					'name': 'dodomon', // dodomon
                    'headImgUrl': 'http://img.qlchat.com/qlLive/userHeadImg/7PACRS47-GZ3J-ITWN-1479908935934-DDWBDGYRID5A.jpg', // dodomon
                    createTime: 1,
					userId: userId,
					account: null,
					mobile: null,
					email: null,
					appId: null,
					mgForums: [],
					mgLives: [],
					appOpenId: ''
				});
			});

            return;
        }

        // 当旧项目完全迁移后可删除以下机制
        // 此处添加兼容旧项目session验证登录机制
        if (!code && req.cookies[jsessionIdCookieKey] && !req.cookies[isCheckJsession] ) {
			jsessionIdCheckUser(username, password, req, res, done);
        } else if (code) {
			// 根据微信授权码(req.query.code)获取用户信息验证
            checkUser(username, password, req, res, done);
        } else {
			done(null, null);
			// if(req.rSession && req.rSession.userId) {
			// 	var key = callerUtil(req.rSession.userId, req)
			// 	redis.set(key, '', function (err, data) {
			// 		done(null, null);
			// 	})
			// } else {
			//
			// }
        }
    };

    // 默认跳转失败时去到的页面
    opts.failureRedirect = opts.failureRedirect || async function(req, res, next) {
        var path = req.path,
            isApi = path.indexOf('/api/') > -1,
            ua = (req.headers['user-agent'] || '').toLowerCase(),
            wxLoginPageUrl = '/page/login';


        // 接口调用
        if (isApi) {
            req.authFailureData = {
                state: {
                    code: 110,
                    msg: '无权限访问',
                },
                data: {
                    url: '/page/login',
                },
            };
            resProcessor.forbidden(req, res, req.authFailureData);

        // 页面访问
        } else {
            var pageUrl = (conf.mode === 'prod' ? 'https' : req.protocol) + '://' + req.get('Host') + req.originalUrl;
	        const host = req.get('Host');

            // 从知识店铺授权过来，调用接口获取知识店铺unionid的state,走千聊静默授权
            if (req.query.code && req.query._klca && envi.isWeixin(req)) {
                let params = _.pick(req.query, 'code', 'loginType', 'state');
	            params.domain = host.split('.')[0];
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
        }
    };

    return function(req, res, next) {

        // 判断为app内访问，则不使用微信登录中间件处理登录
        if (envi.getQlchatVersion(req)) {
            next();
            return;
        }

        // 无验证码 且无wt登录cookie，且中间件开放了允许放行，则放行
        if (opts.allowFree && !req.query.code && !req.cookies[jsessionIdCookieKey]) {
            if(Object.prototype.toString.call(opts.allowFree) === '[object Function]'){
                if(opts.allowFree(req)){
                    next();
                    return;
                }
            }else{
                next();
                return;
            }
        }

        auth.validate(opts)(req, res, next);
    };
};


module.exports = validate;
module.exports.required = auth.required;
module.exports.validate = validate;
