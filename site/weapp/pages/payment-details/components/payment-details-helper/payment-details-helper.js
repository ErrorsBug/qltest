Component({
  methods: {
    tapConfirm() {
      this.triggerEvent('confirm', {})
    },
    tapCancel() {
      this.triggerEvent('cancel', {})
    }
  },
})



