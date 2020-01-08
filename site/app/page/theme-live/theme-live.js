require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    urlutils = require('urlutils'),
    scrollload = require('scrollload'),
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
 * @require './theme-live.css'
 */
var themeLive = {
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

        // 直播间点击事件
        $('body').on('click', '.lives li', function(e) {
            if ($(e.target).hasClass('status-btn') ||
                $(e.target).hasClass('status') ||
                $(e.target).parent().hasClass('status') ||
                $(e.target).parent().hasClass('status-btn')) {
                return;
            }
            that.onLiveClick(e);
        });

        // 话题点击事件处理
        $('body').on('click', '.topics li', function (e) {
            that.onTopicClick(e);
        });

        // 直播间关注状态按钮点击事件
        $('body').on('click', '.lives li .status-btn', function(e) {
            that.onLiveStatusBtnClick(e);
        });
    },

    initPage: function() {
        var entityLength = this.initData.THEMEDATA.entityLength || 0,
            liveIds = this.initData.THEMEDATA.entityIds,
            page = this.initData.THEMEDATA.page.page,
            size = this.initData.THEMEDATA.page.size;

        this.nomoreLive = false;
        this.livepage = page + 1;
        this.liveSize = size;


        // 更新直播间最新两个话题列表
        this.loadLiveNewestTopics(liveIds);

        // 加载图片
        setTimeout(lazyimg.loadimg, 50);

        if (!entityLength || entityLength < size) {
            this.nomoreLive = true;
            scrollload.updateScrollStatus('hide');
        } else {
            scrollload.updateScrollStatus('loaded');
        }
    },

    /**
     * 直播间点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T09:51:34+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onLiveClick: function(e) {
        var $tar = $(e.currentTarget),
            id = $tar.attr('data-id'),
            type = $tar.attr('data-type'),
            oriUrl = $tar.attr('data-url'),
            url;

        switch (type) {
            case 'live':
                url = 'dl/live/homepage?liveId=' + id;
                break;
        }

        if (url) {
            setTimeout(function () {
                appSdk.linkTo(url, oriUrl);
            }, 100);
        }
    },

    /**
     * 直播间关注状态按钮点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T11:37:25+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onLiveStatusBtnClick: function(e) {
        var $tar = $(e.currentTarget),
            liveId = $tar.attr('data-id'),
            status = 'Y';

        if ($tar.find('.status').hasClass('followed')) {
            status = 'N';
        }

        this.doFocusLive(liveId, status);
    },

    onTopicClick: function(e) {
        var $tar = $(e.currentTarget),
            id = $tar.attr('data-id');
            oriUrl = $tar.attr('data-url');

        if (id) {
            this.fetchTypeAndRedirect(id, oriUrl);
        }
    },

    /**
     * 关注直播间
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T16:30:23+0800
     * @param    {[type]}                           liveId [description]
     * @return   {[type]}                                  [description]
     */
    doFocusLive: function(liveId, status) {
        var that = this,
            params = {
                liveId: liveId,
                status: status,
            };

        if (that.focusDoing) {
            return;
        }

        this.focusDoing = true;

        view.showLoading();

        (function(liveId, status) {
            model.fetch({
                url: conf.api.liveFocus,
                data: params,
                success: function(res) {
                    that.focusDoing = false;
                    view.hideLoading();
                    if (res && res.state && res.state.code === 0) {
                        // toast.toast('关注成功！');
                        view.liveFocused(liveId, status);
                    } else {
                        toast.toast(res.state.msg);
                    }
                },
                error: function() {
                    view.hideLoading();
                    that.focusDoing = false;
                    toast.toast('网络连接失败，请稍后重试');
                },
            });
        })(liveId, status);
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
     * 加载专题的直播间
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadLives: function(reset, finishFn, errorFn) {

        var that = this,
            params = {
                themeId: this.themeId,
                page: this.livepage,
                size: this.liveSize,
            };

        if (that.nomoreLive) {
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

                    if (!res.data || !res.data.themeLibs || !res.data.themeLibs.length) {
                        scrollload.updateScrollStatus('hide');
                        that.nomoreLive = true;
                    } else {
                        view.updateLives(reset, res.data.themeLibs);

                        // 更新直播间最新两个话题列表
                        var liveIds = res.data.themeLibs.map(function (item) {
                            return item.liveId;
                        });

                        that.loadLiveNewestTopics(liveIds);

                        // 加载图片
                        setTimeout(lazyimg.loadimg, 50);

                        if (res.data.themeLibs.length < that.liveSize) {
                            scrollload.updateScrollStatus('hide');
                            that.nomoreLive = true;
                        }
                    }

                    that.livepage += 1;

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
     * 加载直播间最新的两个话题列表
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-12-27T10:46:39+0800
     * @param    {[type]}                           liveIds [description]
     * @return   {[type]}                                   [description]
     */
    loadLiveNewestTopics: function (liveIds) {
        if (!liveIds || !liveIds.length) {
            return;
        }

        var that = this,
            params = {
                liveIds: liveIds.join(','),
            };

        model.fetch({
            url: conf.api.themeListNewestTopic,
            data: params,
            success: function(res) {
                if (res && res.state && res.state.code === 0) {
                    view.updateTopics(res.data);

                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);
                }
            },
            error: function(err) {
                console.error('加载直播最新话题出错：', err);
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
            that.loadLives(false, finishFn, errorFn);
        }, {
            marginBottom: 1000,
        });
    },
};


module.exports = themeLive;
