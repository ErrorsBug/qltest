/**
 * 弹幕展示组件
 * @param {[type]} {            properties: {                                                   item: {                              type: Object        } [description]
 * @param {[type]} index:   {                                                                   type: Number [description]
 * @param {[type]} }            }           [description]
 * @param {[type]} data:    {                                animationData: null                      }      [description]
 * @param {[type]} methods: {                                onChange(pre,  cur  [description]
 */
Component({
    properties: {
        item: {
            type: Object
        },
        index: {
            type: Number,
            // observer: 'onChange'
        }
    },

    data: {
        animationData: null
    },

    methods: {
        onChange(pre, cur) {
            if (!this.animation) {
                this.animation = wx.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease',
                });

                this.translateY = 0;
            }

            if (this.data.index > 3) {
                this.animation.translateY(`${this.translateY}%`).opacity(0).step();
            } else {
                this.translateY-= 100;
                this.animation.translateY(`${this.translateY}%`).step();
            }

            this.setData({
                animationData: this.animation.export()
            });
        }
    },

    ready () {
    }
});
