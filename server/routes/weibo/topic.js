var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var htmlProcessor = require('../../components/html-processor/html-processor');
var conf = require('../../conf');
var weiboAuth = require('../../middleware/auth/1.0.0/weibo-auth');
var lo = require('lodash');
var {stringify} = require('querystring');

/**
 * 直播间话题详情页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function weiboPageThousandLive(req, res, next, topicInfo)
{
    var topicId = req.query.topicId;
    var liveId = topicInfo.topicPo.liveId;
    var filePath = path.resolve(__dirname, '../../../public/weibo/page/thousand-live/thousand-live.html');
    var sessionId;
    var currentTimeMillis = Date.now();

    var userPo = {};
    userPo.headImgUrl = req.rSession.user.headImgUrl;
    userPo.id = req.rSession.user.userId;
    userPo.name = req.rSession.user.name;

    if (topicId instanceof Array && topicId.length) {
        topicId = topicId[0];
    }

    var params = {
        liveId: liveId,
        topicId: topicId,
        userId: userPo.id,
        caller: 'weibo',
    };
    var params2 = {
        liveId: liveId,
        userId: userPo.id,
        caller: 'weibo',
    };
    if (req.cookies.rsessionid) {
        sessionId = req.cookies.rsessionid;
    }

    var params3 = {
        liveId: liveId,
        sessionId: sessionId,
        topicId: topicId,
        userId: userPo.id,
        caller: 'weibo'
    };
    var tasks = [
        ['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret],
        ['liveInfo', conf.weiboApi.live.liveInfo, params, conf.weiboApi.secret],
        ['topicRole', conf.weiboApi.user.topic_role, params, conf.weiboApi.secret],
        ['liveRole', conf.weiboApi.user.live_role, params, conf.weiboApi.secret],
        ['isFollow', conf.weiboApi.live.isFollow, params, conf.weiboApi.secret],
        ['shareQualify', conf.weiboApi.share.qualify, params2, conf.weiboApi.secret],
        ['isFocus', conf.weiboApi.live.focusThree, params2, conf.weiboApi.secret],
        ['isSub', conf.weiboApi.user.isSub, params2, conf.weiboApi.secret],
        ['inviteList', conf.weiboApi.topic.inviteList, params, conf.weiboApi.secret],
        ['browe', conf.weiboApi.browe, params3, conf.weiboApi.secret],
    ];

    if (req.rSession.user && req.rSession.user.userId) {
        var userParams = {
            userId: req.rSession.user.userId,
        };
        tasks.push(['myLiveEntity', conf.weiboApi.live.my, userParams, conf.weiboApi.secret]);
        tasks.push(['config', conf.weiboApi.topic.config, params, conf.weiboApi.secret]);
    }

    var options = {
        filePath: filePath,
        fillVars: {
            'TITLE': topicInfo.topicPo.topic,
            'USER_PO': userPo,
            'TOPIC_EXTEND_PO': topicInfo.topicExtendPo,
            'TOPIC_PO': topicInfo.topicPo,
            'CURRENT_TIME_MILLIS': currentTimeMillis,
            'POWER': undefined,
            'L_SHARE_KEY': undefined,
            'CAN_CREATE_LIVE': false,
            'INSTRUCTIONGUID': 'Y',
        },
    };

    proxy.parallelPromise(tasks, req).then(function (results)
    {
        options.fillVars['POWER'] = results.power.data.powerEntity;
        userPo.topicRole = results.topicRole.data.role;
        userPo.liveRole = results.liveRole.data.role;
        userPo.isFocus = results.isFocus.data.isFocus;
        userPo.subscribe = lo.get(results, 'isSub.data.subscribe', '') || '';
        options.fillVars['LIVE_FOLLOW'] = results.isFollow.data;
        if (results.shareQualify.data.shareQualify) {
            options.fillVars['L_SHARE_KEY'] = results.shareQualify.data.shareQualify.shareKey;
        }
        options.fillVars['ENTITY'] = results.liveInfo.data.entity;
        options.fillVars['ENTITY_EXTEND'] = results.liveInfo.data.entityExtend;
        options.fillVars['INVITELIST'] = results.inviteList.data.liveTopicInviteJsons;
        options.fillVars['SID'] = sessionId;
        if (results.myLiveEntity && results.myLiveEntity.data.entityPo == null) {
            options.fillVars['CAN_CREATE_LIVE'] = true;
        }
        if (results.config && results.config.data) {
            options.fillVars['INSTRUCTIONGUID'] = results.config.data.instructionGuid;
        }
        htmlProcessor(req, res, next, options);
    }).catch(function (err)
    {
        res.render('500');
        console.error(err);
    });


    // htmlProcessor(req, res, next, options);
}

var weiboPageTopic = function (req, res, next)
{
    var topicInfo;

    var params = {
        topicId: req.query.topicId,
        caller: 'weibo'
    };

    if (params.topicId instanceof Array && params.topicId.length) {
        params.topicId = params.topicId[0];
    }

    if (req.rSession.user.userId) {
        params.userId = req.rSession.user.userId;
    }

    var tasks = [
        ['topicInfo', conf.weiboApi.topic.get, params, conf.weiboApi.secret],
    ];


    proxy.parallelPromise(tasks, req).then(function (results)
    {
        topicInfo = lo.get(results, 'topicInfo.data');
        var topicStatus = lo.get(results, 'topicInfo.data.topicPo.status');
        var topicType = lo.get(results, 'topicInfo.data.topicPo.type');
        if (topicStatus != 'delete') {
            if (req.query.lsharekey && req.query.lsharekey != '' && !req.rSession.user.userId) {
                return;
            }

            if (topicType == 'public') {
                weiboPageThousandLive(req, res, next, topicInfo);
            } else if (req.rSession.user.userId) {
                getUserInfo();
            } else {

            }
        }
    }).catch(function (err)
    {
        console.error(err);
    });

    function getUserInfo()
    {
        var gtasks = [
            ['isAuth', conf.weiboApi.topic.auth, params, conf.weiboApi.secret],
        ];

        proxy.parallelPromise(gtasks, req).then(function (results)
        {
            let isAuth = lo.get(results, 'isAuth.data.isAuth');
            if (isAuth) {
                weiboPageThousandLive(req, res, next, topicInfo);
            } else {
                const data = {
                    ...req.query,
                }
                const queryResult = stringify(data);
                res.redirect(`/wechat/page/topic-intro?topicId=${params.topicId}`);
                return;
            }
        }).catch(function (err)
        {
            console.error(err);
        });
    }

    
};

/**
 * 话题介绍页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function weiboPageTopicIntro(req, res, next) {
    var topicInfo;

    var params = {
        topicId: req.query.topicId,
        caller: 'weibo'
    };

    if (params.topicId instanceof Array && params.topicId.length) {
        params.topicId = params.topicId[0];
    }

    if (req.rSession.user.userId) {
        params.userId = req.rSession.user.userId;
    }

    var tasks = [
        ['topicInfo', conf.weiboApi.topic.get, params, conf.weiboApi.secret],
    ];


    proxy.parallelPromise(tasks, req).then(function (results)
    {
        topicInfo = lo.get(results, 'topicInfo.data');
        var topicStatus = lo.get(results, 'topicInfo.data.topicPo.status');
        var topicType = lo.get(results, 'topicInfo.data.topicPo.type');
        if (topicStatus != 'delete') {
            if (req.query.lsharekey && req.query.lsharekey != '' && !req.rSession.user.userId) {
                return;
            }

            /* store init data*/
            var initData = {};
            initData.topicView = topicInfo;

            var filePath = path.resolve(__dirname, '../../../public/weibo/page/topic-intro/topic-intro.html'),
                options = {
                    filePath: filePath,
                    fillVars: {
                        INITDATA: topicInfo,
                    },
                    renderData: {
                    },
                };

            var liveId = lo.get(topicInfo, 'topicPo.liveId');
            var topicId = lo.get(req, 'query.topicId');
            var userId = lo.get(req, 'rSession.user.userId');
            var params = {
                topicId: topicId,
                liveId: liveId,
                userId: userId,
                caller: 'weibo'
            };


            var tasks = [
                [conf.weiboApi.topic.profile, params, conf.weiboApi.secret],
                [conf.weiboApi.topic.auth, params, conf.weiboApi.secret],
                [conf.weiboApi.user.power, params, conf.weiboApi.secret],
                [conf.weiboApi.share.qualify, params, conf.weiboApi.secret],
                [conf.weiboApi.coupon.topic, params, conf.weiboApi.secret],
            ];

            var channelId = lo.get(initData, 'topicView.topicPo.channelId');
            if (channelId) {
                params.channelId = initData.topicView.topicPo.channelId;
                tasks.push([conf.weiboApi.channel.info, params, conf.weiboApi.secret]);
                tasks.push([conf.weiboApi.coupon.channel, params, conf.weiboApi.secret]);
            }

            proxy.parallelPromise(tasks, req).then(function (results)
            {
                initData.profile = lo.get(results, '0.data', {});
                initData.isAuth = lo.get(results, '1.data', {});
                initData.power = lo.get(results, '2.data', {});
                initData.qualify = lo.get(results, '3.data', {});
                initData.coupon = lo.get(results, '4.data', {});

                // initData.power = results[2].data;
                // initData.profile = results[0].data;
                // initData.qualify = results[3].data;
                // initData.isAuth = results[1].data;
                // initData.coupon = results[4].data;
                if (channelId) {
                    initData.channel = lo.get(results, '5.data', {});
                    initData.channelCoupon = lo.get(results, '6.data', {});
                }
                initData.userId = userId;
            }).then(function ()
            {
                var password = lo.get(initData, 'topicView.topicPo.password');
                if (password) {
                    initData.topicView.topicPo.password = null;
                }
                options.fillVars.INITDATA = initData;
                htmlProcessor(req, res, next, options);
            }).catch(function (err)
            {
                res.render('500');
                console.error(err);
            });


            // options.fillVars.TOPICINTRODATA = topicIntroData;
            options.fillVars.NOWTIME = new Date().getTime();


           
        }
    }).catch(function (err)
    {
        console.error(err);
    });
    
    
}


