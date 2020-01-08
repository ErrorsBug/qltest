
import { api } from './common';

export const SHARE_CARDINFO_VIP = 'SHARE_CARDINFO_VIP';
export const SHARE_CARDINFO_CHANNEL = 'SHARE_CARDINFO_CHANNEL';



// 获取我的分销推广列表
export function getCardInfoVip (shareKey,liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/my/share-card-vip',
            body: {
                shareKey,liveId
            }
        });

        // const result={
        //     data:{
        //         percent:'10',
        //         qrurl:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQH08DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyQXAxU1pBamhhT1QxV19uRmhvMVUAAgS/CsJYAwQAjScA',
        //         money:20
        //     }
        // };

        dispatch({
            type: SHARE_CARDINFO_VIP,
            cardInfo: result && result.data || []
        });

        return result
    }
};

export function changeCardVip(shareKey,liveId,styleId,type){
    return async (dispatch, getStore) => {
    const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/my/get-share-card',
            body: {
                shareKey,liveId,styleId,type
            }
        });
        return result
    }
}

export function getLiveInfo(liveId){
    return async (dispatch, getStore) => {
    const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/Info',
            body: {
                liveId
            }
        });
        return result.data
    }
}

// 获取我的分销推广列表
export function getCardInfoChannel (shareKey,channelId) {
    return async (dispatch, getStore) => {
        // const result = await api({
        //     dispatch,
        //     getStore,
        //     url: '/api/wechat/my/share-card-channel',
        //     body: {
        //         shareKey,channelId
        //     }
        // });

        const result={
            data:{
                percent:'10',
                qrurl:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQH08DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyQXAxU1pBamhhT1QxV19uRmhvMVUAAgS/CsJYAwQAjScA',
                money:20
            }
        };

        dispatch({
            type: SHARE_CARDINFO_CHANNEL,
            cardInfo: result && result.data || []
        });

        return result
    }
};

export function shareCardChannel(shareKey,lShareKey,channelId,styleId,type){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/my/get-channel-share-card',
            body: {
                shareKey,lShareKey,channelId,styleId,type
            }
        });
        return result
    }
}