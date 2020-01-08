var path = require('path');
var _ = require('underscore');
var async = require('async');
var clientParams = require('../../middleware/client-params/client-params');
var proxy = require('../../components/proxy/proxy');
var resProcessor = require('../../components/res-processor/res-processor');
var conf = require('../../conf');
var studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
var lo = require('lodash');
var requestProcess = require('../../middleware/request-process/request-process');

const pageTopicIntro = (req, res, next) => {
    /* 请求可能需要的参数*/
    const topicId = lo.get(req, 'query.topicId');
    const userId = lo.get(req, 'rSession.user.userId');
    let liveId;
    let channelId;

    /* 最终会返回的数据*/
    let responseData = {};

    /* 获取话题基本信息*/
    const getTopic = () => {
        const params = {
            topicId: topicId,
            userId: userId,
            caller: lo.get(req, 'query.topicId'),
            weappVer: lo.get(req, 'query.weappVer'),
        };

        proxy.parallelPromise([
            [conf.weiboApi.topic.get, params, conf.weiboApi.secret],
        ], req).then(result => {
            // 获取到liveId、channelId和话题基本信息
            liveId = lo.get(result, '0.data.topicPo.liveId');
            channelId = lo.get(result, '0.data.topicPo.channelId');

            responseData.topicView = lo.get(result, '0.data');
            // 若话题已被删除则返回错误信息
            if (lo.get(result, '0.data.topicPo.status') == 'delete' || lo.get(result, '0.state.code') == 10001) {
                resProcessor.jsonp(req, res, {
                    data:{
                        state: {
                            code:10001,
                            msg: '话题不存在',
                        },
                    },
                });
            } else {
                getInfo()
            }
        }).catch(err => {
            console.error(err);
        });
    }

    /* 获取剩余信息*/
    const getInfo = () => {
        /* 请求参数*/
        let params = {
            topicId: topicId,
            liveId: liveId,
            userId: userId,
            pageNum: 1,
            pageSize: 20,
            caller: 'weapp',
        };

        /* 请求接口*/
        let tasks = [
            [conf.weiboApi.topic.profile, params, conf.weiboApi.secret],
            [conf.weiboApi.topic.auth, params, conf.weiboApi.secret],
            [conf.weiboApi.user.power, params, conf.weiboApi.secret],
            [conf.weiboApi.share.qualify, params, conf.weiboApi.secret],
            [conf.weiboApi.coupon.topic, params, conf.weiboApi.secret],
            [conf.baseApi.channel.vipInfo, params, conf.baseApi.secret],
        ];

        /* 如果是频道话题则添加频道信息接口*/
        if (typeof channelId === 'string') {
            params.channelId = channelId;
            tasks = tasks.concat([
                [conf.weiboApi.channel.info, params, conf.weiboApi.secret],
                [conf.weiboApi.coupon.channel, params, conf.weiboApi.secret]
            ]);
        };

        /* 请求接口*/
        proxy.parallelPromise(tasks, req).then(function (results) {
            /* 放入返回数据*/
            responseData.profile = lo.get(results, '0.data', {});
            responseData.isAuth = lo.get(results, '1.data', {});
            responseData.power = lo.get(results, '2.data', {});
            responseData.qualify = lo.get(results, '3.data', {});
            responseData.coupon = lo.get(results, '4.data', {});
            responseData.vipInfo = lo.get(results, '5.data') || {};

            /* 频道信息放入返回数据*/
            if (channelId) {
                responseData.channel = lo.get(results, '6.data', {});
                responseData.channelCoupon = lo.get(results, '7.data', {});
            }
            /* 如果是加密话题，不将password返回到前端*/
            if (typeof lo.get(responseData, 'topicView.topicPo.password') === 'string') {
                responseData.topicView.topicPo.password = null;
            }

            /* 返回数据*/
            resProcessor.jsonp(req, res, responseData);
        }).catch(function (err) {
            resProcessor.jsonp(req, res, {
                code: 500,
                msg: '请求错误',
            });
            console.error(err);
        });

    }

    getTopic();
};

const pageTopicSecond = (req, res, next) => {
    let params = _.pick(req.query, ['liveId', 'topicId', 'pageNum', 'pageSize', 'channelId','caller','weappVer']);
    params.userId = lo.get(req, 'rSession.user.userId');
    params.page = {
        page: req.query.pageNum,
        size: req.query.pageSize
    };

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

    let responseData = {};

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
        responseData.live = lo.get(results, '0.data');
        responseData.joinMember = lo.get(results, '1.data');
        responseData.topicNum = lo.get(results, '2.data');
        responseData.followNum = lo.get(results, '3.data');
        responseData.isFollow = lo.get(results, '4.data');
        responseData.todayPushNum = lo.get(results, '5.data');
        responseData.shareMember = lo.get(results, '6.data');
        responseData.channelJoinNum = lo.get(results, '7.data');
        responseData.channelTopicNum = lo.get(results, '8.data');

        resProcessor.jsonp(req, res, responseData);
    }).catch(function (err) {
        resProcessor.error500(req, res, err);
        console.error(err);
    });
};

module.exports = [
    // 话题介绍页初始数据
    ['GET', '/api/studio-weapp/page/topic/intro', studioWeappAuth(), pageTopicIntro],
    // 话题介绍页二次数据
    ['GET', '/api/studio-weapp/page/topic/introSecond', studioWeappAuth(), pageTopicSecond],
    // 免费话题报名
    ['GET', '/api/studio-weapp/topic/enterPublic', studioWeappAuth(), requestProcess(conf.weiboApi.topic.enterPublic, conf.baseApi.secret)],
    // 加密话题报名
    ['GET', '/api/studio-weapp/topic/enterEncrypt', studioWeappAuth(), requestProcess(conf.weiboApi.topic.enterEncrypt, conf.baseApi.secret)],
    // 购买免费频道
    ['GET', '/api/studio-weapp/channel/buyFreeChannel', studioWeappAuth(), requestProcess(conf.weiboApi.channel.orderFree, conf.baseApi.secret)],
]
