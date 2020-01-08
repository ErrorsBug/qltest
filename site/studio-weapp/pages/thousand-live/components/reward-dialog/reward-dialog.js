import order from '../../../../comp/order';
import {fillParams,linkTo, orderInAnotherWeapp} from '../../../../comp/util'

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
            this.triggerEvent('onHide', {});
            const money = e.currentTarget.dataset.money;
            
            const params = {
                type: 'REWARD',
                total_fee: money * 100,
                source: 'web',
                liveId: this.data.liveId,
                ifboth: 'Y',
                topicId: this.data.topicId,
                toUserId: this.data.createBy,
                selfTopicId: this.data.topicId,
            }
            
            orderInAnotherWeapp(params, '/pages/thousand-live/thousand-live?topicId=' + params.selfTopicId)
            
            return
        },

    },

    ready () {
    }
});
