var _ = require('underscore'),
    request = require('request'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf'),
    header = require('../../components/header/header'),
    lo = require('lodash');

import { authorityList } from '../../components/constants'

/**
 *
 * @Author  fenqiang.chen
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var doAttention = function (req, res, next) {
    var params = _.pick(req.body, 'liveId', 'status');

    params.status = params.status === 'true' ? 'Y' : 'N';
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.wechatApi.live.focus, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.appApi.secret, req);
};

/**
 *
 * @Author  fenqiang.chen
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var doNotice = function (req, res, next) {
    var params = _.pick(req.body, 'liveId', 'status');

    params.status = params.status === 'true' ? 'Y' : 'N';
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.wechatApi.live.focus, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.appApi.secret, req);
};


/**
 * 创建直播间
 * @Author   dodomon
 * @DateTime 2017-02-14T16:33:32+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var liveCreate = function (req, res, next) {
    var params = lo.get(req,'body');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.live.create, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


/**
 * 关注直播间
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-16T16:33:32+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var liveFocus = function (req, res, next) {
    var params = _.pick(req.body, 'liveId', 'status');

    params.userId = lo.get(req, 'rSession.user.userId');

    if (!params.status) {
        params.status = req.query.flag;
    }

    proxy.apiProxy(conf.baseApi.liveFocus, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

const getCode = function (req, res, next) {
    let params = _.pick(req.body, 'phoneNum');

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.sendValidCode, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

const validCode = function (req, res, next) {
    let params = lo.get(req, 'body');
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.checkValidCode, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

const saveAuth = function (req, res, next) {
    let params = lo.get(req, 'body');
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.saveAuthInfo, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

const saveProfile = function (req, res, next) {
    let params = lo.get(req, 'body');
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.saveProfile, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

const consultList =function (req, res, next) {

    let params = {
        page: {
            page: lo.get(req, 'query.page'),
            size: lo.get(req, 'query.size'),
        },
        topicId:lo.get(req, 'query.topicId'),
        type:lo.get(req, 'query.type'),

    }
    params.userId = lo.get(req, 'rSession.user.userId');
    // params.userId="100005090000128";


    proxy.apiProxy(conf.baseApi.live.consultMList, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, result(200, '咨询管理列表', body));
    }, conf.baseApi.secret, req);

}
const consultMList =function (req, res, next) {

    let params = {
        page: {
            page: lo.get(req, 'query.page'),
            size: lo.get(req, 'query.size'),
        },
        liveId:lo.get(req, 'query.liveId'),
        type:lo.get(req, 'query.type'),
    }
    params.userId = lo.get(req, 'rSession.user.userId');
    // params.userId="100004751000023";


    proxy.apiProxy(conf.baseApi.live.consultList, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, result(200, '咨询话题列表', body));
    }, conf.baseApi.secret, req);

}
const consultBest =function (req, res, next) {
    let params = lo.get(req, 'body');
    params.userId = lo.get(req, 'rSession.user.userId');
    //  params.userId="100005090000128";


    proxy.apiProxy(conf.baseApi.live.consultBest, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res,body);
    }, conf.baseApi.secret, req);

}
const consultReply =function (req, res, next) {

    let params = lo.get(req, 'body');
    params.userId = lo.get(req, 'rSession.user.userId');
    // params.userId=100005090000128;


    proxy.apiProxy(conf.baseApi.live.consultReply, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res,body);
    }, conf.baseApi.secret, req);

}

const liveInfo=function (req,res,next) {
    let params = lo.get(req, 'query');
    params.userId = lo.get(req, 'rSession.user.userId');


    // proxy.apiProxy(conf.baseApi.live.get, params, function (err, body) {
    //     if (err) {
    //         resProcessor.error500(req, res, err);
    //         return;
    //     }

    //     resProcessor.jsonp(req, res,body);
    // }, conf.baseApi.secret, req);


    // 201804：直播间信息接口增加是否已关注
    proxy.parallelPromise([
        ['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
        ['isFollow', conf.baseApi.live.isFollow, params, conf.baseApi.secret],
    ], req)
        .then(function (results) {
            let liveInfo = results.liveInfo,
                isFollow = results.isFollow;

            if (liveInfo.state.code) {
                throw Error(liveInfo.state.msg);
            }

            resProcessor.jsonp(req, res, {
                data: Object.assign({},
                    liveInfo && liveInfo.data, 
                    isFollow && isFollow.data
                ),
                state: {
                    code: 0,
                    msg: '操作成功'
                }
            });
            
        }).catch(function (err) {
            resProcessor.error500(req, res, err);
        })
}

/**
 * 图片代理
 */
const imageProxy = function (req, res, next) {
    let url = lo.get(req, 'query.url');

    if (!url || !/^https?:\/\//.test(url)) {
        resProcessor.forbidden(req, res, '无效的图片地址');
        return;
    }
    const stream = request(url);

    stream.pipe(res);
    stream.on('error', err => {
        resProcessor.error500(req, res, err, JSON.stringify(err, null, 4));
    });

}

const getCheckRealNameData = (params, req) => {
	return proxy.parallelPromise([
        ['realStatus', conf.baseApi.live.checkRealName, params, conf.baseApi.secret],
		// ['realNameInfo', conf.baseApi.live.getRealNameInfo, params, conf.baseApi.secret],
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
	], req);
}

const getPower = (params, req) => {
    return proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
	], req);
}

