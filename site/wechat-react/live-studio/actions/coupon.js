import { api } from './common'

/* 获取用户是否创建直播间 */
export function fetchMyLiveEntity() {
    return async (dispatch, getStore) => {
        const result = await api({
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/findLiveEntity',
        });

        return result
    }
}

/* 创建默认直播间 */
export function createLiveroom() {
    return async (dispatch, getStore) => {
        const result = await api({
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/studio/coupon/create-liveroom',
        });

        return result
    }
}

/* 获取折扣信息 */
export function fetchCouponInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            showLoading: false,
            method: 'GET',
            body: params,
            url: '/api/wechat/studio/coupon/info',
        });

        return result
    }
}

/* 绑定优惠码 */
export function bindCouponCode(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            showLoading: false,
            method: 'POST',
            body: params,
            url: '/api/wechat/studio/coupon/bind-code',
        });

        return result
    }
}
