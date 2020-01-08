
/**
 * 悬浮的操作菜单
 * @type {Object}
 */
Component({
    properties: {
        topicId: {
            type: String,
        }
    },

    data: {

    },

    methods: {
        onToBottomBtnClick(e) {
            this.triggerEvent('onToBottomBtnClick', e);
        },
        onToTopBtnClick(e) {
            this.triggerEvent('onToTopBtnClick', e);
        }
    },

    ready () {
    }
});
