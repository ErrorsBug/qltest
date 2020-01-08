require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var envi = require('envi');

// var tpls = {
//     listItem: __inline('./tpl/group-item.handlebars'),
// };

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './weibo.scss'
 */

var standard = {
    init: function (initData) {
        this.initFunc()
        this.getConfig()

        this.initListeners()
        // this.initHandlebarList()
    },

    initFunc: function () {
        var that = this;
        var isWeibo = envi.isWeibo();
        var isWechat = envi.isWeixin()

        $('body').on('click', '.modal, .bg, .on-top, .share-tips, .on-top', function() {
            $("#share-modal").hide();
        })

        $('body').on('click', '.page-footer', function (e) {
            if(!isWechat) {
                $('#share-modal').show()

                if (window._qla) {
                    window._qla('click', {
                        name: "点击领取优惠券",
                        region: "weibo",
                    });
                }

            } else {
                $.ajax({
                    type: 'GET',
                    url: '/api/wechat/activity/lottery/rand',
                    timeout: 10000,
                    data: {},
                    // dataType: 'jsonp',
                    success: function (res) {
                        res = JSON.parse(res)
                        if (res && res.data && res.data.code) {
                            if (window.localStorage && res.data.code) {
                                
                                that.money = res.data.coupon.money / 100;
                                that.code = res.data.code;
                                window.localStorage.setItem('super_mother_coupon', that.code + ',' + that.money);

                                var qlshare = urlUtils.getUrlParams('qlshare');
                                var ch = urlUtils.getUrlParams('ch');
                                var tUrl = 'https://m.qlchat.com/live/channel/channelPage/2000000091042251.htm';
                                if (qlshare) {
                                    tUrl = urlUtils.fillParams({
                                        shareKey: 'a1d1e19032c9656889d008437ddcc2d6',
                                        wcl: '2000000143282846',
                                        discode: res.data.code,
                                        orderNow: "Y"
                                    }, tUrl);
                                } else {
                                    tUrl = urlUtils.fillParams({
                                        orderNow: "Y",
                                        discode: res.data.code
                                    }, tUrl);
                                }
                                if (ch) {
                                    tUrl = urlUtils.fillParams({
                                        ch: ch
                                    }, tUrl);
                                } 
                                setTimeout(function() {
                                    window.location.href = tUrl;
                                }, 100);
                            }
                        } else {
                            toast.toast(res.state && res.state.msg || '领取失败，请稍后再试', 1000, 'middle');
                        }
                    },
                    error: function (err) {
                        console.error(err);
                        toast.toast('领取失败，请稍后再试', 1000, 'middle');
                    },
                });

                if (window._qla) {
                    window._qla('click', {
                        name: "点击领取优惠券",
                        region: "weixin",
                    });
                }
            }


        
        });
    },

    initListeners: function () {

        //* 各种兼容处理 *//
        // 解决点击300ms延迟
        // fastClick.attach(document.body);
        // // 解决IOS漏底问题
        // function disableScroll(event) {
        //     if (!event.canScroll) {
        //         event.preventDefault();
        //     }
        // }
        // function overscroll(el) {
        //     if (el) {
        //         el.addEventListener('touchstart', function (){
        //             const top = el.scrollTop;
        //             const totalScroll = el.scrollHeight;
        //             const currentScroll = top + el.offsetHeight;
        //             if (top === 0) {
        //                 el.scrollTop = 1;
        //             } else if (currentScroll === totalScroll) {
        //                 el.scrollTop = top - 1;
        //             }
        //         });

        //         el.addEventListener('touchmove', function(event) {
        //             if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
        //         });
        //     }
        // }
        // function fixScroll(selector) {
        //     const elSelectot = selector || '';
        //     overscroll(document.querySelector(selector));
        //     document.body.addEventListener('touchmove', disableScroll);
        // }
        // fixScroll('.main-container');
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//

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
        var url = window.location.href;

        url = urlUtils.fillParams({
            ch: 'PYQ'
        }, url);

        var config = {
            title: '我参与了叶一茜的幸福人生改变计划，一起学习还能赢取大奖！', // 分享标题
            desc: '点击赢取价值¥1996的迪士尼家庭套票！',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/UB6XP3ND-J8PT-VRGU-1509108859400-92CE94Y21J8K.jpg', // 分享图标
            success: function () {
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
            title: '我参与了叶一茜的幸福人生改变计划，一起学习还能赢取大奖！', // 分享标题
            desc: '点击赢取价值¥1996的迪士尼家庭套票！',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/UB6XP3ND-J8PT-VRGU-1509108859400-92CE94Y21J8K.jpg', // 分享图标
            success: function () {
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

module.exports = standard;