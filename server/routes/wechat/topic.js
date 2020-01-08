var path = require('path');
var _ = require('underscore');
var lo = require('lodash');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var htmlProcessor = require('../../components/html-processor/html-processor');
var conf = require('../../conf');
var wxAuth = require('../../middleware/auth/1.0.0/wx-auth');


/**
 * 直播间话题详情页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageThousandLive(req, res, next, topicInfo) {
    var topicId = req.params.id;
    var liveId = lo.get(topicInfo, 'topicPo.liveId');
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/thousand-live/thousand-live.html');

    var currentTimeMillis = Date.now();

    var userPo = {};
    userPo.headImgUrl = lo.get(req, 'rSession.user.headImgUrl');
    userPo.id = lo.get(req, 'rSession.user.userId');
    userPo.name = lo.get(req, 'rSession.user.name');

    var params = {
        liveId: liveId,
        topicId: topicId,
        userId: lo.get(userPo, 'id'),
    };
    var params2 = {
        liveId: liveId,
        userId: lo.get(userPo, 'id'),
    };
    var tasks = [
        ['power', conf.wechatApi.common.getPower, params, conf.wechatApi.secret],
        ['topicRole', conf.wechatApi.user.topic_role, params, conf.wechatApi.secret],
        ['liveRole', conf.wechatApi.user.live_role, params, conf.wechatApi.secret],
        ['isFollow', conf.wechatApi.live.isFollow, params, conf.wechatApi.secret],
        ['shareQualify', conf.wechatApi.share.qualify, params2, conf.wechatApi.secret],
        ['isFocus', conf.wechatApi.live.focusThree, params2, conf.wechatApi.secret],
        ['isSub', conf.wechatApi.user.isSub, params2, conf.wechatApi.secret],
    ];


    var options = {
        filePath: filePath,
        fillVars: {
            'TITLE': lo.get(topicInfo, 'topicPo.topic'),
            'USER_PO': userPo,
            'TOPIC_EXTEND_PO': lo.get(topicInfo, 'topicExtendPo'),
            'TOPIC_PO': lo.get(topicInfo, 'topicPo'),
            'CURRENT_TIME_MILLIS': currentTimeMillis,
            'POWER': undefined,
        },
    };
    proxy.parallelPromise(tasks, req).then(function (results) {
        // if (results.power.data.powerEntity) {
        options.fillVars['POWER'] = lo.get(results, 'power.data.powerEntity');
        // }
        userPo.topicRole = lo.get(results, 'topicRole.data.role');
        userPo.liveRole = lo.get(results, 'liveRole.data.role');
        userPo.isFocus = lo.get(results, 'isFocus.data.isFocus');
        userPo.subscribe = lo.get(results, 'isSub.data.subscribe');
        options.fillVars['LIVE_FOLLOW'] = lo.get(results, 'isFollow.data');
        options.fillVars['L_SHARE_KEY'] = lo.get(results, 'shareQualify.data.shareQualify.shareKey');


        htmlProcessor(req, res, next, options);
    }).catch(function (err) {
        res.render('500');
        console.error(err);
    });


    // htmlProcessor(req, res, next, options);
}

var pageTopic = function (req, res, next) {
    var topicInfo;

    var params = {
        topicId: lo.get(req, 'params.id'),
    };

    var theUserId = lo.get(req, 'rSession.user.userId');

    params.userId = theUserId;
    var tasks = [
        ['topicInfo', conf.wechatApi.topic.get, params, conf.wechatApi.secret],
    ];


    proxy.parallelPromise(tasks, req).then(function (results) {
        var topicPo = lo.get(results, 'topicInfo.data.topicPo');
        if (topicPo.status != 'delete') {
            if (req.query.lsharekey && req.query.lsharekey != '' && !theUserId) {
                return;
            }

            if (results.topicInfo.data) {
                topicInfo = lo.get(results, 'topicInfo.data');
            }

            if (topicPo.type == 'public') {
                tellPage();
            } else if (theUserId) {
                getUserInfo();
            } else {

            }
        }
    }).catch(function (err) {
        console.error(err);
    });

    function getUserInfo() {
        var gtasks = [
            ['isAuth', conf.wechatApi.topic.auth, params, conf.wechatApi.secret],
        ];

        proxy.parallelPromise(gtasks, req).then(function (results) {
            tellPage();
        }).catch(function (err) {
            console.error(err);
        });
    }

    function tellPage() {
        var jumpIntroPage = true;

        /* 跳转到介绍页*/
        if ((req.query.isPreview && req.query.isPreview == 'Y') || (req.query.intoPreview && req.query.intoPreview == 'Y')) {
            jumpIntroPage = true;
        }
        /* 跳转到话题详情页*/
        if (req.query.isGuide && req.query.isGuide == 'Y') {
            jumpIntroPage = false;
        }

        if (jumpIntroPage) {
            pageTopicIntro(req, res, next, topicInfo);
            return;
        } else {
            pageThousandLive(req, res, next, topicInfo);
            return;
        };
    }
};

