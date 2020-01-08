import { api } from './common';
import dayjs from 'dayjs';
import { getVal,isFromLiveCenter } from '../../components/util';

export const INIT_THOUSAND_LIVE_TOPIC_INFO = 'INIT_THOUSAND_LIVE_TOPIC_INFO';
export const INIT_PAGE_DATA = 'INIT_PAGE_DATA';
export const ADD_FORUM_SPEAK = 'ADD_FORUM_SPEAK';
export const UPDATE_FORUM_SPEAK = 'UPDATE_FORUM_SPEAK';
export const APPEND_SPEAK = 'APPEND_SPEAK';
export const REVOKE_FORUM_SPEAK = 'REVOKE_FORUM_SPEAK';
export const SET_MUTE = 'SET_MUTE';
export const SET_REWORD_DISPLAY = 'SET_REWORD_DISPLAY';
export const APPEND_BANNED_TIP = 'APPEND_BANNED_TIP';
export const APPEND_REWARD_BULLET = 'APPEND_REWARD_BULLET';
export const REWARD_BULLET_SHIFT = 'REWARD_BULLET_SHIFT';
export const SHOW_REWARD_BULLET = 'SHOW_REWARD_BULLET';
export const SHOOT_REWARD_BULLET = 'SHOOT_REWARD_BULLET';
export const APPEND_FINISH_TOPIC_TIP = 'APPEND_FINISH_TOPIC_TIP';
export const FINISH_TOPIC = 'FINISH_TOPIC';
export const APPEND_REWARD_TIP = 'APPEND_REWARD_TIP';
export const FOLLOW_LIVE = 'FOLLOW_LIVE';
export const SET_CAN_ADD_SPEAK = 'SET_CAN_ADD_SPEAK';
export const UPDATE_BROWSE_NUM = 'UPDATE_BROWSE_NUM';
export const UPDATE_GUEST_LIST = 'UPDATE_GUEST_LIST';
export const INSERT_NEW_MSG = 'INSERT_NEW_MSG';
export const SET_LIKE_SET = 'SET_LIKE_SET';
export const THOUSAND_LIVE_SET_LSHARE_KEY = 'THOUSAND_LIVE_SET_LSHARE_KEY';
export const INIT_FOCUS_INFO = 'INIT_FOCUS_INFO';
export const CHANGE_TOPIC_TITLE = 'CHANGE_TOPIC_TITLE';
export const UPDATE_LIKE_NUMBER = 'UPDATE_LIKE_NUMBER';
export const UPDATE_REPLY_SPEAK = 'UPDATE_REPLY_SPEAK';
export const UPDATE_POWER = 'UPDATE_POWER';
export const SET_SPEAK_LIST = 'SET_SPEAK_LIST';
export const UPDATE_NO_MORE_SPEAK = 'UPDATE_NO_MORE_SPEAK';
export const ADD_COMMENT_NUM = 'ADD_COMMENT_NUM';
export const DECEREASE_COMMENT_NUM = 'DECEREASE_COMMENT_NUM';
export const INIT_PUSH_COMPLITE = 'INIT_PUSH_COMPLITE';
export const SET_CAN_POP_DOWNLOAD_BAR = 'SET_CAN_POP_DOWNLOAD_BAR';
export const TOGGLE_APP_DOWNLOAD_OPEN = 'TOGGLE_APP_DOWNLOAD_OPEN';
export const SET_TOPIC_PROFILE = 'SET_TOPIC_PROFILE';
export const ADD_DEL_SPEAK = 'ADD_DEL_SPEAK';
export const SET_CHANNEL_PROFILE = 'SET_CHANNEL_PROFILE';
export const UPDATE_CUR_TIME = 'UPDATE_CUR_TIME';
export const GET_SHARE_COMMENT_CONFIG =  'GET_SHARE_COMMENT_CONFIG';
export const GET_COURSE_CONFIG =  'GET_COURSE_CONFIG';
export const SAVE_SHARE_COMMENT_CONFIG = 'SAVE_SHARE_COMMENT_CONFIG';

//服务端渲染action
// 初始化话题信息
export function initTopicInfo (topicInfo) {
    return {
        type: INIT_THOUSAND_LIVE_TOPIC_INFO,
        topicInfo
    }
};

