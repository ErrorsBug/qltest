import {
    imgUrlFormat, timeBefore,
} from '../../../../comp/util';

/* 一个简单的评论列表展示组件 */
Component({
    properties: {
        sum: {
            type: Number,
            value: 0,
        },
        noneOne: {
            type: Boolean,
            value: false,
        },
        noMore: {
            type: Boolean,
            value: false,
        },
        list: {
            type: Array,
            value: [],
            observer:'onListChange'
        },
    },
    data: {
        viewList: [],
    },

    methods: {
        onListChange(newVal, oldVal) {
            const viewList = this.modelCommentToView(newVal)
            this.setData({viewList})
        },
        /* 将评论列表数据映射为可以放在视图中渲染的数据，谁叫小程序连管道符都没有呢 */
        modelCommentToView(list) {
            const { sysTime } = this.data
            return list.map(item => {
                return {
                    ...item,
                    createByHeadImgUrl: imgUrlFormat(item.createByHeadImgUrl, '?x-oss-process=image/resize,h_140,w_140,m_fill'),
                    createTime: timeBefore(item.createTime, this.data.sysTime),
                }
            })
        },
    }
})