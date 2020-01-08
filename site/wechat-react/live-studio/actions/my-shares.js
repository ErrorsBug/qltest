
import { api } from './common';

export const APPEND_MY_SHARE_LIVE = 'APPEND_MY_SHARE_LIVE';
export const APPEND_MY_SHARE_TOPIC = 'APPEND_MY_SHARE_TOPIC';
export const APPEND_MY_SHARE_CHANNEL='APPEND_MY_SHARE_CHANNEL';

// 获取我的分销推广列表
export function getMyshare (type, page, size, liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:false,
            url: '/api/wechat/studio/my-share',
            body: {
                type, page, size, liveId,
            }
        });

        if(type == 'live'){
            dispatch({
                type: APPEND_MY_SHARE_LIVE,
                myShareList: result.data && result.data.dataList || []
            });
        } else if (type == 'channel') {
            dispatch({
                type: APPEND_MY_SHARE_CHANNEL,
                myShareList: result.data && result.data.dataList || []
            });
        } else if (type == 'topic') {
            dispatch({
                type: APPEND_MY_SHARE_TOPIC,
                myShareList: result.data && result.data.dataList || []
            });
        }

        return result
    }
};
