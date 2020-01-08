import { imgUrlFormat, getVal, linkTo, digitFormat, formatDate, formatMoney,timeAfter } from '../../../../comp/util'
import request from '../../../../comp/request';
import * as regeneratorRuntime from '../../../../comp/runtime'

class RecommendTopicsComponent {
    properties = {
        list: {
            type: Array,
            observer: 'onListChange'
        },
        serverTime: Number,
        systemIos: Boolean,
    }

    data = {
        viewList: [],

        /* 图片地址 */
        uri_status_ongoing: __uri('./img/status-ongoing.png'),
        uri_icon_clock: __uri('./img/icon-clock.png'),
        uri_icon_video: __uri('./img/icon-video.png'),
        uri_icon_audio: __uri('./img/icon-audio.png'),
    }

    ready() {

    }

    detached() {

    }

    methods = {
        onListChange() {
            let { list, viewList,serverTime } = this.data
            viewList = list.map(item => {
                const imageUrl = imgUrlFormat(item.backgroundUrl, "?x-oss-process=image/resize,m_fill,limit_0,h_300,w_480")
                const learnNum = digitFormat(item.browseNum, 10000)
                const timeStr = formatDate(item.startTime,'MM月dd日 hh:mm')
                const money = formatMoney(item.money)
                const timeAfterStr = timeAfter(item.startTime, serverTime)
                
                let status = 'plan'
                if (item.startTime < serverTime) {
                    status = 'ongoing'
                }
                if (item.endTime) {
                    status = 'ended'
                }

                return {
                    ...item,
                    imageUrl,
                    learnNum,
                    timeStr,
                    money,
                    timeAfterStr,
                    status,
                }
            })
            this.setData({ viewList })
        },
        linkToTopic(e) {
            const topicId = e.currentTarget.dataset.id
            wx.redirectTo({
                url: `/pages/thousand-live/thousand-live?topicId=${topicId}`
            })
        },
    }
}

Component(new RecommendTopicsComponent())
