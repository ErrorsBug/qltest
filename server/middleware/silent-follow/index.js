/*
 * file: 公众号静默关注
 * Created on Mon Apr 22 2019
 * Created by zhouzh1
 * Copyright (c) 2019 Qlchat
 */

const lo = require('lodash');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
const wxUtils = require('../../components/wx-utils/wx-utils');
const urlUtils = require('../../components/url-utils/url-utils');
const envi = require('../../components/envi/envi');

module.exports = async function(req, res, next) {
    // 只有在微信端才能进行静默授权
    if (envi.isWeixin(req)) {
        // 静默授权流程已经完成，放行
        if (req.query._sf == 'Y') {
            next();
        // 获取到静默授权的code，将code上传到后端用来获取openId
        } else if (req.query._silent_follow == 1 && req.query._silent_follow_appId && req.query._silent_follow_userId) {
            let params = {
                code: req.query.code,
                appId: req.query._silent_follow_appId,
                userId: req.query._silent_follow_userId
            }
            proxy.apiProxy(conf.followApi.bindAndGetOpenId, params, function(err, body) {
                if (err) {
                    console.error('上传静默授权的code失败', code);
                    console.error(err);
                }
                if (body && body.state && body.state.code !== 0) {
                    console.error(body.state.msg);
                }
                let pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                let newPageUrl = urlUtils.fillParams({
                    _sf: 'Y'
                }, pageUrl, ['code', 'loginType', 'state', '_silent_follow', '_silent_follow_appId', '_silent_follow_userId']);
                res.redirect(newPageUrl);
            }, conf.followApi.secret, req);
        // 开始静默授权
        } else {
            let userId = lo.get(req, 'rSession.user.userId', '');
            if (userId) {
                // 获取需要静默关注的公众号的appId
                try {
                    let params = {
                        userId,
                        subscription: 'shunt'
                    };
                    let result = await proxy.apiProxyPromise(conf.baseApi.getWxAppId, params, conf.baseApi.secret, req);
                    if (result.state.code === 0) {
                        let appId = result.data.appId;
                        // appId存在，重定向到微信授权页面进行对应公众号的静默授权
                        if (appId) {
                            let pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                            let url = wxUtils.getAuthLoginUrl(urlUtils.fillParams({
                                _silent_follow: 1,
                                _silent_follow_appId: appId,
                                _silent_follow_userId: userId
                            }, pageUrl, []), appId, 'snsapi_base');
                            res.redirect(url);
                        } else {
                            // appId为空，中间件放行
                            next();
                        }
                    } else {
                        // 接口出错，抛出错误
                        throw new Error(result.state.msg);
                    }
                } catch (err) {
                    // 捕获到错误，中间件放行，防止页面无法访问
                    console.error(err);
                    next();
                }
            } else {
                // 找不到userId，直接放行
                next();
            }
        }
    } else {
        next();
    }
}
