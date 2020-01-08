require('zepto');
// require('zeptofix');
require('tapon');
var dialog = require('dialog');

var // fastClick = require('fastclick'),
    // lazyimg = require('lazyimg'),
    model = require('model'),
    validator = require('validator'),
    Scrollload = require('scrollload_v3'),
    toast = require('toast'),
    Tabbar = require('tabbar'),
    Promise = require('promise'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),
    envi = require('envi'),
    appSdk = require('appsdk'),

    view = require('./view'),
    conf = require('../conf');
    var toast = require('toast');

/**
 * [channel-gift-detail description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './channel-gift-detail.css'
 */


var channelGift = {
    initData:null,
    // 各种权限
    power: null,
    giftInfo:null,
    channelIntro:null,
    giftListData:null,
    thisuserId:null,
    giftGet:{
        getResultCode:null,
    },
    init: function (initData) {
        this.initData = initData;
        this.giftInfo = initData.GIFT_DETAIL;
        this.giftListInit = initData.GIFT_LIST;
        this.channelInfo=initData.CHANNEL;
        this.thisuserId=initData.USER_ID;
        this.fetchChannelAuth(this.giftInfo.channelId, this.thisuserId);
        this.giftInfoShow();
        // this.giftList();
        this.giftOneSend();
        this.initGotoButtonClick()
        this.initGotoChannelClick()
        this.giftUseBySelf();
    },

    //ajax 请求判断是否系列课已经购买
    fetchChannelAuth: function (channelId, userId) {
        var opt = {
            url: conf.api.channelAuth,
            method: 'POST',
            data: {
                channelId: channelId,
                userId: userId
            },
            success: function (res) {
                if (res.data && res.data.status != 'Y') {
                    view.showUseByMeButton();
                    return ;
                }
                
            },
            error: function (res) {
                console.log(res)
            }
        }

        this.doFetch(opt);
    },

    /* 发起ajax请求*/
    doFetch: function (options) {

        var that = this;
        var $opt = {
            loading: true,
            /* 请求结束后解除ajax锁*/
            complete: function () {
                
            },
        }
        $.extend($opt, options);

        model.fetch($opt);

    },
    giftInfoShow:function(){
        var that = this;
        var giftlist = this.giftListInit.map(function(item) {
            item.me = item.userId == that.thisuserId ? '(我)' : '';
            return item
        });
        view.giftInfo(true,this.giftInfo,this.channelInfo,this.thisuserId,this.giftGet,giftlist);
    },
    giftList:function(){
        var giftlist = this.giftListInit.map(function(item) {
            item.me = item.userId === this.thisuserId ? '我' : '';
            return item
        });
        view.giftList(true,giftlist);
    },
    giftOneSend: function () {
        var $giftbtn = $("#gift-btn");
        var self = this;
        $giftbtn.click(function () {
            var giftRecordIds = self.giftInfo.giftRecordIds;
            if (giftRecordIds.length > 0) {
                var thisrecordid = self.giftInfo.giftRecordIds[0];
                giftRecordIds.splice(0, 1);
                if (envi.isQlchat()) {
                    appSdk.goWebPage($giftbtn.attr("attr-href") + thisrecordid)
                } else {
                    window.location.href = $giftbtn.attr("attr-href") + thisrecordid;
                }

            };


        });
        $(".gift-top").click(function () {
            if (envi.isQlchat()) {
                appSdk.linkTo('dl/live/channel/homepage?channelId=' + self.channelInfo.channelId)
            } else {
                window.location.href = '/live/channel/channelPage/' + self.channelInfo.channelId + '.htm'
            }
        });
    },
    giftUseBySelf:function(){
        var self=this;
        $giftself = $("#gift-self");
        $giftself.click(function () {
            self.useBySelf.show();
        });
        self.useBySelf = $.dialog({
            title:'提示',
            content: '确定自己使用？',
            button: ['取消','确定'],
            cls: 'confirm-dialog',
            isTextCenter:true,
            callback: function(index){
                if(index === 1){
                    window.location.href=$giftself.attr("attr-href");
                }
            }
        });
        
    },
    // h5页面跳转对app的兼容
    initGotoButtonClick: function () {
        $('.goto-webpage').click(function (e) {
            var url = $(this).attr('attr-href')
            if (envi.isQlchat()) {
                appSdk.goWebPage(url)
            } else {
                window.location.href = url;
            }
        })
    },

    // 跳转到频道页按钮的点击事件
    initGotoChannelClick: function () {
        $('#goto-channel').click(function (e) {
            var channelId = $(this).attr('attr-channelId')
            if (envi.isQlchat()) {
                appSdk.linkTo('dl/live/channel/homepage?channelId=' + channelId)
            } else {
                window.location.href = '/live/channel/channelPage/' + channelId + '.htm'
            }
        })
    }
};


module.exports = channelGift;