export function addForumSpeakList (totalSpeakList) {
    return {
        type: ADD_FORUM_SPEAK,
        totalSpeakList
    }
};

export function addDelSpeakIdList (delSpeakIdList) {
    return {
        type: ADD_DEL_SPEAK,
        delSpeakIdList
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
                type: ADD_DEL_SPEAK,
                delSpeakIdList: result.data.delSpeakIdList
            })
        }
    }
}


export function setCanPopDownloadBar (canPopDownloadBar) {
    return {
        type: SET_CAN_POP_DOWNLOAD_BAR,
        canPopDownloadBar
    }
}

export function toggleAppDownloadOpen (isOpened) {
    return async (dispatch, getStore) => {
        const topicId = getStore().thousandLive.topicInfo.id;

        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: true,
            url: '/api/wechat/topic/setAppDownloadOpen',
            body: {
                isOpened,
                topicId
            }
        });

        if (result.state.code == 0) {
            dispatch({
                type: TOGGLE_APP_DOWNLOAD_OPEN,
                isOpen: isOpened
            })
        }
    }
}

/**
 * 添加发言到发言列表
 *
 * @export
 * @param {[]} [speakPoList=[]] 发言列表
 * @returns
 */
export function appendSpeak(speakPoList = []) {
    return async (dispatch, getStore) => {
        let curSpeakList = getStore().thousandLive.forumSpeakList;
        let totalSpeakList = getStore().thousandLive.totalSpeakList;
        let canAddSpeak = getStore().thousandLive.canAddSpeak;
        let newCurSpeakList = speaklistTempAudioDeDuplicate(curSpeakList,speakPoList);
        let lastList = messagelistDeDuplicate(newCurSpeakList,speakPoList);
        let resultList = addTimestamp(lastList);
        // 判断时间是否显示
        if (resultList.length > 0) {
            const originList = getStore().thousandLive.forumSpeakList;
            for(let i=originList.length; i>0; i--) {
                if (originList[i-1].createTime) {
                    let originTime = originList[i-1].createTime;
                    let lastTime = resultList[0].createTime;

                    originTime = typeof originTime === 'object' ? originTime.time : originTime;
                    lastTime = typeof lastTime === 'object' ? lastTime.time : lastTime;

                    let diff = Math.abs(originTime - lastTime)
                    if (diff / 60000 < 1) {
                        resultList[0].showTime = false;
                    } else {
                        resultList[0].showTime = true;
                    }

                    break;
                }
            }
        }

        totalSpeakList = [...totalSpeakList, ...resultList];
        totalSpeakList.forEach((item, id) => item.debugId = id);
        newCurSpeakList = newCurSpeakList.concat(resultList);


        dispatch({
            type: APPEND_SPEAK,
            curSpeakList:newCurSpeakList,
            totalSpeakList,
        });


        for (let i = resultList.length - 1; i > 0; i--) {
            if (
                resultList[i].isReplay === 'Y' &&
                resultList[i].commentCreateBy === getStore().common.userInfo.userId &&
                !getStore().thousandLive.currentReplySpeak
            ) {
                dispatch({
                    type: UPDATE_REPLY_SPEAK,
                    currentReplySpeak: resultList[i]
                });

                break;
            }
        }

        if(resultList.length > 0){
            dispatch({
                type: INSERT_NEW_MSG,
                insertNewMsg: 1
            });
        }

        let userId = getStore().common.userInfo.user.userId;
        let topicId = getStore().thousandLive.topicInfo.id;
        let replyItemsHasBeenRead = localStorage.getItem('replyItemsHasBeenRead-' + topicId);
	    if(replyItemsHasBeenRead) replyItemsHasBeenRead = replyItemsHasBeenRead.split(',');
	    else replyItemsHasBeenRead = [];

        let currentReplySpeak = totalSpeakList.filter((speak) => {
	        return speak.isReplay === 'Y' && speak.commentCreateBy === userId && (!replyItemsHasBeenRead.length || replyItemsHasBeenRead.indexOf(speak.id) < 0)
        });
        if(currentReplySpeak.length){
        	dispatch({
                type: UPDATE_REPLY_SPEAK,
                currentReplySpeak: currentReplySpeak[0]
            });

        }
    }
}
export function initPageData (pageData) {
    return {
        type: INIT_PAGE_DATA,
        pageData
    }
}
export function initSubscribe (data) {
    return {
        type: INIT_FOCUS_INFO,
        isSubscribe:data,
    }
}

