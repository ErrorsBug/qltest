require('zepto');
// zeptofix
require('tapon');

var envi = require('envi');
// var Promise = require('promise');
var fastClick = require('fastclick');
// var lazyimg = require('lazyimg');
var model = require('model');
// var urlutils = require('urlutils');

var view = require('./view');
var conf = require('../conf');
var validator = require('validator');
var toast = require('toast');
var Payutil = require('payutil');
var analyze = require('../../comp/baidu-analyze');
/**
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './topic-intro.css'
 */

var topicIntro = {
    init: function (data)
    {
        this.initData = data;

        /* 頁面初始化*/
        this.render();

        /* 事件初始化*/
        this.initListeners();

        /* 初始化订单查询*/
        this.initOrderQuery();

        /* 初始化百度统计*/
        this.initAnalyze();
    },

    /* 初始化订单查询*/
    initOrderQuery: function ()
    {
        var payutil = new Payutil();
        payutil.getPayResult(function (result)
        {
            switch (result.tag) {
                case 'gift':
                    view.gift.getGift(result.orderId);
                    break;
                case 'channel', 'topic':
                    window.location.reload = true;
                default:
                    break;
            }
        });
    },

    /* 事件定義*/
    initListeners: function ()
    {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        /* 推送通知按钮点击事件*/
        $('body').on('click', '#topic-push', function ()
        {
            that.onTopicPushClick();
        });

        /* 推送话题按钮点击事件*/
        $('body').on('click', '#push-confirm', function ()
        {
            that.onPushConfirmClick();
        });

        /* 获取邀请卡点击事件*/
        $('body').on('click', '#get-share-card', function (e)
        {
            that.onSharecardClick(e);
        });

        /* 关注直播间点击事件*/
        $('body').on('click', '#focus-live', function (e)
        {
            that.onFocusLiveClick();
        });

        /* 普通话题报名*/
        $('body').on('click', '#enter-public', function (e)
        {
            that.onEnterPublicClick();
        });

        /* 输入密码确定按钮点击事件*/
        $('body').on('click', '#password-enter', function (e)
        {
            that.onEnterPasswordClick();
        });

        /* 购买话题点击事件*/
        $('body').on('click', '#topic-purchase', function (e)
        {
            that.onTopicPurchaseClick();
        });

        /* 加v认证按钮点击事件*/
        $('body').on('click', '#v-auth', function (e)
        {
            view.showVModal();
        });

        /* 加t认证按钮点击事件*/
        $('body').on('click', '#t-auth', function (e)
        {
            view.showTModal();
        });

        /* modal关闭按钮点击事件*/
        $('body').on('click', '.modals [data-close]', function (e)
        {
            $(this).parents('.modals').attr('hidden', 'true');
        });

        /* modal背景点击事件*/
        $('body').on('click', '.modals .mask', function (e)
        {
            $(this).parents('.modals').attr('hidden', 'true');
        });

        /* 送礼按钮点击事件*/
        $('body').on('click', '#gift', function (e)
        {
            view.gift.showModal();
        });

        /* 送礼数量减点击事件*/
        $('body').on('click', '#gift-decrease', function (e)
        {
            view.gift.decrease();
        });

        /* 送礼数量加点击事件*/
        $('body').on('click', '#gift-increase', function (e)
        {
            view.gift.increase();
        });

        /* 确认送礼点击事件*/
        $('body').on('click', '#do-gift', function (e)
        {
            view.gift.do(that.initData.userId, that.initData.topicView.topicPo.id);
        });

        /* pay for topic*/
        $('body').on('click', '#pay-for-topic', function (e)
        {
            that.payForTopic();
        });

        /* pay for channel*/
        $('body').on('click', '#pay-for-channel', function (e)
        {
            that.payForChannel();
        });

        /* 录音介绍点击事件*/
        $('body').on('click', '.c-audio', function ()
        {
            that.playIntroAudio();
        });

        $('body').on('click', '.charge-action-sheet .buy', function (e)
        {
            var payInfo = {
                chargeConfigId: $(this).attr('data-id'),
                total_fee: Number($(this).attr('data-amount')) * 100,
            };
            that.doBuyChannel(payInfo);
        });
    },
    /**
     * 根据初始数据初始化渲染页面
     */
    render: function ()
    {
        /* 頂部介紹區域*/
        this.renderHeaders();

        /* 底部按鈕*/
        this.renderFooters();

        /* fetch info other sectiosn need*/
        this.fetchOtherInfo();

        /* init audio player*/
        if ($('.rec-intro-list').length > 0) {
            this.audio.init(this.initData.profile);
        }
    },

    /* 初始化頂部介紹信息*/
    renderHeaders: function ()
    {
        view.updateHeaders(this.initData);
        /* after render headers, init detail intro state*/
        this.onDetailIntroLoad();
    },

    /* 初始化底部按鈕信息*/
    renderFooters: function ()
    {
        view.updateFooters(this.initData);
    },

    /* render other sections*/
    renderOtherSections: function ()
    {
        view.updateOtherSections(this.initData);
    },

    /* 初始化各种模态框*/
    renderModals: function ()
    {
        view.updateModals(this.initData);
    },

    /* get other data to fill page*/
    fetchOtherInfo: function ()
    {
        var that = this;
        var params = {
            liveId: that.initData.topicView.topicPo.liveId,
            topicId: that.initData.topicView.topicPo.id,
            pageNum: 1,
            pageSize: 5,
        };

        if (this.initData.topicView.topicPo.channelId && this.initData.topicView.topicPo.channelId != '') {
            params.channelId = that.initData.topicView.topicPo.channelId;
        }

        model.post(conf.api.getOtherInfo, params, function (result)
        {
            $.extend(that.initData, result);
            that.renderOtherSections();
            that.renderModals();
        });
    },

    /* 关注按钮点击事件*/
    focus_sending: false,
    onFocusLiveClick: function ()
    {
        var that = this;
        var params = {
            status: $('#focus-live').hasClass('on') ? false : true,
            liveId: that.initData.topicView.topicPo.liveId,
            userId: that.initData.userId,
        };
        if (!that.focus_sending) {
            that.focus_sending = true;
            model.post(
                conf.api.doAttention,
                params,
                function (result)
                {
                    if (result.state.code === 0) {
                        view.updateFocusBtn();
                    } else {
                        toast.toast(result.state.msg);
                    }
                    that.focus_sending = false;
                }, function (err)
                {
                    that.focus_sending = false;
                });
        }
    },

    /* 详细介绍点击事件*/
    onDetailIntroLoad: function ()
    {
        var height = $('#detail-intro').height();
        if (height > 69) {
            // 介绍过长时初始化截取事件
            view.initDetailIntro();
        }
    },

    /* 公开话题报名按钮点击事件*/
    onEnterPublicClick: function ()
    {
        model.post(conf.api.enterPublic, { topicId: this.initData.topicView.topicPo.id }, function (res)
        {
            if (res && res.state && res.state.code === 0) {
                window.location.href = $('#enter-public').attr('data-href');
            }
        });
        // setTimeout(function ()
        // {
        //     window.location.href = $('#enter-public').attr('data-href');
        // }, 50);
    },

    password_sending: false,
    /* 密码确定按钮点击事件*/
    onEnterPasswordClick: function ()
    {
        var that = this;
        var $input = $('#password-input');
        // var $enter = $('#password-enter');

        /* check if input value valid*/
        var val = $input.val().trim();
        var legal = validator('text', '密码', val, 12);
        // to change


        if (legal && !that.password_sending) {
            that.password_sending = true;
            var params = {
                topicId: that.initData.topicView.topicPo.id,
                password: val,
            };

            model.post(conf.api.enterEncrypt,
                params,
                function (result)
                {
                    if (result.state && result.state.code == 0) {
                        toast.toast('验证成功');
                        setTimeout(function ()
                        {
                            window.location.href = '/topic/details?topicId=' + that.initData.topicView.topicPo.id ;
                        }, 500);
                    } else {
                        if (result.state) {
                            toast.toast(result.state.msg);
                        }
                    }
                    that.password_sending = false;
                }, function (err)
                {
                    that.password_sending = false;
                });
            /* request check if password right*/
        }
    },

    /* pay for topic*/
    payForTopic: function ()
    {
        var payutil = new Payutil();
        var params = {
            total_fee: $('#pay-for-topic').attr('attr-money'),
            // total_fee: Number($('#topic-charge').text())*100,
            topicId: this.initData.topicView.topicPo.id,
            type: 'COURSE_FEE',
        };
        payutil.doPay(
            {
                tag: 'topic',
                params: params,
            });
    },

    /* pay for channel*/
    payForChannel: function ()
    {
        console.log(this.initData.channel);
        var that = this;
        if (this.initData.channel.channel.chargeType == 'absolutely') {
            if (this.initData.channel.chargeConfigs[0].amount === 0) {
                var params = {
                    chargeConfigId: this.initData.channel.chargeConfigs[0].id,
                };
                model.post(
                    conf.api.buyFreeChannel,
                    params,
                    function (res)
                    {
                        if (res && res.state && (res.state.code === 0 || res.state.code === 10001)) {
                            window.location.href = '/topic/details?topicId=' + that.initData.topicView.topicPo.id ;
                        }
                    });
                return;
            }
            var payutil = new Payutil();
            var params = {
                chargeConfigId: that.initData.channel.chargeConfigs[0].id,
                total_fee: that.initData.channel.chargeConfigs[0].amount,
                topicId: this.initData.topicView.topicPo.id,
                type: 'CHANNEL',
            };
            payutil.doPay({
                tag: 'channel',
                params: params,
            });
        } else {
            view.showChannelChargeSheet(this.initData.channel.chargeConfigs);
        }
    },

    /* do buy channel*/
    doBuyChannel: function (data)
    {
        var payutil = new Payutil();
        var info = {
            topicId: this.initData.topicView.topicPo.id,
            type: 'CHANNEL',
        };
        var params = $.extend(data, info);
        payutil.doPay({
            tag: 'channel',
            params: params,
        });
    },

    /* 播放介绍音频*/
    playIntroAudio: function ()
    {
        this.audio.action();
    },

    /* all about audio player*/
    audio: {
        /* audio player element*/
        // $player: $('#audio-player'),
        player: $('#audio-player')[0],
        /* play list*/
        list: [],
        /* play status*/
        status: '',
        /* current playing audio*/
        current: '',
        /* audio play type*/
        playType: '',
        /* init player*/
        init: function (data)
        {
            var that = this;
            // init play type, list and status
            this.playType = '.aac';
            if (envi.isAndroid()) {
                this.playType = '.amr';
            }
            data.TopicProfileList.map(function (item)
            {
                if (item.type == 'audio') {
                    /* if is mp3, do nothing, else change the url to play type*/
                    if (!/(\.mp3)/.test(item.url)) {
                        that.list.push(item.url.replace(/(\.amr)|(\.aac)/ig, '') + that.playType);
                        return;
                    }
                    that.list.push(item.url);
                }
            });
            that.current = that.list[0];
            this.status = 'stop';
            this.initPlayerListener();
        },
        /* auto do play or pause action*/
        action: function ()
        {
            this.status == 'playing'
                ? this.pause()
                : this.play();
        },
        /* play record*/
        play: function ()
        {
            if (this.player.currentSrc != this.current) {
                this.player.src = this.current;
            }
            this.player.play();
            this.status = 'playing';
            $('.c-audio').addClass('on');
        },
        /* stop record*/
        pause: function ()
        {
            this.player.pause();
            this.status = 'pause';
            $('.c-audio').removeClass('on');
        },
        /* get playing status*/
        getStatus: function ()
        {
            return this.status;
        },
        /* init player listener*/
        initPlayerListener: function ()
        {
            var that = this;
            try {
                that.player.addEventListener('ended', function ()
                {
                    var _index;
                    /* get the index of current playing url*/
                    that.list.forEach(function (item, index)
                    {
                        if (that.current == item) {
                            _index = index;
                        }
                    });
                    /* if last, stop and direct to the first*/
                    if (_index == that.list.length - 1) {
                        that.pause();
                        that.current = that.list[0];
                        that.status = 'stop';
                    } else {
                        /* else get the next audio */
                        that.current = that.list[_index + 1];
                        that.play();
                        that.status = 'playing';
                    }
                }, false);
            } catch (error) {
                console.log(error);
            }
        },
    },

    initAnalyze: function ()
    {
        analyze.addBaiduStatistic();
    },

};

module.exports = topicIntro;
