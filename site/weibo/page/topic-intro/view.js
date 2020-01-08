var Handlebars = require('handlebars');

var tpls = {
    headers: __inline('./tpl/headers.handlebars'),
    others: __inline('./tpl/other-sections.handlebars'),
    rank: __inline('./tpl/share-rank.handlebars'),
    modals: __inline('./tpl/modals.handlebars'),
    footers: __inline('./tpl/footers.handlebars'),
    chargeSheet: __inline('./tpl/charge-sheet.handlebars'),
};

var toast = require('toast');
var Payutil = require('payutil');
var Actionsheet = require('actionsheet');
var model = require('model');
var conf = require('../conf');

require('hbardateformat');
require('hbarcompare');
require('hbarimgformat');
require('hbardefaultVal');
require('../../comp/default-img/default-img');

var $container = $('#container');
var $main = $('#main');

var conditions = {};
var processings = {};

var view = {
    /* put some usual conditions in an object*/
    initConditions: function (data)
    {
        /* ---------------- headers conditions - start ---------------- */
        /* see if is channel topic*/
        conditions.isSingleBuy = data.topicView.topicExtendPo.isSingleBuy == 'Y' ? true : false;

        conditions.isChannel = (data.topicView.topicPo.channelId != null && data.topicView.topicPo.channelId != 'null');
        // conditions.isChannel = data.topicView.topicPo.channelId !=null;
        conditions.isShareOpen = data.topicView.topicExtendPo.isShareOpen == 'Y';
        conditions.isRelay = data.topicView.topicPo.isRelay == 'Y';
        conditions.isAuth = data.isAuth;
        /* is c end*/
        conditions.isC = !(data.power.powerEntity.allowMGLive || data.power.powerEntity.allowSpeak);
        /* if topic has intro info,show sharecard*/
        conditions.showIntro = (data.topicView.topicPo.speaker && data.topicView.topicPo.speaker != '')
            || (data.topicView.topicPo.guestIntr && data.topicView.topicPo.guestIntr != '')
            || (data.topicView.topicPo.remark && data.topicView.topicPo.remark != '')
            || (processings.image.length > 0);
        /* show sharecard or not*/
        /* to complete sharekey*/
        conditions.showSharecard = !conditions.isChannel && (
            (data.topicView.topicPo.type == 'charge' && data.topicView.topicPo.isRelay != 'Y') ||
            (data.topicView.topicPo.type != 'charge' && conditions.isShareOpen)
        );
        /* has image/audio or not*/
        conditions.hasImage = processings.image.length > 0;
        conditions.hasAudio = processings.audio.length > 0;
        /* ----------------- headers conditions - end ----------------- */


        /* ---------------- bottom button show conditions - start ---------------- */
        /* @type public*/
        conditions.c_public = data.topicView.topicPo.type == 'public' && conditions.isC;
        conditions.c_public_auth = data.isAuth.isAuth && !conditions.isChannel;
        conditions.c_public_notAuth = conditions.c_public && !data.isAuth.isAuth && !conditions.isChannel;
        /* @type encrypt*/
        conditions.c_encrypt = data.topicView.topicPo.type == 'encrypt' && conditions.isC;
        conditions.c_encrypt_auth = conditions.c_encrypt && data.isAuth.isAuth && !conditions.isChannel;
        conditions.c_encrypt_notAuth = conditions.c_encrypt && !data.isAuth.isAuth && !conditions.isChannel;
        /* @type charge*/
        conditions.c_charge = data.topicView.topicPo.type == 'charge' && conditions.isC;
        conditions.c_charge_auth = conditions.c_charge && data.isAuth.isAuth && !conditions.isChannel;
        conditions.c_charge_notAuth = conditions.c_charge && !data.isAuth.isAuth && !conditions.isChannel;
        /* @type channel*/
        // conditions.free_channel = conditions.isChannel && data.channel.chargeConfigs[0] == 0;
        conditions.channel_charge = conditions.isChannel;
        conditions.channel_charge_notAuth = conditions.isChannel && !data.isAuth.isAuth;
        conditions.channel_charge_auth = conditions.isChannel && data.isAuth.isAuth;

        if (conditions.isChannel && data.channel) {
            var charge = 0;
            if (data.channel && data.channel.chargeConfigs) {
                conditions.channelCharge = data.channel.chargeConfigs.map(function (item)
                {
                    if (item.amount > charge) {
                        charge = item.amount;
                    }
                });
            }
            conditions.channelCharge = '￥' + charge;
            if (data.channelCoupon) {
                conditions.hasChannelCoupon = data.channelCoupon.isHaveCoupon;
            }
            if (conditions.hasChannelCoupon) {
                conditions.channelCoupon = data.channelCoupon.qlCouponMoney;
            }
            conditions.channelRealCharge = conditions.hasChannelCoupon
                ? conditions.channelCharge - conditions.channelCoupon
                : conditions.channelCharge;
            if (data.channel.channel.chargeType == 'flexible') {
                var chargeStr = '';
                data.channel.chargeConfigs.map(function (item, index)
                {
                    if (index < 2) {
                        chargeStr += '、￥' + item.amount + '/' + item.chargeMonths + '月';
                    }
                });
                conditions.channelRealCharge = chargeStr.slice(1);
                if (data.channel.chargeConfigs.length > 2) {
                    conditions.channelRealCharge += '...';
                }
            }
        }

        /* todo: complete, now isShareAuth and isSHareFree lack*/
        if (data.qualify.shareQualify) {
            conditions.mate = conditions.isShareOpen &&
                data.qualify.shareQualify.status == 'Y';
        }
        conditions.hasCoupon = data.coupon.qlCouponMoney && data.coupon.qlCouponMoney != 0;
        conditions.pay_class = (conditions.hasCoupon && data.coupon.diffNum <= 0)
            ? 'pay-enter'
            : 'pay';
        conditions.text_class = conditions.hasCoupon ? 'innerText' : '';
        conditions.sharekey = (data.sharekey && data.sharekey != '') ? data.sharekey : false;
        /* todo: complete when sharekey access*/
        conditions.charge_href = !(conditions.hasCoupon && data.coupon.diffNum <= 0)
            ? 'javascript:;'
            : (sharekey ? CtxPath + '/wechat/page/topic-intro?topicId=' + data.topicView.topicPo.id + '&shareKey=' + data.shareKey : CtxPath + '/topic/details?topicId=' + data.topicView.topicPo.id );
        conditions.topicCharge = data.topicView.topicPo.money / 100;
        conditions.topicRealCharge = conditions.hasCoupon
            ? Number(data.coupon.diffNum) / 100
            : conditions.topicCharge;
        /* ----------------- bottom button show conditions - end ----------------- */
    },
    /* put some processed data in an object*/
    initProcessings: function (data)
    {
        /* ----------- get image profile and audio profile ----------- */
        var audio = [];
        var image = [];
        for (var i = 0; i < data.profile.TopicProfileList.length; i++) {
            if (data.profile.TopicProfileList[i].type == 'audio') {
                audio.push(data.profile.TopicProfileList[i]);
            }
            if (data.profile.TopicProfileList[i].type == 'image') {
                image.push(data.profile.TopicProfileList[i]);
            }
        }

        processings.audio = audio;
        processings.image = image;
    },

    /* append other info to conditions*/
    appendConditions: function (data)
    {
        /* ---------------- subscription - start ---------------- */
        conditions.show_subscription = data.live.entity.subscriptionName
            && data.topicView.topicPo.type == 'encrypt'
            && !(conditions.isChannel && conditions.isSingleBuy);
        /* ----------------- subscription - end ----------------- */

        /* ---------------- price section - start ---------------- */
        conditions.show_price = !(conditions.isChannel || conditions.isSingleBuy) &&
            data.topicView.topicPo.type == 'charge';
        conditions.coupon_access = !data.power.powerEntity.allowSpeak
            && data.isAuth.isAuth
            && data.topicView.topicPo.isRelay != 'Y';
        /* complete:sharekey*/
        conditions.coupon_access_link = data.shareKey
            ? CtxPath + '/wechat/page/coupon-code/exchange/topic/' + data.topicView.topicPo.id + '?shareKey=' + data.shareKey
            : CtxPath + '/wechat/page/coupon-code/exchange/topic/' + data.topicView.topicPo.id;
        conditions.coupon_settings = data.power.powerEntity.allowMGLive
            && data.topicView.topicPo.isRelay != 'Y';

        conditions.whatsthisTimeStamp = (new Date(2016, 06, 01, 01, 22, 12)).getTime();
        conditions.startTimeStamp = Number(data.topicView.topicPo.startTime);
        conditions.show_joinMember = (conditions.startTimeStamp > conditions.whatsthisTimeStamp)
            && (data.power.powerEntity.allowMGLive || data.topicView.topicExtendPo.isAuthOpen == 'Y')
            && data.joinMember.userList.length > 0;
        // todo:complete - shareauth
        conditions.joinMember_list_link = (!conditions.isC || data.isShareAuth)
            ? CtxPath + '/live/payPeople/' + data.topicView.topicPo.id + '.htm'
            : 'javascript:;';
        /* ----------------- price section - end ----------------- */

        /* ---------------- liveroom section - start ---------------- */
        conditions.liveroom_img = data.live.entity.logo
            ? data.live.entity.logo
            : 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
        conditions.show_focus_btn = !data.power.powerEntity.allowMGLive;
        conditions.focused = (data.isFollow && data.isFollow.isFollow) || 'Y';

        conditions.isLiveV = data.live.entityExtend.isLiveV == 'Y';
        conditions.isLiveT = data.live.entityExtend.isLiveT == 'Y';
        conditions.isLiveAuth = conditions.isLiveT || conditions.isLiveV;
        /* ----------------- liveroom section - end ----------------- */

        /* ---------------- push and relay section - start ---------------- */
        conditions.setPush = data.topicView.topicExtendPo.isAutoShareOpen == 'Y'
            // todo:complete when sharekey and isshareauth accesss
            || (data.topicView.topicPo.type == 'charge' && data.isShareAuth && data.shareKey);
        conditions.show_relay = data.power.powerEntity.allowMGLive
            && data.topicView.topicPo.isRelay == 'Y'
            && !isChannel;
        /* ----------------- push and relay section - end ----------------- */

        /* ---------------- share rank - start ---------------- */
        conditions.show_sharerank = !conditions.isChannel
            && conditions.isShareOpen
            && data.topicView.topicPo.type != 'charge';
        conditions.hasShareList = data.shareMember.shareUserList
            && data.shareMember.shareUserList.length > 0;

        /* ----------------- share rank - end ----------------- */
    },
    /* append other info to processings*/
    appendProcessings: function (data)
    {
        processings.joinMember = data.joinMember.userList.splice(0, 5);
        var shareList = (data.shareMember.shareUserList||[]).splice(0, 5);
        shareList.map(function (item)
        {
            if (item.userHeadUrl) {
                if (item.userHeadUrl.indexOf('wx.qlogo.cn/mmopen') > 0) return;
            } else {
                item.userHeadUrl = 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png';
            }
        });
        processings.shareMember = shareList;
    },

    /* update header infomation*/
    updateHeaders: function (data)
    {
        this.initProcessings(data);
        this.initConditions(data);

        /* render html */
        $main.append(tpls.headers({
            topicView: data.topicView,
            power: data.power,
            profile: data.profile,
            qualify: data.qualify,
            conditions: conditions,
            processings: processings,
        }));
    },

    /* update footer information*/
    updateFooters: function (data)
    {   
        var info = {
            topicView: data.topicView,
            power: data.power,
            profile: data.profile,
            qualify: data.qualify,
            isAuth: data.isAuth.isAuth,
            conditions: conditions,
            processings: processings,
            userId: data.userId,
        };
        if (conditions.isChannel) {
            info.channel = data.channel;
            info.channelCoupon = data.channelCoupon;
        }
        $container.append(tpls.footers(info));
    },

    /* update other sections*/
    updateOtherSections: function (data)
    {
        this.appendConditions(data);
        this.appendProcessings(data);

        var info = {
            topicView: data.topicView,
            power: data.power,
            profile: data.profile,
            qualify: data.qualify,
            isAuth: data.isAuth.isAuth,
            live: data.live,
            topicNum: data.topicNum.topicNum,
            followNum: data.followNum.follwerNum,
            isFollow:(data.isFollow && data.isFollow.isFollow) || 'Y',
            conditions: conditions,
            processings: processings,
        };

        if (conditions.isChannel) {
            if (data.channel) {
                info.channel = data.channel;
            }
            if (data.channelTopicNum && data.channelTopicNum.topicNum) {
                info.channelTopicNum = data.channelTopicNum.topicNum;
            }
            if (data.channelJoinNum && data.channelJoinNum.payUserCount) {
                info.channelJoinNum = data.channelJoinNum.payUserCount;
            }
        }

        $main.append(tpls.others(info));

        $('#share-rank-container').append(tpls.rank({
            topicView: data.topicView,
            conditions: conditions,
            processings: processings,
        }));
    },

    /* update modals infomation*/
    updateModals: function (data)
    {
        $container.append(tpls.modals({
            topicView: data.topicView,
            power: data.power,
            profile: data.profile,
            qualify: data.qualify,
            isAuth: data.isAuth.isAuth,
            live: data.live,
            topicNum: data.topicNum.topicNum,
            followNum: data.followNum.follwerNum,
            isFollow: (data.isFollow && data.isFollow.isFollow) || 'Y',
            todayPushNum: data.todayPushNum.todayPushNum,
            conditions: conditions,
            processings: processings,
        }));
    },

    /* update focus button*/
    updateFocusBtn: function ()
    {
        var $btn = $('#focus-live');
        $btn.toggleClass('on');

        var focus = $btn.hasClass('on');
        $btn.text(focus ? '已关注' : '关注');

        var num = Number($('#follow-count').text());
        $('#follow-count').text(focus ? String(num + 1) : String(num - 1));
    },
    /* update intro state*/
    updateDetailIntro: function ()
    {

    },

    /* update focus num display*/
    updateFocusMember: function ()
    {

    },

    /* init intro detail state*/
    initDetailIntro: function ()
    {
        var $detail = $('#detail-intro');

        $detail.addClass('detail');
        $('#tab-to-detail').show();

        $('body').on('click', '#detail-intro', function ()
        {
            $detail.removeClass('detail');
        });
        $('body').on('click', '#tab-to-detail', function ()
        {
            $detail.toggleClass('detail');
        });
    },

    /* show v auth modal*/
    showVModal: function ()
    {
        $('#v-auth-modal').removeAttr('hidden');
    },

    /* show t auth modal*/
    showTModal: function ()
    {
        $('#t-auth-modal').removeAttr('hidden');
    },

    gift: {
        instance: null,
        charge: null,
        sum: null,
        count: null,
        sending: false,
        showModal: function ()
        {
            this.charge = Number($('#gift-charge').attr('data-charge')) / 100;
            var that = this;

            function GiftInstance()
            {
                var count = null;
                Object.defineProperty(this, 'count', {
                    get: function ()
                    {
                        return count;
                    },
                    set: function (val)
                    {
                        that.count = val;
                        that.sum = val * that.charge;
                        $('#gift-count, #gift-modal footer var').text(val);
                        $('#gift-charge').text(val * that.charge);
                    },
                    enumerable: true,
                    configurable: true,
                });
            }

            /* 初始化一个gift*/
            this.instance = new GiftInstance();
            this.instance.count = 3;

            $('#gift-modal').removeAttr('hidden');
        },

        increase: function ()
        {
            if (this.charge * (this.count + 1) <= 5000) {
                this.instance.count = this.count + 1;
            } else {
                toast.toast('抱歉！您的赠礼超过了5000元的上限~请减少赠礼数量或多次购买');
            }
        },

        decrease: function ()
        {
            if (this.count > 1) {
                this.instance.count = this.count - 1;
            }
        },
        /* confirm buy gift*/
        do: function (userId, topicId)
        {
            var that = this;
            var params = {
                total_fee: that.sum * 100,
                giftCount: that.count,
                topicId: topicId,
                type: 'GIFT',
            };

            var payutil = new Payutil();

            payutil.doPay({
                tag: 'gift',
                params: params,
            });
        },
        /* get gift id by orderif*/
        getGift: function (orderId)
        {
            var that = this;
            model.post(
                conf.api.getGiftId,
                { orderId: orderId },
                function (result)
                {
                    if (result.state.code === 0) {
                        that.showViewModal(result.data.orderGiftId);
                    } else {

                    }
                });
        },
        /* show gift view modal*/
        showViewModal: function (giftId)
        {
            var $viewGift = $('#gift-view-modal footer span');
            $viewGift.attr('data-gift-id', giftId);
            $viewGift.click(function ()
            {
                window.location.href = '/live/gift/detail.htm?giftId=' + giftId;
            });
            $('#gift-view-modal').removeAttr('hidden');
        },
    },

    showChannelChargeSheet: function (data)
    {
        var content = tpls.chargeSheet({
            charge: data,
        });
        var chargeSheet = new Actionsheet({
            content: content,
            onMaskClick: function ()
            {
                $('.co-action-sheet').hide();
            },
        }, true);
    },
};

module.exports = view;
