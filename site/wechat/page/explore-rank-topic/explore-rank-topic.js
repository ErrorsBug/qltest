require('zepto');
// zeptofix
require('tapon');

var fastClick = require('fastclick');
// var appSdk = require('appsdk');
var model = require('model');
// var urlutils = require('urlutils');
var Scrollload = require('scrollload_v3');
var Promise = require('promise');
var urlUtils = require('urlutils');

var view = require('./view');
var conf = require('../conf');
var util = require('util');
// var toast = require('toast');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require '../../comp/explore-css/explore-common.css'
 * @require '../../comp/explore-css/explore-topics.css'
 * @require './rank.css'
 * @require './explore-rank-topic.scss'
 */

var rank = {
    init: function (data) {
        /* 初始化部分数据*/
        this.initStore(data);
        // 事件初始化
        this.initListeners();

        /* 开启滚动加载*/
        this.enableScrollLoad();

        this.setTraceSession();

        setTimeout(function () {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('topic-container');
        }, 1000);

    },

    /**
     * 设置页面渠道，用于统计页面来源下的支付成交量
     * @return {[type]} [description]
     */
    setTraceSession: function() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', 'rank-topic');
    },

    initStore: function (data) {
        this.topicPagination = {
            pageSize: 20,
            pageNum: 1,
        };
        this.arr = [];

        //刷新时type和period不变
        view.resetProp();
    },
    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // topic点击事件
        $('body').on('click', '#topics li', function (e) {
            that.onTopicClick(e);
        });

        // 顶部tab点击事件
        $('body').on('click','#toptab .tab-item', function(e){
            that.onTabClick(e);
            view.generalSetting();
        });

        // 周期选择事件
        $('body').on('click','.time-pop .timelist',function(e){
            that.onTimeSelect(e);
            view.generalSetting();
        });
        view.otherEvent();
    },

    enableScrollLoad: function () {
        var that = this;
        this.scroller = new Scrollload({
            $el: $('#topic-container'),
            toBottomHeight: 1200,
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.loadTopicList(resolve);
                });
            },
        });
    },

    /*滚动加载 */
    loadTopicList: function (loaded) {
        if (!loaded) {
            loaded = function () { };
        }
        var type = $('.tab-item.active').attr('data-type');
        var params = {
            type: type,
            date: type === 'week' ? $('#timeline').text().split('至')[0] : $('#timeline').text(),
            clientType: 'wechat',
            pageSize: this.topicPagination.pageSize,
            pageNum: this.topicPagination.pageNum + 1,
        };
        model.fetch({
            type: "POST",
            url: conf.api.getRankTopicList,
            data: params,
            success: function (result) {
                if (result.state.code === 0) {
                    view.updateTopics(result.data);
                    if (result.data.length < this.topicPagination.pageSize) {
                        loaded(true);
                    } else {
                        loaded();
                    }
                    this.topicPagination.pageNum++;
                } else {
                    console.log('话题列表加载出错');
                }
            }.bind(this),
            error: function(err){
                console.log(err);
            }
        });
    },

    /*榜单切换 */
    onTabClick: function(e){
        var that = this;
        var type = $(e.currentTarget).attr('data-type');
        if (that.arr.length && that.arr[that.arr.length-1] === type) {// 连续点击相同tab
            e.preventDefault();
        } else{
            that.arr.push(type);
            that.topicPagination.pageNum = 1;
            view.tabClick(e);
            var params = {
                type: $('.tab-item.active').attr('data-type'),
                clientType: 'wechat',
                pageSize: 20,
                pageNum: 1
            };
            model.fetch({
                type: "POST",
                url: conf.api.getPeriodAndList,
                data: params,
                success: function (result) {
                    if (result.state.code === 0) {
                        if(type === 'week'){
                            $('#timeline').text(result.period[0].date + '至' + result.period[0].dateEnd)
                        }else{
                            $('#timeline').text(result.period[0].date);
                        }
                        view.switchTopics(result.data);
                        view.switchPeriod(result.period);
                        document.querySelectorAll('.timelist')[0].classList.add('active');
                        //scroller重置
                        setTimeout(function(){
                            that.scroller.reset();
                        },0);
                        // 手动触发打曝光日志
                        setTimeout(function(){
                           typeof _qla != 'undefined' && _qla.collectVisible();
                        }, 0);
                    } else {
                        console.log('切换列表出错');
                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    },

    /*列表点击 */
    onTopicClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var url = $tar.attr('data-url');
        var type = $tar.attr('data-type');
        setTimeout(function() {
            if (window.__wxjs_environment === 'miniprogram') {
                if (type === 'channel') {
                    wx.miniProgram.navigateTo({ url: '/pages/channel-index/channel-index?channelId=' + id });
                } else {
                    wx.miniProgram.navigateTo({ url: '/pages/intro-topic/intro-topic?topicId=' + id });                    
                }
            } else {
                // 优先取后台新增字段url，用此字段值进行跳转，能完善带量统计
                if (!url) {
                    url = '/topic/' + id + '.htm';
                }
                url = urlUtils.fillParams({
                    pro_cl: 'livecenter'
                }, url);
                // window.location.href = url;
                util.locationTo(url);
            }
        }, 200);
    },

    /*周期选择 */
    onTimeSelect: function(e){
        var that = this;
        if($(e.currentTarget).hasClass('active')){//连续点击相同周期
            e.preventDefault();
        }else{
            that.topicPagination.pageNum = 1;
            view.periodClick(e);
            var type = $('.tab-item.active').attr('data-type');
            var params = {
                type: $('.tab-item.active').attr('data-type'),
                date: type === 'week' ? $('#timeline').text().split('至')[0] : $('#timeline').text(),
                clientType: 'wechat',
                pageSize: 20,
                pageNum: 1,
            };
            model.fetch({
                type: "POST",
                url: conf.api.getRankTopicList,
                data: params,
                success: function(result){
                    if (result.state.code === 0) {
                        view.switchTopics(result.data);
    
                        //scroller重置
                        setTimeout(function(){
                            that.scroller.reset();
                        },0);
    
                        // 手动触发打曝光日志
                        setTimeout(function(){
                            typeof _qla != 'undefined' && _qla.collectVisible();
                        }, 0);
                    } else {
                        console.log('选择周期列表出错');
                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    },
    fetchTypeAndRedirect: function (topicId) {
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
                    var url;
                    switch (res.data.type) {
                        case 'introduce':
                            url = '/wechat/page/topic-intro?topicId=' + res.data.content + '&pro_cl=livecenter';
                            // appSdk.linkTo('dl/live/topic/introduce?topicId=' + res.data.content);
                            break;
                        case 'channel':
                            url = '/live/channel/channelPage/' + res.data.content + '.htm?sourceNo=livecenter';
                            // appSdk.linkTo('dl/live/channel/homepage?channelId=' + res.data.content);
                            break;
                        case 'topic':
                            url = '/topic/' + res.data.content + '.htm?isGuide=Y&pro_cl=livecenter';
                            // appSdk.linkTo('dl/live/topic?topicId=' + res.data.content);
                            break;
                    }

                    setTimeout(function() {
                        window.location.href = url;
                    }, 500);
                }
            },
            error: function () {
                that.fetchTypeRedirectLocked = false;
                view.hideLoading();
            },
        });
    }
};

module.exports = rank;
