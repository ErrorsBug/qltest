require('zepto');
// require('tapon');


require('swiper');
require('swiperanimate');
var wxutil = require('wxutil')

var Handlebars = require('handlebars');

var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');

var conf = require('../../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './report.scss'
 */

var report = {
    init: function (initData) {

        this.initListeners();

        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',
            loop: false,
            initialSlide: 0,

            // 如果需要分页器
            // pagination: '.swiper-pagination',

            // 如果需要前进后退按钮
            nextButton: '.next-btn',
            // prevButton: '.swiper-button-prev',

            // 如果需要滚动条
            // scrollbar: '.swiper-scrollbar',
        });

        var time = new Date(initData.liveCreateTime) 
        $(".createDate")[0].innerHTML = "[" + time.getUTCFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日]"

        var today = new Date()
        // $(".today")[0].innerHTML = "[" + today.getUTCFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日]"
        // $(".today")[1].innerHTML = "[" + today.getUTCFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日]"
        // $(".today")[2].innerHTML = "[" + today.getUTCFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日]"

        var audioSeconds = initData.audioSeconds / 60
        $(".audioSeconds")[0].innerHTML = parseInt(audioSeconds) + 1

        $('body').on('click', '.to-look', function () {
            if(location.search) {
                setTimeout(function() {
                    location.href = '/wechat/page/live/' + location.search.slice(8)
                }, 150);
            } else {
                setTimeout(function() {
                    location.href = '/wechat/page/live/' + initData.myLive.id
                }, 150);
            }

        });

        $('body').on('click', '.page6-share', function () {
            $('.tip').show()
        });

        // $('body').on('click', '.page6-create', function () {
        //     $('.tip').show()
        // });

        $('body').on('click', '.tip', function () {
            $('.tip').hide()
        });

        // $('body').on('click', '.generate-mine-btn', function () {
        //     if(!initData.myLiveId) {
        //         toast("您还没有直播间")
        //         setTimeout(function() {
        //             location.href = '/wechat/page/live' + location.search
        //         }, 150);
        //     } else {
        //         setTimeout(function() {
        //             location.href = '/wechat/page/activity/teachers-day/report?liveId=' + initData.myLiveId
        //         }, 150);
        //     }
        // });

        $('body').on('click', '.page6-create', function () {
            if(!initData.myLive.id) {
                alert("你还未创建直播间，无法生成您的成就报告，点击确定前往创建直播间")
                setTimeout(function() {
                    location.href = '/wechat/page/create-live?qlform=&liveId=&fromLiveId=&ch=center';
                }, 150);
            } else {
                setTimeout(function() {
                    location.href = '/wechat/page/activity/teachers-day/report?liveId=' + initData.myLive.id
                }, 150);
            }
        });



        var mouth = parseInt ((today.getTime() - time.getTime()) / 1000 / 86400 / 30) + 1;
        var people = parseInt((initData.studentNo) * 400  / ((mouth || 1)*30*180)) + 1 ;

        $(".people")[0].innerHTML = people
        $(".mouth")[0].innerHTML = mouth

        
        var styleList = ["良师益友","诲人不倦","谆谆教导","因材施教","绘声绘色","孜孜不倦","博学多才","德才兼备","教导有方","兢兢业业"]
    // initData.liveId

         var tagId =  parseInt(initData.liveId) % 10

        $(".style")[0].innerHTML = styleList[tagId]
        $(".share-type")[0].innerHTML = styleList[tagId]



        wxutil.share({
            title: initData.liveName + "的讲师风格是【"+ styleList[tagId]+"】,快来看看他在千聊的成就报告吧" ,
            desc: '再小的个体，也有自己的讲台',
            imgUrl: initData.logoUrl,
            link: location.origin + '/wechat/page/activity/teachers-day/report' + (location.search || ("?liveId=" + initData.myLive.id)),
            successFn: function () {
                if (typeof _qla != 'undefined') {
                    _qla('event', {
                        category: 'wechat_share',
                        action: 'success'
                    });
                }
            }
        });  
    },



    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
    }

}

module.exports = report;