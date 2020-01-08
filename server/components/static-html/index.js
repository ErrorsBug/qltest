const lo = require('lodash');
const redis = require('redis');
const express = require('express');

const conf = require('../../conf');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

// app 单例实例
const app = express();

// 缓存过期时间1个月
let keyExpire = 30 * 24 * 60 * 60;

export default class StaticHtml {

    // redis实例
    redisClient = null;

    // Key of VC on redis
    NODEJS_VC = 'NODEJS_VC';

    // Value of VC
    VC = '';

    constructor() {
        // 初始化redis client
        this.__initRedisClusterObj();
        // 初始化VC
        this.__initVc();
        // 从redis订阅VC
        // this.__subscribeVC();
        // 更新vc
        this.__updateVC();
    }

    /**
     * 获取staticHtml单例实例
     */
    static getInstance() {
        if (!app.staticHtml) {
            app.staticHtml = new StaticHtml();
        }

        return app.staticHtml;
    }

    // 初始化redis client
    __initRedisClusterObj() {
        this.redisClient = this.__createRedisClient();
    }

    // 创建一个新的redis实例
    __createRedisClient() {
        const redisOption = lo.extend({
            retry_strategy: function (options) {
                // console.log('[static html redis] redis options: ', options);
                // if (options.error && options.error.code === 'ECONNREFUSED') {
                //     // End reconnecting on a specific error and flush all commands with a individual error
                //     return new Error('[static html redis] The redis server refused the connection');
                // }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands with a individual error
                    return new Error('[static html redis] Redis retry time exhausted');
                }
                // reconnect after
                return Math.max(options.attempt * 300, 3000);
            },
        }, conf.redisConfStaticHtml);

        const redisCluster = redis.createClient(redisOption);

        // 监听redis事件
        ['connect', 'ready', 'reconnecting', 'end', 'close', 'error'].forEach(e => {
            redisCluster.on(e, function (evt) {
                console.log('[static html redis] redis status: ' + e);
                if ('error' === e) {
                    console.error('[static html redis] ', evt);
                }

                // if ('ready' === e && typeof process.send != 'undefined') {
                //     console.log('[static html redis] cluster is ready');
                    // process.send('[static html redis] ready');
                // }
            });
        })

        return redisCluster;
    }

    // 初始化VC
    __initVc() {
        this.redisClient.get(this.NODEJS_VC, (err, data) => {
            if (err) {
                console.error('[static html redis] redis get NODEJS_VC fail, ', err);
            } else {
                console.log('[static html redis] redis get NODEJS_VC: ', data);
                this.VC = data
            }
        });
    }

    // 从redis订阅VC
    // __subscribeVC() {
    //     const subClient = this.__createRedisClient();
    //     subClient.subscribe('update_vc');
    //     subClient.on('message', (channel, message) => {
    //         console.log('[static html redis] update NODEJS_VC: ', message);
    //         if (channel === 'update_vc') {
    //             this.VC = message;
    //         }
    //     });
    // }

    /**
     * 定时更新vc（redis集群不支持订阅）
     * @return {[type]} [description]
     */
    __updateVC() {
        setInterval(() => {
            this.__initVc();
        }, 60 * 1000);
    }

    /**
     * 获取缓存key值
     * @param  {[type]} keyPrefix 缓存key的前缀标识
     * @param  {[type]} id        前缀对应的实体id（话题或系列课id）
     * @return {[type]}           [description]
     */
    __getCacheKey(keyPrefix, id) {
        return `${keyPrefix}_${id}_${this.VC}`;
    }

    /**
     * 获取缓存的html内容
     * @param {string} keyPrefix
     * @param {string} id
     * @param {function} callback (err, htmlText) => null
     */
    getHtmlCache(keyPrefix, id, callback = (err, htmlText) => null) {
        if (!this.VC) {
            // console.log('[static html redis] NODEJS_VC is not inited')
            callback(null, '');
            return;
        }
        const CACHE_KEY = this.__getCacheKey(keyPrefix, id);
        console.log('[static html redis] get static html cache: ', CACHE_KEY);

        this.redisClient.get(CACHE_KEY, (err, htmlText) => {
            if (err) {
                console.error(`[static html redis] get cache ${CACHE_KEY} fail !!!`);
                callback(err);
                return;
            }

            callback(null, htmlText);
        });
    }

    /**
     * 同步获取缓存的html内容
     * @param {string} keyPrefix
     * @param {string} id
     * @param {object} req
     * @return {Promise}
     */
    async getHtmlCacheAsync({ keyPrefix, id, req }) {
        if (!this.VC) {
            // console.log('[static html redis] NODEJS_VC is not inited')
            return null;
        }

        if(req.query._vcdebug){
            // 如果带了_vcdebug，就不取缓存，不然调试窗出不来，也能防止把调试窗缓存起来
            return null;
        }

        // 将该页面标记为静态化页面处理
        req.isStaticHtml = true;
        // 注入静态化页面的前缀
        req.staticHtmlPrefix = keyPrefix;
        // 注入静态化页面的标识id
        req.staticHtmlId = id;

        const CACHE_KEY = this.__getCacheKey(keyPrefix, id);
        console.log('[static html redis] get static html cache: ', CACHE_KEY);

        return await this.redisClient.getAsync(CACHE_KEY).catch(e => {
            console.error(`[static html redis] get cache ${CACHE_KEY} fail !!!`);
        });
    }

    /**
     * 设置html缓存
     * @param {string} keyPrefix
     * @param {string} id
     * @param {string} htmlText
     */
    setHtmlCache(keyPrefix, id, htmlText, expires) {
        const CACHE_KEY = this.__getCacheKey(keyPrefix, id);

        console.log('[static html redis] set static html cache: ' + CACHE_KEY);
        const EX = expires || conf.redisConfStaticHtml.expires || keyExpire;

        this.redisClient.set(CACHE_KEY, htmlText, 'EX', EX, (err, result) => {
            if (err) {
                console.error('[static html redis] set static html cache fail !!!');
                return;
            }
        });
    }
}
