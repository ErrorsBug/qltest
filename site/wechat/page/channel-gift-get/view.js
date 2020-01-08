var Handlebars = require('handlebars'),
    // TouchSlide = require('touchslide'),
    loading = require('loading'),
    // ActionSheet = require('actionsheet'),
    // Dialog = require('dialog'),

    tpls = {
        gift: __inline('./tpl/channel-gift.handlebars'),
        giftList: __inline('./tpl/channel-gift-list.handlebars'),
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
    giftInfo: function (reset, gift, channel, userId, giftGet, giftListInit) {
        var $gift = $('#giftShow');
       var $type='', $name='', $liveName='';
        if(channel&&channel!=null) {
            $type=channel.chargeType=='absolutely'?'固定收费':'按月收费';
            $name=channel.name;
            $liveName=channel.liveName;
        };
        var isOverTime= gift.IsOverTime=='Y'? true :false;
        gift.IsOverTime=isOverTime;
        gift.isSelf= userId == gift.buynerId ?true :false;
        var no_receive=false;
        if(giftGet&&giftGet!=null) {
            switch(giftGet.getResultCode) {
                case 'selfDo':;break;
                case 'overTime':;break;
                case 'giftEmpty':;break;
                case 'alreadyGetGift':no_receive=true; break;
                case 'getByOthers':;break;
                case 'success':no_receive=true; break;
                case 'manager':window.location.href = '/live/channel/channelPage/'+channel.channelId+'.htm'; break;
                case 'VipUser':window.location.href = '/live/channel/channelPage/'+channel.channelId+'.htm'; break;
                case 'alreadyBuy':channel.chargeType=='absolutely'? window.location.href = '/live/channel/channelPage/'+channel.channelId+'.htm':no_receive=true; break;

            // selfDo:发起者本人领取； overTime:超时；giftEmpty:已被领取完；alreadyGetGift：该用户领取过该礼品； getByOthers:该礼品（该记录）已被他人领取;success：领取成功
            // manager：管理员不能领取；VipUser：vip不能领取；alreadyBuy：该用户购买过该系列课（固定收费）
            }
        };

        if (reset) {
            $gift.empty();
        }
        console.log(giftGet);
        $gift.append(tpls.gift({
            gift: gift,
            channelname: $name,
            channeltype: $type,
            livename: $liveName,
            channelInfo: channel,
            giftGet: giftGet,
            no_receive: no_receive,
        }));
        if(giftListInit&&giftListInit.length>0&&gift.isSelf) {
            this.giftList(giftListInit, gift);
            $('#giftUl').show();
        }else{
            $('#giftUl').hide();
        };
    },
    giftList: function(giftlist, gift) {
        $giftul=$('#giftUl .gift-detail-ul');
        $giftul.append(tpls.giftList({
            giftlist: giftlist,
            gift: gift,
        }));
    },
};

module.exports = view;
