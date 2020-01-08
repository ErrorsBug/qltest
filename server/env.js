var getenv = require('getenv');

module.exports.updateFromEnv = function (conf) {
    // 接口地址前缀
    conf.apiPrefix.baseApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_BASEAPI', conf.apiPrefix.baseApi);
    conf.apiPrefix.appApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_APPAPI', conf.apiPrefix.appApi);
    conf.apiPrefix.weiboApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_WEIBOAPI', conf.apiPrefix.weiboApi);
    conf.apiPrefix.wechatApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_WECHATAPI', conf.apiPrefix.wechatApi);
    conf.apiPrefix.adminApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_ADMINAPI', conf.apiPrefix.adminApi);
    conf.apiPrefix.activityApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_ACTIVITYAPI', conf.apiPrefix.activityApi);
    conf.apiPrefix.weappApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_WEAPPAPI', conf.apiPrefix.weappApi);
    conf.apiPrefix.couponApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_COUPONAPI', conf.apiPrefix.couponApi);
    conf.apiPrefix.shareFrontApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_SHAREFRONTAPI', conf.apiPrefix.shareFrontApi);
    conf.apiPrefix.communityApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_COMMUNITYAPI', conf.apiPrefix.communityApi);
    conf.apiPrefix.choiceApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_CHOICEAPI', conf.apiPrefix.choiceApi);
    conf.apiPrefix.pointApi = getenv('QLCHAT_NODEJS_FRONTEND_API_PREFIX_POINTAPI', conf.apiPrefix.pointApi);

    // 接口签名
    conf.secretMap.baseApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_BASEAPI', conf.secretMap.baseApi);
    conf.secretMap.appApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_APPAPI', conf.secretMap.appApi);
    conf.secretMap.weiboApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_WEIBOAPI', conf.secretMap.weiboApi);
    conf.secretMap.wechatApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_WECHATAPI', conf.secretMap.wechatApi);
    conf.secretMap.adminApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_ADMINAPI', conf.secretMap.adminApi);
    conf.secretMap.activityApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_ACTIVITYAPI', conf.secretMap.activityApi);
    conf.secretMap.weappApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_WEAPPAPI', conf.secretMap.weappApi);
    conf.secretMap.couponApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_COUPONAPI', conf.secretMap.couponApi);
    conf.secretMap.shareFrontApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_SHAREFRONTAPI', conf.secretMap.shareFrontApi);
    conf.secretMap.communityApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_COMMUNITYAPI', conf.secretMap.communityApi);
    conf.secretMap.choiceApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_CHOICEAPI', conf.secretMap.choiceApi);
    conf.secretMap.pointApi = getenv('QLCHAT_NODEJS_FRONTEND_API_KEY_POINTAPI', conf.secretMap.pointApi);

    // 请求超时
    conf.requestTimeout = getenv('QLCHAT_NODEJS_FRONTEND_REQUEST_TIMEOUT', conf.requestTimeout);

    // 服务运行端口
    conf.serverPort = getenv('QLCHAT_NODEJS_FRONTEND_SERVER_PORT', conf.serverPort);

    // 登录sessoin相关redis配置
    conf.redisConf.port = getenv('QLCHAT_NODEJS_FRONTEND_REDIS_PORT', conf.redisConf.port);
    conf.redisConf.host = getenv('QLCHAT_NODEJS_FRONTEND_REDIS_HOST', conf.redisConf.host);
    conf.redisConf.no_ready_check = getenv('QLCHAT_NODEJS_FRONTEND_REIDS_NOREADYCHECK', conf.redisConf.no_ready_check);

    if ('undefined' != typeof conf.redisConf.password) {
        conf.redisConf.password = getenv('QLCHAT_NODEJS_FRONTEND_REIDS_PASSWORD', conf.redisConf.password);
    }
    conf.redisExpire = getenv('QLCHAT_NODEJS_FRONTEND_REIDS_EXPIRE', conf.redisExpire);

    // 微信配置相关redis(主服务redis)配置
    conf.tokenRedisConf.port = getenv('QLCHAT_NODEJS_FRONTEND_TOKENREDIS_PORT', conf.tokenRedisConf.port);
    conf.tokenRedisConf.host = getenv('QLCHAT_NODEJS_FRONTEND_TOKENREDIS_HOST', conf.tokenRedisConf.host);
    conf.tokenRedisConf.no_ready_check = getenv('QLCHAT_NODEJS_FRONTEND_TOKENREDIS_NOREADYCHECK', conf.tokenRedisConf.no_ready_check);

    if ('undefined' != typeof conf.tokenRedisConf.password) {
        conf.tokenRedisConf.password = getenv('QLCHAT_NODEJS_FRONTEND_TOKENREDIS_PASSWORD', conf.tokenRedisConf.password);
    }
    

    // 静态服务相关redis配置
    conf.redisConfStaticHtml.port = getenv('QLCHAT_NODEJS_FRONTEND_STATICREDIS_PORT', conf.redisConfStaticHtml.port);
    conf.redisConfStaticHtml.host = getenv('QLCHAT_NODEJS_FRONTEND_STATICREDIS_HOST', conf.redisConfStaticHtml.host);
    conf.redisConfStaticHtml.no_ready_check = getenv('QLCHAT_NODEJS_FRONTEND_STATICREDIS_NOREADYCHECK', conf.redisConfStaticHtml.no_ready_check);

    if ('undefined' != typeof conf.redisConfStaticHtml.password) {
        conf.redisConfStaticHtml.password = getenv('QLCHAT_NODEJS_FRONTEND_STATICREDIS_PASSWORD', conf.redisConfStaticHtml.password);
    }
    

    // lru本地缓存配置
    conf.lruMaxAge = getenv('QLCHAT_NODEJS_FRONTEND_LRU_MAX_AGE', conf.lruMaxAge);
    conf.lruMax = getenv('QLCHAT_NODEJS_FRONTEND_LRU_MAX', conf.lruMax);

    // 微信开放平台appid（用于二维码登录二维码）
    conf.wxOpenAppId = getenv('QLCHAT_NODEJS_FRONTEND_WX_OPEN_APPID', conf.wxOpenAppId);

    // 微博应用id
    conf.weiboClientId = getenv('QLCHAT_NODEJS_FRONTEND_WEIBO_CLIENT_ID', conf.weiboClientId);

    // 日志采集配置
    conf.collectjs = getenv('QLCHAT_NODEJS_FRONTEND_COLLECTJS', conf.collectjs);
    conf.collectApiPrefix = getenv('QLCHAT_NODEJS_FRONTEND_SPACOLLECTJS', conf.collectApiPrefix);
    conf.spaCollectjs = getenv('QLCHAT_NODEJS_FRONTEND_COLLECT_APIPREFIX', conf.spaCollectjs);
    conf.websocketUrl = getenv('QLCHAT_NODEJS_FRONTEND_WEBSOCKET_URL', conf.websocketUrl);


    // console.log('conf:', conf);
    
    return conf;
};