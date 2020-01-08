var fs = require('fs'),
    path = require('path'),

    _ = require('underscore'),
    
    getApiConf = require('./conf/api').getConf;
    updateFromEnv = require('./env').updateFromEnv;

var root = path.resolve(__dirname, '../public/'),
    global = path.resolve(root, 'g'),
    favicon = path.resolve(global, 'favicon.ico'),

    conf = {
        root: root,
        global: global,
        favicon: favicon,
    };

/**
 * 初始化配置
 * @param  {object} options 配置选项，可配置项mode,可选值为[development, test, prod]
 * @return {null}
 */
function init(options) {

    var confPath = '';
    if (options.cpath) {
        confPath = options.cpath;
    } else if (options.mode === 'prod') {
        confPath = path.resolve(__dirname, `./conf/config`);
    } else {
        confPath = path.resolve(__dirname, `./conf/config.${options.mode}`)
    }

    var confContents = {};

    try {
        confContents = require(confPath)
    } catch(e) {
        console.error('conf path error:', e);
    }

    conf = _.extend(conf, confContents);

    // 存在环境变量，优先读取环境变量
    conf = updateFromEnv(conf);

    // api参数拼接
    _.extend(conf, {}, getApiConf(conf.apiPrefix, conf.secretMap));

    // 将配置项 export 出去
    update(conf);
}

/**
 * 更新配置项
 * @param  {object} data 配置参数字典
 * @return {[type]}      [description]
 */
function update(data) {
    _.each(data, function (value, key) {
        exports[key] = value;
    });
}

exports.init = init;
exports.update = update;
