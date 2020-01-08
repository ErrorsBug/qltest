import { digitFormat, linkTo } from '../../../../comp/util';

Component({
    properties: {
        topic: Object,
        system: String,
    },

    data: {
        timeNow: Date.now(),
        browseNum: '',
    },

    ready() {
        
        this.setData({
            browseNum: digitFormat(this.data.topic.browseNum)
        });
    },
    methods: {
        onItemClick() {
            if (this.data.style == 'video' || this.data.style == 'audio') {
                wx.showModal({
                    title: '提示',
                    content: '小程序暂时不支持查看音视频话题',
                    showCancel: false
                });
            } else {
                wx.redirectTo({
                    url: `/pages/thousand-live/thousand-live?topicId=${this.data.topic.id}`
                });
            }
        }
    }
});