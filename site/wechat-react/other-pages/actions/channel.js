
import { api } from './common';
import { get } from 'lodash';

export const INIT_CHANNEL_INFO = 'INIT_CHANNEL_INFO';
export const IS_CHANNEL_BLACK = 'IS_CHANNEL_BLACK';
export const CHANNEL_CHARGE_STATUS = 'CHANNEL_CHARGE_STATUS';
export const IS_CHANNEL_SUBSCRIBE = 'IS_CHANNEL_SUBSCRIBE';
export const IS_CHANNEL_FOLLOWTHIRD = 'IS_CHANNEL_FOLLOWTHIRD';
export const IS_CHANNEL_BINDTHIRD = 'IS_CHANNEL_BINDTHIRD';
export const IS_CHANNEL_SHOWQL = 'IS_CHANNEL_SHOWQL';
export const CHANNEL_LIVE_ROLE = 'CHANNEL_LIVE_ROLE';
export const CHANNEL_CHARGE_CONFIGS = 'CHANNEL_CHARGE_CONFIGS';
export const INIT_CHANNEL_PAY_USER_COUNT = 'INIT_CHANNEL_PAY_USER_COUNT';
export const INIT_CHANNEL_PAY_USER_IMAGES = 'INIT_CHANNEL_PAY_USER_IMAGES';
export const CHANNEL_VIP_INFO = 'CHANNEL_VIP_INFO';
export const CHANNEL_IS_LIVE_FOCUS = 'CHANNEL_IS_LIVE_FOCUS';
export const CHANNEL_DESC = 'CHANNEL_DESC';
export const FETCH_CHANNEL_COURSE_LIST = 'FETCH_CHANNEL_COURSE_LIST';
export const SET_CHANNEL_COURSE_PAGE_NUM = 'SET_CHANNEL_COURSE_PAGE_NUM';
export const CHANNEL_INIT_POWER = 'CHANNEL_INIT_POWER';
export const CHANNEL_UPDATE_COURSE_DATA = 'CHANNEL_UPDATE_COURSE_DATA';
export const CHANNEL_REMOVE_COURSE = 'CHANNEL_REMOVE_COURSE';
export const CHANNEL_INIT_CHANNEL_SATUS = 'CHANNEL_INIT_CHANNEL_SATUS';
export const CHANNEL_LIVE_SHARE_KEY = 'CHANNEL_LIVE_SHARE_KEY';
export const CHANNEL_SHARE_KEY = 'CHANNEL_SHARE_KEY';
export const MY_SHARE_QUALIFY = 'MY_SHARE_QUALIFY';
export const SET_CHANNEL_INFO = 'SET_CHANNEL_ID';
export const SET_CHANNEL_DISCOUNT_CODE = 'SET_CHANNEL_DISCOUNT_CODE';
export const OPEN_AUTO_SHARE = 'OPEN_AUTO_SHARE';
export const CHANNEL_GROUPING_LIST= 'CHANNEL_GROUPING_LIST';
export const CHANNEL_GROUP_INFO= 'CHANNEL_GROUP_INFO';
export const CHANNEL_GROUP_INFO_SELF= 'CHANNEL_GROUP_INFO_SELF';
export const INIT_CHANNEL_MARKETSET_INFO= 'INIT_CHANNEL_MARKETSET_INFO';
export const INIT_CHANNEL_COUPONSET_INFO= 'INIT_CHANNEL_COUPONSET_INFO';
export const UPDATE_ORDER_NOW_STATUS = '[CHANNEL]UPDATE_ORDER_NOW_STATUS';
export const UPDATE_COUPON_INFO = '[CHANNEL]UPDATE_COUPON_INFO';
export const CHANGE_TOPIC_DISPLAY = '[CHANNEL]CHANGE_TOPIC_DISPLAY';
export const CHANNEL_QL_SHARE_KEY = 'CHANNEL_QL_SHARE_KEY';
export const CHANNEL_CORAL_IDENTITY = 'CHANNEL_CORAL_IDENTITY';
export const INIT_CUT_COURSE_INFO = 'INIT_CUT_COURSE_INFO';


