require('zepto');
// require('tapon');

var Handlebars = require('handlebars');

var fastClick = require('fastclick');
// var lazyimg = require('lazyimg');
// var model = require('model');
// var validator = require('validator');
// var Scrollload = require('scrollload_v3');
var toast = require('toast');
var urlUtils = require('urlutils');
// var envi = require('envi');
// var wxutil = require('wxutil');
var conf = require('../conf');
var lazyimg = require('lazyimg');




var tpls = {
    tuiwen: __inline('./tpl/tuiwen.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './index.scss'
 */

var lottery = {
    init: function () {
        this.initListeners()
        // this.recordLog('visit')

        // this.setTracePage()
        // window.onload = this.loadLongImage()

        this.renderTuiwen();

        //加载图片
        lazyimg.bindScrollEvts('#container');
        setTimeout(lazyimg.loadimg, 50);

        this.getConfig();

        this.initShare = this.initShare.bind(this)
        setTimeout(this.initShare, 1000);
    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // 购买按钮击事件
        $('body').on('click', '#order-channel', function (e) {
            var url = 'https://m.qlchat.com/live/channel/channelPage/240000552022354.htm?sourceNo=link&orderNow=Y';
            var ch = urlUtils.getUrlParams('ch');
            if (ch) {
                url += '&ch=' + ch;
            }
            setTimeout(function() {
                window.location.href = url;
            }, 100);
        });

        /* 点击关闭按钮和背景关闭modal */
        $('body').on('click', '.modal .bg, .modal .close', function (e) {
            that.hideShareModal()
        });

        /* 点击modal内容去往免费频道 */
        // $('body').on('click', '#gift-modal .content', function (e) {
        //     that.toggleGiftModal(false)
        //     location.href = 'https://m.test3.qlchat.com/live/channel/channelPage/' + freeChannelId + '.htm?orderNow=Y'
        // });

        $('body').on('click', '.lottery-show', function () {
            $('#share-modal').show()
        })
    },

    /* 加载长图 */
    // loadLongImage: function () {
    //     $('.long-pic > img').each(function (index, item) {
    //         var $item = $(item)
    //         $item.attr('src', $item.data('src'))
    //     })
    // },

    /* 切换弹窗显示状态 */
    hideShareModal: function () {
        $('#share-modal').hide()
    },

    renderTuiwen: function() {
        var imgs = [{
            url: __uri('./img/tuiwen/01_01.jpg')
        }, {
            url: __uri('./img/tuiwen/01_02.jpg')
        }, {
            url: __uri('./img/tuiwen/01_03.jpg')
        }, {
            url: __uri('./img/tuiwen/01_04.jpg')
        }, {
            url: __uri('./img/tuiwen/01_05.gif')
        }, {
            url: __uri('./img/tuiwen/01_06.jpg')
        }, {
            url: __uri('./img/tuiwen/01_07.jpg')
        }, {
            url: __uri('./img/tuiwen/01_08.jpg')
        }, {
            url: __uri('./img/tuiwen/01_09.jpg')
        }, {
            url: __uri('./img/tuiwen/01_10.jpg')
        }, {
            url: __uri('./img/tuiwen/01_11.jpg')
        }, {
            url: __uri('./img/tuiwen/01_12.jpg')
        }, {
            url: __uri('./img/tuiwen/01_13.jpg')
        }, {
            url: __uri('./img/tuiwen/01_14.jpg')
        }, {
            url: __uri('./img/tuiwen/01_15.jpg')
        }, {
            url: __uri('./img/tuiwen/01_16.jpg')
        }, {
            url: __uri('./img/tuiwen/01_17.jpg')
        }, {
            url: __uri('./img/tuiwen/01_18.jpg')
        }, {
            url: __uri('./img/tuiwen/01_19.jpg')
        }, {
            url: __uri('./img/tuiwen/01_20.jpg')
        }, {
            url: __uri('./img/tuiwen/02_01.jpg')
        }, {
            url: __uri('./img/tuiwen/02_02.jpg')
        }, {
            url: __uri('./img/tuiwen/02_03.jpg')
        }, {
            url: __uri('./img/tuiwen/02_04.jpg')
        }, {
            url: __uri('./img/tuiwen/02_05.jpg')
        }, {
            url: __uri('./img/tuiwen/02_06.jpg')
        }, {
            url: __uri('./img/tuiwen/02_07.jpg')
        }, {
            url: __uri('./img/tuiwen/02_08.jpg')
        }, {
            url: __uri('./img/tuiwen/02_10.jpg')
        }, {
            url: __uri('./img/tuiwen/02_11.jpg')
        }, {
            url: __uri('./img/tuiwen/02_12.jpg')
        }, {
            url: __uri('./img/tuiwen/02_13.jpg')
        }, {
            url: __uri('./img/tuiwen/02_14.jpg')
        }, {
            url: __uri('./img/tuiwen/03_01.jpg')
        }, {
            url: __uri('./img/tuiwen/03_02.jpg')
        }, {
            url: __uri('./img/tuiwen/03_03.jpg')
        }, {
            url: __uri('./img/tuiwen/03_04.jpg')
        }, {
            url: __uri('./img/tuiwen/03_05.jpg')
        }, {
            url: __uri('./img/tuiwen/03_06.jpg')
        }, {
            url: __uri('./img/tuiwen/03_07.jpg')
        }, {
            url: __uri('./img/tuiwen/03_08.jpg')
        }, {
            url: __uri('./img/tuiwen/03_09.jpg')
        }, {
            url: __uri('./img/tuiwen/03_10.jpg')
        }, {
            url: __uri('./img/tuiwen/03_11.jpg')
        }, {
            url: __uri('./img/tuiwen/03_14.jpg')
        }, {
            url: __uri('./img/tuiwen/03_15.jpg')
        }, {
            url: __uri('./img/qr-info.png')
        }];

        $(".tuiwen-imgs").html(tpls.tuiwen({
            imgs: imgs
        })).show();
    },

    /* 打日志 */
    // recordLog: function (type) {
    //     $.ajax({
    //         type: 'POST',
    //         url: '/api/wechat/activity/log/increase',
    //         data: { type: type },
    //     })
    // },

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
        var url = window.location.href;

        // if (url.indexOf('?') > -1) {
        //     url += '&ch=PYQ';
        // } else {
        //     url += '?ch=PYQ';
        // }

        url = urlUtils.fillParams({
            ch: 'PYQ'
        }, url);

        var config = {
            title: '把鲁豫、乐嘉感动哭，她是如何从山村逆袭北大，赢得《超级演说家》总冠军的？', // 分享标题
            desc: '收获终身学习能力，绝地反击！',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/temp/VO3QJQLD-UI49-A2MW-1504083531297-1UK8MWPAS3YL.jpg', // 分享图标
            success: function () {
                that.hideShareModal();
                var url = '/wechat/page/activity/lottery-draw';

                var ch = urlUtils.getUrlParams('ch');
                if (ch) {
                    url += '?ch=' + ch;
                }

                setTimeout(function() {
                    window.location.href = url;
                }, 100);

                if (window._qla) {
                    window._qla('event', {
                        category: 'wechat_share',
                        action: 'success',
                    });
                }

            },
            cancel: function () {
            },
        };

        var config1 = {
            title: '把鲁豫、乐嘉感动哭，她是如何从山村逆袭北大，赢得《超级演说家》总冠军的？', // 分享标题
            desc: '收获终身学习能力，绝地反击！',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/temp/VO3QJQLD-UI49-A2MW-1504083531297-1UK8MWPAS3YL.jpg', // 分享图标
            success: function () {
                that.hideShareModal();

                if (window._qla) {
                    window._qla('event', {
                        category: 'wechat_share',
                        action: 'success',
                    });
                }

            },
            cancel: function () {
            },
        };

        // window.wx.updateAppMessageShareData(config1);
        // window.wx.updateTimelineShareData(config);

        window.wx.onMenuShareAppMessage(config1);
        window.wx.onMenuShareTimeline(config);
        window.wx.onMenuShareQQ(config1);
        window.wx.onMenuShareWeibo(config1);

    },
}

module.exports = lottery;
