require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../../conf');
var wxutil = require('wxutil');
var model = require('model');
// var appSdk = require('appsdk');
// var envi = require('envi');

/**
 * @require '../../../components_modules/reset.css'
 * @require '../../../comp/common-css/ql-common.css'
 * @require './test.scss'
 */

var standard = {
    init: function (initData) {
        this.initListeners();
        this.initStore();
    },
    //数据初始化
    initStore: function(){
        this.score = 70;
        this.ind = 0;
    },
    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //题目切换
        $('body').on('click','.btn',function(e){that.switchTest(e);});
        //答题完毕
        $('body').on('click','.last-btn',function(e){that.completeTest(e);});
    },
    //试题切换
    switchTest: function(e){
        var $tar = $(e.currentTarget),
            li = $tar.parents('li'),
            index = li.index()+1,
            left = -li.width()*index,
            that = this;
        //防止多次计算同一个选项的分数
        if (that.ind === index){
            e.preventDefault();
        }else {
            //计算得分
            if(index === 5 || index === 6){
                if($tar.hasClass('n')){
                    that.score -= 5;
                }
                if($tar.hasClass('y')){
                    that.score += 5;
                }
            }else {
                if($tar.hasClass('n')){
                    that.score += 5;
                }
                if($tar.hasClass('y')){
                    that.score -= 5;
                }
            }
            setTimeout(function(){
                $('#ul').css({left: left + 'px'});
                var pro = $('#pro'),
                    width = pro.parent().width()*(index+1)/7;
                //进度条
                pro.css({width: width});
                $('#count').text(index+1+'/7');
            },200); 
            that.ind = index;
        }
    },
    //答题完毕
    completeTest: function(e){
        var $tar = $(e.currentTarget),
            li = $tar.parents('li'),
            index = li.index()+1,
            that = this;
        //防止多次计算同一个选项的分数
        if (that.ind === index){
            e.preventDefault();
        }else {
            var remark = $tar.index()+1;
            setTimeout(function(){
                $('#generate').show();
                $('#content').hide();
                var width = $('.result-progress').width();
                //生成结果进度条
                $('#generate .tip').css({width: width});
                setTimeout(function(){
                    model.fetch({//领取优惠券
                        type: 'POST',
                        url: '/api/wechat/activity/winterHealth/getCoupon',
                        data: {},
                        success: function(res){
                            if(res.state.code === 0){
                                var ch = urlUtils.getUrlParams("ch");
                                var url = './result?score='+that.score+'&remark='+remark;
                                if(ch){
                                    url = urlUtils.fillParams({ 
                                        ch: ch
                                    }, url);
                                }
                                window.location.href = url;
                            }
                        },
                        error: function(err){
                            console.error(err);
                        }
                    });
                },3000);
            },200);
            that.ind = index;
        }
    }
}

module.exports = standard;