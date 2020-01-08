require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var envi = require('envi')

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './over.scss'
 */

var standard = {
    init: function (initData) {
        this.initCompatibility('.main-container')
        this.initListeners()

        this.initData = initData
    },

    initListeners: function () {
        var that = this
        $('body').on('click', '.giftImg', function () {

        });
    },

    // locationTo: function (LinkUrl) {
    //     var url = LinkUrl
    //     var ch = urlUtils.getUrlParams("ch")
    //     var actId = urlUtils.getUrlParams("actId")

    //     if(ch) {
    //         url = urlUtils.fillParams({ch: ch}, url)
    //     }
    //     if(actId) {
    //         url = urlUtils.fillParams({actId: actId}, url)
    //     }

    //     setTimeout(function() {
    //         window.location.href = url
    //     }, 150);
    // },

    // locationToCampPay: function (code) {
    //     var url = '/wechat/page/camp-join' + window.location.search
    //     url = urlUtils.fillParams({code: code}, url)
    //     setTimeout(function() {
    //         window.location.href = url
    //     }, 150);
    // },

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