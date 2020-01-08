var _ = require('underscore'),
    request = require('request'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf'),
    header = require('../../components/header/header'),
    lo = require('lodash');

import moment from 'moment'

/**
 * 获取收益统计
 *
 * @export
 * @param {string} liveId
 * @param {string} userId
 * @returns
 */
function fetchProfitOverview(liveId, userId, req) {
    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, { liveId, userId }, conf.baseApi.secret],
        ['overview', conf.baseApi.profit.total, { liveId, userId }, conf.baseApi.secret],
        ['isLiveAdmin', conf.adminApi.adminFlag, { liveId, userId }, conf.adminApi.secret],
    ], req);
}

/**
 * 获取收益流水列表
 *
 * @param {string} liveId
 * @param {string} userId
 * @param {string} startTime
 * @param {string} endTime
 * @param {object} page
 * @returns
 */
function fetchProfitChecklist(liveId, userId, page, type, time, req) {
    const params = { liveId, userId, page }

    if (type) {
        if (type !== 'ALL') {
            params.profitType = type
        }
        switch (time) {
            case 'ALL':
                break
            case 'WEEK':
                params.startTime = moment().subtract(7, 'days').format('YYYY-MM-DD')
                params.endTime = moment().format('YYYY-MM-DD')
                break
            case 'YESTERDAY':
                params.startTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
                params.endTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
                break
            default:
                break
        }
    }

    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, { liveId, userId }, conf.baseApi.secret],
        ['overview', conf.baseApi.profit.total, { liveId, userId }, conf.baseApi.secret],
        ['checklist', conf.baseApi.profit.records, params, conf.baseApi.secret],
    ], req);
}

function fetchProfitDetailChannel(channelId, type, pageNum, pageSize, userId, req) {
    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, { channelId, userId }, conf.baseApi.secret],
        ['list', conf.baseApi.profit.detail.channel, { channelId, type, pageNum, pageSize, userId }, conf.baseApi.secret],
    ], req)
}

var getTopicAnalysisList = async (params, req) => {
    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['topicAnalysis', conf.baseApi.profit.record.topic, params, conf.baseApi.secret],
    ], req);
}
var getChannelAnalysisList = async (params, req) => {
    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['channelAnalysis', conf.baseApi.profit.record.channel, params, conf.baseApi.secret],
    ], req);
}
var getRecommendysisList = async (params, req) => {
    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, { liveId: params.liveId, userId: params.userId }, conf.baseApi.secret],
        ['qualify', conf.baseApi.platformShare.getPlatformShareQualify, params, conf.baseApi.secret],
        ['totalProfit', conf.baseApi.platformShare.getTotalProfit, { liveId: params.liveId, userId: params.userId }, conf.baseApi.secret],
        ['profitList', conf.baseApi.platformShare.getProfitList, params, conf.baseApi.secret],
    ], req);
}

module.exports = [
    // 收益统计
    ['GET', '/api/wechat/profit/total', wxAuth(), requestProcess(conf.baseApi.profit.total, conf.baseApi.secret)],
    // 直播间收益列表
    ['GET', '/api/wechat/profit/records', wxAuth(), requestProcess(conf.baseApi.profit.records, conf.baseApi.secret)],
    // 收益列表
    ['GET', '/api/wechat/profit/record/channel', wxAuth(), requestProcess(conf.baseApi.profit.record.channel, conf.baseApi.secret)],
    ['GET', '/api/wechat/profit/record/topic', wxAuth(), requestProcess(conf.baseApi.profit.record.topic, conf.baseApi.secret)],
    // 收益详情
    ['GET', '/api/wechat/profit/detail/channel', wxAuth(), requestProcess(conf.baseApi.profit.detail.channel, conf.baseApi.secret)],
    // 提现
    ['POST', '/api/wechat/profit/withdraw', wxAuth(), requestProcess(conf.baseApi.profit.withdraw, conf.baseApi.secret)],
    ['GET', '/api/wechat/profit/limit', wxAuth(), requestProcess(conf.baseApi.profit.limitMoney, conf.baseApi.secret)],
    //收益明细，知识通系列课列表
    ['POST', '/api/wechat/profit/knowledgeProfitList', wxAuth(), requestProcess(conf.baseApi.profit.knowledgeProfitList, conf.baseApi.secret)],
    ['POST', '/api/wechat/profit/updateDisplayStatus', wxAuth(), requestProcess(conf.baseApi.profit.updateDisplayStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/selfmedia/channelDetail', wxAuth(), requestProcess(conf.baseApi.profit.channelDetail, conf.baseApi.secret)],
    ['POST', '/api/wechat/selfmedia/mediaProfitRecords', wxAuth(), requestProcess(conf.baseApi.profit.mediaProfitRecords, conf.baseApi.secret)],
    ['POST', '/api/wechat/selfmedia/isHaveMediaProfit', wxAuth(), requestProcess(conf.baseApi.profit.isHaveMediaProfit, conf.baseApi.secret)],
]

module.exports.fetchProfitOverview = fetchProfitOverview
module.exports.fetchProfitChecklist = fetchProfitChecklist
module.exports.fetchProfitDetailChannel = fetchProfitDetailChannel

module.exports.getTopicAnalysisList = getTopicAnalysisList;
module.exports.getChannelAnalysisList = getChannelAnalysisList;
module.exports.getRecommendysisList = getRecommendysisList;
