require('zepto');
// require('zeptofix');
require('tapon');
var fastClick = require('fastclick');
var model = require('model');
var Promise = require('promise');
var Scrollload = require('scrollload_v3');
var toast = require('toast');
var wxutil = require('wxutil_2');
var urlutils = require('urlutils');

var Handlebars = require('handlebars');
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
 * @require './comment.scss'
 */
var courses = {
    init: function (initData) {
        /* 先bind this，然后initListener，否则bind可能失效 */
        this.onComment = this.onComment.bind(this)
        this.onInputKeyup = this.onInputKeyup.bind(this)

        this.initListener();
        /* 初始化数据*/
        this.initStore(initData);
        /* 开启滚动加载*/
        this.enableScrollLoad();

        this.fetchComment();
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

        /* 放一些常量和不会变的配置 */
        this.constant = {
            contentLength: 300,
        };
        this.userMessage = initData.userMessage;
    },
    initListener: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { })
        // 点击评论按钮发表评论
        $('body').on('click', '#comment', this.onComment)
        // 评论框输入事件
        $('body').on('keyup', '#comment-input', this.onInputKeyup)
        // 评论框获取焦点事件
        $('body').on('focus', '#comment-input', this.onInputFocus)
        //点赞
        $('body').on('click','.agree',function(e){that.agree(e);})
        
    },

    enableScrollLoad: function () {
        var that = this;
        this.scroller = new Scrollload({
            $el: $('#comment-list'),
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
                    that.updateComments(res.commentList);
                    that.page.page++;
                    if (res.commentList.length < that.page.size) {
                        console.log('loaded true');
                        loaded(true);
                    } else {
                        console.log('loaded');
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

    updateComments: function (comments, before) {
        var $container = $('#list-container')
        if (before) {
            this.state.commentList = comments.concat(this.state.commentList);
            $container.html('').append(tpls.comment({
                commentList:this.state.commentList,
            }))

        } else {
            this.state.commentList = this.state.commentList.concat(comments)
            $('#list-container').append(tpls.comment({
                commentList: comments,
            }))
        }
    },

    /**
     * 用户输入时判断，如果输入回车自动触发发表评论
     */
    onInputKeyup: function (e) {
        if (e.keyCode === 13) {
            this.onComment()
        }
        return false
    },

    onInputFocus:function(e){
        var $input = $(this)[0]
        setTimeout(function(){
            $input.scrollIntoView(true)
        }, 300)
    },

    /** 
     * 用户出发发表评论操作事件方法
     * 1. 点击评论按钮
     * 2. 输入中按下回车键
     */
    onComment: function () {
        var that = this
        var $input = $('#comment-input')
        var content = $.trim($input.val());
        if (!content.length) { return false;}//未输入或输入的全为空格
        if (content.length > this.constant.contentLength) {
            toast.toast('评论长度不能超过' + this.constant.contentLength + '字',1.5)
            return false
        }
        var postComment = {
            url: '/api/wechat/activity/winterHealth/postComment',
            type: 'POST',
            data: {
                content: content,
                userName: that.userMessage.name,
                headImgUrl: that.userMessage.headImgUrl
            },
            loading: true,
            success: function (res) {
                if (res.state.code === 0) {
                    toast.toast('评论发布成功',1)
                    $input.val('')
                    that.updateComments([res.comment], true)
                } else {
                    toast.toast(res.state.msg,1.5)
                }
            },
            error: function (err) {
                console.error(err)
                toast.toast('发布失败',1)
            },
        }
        model.fetch(postComment)
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
};
module.exports = courses;
