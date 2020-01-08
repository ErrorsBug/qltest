require('zepto');
// require('zeptofix');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    Scrollload = require('scrollload_v3'),
    urlutils = require('urlutils'),
    appSdk = require('appsdk'),
    Tabbar = require('tabbar'),
    Promise = require('promise'),
    PayUtils = require('payutil'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common.css'
 * @require './login-success.css'
 */
var loginSuccess = {

    init: function (initData) {
        this.initEvent();
    },

    initEvent: function () {
        var that = this;

        $('.back').click(function () {
            
        });
        
        $('.wx').click(function () {
            
        });
    },
};

module.exports = loginSuccess;
