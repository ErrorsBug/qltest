
import { api } from './common';

export const APPEND_CHANNEL_SORT_LIST = 'APPEND_CHANNEL_SORT_LIST';
export const APPEND_CHANNEL_SORT_LIST_PAGE = 'APPEND_CHANNEL_SORT_LIST_PAGE';
export const CHANGE_CHANNEL_SORT_WEIGHT = 'CHANGE_CHANNEL_SORT_WEIGHT';

export function saveChannelSort(liveId){
    return async(dispatch,getStore)=>{
        var dataArray=[];
        const channels=getStore().channelListSort.channelList.map((item)=>{
             return {id:item.id,weight:item.weight};
        });
         const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/doSetChannelSort',
            body: {
                liveId,
                channels:channels,
            },
            method:"POST",
        });
        return result;

    }

};

function ge(channelId,weight,getStore){
    var cList = getStore().channelListSort.channelList;

    var result=cList.map((channel)=>{
        if(channel.id == channelId){channel.weight=weight;}
        return channel;
    });
    return result;
}

export function changeChannelSort(channelId,weight){
    return async(dispatch, getStore) => {
        var result= await ge(channelId,weight,getStore);
        dispatch({
            type: CHANGE_CHANNEL_SORT_WEIGHT,
            channelList: result || [],
            weight:weight,
        });


    }
};



// 获取我的系列课排序列表
export function getChannelSort (clientType,liveId, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:page==1,
            url: '/api/wechat/channel/sortList',
            body: {
                clientType,liveId, page, size
            }
        });

        dispatch({
            type: APPEND_CHANNEL_SORT_LIST,
            channelList: result.data && result.data.channelList || []
        });
        dispatch({
            type: APPEND_CHANNEL_SORT_LIST_PAGE,
            channelPageNum: page+1
        });

        return result
    }

};
