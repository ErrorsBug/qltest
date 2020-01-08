var path = require('path'),
    _ = require('underscore'),
    lo = require('lodash'),
    async = require('async'),

    wxAuth = require('../middleware/auth/1.0.0/wx-auth'),

    proxy = require('../components/proxy/proxy'),
    resProcessor = require('../components/res-processor/res-processor'),
    htmlProcessor = require('../components/html-processor/html-processor'),
    conf = require('../conf');



/**
 * 话题专题页
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-24T20:02:01+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
function testAudioPlay(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/test/page/test-audio/test-audio.html'),
        options = {
            filePath: filePath,
        };




    htmlProcessor(req, res, next, options);
}


/**
 * routes配置，配置格式如下：
 * routes = [
 *     ['get', '/abc', fun1, [fun2, fun3, ...]],
 *     ['post', '/abcd', fun1, fun2],
 *     ...
 * ]
 */
module.exports = [
    // 音频测试页
    ['GET', '/wechat/page/test/audio-play', testAudioPlay]
];
