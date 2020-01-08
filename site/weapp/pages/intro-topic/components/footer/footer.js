import {formatMoney} from '../../../../comp/util'
class FooterComponent {
    properties = {
        topicView: {
            type: Object,
            observer:'onTopicViewChange'
        },
        power: {
            type: Object,
            observer: 'onPowerChange',
        },
        isAuth: {
            type: Boolean,
        },
        vipInfo: {
            type: Object,
            observer:'onVipInfoChange'
        },
        isDistribution: Boolean,
        shareRatio: {
            type: String,
            observer: "onTopicPoChange",
        },
        topicPo: {
            type: Object,
            observer: "onTopicPoChange",
        },
        isSingleBuy: {
            type: String,
        },
        channelId: {
            type: String,
        },
        switch: {
            type: String,
        },
        systemIos:Boolean,
    }

    data = {
        /* 是管理员 */
        isManager: false,
        /* 是vip */
        isVip: false,
        /* 是系列课课程 */
        isChannel: false,
        /* 系列课单买课程 */
        singleBuy:false,
        /* 课程类型 */
        topicType: '',
        /* 课程价格 */
        money: 0,
    }

    ready() {
        
    }

    detached() {

    }

    methods = {
        onTopicViewChange() {
            const { type, channelId, money} = this.data.topicView.topicPo  
            const { isSingleBuy} = this.data.topicView.topicExtendPo

            let { isChannel, singleBuy, topicType, topicCharge } = this.data
            isChannel = Boolean(channelId)
            singleBuy = isSingleBuy === 'Y'
            topicType = type
            topicCharge    = formatMoney(money)

            this.setData({ isChannel, singleBuy, topicType, topicCharge })
        },
        onPowerChange() {
            let { isManager } = this.data
            const { allowMGLive, allowSpeak } = this.data.power
            isManager = allowMGLive || allowSpeak

            this.setData({isManager})
        },
        onVipInfoChange() {
            let {isVip} = this.data
            isVip = this.data.vipInfo.isVip === 'Y'

            this.setData({isVip})
        },
        onFormSubmit(e) {
            global.commonService.updateFormId(e.detail.formId, 'form')
        },
        linkToTopic() {
            this.triggerEvent('linkToTopic')
        },
        onShowShareModel(e){
            global.loggerService.click(e)
            this.triggerEvent('onShowShareModel')
        },
        buyChannel() {
            this.triggerEvent('buyChannel')
        },
        enterPublic() {
            this.triggerEvent('enterPublic')
        },
        passwordInput(e) {
            this.triggerEvent('passwordInput', { value: e.detail.value })
        },
        enterEncrypt() {
            this.triggerEvent('enterEncrypt')
        },
        doOrder() {
            this.triggerEvent('doOrder')
        },
        onTopicPoChange() {
            let {money = 0} = this.data.topicPo
            let topicCharge = formatMoney(Number(this.data.shareRatio)/100 * money);
            topicCharge = parseInt(topicCharge.toString().split('.')[0]);
            this.setData({ money: topicCharge });
        },
    }
}

Component(new FooterComponent())
