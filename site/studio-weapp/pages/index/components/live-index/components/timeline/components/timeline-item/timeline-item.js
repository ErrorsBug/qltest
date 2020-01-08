import { imgUrlFormat, sameDay, padStart } from '../../../../../../../../comp/util'

Component({
    properties: {
        item: {
            type: Object,
            observer: 'onItemChange',
        },
        serverTime: Number,
    },

    data: {
        viewItem: {},
        contentText: '',
        expand: true,
    },

    ready() {
    },

    methods: {
        onLikeTap(e) {
            const { id, status } = e.currentTarget.dataset
            this.triggerEvent('onLikeTap', { id, status })
        },
        onItemChange() {
            let { item, serverTime, expand, contentText } = this.data

            item.relateLogo = imgUrlFormat(item.relateLogo, "?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180")
            item.isToday = sameDay(item.createTime, serverTime)

            if (!String.prototype.padStart) {
                String.prototype.padStart = padStart
            }

            const date = new Date(item.createTime)

            item.monthStr = (date.getMonth() + 1).toString().padStart(2, '0')
            item.dayStr = date.getDate().toString().padStart(2, '0')
            
            expand = (item.content || '').length <= 80
            contentText = expand ? item.content : item.content.substr(0, 80)

            this.setData({ viewItem: item, expand, contentText })
        },
        onExpandTap() {
            let { expand, item, contentText } = this.data
            contentText = item.content
            expand = true

            this.setData({ contentText, expand })
        },
        onLinkTap() {
            console.log(this.data.item)
            const { relateId, liveId, relateType } = this.data.item
            let url = ''
            switch (relateType) {
                case 'topic':
                    url = `/pages/thousand-live/thousand-live?topicId=${relateId}`
                    break;
                case 'channel':
                    url = `/pages/channel-index/channel-index?channelId=${relateId}`
                    break;
            }
            if (url) {
                wx.navigateTo({ url })
            }
        },
    },
});