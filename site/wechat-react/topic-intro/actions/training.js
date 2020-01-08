import { api } from './common';
import { apiService } from "components/api-service";
export const INIT_TRAINING_DATA = 'INIT_TRAINING_DATA';
export const INIT_CAMP_PAGE_DATA = 'INIT_CAMP_PAGE_DATA';
export const INIT_CAMP_TOPIC_MAP = 'INIT_CAMP_TOPIC_MAP';
export const INIT_PERIOD_CAHNNEL = 'INIT_PERIOD_CAHNNEL';
export const INIT_CAMP_USER = 'INIT_CAMP_USER';
export const INIT_AFFAIR_MAP = 'INIT_AFFAIR_MAP';
export const INIT_USER_AFFAIR = 'INIT_USER_AFFAIR';
export const INIT_USER_REWORD = 'INIT_USER_REWORD';


/**
 * 初始训练营信息
 * 
 * @export
 * @param {{}} memberInfo 训练营
 * @returns action
 */
export function initTrainingData(data) {
    return {
        type: INIT_TRAINING_DATA,
        data
    }
}

/**
 * 初始训练营信息
 * 
 * @export
 * @param {{}} memberInfo 训练营
 * @returns action
 */
export function initCampPageData(campInfo) {
    return {
        type: INIT_CAMP_PAGE_DATA,
        campInfo
    }
}

/**
 * 获取当前任务集合
 * @param {*} topicMap 
 */
export function initCampTopicMap(topicMap) {
    return {
        type: INIT_CAMP_TOPIC_MAP,
        topicMap
    }
}

/**
 * 获取当前任务集合
 * @param {*} topicMap 
 */
export function initPeriodChannel(periodChannel) {
    return {
        type: INIT_PERIOD_CAHNNEL,
        periodChannel
    }
}

/**
 * 获取训练营报名用户信息
 * @param {*} topicMap 
 */
export function initCampUserInfo(campUserPo) {
    return {
        type: INIT_CAMP_USER,
        campUserPo
    }
}
/**
 * 用户打卡信息
 * @param {*} topicMap 
 */
export function initUserAffair({info, campPo}) {
    !info && (info = {})
    !campPo && (campPo = {})
    return {
        type: INIT_USER_AFFAIR,
        affairInfo: {...info, ...campPo}
    }
}

/**
 * 用户打卡信息Map
 * @param {*} topicMap 
 */
export function initAffairMap(affairMap) {
    return {
        type: INIT_AFFAIR_MAP,
        affairMap
    }
}

/**
 * 用户打卡信息Map
 * @param {*} topicMap 
 */
export function initUserReward(userReword) {
    return {
        type: INIT_USER_REWORD,
        userReword
    }
}

/**
 *
 * 根据训练营获取答案列表接口
 * @export
 * @param {*} campId
 * @returns
 */
export function fetchCampAnswerByCamp(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/answer/listByCamp',
            body: params
        });

        return result;
    }
}

/**
 *
 * 根据训练营获取答案总数
 * @export
 * @param {*} campId
 * @returns
 */
export function fetchAnswerCountByCamp(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/answer/countByCamp',
            body: params
        });

        if (result && result.state && result.state.code == 0) {
            return result.data.count || 0
        }
        return false
    }
}
/**
 * 获取训练营报名用户信息
 * @export
 * @param {*} channelId
 * @returns
 */
export async function getCampUserInfo(channelId) {
    return await api({
        showLoading: true,
        url: '/api/wechat/training/getUserInfo',
        body: {
            channelId
        },
        method: 'POST',
    });
}
/**
 * 根据channelId获取期数信息
 * @export
 * @param {*} campId
 * @returns
 */
export async function getPeriodByChannel(channelId) {
    return await api({
        showLoading: true,
        url: '/api/wechat/channel/currentPeriod',
        body: {
            channelId
        },
        method: 'POST',
    });
}
/**
 * 加入训练营期数
 * @export
 * @param {*} campId
 * @returns
 */
