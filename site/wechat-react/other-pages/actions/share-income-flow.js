
import { api } from './common';

export const APPEND_SHARE_INCOMEFLOW = 'APPEND_SHARE_INCOMEFLOW';
export const INIT_SHARE_DETAIL = 'INIT_SHARE_DETAIL';
export const APPEND_SHARE_DETAIL = 'APPEND_SHARE_DETAIL';
export const APPEND_INCOME_SHARE_LIST_TOPIC = 'APPEND_INCOME_SHARE_LIST_TOPIC';
export const APPEND_INCOME_SHARE_LIST_CHANNEL = 'APPEND_INCOME_SHARE_LIST_CHANNEL';
export const APPEND_INCOME_SHARE_LIST_VIP = 'APPEND_INCOME_SHARE_LIST_VIP';
export const APPEND_INCOME_SHARE_DETAIL_TOPIC = 'APPEND_INCOME_SHARE_DETAIL_TOPIC';
export const APPEND_INCOME_SHARE_DETAIL_TOPIC_INFO='APPEND_INCOME_SHARE_DETAIL_TOPIC_INFO';
export const APPEND_INCOME_SHARE_DETAIL_VIP = 'APPEND_INCOME_SHARE_DETAIL_VIP';
export const APPEND_INCOME_SHARE_DETAIL_VIP_INFO = 'APPEND_INCOME_SHARE_DETAIL_VIP_INFO';
export const APPEND_INCOME_SHARE_DETAIL_CHANNEL = 'APPEND_INCOME_SHARE_DETAIL_CHANNEL';
export const APPEND_INCOME_SHARE_DETAIL_CHANNEL_INFO = 'APPEND_INCOME_SHARE_DETAIL_CHANNEL_INFO';



// 获取我的分销收益流水列表
export function getShareFlowList (pageNum,pageSize) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-flow',
            body: {
                pageNum,pageSize
            }
        });

        // const result={
        //          "list": [
        //             {
        //                 "createTime": "测试内容ha63",
        //                 "liveName": "测试内容38yr",
        //                 "shareEarning": 60218,
        //                 "shareEarningPercent": 13017,
        //                 "shareType": "测试内容6sv1",
        //                 "tittle": "测试内容2835",
        //                 "type": "测试内容2o20"
        //             },
        //             {
        //                 "createTime": "测试内容ha63",
        //                 "liveName": "测试内容38yr",
        //                 "shareEarning": 60218,
        //                 "shareEarningPercent": 13017,
        //                 "shareType": "测试内容6sv1",
        //                 "tittle": "测试内容2835",
        //                 "type": "测试内容2o20"
        //             }
        //         ]
        // };

        dispatch({
            type: APPEND_SHARE_INCOMEFLOW,
            shareFlowList: result&&result.data && result.data.list || []
        });

        return result
    }
};

// 获取我的分销收益流水列表share-income-list-topic
export function getShareIncomeListTopic (pageNum,pageSize) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-list-topic',
            body: {
                pageNum,pageSize
            }
        });

        // const result={
        //     "list": [
        //         {
        //             "income": "34",
        //             "liveName": "测试内容o3x3",
        //             "topicName": "测试内容74fs",
        //             "topicStartTime": "测试内容rt98",
        //             "topicStatus": "delete"
        //         },
        //         {
        //             "income": "324",
        //             "liveName": "测试内容o3x3",
        //             "topicName": "测试内容74fs",
        //             "topicStartTime": "测试内容rt98",
        //             "topicStatus": "over"
        //         },
        //         {
        //             "income": "333",
        //             "liveName": "测试内容o3x3",
        //             "topicName": "测试内容74fs",
        //             "topicStartTime": "测试内容rt98",
        //             "topicStatus": "over"
        //         }
        //     ]
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_LIST_TOPIC,
            shareIncomeListTopic: result&&result.data && result.data.list || []
        });

        return result
    }
};
export function getShareIncomeListChannel (pageNum,pageSize) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-list-channel',
            body: {
                pageNum,pageSize
            }
        });

        // const result={
        //      "list": [
        //             {
        //                 "channelName": "测试内容1yn0",
        //                 "channelType": "1",
        //                 "income": "34234",
        //                 "liveName": "测试内容143g"
        //             },
        //             {
        //                 "channelName": "测试内容33333",
        //                 "channelType": "4",
        //                 "income": "34234",
        //                 "liveName": "测试内容143g"
        //             },
        //             {
        //                 "channelName": "测试内容34343",
        //                 "channelType": "2",
        //                 "income": "34234",
        //                 "liveName": "测试内容143g"
        //             },
        //             {
        //                 "channelName": "测试内容765765",
        //                 "channelType": "7",
        //                 "income": "34234",
        //                 "liveName": "测试内容143g"
        //             }
        //         ]
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_LIST_CHANNEL,
            shareIncomeListChannel: result&&result.data && result.data.list || []
        });

        return result
    }
};

