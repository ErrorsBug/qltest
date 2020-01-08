var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    UglifyJS = require("uglify-js"),
    jsSHA = require('jssha'),

    conf = require('../../conf'),
    md5 = require('../../components/md5/md5'),
    cache = require('../../components/cache/cache').local(),
    header = require('../../components/header/header'),
    weiboUtils = require('../../components/weibo-utils/weibo-utils'),
    server = require('../../server'),

    weiboJsSDKFilePath = path.resolve(__dirname, './src/weibo-sdk-1.0.0.jst'),
    weiboJsSDKConfFilePath = path.resolve(__dirname, './src/weibo-sdk-config.jst');

/**
 * 随机字符串
 * @return {[type]} [description]
 */
function createNonceStr(){
    return Math.random().toString(36).substr(2, 15);
}

/**
 * 计算时间戳
 * @return {[type]} [description]
 */
function createTimestamp(){
    return parseInt(new Date().getTime() / 1000) + '';
}


/**
 * 计算签名
 * @param  {[type]} ticket    [description]
 * @param  {[type]} noncestr  [description]
 * @param  {[type]} timestamp [description]
 * @param  {[type]} url       [description]
 * @return {[type]}           [description]
 */
function calcSignature(ticket, nonceStr, timestamp, url){
    var str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp='+ timestamp +'&url=' + url,
        shaObj = new jsSHA('SHA-1', 'TEXT');

    shaObj.update(str);

    return shaObj.getHash('HEX');
}


/**
 * 生成微信sdk相关配置项
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function generateWxAuthConfig(req, callback){

    weiboUtils.getConfig(function(weiboConfig){

        var apiUrl = req.headers['referer'],
            nonceStr = createNonceStr(),
            timestamp = createTimestamp(),
            url = apiUrl ? apiUrl : (conf.mode === 'prod'? 'https': req.protocol) + '://' + req.get('host') + req.originalUrl,
            ticket = weiboConfig.jsapiTicket,
            signature = calcSignature(ticket, nonceStr, timestamp, url),

            result = {
                // ticket: ticket,
                appKey: weiboConfig.appKey,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature
            };

        if ('function' === typeof callback) {
            callback(result);
        }

    });

}

/**
 * 将文件文本中以[[keyname]]括起来的变量名用data中对应keyname的值作替换
 * @param  {[type]} text [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var fillTextVars = function (text, data) {
    _.each(data, function (value, key) {
        var jsonV;
        if (_.isString(value)) {
            jsonV = value;
        } else {
            jsonV = JSON.stringify(value);
        }
        text = text.replace(new RegExp('\\[\\[' + key + '\\]\\]', 'g'), jsonV);
    });

    return text;
};

/**
 * 微博js-sdk静态资源获取及初始化接口
 * 注： 通过传debug字段决定是否开启调试模式
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function jsWeibo(req, res){
    var jssdkFile,
        configFile,
        returnFiles;

        // 生成缓存 key
        var configFileCacheKey = md5(weiboJsSDKConfFilePath),
            jssdkFileCacheKey = md5(weiboJsSDKFilePath);

        try {
            configFile = cache.get(configFileCacheKey);
            jssdkFile = cache.get(jssdkFileCacheKey);
            if (!configFile) {
                configFile = UglifyJS.minify(weiboJsSDKConfFilePath).code;
                cache.set(configFileCacheKey, configFile);
            }

            if (!jssdkFile) {
                jssdkFile = fs.readFileSync(weiboJsSDKFilePath, 'utf8');
                cache.set(jssdkFileCacheKey, jssdkFile);
            }
        } catch (e) {
            console.error('weibo jssdk file cache get Error', e);
            res.status(500).send('weibo jssdk get error');
            return;
        }

    generateWxAuthConfig(req, function(config){
        config.debug = !!req.query.debug;

        // 配置模板变量注入
        configFile = fillTextVars(configFile, config);

        //添加基础sdk及配置js文件
        returnFiles = [jssdkFile, configFile];


        header.contentType('js', res);
        header.cacheControl('1s', res);
        header.expire('1s', res);
        res.status(200).send(returnFiles.join(''));
    });
}

module.exports = [
    ['GET', '/api/js-sdk/weibo', jsWeibo]
];
