import { api } from './common';

export const GUEST_SEPARATE_INFO = 'GUEST_SEPARATE_INFO';
export const UPDATE_GUEST_SEPARATE_PERCENT = 'UPDATE_GUEST_SEPARATE_PERCENT';
export const UPDATE_GUEST_SEPARATE_ENDTIME = 'UPDATE_GUEST_SEPARATE_ENDTIME';
export const ASSIGNED_PERCENT = 'ASSIGNED_PERCENT';
export const SUMSHARE_MONEY = 'SUMSHARE_MONEY';
export const UPDATE_GUEST_SEPARATE_DETAIL_LIST= 'UPDATE_GUEST_SEPARATE_DETAIL_LIST';
export const UPDATE_GUEST_SEPARATE_CLEARING_LIST= 'UPDATE_GUEST_SEPARATE_CLEARING_LIST';
export const INIT_PERCENT_ACCEPT_STATUS = 'INIT_PERCENT_ACCEPT_STATUS';


// 初始化liveId
export function initGuestSeparateInfo (guestInfo) {
	return {
		type: GUEST_SEPARATE_INFO,
		guestInfo
	}
};

export const INIT_INVITATION_INFO = 'INIT_INVITATION_INFO';

export function initInvitationInfo (info) {
	return {
		type: INIT_INVITATION_INFO,
		info
	}
}
export function initPercentAcceptStatus (percentAcceptStatus) {
	return {
		type: INIT_PERCENT_ACCEPT_STATUS,
		percentAcceptStatus
	}
}

export function initAssignedPercent(assignedPercent){
    return {
        type: ASSIGNED_PERCENT,
        assignedPercent,
    }
}
export function initSumShareMoney(sumShareMoney){
    return {
        type: SUMSHARE_MONEY,
        sumShareMoney,
    }
}

export function resetEndTime(endTime){
    return {
        type: UPDATE_GUEST_SEPARATE_ENDTIME,
        endTime,
    }
}

export function getGuestSeparateInfo() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/guestSeparate/info',
			body: {
				
			}
		});

		dispatch(initGuestSeparateInfo(result.data&&result.data.guestInfo||{}));

		return result;
	};
}

export function setGuestSeparatePercent(guestid,channelId,topicId,campId,percent) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:true,
			url: '/api/wechat/guestSeparate/setPercent',            
            method: 'POST',
			body: {
                guestId:guestid,
                channelId,
				topicId,
				campId,
				sharePercent:percent,
				type:channelId?"channel":(campId? "camp" : "topic"),
			},
		});

        if(result.state.code===0){
            dispatch({
                type: UPDATE_GUEST_SEPARATE_PERCENT,
                percent
            });
        }else{
            console.error(result.state.msg);
        }

		return result;
	};
}

export function setGuestSeparateEndTime(guestid,channelId,topicId,campId,endTime,isRecovery) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:true,
			url: '/api/wechat/guestSeparate/setEndTime',
            method: 'POST',
			body: {
                guestId:guestid,
                channelId,
				topicId,
				campId,
				expiryTime:endTime,
                isRecovery,
			},
		});
        if(result.state.code===0){
            dispatch(resetEndTime(endTime));
        }else{
            console.error(result.state.msg);
        }
		

		return result;
	};
}

export function overSeparate(params){
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:true,
			url: '/api/wechat/guestSeparate/over',
            method: 'POST',
			body: params,
		});	
        if(result.state.code===0){
            dispatch(resetEndTime((new Date().getTime()-2*60*1000)));
        }else{
            console.error(result.state.msg);
        }	

		return result;
	};
}

export function getSeparateClearingList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/guestSeparate/clearingList',
			body: params,
		});
        if(result.state.code===0){
            dispatch({
                type: UPDATE_GUEST_SEPARATE_CLEARING_LIST,
                clearingList:result.data.list,
            });
        }

		return result;
	};
}

