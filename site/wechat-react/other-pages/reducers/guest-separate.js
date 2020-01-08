import {
	INIT_INVITATION_INFO,
    GUEST_SEPARATE_INFO,
    UPDATE_GUEST_SEPARATE_PERCENT,
    UPDATE_GUEST_SEPARATE_ENDTIME,
    ASSIGNED_PERCENT,
    SUMSHARE_MONEY,
    UPDATE_GUEST_SEPARATE_DETAIL_LIST,
    UPDATE_GUEST_SEPARATE_CLEARING_LIST,
    INIT_PERCENT_ACCEPT_STATUS,
} from '../actions/guest-separate'

const initState = {
    guestInfo: {},
    invitationInfo: {},
    assignedPercent:'',
    sumShareMoney:{},
    clearingList:[],
    detailList:[],
    detailLiveList:[],
    percentAcceptStatus:"",
};


const ACTION_HANDLERS = {
	[INIT_INVITATION_INFO]: (state, action) => {
		return {
			...state,
			invitationInfo: action.info
		}
	},
    [GUEST_SEPARATE_INFO]: (state, action) => {
	    return {
		    ...state,
		    guestInfo: {...state.guestInfo,...action.guestInfo}
	    }
    },
    [UPDATE_GUEST_SEPARATE_PERCENT]:(state, action)=>{
        return {
		    ...state,
		    guestInfo:{...state.guestInfo,...{sharePercent:action.percent}}
	    }
    },
    [UPDATE_GUEST_SEPARATE_ENDTIME]:(state, action)=>{
        return {
		    ...state,
		    guestInfo:{...state.guestInfo,...{expiryTime:action.endTime}}
	    }
    },
    [ASSIGNED_PERCENT]:(state, action)=>{
        return {
		    ...state,
		    assignedPercent: action.assignedPercent,
	    }
    },
    [SUMSHARE_MONEY]:(state, action)=>{
        return {
		    ...state,
            sumShareMoney: action.sumShareMoney,
	    }
    },
    [UPDATE_GUEST_SEPARATE_DETAIL_LIST]:(state, action)=>{
        return {
		    ...state,
            detailList:[...state.detailList,...action.detailList],
            detailLiveList: [...state.detailLiveList,...action.detailLiveList],
	    }
    },
    [UPDATE_GUEST_SEPARATE_CLEARING_LIST]:(state, action)=>{
        return {
		    ...state,
		    clearingList:[...state.clearingList,...action.clearingList],
	    }
    },
    [INIT_PERCENT_ACCEPT_STATUS]:(state, action)=>{
        return {
		    ...state,
		    percentAcceptStatus:action.percentAcceptStatus,
	    }
    },
};

export function guestSeparate (state = initState, action) {

	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state

}

