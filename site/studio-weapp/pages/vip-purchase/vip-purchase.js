import * as regeneratorRuntime from '../../comp/runtime'
import request from '../../comp/request'
import { getVal, formatMoney, fillParams, linkTo } from '../../comp/util';

const app = getApp()

const config = {

    data: {
        uri_badge: __uri('./img/vip-badge.png'),
        uri_card: __uri('./img/vip-card.png'),
        uri_coupon: __uri('./img/vip-coupon.png'),
        uri_arrow: __uri('./img/icon-arrow.png'),

        vipInfo: {},
        chargeConfigs: [],
        selectedCharge: null,

        modalMaskVisible: false,
        chargeModalVisible: false,
        chargeModalAnimation: null,
    },

    async onLoad() {
        try {
            await app.login()
            this.liveId = global.liveId
            this.setData({ liveId: global.liveId })
            this.initData()
        } catch (error) {
            console.error('页面初始化失败：', error)
        }
    },

    initData() {
        this.fetchVipInfo()
        this.fetchVipCharge()
        this.fetchLiveInfo()
        this.fetchCouponList()
    },

    async fetchLiveInfo() {
        const { liveId } = this.data

        const result = await request({
            url: '/api/studio-weapp/live/info',
            data: { liveId },
        })

        const liveInfo = getVal(result, 'data.data')
        this.setData({ liveInfo })
    },

    async fetchVipInfo() {
        const { liveId } = this.data

        const result = await request({
            url: '/api/studio-weapp/live/vip/info',
            data: { liveId },
        })

        this.setData({ vipInfo: getVal(result, 'data.data', {}) })
    },

    async fetchVipCharge() {
        const { liveId } = this.data

        const result = await request({
            url: '/api/studio-weapp/live/vip/charge-info',
            data: { liveId },
        })
        let chargeConfigs = getVal(result, 'data.data.vipChargeconfig', [])
        chargeConfigs = chargeConfigs.map(item => {
            let amount = formatMoney(item.amount)
            return {
                ...item,
                amount,
            }
        })
        const selectedCharge = chargeConfigs[0] || null

        this.setData({ chargeConfigs, selectedCharge })
    },

    async fetchCouponList(){
        const { liveId } = this.data
        const result = await request({
            url:'/api/studio-weapp/mine/coupon-list',
            data: {
                businessType: 'vip',
                businessId: liveId,
            },
        })
        console.log('couponlist', result)
    },

    showChargeModal() {
        this.setData({ modalMaskVisible: true })
        let chargeModalAnimation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        }).top(100).step().export()
        this.setData({ chargeModalAnimation })
    },

    hideChargeModal() {
        let { chargeModalAnimation } = this.data
        chargeModalAnimation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        }).top('100%').step().export()
        this.setData({ chargeModalAnimation })
        setTimeout(() => {
            this.setData({ modalMaskVisible: false })
        }, 500 / 2);
    },

    onChargeItemTap(e) {
        let { chargeConfigs, selectedCharge } = this.data
        selectedCharge = chargeConfigs.find(item => item.id === e.currentTarget.dataset.id)

        this.setData({ selectedCharge })
        setTimeout(() => {
            this.hideChargeModal()
        }, 300);
    },

    onPurchaseTap() {
        const { liveInfo, selectedCharge } = this.data
        const { amount, id } = selectedCharge

        const params = {
            toUserId: liveInfo.entity.createBy,
            source: 'web',
            liveId: liveInfo.entity.id,
            total_fee: amount * 100,
            chargeConfigId: id,
            type: 'LIVEVIP',
            ifboth: 'Y',
        }

        let url = fillParams(params, 'https://m.qlchat.com/wechat/page/studio-weapp-pay');
        linkTo.webpage(url);
        
        return;
    },
}

Page(config)
