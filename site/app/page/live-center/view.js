var Handlebars = require('handlebars'),
    loading = require('loading'),
    TouchSlide = require('touchslide'),

    tpls = {
        topics: __inline('./tpl/topics.handlebars'),
        histTopics: __inline('./tpl/history-topics.handlebars'),
        // banners: __inline('./tpl/banners.handlebars'),
        headMenu: __inline('./tpl/head-menu.handlebars'),
        topicSection: __inline('./tpl/topic-section.handlebars')
    };

require('hbardateformat');
require('hbarcompare');
require('hbarimgformat');
require('./helper');
require('../../comp/default-img/default-img');

var view = {

    /**
     * 更新话题列表
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T12:47:51+0800
     * @param    {[type]}                           reset  [description]
     * @param    {[type]}                           topics [description]
     * @return   {[type]}                                  [description]
     */
    updateTopics: function(reset, topics) {
        var $topicList = $('#topic-list ul');

        if (reset) {
            $topicList.empty();
        }

        $topicList.append(tpls.topics({
            topics: topics
        }));
    },

    /**
     * 隐藏话题头部（并移除对应置顶头部元素）
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-17T17:01:12+0800
     * @return   {[type]}                           [description]
     */
    hideTopicHead: function() {
        $('#topic-list .list-wrap').remove();

        $('.fixed-head-menu .head-menu').remove();
    },

    /**
     * 更新历史话题列表
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T12:48:06+0800
     * @param    {[type]}                           reset      [description]
     * @param    {[type]}                           recordList [description]
     * @return   {[type]}                                      [description]
     */
    updateHistoryTopics: function(reset, topics) {
        var that = this,
            $histTopicList = $('#hist-topic-list'),
            $lastHistTopicsSection = $histTopicList.find('.list-wrap').last(),
            lastSectionTopics = [],
            newSections = [],
            html = '';

        // if (reset) {
        //     $histTopicList.empty();
        // }

        $.each(topics, function(index, topic) {

            var period = that.getTopicPeriod(topic.startTimestamp, topic.status);

            // 还没有section则添加
            if (!$lastHistTopicsSection.length) {
                $histTopicList.find('.no-more').before(tpls.topicSection({
                    headMenu: tpls.headMenu({
                        period: period
                    })
                }));
                $lastHistTopicsSection = $histTopicList.find('.list-wrap').last();
                
                $('.fixed-head-menu').append(tpls.headMenu({
                    period: period,
                    hidden: true
                }));
            }

            // 主题在当前页面最后section区段内
            if ($lastHistTopicsSection.find('.head-menu').attr('data-period') === period) {
                lastSectionTopics.push(topic);
            // 需要新增section
            } else {
                // 新增section前插入上一个sectoin中未插入的topic
                $lastHistTopicsSection.find('ul').append(tpls.histTopics({
                    topics: lastSectionTopics
                }));

                // 清空lastSectionTopics
                lastSectionTopics = [];

                // 新插入section
                $lastHistTopicsSection.after(tpls.topicSection({
                    headMenu: tpls.headMenu({
                        period: period
                    })
                }));
                $('.fixed-head-menu').append(tpls.headMenu({
                    period: period,
                    hidden: true
                }));

                // 重新选定最后一个section
                $lastHistTopicsSection = $histTopicList.find('.list-wrap').last();
                // topic入栈
                lastSectionTopics.push(topic);
            }
        });

        // 插入还未插入的topic
        if (lastSectionTopics.length) {
            $lastHistTopicsSection.find('ul').append(tpls.histTopics({
                topics: lastSectionTopics
            }));
        }
    },

    getTopicPeriod: function (startTime, status) {
        var timeNow = parseInt(window.NOWTIME || new Date().getTime()),
            d = (timeNow - parseInt(startTime)) / 1000,
            d_days = parseInt(d / 86400),
            d_hours = parseInt(d / 3600),
            d_minutes = parseInt(d / 60);

        if (d_days >= 0 && d_days <= 7 ) {
            return 'seven';
        } else if (d_days > 0 && d_days <= 30) {
            return 'thirty';
        } else if (d_days > 30) {
            return 'morethree';

        // 时间上还没开始，但状态已完成，列为7天内的直播
        } else if (status === 'ended') {
            return 'seven';
        } else {
            return 'livegoing';
        }
    },

    updateBannerStatus: function() {
        if (!$('#banner-list li').length) {
            $('#banners').addClass('hidden');
            return;
        }
    },

    updateTopicLoadBtnStatus: function(status) {
        switch (status) {
            case 'hide':
                $('#topic-list .load-more').addClass('hidden');
                break;
            case 'loaded':
                $('#topic-list .load-more').removeClass('hidden');
                $('#topic-list .load-more span').html('加载更多');
                break;
            case 'loading':
                $('#topic-list .load-more span').html('加载中...');
                break;
        }
    },

    showNomoreHistTopicTip: function() {
        $('#hist-topic-list .no-more').removeClass('hidden');
    },

    /**
     * 添加置顶head元素
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T13:00:18+0800
     * @param    {[type]}                           period [description]
     * @return   {[type]}                                  [description]
     */
    addFixedHeadMenus: function(period) {
        $('.fixed-head-menu').append(tpls.headMenu({
            period: period
        }));
    },

    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
    showLoading: function() {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    hideLoading: function() {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    },

    /**
     * banner图片启用轮播
     * @return {[type]} [description]
     */
    enableBannerSlide: function () {
        if ($('#banner-list li').length > 1) {
            setTimeout(function() {
                TouchSlide({
                    slideCell: '#banners',
                    mainCell: '#banner-list',
                    titCell: '#page-tip',
                    effect: 'leftLoop',
                    autoPage: true,
                    autoPlay: true,
                    delayTime: 300,
                    interTime: 4000
                });
            }, 0);
        }
    },

    /**
     * 滚屏自动显示”回到顶部“按钮
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T10:22:48+0800
     * @param    {[type]}                           t1 [description]
     * @param    {[type]}                           t2 [description]
     * @return   {[type]}                              [description]
     */
    autoShowBtnToTop: function(t1, t2) {
        var currentScrollTop = $('body').scrollTop();

        this.oldScrollTop = this.oldScrollTop || 0;
        this.scrollTop = this.scrollTop || 0;

        if (currentScrollTop >= 200 && this.oldScrollTop > this.scrollTop) {
            $(".btn-to-top").removeClass('hidden');
        } else {
            $(".btn-to-top").addClass('hidden');
        }

        this.oldScrollTop = this.scrollTop;
        this.scrollTop = currentScrollTop;
    },

    /**
     * 回到页面顶部
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T10:22:29+0800
     * @return   {[type]}                           [description]
     */
    scrollToTop: function() {
        var that = this;

        // 设置计时器，500毫秒间隔；
        scrollTopTimer = setInterval(function() {
            var toTop = document.body.scrollTop || document.documentElement.scrollTop,
                // 设置速度，用等式而不用具体数值是为了产生缓动效果；
                speed = Math.ceil(toTop / 4);

            // 作差，产生缓动效果；
            document.documentElement.scrollTop = document.body.scrollTop = toTop - speed;

            // 重置布尔值判断；
            that.isTop = true;

            // 判断是否抵达顶部，若是，停止计时器；
            if (toTop <= 4) {
                document.documentElement.scrollTop = document.body.scrollTop = 0;
                clearInterval(scrollTopTimer);
            }
        }, 60);
    },
    /**
     * 滚屏时自动置顶显示当前列表头部
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T10:22:20+0800
     * @return   {[type]}                           [description]
     */
    autoFixedHeadMenu: function() {
        var scrollTop = $('body').scrollTop();

        for (var i = 0, len = $(".list-wrap").length; i < len; i++) {

            var $fixedHeadMenus = $(".fixed-head-menu .head-menu"),
                $listWrapi = $('.list-wrap').eq(i),
                $headMenui = $listWrapi.find('.head-menu'),

                offsetTopi = $listWrapi[0].offsetTop,
                scrollHeight = $listWrapi[0].scrollHeight,
                menuHeight = $headMenui.height();


            // 顶部分界线在i对应的主题列表内时
            if (scrollTop > offsetTopi && scrollTop < offsetTopi + scrollHeight) {
                // 置顶元素显示为第i个区域头部标题
                $fixedHeadMenus.eq(i).removeClass('hidden');

                // 当有区域头部标题滚动靠近置顶元素标题时
                // 置顶标题显示方式由固定显示改为随页面滚动
                if (scrollTop > offsetTopi + scrollHeight - menuHeight) {
                    // 取消置顶元素显示
                    $fixedHeadMenus.addClass('hidden');

                    // 将当前区域head标题显示在列表底部以替换置顶元素标题显示
                    $listWrapi.addClass('fixed-to-bottom');
                    $headMenui.addClass('head-menu-to-bottom');
                    
                // 其它区域标题不靠近置顶元素时
                // 区域标题置顶固定显示
                } else {
                    // 还原head的底部显示
                    $listWrapi.removeClass("fixed-to-bottom");
                    $headMenui.removeClass('head-menu-to-bottom');
                }

            // 顶部分界线不在i对应的主题列表内时
            } else {
                // 取消i对应的head标题置顶元素显示
                $fixedHeadMenus.eq(i).addClass('hidden');
            }
        }
    }
};

module.exports = view;