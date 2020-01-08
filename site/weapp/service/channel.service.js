import * as regeneratorRuntime from '../comp/runtime'
import { api } from '../config';
import request from '../comp/request';
import { getVal } from '../comp/util';
import order from '../comp/order'


class ShareService{
    async bindLiveShare(liveId, shareKey) {
        const result = await request({
            url: api.bindLiveShare,
            method: 'POST',
            data: { liveId, shareKey },
        })
        return result.data
    }

    /* 获取直播间分销shareKey */
    async fetchLiveShareKey(liveId) {
        const result = await request({
            url: api.liveShareQualify,
            data: { liveId },
        })
        return result.data
    }
}

export class ChannelService extends ShareService {
    
    /**
     * 获取系列课信息
     * 
     * @param {string} channelId 
     * @returns 
     * @memberof CourseGroupService
     */
    fetchChannelInfo(channelId) {
        return request({
            url: api.channelInfo,
            data: { channelId },
        }).then(res => {
            return getVal(res, 'data.data', {})
        })
    }

    /**
     * 获取系列课付费信息
     * 
     * @memberof CourseGroupService
     */
    fetchChannelChargeStatus(channelId, userId) {
        return request({
            url: api.channelChargeStatus,
            data: { channelId, userId },
        }).then(res => {
            return getVal(res, 'data.data')
        })
    }

    /* 获取系列课首页基础信息 */
    async fetchChannelIndex(channelId) {
        const result = await request({
            url: api.getChannelIndex,
            data: { channelId },
        })

        return result
    }

    /* 获取当前系列课学习记录 */
    async fetchLastLearnCourse(channelId) {
        const result = await request({
            url: api.lastLearnCourse,
            data: { channelId },
        })
        return result
    }

    /* 系列课免费报名 */
    checkInFreeChannel(orderData, successFn) {
        order({
            data: orderData,
            payFree: successFn,
            fail: res => {
                wx.showToast({ title: '报名失败' })
            },
        })
    }

    /* 获取用户最新拼课信息 */
    async fetchLastGroup(channelId) {
        const result = await request({
            url: api.checkIsHasGroup,
            data: { channelId },
        })

        return result.data.data
    }

    /* 获取制定groupId的拼团信息 */
    async fetchGroupInfo(groupId) {
        const result = await request({
            url: api.groupInfo,
            data: { groupId },
        })

        return result.data.data
    }

    /* 获取拼课列表 */
    async fetchGroupList(channelId) {
        const result = await request({
            url: api.groupingList,
            data: { channelId },
        })
        const groupList = getVal(result, 'data.data.groupList', [])
        return groupList
    }
    
    /* 获取拼团成员列表 */
    async fetchGroupMembers(groupId) {
        const result = await request({
            url: api.groupMemberList,
            data: { groupId },
        })

        let members = getVal(result, 'data.data.channelGroupDetailPo', [])
        return members
    }

    /* 免费开团 */
    async startFreeGroup(channelId) {
        const result = await request({
            url: api.createGroup,
            method: 'POST',
            data: {
                channelId: channelId,
            }
        })

        /* 成功或失败都要展示提示信息 */
        wx.showToast({ title: getVal(result, 'data.state.mgs', '') })
        
        /* 获取拼团结果，因为上面那接口不返回是否成功 = = */
        const groupRes = await this.fetchLastGroup(channelId)

        /* 拼课成功了，hoho直接跳转 */
        if (groupRes.channelGroupPo) {
            wx.redirectTo({
                url: `/pages/course-group/course-group?groupId=${groupRes.channelGroupPo.id}&channelId=${channelId}`
            })            
        }
    }

    /* 付费开团 */
    async startChargeGroup(orderData, channelId) {
        order({
            data: orderData,
            success: async (payRes, info) => {
                global.loggerService.event({
                    category: 'pay',
                    action: 'success',
                    payType: 'START_GROUP',
                    money: orderData.total_fee,
                })

                const groupRes = await request({
                    url: api.getOpenPayGroupResult,
                    method: 'POST',
                    data: { channelId },
                })

                wx.showToast({ title: getVal(groupRes, 'data.state.msg') })

                if (groupRes.channelGroupPo) {
                    wx.redirectTo({
                        url: `/pages/course-group/course-group?groupId=${groupRes.channelGroupPo.id}&channelId=${channelId}`
                    })
                }
            },
        })
    }

    /* 用户参团 */
    async joinGroup(orderData, channelId, groupId) {
        order({
            data: orderData,
            success(payRes, info) {
                global.loggerService.event({
                    category: 'pay',
                    action: 'success',
                    payType: 'JOIN_GROUP',
                    money: orderData.total_fee,
                })
                wx.redirectTo({
                    url: `/pages/course-group/course-group?groupId=${groupId}&channelId=${channelId}`
                })
            },
        })
    }

    /* 获取课程列表 */
    async fetchCourseList(params) {
        const result = await request({
            url: api.getTopicList,
            data: params,
        })
        const list = getVal(result, 'data.data.topicList', [])
        
        return list
    }

    /**判断是否分销 */
    async isShare(params) {
        const result = await request({
            url: api.isShare,
            data: params,
            method: 'POST',
        })
        const isShareData = getVal(result, 'data.data', {})
        
        return isShareData
    }

    /**获取小程序带参二维码 */
    async getShareCode(params){
        const result = await request({
            url: api.getwxcode,
            data: params,
            method: 'POST',
        })
        const stream = getVal(result, 'data.data.url', {})
        
        return stream
    }
}
