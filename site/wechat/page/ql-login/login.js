require('zepto');
// require('zeptofix');
require('tapon');

var wxlogin = require('wechatLogin');

/**
 * [index description]
 * @type {Object}
 * @require '../../components_modules/reset.css'
 * @require './login.css'
 */
var login = {
    init: function (initData) {
        wxlogin.wechatLogin('wxLogin', {
            appid: initData.wxOpenAppId,
            redirect_uri: initData.wxRedirectUrl,
            state: initData.state,
        });
    },
};


module.exports = login;
