var _ = require('underscore'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');


module.exports = [
    /* 直播间主页用到的接口 */
    ['POST', '/api/wechat/topic/topicGuestList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestList.topicGuestList, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/deleteTopicTitle', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestList.deleteTopicTitle, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/setTopicTitle', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestList.setTopicTitle, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/historyGuestList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestList.historyGuestList, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/deleteHistoryRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestList.deleteHistoryRecord, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/setHistoryTitle', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.guestList.setHistoryTitle, conf.baseApi.secret)],
];
