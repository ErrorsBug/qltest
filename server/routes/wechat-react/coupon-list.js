import lo from 'lodash';

var couponApi = require('../../api/wechat/coupon');

import {
    initPower
} from '../../../site/wechat-react/other-pages/actions/coupon';
import {
    ininCouponPageData
} from '../../../site/wechat-react/coupon/actions/coupon';

/**
 * 优惠券store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */

export async function couponListHandle(req, res, store) {
    let type = lo.get(req, 'params.type');
    let id = lo.get(req, 'params.id', '');
    let params = {};
    if (type == 'topic') {
        params.topicId = id;
    } else if (type == 'channel') {
        params.channelId = id;
    } else if (type == 'camp') {
        params.campId = id;
    } else {
        params.liveId = id;
    }
    try {
        let couponListPower = await couponApi.couponListPower(params, req);
        let power = lo.get(couponListPower, 'power.data.powerEntity',{});

        if (!power.allowMGLive) {
            res.redirect('/wechat/page/backstage');
            return false
        }
        
        if (/topic|channel|camp/.test(type)) {
            let courseInfo = await couponApi.getChannelOrTopicInfo(params, req);
            let channelInfo = lo.get(courseInfo, 'channelInfo.data.channel', {});
            let topicInfo = lo.get(courseInfo, 'getTopicInfo.data', {});
            let campInfo = lo.get(courseInfo, 'getCampInfo.data', {});
            store.dispatch( ininCouponPageData({
                topic:{topicInfo},
                channel:{channelInfo},
                camp:{campInfo}
            }));
        }
        store.dispatch( initPower(power) );
    } catch(err) {
        console.error(err);
    }

    return store;
};


/**
 * 优惠券store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */

export async function codeListHandle(req, res, store) {
    let codeId = lo.get(req, 'params.codeId', '');
    let params = {
        couponId:codeId
    };
    
    let codeListinfo = await couponApi.codeListinfo(params, req);
    let CouponInfoDto = lo.get(codeListinfo, 'queryCouponDetail.data.CouponInfoDto',{});
    let belongId = CouponInfoDto.belongId;
    let businessType = CouponInfoDto.businessType;
    
    if (businessType == 'topic') {
        params.topicId = belongId;
    } else if (businessType == 'channel') {
        params.channelId = belongId;
    } else if (businessType == 'camp') {
        params.campId = belongId;
    } else {
        params.liveId = belongId;
    }

    try {
        let couponListPower = await couponApi.couponListPower(params, req);
        let power = lo.get(couponListPower, 'power.data.powerEntity',{});

        if (!power.allowMGLive) {
            res.redirect('/wechat/page/backstage');
            return false
        }
    } catch(err) {
        console.error(err);
    }

    return store;
};