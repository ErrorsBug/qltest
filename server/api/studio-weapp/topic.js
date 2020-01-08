var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
var lo = require('lodash');
var requestProcess = require('../../middleware/request-process/request-process');


/**
 * 话题详情
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
const pageThousandLive = (req, res, next) => {
    /* 请求可能需要的参数*/
    const topicId = lo.get(req, 'query.topicId');
    const userId = lo.get(req, 'rSession.user.userId');
    let liveId;
    let channelId;

    var userPo = {};
    userPo.headImgUrl = lo.get(req, 'rSession.user.headImgUrl');
    userPo.id = lo.get(req, 'rSession.user.userId');
    userPo.name = lo.get(req, 'rSession.user.name');

    /* 最终会返回的数据*/
    let responseData = {};

    let currentTimeMillis = Date.now();
    responseData.currentTimeMillis=currentTimeMillis;
    /* 获取话题基本信息*/
    const getTopic = () => {
        const params = {
            topicId: topicId,
            userId: userId,
            sessionId: req.rSession.sessionId,
            caller: 'studio-weapp',
            weappVer: lo.get(req, 'query.weappVer'),
        };

        proxy.parallelPromise([
            [conf.weiboApi.topic.get, params, conf.weiboApi.secret],
            // [conf.weiboApi.topic.redirect, params, conf.weiboApi.secret],
            [conf.baseApi.topic.initWebsocket, params, conf.baseApi.secret],
            [conf.baseApi.topic.topicAuth, params, conf.baseApi.secret],
        ], req).then(result => {
            // 获取到liveId、channelId和话题基本信息
            liveId = lo.get(result, '0.data.topicPo.liveId');
            channelId = lo.get(result, '0.data.topicPo.channelId');

            responseData.topicView = lo.get(result, '0.data');

            let isAuth = judgeAuth ({
                isAuth: lo.get(result, '2.data.isAuth', null),
                topicPo: lo.get(result, '0.data.topicPo')
            });

            // 若话题已被删除则返回错误信息
            if (lo.get(result, '0.data.topicPo.status') == 'delete') {
                resProcessor.jsonp(req, res, {
                    code: 404,
                    msg: '话题已被删除',
                });
            } else if (lo.get(result, '0.state.code') == 10001) {
                resProcessor.jsonp(req, res, {
                    code: 10001,
                    msg: '话题不存在',
                });
            } else if (!isAuth) {
                resProcessor.jsonp(req, res, {
                    code: 403,
                    msg: '没有访问权限',
                });
            } else {
                //resProcessor.jsonp(req, res, responseData);
                getInfo()
            }
        }).catch(err => {
            console.error(err);
        });

    }
        /* 获取剩余信息*/
    const getInfo = () => {
        let sessionId = "";

        /* 请求参数*/
        let params = {
            topicId: topicId,
            liveId: liveId,
            userId: userId,
            caller: 'studio-weapp',
            weappVer: lo.get(req, 'query.weappVer'),            
        };

        if (req.rSession.sessionId) {
            params.sessionId = req.rSession.sessionId;
        }

        /* 请求接口*/
        let tasks = [
            // ['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret],
            // ['topicRole', conf.weiboApi.user.topic_role, params, conf.weiboApi.secret],
            // ['liveRole', conf.weiboApi.user.live_role, params, conf.weiboApi.secret],
            // ['isFollow', conf.weiboApi.live.isFollow, params, conf.weiboApi.secret],
            ['shareQualify', conf.weiboApi.share.qualify, params, conf.weiboApi.secret],
            // ['isFocus', conf.weiboApi.live.focusThree, params, conf.weiboApi.secret],
            // ['isSub', conf.weiboApi.user.isSub, params, conf.weiboApi.secret],
            ['liveInfo', conf.weiboApi.live.get, params, conf.weiboApi.secret],
            // ['browe', conf.weiboApi.browe, params, conf.weiboApi.secret],
            ['isAuth', conf.baseApi.auditState, params, conf.baseApi.secret],
        ];



        /* 请求接口*/
        proxy.parallelPromise(tasks, req).then(function (results) {
            /* 放入返回数据*/
            // userPo.topicRole = lo.get(results, 'topicRole.data.role');
            // userPo.liveRole = lo.get(results, 'liveRole.data.role');
            // userPo.isFocus = lo.get(results, 'isFocus.data.isFocus');
            // userPo.subscribe = lo.get(results, 'isSub.data.subscribe');
            responseData.liveInfo = lo.get(results, 'liveInfo.data');
            // responseData.liveFollow = lo.get(results, 'isFollow.data');
            responseData.lShareKey = lo.get(results, 'shareQualify.data.shareQualify.shareKey');
            // responseData.power = lo.get(results, 'power.data.powerEntity');
            responseData.isAuth = lo.get(results, 'isAuth.data.isAuth') || 'Y';

            responseData.userPo = userPo;



            /* 返回数据*/
            resProcessor.jsonp(req, res, responseData);
        }).catch(function (err) {
            resProcessor.jsonp(req, res, {
                code: 500,
                msg: '请求错误',
            });
            console.error(err);
        });

    }

    getTopic();
}

