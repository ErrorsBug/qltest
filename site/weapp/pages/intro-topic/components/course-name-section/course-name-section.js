import { formatDate,formatMoney } from '../../../../comp/util'

class CourseNameComponent{
    properties = {
        browseNum:{
            type: Number,
            observer: () => {
            },
        },
        topicPo:{
            type: Object,
            observer: 'onTopicPoChange',
        },
        topicExtendPo: {
            type: Object,
        },
        timeAfter:{
            type: String,
        },
        vipInfo: {
            type: Object,
        },
        systemIos: Boolean,
    }

    data = {
        startTime: '',
        topicCharge: 0,
        showCharge: false,
    }

    ready() {
    }

    detached() {

    }

    methods = {
        onTopicPoChange() {
            let { type, startTime, money = 0, channelId } = this.data.topicPo
            let { isSingleBuy } = this.data.topicExtendPo

            startTime = formatDate(startTime, 'yyyy-MM-dd hh:mm')
            let topicCharge = formatMoney(money)
            let showCharge = type === 'charge' && (!channelId || (channelId && isSingleBuy === 'Y'))
            
            this.setData({ startTime, topicCharge, showCharge });
        },
    }
}

Component(new CourseNameComponent())