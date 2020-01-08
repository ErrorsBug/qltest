import { api } from './common';
import { messagelistDeDuplicate} from '../../thousand-live/actions/thousand-live-common';


export const INIT_THOUSAND_LIVE_TOPIC_INFO = 'INIT_THOUSAND_LIVE_TOPIC_INFO';
export const INIT_PAGE_DATA = 'INIT_PAGE_DATA';
export const INIT_CHANNEL_INFO = 'INIT_CHANNEL_INFO';
export const INIT_CHANNEL_STATUS = 'INIT_CHANNEL_STATUS';
export const APPEND_DISCUSS = 'APPEND_DISCUSS';
export const SET_DISCUSS_LIST = 'SET_DISCUSS_LIST';
export const DELETE_DISCUSS = 'DELETE_DISCUSS';
export const THOUSAND_LIVE_SET_LSHARE_KEY = 'THOUSAND_LIVE_SET_LSHARE_KEY';
export const INIT_PUSH_COMPLITE = 'INIT_PUSH_COMPLITE';
export const CHANNEL_QL_SHARE_KEY = 'CHANNEL_QL_SHARE_KEY';
export const CHANNEL_CORAL_IDENTITY = 'CHANNEL_CORAL_IDENTITY';
export const THOUSAND_LIVE_LIVE_ROLE = 'THOUSAND_LIVE_LIVE_ROLE';
export const SET_DEL_DISCUSS_LIST = 'SET_DEL_DISCUSS_LIST';
export const CLIENT_B_LISTEN = 'CLIENT_B_LISTEN';
export const GET_SHARE_COMMENT_CONFIG = 'GET_SHARE_COMMENT_CONFIG';



export const  initClientBRelay = data => ({
    type: CLIENT_B_LISTEN,
    clientBListen: data
})

export function initPageData (pageData) {
    return {
        type: INIT_PAGE_DATA,
        pageData
    }
}

/**
 * 设置用户分销关系
 */
export function setLshareKey(lshareKey) {
    return {
        type: THOUSAND_LIVE_SET_LSHARE_KEY,
        lshareKey,
    };
}

// 获取千聊直通车lsharekey
export function initQlshareKey(qlshareKey) {
	return {
		type: CHANNEL_QL_SHARE_KEY,
		qlshareKey,
	};
}

// 获取官方课代表分成比例
export function initCoralIdentity(data) {
	return {
		type: CHANNEL_CORAL_IDENTITY,
		percent: data.sharePercent,
        isPersonCourse: data.isPersonCourse,
	};
}

// （直播间）角色权限
export function initLiveRole(liveRole) {
	return {
		type: THOUSAND_LIVE_LIVE_ROLE,
		liveRole,
	};
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

export function getTopicInfo(topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getInfo',
            method: 'GET',
            showLoading: false,
            body: {
                topicId
            }
        });

        dispatch && dispatch({
            type: INIT_THOUSAND_LIVE_TOPIC_INFO,
            topicInfo: result.data && result.data.topicPo || {},
        });

        return result;
    };
};

export function initTopicInfo(topicInfo) {
    return {
        type: INIT_THOUSAND_LIVE_TOPIC_INFO,
        topicInfo
    }
};

//成就卡推送状态
export function initPushComplite (pushCompliteInfo,getnowTopicVideoCount) {
    return {
        type: INIT_PUSH_COMPLITE,
        pushCompliteInfo,
        getnowTopicVideoCount
    }
}

// 初始化系列课信息
export function initChannelInfo (channelId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/getChannelInfo',
            method: 'GET',
            showLoading: false,
            body: {
                channelId
            }
        });


        dispatch({
            type: INIT_CHANNEL_INFO,
            channelInfo:result.data || {},
        });

        return result;
    };
};



