var _ = require('underscore'),
lo = require('lodash'),

resProcessor = require('../../components/res-processor/res-processor'),
proxy = require('../../components/proxy/proxy'),
wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
appAuth = require('../../middleware/auth/1.0.0/app-auth'),
clientParams = require('../../middleware/client-params/client-params'),
conf = require('../../conf'),
requestProcess = require('../../middleware/request-process/request-process');

var getTopicInfo = (params, req) => {
    return proxy.parallelPromise([
        ['topicInfo', conf.baseApi.nightAnswer.getTopicInfo, params, conf.baseApi.secret],
    ], req);
};
var getNightAnswerShow = (params, req) => {
    return proxy.parallelPromise([
        ['showList', conf.baseApi.nightAnswer.getTopicList, params, conf.baseApi.secret],
    ], req);
};
var fetchShowList = function(req, res, next) {
    var params = {
        page: {
            page: req.body.page,
            size: req.body.size,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    getNightAnswerShow(params, req).then((data) => {
        resProcessor.jsonp(req, res, data.showList);
    }).catch((err) => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};
var getAnswerList = (params, req) => {
    return proxy.parallelPromise([
        [conf.baseApi.nightAnswer.getAnswerList, params, conf.baseApi.secret],
    ], req);
};
var getInitAnswer = function(req, res, next) {
    var params = {
        page: {
            page: 1,
            size: 50,
        },
        topicId: req.body.topicId,
        userId: lo.get(req, 'rSession.user.userId')
    };

    getAnswerList(params, req).then((data) => {
        resProcessor.jsonp(req, res, data[0]);
    }).catch((err) => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};
var getCommentList = function(req, res, next) {
    var params = {
        userId: lo.get(req, 'rSession.user.userId'),
        topicId: req.body.topicId,
        page: {
            page: req.body.pageNum,
            size: req.body.pageSize
        }
    };
    if(req.query.from){
        params.from = req.query.from
    }
    proxy.parallelPromise([
        [conf.baseApi.nightAnswer.getDiscussList, params, conf.baseApi.secret],
    ], req).then((result) => {
        resProcessor.jsonp(req, res, result[0]);
    }).catch((err) => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};
var addComment = function(req, res, next) {
    var params = {
        userId: lo.get(req, 'rSession.user.userId'),
        topicId: req.body.topicId,
        content: req.body.content
    };
    proxy.parallelPromise([
        [conf.baseApi.nightAnswer.addDiscuss, params, conf.baseApi.secret],
    ], req).then((data) => {
        resProcessor.jsonp(req, res, data[0]);
    }).catch((err) => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};
var like = function(req, res, next) {
    var params = {
        userId: lo.get(req, 'rSession.user.userId'),
        businessId: req.body.businessId,
        businessType: req.body.businessType,
        status: req.body.status,
    };
    proxy.parallelPromise([
        [conf.baseApi.nightAnswer.like, params, conf.baseApi.secret],
    ], req).then((data) => {
        resProcessor.jsonp(req, res, data[0]);
    }).catch((err) => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });
};
module.exports = [
    ['POST','/api/wechat/night-answer/getTopicInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.nightAnswer.getTopicInfo, conf.baseApi.secret)],
    ['POST','/api/wechat/night-answer/fetchShowList', clientParams(), appAuth(), wxAuth(), fetchShowList],
    ['POST','/api/wechat/night-answer/getInitAnswer', clientParams(), appAuth(), wxAuth(), getInitAnswer],
    ['POST','/api/wechat/night-answer/getCommentList', clientParams(), appAuth(), wxAuth(), getCommentList], 
    ['POST','/api/wechat/night-answer/addComment', clientParams(), appAuth(), wxAuth(), addComment],
    ['POST','/api/wechat/night-answer/like', clientParams(), appAuth(), wxAuth(), like],      
    ['POST','/api/wechat/night-answer/getUserInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.info, conf.baseApi.secret)],
]

module.exports.getTopicInfo = getTopicInfo;
module.exports.getAnswerList = getAnswerList;
module.exports.getNightAnswerShow = getNightAnswerShow;