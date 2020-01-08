/**
 * Created by dylanssg on 2017/10/31.
 */
import { api } from './common';

export const INIT_GIFT_BAG_DATA = 'INIT_GIFT_BAG_DATA';
export const INIT_ORDER_DETAILS = 'INIT_ORDER_DETAILS';

// 初始化礼包信息
export function initGiftBagData (giftBagData) {
	return {
		type: INIT_GIFT_BAG_DATA,
		giftBagData
	}
}

/* 填写物流信息 */
export function updateOrderData(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/coral/updateOrderData',
			body: params
		});

		return result;
	};
}
// /api/wechat/coral/getBackgroundUrlList
export function getBackgroundUrlList(){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'GET',
			showLoading: true,
			url: '/api/wechat/coral/getBackgroundUrlList',
			body: {}
		});

		return result;
	};
}