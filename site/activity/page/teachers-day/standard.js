require('zepto');
// require('tapon');

var Handlebars = require('handlebars');

var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './standard.scss'
 */

var standard = {
    init: function (initData) {

        this.initRocket(initData)
        this.initListeners()
        // this.getConfig();

        // this.initShare = this.initShare.bind(this)
        // setTimeout(this.initShare, 1000);
    },

    initRocket: function (initData) {
        var width = 0
        if(initData.active_value > 100) {
            width = 100
        } else {
            width = initData.active_value
        }
        $(".process-item")[0].style.width = width + "%";
    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        $('body').on('click', '.dialog-conform', function () {
            $('.dialog-back').hide();
        });
        $('body').on('click', '.dialog-back', function () {
            $('.dialog-back').hide();
        });


        $('body').on('click', '.show-reword', function () {
            $('.dialog-back').show();
        });
        $('body').on('click', '.goto-promote', function () {
            setTimeout(function() {
                location.href = '/wechat/page/active-value/promote' + location.search
            }, 150);
        });
        $('body').on('click', '.return-btn', function () {
            setTimeout(function() {
                location.href = '/wechat/page/active-value' + location.search
            }, 150);
        });
    }

}

module.exports = standard;