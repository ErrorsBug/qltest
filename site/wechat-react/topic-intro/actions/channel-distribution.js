
import { api } from './common';

export const APPEND_CHANNEL_DISTRIBUTION_SETINFO = 'APPEND_CHANNEL_DISTRIBUTION_SETINFO';
export const APPEND_CHANNEL_DISTRIBUTION_INDEX_LIST = 'APPEND_CHANNEL_DISTRIBUTION_INDEX_LIST';
export const APPEND_CHANNEL_DISTRIBUTION_LIST = 'APPEND_CHANNEL_DISTRIBUTION_LIST';
export const CHANGE_REPRESENT_STATUS = 'CHANGE_REPRESENT_STATUS';
export const DISTRIBUTION_INFO = 'DISTRIBUTION_INFO';
export const USERINFO = 'USERINFO';
export const APPEND_CHANNEL_DISTRIBUTION_SYSINFO = 'APPEND_CHANNEL_DISTRIBUTION_SYSINFO';


//保存系列课自动分销设置信息
export function saveChannelAutoDistributionSet(isOpenShare,autoSharePercent,channelId){
    return async(dispatch,getStore)=>{
         const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channelshare/auto-distribution-set',
            body: {
                isOpenShare,autoSharePercent,channelId
            },
            method:"POST",
        });

        return result;

    }

};

//修改系列课自动分销设置信息
export function changeChannelAutoDistributionSet(isActive,percent){
    return async(dispatch, getStore) => {
        var result={
            data:{
            "autoSharePercent": percent,
            "isOpenShare": isActive
            }
        }
        dispatch({
            type: APPEND_CHANNEL_DISTRIBUTION_SETINFO,
            distributionInfo: result || [],
        });


    }
};



// 获取系列课自动分销设置信息
export function channelAutoDistributionInfo (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channelshare/auto-distribution-info',
            body: {
                channelId
            }
        });

        dispatch({
            type: APPEND_CHANNEL_DISTRIBUTION_SETINFO,
            distributionInfo: result || [],
        });


        return result
    }

};
// 获取系列课自动分销设置信息
export function channelAutoShareQualify (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/getChannelAutoQualify',
            body: {
                channelId
            }
        });

        return result
    }

};
// 获取系列课的单课收益
export function channelProfit(channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/channel/relayChannelProfit',
            body: {
                relayChannelId: channelId
            }
        });

        if (result.state.code !== 0) {
            window.toast(result.state.msg);
        }

        return result;
    }
}
//添加课代表
export function saveAddDistributionUser(shareEarningPercent,shareNum,channelId) {
    return async(dispatch,getStore)=>{
         const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channelshare/distribution-user-add',
            body: {
                shareEarningPercent,shareNum,channelId
            },
            method:"POST",
        });

        return result;

    }
}
//获取系列课分销列表
export function channelDistributionIndexList (liveId, pageNum, pageSize) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:pageNum == 1,
            url: '/api/wechat/channel/channelDistributionIndexList',
            body: {
                liveId,
                pageNum,
                pageSize,
            }
        });

        dispatch({
            type: APPEND_CHANNEL_DISTRIBUTION_INDEX_LIST,
            distributionIndexList: result.data.list || [],
        });

        return result;
    }
};

//获取系列课课代表分销列表
export function getChannelDistributionList (channelId, joinType, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method:"POST",
            showLoading:page.page == 1,
            url: '/api/wechat/channel/channelDistributionList',
            body: {
                
                channelId,
                joinType,
                page,
                
            }
        });
        dispatch({
            type: APPEND_CHANNEL_DISTRIBUTION_LIST,
            distributionList: result.data.list || [],
        });

        return result;
    }
};

//修改课代表推广状态
export function changeChannelRepresentStatus (id, status) {
    return async (dispatch, getStore) => {
        await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/changeChannelRepresentStatus',
            body: {
                id,
                status,
            }
        });
        dispatch({
            type: CHANGE_REPRESENT_STATUS,
            representStatus: status,
        });
    }
};


//获取系列课课代表分销分成
export function getChannelSharePercent (shareKey,lShareKey) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/getQualifyPercent',
            body: {
                shareKey,lShareKey
            }
        });

        return result.data.percent;
    }
};

//获取系列课课代表分销资格
export function getChannelShareQualify (channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/getChannelQualify',
            body: {
                channelId
            }
        });

        return result;
    }
};



//获取系列课课代表分销邀请详情明细列表
export function getChannelDistributionDetail (channelId,shareId,page,size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/channel-distribution-detail',
            body: { 
                channelId,
                shareId,
                page,
                size
            }
        });

        return result;
    }
};
export function initDistribution(distributionInfo) {
    return {
        type: DISTRIBUTION_INFO,
        distributionInfo
    };
};
export function initUserInfo(userInfo) {
    return {
        type: USERINFO,
        userInfo
    };
};
