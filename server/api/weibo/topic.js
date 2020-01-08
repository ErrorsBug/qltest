var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    // wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    conf = require('../../conf');
var weiboAuth = require('../../middleware/auth/1.0.0/weibo-auth');

var lo = require('lodash');

/**
 *获取发言信息
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var getSpeak = function (req, res, next) {
    var params = _.pick(req.body, 'liveId', 'beforeOrAfter', 'time', 'pageSize', 'topicId', 'pullComment');
    var isMgr = req.body.isMgr;
    params.pageNum = 1;
    params.caller = 'weibo';
    var tasks = [];
    proxy.apiProxy(conf.speakApi.speak.get, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        var liveSpeakViews = lo.get(body, 'data.liveSpeakViews');

        if (!liveSpeakViews) {
            resProcessor.error500(req, res, err);
            return;
        }

        body.data.liveSpeakViews = body.data.liveSpeakViews || [];

        for (var i = 0; i < body.data.liveSpeakViews.length; i++) {
            if (body.data.liveSpeakViews[i].type == 'doc') {
                var params = {};
                params.docId = body.data.liveSpeakViews[i].content;
                params.userId = lo.get(req, 'rSession.user.userId');
                var tempArr = [String(i), conf.weiboApi.topic.docGet, params, conf.weiboApi.secret];
                tasks.push(tempArr);
            }
        }
        var thisReq = req;
        var thisRes = res;
        if (tasks.length > 0) {
            proxy.parallelPromise(tasks).then(function (results) {
                for (var j = 0; j < tasks.length; j++) {
                    var i = tasks[j][0];
                    var files = results[i].data;
                    body.data.liveSpeakViews[Number(i)].files = files;
                }

                tasks = [];
                for (var k = 0; k < body.data.liveSpeakViews.length; k++) {
                    if (isMgr == 'true' || (body.data.liveSpeakViews[k].files && (body.data.liveSpeakViews[k].files.isPaid || body.data.liveSpeakViews[k].files.amount == 0))) {
                        var params = {};
                        params.docId = body.data.liveSpeakViews[k].content;
                        params.amount = (Number(body.data.liveSpeakViews[k].amount) / 100).toFixed(2);
                        params.userId = thisReq.rSession.user.userId;
                        var tempArr = [String(k), conf.weiboApi.topic.docAuth, params, conf.weiboApi.secret];
                        tasks.push(tempArr);
                    } else if (body.data.liveSpeakViews[k].files && body.data.liveSpeakViews[k].files.convertUrl) {
                        body.data.liveSpeakViews[k].files.convertUrl = 'javascript:;';
                    }
                }


                if (tasks.length > 0) {
                    proxy.parallelPromise(tasks).then(function (results) {
                        for (var j = 0; j < tasks.length; j++) {
                            var i = tasks[j][0];
                            body.data.liveSpeakViews[Number(i)].files.convertUrl += '?auth_key=' + results[i].data.authKey;
                        }


                        resProcessor.jsonp(thisReq, thisRes, body);
                    }).catch(function (err) {
                        console.error(err);
                        throw new Error(err);
                    });
                } else {
                    resProcessor.jsonp(thisReq, thisRes, body);
                }
            }).catch(function (err) {
                console.error(err);
                resProcessor.error500(req, res, err);
            });
        } else {
            resProcessor.jsonp(req, res, body);
        }
    }, conf.speakApi.secret, req);
};


/**
 *获取评论信息
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var getComment = function (req, res, next) {
    var params = _.pick(req.body, 'liveId', 'time', 'topicId', 'beforeOrAfter', 'pageSize');

    params.caller = 'weibo';

    proxy.apiProxy(conf.commentApi.getComment, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.commentApi.secret, req);
};

/**
 *发布评论
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var postComment = function (req, res, next) {
    var params = _.pick(req.body, 'type', 'liveId', 'topicId', 'content', 'isQuestion');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.comment.add, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 *删除评论
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var delComment = function (req, res, next) {
    var params = _.pick(req.body, 'commentId', 'createBy', 'topicId');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';


    proxy.apiProxy(conf.weiboApi.comment.delete, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 *获取ppt
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var getPPTList = function (req, res, next) {
    var params = _.pick(req.body, 'status', 'topicId');

    params.page = {
        page: req.body.page,
        size: req.body.size,
    };
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.ppt.list, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};


/**
 *获取文件信息
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var docGet = function (req, res, next) {
    var params = _.pick(req.body, 'docId');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.docGet, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 *获取文件下载链接
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var docAuth = function (req, res, next) {
    var params = _.pick(req.body, 'docId', 'amount');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.docAuth, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 *查询订单状态
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var payResult = function (req, res, next) {
    var params = _.pick(req.body, 'orderId');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.getPayResult, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 *下载统计
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var addStat = function (req, res, next) {
    var params = _.pick(req.body, 'docId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.addStat, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 *关闭引导
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var saveGuide = function (req, res, next) {
    var params = _.pick(req.body, 'isEnable', 'key', 'liveId', 'topicId', 'type');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.saveGuide, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.weiboApi.secret, req);
};

/**
 * 话题列表
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function topicList(req, res, next) {
    var params = _.pick(req.query, 'liveId', 'clientType', 'channelId', 'pageNum', 'pageSize');

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.list, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.weiboApi.secret, req);
}


/**
 * 免费话题报名
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function enterPublic(req, res, next) {
    var params = {
        topicId: req.body.topicId,
    };

    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.enterPublic, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, result);
    }, conf.weiboApi.secret, req);
}

/**
 * 加密话题报名
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function enterEncrypt(req, res, next) {
    var params = _.pick(req.body, 'topicId', 'password');
    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weibo';

    proxy.apiProxy(conf.weiboApi.topic.enterEncrypt, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, result);
    }, conf.weiboApi.secret, req);
}

function getGiftId(req, res, next) {
    var params = {
        userId: req.rSession.user.userId,
        orderId: req.body.orderId,
        caller: 'weibo',
    };

    proxy.apiProxy(conf.weiboApi.topic.getGiftId, params, function (err, result) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, result);
    }, conf.weiboApi.secret, req);
}

/**
 * 介绍页请求剩余数据
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function weiboGetOtherIntroData(req, res, next) {
    var params = _.pick(req.body, ['liveId', 'topicId', 'pageNum', 'pageSize', 'channelId']);
    params.userId = lo.get(req, 'rSession.user.userId');
    params.page = {
        page: req.body.pageNum,
        size: req.body.pageSize
    };

    params.caller = 'weibo';

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
        [conf.weiboApi.live.get, params, conf.wechatApi.secret],
        [conf.weiboApi.topic.authList, params, conf.wechatApi.secret],
        [conf.weiboApi.live.topicNum, params, conf.wechatApi.secret],
        [conf.weiboApi.live.followNum, params, conf.wechatApi.secret],
        [conf.weiboApi.live.isFollow, params, conf.wechatApi.secret],
        [conf.weiboApi.live.pushNum, params, conf.wechatApi.secret],
        [conf.weiboApi.share.list, params, conf.wechatApi.secret],
        [conf.weiboApi.channel.userList, params, conf.wechatApi.secret],
        [conf.weiboApi.channel.topicNum, params, conf.wechatApi.secret],
    ], req).then(function (results) {
        otherData.live = lo.get(results, '0.data');
        otherData.joinMember = lo.get(results, '1.data');
        otherData.topicNum = lo.get(results, '2.data');
        otherData.followNum = lo.get(results, '3.data');
        otherData.isFollow = lo.get(results, '4.data');
        otherData.todayPushNum = lo.get(results, '5.data');
        otherData.shareMember = lo.get(results, '6.data');
        otherData.channelJoinNum = lo.get(results, '7.data');
        otherData.channelTopicNum = lo.get(results, '8.data');
        resProcessor.jsonp(req, res, otherData);
    }).catch(function (err) {
        resProcessor.error500(req, res, err);
        console.error(err);
    });
}

/**
 * 免费系列课下单
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function buyFreeChannel(req, res, next) {
    var params = {
        chargeConfigId: lo.get(req, 'body.chargeConfigId'),
        userId: lo.get(req, 'rSession.user.userId'),
        caller: 'weibo',
    };

    proxy.apiProxy(
        conf.weiboApi.channel.orderFree,
        params,
        function (err, body) {
            if (err) {
                res.resProcessor.error500(req, res, err);
                return;
            }
            resProcessor.jsonp(req, res, body);
        }, conf.weiboApi.secret, req);
}


module.exports = [
    ['GET', '/api/weibo/topic/list', topicList],
    ['POST', '/api/weibo/topic/getSpeak', getSpeak],
    ['POST', '/api/weibo/topic/getComment', getComment],
    ['POST', '/api/weibo/topic/postComment', postComment],
    ['POST', '/api/weibo/topic/delComment', delComment],
    ['POST', '/api/weibo/topic/enterPublic', enterPublic],
    ['POST', '/api/weibo/topic/enterEncrypt', enterEncrypt],
    ['POST', '/api/weibo/topic/docGet', docGet],
    ['POST', '/api/weibo/topic/docAuth', docAuth],
    ['POST', '/api/weibo/topic/getPayResult', payResult],
    ['POST', '/api/weibo/topic/addStat', addStat],
    ['POST', '/api/weibo/topic/saveGuide', saveGuide],

    ['POST', '/api/weibo/channel/buyFreeChannel', buyFreeChannel],
    // 介绍页请求剩余数据
    ['POST', '/api/weibo/intro/others', weiboGetOtherIntroData],
    ['POST', '/api/weibo/topic/getPPt', getPPTList],
    ['POST', '/api/weibo/getGiftId', getGiftId],
];
