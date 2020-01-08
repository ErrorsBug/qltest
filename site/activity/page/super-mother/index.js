require('zepto');

var fastClick = require('fastclick');
var urlUtils = require('urlutils');

var conf = require('../conf');
var toast = require('toast');

var envi = require('envi')
var appSdk = require('appsdk')



/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './index.scss'
 */

var superMother = {

    init: function () {
        this.initCode();
        this.initListeners()
        this.getConfig()
        // this.initAPPShare()
        // this.setTracePage()
        // window.onload = this.loadLongImage()
        // this.initShare = this.initShare.bind(this)
        // setTimeout(this.initShare, 1000)

    },

    initCode: function() {
        var codeItem = window.localStorage.getItem('super_mother_coupon');
        var params = (codeItem || '').split(',');
        this.code = params.length && params[0];
        this.money = params.length > 1 && params[1] || '';

        if (this.money) {
            $('.mine-coupon').show();
        }


    },

    appShare: function() {

        var url = window.location.href;

        url = urlUtils.fillParams({
            ch: 'APP'
        }, url);

        appSdk.share({
            title: '叶一茜邀你参加《超级妈妈养成计划》，赢取大奖！',
            content: '点击赢取价值¥1996的迪士尼家庭套票！',
            shareUrl: url,
            thumbImageUrl: "https://img.qlchat.com/qlLive/liveCommon/super-mother.jpg"
        });

        var that = this;
        setTimeout(function() {
            var that = this;
            $.ajax({
                type: 'GET',
                url: '/api/wechat/activity/lottery/rand',
                timeout: 10000,
                data: { },
                // dataType: 'jsonp',
                success: function (res) {
                    res = JSON.parse(res)
                    if (res.state && res.state.code === 0 && res.data.coupon) {
                        that.money = res.data.coupon.money / 100;
                        that.code = res.data.code;
                        if (window.localStorage && res.data.code) {
                            window.localStorage.setItem('super_mother_coupon', that.code + ',' + that.money);

                            var url = '/wechat/page/activity/super-mother/coupon';
                            var ch = urlUtils.getUrlParams('ch');
                            if (ch) {
                                url += '?ch=' + ch;
                            }

                            setTimeout(function() {
                                window.location.href = url;
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
        }, 2000);
    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        $('body').on('click', '.pop-dialog', function(e) {
            $(this).hide()
        });


        if(envi.isQlchat()) {
            $("#get-course").hide()
            $("#share-for-code-btn").show()
        }

        $('body').on('click', '#get-code1, #get-code2', function(e) {
            if (that.money) {
                that.linkToWithqlshare("/wechat/page/activity/super-mother/coupon")
            } else {

                if(envi.isQlchat()) {
                    $('#share-for-code').show()
                } else {
                    // $('#share-for-code').show()
                    $('#share-modal').show()
                }
            }
        });

        $('body').on('click', '.modal .bg, .modal .close', function (e) {
            $('#share-modal').hide()
        });

        $('body').on('click', '#rule-btn', function(e) {
            $("#role-pop").show();
            // that.shareCallBack();
        });

        $('body').on('click', '.self-grow, .self-grow-tag', function(e) {
            $("#self-grow-pop").show();
        });
        $('body').on('click', '.marriage, .marriage-tag', function(e) {
            $("#marriage-pop").show();
        });
        $('body').on('click', '.easy-edu , .easy-edu-tag', function(e) {
            $("#easy-edu-pop").show();
        });

        $('body').on('click', '#order-channel , #get-course', function(e) {
            that.linkToWithShareKey("https://m.qlchat.com/live/channel/channelPage/2000000091042251.htm")
            // that.linkToWithShareKey("http://m.test1.qlchat.com/live/channel/channelPage/2000000018200063.htm")
        });

        $('body').on('click', '.mine-coupon', function(e) {
            that.linkToWithqlshare("/wechat/page/activity/super-mother/coupon")
        });


        $('body').on('click', '.share-btn, #share-for-code-btn', function(e) {
            that.appShare()
        });



    },

    linkToWithShareKey: function (url) {
        var qlshare = urlUtils.getUrlParams('qlshare');
        var ch = urlUtils.getUrlParams('ch');

        var tUrl = url;
        if (qlshare) {
            tUrl = urlUtils.fillParams({
                shareKey: 'a1d1e19032c9656889d008437ddcc2d6',
                wcl: '2000000143282846',
                orderNow: "Y"
            }, tUrl);
        } else {
            tUrl = urlUtils.fillParams({
                orderNow: "Y"
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
    },
    linkToWithqlshare: function (url) {
        var qlshare = urlUtils.getUrlParams('qlshare');
        var ch = urlUtils.getUrlParams('ch');

        var tUrl = url;
        if (qlshare) {
            tUrl = urlUtils.fillParams({
                qlshare: "Y"
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
    },

    shareCallBack: function () {
        var that = this;

        if (window._qla) {
            window._qla('event', {
                category: 'wechat_share',
                action: 'success',
            });
        }
        if(window.localStorage.getItem('super_mother_coupon')) {
            var turl = '/wechat/page/activity/super-mother/coupon';
            that.linkToWithqlshare(turl)
        } else {
            $.ajax({
                type: 'GET',
                url: '/api/wechat/activity/lottery/rand',
                timeout: 10000,
                data: { },
                // dataType: 'jsonp',
                success: function (res) {
                    res = JSON.parse(res)
                    if (res.state && res.state.code === 0) {
                        that.money = res.data.coupon.money / 100;
                        that.code = res.data.code;
                        if (window.localStorage && res.data.code) {
                            window.localStorage.setItem('super_mother_coupon', that.code + ',' + that.money);
                            var turl = '/wechat/page/activity/super-mother/coupon';
                            that.linkToWithqlshare(turl)
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
        }
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
            title: '叶一茜邀你参加《超级妈妈养成计划》，赢取大奖！', // 分享标题
            desc: '点击赢取价值¥1996的迪士尼家庭套票！',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/super-mother.jpg', // 分享图标
            success: function () {
                that.shareCallBack()

                // if (window._qla) {
                //     window._qla('event', {
                //         category: 'wechat_share',
                //         action: 'success',
                //     });
                // }
                // if(window.localStorage.getItem('super_mother_coupon')) {

                //     var turl = '/wechat/page/activity/super-mother/coupon';
                //     that.linkToWithqlshare(turl)

                // } else {
                //     var that = this;
                //     $.ajax({
                //         type: 'GET',
                //         url: '/api/wechat/activity/lottery/rand',
                //         timeout: 10000,
                //         data: { },
                //         // dataType: 'jsonp',
                //         success: function (res) {
                //             res = JSON.parse(res)
                //             if (res.state && res.state.code === 0) {
                //                 that.money = res.data.coupon.money / 100;
                //                 that.code = res.data.code;

                //                 if (window.localStorage && res.data.code) {
                //                     window.localStorage.setItem('super_mother_coupon', that.code + ',' + that.money);

                //                     var turl = '/wechat/page/activity/super-mother/coupon';
                //                     that.linkToWithqlshare(turl)

                //                 }

                //             } else {
                //                 toast.toast(res.state && res.state.msg || '领取失败，请稍后再试', 1000, 'middle');
                //             }


                //         },
                //         error: function (err) {
                //             console.error(err);
                //             toast.toast('领取失败，请稍后再试', 1000, 'middle');
                //         },
                //     });
                // }
            },
            cancel: function () {
            },
        };

        var config1 = {
            title: '叶一茜邀你参加《超级妈妈养成计划》，赢取大奖！', // 分享标题
            desc: '点击赢取价值¥1996的迪士尼家庭套票！',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/super-mother.jpg', // 分享图标
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

module.exports = superMother;
