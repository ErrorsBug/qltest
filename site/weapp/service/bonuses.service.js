import { api } from '../config';
import request from '../comp/request';
import { getVal } from '../comp/util';

export class BonusesService {

    /**
     * 查询课程、用户活动状态
     * @param {string} businessId 话题/系列课id
     * @param {string} businessType 业务类型，topic-话题，channel-系列课
     * @returns {Promise<{}>}
     */
    getStateInfo(businessId, businessType) {
        return request({
            url: api.getStateInfo,
            data: { businessId, businessType }
        }).then(res => getVal(res, 'data.data', {}))
    }

    /**
     * 查询活动配置、红包团信息
     * @param {string} groupId 红包团id，进入别人邀请的团时，需要传递
     * @param {string} confId 当前课程活动配置id
     * @returns {Promise<{}>}
     */
    getConfAndGroupInfo(groupId = '', confId = '') {
        return request({
            url: api.getConfAndGroupInfo,
            data: { confId, groupId }
        }).then(res => getVal(res, 'data.data', {}))
    }

    /**
     * 红包团已拆红包
     * @param {string} groupId 红包团id
     * @returns {Promise<{}>}
     */
    getGroupOpenRedpack(groupId) {
        return request({
            url: api.getGroupOpenRedpack,
            data: { groupId }
        }).then(res => getVal(res, 'data.data.list', []))
    }

    /**
     * 点赞拆红包
     * @param {string} groupId 红包团id
     * @returns {Promise<{}>}
     */
    openRedpack(groupId) {
        return request({
            url: api.openRedpack,
            data: { groupId }
        }).then(res => getVal(res, 'data.data', {}))
    }

    /**
     * 已入账的红包信息列表
     * @param {number} page 页码
     * @param {number?} size 每页数量
     * @returns {Promise<[]>}
     */
    getAccountRedpackList(confId, page = 1, size = 20) {
        return request({
            url: api.getAccountRedpackList,
            data: { confId, page, size }
        }).then(res => getVal(res, 'data.data.list', []))
    }

    /**
     * 用户账户上该活动最大优惠券信息
     * @param {string} confId 当前课程活动配置id
     */
    getMaxCouponInfo(confId) {
        return request({
            url: api.getMaxCouponInfo,
            data: { confId }
        }).then(res => getVal(res, 'data.data', {}))
    }

    /**
     * 红包状态信息
     * 
     * @param {string} businessId 
     * @returns 
     * @memberof BonusesService
     */
    fetchCourseConfig(businessId) {
        return request({
            url: api.bonusesCourseConfig,
            data: { businessId },
        }).then(res => {
            return getVal(res, 'data.data', {})
        })
    }

    /**
     * 我的红包详情信息
     * 
     * @memberof BonusesService
     */
    fetchMyShareDetail(businessId) {
        return request({
            url: api.bonusesMyShareDetail,
            data: { businessId },
        }).then(res => {
            return getVal(res, 'data.data', {})
        })
    }

    /**
     * 我的红包详情信息
     * 
     * @memberof BonusesService
     */
    fetchDoShare(businessId,miniSessionKey,groupDataList) {
        return request({
            url: api.bonusesDoShare,
            data: { businessId,miniSessionKey, groupDataList },
            method: 'POST',
        }).then(res => {
            console.log(res);
            return getVal(res, 'data.data', {})
        })
    }

        /**
     * 参与群分享红包
     * 
     * @memberof BonusesService
     */
    fetchJoinShare(businessId) {
        return request({
            url: api.bonusesJoinShare,
            data: { businessId },
        }).then(res => {
	        return getVal(res, 'data', {})
        })
    }

    //bonusesRecentAcceptList
    /**
     * 最近获得群分享红包的20个人
     * 
     * @memberof BonusesService
     */
    fetchRecentAcceptList(businessId) {
        return request({
            url: api.bonusesRecentAcceptList,
            data: { businessId },
        }).then(res => {
	        return getVal(res, 'data.data', {})
        })
    }
    
    fetchUserVipInfo(liveId) {
        return request({
            url: api.userVipInfo,
            data: { liveId }
        }).then(res => {
	        return getVal(res, 'data.data', {})
        })
    }
}
