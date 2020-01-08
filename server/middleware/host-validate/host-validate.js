const lo = require('lodash');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
const envi = require('../../components/envi/envi');

// 用于验证活动页面的域名是否正确。
// 有些活动更改了公众号和域名，需要兼容旧地址
module.exports = function (hvType) {
    return function (req, res, next) {
        let type = hvType;
        // 只有生产环境微信端才需要更换域名
        if (!envi.isWeixin(req)) {
            type = 'main';
        }
        if (conf.mode !== 'prod') {
            next();
            return ;
        }else if(type === 'main' && (req.get('Host') === 'm.qlchat.com'||req.get('Host') === 'test.qlchat.com')){
            next();
            return ;
        }
        proxy.apiProxy(conf.toSourceApi.getDomainUrl, {type}, function(err, body) {
            if (err) {
                next();
                return;
            }

            if (lo.get(body, 'state.code') === 0) {
                let domainUrl = lo.get(body, 'data.domainUrl')

                const urlTest = domainUrl.replace(/(\w*\:\/\/)/,'').replace(/(\/)$/,'');
                if(lo.get(req,"hostname") !== urlTest ){
                    res.redirect(`${domainUrl.replace(/(\/)$/,'')}${lo.get(req,"url")}`);
                    return false;
                }
            } 

            next();
        }, conf.toSourceApi.secret);
    };
}