const getLiveBannerList = (params, req) => {
    return proxy.parallelPromise([
        ['getBannerList', conf.baseApi.live.getBannerList, params, conf.baseApi.secret],
	], req);
}

const getVipDiscountCode = (params, req) => {

    return proxy.parallelPromise([
        ['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
        ['batchCodeIn', conf.baseApi.coupon.batchCodeIn, params, conf.baseApi.secret],
        ['isOrNotBind', conf.couponApi.coupon.isOrNotBind, params, conf.couponApi.secret],
        ['queryCouponDetail', conf.couponApi.coupon.queryCouponDetail, params, conf.couponApi.secret],

    ], req);
};

const gitInitLiveData = (params, req) => {
    return proxy.parallelPromise([
        ['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['isBlackList', conf.baseApi.live.isBlackList, params, conf.baseApi.secret],
        ['isLiveAdmin', conf.adminApi.adminFlag, params, conf.adminApi.secret],
        ['timeline', conf.baseApi.timeline.getTimelineList, { ...params,  beforeOrAfter: "before", page: { size: 20, page: 1 }, time: 0, }, conf.baseApi.secret],
    ], req);
}

const getExtnedLiveData = (params, req) => {
    return proxy.parallelPromise([
        ['pageConfig', conf.adminApi.pageConfig, params, conf.adminApi.secret],
    ], req)
}

const initSubscribe = (params, req) => {
    return proxy.parallelPromise([
        ['subscribe', conf.baseApi.user.isSubscribe, params, conf.baseApi.secret],
        ['follow', conf.baseApi.live.isFollow, params, conf.baseApi.secret],
    ], req);
}

const getLiveStudioTypes = async(req, res, next) => {
    let params = {
        liveId: req.query.liveId
    }
    const result = await proxy.parallelPromise([
        ['isLiveAdmin', conf.adminApi.adminFlag, params, conf.adminApi.secret],
        ['isWhite', conf.baseApi.live.isServiceWhiteLive, params, conf.baseApi.secret],
        ['isOfficialLive', conf.baseApi.isQlLive, params, conf.baseApi.secret]
    ], req);
    const isOfficialLive = (result.isOfficialLive.data && result.isOfficialLive.data.isQlLive === 'Y') ? true : false;
    resProcessor.jsonp(req, res, {
        state: {
            code: 0,
            mas: '',
        },
        data: {
            isLiveAdmin: result.isLiveAdmin.data.isLiveAdmin,
            isWhite: result.isWhite.data.isWhite,
            isOfficialLive
        },
    })
};

function fetchAuthorities(req, res, next) {
    resProcessor.jsonp(req, res, {
        state: {
            code: 0,
            mas: '',
        },
        data: {
            list: authorityList,
        },
    })
}

function whisperList (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.whispers, params, conf.baseApi.secret, req);
}

function purchaseCourse (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.purchaseCourse, params, conf.baseApi.secret, req)
}

function planCourse (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.planCourse, params, conf.baseApi.secret, req)
}

function getVipInfo (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.vip.vipInfo, params, conf.baseApi.secret, req);
}