export function initPushComplite (pushCompliteInfo,getnowTopicVideoCount) {
    return {
        type: INIT_PUSH_COMPLITE,
        pushCompliteInfo,
        getnowTopicVideoCount
    }
}

export function clearForumSpsakList(){
    return async (dispatch, getStore) => {
        dispatch(addForumSpeakList([]));
        dispatch({
            type: UPDATE_NO_MORE_SPEAK,
            noMore: false,
        });
        return true;
    };
}

/**
 * 结束话题
 *
 * @export
 * @param {any} topicId
 * @param {any} showLoading
 * @returns
 */
export function fetchEndTopic(topicId, showLoading) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/topic/end-topic',
            body: {
                topicId,
            }
        });

        if (result && result.state && result.state.code === 0) {
            window.toast(result.state.msg);
        }

        return result;
    };
};

/**
 * 获取嘉宾列表
 *
 * @export
 * @param {any} isBanned
 * @param {any} topicId
 * @returns
 */
export function getGuestList(topicId){
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/inviteList',
            method: 'POST',
            showLoading: false,
            body: {
                topicId,
            }
        });
        if (result.state.code === 0) {
            const inviteList = await result.data.liveTopicInviteJsons;
            let inviteListArr = {};//嘉宾列表
            await inviteList.forEach(inviteItem => {
                // inviteListArr[inviteItem.userId] = inviteItem.title||'';
                inviteListArr[inviteItem.userId] = {
                    title: inviteItem.title||'',
                    topicInviteId : inviteItem.id,
                }
            });
            return dispatch({
                type: UPDATE_GUEST_LIST,
                inviteListArr
            });
        } else {
            window.toast(result.state.msg);
        }
        return result;
    }
}

/**
 * 更新嘉宾列表
 *
 * @export
 * @param {any} inviteItem
 * @returns
 */
export function addGuest (inviteItem) {
    return async (dispatch, getStore) => {
        let inviteListArr = getStore().thousandLive.inviteListArr;
        let myUserId = getStore().thousandLive.userId;
        let curSpeakList = getStore().thousandLive.forumSpeakList;
        let totalSpeakList = getStore().thousandLive.totalSpeakList;
        // 赋予一个debugId，就是该item在总列表中的位置
        inviteItem.debugId = totalSpeakList.length;

        switch(inviteItem.status){
			case "publish":
                // inviteListArr[inviteItem.userId] = inviteItem.title||'';
                inviteListArr[inviteItem.userId] = {
                    title: inviteItem.title||'',
                    topicInviteId : inviteItem.id,
                }
                inviteItem.type = 'inviteAdd';
                if (typeof(inviteItem.createTime) == 'object') {
                    inviteItem.createTime = inviteItem.createTime.time;
                }
                dispatch({
                    type: APPEND_SPEAK,
                    curSpeakList: [...curSpeakList, inviteItem],
                    totalSpeakList: [...totalSpeakList, inviteItem],
                });
                dispatch({
                    type: UPDATE_POWER,
                    parmas:{
                        allowSpeak:true,
                    }
                });
				break;
		};


        return dispatch({
            type: UPDATE_GUEST_LIST,
            inviteListArr
        });
    };
}
/**
 * 更新嘉宾列表
 *
 * @export
 * @param {any} inviteItem
 * @returns
 */
export function updateGuestList (inviteItem) {
    return async (dispatch, getStore) => {
        let inviteListArr = getStore().thousandLive.inviteListArr;
        let myUserId = getStore().thousandLive.userId;
        switch(inviteItem.status){
			case "publish":
                // inviteListArr[inviteItem.userId] = inviteItem.title||'';
                inviteListArr[inviteItem.userId] = {
                    title: inviteItem.title||'',
                    topicInviteId : inviteItem.id,
                }
				break;
			case "delete":
                if (myUserId == inviteItem.userId) {
                    dispatch({
                        type: UPDATE_POWER,
                        parmas:{
                            allowSpeak:false,
                        }
                    });
                }
                delete inviteListArr[inviteItem.userId];
				break;
		};
        return dispatch({
            type: UPDATE_GUEST_LIST,
            inviteListArr
        });
    };
}

