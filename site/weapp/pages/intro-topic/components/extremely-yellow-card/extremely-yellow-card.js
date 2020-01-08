Component({
    properties: {
        codeUrl: String,
        headImage: String,
        topicId: String,
    },
    data: {
        cardBg: 'https://img.qlchat.com/qlLive/temp/NLHPHOSJ-DYOD-ZQVJ-1517753982052-R2K5C47CGPX9.png',
        headImage: '',
        codeUrl: '',
        finishPaint: false,
    },

    ready() {
        /* 画图配置 */
        this.PAINTING_CONFIG = {
            canvasWidth: 486,
            canvasHeight: 863,

            logoWidth: 61,
            logoTop: 31,
            logoLeft: 24,

            qrcodeWidth: 137,
            qrcodeTop: 688,
            qrcodeLeft: 326,
        }

        this.ctx = wx.createCanvasContext('painter', this)
        this.updateConfigWithRatio()
        this.loadedImage = 0
        this.updateImageSrc()

        this.mock
    },

    methods: {
        onHideShareCard() {
            this.triggerEvent('onHideShareCard')
            /**微信统计 */
            global.commonService.wxReport('share_card_fail', {
                lesson_type: '话题',
                lesson_id: this.data.topicId,
            })
        },
        updateConfigWithRatio() {
            /* 根据宽度和设备屏幕宽度比例算出缩放比例 */
            const system = wx.getSystemInfoSync()
            const widthRatio = this.PAINTING_CONFIG.canvasWidth / 750
            const ratio = system.screenWidth / this.PAINTING_CONFIG.canvasWidth * widthRatio

            const paintingConfig = this.PAINTING_CONFIG
            /* 根据缩放比例更新配置中的值 */
            for (const key in paintingConfig) {
                if (paintingConfig.hasOwnProperty(key)) {
                    const element = paintingConfig[key];
                    if (typeof element === 'number') {
                        paintingConfig[key] = element * ratio
                    }
                }
            }
        },

        updateImageSrc() {
            const { headImage, codeUrl, cardBg } = this.data
            
            wx.getImageInfo({
                src: cardBg,
                success: (res) => {
                    this.setData({ cardBg: res.path })
                    this.onBgLoaded()
                }
            })

            wx.getImageInfo({
                src: headImage,
                success: (res) => {
                    this.setData({ headImage: res.path })
                    this.onLogoLoaded()
                }
            })
            
            wx.getImageInfo({
                src: codeUrl,
                success: (res) => {
                    this.setData({ codeUrl: res.path })
                    this.onQrcodeLoaded()
                }
            })
        },

        onBgLoaded() {
            /* 画背景 */
            const { canvasWidth, canvasHeight } = this.PAINTING_CONFIG
            
            this.ctx.drawImage(
                this.data.cardBg,
                0,
                0,
                canvasWidth,
                canvasHeight
            )
            this.ctx.draw(true)
            this.loadedImage ++
        },

        onLogoLoaded() {
            /* 画头像 */
            const { logoLeft, logoTop, logoWidth } = this.PAINTING_CONFIG
            
            this.circleImage(
                this.ctx,
                this.data.headImage,
                logoLeft,
                logoTop,
                logoWidth / 2
            )
            this.ctx.draw(true)
            this.loadedImage ++
        },

        onQrcodeLoaded() {
            /* 画二维码 */
            const { qrcodeLeft, qrcodeTop, qrcodeWidth } = this.PAINTING_CONFIG
            this.ctx.drawImage(
                this.data.codeUrl,
                qrcodeLeft,
                qrcodeTop,
                qrcodeWidth,
                qrcodeWidth
            )
            this.ctx.draw(true)
            this.loadedImage ++
        },

        /**保存图片 */
        saveImage() {
            if (this.loadedImage >= 3) {
                const { canvasWidth, canvasHeight } = this.PAINTING_CONFIG
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    destWidth: canvasWidth * 4,
                    destHeight: canvasHeight * 4,
                    canvasId: 'painter',
                    quality: 1,
                    success: (res) => {
                        let that = this;
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success:()=>{
                                wx.showToast({
                                    title: '保存成功',
                                    icon:'success',
                                });
                                /**保存成功日志收集 */
                                global.loggerService.event({
                                    category: 'saveCard',
                                    action: 'success',
                                });
                                /**微信统计 */
                                /**微信统计 */
                                global.commonService.wxReport('share_card_success', {
                                    lesson_type: '话题',
                                    lesson_id: that.data.topicId,
                                })
                                that.triggerEvent('onHideShareCard')
                            },
                            fail: (err) => {
                                /**微信统计 */
                                global.commonService.wxReport('share_card_fail', {
                                    lesson_type: '话题',
                                    lesson_id: that.data.topicId,
                                })
                                console.error('保存失败: ',err)
                            }
                        },that)
                    }
                },this); 
            } else {
                console.error('图片未绘制完')
            }
        },
        
        /**
         * 绘制圆形图片
         * 
         * @param {HTMLImageElement} image - 图片
         * @param {number} distX - 坐标x
         * @param {number} distY - 坐标y
         * @param {number} radius - 半径
         */
        circleImage(ctx, image, distX, distY, radius) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(distX + radius, distY + radius, radius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.clip()

            ctx.drawImage(image, distX, distY, radius * 2, radius * 2)

            ctx.beginPath()
            ctx.arc(distX, distY, radius, 0, Math.PI * 2, true)
            ctx.clip()
            ctx.closePath()
            ctx.restore()
        },
    },
})
