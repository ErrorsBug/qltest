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

const getChannelList = (req, res, next) => {
    let params = {
        liveId: lo.get(req, 'query.liveId'),
        tagId: lo.get(req, 'query.tagId'),
        caller: 'weapp',
        weappVer: lo.get(req, 'query.weappVer'),
    };

    params.page = {
        page: lo.get(req, 'query.page'),
        size: lo.get(req, 'query.size'),
    };

    proxy.apiProxy(conf.baseApi.channel.listWithTags, params, (err, result) => {
        if (err) {
            resProcessor.error500(req, res, err);
        } else {
            resProcessor.jsonp(req, res, result);
        }
    }, conf.baseApi.secret, req)
}

async function getChanneIndex (req, res, next) {
    let params = lo.pick(req.query, 'channelId')

    let userId = lo.get(req,'rSession.user.userId')

    params.userId = userId;
    params.caller = 'weapp';
    params.weappVer = lo.get(req, 'query.weappVer');
    params.businessId = lo.get(req, 'query.channelId');
    params.page = {
        page: 1,
        size: 5
    };
    let tasks = [
        ['channelInfo', conf.weiboApi.channel.info, params, conf.weiboApi.secret],
        ['userList', conf.weiboApi.channel.userList, params, conf.weiboApi.secret],
        ['introduce', conf.baseApi.channel.getDesc, params, conf.baseApi.secret],
        ['topicList', conf.baseApi.channel.topicList, { ...params, pageSize: 10, pageNum: 1 }, conf.baseApi.secret],
        ['getMarket', conf.baseApi.channel.getMarket, params, conf.baseApi.secret],
        ['chargeStatus', conf.weiboApi.channel.chargeStatus, params, conf.weiboApi.secret],
        ['lastestUpdateCourse', conf.baseApi.channel.newBeginTopic, params, conf.wechatApi.secret],
    ];

    let responseData = {};

    try {
        const results = await proxy.parallelPromise(tasks, req)

        let userList = lo.get(results, 'userList.data.payUserHeadImages') || [];
        userList = userList.slice(0, 5);

        responseData = {
            userList,
            userCount:   lo.get(results, 'userList.data.payUserCount'),
            chargePos:   lo.get(results, 'chargeStatus.data.chargePos'),
            introduce:   lo.get(results, 'introduce.data.descriptions'),
            topicList:   lo.get(results, 'topicList.data.topicList') || [],
            getMarket:   lo.get(results, 'getMarket.data') || {},
            channelInfo: lo.get(results, 'channelInfo.data'),
            lastestUpdateCourse: lo.get(results, 'lastestUpdateCourse.data'),
        };

        let liveId = lo.get(results, 'channelInfo.data.channel.liveId')
        params.liveId = liveId;

        const results2 = await proxy.parallelPromise([
            ['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret],
            ['vipInfo', conf.baseApi.channel.vipInfo, params, conf.baseApi.secret],
            ['liveInfo', conf.baseApi.live.get, params, conf.wechatApi.secret],
            ['isBlack', conf.baseApi.channel.isBlack, params, conf.wechatApi.secret],
        ], req)

        responseData.power = lo.get(results2, 'power.data.powerEntity');
        responseData.vipInfo = lo.get(results2, 'vipInfo.data');
        responseData.liveInfo = lo.get(results2, 'liveInfo.data.entity', {});
        responseData.isBlack = lo.get(results2, 'isBlack.data'),

        resProcessor.jsonp(req, res, responseData);
    } catch (error) {
        console.error(err);
        resProcessor.error500(req, res, err)
    }
}


module.exports = [
    // 获取频道分类列表
    ['GET', '/api/weapp/channel/list', weappAuth(), getChannelList],

    // 获取频道主页信息
    ['GET', '/api/weapp/channel/index', weappAuth(), getChanneIndex],

    // 绑定分销关系
    ['POST','/api/weapp/channel/bind-live-share', weappAuth(), requestProcess(conf.baseApi.channel.bindLiveShare, conf.baseApi.secret)],
    
    ['GET','/api/weapp/channel/groupingList', weappAuth(), requestProcess(conf.baseApi.channel.getChannelGroupingList, conf.baseApi.secret)],
    
    ['GET','/api/weapp/channel/checkIsHasGroup', weappAuth(), requestProcess(conf.baseApi.channel.checkIsHasGroup, conf.baseApi.secret)],
    //免费团长开团
    ['POST','/api/weapp/channel/createGroup', weappAuth(), requestProcess(conf.baseApi.channel.createGroup, conf.baseApi.secret)],
    //付费团长开团
    ['POST', '/api/weapp/channel/getOpenPayGroupResult', weappAuth(), requestProcess(conf.baseApi.channel.getOpenPayGroupResult, conf.wechatApi.secret)],
    //getNewestGroup

    // 获取系列课信息
    ['GET', '/api/weapp/channel/info', weappAuth(), requestProcess(conf.baseApi.channel.info, conf.baseApi.secret)],

    // 获取拼课信息
    ['GET', '/api/weapp/channel/group/info', weappAuth(), requestProcess(conf.baseApi.channel.getChannelGroupInfo, conf.baseApi.secret)],
    
    // 获取拼课结果
    ['GET', '/api/weapp/channel/group/result', weappAuth(), requestProcess(conf.baseApi.channel.getGroupResult, conf.baseApi.secret)],

    // 获取拼课用户列表
    ['GET', '/api/weapp/channel/group/member-list', weappAuth(), requestProcess(conf.baseApi.channel.getPayList, conf.baseApi.secret)],
    
    // 获取付费信息
    ['GET', '/api/weapp/channel/charge-status', weappAuth(), requestProcess(conf.baseApi.channel.chargeStatus, conf.baseApi.secret)],

    // 拼团分享调用
    ['POST', '/api/weapp/channel/group/countShareCache', weappAuth(), requestProcess(conf.baseApi.channel.countShareCache, conf.baseApi.secret)],

    // 保存推送码
    ['POST', '/api/weapp/channel/group/savePushInfo', weappAuth(), requestProcess(conf.baseApi.channel.savePushInfo, conf.baseApi.secret)],

    // 最近学习的课程
    ['GET', '/api/weapp/channel/last-learn-course', weappAuth(), requestProcess(conf.baseApi.channel.lastLearnCourse, conf.baseApi.secret)],

    // 话题id列表
    ['GET', '/api/wechat/channel/topic-id-list', weappAuth(), requestProcess(conf.baseApi.homework.getTopicListByChannel, conf.baseApi.secret)],

    //判断是否分销
    ['POST', '/api/weapp/isShare', weappAuth(), requestProcess(conf.baseApi.channel.isShare, conf.baseApi.secret)],   
    
    //获取小程序带参二维码
    ['POST', '/api/weapp/getweappQr', weappAuth(), requestProcess(conf.baseApi.channel.getweappQr, conf.baseApi.secret)],

    //获取带参二维码scene的参数
    ['POST', '/api/weapp/sceneInfo', weappAuth(), requestProcess(conf.baseApi.channel.sceneInfo, conf.baseApi.secret)],

    // 检查是否已经购买过相同的课程
    ['POST', '/api/weapp/checkDuplicateBuy', weappAuth(), requestProcess(conf.baseApi.channel.checkDuplicateBuy, conf.baseApi.secret)],
]
