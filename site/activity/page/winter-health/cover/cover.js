require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../../conf');
var wxutil = require('wxutil');
// var appSdk = require('appsdk');
// var envi = require('envi');

/**
 * @require '../../../components_modules/reset.css'
 * @require '../../../comp/common-css/ql-common.css'
 * @require './cover.scss'
 */

var standard = {
    init: function (initData) {
        this.initListeners()
    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //开始测试
        $('body').on('click','#start',function(e){
            var ch = urlUtils.getUrlParams("ch");
            var url = './test';
            if(ch){
                url = urlUtils.fillParams({ 
                    ch: ch
                }, url);
            }
            setTimeout(function(){
                window.location.href = url;
            },200);
        })
    }

}

module.exports = standard;