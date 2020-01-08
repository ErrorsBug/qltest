import { imgUrlFormat, getVal } from '../util'
import request from '../request';
import * as regeneratorRuntime from '../runtime'

class LiveroomBarComponent {
    properties = {
        liveInfo: {
            type: Object,
            observer: 'onLiveInfoChange'
        },
    }

    data = {
        logo: '',
        showFocusBtn: false,
        isFollow: false,

        focus_btn_src: __uri('./img/focus-btn.png'),
        focused_btn_src: __uri('./img/focused-btn.png'),
    }

    ready() {
        this.setData({ liveId: this.data.liveInfo.id })
        this.fetchFollowInfo()
    }

    detached() {

    }

    methods = {
        async fetchFollowInfo() {
            const { liveId } = this.data
            const isFollowParams = {
                url: '/api/weapp/live/is-follow',
                data: { liveId },
            }

            const result = await request(isFollowParams)
            const isFollow = getVal(result, 'data.data.isFollow')

            this.setData({ isFollow, showFocusBtn: true })
        },

        onLiveInfoChange() {
            let { logo } = this.data.liveInfo
            logo = imgUrlFormat(logo, "?x-oss-process=image/resize,m_fill,limit_0,h_128,w_128")

            this.setData({ logo })
        },

        onFormSubmit(e) {
            global.commonService.updateFormId(e.detail.formId)
        },

        async onFocusTap(e) {
            let { isFollow, liveId } = this.data
            let status = isFollow ? 'N' : 'Y'

            const result = await request({
                url: '/api/weapp/live/focus',
                data: { liveId, status }
            })

            if (result.data.state.code == 0) {
                const statusTip = status === 'Y' ? '关注成功' : '已取消关注'

                wx.showToast({
                    title: statusTip,
                })

                isFollow = !isFollow

                this.setData({ isFollow })
            }
        },
        linkToLive() {
            const { liveId } = this.data
            wx.redirectTo({
                url: `/pages/live-index/live-index?liveId=${liveId}`
            })
        },
    }
}

Component(new LiveroomBarComponent())
