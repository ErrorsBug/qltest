import { api } from './common';
import { messagelistDeDuplicate, addTimestamp,setCanAddSpeak,appendSpeak } from './thousand-live-common';
import { ADD_FORUM_SPEAK, REVOKE_FORUM_SPEAK ,SET_SPEAK_LIST,UPDATE_NO_MORE_SPEAK} from './thousand-live-common';

export const SET_LIVE_VOLUME = 'SET_LIVE_VOLUME';
export const TOGGLE_TEACHER_ONLY = 'TOGGLE_TEACHER_ONLY';
export const UPDATE_PUSH_STATUS = 'UPDATE_PUSH_STATUS';


export function getForumSpeakList(topicId,time,beforeOrAfter,onlyTeacher,hideLuckyMoney) {
    return async (dispatch, getStore) => {
        // 当前显示的列表
        let curSpeakList = getStore().thousandLive.forumSpeakList;
        // 总的列表
        let totalSpeakList = getStore().thousandLive.totalSpeakList;
        // 当前的列表位置
        let curSpeakIndex = getStore().thousandLive.curSpeakIndex;
        // 加载下一页的数量
        let newListCount = 0;

        let canAddSpeak = getStore().thousandLive.canAddSpeak;
        
        let noMore = getStore().thousandLive.noMoreSpeakList;

        if (totalSpeakList.length < 50 && !noMore) {
            // 这时候总列表和当前列表都还没有50条数据
            let resultList = await fetchForumSpeakList(totalSpeakList, topicId,time,beforeOrAfter,onlyTeacher,hideLuckyMoney);
            resultList.totalList = resultList.totalList.map((item, index) => { item.debugId = index; return item });
            curSpeakIndex = 0;
            totalSpeakList = resultList.totalList;
            curSpeakList = resultList.totalList;
            newListCount = resultList.newListCount;

            if (resultList.noMore) {
                dispatch(setCanAddSpeak(true));
                dispatch({
                    type: UPDATE_NO_MORE_SPEAK,
                    noMore: true,
                });
            }
        } else {
            // 这时候总列表的数据已经超过50个

            // 补充数据
            if (
                (beforeOrAfter == 'before' && curSpeakIndex == 0)
                ||
                (beforeOrAfter == 'after' && !canAddSpeak && (curSpeakIndex + curSpeakList.length) == totalSpeakList.length)
            ) {
                // console.log('补充数据');
                let resultList = await fetchForumSpeakList(totalSpeakList,topicId,time,beforeOrAfter,onlyTeacher,hideLuckyMoney);
                resultList.totalList = resultList.totalList.map((item, index) => { item.debugId = index; return item });
                totalSpeakList = resultList.totalList;
                // 返回获取到的列表的数量
                newListCount = resultList.newListCount;

                if (beforeOrAfter == 'after' && newListCount == 0) {
                    // console.log('加载到最后一个了，新消息可以添加进totalSpeakList了');
                    dispatch(setCanAddSpeak(true));
                }

                // 修正index
                if (beforeOrAfter == 'before') {
                    curSpeakIndex = resultList.newListCount;
                }
            }

            // console.log('curSpeakList length: ', curSpeakList.length);

            if (beforeOrAfter == 'before' && curSpeakIndex != 0) {
                if (curSpeakList.length >= 50) {
                    // 保留头30个，再在头部链接30条数据
                    curSpeakList = curSpeakList.slice(0, 30);
                    // 发生下拉滚动裁剪，禁止往列表添加socket发言数据
                    dispatch(setCanAddSpeak(false));
                    dispatch({
                        type: UPDATE_NO_MORE_SPEAK,
                        noMore: false,
                    });
                }
                let nextIndex = curSpeakIndex - 30 >= 0 ? curSpeakIndex - 30 : 0;
                curSpeakList = totalSpeakList.slice(nextIndex, curSpeakIndex).concat(curSpeakList);
                curSpeakIndex = curSpeakList[0].debugId;
                // console.log('当前位置: ', curSpeakIndex);
                // console.log('当前数据：', curSpeakList.map(item => item.debugId).join(','));

            } else if (beforeOrAfter == 'after' && curSpeakIndex != totalSpeakList.length - 1) {
                /**
                 * 当前最后一条已经是全部最后一条的情况下，不做处理，避免没必要的闪屏
                 */
                if (curSpeakList[curSpeakList.length - 1].id == totalSpeakList[totalSpeakList.length - 1].id) {
                    return;
                }

                let nextIndex = curSpeakIndex + 30 < totalSpeakList.length - 1 ? curSpeakIndex + 30 : totalSpeakList.length - 1

                // console.log('curSpeakIndex: ', curSpeakIndex);
                // console.log('nextIndex: ', nextIndex);
                // 这里的slice的参数原本是 curSpeakIndex + curSpeakList.length, curSpeakIndex + curSpeakList.length + nextIndex - curSpeakIndex ,简化后成下面这样
                let concatList = totalSpeakList.slice(curSpeakIndex + curSpeakList.length, curSpeakList.length + nextIndex);
                // 保留尾30个，再在尾部链接30条数据
                if (curSpeakList.length >= 50) {
                    // 保留头30个，再在头部链接30条数据
                    curSpeakList = curSpeakList.slice(curSpeakList.length - 30);
                }
                // console.log('before concat list: ', curSpeakList.map(item => item.debugId).join(','));
                curSpeakList = curSpeakList.concat(concatList);
                // console.log('ready to concat List: ', concatList.map(item => item.debugId).join(','));
                // console.log('after concat list: ', curSpeakList.map(item => item.debugId).join(','));
                curSpeakIndex = curSpeakList[0].debugId;
                // console.log('当前位置: ', curSpeakIndex);
                // console.log('当前数据：', curSpeakList.map(item => item.debugId).join(','));
            }
        }

        dispatch({
            type: SET_SPEAK_LIST,
            forumSpeakList: curSpeakList,
            totalSpeakList,
            curSpeakIndex
        });
    };
};

