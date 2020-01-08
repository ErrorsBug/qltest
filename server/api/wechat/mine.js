var lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

const getMyLive = (params, req) => {
	return proxy.parallelPromise([
		['myLive', conf.baseApi.live.my, params, conf.baseApi.secret]
	], req);
}


var getMyWallet = async (params, req) => {

    return proxy.parallelPromise([
        ['myWallet', conf.baseApi.my.wallet, params, conf.baseApi.secret],
    ], req);


}

const getRecentCourse = function (req, res, next) {

    let params = {
        beforeOrAfter: lo.get(req, 'body.beforeOrAfter'),
        pageSize: lo.get(req, 'body.pageSize'),
        time: lo.get(req, 'body.time'),
        liveId: lo.get(req, 'body.liveId'),
    }

    // 如果有用户信息，添加用户id
    var userId = lo.get(req, 'rSession.user.userId');
    if (userId) {
        params.userId = userId;
    }

    proxy.parallelPromise([
        ['recentCourse', conf.baseApi.mine.recentCourse, params, conf.baseApi.secret],
    ], req).then(result => {
        let data = lo.get(result, 'recentCourse.data') || {}
        data.time = new Date().getTime()
        resProcessor.jsonp(req, res,
            {
                data,
                state: {
                    code: 0,
                    msg: '请求成功 '
                }
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

module.exports = [

	['GET', '/api/wechat/live/mine', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.live.my, conf.wechatApi.secret)],
    ['GET', '/api/wechat/recommend/get-mine-subscribe', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.isMineNew, conf.baseApi.secret)],
	['POST', '/api/wechat/mine/get-self-center', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.selfCenter, conf.baseApi.secret)],
	['POST', '/api/wechat/mine/get-my-wallet', clientParams(), wxAuth(),requestProcess(conf.baseApi.my.wallet, conf.baseApi.secret)],
	['POST', '/api/wechat/mine/unevaluated', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.mine.unevaluated, conf.wechatApi.secret)],
	['POST', '/api/wechat/mine/joined-topic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.mine.joinedTopic, conf.wechatApi.secret)],
	['GET', '/api/wechat/mine/queryCouponListByType', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponListByType, conf.couponApi.secret)],
    ['GET', '/api/wechat/mine/queryCouponCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponCount, conf.couponApi.secret)],
    
    ['POST', '/api/wechat/mine/purchaseCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.purchaseCourse, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/planCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.planCourse, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/recentCourse', clientParams(), appAuth(), wxAuth(), getRecentCourse],
    ['POST', '/api/wechat/mine/courseAlert', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.courseAlert, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/liveOnList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.liveOnList, conf.baseApi.secret)],
    
    ['POST', '/api/wechat/mine/collectList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.collectList, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/isCollected', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.isCollected, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/addCollect', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.addCollect, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/cancelCollect', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.cancelCollect, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/footprintList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.footprintList, conf.baseApi.secret)],
    ['POST', '/api/wechat/mine/similarCourseList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.similarCourseList, conf.baseApi.secret)],
    // 参与千聊VIP业务合作
    ['POST', '/api/wechat/mine/joinQlchatVip', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.joinQlchatVip, conf.baseApi.secret)],
    
    // 获取优惠券列表
    ['POST', '/api/wechat/coupon/centerCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getCenterCourse, conf.baseApi.secret)],
    // 获取显示在介绍页的优惠码(新)
    ['POST', '/api/wechat/coupon/getQueryCouponForIntro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getQueryCouponForIntro, conf.baseApi.secret)],
    // 听书已购列表
    ['POST', '/api/wechat/mine/purchaseList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mine.purchaseList, conf.baseApi.secret)],

];


module.exports.getMyLive = getMyLive;
module.exports.getMyWallet = getMyWallet;