/**
 * 话题介绍编辑页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function weiboPageTopicIntroEdit(req, res, next)
{
    var filePath = path.resolve(__dirname, '../../../public/weibo/page/topic-intro-edit/topic-intro-edit.html');
    var options = {
        filePath: filePath,
        fillVars: {},
        renderData: {},
    };

    /* 处理数据方法*/
    var introEditDataProcess = require('./data-process').IntroEditDataProcess;

    var params = {
        topicId: req.params.id,
        userId: req.rSession.user.userId,
        caller: 'weibo',
    };

    /* 获取话题信息*/
    proxy.apiProxy(conf.weiboApi.topic.get, params, function (err, body)
    {
        if (err) {
            res.render('500');
            return;
        }
        Object.defineProperty(params, 'liveId', {
            value: body.data.topicPo.liveId,
            enumerable: true,
        });
        getPower();
        options.fillVars.TOPICINTROEDITDATA = introEditDataProcess(body.data);
    }, conf.weiboApi.secret, req);

    /* 获取用户权限*/
    function getPower()
    {
        proxy.apiProxy(conf.weiboApi.user.power, params, function (err, body)
        {
            /* 有管理权限则进入编辑页，否则跳转到介绍页*/
            if (body.data.powerEntity.allowMGLive) {
                htmlProcessor(req, res, next, options);
            } else {
                // todo: redirect to intro page if not allowMGLive
            }
        }, conf.weiboApi.secret);
    }

    options.fillVars.NOWTIME = new Date().getTime();
}


module.exports = [
    // 话题详情主页
    // ['GET', '/weibo/page/topic/thousand-live/:id.htm', weiboAuth(), weiboPageTopic],
    // // 话题介绍页
    // ['GET', '/weibo/page/topic-intro', weiboAuth(), weiboPageTopicIntro],
    // 话题介绍编辑页
    // ['GET', '/weibo/page/topic/intro/edit/:id.htm', weiboAuth(), weiboPageTopicIntroEdit],

];

module.exports.weiboPageTopic = weiboPageTopic;
module.exports.weiboPageTopicIntro = weiboPageTopicIntro;
module.exports.weiboPageTopicIntroEdit = weiboPageTopicIntroEdit;
