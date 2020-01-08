require('zepto');
require('zeptofix');
require('tapon');

var Handlebars = require('handlebars'),
    fastClick = require('fastclick'),
    dialog = require('dialog'),
    scrollload = require('scrollload'),
    urlutils = require('urlutils'),
    PayUtils = require('payutil'),
    toast = require('toast'),
    view = require('./view'),
    topicMsgHandle = require('./topic-msg-handle'),
    playMedia = require('./play-media'),
    model = require('model'),
    conf = require('../conf'),
    getMsg = require('./get-msg'),
    postMsg = require('./post-msg'),
    pptModule = require('./ppt-module'),
    imgView = require('./img-view'),
    pptBox = require('./slider');

var tpls = {
    msgDialog: __inline('./tpl/msg-dialog.handlebars'),
};

var qlCommon = require('../../comp/common-js/ql-common');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../components_modules/fonts/style.css'
 * @require './thousand-live.css'
 */

var thousandLive = {
    init: function (initData) {
        this.tagId = urlutils.getUrlParams('tagId');

        this.initData = initData;
        this.topicId = initData.topicPo.id;
        this.liveId = initData.topicPo.liveId;
        // 页面初始化
        this.render();

        // 事件初始化
        this.initListeners();

        // 支付初始化
        this.payUtils = new PayUtils();

        this.payUtils.getPayResult(function (result) {
            console.log(result);
            if (result.tag === 'DOC') {
                toast.toast('文件支付成功', null, 'middle');
                // toast.toast(result.state.msg, null, 'middle');
            } else if (result.tag === 'REWARD') {
                toast.toast('打赏成功', null, 'middle');
                // window.location.reload();
            }
        });
        // 下拉加载更多功能开启
        // this.enableScrollLoad();
    },

    /*
    *变量区
    */

    isBarrageShow: false,
    iscommentStart: true,


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


        // 初始化滚屏事件
        // $(window).on('scroll', function (e) {
        //     view.autoShowBtnToTop();
        //     view.autoFixedHeadMenu();
        // });

        // 底部tab切换事件
        $(document).on('click', '.tab-bar-ul li,.backContentBox', function (e) {
            that.tabBottom(e);
        });

        // 切换弹幕
        $(document).on('click', '.isdan-btn-new,.barrage-tab,.allcount.icoon-couple', function (e) {
            that.barrageTab(e);
        });

        /** **********************
            右侧菜单和操作区事件
        ************************/
        // 弹出和收起操作框
        $(document).on('click', '.btn-closeCBox,.caozuo-box .cbBg,.caozuo-cancel-btn', function (e) {
            that.hideControlBox(e);
        });
        $('.controlBox').click(that.showControlBox);

        // 新消息自动播放
        $(document).on('click', '#btnAutoPlay', function () {
            that.autoPlaySet();
        });

        $(document).on('click', '.btn-follow-live', function (e) {
            that.followLive(e);
        });

        $(document).on('click', '.create-live', function (e) {
            e.preventDefault();
            that.creatLive(e);
        });


        /** **********************
                评论区事件
        ************************/
        // 切换显示评论区
        $(document).on('click', '.tabToComment, .danmulist dd', function (e) {
            that.tabComment(e);
        });
        $('.commentHeader').click(function (e) {
            that.hideComment(e);
        });

        // 显示评论管理按钮
        $(document).on('click', '.commentManage', function (e) {
            that.showCmtMange(e);
        });

        // 输入框切换状态
        $('#student-comment .input-box').focus(function () {
            $('#student-comment').addClass('on');
        });
        $('#student-comment .input-box').blur(function () {
            $('#student-comment').removeClass('on');
            if (that.initData.powerEntity.allowSpeak && that.initData.topicPo.status !== 'ended') {
                $('#student-comment').hide();
            }
        });

        // 提问按钮
        $('.cb-top .btn-ask,.bottom-content-area .btn-ask').click(function () {
            $(this).toggleClass('on');
        });

        $('.bottom-content-area .area-placeholder').click(function () {
            $(this).parents('.bottom-content-area').find('.input-box').focus();
        });

        // 评论框自动高度
        $('.bottom-content-area .input-box').focus(function (e) {
            that.commentInputFocus(e);
        }).blur(function (e) {
            that.commentInputBlur(e);
        });

        // 评论发言
        $(document).on('click', '.newCommentBox .submit', function (e) {
            that.postComent(e);
        });

        // 删除评论
        $(document).on('click', '.delCommentMsg', function (e) {
            that.delCommentMsg(e);
        });
        // 隐藏删除评论
        $(document).on('click', '#commentDl dd', function (et) {
            if (et.target.className != 'commentManage') {
                $('.commentManageTab').hide();
            };
        });


        /** **********************
                ppt
        ************************/




        // 红包
        //  赞赏
        $(document).on('click', '.btn-ilike', function (e) {
            that.showRedBag(e);
        });
        $(document).on('click', '.qlbmi-redbag-cancel', function (e) {
            that.hideRedBag(e);
        });

        $(document).on('click', '.live-othermoney', function () {
            $('.otherRedmoneyBox').show();
        }).on('click', '.otherRedmoneyBox', function (et) {
            if (et.target.className == 'redbag_count-label' || et.target.className == 'money-count' || et.target.className == 'gene-btn gene-confirm') {
                return false;
            };
            $('.otherRedmoneyBox').hide();
        });

        $(document).on('click', '.live-redbaglist li', function (e) {
            that.luckyMoneyPay(e);
        });

        $(document).on('click', '.luckyMoney .lm-main', function (e) {
            that.luckyMoneyMsgShow(e);
        });

        $(document).on('click', '.otherRedmoneyBox .gene-confirm', function (e) {
            that.luckyMoneyPayOther(e);
        });


        // 图片预览
        $(document).on('click', '#speakBubbles .bubble-content img,#ppt-slider img', function () {
            var notGif = !(/.gif(@*)/.test($(this).attr('src')));
            // var isMobile = isiOSBoolean || isAndroidBoolean;
            var $image = $(this);
            if (false) {
                // viewImageByWechat($image);
            } else {
                imgView.viewImageByBrowser($image);
            }
        });

        $(document).on('click', '.gifShadow', function (e) {
            that.gifShow(e);
        });

        // 文件下载
        $(document).on('click', '.file-msg', function (e) {
            that.toDownload(e);
        });

        $('body').on('click', '.pptToggle', function (e) {
            $('#speakBox').toggleClass('hidePPT');
        });

        /* 系列课话题的主页图标点击事件*/
        $('body').on('click', '.tabTopMenu', function (e) {
            // 显示返回列表
            that.toggleTopMenu();
        });


        /* 引导图事件 */

        $(document).on('click', '.usestate-guide', function () {
            $('.usestate-guide').hide();
        });

        $(document).on('click', '.useStateBox', function (e) {
            that.showUseGuide(e);
        }).on('click', '.useStateBox .gtb-close', function (e) {
            that.guideFunction('INSTRUCTIONGUID', '.useStateBox', that.topicId);
        });

        /* 进入直播间按钮点击事件*/
        $('body').on('click', '#enter-live-btn', function () {
            that.onEnterLiveBtnClick();
        });

        /* 进入直播间checkbox点击事件*/
        $('body').on('click', '.enter-live-modal .focus-live-btn', function () {
            view.toggleFocus();
        });
    },

    /**
     * 根据初始数据初始化渲染页面
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:43:34+0800
     * @return   {[type]}                           [description]
     */
    render: function () {
        var that = this;
        // 初始化窗口
        that.initialization();

        // 音频播放初始化
        playMedia.powerEntity = that.initData.powerEntity;
        playMedia.topicPo = that.initData.topicPo;
        playMedia.init();

        // 发言和评论消息处理模块初始化
        topicMsgHandle.isAutoPlay = playMedia.isAutoPlay;
        topicMsgHandle.topicPo = that.initData.topicPo;
        topicMsgHandle.powerEntity = that.initData.powerEntity;
        topicMsgHandle.userPo = that.initData.userPo;
        topicMsgHandle.currentTimeMillis = that.initData.currentTimeMillis;

        getMsg.init(that.initData);
        postMsg.init(that.initData);

        if ($('.pptMode').length > 0) {
            pptModule.topicId = that.topicId;
            pptModule.pptLayerInit('Y', function (data) {
                that.pptReset(data);
            });
        };
    },

    /**
     * 初始化页面展示样式
     * @Author   dodomon
     * @DateTime
     * @return   {[type]}                           [description]
     */
    initialization: function () {
        var speakBox = $('#speakBox');
        if (this.initData.powerEntity.allowSpeak && this.initData.topicPo.status == 'beginning') {
            speakBox.addClass('hasTabBottom');
        }

        // 初始化菜单
        view.liveMenu(this.initData);

        // 初始化pptWindow
        view.getPPTData(this.initData);

        // 话题内容初始化
        view.topicPendants(this.initData);

        view.inviteList(this.initData.inviteList);

        this.initEnterTips();
    },

    /* 初始化关注直播间提示*/
    initEnterTips: function () {
        var status;
        if (this.initData.liveFollow) {
            status = this.initData.liveFollow.isFollow;
        }
        if (this.initData.topicPo.startTime > this.initData.currentTimeMillis && !status) {
            view.showEnterTips();
        }
        return;
    },

    /** 移除bottom其他class **/
    removeOtherBClass: function (classExcept) {
        var exceptThisClass = function (ce) {
            if (typeof (classExcept) == 'string' && classExcept == ce) {
                return '';
            } else {
                return ce;
            }
        };

        $('.speakBox').removeClass(exceptThisClass('textBottom'))
            .removeClass(exceptThisClass('voiceBottom'))
            .removeClass(exceptThisClass('mediaBottom'));
    },

    /** 底部tab菜单 **/
    tabBottom: function (e) {
        var that = this;
        var tabClass = $(e.currentTarget).attr('bottom-class');
        $('#speakBottom').removeClass('has-not-rec');
        that.removeOtherBClass(tabClass);
        switch (tabClass) {
            case 'voiceBottom':
                try { localStorage.setItem('firstRecord', 'Y'); $('.first-record').hide(); } catch (error) { }// 记录已录过语音
                // if(!$(".speakBox").hasClass("voiceBottom")){
                $('.speakBox').toggleClass('voiceBottom');
                // };
                break;
            case 'textBottom':
                if (!$('.speakBox').hasClass('textBottom')) {
                    $('.speakInput').focus();
                };
                $('.speakBox').toggleClass('textBottom');
                break;
            case 'mediaBottom':
                $('.speakBox').toggleClass('mediaBottom');
                break;
        }
    },


    /** **********************
    * 右侧菜单和操作区事件
    ************************/
    // 收起操作框
    hideControlBox: function (e) {
        $('.caozuo-box').removeClass('on');
        $('.speakContentBox').css('overflow', 'auto');
        $('.caozuo-box .czbox-main').animate({ maxHeight: '0' }, 300);
    },
    // 弹出操作框
    showControlBox: function () {
        $('.caozuo-box').addClass('on');
        $('.speakContentBox').css('overflow', 'hidden');
        $('.caozuo-box .czbox-main').animate({ maxHeight: '900px' }, 300);
    },

    autoPlaySet: function () {
        $('#btnAutoPlay').toggleClass('swon');
        if ($('#btnAutoPlay').hasClass('swon')) {
            playMedia.isAutoPlay = true;
            topicMsgHandle.isAutoPlay = true;
            localStorage.setItem('isAutoPlay', 'true');
        } else {
            playMedia.isAutoPlay = false;
            topicMsgHandle.isAutoPlay = false;
            localStorage.setItem('isAutoPlay', 'false');
        };
    },

    creatLive: function (e) {
        var $this = $(e.currentTarget);
        var that = this;
        var isWeibo = /weibo/.test(navigator.userAgent);
        if (!isWeibo) {
            window.location.href = $this.attr('href');
        } else {
            that.dialog = new dialog({
                title: '哎呀~',
                button: ['知道了'],
                content: '暂时无法在微博内创建直播间哦~请去微信服务号“千聊Live”或者应用市场下载“千聊”APP免费创建直播间。',

            });
            that.dialog.show();
        }
        console.log(isWeibo);
    },

    /* 显示顶部返回按钮*/
    toggleTopMenu: function () {
        $('.top-menu').toggleClass('on');
    },

    followLive: function (e) {
        var that = this;
        var $this = $(e.currentTarget);
        model.post(conf.api.doAttention, {
            status: true,
            liveId: that.initData.topicPo.liveId,
        }, function (result) {
            if (result.state.code === 0) {
                $this.hide();
                toast.toast('成功关注直播间', null, 'middle');
            } else {
                console.log(result);
            }
        });
    },


    /** **********************
    * 评论事件区
    ************************/
    // 切换弹幕
    barrageTab: function (e) {
        var that = this;
        var lastDanmu = function () {
            var lastDanmuHtml = '';
            if ($('.comment-dd').eq(0).length > 0 && $('.danmulist dd[attr-id=\'' + $('.comment-dd').eq(0).attr('attr-id') + '\']').length <= 0) {
                lastDanmuHtml += '<dd attr-id="' + $('.comment-dd').eq(0).attr('attr-id') + '" attr-time="' + $('.comment-dd').eq(0).attr('attr-time') + '"><i><img src="' + $('.comment-dd').eq(0).find('.avatar img').attr('src') + '"></i><p>' + $('.comment-dd').eq(0).find('.content').html() + '</p></dd>';
            };
            if ($('.comment-dd').eq(1).length > 0 && $('.danmulist dd[attr-id=\'' + $('.comment-dd').eq(1).attr('attr-id') + '\']').length <= 0) {
                lastDanmuHtml += '<dd attr-id="' + $('.comment-dd').eq(1).attr('attr-id') + '" attr-time="' + $('.comment-dd').eq(0).attr('attr-time') + '"><i><img src="' + $('.comment-dd').eq(1).find('.avatar img').attr('src') + '"></i><p>' + $('.comment-dd').eq(1).find('.content').html() + '</p></dd>';
            };
            if ($('.comment-dd').eq(2).length > 0 && $('.danmulist dd[attr-id=\'' + $('.comment-dd').eq(2).attr('attr-id') + '\']').length <= 0) {
                lastDanmuHtml += '<dd attr-id="' + $('.comment-dd').eq(2).attr('attr-id') + '" attr-time="' + $('.comment-dd').eq(0).attr('attr-time') + '"><i><img src="' + $('.comment-dd').eq(2).find('.avatar img').attr('src') + '"></i><p>' + $('.comment-dd').eq(2).find('.content').html() + '</p></dd>';
            };
            $('.danmulist').append(lastDanmuHtml);
        };// 此处待优化

        if (that.isBarrageShow) {
            that.isBarrageShow = false;
            $('.barrage-control').removeClass('on');
            $('.black-bar .btn-tab-1').addClass('icon-back-2').removeClass('icon-enter-2');
            $('.danmuBox').hide();
            $('.danmulist').html('');
        } else {
            that.isBarrageShow = true;
            lastDanmu();
            $('.barrage-control').addClass('on');
            $('.black-bar .btn-tab-1').addClass('icon-enter-2').removeClass('icon-back-2');
            $('.danmuBox').show();
        }
    },
    // 显示讨论框
    tabComment: function (e) {
        var that = this;
        var showComment = function () {
            $('.commentBox').show();
            $('.commentBox').addClass('isShow');
            $('.tabToComment').removeClass('on');
            $('#student-comment').hide();
        };
        if (that.iscommentStart) {
            getMsg.getComment(getMsg.loadDataTime, showComment);
        } else {
            showComment();
        }
    },
    // 隐藏讨论框
    hideComment: function () {
        var that = this;
        $('.commentBox').hide();
        $('.commentBox').removeClass('isShow');
        if (!that.initData.powerEntity.allowSpeak || that.initData.topicPo.status === 'ended') {
            $('#student-comment').show();
        }
    },
    // 显示删除评论控制框
    showCmtMange: function (e) {
        var $btnCmt = $(e.currentTarget);
        $('.commentManageTab').hide();
        $btnCmt.find('.commentManageTab').show();
    },

    // 发表评论
    postComent: function (e) {
        var $this = $(e.currentTarget);
        if ($('.caozuo-shutup.on').length > 0) {
            // alertMsg("直播间开启了禁言模式");
            return false;
        } else if ($('.bottom-content-area.disabled').length > 0) {
            // alertMsg("您已被禁言");
            return false;
        };
        var isQuestion = 'N';
        if ($('.newCommentBox .btn-ask').hasClass('on')) {
            isQuestion = 'Y';
        }

        var commentContent = $this.parents('.bottom-content-area').find('.input-box').val().trim();

        postMsg.postComment('text', commentContent, isQuestion);
    },
    // 评论框自动高度
    commentInputFocus: function (e) {
        var $this = $(e.currentTarget);
        $('.bottom-content-area .area-placeholder').hide();
        $this.css('max-height', '75px');
    },
    commentInputBlur: function (e) {
        var $this = $(e.currentTarget);
        $this.css('max-height', '35px');
        if ($this.val() === '') {
            $('.bottom-content-area .area-placeholder').show();
        }
    },
    delCommentMsg: function (e) {
        var $this = $(e.currentTarget);
        commentId = $this.parents('dd').attr('attr-id');
        createBy = $this.parents('dd').attr('attr-createby');

        this.dialog = new dialog({
            button: ['取消', '确定'],
            content: tpls.msgDialog({ msg: '确定删除吗？' }),
            callback: function (index) {
                if (index == 1) {
                    postMsg.delComment(commentId, createBy);
                }
            },

        });
        this.dialog.show();
    },


    /** **********************
    * PPT
    ************************/
    pptReset: function (data) {
        var that = this;
        if ($('.pptMode').length > 0) {
            pptBox.init(data.files, '#ppt-window', '@450h_800w_4e_2o_1l_0-0-0bgc', 300, -1, false);
            setTimeout(function () {
                if (that.initData.topicPo.status == 'ended' && $('#ppt-window [data-id]').length > 0) {
                    pptBox.jumpToSlide(1);
                } else if (that.initData.topicPo.status != 'ended' && $('#ppt-window [data-id]').length > 0) {
                    var pptIndex = $('#ppt-slider [data-fileid]').last().index();
                    pptBox.jumpToSlide(pptIndex);
                };
                $('.btn-cancel-ppt').click(function () {
                    if ($('#ppt-slider .slide').length > 0) {
                        // $(document).popBox({
                        // 	topContent: "删除素材",
                        // 	boxContent: "是否确定撤回图片",
                        // 	btnType: "both",
                        // 	confirmFunction: cancelPPT
                        // });
                    };
                });
            }, 500);
        }
    },


    /** **********************
    * 红包区
    ************************/
    showRedBag: function (e) {
        var that = this;
        var $this = $(e.currentTarget);
        // 赞赏支付口
        that.toUserId = $this.parents('dd').attr('attr-createby');
        that.toUserName = $this.parents('dd').find('.speaker-name b').text();
        var userImg = $this.parents('dd').find('.head-portrait img').attr('src');
        $('.live-headpic img').attr('src', userImg);
        $('.live-towho').text(that.toUserName);

        var priceArr = $('.live-redbaglist ul').data('price').split(';');

        for (i = 0; i < priceArr.length; i++) {
            $('.live-redbaglist var.rglist').eq(i).text(priceArr[i]);
        };
        playMedia.rememberLastReaded($this.parents('dd').attr('attr-time'), $this.parents('dd').attr('attr-id'));
        qlCommon.qlSlBoxShow('.redbagBox');
    },
    hideRedBag: function (e) {
        var $this = $(e.currentTarget);
        $this.parents('.qlMsgTips').hide();
    },
    luckyMoneyPay: function (e) {
        var that = this;
        var $this = $(e.currentTarget);
        var money = Number($this.find('var').text());
        // if(Number(pagemoney)<2){
        //     $(document).minTipsBox({
        //         tipsContent:"请输入大于2的金额",
        //         tipsTime:1
        //     });
        //     return false;
        // }else if(Number(pagemoney)>1000){
        //     $(document).minTipsBox({
        //         tipsContent:"请输入小于1000的金额",
        //         tipsTime:1
        //     });
        //     return false;
        // };
        money = money * 100;
        that.liveLuckyMoney(money, that.toUserId);
    },
    luckyMoneyPayOther: function (e) {
        var that = this;
        var money = Number($('.money-count').val());
        if (money === '') {
            toast.toast('金额不能为空', null, 'middle');
            return false;
        } else if (!/(^[0-9]*\.[0-9]*$)|(^[0-9]*$)/.test(money)) {
            toast.toast('请输入数字!', null, 'middle');
            return false;
        } else if (Number(money) < 2) {
            toast.toast('请输入大于2的金额', null, 'middle');
            return false;
        } else if (Number(money) > 1000) {
            toast.toast('请输入小于1000的金额', null, 'middle');
            return false;
        };
        money = (money * 100).toFixed(0);
        that.liveLuckyMoney(money, that.toUserId);
        $('.otherRedmoneyBox').hide();
    },
    liveLuckyMoney: function (money, toUserId) {
        var that = this;
        that.payUtils.doPay({
            tag: 'REWARD',
            params: {
                toUserId: toUserId,
                topicId: that.topicId,
                total_fee: money,
                type: 'REWARD',
                userId: that.initData.userPo.id,
            },
        });
    },

    luckyMoneyMsgShow: function (e) {
        var that = this;
        var $this = $(e.currentTarget);
        $('.LmTipsBox').attr('attr-id', $this.parent().attr('attr-id'));
        $('.live-headpic img').attr('src', $this.attr('attr-imgUrl'));
        $('.thank-money var').text(Number($this.attr('attr-money')));
        var response = $this.attr('attr-response');
        var whogive = $this.find('var').eq(0).text();
        var whoget = $this.find('var').eq(1).text();
        $('.replyresult .r1').text(whoget);
        $('.replyresult .r2').text(whogive);
        $('.LmTipsBox .live-towhy').text(whogive + '赞赏了' + whoget);
        if (response != '' && response != 'null' && response != 'undefined') {
            if (response == 'baobao') {
                $('.replyresult .r3').text('拥抱');
            } else if (response == 'loveyou') {
                $('.replyresult .r3').text('握手');
            } else if (response == 'meme') {
                $('.replyresult .r3').text('么么哒');
            };
            $('.replyresult').addClass('on').show();
            $('.thankBox').removeClass('on').hide();
        } else {
            $('.replyresult').removeClass('on').hide();
            if ($this.attr('attr-myself') == 'true') {
                $('.LmTipsBox .live-towhy').text(whogive + '赞赏了你');
                $('.thankBox').addClass('on').show();
                $('.rgdetail').show();
            } else {
                $('.replyresultNone').addClass('on').show();
            };
        };
        if (that.initData.powerEntity.allowMGLive || $this.attr('attr-myself') == 'true') {
            $('.rgdetail').show();
            $('.redbag-rule-2').show();
            if ($this.attr('attr-myself') == 'true') {
                $('.redbag-rule-2').hide();
                $('.redbag-rule-3').show();
            }
        }
        $('.thank-money').show();
        if ($this.attr('attr-money') == '' || $this.attr('attr-money') == 'null' || $this.attr('attr-money') == undefined) {
            $('.thank-money').hide();
        }
        qlCommon.qlSlBoxShow('.LmTipsBox');
    },

    /** **********************
    * 文件区
    ************************/
    toDownload: function (e) {
        var $this = $(e.currentTarget);
        var that = this;
        var $section = $this.find('section');
        FileSection = $section;
        var money = String($section.attr('data-charge'));
        var docId = $section.attr('data-docid');
        if ($section.attr('data-haspay') === 'true' || $section.attr('data-charge') === '0') {
            model.fetch(
                {
                    type: 'POST',
                    url: conf.api.addStat,
                    data: {
                        docId: docId,
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (err) {

                    },
                });
        }
        else {
            that.payUtils.doPay({
                tag: 'DOC',
                params: {
                    topicId: that.topicId,
                    total_fee: money,
                    type: 'DOC',
                    docId: docId,
                    userId: that.initData.userPo.id,
                },
            });
        }
    },
    showUseGuide: function (e) {
        var $this = $(e.target);
        if (!$this.hasClass('gtb-close')) {
            if (!$('.usestate-guide img').attr('src')) {
                $('.usestate-guide img').attr('src', $('.usestate-guide').attr('attr-src'));
            }
            $('.usestate-guide').show();
        }
    },

    guideFunction: function (key, whichBox, topicId) {
        var that = this;
        var type = 'LIVE';
        $('.useStateBox').hide();
        if (key == 'PASSWORDGUID' || key == 'INVITEGUID' || key == 'INSTRUCTIONGUID') {
            type = 'TOPIC';
        }
        model.fetch(
            {
                type: 'POST',
                url: conf.api.saveGuide,
                data: {
                    key: key,
                    topicId: that.topicId || '',
                    type: type,
                    isEnable: 'N',
                    liveId: that.liveId,
                },
                success: function (data) {
                    $('.geneBox').hide();
                    $(whichBox).hide();
                    toast.toast(data.msg, null, 'middle');
                },
                error: function (err) {

                },
            });
    },
    gifShow: function (e) {
        var $shadow = $(e.currentTarget);
        var $image = $shadow.next();
        var url = $image.attr('src');
        var src = url.replace(/@.*/, '');
        $image.attr('src', src);
        $shadow.remove();
    },

    /* 关注直播间按钮点击事件*/
    focus_sending: false,
    onEnterLiveBtnClick: function () {
        var that = this;
        var params = {
            status: $('.enter-live-modal .focus-live-btn').hasClass('on') ? true : false,
            liveId: that.initData.topicPo.liveId,
        };
        if (!params.status) {
            view.hideEnterTips();
            return;
        }
        if (!that.focus_sending) {
            that.focus_sending = true;
            model.post(
                conf.api.doAttention,
                params,
                function (result) {
                    if (result.state.code === 0 &&params.status) {
                        toast.toast('已成功关注直播间');
                    } else {
                        toast.toast(result.state.msg);
                    }
                    view.hideEnterTips();
                    that.focus_sending = false;
                }, function (err) {
                    view.hideEnterTips();
                    that.focus_sending = false;
                });
        }
    },
};


module.exports = thousandLive;
