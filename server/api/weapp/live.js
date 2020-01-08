const path = require('path');
const _ = require('underscore');
const async = require('async');
const clientParams = require('../../middleware/client-params/client-params');
const proxy = require('../../components/proxy/proxy');
const resProcessor = require('../../components/res-processor/res-processor');
const conf = require('../../conf');
const weappAuth = require('../../middleware/auth/1.0.0/weapp-auth');
const lo = require('lodash');
const requestProcess = require('../../middleware/request-process/request-process');

const getTypeList = (req, res, next) => {
    let params = {
        liveId: lo.get(req, 'query.liveId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    proxy.apiProxy(conf.baseApi.live.typeList, params, (err, result) => {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.baseApi.secret, req)
}

async function liveIndex(req, res, next) {
    var params = {
        liveId: lo.get(req, 'query.liveId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    var userData = req.rSession.user;

    params.userId = userData && userData.userId;

    var tasks = [
        ['liveInfo', conf.weiboApi.live.liveInfo, params, conf.weiboApi.secret],
        ['liveIntro', conf.baseApi.live.liveIntro, params, conf.baseApi.secret],
        ['liveSymbol', conf.baseApi.live.getLiveSymbol, params, conf.baseApi.secret],
        ['banners', conf.baseApi.live.getBannerList, params, conf.baseApi.secret],
        ['isLiveAdmin', conf.baseApi.isLiveAdmin, params, conf.baseApi.secret],
    ];

    // 如果登入
    if (userData && userData.userId) {
        tasks.push(['focusThree', conf.weiboApi.live.focusThree, params, conf.weiboApi.secret]);
        tasks.push(['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret]);
    }

    try {
        const results = await proxy.parallelPromise(tasks, req)
        let liveInfoTemp = Object.assign(
            {},
            lo.get(results, 'liveInfo.data.entityExtend', {}),
            lo.get(results, 'liveInfo.data.entity', {})
        );
        let liveInfo = liveInfoTemp;
        console.log('==========================',lo.get(results, 'isLiveAdmin.data', {}))
        let responseData = {
            liveInfo,
            power: lo.get(results, 'power.data.powerEntity'),
            liveIntro: lo.get(results, 'liveIntro.data'),
            liveSymbol: lo.get(results, 'liveSymbol.data'),
            banners: lo.get(results, 'banners.data', []),
            isLiveAdmin: lo.get(results, 'isLiveAdmin.data', {}),
            serverTime: Date.now(),
        }

        resProcessor.jsonp(req, res, responseData);        
    } catch (error) {
        console.error(err);
        resProcessor.error500(req, res, err);
    }
}


function liveFocus(req, res, next) {
    let params = _.pick(req.query, 'topicId', 'liveId', 'status');
    params.userId = lo.get(req, 'rSession.user.userId');
    params.caller = 'weapp';
    params.weappVer = lo.get(req, 'query.weappVer');

    proxy.parallelPromise([
        [conf.baseApi.liveFocus, params, conf.baseApi.secret],
    ], req).then(result => {
        resProcessor.jsonp(req, res, result[0]);
    }).catch(err => {
        resProcessor.error500(req, res, err);
        console.error(err);
    })
}

function liveIntro(req, res, next) {
    const params = {};
    params.userId = lo.get(req, 'rSession.user.userId');
    params.liveId = lo.get(req, 'query.liveId');
    params.caller = 'weapp';
    params.weappVer = lo.get(req, 'query.weappVer');

    proxy.parallelPromise([
        [conf.baseApi.live.liveIntro, params, conf.baseApi.secret],
    ], req).then(result => {
        resProcessor.jsonp(req, res, result[0]);
    }).catch(err => {
        resProcessor.error500(req, res, err);
        console.error(err);
    })
}

async function shareCardData (req, res, next) {
    const {
        businessType,
        businessId,
        userId,
        showQl,
        source_type,
    } = req.query;

    let url = '';
    let params = {
        userId,
        showQl: source_type == "livecenter" ? "Y" : "N"
    };

    if (businessType === 'channel') {
        url = conf.baseApi.channel.shareCardData;
        params.channelId = businessId;
    } else if (businessType === 'topic') {
        url = conf.baseApi.topic.shareCardData;
        params.topicId = businessId;
    } else {
        resProcessor.reject(req, res, '参数错误，缺少 businessType');
        return;
    }

    try {
        const result = await proxy.apiProxyPromise(url, params, conf.baseApi.secret, req);
        resProcessor.jsonp(req, res, result);
    } catch (error) {
        console.error('api请求失败 shareCardData: ', error);
        resProcessor.error500(req, res, error);
    }
}

module.exports = [
    // 获取频道分类列表
    ['GET', '/api/weapp/live/type-list', weappAuth(), getTypeList],

    // 获取直播间主页
    ['GET', '/api/weapp/live/index', weappAuth(), liveIndex],

    // 直播间关注取关
    ['GET', '/api/weapp/live/focus', weappAuth(), liveFocus],

    // 获取直播间介绍
    ['GET', '/api/weapp/live/intro', weappAuth(), liveIntro],

    // 绑定分销关系
    ['POST','/api/wechat/channel/bind-live-share', weappAuth(), requestProcess(conf.baseApi.channel.bindLiveShare, conf.baseApi.secret)],

    // 获取话题 share-key
    ['GET', '/api/wechat/topic/getTopicAutoQualify', weappAuth(), requestProcess(conf.baseApi.share.getTopicAutoQualify, conf.baseApi.secret)],
 
    // 获取系列课 share-key
    ['GET', '/api/wechat/channel/getChannelAutoQualify', weappAuth(), requestProcess(conf.baseApi.share.getChannelAutoQualify, conf.baseApi.secret)],

    // 获取直播间 l-share-key
    ['GET', '/api/wechat/live/getLiveShareQualify', weappAuth(), requestProcess(conf.baseApi.share.qualify, conf.baseApi.secret)],

    // 获取vip信息
    ['GET', '/api/weapp/live/vip/info', weappAuth(), requestProcess(conf.baseApi.channel.vipInfo, conf.baseApi.secret)],
    
    // 获取黑名单信息
    ['GET', '/api/weapp/live/black/info', weappAuth(), requestProcess(conf.baseApi.channel.isBlack, conf.baseApi.secret)],

    // 是否关注直播间
    ['GET', '/api/weapp/live/is-follow', weappAuth(), requestProcess(conf.baseApi.isLiveFocus, conf.baseApi.secret)],
    
    // 直播间关注数
    ['GET', '/api/weapp/live/followNum', weappAuth(), requestProcess(conf.baseApi.live.followNum, conf.baseApi.secret)],

    // 动态
    ['GET', '/api/weapp/timeline/list', weappAuth(), requestProcess(conf.baseApi.timeline.getTimelineList, conf.baseApi.secret)],

    // 点赞动态
    ['POST', '/api/weapp/timeline/like', weappAuth(), requestProcess(conf.baseApi.timeline.like, conf.baseApi.secret)],

    // 获取话题列表
    ['GET', '/api/weapp/live/topic-list', weappAuth(), requestProcess(conf.baseApi.live.getTopic, conf.baseApi.secret)],

    // 精选列表
    ['GET', '/api/weapp/live/consult/collection', weappAuth(), requestProcess(conf.baseApi.consult.selected, conf.baseApi.secret)],

    // 留言点赞
    ['POST', '/api/weapp/live/consult/praise', weappAuth(), requestProcess(conf.baseApi.consult.praise, conf.baseApi.secret)],

    // 获取vip收费信息
    ['POST', '/api/weapp/live/vip/charge-info', weappAuth(), requestProcess(conf.baseApi.live.vipChargeInfo, conf.baseApi.secret)],

    // 获取二维码
    ['GET', '/api/weapp/live/get-qr', clientParams(), weappAuth(), requestProcess(conf.baseApi.live.getQr, conf.baseApi.secret)],

    // 获取邀请卡信息
    ['GET', '/api/weapp/share-card-data', clientParams(), weappAuth(), shareCardData],

    // 获取分销收益列表
    ['GET', '/api/weapp/getListWithoutQlUser', weappAuth(), requestProcess(conf.baseApi.live.getListWithoutQlUser, conf.baseApi.secret)],
]
