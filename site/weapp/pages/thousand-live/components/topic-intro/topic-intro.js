
/**
 * 课程信息（倒计时）
 * @param {[type]} {            properties: {                                                         } [description]
 * @param {[type]} data:    {               } [description]
 * @param {[type]} methods: {                                 onOpenPPTBtnClick(e [description]
 */
Component({
    properties: {
        topicName: {
            type: String,
        },
        startTime: {
            type: String,
        },
        currentTimeMillis: {
            type: String,
        },
        topicStartTimeView: {
            type: String,
        }
    },

    data: {
        startTimer: ["00", "00", "00", "00"],
        isShowTimer: false,
    },

    methods: {
        startTimer() {
            let timeArr = [];
            let timerSecond = this.data.startTime - this.data.currentTimeMillis;
            let qlDays, qlHours, qlMinutes, qlSeconds;
            let timer = setInterval(() => {
                timerSecond = timerSecond - 1000;
                if (timerSecond > 0) {
                    qlDays = parseInt(timerSecond / (1000 * 60 * 60 * 24));
                    qlHours = parseInt(timerSecond / (1000 * 60 * 60) - qlDays * 24);
                    qlMinutes = parseInt(timerSecond / (1000 * 60) - qlDays * 24 * 60 - qlHours * 60);
                    qlSeconds = parseInt(timerSecond / 1000 - qlDays * 24 * 60 * 60 - qlHours * 60 * 60 - qlMinutes * 60);
                    timeArr = [qlDays, qlHours, qlMinutes, qlSeconds];
                    this.setData({
                        'startTimer': timeArr,
                        'isShowTimer': true
                    })

                } else {
                    this.setData({
                        'isShowTimer': false
                    })
                    clearInterval(timer);
                }

            }, 1000);
        },
    },

    ready () {
        if (this.data.startTime > this.data.currentTimeMillis) {
            this.startTimer();
        }
    }
});
