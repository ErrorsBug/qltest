import { imgUrlFormat } from '../util'
import { getLastTopicPlayInfo } from '../play-history'

Component({
    data: {
        bg: '',
        topicId: '',
        status: 'stop',
        animationData: {},
        visible: true,
    },
    detached() {
        clearInterval(this.interval)
        clearTimeout(this.naviTimeout)
    },
    attached() {
        this.checkHistory()
        /* 先获取一次状态，然后每两秒获取一次状态 */
        this.getState()
        this.interval = setInterval(() => {
            this.checkHistory()
            this.getState()
        }, 2000)
    },
    methods: {
        checkHistory() {
            const playInfo = getLastTopicPlayInfo()  
            let { bg, topicId } = this.data
            if (playInfo) {
                bg = imgUrlFormat(playInfo.backgroundImgUrl, "?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100")
                topicId = playInfo.topicId
                
                this.setData({ bg, topicId, visible: true })
            } else {
                this.setData({ visible: false })
            }
        },
        getState() {
            const { status } = this.data
            wx.getBackgroundAudioPlayerState({
                complete: (res) => {
                    if (res.status === 1 && this.status !== 'playing') {
                        this.setData({ status: 'playing' })
                    } else {
                        this.setData({ status: 'stop' })
                    }
                },
            })
        },
        viewCourse() {
            if (this.navigateLock) { return }
            this.navigateLock = true
            wx.navigateTo({
                url: '/pages/thousand-live/thousand-live?topicId=' + this.data.topicId
            })
            this.naviTimeout = setTimeout(() => {
                this.navigateLock = false
            }, 1000)
        },
    }
})
