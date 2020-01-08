let path = require('path');
let _ = require('underscore');
let lo = require('lodash');
let async = require('async');
let clientParams = require('../../middleware/client-params/client-params');
let proxy = require('../../components/proxy/proxy');
let resProcessor = require('../../components/res-processor/res-processor');
let htmlProcessor = require('../../components/html-processor/html-processor');
let conf = require('../../conf');
let wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
let authorityList = require('../../components/constants').authorityList
let appAuth = require('../../middleware/auth/1.0.0/app-auth')

/**
 * 搜索主页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageSearchIndex(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/wechat/page/search/search.html');
    proxy.apiProxy(conf.baseApi.live.authorities, {}, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        let options = {
            filePath,
            fillVars: {
                AUTHORITY_LIST: lo.get(body,'data.dataList',[]),
            },
            renderData: {},
        };
        options.fillVars.NOWTIME = new Date().getTime();
        htmlProcessor(req, res, next, options);

    }, conf.baseApi.secret, req);
}

module.exports = [
    // 话题详情主页
    // ['GET', '/wechat/page/search/index', clientParams(), appAuth(), wxAuth(), pageSearchIndex],
];
