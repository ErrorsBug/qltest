import { api } from './common';

export const SET_CHANNEL_DISCOUNT_CODE = 'SET_CHANNEL_DISCOUNT_CODE';
export const SET_TOPIC_DISCOUNT_CODE = 'SET_TOPIC_DISCOUNT_CODE';
export const INIT_TOPIC_DISCOUNT_CODE_INFO = 'INIT_TOPIC_DISCOUNT_CODE_INFO';
export const INIT_TOPIC_DISCOUNT_CODE = 'INIT_TOPIC_DISCOUNT_CODE';
export const INIT_CHANNEL_DISCOUNT_CODE = 'INIT_CHANNEL_DISCOUNT_CODE';
export const INIT_CHANNEL_DISCOUNT_CODE_INFO = 'INIT_CHANNEL_DISCOUNT_CODE_INFO';
export const INIT_VIP_DISCOUNT_CODE_INFO = 'INIT_VIP_DISCOUNT_CODE_INFO';
export const INIT_VIP_DISCOUNT_CODE = 'INIT_VIP_DISCOUNT_CODE';
export const INIT_SEND_COUPON_INFO = 'INIT_SEND_COUPON_INFO';
export const INIT_CREATE_COUPON_INFO = 'INIT_CREATE_COUPON_INFO';
export const INIT_CHECK_COUPON_INFO = 'INIT_CHECK_COUPON_INFO';
export const INIT_COUPON_POWER = 'INIT_COUPON_POWER';







// 绑定优惠码
export function bindCouponByCode ({businessId, businessType, couponCode}) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/coupon/bindCouponByCode',
            body: {
                businessId,
                businessType,
                couponCode
            }
        })
        return result
    }
}

// 绑定优惠券
export function bindCoupon ({businessId, businessType, couponId}) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/coupon/bindCoupon',
            body: {
                businessId,
                businessType,
                couponId
            }
        })
        return result
    }
}




//服务端渲染action
// 初始化话题优惠码相关信息
export function initTopicDiscountCodeInfo (topicDiscountCodeInfo) {
    return {
        type: INIT_TOPIC_DISCOUNT_CODE_INFO,
        topicDiscountCodeInfo
    }
};
// 初始化话题优惠码资格
export function initTopicDiscountCode (topicDiscountCode) {
    return {
        type: INIT_TOPIC_DISCOUNT_CODE,
        topicDiscountCode
    }
};

// 初始化系列课优惠码相关信息
export function initChannelDiscountCodeInfo (channelDiscountCodeInfo) {
    return {
        type: INIT_CHANNEL_DISCOUNT_CODE_INFO,
        channelDiscountCodeInfo
    }
};
// 初始化系列课优惠码资格
export function initChannelDiscountCode (channelDiscountCode) {
    return {
        type: INIT_CHANNEL_DISCOUNT_CODE,
        channelDiscountCode
    }
};
export function initVipDiscountCodeInfo (vipDiscountCodeInfo) {
    return {
        type: INIT_VIP_DISCOUNT_CODE_INFO,
        vipDiscountCodeInfo
    }
};
// 初始化系列课优惠码资格
export function initVipDiscountCode (vipDiscountCode) {
    return {
        type: INIT_VIP_DISCOUNT_CODE,
        vipDiscountCode
    }
};
// 初始化发送优惠码信息
export function initSendCouponInfo(data) {
    return {
        type: INIT_SEND_COUPON_INFO,
        sendCouponInfo: {...data}
    }
}

/* 添加直播间通用券 */
export function createLiveCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/live/createLiveCoupon',
            body: params,
        })
        return result
    }
}

/* 删除直播间通用券 */
export function deleteLiveCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/live/deleteLiveCoupon',
            body: params,
        })
        return result
    }
}

export function initCreateCouponInfo(data) {
    return {
        type: INIT_CREATE_COUPON_INFO,
        initCreateCouponInfo: {
            ...data
        }
    }
}


export function createCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/createCoupon',
            body: params
        })
        return result;
    }
}

/* B端用户生成的优惠券列表 */
export function liveCouponList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'GET',
            url: '/api/wechat/live/liveCouponList',
            body: params,
        })
        return result
    }
}

/* 获取优惠码详情 */
export function liveCouponDetail(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'GET',
            url: '/api/wechat/live/liveCouponDetail',
            body: params,
        })
        return result
    }
}

/* 通用券使用情况列表 */
export function liveCouponApplyList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'GET',
            url: '/api/wechat/live/liveCouponApplyList',
            body: params,
        })
        return result
    }
}

