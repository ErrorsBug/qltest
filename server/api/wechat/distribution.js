var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process'),
    lo = require('lodash');


var sendChannelQualify = (params, req) => {

    return proxy.parallelPromise([
        ['channelQualify', conf.baseApi.share.sendChannelQualify, params, conf.baseApi.secret],
        ['userInfo', conf.baseApi.user.info, params, conf.baseApi.secret],
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],
        // ['blackInfo', conf.baseApi.channel.isBlack,, params, conf.baseApi.secret],
    ], req);
};

var sendbatchChannelQualify = (params, req) => {

    return proxy.parallelPromise([
        ['channelQualify', conf.baseApi.share.sendbatchChannelQualify, params, conf.baseApi.secret],
        ['userInfo', conf.baseApi.user.info, params, conf.baseApi.secret],
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],
    ], req);
};

var acceptLiveTopicShareInvite = (params, req, businessType) => {

    return proxy.parallelPromise([
        [`${businessType}Qualify`, conf.baseApi.share.acceptLiveTopicShareInvite, params, conf.baseApi.secret],
        ['userInfo', conf.baseApi.user.info, params, conf.baseApi.secret],
        [`${businessType}Info`, conf.baseApi[businessType][businessType === 'live' ? 'get' : 'topicInfo'], params, conf.baseApi.secret],
        // ['blackInfo', conf.baseApi.channel.isBlack,, params, conf.baseApi.secret],
    ], req);
};

var acceptBatchLiveTopicShareInvite = (params, req) => {
    const { businessType } = params;

    return proxy.parallelPromise([
        [`${businessType}Qualify`, conf.baseApi.share.acceptBatchLiveTopicShareInvite, params, conf.baseApi.secret],
        ['userInfo', conf.baseApi.user.info, params, conf.baseApi.secret],
        [`${businessType}Info`, conf.baseApi[businessType][businessType === 'live' ? 'get' : 'topicInfo'], params, conf.baseApi.secret],
    ], req);
};