/**
 * 进入话题权限判断
 *
 * @param {any} req
 * @param {any} res
 * @param {any} isAuth
 */
function judgeAuth ({isAuth, topicPo}) {
    if (
        topicPo &&
        topicPo.isNeedAuth == 'N' &&
        topicPo.type == 'public' &&
        topicPo.displayStatus == 'Y' &&
        !(topicPo.channelId && topicPo.isAuditionOpen != 'Y')
    ) {
        // 如果非频道话题是免费的，且没有开启介绍页，可以直接进入
        // 如果频道话题开启了免费试听的，可以直接进入
        return true;
    } else if (!isAuth) {
        return false;
    } else {
        return true;
    }
}


/**
 * 极简模式话题数据
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
const pagePlainLive = (req, res, next) => {
    /* 请求可能需要的参数*/
    const topicId = lo.get(req, 'query.topicId');
    const userId = lo.get(req, 'rSession.user.userId');
    let liveId;
    let channelId;

    var userPo = {};
    userPo.headImgUrl = lo.get(req, 'rSession.user.headImgUrl');
    userPo.id = lo.get(req, 'rSession.user.userId');
    userPo.name = lo.get(req, 'rSession.user.name');

    /* 最终会返回的数据*/
    let responseData = {};

    let sysTime = Date.now();
    responseData.sysTime = sysTime;
    /* 获取话题基本信息*/
    const getTopic = () => {
        const params = {
            topicId: topicId,
            userId: userId,
            sessionId: req.rSession.sessionId,
            caller: 'studio-weapp',
            weappVer: lo.get(req, 'query.weappVer'),
        };

        proxy.parallelPromise([
            [conf.weiboApi.topic.get, params, conf.weiboApi.secret],
            [conf.weiboApi.topic.redirect, params, conf.weiboApi.secret],
        ], req).then(result => {
            // 获取到liveId、channelId和话题基本信息
            liveId = lo.get(result, '0.data.topicPo.liveId');
            channelId = lo.get(result, '0.data.topicPo.channelId');

            responseData.topicView = lo.get(result, '0.data');
            responseData.liveId = liveId

            // 若话题已被删除则返回错误信息
            if (lo.get(result, '0.data.topicPo.status') == 'delete') {
                resProcessor.jsonp(req, res, {
                    code: 404,
                    msg: '话题已被删除',
                });
            } else if (lo.get(result, '0.state.code') == 10001) {
                resProcessor.jsonp(req, res, {
                    code: 10001,
                    msg: '话题不存在',
                });
            } else if (lo.get(result, '1.state.code') == 0 && lo.get(result, '1.data.type') != "topic") {
                resProcessor.jsonp(req, res, {
                    code: 403,
                    msg: '没有访问权限',
                });
            } else {
                //resProcessor.jsonp(req, res, responseData);
                getInfo()
            }
        }).catch(err => {
            console.error(err);
        });

    }
    /* 获取剩余信息*/
    const getInfo = () => {
        let sessionId = "";

        /* 请求参数*/
        let params = {
            topicId: topicId,
            liveId: liveId,
            userId: userId,
            caller: 'studio-weapp',
            weappVer: lo.get(req, 'query.weappVer'),
        };

        if (req.rSession.sessionId) {
            params.sessionId = req.rSession.sessionId;
        }

        /* 请求接口*/
        let tasks = [
            ['profile', conf.weiboApi.topic.profile, params, conf.weiboApi.secret],
        ];

        /* 请求接口*/
        proxy.parallelPromise(tasks, req).then(function (results) {
            /* 放入返回数据*/
            responseData.profile = lo.get(results, 'profile.data.TopicProfileList');

            /* 返回数据*/
            resProcessor.jsonp(req, res, responseData);
        }).catch(function (err) {
            resProcessor.jsonp(req, res, {
                code: 500,
                msg: '请求错误',
            });
            console.error(err);
        });

    }

    getTopic();


}




/**
 * 获取发言数据
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */

const apiGetSpeak = (req, res, next) => {
    /* 请求可能需要的参数*/
    const topicId = lo.get(req, 'query.topicId');
    const liveId = lo.get(req, 'query.liveId');
    const beforeOrAfter = lo.get(req, 'query.beforeOrAfter');
    const time = lo.get(req, 'query.time');
    const pageSize = lo.get(req, 'query.pageSize');
    const pullComment = lo.get(req, 'query.pullComment');
    const userId = lo.get(req, 'rSession.user.userId');

    /* 最终会返回的数据*/
    let responseData = {};


    /* 获取话题基本信息*/
    const getSpeak = () => {
        const params = {
            topicId: topicId,
            userId: userId,
            pageNum:1,
            liveId:liveId,
            beforeOrAfter:beforeOrAfter,
            time:time,
            pageSize:pageSize,
            pullComment:pullComment,
            caller: 'studio-weapp',
            weappVer: lo.get(req, 'query.weappVer'),
        };

        proxy.parallelPromise([
            [conf.speakApi.speak.get, params, conf.speakApi.secret]
        ], req).then(results => {
            responseData.data = lo.get(results, '0.data');
            resProcessor.jsonp(req, res, responseData);
        }).catch(err => {
            console.error(err);
        });

    }
    getSpeak();
}


