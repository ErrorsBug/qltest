require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    urlutils = require('urlutils'),
    Scrollload = require('scrollload_v3'),
    Promise = require('promise'),
    // toast = require('toast'),
    wxutil = require('wxutil'),

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

        // 下拉加载更多功能开启
        this.enableScrollLoad();

        this.initPage();

        // 事件初始化
        this.initListeners();

        // 分享定制
        wxutil.share({
            title: document.title,
            desc: this.getTipDesc(),
            // timelineDesc: '最有用的知识合集', // 分享到朋友圈单独定制
            imgUrl: this.getBannerImgUrl()
        });
    },

    /**
     * 获取介绍内容（作为分享内容)
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-12-29T18:21:13+0800
     * @return   {[type]}                           [description]
     */
    getTipDesc: function() {
        return $('.tip p').html();
    },

    /**
     * 获取页面头部banner的url(作为分享图片)
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-12-29T18:02:21+0800
     * @return   {[type]}                           [description]
     */
    getBannerImgUrl: function() {
        var $tar = $('.banner img'),
            url;
        url = $tar.attr('data-imgsrc');
        if (!url) {
            url = $tar.attr('src');
        }

        if (!url) {
            url = 'https://img.qlchat.com/qlLive/liveCommon/theme-logo-2.png';
        }

        return url;
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

        lazyimg.bindScrollEvts('#container');

        //加载图片
        setTimeout(lazyimg.loadimg, 50);

        // 显示页面底部菜单
        // view.renderTabMenu();

        if (!entityLength || entityLength < size) {
            this.nomoreChannel = true;
            this.scroller.updateScrollStatus('nomore');
        } else {
            this.scroller.updateScrollStatus('loaded');
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
            url;

        switch (type) {
            case 'channel':
                // url = 'dl/live/channel/homepage?channelId=' + id;
                url = '/live/channel/channelPage/' + id + '.htm';
                break;
        }

        setTimeout(function () {
            window.location.href = url;
        }, 100);
    },

    /**
     * 加载专题
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadChannels: function(reset, loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        var that = this,
            params = {
                themeId: this.themeId,
                page: this.channelpage,
                size: this.channelSize
            };

        if (that.nomoreChannel) {
            loaded(true);

            return;
        }

        this.scroller.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.themeListHotEntity,
            data: params,
            success: function(res) {
                loaded();
                if (res && res.state && res.state.code === 0) {

                    if (!res.data || !res.data.themeLibs || !res.data.themeLibs.length ||
                        res.data.themeLibs.length < that.channelSize) {
                        loaded(true);
                        that.nomoreChannel = true;
                    }

                    view.updateChannels(reset, res.data && res.data.themeLibs);

                    //加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    that.channelpage += 1;

                    loaded();
                } else {
                    loaded();
                }
            },
            error: function() {
                loaded();
            }
        });
    },

    /**
     * 下拉加载更多
     * @return {[type]} [description]
     */
    enableScrollLoad: function() {
        var that = this;
        this.scroller = new Scrollload({
            $el: $('#container'),
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.loadChannels(false, resolve);
                });
            },
            toBottomHeight: 100
        });
    }
};


module.exports = themeChannel;
