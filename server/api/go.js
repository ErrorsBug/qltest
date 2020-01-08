var _ = require('underscore'),

    resProcessor = require('../components/res-processor/res-processor'),
    proxy = require('../components/proxy/proxy'),
    wxAuth = require('../middleware/auth/1.0.0/wx-auth'),
    weiboAuth = require('../middleware/auth/1.0.0/weibo-auth'),
    urlUtils = require('../components/url-utils/url-utils'),
    wxUtils = require('../components/wx-utils/wx-utils'),
    envi = require('../components/envi/envi'),
    conf = require('../conf');

/**
 * 微信授权跳转处理方法，用于灰度环境根据code码授权登录跳转
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var goWxAuthPage = function(req, res, next) {
    var url = decodeURIComponent(req.query.target || ''),
        code = req.query.code;

    if (!url) {
        resProcessor.paramMissError(req, res, '缺少跳转页面地址target参数');
        return;
    }

    if (!code) {
        resProcessor.paramMissError(req, res, '缺少微信授权code');
        return;
    }

    url = urlUtils.fillParams({
        code: code,
        loginType: req.query.loginType || 'auth',
        state: req.query.state || Date.now()
    }, url, ['authDataKey', 'client']);

    res.redirect(url);
};

var go = function(req, res, next) {
    if (!req.query.target) {
        res.send('缺少跳转页面地址');
        return;
    }
    res.render('go');
};

var wxLogin = function(req, res, next) {
    // var pageUrl = (conf.mode === 'prod' ? 'https' : req.protocol) + '://' + req.get('Host') + req.originalUrl;
    var pageUrl = decodeURIComponent(req.query.redirect_url || '') ||
        req.get('referrer') ||
        req.get('referer');


    // 针对介绍页的登录授权特殊处理知识店铺
    if (pageUrl && pageUrl.indexOf('/wechat/page/topic-intro') > -1) {
        req._isGoKnowledgeToQlCodeAuth = true;
        req.query.topicId = urlUtils.getUrlParams('topicId', pageUrl);
    } else if (req.query.knowledge) {
        req._isGoKnowledgeToQlCodeAuth = true;
    }


    // 去到登录页（或微信授权）
    wxUtils.goWxAuth(req, res, pageUrl);
};

module.exports = [
    // 微信登录授权接口（手动或自动）
    ['GET', '/api/go/wx-auth', goWxAuthPage],

    // 微信登录接口
    ['GET', '/api/wx/login', wxLogin],

    // 跳转到目标地址并在之前插入一个该历史纪录
    ['GET', '/api/go', go],
    // api/go被微信分享封掉了，加个新地址
    ['GET', '/api/gos', go],

	// 微信授权后跳转到指定地址(用于第三方域名活动调用主站授权)
	['GET', '/wechat/page/auth-redirect', wxAuth(), (req, res, next) => {
        const pageUrl = decodeURIComponent(req.query.redirect_url || '');
        // console.log('授权成功要跳回活动页啦！！授权成功要跳回活动页啦！！授权成功要跳回活动页啦！！授权成功要跳回活动页啦！！');
        // console.log(pageUrl);
        if(pageUrl){
	        res.redirect(pageUrl);
        }else{
	        resProcessor.error500(req, res, null, '缺少redirect_url');
        }
    }],
];
