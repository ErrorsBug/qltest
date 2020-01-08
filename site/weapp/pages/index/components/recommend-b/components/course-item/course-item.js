import { digitFormat, linkTo } from '../../../../../../comp/util';

Component({
    properties: {
        course: {
            type: Object
        },
        system: String,
    },
    data: {
        learningNum: '',
        authNum: '',
    },
    methods: {

        handleItemClick() {
            let lshareKey = this.data.course.url.match(/lshareKey=[^\&]*/);
            if (lshareKey) {
                lshareKey = lshareKey[0].split('=')[1];
            }
            let url = this.data.course.type === 'channel' 
            ?
            `/pages/channel-index/channel-index?channelId=${this.data.course.businessId}&lshareKey=${lshareKey}`
            :
            `/pages/thousand-live/thousand-live?topicId=${this.data.course.businessId}&lshareKey=${lshareKey}`;

            wx.navigateTo({
                url
            });
        }
    },
    ready() {
        this.setData({
            learningNum: digitFormat(this.data.course.learningNum),
            authNum: digitFormat(this.data.course.authNum)
        });
    }
});