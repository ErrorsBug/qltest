/**
 * 发言
 * @type {Object}
 */
const app = getApp();
Component({
    properties: {
        speak: {
            type: Object
        },
        playingSpeakId: {
            type: String,
        },
        playingSpeakPercent: {
            type: String,
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
    },

    data: {
        system: app.globalData.system,
    },

    methods: {
        // onOpenPPTBtnClick(e) {
        //     this.triggerEvent('onOpenPPTBtnClick', e);
        // }
        openReward(e) {
            this.triggerEvent('openReward', e);
        },
        onPlayAudioBtnClick(e) {
            this.triggerEvent('onPlayAudioBtnClick', e);
        },
        onTouchAudioSliderCancel(e) {
            this.triggerEvent('onTouchAudioSliderCancel', e);
        },
        onTouchAudioSliderStart(e) {
            this.triggerEvent('onTouchAudioSliderStart', e);
        },
        onTouchAudioSliderEnd(e) {
            this.triggerEvent('onTouchAudioSliderEnd', e);
        },
    },

    ready () {
    }
});
