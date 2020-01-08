import { digitFormat, linkTo, imgUrlFormat, formatMoney, getVal } from '../../../../comp/util';

Component({
    properties: {
        channelInfo: {
            type: Object,
        },
        vipInfo: Object,
        discountInfo: {
            type: Object,
            observer: 'onDiscountInfoChange'
        },
        discountGroup: Boolean,
        chargeConfigs: {
            type: Object,
            observer: 'onChargeConfigsChange',
        },
        shareRatio: String,
        isRebate: Boolean,
        switch: String,
        isDistribution: Boolean,
        system: String,
    },

    data: {
        money: 0,
        discount: 0,
        groupNum: 0,
        discountStatus: 'N',
    },

    methods: {
        onDiscountInfoChange() {
            if (!Object.keys(this.data.discountInfo).length) { return }
            const { discount, discountStatus, groupNum, money } = this.data.discountInfo
            console.log('this.data.shareRatio----', this.data.shareRatio);
            this.setData({ 
                money,
                discount,
                discountStatus,
                groupNum,
            })

            console.log(this.data);
        },
        onChargeConfigsChange() {
            const { channelInfo, chargeConfigs } = this.data
            if (channelInfo.chargeType === 'flexible') {
                let money = ''
                let sortedCharges = chargeConfigs.map(item => item)
                    .sort((a, b) => a.amount - b.amount)
                const { amount, chargeMonths } = sortedCharges[0]
                money = `${amount}元/${chargeMonths}月`
                this.setData({ money })
            }
        },
        navToShareCard() {
            this.triggerEvent("navToShareCard");
        },
    },
});