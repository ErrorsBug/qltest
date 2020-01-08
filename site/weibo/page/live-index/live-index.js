require('zepto');
// require('zeptofix');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    Scrollload = require('scrollload_v3'),
    urlutils = require('urlutils'),
    appSdk = require('appsdk'),
    Tabbar = require('tabbar'),
    Promise = require('promise'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),
    hbardatetimeformat = require('hbardatetimeformat'),
    toast = require('toast'),
    format = require('../../comp/format/format'),
    numberFormat = require('../../comp/format/number-format'),
    moneyFormat = require('../../comp/format/money-format'),
    analyze = require('../../comp/baidu-analyze'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common.css'
 * @require './live-index.css'
 */
var liveCenter = {
    initData: null,

    tabContent: {
        topicList: [],

        channelList: [],

        channelIntro: '',
    },

    currentTab: 'topic',

    // 滚动加载组件
    scroller: null,

    topicPagination: {
        pageSize: 20,
        pageNum: 1,
    },

    channelPagination: {
        pageSize: 20,
        pageNum: 1,
    },

    loadStatus: {},

    init: function (initData) {
        this.initData = initData;
        this.topicInfo = initData.LIVE_INFO;
        this.tabContent.topicList = JSON.parse(decodeURIComponent(initData.TOPIC_LIST).replace(/__quote__/g, '\'')) || [];
        this.tabContent.channelList = JSON.parse(decodeURIComponent(initData.CHANNEL_LIST).replace(/__quote__/g, '\'')) || [];
        this.tabContent.channelIntro = decodeURIComponent(initData.CHANNEL_INTRO.replace(/__quote__/g, '\''));

        this.fixedHeadImg();

        this.loadTabContent(this.currentTab);

        this.enableScrollLoad();

        this.initTabBar(initData.TOPIC_COUNT, initData.CHANNEL_COUNT);

        this.initEvent();

        setTimeout(lazyimg.loadimg, 50);

        lazyimg.bindScrollEvts('#container');

        this.initAnalyze();
    },

    // 如果列表空的话显示空样式
    ifListEmpty: function () {
        if (this.tabContent.topicList.length === 0) {
            view.showEmptyList();
        }

        if (this.tabContent.channelList.length === 0) {
            view.showEmptyList();
        }
    },

    // 把图片设置进背景图片
    fixedHeadImg: function () {
        var $header = $('.header-img');
        var bgImg = $header.data('bg');

        if (bgImg) {
            $header.css({ backgroundImage: 'url(' + bgImg + ')' });
        }
    },

    // 加载本标签的内容
    loadTabContent: function (type) {
        this.currentTab = type;
        if (this.scroller) {
            this.scroller.reset();
        }

        view.hideEmptyList();
        view.hideEmptyIntro();

        switch (type) {
            case 'topic':
                if (this.tabContent.topicList.length === 0) {
                    view.showEmptyList();
                } else {
                    view.hideEmptyList();
                }
                view.updateTopics(true, this.tabContent.topicList);
                break;
            case 'channel':
                if (this.tabContent.channelList.length === 0) {
                    view.showEmptyList();
                } else {
                    view.hideEmptyList();
                }
                view.updateChannels(true, this.tabContent.channelList);
                break;
            case 'intro':
                if (this.tabContent.channelIntro == '') {
                    view.showEmptyIntro();
                } else {
                    view.hideEmptyIntro();
                }
                view.updateIntro(true, this.tabContent.channelIntro);
                break;
        }

        setTimeout(lazyimg.loadimg, 50);
    },

    // 获取话题列表
    // loaded是加载完毕后调用的，参数是一个boolean，true代表没有更多了，于是不会再去请求
    loadTopicList: function (loaded) {
        if (!loaded && this.currentTab === 'topic') {
            loaded = function () { };
        }

        model.fetch(
            {
                url: conf.api.getTopicList,
                data: {
                    liveId: this.initData.LIVE_ID,
                    clientType: 'weibo',
                    pageSize: this.topicPagination.pageSize,
                    pageNum: this.topicPagination.pageNum + 1,
                },
                success: function (result) {
                    if (result.state.code === 0) {
                        this.tabContent.topicList = this.tabContent.topicList.concat(result.data.topicList);

                        view.updateTopics(false, result.data.topicList, this.power);

                        // 加载图片
                        setTimeout(lazyimg.loadimg, 50);

                        if (this.currentTab === 'topic') {
                            if (this.topicPagination.pageNum !== 1 && result.data.topicList.length < this.topicPagination.pageSize) {
                                loaded(true);
                            } else {
                                loaded();
                            }
                        }

                        this.topicPagination.pageNum = this.topicPagination.pageNum + 1;
                    } else {
                        console.log('话题列表加载出错');
                    }
                }.bind(this),
                error: function (err) {
                    loaded();
                },
            }
        );
    },

    // 获取系列课列表
    loadChannelList: function (loaded) {
        if (!loaded && this.currentTab === 'channel') {
            loaded = function () { };
        }

        model.fetch(
            {
                url: conf.api.getChannelList,
                type: 'GET',
                data: {
                    liveId: this.initData.LIVE_ID,
                    clientType: 'weibo',
                    pageSize: this.channelPagination.pageSize,
                    pageNum: this.channelPagination.pageNum + 1,
                },
                success: function (result) {
                    if (result.state.code === 0) {
                        if (!result.data.channelList) {
                            // 没有系列课
                            view.updateChannels(false, []);
                            return;
                        }

                        this.tabContent.channelList = this.tabContent.channelList.concat(result.data.channelList);

                        view.updateChannels(false, result.data.channelList, this.power);
                        setTimeout(lazyimg.loadimg, 50);

                        if (this.currentTab === 'channel') {
                            if (result.data.channelList.length < this.channelPagination.pageSize) {
                                loaded(true);
                            } else {
                                loaded();
                            }
                        }

                        this.channelPagination.pageNum = this.channelPagination.pageNum + 1;
                    } else {
                        console.log('系列课列表加载出错');
                    }
                }.bind(this),
                error: function (err) {
                    loaded();
                },
            }
        );
    },

    // 请求关注
    doAttention: function (focus, callback) {
        if (this.loadStatus.doAttention) {
            return;
        }
        this.loadStatus.doAttention = true;

        model.post(conf.api.doAttention, {
            status: focus,
            liveId: this.initData.LIVE_ID,
        }, function (result) {
            this.loadStatus.doAttention = false;

            if (result.state.code === 0) {
                callback(result.data);
                // window.location.reload();
            } else {
                console.log(result);
            }
        }.bind(this), function () {
            this.loadStatus.doAttention = false;
        }.bind(this));
    },

    // 请求开关通知
    doNotice: function (status, callback) {
        model.post(conf.api.doNotice, {
            liveId: this.initData.LIVE_ID,
            status: status,
        }, function (result) {
            this.loadStatus.doAttention = false;

            if (result.state.code === 0) {
                callback(result.data);
                // window.location.reload();
            } else {
                console.log(result);
            }
        }.bind(this), function () {
            this.loadStatus.doAttention = false;
        }.bind(this));
    },

    initEvent: function () {
        var that = this;

        $('#live-v').click(function () {
            view.showLiveVDialog(that.tabContent.channelIntro, that.topicInfo.entityExtend.liveTTime || Date.now());
        });

        $('#live-t').click(function () {
            view.showLiveTDialog();
        });

        // 关注按钮点击后
        $('#attention').click(function () {
            var $this = $(this);
            var currentStatus = $this.data('isatt');

            that.doAttention(!currentStatus, function (result) {
                view.updateBtnStatus(result.isFollow, result.isAlert, result.follwerNum);
            });
        });

        // 通知按钮点击后
        $('#notice').click(function () {
            var $this = $(this);
            var currentStatus = $this.data('notice');

            // 点通知的时候，如果未关注，则调用关注接口
            if (!$('#attention').data('isatt')) {
                that.doAttention(true, function (result) {
                    view.updateBtnStatus(result.isFollow, result.isAlert, result.follwerNum);
                });

                return;
            }

            that.doNotice(!currentStatus, function (result) {
                view.updateBtnStatus(result.isFollow, result.isAlert);
            });
        });

        $(document)
            .on('click', '.channel-item', function () {
                var channelId = $(this).data('channel-id');

                window.location.href = '/live/channel/channelPage/' + channelId + '.htm?liveId=' + that.initData.LIVE_ID;
            })
            .on('click', '.topic-item', function () {
                var topicId = $(this).data('topic-id');

                window.location.href = '/topic/details?topicId=' + topicId ;
            })
            .on('click', '.intro-btn', function () {
                var topicId = $(this).parents('.topic-item').data('topic-id');
                window.location.href = '/wechat/page/topic-intro?topicId=' + topicId ;
            });
    },

    // 上拉加载更多
    enableScrollLoad: function () {
        var that = this;

        this.scroller = new Scrollload({
            $el: $('#container'),
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    if (that.currentTab === 'topic') {
                        that.loadTopicList(resolve);
                    } else if (that.currentTab === 'channel') {
                        that.loadChannelList(resolve);
                    }
                });
            },
        });
    },

    initTabBar: function (topicCount, channelCount) {
        new Tabbar({
            container: $('.tab-bar'),
            tabs: [
                {
                    key: 'topic',
                    title: '话题(' + topicCount + ')',
                    active: true,
                },
                {
                    key: 'channel',
                    title: '系列课(' + channelCount + ')',
                },
                {
                    key: 'intro',
                    title: '介绍',
                },
            ],
            onTabClick: this.loadTabContent.bind(this),
        });
    },

    initAnalyze: function () {
        analyze.addBaiduStatistic();
    },
};

module.exports = liveCenter;
