/**
 * 点击图片事件：tapimg
 * 点击关闭事件：tapclose
 */

Component({
  properties: {
    src: {
      type: String
    }
  },

  methods: {
    tapimg() {
      this.triggerEvent('tapimg', {})
    },

    tapclose() {
      this.triggerEvent('tapclose', {})
    },
  }
})

