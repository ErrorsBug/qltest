
var lo = require('lodash'),
_ = require('underscore'),

resProcessor = require('../../components/res-processor/res-processor'),
proxy = require('../../components/proxy/proxy'),
wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
appAuth = require('../../middleware/auth/1.0.0/app-auth'),
clientParams = require('../../middleware/client-params/client-params'),
requestProcess = require('../../middleware/request-process/request-process'),
conf = require('../../conf');


module.exports = [
    // 请好友免费听检验分享状态
    ['POST', '/api/wechat/inviteFriendsToListen/checkShareStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.inviteFriendsToListen.checkShareStatus, conf.baseApi.secret)],
    // 获取分享id记录
    ['POST', '/api/wechat/inviteFriendsToListen/fetchShareRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.inviteFriendsToListen.fetchShareRecord, conf.baseApi.secret)],
    // 查询已领信息
    ['POST', '/api/wechat/inviteFriendsToListen/getReceiveInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.inviteFriendsToListen.getReceiveInfo, conf.baseApi.secret)],
    // 校验领取状态
    ['POST', '/api/wechat/inviteFriendsToListen/checkReceiveStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.inviteFriendsToListen.checkReceiveStatus, conf.baseApi.secret)],
    // 领取
    ['POST', '/api/wechat/inviteFriendsToListen/receive', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.inviteFriendsToListen.receive, conf.baseApi.secret)],
    // 用户已领取某系列课下的课程列表
    ['POST', '/api/wechat/inviteFriendsToListen/getReceiveTopicList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.inviteFriendsToListen.getReceiveTopicList, conf.baseApi.secret)],
];


