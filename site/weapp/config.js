const apiPrefix = '__API_PREFIX';

const apis = {
    login: '/api/weapp/auth/login',
    sysTime:'/api/base/sys-time',
    userVipInfo: '/api/weapp/user-vip-info',
    getAllTagLives: '/api/weapp/assort/tag-lives',
    getIndexData: '/api/weapp/index-data',
	initIndexData: '/api/weapp/init-index-data',
    initIndexInterest: '/api/weapp/init-index-interest',
    introTopicInit: '/api/weapp/page/topic/intro',
    thousandLiveInit: '/api/weapp/page/topic/thousandLive',
    plainLiveInfo: '/api/weapp/page/topic/plain-live',
    getSpeak:'/api/weapp/page/topic/getSpeak',
    getComment:'/api/weapp/page/topic/getComment',
    getFollowerLive: '/api/weapp/mine/follower-live',
    getPurchaseRecord: '/api/weapp/mine/purchase-record',
    initLiveIndex: '/api/weapp/live/index',
    getTopicList: '/api/weapp/topic/list',
    getLiveTopicList: '/api/weapp/topic/live-topic-list',
    getChannelTypes: '/api/weapp/live/type-list',
    getChannelList: '/api/weapp/channel/list',
    getChannelIndex: '/api/weapp/channel/index',
    doFollow: '/api/weapp/live/focus',
    addComment: '/api/weapp/comment/add',
    delComment: '/api/weapp/comment/del',
    getPPT: '/api/weapp/ppt/get',
    getFollowerInit:'/api/weapp/mine/follower-init',
    payFree: '/api/weapp/orderFree',
    minePreview: '/api/weapp/mine/preview',
    courseList: '/api/weapp/assort/charge/course-list',
    hotLiveS: '/api/weapp/hot-lives',
    liveIntro: '/api/weapp/live/intro',
    recentLearning: '/api/weapp/mine/recent-learning',
    viewMore: '/api/weapp/view-more',
    fetchComment: '/api/weapp/topic/comment/get',
    totalSpeakList: '/api/weapp/topic/total-speak-list',
    topicShareQualify: '/api/wechat/topic/getTopicAutoQualify',
    channelShareQualify: '/api/wechat/channel/getChannelAutoQualify',
    liveShareQualify: '/api/wechat/live/getLiveShareQualify',
    bindLiveShare: '/api/weapp/channel/bind-live-share',
    vipRecord: '/api/weapp/mine/vip-purchase-record',

    /*话题详情页相关*/
    topicPageUv: '/api/wechat/topic/pageUv',
    
    /* 拼课相关接口 */
    groupInfo: '/api/weapp/channel/group/info',
    groupResult: '/api/weapp/channel/group/result',
    groupMemberList: '/api/weapp/channel/group/member-list',
    groupingList: '/api/weapp/channel/groupingList',
    countShareCache: '/api/weapp/channel/group/countShareCache',
    savePushInfo: '/api/weapp/channel/group/savePushInfo',

    /* 系列课相关 */
    channelInfo: '/api/weapp/channel/info',
    channelChargeStatus: '/api/weapp/channel/charge-status',
    lastLearnCourse: '/api/weapp/channel/last-learn-course',
    topicIdList: '/api/wechat/channel/topic-id-list',
	authFreeChannel: '/api/weapp/authFreeChannel',

    /* 直播间相关 */
    vipInfo: '/api/weapp/live/vip/info',
    blackInfo: '/api/weapp/live/black/info',

    checkIsHasGroup: '/api/weapp/channel/checkIsHasGroup',
    createGroup: '/api/weapp/channel/createGroup',
    getOpenPayGroupResult: '/api/weapp/channel/getOpenPayGroupResult',

    /*获取千聊小程序码 */
    getwxcode: '/api/weapp/getweappQr',
    // 获取二维码
    getQr: '/api/weapp/live/get-qr',
    /*判断是否分销 */
    isShare: '/api/weapp/isShare',
    /**获取带参二维码scene的参数 */
    scencInfo: '/api/weapp/sceneInfo',
    //领红包，群分享，得优惠
    bonusesCourseConfig:'/api/weapp/bonuses/courseConfig',  
    bonusesMyShareDetail:'/api/weapp/bonuses/myShareDetail', 
    bonusesDoShare:'/api/weapp/bonuses/doShare',
    bonusesJoinShare:'/api/weapp/bonuses/joinShare',
    bonusesRecentAcceptList:'/api/weapp/getRecentAcceptList/getRecentAcceptList',
    checkDuplicateBuy: '/api/weapp/checkDuplicateBuy',

    // 拆红包
    getStateInfo: '/api/weapp/bonuses/getStateInfo',
    getConfAndGroupInfo: '/api/weapp/bonuses/getConfAndGroupInfo',
    getGroupOpenRedpack: '/api/weapp/bonuses/getGroupOpenRedpack',
    openRedpack: '/api/weapp/bonuses/openRedpack',
    getAccountRedpackList: '/api/weapp/bonuses/getAccountRedpackList',
    getMaxCouponInfo: '/api/weapp/bonuses/getMaxCouponInfo',
    //小程序首页图标列表
    iconList: '/api/weapp/iconList',
    // 获取邀请卡的数据
    getShareData: '/api/weapp/share-card-data',
    getListWithoutQlUser: '/api/weapp/getListWithoutQlUser',
    // ios端首页免费的课程列表
    getIosFreeCourses: '/api/weapp/iosFreeCourses',
};

const fillPrefix = function(prefix, apis) {
    const keyss = Object.keys(apis);
    let newApis = {};

    for(let i = 0, len = keyss.length; i < len; i++){
        let key = keyss[i];

        newApis[key] = prefix + apis[key];
    }

    return newApis;
};

const api = fillPrefix(apiPrefix, apis);

export { api };
export { apiPrefix };
