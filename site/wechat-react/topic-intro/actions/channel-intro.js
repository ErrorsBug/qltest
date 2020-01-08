/**
 *
 * @author Dylan
 * @date 2018/5/30
 */
import { request, api } from './common';
import { getVal } from 'components/util';
import {USERINFO} from "../../actions/common";

export const INIT_CHANNEL_PAGE_DATA = 'INIT_CHANNEL_PAGE_DATA';
export const CHANNEL_C_GROUPING_LIST = 'CHANNEL_C_GROUPING_LIST';
export const CHANNEL_C_GROUP_INFO_SELF = 'CHANNEL_C_GROUP_INFO_SELF';
export const CHANNEL_C_GROUP_INFO = 'CHANNEL_C_GROUP_INFO';
export const CHANNEL_UPDATE_AUTH = 'CHANNEL_UPDATE_AUTH';
export const UPDATE_COUPON_INFO = 'UPDATE_COUPON_INFO';
export const UPDATE_CHANNEL_COUPON_STATUS = 'UPDATE_CHANNEL_COUPON_STATUS';
export const UPDATE_CHANNEL_CURRENT_COUPON = 'UPDATE_CHANNEL_CURRENT_COUPON';
export const UPDATE_CHANNEL_CURRENT_COUPONID = 'UPDATE_CHANNEL_CURRENT_COUPONID';
export const UPDATE_CHANNEL_IS_MEMBER_PRICE = 'UPDATE_CHANNEL_IS_MEMBER_PRICE';
export const SET_COUPON_RESULT = 'SET_COUPON_RESULT';
export const TRAINING_CAMP_INFO = Symbol("TRAINING_CAMP_INFO");

export function initChannelPageData (pageData) {
	return {
		type: INIT_CHANNEL_PAGE_DATA,
		pageData
	}
}

export function updateChannelAuth () {
	return dispatch => {
		dispatch({
			type: CHANNEL_UPDATE_AUTH
		});
	};
}

export function updateCurChannelCoupon (coupon) {
	return {
		type: UPDATE_CHANNEL_CURRENT_COUPON,
		coupon
	}
}

export function updateCurChannelCouponId (useRefId) {
	return {
		type: UPDATE_CHANNEL_CURRENT_COUPONID,
		useRefId
	}
}

export function updateChannelCouponStatus(channelId){
	return async (dispatch, getStore) => {
		const result = await request({
			url: '/api/wechat/channel/channel-status',
			method: 'POST',
			body: {
				channelId
			}
		});
		if(result.state.code === 0){
			dispatch({
				type: UPDATE_CHANNEL_COUPON_STATUS,
				channelCouponStatus: getVal(result, 'data', {})
			});
		}
	};
}

/**
 * 获取介绍页第一批数据
 */
