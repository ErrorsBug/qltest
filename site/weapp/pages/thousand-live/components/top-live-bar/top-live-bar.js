/**
 * 页面顶部直播间信息工具栏
 * @param {Boolean} {            properties: {                             isShow: {                        type: Boolean        }    } [description]
 * @param {[type]}  data:    {                                             }       [description]
 * @param {[type]}  methods: {                    onHide(e [description]
 */
Component({
    properties: {
        liveId: {
            type: String,
        },
        liveLogo: {
            type: String,
        },
        liveName: {
            type: String,
        },
        onlineNum: {
            type: Number,
        },
        liveStatus: {
            type: String,
        },
        startTime: {
            type: String,
        },
        currentTimeMillis: {
            type: String,
        },
        isPPTMode: {
            type: Boolean,
        },
        isShowPPT: {
            type: Boolean
        }
    },

    data: {

    },

    methods: {
        onOpenPPTBtnClick(e) {
            this.triggerEvent('onOpenPPTBtnClick', e);
        }
    },

    ready () {
    }
});
