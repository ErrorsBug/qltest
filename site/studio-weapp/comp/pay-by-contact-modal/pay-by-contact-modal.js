Component({
    properties: {
        /* 是否显示弹窗 */
        visible: {
            type: Boolean,
            value: false,
        },
        /* 支付需要输入的内容 */
        payTipsContent: {
            type: String,
            value: '',
        },
        /* 带入客服消息的session */
        sessionFrom: {
            type: String,
            value: '',
        },
    },
    data: {
    },
    detached() {
    },
    attached() {
    },
    methods: {
        hideModal() {
            this.triggerEvent('hidePayContactModal')
        },
        onConfirmClick() {
            this.hideModal()  
        },
    },
})
