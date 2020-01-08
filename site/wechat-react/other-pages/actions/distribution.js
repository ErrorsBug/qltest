/**
 * Created by dylanssg on 2018/2/2.
 */
import { api } from './common';
export const INIT_LIVE_SHARE_QUALIFY = 'INIT_LIVE_SHARE_QUALIFY';
export const INIT_ADMIN_FLAG = 'INIT_ADMIN_FLAG';
// 课代表分销
export const DISTRIBUTION_INFO = 'DISTRIBUTION_INFO';
export const TOPIC_DISTRIBUTION_INFO = 'TOPIC_DISTRIBUTION_INFO';
export const CHANNEL_DISTRIBUTION_INFO = 'CHANNEL_DISTRIBUTION_INFO';
export const LIVE_DISTRIBUTION_INFO = 'LIVE_DISTRIBUTION_INFO';

//获取分销排行榜
export function getPromoRank (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/distribution/rank',
			body: params
		});

		return result;
	}
}

//获取分销排行榜
export function getNewPromoRank (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/distribution/newRank',
			body: params
		});

		return result;
	}
}

// 开启直播间分销 --- 旧接口
export function quickAudit (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/excellentCourse/quickAudit',
            body: {
                liveId,
            },
            method: 'POST',
		});
        return result 
    }
}

export function qlLiveShareQualify (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/distribution/qlLiveShareQualify',
            body: {
                liveId,
            },
            method: 'POST',
		});
		return result
    }
}

//获取直播间开启千聊推荐
export function qlPlatformShare (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/platformShare/getQualify',
            body: {
                liveId,
            },
            method: 'POST',
		});
		return result
    }
}
// 开启千聊推荐
export function addQualify (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/platformShare/addQualify',
            body: {
                liveId,
            },
            method: 'POST',
		});
        return result 
    }
}

// 关闭千聊推荐
export function closeQlRecommend (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/platformShare/closeQlRecommend',
            body: {
                liveId,
            },
            method: 'POST',
		});
        return result 
    }
}

export function fetchAdminFlag (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/distribution/adminFlag',
            body: {
                liveId,
            },
            method: 'POST',
		});
		
        return result
    }
}


export function initQlLiveShareQualify (data) {
    return {
        type: INIT_LIVE_SHARE_QUALIFY,
        data
    }
}

export function initAdminFlag (data) {
    return {
        type: INIT_ADMIN_FLAG,
        data
    }
}

// 珊瑚计划课程上架数量
export function coralOnSaleInfo (liveId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/coral/personCourseOnSaleInfo',
			body: {
				liveId,
			},
			method: 'POST',
		});

		return result
	}
}

// 知识通商城课程上架数量
export function knowledgeCourseInfo (liveId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/mediaMarket/knowledgeCourseInfo',
			body: {
				liveId,
			},
			method: 'POST',
		});

		return result
	}
}

// 获取千聊直通车分销信息
export function getQlShareQualify (liveId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/platformShare/getQualify',
			body: {
				liveId,
			},
			method: 'POST',
		});

		return result
	}
};

// 获取千聊直通车分销信息
export function getShareQualify (type, userId, params={}) {
	return async (dispatch, getStore) => {
        const businessType = liveId ? 'live' : 'topic'
        // 格式化参数
        const params = {
            userId: lo.get(req, 'rSession.user.userId'),
            liveId,
            topicId,
            // 判断接受分销资格是否为群发和业务类型
            ...shareId ? { shareId } : { businessId: liveId ? liveId: topicId, businessType },
        };

		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/platformShare/getQualify',
			body: {
                userId,
                ...params
			},
			method: 'POST',
		});

		return result
	}
};

// 初始化课代表分销信息
export function initDistribution(distributionInfo ,type = 'channel') {
    return {
        type: type === 'channel' ? CHANNEL_DISTRIBUTION_INFO : type === 'topic' ? TOPIC_DISTRIBUTION_INFO : LIVE_DISTRIBUTION_INFO,
        [`${type}DistributionInfo`]: distributionInfo
    };
};

//修改话题课代表状态
export function changeLiveTopicRepresentStatus (shareId, type) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/distribution/changeLiveTopicRepresentStatus',
            body: {
                shareId,
                type,
            }
        });
        
        return res;
    }
};

export function deleteTopicAuthShare(shareId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/distribute/removeShare',
            body: {
                type: 'topic',
                shareId
            },
        });

        return result;
    };
}

// 获取话题课代表分销邀请详情明细列表
export function getTopicDistributionDetail (topicId, shareId, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/topic-distribution-detail',
            body: { 
                topicId,
                shareId,
                page,
                size
            }
        });

        return result;
    }
};
