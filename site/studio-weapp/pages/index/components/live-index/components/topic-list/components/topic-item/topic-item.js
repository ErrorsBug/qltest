import { digitFormat, linkTo } from '../../../../../../../../comp/util';

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
            console.log(this.data.topic.style);
            if (!/^(audio|video|normal|ppt)$/.test(this.data.topic.style)) {
                wx.showModal({
                    title: '提示',
                    content: '小程序暂时不支持查该类型课程',
                    showCancel: false
                });
            } else {
                wx.navigateTo({
                    url: '/pages/intro-topic/intro-topic?topicId=' + this.data.topic.id
                });
            }
        }
    }
});