/**
 * 消息流排重
 *
 * @export
 * @param {any} ListA
 * @param {any} ListB
 * @returns
 */
export function messagelistDeDuplicate (listA, listB = []) {;
    const result = [];
    if (listA) {
        listB.forEach((itemB) => {
            if (itemB.status === 'D') {
                return;
            }
            if (itemB.id) {
                listA.every((itemA) => itemA.id !== itemB.id) && result.push(itemB);
            } else {
                result.push(itemB);
            }
        });
    }
    return result;
}

/**
 * 消息流排除 发送中音频
 *
 * @export
 * @param {any} ListA
 * @param {any} ListB
 * @returns
 */
export function speaklistTempAudioDeDuplicate (listA, listB) {;
    let newList = listA;
    listB.forEach((itemB) => {
        if (itemB.mediaId) {
            newList = newList.filter((itemA, index) => {
                    return (!itemA.serverId || (itemA.serverId != itemB.mediaId));
            })
        }
    });
    return newList;
}

/**
 * 更新禁言状态
 *
 * @export
 * @param {any} isBanned
 * @returns
 */
export function updateMute(isBanned){
    return async (dispatch, getStore) => {
        return dispatch({
            type: SET_MUTE,
            isBanned,
        });
    }
}

/**
 * 设置禁言
 *
 * @export
 * @param {any} isBanned
 * @param {any} topicId
 * @returns
 */
export function setMute(isBanned, topicId){
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/setMute',
            method: 'POST',
            showLoading: true,
            body: {
                isBanned, topicId,
            }
        });
        if (result.state.code === 0) {
            dispatch({
                type: SET_MUTE,
                isBanned,
            });
        } else {
            window.toast(result.state.msg);
        }
        return result;
    }
}



/**
 * 添加禁言信息到信息流
 *
 * 禁言提示为临时消息，后台返回的id是话题id，不能直接使用
 *
 * @export
 * @param {{}} speakItem 发言内容
 * @returns
 */
export function appendBannedTip (speakItem) {
    return {
        type: APPEND_BANNED_TIP,
        tipContent: {
            type: 'bannedTip',
            isBanned: speakItem.isBanned,
            id:Date.now()
        }
    }
}

/**
 * 删除某个发言
 *
 * @export
 * @param {{}} speakItem 发言item
 * @returns
 */
export function removeSpeak (speakItem) {
    return {
        type: REVOKE_FORUM_SPEAK,
        id: speakItem.id,
        speakType: speakItem.type,
        content: speakItem.content,
    };
}

/**
 * 结束直播
 *
 * @export
 * @returns
 */
export function appendFinishTopicTip(item) {
    return {
        type: APPEND_FINISH_TOPIC_TIP,
        tipContent: {
            type: 'finishTopicTip',
            createTime: item.endTime.time
        }
    }
}

/**
 * 结束直播
 *
 * @export
 * @returns
 */
export function finishTopic() {
    return {
        type: FINISH_TOPIC,
    }
}

/**
 * 更新红包显示状态
 *
 * @export
 * @param {any} status
 * @returns
 */
export function setRewordDisplayStatus(status){
    return async (dispatch, getStore) => {
        dispatch({
            type: SET_REWORD_DISPLAY,
            status,
        });
    }
}

/**
 * 修改红包显示状态
 *
 * @export
 * @param {any} status
 * @param {any} topicId
 * @returns
 */
export function setRewordDisplay(status, topicId){
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/setRewordDisplay',
            method: 'POST',
            showLoading: true,
            body: {
                status, topicId,
            }
        })
        if (result.state.code === 0) {
            dispatch(setRewordDisplayStatus(status));
        } else {
            window.toast(result.state.msg);
        }
        return result;
    }
}

