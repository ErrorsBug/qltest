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
 * @require '../../comp/explore-css/explore-topics.css'
 */

var rank = {
    init: function (data) {
        /* 初始化部分数据*/
        this.initStore(data);
        // 事件初始化
        this.initListeners();

        /* 开启滚动加载*/
        this.enableScrollLoad();
    },

    initStore: function (data) {
        this.tagId = '0';
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
        $('body').on('click', '#topics li', function (e) {
            that.onTopicClick(e);
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
        model.post(conf.api.getRankTopicList,
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

                    view.updateTopics(result.data);

                    if (result.data.length < this.topicPagination.pageSize) {
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

    onTopicClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var oriUrl = $tar.attr('data-url');
        this.fetchTypeAndRedirect(id, oriUrl);
    },

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

module.exports = rank;