// 初始化系列课信息
export function initChannelInfo (channelInfo) {
    return {
        type: INIT_CHANNEL_INFO,
        channelInfo
    }
};

// 初始化系列课营销工具
export function initMarketSet (marketsetInfo) {
    return {
        type: INIT_CHANNEL_MARKETSET_INFO,
        marketsetInfo
    }
};
export function initCouponSet (couponsetInfo) {
    return {
        type: INIT_CHANNEL_COUPONSET_INFO,
        couponsetInfo
    }
};

// 初始化是否拉黑
export function initIsBlack(isBlack) {
    return {
        type: IS_CHANNEL_BLACK,
        isBlack
    };
};

// 初始化系列课购买信息
export function initChargeStatus(chargeStatus) {
    return {
        type: CHANNEL_CHARGE_STATUS,
        chargeStatus,
    };
};

// 是否关注千聊公众号
export function initIsSubscribe(isSubscribe) {
    return {
        type: IS_CHANNEL_SUBSCRIBE,
        isSubscribe,
    };
};

// 是否关注三方的公众号
export function initIsFocusThree(isFocusThree) {
    return {
        type: IS_CHANNEL_FOLLOWTHIRD,
        isFocusThree,
    };
};


// 系列课直播间是否绑定三方
export function initIsBindThird(isBindThird) {
    return {
        type: IS_CHANNEL_BINDTHIRD,
        isBindThird,
    };
};

// 是否白名单
export function initIsShowQl(isShowQl) {
    return {
        type: IS_CHANNEL_SHOWQL,
        isShowQl,
    };
};

export function initShareCutCourseInfo (courseCutInfo) {
	return {
		type: INIT_CUT_COURSE_INFO,
		courseCutInfo
	}
};

/* 获取课程是否参与了砍价活动 */
export function getShareCutCourseInfo(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/coral/getShareCutCourseInfo',
			body: params
        });
		dispatch(initShareCutCourseInfo(get(result,'data.info',{})));

		return result;
	};
}

// 显示或隐藏话题
export function onChangeTopicHidden (topicId, displayStatus) {
    return {
        type: CHANGE_TOPIC_DISPLAY,
        topicId,
        displayStatus,
    }
}

// （直播间）角色权限
export function initLiveRole(liveRole) {
    return {
        type: CHANNEL_LIVE_ROLE,
        liveRole,
    };
};

// 初始化权限
export function initPower(power) {
    return {
        type: CHANNEL_INIT_POWER,
        power,
    };
};

// 系列课付费配置
export function initChargeConfigs(chargeConfigs) {
    return {
        type: CHANNEL_CHARGE_CONFIGS,
        chargeConfigs,
    };
};

// vip信息
export function initVipInfo(vipInfo) {
    return {
        type: CHANNEL_VIP_INFO,
        vipInfo,
    };
};

// 是否关注直播间
export function initIsLiveFocus(isLiveFocus) {
    return {
        type: CHANNEL_IS_LIVE_FOCUS,
        isLiveFocus,
    };
};

// 系列课简介
export function initDesc(desc) {
    return {
        type: CHANNEL_DESC,
        desc,
    };
};

// 系列课使用优惠码状态
export function initChannelSatus(channelSatus) {
    return {
        type: CHANNEL_INIT_CHANNEL_SATUS,
        channelSatus,
    };
};

// 系列课直播间分销商shareky
export function initLshareKey(lshareKey) {
    return {
        type: CHANNEL_LIVE_SHARE_KEY,
        lshareKey,
    };
};

// 系列课分销商shareky
export function initCshareKey(cshareKey) {
    return {
        type: CHANNEL_SHARE_KEY,
        cshareKey,
    };
};
// 分销课代表信息（统一）
export function initMyShareQualify (myShareQualify){
    return {
        type: MY_SHARE_QUALIFY,
        myShareQualify,
    };
}

// 获取千聊直通车lsharekey
export function initQlshareKey(qlshareKey) {
	return {
		type: CHANNEL_QL_SHARE_KEY,
		qlshareKey,
	};
}

// 获取官方课代表分成比例
export function initCoralIdentity(data) {
	return {
		type: CHANNEL_CORAL_IDENTITY,
		percent: data.sharePercent,
        isPersonCourse: data.isPersonCourse,
	};
}

