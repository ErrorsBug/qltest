require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../../conf');
var wxutil = require('wxutil');
var appSdk = require('appsdk');
var model = require('model');
var envi = require('envi');
var Scrollload = require('scrollload_v3');
var Promise = require('promise');
require('hbarimgformat');
require('hbardateformat');
require('hbarcompare');
require('../helper');
var tpls = {
    comment: __inline('./tpls/comment.handlebars'),
};

/**
 * @require '../../../components_modules/reset.css'
 * @require '../../../comp/common-css/ql-common.css'
 * @require './index.scss'
 */

var standard = {
    init: function (initData) {
        this.initCompatibility('#container')
        this.initShare();
        this.initStore(initData);
        this.appShare();
        this.enableCommentsScrollLoad();
        this.fetchComment();
        this.initListeners();
        if(initData.isTest==='Y'){
            this.isTest();
        }
    },
    initStore: function(initData){
        /* 存放页面中的状态和数据 */
        this.state = {
            // 评论列表
            commentList: []
        };
        this.page = {
            size: 10,
            page: 1,
        };
        this.remark;
        this.score;
    },
    initListeners: function () {
        var that = this;
        //跳转到测试题界面
        $('body').on('click', '.test-btn[data-test="N"]', function () {
            var ch = urlUtils.getUrlParams("ch");
            var url = '/wechat/page/activity/winter-health/cover';
            if(ch){
                url = urlUtils.fillParams({ 
                    ch: ch
                }, url);
            }
            setTimeout(function(){
                window.location.href = url;
            },200);
        });
        //跳转到评论界面
        $('body').on('click', '#message', function () {
            setTimeout(function(){
                var ch = urlUtils.getUrlParams("ch");
                var url = '/wechat/page/activity/winter-health/comment';
                if(ch){
                    url = urlUtils.fillParams({ 
                        ch: ch
                    }, url);
                }
                window.location.href = '/wechat/page/activity/winter-health/comment';
            },200);
        });
        //已测试过，点击测试按钮
        $('body').on('click', '.test-btn[data-test="Y"]', function (e) {
            var ch = urlUtils.getUrlParams("ch");
            var url = '/wechat/page/activity/winter-health/result?score='+that.score+'&remark='+that.remark+'&isTest=Y';
            if(ch){
                url = urlUtils.fillParams({ 
                    ch: ch
                }, url);
            }
            setTimeout(function(){
                window.location.href = url;
            },200);
        });
        //点赞
        $('body').on('click','.agree',function(e){that.agree(e);});
        //购买
        $('body').on('click','.course-container>li',function(e){that.redirectUrl(e)});
    },


    shareOption: {
        title: '我参与了千聊秋冬养生课程，一起学习，陪你看见更美的自己！',
        des: '点击领取优惠，还有养生小测试哦！',
        imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/O6NWTU1T-KVTE-UCW2-1510659381878-B3DW5IX91J55.png@150w_1e_1c_2o'
    },
    initShare: function() {

        var url = window.location.href,
        url = urlUtils.fillParams({
            ch: 'PYQ',
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
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//
    },
    appShare: function() {
        var ver = envi.getQlchatVersion();
        if (ver && ver >= 360) {
            window.qlchat.onMenuShareWeChatTimeline({
                type: "link", // "link" "image"
                content: this.shareOption.imgUrl, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                title: this.shareOption.title,
                desc: this.shareOption.des,
                thumbImage: this.shareOption.imgUrl // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
            });
            window.qlchat.onMenuShareWeChatFriends({
                type: "link", // "link" "image"
                content: this.shareOption.imgUrl, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                title: this.shareOption.title,
                desc: this.shareOption.des,
                thumbImage: this.shareOption.imgUrl // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
            });
        }

    },
    enableCommentsScrollLoad: function () {
        var that = this;
        this.scroller = new Scrollload({
            $el: $('#comment'),
            toBottomHeight: 1000,
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.fetchComment(resolve);
                });
            },
        });
    },
    fetchComment: function (loaded) {
        if (!loaded) {
            loaded = function () { };
        }
        var that = this;
        var params = {
            page: {
                size: that.page.size,
                page: that.page.page,
            }
        };
        var getComment = {
            url: '/api/wechat/activity/winterHealth/getCommentList',
            type: 'POST',
            data: params,
            loading: true,
            success: function (res) {
                if (res.commentList) {
                    $('#comment').append(tpls.comment({
                        commentList: res.commentList
                    }));
                    that.page.page++;
                    if (res.commentList.length < that.page.size) {
                        loaded(true);
                    } else {
                        loaded();
                    }
                }
            },
            error: function (err) {
                console.error(err)
            },
        };
        model.fetch(getComment);
    },
    agree: function(e){
        var $tar = $(e.currentTarget),
            assignmentId = $tar.parents('li').attr('data-id');
        //避免点赞多次
        if ($tar.hasClass('like')){
            e.preventDefault();
        } else {
            $tar.addClass('like');
            var data = {
                assignmentId: assignmentId
            };
            model.fetch({
                type: 'POST',
                url: '/api/wechat/activity/winterHealth/agree',
                data: data,
                success: function(res){
                    if (res.state.code === 0) {
                        var $count = $tar.find('.count');
                        count = Number($count.text());
                        $count.text(count+1);
                    }
                },
                error: function(err){
                    console.error(err);
                    toast.toast("点赞失败",500,'middle');
                }
            })
        }
    },
    isTest: function(){
        var that = this;
        model.fetch({
            type: 'POST',
            url: '/api/wechat/activity/winterHealth/isTest',
            data: {},
            success: function(result){
                if(result.state.code === 0){
                    that.remark = result.data.remark;
                    that.score = result.data.score;
                }
            },
            error: function(err){
                console.error(err);
            }
        })
    },
    redirectUrl: function(e){
        var url = $(e.currentTarget).attr('data-url');

        var ch = urlUtils.getUrlParams("ch")
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