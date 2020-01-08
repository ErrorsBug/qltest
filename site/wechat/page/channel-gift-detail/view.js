var Handlebars = require('handlebars'),
    // TouchSlide = require('touchslide'),
    loading = require('loading'),
    // ActionSheet = require('actionsheet'),
    // Dialog = require('dialog'),

    tpls = {
        gift: __inline('./tpl/channel-gift.handlebars'),
        giftList:__inline('./tpl/channel-gift-list.handlebars'),
    };
require('hbarmoneyformat');
require('hbarimgformat');
require('../../comp/default-img/default-img');
var view = {
    /**
     * 渲染话题列表tab
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T17:04:39+0800
     * @param    {[type]}                           reset [description]
     * @param    {[type]}                           lives [description]
     * @return   {[type]}                                 [description]
     */
    

    /**
     * 渲染系列课赠礼
     */
    giftInfo: function (reset,gift,channel,userId,giftGet,giftListInit) {
        var $gift = $('#giftShow');
        var $type="",$name="",$liveName="";
        if(channel&&channel!=null){
            $type=channel.chargeType=="absolutely"?"固定收费":"按月收费";
            $name=channel.name;
            $liveName=channel.liveName;
        };
        
        var isOverTime= gift.IsOverTime=="Y"? true :false ;
        gift.IsOverTime=isOverTime;
        gift.isSelf= userId ==  gift.buynerId ?true :false;
        if (reset) {
            $gift.empty();
        }
        giftGet.getResultCode="";
        $gift.append(tpls.gift({
            gift: gift,
            channelname:$name,
            channeltype:$type,
            livename:$liveName,
            channelInfo:channel,
            giftGet:giftGet,
        }));
        if(giftListInit&&giftListInit.length>0&&gift.isSelf){
            this.giftList(giftListInit,gift);
            $("#giftUl").show();
        }else{
            $("#giftUl").hide();
        };
    },
    giftList:function(giftlist,gift){
        $giftul=$("#giftUl .gift-detail-ul");
         $giftul.append(tpls.giftList({
             giftlist:giftlist,
             gift:gift
         }));
        
    },
    //显示我来使用按钮
    showUseByMeButton: function() {
        $button = $('.gift-self');
        $button.css('display', 'block')
    } 
};

module.exports = view;