var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    UglifyJS = require("uglify-js"),
    jsSHA = require('jssha'),

    conf = require('../../conf'),
    md5 = require('../../components/md5/md5'),
    cache = require('../../components/cache/cache').local(),
    header = require('../../components/header/header'),
    wxUtils = require('../../components/wx-utils/wx-utils'),
    server = require('../../server'),

    wxJsSDKFilePath = path.resolve(__dirname, './src/wx-sdk-1.3.0.jst'),
    wxJsSDKConfFilePath = path.resolve(__dirname, './src/wx-sdk-config.jst'),
	resProcessor = require('../../components/res-processor/res-processor');

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
function generateWxAuthConfig(req, callback) {
    

    const appIds = getAppId(req);

    wxUtils.getConfig(appIds && appIds.gongzhonghaoAppId, function(wxConfig){

        var apiUrl = req.headers['referer'],
            nonceStr = createNonceStr(),
            timestamp = createTimestamp(),
            url = apiUrl ? apiUrl : (conf.mode === 'prod'? 'https': req.protocol) + '://' + req.get('host') + req.originalUrl,
            ticket = wxConfig.jsapiTicket,
            signature = calcSignature(ticket, nonceStr, timestamp, url),

            result = {
                // ticket: ticket,
                appId: appIds ? appIds.gongzhonghaoAppId : wxConfig.appId,
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
 * 获取当前域名对应的APPID, 增粉活动用
 * @param {*} req 
 */
function getAppId (req) {
    const host = req.get('Host');
    try {
        return {
            kaifangAppId: conf.authAppIds[host].qrCodeAppId,
            gongzhonghaoAppId: conf.authAppIds[host].authAppId
        }
    } catch (error) {
        return null;
    }
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
 * 微信js-sdk静态资源获取及初始化接口
 * 注：通过 actions字段传递配置项（多个配置项以','分隔），通过debug字段判断是否开启调试模式
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function jsWeixin(req, res){
    var actions = req.query.actions,
        jssdkFile,
        configFile,
        returnFiles;

        // 生成缓存 key
        var configFileCacheKey = md5(wxJsSDKConfFilePath),
            jssdkFileCacheKey = md5(wxJsSDKFilePath);

        try {
            configFile = cache.get(configFileCacheKey);
            jssdkFile = cache.get(jssdkFileCacheKey);
            if (!configFile) {
                configFile = UglifyJS.minify(wxJsSDKConfFilePath).code;
                cache.set(configFileCacheKey, configFile);
            }

            if (!jssdkFile) {
                jssdkFile = fs.readFileSync(wxJsSDKFilePath, 'utf8');
                cache.set(jssdkFileCacheKey, jssdkFile);
            }
        } catch (e) {
            console.error('wx jssdk file cache get Error', e);
            res.status(500).send('wx jssdk get error');
            return;
        }

    generateWxAuthConfig(req, function(config){
        config.debug = !!req.query.debug;

        // 配置模板变量注入
        configFile = fillTextVars(configFile, config);

        //添加基础sdk及配置js文件
        returnFiles = [jssdkFile, configFile];

        // 添加功能定制项js
        if (undefined !== actions) {
            actions = _.uniq(actions.split(','));

            //获取添加的js文件
            _.each(actions, function(filename){
                filename = filename.trim();
                var filePath = path.resolve(__dirname, './src/wx-actions/' + filename + '.jst'),
                    fileContent = '';

                var fileCacheKey = md5(filePath);
                try {
                    fileContent = cache.get(fileCacheKey);
                    if (!fileContent) {
                        fileContent = UglifyJS.minify(filePath).code;
                        cache.set(fileCacheKey, fileContent);
                    }
                } catch (err) {
                    console.error('wx jssdk action file cache get error:', err);
                }
                if (fileContent) {
                    returnFiles.push(fileContent);
                }
            });
        }

        header.contentType('js', res);
        header.cacheControl('1s', res);
        header.expire('1s', res);
        res.status(200).send(returnFiles.join(''));
    });
}

/**
 * 获取微信js-sdk配置接口
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function wxConfig(req, res){
	generateWxAuthConfig(req, function(config){
		config.debug = !!req.query.debug;
		resProcessor.jsonp(req, res, config);
    });
}

module.exports = [
    ['GET', '/api/js-sdk/wx', jsWeixin],
	['GET', '/api/js-sdk/wx/config', wxConfig]
];
