import { digitFormat, linkTo ,formatMoney} from '../../../../comp/util';

Component({
    properties: {
        getMarket: Object,
        status: Object,
        discountGroup: Boolean,
        isRebate: Boolean,
        isDistribution: Boolean,
        channelInfo: Object,
        switch: String,
        discountInfo: {
            type: Object,
            observer: 'onDiscountInfoChange',
        }, 
        chargeConfigs: {
            type: Object,
            observer: 'onChargeConfigsChange',
        },  
        shareRatio: {
            type: String,
            observer: 'onShareRatioChange',
        },
        systemIos:Boolean,
    },

    data: {
        purchaseText: '立即购买',
        purchaseClass: '',
        beginGroupText: '一键开团',
        money: 0,
        discount: 0,
        discountStatus: 'N',
    },

    ready() {
        const { discountStatus, money, groupNum, discount } = this.data.getMarket
        let {
            purchaseText, purchaseClass,beginGroupText,
            discountGroup,
        } = this.data
        if (this.data.discountGroup) {
            // purchaseText = '原价: ' + money
            // purchaseClass = 'ori-price'
            beginGroupText = discountStatus === 'GP' ? `一键开团: ${discount}` : '一键开团'
            this.setData({ purchaseText, purchaseClass, beginGroupText})
        }
    },

    methods: {
        onFormSubmit(e) {
            global.commonService.updateFormId(e.detail.formId)
        },
        onCoursePlay() {
            this.triggerEvent('onCoursePlay')
        },
        onCheckInFree() {
            this.triggerEvent('onCheckInFree')
        },
        onPurchase() {
            this.triggerEvent('onPurchase')
        },
        onBeginGroup() {
            this.triggerEvent('onBeginGroup')
        },
        onJoinGroup() {
            this.triggerEvent('onJoinGroup')
        },
        onViewGroup() {
            this.triggerEvent('onViewGroup')
        },
        onShowShareModel(e) {
            global.loggerService.click(e)
            this.triggerEvent('onShowShareModel')
        },
        onDiscountInfoChange() {
            if (!Object.keys(this.data.discountInfo).length) { return }
            const { discount, money,discountStatus } = this.data.discountInfo
            this.setData({ 
                money: Math.floor(formatMoney(Number(this.data.shareRatio) * money)),
                discount: Math.floor(formatMoney(Number(this.data.shareRatio) * discount)),
                discountStatus: discountStatus,
            })
        },
        onChargeConfigsChange() {
            const { channelInfo, chargeConfigs } = this.data
            if (channelInfo.chargeType === 'flexible') {
                let sortedCharges = chargeConfigs.map(item => item)
                    .sort((a, b) => a.amount - b.amount)
                const { amount } = sortedCharges[0]
                this.setData({ money: Math.floor(formatMoney(Number(this.data.shareRatio) * amount)) })
            }
        },
        onShareRatioChange(){
            this.onDiscountInfoChange();
            this.onChargeConfigsChange();
        },
    }
})
