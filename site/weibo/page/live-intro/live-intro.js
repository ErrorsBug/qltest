require('zepto');
// zeptofix
require('tapon');

var fastClick = require('fastclick');
var lazyimg = require('lazyimg');
var model = require('model');
var urlutils = require('urlutils');

var view = require('./view');
var conf = require('../conf');

var liveIntro = {
    init: function (initData) {
        this.initData = initData;

        /*頁面初始化*/        
        this.render();

        /*事件初始化*/        
        this.initListeners();
    },
    /**
     * 根据初始数据初始化渲染页面
     */
    render: function () {
        /*頂部介紹區域*/
        this.renderHeaders();

        /*介紹區域*/        
        this.renderIntroSection();

        /*價格區域*/        
        this.renderPriceSection();

        /*頻道區域*/        
        this.renderChannelSection();

        /*直播間區域*/        
        this.renderLiveroomSection();

        /*底部按鈕*/        
        this.renderFooters();        
    }  
} 