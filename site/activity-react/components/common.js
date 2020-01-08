import fetch from 'isomorphic-fetch';
import api from '../utils/api';
import Detect from '../utils/detect';

let inPay = false;

/**
 * 开始支付
 */
export async function doPay({
    liveId,
    topicId,
    channelId,
    campId,
    userId,
    toUserId,
    total_fee,
    channelNo = "qldefault",
    type,
    payType = '',
    chargeConfigId,
    docId,
    giftCount,
    ifboth = Detect.os.phone ? 'Y' : 'N',
    isWall,
    questionId,
    questionPerson,
    relayInviteId,
    shareKey,
    groupId,
    ch = '',
    source = 'web',
    toRelayLiveId,
    couponId,
    couponType,
    officialKey = '',
    /**是否上一个页面来着微信活动页面Y=是N=不是 */
    isFromWechatCouponPage = '',
    /****/
// 以下是回调
    callback = () => {},
    onPayFree = () => {},
    onCancel = () => {},
    qrToggle = () => {}
 }) {
        
        // 判断知否支付中
        if (inPay) {
            return false;
        }
        inPay = true;

        console.log('开始支付啦！！！！！！！');

        const res = await api('/api/wechat/make-order',{
                method: 'POST',
                body: {
                    liveId,
                    channelId,
                    campId,
                    topicId,
                    userId,
                    toUserId,
                    channelNo,
                    total_fee: (total_fee * 100).toFixed(0),
                    type,
                    payType,
                    chargeConfigId,
                    docId,
                    giftCount,
                    ifboth,
                    isWall,
                    questionId,
                    questionPerson,
                    relayInviteId,
                    shareKey,
                    groupId,
                    source,
                    toRelayLiveId,
                    couponId,
                    couponType,
                    ch,
                    isFromWechatCouponPage,
                    officialKey
                }
            }
        );

        // 恢复可支付状态
        inPay = false;

        if (res.state.code == 0) {
            const order = res.data.orderResult;

            if (!Detect.os.phone) {
                // 显示二维码
                qrToggle(order.qcodeUrl)
                selectPayResult(order.qcodeId, () => {
                    typeof callback == 'function' && callback(order.qcodeId);
                    // 关闭二维码
                    qrToggle()
                });

            } else {
                const onBridgeReady = (data) => {

                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            'appId': data.appId,
                            'timeStamp': data.timeStamp,
                            'nonceStr': data.nonceStr,
                            'package': data.packageValue,
                            'signType': data.signType,
                            'paySign': data.paySign,
                        }, (result) => {
                            console.log('调起支付支付回调 == ', JSON.stringify(result));

                            if (result.err_msg == 'get_brand_wcpay_request:ok') {
                                selectPayResult(order.orderId, () => {
                                    typeof callback == 'function' && callback(order.orderId);
                                });
                            } else if (result.err_msg == 'get_brand_wcpay_request:fail') {
                                qrToggle(order.qcodeUrl)
                                selectPayResult(order.qcodeId, () => {
                                    qrToggle()
                                    typeof callback == 'function' && callback(order.qcodeId);
                                });
                            } else if (result.err_msg == 'get_brand_wcpay_request:cancel') {
                                window.toast('已取消付费');
                                onCancel && onCancel();
                            }
                        })
                }

                // 监听付款回调
                if (typeof window.WeixinJSBridge === 'undefined') {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                } else {
                    onBridgeReady(order)
                }
            }

        } else if (res.state.code == 20012) {
            onPayFree && onPayFree(res);
        } else {
            if (res.state && res.state.msg) {
                window.toast(res.state.msg);
            }
            return res;
        }
}

export function selectPayResult(orderId, done) {
    if (!window.selectPayResultCount) {
        window.selectPayResultCount = 1;
    }

    console.log('支付回调次数 ==== ', window.selectPayResultCount);

    fetch('/api/wechat/selectResult?orderId=' + orderId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        credentials: 'include',
    })
        .then((res) => res.json())
        .then((json) => {
            console.log('支付回调 == ', JSON.stringify(json));

            if (json.state.code == 0) {
                window.selectPayResultCount = 1;
                // if (json.state.msg == 'SUCCESS') {
                //     window.toast('支付成功');
                done();
                // } else if (json.state.msg == 'CANCEL') {
                //     window.toast('微信支付处理中，请稍后再看,\n或者联系管理员');
                // } else {
                //     window.toast('支付失败');
                // }
            } else {
                setTimeout(() => {
                    if (window.selectPayResultCount < 40) {
                        window.selectPayResultCount += 1;
                        selectPayResult(orderId, done);
                    } else {
                        window.selectPayResultCount = 1;
                    }
                }, 3000);
            }
        });
}

export async function getChannelConfigs ({channelId}) {
    const res = await api('/api/wechat/activity/channel/configs',{
        method: 'POST',
        body: {
            channelId
        }
    })

    return res.data
}

export async function getCourseList(channelId, liveId, page, size) {
    
    const result = await api('/api/wechat/channel/topic-list', {
        method: 'GET',
        body: {
            channelId,
            liveId,
            clientType: 'weixin',
            pageNum: page,
            pageSize: size,
        }
    });

    return result.data && result.data.topicList || [];
};