import lo from 'lodash';
var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');



/*************************************************************        *******************************************************************************/


/**
 * 音频图文获取主要信息
 */
var getAudioGraphicInfo = async (params, req) => {
    // 获得参数
    let infoArr = [
        ['topicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret],
        ['profile', conf.baseApi.topic.profile, params, conf.baseApi.secret],
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['topicAuth', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret],
        ['initWebsocket', conf.baseApi.topic.initWebsocket, params, conf.baseApi.secret],
    ];

    return proxy.parallelPromise(infoArr, req);
}

/**
 * 转载方是否能进入转载话题详情页权限
 */
const relayClientBListen = async (params, req) => {
    const ajaxArr = [
        ['relayClientBListen', conf.baseApi.topic.isClientBRelayListen, params, conf.baseApi.secret],
    ]
    return proxy.parallelPromise(ajaxArr, req);
} 

/**
 * 音频图文获取第二批信息
 */
var getAudioGraphicSecondData = async (params, req) => {
    // 获得参数
    const paramsWithChannelId = {...params};
    const paramsWithTopicId = {...params};
    delete paramsWithChannelId.topicId;
    delete paramsWithTopicId.channelId;

    let infoArr = [
        ['blackInfo', conf.baseApi.channel.isBlack, paramsWithChannelId, conf.baseApi.secret],
        ['lShareKey', conf.baseApi.share.qualify, paramsWithChannelId, conf.baseApi.secret],
	    ['channelInfo', conf.baseApi.channel.info, paramsWithChannelId, conf.baseApi.secret],
        ['chargeStatus', conf.baseApi.channel.chargeStatus, paramsWithChannelId, conf.baseApi.secret],
        ['vipInfo', conf.baseApi.vip.vipInfo, paramsWithChannelId, conf.baseApi.secret],
	    ['liveRole', conf.baseApi.channel.liveRole, paramsWithChannelId, conf.baseApi.secret],
        ['coralIdentity', conf.baseApi.coral.getPersonCourseInfo, params, conf.baseApi.secret], // 请求是否珊瑚计划课程且是否是珊瑚课代表
        
    ];

    return proxy.parallelPromise(infoArr, req);
};

var getIspushCompliteCard = async (params, req) =>{
    // 获得参数
    let infoArr = [
        ['shareComplitePushDate', conf.baseApi.topic.shareComplitePushDate, params, conf.baseApi.secret],
    ];
    return proxy.parallelPromise(infoArr, req);
};


module.exports = [
    ['POST', '/api/wechat/topic/getLastOrNextTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getLastOrNextTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/addDiscuss', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.addDiscuss, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/discussList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.discussList, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/deleteDiscuss', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.deleteDiscuss, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/discussLike', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.discussLike, conf.baseApi.secret)],
];

module.exports.getAudioGraphicInfo = getAudioGraphicInfo;
module.exports.getAudioGraphicSecondData = getAudioGraphicSecondData;
module.exports.getIspushCompliteCard = getIspushCompliteCard;
module.exports.relayClientBListen = relayClientBListen;
