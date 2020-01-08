import { api } from './common';
import { getVal } from 'components/util';

export const SET_CAMP_INFO = 'SET_CAMP_INFO';
export const SET_NEW_CAMP_INFO = 'SET_NEW_CAMP_INFO';
export const SET_CHANNEL_INFO = 'SET_CHANNEL_INFO';
export const SET_TOPIC_INFO = 'SET_TOPIC_INFO';
export const SET_LIVE_INFO = 'SET_LIVE_INFO';
export const LIVE_SET_FOLLOW_NUM = 'LIVE_SET_FOLLOW_NUM';

// 获取训练营信息
export function getCampInfo (campId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/checkInCamp/campInfo',
            method: 'POST',
            body: {
                campId
            }
        });
         dispatch({
             type: SET_CAMP_INFO,
             campInfo: result.data.camp
        });

        return result;
    }
};

// 获取新的训练营信息
export function getNewCampInfo (campId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/newCampInfo',
            method: 'POST',
            body: {
                campId
            }
        });
         dispatch({
             type: SET_NEW_CAMP_INFO,
             campInfo: result.data.campPo
        });

        return result;
    }
};


// 获取系列课信息
export function getChannelInfo (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/getChannelInfo',
            body: {
                channelId
            }
        });
         dispatch({
             type: SET_CHANNEL_INFO,
             channelInfo: result.data.channel
        });

        return result;
    }
};


// 获取话题信息
export function getTopicInfo (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/topic/getInfo',
            body: {
                topicId
            }
        });
         dispatch({
             type: SET_TOPIC_INFO,
             topicInfo: result.data.topic
        });

        return result;
    }
};


// 获取直播间信息
export function getLiveInfo (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            method: 'GET',
            url: '/api/wechat/live/Info',
            body: {
                liveId
            }
        });
         dispatch({
            type: SET_LIVE_INFO,
            liveInfo: result.data||{}
        });

        return result;
    }
};

//获取直播间关注数
export function liveGetFollowNum(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/followNum',
            body: { liveId },
            method: 'POST',
        });

        if (result && result.data && result.data.follwerNum) {
            dispatch({
                type: LIVE_SET_FOLLOW_NUM,
                data: result && result.data.follwerNum
            });
        }

        return result && result.data;
    }
}

// 获取短视频的关联的垂直号
export function getActivityAppId(pramas) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/short/getActivityAppId',
            body: pramas,
            method: 'POST',
        });

        return result && result.data;
    }
}