// 系列课直播间开启自动分销
export function initIsAutoShare(isOpenShare) {
    return {
        type: OPEN_AUTO_SHARE,
        isOpenShare,
    };
};

// 系列课拼课中列表
export function initGroupingList(groupinglist) {
    return {
        type: CHANNEL_GROUPING_LIST,
        groupingList:groupinglist,
    };
};

export function initIsHasGroup(groupInfoSelf){
    return {
        type: CHANNEL_GROUP_INFO_SELF,
        groupInfoSelf
    };
}


//系列课拼课单个团的信息
export function initGroupInfo(groupInfo) {
    return {
        type: CHANNEL_GROUP_INFO,
        groupInfo
    };
};



// 更新付费用户信息
export function fetchPayUser(channelId, liveId, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/pay-user',
            body: {
                channelId,
                liveId,
            }
        });

        dispatch({
            type: INIT_CHANNEL_PAY_USER_COUNT,
            payUserCount: result.data && result.data.payUserCount || 0,
        });
        dispatch({
            type: INIT_CHANNEL_PAY_USER_IMAGES,
            payUserHeadImages: result.data && result.data.payUserHeadImages || [],
        });

        return result.data;
    }
};


// 设置课程列表分页页码
export function setCoursePageNum (coursePageNum) {
    return {
        type: SET_CHANNEL_COURSE_PAGE_NUM,
        coursePageNum
    }
};


/**
 * 更新课程列表的课程数据
 * @param  {[type]} courseData [description]
 * @return {[type]}            [description]
 */
export function updateCourseData(id, courseData) {
    return {
        type: CHANNEL_UPDATE_COURSE_DATA,
        id,
        courseData,
    };
};


// 移出课程
export function removeCourse(id) {
    return {
        type: CHANNEL_REMOVE_COURSE,
        id
    }
}

// 关注取消关注
export function updateFollowChannel(liveId, isFocus, auditStatus='') {

    let status = isFocus ? 'N': 'Y';

    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/live-focus',
            body: {
                liveId,
                status,
                auditStatus,
            }
        });

        dispatch(initIsLiveFocus(!isFocus));

        return result.data;
    };
}

// 系列课推送
export function pushChannel(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/live/addPush',
            body: params
        });

        return result;
    };
}
// 系列课推送
export function getPushInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/channel/getPushInfo',
            body: params
        });

        return result;
    };
}

/**
 * 获取课程列表
 * @param  {[type]} channelId   [description]
 * @param  {[type]} page        [description]
 * @param  {[type]} size        [description]
 * @param  {[type]} showLoading [description]
 * @return {[type]}             [description]
 */
export function fetchCourseList(channelId, liveId, page, size, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/channel/topic-list',
            body: {
                channelId,
                liveId,
                clientType: 'weixin',
                pageNum: page,
                pageSize: size,
            }
        });
        dispatch({
            type: FETCH_CHANNEL_COURSE_LIST,
            courseList: result.data && result.data.topicList || []
        });
        dispatch(setCoursePageNum(page));
        return result.data && result.data.topicList || [];
    };
};

export function getCourseList(channelId, liveId, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/topic-list',
            body: {
                channelId,
                liveId,
                clientType: 'weixin',
                pageNum: page,
                pageSize: size,
            }
        });
        return result.data && result.data.topicList || [];
    };
};

export function getCouponBoxCourseInfo(businessId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/getCouponBoxCourseInfo',
            body: {
                businessId,
            }
        });
        return result.data && result.data || {};
    };
};

export function getApplyRecord(businessId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/getApplyRecord',
            body: {
                businessId
            }
        });
        return result.data && result.data || {};
    };
};

// 更新免费试听状态
export function switchFree(topicId, status, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/channel/switch-free',
            body: {
                topicId,
                status,
            }
        });

        return result;
    };
};

// 移出系列课话题
export function fetchRemoveCourse(topicId,money, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/channel/remove-topic',
            body: {
                topicId,money,
            }
        });

        if (result && result.state && result.state.code === 0) {
            window.toast(result.state.msg);
            dispatch(removeCourse(topicId));
        }

        return result;
    };
};