export async function newJoinPeriod(channelId) {
    return await api({
        showLoading: true,
        url: '/api/wechat/training/joinPeriod',
        body: {
            channelId
        },
        method: 'POST',
    });
}

/**
 *
 * 获取当前任务集合
 * @export
 * @param {*} campId
 * @returns
 */
export async function fetchTopicMap(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/training/topicMap',
            body: {
                channelId
            },
            method: 'POST',
        });
        return result;
    }
}

/**
 *
 * 话题列表
 * @export
 * @param {*} channelId
 * @returns
 */
export function fetchCampListTopic(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/channel/camp/listTopic',
            body: {
                channelId
            },
            method: 'POST',
        })

        if (result && result.state && result.state.code == 0) {
            return result.data
        }
        return false
    }
}

/**
 *
 * 获取vip信息
 * @export
 * @param {*} channelId
 * @returns
 */
export function getVipInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/vip/get',
            body: params,
            method: 'POST',
        })

        if (result && result.state && result.state.code == 0) {
            return result.data
        }

        return false
    }
}

/**
 *
 * 获取指定回答信息
 * @export
 * @param {*} channelId
 * @returns
 */
export function getAnswer(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/homework/getAnsweredList',
            body: params,
            method: 'POST',
        })

        if (result && result.state && result.state.code == 0) {
            return result.data
        }

        return false
    }
}

/**
 *
 * 获取训练营信息
 * @export
 * @param {*} id 训练营id
 * @returns
 */
export function getLoadCamp(id) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/camp/new/loadCamp',
            body: {
                id
            },
            method: 'POST',
        })

        if (result && result.state && result.state.code == 0) {
            return result.data
        }

        return false
    }
}

/**
 *
 * 获取特价信息
 * @export
 * @param {*} channelId 系列课id
 * @returns
 */
export function getMarketInfo(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/training/getMarket',
            body: {
                channelId
            },
            method: 'POST',
        })

        if (result && result.state && result.state.code == 0) {
            return result.data
        }

        return false
    }
}

/**
 *
 * 获取系列课信息
 * @export
 * @param {*} channelId 系列课id
 * @returns
 */
export function getChannelInfo(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/training/getChannelInfo',
            body: {
                channelId
            },
            method: 'POST',
        })

        if (result && result.state && result.state.code == 0) {
            return result.data
        }

        return false
    }
}

/**
 * 学院信息填写提交
 * @export
 * @param {*} campId
 * @returns
 */
export async function saveUserInfo(params) {
    return await api({
        showLoading: true,
        url: '/api/wechat/training/saveUserInfo',
        body: params,
        method: 'POST',
    });
}

/**
 * 批量保存学员信息
 * @export
 * @param {*} campId
 * @returns
 */
export async function saveUserInfos(params) {
    return await api({
        showLoading: true,
        url: '/api/wechat/transfer/h5/camp/new/batchSaveUserInfo',
        body: params,
        method: 'POST',
    });
}
/**
 * 提交学院公约
 * @export
 * @param {*} campId
 * @returns
 */
export async function contract(channelId) {
    return await api({
        showLoading: true,
        url: '/api/wechat/training/contract',
        body: {
            channelId
        },
        method: 'POST',
    });
}
/**
 * 批量签署公约
 * @export
 * @param {*} campId
 * @returns
 */
export async function contracts(channelIds) {
    return await api({
        showLoading: true,
        url: '/api/wechat/transfer/h5/camp/new/batchContract',
        body: {
            channelIds
        },
        method: 'POST',
    });
}

/**
 * 用户开启上课提醒
 * @export
 * @param {*} campId
 * @returns
 */
export async function setAlert() {
    return await api({
        showLoading: true,
        url: '/api/wechat/training/setAlert',
        body: {},
        method: 'POST',
    });
}
/**
 *
 * 根据训练营话题列表获取答案列表接口
 * @export
 * @param {*} topicLists
 * @returns
 */
export function fetchCampAnswerByTopicList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/answer/listsByTopic',
            body: params
        });
        return result;
    }
}
/**
 *
 * 用户打卡/补卡
 * @export
 * @param {*} params
 * @returns
 */
