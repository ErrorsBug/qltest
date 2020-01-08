require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var wxutil = require('wxutil');
var lazyimg = require('lazyimg');
var envi = require('envi')
var tpls = {
    listItem: __inline('./tpl/tuiwen.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './style.scss'
 */

var standard = {
    init: function (initData) {
        this.initCompatibility('.main-container')
        this.initListeners()

        this.renderTuiwenList(initData)
        lazyimg.bindScrollEvts('.main-container');
        setTimeout(lazyimg.loadimg, 50);

        this.initShare(initData)
        this.appShare(initData)
    },

    initListeners: function () {
        var that = this
        $('body').on('click', '.giftImg', function () {
            if (typeof _qla != 'undefined') {
                var ch = urlUtils.getUrlParams("ch")
                var actId = urlUtils.getUrlParams("actId")
                _qla('click', {
                    category: 'linkToActivityPage',
                    actId: actId,
                    ch: ch
                });
            }
            that.locationTo($(this).attr("data-url"))
        });
        $('body').on('click', '.gotoChannel', function () {
            if (typeof _qla != 'undefined') {
                var ch = urlUtils.getUrlParams("ch")
                var actId = urlUtils.getUrlParams("actId")

                _qla('click', {
                    category: 'LinkToChannelPage',
                    actId: actId,
                    ch: ch
                });
            }

            var url = $(this).attr("data-url")
            url = urlUtils.fillParams({orderNow: "Y"}, url)
            that.locationTo(url)
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

    initShare: function(initData) {

        var url = location.href
        url = urlUtils.fillParams({ch: "PYQ"}, url)

        wxutil.share({
            title: initData.shareData.shareTitle,
            desc: initData.shareData.shareDesc,
            imgUrl: initData.shareData.shareImg,
            shareUrl: url,
            successFn: function() {
                if (typeof _qla != 'undefined') {
                    _qla('event', {
                        category: 'wechat_share',
                        action:'success'
                    });
                }
            }
        });
    }, 
    appShare: function(initData) {
        var url = location.href
        url = urlUtils.fillParams({ch: "APP"}, url)

        var ver = envi.getQlchatVersion();
        if (ver && ver >= 360) {
            window.qlchat.onMenuShareWeChatTimeline({
                type: "link", // "link" "image"
                content: url, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                title: initData.shareData.shareTitle,
                desc: initData.shareData.shareDesc,
                thumbImage: initData.shareData.shareImg // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
            });
            window.qlchat.onMenuShareWeChatFriends({
                type: "link", // "link" "image"
                content: url, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                title: initData.shareData.shareTitle,
                desc: initData.shareData.shareDesc,
                thumbImage: initData.shareData.shareImg // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
            });
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
    // appShare: function() {
    //     var ver = envi.getQlchatVersion();
    //     if (ver && ver >= 300) {
    //         // app版本判断
    //     }
    //     var shareOption = {
    //         title: this.shareOption.title,
    //         content: this.shareOption.des,
    //         shareUrl: this.shareOption.shareUrl,
    //         thumbImageUrl: this.shareOption.imgUrl
    //     }
    //     appSdk.share(shareOption);
    // }

}

module.exports = standard;