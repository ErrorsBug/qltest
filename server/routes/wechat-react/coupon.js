import lo from 'lodash';

var topicApi = require('../../api/wechat/topic');
var channelApi = require('../../api/wechat/channel');
var liveApi = require('../../api/wechat/live');
var campApi = require('../../api/wechat/camp');
var couponApi = require('../../api/wechat/coupon');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
var resProcessor = require('../../components/res-processor/res-processor'); 

import {
    initLiveInfo
} from '../../../site/wechat-react/coupon/actions/live';
import {
    initTopicDiscountCodeInfo,
    initTopicDiscountCode,
    initChannelDiscountCodeInfo,
    initChannelDiscountCode,
    initCampDiscountCodeInfo,
    initCampDiscountCode,
    initVipDiscountCodeInfo,
    initVipDiscountCode,
    initSendCouponInfo,
    initCreateCouponInfo,
    initCouponInfo,
    ininCouponPageData
} from '../../../site/wechat-react/coupon/actions/coupon';

import {
    initPower
} from '../../../site/wechat-react/other-pages/actions/coupon';


/**
 * 优惠券store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */

//  领取话题优惠券
export async function getTopicCouponHandle(req, res, store) {
    let couponCode = lo.get(req, 'query.couponCode', '');
    let couponId = lo.get(req, 'query.codeId', '');
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        topicId: lo.get(req, 'params.topicId'),
        businessId:lo.get(req, 'params.topicId'),
        businessType:'topic',
    };
    if(couponCode){
        params.couponCode = couponCode;
    } else {
        params.couponId = couponId;
    }
    try {
        let topicDiscountCodeData;

        topicDiscountCodeData = await topicApi.getTopicDiscountCode(params, req);

        //是否已经购买
        let topicAuth = lo.get(topicDiscountCodeData, 'topicAuth.data');
        //是否为直接访问话题页
        let topicSituation = {...lo.get(topicDiscountCodeData, 'batchCodeIn.data',{}),...lo.get(topicDiscountCodeData, 'isOrNotBind.data',{})};
        //
        let topicInfo = lo.get(topicDiscountCodeData, 'getTopicInfo.data', {});
        let topicDiscountCodeInfo = lo.get(topicDiscountCodeData, 'queryCouponDetail.data');

        if (topicAuth && topicSituation && topicInfo && topicDiscountCodeInfo) {
            if (
                topicAuth.isAuth ||
                topicSituation.isQl === 'Y' ||
                topicSituation.isMG === 'Y' ||
                topicSituation.isVip === 'Y' ||
                // topicSituation.isTheBind === 'Y' ||
                topicSituation.isBlack === 'Y'
            ) {
                res.redirect('/wechat/page/topic-intro?topicId='+ params.topicId);
                return false;
            } else {
                //非直接跳转，注入store
                store.dispatch( initTopicDiscountCode(topicSituation) );
                store.dispatch( ininCouponPageData({topic:{topicInfo}}));
                store.dispatch( initTopicDiscountCodeInfo(topicDiscountCodeInfo) );
            }
        }
    } catch(err) {
        console.error(err);
    }

    return store;
};

// 领取系列课优惠券
export async function getChannelCouponHandle(req, res, store) {
    let couponCode = lo.get(req, 'query.couponCode', '');
    let couponId = lo.get(req, 'query.codeId', '');
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        channelId: lo.get(req, 'params.channelId'),
        businessId:lo.get(req, 'params.channelId'),
        businessType:'channel',
    };
    if(couponCode){
        params.couponCode = couponCode;
    } else {
        params.couponId = couponId;
    }


    try {

        let channelDiscountCodeData;
        channelDiscountCodeData = await channelApi.getChannelDiscountCode(params, req);
        let channelAuth = lo.get(channelDiscountCodeData, 'chargeStatus.data.chargePos');
        let channelInfo = lo.get(channelDiscountCodeData, 'channelInfo.data.channel');
        let channelSituation = {...lo.get(channelDiscountCodeData, 'batchCodeIn.data',{}),...lo.get(channelDiscountCodeData, 'isOrNotBind.data',{})};

        let channelDiscountCodeInfo = lo.get(channelDiscountCodeData, 'queryCouponDetail.data',{});

        if ((channelAuth &&
            channelAuth != 'null' &&
            channelInfo &&
            channelInfo.chargeType == 'absolutely') ||
            (channelSituation.isQl === 'Y' ||
            channelSituation.isMG === 'Y' ||
            channelSituation.isVip === 'Y' ||
            // channelSituation.isTheBind === 'Y' ||
            channelSituation.isBlack === 'Y')
        ) {
            res.redirect('/wechat/page/channel-intro?channelId='+ params.channelId);
            return false;
        } else {
            //非直接跳转，注入store
                store.dispatch( initChannelDiscountCode(channelSituation) );
                store.dispatch( ininCouponPageData({channel:{channelInfo}}) );
                store.dispatch( initChannelDiscountCodeInfo(channelDiscountCodeInfo) );
        }


    } catch(err) {
        console.error(err);
    }

    return store;
};