/**
 * 系列课优惠券使用情况
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function getChannelStatus(channelId){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/channel-status', 
            body: { channelId},
            method: 'POST',
        });

        dispatch({
            type: INIT_CHANNEL_STATUS,
            channelStatus:result.data || {},
        });

        return result;
    }
}



/**
 * 系列课优惠券使用情况
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function getLastOrNextTopic(topicId){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/getLastOrNextTopic', 
            body: { topicId},
            method: 'POST',
        });


        return result;
    }
}




/**
 * 获取系列课列表
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function getChannelList(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getChannel', 
            body: params,
            method: 'POST',
        });


        return result;
    }
}




/**
 * 编辑话题信息
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function getTopicUpdate(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/update', 
            body:params,
            method: 'POST',
        });


        return result;
    }
}


/**
 * 编辑话题信息
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function changeAudioGraphicChannel(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/changeAudioGraphicChannel', 
            body:params,
            method: 'POST',
        });


        return result;
    }
}


/**
 * 添加新评论
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function addDiscuss(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/addDiscuss', 
            body:params,
            method: 'POST',
        });

        if (result.state.code === 0) {
            // if(params.parentId != 0){
            //     let discussList = getStore().thousandLive.discussList;
            //     let lastList = discussList.map((item)=>{
            //         if (item.id == params.parentId) {
            //             const replyList = item.replyList || [];
            //             item.replyList = [result.data.discuss, ...replyList];
            //         }
            //         return item;
            //     })
            //
            //     dispatch({
            //         type: SET_DISCUSS_LIST,
            //         discussList:lastList,
            //     });
            //
            // }else{
            //
                dispatch({
                    type: APPEND_DISCUSS,
                    discussItem:result.data.discuss || {},
                });
            // }
        } else {
            window.toast(result.state.msg);
        }

        
        return result;
    }
}


/**
 * 获取评论列表
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function getDiscussList(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/discussList', 
            body:params,
            method: 'POST',
        });

        let discussList = getStore().thousandLive.discussList || [];
        // 排重
        let lastList = await messagelistDeDuplicate(discussList, result.data && result.data.discussList||[]);

        if (result.state.code === 0) {
            dispatch({
                type: SET_DISCUSS_LIST,
                discussList:[...discussList,...lastList],
            });
        } else {
            window.toast(result.state.msg);
        }
        
        
        
        return result;
    }
}

export function getRelayDelSpeakIdList (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/getRelayDelSpeakIdList', 
            body:params,
            method: 'POST',
        })

        if (result.state.code === 0) {
            dispatch({
                type: SET_DEL_DISCUSS_LIST,
                delSpeakIdList: result.data.delSpeakIdList
            })
        } else {
            window.toast(result.state.msg);
        }
    }
}


/**
 * 删除评论列表
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function deleteDiscuss(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/deleteDiscuss', 
            body:params,
            method: 'POST',
        });

        if (result.state.code === 0) {
            if(params.parentId && params.parentId != 0){
                let discussList = getStore().thousandLive.discussList;
                let lastList = discussList.map((item)=>{
                    if(item.id == params.parentId){
                        item.replyList = item.replyList.filter(item => item.id != params.discussId)
                    }
                    return item;
                })
    
                dispatch({
                    type: SET_DISCUSS_LIST,
                    discussList:lastList,
                });
    
            }else{
                dispatch({
                    type: DELETE_DISCUSS,
                    id:params.discussId || {},
                });
            }
        } else {
            window.toast(result.state.msg);
        }
        
        return result;
    }
}


/**
 * 评论点赞
 * 
 * @export
 * @param {string} channelId 
 * @param {string} type 
 */
export function discussLike(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/discussLike', 
            body:params,
            method: 'POST',
        });

        if (result.state.code === 0) {
            let discussList = getStore().thousandLive.discussList;
            let lastList = discussList.map((item) => {
                if (item.id == params.discussId){
                    item.userLike = 'Y';
                    item.likeNum = result.data.liveDiscussDto.likeNum;
                    
                }
                return item;
            })

            dispatch({
                type: SET_DISCUSS_LIST,
                discussList:lastList,
            });
    
        } else {
            window.toast(result.state.msg);
        }

        return result;
    }
}

/**
 * 推送成就卡
 * @param {*} topicId
 * @param {*} userId
 */
export function pushAchievementCardToUser() {
    return (dispatch, getStore) => {
        const topicId = getStore().thousandLive.topicInfo.id;
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/pushAchievementCardToUser',
            method: 'POST',
            body: {
                topicId
            }
        });
    }
}

export function isLiveAdmin(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/studio/is-live-admin',
            body: {
                liveId,
            }
        });

        return result
    }

}

// 是否畅听直播间
export function getIsOrNotListen(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/isOrNotListen',
            body: {
                ...params
            }
        })
        return result;
    }
}

/**
 * 获取话题分享评论开关
 * @param {topicId: string} params 参数， 包含话题Id
 */
export function dispatchGetShareCommentConfig(params) {
    return async (dispatch, getStore) => {
        try {
            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                url: '/api/wechat/transfer/h5/courseExtend/getShareCommentConfig',
                body: params, 
                method: 'POST'
            });
            if(result.state.code === 0) {
                dispatch({type: GET_SHARE_COMMENT_CONFIG, flag: result.data && result.data.flag});
            } 
            return result && result.data;
        } catch (error) {
            console.log(error);
        }
    }
}

/**
 * 保存分享评论配置
 * topicId	是	string	话题id
 * liveId	是	string	直播间id
 * userId	是	string	用户id
 * closeLive	否	string	Y N 是否直播间全量关闭
 * flag
 */
export function dispatchSaveShareCommentConfig(params) {
    return async (dispatch, getStore) => {
        try {
            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                url: '/api/wechat/transfer/h5/courseExtend/saveShareCommentConfig',
                body: params, 
                method: 'POST'
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}