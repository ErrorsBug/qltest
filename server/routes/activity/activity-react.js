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

async function activityCoupon(req, res, next) {

    TimeLineCompatibility(req, res);
    
    const activityCode = lo.get(req, 'query.activityCode') || ""
    const channelId = lo.get(req, 'query.channelId') || ""

    const result = await proxy.parallelPromise([
        ['channelInfo', conf.baseApi.getSimpleChannel, {id: channelId}, conf.baseApi.secret],
        ['couponInfo', conf.baseApi.coupon.activityCouponObj, {codeId: activityCode}, conf.baseApi.secret],
    ], req);

    const channelInfo = lo.get(result, 'channelInfo.data.channel', {}) || {}
    const couponInfo = lo.get(result, 'couponInfo.data.promotionDto', {}) || {}

    var sysTime = new Date().getTime();
    var filePath = path.resolve(__dirname, '../../../public/activity-react/receive-activity-coupon.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                INIT_DATA: {
                    channelInfo,
                    couponInfo,
                }
            },           
            renderData: {},
        };
    htmlProcessor(req, res, next, options);
}

async function activityCommunicateTrain(req, res, next) {

    const albumId = lo.get(req, 'query.albumId') || ""

    var filePath = ''

    switch (albumId) {
        case '0000000001':
            filePath = path.resolve(__dirname, '../../../public/activity-react/communicate-train.html')
            break
        case '0000000002':
            filePath = path.resolve(__dirname, '../../../public/activity-react/chinese-album.html')
            break
        default:
            filePath = path.resolve(__dirname, '../../../public/activity-react/common-activity.html')
    }

    var sysTime = new Date().getTime();
    var options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                INIT_DATA: {
                }
            },           
            renderData: {},
        };

    // console.log("options =====",options)

    htmlProcessor(req, res, next, options);
}

async function activityEnd(req, res, next) {

	var filePath = path.resolve(__dirname, '../../../public/activity-react/activity-end-page.html'),
		options = {
			filePath: filePath,
			fillVars: {
				INIT_DATA: {}
			},
			renderData: {},
		};
	htmlProcessor(req, res, next, options);
}

module.exports = [
    ['GET', '/wechat/page/activity/activity-coupon',  clientParams(),  appAuth(), wxAuth(), activityCoupon],
	['GET', '/wechat/page/activity/activity-end',  clientParams(),  appAuth(), wxAuth(), activityEnd],
    ['GET', '/wechat/page/album',  clientParams(),  appAuth(), wxAuth(), activityCommunicateTrain],
]