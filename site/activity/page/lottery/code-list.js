require('zepto');

var fastClick = require('fastclick');
var urlUtils = require('urlutils');

var conf = require('../conf');


/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './code-list.scss'
 */

var codeList = {
    init: function () {

        this.initCode();
        this.initListeners()

        this.getConfig()
        // this.setTracePage()
        // window.onload = this.loadLongImage()
        this.initShare = this.initShare.bind(this)
        setTimeout(this.initShare, 1000)

    },

    initCode: function() {
        var codeItem = window.localStorage.getItem('lottery_result');
        var params = (codeItem || '').split(',');
        this.code = params.length && params[0];
        this.money = params.length > 1 && params[1] || '';

        if (this.money) {
            $('.money').html(this.money);
            $('.code').removeClass('hidden');
        }
    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        $('body').on('click', '.use-btn', function(e) {
            var url = 'https://m.qlchat.com/live/channel/channelPage/240000552022354.htm?sourceNo=link&orderNow=Y&discode=' + that.code;
            var ch = urlUtils.getUrlParams('ch');
            if (ch) {
                url += '&ch=' + ch;
            }
            setTimeout(function() {
                window.location.href = url;
            }, 100);
        });

    },

    /* 获取微信配置 */
    getConfig: function () {
        var that = this;
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/config',
            data: { url: encodeURIComponent(location.href) },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if (res.data.config.statusCode == 200) {
                    that.initWechat(res.data.config)
                }
            },
            error: function (err) {
                console.error(err)
            },
        })
    },

    /* 初始化微信配置 */
    initWechat: function (config) {
        console.log(config)
        var that = this;
        if (window.wx) {
            var apiList = ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
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
                that.initShare()
            })
        }
    },

    /* 初始化微信分享 */
    initShare: function () {
        wx.hideAllNonBaseMenuItem();
    },
}

module.exports = codeList;
