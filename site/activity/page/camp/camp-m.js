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
 * @require './camp-m.scss'
 */

var standard = {
    shareTipShown: false,
    showBottom: false,
    init: function (initData) {
        this.initCompatibility('.main-container')
        this.initListeners()
        this.initCampJoinNum()
        this.initShareTipShown()
        this.renderTuiwenList(initData)
        // lazyimg.bindScrollEvts('.main-container');
        // setTimeout(lazyimg.loadimg, 50);

        this.initCouponMoney()

        this.initData = initData
    },

    initCouponMoney: function() {
        var actCouponId = urlUtils.getUrlParams("activityCodeId")
        $.ajax({
            type: 'POST',
            url: '/api/wechat/coupon/activityCouponObj',
            data: { codeId: actCouponId },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if(res.data && res.data.promotionDto && res.data.promotionDto.money) {
                    var money = res.data.promotionDto.money;
                    var moneyStr = money%100 == 0 ? (money/100) : (money/100).toFixed(2) 
                    $('.cor-ps').html("点击领券后购买再减" + moneyStr + "元")
                } else {
                    $('.cor-ps').html("")
                }
            },
            error: function (err) {
                console.error(err)
            },
        })
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

        // $('body').on('click', '.giftImg', function () {
        //     that.getShareCode()
        // });

        $('body').on('click', '.asaid', function () {
            setTimeout(function() {
                window.location.href = '/wechat/page/activity/qa'
            }, 150);
        });

        $('body').on('click', '.gotoChannel', function () {
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

        // $('body').on('click', '.img-default', function () {
        //     if($(this).attr("data-remark") == "share") {
        //         $('.modal').show()
        //     } 
        // });

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
        var url = '/wechat/page/camp-join' + window.location.search
        if(code) {
            url = urlUtils.fillParams({CPcode: code}, url)
        } 
        setTimeout(function() {
            window.location.href = url
        }, 150);
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

}

module.exports = standard;