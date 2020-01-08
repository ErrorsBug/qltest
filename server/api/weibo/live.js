var _ = require('underscore'),
    lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    weiboAuth = require('../../middleware/auth/1.0.0/weibo-auth'),
    conf = require('../../conf');

/**
 * 关注、取关直播间
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function doAttention(req, res, next) {
    var params = _.pick(req.body, 'liveId', 'status');

    params.status = params.status === 'true' ? 'Y' : 'N';
    params.caller = 'weibo';

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.seriesPromise([
        [conf.weiboApi.live.focus, params, conf.weiboApi.secret],
        [conf.weiboApi.live.followNum, params, conf.weiboApi.secret],
    ], req).then(function (result) {
        var followStatus = result[0].data;
        var follwerNum = result[1].data.follwerNum;

        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '操作成功' },
            data: { isFollow: followStatus.isFollow, isAlert: followStatus.isAlert, follwerNum: follwerNum },
        });
    }).catch(function (err) {
        resProcessor.error500(req, res, err);
        return;
    });
}


/**
 * 开启、关闭通知
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function doNotice(req, res, next) {
    var params = _.pick(req.body, 'liveId', 'status');

    params.status = params.status === 'true' ? 'Y' : 'N';
    params.caller = 'weibo';

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.weiboApi.live.alert, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, result);
    }, conf.weiboApi.secret, req);
}

module.exports = [

    // 关注直播间
    ['POST', '/api/weibo/live/doAttention', weiboAuth(), doAttention],

    // 开启关闭通知
    ['POST', '/api/weibo/live/do-notice', weiboAuth(), doNotice],
];
