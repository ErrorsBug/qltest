import { digitFormat, linkTo ,formatMoney} from '../../../../comp/util';

Component({
    properties: {
        money: Number,
        isDistribution: Boolean,
        channelInfo: Object,
        discountInfo: {
            type: Object,
            observer: 'onDiscountInfoChange'
        },
        chargeConfigs:  {
            type: Object,
            observer: 'onChargeConfigsChange'
        },
        shareRatio: {
            type: String,
            observer: "shareRatioChange"
        }
    },
    data: {
        money: 0,
        discount: 0,
        discountStatus: 'N',
    },
    ready(){

    },
    methods: {
        onHideShareModel(e) {
            this.triggerEvent('onHideShareModel')
            /**微信统计 */
            global.commonService.wxReport('share_cancel', {
                lesson_type: '系列课',
                lesson_id: this.data.channelInfo.channelId,
            })
        },
        onShowShareCard(e) {
            global.loggerService.click(e);
            this.triggerEvent('onShowShareCard')
        },
        onDiscountInfoChange() {
            if (!Object.keys(this.data.discountInfo).length)  { return }
            const { discount, money,discountStatus } = this.data.discountInfo
            this.setData({ 
                money: formatMoney(Number(this.data.shareRatio) * money),
                discount: formatMoney(Number(this.data.shareRatio) * discount),
                discountStatus: discountStatus,
            })
        },
        onShare(e){
            global.loggerService.click(e);
        },
        onChargeConfigsChange() {
            const { channelInfo, chargeConfigs } = this.data
            if (channelInfo.chargeType === 'flexible') {
                let sortedCharges = chargeConfigs.map(item => item)
                    .sort((a, b) => a.amount - b.amount)
                const { amount } = sortedCharges[0]
                this.setData({ money: formatMoney(Number(this.data.shareRatio) * amount) })
            }
        },
        shareRatioChange(){
            this.onDiscountInfoChange();
            this.onChargeConfigsChange();
        }
    }
})
