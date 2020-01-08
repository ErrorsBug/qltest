var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    Multer = require('multer'),
    // session = require('session'),
    cookieParser = require('cookie-parser'),
    redis = require('redis'),
    lo = require('lodash'),

    conf = require('./conf'),

    api = require('./middleware/api/api'),
    dangerDetect = require('./middleware/danger-detect/danger-detect'),
    // requestFilter = require('./middleware/request-filter/request-filter'),
    redis3xSession = require('./middleware/redis3x-session/redis3x-session'),
    flash = require('./middleware/flash/flash'),
    router = require('./middleware/router/router'),
    staticc = require('./middleware/static/static'),
    notFound = require('./middleware/not-found/not-found'),
    error = require('./middleware/error/error'),
    // Webpack_isomorphic_tools = require('webpack-isomorphic-tools'),

    routesPath = path.resolve(__dirname, './routes'),

    exphbs = require('express-handlebars'),

    app = express();

function getRedisClusterObj() {
    var redisOption = _.extend({
            retry_strategy: function (options) {
                // console.log('.....redis options: ', options);
                // if (options.error && options.error.code === 'ECONNREFUSED') {
                //     // End reconnecting on a specific error and flush all commands with a individual error
                //     return new Error('The redis server refused the connection');
                // }

                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands with a individual error
                    return new Error('Redis retry time exhausted');
                }
                // reconnect after
                return Math.max(options.attempt * 300, 3000);
            },
        }, conf.redisConf),
        redisCluster = redis.createClient(redisOption);

    // 监听redis事件
    _.each(['connect', 'ready', 'reconnecting', 'end', 'close', 'error'], function (e) {
        redisCluster.on(e, function (evt) {
            console.log('redis status: ' + e);
            if ('error' === e) {
                console.error(evt);
            }

            if ('ready' === e && typeof process.send != 'undefined') {
                console.log('cluster is ready');
                process.send('ready');
            }
        });
    });
    redisCluster.setAsync = function(){
        return new Promise((resolve, reject) => {
            const args = [...arguments];
            if(Object.prototype.toString.call(args[args.length - 1]) === "[object Function]"){
                args.pop();
            }
            redisCluster.set(...args, function(err, body){
                if(err){
                    reject(err)
                }else{
                    resolve(body)
                }
            })
        });
    };
    redisCluster.getAsync = function(key){
        return new Promise((resolve, reject) => {
            redisCluster.get(key, function(err, body){
                if(err){
                    reject(err)
                }else{
                    resolve(body)
                }
            })
        });
    };
    return redisCluster;
}


// 拦截错误暴露项目路径
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (/(node_modules)/.test(err.stack)) {
        res.status(err.status);
        res.send(err.message);
        return 
    }
    
    res.status(500);
    res.render('error', { error: err });
}


/**
 * 初始化服务（启用中间件）
 * @return {[type]} [description]
 */
function init() {
    var name = conf.name,
        version = conf.version,
        mode = conf.mode,
        root = conf.serverRoot,
        port = conf.serverPort;

    // 配置常用变量
    app.set('name', name);
    app.set('version', version);
    app.set('mode', mode);

    app.enable('trust proxy');

    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars', exphbs({
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        defaultLayout: 'main',
    }));
    app.set('view engine', 'handlebars');

   


    // for parsing application/json
    app.use(bodyParser.json({
        limit: '10mb',
    }));

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '10mb',
    }));

    app.use(errorHandler)

    // for parsing multipart/form-data file upload
    app.use(new Multer().single('file'));

    // 日志打印

    /**
     * current date
     */

    // logger.token('date', function getDateToken(req, res, format) {
    //     var date = new Date();

    //     switch (format || 'web') {
    //         case 'clf':
    //             return clfdate(date);
    //         case 'iso':
    //             return date.toISOString();
    //         case 'web':
    //             return date.toUTCString();
    //         case 'default':
    //             return date.toString();
    //     }
    // });

    /**
     * 日志添加打印用户id
     * @param  {[type]} 'userId' [description]
     * @param  {[type]} function getUserIdToken(req, res [description]
     * @return {[type]}          [description]
     */
    logger.token('userId', function getUserIdToken(req, res) {
        // return req.cookies && req.cookies.userId || (req.rSession && req.rSession.userId) || '';
        return lo.get(req, 'cookies.userId') || lo.get(req, 'rSession.user.userId') || '';
    });

    app.use(logger(':remote-addr - [:userId] - :remote-user ":method :url HTTP/:http-version" ":referrer" ":user-agent" :status :res[content-length] - :response-time ms'));

    // 危险检测
    app.use(dangerDetect());

    // 使用带签名的cookie，提高安全性
    app.use(cookieParser('$asdfeozsDLMNZXOPsf...zoweqhzil'));


    // 启用静态文件
    app.use(staticc());

    // 请求过滤器，识别请求类型存放于req.srcType中
    // app.use(requestFilter());

    if(conf.ignoreRedis && conf.mode === "development"){
    // if(false){
        // 在开发环境跳过连接redis，直接设置rSession对象
        console.log('development mode auto judge using redis or not.')
        app.use(function(req, res, next){
            if (req.get('Host').indexOf('qlchat') < 0) {
                req.rSession = req.rSession || {};
                if (!req.rSession.sessionId) {
                    req.rSession.sessionId = 'qlwrsid%3A9A715836-91F8-44A8-A65E-903594DAC1BC.Oaw%2BcdUMKLK0mPQ3mhubBPbVvKfBEzj6U1qRCAtSIvk';
                }
                next();
                console.log("[development mode] not use redis")
            } else {
                if (!app.redisCluster) {
                    app.redisCluster = getRedisClusterObj();
                }
                redis3xSession({
                    redisCluster: app.redisCluster,
                    expires: conf.redisExpire,
                })(req, res, next);
            }
        });
    } else {
        // 生成redis连接实例
        app.redisCluster = getRedisClusterObj();
        // redis session缓存服务开启
        app.use(redis3xSession({
            redisCluster: app.redisCluster,
            expires: conf.redisExpire,
        }));
    }

    // flash 临时消息存储服务开启
    app.use(flash());

    // 启用API
    app.use(api());

    // 启用路由
    app.use(router(routesPath));

    // 页面不存在
    app.use(notFound());

    // 启用出错打印中间件
    app.use(error());

    // 配置监听端口
    var serverOptions = [
        port,
    ];

    // 配置监听host
    if (conf.host) {
        serverOptions.push(conf.host);
    }

    // 监听回调
    serverOptions.push(function () {
        console.log('[mode:', mode, '] listening on port ', port);
        process.on('SIGINT', function () {
            process.kill(process.pid);
        });
    });

    return app.listen(...serverOptions);
}

exports.app = app;
exports.init = init;
// exports.init = function () {
//     var context = require('../site/brand/webpack.config').context;
//     console.log(context);
//     // 配置webpack 前后端同构的tool
//     global.webpack_isomorphic_tools = new Webpack_isomorphic_tools(require('../site/brand/webpack_isomorphic_tools_config'))
//         .server(context, init);
// };

module.exports.getRedisCluster = function () {
    if (!app.redisCluster) {
        app.redisCluster = getRedisClusterObj();
    }
    return app.redisCluster;
};
