var apiPrefix = {
    baseApi: 'http://inner.test4.qlchat.com',
    appApi: 'http://app.test4.qlchat.com',
    weiboApi: 'http://inner.test4.qlchat.com',
    wechatApi: 'http://inner.test4.qlchat.com',
    adminApi: 'http://inner.test4.qlchat.com',
    activityApi: 'http://inner.activity.test4.qlchat.com',
    couponApi: 'http://inner.coupon.test4.qlchat.com',
    weappApi: 'http://inner.opsweapp.qlchat.com',
    shareFrontApi: 'http://inner.share-front.test4.qlchat.com',
    communityApi: 'http://inner.community.test4.qlchat.com',
    choiceApi: 'http://livecenter.test4.qlchat.com',
    pointApi: 'http://inner.point.test4.qlchat.com',
    speakApi: 'http://inner.speak.test4.qlchat.com', //开发环境ip 统一使用这个别改
    commentApi: 'http://inner.comment.test4.qlchat.com',
    shortKnowledgeApi: 'http://inner.common.test4.qlchat.com',
    interactApi: 'http://inner.interact.test4.qlchat.com', 
    toSourceApi: 'http://inner.test1.qlchat.com',
};

var secretMap = {
    baseApi: '846d2cb0c7f09c3ae802c42169a6302b',
    appApi: '846d2cb0c7f09c3ae802c42169a6302b',
    weiboApi: '846d2cb0c7f09c3ae802c42169a6302b',
    wechatApi: '846d2cb0c7f09c3ae802c42169a6302b',
    adminApi: '846d2cb0c7f09c3ae802c42169a6302b',
    activityApi: '846d2cb0c7f09c3ae802c42169a6302b',
    couponApi: '846d2cb0c7f09c3ae802c42169a6302b',
    weappApi: '846d2cb0c7f09c3ae802c42169a6302b',
    shareFrontApi: '846d2cb0c7f09c3ae802c42169a6302b',
    communityApi: '846d2cb0c7f09c3ae802c42169a6302b',
    choiceApi:'846d2cb0c7f09c3ae802c42169a6302b',
    pointApi: '846d2cb0c7f09c3ae802c42169a6302b',
    speakApi: '846d2cb0c7f09c3ae802c42169a6302b',
    commentApi: '846d2cb0c7f09c3ae802c42169a6302b',
    interactApi: '846d2cb0c7f09c3ae802c42169a6302b',
    shortKnowledgeApi: '846d2cb0c7f09c3ae802c42169a6302b',
    toSourceApi: '846d2cb0c7f09c3ae802c42169a6302b',
};

var config = {
    "requestTimeout": 10000,
    "serverPort": 5000,

    "redisConf": {
        "port": 63796,
        "host": "211.159.219.193",
        "no_ready_check": true,
        "password": 'WdPTMj6X'
    },
    "tokenRedisConf": {
        "port": 63796,
        "host": "211.159.219.193",
        "no_ready_check": true,
        "password": 'WdPTMj6X'
    },
    'actTokenRedisConf': {
        'port': 63791,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
    },
    'redisConfStaticHtml': {
        'port': 63796,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
        'expires': 1,
    },
    "redisExpire": 60 * 60 * 24,

    "lruMaxAge": 3600,
    "lruMax": 50,
    
    "client_params_keys": ["caller", "os", "ver", "platform", "userId", "sid"],

    // 微信开放平台appid
    wxOpenAppId: 'wx0e7bb0823794aa92',

    // 微博开放平台应用id
    weiboClientId: '3939804953',

    // 日志采集sdk及api前缀配置
    'collectjs': 'http://collect.test4.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.onpv.onvisible.browse.commonlog.js',
    'spaCollectjs': 'http://collect.test1.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.js?9',
    'collectApiPrefix': 'http://collect.test4.qlchat.com',
    'websocketUrl': 'ws://h5ws.test4.qlchat.com',
};

module.exports = config;
module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;
