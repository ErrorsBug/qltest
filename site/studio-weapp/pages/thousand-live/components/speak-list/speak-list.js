/**
 * 发言列表
 * @type {Object}
 */
Component({
    properties: {
        speakList: {
            type: Array,
            value: [],
        },
        playingSpeakId: {
            type: String,
        },
        playingSpeakPercent: {
            type: Number,
        },
        playingSpeakDuration: {
            type: Number,
        },
        playingSpeakStatus: {
            type: String,
        },
        topicView: {
            type: Object,
        },

        topSpeakId: {
            type: String,
            observer: "onTopSpeakIdChange"
        },
        system: String,

    },

    data: {

    },

    methods: {
        // onOpenPPTBtnClick(e) {
        //     this.triggerEvent('onOpenPPTBtnClick', e);
        // }
        openReward(e) {
            this.triggerEvent('openReward', e.detail);
        },
        onImgClick(e) {
            this.triggerEvent('onImgClick', e.detail);
        },
        onPlayAudioBtnClick(e) {
            this.triggerEvent('onPlayAudioBtnClick', e.detail);
        },
        onSlideToSecond(e) {
            this.triggerEvent('onSlideToSecond', e.detail);
        },
        onTouchAudioSliderStart(e) {
            this.triggerEvent('onTouchAudioSliderStart', e.detail);
        },
        onTouchAudioSliderEnd(e) {
            this.triggerEvent('onTouchAudioSliderEnd', e.detail);
        },

        onTopSpeakIdChange() {
            console.log('topSpeakId:', this.data.topSpeakId);

            // 获取指定元素的滚动高度
            if (this.data.topSpeakId) {
                var query = wx.createSelectorQuery().in(this);
                query.select(`#id${this.data.topSpeakId}`).boundingClientRect((res) => {
                    console.log('top:', res);
                    this.triggerEvent('onTopSpeakIdChange', { offsetTop: res.top });
                }).exec()
            }
        }
    },

    ready () {
        
    }
});
