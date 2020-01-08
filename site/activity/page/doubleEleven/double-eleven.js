require('zepto');
require('zeptofix');
require('tapon');
var fastClick = require('fastclick');
var model = require('model');
var Promise = require('promise');
var Scrollload = require('scrollload_v3');
var toast = require('toast');
var wxutil = require('wxutil');
var urlutils = require('urlutils');
var view = require('view');
var lazyimg = require('lazyimg');
var appSdk = require('appsdk');
var envi = require('envi');
/**
 * 引入css
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './main.scss'
 */

var carouselPlugin = require('./craousel-plug');

var doubleEleven = {

    codeIdList: [],

    init: function(data){
        /* 初始化部分数据*/
        this.initCompatibility(['.container', '.course-con'])
        carouselPlugin.initCarousel($, '.poster-container', '.container');

        this.getCouponList();
        this.initListeners();
        this.initShare();
        view.scrollEvent();
        view.initDate();
        this.loadCourseList(data);
        
        lazyimg.bindScrollEvts('.container');
        setTimeout(lazyimg.loadimg, 20);
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
                el.addEventListener('touchstart', function (e){
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
        }
        if(typeof fixScrollSelector === "string") {
            fixScroll(fixScrollSelector);
            document.body.addEventListener('touchmove', disableScroll);
        }
        if(typeof fixScrollSelector === "object") {
            fixScrollSelector.forEach(function(item) {
                fixScroll(item);
            })
            document.body.addEventListener('touchmove', disableScroll);
        }
        
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//
    },

    initListeners: function () {
        var that = this;
        $('body > *').on('click', function () { });
        $('body').on('click', '.poster-item', function (e) {
            var $this = $(this)
            that.getCouponSingle($this.attr("data-codeId"))
            $(this).find(".get").show()
            $(e.currentTarget).find(".get").show()
        });
        $('body').on('click', '.btn-all-coupon', function () {
            that.getCouponBatch(that.codeIdList)
            $(".poster-item").find(".get").show()
            $(this).removeClass('btn-all-coupon').addClass("btn-strategy").text("活 动 攻 略")
        });

        $('body').on('click', '.btn-strategy', function () {
            $('.strategy-pop').show()
        });

        $('body').on('click', '.strategy-pop' ,function(e) {
            e.preventDefault()
            $('.strategy-pop').hide()
        })




        $('body').on('click', 'aside.gift', function () {
            $(".animation-con").show()

            var $main = $(".a-main")
            var $white = $(".white")

            $main.css({
                transform: "scale(0.2)",
                display: "block",
                opacity: "1",
                transition: "all 1s"
            })
            $white.css({
                display: "block",
                opacity: "0",
                transition: "all 1s"
            })

            setTimeout(function() {
                $main.css({
                    transform: "scale(1)"
                })
            }, 150);

            setTimeout(function() {
                $main.css({
                    transform: "scale(5)",
                    opacity: ".4",
                })
                $white.css({
                    opacity: "1",
                })
            }, 1150);

            setTimeout(function() {
                $main.css({
                    transition: "none",
                    display: "none"
                })
                $white.css({
                    transition: "none",
                    display: "none"
                })

                $(".animation-con").hide()
                $(".gift-pop").show()
            }, 2000);
        });
        $('body').on('click', '.gift-pop', function (e) {
            if($(e.target).hasClass("gift-pop") || $(e.target).hasClass("close")) {
                $(this).hide()
            }
        });
        $('body').on('click','.panicbuy-area li',function(e){
            that.tabSwitch(e);
        });
        $('body').on('click','.course-area li',function(e){
            that.redirectURL(e);
        });
        $('body').on('click','.buy-issue.have',function(e){
            that.fillInAdd(e);
        });
        $('body').on('click','.buy-issue.no',function(e){
            that.redirectURL(e);
        });
        $('body').on('click','.panicbuy-list .detail-container',function(e){
            that.redirectURL(e);
        });
        $('body').on('click','.tab-list',function(e){
            $(e.currentTarget).addClass('active').siblings().removeClass('active');
            var index = $(e.currentTarget).index();
            document.querySelectorAll('.course-area .item')[index].scrollIntoView();
        })
    },

    setCouponList: function(dataList) {
        var $itemList = []
        for(var i = 1; i <= 5; i ++) {
            $itemList.push($(".p" + i))
        }
        
        var codeGotNum = 0

        dataList.forEach(function(item, index) {
            $itemList.forEach(function($item,index) {
                if($item.attr("data-codeMoney") == item.money && item.remark=="de") {
                    $item.attr("data-codeId", item.id)
                    this.codeIdList.push(item.id)
                    if(item.status != "none") {
                        $item.find(".get").show()
                        codeGotNum ++
                    }
                }
            }, this)
        }, this);

        if(codeGotNum >=5 ) {
            $('.btn-all-coupon').removeClass('btn-all-coupon').addClass("btn-strategy").text("活 动 攻 略")
        }
    },

    getCouponList: function () {
        var that = this
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/getCouponList',
            timeout: 10000,
            data: {
                activityCode: "SSS20171111"
             },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if(res && res.data) {
                    that.setCouponList(res.data.dataList);
                } else {
                    console.error(res.state.msg);
                }
            },
            error: function (err) {
                console.error(err);
                toast.toast('err', 1000, 'middle');
            },
        });
    },

    getCouponSingle: function (promotionId) {
        $.ajax({
            type: 'POST',
            url: '/api/wechat/activity/getCouponSingle',
            timeout: 10000,
            data: {
                promotionId: promotionId,
             },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if(res && res.data) {
                } else {
                    console.error(res.state.msg);
                }
            },
            error: function (err) {
                console.error(err);
                toast.toast('err', 1000, 'middle');
            },
        });
    },
    getCouponBatch: function (promotionIdsList) {
        $.ajax({
            type: 'POST',
            url: '/api/wechat/activity/getCouponBatch',
            timeout: 10000,
            data: { 
                promotionIds: promotionIdsList,
            },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if(res && res.data) {
                } else {
                    console.error(res.state.msg);
                }
            },
            error: function (err) {
                console.error(err);
                toast.toast('err', 1000, 'middle');
            },
        });
    },

    shareOption: {
        title: '千聊11.11知识狂欢季来袭',
        des: '全场买1送6，更有价值125元的优惠券免费领，这个11.11让千聊陪你看见更美的自己',
        imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/QAXW43EE-XB87-FBUJ-1509961500218-FAATW4DXM5W3.png'
    },
    initShare: function() {
        var url = location.href
        wxutil.share({
            title: this.shareOption.title,
            desc: this.shareOption.des,
            imgUrl: this.shareOption.imgUrl,
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

        // var ver = envi.isQlchat();
        // if (envi.isQlchat()) {
        //     var shareOption = {
        //         title: this.shareOption.title,
        //         content: this.shareOption.des,
        //         shareUrl: url,
        //         thumbImageUrl: this.shareOption.imgUrl
        //     }
        //     // appSdk.share(shareOption);
        // }
    }, 

    tabSwitch: function(e){
        view.tabSwitch(e);
    },
    loadCourseList: function (data) {
        for (var i=0,len=data.length;i<len;i++){
            var params = {
                groupCode: data[i]
            };
            model.fetch({
                type: "POST",
                url: '/api/wechat/activity/getcourseList',
                data: params,
                success: function (result) {
                    if (result.state.code === 0) {
                        view.updateCourse(result.data);
                    } else {
                        console.log('课程列表加载出错');
                    }
                }.bind(this),
                error: function(err){
                    console.log(err);
                }
            });
        }
    },
    redirect: function(e){
        var url = $(e.currentTarget).attr("data-url");
        setTimeout(function(){
            window.location.href = url;
        },200);
    },
    redirectURL: function(e){
        var url = $(e.currentTarget).attr("data-url");
        var ch = urlutils.getUrlParams('ch')
        
        url = urlutils.fillParams({
            doubleEleven: 'Y',
        }, url)

        if(ch) {
            url = urlutils.fillParams({
                ch: ch,
            }, url)
        }

        setTimeout(function(){
            window.location.href = url;
        },200);
    },
    fillInAdd: function(e){
        setTimeout(function(){
            window.location.href = '/wechat/page/activity/double-eleven/address';
        },200);
    }
};

module.exports = doubleEleven;