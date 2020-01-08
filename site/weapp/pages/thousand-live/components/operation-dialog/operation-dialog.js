/**
 * 操作列表弹窗
 * @param {Boolean} {            properties: {                             isShow: {                        type: Boolean        }    } [description]
 * @param {[type]}  data:    {                                             }       [description]
 * @param {[type]}  methods: {                    onHide(e [description]
 */
Component({
    properties: {
        isShow: {
            type: Boolean
        },
        topicId: {
            type: String,
        }

    },

    data: {

    },

    methods: {
        onHide(e) {
            this.triggerEvent('onhide', {});
        }
    },

    ready () {
    }
});
