require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    urlutils = require('urlutils'),
    Scrollload = require('scrollload_v3'),
    Promise = require('promise'),
    model = require('model'),
    toast = require('toast'),
    wxutil = require('wxutil'),

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
        return $('.head-tip p').html();
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

        lazyimg.bindScrollEvts('#container');

        //加载图片
        setTimeout(lazyimg.loadimg, 50);

        // 显示页面底部菜单
        // view.renderTabMenu();

        if (!entityLength || entityLength < size) {
            this.nomoreTopic = true;
            this.scroller.updateScrollStatus('nomore');
        } else {
            this.scroller.updateScrollStatus('loaded');
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
            dataUrl = $tar.attr('data-url'),
            url;
        
        if (dataUrl) {
            if (/\?shareKey/.test(dataUrl)) {
                url = dataUrl + '&pro_cl=center';
            } else {
                url = dataUrl + '?pro_cl=center';
            }
            

        } else {
            url = '/topic/' + id + '.htm?pro_cl=center';
        }

        setTimeout(function () {
            window.location.href = url;
        }, 100);
    },

    /**
     * 加载专题的话题
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadTopics: function(reset, loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        var that = this,
            params = {
                themeId: this.themeId,
                page: this.topicPage,
                size: this.topicSize
            };

        if (that.nomoreTopic) {
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

                    if (!res.data || !res.data.themeLibs || !res.data.themeLibs.length) {
                        loaded(true);
                        that.nomoreTopic = true;
                    } else {
                        view.updateTopics(reset, res.data.themeLibs);

                        //加载图片
                        setTimeout(lazyimg.loadimg, 50);

                        if (res.data.themeLibs.length < that.topicSize) {
                            loaded(true);
                            that.nomoreTopic = true;
                        }
                    }

                    that.topicPage += 1;
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
                    that.loadTopics(false, resolve);
                });
            },
            toBottomHeight: 100
        });
    }
};


module.exports = themeTopic;
