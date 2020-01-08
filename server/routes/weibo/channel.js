var path = require('path'),
    _ = require('underscore'),
    async = require('async'),
    lo = require('lodash'),

    weiboAuth = require('../../middleware/auth/1.0.0/weibo-auth'),
    clientParams = require('../../middleware/client-params/client-params'),

    proxy = require('../../components/proxy/proxy'),
    resProcessor = require('../../components/res-processor/res-processor'),
    htmlProcessor = require('../../components/html-processor/html-processor'),
    conf = require('../../conf');

/**
 * 直播间主页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageChannelIndex (req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/weibo/page/channel-index/channel-index.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
            renderData: {

            },
        };
    var channelId = req.query.channelId;

    var params = {
        channelId: channelId,
        clientType: 'weibo',
        caller: 'weibo'
    };

    var tasks = [
        ['channelInfo', conf.weiboApi.channel.info, params, conf.weiboApi.secret],
        ['userList', conf.weiboApi.channel.userList, params, conf.weiboApi.secret],
        ['topicList', conf.weiboApi.topic.list, lo.extend({}, params, {pageNum: 1, pageSize: 20}), conf.weiboApi.secret],
        ['topicCount', conf.weiboApi.channel.topicCount, params, conf.weiboApi.secret],
    ];

    var userData = req.rSession.user;

    if (userData && userData.userId) {
        params.userId = userData.userId;

        tasks.push(['chargeStatus', conf.weiboApi.channel.chargeStatus, params, conf.weiboApi.secret]);
    }

    proxy.parallelPromise(tasks, req)
        .then(function (results) {
            var chargeConfigs = lo.get(results, 'channelInfo.data.chargeConfigs', []);
            var chargeConfigsStr = chargeConfigs.map(function (item) {
                return '￥' + item.amount + '/' + item.chargeMonths + '个月';
            }).join('、');

            options.renderData = _.extend({},
                options.renderData,
                lo.get(results, 'channelInfo.data'),
                {
                    liveId: lo.get(results, 'channelInfo.data.liveId'),
                    userList: lo.get(results, 'userList.data.payUserHeadImages'),
                    userCount: lo.get(results, 'userList.data.payUserCount'),
                    chargePos: lo.get(results, 'chargeStatus.data.chargePos'),
                    ticketMoney: chargeConfigs.length > 0 &&
                                 lo.get(results, 'channelInfo.data.chargeConfigs[0].amount', []),
                    chargeConfigsStr: chargeConfigsStr,
                }
            );

            options.fillVars.CHANNEL_ID = channelId;
            options.fillVars.LIVE_ID = lo.get(results, 'channelInfo.data.channel.liveId');
            options.fillVars.TOPIC_LIST = encodeURIComponent(JSON.stringify(lo.get(results, 'topicList.data.topicList', [])).replace(/'/g, '__quote__'));
            options.fillVars.TOPIC_COUNT = lo.get(results, 'topicCount.data.topicNum');
            options.fillVars.CHANNEL_INTRO = encodeURIComponent((lo.get(results, 'channelInfo.data.channel.description', '') || '').replace(/'/g, '__quote__'));
            options.fillVars.CHARGE_CONFIGS = chargeConfigs;
            options.fillVars.CHARGE_CONFIGS_STR = chargeConfigsStr;
            options.fillVars.CHARGE_PO = lo.get(results, 'chargeStatus.data.chargePos');

            htmlProcessor(req, res, next, options);
        })
        .catch(function (err) {
            console.error(err);
            res.render('500');
        });
}

module.exports = [
    // 系列课主页
    // ['GET', '/live/channel/channelPage/:channelId.htm', pageChannelIndex],
];

module.exports.pageChannelIndex = pageChannelIndex;
