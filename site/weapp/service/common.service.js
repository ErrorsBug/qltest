import request from '../comp/request';
import * as regeneratorRuntime from '../comp/runtime'
import { getVal } from '../comp/util';
import {decode} from '../comp/querystring';
import { api } from '../config';

const systemInfo = wx.getSystemInfoSync();

export class CommonService {
    updateFormId(formId, type = 'form') {
        if (formId.indexOf('a mock') > -1) {
            console.log('微信给了我们一个假id：', formId)
            return
        }
        console.log('更新formId-------------------------', formId)
        
        return request({
            url: '/api/weapp/channel/group/savePushInfo',
            data: { formId, type },
            method: 'POST',
        })
    }

    /**
     * 绑定活动券
     * 
     * @param { string } businessType 类型，channel或topic
     * @param { string } businessId id, channelId 或 topicId
     * @param { string } promotionId 优惠券id
     * @returns 
     * @memberof CommonService
     */
    async bindActivityCode(businessType, businessId, promotionId) {
        const result = await request({
            url: '/api/weapp/coupon/bind-activity-code',
            data: { businessType, businessId, promotionId },
            method: 'POST',
        })
        return result
    }

    /**
     * 微信自定义事件日志上报
     * 
     * @param {string} eventName 事件名称
     * @param {Object} data 事件数据
     * @memberof CommonService
     */
    wxReport(eventName, data) {
        let reportData = {}
        
        if (eventName === 'place_order' || eventName === 'pay_success') {
            const { channelId, topicId, liveId, type, total_fee } = data
            reportData.pay_price = total_fee
            if (type === 'COURSE_FEE') {
                reportData.lesson_type = '话题'
                reportData.lesson_id = topicId
            }
            if (type === 'CHANNEL') {
                reportData.lesson_type = '系列课'
                reportData.lesson_id = channelId
            }
        }

        if (eventName === 'view_intro') {
            reportData = data
        }
        reportData.scene = global.scene
        
        wx.reportAnalytics(eventName, reportData)
    }

    /**识别小程序码 */
    async analysisCode(options){
        const sceneInfo = await request({
            url: '/api/weapp/sceneInfo',
            data: {scene: decodeURIComponent(options.scene)},
            method: 'POST',
        })
        const result = getVal(sceneInfo, 'data.data.sceneInfo.params', '');
        let resultQuery = decode(result);
        return resultQuery;
    }

    /**
     * 
     * @param {TemplateStringsArray | number} rpx 
     * @param {any[]} args 
     */
    static rpx (rpx, ...args) {
        let value;
    
        if (typeof rpx === 'number') {
            value = rpx;
        } else if (rpx[0]) {
            value = Number(rpx[0]);
        } else {
            value = args[0];
        }
    
        return systemInfo.windowWidth / 750  * value;
    }


    /**
     * 获取二维码
     * @param options {{
        channel: number | string,
        topicId?: string,
        toUserId?: string,
        liveId?: string,
        channelId?: string,
        showQl?: 'Y' | 'N',
    }}
     */
    static getQr(options) {
        return request({
            url: api.getQr,
            data: options
        }).then(res => getVal(res, 'data.data'));
    }
}