/**
 * 在信息流中插入一个赞赏的信息
 *
 * @export
 * @param {any} speakItem
 * @returns
 */
export function appendRewardTip(speakItem) {
    return {
        type: APPEND_REWARD_TIP,
        tipContent : { ...speakItem },
    }
}

/**
 * 弹幕红包
 *
 * @export
 * @param {any} speakItem
 * @returns
 */
export function appendRewardBullet(speakItems) {
    return async (dispatch, getStore) => {
        dispatch({
            type: APPEND_REWARD_BULLET,
            newBulletList: speakItems
        })

        dispatch(shootRewardBullet());

    }
}

/**
 * 发射红包弹幕
 *
 */
export function shootRewardBullet(){
    return async (dispatch, getStore) => {
        let rewardBulletList = getStore().thousandLive.rewardBulletList;
        let isShowBullet = getStore().thousandLive.isShowBullet;
        let isShootBullet = getStore().thousandLive.isShootBullet;

        if(!isShowBullet && rewardBulletList.length > 0){

            setTimeout(()=>{
                dispatch({
                    type: SHOW_REWARD_BULLET,
                    status:true
                })
			},200);
			setTimeout(()=>{
                dispatch({
                    type: SHOOT_REWARD_BULLET,
                    status:true
                })
			},300);


            setTimeout(async ()=>{
				dispatch({
                    type: SHOW_REWARD_BULLET,
                    status:false
                })
                setTimeout(async ()=>{
                    await dispatch({
                        type: SHOOT_REWARD_BULLET,
                        status:false
                    })
                    dispatch({
                        type: REWARD_BULLET_SHIFT
                    })
                    dispatch(shootRewardBullet());
				},50);


			},rewardBulletList.length > 0?3500:5000);
        }

    }

}


export function followLive(liveId,status='Y',auditStatus='',showToast = true) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/follow',
            method: 'POST',
            showLoading: true,
            body: {
                liveId,
                status,
                auditStatus,
            }
        })
        if (result.state.code === 0) {
            showToast && window.toast(result.state.msg);
            dispatch({
                type: FOLLOW_LIVE,
                isFollow: status=='Y'?true:false,
            });
        } else {
            showToast && window.toast(result.state.msg);
        }
        return result;
    }
}


/**
 * 设置是否可以插入发言到信息流
 *
 * @export
 * @param {boolean} canAddSpeak
 * @returns
 */
export function setCanAddSpeak (canAddSpeak) {
    return {
        type: SET_CAN_ADD_SPEAK,
        canAddSpeak
    }
}

export function addTimestamp(list) {
    if (!list || !Array.isArray(list)) {
        return [];
    }
    // 跟踪到最近的拥有createBy字段的数据的距离
    let count = 1;
    return list.map((data, idx, list) => {
        if ( idx === 0 ) {
            return Object.assign({}, data, {showTime: false});
        }
        if ( !data.createTime ) {
            count++;
            return Object.assign({}, data, {showTime: false});
        }
        const currentTime = (typeof (data.createTime) === 'object') ? data.createTime.time : data.createTime;
        const lastTime = (typeof(list[idx - count].createTime) === 'object') ? list[idx - count].createTime.time : list[idx - count].createTime;
        const timeDiff = dayjs(Number(currentTime)).diff(dayjs(Number(lastTime)), 'second');
        if (Math.abs(timeDiff) >= 61) {
            count = 1;
            return Object.assign({}, data, {showTime: true});
        }
        return Object.assign({}, data, {showTime: false});
    });
}

/**
 * 更新浏览人数
 *
 * @export
 * @param {number} browseNum
 * @returns
 */
export function updateBrowseNum (browseNum) {
    return {
        type: UPDATE_BROWSE_NUM,
        browseNum
    }
}


/**
 * 文档上传
 * @param {*} url
 * @param {*} amount
 * @param {*} name
 * @param {*} topicId
 * @param {*} type
 */
export function saveFile(url, amount, name, type) {
    return (dispatch, getStore) => {
        const topicId = getStore().thousandLive.topicInfo.id;
        type = type.replace(/(docx)$/,'doc').replace(/(xlsx)$/,'xls').replace(/(pptx)$/,'ppt');
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/file-upload',
            method: 'POST',
            body: {
                topicDoc: {
                    url, amount, name, topicId, type,
                    download: 'Y'
                }
            }
        });
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