export function fetchInitData (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			url: '/api/wechat/channel/initIntro',
			method: 'POST',
			body: params
		});
		const resultData = {
			liveInfo: {
				...getVal(result, 'liveInfo.data', {}),
				followNum:getVal(result, 'followNum.data.follwerNum', 0),
				topicNum:getVal(result, 'channelNumAndTopicNum.data.topicNum', 0),
				// isWhite:getVal(result, 'isWhite.data.isWhite', 'N'),
			},
			// evaluation: getVal(result, 'evaluation.data', 0),
			// consultNum: getVal(result, 'consultNum.data.count', 0),
			// channelSummary: getVal(result, 'channelSummary.data.content', ''),
			groupingList: getVal(result, 'groupingList.data.groupList', []),
			currentGroupInfo: getVal(result, 'currentGroupInfo.data.channelGroupPo', {}),
			shareCutCourseInfo: getVal(result, 'shareCutCourseInfo.data.info', {}),
			isLogined: result.isLogined, // 是否登录
		}

		dispatch({
			type: 'INIT_EVALUATION_DATA',
			evaluationData: getVal(result, 'evaluation.data', {})
		});

		if(params.isCamp === 'Y'){
			dispatch({
				type: 'INIT_TRAINING_DATA',
				data: {
					campInfo: getVal(result, 'currentPeriod.data', {}),
				}
			});
		}

		// 已登录才有的数据
		if (result.isLogined) {
			resultData.userId = result.userId;
			resultData.power = getVal(result, 'power.data.powerEntity', {});
			resultData.isLiveAdmin = getVal(result, 'isLiveAdmin.data.isLiveAdmin', 'N');
			resultData.isFollow = getVal(result, 'isFollow.data', {});
			resultData.isAuthChannel = getVal(result, 'isAuthChannel.data.status', 'N');
			resultData.blackInfo = getVal(result, 'blackInfo.data.type', null);
			resultData.myShareQualify = getVal(result, 'myShareQualify.data.shareQualifyInfo', {});
			resultData.coral = {
				isPersonCourse: getVal(result, 'myShareQualify.data.isPersonCourse', 'N'),
				sharePercent: getVal(result, 'myShareQualify.data.sharePercent', ''),
			};
			// resultData.coral = getVal(result, 'coralIdentity.data', '');
			// resultData.liveRole = getVal(result, 'liveRole.data.role', '');
			resultData.userVipInfo = getVal(result, 'vipInfo.data', {});//用户VIP信息
			resultData.myGroupInfo = getVal(result, 'checkIsHasGroup.data.channelGroupPo', {});
			resultData.alreadyBuyChannelId = getVal(result, 'checkDuplicateBuy.data.alreadyBuyChannelId');
			resultData.relayInfo = getVal(result, 'relayInfo.data', {});
			resultData.isSubscribe = getVal(result, 'isSubscribe.data.subscribe', false);
			resultData.isBindThird = getVal(result, 'isSubscribe.data.isBindThird', false);
			resultData.isFocusThree = getVal(result, 'isSubscribe.data.isFocusThree', false);
			resultData.userTag = getVal(result, 'userTag.data.twUserTag', '');
			dispatch({
				type: 'USERINFO',
				userInfo: result.user,
			});
            dispatch({
                type: 'INIT_MEMBER_INFO',
                memberInfo: getVal(result, 'memberInfo', {})
            });
			if(params.isCamp === 'Y'){
				dispatch({
					type: 'INIT_TRAINING_DATA',
					data: {
						joinCampInfo: getVal(result, 'joinCampInfo.data', {})
					}
				});
			}
		}


		resultData.sysTimestamp = result.sysTimestamp;
		dispatch(initChannelPageData(resultData));
	}
}

// 更新付费用户信息
export function fetchPayUser({channelId, liveId}) {
	return async (dispatch, getStore) => {
		const result = await request({
			showLoading: false,
			url: '/api/wechat/channel/pay-user',
			method: 'GET',
			body: {
				channelId,
				liveId,
			}
		});

		return result;
	}
}

export function getChannelGroupInfo({channelId, groupId}) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/weapp/channel/groupInfo',
            body: {
				channelId,
				groupId,
            },
        });

        // dispatch({
        //     type: CHANNEL_C_GROUP_INFO,
        //     groupInfo:result,
        // });

        return result;
    };
}

export function channelCreateGroup(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/createGroup',
            body: {
                channelId,
            },
            method: "POST",
        });

        return result;
    };
}

export function getChannelGroupResult(channelId,groupId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
	        url: '/api/wechat/channel/getGroupResult',
            body: {
                channelId,groupId,
            },
        });

        return result;
    };
}

export function getOpenPayGroupResult(channelId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:true,
			method: 'POST',
			url: '/api/wechat/channel/getOpenPayGroupResult',
			body: {
				channelId
			},
		});

		return result;
	};
}

export function getMyGroupInfo({ channelId }) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/checkIsHasGroup',
            body: {
                channelId
            },
        });
		
		dispatch({
            type: CHANNEL_C_GROUP_INFO_SELF,
            groupInfoSelf:result,
        });

        return result;
    };
}