export function getSeparateDetailList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/guestSeparate/detailList',
			body: params,
		});

		if(result.state.code===0){
			if(params.source ==='normal'){
				dispatch({
					type: UPDATE_GUEST_SEPARATE_DETAIL_LIST,
					detailList:[],
					detailLiveList:result.data.list,
				});
			}else{
				dispatch({
					type: UPDATE_GUEST_SEPARATE_DETAIL_LIST,
					detailList:result.data.list,
					detailLiveList:[],
				});
			}
            
        }

		return result;
	};
}

/* 获取收益明细记录的数目 */
export function getProfitRecordCount(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			showWarningTips: true,
			url: '/api/wechat/guestSeparate/countProfitRecord',
			body: params,
		});

		if (result.state.code === 0) {
			return result.data
		} else {
			throw new Error('[api] get profit recornd count error')
		}
	};
}

/* 获取发放记录的数目 */
export function getTransferRecordCount(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			showWarningTips: true,
			url: '/api/wechat/guestSeparate/counTransferRecord',
			body: params,
		});

		if (result.state.code === 0) {
			return result.data
		} else {
			throw new Error('[api] get transfer recornd count error')
		}
	};
}


export function getChennelList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
            showLoading: false,
			url: '/api/wechat/guest-separate/getChannelList',
			body: params
		});

		return result;
	};
}
export function getTopicList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
            showLoading: false,
			url: '/api/wechat/guest-separate/getTopicList',
			body: params
		});

		return result;
	};
}
export function getCampList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
            showLoading: false,
			url: '/api/wechat/guest-separate/getCampList',
			body: params
		});

		return result;
	};
}


// 已添加系列课分成列表
export function channelAddedSeparateList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			url: '/api/wechat/guest-separate/channelAddedSeparateList',
			body: params
		});

		return result;
	};
}

// 添加系列课分成
export function addSeparate(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/guest-separate/addSeparate',
			body: params
		});

		return result;
	};
}

// 删除未邀请分成设置
export function deleteEmptyGuest(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/guest-separate/deleteEmptyGuest',
			body: params
		});

		return result;
	};
}

// 获取当前已分配嘉宾分成比例总和
export function getAssignedPercent(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
            showLoading: false,
			url: '/api/wechat/guest-separate/getAssignedPercent',
			body: params
		});

		return result;
	};
}

// 结算
export function guestSeparateClearing(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
            showLoading: true,
			url: '/api/wechat/guest-separate/clearing',
			body: params
		});
        
        if(result.state.code===0){
            dispatch(initSumShareMoney({
					pendingMoney: params.isWhole==="Y" ? 0 : (Number(params.dueMoney) - Number(params.transferMoney)).toFixed(2),
					dealtMoney: (Number(params.dealtMoney) + Number(params.transferMoney)).toFixed(2),
					expectingMoney: params.expectingMoney,
			}));
        }else{
            console.error(result.state.msg);
        }	

		return result;
	};
}
// 接受邀请
export function acceptInvitation(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/guest-separate/acceptInvitation',
			body: params
		});

		return result;
	};
}

// 获取二维码
export function getQrCode(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/live/get-qr',
			body: params
		});

		return result;
	};
}

// c端嘉宾分成收益系列课列表
export function getchannelGuestData(params) {
    console.log(params);
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
            showLoading: false,
			url: '/api/wechat/guest-separate/getChannelGuestData',
			body: params,
		});

		return result;
	};
}

//邀请函的时间缓存
export function acceptTimeInvitation(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/guest-separate/cacheAcceptShare',
			body: params
		});

		return result;
	};
}

//接受修改比例时间缓存
export function acceptTimePercentPlease(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/guest-separate/cacheUpdateSharePercent',
			body: params
		});

		return result;
	};
}

//自动分成发放设置
export function updateIsAutoTransfer(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/guest-separate/updateIsAutoTransfer',
			body: params
		});

		return result;
	};
}

// 是否存在嘉宾转账待审核的记录
export function isExistAuditRecord(liveId){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			url: '/api/wechat/guest-separate/isExistAuditRecord',
			body: {
				liveId
			}
		});

		return result;
	};
}