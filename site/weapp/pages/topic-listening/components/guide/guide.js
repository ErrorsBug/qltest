const GUIDE_VIEW = 'GUIDE_VIEW' 
Component({
    data: {
        visible: false,
        animationData:{},
    },
    attached() {
        this.checkShowGuide()
    },
    methods: {
        checkShowGuide() {
            try {
                const hasView = wx.getStorageSync(GUIDE_VIEW)
                if (!hasView) {
                    this.setData({
                        visible: true,
                    })
                }
            } catch (error) {
                console.error('获取guide保存信息失败：', error)
            }
        },
        hideGuide() {
            this.setHidingAnimation()
            try {
                wx.setStorageSync(GUIDE_VIEW, 'Y')
            } catch (error) {
                console.error(error)
            }
        },
        /* 隐藏引导图动画 */
        setHidingAnimation() {
            const anime_time = 300
            const animation = wx.createAnimation({
                duration: anime_time,
                timingFunction: "linear",
                delay: 0,
            })   
            animation.opacity(0).step()

            this.setData({
                animationData:animation.export(),
            })
            setTimeout(() => {
                this.setData({ visible: false })
            }, anime_time + 50)
        },
        onTouchMove(e) {
            return false
        },
    },
})