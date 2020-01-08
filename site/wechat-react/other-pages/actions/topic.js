import { api } from './common';

// export const SET_TOPIC_INFO = 'SET_TOPIC_INFO';
export const INIT_TOPIC_INFO = 'INIT_TOPIC_INFO';
export const APPEND_TOPIC_DISTRIBUTION_LIST = 'APPEND_TOPIC_DISTRIBUTION_LIST';


export function getTopicInfo(topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getInfo',
            method: 'GET',
            showLoading: true,
            body: {
                topicId
            }
        });

        dispatch({
            type: INIT_TOPIC_INFO,
            topicInfo: result.data && result.data.topicPo || {},
        });

        return result;
    };
};




//服务端渲染action
// 初始化话题信息
export function initTopicInfo (topicInfo) {
    return {
        type: INIT_TOPIC_INFO,
        topicInfo
    }
};


/**
 * 获取授权状态
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
};


export function getSimpleTopic (topicId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getSimple',
            showLoading: false,
            body: {
                id: topicId,
            }
        })
    }
}


//获取话题课代表分销列表
export function getTopicDistributionList (topicId, joinType, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: page.page == 1,
            url: '/api/wechat/topic/topicDistributionList',
            body: {
                topicId,
                joinType,
                page, 
            }
        });
        dispatch({
            type: APPEND_TOPIC_DISTRIBUTION_LIST,
            distributionList: result.data.list || [],
        });

        return result;
    }
};

//获取话题自动分销信息
export function getTopicAutoShare(topicId) {
	return async (dispatch, getStore) => {
		const result = await api({
			method: 'GET',
			url: '/api/wechat/topic/getTopicAutoShare',
			body: {
                topicId
            }
		});

		return result;
	}
}

//添加课代表
export function saveAddDistributionTopic(shareEarningPercent, shareNum, businessId, isShareFree = 'N') {
    return async(dispatch, getStore) => {
         const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/share/distribution/add',
            body: {
                shareEarningPercent,
                shareNum,
                type: 'topic',
                businessId,
                isShareFree
            },
            method: "POST",
        });

        return result;
    }
}
