import { digitFormat, linkTo,imgUrlFormat } from '../../../../comp/util';

Component({
    properties: {
        channelInfo: {
            type: Object,
            observer: 'onChannelInfoChange',
        },
        userList: {
            type: Array,
            observer:'onUserListChange',
        },
        userCount: {
            type: Number,
            observer: 'onUserCountChange',
        },
    },

    data: {
        /* 图片uri */
        icon_play_src: __uri('./img/icon-play.png'),
        mask_src:__uri('./img/mask.png'),

        coverImageSrc: '',
        list: [],
        userCountFormat: 0,
    },

    methods: {
        onChannelInfoChange() {
            let { headImage } = this.data.channelInfo
            headImage = headImage || '//img.qlchat.com/qlLive/liveCommon/liveHead.png'
            headImage = imgUrlFormat(headImage, "?x-oss-process=image/resize,m_fill,limit_0,h_469,w_750")

            this.setData({ coverImageSrc: headImage})
        },
        onUserListChange() {
            let { userList } = this.data
            console.log('userList', userList)
            userList = userList.map(item => {
                let {id, headImgUrl } = item
                headImgUrl = imgUrlFormat(headImgUrl, "?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100")
                return {
                    headImgUrl,
                    id,
                }
            })
            this.setData({ list: userList })
        },
        onUserCountChange() {
            let { userCount } = this.data  
            userCount = digitFormat(userCount)

            this.setData({ userCountFormat: userCount})
        },
        onPlayBtnTap() {
            this.triggerEvent('onPlayBtnTap')
        },
    }
});