import { imgUrlFormat, sameDay, padStart } from '../../../../../../comp/util';

Component({
    properties: {
        list: {
            type: Array,
            observer: 'onListChange'
        },
        noMore: Boolean,
        noneOne: Boolean,
        serverTime: Number,
    },

    data: {
        viewList: [],
    },

    ready() {
    },

    methods: {
        onListChange(newVal) {
            let { viewList, serverTime } = this.data
            let list = newVal

            list = list.filter(item => item.relateType !== 'homework')
                // .map(item => {
                //     item.relateLogo = imgUrlFormat(item.relateLogo, "?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180")
                //     item.isToday = sameDay(item.createTime, serverTime)

                //     if (!String.prototype.padStart) {
                //         String.prototype.padStart = padStart
                //     }
                //     const date = new Date(item.createTime)
                //     item.monthStr = (date.getMonth() + 1).toString().padStart(2, '0')
                //     item.dayStr = (date.getDay() + 1).toString().padStart(2, '0')

                //     return item
                // })

            this.setData({
                viewList: list,
            })
        },

        onLikeTap(e) {
            const { id, status } = e.detail
            this.triggerEvent('onLikeTap', { id, status })
        },
    },
});