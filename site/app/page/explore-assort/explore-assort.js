require('zepto');
// zeptofix
require('tapon');

// var Promise = require('promise');
var fastClick = require('fastclick');
// var lazyimg = require('lazyimg');
var appSdk = require('appsdk');
// var lazyimg = require('lazyimg');
var model = require('model');

var view = require('./view');
var conf = require('../conf');
var toast = require('toast');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require '../../comp/explore-css/explore-common.css'
 * @require '../../comp/explore-css/explore-topics.css'
 * @require '../../comp/explore-css/explore-channels.css'
 * @require '../../comp/explore-css/explore-lives.css'
 * @require './explore-assort.css'
 */

var assort = {
    init: function (data) {
        var urls = window.location.pathname;
        var pathArr = urls.split('/');
        this.tagId = pathArr[pathArr.length - 1];
        // 页面初始化
        this.render();
        // 事件初始化
        this.initListeners();
    },

    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // banner点击事件
        $('body').on('click', '#carousel li', function (e) {
            that.onCarouselClick(e);
        });

        // topic点击事件
        $('body').on('click', '#topics li', function (e) {
            that.onTopicClick(e);
        });

        // live点击事件
        $('body').on('click', '#lives li', function (e) {
            that.onLiveClick(e);
        });

        // channel点击事件
        $('body').on('click', '#channels li', function (e) {
            that.onChannelClick(e);
        });

        // “更多”按钮点击事件
        $('body').on('click', '#live-more', function (e) {
            that.onLiveMoreClick(e);
        });

        // 关注按钮点击事件
        $('body').on('click', '.live-focus', function (e) {
            that.onLiveFocusClick(e);
        });
    },

    render: function () {

        // banners
        this.initBanners();

        // 加载第一屏图片
        // setTimeout(lazyimg.loadimg, 50);
    },

    initBanners: function () {

        view.updateBannerStatus();

        setTimeout(function () {
            view.enableBannerSlide();
        }, 0);
    },

    onCarouselClick: function (e) {
        var $tar = $(e.currentTarget);
        var link = $tar.attr('data-link');
        var type = $tar.attr('data-type');
        var mainId = $tar.attr('data-mainid');
        var oriUrl = $tar.attr('data-url');

        if (type === 'topic') {
            this.fetchTypeAndRedirect(mainId, oriUrl);
        } else {
            window.location.href = link;
        }
    },

    onTopicClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var oriUrl = $tar.attr('data-url');
        this.fetchTypeAndRedirect(id, oriUrl);
    },

    onLiveClick: function (e) {
        var $tar = $(e.currentTarget);
        if ($(e.target).hasClass('live-focus')) {
            return;
        }
        var id = $tar.attr('data-id');
        var oriUrl = $tar.attr('data-url');
        appSdk.linkTo('dl/live/homepage?liveId=' + id, oriUrl);
    },

    onChannelClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var oriUrl = $tar.attr('data-url');
        appSdk.linkTo('dl/live/channel/homepage?channelId=' + id, oriUrl);
    },

    onLiveMoreClick: function (e) {
        // todo:complete
        appSdk.goWebPage('/app/page/explore/live/' + this.tagId);
    },

    /* 关注直播间按钮点击事件*/
    focus_sending: false,
    onLiveFocusClick: function (e) {
        e.stopPropagation();
        var that = this;
        var $btn = $(e.currentTarget);
        var params = {
            status: $btn.hasClass('on') ? 'N' : 'Y',
            liveId: $btn.parents('li.live').attr('data-id'),
        };

        if (!that.focus_sending) {
            that.focus_sending = true;
            model.fetch({
                type: 'GET',
                url: conf.api.liveFocus,
                data: params,
                success: function (res) {
                    if (res.state.code === 0) {
                        view.updateFocusBtn($btn);
                    } else {
                        toast.toast(result.state.msg);
                    }
                    that.focus_sending = false;
                },
                error: function (err) {
                    that.focus_sending = false;
                },
            })
        }
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

module.exports = assort;
