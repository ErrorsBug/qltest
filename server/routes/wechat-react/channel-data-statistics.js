import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import {
    CHANNEL_STATISTICS_TOTAL,
    CHANNEL_STATISTICS_BASE_DISTRIBUTION,
    CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_INIT,
    CHANNEL_STATISTICS_INVITER_INIT,
    CHANNEL_STATISTICS_ALL_DATA,

    initTotalDataDetail,
    initBaseDistributionData,
    initPopularizeDistributionData,
    initInviterData,
    initAllData,
    initChannelList,
} from '../../../site/wechat-react/other-pages/actions/channel-statistics'

/**
 * 系列课B端数据统计
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} store
 * @returns
 */
export async function channelStatisticsHandle(req, res, store) {
    const businessId = lo.get(req, 'query.businessId')
    const businessType = lo.get(req, 'query.businessType')
    const userId = lo.get(req, 'rSession.user.userId');
    let id = businessType === 'channel' ? 'channelId' : 'topicId'
    let statisticsData = []
    let inviteDate = conf.baseApi.channel.getAllInviteDate

    if (businessType === 'topic') {
        inviteDate = conf.baseApi.topic.getInviteData
    }
    let powerData = await proxy.apiProxyPromise(conf.baseApi.user.power, { [id]: businessId, userId }, conf.baseApi.secret, req)
    let power = powerData.data && powerData.data.powerEntity // 需要提前获取直播间id
    // 判断是否有权限
    if (powerData.state.code !== 0 || !power.allowMGLive) {
        if (businessType === 'topic') {
            res.redirect(`/wechat/page/topic-intro?topicId=${businessId}`);
        }else {
            res.redirect(`/wechat/page/channel-intro?channelId=${businessId}`);
        }
        return false;
    }
    let questArr = [
        ['getAllDataDetail', conf.baseApi.channel.getAllDataDetail, { businessId, businessType, liveId: power.liveId, userId }, conf.baseApi.secret],
        ['getSourceList', conf.baseApi.channel.getSourceList, { businessId, businessType, liveId: power.liveId, userId }, conf.baseApi.secret],
        ['getAllInviteDate', inviteDate, { [id]: businessId, userId, page : {page: 1, size: 30} }, conf.baseApi.secret],
    ]
    if (businessType === 'topic') {
        questArr.push(['getEvaluation', conf.baseApi.topic.getEvaluation, { topicId:businessId }, conf.baseApi.secret])
    } else {
        questArr.push(['getEvaluation', conf.baseApi.channel.getEvaluation, { channelId:businessId }, conf.baseApi.secret])
        
    }
    // 如果是话题页 需要拿到是否是单次课
    if (businessType === 'topic') {
        questArr.push(['topicInfo', conf.baseApi.topic.topicInfo, { [id]: businessId, userId }, conf.baseApi.secret])
    }
    statisticsData = await proxy.parallelPromise(questArr, req);
    // const power = lo.get(statisticsData, 'power.data.powerEntity');
    const totalDataView = lo.get(statisticsData, 'getAllDataDetail.data');
    const getSourceList = lo.get(statisticsData, 'getSourceList.data');
    const getAllInviteDate = lo.get(statisticsData, 'getAllInviteDate.data');
    const evaluation = lo.get(statisticsData, 'getEvaluation.data') || {};
    let topicInfo = {}
    if(businessType === 'topic')  {
        topicInfo = lo.get(statisticsData, 'topicInfo.data.topicExtendPo');
    }
    
    store.dispatch(initAllData({
        liveId: power.liveId,
        totalDataView,
        getSourceList,
        getAllInviteDate,
        isSingleBuy: topicInfo && topicInfo.isSingleBuy, // 单次课 N Y
        businessType,
        evaluation
    }))

    return store;
}


export async function liveChannelListHandle(req, res, store) {

    const liveId = lo.get(req, 'query.liveId')

    const statisticsData = await proxy.parallelPromise([
        ['courseList', conf.baseApi.channel.getChannelIdList, { liveId }, conf.baseApi.secret],
    ], req);

    const courseList = lo.get(statisticsData, 'courseList.data.courseList');

    store.dispatch(initChannelList(courseList))

    return store;
}
