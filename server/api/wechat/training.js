var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');
    
/**
 * 获取训练营页面初始化数据
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getCampInitData = (params, req) => {

    var apiList = [
        ['campInfo', conf.wechatApi.training.getCamp, params, conf.wechatApi.secret],
    ];

    return proxy.parallelPromise(apiList, req);
};

/**
 * 获取用户权限
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var checkPower = (params, req) => {
    return proxy.parallelPromise([
        ['userPower', conf.baseApi.user.power, params, conf.baseApi.secret],
    ], req);
};

/**
 * 根据channelId获取期数信息
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getPeriodByChannel = (params, req) => {
    return proxy.parallelPromise([
        ['periodChannel', conf.baseApi.channel.currentPeriod, params, conf.baseApi.secret],
    ], req);
};

/**
 * 获取训练营话题（任务）集合
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getCampLearn = (params, req) => {

    var apiList = [
        ['topicMapInfo', conf.wechatApi.training.topicMap, params, conf.wechatApi.secret],
        ['periodChannel', conf.baseApi.channel.currentPeriod, params, conf.wechatApi.secret],
        ['affairMapInfo', conf.wechatApi.training.affairMap, params, conf.wechatApi.secret],
        ['userAffairInfo', conf.wechatApi.training.achievementCardInfo, params, conf.wechatApi.secret],
        ['listReward', conf.wechatApi.training.listReward, params, conf.wechatApi.secret],
    ];

    return proxy.parallelPromise(apiList, req);
};

/**
 * 获取用户填写表单信息
 * @param {*} params 
 * @param {*} req 
 */
var getCampUserInfo = (params, req) => {

    var apiList = [
        ['getUserInfo', conf.wechatApi.training.getUserInfo, params, conf.wechatApi.secret],
        ['periodChannel', conf.baseApi.channel.currentPeriod, params, conf.wechatApi.secret],
    ];

    return proxy.parallelPromise(apiList, req);
};



var getAchievementCardInfo = (req, res, next) => {
    const params = {
        studentId: req.body.studentId || lo.get(req, 'rSession.user.userId'),
        channelId: req.body.channelId
    }

    proxy.apiProxy(conf.wechatApi.training.achievementCardInfo, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

module.exports = [
    ['POST', '/api/wechat/channel/newCampInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.getCamp, conf.wechatApi.secret)],
    ['POST', '/api/wechat/answer/listByCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.listByCamp, conf.wechatApi.secret)],
    ['POST', '/api/wechat/vip/get', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.vipInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/answer/listsByTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.listsByTopic, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/joinPeriod', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.joinPeriod, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/topicMap', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.topicMap, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/saveUserInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.saveUserInfo, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/contract', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.contract, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/setAlert', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.setAlert, conf.wechatApi.secret)],
    ['POST', '/api/wechat/camp/new/loadCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.loadCamp, conf.wechatApi.secret)],
    ['POST', '/api/wechat/answer/countByCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.countByCamp, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/getUserInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.getUserInfo, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/listCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.listCamp, conf.wechatApi.secret)],
    ['POST', '/api/wechat/training/getMarket', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getMarket, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/getChannelInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.info, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/updateCampStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.updateCampStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/deleteCamp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.deleteCamp, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/affairMap', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.affairMap, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/affair', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.affair, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/getAffairStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.getAffairStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/userAffairInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.userAffairInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/achievementCardInfo', clientParams(), appAuth(), wxAuth(), getAchievementCardInfo],
    ['POST', '/api/wechat/training/studyTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.studyTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/listReward', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.listReward, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/getEvaluation', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.getEvaluation, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/evaluateLlist', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.evaluateLlist, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/getUserHomeworkCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.getUserHomeworkCount, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/campPeriodHomework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.campPeriodHomework, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/getCampByTopicId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.getCampByTopicId, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/schoolCardData', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.schoolCardData, conf.baseApi.secret)],
    ['POST', '/api/wechat/training/schoolCardQrCode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.training.schoolCardQrCode, conf.baseApi.secret)],
];

module.exports.getCampInitData = getCampInitData;
module.exports.checkPower = checkPower;
module.exports.getCampLearn = getCampLearn;
module.exports.getCampUserInfo = getCampUserInfo;
module.exports.getPeriodByChannel = getPeriodByChannel;

