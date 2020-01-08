require('zepto');
// require('zeptofix');
require('tapon');

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

    view = require('./view'),
    conf = require('../conf');

/**
 * [channel-gift-detail description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './channel-gift-get.css'
 */


var channelGift = {
    initData:null,
    // 各种权限
    power: null,
    giftInfo:null,
    channelIntro:null,
    giftListData:null,
    thisuserId:null,
    init: function (initData) {
        console.log(initData)
        this.initData = initData;
        this.giftInfo = initData.GIFT_DETAIL;
        this.giftGet = initData.GIFT_GET;
        this.channelInfo=initData.CHANNEL;
        this.thisuserId=initData.USER_ID;
        this.giftListInit=initData.GIFT_LIST;
        this.getGiftFunc(this.channelInfo,this.giftGet.getResultCode,function () {
            this.giftInfoShow();
            // this.giftLoadList();
            this.giftOneSend();
        }.bind(this));
        this.gotoCommunity();
    },
    gotoCommunity: function () {
        let self = this;
        try {
            $('.gift-btn').click(function(e) {
                model.fetch({
                    url: '/api/wechat/community/getByBusiness',
                    type: 'POST',
                    data: {
                        liveId: self.channelInfo.liveId,
                        type: 'channel',
                        businessId: self.channelInfo.channelId  
                    },
                    success: function(res) {
                        if (res && res.state && res.state.code == 0) {
                            let { showStatus, communityCode } = res.data;
                            if (showStatus == 'Y') {
                                location.href = `/wechat/page/new-finish-pay?liveId=${self.channelInfo.liveId}&payFree=N&title=${encodeURIComponent(self.channelInfo.name)}${communityCode ? '&communityCode=' + communityCode : ''}`;

                            } 
                        } else {
                            location.href = `/live/channel/channelPage/${self.channelInfo.channelId}}.htm`
                        }
                    },
                    error: function() {
                        location.href = `/live/channel/channelPage/${self.channelInfo.channelId}}.htm`
                    }
                });
            })
        } catch (error) {
            console.error(error)
        }
    },
    giftInfoShow:function(){
        view.giftInfo(true,this.giftInfo,this.channelInfo,this.thisuserId,this.giftGet,this.giftListInit);
    },

    giftOneSend:function(){
        var self=this;
        $giftbtn=$("#gift-btn");
        $giftbtn.click(function(){
            var giftRecordIds=self.giftInfo.giftRecordIds;
            if(giftRecordIds.length>0){
                var thisrecordid=self.giftInfo.giftRecordIds[0];
                giftRecordIds.splice(0,1);
                window.location.href=$giftbtn.attr("attr-href")+thisrecordid;
            };
            

        });
        $(".gift-top").click(function(){
            window.location.href='/live/channel/channelPage/'+self.channelInfo.channelId+'.htm';
        });
    },
    getGiftFunc:function (channel,getResultCode,callback) {
        var notGet=false;
        switch(getResultCode){
                case 'manager':notGet=true;break;
                case 'VipUser':notGet=true;break;
                case 'alreadyBuy':
                    if(channel.chargeType=="absolutely"){
                        notGet=true;
                    };break;
                
            // selfDo:发起者本人领取； overTime:超时；giftEmpty:已被领取完；alreadyGetGift：该用户领取过该礼品； getByOthers:该礼品（该记录）已被他人领取;success：领取成功
            //manager：管理员不能领取；VipUser：vip不能领取；alreadyBuy：该用户购买过该系列课（固定收费）
            }
            if(notGet){
                window.location.href = '/live/channel/channelPage/'+channel.channelId+'.htm';
            }else if(typeof callback==="function"){
                callback();
            };
    }
    
};


module.exports = channelGift;