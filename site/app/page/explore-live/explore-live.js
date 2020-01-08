require('zepto');
// zeptofix
require('tapon');

var fastClick = require('fastclick');
var appSdk = require('appsdk');
var model = require('model');
var urlutils = require('urlutils');
var scrollload = require('scrollload');
var Promise = require('promise');

var view = require('./view');
var conf = require('../conf');
// var toast = require('toast');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require '../../comp/explore-css/explore-common.css'
 * @require '../../comp/explore-css/explore-lives.css'
 */

var live = {
    init: function (data) {
        /* 初始化部分数据*/
        this.initStore(data);
        // 事件初始化
        this.initListeners();

        /* 开启滚动加载*/
        this.enableScrollLoad();
    },

    initStore: function (data) {
        var urls = window.location.pathname;
        var pathArr = urls.split('/');
        this.tagId = pathArr[pathArr.length - 1];
        this.topicPagination = {
            pageSize: 21,
            pageNum: 1,
        };
        if (data instanceof Array) this.topicList = data;
    },

    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // topic点击事件
        $('body').on('click', '#lives li', function (e) {
            that.onLiveClick(e);
        });

        // 关注按钮点击事件
        $('body').on('click', '#live-focus', function (e) {
            that.onLiveFocusClick(e);
        });
    },

    enableScrollLoad: function () {
        var that = this;

        new scrollload.UpScrollLoad('#container', function (loadingCtx, finishFn, errorFn) {
            that.loadTopicList(finishFn, errorFn);
        }, {
                marginBottom: 1000,
        });

        // this.scroller = new Scrollload({
        //     $el: $('#container'),
        //     toBottomHeight: 1200,
        //     el_noMore: '.no-more',
        //     el_loading: '.loading-next',
        //     loadFun: function () {
        //         return new Promise(function (resolve, reject) {
        //             that.loadTopicList(resolve);
        //         });
        //     },
        // });
    },

    nomoreData: false,
    loadTopicList: function (finishFn, errorFn) {
        if (this.nomoreData) return;

        scrollload.updateScrollStatus('loading');
        model.post(conf.api.getExploreLiveList,
            {
                tagId: this.tagId,
                clientType: 'app',
                pageSize: this.topicPagination.pageSize,
                pageNum: this.topicPagination.pageNum + 1,
            }, function (result) {
                scrollload.updateScrollStatus('loaded');
                if (result.state.code === 0) {
                    console.log(result.data.length);
                    this.topicList = this.topicList.concat(result.data);

                    if (this.topicPagination.pageSize === 1) {
                        view.updateLives(result.data);
                    } else {
                        view.updateLives(result.data);
                    }

                    if (this.topicPagination.pageSize !== 1 && result.data.length < this.topicPagination.pageSize) {
                        this.nomoreData = true;
                        scrollload.updateScrollStatus('hide');
                    }
                    this.topicPagination.pageNum++;
                } else {
                    console.log('话题列表加载出错');
                }
                if (finishFn) {
                    finishFn();
                }
            }.bind(this));
    },

    onLiveClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var oriUrl = $tar.attr('data-url');
        appSdk.linkTo('dl/live/homepage?liveId=' + id, oriUrl);
    },

    /* 关注直播间按钮点击事件*/
    focus_sending: false,
    onLiveFocusClick: function (e) {
        e.stopPropagation();
        var that = this;
        var $btn = $(this);
        var params = {
            status: $btn.hasClass('on') ? 'N' : 'Y',
            liveId: $btn.parents('li.live').attr('data-id'),
        };
        if (!that.focus_sending) {
            that.focus_sending = true;
            model.post(
                conf.api.liveFocus,
                params,
                function (result) {
                    if (result.state.code === 0) {
                        view.updateFocusBtn($btn);
                    } else {
                        toast.toast(result.state.msg);
                    }
                    that.focus_sending = false;
                }, function (err) {
                    that.focus_sending = false;
                });
        }
    },
};

module.exports = live;
