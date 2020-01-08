var path = require('path'),
    _ = require('underscore'),
    async = require('async'),
    lo = require('lodash'),

    clientParams = require('../../middleware/client-params/client-params'),
    weiboAuth = require('../../middleware/auth/1.0.0/weibo-auth.js'),

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
function pageLiveIndex(req, res, next) {
    // var mockData = require('./live-index.mock.json')
    var liveId = req.params.liveId;
    // var openId = req.query.openId;
    // var shareKey = req.query.shareKey;
    // var lshareKey = req.query.lshareKey;

    var filePath = path.resolve(__dirname, '../../../public/weibo/page/live-index/live-index.html'),
        options = {
            filePath: filePath,
            fillVars: {
                LIVE_ID: liveId,
            },
            renderData: {},
        };

    var params = {
        liveId: liveId,
        clientType: 'weibo',
        caller: 'weibo',
        pageSize: 20,
        pageNum: 1,
    };

    var userData = req.rSession.user;

    var tasks = [
        ['liveInfo', conf.weiboApi.live.liveInfo, params, conf.weiboApi.secret],
        ['followNum', conf.weiboApi.live.followNum, params, conf.weiboApi.secret],
        ['topicList', conf.weiboApi.topic.list, params, conf.weiboApi.secret],
        ['channelCount', conf.weiboApi.live.channelCount, params, conf.weiboApi.secret],
        ['topicCount', conf.weiboApi.live.topicNum, params, conf.weiboApi.secret],
        ['channelList', conf.weiboApi.channel.list, params, conf.weiboApi.secret],
    ];

    // 如果登入
    if (userData && userData.userId) {
        params.userId = userData.userId;

        tasks.push(['isFollow', conf.weiboApi.live.isFollow, params, conf.weiboApi.secret]);
        // tasks.push(['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret]);
        tasks.push(['focusThree', conf.weiboApi.live.focusThree, params, conf.weiboApi.secret]);
    }

    // 如果有openId就关注直播间
    // if (openId) {
    //     tasks.push(['focusLive', conf.weiboApi.live.focus, _.extend({}, params, { openId: openId, status: 'Y' }), conf.weiboApi.secret]);
    // }

    proxy.parallelPromise(tasks, req).then(function (results) {
        options.fillVars.LIVE_INFO = lo.get(results, 'liveInfo.data', {});
        // encodeURIComponent(JSON.stringify(lo.get(results, 'liveInfo.data', {})).replace(/'/g, '__quote__'));
        options.fillVars.LIVE_INTRO = lo.get(results, 'liveInfo.data.entity.introduce', '');
        if (!options.fillVars.LIVE_INFO) {
            res.render('500', { msg: '无效的直播间ID' });
            return;
        }
        options.fillVars.TOPIC_LIST = encodeURIComponent(JSON.stringify(lo.get(results, 'topicList.data.topicList', [])).replace(/'/g, '__quote__'));
        options.fillVars.CHANNEL_INTRO = encodeURIComponent((lo.get(results, 'liveInfo.data.entity.introduce', '') || '').replace(/'/g, '__quote__'));
        options.fillVars.CHANNEL_LIST = encodeURIComponent(JSON.stringify(lo.get(results, 'channelList.data.channelList', [])).replace(/'/g, '__quote__'));
        options.fillVars.TOPIC_COUNT = lo.get(results, 'topicCount.data.topicNum', 0);
        options.fillVars.CHANNEL_COUNT = lo.get(results, 'channelCount.data.channelNum', 0);

        // if (lo.get(results, 'power.data.powerEntity')) {
        //     options.fillVars.POWER = results.power.data.powerEntity;
        // } else {
        //     options.fillVars.POWER = {};
        // }

        var followNum = lo.get(results, 'followNum.data.follwerNum');
        followNum = followNum > 9999 ? ((followNum * 1e-4).toFixed(2) + '万') : followNum;

        options.renderData = _.extend({},
            options.renderData,
            results.liveInfo.data,
            {
                bothT_V: lo.get(results, 'liveInfo.data.entityExtend.isLiveT') === 'Y' && lo.get(results, 'liveInfo.data.entityExtend.isLiveV') === 'Y',
                isLiveT: lo.get(results, 'liveInfo.data.entityExtend.isLiveT') === 'Y',
                isLiveV: lo.get(results, 'liveInfo.data.entityExtend.isLiveV') === 'Y',
                channelCount: lo.get(results, 'channelCount.data.channelNum', 0),
                topicCount: lo.get(results, 'topicCount.data.topicNum', 0),
                followerNum: followNum,
                // isFocusThree: results[7].data.isFocus,
                isOpenNotice: lo.get(results, 'isFollow.data.isAlert'),
                isAttention: lo.get(results, 'isFollow.data.isFollow'),
                // power: lo.get(results, 'power.data.powerEntity'),
                userData: lo.pick(userData, 'headImgUrl', 'name'),
            }
        );

        htmlProcessor(req, res, next, options);
    }).catch(function (err) {
        console.error(err);
        res.render('500');
    });
}

/**
 * 登录成功后跳转
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageLoginSuccess (req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/weibo/page/login-success/login-success.html'),
        options = {
            filePath: filePath,
            fillVars: {
            },
            renderData: {},
        };

    htmlProcessor(req, res, next, options);
}

module.exports = [
];

module.exports.pageLiveIndex = pageLiveIndex;
module.exports.pageLoginSuccess = pageLoginSuccess;
