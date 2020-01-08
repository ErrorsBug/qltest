//shortKnowledgeApi

var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');
const wxHqAuth = require('../../middleware/auth/1.0.0/wx-hq-auth');

module.exports = [
	// 用户积分信息
	['POST', '/api/wechat/short/videoList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.videoList, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/delete', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.delete, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/getKnowledgeInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.getKnowledgeById, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/getKnowledgeComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.getKnowledgeComment, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/addKnowledgeComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.addKnowledgeComment, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/statNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.statNum, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/setCommentHideStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.setCommentHideStatus, conf.shortKnowledgeApi.secret)],
    ['POST', '/api/wechat/short/getActivityAppId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getActivityAppId, conf.baseApi.secret)],
    ['POST', '/api/wechat/short/getWatchRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.getWatchRecord, conf.shortKnowledgeApi.secret)],
    // 获取用户打卡配置
    ['POST', '/api/wechat/affair/getAttendRemind', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.getAttendRemind, conf.shortKnowledgeApi.secret)],
    // 修改打卡推送状态
    ['POST', '/api/wechat/affair/updateAttendRemind', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shortKnowledgeApi.updateAttendRemind, conf.shortKnowledgeApi.secret)],
    
]

