require('zepto');
require('tapon');

var fastClick = require('fastclick');
var lazyimg = require('lazyimg');
var model = require('model');
var validator = require('validator');
var Scrollload = require('scrollload_v3');
var toast = require('toast');
var envi = require('envi');
var wxutil = require('wxutil');
var conf = require('../conf');


var freeChannelId = '230000541016246'
var chargeChannelId = '230000493021827'

// var apiPrefix = 'https://m.qlchat.com'
var apiPrefix = 'https://test.m.qlchat.com'

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './main.scss'
 */

var storageChannel = {
    init: function () {
        this.initListeners()
        this.recordLog('visit')
        this.getConfig()
        this.setTracePage()
        window.onload = this.loadLongImage()
        this.initShare = this.initShare.bind(this)
        setTimeout(this.initShare, 1000)
    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // 购买按钮击事件
        $('body').on('click', '#order-channel', function (e) {
            location.href = 'https://m.qlchat.com/live/channel/channelPage/230000493021827.htm?lshareKey=a108a88cf2c0f581e506defb57ed1128&orderNow=Y'
        });

        /* 点击关闭按钮和背景关闭modal */
        $('body').on('click', '.modal .bg, .modal .close', function (e) {
            that.toggleGiftModal(false)
        });

        /* 点击modal内容去往免费频道 */
        $('body').on('click', '#gift-modal .content', function (e) {
            that.toggleGiftModal(false)
            location.href = 'https://m.qlchat.com/live/channel/channelPage/' + freeChannelId + '.htm?orderNow=Y'
        });

        $('body').on('click', '#button-share', function () {
            $('#share-modal').show()
        })
    },

    /* 加载长图 */
    loadLongImage: function () {
        $('.long-pic > img').each(function (index, item) {
            var $item = $(item)
            $item.attr('src', $item.data('src'))
        })
    },

    /* 切换弹窗显示状态 */
    toggleGiftModal: function (status) {
        status ? $('#gift-modal').show() : $('.modal').hide()
    },

    /* 打日志 */
    recordLog: function (type) {
        $.ajax({
            type: 'POST',
            url: '/api/wechat/activity/log/increase',
            data: { type: type },
        })
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
        var that = this;
        window.wx.onMenuShareTimeline({
            title: '懂得整理的人，生活都不会差', // 分享标题
            link: location.href, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/activity/storage/teacher-portrait.jpg', // 分享图标
            success: function () {
                $('#share-modal').hide();
                that.toggleGiftModal(true)
                that.recordLog('share')
            },
            cancel: function () {
            },
        });
    },
    /* 设置页面trace_page */
    setTracePage: function () {
        try {
            window.sessionStorage && window.sessionStorage.setItem('trace_page','schoolseason')
        } catch (error) {
            console.error(error)
        }
    },
}

module.exports = storageChannel;