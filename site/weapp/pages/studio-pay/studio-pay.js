import { decode } from '../../comp/querystring'
import { getVal } from '../../comp/util'
import request from '../../comp/request'
import * as regeneratorRuntime from '../../comp/runtime'

const app = getApp()

const config = {
    async onLoad(options) {
        try {
            await app.login()
            console.log('options', options)
            this.orderData = decode(decodeURIComponent(options.orderData))
            this.redirectUrl = decodeURIComponent(options.redirectUrl)
            this.doPay()
        } catch (error) {
            console.error('页面初始化失败: ', error)
        }
    },
    async doPay() {
        try {
            const params = this.orderData
            params.source='wxapp'

            const result = await request({
                url: '/api/weapp/order',
                data: params,
            })

            if (getVal(result, 'data.state.code') === 0) {
                const orderResult = result.data.data.orderResult;
                const { timeStamp, nonceStr, packageValue, signType, paySign } = result.data.data.orderResult
                wx.requestPayment({
                    timeStamp:  timeStamp,	// String	是	时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    nonceStr: nonceStr,	// String	是	随机字符串，长度为32个字符以下。
                    package: packageValue,	// String	是	统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    signType: signType,	// String	是	签名算法，暂支持 MD5
                    paySign: paySign,	// String	是	签名,具体签名方案参见小程序支付接口文档;
                    success: (res) => { 
                        this.navigateBackToThirdWeapp()
                    },	
                    // Function	否	接口调用失败的回调函数
                    fail: (err) => {
                        console.error('err',err)
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                        })
                        setTimeout(() => {
                            wx.navigateBackMiniProgram()
                        }, 1000);
                    },	
                })
            }    
        } catch (error) {
            console.error('支付失败: ', error)
        }
    },

    navigateBackToThirdWeapp() {
        wx.navigateBackMiniProgram({
            extraData: {
                redirectUrl: this.redirectUrl,
            },
        })
    }
}

Page(config)
