const path = require('path');
const _ = require('underscore');
const async = require('async');
const clientParams = require('../../middleware/client-params/client-params');
const proxy = require('../../components/proxy/proxy');
const resProcessor = require('../../components/res-processor/res-processor');
const conf = require('../../conf');
const studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
const lo = require('lodash');
const requestProcess = require('../../middleware/request-process/request-process');

function liveIndex(req, res, next) {
    let params = lo.pick(req.query, ['liveId', 'caller', 'weappVer'])
    let userData = req.rSession.user;

    params.userId = userData && userData.userId;

    var tasks = [
        ['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
        ['pageConfig', conf.adminApi.pageConfig, params, conf.adminApi.secret],
        ['followNum', conf.baseApi.live.followNum, params, conf.baseApi.secret],
        ['liveIntro', conf.baseApi.live.liveIntro, params, conf.baseApi.secret],
        ['liveSymbol', conf.baseApi.live.getLiveSymbol, params, conf.baseApi.secret],
        ['banners', conf.baseApi.live.getBannerList, params, conf.baseApi.secret],
    ];

    // 如果登入
    if (userData && userData.userId) {
        tasks.push(['isFollow', conf.weiboApi.live.isFollow, params, conf.weiboApi.secret]);
        tasks.push(['focusThree', conf.weiboApi.live.focusThree, params, conf.weiboApi.secret]);
        tasks.push(['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret]);
    }

    proxy.parallelPromise(tasks, req).then(results => {
        let liveInfoTemp = Object.assign(
            {},
            lo.get(results, 'liveInfo.data.entityExtend', {}),
            lo.get(results, 'liveInfo.data.entity', {}),
            {
                banners: lo.get(results, 'liveInfo.data.banners', [])
            }
        );
        let liveInfo = liveInfoTemp;
        
        let responseData = {
            liveInfo,
            pageConfig: lo.get(results, 'pageConfig.data.config', {}),
            followNum: lo.get(results, 'followNum.data.follwerNum', 0),
            isFollow: lo.get(results, 'isFollow.data', false),
            power: lo.get(results, 'power.data.powerEntity'),
            liveIntro: lo.get(results, 'liveIntro.data'),
            liveSymbol: lo.get(results, 'liveSymbol.data'),
            banners: lo.get(results, 'banners.data', []),
            serverTime: Date.now(),
        }

        resProcessor.jsonp(req, res, responseData);
    }).catch(err => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });

}

module.exports = [
    // 获取频道分类列表
    ['GET', '/api/studio-weapp/live/type-list', requestProcess(conf.baseApi.live.typeList, conf.baseApi.secret)],

    // 获取直播间主页
    ['GET', '/api/studio-weapp/live/index', liveIndex],

    // 直播间关注取关
    ['GET', '/api/studio-weapp/live/focus', studioWeappAuth(), requestProcess(conf.baseApi.liveFocus, conf.baseApi.secret)],
    
    // 获取直播间信息
    ['GET', '/api/studio-weapp/live/info', requestProcess(conf.baseApi.live.get, conf.baseApi.secret)],

    // 获取直播间介绍
    ['GET', '/api/studio-weapp/live/intro',  requestProcess(conf.baseApi.live.liveIntro, conf.baseApi.secret)],

    // 绑定分销关系
    ['POST','/api/studio-weapp/channel/bind-live-share', studioWeappAuth(), requestProcess(conf.baseApi.channel.bindLiveShare, conf.baseApi.secret)],

    // 获取话题 share-key
    ['GET', '/api/studio-weapp/topic/getTopicAutoQualify', studioWeappAuth(), requestProcess(conf.baseApi.share.getTopicAutoQualify, conf.baseApi.secret)],

    // 获取系列课 share-key
    ['GET', '/api/studio-weapp/channel/getChannelAutoQualify', studioWeappAuth(), requestProcess(conf.baseApi.share.getChannelAutoQualify, conf.baseApi.secret)],

    // 获取直播间 l-share-key
    ['GET', '/api/studio-weapp/live/getLiveShareQualify', studioWeappAuth(), requestProcess(conf.baseApi.share.qualify, conf.baseApi.secret)],

    // 获取用户信息
    ['GET', '/api/studio-weapp/user/info', clientParams(), studioWeappAuth(), requestProcess(conf.baseApi.user.info, conf.baseApi.secret)],
    
    // 用户在直播间已购买课程
    ['GET', '/api/studio-weapp/live/purchase-course', clientParams(), studioWeappAuth(), requestProcess(conf.baseApi.live.purchaseCourse, conf.baseApi.secret)],
    
    // 直播间即将开始的课程
    ['GET', '/api/studio-weapp/live/plan-course', clientParams(), studioWeappAuth(), requestProcess(conf.baseApi.live.planCourse, conf.baseApi.secret)],
    
    // 获取vip信息
    ['GET', '/api/studio-weapp/live/vip/info', studioWeappAuth(), requestProcess(conf.baseApi.channel.vipInfo, conf.baseApi.secret)],

    // 获取黑名单信息
    ['GET', '/api/studio-weapp/live/black/info', studioWeappAuth(), requestProcess(conf.baseApi.channel.isBlack, conf.baseApi.secret)],

    // 是否关注直播间
    ['GET', '/api/studio-weapp/live/is-follow', studioWeappAuth(), requestProcess(conf.baseApi.isLiveFocus, conf.baseApi.secret)],

    // 直播间关注数
    ['GET', '/api/studio-weapp/live/followNum', requestProcess(conf.baseApi.live.followNum, conf.baseApi.secret)],

    // 动态
    ['GET', '/api/studio-weapp/timeline/list',  requestProcess(conf.baseApi.timeline.getTimelineList, conf.baseApi.secret)],

    // 点赞动态
    ['POST', '/api/studio-weapp/timeline/like', studioWeappAuth(), requestProcess(conf.baseApi.timeline.like, conf.baseApi.secret)],

    // 获取话题列表
    ['GET', '/api/studio-weapp/live/topic-list',  requestProcess(conf.baseApi.live.getTopic, conf.baseApi.secret)],

    // 精选列表
    ['GET', '/api/studio-weapp/live/consult/collection', studioWeappAuth(), requestProcess(conf.baseApi.consult.selected, conf.baseApi.secret)],

    // 留言点赞
    ['POST', '/api/studio-weapp/live/consult/praise', studioWeappAuth(), requestProcess(conf.baseApi.consult.praise, conf.baseApi.secret)],

    // 获取vip收费信息
    ['GET', '/api/studio-weapp/live/vip/charge-info', studioWeappAuth(), requestProcess(conf.baseApi.live.vipChargeInfo, conf.baseApi.secret)],

    
]