function distributionUserInfo (req, res, next) {
    // 获得参数
    var params = _.pick(req.query, 'userId');

    proxy.apiProxy(conf.baseApi.user.info, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

var checkPower = (params, req) => {

    return proxy.parallelPromise([
        ['userPower', conf.baseApi.user.power, params, conf.baseApi.secret],
    ], req);
};


var checkDetailPower = (params, req) => {
    const { userId, businessId, businessType } = params;
    let paramsCheckUserPower = {
        userId
    };
    paramsCheckUserPower[`${businessType}Id`] = businessId
    return proxy.parallelPromise([
        ['userPower', conf.baseApi.user.power, paramsCheckUserPower, conf.baseApi.secret],
        ['getQualify', conf.baseApi.share.getMyQualify, params, conf.baseApi.secret],

    ], req);
};

var shareQualifyPo = (params, req) => {

    return proxy.parallelPromise([
        ['qualify', conf.baseApi.platformShare.getPlatformShareQualify, params, conf.baseApi.secret],
        // ['qualify', conf.baseApi.share.qlLiveShareQualify, params, conf.baseApi.secret],
    ], req);
};


/**
 * 系列课分销
 * @Author  qingxia
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */

module.exports = [
    ['GET', '/api/wechat/channelshare/auto-distribution-info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getChannelAutoShare, conf.baseApi.secret)],
    ['POST', '/api/wechat/channelshare/auto-distribution-set', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.saveChannelAutoShare, conf.baseApi.secret)],
    ['POST', '/api/wechat/channelshare/distribution-user-add', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.addChannelShareQualify, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/share/distribution/add', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.addLiveShareQualify, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/share/distribution/add', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.addTopicShareQualify, conf.baseApi.secret)],

    ['GET', '/api/wechat/channel/channelDistributionIndexList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.channelDistributionIndexList, conf.baseApi.secret)],
    // 系列课课代表列表
    ['POST', '/api/wechat/channel/channelDistributionList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.channelDistributionList, conf.baseApi.secret)],
    // 话题课代表列表
    ['POST', '/api/wechat/topic/topicDistributionList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.topicDistributionList, conf.baseApi.secret)],
    // 更改课代表状态
    ['POST', '/api/wechat/channel/changeChannelRepresentStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.changeChannelRepresentStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribution/changeLiveTopicRepresentStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.changeLiveTopicRepresentStatus, conf.baseApi.secret)],

    ['GET', '/api/wechat/channel/getQualifyPercent', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getQualifyPercent, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/getChannelQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getChannelQualify, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/getChannelAutoQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getChannelAutoQualify, conf.baseApi.secret)],
    // 课代表分销明细
    ['GET', '/api/wechat/channel/channel-distribution-detail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.channelDistributionDetail, conf.baseApi.secret)],
    ['GET', '/api/wechat/topic/topic-distribution-detail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.topicDistributionDetail, conf.baseApi.secret)],
    ['GET', '/api/wechat/user/distribution-user-info', clientParams(), appAuth(), wxAuth(), distributionUserInfo],

	['GET', '/api/wechat/myDistributionAccount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.myDistributionAccount, conf.baseApi.secret)],
	['POST', '/api/wechat/distributionAccountWithdraw', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.distributionAccountWithdraw, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribution/rank', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.list, conf.baseApi.secret)],
    // 新的分销排行榜
    ['POST', '/api/wechat/distribution/newRank', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getInviteRankList, conf.shareFrontApi.secret)],
    
    // 获取直播间分销比例
    ['POST', '/api/wechat/distribution/qlLiveShareQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.qlLiveShareQualify, conf.baseApi.secret)],    
    // 判断是否是专业版
    ['POST', '/api/wechat/distribution/adminFlag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.adminFlag, conf.baseApi.secret)],
	// 获取千聊直通车分销信息
    ['POST', '/api/wechat/distribution/getQlShareQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getQlShareQualify, conf.baseApi.secret)],
    
    ['POST', '/api/wechat/platformShare/getQualify', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.getPlatformShareQualify, conf.baseApi.secret)],
    ['POST', '/api/wechat/platformShare/closeQlRecommend', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.closeQlRecommend, conf.baseApi.secret)],
    ['POST', '/api/wechat/platformShare/addQualify', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.addQualify, conf.baseApi.secret)],
    ['POST', '/api/wechat/platformShare/getTotalProfit', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.getTotalProfit, conf.baseApi.secret)],
    ['POST', '/api/wechat/platformShare/getProfitList', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.getProfitList, conf.baseApi.secret)],
    ['POST', '/api/wechat/platformShare/getProfitDetailList', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.getProfitDetailList, conf.baseApi.secret)],

    // 直播间授权分销相关
    ['POST', '/api/wechat/distribute/shareUsersLive', clientParams(), wxAuth(), requestProcess(conf.baseApi.share.shareUsersLive, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribute/shareUsersLiveCount', clientParams(), wxAuth(), requestProcess(conf.baseApi.share.shareUsersLiveCount, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribute/shareManage', clientParams(), wxAuth(), requestProcess(conf.baseApi.share.shareManage, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribute/changelock', clientParams(), wxAuth(), requestProcess(conf.baseApi.share.changelock, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribute/removeShare', clientParams(), wxAuth(), requestProcess(conf.baseApi.share.removeShare, conf.baseApi.secret)],
    ['POST', '/api/wechat/distribute/updateShareStatus', clientParams(), wxAuth(), requestProcess(conf.baseApi.share.updateShareStatus, conf.baseApi.secret)],

    //分销话题列表
    ['POST', '/api/wechat/distribute/shareTopicList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.shareTopicList, conf.baseApi.secret)],

];

module.exports.sendChannelQualify = sendChannelQualify;
module.exports.sendbatchChannelQualify = sendbatchChannelQualify;
module.exports.acceptLiveTopicShareInvite = acceptLiveTopicShareInvite;
module.exports.acceptBatchLiveTopicShareInvite = acceptBatchLiveTopicShareInvite;
module.exports.checkPower=checkPower;
module.exports.checkDetailPower=checkDetailPower;
module.exports.shareQualifyPo = shareQualifyPo;
