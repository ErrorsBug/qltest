import { digitFormat } from '../../../../../../comp/util';

Component({
    properties: {
        hotLives: {
            type: Array,
            value: []
        }
    },
    data: {
        fansNum: ''
    },
    methods: {
        hotItemClick (event) {
            let id = event.currentTarget.dataset.id;
            wx.navigateTo({
                url: `/pages/live-index/live-index?liveId=${id}`
            });
        }
    },
    ready() {
        let arr = this.data.hotLives.map(item => {
            item.fansNumFormat = digitFormat(item.fansNum);
            return item;
        })

        this.setData({
            hotLives: arr
        });
    }
});