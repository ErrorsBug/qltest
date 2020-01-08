const app = getApp();
class GoldBarComponent {
    properties = {
        /* 显示条件 */
        showReplay: {
            type: Boolean,
            value: true,
        },
        showDiscount: {
            type: Boolean,
            value: false,
        },
        showRebate: {
            type: Boolean,
            value: false,
        },
        showVip: {
            type: Boolean,
            value: false,
        },
        showLive: {
            type: Boolean,
            value: false,
        },

        /* 显示文字 */
        liveStatus: {
            type: String,
            value: '',
        },
        showUpdateStatus: Boolean,
        updateStatusText: String,
    }

    data = {
        discountUri: __uri('./img/icon-discount.png'),
        rebateUri: __uri('./img/icon-rebate.png'),
        liveUri: __uri('./img/icon-live.png'),
        replayUri: __uri('./img/icon-replay.png'),
        vipUri: __uri('./img/icon-vip.png'),
        system: app.globalData.system,
    }

    ready() {
    }

    detached() {

    }

    methods = {
    }
}

Component(new GoldBarComponent())
