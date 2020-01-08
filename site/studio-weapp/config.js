const apiPrefix = '__API_PREFIX';

const apis = {
    login: '/api/studio-weapp/studio/auth/login',
    userInfo: '/api/studio-weapp/user/info',
    sysTime:'/api/base/sys-time',
    getAllTagLives: '/api/studio-weapp/assort/tag-lives',
    getIndexData: '/api/studio-weapp/index-data',
    introTopicInit: '/api/studio-weapp/page/topic/intro',
    introTopicSecond:'/api/studio-weapp/page/topic/introSecond',
    thousandLiveInit: '/api/studio-weapp/page/topic/thousandLive',
    plainLiveInfo: '/api/studio-weapp/page/topic/plain-live',
    getSpeak:'/api/studio-weapp/page/topic/getSpeak',
    getComment:'/api/studio-weapp/page/topic/getComment',
    getFollowerLive: '/api/studio-weapp/mine/follower-live',
    getPurchaseRecord: '/api/studio-weapp/mine/purchase-record',
    initLiveIndex: '/api/studio-weapp/live/index',
    getTopicList: '/api/studio-weapp/topic/list',
    getLiveTopicList: '/api/studio-weapp/topic/live-topic-list',
    getChannelTypes: '/api/studio-weapp/live/type-list',
    getChannelList: '/api/studio-weapp/channel/list',
    getChannelIndex: '/api/studio-weapp/channel/index',
    doFollow: '/api/studio-weapp/live/focus',
    addComment: '/api/studio-weapp/comment/add',
    delComment: '/api/studio-weapp/comment/del',
    getPPT: '/api/studio-weapp/ppt/get',
    getFollowerInit:'/api/studio-weapp/mine/follower-init',
    payFree: '/api/studio-weapp/orderFree',
    minePreview: '/api/studio-weapp/mine/preview',
    courseList: '/api/studio-weapp/assort/charge/course-list',
    hotLiveS: '/api/studio-weapp/hot-lives',
    liveIntro: '/api/studio-weapp/live/intro',
    recentLearning: '/api/studio-weapp/mine/recent-learning',
    fetchComment: '/api/studio-weapp/topic/comment/get',
    totalSpeakList: '/api/studio-weapp/topic/total-speak-list',
    topicShareQualify: '/api/studio-weapp/topic/getTopicAutoQualify',
    channelShareQualify: '/api/studio-weapp/channel/getChannelAutoQualify',
    liveShareQualify: '/api/studio-weapp/live/getLiveShareQualify',
    bindLiveShare: '/api/studio-weapp/channel/bind-live-share',
    vipRecord: '/api/studio-weapp/mine/vip-purchase-record',
    checkDuplicateBuy: '/api/studio-weapp/channel/check-duplicate-buy',
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
