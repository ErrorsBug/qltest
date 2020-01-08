import { digitFormat, linkTo ,formatMoney,imgUrlFormat} from '../../../../comp/util/';
import {getUrlParams} from '../../../../comp/url-utils'

Component({
    properties: {
        list: {
            type: Array,
            observer: "formatData"
        },
        systemIos: Boolean,
    },

    data: {
        courseList: []
    },

    ready(){},

    methods: {
        loadPage(){
            this.triggerEvent('loadPage')
        },
        formatData(){
            let list = this.data.list
            let courseList = [];
            if (list.length){
                courseList = list.map(item => {
                    return {
                        ...item,
                        logo: imgUrlFormat(item.logo, '@200h_160w_1e_1c_2o'),
                        money: formatMoney(item.money),
                        discount: formatMoney(item.discount),
                    }
                })
            }
            this.setData({courseList})
        },
        //系列课跳转到介绍页，话题跳转到详情页
        locationTo(e) {
            global.loggerService.click(e);
            let shareKey = getUrlParams('shareKey',e.currentTarget.dataset.url)
            let lshareKey = getUrlParams('lshareKey',e.currentTarget.dataset.url)
            if(e.currentTarget.dataset.type == 'channel') {
                wx.navigateTo({
                    url: `/pages/channel-index/channel-index?channelId=${e.currentTarget.dataset.topicid}${shareKey ? '&shareKey=' + shareKey : ''}${lshareKey ? '&lshareKey=' + lshareKey : ''}`,
                })
            }else {
                wx.navigateTo({
                    url: `/pages/thousand-live/thousand-live?topicId=${e.currentTarget.dataset.topicid}${shareKey ? '&shareKey=' + shareKey : ''}${lshareKey ? '&lshareKey=' + lshareKey : ''}`,
                })
            }
        },
    }
});