export function getShareIncomeListVip (pageNum,pageSize) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-list-vip',
            body: {
                pageNum,pageSize
            }
        });

        // const result={
        //      "list": [
        //             {
        //                 "income": 1,
        //                 "liveName": 1,
        //                 "shareCount": 1
        //             },
        //             {
        //                 "income": 1,
        //                 "liveName": 5,
        //                 "shareCount": 1
        //             },
        //             {
        //                 "income": 1,
        //                 "liveName": 4,
        //                 "shareCount": 1
        //             }
        //         ]
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_LIST_VIP,
            shareIncomeListVip: result&&result.data && result.data.list || []
        });

        return result
    }
};

export function getShareIncomeDetailTopic (pageNum,pageSize,topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-details-topic',
            body: {
                pageNum,pageSize,topicId
            }
        });
        
        // const result={
        //     "shareEanring": [
        //         {
        //             "beInviterName": "测试内容85c8",
        //             "liveName": "测试内容xd9x",
        //             "payAmount": "测试内容tqb4",
        //             "shareEarningPercent": 25553,
        //             "shareType": "测试内容r2n0",
        //             "time": "测试内容44vj",
        //             "topicName": "测试内容r241"
        //         }
        //     ]
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_DETAIL_TOPIC,
            shareEanring: result.data && result.data.shareEanring || []
        });

        return result
    }
};
export function getShareIncomeDetailTopicInit (topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/my/share-income-detail-topic',
            body: {
               topicId
            }
        });
        
        // const result={
        //     data:{
        //         "topicId": "测试内容f26r",
        //         "topicName": "测试内容qld8",
        //         "totalEarning": "测试内容bni2"
        //     }
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_DETAIL_TOPIC_INFO,
            shareEanringInfo: result && result.data || []
        });

        return result
    }
};

export function getShareIncomeDetailChannel (pageNum,pageSize,channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-details-channel',
            body: {
                pageNum,pageSize,channelId
            }
        });

        // const result={
        //     "shareEanring": [
        //         {
        //             "beInviterName": "测试内容ywy5",
        //             "payAmount": "测试内容009f",
        //             "shareEarningPercent": "测试内容96h6",
        //             "shareType": "测试内容fo37",
        //             "time": "测试内容16uc"
        //         }
        //     ]
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_DETAIL_CHANNEL,
            shareEanring: result.data && result.data.shareEanring || []
        });

        return result
    }
};
export function getShareIncomeDetailChannelInit (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/my/share-income-detail-channel',
            body: {
                channelId
            }
        });

        // const result={
        //     data:{
        //         "channelId": "测试内容185r",
        //         "channelName": "测试内容3s53",
        //         "totalEarning": "测试内容pr66"
        //     }
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_DETAIL_CHANNEL_INFO,
            shareEanringInfo: result && result.data || []
        });

        return result
    }
};

export function getShareIncomeDetailVip (pageNum,pageSize,liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum==1,
            url: '/api/wechat/my/share-income-details-vip',
            body: {
                pageNum,pageSize,liveId
            }
        });

        // const result={
        //      "shareEanring": [
        //             {
        //                 "beInviterName": "测试内容qj4d",
        //                 "payAmount": "测试内容lem5",
        //                 "shareEarningPercent": 17162,
        //                 "shareType": "测试内容38s2",
        //                 "time": "测试内容75rv"
        //             }
        //         ]
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_DETAIL_VIP,
            shareEanring: result.data && result.data.shareEanring || []
        });

        return result
    }
};
export function getShareIncomeDetailVipInit (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/my/share-income-detail-vip',
            body: {
                liveId
            }
        });

        // const result={
        //     data:{
        //         "channelId": "测试内容185r",
        //         "channelName": "测试内容3s53",
        //         "totalEarning": "测试内容pr66"
        //     }
        // };

        dispatch({
            type: APPEND_INCOME_SHARE_DETAIL_VIP_INFO,
             shareEanringInfo: result && result.data || []
        });

        return result
    }
};