export function updateChannelGroupingList(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/getChannelGroupingList',
            body: {
                channelId
            },
		});
        dispatch({
            type: CHANNEL_C_GROUPING_LIST,
            groupingList: getVal(result, 'data.groupList', []),
        });

        return result;
    };
}


export function fetchTopicList({channelId, liveId, pageNum, pageSize}) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/topic-list',
            body: {
                channelId,
                liveId,
                clientType: 'weixin',
                pageNum,
                pageSize,
            }
        });

        return result;
    };
}

/**
 * 绑定直播间分销关系
 * @return {[type]} [description]
 */
export function bindLiveShare({liveId, shareKey, sourceNo}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: "POST",
			showLoading: false,
			url: '/api/wechat/channel/bind-live-share',
			body: {
				liveId,
				shareKey,
				sourceNo,
			}
		});

		return result;
	}
}


// 获取自媒体转载系列课的优惠券
export function fetchMediaCouponList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/getMediaCouponList',
			body: params
		});

		return result;
	}
}

// 查询用户是否有对应业务优惠码
export function fetchCouponListAction (businessType, businessId, liveId, status, percent) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/topic/myCouponList',
			body: {
				businessType,
				businessId,
				liveId,
				status,
				percent
			}
		})
	}
}

// 更新优惠金额
export function updateCouponInfo(qlCouponMoney, couponId, couponType, minMoney) {
	return {
		type: UPDATE_COUPON_INFO,
		qlCouponMoney,
		couponId,
		couponType,
		minMoney,
	}
}


/* 获取精选咨询*/
export function getConsultSelected(topicId, type, showLoading = true) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading,
			url: '/api/wechat/consult/selected',
			body: { topicId, type },
			method: 'GET',
		});
		return result;
	}
}

/* 点赞留言 */
export function consultPraise(id) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/consult/praise',
			body: { id },
			method: 'POST',
		});
		return result;
	}
}

/**
 * 统计支付
 *
 */
export function countSharePayCache (payMoney) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/group/countSharePayCache',
			body: {
				payMoney
			}
		});
	}
}

export function activityCodeExist (businessId, promotionId, businessType) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/activityCode/exists',
			body: {
				businessType,
				businessId,
				promotionId,
			}
		})
	}
}
export function activityCodeBind (businessId, promotionId, businessType) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			errorResolve: true,
			url: '/api/wechat/channel/activityCode/bind',
			body: {
				businessType,
				businessId,
				promotionId,
			}
		})
	}
}

// 查询定制券实体
export function getPromotion(codeId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/getPromotion',
			body: {
				codeId,
			}
		});

		return result;
	};
}

// 获取自媒体转载课优惠券详细信息
export function fetchMediaCouponDetail(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/getCouponDetail',
			body: params
		});

		return result;
	}
}

// 是否已经领取过某一批次的优惠券
export function fetchIsReceivedCoupon(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/isReceivedCoupon',
			body: params
		});

		return result;
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

export function addCollect (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/addCollect',
			body: {...param}
		});
	}
}
export function isCollected (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/isCollected',
			body: {...param}
		});
	}
}
export function cancelCollect (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/cancelCollect',
			body: {...param}
		});
	}
}

/**
 * 获取话题授权状态
 *
 * @export
 * @param {string} topicId
 * @returns
 */
export function getAuth(topicId) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/auth',
			method: 'GET',
			showLoading: false,
			body: {
				topicId
			}
		});

		return result;
	};
}

// 获取系列课主页试听音频
export function getTryListen(sourceChannelId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/tryListen',
			body: {
				sourceChannelId
			}
		});
		return result;
	}
}

// 是否已经购买和转载系列课相同的系列课
export function checkDuplicateBuy(channelId){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/checkDuplicateBuy',
			body: { channelId }
		});
		return result;
	}
}

