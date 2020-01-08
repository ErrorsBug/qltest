var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    conf = require('../../conf');

/**
 * 话题列表
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function channelList (req, res, next) {
    var params = _.pick(req.query, 'liveId', 'clientType', 'pageNum', 'pageSize');

    var userData = req.rSession.user;

    if (userData && userData.userId) {
        params.userId = userData.userId;
    }

    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.channel.list, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.weiboApi.secret, req);
}

module.exports = [

    // 直播间系列课列表
    ['GET', '/api/weibo/channel/list', channelList],

];
