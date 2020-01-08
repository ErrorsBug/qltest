require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');

// var tpls = {
//     listItem: __inline('./tpl/group-item.handlebars'),
// };

var tpls = {
    tuiwen: __inline('./tpl/tuiwen.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './new-main.scss'
 */

var standard = {
    init: function (initData) {


        this.initCode();
        this.initListeners()
        this.renderTuiwen()
        this.initIframe()

        this.getConfig()
    },

    renderTuiwen: function() {
        var imgs = [
            { url: __uri('./img/tuiwen/tuiwen_01.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_02.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_03.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_04.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_05.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_06.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_07.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_08.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_09.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_10.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_11.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_12.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_13.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_14.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_15.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_16.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_17.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_18.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_19.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_20.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_21.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_22.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_23.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_24.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_25.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_26.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_27.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_28.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_29.jpg')},
            { url: __uri('./img/tuiwen/tuiwen_30.jpg')},
        ];

        $(".tuiwen-imgs").html(tpls.tuiwen({
            imgs: imgs
        })).show();
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

    initIframe: function() {
        var htmlString = '<iframe frameborder="0" width="640" height="498" src="https://v.qq.com/iframe/player.html?vid=f0564fwe5va&tiny=0&auto=0" allowfullscreen></iframe>'
        setTimeout(function() {
            $('.video-container').append(htmlString)
        }, 2000);
    },

    // initHandlebarList: function () {
    //     $(".handlebar-container").html(tpls.listItem({
    //         listItem: [
    //             {
    //                 content: ""
    //             },
    //             {
    //                 content: ""
    //             },
    //         ]
    //     }))
    // },

    // ajaxRequest: function () {
    //     $.ajax({
    //         type: 'GET',
    //         url: '/api/wechat/activity/lottery/rand',
    //         timeout: 10000,
    //         data: { },
    //         // dataType: 'jsonp',
    //         success: function (res) {
    //             if(res && res.data) {
    //                 console.log(res.data);
    //             } else {
    //                 console.error(res.state.msg);
    //             }
    //         },
    //         error: function (err) {
    //             console.error(err);
    //             toast.toast('err', 1000, 'middle');
    //         },
    //     });
    // },

    initListeners: function () {
        var that = this;

        //* 各种兼容处理 *//
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 解决IOS漏底问题
        function disableScroll(event) {
            if (!event.canScroll) {
                event.preventDefault();
            }
        }
        function overscroll(el) {
            if (el) {
                el.addEventListener('touchstart', function (){
                    const top = el.scrollTop;
                    const totalScroll = el.scrollHeight;
                    const currentScroll = top + el.offsetHeight;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (currentScroll === totalScroll) {
                        el.scrollTop = top - 1;
                    }
                });

                el.addEventListener('touchmove', function(event) {
                    if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
                });
            }
        }
        function fixScroll(selector) {
            const elSelectot = selector || '';
            overscroll(document.querySelector(selector));
            document.body.addEventListener('touchmove', disableScroll);
        }
        fixScroll('.main-container');
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//

        $('body').on('click', '.modal, .bg, .on-top, .share-tips, .on-top', function() {
            $("#share-modal").hide();
        })



        // $('body').on('click', '.intro-text', function() {
        //     that.shareCallBack();
        // })
        // $('body').on('click', '.des', function() {
        //     localStorage.clear()
        //     toast.toast("清除localstorage")
        // })

        $('body').on('click', '.mine-coupon', function() {
            that.linkToWithqlshare("/wechat/page/activity/super-mother/coupon")
        })

        $('body').on('click', '#order-origin', function() {

            var tUrl = 'https://m.qlchat.com/live/channel/channelPage/2000000091042251.htm?orderNow=Y';
            that.linkToWithShareKey(tUrl)

        })


        $('body').on('click', '#order-channel', function() {
            var codeItem = window.localStorage.getItem('super_mother_coupon');
            var params = (codeItem || '').split(',');
            that.code = params.length && params[0];
            that.money = params.length > 1 && params[1] || '';

            if (that.code) {
                var qlshare = urlUtils.getUrlParams('qlshare');
                var ch = urlUtils.getUrlParams('ch');
                
                var tUrl = 'https://m.qlchat.com/live/channel/channelPage/2000000091042251.htm';
                if (qlshare) {
                    if (qlshare == 'y') {
                        tUrl = urlUtils.fillParams({
                            shareKey: 'a1d1e19032c9656889d008437ddcc2d6',
                            wcl: '2000000143282846',
                            discode: that.code,
                            orderNow: "Y"
                        }, tUrl);
                    } else {
                        tUrl = urlUtils.fillParams({
                            shareKey: qlshare,
                            discode: that.code,
                            orderNow: "Y"
                        }, tUrl);
                    }
                } else {
                    tUrl = urlUtils.fillParams({
                        orderNow: "Y",
                        discode: that.code,
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
            } else {
                $('#share-modal').show()
            }

        })

        $('body').on('click', '.get-coupon', function() {
            if (that.code) {
                that.linkToWithqlshare("/wechat/page/activity/super-mother/coupon")
            } else {
                $('#share-modal').show()
            }
        })


    },

    // 跳转到系列课
    linkToWithShareKey: function (url) {
        var qlshare = urlUtils.getUrlParams('qlshare');
        var ch = urlUtils.getUrlParams('ch');

        var tUrl = url;
        if (qlshare) {
            if (qlshare == 'y') {
                tUrl = urlUtils.fillParams({
                    shareKey: 'a1d1e19032c9656889d008437ddcc2d6',
                    wcl: '2000000143282846',
                    orderNow: "Y"
                }, tUrl);
            } else {
                tUrl = urlUtils.fillParams({
                    shareKey: qlshare,
                    orderNow: "Y"
                }, tUrl);
            }
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
    // 跳转到优惠码
    linkToWithqlshare: function (url) {
        var qlshare = urlUtils.getUrlParams('qlshare');
        var ch = urlUtils.getUrlParams('ch');

        var tUrl = url;
        if (qlshare) {
            tUrl = urlUtils.fillParams({
                qlshare: qlshare
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

        setTimeout(function() {
            if(window.localStorage.getItem('super_mother_coupon')) {
                var turl = '/wechat/page/activity/super-mother/coupon';
                that.linkToWithqlshare(turl)
            } else {
                var time = new Date().getTime();
                $.ajax({
                    type: 'GET',
                    url: '/api/wechat/activity/lottery/rand?time=' + time,
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
    
            if (window._qla) {
                window._qla('event', {
                    category: 'wechat_share',
                    action: 'success',
                });
            }
        }, 200);


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
                that.shareCallBack()
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