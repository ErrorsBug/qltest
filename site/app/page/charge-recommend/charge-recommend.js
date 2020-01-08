require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    // toast = require('toast'),
    scrollload = require('scrollload'),
    appSdk = require('appsdk'),

    view = require('./view'),
    conf = require('../conf'),
    appsdk = require('appsdk');
    
/**
 *
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/default-img/default-img.css'
 * @require './charge-recommend.scss'
 */
var chargeRecommend = {
    init: function (initData) {
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
    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // 报名按钮点击事件
        $('body').on('click', '.course-item', function (e) {
            that.onCourseClick(e);
        });
    },

    initPage: function () {
        var coursesLength = this.initData.COURSEDATA.coursesLength || 0,
            page = this.initData.COURSEDATA.page.page,
            size = this.initData.COURSEDATA.page.size;

        this.nomoreCourse = false;
        this.coursepage = page + 1;
        this.courseSize = size;

        // 加载图片
        setTimeout(lazyimg.loadimg, 50);

        if (!coursesLength || coursesLength < size) {
            this.nomoreCourse = true;
            scrollload.updateScrollStatus('hide');
        } else {
            scrollload.updateScrollStatus('loaded');
        }
    },

    /**
     * 课程点击事件处理
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T09:51:34+0800
     * @param    {[type]}                           e [description]
     * @return   {[type]}                             [description]
     */
    onCourseClick: function (e) {
        var $tar = $(e.currentTarget),
            id = $tar.attr('data-id'),
            type = $tar.attr('data-type'),
            url = $tar.attr('data-url');

        switch (type) {
            case 'live':
                appSdk.linkTo('dl/live/homepage?liveId=' + id, url);
                break;
            case 'topic':
                this.fetchTypeAndRedirect(id, url);
                break;
            case 'channel':
                appSdk.linkTo('dl/live/channel/homepage?channelId=' + id, url);
                break;
        }
    },

    /**
     * 加载专题
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadCourse: function (reset, finishFn, errorFn) {

        var that = this,
            params = {
                page: this.coursepage,
                size: this.courseSize,
            };

        if (that.nomoreCourse) {
            if (finishFn) {
                finishFn();
            }

            return;
        }

        scrollload.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.recommendChargeCourseList,
            data: params,
            success: function (res) {
                scrollload.updateScrollStatus('loaded');
                if (res && res.state && res.state.code === 0) {

                    if (!res.data || !res.data.dataList || !res.data.dataList.length ||
                        res.data.dataList.length < that.courseSize) {
                        scrollload.updateScrollStatus('hide');
                        that.nomoreCourse = true;
                    }

                    view.updateCourse(reset, res.data && res.data.dataList);

                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);


                    that.coursepage += 1;

                    if (finishFn) {
                        finishFn();
                    }
                } else {
                    if (errorFn) {
                        errorFn();
                    }
                }
            },
            error: function () {
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
    enableScrollLoad: function () {
        var that = this;

        new scrollload.UpScrollLoad('#container', function (loadingCtx, finishFn, errorFn) {
            that.loadCourse(false, finishFn, errorFn);
        }, {
                marginBottom: 1000,
            });
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

};


module.exports = chargeRecommend;
