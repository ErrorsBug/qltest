import { api, request } from './common';
import { getVal } from '../components/util';
import { get } from 'lodash';

/**
 * 获取优惠券信息
 * 
 * @param {{
    businessType: 业务类型 topic / channel / vip
    businessId: 业务id
    receiveType: 优惠券类型单发或群发  single / batch
    code: 优惠码(couponCode)或优惠券ID(codeId)，反正就叫code，根据receiveType判断用什么字段提交
  }} param0 参数列表
 */
export function receiveCoupon ({
    businessType,
    businessId,
}) {
    let url = '/api/wechat/coupon/batchCodeIn';
    let params = {
        businessType,
        businessId,
    };



    return api({
        url,
        method: 'POST',
        body: params
    });
}
/**
 * 是否已经领取
 */
export function isBindCoupon ({
    receiveType = 'single', 
    code,
}) {
    let url = '/api/wechat/coupon/isOrNotBind';
    let params = {};

    if (receiveType === 'single') {
        params.couponCode = code;
    } else if (receiveType === 'batch') {
        params.couponId = code;
    }


    return api({
        url,
        method: 'POST',
        body: params
    });
}

/**
 * 绑定优惠券，领取接口请求后判断可领取就调用绑定
 * 
 * @param {{
    businessType: 业务类型 topic / channel
    businessId: 业务id
    receiveType: 优惠券类型单发或群发  single / batch
    code: 优惠码(couponCode)或优惠券ID(codeId)，反正就叫code，根据receiveType判断用什么字段提交
  }} param0 参数列表
 */
export function bindCoupon ({
    businessType,
    businessId,
    receiveType = 'single', 
    code,
}) {
    return (dispatch, getStore) => {
        let url = '';
        let params = {
            businessId,
            businessType
        };

        if (receiveType === 'single') {
            params.couponCode = code;
            url = '/api/wechat/coupon/bindCouponByCode';
        } else if (receiveType === 'batch') {
            params.couponId = code;
            url = '/api/wechat/coupon/bindCoupon';
        }


        return api({
            url,
            method: 'POST',
            body: params
        });
    }
}

/**
 * 获取优惠券信息
 * 
 * @param {{
    businessType: 业务类型 topic / channel
    businessId: 业务id
    receiveType: 优惠券类型单发或群发  single / batch
    code: 优惠码(couponCode)或优惠券ID(codeId)，反正就叫code，根据receiveType判断用什么字段提交
  }} param0 参数列表
 * @returns 
 */
export function getCouponInfo ({
    receiveType = 'single', 
    code,
}) {
    return (dispatch, getStore) => {
        let url = '';
        let params = {};
    
        url = '/api/wechat/coupon/queryCouponDetail';
    
        if (receiveType === 'single') {
            params.couponCode = code;
        } else if (receiveType === 'batch') {
            params.couponId = code;
        }
    
        // if (businessType === 'channel') {
        //     params.channelId = businessId;
        // } else if (businessType === 'topic') {
        //     params.topicId = businessId;
        // }
    
        return api({
            url,
            method: 'POST',
            body: params
        });
    }
   
}

/**
 * 获取显示在介绍页的优惠码
 * @param {*} businessId 
 * @param {*} businessType 
 */
export function getCouponForIntro (businessId, businessType) {
    return api({
        url: '/api/wechat/coupon/getCouponForIntro',
        method: 'GET',
        body: {
            businessId,
            businessType
        }
    });
}

/**
 * 获取是否显示优惠券二维码
 */
export function showCouponQrcode () {
    return api({
        url: '/api/wechat/coupon/showCouponQrcode',
        method: 'GET',
    });
}


// 查询用户是否有对应业务优惠码
export function fetchCouponListAction (params) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/coupon/myCouponList',
            body: params
        })
    }
}

// 平台优惠券获取领取详情(用于介绍页，详情页，极简模式)，介绍页里面要先判断是不是该直播间是否为官方直播间或者有平台分销比例
export async function getPacketDetail({businessType, businessId, liveId} ={}){
    const returnRes = request({
        url: '/api/wechat/transfer/couponApi/coupon/getPacketDetail',
        body: { businessId }
    })
    return returnRes
    // 从详情页或者极简模式页面进来的不需要判断是否已是官方直播间或者有平台分销比例
    // if(!isPlatForm){
    //     return returnRes
    // }
    // await Promise.all([
    //     request({
    //         url: '/api/wechat/isQlLive',
    //         body: { liveId }
    //     }),
    //     request({
    //         url: '/api/wechat/platformShare/getShareRate',
    //         body: { businessType, businessId }
    //     })
    // ]).then(([res1, res2]) => {
    //     // 是否是官方直播间
    //     let isQlLive = get(res1, 'data.isQlLive', 'N')
    //     // 是否有平台分销比例
    //     let shareRate = get(res2, 'data.shareRate', 0)
    //     return (isQlLive == 'Y' || shareRate) ? returnRes : {}
    // })
}

// 介绍页详情页显示发红包按钮和弹窗(将弹窗状态置为已经弹过)(用于介绍页，详情页，极简模式)
export async function updatePacketPopStatus(packetId){
    await request({
        url: '/api/wechat/transfer/couponApi/coupon/updatePacketPopStatus',
        body: { packetId, status: 'Y' }
    }).then(res=>{
        if(get(res, 'state.code')){
            throw new Error(res.state.msg)
        }
    }).catch(err =>{
        console.log(err)
    })
}




// 获取分类列表
export function fetchCategoryList() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/recommend/cagegory-list'
        });

        return result.data && result.data.dataList;
    };
};


/**
 * 获取显示在介绍页的优惠码(新)
 * @param {*} param0 
 * isUpdate 是否更新当前优惠券
 */
export function getQueryCouponForIntro({businessId, businessType}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			method: 'POST',
			url: '/api/wechat/coupon/getQueryCouponForIntro',
			body: {
                businessId,
                businessType
			}
        });
        
        if (result.state.code === 0 && result.data && result.data.codePo) {
            return result.data
        }
		return null
	}
}