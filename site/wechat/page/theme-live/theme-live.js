require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    urlutils = require('urlutils'),
    Scrollload = require('scrollload_v3'),
    Promise = require('promise'),
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
 * @require './theme-live.css'
 */
var themeLive = {
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

        //话题点击事件处理
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

        lazyimg.bindScrollEvts('#container');

        //加载图片
        setTimeout(lazyimg.loadimg, 50);

        // 显示页面底部菜单
        // view.renderTabMenu();

        if (!entityLength || entityLength < size) {
            this.nomoreLive = true;
            this.scroller.updateScrollStatus('nomore');
        } else {
            this.scroller.updateScrollStatus('loaded');
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
            url;

        switch (type) {
            case 'live':
                url = '/live/' + id + '.htm?from=theme&themeId=' + this.themeId;
                break;
        }

        if (url) {
            setTimeout(function () {
                window.location.href = url;
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
            id = $tar.attr('data-id'),
            url;

        if (id) {
            url = '/topic/' + id + '.htm?pro_cl=center';

            setTimeout(function() {
                window.location.href = url;
            }, 300);
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
                status: status
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
                }
            });
        })(liveId, status);
    },

    /**
     * 加载专题的直播间
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadLives: function(reset, loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        var that = this,
            params = {
                themeId: this.themeId,
                page: this.livepage,
                size: this.liveSize
            };

        if (that.nomoreLive) {
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
                        that.nomoreLive = true;
                    } else {
                        view.updateLives(reset, res.data.themeLibs);

                        // 更新直播间最新两个话题列表
                        var liveIds = res.data.themeLibs.map(function (item) {
                            return item.liveId;
                        });

                        that.loadLiveNewestTopics(liveIds);

                        //加载图片
                        setTimeout(lazyimg.loadimg, 50);

                        if (res.data.themeLibs.length < that.liveSize) {
                            loaded(true);
                            that.nomoreLive = true;
                        }
                    }

                    that.livepage += 1;

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
                liveIds: liveIds.join(',')
            };

        model.fetch({
            url: conf.api.themeListNewestTopic,
            data: params,
            success: function(res) {
                if (res && res.state && res.state.code === 0) {
                    view.updateTopics(res.data);

                    //加载图片
                    setTimeout(lazyimg.loadimg, 50);
                }
            },
            error: function(err) {
                console.error('加载直播最新话题出错：', err);
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
                    that.loadLives(false, resolve);
                });
            },
            toBottomHeight: 100
        });
    }
};


module.exports = themeLive;
