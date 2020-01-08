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
        topicView: {
            type: Object,
        }
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
        }
    },

    ready () {
        
    }
});
