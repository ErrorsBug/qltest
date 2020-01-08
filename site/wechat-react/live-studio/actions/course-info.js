import { request } from './common';
import { api } from './common'
import { getVal } from 'components/util';

export const INIT_TOPIC_DATA = 'INIT_TOPIC_DATA';
export const INIT_CHANNEL_DATA = 'INIT_CHANNEL_DATA';
export const INIT_CAMP_DATA = 'INIT_CAMP_DATA';

/**
 * 初始化话题信息
 * @param {*} pageData 
 */
export function initTopicData(pageData) {
    return {
        type: INIT_TOPIC_DATA,
        pageData
    }
}

/**
 * 初始化系列课信息
 * @param {*} pageData 
 */
export function initChannelData(pageData) {
    return {
        type: INIT_CHANNEL_DATA,
        pageData
    }
}

/**
 * 初始化系列课信息
 * @param {*} pageData 
 */
export function initCampData(pageData) {
    return {
        type: INIT_CAMP_DATA,
        pageData
    }
}

/**
 * 获取系列课推送次数
 * @param {*} channelId 系列课id
 * @param {*} liveId 直播间id
 */
export async function channelPushInfo(channelId, liveId){
    return await api({
        showLoading: false,
        method: 'POST',
        body: {channelId,liveId},
        url: '/api/wechat/live/channelPushInfo',
    });
}

/**
 * 获取话题推送次数
 * @param {*} topicId 话题id
 * @param {*} liveId 直播间id
 */
export async function topicPushInfo(topicId, liveId){
    return await api({
        showLoading: false,
        method: 'POST',
        body: {topicId,liveId},
        url: '/api/wechat/live/topicPushInfo',
    });
}

/**
 * 推送话题
 * @param {*} params 
 */
export async function pushTopic(params) {
    return await api({
        url: '/api/wechat/topic/push',
        method: 'POST',
        showLoading: true,
        body: params
    });
}

/**
 * 推送系列课
 * @param {*} params 
 */
export async function pushChannel(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/live/addPush',
        body: params
    });
}

/**
 *今天推荐
 * @export
 * @param {*} params
 * @returns
 */
export async function todayRecommend(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/live/todayRecommend',
        body: params
    });
}

/**
 * 直播间发布动态
 * @param {*} content 
 * @param {*} liveId 
 * @param {*} relateId 
 * @param {*} relateType 
 */
export async function pushTimeline(content, liveId, relateId, relateType){
    return await api({
        showLoading: true,
        url: '/api/wechat/timeline/creteTimeline', 
        body: { content, liveId, relateId, relateType },
        method: 'POST',
    });
}

// 获取推送课程信息
export async function getPushCourseInfo(liveId, businessId, businessType){
    return await api({
        showLoading: false,
        url: '/api/wechat/live/getPushCourseInfo', 
        body: { liveId, businessId, businessType },
        method: 'POST',
    });
}

// 直播间推送
export async function addPush(params){
    return await api({
        showLoading: false,
        url: '/api/wechat/live/addPush', 
        body: params,
        method: 'POST',
    });
}
