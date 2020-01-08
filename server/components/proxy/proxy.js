var request = require('request'),
    // Promise = require('bluebird'),
    http = require('http'),
    async = require('async'),
    _ = require('underscore'),
    lo = require('lodash'),
    md5 = require('../../components/md5/md5'),
    random = require('../../components/random/random'),


    conf = require('../../conf');

var keepAliveAgent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 1000 * 30,
});

const server = require('../../server');
const redis = server.getRedisCluster();
const url = require('url');
const LRU = require("lru-cache");
const cache = new LRU({
    maxAge: 1000 * 60 * 60
});

// 压测时本地数据缓存
// var cacheData = {};

/**
 * 组装服务端请求参数
 *
 * 返回格式：
 * {
 *   "id": "1332396785551379",
     "sign": "be4cf5f643cbf7b5eda61be121e6b349",
     "timestamp": "1234232352534",
     "data": params
 * }
 * @param  {Array} params 请求参数（Array)
 * @param  {String} secret 请求密钥
 * @return {Array}        [description]
 */
var wrapReqParams = function (params, secret) {
    var timeStamp = (new Date()).getTime(),
        reqId = timeStamp + random.randomNum(3),
        reqSign = md5(reqId + ':' + secret + ':' + timeStamp),
        wrapedParams = {
            id: reqId,
            sign: reqSign,
            timestamp: timeStamp,
        };

    wrapedParams.data = params;

    return wrapedParams;
};

var getIp = function(req) {
    if (!req) {
        return '';
    }
    return req.get('X-Real-Ip') || req.ip.replace('::ffff:','') || (req.headers && req.headers['x-forwarded-for']) || '';
}

/**
 * 服务端接口请求（伪）代理，请求获取的数据通过回调callback给回
 * @param  {[type]}   uri      [description]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var apiProxy = async function (uri, params, callback, secret, req) {

    if (params && params.topicId) {
        if (uri.indexOf('?') !== -1) {
            uri += `&topicId=${params.topicId}`
        } else {
            uri += `?topicId=${params.topicId}`
        }
    }

    const cacheParams = {...params};
    // 不能缓存userId
    delete cacheParams.userId;
    const apiCacheConfigMd5 = cache.get('apiCacheConfigMd5');
    const cacheKey = `${uri}${JSON.stringify(params)}-${apiCacheConfigMd5}`;

    if (params) {
        params.ip = getIp(req);
    }

    // 组装参数
    var postData = wrapReqParams(params, secret || conf.baseApi.secret);


    // 存在本地数据，则直接模拟接口延时响应
    // var tempParams = {...postData.data};
    // delete tempParams.time;
    // var cacheKey = uri + JSON.stringify(tempParams || {});

    // var resTime = Number(conf.resTime);
    // if (!!resTime) {
    //     if (cacheData[cacheKey]) {
    //         console.log(`使用缓存；resTim=${resTime}`);
    //         setTimeout(function() {
    //             callback(null, cacheData[cacheKey]);
    //         }, resTime);
    //         return;
    //     }
    // }

    var _serverRequestStartTime = process.hrtime();

    const apiCacheConfig = cache.get('apiCacheConfig') || {};
    const parsedUri = url.parse(uri);
    const redisCacheTime = apiCacheConfig[parsedUri.pathname];
    if(redisCacheTime){
        const data = await redis.getAsync(cacheKey).then(body => {
            return JSON.parse(body);
        }).catch(err => {
            console.error('[redis cache error] uri:', uri, ' params: ', JSON.stringify(params), ' error:', err, '\n');
            if (callback) {
                callback(err, null);
            }
        });
        if(data){
            if (callback) {
                callback(null, data);
            }
            const _serverRequestEndTime = process.hrtime();
            const ms = (_serverRequestEndTime[0] - _serverRequestStartTime[0]) * 1e3 +
                (_serverRequestEndTime[1] - _serverRequestStartTime[1]) * 1e-6;
            console.log('[', req && lo.get(req,'rSession.user.userId') ,'] [request api from redis cache] uri:' + uri + ' params:', JSON.stringify(params), ' key:', secret, ' response: ', JSON.stringify(data || '').slice(0, 400), ' response-time: ' + ms.toFixed(3) + ' ms', '\n');
            // console.log('[', req && JSON.stringify(req.headers) ,'] [request api] uri:' + uri + ' params:', JSON.stringify(params), ' key:', secret, ' response: ', JSON.stringify(body || '').slice(0, 400), ' response-time: ' + ms.toFixed(3) + ' ms', '\n');
            return;
        }else{
            console.log('[redis cache empty] uri:', uri, ' params: ', JSON.stringify(params), ' error: received empty body', '\n');
        }
    }

    (function (params, _serverRequestStartTime) {
        request.post({
            uri: uri,
            body: postData, // JSON.stringify(postData),
            json: true,
            timeout: conf.requestTimeout,
            headers: {
                'Connection': 'keep-alive',
                'Keep-Alive': 'timeout=60',
                'X-Request-ID': req && req.get('X-Request-ID') || '',
            },
            agent: keepAliveAgent,
            jsonReviver: (key, value) => {
                if ('string' === typeof value) {
                    return value.replace(/(\u0085)|(\u2028)|(\u2029)/g, (m) => "");
                }

                return value;
            }
        }, function (err, response, body) {
            var _serverRequestEndTime = process.hrtime();

            var ms = (_serverRequestEndTime[0] - _serverRequestStartTime[0]) * 1e3 +
                (_serverRequestEndTime[1] - _serverRequestStartTime[1]) * 1e-6;


            postData = null;
            _serverRequestStartTime = null;

            if (err) {
                if (callback) {
                    callback(err, null);

                    callback = null;
                }
                console.error('[proxy request error] uri:', uri, ' params: ', JSON.stringify(params), ' error:', err, '\n');

                params = null;
                uri = null;
                return;
            }

            if (callback) {
                // let bodyStr = JSON.stringify(body) || '';
                // console.log('[request server response-data] uri:' + uri, ' response: ', bodyStr.slice(0, 400), '\n');

                // bodyStr = bodyStr.replace(/(\u0085)|(\u2028)|(\u2029)/g, (m) => "");
                // try {
                //     body = JSON.parse(bodyStr);
                // } catch (e) {
                //     console.error('json parse error.', e);
                // }

                // 设置本地缓存
                // cacheData[cacheKey] = body;

                body = body || {};

                callback(null, body);

                callback = null;
            }

            if(redisCacheTime){
                redis.set(cacheKey, JSON.stringify(body || ''), 'EX', redisCacheTime)
            }

            console.log('[', req && lo.get(req,'rSession.user.userId') ,'] [request api] uri:' + uri + ' params:', JSON.stringify(params), ' key:', secret, ' response: ', JSON.stringify(body || '').slice(0, 400), ' response-time: ' + ms.toFixed(3) + ' ms', '\n');
            // console.log('[', req && JSON.stringify(req.headers) ,'] [request api] uri:' + uri + ' params:', JSON.stringify(params), ' key:', secret, ' response: ', JSON.stringify(body || '').slice(0, 400), ' response-time: ' + ms.toFixed(3) + ' ms', '\n');
            params = null;
            uri = null;
        });
    })(params, _serverRequestStartTime);
};

/**
 * 服务端接口请求（伪）代理，promise 封装
 * @param  {[type]}   uri      [description]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var apiProxyPromise = function (uri, params, secret, req) {
    return new Promise(function (resolve, reject) {
        apiProxy(uri, params, function(err, body) {
            if (err) {
                reject(err);
                return;
            }

            resolve(body);
        }, secret, req);
    });
};

/**
 * 并行请求，不用等到前一个函数执行完再执行下一个函数，如果函数触发了错误，可以在callback函数中验证
 *
 * @param {any} tasks [[name, uri, params, secret], [name, uri, params, secret], [name, uri, params, secret], ...]
 * @returns
 */
