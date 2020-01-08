import { api } from '../config';
import request from '../comp/request';
import { getVal } from '../comp/util';

export class LiveService {

    /**
     * 获取vip信息
     * 
     * @memberof CourseGroupService
     */
    fetchVipInfo(liveId) {
        return request({
            url: api.vipInfo,
            data: { liveId },
        }).then(res => {
            return getVal(res, 'data.data')
        })
    }

    /**
     * 获取拉黑信息
     * 
     * @memberof CourseGroupService
     */
    fetchBlackInfo(liveId, channelId) {
        return request({
            url: api.blackInfo,
            data: { channelId, liveId },
        }).then(res => {
            return getVal(res, 'data.data')
        })
    }

    /**
     * 获取邀请卡信息
     * @param {{}} options 
     */
    static getShareData({
        businessType,
        businessId,
        userId,
        showQl,
        source_type,
    }) {
        return request({
            url: api.getShareData,
            data: {
                businessType,
                businessId,
                userId,
                showQl,
                source_type,
            }
        }).then(res => getVal(res, 'data.data'));
    }

    /**
     * 获取分销收益列表，简版数据，用于展示用
     */
    static getShareUserList() {
        return request({
            url: api.getListWithoutQlUser,
            data: {
                page: 1,
                size: 20,
            }
        }).then(res => getVal(res, 'data.data.list'));
    }
}