export async function fetchCampAffair(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/affair',
        body: params
    });
}
/**
 *
 * 用户当天打卡状态
 * @export
 * @param {*} params
 * @returns
 */
export async function fetchCampAffairStatus(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/getAffairStatus',
        body: params
    });
}
/**
 *
 * 用户打卡信息
 * @export
 * @param {*} params
 * @returns
 */
export async function achievementCardInfo(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/achievementCardInfo',
        body: params
    });
}

/**
 *
 * 用户打卡信息
 * @export
 * @param {*} params
 * @returns
 */
export function fetchAchievementCardInfo(params) {
    
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: true,
            url: '/api/wechat/training/achievementCardInfo',
            body: params
        });
        
        if (res.state.code == 0) {
            dispatch(initUserAffair(res.data || {}))
        }

        return res;
    };
}

/* 获取优惠码详情 */
export async function liveCouponDetail(params) {
    return await api({
        showLoading: true,
        method: 'GET',
        url: '/api/wechat/live/liveCouponDetail',
        body: params
    });
}

/* 话题学习记录 */
export async function studyTopic(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/studyTopic',
        body: params
    });
}

/* 话题学习记录 */
export async function listReward(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/listReward',
        body: params
    });
}

/* 根据topicId或者获取课程标题，评价人数，评价分数 */
export function getEvaluationData(params) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/training/getEvaluation',
            body: params
        });

        return res;
    };
}

/*获取评价列表*/
export function getEvaluationList(params) {
    return async (dispatch, getStore) => {
        const res = api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/training/evaluateLlist',
            body: params
        })

        return res
    }
}
/*获取完成作业数*/
export function getUserHomeworkCount(params) {
    return async (dispatch, getStore) => {
        const res = api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/training/getUserHomeworkCount',
            body: params
        })

        return res
    }
}

/* 直播间信息 */
export async function getLiveInfo(liveId) {
    const liveInfo = await api({
        method: 'GET',
        url: '/api/wechat/live/liveInfo',
        body: {liveId}
    });

    if (liveInfo.state.code == 0) {
        return liveInfo.data
    }

    return false
}

/**
 * 是否官方直播间
 * 
 * @export
 * @param {string} liveId
 */
export function getIsQlLive (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/isQlLive',
            body: {
                liveId
            },
            method: 'GET'
        })
        
        return result 
    }
}

/**
 * 获取训练营作业列表
 */
export function getCampPeriodHomework (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/training/campPeriodHomework',
            body: params,
            method: 'POST'
        })
        
        return result 
    }
}

/* 用户打卡奖励 */
export async function getUserReword(params) {
	const res = await api({
		method: 'POST',
		url: '/api/wechat/training/listReward',
		body: {...params}
	});

	if (res.state.code == 0) {
		return res.data || {dataList: []}
	}

	return {dataList: []}
}

/* 获取训练营入学通知书数据 */
export async function getSchoolCardData(params) {
	const res = await api({
		method: 'POST',
		url: '/api/wechat/training/schoolCardData',
		body: {...params}
	});

	if (res.state.code == 0) {
		return res.data || {}
	}

	return false
}


/* 获取训练营入学通知书 的 二维码 */
export async function getSchoolCardQrCode(params) {
	const res = await api({
		method: 'POST',
		url: '/api/wechat/training/schoolCardQrCode',
		body: {...params}
	});

	if (res.state.code == 0) {
		return res.data || {}
	}

	return false
}

export async function getLiveAdmin(liveId) {
	const result = await apiService.post({
		url: "/h5/live/admin/admin-flag",
		body: {
			liveId
		}
	});
	if (result.state.code == 0) {
		return result.data || {};
	} else {
		return "N";
	}
}

// 是否关注三方或千聊公众号，有liveId则是判断是否关注三方，没有就是判断是否关注千聊
export async function getIsSubscribe(liveId) {
	try {
		let result = await apiService.post({
			url: "/h5/user/isSubscribe",
			body: {
				liveId
			}
		});
		if (result.state.code == 0) {
			return result.data || {};
		} else {
			window.toast(result.state.msg);
			return false;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
};