import { request } from './common';
import { getVal } from 'components/util';
import dayjs from 'dayjs';
import { apiService } from 'components/api-service';

export const INIT_PAGE_DATA = 'INIT_PAGE_DATA';
export const UPDATE_LOCAL_VALUE = 'UPDATE_LOCAL_VALUE'

export function initPageData (pageData) {
    return {
        type: INIT_PAGE_DATA,
        pageData
    }
}

export function updateStatus ({key, value}) {
    return {
        type: UPDATE_LOCAL_VALUE,
        payload: {
            key,
            value
        }
    }
}

export function updateTopicStatus ({code, msg}) {
    return {
        type: UPDATE_TOPIC_SUCCESS,
        payload: {
            code,
            msg
        }
    }
}

export function getTopicSimple (topicId) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: `/api/wechat/topic/getInfo`,
            method: 'GET',
            body: {
                topicId
            }
        });
        const resultData = {
            topicInfo: { ...getVal(result, 'data.topicPo', {}), ...getVal(result, 'data.topicExtendPo', {}) }
        }

        dispatch(initPageData(resultData));
    }
}

export function updateValue ({key, value}) {
    return {
        type: UPDATE_LOCAL_VALUE,
        payload: {
            key,
            value
        }
    }
}

export function setShareStatus (topicId, status) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/topic/setShareStatus',
            method: 'POST',
            body: {
                topicId,
                status
            }
        })
        if (result.state && result.state.code === 0) {
            const resultData = {
                key: 'isShareOpen',
                value: status
            }
            dispatch(updateStatus(resultData))
        }
        return result;
    }
}

export function setIsNeedAuth (topicId, isNeedAuth) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/topic/setIsNeedAuth',
            method: 'POST',
            body: {
                topicId,
                isNeedAuth
            }
        })
        if (result.state && result.state.code === 0) {
            const resultData = {
                key: 'isNeedAuth',
                value: isNeedAuth
            }
            dispatch(updateStatus(resultData))
        }
    }
}

export function updateTopic (topic) {
    return async (dispatch, getStore) => {
        topic.startTime = dayjs(topic.startTime).format('YYYY-MM-DD HH:mm:ss');
        topic.endTime && (topic.endTime = dayjs(topic.endTime).format('YYYY-MM-DD HH:mm:ss'));
        topic.topicId = topic.id;
        topic.autoSharePercent = topic.percent;
        const result = await request({
            url: '/api/wechat/topic/update',
            method: 'POST',
            body: topic
        })
        
        return result;
    }
}
export function getPassword (topicId) {
    return async (dispatch, getStore) => {
        return apiService.post({
            url: '/h5/topic/getPassword',
            body: {
                topicId
            }
        }).then(res => {
            if (res.state.code == 0) {
                const resultData = {
                    key: 'password',
                    value: res.data.passWord
                }
        
                dispatch(updateStatus(resultData));
            }
            return res;
        }).catch(err => {
            console.error(err);
        })
        
        
    }
}

// 获取系列课或者话题的待优化点状态
export async function getChannelOrTopicOptimize (params) {
    return await request({
        showLoading: false,
        url: '/api/wechat/dataSat/getChannelOrTopicOptimize',
        body: params,
        method: 'POST',
    });
};
