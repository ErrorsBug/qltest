import { api } from './common';
import { getVal, locationTo, isFromLiveCenter } from '../components/util'
import {getUrlParams } from '../components/url-utils'

//设置平台分销比例(个人)
export const SET_SHARE_RATE = 'SET_SHARE_RATE';
//平台分销比例（平台）
export const SET_PLATFORM_SHARE_QUALIFY = 'SET_PLATFORM_SHARE_QUALIFY';

/**
 *
 * 查询是否专业版直播间
 * @export
 * @param {*} params 可传 liveId、topicId、channelId、homeworkId、questionId、campId
 * @returns { isLiveAdmin ，level }
 */
export function getIsLiveAdmin(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/isLiveAdmin',
            body: params,
            method: 'POST'
        });
        return result;
    }
}


/**
 * 判断是否需要填表
 * 学员信息采集
 * @export
 * @param {*} param
 * @returns
 */
export function checkUser(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/check-user',
        });
        
        return result && result.data && result.data.config
    }
}


/**
 * 获取平台分销比例(个人)
 * @export
 * @param {*} param
 * @returns
 */
export function getShareRate(params) {
    return async (dispatch, getStore) => {
        if (isFromLiveCenter()) {
            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                method: 'POST',
                body:params,
                url: '/api/wechat/platformShare/getShareRate',
            });
            
            dispatch({
                type: SET_SHARE_RATE,
                shareRate: getVal(result,'data.shareRate',0),
            })
            return result
        }
    }
}

/**
 * 获取平台分销比例(个人)
 * @export
 * @param {*} param
 * @returns
 */
export function getPlatFormQualify(params) {
    return async (dispatch, getStore) => {
        if (isFromLiveCenter()) {
            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                method: 'POST',
                body:params,
                url: '/api/wechat/platformShare/getQualify',
            });
            
            dispatch({
                type: SET_PLATFORM_SHARE_QUALIFY,
                shareRate:  getVal(result,'data.platformShareQualifyPo.status', '') === 'Y' ? getVal(result,'data.platformShareQualifyPo.shareRate',0) : 0
            })
            return result
        }
    }
}