/**
 * 获取评论数据
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */

const apiGetComment = (req, res, next) => {
    /* 请求可能需要的参数*/
    const liveId = lo.get(req, 'query.liveId');
    const time = lo.get(req, 'query.time');
    const topicId = lo.get(req, 'query.topicId');
    const beforeOrAfter = lo.get(req, 'query.beforeOrAfter');
    const pageSize = lo.get(req, 'query.pageSize');
    const userId = lo.get(req, 'rSession.user.userId');


    /* 最终会返回的数据*/
    let responseData = {};


    /* 获取话题基本信息*/
    const getComment = () => {
        const params = {
            liveId:liveId,
            time: time || (new Date().getTime() + 1000000),
            topicId:topicId,
            beforeOrAfter:beforeOrAfter,
            pageSize:pageSize,
            userId:userId,
            caller: 'studio-weapp',
            weappVer: lo.get(req, 'query.weappVer'),
        };

        proxy.parallelPromise([
            [conf.commentApi.getComment, params, conf.commentApi.secret]
        ], req).then(results => {
            responseData.data = lo.get(results, '0.data');
            resProcessor.jsonp(req, res, responseData);
        }).catch(err => {
            console.error(err);
        });

    }

    getComment();
}


function liveTopicList (req, res, next) {
    const params = _.pick(req.query, 'liveId','weappVer');

    params.page = {
        page: lo.get(req, 'query.page'),
        size: lo.get(req, 'query.size')
    };

    params.caller = 'studio-weapp';

    params.pageNum = lo.get(req, 'query.page');
    params.pageSize = lo.get(req, 'query.size');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.live.getTopic, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            const now = Date.now();
            let topicList = lo.get(result, 'data.liveTopics') || [];

            topicList = topicList.map(item => {
                if (item.status === 'beginning') {
                    const deffTimeStamp = item.startTime - now;
                    if (deffTimeStamp > 86400000) {
                        item.timeStr = (~~((deffTimeStamp/86400000))) + '天后'
                    } else if (deffTimeStamp > 3600000) {
                        item.timeStr = (~~((deffTimeStamp/3600000))) + '小时后'
                    } else {
                        item.timeStr = (~~((deffTimeStamp/60000))) + '分钟后'
                    }

                    return item;
                }
                return item;
            });

            try {
                delete result.data.liveTopics
                result.data.topicList = topicList;
                resProcessor.jsonp(req, res, result);
                
            } catch (error) {
                resProcessor.error500(req, res, error);
            }
        }
    }, conf.baseApi.secret, req);
}


/**
 * 话题列表
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function topicList(req, res, next) {
    const params = _.pick(req.query, 'liveId', 'channelId','caller','weappVer');

    params.page = {
        page: lo.get(req, 'query.page'),
        size: lo.get(req, 'query.size')
    };

    params.pageNum = lo.get(req, 'query.page');
    params.pageSize = lo.get(req, 'query.size');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.channel.topicList, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.baseApi.secret, req);
}

// 发表评论
function addComment (req, res, next) {
    const params = lo.pick(req.body, 'liveId', 'topicId', 'type', 'content', 'isQuestion','caller','weappVer');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.weiboApi.comment.add, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.weiboApi.secret, req);
}

function delComment (req, res, next) {
    const params = lo.pick(req.body, 'topicId', 'commentId', 'createBy', 'caller', 'weappVer');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.weiboApi.comment.delete, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.weiboApi.secret, req);
}

function getPPT (req, res, next) {
    const params = lo.pick(req.query, 'topicId', 'status', 'caller', 'weappVer');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weapp';

    proxy.apiProxy(conf.weiboApi.ppt.list, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.weiboApi.secret, req);
}


module.exports = [
    ['GET', '/api/studio-weapp/page/topic/thousandLive', studioWeappAuth(), pageThousandLive],
    ['GET', '/api/studio-weapp/page/topic/plain-live', studioWeappAuth(), pagePlainLive],
    ['GET', '/api/studio-weapp/page/topic/getSpeak', studioWeappAuth(), apiGetSpeak],
    ['GET', '/api/studio-weapp/page/topic/getComment', studioWeappAuth(), apiGetComment],

    ['POST', '/api/studio-weapp/comment/add', studioWeappAuth(), addComment],
    ['POST', '/api/studio-weapp/comment/del', studioWeappAuth(), delComment],
    ['GET', '/api/studio-weapp/ppt/get', studioWeappAuth(), getPPT],
    // 获取话题列表
    ['GET', '/api/studio-weapp/topic/list', studioWeappAuth(), topicList],
    ['GET', '/api/studio-weapp/topic/live-topic-list', liveTopicList],
    // 获取评论列表
    ['GET', '/api/studio-weapp/topic/comment/get', studioWeappAuth(), requestProcess(conf.commentApi.getComment, conf.commentApi.secret)],
    ['GET', '/api/studio-weapp/topic/total-speak-list', studioWeappAuth(), requestProcess(conf.baseApi.topic.totalSpeakList, conf.baseApi.secret)],
]