// 重复购买提示：获取关注二维码
export function fetchQlQrcode(){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/activity/getQr',
			body: { showQl: 'Y', channel: 'reBuySubscribe' }
		});
		return result;
	}
}

// 请求是否显示拼课内容
export function getIfHideGroupInfo(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'GET',
			url: '/api/wechat/channel/getIfHideGroupInfo',
			body: params
		});
		return result;
	}
}

// 系列课任务邀请卡鉴权
export async function channelTaskCardAuth(params){
	const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/channel/channelTaskCardAuth',
		body: params
	});
	return result;
}

// 初始化系列课购买信息
export async function initChargeStatus(params) {
    const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/channel/chargeStatus',
		body: params
	});
	return result;
};

// 获取系列课是否已购
export function getIsAuthChannel(channelId){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			errorResolve: true,
			method: 'POST',
			url: '/api/wechat/channel/isAuthChannel',
			body: {
				channelId,
			}
		}).then(res => {
			if (res.state.code) throw Error(res.state.msg);
			return res.data.status;
		}).catch(err => {
			return 'N';
		})

		result === 'Y' && dispatch({
			type: CHANNEL_UPDATE_AUTH
		});

		return result;
	}
}

// 获取系列课中训练营信息
export function getCurrentPeriod(params) {
    return async (dispatch, getStore) => {
		const result = await api({
            dispatch,
            getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/currentPeriod',
			body: params
		});
		return result;
	}
};

// 获取训练营话题列表
export function fetchCampListTopic(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/channel/camp/listTopic',
            body: params
        });
        return result;
    }
}

// 获取训练营学员作业列表
export function fetchCampListByChannel(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/channel/camp/answer/listByChannel',
            body: params
        });
        return result;
    }
}

// 判断用户是否加入训练营
export function getJoinCampInfo(params){
    return async (dispatch, getStore) => {
		const result = await api({
            dispatch,
            getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/joinCampInfo',
			body: params
		});
		return result;
	}
}

// 训练营学员作业列表点赞
export function campAnswerlikes(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/channel/camp/answer/likes',
            body: params
        });
        return result;
    }
}

// 关联训练营
export async function joinPeriod(params){
	const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/channel/joinPeriod',
		body: params
	});
	return result;
}

// 获取证书信息
export function getCertificateCardData(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
            getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/getUserCard',
			body: params
		});
		return result;
	}
}
//设置证书显示的昵称
export async function setCertificateName(params){
	const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/channel/setUserName',
		body: params
	});
	return result;
}

// 获取是否有证书资格
export function getUserQualification(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
            getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/channel/getUserQualification',
			body: params
		});
		console.log(result);
		return result;
	}
}

// 解锁课程进度
export async function fetchUnlockProgress(params) {
    const result = await api({
        showLoading: false,
        method: 'POST',
        url: '/api/wechat/channel/unlockProgress',
        body: params
    });
    return result;
};

// 绑定邀请关系
export async function unlockCourseBindUserRef(params) {
    const result = await api({
        showLoading: false,
        method: 'POST',
        url: '/api/wechat/channel/bindUserRef',
        body: params,
	    showWarningTips: false
    });
    return result;
};

// 绑定邀请关系
export async function isSubscribeAppId(params) {
    const result = await api({
        showLoading: false,
        method: 'POST',
        url: '/api/wechat/channel/isSubscribeAppId',
        body: params
    });
    return result;
};



export function setCouponResult (data) {
	return {
		type: SET_COUPON_RESULT,
		data
	}
}


// 训练营分销权限信息
export const getDistributePermission = async (params) => {
    const res = await api({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/distribute/getDistributePermission',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}


// 训练营分销配置信息
export const getDistributeConfig = async (params) => {
    const res = await api({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getDistributeConfig',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}

// 体验营导购页
export const getIntentionCamp = async (params) => {
    const res = await api({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getIntentionCamp',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}