const weappAuth = require('../../middleware/auth/1.0.0/weapp-auth');
const requestProcess = require('../../middleware/request-process/request-process');
const conf = require('../../conf');
const proxy = require('../../components/proxy/proxy');
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

  // 优惠码分享，解除原优惠码的关系
  ['GET', '/api/weapp/coupon/transform-coupon', weappAuth(), requestProcess(conf.baseApi.coupon.transformCoupon, conf.baseApi.secret)],
    
  // 获取分享出的优惠券的信息
  ['GET', '/api/weapp/coupon/get-transform-coupon', weappAuth(), requestProcess(conf.baseApi.coupon.getTransformCoupon, conf.baseApi.secret)],

  // 绑定分享出的优惠券
  ['GET', '/api/weapp/coupon/bind-transform-coupon', weappAuth(), requestProcess(conf.baseApi.coupon.bindTransformCoupon, conf.baseApi.secret)],

  // 课程 系列课 vip绑定优惠码
  ['GET', '/api/weapp/coupon/bind-coupon-code', weappAuth(), bindCouponCode],

  // 绑定activityCode
  ['POST', '/api/weapp/coupon/bind-activity-code', weappAuth(), requestProcess(conf.baseApi.channel.activityCodeBind, conf.baseApi.secret)],

  //红包活动群推广,拿优惠
  ['GET', '/api/weapp/bonuses/courseConfig', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.courseConfig, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/myShareDetail', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.myShareDetail, conf.baseApi.secret)],    
  ['POST', '/api/weapp/bonuses/doShare', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.doShare, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/joinShare', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.joinShare, conf.baseApi.secret)],
  ['GET', '/api/weapp/getRecentAcceptList/getRecentAcceptList', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.getRecentAcceptList, conf.baseApi.secret)],
  
  // 新拆红白活动
  ['GET', '/api/weapp/bonuses/getStateInfo', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.getStateInfo, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/getConfAndGroupInfo', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.getConfAndGroupInfo, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/getGroupOpenRedpack', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.getGroupOpenRedpack, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/openRedpack', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.openRedpack, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/getAccountRedpackList', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.getAccountRedpackList, conf.baseApi.secret)],
  ['GET', '/api/weapp/bonuses/getMaxCouponInfo', weappAuth(), requestProcess(conf.baseApi.activity.bonuses.getMaxCouponInfo, conf.baseApi.secret)],

]