/* 绑定通用券 */
export function isBindLiveCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/isOrNotBind',
            body: params,
        })
        return result
    }
}
/* 推送通用券到领券中心 */
export function pushToCenter(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/couponCreate/pushToCenter',
            body: params,
        })
        return result
    }
}

/* 绑定通用券 */
export function bindLiveCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/live/bindLiveCoupon',
            body: params,
        })
        return result
    }
}

/* 活动券列表 */
export function getActCouponList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/activity/actCouponList',
            body: params,
            showLoading: false,
        })
        return result
    }
}
/* 活动券 单张领取 */
export function getActCouponSingle(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/activity/getCouponSingle',
            body: params,
        })
        return result
    }
}
/* 活动券 多张领取领取 */
export function getActCouponBatch(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/activity/getCouponBatch',
            body: params,
        })
        return result
    }
}
/* 抽取活动券 */
export function extractCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/couponCenter/extractCoupon',
            body: params,
            showLoading: false,
        })
        return result
    }
}
/* 通用活动券列表 */
export function getCommonCoupon(page,size) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/couponCenter/commonCoupon',
            body: {
                page,
                size,
            },
            showLoading: false,
        })
        return result
    }
}
/* 领取优惠券 */
export function receiveCoupon(codeId) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/couponCenter/receiveCoupon',
            body: {codeId},
            showLoading: false,
        })
        return result
    }
}
/* 是否抽取过*/
export function ifExtract() {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/couponCenter/ifExtract',
            showLoading: false,
        })
        return result
    }
}
/* 是否选中通用优惠券 */
export function ifCheck() {

}



/* 获取优惠券列表 */
export function getCouponList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/getCouponList',
            body: params,
        })
        return result && result.data && result.data.couponList
    }
}
/* 获取优惠券详情 */
export function getCouponDetail(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/queryCouponDetail',
            body: params,
        })
        return result && result.data && result.data.CouponInfoDto;        
    }
}
/* 获取优惠码列表 */
export function getCouponUseList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/queryCouponUseList',
            body: params,
        })
        return result && result.data && result.data.couponList
    }
}

/* 获取优惠码领取总数 */
export function queryCouponUseCount (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/queryCouponUseCount',
            body: params,
        })
        return result;
    }
}

// 初始化权限
export function initPower(power) {
    return {
        type: INIT_COUPON_POWER,
        power,
    };
};

/**
 * 生成优惠码
 */
export function addCouponCode(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url:'/api/wechat/coupon/addCouponCode',
            method: 'POST',
            body: params
        })
        return result && result.data 
    }
}

/**
 * 设置优惠码是否显示在介绍页
 */
export function setIsShowIntro (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/coupon/setIsShowIntro',
            method: 'POST',
            body: params
        })
        return result
    }
}

/**
 * 开启系列课和会员优惠码通道接口
 * http://showdoc.corp.qlchat.com/web/#/1?page_id=2115
 */
export function switchChannelCoupon (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/coupon/switchChannelCoupon',
            method: 'POST',
            body: params
        })
        return result;
    }
}

/**
 * 获取系列课和会员优惠码通道状态
 * http://showdoc.corp.qlchat.com/web/#/1?page_id=2126
 */
export function getCouponStatus (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/coupon/getCouponStatus',
            method: 'POST',
            body: params
        })
        return result
    }
}

/**
 * 话题和系列课是否设置了优惠码显示在介绍页
 */
export function getIsShowIntro (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/coupon/getIsShowIntro',
            method: 'POST',
            body: params
        })
        return result
    }
}

/**
 * 删除优惠券
 * /coupon/deleteUniversalCoupon
 */
export function deleteCoupon (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url:'/api/wechat/coupon/deleteCoupon',
            method: 'POST',
            body: params
        })
        return result
    }
}

/**
 * 获取固定优惠码是否开启
 * http://showdoc.corp.qlchat.com/web/#/32?page_id=2116
 */
export function isStaticCouponOpen (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/coupon/isStaticCouponOpen',
            method: 'POST',
            body: params
        })
        return result;
    }
}

/**
 * 话题修改固定优惠码
 */
export function addOrUpdateStaticCoupon (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/coupon/addOrUpdateStaticCoupon',
            method: 'POST',
            body: params
        })
        return result;
    }
}

/* 获取优惠券详情(新) */
export function getCouponInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/queryCouponInfo',
            body: params,
        })
        return result && result.data && result.data.CouponInfoDto;        
    }
}