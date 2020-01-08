var apiPrefix = {
    baseApi: 'http://inner.test3.qlchat.com',
    appApi: 'http://app.test3.qlchat.com',
    weiboApi: 'http://inner.test3.qlchat.com',
    wechatApi: 'http://inner.test3.qlchat.com',
    adminApi: 'http://inner.test3.qlchat.com',
    activityApi: 'http://inner.activity.test3.qlchat.com',
    weappApi: 'http://inner.opsweapp.qlchat.com',
    couponApi: 'http://inner.coupon.test3.qlchat.com',
    shareFrontApi: 'http://inner.share-front.test3.qlchat.com',
    communityApi: 'http://inner.community.test3.qlchat.com',
    choiceApi: 'http://livecenter.test3.qlchat.com',
    pointApi: 'http://inner.point.test3.qlchat.com',
    speakApi: 'http://inner.speak.test3.qlchat.com', 
    commentApi: 'http://inner.comment.test3.qlchat.com',
    interactApi: 'http://inner.interact.test3.qlchat.com', 
    shortKnowledgeApi: 'http://inner.common.test3.qlchat.com',
    toSourceApi: 'http://inner.test1.qlchat.com',
};

var secretMap = {
    baseApi: '846d2cb0c7f09c3ae802c42169a6302b',
    appApi: '846d2cb0c7f09c3ae802c42169a6302b',
    weiboApi: '846d2cb0c7f09c3ae802c42169a6302b',
    wechatApi: '846d2cb0c7f09c3ae802c42169a6302b',
    adminApi: '846d2cb0c7f09c3ae802c42169a6302b',
    activityApi: '846d2cb0c7f09c3ae802c42169a6302b',
    weappApi: '846d2cb0c7f09c3ae802c42169a6302b',
    couponApi: '846d2cb0c7f09c3ae802c42169a6302b',
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
        "port": 63795,
        "host": "211.159.219.193",
        "no_ready_check": true,
        "password": 'WdPTMj6X'
    },
    "tokenRedisConf": {
        "port": 63795,
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
        'port': 63795,
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
    wxOpenAppId: 'wx5e9fcf66cdacd88a',

    // 微博开放平台应用id
    weiboClientId: '3939804953',

    // 日志采集sdk及api前缀配置
    'collectjs': 'http://collect.test3.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.onpv.onvisible.browse.commonlog.js',
    'spaCollectjs': 'http://collect.test3.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.browse.commonlog.js?9',
    'collectApiPrefix': 'http://collect.test3.qlchat.com',
    'websocketUrl': 'ws://h5ws.test3.qlchat.com',
};

module.exports = config;
module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;
