require('zepto');
// zeptofix
require('tapon');

var fastClick = require('fastclick');
var model = require('model');
var loading = require('loading');
var appSdk = require('appsdk');
var scrollload = require('scrollload');

var conf = require('../conf');
var view = require('./view');

/**
 * @require '../../components_modules/reset.css'
 * @require './search-topic.css'
 */

var search = {
    /* 初始化*/
    init: function () {
        this.initListeners();

        if (!window.TOPICEND) {
            /* 初始化部分数据*/
            this.initStore();
            /* 开启滚动加载*/
            this.enableScrollLoad();
        }


    },

    /* 初始化事件绑定*/
    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        $('body').on('click', '.topic', function (e) {
            that.onTopicClick(e);
        })
    },

    initStore: function (data) {
        this.page = {
            size: 20,
            page: 1,
        };
    },

    enableScrollLoad: function () {
        var that = this;

        new scrollload.UpScrollLoad('#container', function (loadingCtx, finishFn, errorFn) {
            that.loadTopicList(finishFn, errorFn);
        }, {
                marginBottom: 1000,
            });
    },

    nomoreData: false,
    loadTopicList: function (finishFn, errorFn) {
        if (this.nomoreData) return;

        scrollload.updateScrollStatus('loading');
        model.fetch({
            url: conf.api.searchTopic,
            data: {
                clientType: 'app',
                page: this.page.page + 1,
                size: this.page.size,
                keyword: window.KEYWORD,
                minimumShouldMatch: window.minimumShouldMatch,
            },
            success: function (result) {
                scrollload.updateScrollStatus('loaded');
                if (result.state.code === 0) {
                    view.updateList(result.data.topics);

                    if (result.data.topicEnd) {
                        this.nomoreData = true;
                        scrollload.updateScrollStatus('hide');
                    }
                    this.page.page++;
                } else {
                    console.log('话题列表加载出错');
                }
                if (finishFn) {
                    finishFn();
                }
            }.bind(this),
        })
    },


    onTopicClick: function (e) {
        var id = $(e.currentTarget).attr('data-id');
        var oriUrl = $(e.currentTarget).attr('data-url');
        var lshareKey = $(e.currentTarget).attr('data-lsharekey');

        this.fetchTypeAndRedirect(id, lshareKey);
    },

    fetchTypeAndRedirect: function (topicId, lshareKey) {
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
                            appSdk.linkTo('dl/live/topic/introduce?topicId=' + res.data.content + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
                            break;
                        case 'channel':
                            appSdk.linkTo('dl/live/channel/homepage?channelId=' + res.data.content + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
                            break;
                        case 'topic':
                            appSdk.linkTo('dl/live/topic?topicId=' + res.data.content + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
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

}

module.exports = search;
