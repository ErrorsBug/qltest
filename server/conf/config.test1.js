var apiPrefix = {
    baseApi: 'http://inner.test1.qlchat.com',
    appApi: 'http://app.test1.qlchat.com',
    weiboApi: 'http://inner.test1.qlchat.com',
    wechatApi: 'http://inner.test1.qlchat.com',
    adminApi: 'http://inner.test1.qlchat.com',
    activityApi: 'http://inner.activity.test1.qlchat.com',
    weappApi: 'http://inner.opsweapp.qlchat.com',
    shareFrontApi: 'http://inner.share-front.test1.qlchat.com',
    couponApi: 'http://inner.coupon.test1.qlchat.com',
    communityApi: 'http://inner.community.test1.qlchat.com',
    choiceApi: 'http://livecenter.test1.qlchat.com',
    pointApi: 'http://inner.point.test1.qlchat.com',
    speakApi: 'http://inner.speak.test1.qlchat.com', //开发环境ip 统一使用这个别改
    commentApi: 'http://inner.comment.test1.qlchat.com',
    interactApi: 'http://inner.interact.test1.qlchat.com', 
    shortKnowledgeApi: 'http://inner.common.test1.qlchat.com',
    spareApi: 'http://ydys.test1.qlchat.com',
    toSourceApi: 'http://inner.test1.qlchat.com',
    homeworkApi: 'http://inner.homework.test1.qlchat.com',
    privateApi: 'http://inner.bigdata.test1.qlchat.com',
    kaifangApi: 'http://inner.kaifang.test1.qlchat.com'
};

var secretMap = {
    baseApi: '846d2cb0c7f09c3ae802c42169a6302b',
    appApi: '846d2cb0c7f09c3ae802c42169a6302b',
    weiboApi: '846d2cb0c7f09c3ae802c42169a6302b',
    wechatApi: '846d2cb0c7f09c3ae802c42169a6302b',
    adminApi: '846d2cb0c7f09c3ae802c42169a6302b',
    activityApi: '846d2cb0c7f09c3ae802c42169a6302b',
    weappApi: '846d2cb0c7f09c3ae802c42169a6302b',
    shareFrontApi: '846d2cb0c7f09c3ae802c42169a6302b',
    couponApi: '846d2cb0c7f09c3ae802c42169a6302b',
    communityApi: '846d2cb0c7f09c3ae802c42169a6302b',
    choiceApi:'846d2cb0c7f09c3ae802c42169a6302b',
    pointApi: '846d2cb0c7f09c3ae802c42169a6302b',
    speakApi: '846d2cb0c7f09c3ae802c42169a6302b',
    commentApi: '846d2cb0c7f09c3ae802c42169a6302b',
    interactApi: '846d2cb0c7f09c3ae802c42169a6302b',
    shortKnowledgeApi: '846d2cb0c7f09c3ae802c42169a6302b',
    spareApi: '846d2cb0c7f09c3ae802c42169a6302b',
    toSourceApi: '846d2cb0c7f09c3ae802c42169a6302b',
    homeworkApi: '846d2cb0c7f09c3ae802c42169a6302b',
    privateApi: '846d2cb0c7f09c3ae802c42169a6302b',
    kaifangApi: '846d2cb0c7f09c3ae802c42169a6302b',
};

var config = {
    "requestTimeout": 10000,
    "serverPort": 5000,

    "redisConf": {
        "port": 63793,
        "host": "211.159.219.193",
        "no_ready_check": true,
        "password": 'WdPTMj6X'
    },
    "tokenRedisConf": {
        "port": 63793,
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
        'port': 63793,
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
    wxOpenAppId: 'wxc7753dbffafdbb10',

    // 微博开放平台应用id
    weiboClientId: '3939804953',

    // 各种域名下的公众号的appId配置
    authAppIds: {
        'ydys.test1.qlchat.com': {
            qrCodeAppId:'',
            authAppId: 'wxcf6d2052647d4e62',
        },
        'knowledge.test1.qlchat.com': {
            qrCodeAppId:'wxc7753dbffafdbb10',
            authAppId: 'wx3f442d48efd996c5',
        },
    },

    // 日志采集sdk及api前缀配置
    'collectjs': 'http://collect.dev1.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.onpv.onvisible.browse.commonlog.js',
    'spaCollectjs': 'http://collect.dev1.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.onpv.onvisible.browse.commonlog.js',
    'collectApiPrefix': 'http://collect.dev1.qlchat.com',
    'websocketUrl': 'ws://h5ws.test1.qlchat.com',
};

module.exports = config;
module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;
