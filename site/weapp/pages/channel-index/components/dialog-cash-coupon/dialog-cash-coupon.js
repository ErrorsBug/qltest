Component({
    properties: {
        showCashCouponDialog: Boolean,
        money: Number,
    },

    data: {

    },

    methods: {

        doUse() {
            this.triggerEvent('doUse')
        },

        closeCashCouponDialog() {
            this.triggerEvent('closeDialog')
        }
    }
})