import { getVal,formatDate,imgUrlFormat } from '../../comp/util';
import * as regeneratorRuntime from '../../comp/runtime'
import request from '../../comp/request'

const app = getApp()

const config = {

    data:{
        uri_badge:__uri('./img/vip-badge.png'),
        uri_card:__uri('./img/vip-card.png'),
        uri_icon_lession:__uri('./img/vip-icon-lession.png'),
        uri_icon_service:__uri('./img/vip-icon-service.png'),
        uri_icon_v:__uri('./img/vip-icon-v.png'),

        expireTime:'',
        logo:'',
        vipInfo: {},
        liveInfo: {},

        /* 支付方式相关 */
        payType: 'official',
        payTipsContent: '',
        contactModalVisible: false,
    },

    async onLoad() {
        try {
            await app.login()
            this.setData({ liveId: global.liveId })
            this.initVipInfo()
            this.initLiveInfo()
            this.getOpsPayType()
        } catch (error) {
            console.error('页面初始化失败：', error)
        }
    },

    /* 隐藏支付提示弹窗 */
    hidePayContactModal() {
        this.setData({ contactModalVisible: false })
    },

    async getOpsPayType() {
        try {
            const userId = wx.getStorageSync('userId')
            const result = await request({
                url: '/api/studio-weapp/getOpsPayType',
                data: {
                    liveId: global.liveId,
                    merchantAppId: global.appId,
                    userId,
                    payCourseType: 'vip',
                    businessId: global.liveId,
                },
            })
            console.log('pay type---------------', result)
            const { payType, replyContent } = result.data.data
            this.setData({ payType, payTipsContent: replyContent })
        } catch (error) {
            console.error('获取三方小程序支付方式失败: ', error)
        }
    },

    async initVipInfo() {
        const {liveId} = this.data

        const result = await request({
            url: '/api/studio-weapp/live/vip/info',
            data: { liveId },
        })
        const vipInfo = getVal(result, 'data.data', {})
        const expireTime = formatDate(vipInfo.expiryTime, 'yyyy.MM.dd')
        this.setData({ vipInfo, expireTime })
    },

    async initLiveInfo() {
        const { liveId } = this.data
        const result = await request({
            url: '/api/studio-weapp/live/info',
            data: { liveId },
        })

        const liveInfo = getVal(result, 'data.data.entity') 
        const logo = imgUrlFormat(liveInfo.logo, "?x-oss-process=image/resize,m_fill,limit_0,h_60,w_60") 
        this.setData({ liveInfo, logo })
    },


    onViewVipTap() {
        const { isVip, isOpenVip } = this.data.vipInfo
        if (isOpenVip === 'N') {
            wx.showToast({
                title: '该直播间未开启VIP服务',
                icon: 'none',
            })
            return
        }        
        wx.navigateTo({ url:`/pages/payment-details/payment-details?type=vip&liveId=${this.data.liveId}`})
    },

    onBuyVipTap() {
        if (this.data.payType === 'customer') {
            this.setData({ contactModalVisible: true })
            return
        }
        wx.navigateTo({ url: `/pages/payment-details/payment-details?type=vip&liveId=${this.data.liveId}` })        
    },
}

Page(config)
