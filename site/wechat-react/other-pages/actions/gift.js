import { api } from './common';

/*赠礼页面的API调用*/

//获取赠礼详情type默认为channel
//http://showdoc.corp.qlchat.com/index.php?s=/1&page_id=108
export function getGiftDetail ({giftId, giftRecordId, type = 'topic'}) {

    return async (dispatch, getStore) => {
        return await api({
            dispatch,
            getStore,
            url: '/api/wechat/giftDetail',
            method: 'POST',
            body: {
                giftId: giftId,
                giftRecordId: giftRecordId,
                type: type
            }
        })
    }
} 

//赠礼领取详情 
//http://showdoc.corp.qlchat.com/index.php?s=/1&page_id=109
export function getGiftAcceptList ({giftId, giftRecordId, type = 'topic'}) {
    
    return async (dispatch, getStore) => {
        return await api({
            dispatch,
            getStore,
            url: '/api/wechat/giftAcceptList',
            method: 'POST',
            body: {
                giftId: giftId,
                type: type
            }
        })
    }
}


//领取赠礼接口
export function getMoreGift (giftId, type) {
    return async (dispatch, getStore) => {
        return await api({
            dispatch,
            getStore,
            url: '/api/wechat/getMoreGift',
            method: 'POST',
            body: {
                giftId,
                type
            }
        })
    }
}

//领取单发赠礼接口
export function getOneGift (giftRecordId, type) {
    return async (dispatch, getStore) => {
        return await api({
            dispatch,
            getStore,
            url: '/api/wechat/getOneGift',
            method: 'POST',
            body: {
                giftRecordId,
                type
            }
        })
    }
}