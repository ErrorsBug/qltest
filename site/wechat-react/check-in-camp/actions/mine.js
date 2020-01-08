/**
 * C端页面接口调用
 */

import { api } from './common';

/**
 * 生成异步action的工具函数
 * @param {string} url api路径
 * @param {object} body 请求参数
 * @param {string} method 请求方法
 * @param {boolean} showLoading 是否显示loading标志
 * @param {boolean} showWarningTips 是否吐司提示接口返回的异常信息
 */
function createAsyncAction(url, method='POST', showLoading=true, showWarningTips=true){
    return (body={}) => {
        return async () => {
            return await api({url, body, method, showLoading, showWarningTips});
        }
    }
}

// 获取参与的训练营列表数据
export const fetchJoinList = createAsyncAction('/api/wechat/checkInCamp/campJoinList');

// 更新用户的打卡推送提醒开关
export const changeJoinStatus = createAsyncAction('/api/wechat/checkInCamp/changeJoinStatus');

// 获取我的打卡排名信息
export const fetchUserRanking = createAsyncAction('/api/wechat/checkInCamp/userCheckinInfo');

// 获取训练营的打卡排行榜列表
export const fetchCheckInRanking = createAsyncAction('/api/wechat/checkInCamp/checkinRanking');

// 获取我的打卡日历
export const fetchMyCheckInCalendar = createAsyncAction('/api/wechat/checkInCamp/checkinCalendar');

// 获取训练营的推送信息
export const fetchPushInfo = createAsyncAction('/api/wechat/checkInCamp/pushInfo');

// 训练营推送信息
export const pushCamp = createAsyncAction('/api/wechat/checkInCamp/push');

// 关注或取消关注直播间
export const followLive = createAsyncAction('/api/wechat/live/follow');