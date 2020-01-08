Component({
  properties: {
    confirmText: {
      type: String,
      value: '确定'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    showCancel: {
      type: Boolean,
      value: true
    },
  },

  methods: {
    tapConfirm() {
      this.triggerEvent('confirm', {})
    },

    tapCancel() {
      this.triggerEvent('cancel', {})
    },
  }
})