// 领取打卡优惠券
export async function getCampCouponHandle(req, res, store) {
    let couponCode = lo.get(req, 'query.couponCode', '');
    let couponId = lo.get(req, 'query.codeId', '');
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        campId: lo.get(req, 'params.campId'),
        businessId:lo.get(req, 'params.campId'),
        businessType:'camp',
    };
    if(couponCode){
        params.couponCode = couponCode;
    } else {
        params.couponId = couponId;
    }


    try {

        let campDiscountCodeData;
        campDiscountCodeData = await campApi.getCampDiscountCode(params, req);
        let campAuth = lo.get(campDiscountCodeData, 'chargeStatus.data.chargePos');
        let campInfo = lo.get(campDiscountCodeData, 'campInfo.data.liveCamp');
        let campSituation = {...lo.get(campDiscountCodeData, 'batchCodeIn.data',{}),...lo.get(campDiscountCodeData, 'isOrNotBind.data',{})};

        let campDiscountCodeInfo = lo.get(campDiscountCodeData, 'queryCouponDetail.data',{});

        if ((campAuth &&
            campAuth != 'null' &&
            campInfo &&
            campInfo.chargeType == 'absolutely') ||
            (campSituation.isQl === 'Y' ||
            campSituation.isMG === 'Y' ||
            campSituation.isVip === 'Y' ||
            // campSituation.isTheBind === 'Y' ||
            campSituation.isBlack === 'Y')
        ) {
            res.redirect('/wechat/page/camp-detail?campId='+ params.campId);
            return false;
        } else {
            //非直接跳转，注入store
                store.dispatch( initCampDiscountCode(campSituation) );
                store.dispatch( ininCouponPageData({camp:{campInfo}}) );
                store.dispatch( initCampDiscountCodeInfo(campDiscountCodeInfo) );
        }


    } catch(err) {
        console.error(err);
    }

    return store;
};

// 领取vip优惠券
export async function getVipCouponHandle(req, res, store) {
    let couponCode = lo.get(req, 'query.couponCode', '');
    let couponId = lo.get(req, 'query.codeId', '');
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: lo.get(req, 'params.liveId'),
        businessType:'global_vip',
        businessId:lo.get(req, 'params.liveId'),
    };
    if(couponCode){
        params.couponCode = couponCode;
    } else {
        params.couponId = couponId;
    }

    try {

        let couponResponse;
        couponResponse = await liveApi.getVipDiscountCode(params, req);


        const vipDiscountCodeInfo = lo.get(couponResponse, 'queryCouponDetail.data');
        const vipDiscountCode = {...lo.get(couponResponse, 'batchCodeIn.data',{}),...lo.get(couponResponse, 'isOrNotBind.data',{})};
        const liveInfo = lo.get(couponResponse, 'liveInfo.data');

        if(!vipDiscountCodeInfo || !vipDiscountCode || !liveInfo) {
            res.render('404');
            return false;
        }


        if ( vipDiscountCode.isQl === 'Y' ||
            vipDiscountCode.isMG === 'Y' ||
            vipDiscountCode.isBlack === 'Y'
        ) {
            res.redirect('/wechat/page/live-vip-details?liveId='+ params.liveId);
            return false;
        } else {
            //非直接跳转，注入store
            store.dispatch( initLiveInfo(liveInfo) );
            store.dispatch( initVipDiscountCode(vipDiscountCode) );
            store.dispatch( initVipDiscountCodeInfo(vipDiscountCodeInfo) );
        }


    } catch(err) {
        console.error(err);
    }

    return store;
};