// 删除系列课话题
export function fetchDeleteCourse(topicId, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/channel/delete-topic',
            body: {
                topicId,
            }
        });

        if (result && result.state && result.state.code === 0) {
            window.toast(result.state.msg);
            dispatch(removeCourse(topicId));
        }

        return result;
    };
};

export function fetchEndCourse(topicId, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/channel/end-topic',
            body: {
                topicId,
            }
        });

        if (result && result.state && result.state.code === 0) {
            window.toast(result.state.msg);
            dispatch(updateCourseData(topicId, {
                status: 'ended'
            }));
        }

        return result;
    };
};

export function fetchSingleBuy(topicId, money, status, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/channel/single-buy',
            body: {
                topicId,
                money,
                status
            }
        });

        return result;
    };
}
export function fetchFreeBuy(chargeConfigId, sourceNo, channelId, couponId, couponType) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/free-buy',
            body: {
                chargeConfigId,
                sourceNo,
                channelId,
                couponId,
                couponType,
            }
        });

        return result;
    };
}

/**
 * 根据订单ID获取赠礼ID
 *
 * @export
 * @param {any} orderId
 * @returns
 */
export function getGiftId (orderId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/getGiftId',
            body: {
                orderId
            }
        });
    }
}


// 获取系列课信息
export function getChannelInfo (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/channel/getChannelInfo',
            body: {
                channelId
            }
        });
         dispatch({
             type: SET_CHANNEL_INFO,
             channelInfo: result.data.channel,
             channelCharge: result.data.chargeConfigs,
        });

        return result;
    }
};


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

export function getChannelGroupSelf(channelId) {
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

        return result;
    };
}

export function getChannelGroupingList(channelId) {
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
            type: CHANNEL_GROUPING_LIST,
            groupingList:result,
        });

        return result;
    };
}

/**
 * 用作系列课访问统计接口 请求URL h5/channel/channelCount
 * @export
 * @param {Object} param
 *  @param {String} channelId
 *  @param {String} lshareKey  有则填
 *  @param {String} shareKey   有则填
 *  @param {String} sourceNo   渠道号
 * @returns
 */
export function channelCount(param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/channel/channelCount',
            body: param
        });

        return result;
    };
}

export function getChannelIdList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: "POST",
			showLoading:false,
			url: '/api/wechat/channel/getChannelIdList',
			body: params,
		});

		return result;
	};
}

/**
 * 绑定直播间分销关系
 * @return {[type]} [description]
 */
export function bindLiveShare(liveId, shareKey) {
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
            }
        });

        return result;
    }
}

/* 更新是否立即支付状态 */
export function updateOrderNowStatus(status){
    return {
        type: UPDATE_ORDER_NOW_STATUS,
        status,
    }
}

/**
 * 打印活动日志
 * @return {[type]} [description]
 */
export function callActivityLog(type, channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: '/api/wechat/activity/log/increase',
            body: {
                type,
                channelId,
            }
        });

        return result;
    }
}

export function getSimpleChannel (channelId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/getSimple',
            showLoading: false,
            body: {
                id: channelId,
            }
        })
    }
}

// 查询用户是否有对应业务优惠码
export function fetchCouponListAction (businessType, businessId, liveId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/myCouponList',
            body: {
                businessType,
                businessId,
                liveId
            }
        })
    }
}

export function activityCodeExist (businessId, promotionId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/activityCode/exists',
            body: {
                businessType: "channel",
                businessId,
                promotionId,
            }
        })
    }
}
export function activityCodeBind (businessId, promotionId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/activityCode/bind',
            body: {
                businessType: "channel",
                businessId,
                promotionId,
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

// 保存系列课购买须知
export function saveChannelPurcaseNote (channelId,purchaseNotes) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/channel/saveChannelPurcaseNote',
            body: {
                channelId,
                purchaseNotes,
            }
        })
    }
}


// 频道内即将开播的话题
export function newBeginTopic(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'GET',
            url: '/api/wechat/channel/newBeginTopic',
            body: params
        });

        return result;
    };
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