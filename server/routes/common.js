import lo from 'lodash';
import { stringify } from 'querystring';
const wxAuth = require('../middleware/auth/1.0.0/wx-auth');
const weiboAuth = require('../middleware/auth/1.0.0/weibo-auth');
const knowledgeCodeAuth = require('../middleware/knowledge-code-auth');
const appAuth = require('../middleware/auth/1.0.0/app-auth');
const weiboCookie = require('../middleware/weibo-cookie/weibo-cookie');
const autoRoute = require('../middleware/auto-route/auto-route');
const envi = require('../components/envi/envi');
const clientParams = require('../middleware/client-params/client-params');
const conf = require('../conf');
const staticHtml = require('../middleware/static-html').default;
const userTag = require('../middleware/user-tag');
const silentFollow = require('../middleware/silent-follow');

// 微博路由方法
const weiboTopicRoute = require('./weibo/topic.js');
const weiboLiveRoute = require('./weibo/live.js');
const weiboChannelRoute = require('./weibo/channel.js');
const weiboLoginRoute = require('./weibo/login');

const wechatReact = require('./wechat-react');

const channelUniifyHandler = require('./wechat-react/channel').channelUniifyHandler;
const topicHandle =  require('./wechat-react/topic').topicHandle
const topicIntroHandle =  require('./wechat-react/topic-intro').topicIntroHandle;
const newLiveMainHandle =  require('./wechat-react/live').newLiveMainHandle;
const proxy = require('../components/proxy/proxy');


