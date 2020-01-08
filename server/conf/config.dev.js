var apiPrefix = {
    baseApi: 'http://inner.dev1.qlchat.com', //开发环境ip 统一使用这个别改
    appApi: 'http://app.dev1.qlchat.com',
    weiboApi: 'http://inner.dev1.qlchat.com',//开发环境ip 统一使用这个别改
    wechatApi: 'http://inner.dev1.qlchat.com',//开发环境ip 统一使用这个别改
    adminApi: 'http://inner.dev1.qlchat.com',
    activityApi: 'http://inner.activity.dev1.qlchat.com',
    weappApi: 'http://opsweapp.dev1.qlchat.com',
    couponApi: 'http://inner.coupon.dev1.qlchat.com',
    shareFrontApi: 'http://inner.share-front.dev1.qlchat.com',
    communityApi: 'http://inner.community.dev1.qlchat.com',
    choiceApi: 'http://livecenter.dev1.qlchat.com',
    pointApi: 'http://inner.point.dev2.qlchat.com',
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

};


var config = {
    'requestTimeout': 300000,
    'serverPort': 5000,

    'ignoreRedis': false,
    'redisConf': {
        'port': 63791,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
    },
    'tokenRedisConf': {
        'port': 63791,
        'host': '211.159.219.193',
        'no_ready_check': true,
        'password': 'WdPTMj6X',
    },
    'redisConfStaticHtml': {
        'port': 63791,
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
    'wxOpenAppId': 'wx254e3ee5d4832188',

    // 微博开放平台应用id
    'weiboClientId': '3939804953',

    // 日志采集sdk及api前缀配置
    'collectjs': 'http://collect.dev1.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.onpv.onvisible.browse.commonlog.js',
    'spaCollectjs': 'http://collect.dev1.qlchat.com/js/c.click.event.pv.error.visible.query.onlog.js?9',
    'collectApiPrefix': 'http://collect.dev1.qlchat.com',
    'websocketUrl': 'ws://h5ws.dev1.qlchat.com'
};

module.exports = config;
module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;
