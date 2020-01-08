var Handlebars = require('handlebars'),
    loading = require('loading'),
    TouchSlide = require('touchslide'),

    tpls = {
        pptWindow: __inline('./tpl/ppt-window.handlebars'),
        liveHeadLeftMenu: __inline('./tpl/live-head-left-menu.handlebars'),
        liveRightMenu: __inline('./tpl/live-right-menu.handlebars'),
        barrage: __inline('./tpl/barrage.handlebars'),
        topicPendants: __inline('./tpl/topic-pendants.handlebars'),
        speakBottom: __inline('./tpl/speak-bottom.handlebars'),
        commentBox: __inline('./tpl/comment-box.handlebars'),
        controls: __inline('./tpl/controls.handlebars'),
        inviteList: __inline('./tpl/invite-list.handlebars'),
        luckymoney: __inline('./tpl/luckymoney.handlebars'),
        luckymoneyFeedback: __inline('./tpl/luckymoney-feedback.handlebars'),
        usestateGuide: __inline('./tpl/usestate-guide.handlebars'),
        enterTips: __inline('./tpl/enter-tips.handlebars'),
    };

require('hbardateformat');
require('hbarcompare');
require('hbardefaultVal');
require('hbarimgformat');
require('../../comp/default-img/default-img');

var $liveHeader = $('.liveHeader');
var $pageMenu = $('.pageMenu');
var $barrage = $('.barrage-control');
var $BubblesTemp = $('#BubblesTemp');
var $speakBubbles = $('#speakBubbles');
var $speakBox = $('#speakBox');
var $commentBox = $('.commentBox');
var $caozuoList = $('.caozuo-list');
var $guestList = $('.guest-list');
var $redbagBox = $('.redbagBox');
var $LmTipsBox = $('.LmTipsBox');
var $otherRedmoneyBox = $('.otherRedmoneyBox');
var $enterTips = $('.enter-live-modal');
var view = {

    // PPT初始化
    getPPTData: function (intData) {
        if (intData.topicPo.style == 'ppt') {
            $('body').addClass('pptMode');
        };
        $liveHeader.before(tpls.pptWindow({
            topicPo: intData.topicPo,
            powerEntity: intData.powerEntity,
        }));
    },

    // 菜单和操作框初始化
    liveMenu: function (intData) {
        $liveHeader.append(tpls.liveHeadLeftMenu({
            topicPo: intData.topicPo,
            powerEntity: intData.powerEntity,
            hasChannelId: (intData.topicPo.channelId) ? true : false,
            canCreateLive: intData.canCreateLive,
        }));

        $pageMenu.append(tpls.liveRightMenu({
            topicPo: intData.topicPo,
            powerEntity: intData.powerEntity,
            userPo: intData.userPo,
            isShowFollow: !intData.liveFollow.isFollow && intData.userPo.liveRole == '',
        }));

        $barrage.append(tpls.barrage({
            topicPo: intData.topicPo,
            isShowWrite: (intData.powerEntity.allowSpeak && intData.topicPo.status != 'ended') ? true : false,
        }));

        $caozuoList.append(tpls.controls({
            topicPo: intData.topicPo,
            powerEntity: intData.powerEntity,
            isShowWrite: (intData.powerEntity.allowSpeak && intData.topicPo.status != 'ended') ? true : false,
        }));
    },

    // 话题内容初始化
    topicPendants: function (intData) {
        $BubblesTemp.before(tpls.topicPendants({
            topicPo: intData.topicPo,
            focusStatus: intData.focusStatus,
            entity: intData.entity,
            instructionGuid: intData.instructionGuid,
            powerEntity: intData.powerEntity,
            instructionGuid: intData.instructionGuid,
            alertStatus: (intData.alertStatus != 'Y' || intData.isAuthTopic != 'Y'),
            isShowQrcode: (intData.entity.qrCode != '' && intData.currentTimeMillis < intData.topicPo.startTimeStamp),
            isShowWrite: (intData.powerEntity.allowSpeak && intData.topicPo.status != 'ended') ? true : false,
            isShowShareBox: !(intData.topicPo.type == 'charge' && intData.topicPo.isRelay == 'Y'),
            isShowShareDl: (intData.topicPo.type != 'charge' && intData.topicExtendPo.isShareOpen == 'Y'),
            isShowInviteGuide: (intData.topicPo.status == 'beginning' && intData.inviteGuid == 'Y' && intData.ifInviteGuest != 'Y' && intData.powerEntity.allowMGLive && intData.topicPo.isRelay != 'Y'),
        }));

        $speakBox.append(tpls.speakBottom({
            isLogIn: (intData.userPo.id && intData.userPo.id != ''),
            topicPo: intData.topicPo,
            focusStatus: intData.focusStatus,
            entity: intData.entity,
            instructionGuid: intData.instructionGuid,
            powerEntity: intData.powerEntity,
        }));

        $commentBox.append(tpls.commentBox({
            topicPo: intData.topicPo,
        }));

        $redbagBox.append(tpls.luckymoney({
            entityExtend: intData.entityExtend,
        }));

        $LmTipsBox.append(tpls.luckymoneyFeedback({
            powerEntity: intData.powerEntity,
            businessOpProfit: ((100 - 0.6) - intData.topicPo.businessOpProfit),
            topicPo: intData.topicPo,
        }));

        $otherRedmoneyBox.after(tpls.usestateGuide({
            topicPo: intData.topicPo,
        }));
    },

    inviteList: function (data) {
        $guestList.append(tpls.inviteList({
            data: data,
        }));
    },

    /* 显示关注弹窗*/
    showEnterTips: function () {
        $enterTips.append(tpls.enterTips());
        $enterTips.show();
    },

    /* 隐藏关注弹窗*/
    hideEnterTips: function () {
        $enterTips.hide();
    },

    /* 切换是否关注状态*/
    toggleFocus: function () {
        $('#focus-live-btn').toggleClass('on');
    },
};

module.exports = view;
