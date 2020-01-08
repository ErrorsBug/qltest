import { request } from './common';
import { getVal } from 'components/util';

export const INIT_PAGE_DATA = 'INIT_PAGE_DATA';
export const UPDATE_COUPON_INFO = 'UPDATE_COUPON_INFO';
export const UPDATE_SELECTED_CHARGE_CONFIG = 'UPDATE_SELECTED_CHARGE_CONFIG';
export const UPDATE_FOLLOW_LIVE = 'UPDATE_FOLLOW_LIVE';
export const FETCH_CONSULT_LIST = 'FETCH_CONSULT_LIST';
export const FETCH_SHARE_LIST = 'FETCH_SHARE_LIST';
export const UPDATE_CONSULT_PRAISE = 'UPDATE_CONSULT_PRAISE';
export const UPDATE_COLLECT = 'UPDATE_COLLECT';
export const UPDATE_TOPICAUTH = 'UPDATE_TOPICAUTH';
export const INIT_POWER = 'INIT_POWER';
export const UPDATE_TOPIC_CURRENT_COUPON_INFO = 'UPDATE_TOPIC_CURRENT_COUPON_INFO';
export const UPDATE_TOPIC_COUPON_INFO_ID = 'UPDATE_TOPIC_COUPON_INFO_ID';
export const SELECT_COUPON_INDEX = 'SELECT_COUPON_INDEX';
export const UPDATE_TOPIC_IS_MEMBER_PRICE = 'UPDATE_TOPIC_IS_MEMBER_PRICE';



export function initPageData (pageData) {
    return {
        type: INIT_PAGE_DATA,
        pageData
    }
}

export function initPower (power) {
	return {
		type: INIT_POWER,
		power
	}
}

/**
 * 获取介绍页第一批数据
 */
export function fetchInitData (params) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/topic/init-data',
            method: 'POST',
            body: params
        });
        const resultData = {
            liveInfo: {
                ...getVal(result, 'liveInfo.data', {}),
                followNum:getVal(result, 'followNum.data.follwerNum', 0),
                topicNum:getVal(result, 'channelNumAndTopicNum.data.topicNum', 0),
                isWhite:getVal(result, 'isWhite.data.isWhite', 'N'),
            },
            evaluation: getVal(result, 'evaluation.data', 0),
            consultNum: getVal(result, 'consultNum.data.count', 0),
            browsNum: getVal(result, 'getTopicBrowsNum.data.browseNum', 0),
	        topicSummary: getVal(result, 'topicSummary.data.content'),
			isLogined: result.isLogined, // 是否登录
        }

        // 已登录才有的数据
        if (result.isLogined) {
            resultData.userId = result.userId;
            resultData.power = getVal(result, 'power.data.powerEntity', {})
            resultData.isSubscribe = getVal(result, 'isSubscribe.data', {})
            resultData.isLiveAdmin = getVal(result, 'isLiveAdmin.data', {})
            resultData.isFollow = getVal(result, 'isFollow.data', {})
            resultData.isAuthTopic = getVal(result, 'isAuthTopic.data.isAuth', false)
            resultData.blackInfo = getVal(result, 'blackInfo.data', false)
            resultData.myShareQualify = getVal(result, 'myShareQualify.data.shareQualifyInfo', {});
            
            resultData.coral = getVal(result, 'coralIdentity.data', {});
            resultData.relayConfig = getVal(result, 'getRelayConfig.data', {});
            resultData.liveRole = getVal(result, 'liveRole.data.role', '');
            resultData.userVipInfo = getVal(result, 'userVipInfo.data', {});//用户VIP信息
	        resultData.userTag = getVal(result, 'userTag.data.twUserTag', '');
            dispatch({
                type: 'INIT_MEMBER_INFO',
                memberInfo: getVal(result, 'memberInfo', {})
            })
        }
        
        // 系列课中的话题才有的字段
        if (params.channelId) {
            resultData.channelInfo = getVal(result, 'channelInfo.data', {})
            resultData.chargePos = getVal(result, 'chargeStatus.data.chargePos', {})
            
            dispatch(updateSelectedChargeConfig({ chargeConfig: getVal(result, 'channelInfo.data.chargeConfigs.0', {}) }))
        }
        
        resultData.sysTimestamp = result.sysTimestamp;
        dispatch(initPageData(resultData));
    }
}

/**
 * 获取优惠券列表
 * @param {*} param0 
 */