async function fetchForumSpeakList(totalList, topicId, time, beforeOrAfter, onlyTeacher, hideLuckyMoney) {
    let getTime = typeof time === 'object' ? time.time : time;
    getTime = (Number(getTime)||0).toFixed(0);
    let result = await api({
        url: '/api/wechat/topic/getForumSpeak',
        method: 'POST',
        showLoading: false,
        body: {
            topicId,
            time: getTime,
            beforeOrAfter,
            onlyTeacher,
            hideLuckyMoney,
        }
    });


    // 排重
    let lastList = await messagelistDeDuplicate(totalList,result.data.forumList);
    // 过滤时间
    let filterTimeList = addTimestamp(lastList);

    return {
        totalList: beforeOrAfter == 'after' ? 
            [...totalList, ...filterTimeList] : 
            [...filterTimeList.reverse(), ...totalList],

        newListCount: result.data.forumList.length,

        noMore: !!result.data.forumList && beforeOrAfter == 'after' && result.data.forumList.length < 30
    };
};






/**
 * 
 * 音视频发言
 * @export
 * @param {any} topicId 
 * @param {any} type 
 * @param {any} content 
 * @param {any} second 
 * @param {any} isReplay 
 * @param {any} relateId 
 * @returns 
 */
export function addForumSpeak(topicId,type,content,second,isReplay,relateId,isShowLoading, playTime = 0, imageTextCard) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/addForumSpeak',
            method: 'POST',
            showLoading: isShowLoading,
            body: {
                topicId,
                type,
                content,
                second,
                isReplay,
                relateId,
                playTime,
                imageTextCard,
            }
        });

        if (result && result.data) {
            dispatch(appendSpeak([result.data.speak]));
        }

        return result;
    };
};


/**
 * 
 * 撤回音视频发言
 * @export
 * @param {any} createBy 
 * @param {any} id 
 * @param {any} liveId 
 * @param {any} topicId 
 * @returns 
 */
export function revokeForumSpeak(createBy, id, liveId, topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/revokeForumSpeak',
            method: 'POST',
            showLoading: true,
            body: {
                createBy, id, liveId, topicId,
            }
        });

        if (result.state.code === 0) {
            dispatch({
                type: REVOKE_FORUM_SPEAK,
                id,
            });
        } else {
            window.toast(result.state.msg);
        }
        return result;
    };
};



/**
 * 是否开启只看讲师操作
 *
 * @export
 * @param {boolean} isOpen true:开启，false:关闭
 * @returns
 */
export function toggleTeacherOnly (isOpen) {
    return {
        type: TOGGLE_TEACHER_ONLY,
        isOpen
    };
}






// 更新直播（视频、音频）音量（值区间为[0.0, 1.0]，为0时静音)
export function setLiveVolume(volume) {
    return {
        type: SET_LIVE_VOLUME,
        volume,
    };
};

// 获取直播地址
export function fetchMediaUrl(topicId, sourceTopicId) {
    const params = {
        topicId
    }
    if (sourceTopicId && sourceTopicId !== topicId) {
        params.topicId = sourceTopicId
        params.relayTopicId = topicId
    }
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/media-url',
            method: 'GET',
            showLoading: false,
            body: params
        })

        return result;
    };
};

// 获取真正的音视频直播地址
export function getLivePlayUrl(topicId, sourceTopicId) {
    const params = {
        topicId
    }
    if (sourceTopicId && sourceTopicId !== topicId) {
        params.topicId = sourceTopicId
        params.relayTopicId = topicId
    }
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getLivePlayUrl',
            method: 'POST',
            showLoading: false,
            body: params
        })

        return result;
    };
};

// 获取真正的音视频直播流状态
export function getLiveStatus(topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getLiveStatus',
            method: 'POST',
            showLoading: false,
            body: {
                topicId
            }
        })

        return result;
    };
};
// 更新状态
export function updatePushStatus(status) {
    return {
        type: UPDATE_PUSH_STATUS,
        status,
    }
}

// 获取音视频直播在线人数
export function getLiveOnlineNum(topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getLiveOnlineNum',
            method: 'POST',
            showLoading: false,
            body: {
                topicId
            }
        })

        return result;
    };
};