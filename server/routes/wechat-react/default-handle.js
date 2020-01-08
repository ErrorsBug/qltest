import lo from 'lodash';
const conf = require('../../conf');
import { initAppOpenId } from '../../../site/wechat-react/actions/common';
// actions
// import { updateSysTime } from '../../../site/wechat-react/actions/common';

// 默认路由处理
export function defaultHandler (req, res, store, options) {
    if (store) {

        // appolo服务端渲染请求接口需要带上cookies
        store.dispatch({
            type: 'SET_COOKIES',
            cookies: req.cookies
        })

        // 注入服务端时间
        store.dispatch(
            {
                type: 'SYSTIME',
                sysTime: new Date().getTime(),
            }
        );

        store.dispatch(initAppOpenId(lo.get(req, 'rSession.user.appOpenId', '')));
    }

    // 页面是否注入阿里云视频播放器
    if (req.aliVideoPlayerjs) {
        options.renderData.aliVideoPlayerjs = true;
    }

    // 页面是否注入pc浏览器标识
    if (req.isPc) {
        options.renderData.isPc = true;
    }

    // 如果页面存在vc参数，则注入vconsole功能
    if (req.query._vcdebug) {
        options.renderData.isVconsole = true;
    }

	// 如果页面存在stats参数，则注入stats功能
	if (req.query._stats) {
		options.renderData.withStats = true;
		options.fillVars.statsType = req.query._stats;
    }
    
    if (conf.mode === 'prod') {
        options.renderData.isProd = true;
    }

    // conf.update({
    //     resTime: req.query.resTime || 0
    // })

    // console.log('当前设置的resTime', conf.resTime);

    return store;
};
