
import { api } from './common';

export const APPEND_MY_SHARE_LIVE = 'APPEND_MY_SHARE_LIVE';
export const APPEND_MY_SHARE_TOPIC = 'APPEND_MY_SHARE_TOPIC';
export const APPEND_MY_SHARE_CHANNEL='APPEND_MY_SHARE_CHANNEL';




// 获取我的分销推广列表
export function getMyshare (type, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:page==1,
            url: '/api/wechat/my/my-share',
            body: {
                type, page, size
            }
        });

        if(type=="live"){
            dispatch({
                type: APPEND_MY_SHARE_LIVE,
                myShareList: result.data && result.data.myShareList || []
            });
        }else{
            dispatch({
                type: APPEND_MY_SHARE_TOPIC,
                myShareList: result.data && result.data.myShareList || []
            });
        }

        return result
    }
};

export function getMyshareChannel (type, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:page==1,
            url: '/api/wechat/my/my-share-channel',
            body: {
                type, page, size
            }
        });

        dispatch({
            type: APPEND_MY_SHARE_CHANNEL,
            myShareList: result.data && result.data.myShareList || []
        });

        return result
    }
};