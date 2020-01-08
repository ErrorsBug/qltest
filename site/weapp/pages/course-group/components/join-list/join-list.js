import { imgUrlFormat, formatDate } from '../../../../comp/util'

Component({
    properties: {
        joinList: {
            type: Object,
            observer: 'onListChange'
        },
        groupInfo: {
            type: Object,
            observer: 'onInfoChange'
        },
    },
    data: {
        leader: {},
        list: [],
    },
    methods: {
        /** 在methods里做时间和图片地址的格式化，谁叫小程序的模板语法这么弱呢╮（╯＿╰）╭ */
        onListChange() {
            const list = this.data.joinList.map(item => {
                item.userHead = imgUrlFormat(item.headUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100')
                item.createTime = formatDate(item.createTime, 'yyyy-MM-dd hh:mm')
                return item
            })
            this.setData({ list })
        },
        onInfoChange() {
            const { leaderName, leaderHead, createTime } = this.data.groupInfo

            const leader = {
                createTime: formatDate(createTime, 'yyyy-MM-dd hh:mm'),
                userHead: imgUrlFormat(leaderHead, '?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100'),
                userName: leaderName,
            }
            this.setData({ leader })
        },
    },
})