// 发送优惠券
export async function sendCouponHandle(req, res, store) {
    let couponCode = lo.get(req, 'query.couponCode', '');
    let couponId = lo.get(req, 'query.codeId', '');

     let params = {
        type: lo.get(req, 'params.type'),
        userId: lo.get(req, 'rSession.user.userId'),
        channelId: lo.get(req, 'query.channelId'),
        topicId: lo.get(req, 'query.topicId'),
        liveId:  lo.get(req, 'query.liveId'),
        campId:  lo.get(req, 'query.campId'),
        officialKey: lo.get(req, 'query.officialKey',''),
    };
    
    if(couponCode){
        params.couponCode = couponCode;
    } else {
        params.couponId = couponId;
    }

    const couponType = params.type;

    let couponInfo,
        liveName,
        couponPower,
        couponResponse,
        redirectPath,
        channelName,
        topicName,
        campName;

    switch (couponType) {
        case 'vip-batch':
        case 'vip':
            params.businessId = params.liveId;
            params.businessType = 'global_vip';
            couponResponse = await liveApi.getVipDiscountCode(params, req);
            if (couponType === 'vip-batch') {
                redirectPath = `/wechat/page/get-coupon-vip-batch/${params.liveId}?codeId=${params.couponId}&officialKey=${params.officialKey}`;
            } else {
                redirectPath = `/wechat/page/get-coupon-vip/${params.liveId}?couponCode=${params.couponCode}&officialKey=${params.officialKey}`;
            }
            couponInfo = lo.get(couponResponse, 'queryCouponDetail.data');
            couponPower = { ...lo.get(couponResponse, 'batchCodeIn.data', {}), ...lo.get(couponResponse, 'isOrNotBind.data', {}) };
            liveName = lo.get(couponResponse, 'liveInfo.data.entity.name');
            break;
        case 'topic-batch':
        case 'topic':
            params.businessId = params.topicId;
            params.businessType = 'topic';
            couponResponse = await topicApi.getTopicDiscountCode(params, req);
            if (couponType === 'topic-batch') {
                redirectPath = `/wechat/page/get-coupon-topic-batch/${params.topicId}?codeId=${params.couponId}&officialKey=${params.officialKey}`;
            } else {
                redirectPath = `/wechat/page/get-coupon-topic/${params.topicId}?couponCode=${params.couponCode}&officialKey=${params.officialKey}`;
            }
            couponInfo = lo.get(couponResponse, 'queryCouponDetail.data');
            couponPower = { ...lo.get(couponResponse, 'batchCodeIn.data', {}), ...lo.get(couponResponse, 'isOrNotBind.data', {}) };
            liveName = lo.get(couponResponse, 'getTopicInfo.data.topicPo.liveName');
            topicName = lo.get(couponResponse, 'getTopicInfo.data.topicPo.topic');
            break;
        case 'channel-batch':
        case 'channel':
            params.businessId = params.channelId;
            params.businessType = 'channel';
            couponResponse = await channelApi.getChannelDiscountCode(params, req);
            if (couponType === 'channel-batch') {
                redirectPath = `/wechat/page/get-coupon-channel-batch/${params.channelId}?codeId=${params.couponId}&officialKey=${params.officialKey}`;
            } else {
                redirectPath = `/wechat/page/get-coupon-channel/${params.channelId}?couponCode=${params.couponCode}&officialKey=${params.officialKey}`;
            }
            couponInfo = lo.get(couponResponse, 'queryCouponDetail.data');
            couponPower = { ...lo.get(couponResponse, 'batchCodeIn.data', {}), ...lo.get(couponResponse, 'isOrNotBind.data', {}) };
            liveName = lo.get(couponResponse, 'channelInfo.data.channel.liveName');
            channelName = lo.get(couponResponse, 'channelInfo.data.channel.name');
            break;
        case 'camp-batch':
        case 'camp':
            params.businessId = params.campId;
            params.businessType = 'camp';
            couponResponse = await campApi.getCampDiscountCode(params, req);
            if (couponType === 'camp-batch') {
                redirectPath = `/wechat/page/get-coupon-camp-batch/${params.campId}?codeId=${params.couponId}&officialKey=${params.officialKey}`;
            } else {
                redirectPath = `/wechat/page/get-coupon-camp/${params.campId}?couponCode=${params.couponCode}&officialKey=${params.officialKey}`;
            }
            couponInfo = lo.get(couponResponse, 'queryCouponDetail.data');
            couponPower = { ...lo.get(couponResponse, 'batchCodeIn.data', {}), ...lo.get(couponResponse, 'isOrNotBind.data', {}) };
            liveName = lo.get(couponResponse, 'campInfo.data.liveCamp.liveName');
            campName = lo.get(couponResponse, 'campInfo.data.liveCamp.name');
            break;
        default:
            res.render('404');
            return false;
    }

    if (!couponInfo || !couponPower || !liveName) {
        res.render('404');
        return false;
    }

    if (couponPower.isMG !== 'Y') {
        res.redirect(redirectPath);
        return false;
    }
    store.dispatch(initSendCouponInfo({couponType, liveName, channelName, topicName, campName, couponInfo, redirectPath,}));

    return store;
}

// 直播间通用券跳转
export async function liveCouponSubscriberPage(req, res, store) {
    const liveId = lo.get(req,'params.liveId','')
    const couponId = lo.get(req, 'query.codeId', '');

    let params = {
        liveId
    };

    try{
        let couponListPower = await couponApi.couponListPower(params, req);
        let allowMGLive = lo.get(couponListPower, 'power.data.powerEntity.allowMGLive');
        if (allowMGLive) {
            res.redirect(`/wechat/page/coupon-manage/share/${liveId}?couponId=${couponId}&type=universal`)
            return false
        }
        return store;
    }catch(e){
        console.error(e)
    }
}