module.exports = [
    // 微信微博登录页（暂用微博的登录页，后续不变化可以抽成公用页）
    ['GET', '/page/login', weiboLoginRoute.pageLogin],

    // 退出登录
    // 因为API不会被Java拦截
    ['GET', '/api/logout', weiboLoginRoute.pageLogout],

    // 话题介绍页与详情页判断
    ['GET', '/topic/:id.htm', weiboCookie(), weiboAuth(), weiboTopicRoute.weiboPageTopic],

    // 系列课主页
    ['GET', '/live/channel/channelPage/:channelId.htm', knowledgeCodeAuth(), silentFollow, (req, res, next) => {
		const queryStr = stringify(lo.get(req, 'query', {}));
	    res.redirect(`/wechat/page/channel-intro?channelId=${lo.get(req, 'params.channelId')}${queryStr ? ('&' + queryStr) : ''}`);
    }],
	// 系列课主页
	['GET', '/wechat/page/channel-intro', knowledgeCodeAuth(), autoRoute({
		weixin: wxAuth({
			allowFree: true
		}),
		weibo: weiboCookie()
    }), 
    silentFollow,
    autoRoute({
		weixin: wechatReact.topicIntroPage(channelUniifyHandler, true),
		weibo: weiboAuth()
    }),
    autoRoute({
		// weixin: ,
		weibo: weiboChannelRoute.pageChannelIndex
	})],

    // 话题介绍页
    ['GET', '/wechat/page/topic-intro', knowledgeCodeAuth(), clientParams(), silentFollow, autoRoute({
        weixin: wxAuth({
            // 允许不登录访问
            allowFree: true
        }),
        weibo: weiboCookie()
    }), autoRoute({
        weixin: staticHtml('TI', 'topicId'),
        weibo: weiboAuth()
    }), 
    autoRoute({
        weixin: wechatReact.topicIntroPage(topicIntroHandle, true),
        weibo: weiboTopicRoute.weiboPageTopicIntro
    })],

	// C端话题介绍页(未购)
	['GET', '/wechat/page/topic-intro-cend', (req, res, next) => {
		res.redirect(`/wechat/page/topic-intro?${stringify(lo.get(req, 'query', {}))}`);
	}],
	// C端话题介绍页(已购)
	['GET', '/wechat/page/topic-intro-cend-auth', (req, res, next) => {
		res.redirect(`/wechat/page/topic-intro?${stringify(lo.get(req, 'query', {}))}`);
	}],

	// C端系列课介绍页(未购)
	['GET', '/wechat/page/channel-intro-cend', (req, res, next) => {
		const channelId = lo.get(req, 'query.channelId', '');
		if(!channelId){
			res.render('500', {
				msg: '缺少系列课id'
			});
		}else{
			res.redirect(`/wechat/page/channel-intro?${stringify(lo.get(req, 'query', {}))}`);

		}
	}],
	// C端系列课介绍页(已购)
	['GET', '/wechat/page/channel-intro-cend-auth', (req, res, next) => {
		const channelId = lo.get(req, 'query.channelId', '');
		if(!channelId){
			res.render('500', {
				msg: '缺少系列课id'
			});
		}else{
			res.redirect(`/wechat/page/channel-intro?${stringify(lo.get(req, 'query', {}))}`);

		}
	}],


    // 话题详情页
    ['GET', '/topic/details', (req, res, next) => {
        if (envi.isPc(req)) {
            req.isPc = true;
        }

        next();
    }, knowledgeCodeAuth(), clientParams(), appAuth(), autoRoute({
        weixin: wxAuth({
            // 允许不登录访问
            allowFree: conf.mode === 'prod'
        }),
        weibo: weiboCookie()
    }), autoRoute({
        weibo: weiboAuth()
    }), autoRoute({
        weixin: wechatReact.thousandLivePage(topicHandle, true),
        weibo: weiboTopicRoute.weiboPageTopic

    })],


    // 直播间主页
    ['GET', '/wechat/page/live/:liveId$', knowledgeCodeAuth(), clientParams(), autoRoute({
        weixin: wxAuth(),
        weibo: weiboCookie()
    }), autoRoute({
        weibo: weiboAuth()
    }), autoRoute({
        weixin: wechatReact.liveStudioApollo(newLiveMainHandle),
        weibo: weiboLiveRoute.pageLiveIndex
    })],


	// 路由跳转
	// 微信微博登录页（暂用微博的登录页，后续不变化可以抽成公用页）
	['GET', '/wechat/page/goUrl', (req, res, next) => {
		proxy.apiProxy(conf.toSourceApi.getDomainUrl, {type: 'main'}, function(err, body) {
			if (err) {
				next();
				return;
			}

			if (lo.get(body, 'state.code') === 0) {
				let domainUrl = lo.get(body, 'data.domainUrl')
				let url = lo.get(req, 'query.url', '')
				const urlTest = domainUrl.replace(/(\w*\:\/\/)/,'').replace(/(\/)$/,'');
				if(lo.get(req,"hostname") !== urlTest ){
					res.redirect(`${domainUrl.replace(/(\/)$/,'')}${url}`);
					return false;
				}
				return false;
			}

			next();
		}, conf.toSourceApi.secret);
	}],

	// 链接定制， 使用场景： 产品想对某一链接做通配处理  现只能通配liveId需要其他的可补充 (注: 只接受传入页面路径)
	// 例如 /wechat/page/redirect?path=/wechat/page/live/profit/withdraw/{liveId}?liveId={liveId}
    ['GET', '/wechat/page/redirect', knowledgeCodeAuth(), clientParams(), appAuth(), wxAuth(), async (req, res, next) => {
		const userId = lo.get(req, 'rSession.user.userId')
		const linkTpl = lo.get(req, 'query.path')
		
		if (linkTpl) {
			let redirectUrl = decodeURIComponent(linkTpl)
			const keywords = []
			const tempObj = {}
			const linkTplArr = redirectUrl.match(/{(.*?)}/g) || []

			if (!linkTplArr || !linkTplArr.length || redirectUrl.indexOf('.') > -1) {
				res.redirect('/wechat/page/recommend');
				return false
			}

			// 去重
			for (let key of linkTplArr) {
				key = key.replace(/{|}/g, '')
				if (!tempObj[key]) {
					keywords.push(key)
					tempObj[key] = 1
				}
			}

			const tasks = []
			keywords.map(key => {
				switch (key) {
					case 'liveId':
						tasks.push(['myLive', conf.baseApi.live.my, { userId }, conf.baseApi.secret])
						break;
				}
			})
			
			if (!tasks.length) {
				res.redirect('/wechat/page/recommend');
				return false
			}

			if (tasks.length > 0) {
				const result = await proxy.parallelPromise(tasks, req);
				const liveId = lo.get(result, 'myLive.data.entityPo.id')

				if (!liveId) {
					res.redirect('/wechat/page/recommend');
					return false
				}

				keywords.forEach(key => {
					switch (key) {
						case 'liveId':
							redirectUrl = redirectUrl.replace(/{liveId}/g, liveId)
							break;
					}
				})
			}

			res.redirect(redirectUrl);
			return false
		}

		res.redirect('/wechat/page/recommend');
	}],
];