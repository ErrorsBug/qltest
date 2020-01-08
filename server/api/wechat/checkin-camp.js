const lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

/**
 * 打卡训练营信息
 */
const checkInCampInfo = async (params, req) => {
    // 获得参数
    let infoArr = [
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret],
    ];
    
    let hasCampIdArr = [
        ['campDetail', conf.baseApi.checkInCamp.campDetail, params, conf.baseApi.secret],
        ['campPayStatus', conf.baseApi.checkInCamp.payStatus, params, conf.baseApi.secret],
        ['kickoutInfo', conf.baseApi.checkInCamp.kickoutStatus, params, conf.baseApi.secret],
    ]


    if (params.campId) {
        infoArr=[...infoArr,...hasCampIdArr]
        
    }

    return proxy.parallelPromise(infoArr, req);
}

const campsecondData = async (params,req)=>{
    return proxy.parallelPromise([
        ['lShareKey', conf.baseApi.share.qualify, params, conf.baseApi.secret],
    ], req);    
}

module.exports = [
    ['POST', '/api/wechat/checkInCamp/newCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.newCamp, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campAuthNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campAuthNum, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campDetail, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/saveCampIntro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.saveCampIntro, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campProfitList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campProfitList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campBuyersList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campBuyersList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campDisplay', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campDisplay, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/deleteCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.deleteCamp, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/notCheckinCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.notCheckinCount, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campJoinList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campJoinList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/changeJoinStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.changeJoinStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/checkinTotalProfit', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.checkinTotalProfit, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/checkinProfitList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.checkinProfitList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/campBuyRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campBuyRecord, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/userCheckinInfo', clientParams(), requestProcess(conf.baseApi.checkInCamp.userCheckinInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/checkinRanking', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.checkinRanking, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/checkinCalendar', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.checkinCalendar, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/userWithCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.userWithCamp, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/pushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.pushInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/push', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.push, conf.baseApi.secret)],
    // 打卡训练营动态相关
    ['POST', '/api/wechat/checkInCamp/checkInList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.checkInList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/deleteCheckInNews', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.deleteCheckInNews, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/thumbUp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.thumbUp, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/unThumb', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.unThumb, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/comment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.comment, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/deleteComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.deleteComment, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/getCommentList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getCommentList, conf.baseApi.secret)],

    // 打卡训练营课程相关
    ['POST', '/api/wechat/checkInCamp/getTopicList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getTopicList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/getTodayTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getTodayTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/setTopicDisplay', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.setTopicDisplay, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/deleteTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.deleteTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/addOrUpdate', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.addOrUpdate, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/contentList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.contentList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/getInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getInfo, conf.baseApi.secret)],

    // 打卡训练营用户列表相关
    ['POST', '/api/wechat/checkInCamp/getAuthUserList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getAuthUserList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/getUserHeadList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getUserHeadList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/getCheckInHeadList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getCheckInHeadList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/getTopNList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getTopNList, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/setUserBlack', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.setUserBlack, conf.baseApi.secret)],
    ['POST', '/api/wechat/checkInCamp/setUserKickout', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.setUserKickout, conf.baseApi.secret)],

    // 打卡训练营用户基础信息接口
    ['POST', '/api/wechat/checkInCamp/campUserInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campUserInfo, conf.baseApi.secret)],
    // 打卡训练营排行榜个人信息接口
    ['POST', '/api/wechat/checkInCamp/topUserInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.topUserInfo, conf.baseApi.secret)],
    // 发布打卡接口
    ['POST', '/api/wechat/checkInCamp/checkInPublish', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.checkInPublish, conf.baseApi.secret)],
    // 打卡训练营详情
    ['POST', '/api/wechat/checkInCamp/campInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.campInfo, conf.baseApi.secret)],
    // 获取三方二维码
    ['POST', '/api/wechat/checkInCamp/getQrCode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.getQrCode, conf.baseApi.secret)],
    // 是否被训练营踢出
    ['POST', '/api/wechat/checkInCamp/kickoutStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkInCamp.kickoutStatus, conf.baseApi.secret)],
    //绑定直播间分销
    ['POST', '/api/wechat/checkInCamp/bindLiveShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.bindLiveShare, conf.baseApi.secret)],
];
//bindLiveShare

module.exports.getCheckInCampInfo = checkInCampInfo;
module.exports.getCampSecondData = campsecondData;