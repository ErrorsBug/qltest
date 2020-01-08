require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    // toast = require('toast'),
    Scrollload = require('scrollload_v3'),
    Promise = require('promise'),
    wxutil = require('wxutil'),

    view = require('./view'),
    conf = require('../conf');

/**
 *
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/default-img/default-img.css'
 * @require './theme.css'
 */
var theme = {
    init: function(initData) {
        this.initData = initData;

        // 下拉加载更多功能开启
        this.enableScrollLoad();

        this.initPage();

        // 事件初始化
        this.initListeners();

        // 分享定制
        wxutil.share({
            title: '[千聊] 精选好专题',
            desc: '精心整理的直播间和话题合集，让你高效选择有用的知识',
            timelineDesc: '最有用的知识合集', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/theme-logo-2.png'
        });

        this.setTraceSession();

        setTimeout(function () {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('container');
        }, 1000);
    },

    /**
     * 设置页面渠道，用于统计页面来源下的支付成交量
     * @return {[type]} [description]
     */
    setTraceSession: function() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', 'theme');
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
        $('body').on('click', '.themes li', function(e) {
            that.onThemeClick(e);
        });
    },

    initPage: function() {
        var themeLength = this.initData.THEMEDATA.themeLength || 0,
            page = this.initData.THEMEDATA.page.page,
            size = this.initData.THEMEDATA.page.size;

        this.nomoreTheme = false;
        this.themepage = page + 1;
        this.themeSize = size;

        lazyimg.bindScrollEvts('#container');

        //加载图片
        setTimeout(lazyimg.loadimg, 50);

        // 显示页面底部菜单
        // view.renderTabMenu();

        if (!themeLength || themeLength < size) {
            this.nomoreTheme = true;
            this.scroller.updateScrollStatus('nomore');
        } else {
            this.scroller.updateScrollStatus('loaded');
        }
    },

    /**
     * 专题点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T09:51:34+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onThemeClick: function(e) {
        var $tar = $(e.currentTarget),
            id = $tar.attr('data-id'),
            type = $tar.attr('data-type'),
            dataUrl = $tar.attr('data-url'),
            url;

        switch (type) {
            case 'live':
                url = '/wechat/page/theme/live?id=' + id;
                break;
            case 'topic':
                url = '/wechat/page/theme/topic?id=' + id;
                break;
            case 'channel':
                url = '/wechat/page/theme/channel?id=' + id;
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
    loadTheme: function(reset, loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        var that = this,
            params = {
                page: this.themepage,
                size: this.themeSize
            };

        if (that.nomoreTheme) {
            loaded(true);
            return;
        }

        this.scroller.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.themeList,
            data: params,
            success: function(res) {
                loaded();
                if (res && res.state && res.state.code === 0) {

                    if (!res.data || !res.data.dataList || !res.data.dataList.length ||
                        res.data.dataList.length < that.themeSize) {
                        loaded(true);
                        that.nomoreTheme = true;
                    }

                    view.updateTheme(reset, res.data && res.data.dataList);

                    //加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    that.themepage += 1;

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
                    that.loadTheme(false, resolve);
                });
            },
            toBottomHeight: 100
        });
    }
};


module.exports = theme;
