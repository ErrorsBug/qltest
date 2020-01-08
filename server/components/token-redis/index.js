var lo = require('lodash'),
    redis = require('redis'),

    conf = require('../../conf');

var redisCluster;
var actRedisCluster;

function _getRedisClusterObj(red,redisConf = conf.tokenRedisConf) {
    var redisOption = lo.extend({
            retry_strategy: function (options) {
                // console.log('[token redis] redis options: ', options);
                // if (options.error && options.error.code === 'ECONNREFUSED') {
                //     // End reconnecting on a specific error and flush all commands with a individual error
                //     return new Error('[token redis] The redis server refused the connection');
                // }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands with a individual error
                    return new Error('[token redis] Redis retry time exhausted');
                }
                // reconnect after
                return Math.max(options.attempt * 300, 3000);
            },
        }, redisConf),
        red = redis.createClient(redisOption);

    // 监听redis事件
    lo.each(['connect', 'ready', 'reconnecting', 'end', 'close', 'error'], function (e) {
        red.on(e, function (evt) {
            console.log('[token redis] redis status: ' + e);
            if ('error' === e) {
                console.error('[token redis]', evt);
            }

            // if ('ready' === e && typeof process.send != 'undefined') {
            //     console.log('cluster is ready');
            //     process.send('ready');
            // }
        });
    });
    return red;
}

function getCluster() {
    if (!redisCluster) {
        redisCluster = _getRedisClusterObj(redisCluster);
    }
    return redisCluster;
}
function getActCluster() {
    if (!actRedisCluster) {
        actRedisCluster = _getRedisClusterObj(actRedisCluster,redisConf = conf.actTokenRedisConf);
    }
    return actRedisCluster;
}

// 服务启动时创建实例
getCluster();
getActCluster();
module.exports.getCluster = getCluster;
module.exports.getActCluster = getActCluster;