require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    urlutils = require('urlutils'),
    scrollload = require('scrollload'),
    model = require('model'),
    toast = require('toast'),
    appSdk = require('appsdk'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/default-img/default-img.css'
 * @require './theme-topic.css'
 */
var themeTopic = {
    init: function(initData) {

        this.themeId = urlutils.getUrlParams('id');

        this.initData = initData;

        this.initPage();

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

        // 报名按钮点击事件
        $('body').on('click', '.topic-list li', function(e) {
            that.onTopicClick(e);
        });
    },

    initPage: function() {
        var entityLength = this.initData.THEMEDATA.entityLength || 0,
            page = this.initData.THEMEDATA.page.page,
            size = this.initData.THEMEDATA.page.size;

        this.nomoreTopic = false;
        this.topicPage = page + 1;
        this.topicSize = size;

        // 加载图片
        setTimeout(lazyimg.loadimg, 50);

        if (!entityLength || entityLength < size) {
            this.nomoreTopic = true;
            scrollload.updateScrollStatus('hide');
        } else {
            scrollload.updateScrollStatus('loaded');
        }
    },

    /**
     * 话题点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T09:51:34+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onTopicClick: function(e) {
        var $tar = $(e.currentTarget),
            id = $tar.attr('data-id'),
            type = $tar.attr('data-type'),
            oriUrl = $tar.attr('data-url');

        switch (type) {
            case 'topic':
                this.fetchTypeAndRedirect(id, oriUrl);
                return;
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

    /**
     * 加载专题的话题
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadTopics: function(reset, finishFn, errorFn) {

        var that = this,
            params = {
                themeId: this.themeId,
                page: this.topicPage,
                size: this.topicSize,
            };

        if (that.nomoreTopic) {
            if (finishFn) {
                finishFn();
            }

            return;
        }

        scrollload.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.themeListHotEntity,
            data: params,
            success: function(res) {
                scrollload.updateScrollStatus('loaded');
                if (res && res.state && res.state.code === 0) {

                    if (!res.data || !res.data.themeLibs || !res.data.themeLibs.length ||
                        res.data.themeLibs.length < that.topicSize) {
                        scrollload.updateScrollStatus('hide');
                        that.nomoreTopic = true;
                    }
                    view.updateTopics(reset, res.data && res.data.themeLibs);

                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);


                    that.topicPage += 1;

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
            that.loadTopics(false, finishFn, errorFn);
        }, {
            marginBottom: 1000,
        });
    },
};


module.exports = themeTopic;
