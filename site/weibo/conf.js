module.exports = {
    // API地址配置
    api: {

        // live api
        doAttention: '/api/weibo/live/doAttention',
        doNotice: '/api/weibo/live/do-notice',

        // channel api
        getChannelList: '/api/weibo/channel/list',
        doTopChannel: '/api/weibo/channel/doTopChannel',
        doDeleteChannel: '/api/weibo/channel/doDeleteChannel',

        // topic api
        getTopicList: '/api/weibo/topic/list',
        doPush: '/api/weibo/topic/doPush',
        doMoveToChannel: '/api/weibo/topic/doMoveToChannel',
        doSwitchLiveType: '/api/weibo/topic/doSwitchLiveType',
        doSetReLive: '/api/weibo/topic/doSetReLive',
        doFinishTopic: '/api/weibo/topic/doFinishTopic',
        doDeleteTopic: '/api/weibo/topic/doDeleteTopic',
        doCancelReLive: '/api/weibo/topic/doCancelReLive',
        getSpeak: '/api/weibo/topic/getSpeak',
        getComment: '/api/weibo/topic/getComment',
        postComment: '/api/weibo/topic/postComment',
        delComment: '/api/weibo/topic/delComment',
        docGet: '/api/weibo/topic/docGet',
        docAuth: '/api/weibo/topic/docAuth',
        payResult: '/api/weibo/topic/getPayResult',
        addStat: '/api/weibo/topic/addStat',
        // topic ppt
        getPPT: '/api/weibo/topic/getPPt',


        // ??
        placeOrder_wx: '/api/wechat/make-order',
        placeOrder_wb: '/api/weibo/pay',
        getPayResult: '/api/weibo/selectResult',
        orderFree: '/api/weibo/orderFree',

        getOtherInfo: '/api/weibo/intro/others',

        enterPublic: '/api/weibo/topic/enterPublic',
        enterEncrypt: '/api/weibo/topic/enterEncrypt',

        buyFreeChannel: '/api/weibo/channel/buyFreeChannel',

        getGiftId: '/api/weibo/getGiftId',

        saveGuide: '/api/weibo/topic/saveGuide',

    },

    // ajax设置
    ajaxSetting: {
        timeout: 30 * 1000,
    },
};
