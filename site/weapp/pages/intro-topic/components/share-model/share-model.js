import { formatDate,formatMoney } from '../../../../comp/util'

Component({
    properties: {
        isDistribution: Boolean,
        shareRatio: {
            type: String,
            observer: "onTopicPoChange"
        },
        topicPo: {
            type: Object,
            observer: "onTopicPoChange"
        }
    },
    data: {
        topicCharge: '',
    },
    ready(){
        
    },
    methods: {
        onHideShareModel() {
            this.triggerEvent('onHideShareModel')
            /**微信统计 */
            global.commonService.wxReport('share_cancel', {
                lesson_type: '话题',
                lesson_id: this.data.topicPo.id,
            })
        },
        onShare(e){
            global.loggerService.click(e);
        },
        onShowShareCard(e) {
            global.loggerService.click(e);
            this.triggerEvent('onShowShareCard')
        },
        onTopicPoChange() {
            let {money = 0} = this.data.topicPo
            let topicCharge = formatMoney(Number(this.data.shareRatio)/100 * money);
            
            this.setData({ topicCharge });
        },
    }
})
