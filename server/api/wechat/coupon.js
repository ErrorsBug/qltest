var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    server = require('../../server'),
    requestProcess = require('../../middleware/request-process/request-process');

var receiveCoupon = (req, res, next) => {
    var params = {
        codeId: req.body.codeId,
        userId: lo.get(req, 'rSession.user.userId'),
        from: 'coupon_center_g' 
    };
    proxy.apiProxy(conf.baseApi.live.bindLiveCoupon, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var getCommonCoupon = (req, res, next) => {
    var params = {
        userId: lo.get(req, 'rSession.user.userId'),
        page: {
            page: req.body.page,
            size: req.body.size,
        }
    };
    proxy.apiProxy(conf.baseApi.coupon.commonCoupon, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var showCouponQrcode = (req, res, next) => {
    if (server.app.redisCluster) {

        server.app.redisCluster.get('SHOW_COUPON_QRCODE', (err, result) => {
            if (err) {
                resProcessor.jsonp(req, res, { state: { code: 0 }, data: false });
                return
            }
            // 设置为0就是不显示二维码，1就是显示二维码
            resProcessor.jsonp(req, res, { state: { code: 0 }, data: result != 0 });
        });
    } else {
        resProcessor.jsonp(req, res, { state: { code: 0 }, data: false });
    }
}


// 优惠券列表页面进入权限接口请求
async function couponListPower (params, req) {
    params.userId = lo.get(req, 'rSession.user.userId','');

    let tasks = [
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret] 
    ];


    try {
        const result = await proxy.parallelPromise(tasks, req);

        return result;
    } catch (error) {
        console.error(error);
        res.render('500');
    }
}

// 优惠码列表页面进入权限接口请求
async function codeListinfo (params, req) {
    params.userId = lo.get(req, 'rSession.user.userId','');

    let tasks = [
        ['queryCouponDetail', conf.couponApi.coupon.queryCouponDetail, params, conf.couponApi.secret]
    ];


    try {
        const result = await proxy.parallelPromise(tasks, req);

        return result;
    } catch (error) {
        console.error(error);
        res.render('500');
    }
}


// 优惠码信息
async function couponInfo (params, req) {
    params.userId = lo.get(req, 'rSession.user.userId','');

    let tasks = [
        ['queryCouponDetail', conf.couponApi.coupon.queryCouponDetail, params, conf.couponApi.secret],
        ['isOrNotBind', conf.couponApi.coupon.isOrNotBind, params, conf.couponApi.secret]
    ];


    try {
        const result = await proxy.parallelPromise(tasks, req);

        return result;
    } catch (error) {
        console.error(error);
        res.render('500');
    }
}

// 获取对应课程信息
var getChannelOrTopicInfo = (params, req) => {

    const task = []

    if (params.channelId) {
        task.push(['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret])
    } else if (params.topicId) {
        task.push(['getTopicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret])
    } else if (params.campId) {
        task.push(['getCampInfo', conf.baseApi.checkInCamp.campDetail, params, conf.baseApi.secret])
    }

    return proxy.parallelPromise(task, req);
};

async function bindStaticCoupon (params, req) {
    params.userId = lo.get(req, 'rSession.user.userId');
    params.couponCode = lo.get(req, 'query.couponCode');
    params.businessId = lo.get(req, 'query.topicId');
    params.businessType = 'topic';

    let tasks = [
        ['bindIsCouponCode', conf.couponApi.coupon.bindCouponByCode, params, conf.couponApi.secret]
    ]

    try {
        const result = await proxy.parallelPromise(tasks, req);
        return result;
    } catch (e) {
        console.error(error);
    }
}


module.exports = [
    ['POST', '/api/wechat/couponCreate/pushToCenter', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.pushToCenter, conf.baseApi.secret)],
   
    ['POST', '/api/wechat/activity/actCouponList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.actCouponList, conf.baseApi.secret)],
    ['POST', '/api/wechat/couponCenter/extractCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.extractCoupon, conf.baseApi.secret)],
    ['POST', '/api/wechat/couponCenter/commonCoupon', clientParams(), appAuth(), wxAuth(), getCommonCoupon],
    ['POST', '/api/wechat/couponCenter/receiveCoupon', clientParams(), appAuth(), wxAuth(), receiveCoupon],
    ['POST', '/api/wechat/couponCenter/ifExtract', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.ifExtract, conf.baseApi.secret)],    

    ['GET', '/api/wechat/coupon/setSpreadType', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.setSpreadType, conf.baseApi.secret)],
    ['GET', '/api/wechat/coupon/getCouponForIntro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.getCouponForIntro, conf.baseApi.secret)],


    ['GET', '/api/wechat/coupon/showCouponQrcode', clientParams(), appAuth(), wxAuth(), showCouponQrcode],
    ['GET', '/api/wechat/coupon/allCount', clientParams(), requestProcess(conf.couponApi.coupon.allCount, conf.couponApi.secret)],
    
    // *****  优惠券重构整合 ***** 
    // 优惠码权限判断
    ['POST', '/api/wechat/coupon/batchCodeIn', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.batchCodeIn, conf.baseApi.secret)],
    ['POST', '/api/wechat/couponCreate/setCouponShareStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.setCouponShareStatus, conf.baseApi.secret)],
    // 获取优惠券列表
    ['POST', '/api/wechat/coupon/getCouponList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.getCouponList, conf.couponApi.secret)],
    // 获取优惠码详情
    ['POST', '/api/wechat/coupon/queryCouponDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponDetail, conf.couponApi.secret)],
    // 获取优惠码详情 (新)
    ['POST', '/api/wechat/coupon/queryCouponInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponInfo, conf.couponApi.secret)],
    // 获取优惠码列表
    ['POST', '/api/wechat/coupon/queryCouponUseList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponUseList, conf.couponApi.secret)],
    // 获取优惠码领取总数
    ['POST', '/api/wechat/coupon/queryCouponUseCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponUseCount, conf.couponApi.secret)],
    // 是否绑定优惠券
    ['POST', '/api/wechat/coupon/isOrNotBind', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.isOrNotBind, conf.couponApi.secret)],
    // 领取优惠券
    ['POST', '/api/wechat/coupon/bindCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.bindCoupon, conf.couponApi.secret)],
    // 绑定优惠码
    ['POST', '/api/wechat/coupon/bindCouponByCode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.bindCouponByCode, conf.couponApi.secret)],
    // 生成优惠码
    ['POST', '/api/wechat/coupon/addCouponCode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.addCouponCode, conf.couponApi.secret)],
    // 生成优惠券
    ['POST', '/api/wechat/coupon/createCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.createCoupon, conf.couponApi.secret)],
    // 获取我的优惠码
    ['POST', '/api/wechat/coupon/myCouponList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.myCouponList, conf.couponApi.secret)],
    // 设置优惠码是否显示在介绍页中
    ['POST', '/api/wechat/coupon/setIsShowIntro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.setIsShowIntro, conf.couponApi.secret)],
    // 开启系列课和会员优惠码通道
    ['POST', '/api/wechat/coupon/switchChannelCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.switchChannelCoupon, conf.baseApi.secret)],
    // 获取话题和系列课是否设置了优惠码显示在介绍页
    ['POST', '/api/wechat/coupon/getIsShowIntro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.getIsShowIntro, conf.couponApi.secret)],
    // 获取系列课和会员优惠码通道状态
    ['POST', '/api/wechat/coupon/getCouponStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.getCouponStatus, conf.baseApi.secret)],
    // 删除优惠券
    ['POST', '/api/wechat/coupon/deleteCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.deleteCoupon, conf.couponApi.secret)],
    // 固定优惠码是否开启
    ['POST', '/api/wechat/coupon/isStaticCouponOpen', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.staticCouponOpen, conf.couponApi.secret)],
    // 修改固定优惠码
    ['POST', '/api/wechat/coupon/addOrUpdateStaticCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.addOrUpdateStaticCoupon, conf.couponApi.secret)],
    // 查优惠券总数
    ['POST', '/api/wechat/coupon/getCouponCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.getCouponCount, conf.couponApi.secret)],
    // 介绍页查询领券中心的优惠券
    ['POST', '/api/wechat/coupon/getLiveUniversalCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.getLiveUniversalCoupon, conf.baseApi.secret)],
    ['POST', '/api/wechat/coupon/bindUniversalCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.bindUniversalCoupon, conf.baseApi.secret)],


];


module.exports.couponListPower = couponListPower;
module.exports.codeListinfo = codeListinfo;
module.exports.couponInfo = couponInfo;
module.exports.bindStaticCoupon = bindStaticCoupon;
module.exports.getChannelOrTopicInfo = getChannelOrTopicInfo;
