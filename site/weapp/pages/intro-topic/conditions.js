import { imgFormat, dateFormat, defaultVal } from '../../comp/filter';

const conditions = {
    _info: {},
    _conditions: {},
    _processings: {},
    /* 初始化数据*/
    initData: function (data) {
        const that = this;

        this.initInfo(data);
        this.initProcessings(data);
        this.initUsualConditions(data);
        this.initHeaderConditions(data);
        this.initFooterConditions(data);
    },
    /* 第二次数据处理*/
    secondData: function (data) {
        let _data = Object.assign(this._info, data);

        this.secondInfo(_data);
        this.secondProcessings(_data);
        this.initSubsCondition(_data);
        this.initPriceCondition(_data);
        this.initLiveroomCondition(_data);
        this.initPushCondition(_data);
        this.initShareRankConditions(_data);
    },
    /* 一些基本信息处理*/
    initInfo: function (data) {
        Object.assign(this._info, data);
        this._info.topicView.topicPo.backgroundUrl = imgFormat(this._info.topicView.topicPo.backgroundUrl, '@469h_750w_1e_1c_2o');
        if (this._info.topicView.topicPo.authNum == null) {
            this._info.topicView.topicPo.authNum = 0;
        }
        this._info.topicView.topicPo.startTimeStr = dateFormat(this._info.topicView.topicPo.startTime, 'yyyy-MM-dd hh:mm:ss');
    },
    /* 二次信息处理*/
    secondInfo: function (data) {
        this._info.live.entity.logo = imgFormat(
            defaultVal(this._info.live.entity.logo, 'http://img.qlchat.com/qlLive/liveCommon/liveHead.png'), '@300w_300h_1e_1c_2o'
        );
    },
    /* 初始化数组处理*/
    initProcessings: function (data) {
        var audio = [];
        var image = [];

        /* 课程介绍文件根据类型放到不同数组*/
        if (data.profile.TopicProfileList && data.profile.TopicProfileList.length > 0) {
            data.profile.TopicProfileList.forEach(function (item) {
                switch (item.type) {
                    case 'audio': audio.push(item); break;
                    case 'image': image.push(item); break;
                    default: break;
                }
            });
        }

        this._processings.audio = audio;
        this._processings.image = image;
    },
    /* 初始化通用判断*/
    initUsualConditions: function (data) {
        var conditions = {
            /* 课程相关*/
            isSingleBuy: data.topicView.topicExtendPo.isSingleBuy == 'Y' ? true : false,
            isChannel: data.topicView.topicPo.channelId != null && data.topicView.topicPo.channelId != 'null',
            isShareOpen: data.topicView.topicExtendPo.isShareOpen == 'Y',
            isAutoShareOpen: data.topicView.topicExtendPo.isAutoShareOpen == 'Y',
            isRelay: data.topicView.topicPo.isRelay == 'Y',
            isVip: data.vipInfo.isVip == 'Y',

            /* 课程类型*/
            typePublic: data.topicView.topicPo.type == 'public',
            typeEncrypt: data.topicView.topicPo.type == 'encrypt',
            typeCharge: data.topicView.topicPo.type == 'charge',

            /* shareKey相关*/
            hasShareKey: false,

            /* 用户相关*/
            isAuth: data.isAuth.isAuth || data.vipInfo.isVip == 'Y',
            isC: !(data.power.powerEntity.allowMGLive || data.power.powerEntity.allowSpeak),
            isMG: data.power.powerEntity.allowMGLive,
        };
        if (data.qualify.shareQualify) {
            conditions.hasShareKey = data.qualify.shareQualify.shareKey && data.qualify.shareQualify.status == 'Y';
        }
        if (conditions.hasShareKey) {
            conditions.shareKey = data.qualify.shareQualify.sharekey;
        }
        /* c端课程类型*/
        conditions.c_public = conditions.typePublic && !conditions.isChannel && conditions.isC;
        conditions.c_encrypt = conditions.typeEncrypt && !conditions.isChannel && conditions.isC;
        conditions.c_charge = conditions.typeCharge && !conditions.isChannel && conditions.isC;

        Object.assign(this._conditions, conditions);
    },
    /* 初始化头部判断条件*/
    initHeaderConditions: function (data) {
        var that = this;
        /* 头部模板判断条件*/
        var conditions = {
            showIntro: data.topicView.topicPo.speaker
            || data.topicView.topicPo.guestIntr
            || data.topicView.topicPo.remark
            || that._processings.image.length > 0,
            showSharecard: !that._conditions.isChannel && (
                (that._conditions.typeCharge && data.topicView.topicPo.isRelay != 'Y' && that._conditions.hasShareKey) ||
                (that._conditions.typeCharge && that._conditions.isShareOpen)
            ),
            /* 是否有image/audio介绍文件*/
            hasImage: that._processings.image.length > 0,
            hasAudio: that._processings.audio.length > 0,
        };

        Object.assign(this._conditions, conditions);
    },

    /* 初始化底部判断条件*/
    initFooterConditions: function (data) {
        var that = this;
        /* 底部模板判断条件*/
        var conditions = {
            /* c端公开课程判断*/
            c_public_auth: that._conditions.c_public && (that._conditions.isAuth),
            c_public_notAuth: that._conditions.c_public && !(that._conditions.isAuth),

            /* c端加密课程判断*/
            c_encrypt_auth: that._conditions.c_encrypt && (that._conditions.isAuth),
            c_encrypt_notAuth: that._conditions.c_encrypt && !(that._conditions.isAuth),

            /* c端付费课程判断*/
            c_charge_auth: that._conditions.c_charge && (that._conditions.isAuth),
            c_charge_notAuth: that._conditions.c_charge && !(that._conditions.isAuth),

            /* c端系列课课程判断*/
            channel_charge: that._conditions.isChannel,
            channel_charge_notAuth: that._conditions.isChannel && !(that._conditions.isAuth),
            channel_charge_auth: that._conditions.isChannel && (that._conditions.isAuth),
        };

        /* 系列课价格显示条件*/
        if (that._conditions.isChannel && data.channel) {
            var charge = 0;
            /* 系列课价格最大值作为系列课区域显示值*/
            if (data.channel.chargeConfigs) {
                conditions.chargeConfigs = data.channel.chargeConfigs;
                conditions.channelCharge = data.channel.chargeConfigs.forEach(function (item) {
                    if (item.amount > charge) {
                        charge = item.amount;
                    }
                });
            }

            conditions.channelChargeNumber = charge;
            conditions.channelCharge = '购买系列课：￥' + charge;

            /* 系列课优惠码和优惠后价格*/
            if (data.channelCoupon) {
                conditions.hasChannelCoupon = data.channelCoupon.isHaveCoupon;
            }
            if (conditions.hasChannelCoupon) {
                conditions.channelCoupon = data.channelCoupon.qlCouponMoney;
            }
            /* 系列课的支付价格和展示价格*/
            conditions.channelPayCharge = conditions.hasChannelCoupon
                ? (charge - conditions.channelCoupon) * 100
                : (conditions.channelCharge) * 100;
            /* 若优惠码抵扣后小于0，按0算*/
            conditions.channelPayCharge = conditions.channelPayCharge < 0
                ? 0
                : conditions.channelPayCharge;
            conditions.channelRealCharge = '购买系列课：￥' + conditions.channelPayCharge / 100;
            /* 系列课收费多种价格显示*/
            if (data.channel.channel.chargeType == 'flexible') {
                var chargeStr = '';
                data.channel.chargeConfigs.forEach(function (item, index) {
                    if (index < 2) {
                        chargeStr += '、￥' + item.amount + '/' + item.chargeMonths + '月';
                    }
                });
                conditions.channelRealCharge = chargeStr.slice(1);
                if (data.channel.chargeConfigs.length > 2) {
                    conditions.channelRealCharge += '...';
                }
            }
            conditions.channel_pay_class = (conditions.hasChannelCoupon && data.channelCoupon.diffNum <= 0)
                ? 'pay-enter'
                : 'pay';
            conditions.channel_text_class = conditions.hasChannelCoupon ? 'innerText' : '';
        }

        /* 分销商免费判断条件*/
        if (data.qualify && data.qualify.shareQualify) {
            conditions.mate = that._conditions.isShareOpen &&
                data.qualify.shareQualify.status == 'Y';
        }

        /* 收费按钮样式判断*/
        conditions.hasCoupon = data.coupon.qlCouponMoney != null && data.coupon.qlCouponMoney != 0;
        conditions.pay_class = (conditions.hasCoupon && data.coupon.diffNum <= 0)
            ? 'pay-enter'
            : 'pay';
        conditions.text_class = conditions.hasCoupon ? 'innerText' : '';
        conditions.charge_href = !(conditions.hasCoupon && data.coupon.diffNum <= 0)
            ? 'javascript:;'
            : (that._conditions.sharekey ? '/topic/' + data.topicView.topicPo.id + '.htm?isGuide=Y&shareKey=' + that._conditions.sharekey : '/topic/' + data.topicView.topicPo.id + '.htm?isGuide=Y');

        /* 课程标价和课程减免后价格*/
        conditions.topicCharge = data.topicView.topicPo.money / 100;
        // conditions.topicRealCharge = conditions.hasCoupon
        //     ? Number(data.coupon.diffNum)
        //     : conditions.topicCharge;

        // this._conditions.footerConditions = conditions;
        Object.assign(this._conditions, conditions);
    },

    /* 二次数据的处理*/
    secondProcessings: function (data) {
        var shareList = data.shareMember.shareUserList.splice(0, 5);
        shareList.map(function (item) {
            if (item.userHeadUrl) {
                if (item.userHeadUrl.indexOf('http://wx.qlogo.cn/mmopen') > 0) return;
            } else {
                item.userHeadUrl = 'http://img.qlchat.com/qlLive/liveCommon/normalLogo.png';
            }
        });
        /* 分享榜和报名列表处理*/
        this._processings.joinMember = data.joinMember.userList.slice(0, 4);
        this._processings.shareMember = shareList;
    },

    /* 二维码区域判断条件*/
    initSubsCondition: function (data) {
        var that = this;
        var conditions = {
            show_subscription: data.live.entity.subscriptionName
            && that._conditions.typeEncrypt
            && !(that._conditions.isChannel && that._conditions.isSingleBuy),
        };

        // this._conditions.subsConditions = conditions;
        Object.assign(this._conditions, conditions);
    },

    /* 价格区域判断条件*/
    initPriceCondition: function (data) {
        var that = this;
        var conditions = {};
        /* 是否显示价格区域*/
        conditions.show_price = !(that._conditions.isChannel || that._conditions.isSingleBuy) &&
            that._conditions.typeCharge;
        /* 优惠码通道显示条件*/
        conditions.coupon_access = !data.power.powerEntity.allowSpeak
            && that._conditions.isAuth
            && data.topicView.topicPo.isRelay != 'Y';
        /* 设置优惠码链接*/
        conditions.coupon_access_link = that._conditions.sharekey
            ? '/wechat/page/coupon-code/exchange/topic/' + data.topicView.topicPo.id + '?shareKey=' + that._conditions.sharekey
            : '/wechat/page/coupon-code/exchange/topic/' + data.topicView.topicPo.id;
        conditions.coupon_settings = that._conditions.isMG
            && that._conditions.isRelay;

        /* 一个神奇的时间点*/
        conditions.whatsthisTimeStamp = (new Date(2016, 6, 1, 1, 22, 12)).getTime();
        conditions.startTimeStamp = Number(data.topicView.topicPo.startTime);
        /* 显示报名列表条件*/
        conditions.show_joinMember = (conditions.startTimeStamp > conditions.whatsthisTimeStamp)
            && (data.power.powerEntity.allowMGLive || data.topicView.topicExtendPo.isAuthOpen == 'Y')
            && data.joinMember.userList.length > 0;
        // todo:complete - shareauth
        /* 查看报名列表链接*/
        conditions.joinMember_list_link = (!that._conditions.isC || data.isShareAuth)
            ? '/live/payPeople/' + data.topicView.topicPo.id + '.htm'
            : 'javascript:;';

        // this._conditions.priceConditions = conditions;
        Object.assign(this._conditions, conditions);
    },

    /* 直播间区域判断条件*/
    initLiveroomCondition: function (data) {
        // var that = this;
        var conditions = {};
        conditions.liveroom_img = data.live.entity.logo
            ? data.live.entity.logo
            : 'http://img.qlchat.com/qlLive/liveCommon/liveHead.png';
        conditions.show_focus_btn = !data.power.powerEntity.allowMGLive;

        conditions.focused = data.isFollow.isFollow;

        conditions.isLiveV = data.live.entityExtend.isLiveV == 'Y';
        conditions.isLiveT = data.live.entityExtend.isLiveT == 'Y';
        conditions.isLiveAuth = conditions.isLiveT || conditions.isLiveV;

        // this._conditions.liveroomConditions = conditions;
        Object.assign(this._conditions, conditions);
    },

    /* 推广区域判断条件*/
    initPushCondition: function (data) {
        var that = this;
        var conditions = {};
        conditions.setPush = that._conditions.isAutoShareOpen
            || (data.topicView.topicPo.type == 'charge' && that._conditions.hasShareKey);
        conditions.show_relay = that._conditions.isMG
            && that._conditions.isRelay
            && !that._conditions.isChannel;

        // this._conditions.pushConditions = conditions;
        Object.assign(this._conditions, conditions);
    },

    /* 分享榜判断条件*/
    initShareRankConditions: function (data) {
        var that = this;
        var conditions = {};
        conditions.show_sharerank = !that._conditions.isChannel
            && that._conditions.isShareOpen
            && that._conditions.isShareOpen;
        conditions.hasShareList = data.shareMember.shareUserList
            && data.shareMember.shareUserList.length > 0;

        // this._conditions.shareRankConditions = conditions;
        Object.assign(this._conditions, conditions);
    },

    /* 返回处理后的条件判断*/
    getConditions: function () {
        return this._conditions;
    },
    /* 返回处理后的数据*/
    getProcessings: function () {
        return this._processings;
    },
}

export { conditions };
