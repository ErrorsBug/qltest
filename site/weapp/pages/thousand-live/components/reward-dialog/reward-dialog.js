import order from '../../../../comp/order';

/**
 * 赞赏弹窗
 * @type {Object}
 */
Component({
    properties: {
        topicId: {
            type: String,
        },
        liveId: {
            type: String,
        },
        createBy: {
            type: String,
        },
        isShow: {
            type: Boolean,
        },
        speakCreateByHeadImgUrl: {
            type: String,
        },
        speakCreateByName: {
            type: String,
        },
        introduce: {
            type: String,
            value:  "爱赞赏的人，运气不会差哦~",
        },
        pic: {
            type: String,
        },
        prices: {
            type: Array,
            value: [2, 5, 10, 50, 100, 200],
        }
    },

    data: {

    },

    methods: {
        onHide(e) {
            this.triggerEvent('onHide', {});
        },
        onMoneyclick(e) {
            // this.triggerEvent('onMoneyclick', {});

            const money = e.currentTarget.dataset.money;
            console.log({
                type: 'REWARD',
                total_fee: money * 100,
                source: 'wxapp',
                liveId: this.data.liveId,
                ifboth: 'Y',
                topicId: this.data.topicId,
            });
            order({
                data: {
                    type: 'REWARD',
                    total_fee: money * 100,
                    source: 'wxapp',
                    liveId: this.data.liveId,
                    ifboth: 'Y',
                    topicId: this.data.topicId,
                    toUserId: this.data.createBy
                },

                success: () => {
                    // app.hideLoading();
                    // this.setData({
                    //     isShowLucky: false
                    // });
                    this.triggerEvent('onHide', {});
                },
            });
        }

    },

    ready () {
    }
});
