import request from './request';

/* 下订单*/
export default (opt) => {

    let i = 0;
    let info;
    let interval;
    function getResult() {
        return request({
            url: '/api/weapp/selectResult',
            data: {
                orderId: info.orderId,
            },
        }).then(res => {
            i++;
            if (i >= 10) { i = 0; return Promise.reject('请求超过10次'); }
            if (res.data.state.code == 0) {
                global.commonService.updateFormId(info.prepay_id, 'pay')
                if (typeof opt.success == 'function') {
                    opt.success(res.data, info)
                    global.commonService.wxReport('pay_success', opt.data)
                }
                return Promise.resolve();
            } else {
                setTimeout(function () {
                    getResult()
                }, 2000);
            }
        }).catch(res => {
            i++;
            if (i >= 10) { i = 0; return Promise.reject('请求超过10次'); }
            setTimeout(function () {
                getResult()
            }, 2000);
        })
    }

    // 请求下单接口
    request({
        url: '/api/weapp/order',
        data: opt.data,
    })
        .then(res => {
            console.log(res.data)
            // 下单成功则调起支付接口
            if (res.data.state.code == 0) {
                info = res.data.data.orderResult;
                const prepay_id = info.packageValue.replace('prepay_id=', '')
                info.prepay_id = prepay_id

                global.commonService.wxReport('place_order', opt.data)

                return new Promise((resolve, reject) => {
                    console.log('time',String(Math.floor(Number(info.timeStamp) / 1000)));

                    wx.requestPayment({
                        timeStamp: info.timeStamp,
                        nonceStr: info.nonceStr,
                        package: info.packageValue,
                        signType: info.signType,
                        paySign: info.paySign,
                        success: res => {
                            // opt.payComplete();
                            resolve(res);
                        },
                        fail: err => {
                            console.log('err', err);
                            reject(err)
                        },
                    })
                })
            } else if (res.data.state.code == 20012) {
                opt.payFree && opt.payFree();
                return Promise.reject('免费支付特殊处理，并非报错');
            } else {
                return Promise.reject('fail to make order');
            }
        })
        // 支付成功后调用查询订单接口
        .then(getResult)
        .catch(err => {
            console.error(err);
        })
};
