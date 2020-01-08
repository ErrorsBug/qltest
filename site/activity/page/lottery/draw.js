require('zepto');
require('tapon');

var Handlebars = require('handlebars');

var fastClick = require('fastclick');
// var lazyimg = require('lazyimg');
// var model = require('model');
// var validator = require('validator');
// var Scrollload = require('scrollload_v3');
var toast = require('toast');
var urlUtils = require('urlutils');
// var envi = require('envi');
// var wxutil = require('wxutil');
var conf = require('../conf');
var dialog = require('dialog');


// var freeChannelId = '230000541016246'
// var chargeChannelId = '230000493021827'

// // var apiPrefix = 'https://m.test3.qlchat.com'
// var apiPrefix = 'https://test.m.test3.qlchat.com'


var tpls = {
    lotteryResult: __inline('./tpl/lottery-result.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './draw.scss'
 */

var draw = {
    // 是否可以抽奖
    drawable: true,
    // 中奖的优惠码
    code: -1,
    init: function () {
        this.initListeners()
        // this.recordLog('visit')
        this.getConfig()
        // this.setTracePage()
        // window.onload = this.loadLongImage()
        this.initShare = this.initShare.bind(this)
        setTimeout(this.initShare, 1000)

        // $(".modal").html(tpls.lotteryResult({
        //     flag: 5,
        //     money: 5,
        // })).show();

    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        // 购买按钮击事件
        // $('body').on('click', '#order-channel', function (e) {
        //     location.href = 'https://m.qlchat.com/live/channel/channelPage/240000552022354.htm?lshareKey=a108a88cf2c0f581e506defb57ed1128&orderNow=Y'
        // });

        $('body').on('click', '.draw-btn', function(e) {
            that.onDrawBtnClick(e);
        });

        $('body').on('click', '.join-btn', function(e) {
            var url = 'https://m.qlchat.com/live/channel/channelPage/240000552022354.htm?sourceNo=link&orderNow=Y&discode=' + that.code;
            var ch = urlUtils.getUrlParams('ch');
            if (ch) {
                url += '&ch=' + ch;
            }
            setTimeout(function() {
                window.location.href = url;
            }, 100);
        });

        $('body').on('click', '.close-btn,.bg', function(e) {
            that.onModalCloseBtnClick(e);
        });

        $('body').on('click', '.code-entry', function(e) {
            if (!window.localStorage.getItem('lottery_result')) {
                // toast.toast('您还未开始抽奖');
                $.dialog({
                    content: '请您抽奖获取优惠券',
                    callback: function(index) {

                    },
                    button: ['确定'],
                    cls: 'close-confirm'
                }, true);
                return;
            }

            var url = '/wechat/page/activity/lottery-code';
            var ch = urlUtils.getUrlParams('ch');
            if (ch) {
                url += '?ch=' + ch;
            }
            setTimeout(function() {
                window.location.href = url;
            }, 100);
        });

        $('.modal').on('touchmove', function(e) {
            e.preventDefault();
        });

        /* 点击关闭按钮和背景关闭modal */
        // $('body').on('click', '.modal .bg, .modal .close', function (e) {
        //     that.toggleGiftModal(false)
        // });

        /* 点击modal内容去往免费频道 */
        // $('body').on('click', '#gift-modal .content', function (e) {
        //     that.toggleGiftModal(false)
        //     location.href = 'https://m.test3.qlchat.com/live/channel/channelPage/' + freeChannelId + '.htm?orderNow=Y'
        // });

        // $('body').on('click', '#button-share', function () {
        //     $('#share-modal').show()
        // })
    },

    /* 加载长图 */
    // loadLongImage: function () {
    //     $('.long-pic > img').each(function (index, item) {
    //         var $item = $(item)
    //         $item.attr('src', $item.data('src'))
    //     })
    // },
    /**
     * 抽奖按钮点击处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onDrawBtnClick: function(e) {

        if (window.localStorage.getItem('lottery_result')) {
            $.dialog({
                content: '您已抽中，在『我的优惠券』查看',
                callback: function(index) {

                },
                button: ['确定'],
                cls: 'close-confirm'
            }, true);

            return;
        }

        if (!this.drawable) {
            return false;
        }

        this.drawable = false;
        this.beginDraw();
    },
    onModalCloseBtnClick: function(e) {
        // $.dialog({
        //     content: '放弃本次抽奖优惠券？',
        //     callback: function(index) {
        //         if (index === 1) {
        //             $('.modal').hide();
        //         }
        //     },
        //     button: ['取消', '确定'],
        //     cls: 'close-confirm'
        // }, true);

        $('.modal').hide();
    },

    beginDraw: function() {
        // 起始位置
        this.index = parseInt(Math.random() * 7);
        // 中奖位置id
        this.prize = -1;
        // 初始转动次数（转动多少次开始抽奖）
        this.minRollNum = 40;
        // 当前转动次数
        this.times = 0;
        // 转动速度
        this.speed = 200;
        // 定时器指针
        this.timer = 0;
        // 是否已生成抽奖结果
        this.prizeGenerated = false;
        // 转盘停卡回调
        this.onStop = function() {
            // console.log('中奖id为：', this.prize);
            this.showLotteryResult(this.prize);
        };

        // 生成中奖id
        this.generatePrize = function() {
            // this.prize = 5;
            this.randPrize();
        }

        // 开始转盘
        this.roll();

    },
    /**
     * 获取抽奖结果
     * @return {[type]} [description]
     */
    randPrize: function() {
        var that = this;
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/lottery/rand',
            timeout: 10000,
            data: { },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if (res.state && res.state.code === 0) {
                    that.prize = res.data.id;
                    that.code = res.data.code;
                } else {
                    that.stopRoll();
                    toast.toast(res.state && res.state.msg || '抽奖失败，请稍后重试', 1000, 'middle');
                }
            },
            error: function (err) {
                console.error(err);
                toast.toast('抽奖失败，请稍后重试', 1000, 'middle');
                that.stopRoll();
            },
        });
    },
    stopRoll: function() {
        // 停止转盘
        clearTimeout(this.timer);

        // 重置转盘状态
        $('.lottery .item.active').removeClass('active');

        // 可抽奖
        this.drawable = true;
    },
    /**
     * 转盘滚动
     * @return {[type]} [description]
     */
    roll: function() {
        var that = this;
        var $gifts = $('.lottery .item');
        var giftNums = $gifts.length;

        // 还未开始转动时，指定起始转动位置
        if (!$('.lottery .item.active').length) {
            $($gifts[this.index]).addClass('active');

        // 转动中
        } else {
            $($gifts).removeClass('active');

            this.index = (this.index + 1) % 8;

            $($gifts[this.index]).addClass('active');
        }

        // 计算转动次数
        this.times++;


        // 开始抽奖
        if(this.times > this.minRollNum / 3 && !this.prizeGenerated) {
            this.prizeGenerated = true;
			this.generatePrize();
        }

        // 到达中奖位置，停下来
        if (this.times > this.minRollNum + 15 && String($($gifts[this.index]).attr('data-id')) === String(this.prize)) {
            clearTimeout(this.timer);
            setTimeout(function() {
                that.onStop();
                that.drawable = true;
            }, 300);

            return;

        // 还未到最少转动次数，加速
        } else if (this.times < this.minRollNum) {
			this.speed -= 10;

        // 超过了最少转动次数，且已经标记了中奖位置，开始减速
        } else if (this.prize > -1 || this.times > 150) {
            // 如果下一个就是中奖位置，则速度降到最低
			if (this.times > this.minRollNum + 15 && $($gifts[(this.index + 1) % 8]).attr('data-id') === this.prize) {
				this.speed += 110;
            // 只有在标记了中奖位置后才减速多一点
			} else if (this.prize > -1 ){
				this.speed += 20;
            // 还未标记中奖位置，减速2
			} else {
                this.speed += 2;
            }
		}

        // 限制最快速度
		if (this.speed < 40) {
			this.speed = 40;
		};

		// console.log(this.times + '^^^^^^' + this.speed + '^^^^^^^' + this.prize, $($gifts[this.index]).attr('data-id'));
		this.timer = setTimeout(function() {
            that.roll();
        }, this.speed);
    },

    /* 切换弹窗显示状态 */
    toggleGiftModal: function (status) {
        status ? $('#gift-modal').show() : $('.modal').hide()
    },

    showLotteryResult: function(prizeId) {
        var flag = $('.lottery .item.active[data-id="' + prizeId + '"]').first().attr('data-flag');
        var money;

        switch(flag) {
            case '5':
                money = 5;
                break;
            case '10':
                money = 10;
                break;
            case '20':
                money = 20;
                break;
            case '99':
                money = 99.9;
                break;
        }

        if (window.localStorage) {
            window.localStorage.setItem('lottery_result', this.code + ',' + money);
        }

        $(".modal").html(tpls.lotteryResult({
            flag: flag,
            money: money,
        })).show();

        if (window._qla) {
            window._qla('event', {
                category: 'lottery_draw',
                action: 'success',
            });
        }
    },

    /* 打日志 */
    // recordLog: function (type) {
    //     $.ajax({
    //         type: 'POST',
    //         url: '/api/wechat/activity/log/increase',
    //         data: { type: type },
    //     })
    // },

    /* 获取微信配置 */
    getConfig: function () {
        var that = this;
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/config',
            data: { url: encodeURIComponent(location.href) },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if (res.data.config.statusCode == 200) {
                    that.initWechat(res.data.config)
                }
            },
            error: function (err) {
                console.error(err)
            },
        })
    },

    /* 初始化微信配置 */
    initWechat: function (config) {
        console.log(config)
        var that = this;
        if (window.wx) {
            var apiList = ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
                'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
            ];
            window.wx.config({
                debug: false,
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: apiList
            })
            window.wx.ready(function () {
                that.initShare()
            })
        }
    },

    /* 初始化微信分享 */
    initShare: function () {
        wx.hideAllNonBaseMenuItem();
    },
}

module.exports = draw;
