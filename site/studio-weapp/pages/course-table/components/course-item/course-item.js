import { digitFormat, imgUrlFormat, formatDate, timeAfterFix} from '../../../../comp/util'

const config = {
    properties: {
        course: Object,
    },

    data: {
        timeTag: '',
        timeStr: '',
        imageUrl: '',
        learnNum: 0,
    },

    ready() {
        const { time, pic, learningCount } = this.data.course
        let { timeTag, timeStr, imageUrl, learnNum } = this.data
        
        if (time > Date.now()) {
            timeTag = timeAfterFix(time)
        }
        timeStr = formatDate(time, 'MM月dd日 hh:mm') 
        imageUrl = imgUrlFormat(pic, "?x-oss-process=image/resize,m_fill,limit_0,h_100,w_160")
        learnNum = digitFormat(learningCount)

        this.setData({ timeTag, timeStr, imageUrl, learnNum })
    },

    methods: {
        onCourseItemTap(e) {
            const { type, bussinessId } = this.data.course
            if(type === 'topic'){
                wx.navigateTo({ url: `/pages/thousand-live/thousand-live?topicId=${bussinessId}` })
                return
            }
            if (type === 'channel') {
                wx.navigateTo({ url: `/pages/channel-index/channel-index?topicId=${bussinessId}` })
                return
            }
        },
    },
}

Component(config)