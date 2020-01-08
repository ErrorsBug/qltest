
/**
 * 评论列表弹窗
 * @type {Object}
 */
Component({
    properties: {
        isShow: {
            type: Boolean,
        },
        userPo: {
            type: Object,
        },
        commentNum: {
            type: Number,
        },
        commentList: {
            type: Array,
        },
        isLoadingMore: {
            type: Boolean,
        },
        isNoMore: {
            type: Boolean,
        }
    },

    data: {

    },

    methods: {
        onHideCommentViewClick(e) {
            this.triggerEvent('onHideCommentViewClick', e);
        },
        onScrollToLower(e) {
            this.triggerEvent('onScrollToLower', e);
        },
        onDeleteComment(e) {
            this.triggerEvent('onDeleteComment', e);
        }
    },

    ready () {
    }
});