export function myCouponList ({ topicId, channelId, liveId }) {
    return async (dispatch, getStore) => {
        try {
            const result = await request({
                url: '/api/wechat/topic/topic-coupons',
                method: 'GET',
                body: {
                    topicId,
                    channelId,
                    liveId
                }
            })

            let topicCouponList = getVal(result, 'topicCouponList.data.couponList', []);
            let channelCouponList = getVal(result, 'channelCouponList.data.couponList', []);

            dispatch({
                type: UPDATE_COUPON_INFO,
                couponInfo: {
                    topicCouponList,
                    channelCouponList,
                }
            })
        } catch (error) {
            console.error(error);
        }
        
    }
}

// 获取自媒体转载系列课的优惠券
export function fetchMediaCouponList(params) {
    return async (dispatch, getStore) => {
        const result = await request({
            method: 'POST',
            url: '/api/wechat/channel/getMediaCouponList',
            body: params
        });
        let sysTime = getVal(getStore(), 'common.sysTime', Date.now())
        let topicCouponList = getVal(getStore(), 'topicIntro.topicCouponList', [])
        let channelCouponList = getVal(result, 'data.couponList', []).filter((coupon) => {
            // 如果是自媒体转载系列课，过滤掉那些还没到开始日期的优惠券
            return (sysTime >= (new Date(coupon.startTime)).getTime())
        });

        dispatch({
            type: UPDATE_COUPON_INFO,
            couponInfo: {
                topicCouponList,
                channelCouponList,
            }
        })

        return result;
    }
}


export function followLive(liveId,status='Y',auditStatus = '') {
    return async (dispatch, getStore) => {
        let result = await request({
            url: '/api/wechat/live/follow',
            method: 'POST',
            showLoading: true,
            body: {
                liveId,
                status,
                auditStatus,
            }
        })
        if (result.state && !auditStatus){
            window.toast(result.state.msg);
        }

        if(result && result.data) {
            dispatch({
                type: UPDATE_FOLLOW_LIVE,
                isFollow: result && result.data && result.data.isFollow
            })
        }
        return result;
    }
}

/**
 * 更新单课优惠信息和系列课优惠信息
 * @param {*} param0 
 */
export function updateCouponInfo ({ topicCoupon, channelCoupon }) {
    console.log('设置话题优惠券')
    const couponInfo = {};
    if (topicCoupon != null) {
        couponInfo.curTopicCoupon = topicCoupon;
    }
    if (channelCoupon != null) {
        couponInfo.curChannelCoupon = channelCoupon;
    }

    return {
        type: UPDATE_TOPIC_CURRENT_COUPON_INFO,
        couponInfo,
    }
}

export function updateCouponInfoId ({couseType, useRefId}) {
    return {
        type: UPDATE_TOPIC_COUPON_INFO_ID,
        couseType,
        useRefId
    }
}

/**
 * 更新选中的charge config    按月付费的月份
 * @param {*} param0 
 */
export function updateSelectedChargeConfig ({ chargeConfig }) {
    return {
        type: UPDATE_SELECTED_CHARGE_CONFIG,
        chargeConfig
    }
}

/**
 * 咨询列表
 * @param {*} param0 
 */
export function consultList ({ topicId, type = 'topic', page = 0, size = 20 }) {
    return async (dispatch, getStore) => {
        dispatch({
            type: FETCH_CONSULT_LIST,
            status: 'pending'
        });

        const result = await request({
            url: '/api/wechat/topic/consult-list',
            method: 'GET',
            body: {
                topicId,
                type,
                page: page + 1,
                size,
            }
        });

        if (getVal(result, 'state.code') === 0) {
            let noMore = getVal(result, 'data.consultList', []).length < size;
            dispatch({
                type: FETCH_CONSULT_LIST,
                consultList: getVal(result, 'data.consultList', []),
                page: page + 1,
                size,
                noMore,
                status: noMore ? 'end' : 'success'
            });
        }
    }
}

/**
 * 发送留言
 * @param {*} param0 
 */
export function postConsult ({ content, type = 'topic', topicId }) {
    return (dispatch, getStore) => {
        return request({
            url: '/api/wechat/topic/post-consult',
            method: 'POST',
            body: {
                topicId,
                type,
                content,
            }
        });
    }
}

/**
 * 加密话题报名
 * @param {*} param0 
 */
export function enterEncrypt ({ shareKey, password, topicId, channelNo}) {
    return (dispatch, getStore) => {
        return request({
            url: '/api/wechat/topic/enterEncrypt',
            method: 'POST',
            body: {
                shareKey, password, topicId, channelNo
            }
        })
    }
}

/**
 * 分享列表
 * @param {*} param0 
 */
export function fetchShareList ({topicId}) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/topic/getShareTopThree',
            method: 'GET',
            body: {
                topicId
            }
        });

        if (getVal(result, 'state.code') === 0) {
            dispatch({
                type: FETCH_SHARE_LIST,
                shareUser: getVal(result, 'data.shareUser', [])
            });
        }
    }
}


