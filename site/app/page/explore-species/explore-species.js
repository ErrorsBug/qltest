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
 * 引入css
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require '../../comp/explore-css/explore-common.css'
 * @require '../../comp/explore-css/explore-topics.css'
 */

var species = {
    init: function (data) {
        /* 初始化部分数据*/
        this.initStore(data);
        // 事件初始化
        this.initListeners();

        /* 开启滚动加载*/
        this.enableScrollLoad();
    },

    /* 初始化数据存储*/
    initStore: function (data) {
        var urls = window.location.pathname.split('/');

        this.tagId = urls[urls.length - 1];
        this.topicPagination = {
            pageSize: 21,
            pageNum: 1,
        };
        if (data instanceof Array) this.topicList = data;
    },

    /* 初始化事件*/
    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // topic点击事件
        $('body').on('click', '#topics li', function (e) {
            that.onTopicClick(e);
        });
    },

    /* 初始化滚动加载*/
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

        /* 获取列表数据*/
        model.post(conf.api.getExploreSpeciesList,
            {
                tagId: this.tagId,
                clientType: 'app',
                pageSize: this.topicPagination.pageSize,
                pageNum: this.topicPagination.pageNum + 1,
            }, function (res) {
                scrollload.updateScrollStatus('loaded');
                if (res.state.code === 0) {
                    /* 增加列表数据*/
                    this.topicList = this.topicList.concat(res.data);
                    view.updateTopics(res.data);

                    // 返回的话题数量小于请求数量，则请求完毕
                    if (this.topicPagination.pageSize !== 1 && res.data.length < this.topicPagination.pageSize) {
                        this.nomoreData = true;
                        scrollload.updateScrollStatus('hide');
                    }
                    this.topicPagination.pageNum++;
                } else {
                    console.error('话题列表加载出错');
                }
                if (finishFn) {
                    finishFn();
                }
            }.bind(this));
    },

    /* 点击话题事件*/
    onTopicClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var oriurl=$tar.attr('data-url');
        this.fetchTypeAndRedirect(id, oriurl);
    },

    /* 获取类型并跳转*/
    fetchTypeAndRedirect: function (topicId, oriUrl) {
        var that = this;
        var params = {
            topicId: topicId,
        };

        if (that.fetchTypeRedirectLocked) {
            return;
        }

        this.fetchTypeRedirectLocked = true;

        view.showLoading();

        model.fetch({
            url: conf.api.liveRedirect,
            data: params,
            success: function (res) {
                view.hideLoading();
                that.fetchTypeRedirectLocked = false;
                if (res && res.state && res.state.code === 0) {
                    switch (res.data.type) {
                        case 'introduce':
                            appSdk.linkTo('dl/live/topic/introduce?topicId=' + res.data.content, oriUrl);
                            break;
                        case 'channel':
                            appSdk.linkTo('dl/live/channel/homepage?channelId=' + res.data.content, oriUrl);
                            break;
                        case 'topic':
                            appSdk.linkTo('dl/live/topic?topicId=' + res.data.content, oriUrl);
                            break;
                    }
                }
            },
            error: function () {
                that.fetchTypeRedirectLocked = false;
                view.hideLoading();
            },
        });
    },

};

module.exports = species;
