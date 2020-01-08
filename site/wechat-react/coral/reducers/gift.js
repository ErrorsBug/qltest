import {
	INIT_GIFT_BAG_DATA,
	INIT_ORDER_DETAILS
} from '../actions/gift'

const initState = {
	/* 礼包信息 */
	giftBagData: {},
	orderDetails: {},
};

const actionHandle = {
	[INIT_GIFT_BAG_DATA]: (state, action) => {
		return { ...state, giftBagData: action.giftBagData, }
	},
	[INIT_ORDER_DETAILS]: (state, action) => {
		return { ...state, orderDetails: action.orderDetails, }
	},
};

export function gift(state = initState, action) {
	const handle = actionHandle[action.type];
	return handle ? handle(state, action) : state
}
