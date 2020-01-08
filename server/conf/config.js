var apiPrefix = {
    baseApi: '',
    appApi: '',
    weiboApi: '',
    wechatApi: '',
    adminApi: '',
    activityApi: '',
    weappApi: '',
    couponApi: '',
    shareFrontApi: '',
    communityApi: '',
    homeWrokApi: '',
    privateApi: '',
    kaifangApi: ''
};

var secretMap = {
    baseApi: '',
    appApi: '',
    weiboApi: '',
    wechatApi: '',
    adminApi: '',
    activityApi: '',
    weappApi: '',
    couponApi: '',
    shareFrontApi: '',
    communityApi: '',
    homeWrokApi: '',
    privateApi: '',
    kaifangApi: ''
};

var config = {
    // 请求超时配置
    "requestTimeout": 7000,

    // 默认服务端口
    "serverPort": 5000,

    // redis
    "redisConf": {
        "port": 0,
        "host": "127.0.0.1",
        "no_ready_check": true,
    },
    "tokenRedisConf": {
        "port": 0,
        "host": "127.0.0.1",
        "no_ready_check": true,
    },
    'redisConfStaticHtml': {
        'port': 0,
        'host': '127.0.0.1',
        'no_ready_check': true,
    },
    "redisExpire": 60 * 60 * 24,

    "lruMaxAge": 77760000,
    "lruMax": 500,

    // 客户端公参接收配置
    "client_params_keys": ["caller", "os", "ver", "platform", "userId", "sid"],

    // 微信开放平台appid
    wxOpenAppId: '',

    // 微博开放平台应用id
    weiboClientId: '',

    // 日志采集sdk及api前缀配置
    collectjs: '',
    collectApiPrefix: '',
    'spaCollectjs': '',
    'websocketUrl': '',
};


module.exports = config;

module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;   