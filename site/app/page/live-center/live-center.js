require('zepto');
// require('zeptofix');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    scrollload = require('scrollload'),
    urlutils = require('urlutils'),
    appSdk = require('appsdk'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require './live-center.css'
 */
var liveCenter = {
    init: function(initData) {

        this.tagId = urlutils.getUrlParams('tagId');

        this.initData = initData;

        // 页面初始化
        this.render();

        // 事件初始化
        this.initListeners();

        // 下拉加载更多功能开启
        this.enableScrollLoad();
    },

    /**
     * 事件定义
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:44:01+0800
     * @return   {[type]}                           [description]
     */
    initListeners: function() {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function() {});

        // 正在直播加载更多按钮点击事件
        $('body').on('click', '#topic-list .load-more', function(e) {
            that.onTopicLoadMoreBtnClick(e);
        });

        // 置顶按钮点击事件
        $('body').on('click', '.btn-to-top', function(e) {
            view.scrollToTop();
        });

        // 初始化滚屏事件
        $(window).on('scroll', function(e) {
            view.autoShowBtnToTop();
            view.autoFixedHeadMenu();
        });

        // banner点击事件
        $('body').on('click', '#banner-list li', function(e) {
            that.onBannerClick(e);
        });

        // 话题点击事件
        $('body').on('click', '.topic-list li', function(e) {
            that.onTopicClick(e);
        });
    },

    /**
     * 根据初始数据初始化渲染页面
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:43:34+0800
     * @return   {[type]}                           [description]
     */
    render: function() {
        // banners
        this.initBanners();

        // 话题列表
        this.initTopicList();

        // 历史话题列表
        this.renderHistTopicList();

        // 加载第一屏图片
        setTimeout(lazyimg.loadimg, 50);
    },

    /**
     * 显示banner并初始化轮播
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:41:56+0800
     * @return   {[type]}                           [description]
     */
    initBanners: function() {
        view.updateBannerStatus();

        setTimeout(function() {
            view.enableBannerSlide();
        }, 0);
    },

    /**
     * 初始化渲染话题列表
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:41:45+0800
     * @return   {[type]}                           [description]
     */
    initTopicList: function() {
        var topicLength = this.initData.TOPICSDATA.topicLength || 0,
            page = this.initData.TOPICSDATA.page;

        this.nomoreTopics = false;
        this.topicPage = 1;
        this.topicSize = page.size;

        if (topicLength) {
            view.updateTopicLoadBtnStatus('loaded');
            if (topicLength >= page.size) {
                this.topicPage += 1;
            } else {
                this.nomoreTopics = true;
                view.updateTopicLoadBtnStatus('hide');
            }
        } else {
            this.nomoreTopics = true;
            view.updateTopicLoadBtnStatus('hide');
            view.hideTopicHead();
        }
    },

    /**
     * 初始化渲染历史话题列表
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:41:27+0800
     * @return   {[type]}                           [description]
     */
    renderHistTopicList: function() {
        var topics = this.initData.HISTTOPICSDATA.topics || [],
            page = this.initData.HISTTOPICSDATA.page;

        this.nomoreHistTopics = false;
        this.histTopicPage = 1;
        this.histTopicSize = page.size;

        if (topics && topics.length) {
            view.updateHistoryTopics(true, topics);

            if (topics.length >= page.size) {
                this.histTopicPage += 1;
                scrollload.updateScrollStatus('loaded');
            } else {
                this.nomoreHistTopics = true;
                view.showNomoreHistTopicTip();
                scrollload.updateScrollStatus('hide');
            }
        } else {
            this.nomoreHistTopics = true;
            view.showNomoreHistTopicTip();

            scrollload.updateScrollStatus('hide');
        }
    },

    /**
     * 话题列表加载更多按钮点击处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:41:05+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onTopicLoadMoreBtnClick: function(e) {
        this.loadTopics();
    },

    /**
     * banner点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T11:28:23+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onBannerClick: function(e) {
        var $tar = $(e.currentTarget),
            linkUrl = $tar.attr('data-link-url'),
            type = $tar.attr('data-type'),
            mainId = $tar.attr('data-mainId'),
            oriUrl=$tar.attr('data-url');

        if (type === 'topic') {
            this.fetchTypeAndRedirect(mainId, oriUrl);
        } else {
            window.location.href = linkUrl;
        }
    },

    /**
     * 话题点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T11:17:11+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onTopicClick: function(e) {
        var $tar = $(e.currentTarget),
            topicId = $tar.attr('data-id'),
            oriUrl = $tar.attr('data-url');


        this.fetchTypeAndRedirect(topicId, oriUrl);
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


    /**
     * 加载话题列表
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:20:27+0800
     * @param    {[type]}                           reset [description]
     * @return   {[type]}                                 [description]
     */
    loadTopics: function(reset) {
        var that = this,
            params = {
                tagId: this.tagId,
            };

        if (that.nomoreTopics || this.topicLoading) {
            return;
        }

        this.topicLoading = true;

        view.updateTopicLoadBtnStatus('loading');

        params.size = this.topicSize;
        params.page = this.topicPage;

        model.fetch({
            url: conf.api.listNewsTopicsByTagId,
            data: params,
            success: function(res) {
                view.updateTopicLoadBtnStatus('loaded');
                that.topicLoading = false;
                if (res && res.state && res.state.code === 0) {

                    view.updateTopics(reset, res.data.topics);

                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    if (!res.data.topics || !res.data.topics.length) {
                        that.nomoreTopics = true;
                        view.updateTopicLoadBtnStatus('hide');
                    }

                    that.topicPage += 1;
                }
            },
            error: function() {
                that.topicLoading = false;
                view.updateTopicLoadBtnStatus('loaded');

            },
        });
    },

    /**
     * 加载历史话题列表
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadHistTopics: function(reset, finishFn, errorFn) {

        var that = this,
            params = {
                tagId: this.tagId,
            };

        if (that.nomoreHistTopics) {
            if (finishFn) {
                finishFn();
            }

            return;
        }

        params['size'] = this.histTopicSize;
        params.page = this.histTopicPage;


        scrollload.updateScrollStatus('loading');
        model.fetch({
            url: conf.api.listHistTopicByTagId,
            data: params,
            success: function(res) {
                scrollload.updateScrollStatus('loaded');
                if (res && res.state && res.state.code === 0) {

                    view.updateHistoryTopics(reset, res.data.topics);

                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    if (!res.data.topics || !res.data.topics.length) {
                        that.nomoreHistTopics = true;
                        scrollload.updateScrollStatus('hide');
                        view.showNomoreHistTopicTip();
                    }

                    that.histTopicPage += 1;

                    if (finishFn) {
                        finishFn();
                    }
                } else {
                    if (errorFn) {
                        errorFn();
                    }
                }
            },
            error: function() {
                scrollload.updateScrollStatus('loaded');
                if (errorFn) {
                    errorFn();
                }
            },
        });
    },

    /**
     * 下拉加载更多
     * @return {[type]} [description]
     */
    enableScrollLoad: function() {
        var that = this;

        new scrollload.UpScrollLoad('#container', function(loadingCtx, finishFn, errorFn) {
            that.loadHistTopics(false, finishFn, errorFn);
        }, {
            marginBottom: 1000,
        });
    },
};


module.exports = liveCenter;
