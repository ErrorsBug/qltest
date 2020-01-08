var lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    auth = require('../../middleware/auth/1.0.0/auth'),
    conf = require('../../conf');


/**
 * 小程序登录验证接口
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-26T14:08:18+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
 const login = (req, res, next) => {
     let params = {
         code: lo.get(req, 'query.code'),
         encryptedData: lo.get(req, 'query.encryptedData'),
         iv: lo.get(req, 'query.iv'),
         rawData: lo.get(req, 'query.rawData'),
         signature: lo.get(req, 'query.signature'),
         caller: 'weapp'
     };

     proxy.parallelPromise([
         [conf.baseApi.weappAuth, params, conf.baseApi.secret],
     ], req).then(results => {
         var data = results && results[0] || {};
         if (data.state && data.state.code === 0) {
             // 保存用户信息到session
             auth.updateAuthUserSession(req, res, lo.extend({
                 userType: 'weapp'
             }, data.data && data.data.user || {}), {
                 expires: 60 * 60 * 24 * 2 // 缓存2天
             });

             resProcessor.jsonp(req, res, {
                 state: {
                     code: 0,
                     msg: '操作成功'
                 },
                 data: {
                    userInfo: data.data.user, // TODO 要移除
	                 miniSessionKey: data.data.miniSessionKey,
                    sid: req.rSession.sessionId,
                    expires: req.rSession.expires
                 }
             });
         } else {
             resProcessor.jsonp(req, res, data);
         }

     }).catch(function (err) {
         console.error(err);
         resProcessor.error500(req, res, err);
     });
 }

module.exports = [
    ['GET', '/api/weapp/auth/login', login]
];