function parallelPromise(tasks, req) {
    var tasksArr = {};

    if (tasks[0].length === 4) {
        tasks.forEach(function (item) {
            tasksArr[item[0]] = function (callback) {
                apiProxy(item[1], item[2], callback, item[3], req);
            };
        });
    } else if (tasks[0].length === 3) {
        tasksArr = tasks.map(function (item) {
            return function (callback) {
                apiProxy(item[0], item[1], callback, item[2], req);
            };
        });
    } else {
        throw new Error('参数不正确!');
    }

    return new Promise(function (resolve, reject) {
        async.parallel(tasksArr, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * 线性执行任务
 * 当前面一个函数执行完成就会立即执行下一个函数，如果函数触发了错误，可以在callback函数中验证，否则会一直执行完成tasks
 *
 * @param {any} tasks [[name, uri, params, secret], [name, uri, params, secret], [name, uri, params, secret], ...]
 * @returns
 */
function seriesPromise(tasks, req) {
    var tasksArr = {};

    if (tasks[0].length === 4) {
        tasks.forEach(function (item) {
            tasksArr[item[0]] = function (callback) {
                apiProxy(item[1], item[2], callback, item[3], req);
            };
        });
    } else if (tasks[0].length === 3) {
        tasksArr = tasks.map(function (item) {
            return function (callback) {
                apiProxy(item[0], item[1], callback, item[2], req);
            };
        });
    } else {
        throw new Error('参数不正确!');
    }

    return new Promise(function (resolve, reject) {
        async.series(tasksArr, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

const updateApiCacheConfig = async function(){
    // 接口缓存信息，通过MD5戳判断是否有更新
    const apiCacheConfigMd5 = cache.get('apiCacheConfigMd5');
    const remoteApiConfigMd5 = await apiProxyPromise(`${conf.apiPrefix.baseApi}/h5/system/apiCacheConfigMd5`, {}, conf.baseApi.secret).then(res => {
        return lo.get(res, 'data.apiConfigMd5', '');
    });
    console.log(`[api cache config heart beat] remote config md5: ${remoteApiConfigMd5}. current config md5: ${apiCacheConfigMd5}.`)
    if(apiCacheConfigMd5 !== remoteApiConfigMd5){
        cache.set('apiCacheConfigMd5', remoteApiConfigMd5);
        console.log('api cache config has changed, getting the newest config, all the cached response would be reset.');
        apiProxyPromise(`${conf.apiPrefix.baseApi}/h5/system/apiCacheConfig`, {}, conf.baseApi.secret).then(res => {
            cache.set('apiCacheConfig', lo.get(res, 'data.apiConfig', {}));
        });
    }
    setTimeout(() => {
        updateApiCacheConfig();
    }, 5000);
};

updateApiCacheConfig();

module.exports.apiProxy = apiProxy;
module.exports.apiProxyPromise = apiProxyPromise;
module.exports.wrapReqParams = wrapReqParams;
module.exports.parallelPromise = parallelPromise;
module.exports.seriesPromise = seriesPromise;
