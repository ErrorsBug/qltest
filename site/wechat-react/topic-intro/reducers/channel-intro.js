
import {
	INIT_CHANNEL_PAGE_DATA,
	CHANNEL_C_GROUPING_LIST,
	CHANNEL_C_GROUP_INFO,
	CHANNEL_C_GROUP_INFO_SELF,
	CHANNEL_UPDATE_AUTH,
	UPDATE_COUPON_INFO,
	UPDATE_CHANNEL_COUPON_STATUS,
	UPDATE_CHANNEL_CURRENT_COUPON,
	UPDATE_CHANNEL_CURRENT_COUPONID,
	UPDATE_CHANNEL_IS_MEMBER_PRICE,
	SET_COUPON_RESULT,
} from '../actions/channel-intro';


var initState = {
	channelInfo: {},
	desc: {},
	chargeConfigs: [],
	autoShareInfo: {},
	marketingInfo: {},
	channelId: '',
	liveId: '',
	groupingList: [],
	myGroupInfo: {},
	channelCouponStatus: {},
    // 当前选中的优惠券
	curCoupon: null,

	myShareQualify:{},
};

const ACTION_HANDLERS = {
	[INIT_CHANNEL_PAGE_DATA]: (state, action) => {
		return {
			...state,...action.pageData,
		}
	},
	[CHANNEL_C_GROUPING_LIST]: (state, action) => {
		return {
			...state,
			groupingList: action.groupingList,
		}
	},
	[CHANNEL_C_GROUP_INFO]: (state, action)=> {
		return {
			...state,groupInfo : action.groupInfo,
		}
	},
	[CHANNEL_C_GROUP_INFO_SELF]: (state, action)=> {
		return {
			...state,
			myGroupInfo: action.myGroupInfo,
		}
	},
	[CHANNEL_UPDATE_AUTH]: state => {
		return {
			...state,
			isAuthChannel: 'Y'
		}
	},
	[UPDATE_COUPON_INFO]: (state, action)=> {
		return {
			...state,
			channelCouponStatus: {
				...state.channelCouponStatus,
				qlCouponMoney: action.qlCouponMoney,
				couponId: action.couponId,
				couponType: action.couponType,
				minMoney: action.minMoney,
			}
		}
	},
	[UPDATE_CHANNEL_COUPON_STATUS]: (state, action) => {
		return {
			...state,
			channelCouponStatus: {
				...state.channelCouponStatus,
				...action.channelCouponStatus,
			}
		}
	},
	[UPDATE_CHANNEL_CURRENT_COUPON]: (state, action) => {
		return {
			...state,
			curCoupon: action.coupon
		}
	},
	[UPDATE_CHANNEL_CURRENT_COUPONID]: (state, action) => {
		return {
			...state,
			curCoupon: {...state.curCoupon, useRefId: action.useRefId}
		}
	},
	[UPDATE_CHANNEL_IS_MEMBER_PRICE]: (state, action) => {
		return {
			...state,
			isMemberPrice: action.isMemberPrice
		}
	},
	[SET_COUPON_RESULT]: (state, action) => {
		return {
			...state,
			isCouponResult: action.data
		}
	}
};

export function channelIntro (state = initState, action) {
	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state
}

