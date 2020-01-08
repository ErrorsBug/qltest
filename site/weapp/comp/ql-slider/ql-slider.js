Component({
    options: {

    },
    properties: {
        percent: {
            type: Number,
            value: 0,
            observer: "onPercentChange",
        },
    },

    data: {
        selectWidth: 0,
        x: 0,
    },

    methods: {
        onPercentChange() {
            let x = this.width * this.data.percent / 100;
            this.setData({
                x: x,
                selectWidth: this.data.percent
            });
        },
        onTouchStart(e) {
            // this.startPageX = e.touches[0].pageX;
            this.triggerEvent('onTouchAudioSliderStart', e);
        },
        onTouchmove(e) {
            let dis = e.touches[0].pageX - this.left;

            this.setData({
                selectWidth: dis / this.width * 100,
            });
        },
        onTouchend(e) {

            this.triggerEvent('onTouchAudioSliderEnd', {
                percent: this.data.selectWidth
            });

        },
        onTouchcancel(e) {
            this.triggerEvent('onTouchAudioSliderCancel', e);
        }
    },
    ready() {
        var query = wx.createSelectorQuery().in(this)
        query.select('.ql-slider-line').boundingClientRect((res) => {
            this.width = res.width;
            this.left = res.left;
        }).exec();
    }
});
