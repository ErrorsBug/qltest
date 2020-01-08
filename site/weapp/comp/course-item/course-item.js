import { digitFormat, linkTo } from '../util';

Component({
    properties: {
        course: Object,
        system: String,
    },

    data: {
        timeNow: Date.now(),
        browseNumStr: '',
    },

    ready() {
        const { browseNum } = this.data.course
        this.setData({
            browseNumStr: digitFormat(browseNum)
        });
    },
    methods: {
        onItemClick() {
            if (this.data.style == 'video' || this.data.style == 'audio') {
                wx.showModal({
                    title: '提示',
                    content: '小程序暂时不支持查看音视频课程',
                    showCancel: false
                });
            } else {
                wx.redirectTo({
                    url: `/pages/thousand-live/thousand-live?topicId=${this.data.course.id}`
                });
            }
        }
    }
});