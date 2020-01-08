import { digitFormat, linkTo, imgUrlFormat, getVal } from '../../../../comp/util';
import request from '../../../../comp/request'
import * as regeneratorRuntime from '../../../../comp/runtime'

Component({
    properties: {
        liveInfo: {
            type: Object,
            observer: 'onLiveInfoChange',
        },
        headImage: String,
        banners: {
            type: Array,
            observer: 'onBannersChange'
        },
        liveId: {
            type: String,
        }
    },

    data: {
        viewBanners: [],
        logoUrl: '',
        liveBg: '',

        showFollow: false,
        isFollow: false,
        followNum: 0,
    },

    ready() {
        this.fetchFollowInfo()
    },

    methods: {
        async fetchFollowInfo() {
            const { liveId } = this.data
            const isFollowParams = {
                url: '/api/weapp/live/is-follow',
                data: { liveId },
            }
            const followNumParams = {
                url: '/api/weapp/live/followNum',
                data: { liveId },
            }

            const result = await Promise.all([
                request(isFollowParams),
                request(followNumParams),
            ])

            const isFollow = getVal(result, '0.data.data.isFollow')
            const followNum = getVal(result, '1.data.data.follwerNum')

            this.setData({ isFollow, followNum, showFollow: true })
        },

        onBannersChange(newVal) {
            let { banners } = this.data
            banners = banners.map(item => {
                let imgUrl = imgUrlFormat(item.imgUrl, '@750w_417h_1e_1c_2o')
                return {
                    ...item,
                    imgUrl,
                }
            })
            this.setData({ viewBanners: banners })
        },

        onBannerTap(e) {
            const index = e.currentTarget.dataset.index
            const banner = this.data.banners[index]
            console.log('banner', banner)

            let localUrl = ''
            switch (banner.type) {
                case 'channel':
                    localUrl = `/pages/channel-index/channel-index?channelId=${banner.businessId}`
                    break;
                case 'topic':
                    localUrl = `/pages/thousand-live/thousand-live?topicId=${banner.businessId}`
                    break;
                case 'none':
                    break;
                default:
                    wx.showModal({
                        title: '暂不支持此链接',
                        showCancel: false,
                    })    
                    break;    
            }

            if (localUrl) {
                wx.redirectTo({ url: localUrl })
            }
        },

        onLiveInfoChange(newVal) {
            if (newVal.logo) {
                const logoUrl = imgUrlFormat(newVal.logo, '@92w_92h_1e_1c_2o')
                let liveBg = newVal.headerBgUrl || 'https://img.qlchat.com/qlLive/liveHeaderBg/bg-1.png'
                liveBg = imgUrlFormat(liveBg,'@750w_1e_1c_2o')
                
                this.setData({ logoUrl, liveBg })
            }
        },

        async onFocusBtnTap() {
            let { isFollow, liveId, followNum } = this.data
            const status = isFollow ? 'N' : 'Y'

            const result = await request({
                url: '/api/weapp/live/focus',
                data: { liveId, status }
            })

            if (result.data.state.code == 0) {
                const statusTip = status === 'Y' ? '关注成功' : '已取消关注'

                wx.showToast({
                    title: statusTip,
                    icon: 'success',
                })

                isFollow = !isFollow
                followNum = status === 'Y' ? followNum + 1 : followNum - 1

                this.setData({ isFollow, followNum })
            }
        },
        onFormSubmit(e) {
            global.commonService.updateFormId(e.detail.formId)
        },
    },
});