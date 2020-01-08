require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    // toast = require('toast'),
    scrollload = require('scrollload'),
    appSdk = require('appsdk'),

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

        //加载图片
        setTimeout(lazyimg.loadimg, 50);

        if (!themeLength || themeLength < size) {
            this.nomoreTheme = true;
            scrollload.updateScrollStatus('hide');
        } else {
            scrollload.updateScrollStatus('loaded');
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
            url;

        switch (type) {
            case 'live':
                url = '/app/page/theme/live?id=' + id;
                break;
            case 'topic':
                url = '/app/page/theme/topic?id=' + id;
                break;
            case 'channel':
                url = '/app/page/theme/channel?id=' + id;
                break;
        }

        setTimeout(function () {
            // window.location.href = url;
            appSdk.goWebPage(url);
        }, 100);
    },

    /**
     * 加载专题
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadTheme: function(reset, finishFn, errorFn) {

        var that = this,
            params = {
                page: this.themepage,
                size: this.themeSize
            };

        if (that.nomoreTheme) {
            if (finishFn) {
                finishFn();
            }

            return;
        }

        scrollload.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.themeList,
            data: params,
            success: function(res) {
                scrollload.updateScrollStatus('loaded');
                if (res && res.state && res.state.code === 0) {

                    if (!res.data || !res.data.dataList || !res.data.dataList.length ||
                        res.data.dataList.length < that.themeSize) {
                        scrollload.updateScrollStatus('hide');
                        that.nomoreTheme = true;
                    }

                    view.updateTheme(reset, res.data && res.data.dataList);

                    //加载图片
                    setTimeout(lazyimg.loadimg, 50);
                    

                    that.themepage += 1;

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
            }
        });
    },

    /**
     * 下拉加载更多
     * @return {[type]} [description]
     */
    enableScrollLoad: function() {
        var that = this;

        new scrollload.UpScrollLoad('#container', function(loadingCtx, finishFn, errorFn) {
            that.loadTheme(false, finishFn, errorFn);
        }, {
            marginBottom: 1000
        });
    }
};


module.exports = theme;
