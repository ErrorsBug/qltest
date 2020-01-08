/**
 * 发言
 * @type {Object}
 */
Component({
    properties: {
        speak: {
            type: Object
        },
        topicView: {
            type: Object,
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
            this.triggerEvent('openReward', e);
        }
    },

    ready () {
    }
});
