Component({
    properties:{
        duration: Number,
        stylestr: String,
        noMsecond: Boolean,
    },
    timer:null,
    data: {
        timerSecond:100,
        time:{
            // h: (this.data.duration/1000/360/24),
            // m: ((this.data.duration/1000)%24/3600),
            // s: ((this.data.duration/1000)%24%60/60),
        }
    },
    detached() {
        clearInterval(this.timer)
    },
    methods: {
        makeTime() {
            let durationTime= this.data.duration;
            this.setData({
                durationTime: durationTime,
            },()=>{
                this.doTimer();
            })
        },
        doTimer() {
            clearInterval(this.timer)
            this.timer=setInterval(() => {
                let durationTime= this.data.durationTime;
                let hours=~~((durationTime/1000) / 3600);
                let minutes=~~((durationTime/1000) % 3600 / 60);
                let second=~~(durationTime/1000) % 60;
                let msecond= ~~((durationTime/this.data.timerSecond) % (1000/this.data.timerSecond));
                this.setData({
                    durationTime: (this.data.durationTime - this.data.timerSecond),
                    time:{
                        hours: hours<10 ? '0'+hours : hours,
                        minutes: minutes<10 ? '0'+minutes : minutes,
                        second: second<10 ? '0'+second : second,
                        msecond: msecond,
                    }
                },()=>{
                    if(this.data.durationTime==0){
                        clearInterval(this.timer);
                        this.onFinish();//倒计时结束后的操作
                    }
                });
                
            }, this.data.timerSecond)
        },
        onFinish(){
            this.triggerEvent('onFinish')
        },
    },
    ready() {
        this.makeTime();
    },
});