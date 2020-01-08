const studioWeappAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
const requestProcess = require('../../middleware/request-process/request-process');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
var lo = require('lodash');
var resProcessor = require('../../components/res-processor/res-processor');

// 优惠券重构后参数重定义了
const bindCouponCode = function(req, res, next) {
    const userId = lo.get(req, 'rSession.user.userId','');

    let params = {
        businessType: req.query.type,
        businessId: req.query.businessId,
        couponCode: req.query.code,
        userId: userId,
    };

    proxy.apiProxy(conf.couponApi.coupon.bindCouponByCode, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.couponApi.secret, req);
}

module.exports = [
    // 获取优惠券
    ['GET', '/api/studio-weapp/mine/coupon-list', studioWeappAuth(), requestProcess(conf.couponApi.coupon.myCouponList, conf.couponApi.secret)],

    // 优惠码分享，解除原优惠码的关系
    ['GET', '/api/studio-weapp/coupon/transform-coupon', studioWeappAuth(), requestProcess(conf.baseApi.coupon.transformCoupon, conf.baseApi.secret)],

    // 获取分享出的优惠券的信息
    ['GET', '/api/studio-weapp/coupon/get-transform-coupon', studioWeappAuth(), requestProcess(conf.baseApi.coupon.getTransformCoupon, conf.baseApi.secret)],

    // 绑定分享出的优惠券
    ['GET', '/api/studio-weapp/coupon/bind-transform-coupon', studioWeappAuth(), requestProcess(conf.baseApi.coupon.bindTransformCoupon, conf.baseApi.secret)],

    // 课程 系列课 vip绑定优惠码
    ['GET', '/api/studio-weapp/coupon/bind-coupon-code', studioWeappAuth(), bindCouponCode],

    // 绑定activityCode
    ['POST', '/api/studio-weapp/coupon/bind-activity-code', studioWeappAuth(), requestProcess(conf.baseApi.channel.activityCodeBind, conf.baseApi.secret)],
]
