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
    PayUtils = require('payutil'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),
    format = require('../../comp/format/format'),
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
 * @require './channel-index.css'
 */
var channelIndex = {

    tabContent: {
        topicList: [],
    },

    pageSize: 20,
    pageNum: 1,

    init: function (initData) {
        this.initData = initData;
        this.chargeConfigs = initData.CHARGE_CONFIGS;
        this.tabContent.topicList = JSON.parse(decodeURIComponent(initData.TOPIC_LIST).replace(/__quote__/g, '\'')) || [];
        this.tabContent.channelIntro = initData.CHANNEL_INTRO.replace(/__quote__/g, '\'');
        this.chargePo = initData.CHARGE_PO;

        this.initTabBar(initData.TOPIC_COUNT);

        this.loadTabContent('topic');

        this.initEvent();

        this.enableScrollLoad();

        this.initPayConfig();

        this.ifListEmpty();

        this.initAnalyze();

        setTimeout(lazyimg.loadimg, 50);

        lazyimg.bindScrollEvts('#container');
    },

    // 如果列表空的话显示空样式
    ifListEmpty: function () {
        if (this.tabContent.topicList.length === 0) {
            view.showEmptyList();
        } else {
            view.hideEmptyList();
        }
    },

    initEvent: function () {
        var that = this;

        // 点击支付弹出下面的框
        $('#do-pay-poper').click(function () {
            view.showOptions(that.chargeConfigs);
        });

        $('#do-abs-pay').click(function () {
            var money = $(this).data('money');
            that.doPay(money, that.chargeConfigs[0].id);
        });

        // 支付按钮点击事件
        $(document)
            .on('click', '#do-pay-channel .pay-item span', function () {
                $(this).parents('.pay-item').siblings().removeClass('active');
                $(this).parents('.pay-item').addClass('active');
            })
            .on('click', '#pay-btn', function () {
                var cfg = that.chargeConfigs[$('#do-pay-channel .active').data('config-id')];

                that.doPay(cfg.amount, cfg.id);
            });

        // 单节购买
        $('#list').on('click', '.payment-btn', function (e) {
            var event = e || window.event;
            event.stopPropagation();
            that.payUtils.doPay({
                tag: 'COURSE_FEE',
                params: {
                    topicId: $(this).data('topic-id'),
                    total_fee: $(this).data('money'),
                    type: 'COURSE_FEE',
                },
                extra: {
                    topicId: $(this).data('topic-id'),
                },
            });

            return false;
        });

        // 点会员专享弹出会员详情的框
        $('#renew').click(function (e) {
            view.showMemberDialog(that.chargePo.expiryTime);
        });

        // 跳转到话题
        $('.topic-item').click(function () {
            if ($(event.target).hasClass('payment-btn')) {
                return;
            }

            var topicId = $(this).data('topic-id');
            window.location.href = '/topic/details?topicId=' + topicId ;
        });

        // 跳转到话题
        $('.intro-btn').click(function (e) {
            e.stopPropagation();
            var topicId = $(this).parents('.topic-item').data('topic-id');
            window.location.href = '/wechat/page/topic-intro?topicId=' + topicId ;
        });

        // 点击续费
        $(document).on('click', '.member-dialog-btn', function () {
            view.hideMemberDialog();
            view.showOptions(that.chargeConfigs);
        })
        .on('click', '.co-dialog.show', function () {
            view.hideMemberDialog();
        });
    },

    doPay: function (money, chargeConfigId) {
        if (money == 0) {
            model.post(conf.api.orderFree, { chargeConfigId: chargeConfigId }, function (result) {
                if (result.state.code == 0) {
                    window.location.reload();
                }
            }, function (err) {
                toast.toast('支付失败');
            });
        } else {
            this.payUtils.doPay({
                tag: 'CHANNEL',
                params: {
                    chargeConfigId: chargeConfigId,
                    total_fee: money,
                    type: 'CHANNEL',
                },
            });
        }
    },

    initPayConfig: function () {
        this.payUtils = new PayUtils();
        this.payUtils.getPayResult(function (result) {
            if (result.tag === 'CHANNEL') {
                window.location.reload();
            } else if (result.tag === 'COURSE_FEE') {
                var topicId = result.extra && result.extra.topicId;
                view.setSinglePayment(topicId);
            }
        }, function (data) {
            if (data.tag === 'COURSE_FEE') {
                var topicId = data.extra && data.extra.topicId;
                view.setInSelectResult(topicId);
            }
        });
    },

    loadTabContent: function (type) {
        if (this.scroller) {
            this.scroller.reset();
        }

        view.hideEmptyList();
        view.hideEmptyIntro();

        switch(type) {
            case 'topic':
                if (this.tabContent.topicList.length === 0) {
                    view.showEmptyList();
                } else {
                    view.hideEmptyList();
                }

                view.updateTopics(true, this.tabContent.topicList);
                break;
            case 'intro':
                if (this.tabContent.channelIntro == '') {
                    view.showEmptyIntro();
                } else {
                    view.hideEmptyIntro();
                }
                view.updateIntro(true, decodeURIComponent(this.tabContent.channelIntro));
                break;
        }

        setTimeout(lazyimg.loadimg, 50);
    },

    // 获取话题列表
    // loaded是加载完毕后调用的，参数是一个boolean，true代表没有更多了，于是不会再去请求
    loadTopicList: function (loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        model.fetch(
            {
                url: conf.api.getTopicList,
                data: {
                    liveId: this.initData.CHANNEL_ID,
                    clientType: 'weibo',
                    pageSize: this.pageSize,
                    pageNum: this.pageNum + 1,
                },
                success: function (result) {
                    if (result.state.code === 0) {
                        this.tabContent.topicList = this.tabContent.topicList.concat(result.data.topicList);

                        view.updateTopics(false, result.data.topicList, this.power);
                        setTimeout(lazyimg.loadimg, 50);

                        if (result.data.topicList.length < this.pageSize) {
                            loaded(true);
                        } else {
                            loaded();
                        }

                        this.pageNum += 1;
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

    // 上拉加载更多
    enableScrollLoad: function() {
        var that = this;

        this.scroller = new Scrollload({
            $el: $('#container'),
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.loadTopicList(resolve);
                });
            },
        });
    },

    initTabBar: function (topicCount) {
        new Tabbar({
            container: $('.tab-bar'),
            tabs: [
                {
                    key: 'topic',
                    title: '系列课话题(' + topicCount + ')',
                    active: true,
                },
                {
                    key: 'intro',
                    title: '系列课介绍',
                },
            ],
            onTabClick: this.loadTabContent.bind(this),
        });
    },

    initAnalyze: function () {
        analyze.addBaiduStatistic();
    },
};

module.exports = channelIndex;