/**
 * 获取点赞数量
 */
export function getLikesSet(topicId) {
    return async (dispatch, getStore) => {
        const likesSet = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/getLikesSet',
            method: 'GET',
            body: {
                topicId
            }
        });

        if (likesSet.state.code == 0) {
            dispatch({
                type: SET_LIKE_SET,
                likesSet: likesSet.data.likesSet
            });
        } else {
            console.error('获取成为金句的点赞数失败');
        }
    }
}

/**
 * 获取点赞列表
 */
export function getLikesList(topicId) {
    return async (dispatch, getStore) => {
        const speakList = getStore().thousandLive.totalSpeakList;
        const speakIds = speakList.map(item => item.id);

        if (!speakIds || speakIds.length == 0) {
            return;
        }

        const likesList = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/likesList',
            method: 'POST',
            body: {
                speakIds: speakIds.join(','),
                topicId
            }
        });

        if (likesList.state.code == 0) {
            const resultSpeakList = updateSpeakLikesList(likesList.data.speaks, speakList);

            dispatch({
                type: ADD_FORUM_SPEAK,
                totalSpeakList: resultSpeakList
            });
        } else {
            console.error('获取成为金句的点赞数失败');
        }
    }
}

export function updateSpeakLikesList(likesList, speakList) {
    // 更新发言列表的点赞数
    return speakList.map(item => {
        for (let i=0; i<likesList.length; i++) {
            if (item.id == likesList[i].speakId) {
                item.likesNum = Number(likesList[i].likesNum);
                item.isLikes = likesList[i].isLikes;

                return item;
            }
        }

        return item;
    });
}

// 更新列表中文档的数据
export function updateSpeakFileItemData(docList, speakList) {
    return speakList.map(item => {
        if (item.type != 'doc') {
            return item;
        }

        for (let i=0; i<docList.length; i++) {
            if (item.content == docList[i].docId) {
                item = {...item, docData: docList[i], hadDocData: true};
                break;
            }
        }

        return item;
    });
}

/**
 * 点赞
 *
 * @export
 * @param {string} speakId
 * @returns
 */
export function doLike(speakId) {
    return async (dispatch, getStore) => {
        const topicId = getStore().thousandLive.topicInfo.id;

        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/likes',
            body: {
                speakId,
                topicId,
            }
        });

        if (result.state.code == 0) {
            dispatch({
                type: UPDATE_LIKE_NUMBER,
                speakId,
                likesNum: result.data.likesNum,
            });
        }
    }
}

/**
 * 获取文档的信息
 * 没有登录时使用了假uderId,因为该接口必须传userId
 * @param {*} docId 文档ID
 */
export function getDocInfo(docId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/topic/doc-get',
            body: {
                docId
            }
        });

        const originList = getStore().thousandLive.totalSpeakList || [];

        const speakList = originList.map(item => {
            if (item.type === 'doc' && item.content == docId) {
                item = {...item, docData: result.data, hadDocData: true};
            }

            return item;
        });

        dispatch({
            type: ADD_FORUM_SPEAK,
            totalSpeakList: speakList,
        });

        return result;
    }
}

/**
 * 检验是否购买文档
 * @param {*} amount
 * @param {*} docId
 */
export function getDocAuth(amount, docId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/doc-auth',
            body: {
                amount,
                docId,
            }
        });
    }
}

/**
 * 文档下载统计
 * @param {*} docId
 */
export function docStat(docId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/doc-add-stat',
            body: {
                docId
            }
        });
    }
}


/**
 * 判断是否关注公众号
 *
 * @export
 * @param {any} liveId
 * @returns
 */
export function isSubscribe(liveId) {
    return async (dispatch, getStore) => {
        const focusData = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/user/is-subscribe',
            body: {
                liveId
            }
        });

        if (focusData.state.code == 0) {
            dispatch({
                type: INIT_FOCUS_INFO,
                isSubscribe:focusData.data,
            });
            return focusData.data
        }
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

