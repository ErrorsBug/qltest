var lo = require('lodash'),
    _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');

/**
 * 获取系列课页面初始化数据
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var guestSeparateInitData = (params, req) => {

    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['getGuestInfo',conf.baseApi.guestSeparate.getInvitationInfo, params, conf.baseApi.secret],
        ['getAssignedPercent',conf.baseApi.guestSeparate.getAssignedPercent,params, conf.baseApi.secret],
        ['sumShareMoney', conf.baseApi.guestSeparate.sumShareMoney,params, conf.baseApi.secret],
    ], req);
};

const getInvitationInfo = (params, req) => {
	return proxy.parallelPromise([
		['invitationInfo', conf.baseApi.guestSeparate.getInvitationInfo, params, conf.baseApi.secret]
	], req);
};

const getPercentPleaseInfo = (params, req) => {
	return proxy.parallelPromise([
        ['invitationInfo', conf.baseApi.guestSeparate.getInvitationInfo, params, conf.baseApi.secret],
		['getPercentPleaseInfo', conf.baseApi.guestSeparate.getPercentPleaseStatus, params, conf.baseApi.secret],
    ], req);
};


module.exports = [
	['GET','/api/wechat/guestSeparate/info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.getGuestInfo, conf.baseApi.secret)],
    ['POST','/api/wechat/guestSeparate/setPercent', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.updatePercent, conf.baseApi.secret)],
    ['POST','/api/wechat/guestSeparate/setEndTime', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.updateExpiryTime, conf.baseApi.secret)],
    ['POST','/api/wechat/guestSeparate/over', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.stopShare, conf.baseApi.secret)],
    ['GET','/api/wechat/guestSeparate/clearingList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.getTransferList, conf.baseApi.secret)],
    ['GET','/api/wechat/guestSeparate/detailList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.getGuestProfitList, conf.baseApi.secret)],
    ['GET', '/api/wechat/guestSeparate/countProfitRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.countProfitRecord, conf.baseApi.secret)],
    ['GET', '/api/wechat/guestSeparate/counTransferRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.counTransferRecord, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/getChannelList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.channelList, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/getTopicList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.topicList, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/getCampList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.campList, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/channelAddedSeparateList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.channelAddedSeparateList, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/addSeparate', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.addSeparate, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/getAssignedPercent', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.getAssignedPercent, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/clearing', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.clearing, conf.baseApi.secret)],
    ['POST','/api/wechat/guest-separate/acceptInvitation', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.acceptInvitation, conf.baseApi.secret)],
    ['GET','/api/wechat/guest-separate/getChannelGuestData', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.getChannelGuestData, conf.baseApi.secret)],
	['POST','/api/wechat/guest-separate/deleteEmptyGuest', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.deleteEmptyGuest, conf.baseApi.secret)],
    ['POST','/api/wechat/guest-separate/cacheAcceptShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.cacheAcceptShare, conf.baseApi.secret)],
    ['POST','/api/wechat/guest-separate/cacheUpdateSharePercent', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.cacheUpdateSharePercent, conf.baseApi.secret)],
    ['POST','/api/wechat/guest-separate/updateIsAutoTransfer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.updateIsAutoTransfer, conf.baseApi.secret)],
    ['GET', '/api/wechat/guest-separate/getBalanceData', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.getGuestBalance, conf.baseApi.secret)],
	['GET', '/api/wechat/guest-separate/isExistAuditRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestSeparate.isExistAuditRecord, conf.baseApi.secret)],
];

module.exports.guestSeparateInitData = guestSeparateInitData;
module.exports.getInvitationInfo = getInvitationInfo;
module.exports.getPercentPleaseInfo=getPercentPleaseInfo;