export function getTopic (liveId, page) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/live/getTopic',
            method: 'POST',
            body: {
                liveId,
                page: {
                    page: page,
                    size: 20
                }
            },
        });
        return result && result.data && result.data.liveTopics
    }
};


/*点赞 */
export function consultPraise(id) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/consult/praise',
            body: { id },
            method: 'POST',
        });
        if (result.state.code === 0) {
            dispatch({
                type: UPDATE_CONSULT_PRAISE,
                id
            })
        }
        
        if (result.state){
            window.toast(result.state.msg);
        }
        return result;
    }
}


/*点赞 */
export function getGiftId(orderId) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/topic/getGiftId',
            body: { orderId },
            method: 'POST',
        });
        
        if (result.state){
            window.toast(result.state.msg);
        }
        return result;
    }
}

/* 查询学员是否填写过 */
export function checkUser(params) {
    return async (dispatch, getStore) => {
        const result = await request({
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/check-user',
        });
        
        if(result && result.data) {
            dispatch({
                type: UPDATE_COLLECT,
                isNeedCollect: result.data.config
            })
        }
        return result
    }
}


// 获取实名认证
export function getRealStatus(liveId,type) {
    return async (dispatch, getStore) => {
        const result = await request({
            method: 'GET',
            url: '/api/wechat/live/getRealStatus',
            body: {liveId,type},
        });

        return result;
    };
}

export function getCheckUser(params={}){
    return async (dispatch, getStore) => {
        const result = await request({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/checkUser',
            body: {...params},
        });

        return result;
    };
}
/**
 * 开放平台用户绑定
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function userBindKaiFang(params) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/live/userBindKaiFang',
            body: params,
            method: 'POST',
        });

        return result;
    }
}
/**
 * 话题邀请卡报名
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function topicTaskCardAuth(params) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: '/api/wechat/share/topicTaskCardAuth',
            body: params,
            method: 'POST',
        });

        if(result.state && result.state.code == '0') {
            dispatch({
                type: UPDATE_TOPICAUTH,
                topicAuth: true
            })
        }

        return result;
    }
}

//获取分销排行榜
export function getPromoRank (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'POST',
			url: '/api/wechat/distribution/rank',
			body: params
		});

		return result;
	}
}

//获取话题自动分销信息
export function getTopicAutoShare (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'GET',
			url: '/api/wechat/topic/getTopicAutoShare',
			body: params
		});

		return result;
	}
}

// 设置话题自动分销信息
export function setTopicAutoShare (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'GET',
			url: '/api/wechat/topic/setTopicAutoShare',
			body: params
		});

		return result;
	}
}

/* 获取用户权限 */
export function fetchUserPower({ topicId }){
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'GET',
			url: '/api/wechat/user/power',
			body: {
				topicId
            }
		});
		if(result && result.state && result.state.code === 0){
			dispatch(initPower(result.data.powerEntity))
		}
		return result;
	};
}

/**
 * 绑定直播间分销关系
 * @param  {[type]} liveId    [description]
 * @param  {[type]} lshareKey [description]
 * @return {[type]}           [description]
 */
export function bindShareKey(liveId, lshareKey = '', sourceNo = '') {

    return async (dispatch, getStore) => {
        return await request({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/bind-share-key',
            body: {
                liveId,
                shareKey: lshareKey,
	            sourceNo,
            }
        });
    };
}

// 获取优惠券选中下标
export function selectCouponIdx(selIdx) {
    return {
        type: SELECT_COUPON_INDEX,
        selIdx,
    };
};

/**
 * 
 * @param {*} 查看用户拼团结果 
 */
export function getChannelGroupResult(channelId) {
    return async (dispatch, getStore) => {
        const result = await request({
            dispatch,
            getStore,
            showLoading:true,
	        url: '/api/wechat/channel/getGroupResult',
            body: {
                channelId
            },
        });

        return result;
    };
}

//获取拉人返现配置
export function getInviteReturnConfig (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'POST',
			url: '/api/wechat/topic/getInviteReturnConfig',
			body: params
		});

		return result;
	}
}

//获取话题自动分销信息
export function saveInviteReturnConfig (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'POST',
			url: '/api/wechat/topic/saveInviteReturnConfig',
			body: params
		});

		return result;
	}
}

// 判断是否能设置拉人返现配置
export function canSetInviteReturnConfig (params) {
	return async (dispatch, getStore) => {
		const result = await request({
			method: 'POST',
			url: '/api/wechat/invite/canSetInviteReturnConfig',
			body: params
		});

		return result;
	}
}