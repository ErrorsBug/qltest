import { digitFormat, linkTo } from '../../../../comp/util';
import * as regeneratorRuntime from '../../../../comp/runtime'
Component({
    properties: {
        mainImageUrl: String,
        userName: String,
        title: String,
        codeUrl: String,
        channelInfo: Object,
        isDistribution: Boolean,
    },
    data: {
        logoUrl: 'https://img.qlchat.com/qlLive/temp/VBZYQSZ1-L8FT-RN8M-1517643787158-GI5EPC2AEMNC.png',
        mainImageUrl: '',
        codeUrl: '',
        title: '',
        imagePath: {},
        finish: false,
        userName: '',
        tip2: '推荐了一堂好课',
        tip3: '长按识别小程序码查看课程',
        
    },
    async ready(){
        /* 画图配置 */
        this.PAINTING_CONFIG = {
            canvasWidth: 582,
            canvasHeight: 750,

            logoWidth: 144,
            logoHeight: 50,
            logoTop: 35,
            logoLeft: 219,

            mainWidth: 523,
            mainHeight: 327,
            mainTop: 125,
            mainLeft: 30,

            codeWidth: 152,
            codeHeight: 152,
            codeTop: 565,
            codeLeft: 70,

            titleFontSize: 28,
            titleLeft: 34,
            titleTop: 470,
            titleLineHeight: 40,

            tipLeft: 234,
            tipFontSize: 24,
            firstTipTop: 587,
            secondTipTop: 625,
            thirdTipTop: 668,

            whiteHeight: 750,
            whiteWidth: 562,
        }
        this.ctx = wx.createCanvasContext('card', this)
        this.updateConfigWithRatio()
        this.loadedImage = 0
        this.ctx.setFillStyle('white');
        this.ctx.fillRect(5, 5, this.PAINTING_CONFIG.whiteWidth, this.PAINTING_CONFIG.whiteHeight);
        // this.ctx.draw(true);
        this.drawTitle(this.data.title);
        this.drawTip()
        this.drawPicture()
    },
    methods: {
        onHideShareCard() {
            this.triggerEvent('onHideShareCard')
            /* 微信统计 */
            global.commonService.wxReport('share_card_fail', {
                lesson_type: '系列课',
                lesson_id: this.data.channelInfo.channelId,
            })
        },
        drawTip(){
            const {tipFontSize,tipLeft,firstTipTop,secondTipTop,thirdTipTop} = this.PAINTING_CONFIG;
            // this.ctx.save();
            this.ctx.setFontSize(tipFontSize);
            this.ctx.setFillStyle('rgb(249,77,106)');
            this.ctx.setTextAlign('left');
            this.ctx.setTextBaseline('top');
            this.ctx.fillText('@' + this.data.userName, tipLeft, firstTipTop);
            this.ctx.setFillStyle('rgb(0,0,0)');
            this.ctx.fillText(this.data.tip2, tipLeft, secondTipTop);
            this.ctx.fillText(this.data.tip3, tipLeft, thirdTipTop);
            // this.ctx.restore();
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
        drawPicture(){
            const {logoUrl,mainImageUrl,codeUrl} = this.data;

            wx.getImageInfo({
                src: mainImageUrl,
                success: (res) => {
                    this.setData({ mainImageUrl: res.path })
                    this.drawMain()
                }
            })

            wx.getImageInfo({
                src: logoUrl,
                success: (res) => {
                    this.setData({ logoUrl: res.path })
                    this.drawlogo()
                }
            })
            
            wx.getImageInfo({
                src: codeUrl,
                success: (res) => {
                    this.setData({ codeUrl: res.path })
                    this.drawCode()
                }
            })
        },
        /* 画logo */
        drawlogo(){
            const { logoLeft, logoTop, logoWidth, logoHeight } = this.PAINTING_CONFIG
            this.ctx.drawImage(
                this.data.logoUrl,
                logoLeft,
                logoTop,
                logoWidth,
                logoHeight,
            )
            this.ctx.draw(true)            
            this.loadedImage ++
        },
        /* 画课程图 */
        drawMain(){
            const { mainLeft, mainTop, mainWidth, mainHeight } = this.PAINTING_CONFIG
            this.ctx.drawImage(
                this.data.mainImageUrl,
                mainLeft,
                mainTop,
                mainWidth,
                mainHeight
            )
            this.ctx.draw(true)
            this.loadedImage ++
        },
        /* 小程序码 */
        drawCode(){
            const { codeLeft, codeTop, codeWidth, codeHeight } = this.PAINTING_CONFIG
            this.ctx.drawImage(
                this.data.codeUrl,
                codeLeft,
                codeTop,
                codeWidth,
                codeWidth
            )
            this.ctx.draw(true);
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
                    canvasId: 'card',
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
                                /* 微信统计 */
                                global.commonService.wxReport('share_card_success', {
                                    lesson_type: '系列课',
                                    lesson_id: that.data.channelInfo.channelId,
                                })
                                that.triggerEvent('onHideShareCard')
                            },
                            fail: (err) => {
                                /* 微信统计 */
                                global.commonService.wxReport('share_card_fail', {
                                    lesson_type: '系列课',
                                    lesson_id: that.data.channelInfo.channelId,
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
        drawTitle(text) {
            const {titleFontSize,titleLeft,titleTop,titleLineHeight} = this.PAINTING_CONFIG
            this.ctx.save();
            this.ctx.setFontSize(titleFontSize);
            this.ctx.setFillStyle('rgb(0,0,0)');
            this.ctx.setTextAlign('left');
            this.ctx.setTextBaseline('top');
            let words = text.split('');
            let line = '';
            if(words.length > 18) {
                for(let i = 0; i < 18; i++){
                    line += words[i];
                }
                this.ctx.fillText(line, titleLeft, titleTop);
                let line2 = '';
                if(words.length < 36){
                    for(let i = 18; i < words.length; i++){
                        line2 += words[i];
                    }
                }else {
                    for(let i = 18; i < 34; i++){
                        line2 += words[i];
                    }
                    line2 += '...';
                }
                this.ctx.fillText(line2, titleLeft, titleTop + titleLineHeight);
            }else {
                for(let i = 0; i < words.length; i++){
                    line += words[i];
                }
                this.ctx.fillText(line, titleLeft, titleTop);
            }
            this.ctx.restore();
        },
    },
})