function getChannelTags (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.typeList, params, conf.baseApi.secret, req);
}

function getChannelList(params, req) {
    var userId = lo.get(req, 'rSession.user.userId')
    if (userId) {
        params.userId = userId
    }
    return proxy.apiProxyPromise(conf.baseApi.live.getChannel, params, conf.baseApi.secret, req);
}

function getTopicList (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.getTopic, params, conf.baseApi.secret, req);
}

function getLiveInfo (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.get, params, conf.baseApi.secret, req);
}

function getPushNum (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.pushNum, params, conf.baseApi.secret, req);
}

function getChangeChannelList (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.live.changeChannelList, params, conf.baseApi.secret, req);
}

function getKickOutState (params, req) {
    return proxy.apiProxyPromise(conf.baseApi.isKickOut, params, conf.baseApi.secret, req);
}

function getUserPower (params, req) {
	return proxy.apiProxyPromise(conf.baseApi.user.power, params, conf.baseApi.secret, req);
}

function getLiveRole(params,req){
    return proxy.apiProxyPromise(conf.baseApi.live.role, params, conf.baseApi.secret, req);
}

function sendLiveInvite(params,req){
    return proxy.apiProxyPromise(conf.baseApi.live.sendInvite, params, conf.baseApi.secret, req);
}


function getIsLiveAdmin(params, req){
    return proxy.apiProxyPromise(conf.adminApi.adminFlag, params, conf.adminApi.secret, req);
}

function getIsLiveMedia(params, req){
    return proxy.apiProxyPromise(conf.baseApi.isLiveAdmin, params, conf.baseApi.secret, req);
}

