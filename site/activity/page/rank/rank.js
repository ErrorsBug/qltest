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
var toast = require('toast');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './rank.css'
 */

var rank = {
    init: function (data) {
        this.initCompatibility('.container')
        // console.log(data);
        /* 初始化部分数据*/
        this.initStore(data);
        // 事件初始化
        this.initListeners();

        /* 开启滚动加载*/
        this.enableScrollLoad();

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
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', 'activity-rank');
    },

    initStore: function (data) {
        this.tagId = '0';
        this.topicPagination = {
            pageSize: 20,
            pageNum: 1,
        };
        if (data instanceof Array) this.topicList = data;
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
    },

    initCompatibility: function(fixScrollSelector) {
        //* 各种兼容处理 *//
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 解决IOS漏底问题
        function disableScroll(event) {
            if (!event.canScroll) {
                event.preventDefault();
            }
        }
        function overscroll(el) {
            if (el) {
                el.addEventListener('touchstart', function (){
                    const top = el.scrollTop;
                    const totalScroll = el.scrollHeight;
                    const currentScroll = top + el.offsetHeight;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (currentScroll === totalScroll) {
                        el.scrollTop = top - 1;
                    }
                });

                el.addEventListener('touchmove', function(event) {
                    if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
                });
            }
        }
        function fixScroll(selector) {
            const elSelectot = selector || '';
            overscroll(document.querySelector(selector));
            document.body.addEventListener('touchmove', disableScroll);
        }
        fixScroll(fixScrollSelector);
    },
    enableScrollLoad: function () {
        var that = this;

        // new scrollload.UpScrollLoad('#container', function (loadingCtx, finishFn, errorFn) {
        //     that.loadTopicList(finishFn, errorFn);
        // }, {
        //         marginBottom: 1000
        // });

        this.scroller = new Scrollload({
            $el: $('#container'),
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

    nomoreData: false,
    loadTopicList: function (loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        model.post('/api/wechat/activity/rank/getRankTopicList',
            {
                tagId: this.tagId,
                clientType: 'wechat',
                pageSize: this.topicPagination.pageSize,
                pageNum: this.topicPagination.pageNum + 1,
            }, function (result) {
                if (result.state.code === 0) {
                    // console.log(result.data.length);
                    this.topicList = this.topicList.concat(result.data);

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
            }.bind(this));
    },

    onTopicClick: function (e) {
        var $tar = $(e.currentTarget);
        var id = $tar.attr('data-id');
        var url = $tar.attr('data-url');
        // this.fetchTypeAndRedirect(id);
        // console.log(url);
        setTimeout(function() {
            // 优先取后台新增字段url，用此字段值进行跳转，能完善带量统计
            if (!url) {
                url = '/topic/' + id + '.htm';
            }

            url = urlUtils.fillParams({
                pro_cl: 'livecenter'
            }, url);

            window.location.href = url;

        }, 200);
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
                            url = '/topic/' + res.data.content + '.htm?preview=Y&intoPreview=Y&pro_cl=livecenter';
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
    },

};

module.exports = rank;