// 如果是管理员就跳转
export async function couponSubscriberPage(req, res, store) {
    const type = lo.get(req, 'params.type', '')
    const liveId = lo.get(req,'params.liveId','')
    const userId = lo.get(req, 'rSession.user.userId')
    const id = lo.get(req, 'params.id', '');

    let params = {};
    if (type == 'topic') {
        params.topicId = id;
    } else if (type == 'channel') {
        params.channelId = id;
    } else {
        params.liveId = liveId;
    }


    try{
        let couponListPower = await couponApi.couponListPower(params, req);
        let allowMGLive = lo.get(couponListPower, 'power.data.powerEntity.allowMGLive');
        if (allowMGLive) {
            res.redirect('/wechat/page/backstage');
            return false
        }
        return store;
    }catch(e){
        console.error(e)
    }
}

//优惠券创建
export async function couponCreatePage(req,res,store) {
    const couponType = lo.get(req, 'params.couponType', '')
    const liveId = lo.get(req,'params.liveId','')
    const userId = lo.get(req, 'rSession.user.userId');

    let id = lo.get(req, 'params.id', '');
    let params = {};
    if (couponType == 'topic') {
        params.topicId = id;
    } else if (couponType == 'channel') {
        params.channelId = id;
    } else if (couponType == 'camp') {
        params.campId = id;
    } else {
        params.liveId = id;
    }

    let couponListPower = await couponApi.couponListPower(params, req);
    let power = lo.get(couponListPower, 'power.data.powerEntity',{});

    if (!power.allowMGLive) {
        res.redirect('/wechat/page/backstage');
        return false
    }
    store.dispatch( initPower(power) );

    store.dispatch(initCreateCouponInfo({
        userId,
        currentTimeStamp: Date.now()
    }))
    return store
}

// 优惠券邀请卡页面
export async function couponCardPage(req,res,store) {
    const businessType = lo.get(req, 'query.businessType', '')
    const businessId = lo.get(req,'query.businessId','')
    const userId = lo.get(req, 'rSession.user.userId')

    store.dispatch(initCreateCouponInfo({
        userId,
        currentTimeStamp: Date.now()
    }))
    return store
}

// 绑定静态优惠码
export async function bindStaticCoupon (req, res, store) {
    let result = await couponApi.bindStaticCoupon({}, req);
    res.redirect(`/topic/details?topicId=${req.query.topicId}`)
}

export async function sendPlatformCouponPower(req, res, store){
    let params = {
        packetId: req.query.packetId,
        userId: lo.get(req, 'rSession.user.userId')
    }
    let isOrNotSharePacket = [
        [conf.couponApi.coupon.isOrNotSharePacket, params, conf.couponApi.secret]
    ];

    try {
        const result = await proxy.parallelPromise(isOrNotSharePacket, req);
        if(lo.get(result[0], 'data.status') === 'N') {
            res.render('500');
            return;
        }
        return store
    } catch (error) {
        console.error(error);
        res.render('500');
    }
}


// 过期优惠券跳转页
export async function couponTransfer(req, res, store) {
    let couponCode = lo.get(req, 'query.couponCode', '');
    
    let params = {
        couponCode,
        userId: req.cookies.userId
    }
    let couponInfo = await couponApi.couponInfo(params, req);
    let couponInfoDto = lo.get(couponInfo, 'queryCouponDetail.data.CouponInfoDto');
    let isOrNotBind = lo.get(couponInfo, 'isOrNotBind.data');
    
    if (couponInfoDto) {
        let isNotOverTime = !couponInfoDto.overTime || couponInfoDto.overTime > Date.now();
        if (isOrNotBind.isBinded == 'Y' && isNotOverTime && couponInfoDto.useStatus == 'bind') {
            
            let redirectPath;
            switch(couponInfoDto.businessType) {
                case 'topic':
                    redirectPath = `/wechat/page/topic-intro?topicId=${couponInfoDto.belongId}&couponId=${couponInfoDto.id}`;
                    break;
                case 'channel':
                case 'relay_channel':
                    redirectPath = `/wechat/page/channel-intro?channelId=${couponInfoDto.belongId}&couponId=${couponInfoDto.id}`;
                    break;
                case 'global_vip':
                    redirectPath = `/wechat/page/live-vip-details?liveId=${couponInfoDto.belongId}&couponId=${couponInfoDto.id}`;
                    break;
                default:
                    redirectPath = `/wechat/page/live/${couponInfoDto.belongId}?couponId=${couponInfoDto.id}`;
                    break;
            }
            res.redirect(redirectPath);
            return false;
        }
        
    }
    store.dispatch(initCouponInfo({couponInfoDto}));
    return store
}