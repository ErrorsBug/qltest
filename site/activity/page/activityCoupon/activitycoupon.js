require('zepto');

var fastClick = require('fastclick');
var urlUtils = require('urlutils');

var conf = require('../conf');
var toast = require('toast');
var view = require('./view');
var wxutil = require('wxutil');

var conf = require('../conf');
var model = require('model');
/**
 * [activityCard description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './activitycoupon.scss'
 */
var activityCoupon = {
    init: function(data){
        view.ficker();
        view.getScroll();
        this.initListeners();
        this.initShare();
    },
    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //点击领用按钮
        $('body').on('click','.btn.none',function(e){that.getCouponCode(e);});
        //点击立即使用按钮
        $('body').on('click','.btn.bind',function(e){
            setTimeout(function(){
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
            setTimeout((function(e){
                view.useQuickly(e);
            })(e),200)
        });
        //话题点击
        $('body').on('click','.coupon-area-list' ,function(e){that.onTopicClick(e)});
    },
    //页面分享
    initShare: function () {
        var url = window.location.href;
        wxutil.share({
            title: "【10月知识·购优惠】低至5元，就能买到的干货实用课程" ,
            desc: "如何穿衣时尚搭配？如何有效减脂瘦身？如何改变孩子做作业拖拉？工薪阶层如何借助理财，加速财富积累？",
            imgUrl: '',
            link: url,
            successFn: function () {
                if (typeof _qla != 'undefined') {
                    _qla('event', {
                        category: 'wechat_share',
                        action: 'success'
                    });
                }
            }
        });  
    },
    getCouponCode: function(e){
        var params = {
            promotionId: $(e.currentTarget).attr('data-id')
        };
        model.fetch({
            type: 'POST',
            data: params,
            url: '/api/wechat/activity/coupon/getCouponCode',
            success: function(res){
                if (res.state.code === 0) {
                    toast.toast('领取成功',500,'middle');
                    view.getCoupon(e);
                }else{
                    toast.toast(res.state.msg,500,'middle');
                }
            },
            error: function(err){
                console.error(err);
                toast.toast("领取失败",500,'middle');
            }
        });
    },
    onTopicClick: function(e){
        var url = $(e.currentTarget).attr('data-url');
        view.setScroll();
        setTimeout(function(){
            window.location.href = url;
        },200);
    }
};

module.exports =activityCoupon;