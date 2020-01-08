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

function getChanneIndex (req, res, next) {
    let params = lo.pick(req.query, ['channelId', 'caller', 'weappVer'])
    let userData = req.rSession.user;

    params.userId = userData && userData.userId;
    params.page = {
        page: 1,
        size: 5
    };

    let tasks = [
        ['channelInfo', conf.weiboApi.channel.info, params, conf.weiboApi.secret],
        ['userList', conf.weiboApi.channel.userList, params, conf.weiboApi.secret],
        ['desc', conf.baseApi.channel.getDesc, params, conf.baseApi.secret],
        ['topicList', conf.baseApi.channel.topicList, { ...params, pageSize: 10, pageNum: 1 }, conf.baseApi.secret],
    ];

    if (userData && userData.userId) {
        tasks.push(['chargeStatus', conf.weiboApi.channel.chargeStatus, params, conf.weiboApi.secret]);
    }

    let responseData = {};

    proxy.parallelPromise(tasks, req)
        .then((results) => {
            let chargeConfigs = lo.get(results, 'channelInfo.data.chargeConfigs', []);
            let chargeConfigsStr = [];

            for(let i=0; i<chargeConfigs.length; i++) {
                if (i < 2) {
                    chargeConfigsStr.push('￥' + chargeConfigs[i].amount + '/' + chargeConfigs[i].chargeMonths + '个月')
                }
            }
            chargeConfigsStr = chargeConfigsStr.join('、');

            let userList = lo.get(results, 'userList.data.payUserHeadImages') || [];
            userList = userList.slice(0, 5);

            responseData = {
                chargeConfigsStr,
                userList: userList,
                userCount: lo.get(results, 'userList.data.payUserCount'),
                chargePos: lo.get(results, 'chargeStatus.data.chargePos'),
                ticketMoney: chargeConfigs.length > 0 &&
                                lo.get(results, 'channelInfo.data.chargeConfigs[0].amount', []),
                channelInfo: lo.get(results, 'channelInfo.data'),
                // power: lo.get(results, 'power.data.powerEntity'),
                desc: lo.get(results, 'desc.data.descriptions'),
                topicList: lo.get(results, 'topicList.data.topicList') || [],
            };

            let liveId = lo.get(results, 'channelInfo.data.channel.liveId')
            return liveId;
        })
        .then(liveId => {
            params.liveId = liveId;
            return proxy.parallelPromise([
                ['power', conf.weiboApi.common.getPower, params, conf.weiboApi.secret],
                ['vipInfo', conf.baseApi.channel.vipInfo, params, conf.baseApi.secret],
            ], req)
        })
        .then(results => {
            responseData.power = lo.get(results, 'power.data.powerEntity');
            responseData.vipInfo = lo.get(results, 'vipInfo.data');
            resProcessor.jsonp(req, res, responseData);
        })
        .catch(function (err) {
            console.error(err);
            resProcessor.error500(req, res, err)
        });
}


module.exports = [
    // 获取频道分类列表
    ['GET', '/api/studio-weapp/channel/list', requestProcess(conf.baseApi.channel.listWithTags,conf.baseApi.secret)],

    // 获取频道主页信息
    ['GET', '/api/studio-weapp/channel/index',  getChanneIndex],

    // 绑定分销关系
    ['POST','/api/studio-weapp/channel/bind-live-share', studioWeappAuth(), requestProcess(conf.baseApi.channel.bindLiveShare, conf.baseApi.secret)],

    // 查询是否已经购买过相同的系列课
    ['POST', '/api/studio-weapp/channel/check-duplicate-buy', studioWeappAuth(), requestProcess(conf.baseApi.channel.checkDuplicateBuy, conf.baseApi.secret)],
]