function getLivePrice(params, req){
    return proxy.apiProxyPromise(conf.baseApi.livePrice, params, conf.baseApi.secret, req);
}
module.exports = [
    /* 直播间主页用到的接口 */
    
    ['GET', '/api/wechat/live/liveInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.get, conf.baseApi.secret)],

    ['POST', '/api/wechat/live/getChannelNumAndTopicNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getChannelNumAndTopicNum, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getTopic', requestProcess(conf.baseApi.live.getTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getChannel, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/channelTypeList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.typeList, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/isLiveAdmin', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.isLiveAdmin, conf.baseApi.secret)],

    // 此处do-attention可考虑去掉，使用/live/focus代替
    ['POST', '/api/wechat/live/do-attention', clientParams(), appAuth(), wxAuth(), doAttention],
    ['POST', '/api/wechat/live/do-notice', clientParams(), appAuth(), wxAuth(), doNotice],
    ['POST', '/api/wechat/live/focus', clientParams(), appAuth(), wxAuth(), liveFocus],
    ['POST', '/api/wechat/live/create', clientParams(), appAuth(), wxAuth(), liveCreate],

    ['POST', '/api/wechat/live/auth/getCode', clientParams(), appAuth(), wxAuth(), getCode],
    ['POST', '/api/wechat/live/auth/validCode', clientParams(), appAuth(), wxAuth(), validCode],
    ['POST', '/api/wechat/live/auth/save', clientParams(), appAuth(), wxAuth(), saveAuth],

    ['POST', '/api/wechat/live/profile/save', clientParams(), appAuth(), wxAuth(), saveProfile],
    ['GET', '/api/wechat/image-proxy', imageProxy],


    //咨询相关
    ['GET', '/api/wechat/live/consultList', clientParams(), appAuth(), wxAuth(), consultList],
    ['GET', '/api/wechat/live/consultMList', clientParams(), appAuth(), wxAuth(), consultMList],
    ['POST', '/api/wechat/live/consultBest', clientParams(), appAuth(), wxAuth(), consultBest],
    ['POST', '/api/wechat/live/consultReply', clientParams(), appAuth(), wxAuth(), consultReply],
    ['GET', '/api/wechat/live/Info', clientParams(), appAuth(), wxAuth(), liveInfo],
    //获取关注二维码
    ['GET', '/api/wechat/live/get-qr', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getQr, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/isFollow', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isFollow, conf.baseApi.secret)],
    ['GET', '/api/wechat/live/banned', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.banned, conf.baseApi.secret)],
    // 获取今日推送次数
    ['POST', '/api/wechat/live/pushNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.live.pushNum, conf.baseApi.secret)],

    //一键加入平台推荐
    //setShareTerrace
    ['POST', '/api/wechat/live/setShareTerrace', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.setShareTerrace, conf.baseApi.secret)],

    //保存直播间实名认证信息
    ['POST', '/api/wechat/live/saveRealName', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.saveRealName, conf.baseApi.secret)],
    // 最新保存直播间实名认证信息
    ['POST', '/api/wechat/live/saveUser', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.saveUser, conf.baseApi.secret)],
    ['GET', '/api/wechat/live/getRealStatus', requestProcess(conf.baseApi.live.checkRealName, conf.baseApi.secret)],
    // 最新检查用户是否实名
    ['GET', '/api/wechat/live/checkUser', requestProcess(conf.baseApi.live.checkUser, conf.baseApi.secret)],
    // 旧版实名认证已经提交的信息
    ['GET', '/api/wechat/live/getRealNameInfo', requestProcess(conf.baseApi.live.getRealNameInfo, conf.baseApi.secret)],
    // 新版实名认证已经提交的信息
    ['GET', '/api/wechat/live/getVerifyInfo', requestProcess(conf.baseApi.live.getVerifyInfo, conf.baseApi.secret)],
    // 获取企业信息
    ['GET', '/api/wechat/live/getEnterprise', requestProcess(conf.baseApi.live.getEnterprise, conf.baseApi.secret)],
    // 获取企业极简信息
    ['GET', '/api/wechat/live/checkEnterprise', requestProcess(conf.baseApi.live.checkEnterprise, conf.baseApi.secret)],
    //直播间标志getLiveSymbol
    ['GET', '/api/wechat/live/getLiveSymbol', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getLiveSymbol, conf.baseApi.secret)],
    //新关注直播间（避免跟上面的另一个接口冲突）
    ['POST', '/api/wechat/live/follow', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.liveFocus, conf.baseApi.secret)],
    // 用户绑定三方平台
    ['POST', '/api/wechat/live/userBindKaiFang', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.userBindKaiFang, conf.baseApi.secret)],
    // 绑定直播间vip优惠码
    ['POST', '/api/wechat/center/popup', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.center.popup, conf.baseApi.secret)],
    /* 获取官方直播间列表 */
    ['GET', '/api/wechat/live/authorities', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.authorities, conf.baseApi.secret)],
    // 获取轮播图列表
    ['GET', '/api/wechat/live/bannerList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getBannerList, conf.baseApi.secret)],
    ['GET', '/api/wechat/live/funcMenuShow', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.funcMenuShow, conf.baseApi.secret)],

    ['POST', '/api/wechat/live/saveBanner', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.saveBanner, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/batchSaveBanner', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.batchSaveBanner, conf.baseApi.secret)],
    ['GET', '/api/wechat/live/getBannerList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getBannerList, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getLiveIntro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.liveIntro, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/alert', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.alert, conf.baseApi.secret)],

    ['POST', '/api/wechat/live/isSubscribe', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.isSubscribe, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/isFollow', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isFollow, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/followNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.followNum, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/mvToChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.mvToChannel, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/moveChannelIntoTag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.moveChannelIntoTag, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/liveRole', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.role, conf.baseApi.secret)],

    ['POST', '/api/wechat/live/shareQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.qualify, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getMyQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getMyQualify, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/bindLiveShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.bindLiveShare, conf.baseApi.secret)],

    // 新直播间手机--内测直播间id列表
    ['POST', '/api/wechat/live/getWhiteForNewLiveIndex', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.whiteNewLive, conf.baseApi.secret)],
    
    ['POST', '/api/wechat/live/funsBusiList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.funsBusiList, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/funsDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.funsDetail, conf.baseApi.secret)],

    /* 直播间优惠券相关 */
    ['POST', '/api/wechat/live/createLiveCoupon'   , clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.createLiveCoupon   , conf.baseApi.secret)],
    ['POST', '/api/wechat/live/deleteLiveCoupon'   , clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.deleteLiveCoupon   , conf.baseApi.secret)],
    ['GET' , '/api/wechat/live/liveCouponList'     , clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.liveCouponList     , conf.baseApi.secret)],
    ['GET' , '/api/wechat/live/liveCouponDetail'   , clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.queryCouponDetail   , conf.couponApi.secret)],
    ['GET' , '/api/wechat/live/liveCouponApplyList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.liveCouponApplyList, conf.baseApi.secret)],
    ['GET', '/api/wechat/live/isBindLiveCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isBindLiveCoupon, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/bindLiveCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.bindLiveCoupon, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/level', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.liveLevel, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/mediaPrice', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.livePrice, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/myManageLive', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.myManageLive, conf.baseApi.secret)],
    // 获取直播间的引流配置
    ['POST', '/api/wechat/live/getGuideQrSetting', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getGuideQrSetting,conf.baseApi.secret)],
    //一级代理商公对公打款
    ['POST', '/api/wechat/agent/ptpApply', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ptpApply, conf.baseApi.secret)],
    //是否畅听直播间
    ['POST', '/api/wechat/live/isOrNotListen', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isOrNotListen, conf.baseApi.secret)],
    // 获取是否服务号白名单
    ['GET', '/api/wechat/live/isServiceWhiteLive', clientParams(), requestProcess(conf.baseApi.live.isServiceWhiteLive, conf.baseApi.secret)],
    // 获取APP推广缓存规则
    ['GET', '/api/wechat/live/isResetAppGuideRule', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isResetAppGuideRule, conf.baseApi.secret)],
    // 获取官方直播间列表
    ['GET', '/api/wechat/live/getQlLiveIds', clientParams(),  requestProcess(conf.baseApi.live.getQlLiveIds, conf.baseApi.secret)],
    // 直播间是否配置三方导粉公众号
    ['GET', '/api/wechat/live/getOpsAppIdSwitchConf', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getOpsAppIdSwitchConf, conf.baseApi.secret)],
    // 三方导粉弹码间隔时间
    ['GET', '/api/wechat/live/getOpsAppIdSwitchTimeStep', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getOpsAppIdSwitchTimeStep, conf.baseApi.secret)],
    // 是否关注直播间
    ['POST', '/api/wechat/live/is-follow', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.isLiveFocus, conf.baseApi.secret)],
    // 获取标签对应的直播间id
    ['GET', '/api/wechat/getLiveTagOfficialLiveId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getLiveTagOfficialLiveId, conf.baseApi.secret)],
    // 获取直播间标签列表
    ['GET', '/api/wechat/getLiveTag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getLiveTag, conf.baseApi.secret)],
    // 获取直播间授权信息
    ['POST', '/api/wechat/getAuthInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getAuthInfo, conf.baseApi.secret)],
    // 获取直播间类型
    ['GET', '/api/wechat/getLiveStudioTypes', clientParams(), appAuth(), getLiveStudioTypes],
    // 获取是否千聊课程用户
    ['POST', '/api/wechat/live/center/exist', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isliveCenterExist, conf.baseApi.secret)],

    // 创建直播间时添加邀请者
    ['POST', '/api/wechat/live/addLiveAdminDate', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.live.liveAdminDate, conf.wechatApi.secret)],

    // 创建直播间系列课
    ['POST', '/api/wechat/live/addOrUpdateChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.addOrUpdateChannel, conf.baseApi.secret)],
    // 直播间系列课分类
    ['POST', '/api/wechat/live/getChannelTags', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.typeList, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/addOrEditChannelTag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.addOrEditChannelTag, conf.baseApi.secret)],
    
    // 获取直播间角色
    ['POST', '/api/wechat/live/role', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.role, conf.baseApi.secret)],
    // 获取猜你喜欢的课
    ['POST', '/api/wechat/live/getGuestYouLike', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getGuestYouLike, conf.wechatApi.secret)],
    // 获取直播间中间页课程用于导粉
    ['POST', '/api/wechat/live/getLiveMiddlepageCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.getLiveMiddlepageCourse, conf.wechatApi.secret)],
    // 获取课程自定义邀请卡/推荐语录信息
    ['POST', '/api/wechat/share/getCustomShareInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getCustomShareInfo, conf.baseApi.secret)],
    // 新增/修改课程自定义邀请卡/课程语录信息
    ['POST', '/api/wechat/share/addOrUpdateCustomShareInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.addOrUpdateCustomShareInfo, conf.baseApi.secret)],
    // 获取系列课推送次数
    ['POST', '/api/wechat/live/channelPushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.pushNum, conf.baseApi.secret)],
    // 获取话题推送次数
    ['POST', '/api/wechat/live/topicPushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.pushNum, conf.baseApi.secret)],
    // 直播间今日推荐
    ['POST', '/api/wechat/live/todayRecommend', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.todayRecommend, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getVipInfo', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getVipInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/updateVipStatus', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.updateVipStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/saveVipCharge', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.saveVipCharge, conf.baseApi.secret)],
    // 每天学
    ['POST', '/api/wechat/live/getUserLearnInfo', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.learnEveryday.getUserLearnInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getPushCourseInfo', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.learnEveryday.getPushCourseInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/addPush', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.learnEveryday.addPush, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getUserFocusInfo', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.learnEveryday.getUserFocusInfo, conf.baseApi.secret)],
    // 模拟群聊
    ['POST', '/api/wechat/live/simulateChatGroup', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.simulateChatGroup, conf.baseApi.secret)],
    // 平台分销相关
    ['POST', '/api/wechat/platformShare/getShareRate', clientParams(), wxAuth(), requestProcess(conf.baseApi.platformShare.getShareRate, conf.baseApi.secret)],
    // 数据统计相关
    ['POST', '/api/wechat/dataSat/getLiveData', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getLiveData, conf.baseApi.secret)],
    ['POST', '/api/wechat/dataSat/getAllStatTopicList', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getAllStatTopicList, conf.baseApi.secret)],
    ['POST', '/api/wechat/dataSat/getAllStatChannelList', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getAllStatChannelList, conf.baseApi.secret)],
    ['POST', '/api/wechat/dataSat/getChannelOrTopicOptimize', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getChannelOrTopicOptimize, conf.baseApi.secret)],
    ['POST', '/api/wechat/dataSat/setOptimize', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.setOptimize, conf.baseApi.secret)],
    ['POST', '/api/wechat/dataSat/getCourseIndexStatus', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getCourseIndexStatus, conf.baseApi.secret)],
    
    ['POST', '/api/wechat/live/sendInvite', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.sendInvite, conf.baseApi.secret)],
    ['POST', '/api/wechat/live/getInvite', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getInvite, conf.baseApi.secret)],
    ['POST', '/api/wechat/h5/live/getAppIdByType', clientParams(), wxAuth(), requestProcess(conf.baseApi.live.getAppIdByType, conf.baseApi.secret)],
    // 更新社群信息
    ['POST', '/api/wechat/community/update', clientParams(), wxAuth(), requestProcess(conf.communityApi.update, conf.communityApi.secret)],
    // 获取课程分类
    ['POST', '/api/wechat/getCourseTag', requestProcess(conf.baseApi.live.getCourseTag, conf.baseApi.secret)],
];

