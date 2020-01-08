import * as regeneratorRuntime from '../../comp/runtime'
import { api } from '../../config'
import request from '../../comp/request'
import { getStorageSync, imgUrlFormat, getUserInfo } from '../../comp/util'

const logoUrl = __uri('../../comp/img/logo-qlchat-144x50.png')
const app = getApp()


Page({
  data: {
    channelId: '',

    mainImg: '', // 系列课图
    name: '', // 系列课标题
    desc: [],
    wxName: '', // 微信昵称

    parentChargeId: '', // 返现关系的父订单id

    weappQrcode: {
      status: '',
      data: null,
      message: '',
    },
    isShowShareImg: false,

    // rpx
    canvasW: 580,
    canvasH: 720,
    pixelRatio: 2,

    // px
    shareImgW: 580,
    shareImgH: 720,
    shareImgB: 30, // 边框宽度
  },

  onLoad(options) {
    wx.showLoading()
    wx.hideShareMenu() // 获取parentChargeId后才显示

    app.login().then(res => {
      console.log('options', options)

      if (options.type === 'channel') {
        this.setData({
          channelId: options.channelId
        })
        this.getChannelInfo()
        this.getParentChargeId()
      }
      
      // 获取昵称
      getUserInfo().then(res => {
        res && res.userInfo && res.userInfo.nickName &&
        this.setData({
          wxName: res.userInfo.nickName
        })
      })

      // 获取pixelRatio
      wx.getSystemInfo({
        success: res => {
          let pixelRatio = (750 / res.windowWidth).toFixed(3)
          // 小数位
          if (parseInt(pixelRatio) == pixelRatio) {
            pixelRatio = parseInt(pixelRatio)
          }

          let { shareImgW, shareImgH, shareImgB } = this.data
          shareImgW = Math.round(shareImgW / pixelRatio)
          shareImgH = Math.round(shareImgH / pixelRatio)
          shareImgB = Math.round(shareImgB / pixelRatio)

          this.setData({
            pixelRatio,
            shareImgW,
            shareImgH,
            shareImgB
          })
        }
      })

    }).catch(err => {
      console.log(err)
      wx.showToast({
        icon: 'loading',
        title: '登录失败'
      })
    })
  },


  getChannelInfo() {
    return request({
      url: api.getChannelIndex,
      data: {
        channelId: this.options.channelId
      }
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败');
      wx.hideLoading()

      let { channel } = res.data.channelInfo

      let desc0 = `课程类型：系列课 | 共${channel.planCount || channel.topicCount}节课`
      let desc = [
        desc0,
        `来自直播间：${channel.liveName}`
      ]
      
      this.setData({
        mainImg: imgUrlFormat(channel.headImage, '?x-oss-process=image/resize,m_fill,limit_0,h_360,w_780'),
        name: channel.name,
        desc,
      })

    }).catch(err => {
      console.log(err)
      wx.showToast({
        icon: 'loading',
        title: '获取信息失败'
      })
    })
  },


  getParentChargeId() {
    // 链接已带上的话不请求
    if (this.options.parentChargeId) {
      this.setData({
        parentChargeId: this.options.parentChargeId
      })
      wx.showShareMenu()
      return
    }

    request({
      url: '/api/weapp/parent-charge-id',
      data: { 
        channelId: this.options.channelId
      },
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败')

      if (res.data.data.parentChargeId) {
        this.setData({
          parentChargeId: res.data.data.parentChargeId
        })
        wx.showShareMenu()
      } else {
        throw Error('返现信息获取失败')
      }
    }).catch(err => {
      console.warn(err)
    })
  },


  tapMainImg() {
    wx.navigateTo({
      url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}`
    })
  },


  tapShareToMoments() {
    /**
     * 请求小程序码后画图
     */
    if (this.data.weappQrcode.status === 'pending') return

    if (this.data.weappQrcode.status === 'success') {
      this.setData({
        isShowShareImg: true
      })
      return this.drawShareImg()
    }
    
    this.setData({
      weappQrcode: {
        status: 'pending'
      }
    })
    wx.showLoading()
    
    let params = `userId=${getStorageSync('userId')}&channelId=${this.options.channelId}`
    
    request({
      url: '/api/weapp/qrcode',
      data: { 
        position: 'rebateChannel',
        params,
        path: `pages/channel-index/channel-index`,
        width: 480,
      },
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败')

      if (res.data.data && res.data.data.url) {
        wx.hideLoading()
        this.setData({
          weappQrcode: {
            ...this.data.weappQrcode,
            status: 'success',
            data: res.data.data.url
          }
        })

        this.setData({
          isShowShareImg: true
        })
        this.drawShareImg()

      } else {
        throw Error('获取小程序码失败')
      }
      
    }).catch(err => {
      wx.showToast({
        icon: 'loading',
        title: err.message
      })
      this.setData({
        weappQrcode: {
          ...this.data.weappQrcode,
          status: 'error',
          message: err.message
        }
      })
    })
  },


  /**
   * ！！！！canvas用px来画的，坑
   */
  async drawShareImg() {
    const ctx = wx.createCanvasContext('share-img')
    let { canvasW, canvasH, shareImgW, shareImgH, shareImgB, pixelRatio } = this.data,
        contentW = shareImgW - shareImgB * 2,
        brushY = 0 // 画笔Y坐标

    console.log('drawShareImg', canvasW, canvasH, pixelRatio, shareImgW, shareImgH)

    wx.showLoading()

    // 矩形底图
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, shareImgW, shareImgH)
    ctx.fill()

    // logo
    let logo = await getImageInfo(logoUrl)
    console.log(logo)
    let logoW = 72, logoH = 25
    if (logo && logo.path) {
      ctx.drawImage(logo.path, (shareImgW - logoW) / 2, 20, logoW, logoH)
    }
    brushY = logoH + 20 * 2

    // 主图260*120
    let mainImg = await getImageInfo(this.data.mainImg)
    console.log(mainImg)
    let mainImgW = contentW, mainImgH = mainImgW * 6 / 13
    if (mainImg && mainImg.path) {
      ctx.drawImage(mainImg.path, shareImgB, brushY, mainImgW, mainImgH)
      // 圆角
      rectRoundCorner(ctx, shareImgB, brushY, mainImgW, mainImgH, 5)
    }
    brushY += mainImgH

    // 标题
    ctx.setFillStyle('#000000')
    ctx.setFontSize(14)
    let names = strAutoWrap(this.data.name, 31, 2)
    for (let i in names) {
      brushY += 24
      ctx.fillText(names[i], shareImgB + 2, brushY)
    }

    // 分割线
    brushY += 13
    ctx.setLineWidth(.5)
    ctx.setStrokeStyle('#e4e4e4')
    ctx.moveTo(shareImgB, brushY)
    ctx.lineTo(shareImgB + contentW, brushY)
    ctx.stroke()

    // 小程序码
    brushY += 15
    let qrcode = await getImageInfo(this.data.weappQrcode.data)
    console.log(qrcode)
    let qrcodeRight = shareImgW * 0.36, qrcodeW = 160 / pixelRatio, qrcodeH = qrcodeW
    if (qrcode && qrcode.path) {
      ctx.drawImage(qrcode.path, qrcodeRight - qrcodeW, brushY, qrcodeW, qrcodeH)
    }
    brushY += qrcodeH

    // 画布高度根据标题行数缩短
    let borderBottom = 25
    brushY += borderBottom
    this.setData({
      canvasH: brushY * pixelRatio
    })
    brushY -= borderBottom

    // 文案
    brushY -= qrcodeH
    brushY += 15
    ctx.setFillStyle('#ef5670')
    let text2FontSize = 24 / pixelRatio,
        text2LineHeight = Math.round(text2FontSize * 1.8),
        text2Left = qrcodeRight + 20 / pixelRatio
    ctx.setFontSize(text2FontSize)
    let wxName = strAutoWrap(this.data.wxName, 20, 1)
    brushY += 10 / pixelRatio
    ctx.fillText('@' + wxName, text2Left, brushY)
    ctx.setFillStyle('#000000')
    brushY += text2LineHeight
    ctx.fillText('推荐了一堂好课', text2Left, brushY)
    brushY += text2LineHeight
    ctx.fillText('长按识别小程序码查看课程', text2Left, brushY)

    ctx.draw()
    wx.hideLoading()
  },


  onShareAppMessage({from, target}) {
    let shareData = {
      title: `${this.data.wxName}邀请你购买课程，还能立即返现哦~`,
      path: `pages/channel-index/channel-index?channelId=${this.data.channelId}&parentChargeId=${this.data.parentChargeId}`,
    }

    return shareData
  },


  saveImg() {
    let { canvasW, canvasH } = this.data

    wx.canvasToTempFilePath({
      canvasId: 'share-img',
      // destWidth: canvasW,
      // destHeight: canvasH,
      success: res => {
        console.dir(res)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            this.setData({isShowShareImg: false})
            wx.showToast({
              title: '保存成功'
            })
          }
        })
      } 
    })
  },


  closeShareImg() {
    this.setData({
      isShowShareImg: false
    })
  },
})


function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: resolve,
      fail: reject,
    })
  })
}



// 画圆角矩形
function roundRect(ctx, x, y, w, h, r) {
  const PI = Math.PI
  let min_size = Math.min(w, h)
  if (r > min_size / 2) r = min_size / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arc(x + w - r, y + r, r, -.5 * PI, 0)
  ctx.arc(x + w - r, y + h - r, r, 0, .5 * PI)
  ctx.arc(x + r, y + h - r, r, .5 * PI, PI)
  ctx.arc(x + r, y + r, r, PI, 1.5 * PI)
  ctx.closePath()
  return ctx
}


// 画图片四个圆角
function rectRoundCorner(ctx, x, y, w, h, r) {
  const PI = Math.PI
  ctx.beginPath()
  ctx.moveTo(x - 2, y - 2)
  ctx.arc(x + r, y + r, r, PI, 1.5 * PI)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x + w + 2, y - 2)
  ctx.arc(x + w - r, y + r, r, -.5 * PI, 0)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x + w + 2, y + h + 2)
  ctx.arc(x + w - r, y + h - r, r, 0, .5 * PI)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x - 2, y + h + 2)
  ctx.arc(x + r, y + h - r, r, .5 * PI, PI)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.closePath()
}


/**
 * 字符串自动换行
 * @param {string} str
 * @param {number} lineDisplayLen   单行字符长度，ascii字符为1
 * @param {number} maxLine          最大行数
 */
function strAutoWrap(str, lineDisplayLen, maxLine) {
  if (!lineDisplayLen) return str
  str = String(str)

  let res = [],
      line = '',
      charLen,
      displayLen = 0,
      isEllipsis = false
  for (let i = 0, len = str.length; i < len; i++) {
    charLen = str.charCodeAt(i) <= 128 ? 1 : 1.66
    if (displayLen + charLen > lineDisplayLen) {
      // 换行
      if (maxLine && maxLine - 1 <= res.length) {
        isEllipsis = true
        break
      }
      res.push(line)
      line = ''
      displayLen = 0
    }
    line += str[i]
    displayLen += charLen
  }
  res.push(line)

  // ...
  if (isEllipsis) {
    let last = res[maxLine - 1],
        len = last.length
    if (last.charCodeAt(len - 1) > 128 && last.charCodeAt(len - 2) > 128) {
      res[maxLine - 1] = last.slice(0, -2) + '...'
    } else {
      res[maxLine - 1] = last.slice(0, -3) + '...'
    }
  }

  return res 
}