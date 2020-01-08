import { api } from './common';

export const SET_CHANNEL_DISCOUNT_CODE = 'SET_CHANNEL_DISCOUNT_CODE';
export const SET_TOPIC_DISCOUNT_CODE = 'SET_TOPIC_DISCOUNT_CODE';
export const INIT_TOPIC_DISCOUNT_CODE_INFO = 'INIT_TOPIC_DISCOUNT_CODE_INFO';
export const INIT_TOPIC_DISCOUNT_CODE = 'INIT_TOPIC_DISCOUNT_CODE';
export const INIT_CHANNEL_DISCOUNT_CODE = 'INIT_CHANNEL_DISCOUNT_CODE';
export const INIT_CHANNEL_DISCOUNT_CODE_INFO = 'INIT_CHANNEL_DISCOUNT_CODE_INFO';
export const INIT_CAMP_DISCOUNT_CODE = 'INIT_CAMP_DISCOUNT_CODE';
export const INIT_CAMP_DISCOUNT_CODE_INFO = 'INIT_CAMP_DISCOUNT_CODE_INFO';
export const INIT_VIP_DISCOUNT_CODE_INFO = 'INIT_VIP_DISCOUNT_CODE_INFO';
export const INIT_VIP_DISCOUNT_CODE = 'INIT_VIP_DISCOUNT_CODE';
export const INIT_SEND_COUPON_INFO = 'INIT_SEND_COUPON_INFO';
export const INIT_CREATE_COUPON_INFO = 'INIT_CREATE_COUPON_INFO';
export const INIT_CHECK_COUPON_INFO = 'INIT_CHECK_COUPON_INFO';
export const INIT_COUPON_POWER = 'INIT_COUPON_POWER';
export const INIT_COUPON_INFO = 'INIT_COUPON_INFO';
export const INIT_COUPON_PAGE_DATA = 'INIT_COUPON_PAGE_DATA'; 

export function initLiveShareQualify(liveId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/shareQualify',
            method: 'POST',
            body: { liveId } 
        });
        
        return result;
    }; 
}

/**
 * 获取课程分销资格（统一接口）
 */
export function getMyQualify(businessId, businessType, isAutoApply = 'Y') {
    return async (dispatch, getStore) => {
       let result = await api({
           dispatch,
           getStore,
           showLoading: false,
           url: '/api/wechat/topic/getMyQualify',
           method: 'POST',
           body: {
                businessId,
                businessType,
                isAutoApply,
           }
       });

       return result;
   };
}


//初始化页面数据
export function ininCouponPageData(data) {
    return {
        type: INIT_COUPON_PAGE_DATA,
        data
    };
};







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

//绑定直播间vip优惠码
export function bindVipDiscountCode(businessId, query, ifBatch) {
    var url, body;
    if (ifBatch) {
        url = '/api/wechat/coupon/bindCoupon';
        body = {
            businessId,
            couponId: query
        }
    } else {
        url = '/api/wechat/coupon/bindCouponByCode';
        body = {
            businessId,
            couponCode: query,
            businessType: 'global_vip'
        }
    }
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: url,
            body: body,
            method: 'POST',
        });
        return result;
    };
};



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
// 初始化系列课优惠码相关信息
export function initCampDiscountCodeInfo (campDiscountCodeInfo) {
    return {
        type: INIT_CAMP_DISCOUNT_CODE_INFO,
        campDiscountCodeInfo
    }
};
// 初始化系列课优惠码资格
export function initCampDiscountCode (campDiscountCode) {
    return {
        type: INIT_CAMP_DISCOUNT_CODE,
        campDiscountCode
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

// 初始化发送优惠码信息
export function initCouponInfo(data) {
    return {
        type: INIT_COUPON_INFO,
        couponInfo: data
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
/* 推送通用券到领券中心 */
export function setCouponShareStatus(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/couponCreate/setCouponShareStatus',
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

/* 获取优惠券总数 */
export function getCouponCount(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/getCouponCount',
            body: params,
        })
        return result && result.data && result.data.count || 0
    }
}

/* 获取优惠券列表 */
export function getCouponList(params, ) {
    return async (dispatch, getStore) => {
        const result = await api({
            method: 'POST',
            url: '/api/wechat/coupon/getCouponList',
            body: params,
        })
        return result && result.data && result.data.couponList
    }
}
/* 获取优惠券列表 v2 */
export function getCouponListV2(params, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/coupon/centerCourse',
            showLoading,
            body: params
        })
        return result && result.data && result.data.dataList
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

// 分类型查询我的优惠券列表
export function queryCouponListByType(params) {
	return async (dispatch, getStore) => {
		const result = api({
			dispatch,
			getStore,
			url: '/api/wechat/mine/queryCouponListByType',
			body: {
				type: params.type,
				status: params.status,
                page: params.page,
                liveId: params.liveId,
				size: params.size || 20,
			}
		});
		return result
	}
}

// 领取自媒体转载课优惠券
export function receiveMediaCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/channel/receiveMediaCoupon',
            body: params
        });

        return result;
    }
}

// 删除优惠券
export function deleteUniversalCoupon(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/coupon/deleteCoupon',
            body: params
        });

        return result;
    }
}