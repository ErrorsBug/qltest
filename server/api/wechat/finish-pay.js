const proxy = require('../../components/proxy/proxy'),
    lo = require('lodash'),
    _ = require('underscore'),
    conf = require('../../conf');

const getTopicFinishPayData = (params, req) => {
    let requestList = [
        // 支付成功与否接口

        ['lShareKey', conf.baseApi.share.qualify, params, conf.baseApi.secret], // 直播间资格
        ['tShareKey', conf.baseApi.share.qualify, params, conf.baseApi.secret], // 话题资格
        ['autoShare', conf.baseApi.share.getTopicAutoShare, params, conf.baseApi.secret],
    ];

    return proxy.parallelPromise(requestList, req);
};
const getChannelFinishPayData = (params, req) => {
    let requestList = [
        // 支付成功与否接口

        ['lShareKey', conf.baseApi.share.qualify, params, conf.baseApi.secret],
        ['cShareKey', conf.baseApi.share.getChannelQualify, params, conf.baseApi.secret],
        ['autoShare', conf.baseApi.share.getChannelAutoShare, params, conf.baseApi.secret],
    ];

    return proxy.parallelPromise(requestList, req);
};
const getVIPFinishPayData = (params, req) => {
    let requestList = [
        // 支付成功与否接口

        ['lShareKey', conf.baseApi.share.qualify, params, conf.baseApi.secret],
    ];

    return proxy.parallelPromise(requestList, req);
};

const getLiveTagPaster = (params, req) => {
    return proxy.parallelPromise([
		    ['paster', conf.baseApi.pay.getLiveTagPaster, params, conf.baseApi.secret]
	    ], req);
};

module.exports.getTopicFinishPayData = getTopicFinishPayData;
module.exports.getChannelFinishPayData = getChannelFinishPayData;
module.exports.getVIPFinishPayData = getVIPFinishPayData;
module.exports.getLiveTagPaster = getLiveTagPaster;
