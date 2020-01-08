import { calcDayAndTime } from '../../../../comp/util'

Component({
    properties: {
        serverTime: {
            type: Number,
            observer:'onServerTimeChange',
        },
        courseStartTime: {
            type: Number,
        },
    },

    data: {
        days: '',
        hours: '',
        mins: '',
        secs: '',

        hide: false,
    },

    ready() {
    },

    detached() {
        clearInterval(this.cdInterval)
    },

    methods: {
        onServerTimeChange() {
            const { courseStartTime, serverTime } = this.data

            this.duration = courseStartTime - serverTime
            if (this.duration <= 0) {
                return
            }

            clearInterval(this.cdInterval)
            this.updateCountDown()

            this.cdInterval = setInterval(() => {
                this.duration -= 1000
                this.updateCountDown()
            }, 1000)
        },
        /* 更新倒计时 */
        updateCountDown() {
            if (this.duration <= 0) {
                clearInterval(this.cdInterval)
                this.setData({ hide: true })
                this.triggerEvent('onCountDownEnd')
            }
            const { days, hours, mins, secs } = calcDayAndTime(this.duration)
            this.setData({ days, hours, mins, secs })
        },
    },
});