module.exports = {
    // API地址配置
    api: {

        // live api
        doAttention: '/api/wechat/live/do-attention',
        doNotice: '/api/wechat/live/do-notice',
        consultList:'/api/wechat/live/consultList',
        consultMList:'/api/wechat/live/consultMList',
        consultBest:'/api/wechat/live/consultBest',
        consultReply:'/api/wechat/live/consultReply',


        // channel api
        getChannelList: '/api/wechat/channel/list',
        doTopChannel: '/api/wechat/channel/doTopChannel',
        doDeleteChannel: '/api/wechat/channel/doDeleteChannel',
        getChannelGiftList:'/api/wechat/channel/giftlist',


        // ??
        placeOrder_wx: '/api/wechat/make-order',
        placeOrder_wb: '/api/weibo/pay',
        getPayResult: '/api/wechat/selectResult',

        getOtherInfo: '/api/wechat/intro/others',
        getGiftId: '/api/weibo/getGiftId',

        liveFocus: '/api/wechat/live/focus',
        themeList: '/api/wechat/theme/list',
        themeListHotEntity: '/api/wechat/theme/list-hot-entity',
        themeListNewestTopic: '/api/wechat/theme/list-newest-topic',

        getRankTopicList: '/api/wechat/explore/getRankTopicList',
        getPeriodAndList: '/api/wechat/explore/getPeriodAndList',
        /* 直播间认证相关*/
        saveLiveProfile:'/api/wechat/live/profile/save',
        /* 搜索相关api*/
        searchTopic: '/api/wechat/search/topic',
        searchChannel: '/api/wechat/search/channel',
        searchLive: '/api/wechat/search/live',
        searchAll:'/api/wechat/search/all',
        liveRedirect: '/api/app/live/redirect',

        // 课后作业相关API
        getHomeworkInfoById: '/api/wechat/homework/get',

        // 系列课是否已经购买
        channelAuth: '/api/wechat/channel/channelAuth',

        // 分享红包邀请卡
        redEnvelopeShare: '/api/wechat/redEnvelopeShare',

    },

    // ajax设置
    ajaxSetting: {
        timeout: 30 * 1000,
    },
};
