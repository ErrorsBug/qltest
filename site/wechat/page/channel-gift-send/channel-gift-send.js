require('zepto');
// require('zeptofix');
require('tapon');

var // fastClick = require('fastclick'),
    // lazyimg = require('lazyimg'),
    model = require('model'),
    validator = require('validator'),
    wxutil = require('wxutil'),
    toast = require('toast'),
    Promise = require('promise'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),
    appSdk=require('appsdk')

    conf = require('../conf');

/**
 * [channel-gift-detail description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './channel-gift-send.css'
 */

var giftSend={
    init:function(initData){
        this.initShare(initData)
        this.initTipsContent(initData)
    },

    initTipsContent: function (initData) {
        var optionNum = '';
        if (initData.GIFT != null) {
            optionNum = initData.GIFT.remaindNum;
        };
        if (initData.SHARE_LINK.indexOf('giftGroupget') > 0) {//群发
            $(".count-tip1").html("2.一条链接可以被" + optionNum + "个用户使用。");
        } else {
            $(".count-tip1").html("2.一条链接只能被一个用户使用。");
        };
    },

    // 分享定制
    initShare: function (initData) {
        var shareLink = initData.SHARE_LINK;
        var name = '',
            liveName = "",
            channelName = '',
            imageUrl = "https://img.qlchat.com/qlLive/liveCommon/theme-logo-2.png";

        if (initData.CHANNEL != null) {
            channelName = initData.CHANNEL.name;
            liveName = initData.CHANNEL.liveName;
            imageUrl = initData.CHANNEL.headImage != null ? initData.CHANNEL.headImage : imageUrl;
        };
        if (initData.USERINFO != null) {
            name = initData.USERINFO.name;
        };
        
        wxutil.share({
            title: name + '请你免费听系列课-' + channelName,
            desc: '来自' + liveName,
            timelineDesc: name + '请你免费听系列课-' + channelName, // 分享到朋友圈单独定制
            imgUrl: imageUrl,//'https://img.qlchat.com/qlLive/liveCommon/theme-logo-2.png',
            shareUrl: shareLink,
        });

        appSdk.share({
            title: name + '请你免费听系列课-' + channelName,
            content: '来自' + liveName,
            shareUrl: shareLink,
            thumbImageUrl: imageUrl,
        })
    }
};

module.exports=giftSend;