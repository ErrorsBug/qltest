import { api } from '../config';
import request from '../comp/request';
import { getVal } from '../comp/util';
import * as regeneratorRuntime from '../comp/runtime'

export class CourseGroupService {
    /**
     * 获取拼团信息
     * 
     * @param {string} groupId 
     * @returns 
     * @memberof CourseGroupService
     */
    fetchGroupInfo(groupId) {
        return request({
            url: api.groupInfo,
            data: { groupId },
        }).then(res => {
            return getVal(res, 'data.data')
        })
    }

    /**
     * 获取拼团结果
     * 
     * @memberof CourseGroupService
     */
    fetchGroupResult(channelId, groupId) {
        return request({
            url: api.groupResult,
            data: { channelId, groupId },
        }).then(res => {
            return getVal(res, 'data.data')
        })
    }

    /**
     * 获取拼团用户列表
     * 
     * @param {string} groupId 
     * @returns 
     * @memberof CourseGroupService
     */
    fetchJoinList(groupId) {
        return request({
            url: api.groupMemberList,
            data: { groupId },
        }).then(res => {
            return getVal(res, 'data.data.payList', [])
        })
    }

    /**
     * 发起免费拼课
     * 
     * @param {string} channelId 
     * @memberof CourseGroupService
     */
    createFreeGroup(channelId) {
        return request({
            url: api.createGroup,
            method: 'POST',
            data: { channelId },
        }).then(res => res.data)
    }

    /**
     * 查询付费拼课结果
     *
     * @param {string} channelId
     * @returns 
     * @memberof CourseGroupService
     */
    fetchChargeGroupResult(channelId) {
        return request({
            url: api.getOpenPayGroupResult,
            method: 'POST',
            data: { channelId },
        }).then(res => res.data)
    }

    /**
     * 获取最新拼课记录
     * 
     * @param {string} channelId 
     * @returns 
     * @memberof CourseGroupService
     */
    fetchNewestGroup(channelId) {
        return request({
            url: api.checkIsHasGroup,
            data: { channelId },
        }).then(res => res.data)
    }

    countShareCache(groupId) {
        return request({
            url: api.countShareCache,
            data: { groupId },
            method: 'POST',
        }).then(res => res.data)
    }

    /* 保存推送码 */
    savePushInfo( formId, type ) {
        return request({
            url: api.savePushInfo,
            data: { formId, type },
            method: 'POST',
        }).then(res => res.data)
    }

    /* 获取最近学习课程 */
    fetchLastLearnCourse(channelId) {
        return request({
            url: api.lastLearnCourse,
            data: { channelId },
        }).then(res => res.data)
    }

    /* 获取最近学习课程 */
    fetchTopicIdList(channelId) {
        return request({
            url: api.topicIdList,
            data: { channelId },
        }).then(res => res.data)
    }

    /* 根据最近学习课程和课程列表返回应该去往的课程id */
    async fetchAndRedirectToCourse(channelId) {
        const [lastLearn, topicIdList] = await Promise.all([
            this.fetchLastLearnCourse(channelId),
            this.fetchTopicIdList(channelId)
        ])
        const lastTopic = lastLearn.data.topic
        const list = topicIdList.data.topicList || []
        
        if (lastTopic) {
            return lastTopic.topicId
        } else {
            if (list.length) {
                return list[0].topicId
            }
            return null
        }
    }

    /* 发起免费拼课并返回查询结果 */
    createFreeAndQuery(channelId) {
        return new Promise((resolve, reject) => {
            this.createFreeGroup(channelId)
                .then(res => {
                    if (getVal(res, 'state.code') !== 0) {
                        const msg = getVal(res, 'state.msg')
                        resolve(msg)
                        throw new Error(msg)
                    }
                })
                .then(() => {
                    this.fetchNewestGroup(channelId)
                        .then(res => {
                            resolve(res)
                        })
                })
                .catch(err => {
                    console.error('[开团失败]', err)
                })
        })
    }
}