/**
 * 绑定直播间分销关系
 * @param  {[type]} liveId    [description]
 * @param  {[type]} lshareKey [description]
 * @return {[type]}           [description]
 */
export function bindShareKey(liveId, lshareKey, sourceNo) {

    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/bind-share-key',
            body: {
                liveId,
                shareKey: lshareKey,
	            sourceNo,
            }
        });
    };
}

/**
 * 话题统计接口
 * @return {[type]} [description]
 */
export function broweStatic(topicId, liveId, channelNo) {

    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/browe',
            body: {
                topicId,
                liveId,
                channelNo,
            }
        });
    };
}

/**
 * 页面访问统计接口
 * @return {[type]} [description]
 */
export function addPageUv(topicId, liveId, statType, channelNo,shareKey = '') {

    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/pageUv',
            body: {
                topicId,
                liveId,
                statType,
                channelNo,
                shareKey,
            }
        });
    };
}

/**
 * 修改发言人头衔
 * @param  {[type]} liveId    [description]
 * @param  {[type]} role      [特邀主持人:"compere",其他都是"guest"]
 * @param  {[type]} title     [是汉字的头衔]
 * @param  {[type]} topicId   [description]
 * @param  {[type]} topicInviteId [被修改的人的用户ID，对应list中的ID]
 * @param  {[type]} userId     [操作者的ID]
 * @return {[type]}           [description]
 */
export function setTitle(liveId, role, title, topicId, topicInviteId, userId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/setTitle',
            body: {
                liveId,
                role,
                title,
                topicId,
                topicInviteId,
                userId,
            }
        });
    }
}


export function publicApply(topicId, shareKey, channelNo, redEnvelopeId = '') {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/topic/publicApply',
            body: {
                topicId,
                shareKey,
                channelNo,
                redEnvelopeId
            }
        });
    }
}

/* 推送话题 */
export function pushTopic(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/push',
			method: 'POST',
			showLoading: true,
			body: params
		});

		return result;
	};
}

/* 获取推送话题 */
export function getTopicPushInfo(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/getPushInfo',
			method: 'POST',
			showLoading: false,
			body: params
		});

		return result;
	};
}


/* 获取推送话题 */
export function getTopicProfile(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/profile',
			method: 'POST',
			showLoading: false,
			body: params
		});

        if (result.state.code === 0) {
            dispatch({
                type: SET_TOPIC_PROFILE,
                profile:result.data.TopicProfileList,
            });
        } else {
            window.toast(result.state.msg);
        }

		return result;
	};
}

/** 获取系列课简介 */
export function getChannelProfile (params) {
    return async (dispatch, getStore) => {
        let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/channel/profile',
			method: 'GET',
			showLoading: false,
			body: params
        });
        
        if (getVal(result, 'state.code') == 0) {
            dispatch({
                type: SET_CHANNEL_PROFILE,
                profile: getVal(result, 'data.descriptions'),
            });
        }

        return result
    }
}

/** 获取直播概要 */
export function getProfileList ({ topicId }) {
    return async (dispatch, getStore) => {
        let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/profileList',
			method: 'POST',
			showLoading: false,
			body: {
                topicId
            }
        });

        return result
    }
}



export function addCommentNum(num) {
    return {
        type: ADD_COMMENT_NUM,
        num: num || 1,
    }
}

export function decreaseCommentNum(num) {
    return {
        type: DECEREASE_COMMENT_NUM,
        num: num || 1,
    }
}

/** 获取详情页引导关注配置 */
export function fetchQrImageConfig ({ topicId }) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips: false,
            errorResolve:true,
            url: '/api/wechat/topic/getFollowGuideInfo',
            body: {
                topicId
            }
        });
    }
}

//获取系列课课程列表
export function fetchCourseList(channelId, liveId, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/topic-list',
            body: {
                channelId,
                liveId,
                clientType: 'weixin',
                pageNum: page,
                pageSize: size,
            }
        });
        return result;
    };
};

/** 话题详情页底部判断是否需要弹出引导关注二维码 */
export function checkNeedShowQr () {
    return api({
        url: '/api/wechat/checkNeedShowQr',
        method: 'GET',
        body: {}
    });
}

