var apiPrefix = {
    baseApi: 'http://inner.dev2.qlchat.com', //开发环境ip 统一使用这个别改
    appApi: 'http://app.dev2.qlchat.com',
    weiboApi: 'http://inner.dev2.qlchat.com',//开发环境ip 统一使用这个别改
    wechatApi: 'http://inner.dev2.qlchat.com',//开发环境ip 统一使用这个别改
    adminApi: 'http://inner.dev2.qlchat.com',
    activityApi: 'http://inner.activity.dev2.qlchat.com',
    weappApi: 'http://inner.opsweapp.qlchat.com',
    couponApi: 'http://inner.coupon.dev2.qlchat.com',
    shareFrontApi: 'http://inner.share-front.dev2.qlchat.com',
    communityApi: 'http://inner.community.dev2.qlchat.com',
    choiceApi: 'http://livecenter.dev2.qlchat.com',
    pointApi: 'http://inner.point.dev2.qlchat.com',
    speakApi: 'http://inner.speak.dev2.qlchat.com', //开发环境ip 统一使用这个别改
    commentApi: 'http://inner.comment.dev2.qlchat.com',
    shortKnowledgeApi: 'http://inner.common.dev2.qlchat.com',
    interactApi: 'http://inner.interact.dev2.qlchat.com', 
    toSourceApi: 'http://inner.dev2.qlchat.com',
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
    shortKnowledgeApi: '846d2cb0c7f09c3ae802c42169a6302b',
    interactApi: '846d2cb0c7f09c3ae802c42169a6302b',
    toSourceApi: '846d2cb0c7f09c3ae802c42169a6302b',
};


var config = {
    'requestTimeout': 300000,
    'serverPort': 5000,

    'ignoreRedis': true,
    'redisConf': {
        'port': 63792,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
    },
    'tokenRedisConf': {
        'port': 63792,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
    },
    'actTokenRedisConf': {
        'port': 63791,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
    },
    'redisConfStaticHtml': {
        'port': 63792,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
        'expires': 1,
    },
    'redisExpire': 60 * 60 * 24,

    'lruMaxAge': 2,
    'lruMax': 2,

    'client_params_keys': ['caller', 'os', 'ver', 'platform', 'userId', 'sid'],

    // 微信开放平台appid
    'wxOpenAppId': 'wx81f009999afa2660',

    // 微博开放平台应用id
    'weiboClientId': '3939804953',

    // 日志采集sdk及api前缀配置
    'collectjs': 'http://collect.dev2.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.onpv.onvisible.browse.commonlog.js',
    'spaCollectjs': 'http://collect.dev2.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.js?9',
    'collectApiPrefix': 'http://collect.dev2.qlchat.com',
    'websocketUrl': 'ws://h5ws.dev2.qlchat.com',
};

module.exports = config;
module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;
