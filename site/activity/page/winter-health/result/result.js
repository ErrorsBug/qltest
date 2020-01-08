require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../../conf');
var wxutil = require('wxutil');
require('hbarimgformat');
require('hbardateformat');
require('hbarcompare');
require('../helper');
var tpls = {
    result: __inline('./tpls/result.handlebars'),
};
// var appSdk = require('appsdk');
// var envi = require('envi');

/**
 * @require '../../../components_modules/reset.css'
 * @require '../../../comp/common-css/ql-common.css'
 * @require './result.scss'
 */

var standard = {
    init: function (initData) {
        this.initListeners();
        this.initShare();
        this.testResult(initData);
        this.initCompatibility('#container');
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
        fixScroll(fixScrollSelector);
    },
    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        $('body > *').on('click', function () { });
        //购买
        $('body').on('click','.course',function(e){that.redirectUrl(e)});
        //跳转优惠券页面
        $('body').on('click','.coupon-label',function(e){that.redirectUrl(e)});
        //返回活动页
        $('body').on('click','.return',function(e){
            var url ='/wechat/page/activity/winter-health';
            var ch = urlUtils.getUrlParams("ch");
            if(ch){
                url = urlUtils.fillParams({ 
                    ch: ch
                }, url);
            }
            setTimeout(function(){
                window.location.href=url;
            },200);
        });
    },
    data: {
        "course": [
            {
                id: "2000000048111892",
                headImage: "https://img.qlchat.com/qlLive/adminImg/FNRHLO2M-EW9L-LWK4-1510662508118-L6CNG6B2ZEXH.jpg",
                title: "刮痧、拔罐必备的五脏六腑临床应用",
                url: "https://m.qlchat.com/live/channel/channelPage/2000000048111892.htm?lshareKey=27f2335ce397be4e4d715541e2b47145",
                time: 68,
                money: 358,
                discount: 68,
                tip: "轻松调理、脏腑经络"
            },
            {
                id: "220000150105021",
                headImage: "https://img.qlchat.com/qlLive/adminImg/I9SAUAFL-856L-63QY-1510662090281-2JJLX2U2X3IW.jpg",
                title: "中医理论的敲门砖",
                url:"https://m.qlchat.com/live/channel/channelPage/220000150105021.htm?sourceNo=livecenter&lshareKey=89986544c96cb4c248f5e246f9e925c8", 
                time: 69,
                money: 99,
                discount: 69,
                tip: "气血津液、奇经八脉"
            },
            { 
                id: "220000369586774",
                headImage: "https://img.qlchat.com/qlLive/adminImg/TDY6VTF1-S9TT-X7QO-1510662423014-J3GG9B8NLD81.jpg",
                title: "不同体质的专属养生课",
                url:"https://m.qlchat.com/live/channel/channelPage/220000369586774.htm?sourceNo=livecenter&lshareKey=89986544c96cb4c248f5e246f9e925c8",
                time: 69,
                money: 99,
                discount: 69,
                tip: "调理体质、预防疾病"
            },
            {
                id: "290000301179881",
                headImage: "https://img.qlchat.com/qlLive/adminImg/8TNH3B4V-9XVU-WHF9-1510662603481-KW6ATGACGXLK.jpg",
                title: "艾灸调理那些事儿",
                url: "https://m.qlchat.com/live/channel/channelPage/290000301179881.htm?lshareKey=01c49d9802e91635bd382c1d4fa7bae3", 
                time: 59,
                money: 99,
                discount: 59,
                tip: "祛斑减肥、减少痛经"
            },
            {
                id: "280000242574604",
                headImage: "https://img.qlchat.com/qlLive/adminImg/GUODWXOZ-RP4C-86ON-1510662636632-JIJH2LZC1DDY.jpg",
                title: "营养专家教你：会吃的女人更美丽",
                url: "https://m.qlchat.com/topic/280000242574604.htm?lshareKey=62f73a8d536c7fbfb7e9f492da6c7c97", 
                time: 38,
                money: 39,
                discount: 20,
                tip: "皮肤紧绷、气色满分"
            },
        ],
        "title": [
            "稳住！身体是革命的本钱。不良的生活与饮食习惯是病症的根源！不及时调整会使你的健康状况雪上加霜哦！",
            "了解自己，才是健康生活的开始！先天的体质很重要，了解自己的体质才能更好的后天补足。",
            "生活习惯不错，距离美丽达人差一步！良好的生活习惯跟营养饮食，下一个养生达人就是你哦！",
            "棒棒哒！你就是传说中的养生达人！养生，是一种生活追求，聪明的女人，会把生活过成一首诗。"]
    },
    shareOption: {
        title: '扎心了，想要养生不知道该从何入手？养生测试告诉你！',
        des: '你最需要的养生课就是它了，让你美过整个秋冬',
        imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/THS14MS3-X1MO-PJMI-1510656590391-O3XGNUTFRQH2.png@150w_1e_1c_2o'
    },
    testResult: function(data){
        var score = parseInt(data.score),
            recommend = Number(data.recommend),
            that = this,
            resultTitle,
            course;
        if(score<=70){
            resultTitle = that.data.title[0];
        }else if(70<score&&score<=80){
            resultTitle = that.data.title[1];            
        }else if(80<score&&score<=90){
            resultTitle = that.data.title[2];
        }else if(90<score&&score<=100){
            resultTitle = that.data.title[3];
        }
        course = that.data.course[data.recommend-1];
        $('#container').append(tpls.result({
            course: course,
            resultTitle: resultTitle
        }));
    },
    initShare: function() {

        var url = window.location.href;
        url = urlUtils.fillParams({
            ch: 'PYQ',
            isTest: 'N'
        }, url);

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
    }, 
    redirectUrl: function(e){
        var url =$(e.currentTarget).attr('data-url');
        var ch = urlUtils.getUrlParams("ch");
        if(ch){
            url = urlUtils.fillParams({ 
                ch: ch
            }, url);
        }
        setTimeout(function(){
            window.location.href = url;
        },200);
    }
}

module.exports = standard;