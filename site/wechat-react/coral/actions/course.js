import { api } from './common';
import { get } from 'lodash';
import { getVal } from 'components/util';
export function getTopicSimple (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
			getStore,
            url: `/api/wechat/topic/getInfo`,
            method: 'GET',
            body: {
                topicId
            }
        });
        const resultData = {
            topicInfo: { ...getVal(result, 'data.topicPo', {}), ...getVal(result, 'data.topicExtendPo', {}) }
        }
        return resultData;

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

        return result;
    }
};


// 更新付费用户信息
export function fetchPayUser({channelId, liveId}) {
	return async (dispatch, getStore) => {
		const result = await api({
            dispatch,
            getStore,
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