/**
 * 话题介绍页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageTopicIntro(req, res, next, topicInfo) {
    /* store init data*/
    var initData = {};
    Object.defineProperty(initData, 'topicView', {
        value: topicInfo,
        enumerable: true,
    });

    var filePath = path.resolve(__dirname, '../../../public/wechat/page/topic-intro/topic-intro.html'),
        options = {
            filePath: filePath,
            fillVars: {
                INITDATA: topicInfo,
            },
            renderData: {
            },
        };

    var liveId = topicInfo.topicPo.liveId;
    var topicId = req.params.id;
    var userId = req.rSession.user.userId;
    var params = {
        topicId: topicId,
        liveId: liveId,
        userId: userId,
    };


    proxy.parallelPromise([
        [conf.wechatApi.topic.profile, params, conf.wechatApi.secret],
        [conf.wechatApi.topic.auth, params, conf.wechatApi.secret],
        [conf.wechatApi.user.power, params, conf.wechatApi.secret],
        [conf.wechatApi.share.qualify, params, conf.wechatApi.secret],
        [conf.wechatApi.coupon.get, params, conf.wechatApi.secret],
    ], req).then(function (results) {
        resultData = results;
        Object.defineProperty(initData, 'power', { value: results[2].data, enumerable: true });
        Object.defineProperty(initData, 'profile', { value: results[0].data, enumerable: true });
        Object.defineProperty(initData, 'qualify', { value: results[3].data, enumerable: true });
        Object.defineProperty(initData, 'isAuth', { value: results[1].data, enumerable: true });
        Object.defineProperty(initData, 'coupon', { value: results[4].data, enumerable: true });
    }).then(function () {
        initData.topicView.topicPo.password = null;
        options.fillVars.INITDATA = initData;
        htmlProcessor(req, res, next, options);
        }).catch(function (err) {
        res.render('500');
        console.error(err);
        resultData = err;
    });


    // options.fillVars.TOPICINTRODATA = topicIntroData;
    options.fillVars.NOWTIME = new Date().getTime();
}


/**
 * 话题介绍编辑页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageTopicIntroEdit(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/topic-intro-edit/topic-intro-edit.html');
    var options = {
        filePath: filePath,
        fillVars: {},
        renderData: {},
    };

    /* 处理数据方法*/
    var IntroEditDataProcess = require('./data-process').IntroEditDataProcess;

    var params = {
        topicId: req.params.id,
        userId: req.rSession.user.userId,
    };

    /* 获取话题信息*/
    proxy.apiProxy(conf.wechatApi.topic.get, params, function (err, body) {
        if (err) {
            res.render('500');
            return;
        }
        Object.defineProperty(params, 'liveId', {
            value: body.data.topicPo.liveId,
            enumerable: true,
        });
        getPower();
        options.fillVars.TOPICINTROEDITDATA = IntroEditDataProcess(body.data);
    }, conf.appApi.secret, req);

    /* 获取用户权限*/
    function getPower() {
        proxy.apiProxy(conf.wechatApi.user.power, params, function (err, body) {
            /* 有管理权限则进入编辑页，否则跳转到介绍页*/
            if (body.data.powerEntity.allowMGLive) {
                htmlProcessor(req, res, next, options);
            } else {
                // todo: redirect to intro page if not allowMGLive
            }
        }, conf.wechatApi.secret, req);
    }

    options.fillVars.NOWTIME = new Date().getTime();
}

function getOtherIntroData(req, res, next) {
    var params = {
        userId: req.rSession.user.userId,
        liveId: req.body.liveId,
        topicId: req.body.topicId,
        pageNum: req.body.pageNum,
        pageSize: req.body.pageSize,
    };

	if(params.topicId){
		params.businessId = params.topicId;
		params.businessType = 'topic';
	}else if(params.channelId){
		params.businessId = params.channelId;
		params.businessType = 'channel';
	}else if(params.liveId){
		params.businessId = params.liveId;
		params.businessType = 'live';
	}

    var otherData = {};

    proxy.parallelPromise([
        [conf.wechatApi.live.get, params, conf.wechatApi.secret],
        [conf.wechatApi.topic.authList, params, conf.wechatApi.secret],
        [conf.wechatApi.live.topicNum, params, conf.wechatApi.secret],
        [conf.wechatApi.live.followNum, params, conf.wechatApi.secret],
        [conf.wechatApi.live.isFollow, params, conf.wechatApi.secret],
        [conf.wechatApi.live.pushNum, params, conf.wechatApi.secret],
        [conf.wechatApi.share.list, params, conf.wechatApi.secret],
    ], req).then(function (results) {
        Object.defineProperty(otherData, 'live', { value: results[0].data, enumerable: true });
        Object.defineProperty(otherData, 'joinMember', { value: results[1].data, enumerable: true });
        Object.defineProperty(otherData, 'topicNum', { value: results[2].data, enumerable: true });
        Object.defineProperty(otherData, 'followNum', { value: results[3].data, enumerable: true });
        Object.defineProperty(otherData, 'isFollow', { value: results[4].data, enumerable: true });
        Object.defineProperty(otherData, 'todayPushNum', { value: results[5].data, enumerable: true });
        Object.defineProperty(otherData, 'shareMember', { value: results[6].data, enumerable: true });
        resProcessor.jsonp(req, res, otherData);
    }).then(function () {
        }).catch(function (err) {
        res.render('500');
        console.error(err);
    });
}

module.exports = [
    // 话题详情主页
    ['GET', '/wechat/page/topic/thousand-live/:id.htm', wxAuth(), pageTopic],
    // 话题介绍页
    ['GET', '/wechat/page/topic/intro/:id.htm', wxAuth(), pageTopic],
    // 话题介绍编辑页
    ['GET', '/wechat/page/topic/intro/edit/:id.htm', wxAuth(), pageTopicIntroEdit],
    // 介绍页请求剩余数据
    ['POST', '/api/wechat/intro/others', clientParams(), getOtherIntroData],
];

module.exports.pageTopic = pageTopic;
module.exports.pageTopicIntroEdit = pageTopicIntroEdit;
