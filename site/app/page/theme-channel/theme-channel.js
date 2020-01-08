require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    urlutils = require('urlutils'),
    scrollload = require('scrollload'),
    // toast = require('toast'),
    appSdk = require('appsdk'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/default-img/default-img.css'
 * @require './theme-channel.css'
 */
var themeChannel = {
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
        $('body').on('click', '.channels li', function(e) {
            that.onChannelClick(e);
        });
    },

    initPage: function() {
        var entityLength = this.initData.THEMEDATA.entityLength || 0,
            page = this.initData.THEMEDATA.page.page,
            size = this.initData.THEMEDATA.page.size;

        this.nomoreChannel = false;
        this.channelpage = page + 1;
        this.channelSize = size;

        // 加载图片
        setTimeout(lazyimg.loadimg, 50);

        if (!entityLength || entityLength < size) {
            this.nomoreChannel = true;
            scrollload.updateScrollStatus('hide');
        } else {
            scrollload.updateScrollStatus('loaded');
        }
    },

    /**
     * 系列课点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T09:51:34+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onChannelClick: function(e) {
        var $tar = $(e.currentTarget),
            id = $tar.attr('data-id'),
            type = $tar.attr('data-type'),
            oriUrl=$tar.attr('data-url'),
            url;

        switch (type) {
            case 'channel':
                url = 'dl/live/channel/homepage?channelId=' + id;
                break;
        }

        setTimeout(function () {
            appSdk.linkTo(url, oriUrl);
        }, 100);
    },

    /**
     * 加载专题
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadChannels: function(reset, finishFn, errorFn) {

        var that = this,
            params = {
                themeId: this.themeId,
                page: this.channelpage,
                size: this.channelSize,
            };

        if (that.nomoreChannel) {
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
                        that.nomoreChannel = true;
                    } else {
                        view.updateChannels(reset, res.data.themeLibs);

                        // 加载图片
                        setTimeout(lazyimg.loadimg, 50);
                    }

                    that.channelpage += 1;

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
            that.loadChannels(false, finishFn, errorFn);
        }, {
            marginBottom: 1000,
        });
    },
};


module.exports = themeChannel;
