
import { fillParams } from './url-utils';
import { isIOS, isAndroid, getQlchatVersion} from './envi';
import api from './api'

function copy(obj) {
    // JSON解析之类的其实如果给定格式不对很容易出错滴，自己做好检验~
    return JSON.parse(JSON.stringify(obj));
}

// /* 获取微信配置 */
// function getConfig () {
//     var that = this;
//     $.ajax({
//         type: 'GET',
//         url: '/api/wechat/activity/config',
//         data: { url: encodeURIComponent(location.href) },
//         // dataType: 'jsonp',
//         success: function (res) {
//             res = JSON.parse(res)
//             if (res.data.config.statusCode == 200) {
//                 that.initWechat(res.data.config)
//             }
//         },
//         error: function (err) {
//             console.error(err)
//         },
//     })
// };

// /* 初始化微信配置 */
// var initWechat = function (config) {
//     console.log(config)
//     var that = this;
//     if (window.wx) {
//         var apiList = ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
//             'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
//             'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
//         ];
//         window.wx.config({
//             debug: false,
//             appId: config.appId,
//             timestamp: config.timestamp,
//             nonceStr: config.nonceStr,
//             signature: config.signature,
//             jsApiList: apiList
//         })
//         window.wx.ready(function () {
//             that.initShare()
//         })
//     }
// };

// /* 初始化微信分享 */
// initShare: function () {
//     var that = this;
//     var url = window.location.href;
//     url = urlUtils.fillParams({
//         ch: 'PYQ'
//     }, url);

//     var config = {
//         title: this.initData.shareData.shareTitle, // 分享标题
//         desc: this.initData.shareData.shareDesc,
//         link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
//         imgUrl: this.initData.shareData.shareImg, // 分享图标
//         success: function () {
//             that.getShareCode()
//             if (window._qla) {
//                 window._qla('event', {
//                     category: 'wechat_share',
//                     action: 'success',
//                 });
//             }
//         },
//         cancel: function () {
//         },
//     };

//     window.wx.onMenuShareAppMessage(config);
//     window.wx.onMenuShareTimeline(config);
//     window.wx.onMenuShareQQ(config);
//     window.wx.onMenuShareWeibo(config);
// },


/**
 * hd域名下的页面，初始化分享的方法
 */
const hdWxShare = async function (shareData, callBack) {
    var url = shareData.url || window.location.href;
    url = fillParams({
        ch: 'PYQ'
    }, url);
    
    const cb = function (category) {
        callBack && callBack()

        if (window._qla) {
            window._qla('event', {
                category: category || 'wechat_share',
                action: 'success',
            });
        }
    }

    const configResult = await api('/api/wechat/activity/config', {
        method: 'GET',
        body: {
            url: encodeURIComponent(location.href)
        }
    })

    let config = {}
    if(configResult.data && configResult.data.config.statusCode == 200) {
        config = configResult.data.config
    } else {
        console.error("获取配置文件失效")
        return
    }

    if(window.wx) {
        var apiList = ['checkJsApi',  'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
            'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
        ];
        window.wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: apiList
        })
        window.wx.ready(function () {
            var config = {
                title: shareData.title, // 分享标题
                desc: shareData.desc,
                link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
                imgUrl: shareData.imgUrl,
                success: cb
            };
            // window.wx.updateAppMessageShareData(config);
            // window.wx.updateTimelineShareData(config);

            window.wx.onMenuShareAppMessage(config);
            window.wx.onMenuShareTimeline(config);
            window.wx.onMenuShareQQ(config);
            window.wx.onMenuShareWeibo(config);
        })
    }

    var ver = getQlchatVersion();
    if (window.qlchat && ver && ver >= 360) { 
        window.qlchat.ready(function () { 
            window.qlchat.onMenuShareWeChatTimeline({
                type: "link", 
                content: url, 
                title: shareData.title,
                desc: shareData.desc,
                thumbImage: shareData.imgUrl,
                success: cb.bind(this, 'app_share')
            });
            window.qlchat.onMenuShareWeChatFriends({
                type: "link", 
                content: url, 
                title: shareData.title,
                desc: shareData.desc,
                thumbImage: shareData.imgUrl,
                success: cb.bind(this, 'app_share')
            });
        })
    }

}

export default hdWxShare