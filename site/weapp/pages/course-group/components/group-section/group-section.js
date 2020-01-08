import { imgUrlFormat, calcRemainTime } from '../../../../comp/util'

Component({
    properties: {
        serverTime: {
            type: Number,
            observer: 'onServerTimeChange'
        },
        isHaruhi: {
            type: Boolean,
            // observer: '',
        },
        isMember: {
            type: Boolean,
        },
        groupInfo: {
            type: Object,
            observer: 'onInfoChange',
        },
        joinList: {
            type: Object,
            observer: 'onListChange',
        },
    },
    data: {
        leader: {},
        list: [],

        /* 最大展示数量 */
        maxDisplayNum: 4,

        hours: '',
        mins: '',
        secs: '',
        mss: '',
    },

    detached() {
        clearInterval(this.cdInterval)
    },

    methods: {
        onListChange() {
            const { joinList } = this.data

            const list = joinList.map(item => {
                item.userHead = imgUrlFormat(item.headUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200')
                return item
            })

            this.setData({ list })
        },
        onInfoChange() {
            const { leaderHead, leaderName } = this.data.groupInfo

            this.endTime = this.data.groupInfo.endTime
            const leader = {
                userHead: imgUrlFormat(leaderHead, '?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200'),
                userName: leaderName,
            }

            this.setData({ leader })
        },
        onServerTimeChange() {
            const { groupInfo, serverTime } = this.data

            this.duration = groupInfo.endTime - serverTime
            if(this.duration<=0){
                return
            }
            
            clearInterval(this.cdInterval)
            this.updateCountDown()

            this.cdInterval = setInterval(() => {
                this.duration -= 100
                this.updateCountDown()
            }, 100)
        },
        /* 更新倒计时 */
        updateCountDown() {
            if (this.duration <= 0) {
                this.triggerEvent('onCountDownEnd')
                console.log('clear')
                clearInterval(this.cdInterval)
            }
            const { hours, mins, secs, mss } = calcRemainTime(this.duration)
            this.setData({ hours, mins, secs, mss })
        },
    },
})