//获取系列课购买信息
export function fetchChargeStatus(channelId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/chargeStatus',
			method: 'POST',
			body: {
				channelId
			}
		});
		return result;
	};
};

//获取上一节或者下一节课
export function fetchLastOrNextTopic({topicId, type}) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/topic/getLastOrNextTopic',
			body: {
				topicId,
				type
			}
		});
		return result;
	};
};

// 添加收藏
export function addCollect (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/addCollect',
			body: {...param}
		});
	}
}
// 是否收藏
export function isCollected (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/isCollected',
			body: {...param}
		});
	}
}
// 取消收藏
export function cancelCollect (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'POST',
			url: '/api/wechat/mine/cancelCollect',
			body: {...param}
		});
	}
}

// 获取系列课信息
export function getChannelInfo (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'GET',
			url: '/api/wechat/channel/info',
			body: {...param}
		});
	}
}

// 设置开课提醒
export async function liveAlert(liveId, status) {
    const result = await api({
        showLoading: false,
        url: '/api/wechat/live/alert',
        body: { liveId, status },
        method: 'POST',
    });
    return result && result.data;
}


// 是否关注公众号
export async function isSub(liveId){
    let result = await api({
        url: '/api/wechat/user/is-subscribe',
        method: 'GET',
        showLoading: false,
        body: {
            liveId,
        },
    });
    if(result.state.code === 0){
        return result.data
    }
}

// 获取毕业证二维码
export async function fetchQRCode(topicId,liveId,showQl){
    let result = await api({
        url: '/api/wechat/live/get-qr',
        method: 'GET',
        showLoading: false,
        body: {
            channel: 'achievementCard',
            topicId,
            liveId,
            showQl,
        },
    });
    if(result.state.code === 0){
        return result.data.qrUrl
    }
}

// 获取打赏证书二维码
export async function fetchRewardQRCode(channel,topicId,liveId){
    let result = await api({
        url: '/api/wechat/live/get-qr',
        method: 'GET',
        showLoading: false,
        body: {
            channel,
            topicId,
            liveId,
            showQl: 'N',
            isCenter:isFromLiveCenter()
        },
    });
    if(result.state.code === 0){
        return result.data.qrUrl
    }
}

// 获取毕业证信息
export async function getDiplomaMes(second,topicId){
    let result = await api({
        url: '/api/wechat/achievement/getAchievementCardInfo',
        method: 'POST',
        showLoading: false,
        body: {
            leaningSecond: second,
            topicId,
        },
    });
    if(result.state.code === 0){
        return {
            ...result.data,
            success: true
        }
    }
}

// 获取毕业证信息（初始化判断是否已经有毕业证）
export async function initDiplomaMes(topicId){
    let result = await api({
        url: '/api/wechat/achievement/getExistAchievementCard',
        method: 'POST',
        showLoading: false,
        body: {
            topicId,
        },
    });
    if(result.state.code === 0){
        return {
            ...result.data,
            success: true
        }
    }
}

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

/**
 * 更新服务器时间
 *
 * @export
 * @param {any} liveId
 * @returns
 */
export function updateCurrentTimeMillis(time) {
    return async (dispatch, getStore) => {
        let topicInfo = getStore().thousandLive.topicInfo;
        
        topicInfo.currentTimeMillis = time;
        dispatch({
            type: UPDATE_CUR_TIME,
            topicInfo
        });
    }
}

export function userBindKaiFang(kfAppId, kfOpenId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/userBindKaiFang',
            body: { kfAppId, kfOpenId },
            method: 'POST',
        });

        return result && result.data;
    }
}

// 获取用户已领取某系列课下的课程列表
export async function getReceiveTopicList(channelId) {
    return await api({
        showLoading: false,
        url: '/api/wechat/inviteFriendsToListen/getReceiveTopicList',
        body: { channelId },
        method: 'POST',
    });
}

// 判断用户是否加入训练营
export async function getJoinCampInfo(params){
	const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/channel/joinCampInfo',
		body: params
	});
	return result;
}

/* 话题学习记录 */
export async function studyTopic(params) {
    return await api({
        showLoading: true,
        method: 'POST',
        url: '/api/wechat/training/studyTopic',
        body: params
    });
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
