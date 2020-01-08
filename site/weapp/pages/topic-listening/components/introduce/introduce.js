import {
    imgUrlFormat, digitFormat, formatDate,
} from '../../../../comp/util';

/* 课程介绍信息 */
Component({
    properties: {
        topicInfo: {
            type: Object,
            value: { },
            observer:'onInfoChange',
        },
        profiles: {
            type: Array,
            value: [],
            observer: 'onProfilesChange',
        },
        summary: Array,
        notSummary: Boolean,
    },
    data: {
        info: { },
        viewProfiles: [],
    },

    methods: {
        onInfoChange(newVal, oldVal) {
            const { info } = this.data
            console.log('newVal', newVal)
            info.authNum = digitFormat(newVal.authNum)
            info.browseNum = digitFormat(newVal.browseNum)
            info.commentNum = newVal.commentNum
            info.name = newVal.topic
            info.backgroundUrl = imgUrlFormat(newVal.backgroundUrl, '@400h_640w_1e_1c_2o')
            info.startTime = formatDate(newVal.createDate, 'yyyy-MM-dd hh:mm')

            this.setData({info})
        },
        onProfilesChange(newVal, oldVal) {
            const viewProfiles = newVal.map(item => {
                return {
                    ...item,
                    url: imgUrlFormat(item.url, '?x-oss-process=image/resize,w_660,limit_1')
                }
            })
            this.setData({ viewProfiles })
        },
    }
})