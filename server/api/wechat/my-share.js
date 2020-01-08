var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process'),
    lo = require('lodash');

/**
 * 获取我的分销推广列表
 * @Author  dodomon
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var myShare = function (req, res, next) {
    var params={};

    let page = {
        page:req.query.page,
        size:req.query.size,
    }
    params.type = req.query.type;
    params.page = page;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.myShare, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var myShareChannel = function (req, res, next) {
    var params={};
    let page = {
        page:req.query.page,
        size:req.query.size,
    }
    params.type = req.query.type;
    params.page = page;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.myShareChannel, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var shareCardVip=function(req, res, next){
    var params={};
    params.shareKey = req.query.shareKey;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareCardVip, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var getShareCard=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.getShareCard, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


var shareIncomeFlow=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeFlow, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var shareIncomeListTopic=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeListTopic, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var shareIncomeListVip=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeListVip, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var shareIncomeListChannel=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeListChannel, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


var shareIncomeDetailsTopic=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeListDetailTopic, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var shareIncomeDetailTopic=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeInitDetailTopic, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


var shareIncomeDetailsVip=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeListDetailVip, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var shareIncomeDetailVip=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeInitDetailVip, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


var shareIncomeDetailsChannel=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeListDetailChannel, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var shareIncomeDetailChannel=function(req, res, next){
    var params={};
    params = req.query;
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.my.shareIncomeInitDetailChannel, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

module.exports = [
    ['GET', '/api/wechat/my/my-share', clientParams(), appAuth(), wxAuth(), myShare],
    ['GET', '/api/wechat/my/my-share-channel', clientParams(), appAuth(), wxAuth(), myShareChannel],
    ['GET', '/api/wechat/my/share-card-vip', clientParams(), appAuth(), wxAuth(), shareCardVip],
    ['GET', '/api/wechat/my/get-share-card', clientParams(), appAuth(), wxAuth(), getShareCard],
    ['GET', '/api/wechat/my/share-income-flow', clientParams(), appAuth(), wxAuth(), shareIncomeFlow],
    ['GET', '/api/wechat/my/share-income-list-topic', clientParams(), appAuth(), wxAuth(), shareIncomeListTopic],
    ['GET', '/api/wechat/my/share-income-list-vip', clientParams(), appAuth(), wxAuth(), shareIncomeListVip],
    ['GET', '/api/wechat/my/share-income-list-channel', clientParams(), appAuth(), wxAuth(), shareIncomeListChannel],

    ['GET', '/api/wechat/my/share-income-details-channel', clientParams(), appAuth(), wxAuth(), shareIncomeDetailsChannel],
    ['GET', '/api/wechat/my/share-income-detail-channel', clientParams(), appAuth(), wxAuth(), shareIncomeDetailChannel],

    ['GET', '/api/wechat/my/share-income-details-topic', clientParams(), appAuth(), wxAuth(), shareIncomeDetailsTopic],
    ['GET', '/api/wechat/my/share-income-detail-topic', clientParams(), appAuth(), wxAuth(), shareIncomeDetailTopic],

    ['GET', '/api/wechat/my/share-income-details-vip', clientParams(), appAuth(), wxAuth(), shareIncomeDetailsVip],
    ['GET', '/api/wechat/my/share-income-detail-vip', clientParams(), appAuth(), wxAuth(), shareIncomeDetailVip],

    ['GET', '/api/wechat/my/get-channel-share-card', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.my.getChannelShareCard, conf.baseApi.secret)],


];