/**
 * 统一返回格式
 *
 * @param {any} code
 * @param {any} msg
 * @param {any} data
 * @returns
 */
function result (code, msg, data) {
    return {
        state: {
            code: code,
            msg: msg,
        },
         data: data,
    };
}


module.exports.getCheckRealNameData = getCheckRealNameData;
module.exports.getVipDiscountCode = getVipDiscountCode;
module.exports.getPower = getPower;
module.exports.gitInitLiveData = gitInitLiveData;
module.exports.initSubscribe = initSubscribe;
module.exports.getLiveBannerList = getLiveBannerList;
module.exports.whisperList = whisperList;
module.exports.purchaseCourse = purchaseCourse;
module.exports.planCourse = planCourse;
module.exports.getVipInfo = getVipInfo;
module.exports.getChannelTags = getChannelTags;
module.exports.getChannelList = getChannelList;
module.exports.getTopicList = getTopicList;
module.exports.getLiveInfo = getLiveInfo;
module.exports.getChangeChannelList = getChangeChannelList;
module.exports.getExtnedLiveData = getExtnedLiveData;
module.exports.getKickOutState = getKickOutState;
module.exports.getUserPower = getUserPower;
module.exports.getLiveRole = getLiveRole;
module.exports.sendLiveInvite = sendLiveInvite;
module.exports.getIsLiveAdmin = getIsLiveAdmin;
module.exports.getIsLiveMedia = getIsLiveMedia;
module.exports.getLivePrice = getLivePrice;
