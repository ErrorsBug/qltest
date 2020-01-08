var path = require('path'),
    _ = require('underscore'),
    async = require('async'),
    lo = require('lodash'),

    clientParams = require('../../middleware/client-params/client-params'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    wxAppAuth = require('../../middleware/auth/1.0.0/wx-app-auth'),
    proxy = require('../../components/proxy/proxy'),
    resProcessor = require('../../components/res-processor/res-processor'),
    htmlProcessor = require('../../components/html-processor/html-processor'),
    conf = require('../../conf'),
    server = require('../../server'),
    IMAGE_VIEW_REDIS_KEY = 'H5_ACTIVITY_IMAGE_VIEW_KEY';

var wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
var querystring = require('querystring');
var activityApi = require('../../api/activity');
var redis = server.getRedisCluster();

// 从朋友圈点进去的链接无法继续分享的兼容方法
const TimeLineCompatibility = (req, res) => {
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = req.path;
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) { url += '?' + searchUrl;}
        res.redirect(url);
        return;
    }
}

async function channelTuiwenHd(req, res, next) {

    TimeLineCompatibility(req, res);
    
    const activityCode = lo.get(req, 'query.actid') || ""

    const result = await proxy.parallelPromise([
        ['isStop', conf.activityApi.template.isStop, {activityCode: activityCode}, conf.baseApi.secret],
        ['channelShare', conf.activityApi.template.channelShare, {activityCode: activityCode}, conf.baseApi.secret],
    ], req);

    const isStop = lo.get(result, 'isStop.data.isHave', 'N') || 'N'
    const channelShare = lo.get(result, 'channelShare.data', {}) || {}

    if(isStop !== 'Y') {
        res.redirect('/wechat/page/activity/over')
        return
    }

    var sysTime = new Date().getTime();
    var filePath = path.resolve(__dirname, '../../../public/activity-react/template-hd-channel-share.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                INIT_DATA: JSON.stringify(channelShare),
            },
            renderData: {
                INIT_DATA: "fromServer: renderData"
            },
        };
    htmlProcessor(req, res, next, options);
}

module.exports = [
    ['GET', '/wechat/page/activity/channel-tuiwen-hd', clientParams(), channelTuiwenHd],
]