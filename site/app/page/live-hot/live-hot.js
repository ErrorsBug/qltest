require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    scrollload = require('scrollload'),
    lazyimg = require('lazyimg'),
    toast = require('toast'),
    model = require('model'),
    appSdk = require('appsdk'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/default-img/default-img.css'
 * @require './live-hot.css'
 */
var liveHot = {
    init: function(initData) {
        this.initData = initData;

        this.livesPage = this.initData.LIVESDATA && this.initData.LIVESDATA.page && this.initData.LIVESDATA.page.page + 1 || 1;
        this.livesSize = this.initData.LIVESDATA && this.initData.LIVESDATA.page && this.initData.LIVESDATA.page.size || 1;

        // 加载图片
        setTimeout(lazyimg.loadimg, 50);

        // 事件初始化
        this.initListeners();

        // 并初始化轮播
        // view.enableBannerSlide();

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

        // banner点击事件
        // $('body').on('click', '#banner-list li', function(e) {
        //     that.onBannerClick(e);
        // });

        // 直播间点击事件
        $('body').on('click', '.lives-list li', function(e) {
            // Todo zepto中e.stopPropagation()失效，临时处理
            if ($(e.target).hasClass('status-btn') ||
                $(e.target).hasClass('status') ||
                $(e.target).parent().hasClass('status') ||
                $(e.target).parent().hasClass('status-btn')) {
                return;
            }
            that.onLiveClick(e);
        });

        // 直播间关注状态按钮点击事件
        $('body').on('click', '.lives-list li .status-btn', function(e) {
            that.onLiveStatusBtnClick(e);
        });
    },

    /**
     * banner点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T11:28:23+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    // onBannerClick: function(e) {
    //     var $tar = $(e.currentTarget),
    //         linkUrl = $tar.attr('data-link-url');

    //     window.location.href = linkUrl;
    // },

    /**
     * 直播间点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T11:34:14+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onLiveClick: function(e) {
        var $tar = $(e.currentTarget),
            liveId = $tar.attr('data-id'),
            oriUrl = $tar.attr('data-url');

        appSdk.linkTo('dl/live/homepage?liveId=' + liveId, oriUrl);
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
            flag = 'Y';

        if ($tar.find('.status').hasClass('followed')) {
            flag = 'N';
        }

        this.doFocusLive(liveId, flag);
    },

    /**
     * 加载直播间
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadLives: function(reset, finishFn, errorFn) {

        var that = this,
            params = {
                page: this.livesPage,
                size: this.livesSize,
            };

        if (that.nomoreLives) {
            if (finishFn) {
                finishFn();
            }

            return;
        }

        scrollload.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.listHotLive,
            data: params,
            success: function(res) {
                scrollload.updateScrollStatus('loaded');
                if (res && res.state && res.state.code === 0) {

                    if (!res.data || !res.data.resultList || !res.data.resultList.length) {
                        scrollload.updateScrollStatus('hide');
                        that.nomoreLives = true;
                    } else {
                        view.updateLives(reset, res.data.resultList);

                        // 加载图片
                        setTimeout(lazyimg.loadimg, 50);
                    }

                    that.livesPage += 1;

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
     * 关注直播间
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T16:30:23+0800
     * @param    {[type]}                           liveId [description]
     * @return   {[type]}                                  [description]
     */
    doFocusLive: function(liveId, flag) {
        var that = this,
            params = {
                liveId: liveId,
                flag: flag,
            };

        if (that.focusDoing) {
            return;
        }

        this.focusDoing = true;

        view.showLoading();

        (function(liveId, flag) {
            model.fetch({
                url: conf.api.liveFocus,
                data: params,
                success: function(res) {
                    that.focusDoing = false;
                    view.hideLoading();
                    if (res && res.state && res.state.code === 0) {
                        // toast.toast('关注成功！');
                        view.liveFocused(liveId, flag);
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
        })(liveId, flag);
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

        scrollload.updateScrollStatus('loaded');
    },
};


module.exports = liveHot;
