require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
// var lazyimg = require('lazyimg');
var envi = require('envi')
var tpls = {
    listItem: __inline('./tpl/tuiwen.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './index-hd.scss'
 */

var standard = {
    shareTipShown: false,
    showBottom: false,
    init: function (initData) {
        this.initCompatibility('.main-container')
        this.initListeners()
        this.initCampJoinNum()
        this.initShareTipShown()


        if(envi.isIOS() && envi.isQlchat()) {
            $('#tuiwen-container').css("height", "90%")
        }

        this.renderTuiwenList(initData)
        // lazyimg.bindScrollEvts('.main-container');
        // setTimeout(lazyimg.loadimg, 50);

        this.getConfig()
        this.appShare(initData)

        this.initData = initData
    },

    initShareTipShown: function() {
        if(window.localStorage.getItem('tuiwen-shareGuid-' + urlUtils.getUrlParams("campId"))) {
            this.shareTipShown = true
            // $('.buyCourse').html("购买训练营")
        }
    },

    initCampJoinNum: function() {
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/campJoinNum',
            data: { id: urlUtils.getUrlParams("campId") || 0 },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if(res && res.data && res.data.authNum) {
                    $('.join-num').html(res.data.authNum + '人已参与')
                } else {
                    console.error(res.state)
                }
            },
            error: function (err) {
                console.error(err)
            },
        })
    },


    initListeners: function () {
        var that = this
        $('body').on('click', '.giftImg', function () {
            // if($(this).attr("data-url")) { 
            //     if (typeof _qla != 'undefined') {
            //         var ch = urlUtils.getUrlParams("ch")
            //         var actId = urlUtils.getUrlParams("actId")
            //         _qla('click', {
            //             category: 'link-to-camp-url',
            //             type: 'camp',
            //             actId: actId,
            //             ch: ch
            //         });
            //     }
            //     // that.locationTo($(this).attr("data-url"))
                
            // }
            that.getShareCode()
        });
        $('body').on('click', '.asaid', function () {
            setTimeout(function() {
                window.location.href = '/wechat/page/activity/qa'
            }, 150);
        });
        $('body').on('click', '.gotoChannel', function () {
            if(that.shareTipShown) {
                if (typeof _qla != 'undefined') {
                    var ch = urlUtils.getUrlParams("ch")
                    var actId = urlUtils.getUrlParams("actId")
                    _qla('click', {
                        category: 'link-to-camp-pay',
                        type: 'camp',
                        actId: actId,
                        ch: ch
                    });
                }
                that.locationToCampPay()
            } else {
                that.shareTipShown = true
                // $('.buyCourse').html("购买训练营")
                $('.modal').show()
            }
        });
        
        $('.asaid').hide()
        $('.gotoChannel').hide()

        $('.main-container').scroll(function() {
            if($(this).scrollTop() > 400) {
                if(!that.showBottom) {
                    $('.asaid').show()
                    $('.asaid').css("opacity", "1")
                    $('.gotoChannel').show()
                    $('.gotoChannel').css("transform", "translate(0 , 0)")
                    that.showBottom = true
                }
            } else {
                if(that.showBottom) {
                    $('.asaid').css("opacity", "0")
                    $('.gotoChannel').css("transform", "translate(0 , 300px)")
                    setTimeout(function() {
                        $('.asaid').hide()
                        $('.gotoChannel').hide()
                        that.showBottom = false
                    }, 100);
                }
            }
        })

        $('body').on('click', '.img-default', function () {
            if($(this).attr("data-remark") == "share") {
                $('.modal').show()
            } 
        });

        $('body').on('click', '.modal, .bg', function () {
            window.localStorage.setItem('tuiwen-shareGuid-' + urlUtils.getUrlParams("campId"), 'Y')
            $('.modal').hide()
        });
    },


    locationTo: function (LinkUrl) {
        var url = LinkUrl
        var ch = urlUtils.getUrlParams("ch")
        var actId = urlUtils.getUrlParams("actId")

        if(ch) {
            url = urlUtils.fillParams({ch: ch}, url)
        }
        if(actId) {
            url = urlUtils.fillParams({actId: actId}, url)
        }

        setTimeout(function() {
            window.location.href = url
        }, 150);
    },

    locationToCampPay: function (code) {
        var url = 'https://m.qlchat.com/wechat/page/camp-join' + window.location.search
        if(code) {
            url = urlUtils.fillParams({CPcode: code}, url)
        } 
        setTimeout(function() {
            window.location.href = url
        }, 150);
    },

    // initShare: function(initData) {

    //     var url = location.href
    //     url = urlUtils.fillParams({ch: "PYQ"}, url)

    //     wxutil.share({
    //         title: initData.shareData.shareTitle,
    //         desc: initData.shareData.shareDesc,
    //         imgUrl: initData.shareData.shareImg,
    //         shareUrl: url,
    //         successFn: function() {
    //             if (typeof _qla != 'undefined') {
    //                 _qla('event', {
    //                     category: 'wechat_share',
    //                     action:'success'
    //                 });
    //             }
    //         }
    //     });
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

    getShareCode: function () {
        var that = this
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/shareCode',
            timeout: 10000,
            data: {
                campId: urlUtils.getUrlParams("campId") || 0,
            },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if (res && res.data && res.data.code) {
                    that.locationToCampPay(res.data.code)
                } else {
                    toast.toast(res.state && res.state.msg || "请求失败，请稍后再试", 1000, 'middle');
                }
            },
            error: function (err) {
                that.getShareCode()
                // alert(JSON.stringify(err));  
                // toast.toast('err', 1000, 'middle');
            },
        });
    },

    /* 初始化微信分享 */
    initShare: function () {
        var that = this;
        var url = window.location.href;
        url = urlUtils.fillParams({
            ch: 'PYQ'
        }, url);
        var config = {
            title: this.initData.shareData.shareTitle, // 分享标题
            desc: this.initData.shareData.shareDesc,
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: this.initData.shareData.shareImg, // 分享图标
            success: function () {
                that.getShareCode()
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

        // window.wx.updateAppMessageShareData(config);
        // window.wx.updateTimelineShareData(config);

        window.wx.onMenuShareAppMessage(config);
        window.wx.onMenuShareTimeline(config);
        window.wx.onMenuShareQQ(config);
        window.wx.onMenuShareWeibo(config);
    },

    appShare: function(initData) {
        var url = location.href
        url = urlUtils.fillParams({ch: "APP"}, url)
        var ver = envi.getQlchatVersion();
        var that = this;
        if (ver && ver >= 360) {
            window.qlchat.ready(function () {
                window.qlchat.onMenuShareWeChatTimeline({
                    type: "link", 
                    content: url, 
                    title: initData.shareData.shareTitle,
                    desc: initData.shareData.shareDesc,
                    thumbImage: initData.shareData.shareImg, 
                    success: that.getShareCode.bind(that)
                });
                window.qlchat.onMenuShareWeChatFriends({
                    type: "link", 
                    content: url, 
                    title: initData.shareData.shareTitle,
                    desc: initData.shareData.shareDesc,
                    thumbImage: initData.shareData.shareImg 
                });
            })
        }
    },

    initCompatibility: function(fixScrollSelector) {
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
                    var top = el.scrollTop;
                    var totalScroll = el.scrollHeight;
                    var currentScroll = top + el.offsetHeight;
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
            var elSelectot = selector || '';
            overscroll(document.querySelector(selector));
            document.body.addEventListener('touchmove', disableScroll);
        }
        fixScroll(fixScrollSelector);
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//
    },

    renderTuiwenList: function(initData){
        console.log(initData);
        $(".handlebar-container").html(tpls.listItem({
            imgs: initData.tuiwenList
        }))
    }

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

}

module.exports = standard;