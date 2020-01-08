var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

// const addressInit = (params, req) => {
// return proxy.parallelPromise([
//     ['addressWriteNum', conf.activityApi.address.addressWriteNum, params, conf.activityApi.secret],
//     ['myAddress', conf.activityApi.address.getAddressInfo, params, conf.activityApi.secret],
//     ['configs', conf.activityApi.configs, {...params, type: "sendBook"}, conf.activityApi.secret],
// ], req);
// }


// 话题优惠券相关信息
var getCampDiscountCode = (params, req) => {

    return proxy.parallelPromise([
        ['payStatus', conf.baseApi.checkInCamp.payStatus, params, conf.baseApi.secret],
        ['campInfo', conf.baseApi.checkInCamp.campDetail, params, conf.baseApi.secret],
        ['batchCodeIn', conf.baseApi.coupon.batchCodeIn, params, conf.baseApi.secret],
        ['isOrNotBind', conf.couponApi.coupon.isOrNotBind, params, conf.couponApi.secret],
        ['queryCouponDetail', conf.couponApi.coupon.queryCouponDetail, params, conf.couponApi.secret],
    ], req);
};



module.exports = [
    ['POST', '/api/wechat/camp/campInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.campInfo, conf.wechatApi.secret)],
    ['POST', '/api/wechat/camp/campCourseList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.campCourseList, conf.wechatApi.secret)],
    ['POST', '/api/wechat/camp/campCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.campCourse, conf.wechatApi.secret)],
    ['POST', '/api/wechat/camp/campPrice', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.campPrice, conf.wechatApi.secret)],
    
    // 分享减钱 分享完掉接口拿个code
    ['GET', '/api/wechat/camp/shareCode', clientParams(), (req, res, next) => {
        req.rSession.shareCodeCount = req.rSession.shareCodeCount || 0
        req.rSession.shareCodeCount++

        if(req.rSession.shareCodeCount < 3) {
            next && next();
        } else {
            resProcessor.jsonp(req, res,{
                state: {
                    code: 0,
                    msg: '领取次数超过限制'
                },
            });
            next && next();
        }
    }, requestProcess(conf.baseApi.camp.shareCode, conf.wechatApi.secret)],

    // 支付失败原因列表 和 保存失败原因
    ['POST', '/api/wechat/pay/getFailReason', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.pay.getFailReason, conf.wechatApi.secret)],
    ['POST', '/api/wechat/pay/saveFailReason', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.pay.saveFailReason, conf.wechatApi.secret)],  
    
    // ['payInfo',conf.baseApi.camp.campPrice, params, conf.baseApi.secret],
    ['POST', '/api/wechat/camp/payInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.campPrice, conf.wechatApi.secret)],  

    // 课前测试题列表
    ['POST', '/api/wechat/camp/fetchTestList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.preparations, conf.wechatApi.secret)], 
    // 提交答题   
    ['POST', '/api/wechat/camp/confirmAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.confirmAnswer, conf.wechatApi.secret)],  
    // 获取用户答案
    ['POST', '/api/wechat/camp/getMyAnswer', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.myAnswer, conf.wechatApi.secret)],
    // 获取用户信息
    ['POST', '/api/wechat/camp/getUser', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.info, conf.wechatApi.secret)],

    // 优秀学员
    ['POST', '/api/wechat/camp/exceUser', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.exceUsers, conf.wechatApi.secret)],
    
    // 标记课程学习状态
    ['POST', '/api/wechat/camp/learnTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.learnTopic, conf.wechatApi.secret)],

    //
    ['POST', '/api/wechat/coupon/activityCouponObj', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.activityCouponObj, conf.wechatApi.secret)],

    // 课前预习
    ['POST', '/api/wechat/camp/preview', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.preview, conf.wechatApi.secret)],

    // 查询打卡
    ['POST', '/api/wechat/search/camp', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.camp.search, conf.baseApi.secret)],
];

// module.exports.addressInit = addressInit;

module.exports.getCampDiscountCode = getCampDiscountCode;