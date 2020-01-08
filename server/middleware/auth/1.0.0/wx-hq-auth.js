const lo = require('lodash');
const auth = require('./auth');
const proxy = require('../../../components/proxy/proxy');
const resProcessor = require('../../../components/res-processor/res-processor');
const conf = require('../../../conf');


/**
 * 在路由中添加该方法通过unionId从主站获取用户信息
 */


module.exports = function() {


	return async function(req, res, next) {

        const user = lo.get(req, 'rSession.user', '');
        // if(user){
        //     next();
        // }
		const body = await proxy.apiProxyPromise(conf.toSourceApi.getUserInfoByUnionId, {
			unionId: user.unionId
        }, conf.toSourceApi.secret, req);



        if(lo.get(body, 'state.code') === 0 && lo.get(body, 'data.user.userId', '')){
			!user.originUserId ? (user.originUserId = user.userId) : null;//授权域名的用户id
			let userInitialType = user.userType;
            const hqUser = Object.assign(user, lo.get(body, 'data.user', {}),{
				userType: 'weixin', // 标识覆盖为微信登录
				userInitialType, // 标识是原始登录方式
			});//主站点的用户信息
            auth.updateAuthUserSession(req, res, hqUser);
	        next();
        }else if(lo.get(body, 'state.code') === 20013){
	        // 主站查不到用户信息(用户未注册)，跳到主站走一遍授权逻辑
	        const urlRes = await proxy.apiProxyPromise(conf.toSourceApi.getDomainUrl, {
		        type: 'main'
	        }, conf.toSourceApi.secret, req);
	        if(lo.get(urlRes, 'state.code') === 0 && lo.get(urlRes, 'data.domainUrl')){
	        	// console.log('要跳回主站啦要跳回主站啦要跳回主站啦要跳回主站啦要跳回主站啦要跳回主站啦要跳回主站啦');
	        	// console.log(`${lo.get(urlRes, 'data.domainUrl')}api/wx/auth-redirect?redirect_url=${encodeURIComponent(req.protocol + '://' + req.get('Host') + req.originalUrl)}`);
		        res.redirect(`${lo.get(urlRes, 'data.domainUrl')}wechat/page/auth-redirect?redirect_url=${encodeURIComponent(req.protocol + '://' + req.get('Host') + req.originalUrl)}`)
	        }else{
		        resProcessor.error500(req, res, null, '主站域名获取失败');
	        }
        }else{
            resProcessor.error500(req, res, null, '主站授权出错');
        }

	};
};
