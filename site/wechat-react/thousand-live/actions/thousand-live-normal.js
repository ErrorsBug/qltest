import { api } from './common';
import { getVal } from "../../components/util";
import { messagelistDeDuplicate, addTimestamp, setCanAddSpeak, appendSpeak, updateSpeakLikesList, updateSpeakFileItemData,addCommentNum ,decreaseCommentNum} from './thousand-live-common';
import { ADD_FORUM_SPEAK, REVOKE_FORUM_SPEAK ,UPDATE_FORUM_SPEAK,SET_SPEAK_LIST,UPDATE_NO_MORE_SPEAK} from './thousand-live-common';



export const SET_COMMENT_LIST = 'SET_COMMENT_LIST';
export const SET_QUESTION_LIST = 'SET_QUESTION_LIST';
export const APPEND_COMMENT = 'APPEND_COMMENT';
export const APPEND_QUESTION = 'APPEND_QUESTION';
export const SET_SHARE_RANK_ITEMS = 'SET_SHARE_RANK_ITEMS';
export const CHANGE_SPEAKER = 'CHANGE_SPEAKER';
export const UPDATE_TEXT_OPEN = 'UPDATE_TEXT_OPEN';
export const UPDATE_AUDIO_OPEN = 'UPDATE_AUDIO_OPEN';
export const UPDATE_TOTAL_SPEAKLIST = 'UPDATE_TOTAL_SPEAKLIST';
export const UPDATE_REPLY_SPEAK = 'UPDATE_REPLY_SPEAK';
export const CLEAR_REPLY_SPEAK = 'CLEAR_REPLY_SPEAK';
export const INIT_MATERIAL_LIST = 'INIT_MATERIAL_LIST';
export const ADD_MATERIAL = 'ADD_MATERIAL';
export const REMOVE_MATERIAL = 'REMOVE_MATERIAL';
export const SORT_MATERIAL_LIST = 'SORT_MATERIAL_LIST';
export const SORT_UP_MATERIAL = 'SORT_UP_MATERIAL';
export const SORT_DOWN_MATERIAL = 'SORT_DOWN_MATERIAL';
export const RESET_MATERIAL = 'RESET_MATERIAL';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const UPDATE_LIKES_NUM = 'UPDATE_LIKES_NUM';
export const SET_BARRAGE_LIST = 'SET_BARRAGE_LIST';
export const UPDATE_COMMENT_INDEX = 'UPDATE_COMMENT_INDEX';
export const SET_COMMENT_CACHE_MODEL = 'SET_COMMENT_CACHE_MODEL';
export const FIRST_MSG_CODE = 'FIRST_MSG_CODE';
export const UPDATE_OUTLINE_LIST = 'UPDATE_OUTLINE_LIST';
export const UPDATE_REDENVELOPE = 'UPDATE_REDENVELOPE';

//初始化评论列表
export function setCommentList (commentList) {
    return {
        type: SET_COMMENT_LIST,
        commentList,
    }
};

//初始化问题列表
export function setQuestionList (questionList) {
    return {
        type: SET_QUESTION_LIST,
        questionList,
    }
};

//更新课堂红包状态
export function updateRedEnvelope (id, status) {
    return (dispatch, getStore) => {
        dispatch ({
            type: UPDATE_REDENVELOPE,
            id,
            status,
        });
    }
};

// 添加评论
export function appendComment (commentPoList = []) {
    return (dispatch, getStore) => {
        let commentList = getStore().thousandLive.commentList;
        commentPoList = addTimestamp(commentPoList.reverse()).reverse();
        
        // 判断时间是否显示
        if (commentList&&commentPoList.length > 0) {
            for(let i=commentList.length; i>0; i--) {
                if (commentList[i-1].createTime) {
                    let originTime = commentList[i-1].createTime;
                    let lastTime = commentPoList[0].createTime;

                    originTime = typeof originTime === 'object' ? originTime.time : originTime;
                    lastTime = typeof lastTime === 'object' ? lastTime.time : lastTime;

                    let diff = Math.abs(originTime - lastTime)
                    if (diff / 60000 < 1) {
                        commentPoList[0].showTime = false;
                    } else {
                        commentPoList[0].showTime = true;
                    }

                    break;
                }
            }
        }
        // 排重
        let lastList = messagelistDeDuplicate(commentList, commentPoList);
        dispatch({
            type: APPEND_COMMENT,
            commentList:lastList,
        });
    }
};

// 添加问题
export function appendQuestion(questionPoList = []) {
    return (dispatch, getStore) => {
        let questionList = getStore().thousandLive.questionList;
            // 排重
        let lastList = messagelistDeDuplicate(questionList, questionPoList);
        dispatch ({
            type: APPEND_QUESTION,
            questionList: lastList,
        });
    }
};

// 初始化分享榜卡片数据
export function initShareRankCardItems(cardItems) {
    return {
        type: SET_SHARE_RANK_ITEMS,
        cardItems,
    };
};

export function getTopicSpeakList(topicId, liveId, time, beforeOrAfter, hideLuckyMoney, clearList, userId) {
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

        let isLogin =  getStore().thousandLive.isLogin;
        //  没有登录时使用了假uderId,因为该接口必须传userId
        let userId = getStore().thousandLive.isLogin ? getStore().thousandLive.userId : '';

        if (clearList) {
            dispatch({
                type: UPDATE_NO_MORE_SPEAK,
                noMore: false,
            });
        }
        let noMore = getStore().thousandLive.noMoreSpeakList;


        if (totalSpeakList.length < 80 && !noMore || clearList) {
            // 这时候总列表和当前列表都还没有80条数据
            let resultList = await fetchSpeakList(totalSpeakList, topicId, liveId, time, beforeOrAfter, hideLuckyMoney, clearList,isLogin,userId);
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
            // 这时候总列表的数据已经超过80个

            // 补充数据
            if (
                (beforeOrAfter == 'before' && curSpeakIndex == 0)
                ||
                (beforeOrAfter == 'after' && !canAddSpeak && (curSpeakIndex + curSpeakList.length) == totalSpeakList.length)
            ) {
                // console.log('补充数据');
                let resultList = await fetchSpeakList(totalSpeakList, topicId, liveId, time, beforeOrAfter, hideLuckyMoney, clearList,isLogin,userId);
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
                if (curSpeakList.length >= 80) {
                    // 保留头60个，再在头部链接30条数据
                    curSpeakList = curSpeakList.slice(0, 60);
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
                let nextIndex = curSpeakIndex + 30 < totalSpeakList.length - 1 ? curSpeakIndex + 30 : totalSpeakList.length - 1

                // console.log('curSpeakIndex: ', curSpeakIndex);
                // console.log('nextIndex: ', nextIndex);
                // 这里的slice的参数原本是 curSpeakIndex + curSpeakList.length, curSpeakIndex + curSpeakList.length + nextIndex - curSpeakIndex ,简化后成下面这样
                let concatList = totalSpeakList.slice(curSpeakIndex + curSpeakList.length, curSpeakList.length + nextIndex);
                // 保留尾30个，再在尾部链接30条数据
                if (curSpeakList.length >= 60) {
                    // 保留尾60个，再在尾部链接30条数据
                    curSpeakList = curSpeakList.slice(curSpeakList.length - 60);
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

	    let replyItemsHasBeenRead = localStorage.getItem('replyItemsHasBeenRead-' + topicId);
	    if(replyItemsHasBeenRead) replyItemsHasBeenRead = replyItemsHasBeenRead.split(',');
	    else replyItemsHasBeenRead = [];

        let currentReplySpeak = totalSpeakList.filter((speak) => {
	        return speak.isReplay === 'Y' && speak.commentCreateBy === userId && (!replyItemsHasBeenRead.length || replyItemsHasBeenRead.indexOf(speak.id) < 0)
        });
        if(currentReplySpeak.length){
        	if(beforeOrAfter === 'after' && !getStore().thousandLive.currentReplySpeak){
		        dispatch({
			        type: UPDATE_REPLY_SPEAK,
			        currentReplySpeak: currentReplySpeak[0]
		        });
	        }else if(beforeOrAfter !== 'after'){
		        dispatch({
			        type: UPDATE_REPLY_SPEAK,
			        currentReplySpeak: currentReplySpeak[0]
		        });
	        }

        }
    };
};


async function fetchSpeakList(totalList, topicId, liveId, time, beforeOrAfter, hideLuckyMoney, clearList, isLogin, userId) {
    let getTime = typeof time === 'object' ? time.time : time;
    getTime = parseInt(getTime||0);
    let result = await api({
        url: '/api/wechat/topic/getTopicSpeak',
        method: 'POST',
        showLoading: clearList,
        body: {
            topicId,
            liveId,
            time: getTime,
            beforeOrAfter,
            hideLuckyMoney,
            pullComment:'N',
        }
    });

    if ( clearList ) {
        totalList = [];
    }
    // 排重
    let lastList = messagelistDeDuplicate(totalList,getVal(result,'data.liveSpeakViews',{}));
    // 过滤时间
    let filterTimeList = addTimestamp(lastList);

    const speakIds = filterTimeList.map(item => item.id);

    let resultSpeakList = filterTimeList;

    if (speakIds && speakIds.length > 0 && isLogin) {
        try {
            const likesList = await api({
                showLoading: false,
                url: '/api/wechat/topic/likesList',
                method: 'POST',
                body: {
                    speakIds: speakIds.join(',')
                }
            });
            
            if (likesList?.state?.code == 0) {
                resultSpeakList = updateSpeakLikesList(likesList.data.speaks, filterTimeList);
            }
        } catch (error) {
            console.error('init like list error, ', error);
        }
    }

    const docItems = resultSpeakList.filter(item => item.type == 'doc');
    if (docItems.length > 0) {
        try {
            const docIds = docItems.map(item => item.content);
            const docResult = await api({
                showLoading: false,
                url: '/api/wechat/topic/get-doc-data',
                method: 'POST',
                body: {
                    docIdList: docIds.join(','),
                    userId
                }
            });

            if (docResult.state.code == 0) {
                resultSpeakList = updateSpeakFileItemData(docResult.data.docList, resultSpeakList);
            }
        } catch (error) {
            console.error('get doc data error, ', error);
        }
        
    }

    if (resultSpeakList.length > 2 && 
        resultSpeakList[resultSpeakList.length - 2].type == 'start'
    ) {
        const temp = resultSpeakList[resultSpeakList.length - 1];
        resultSpeakList[resultSpeakList.length - 1] = resultSpeakList[resultSpeakList.length - 2];
        resultSpeakList[resultSpeakList.length - 2] = temp;
    }

    if (resultSpeakList.length > 2 &&
        resultSpeakList[1].type == 'start'
    ) {
        const temp = resultSpeakList[1];
        resultSpeakList[1] = resultSpeakList[0];
        resultSpeakList[0] = temp;
    }

    return {
        totalList: beforeOrAfter == 'after' ? 
            [...totalList, ...resultSpeakList] : 
            [...resultSpeakList.reverse(), ...totalList],
        delSpeakIdList: result.delSpeakIdList,

        newListCount: resultSpeakList.length,

        noMore: !!result.data.liveSpeakViews && beforeOrAfter == 'after' && result.data.liveSpeakViews.length < 30
    };
}


// 获取某种类型全部发言
export function fetchTotalSpeakList(params) {
    return async (dispatch, getStore) => {
        let result = await api({
            url: '/api/wechat/topic/total-speak-list',
            method: 'POST',
            showLoading: false,
            body: params
        });
        if (result.state && result.state.code != 0) {
            window.toast(result.state.msg);
        }

        return result;
    }    
}

// 加载指定ID附近的发言列表，默认的附近的意思就是该发言前29条（不足则止），加上该发言后30条（不足则止）
export function loadTargetSpeakById(speakId) {
    return async (dispatch, getStore) => {
        // 当前显示的列表
        let curSpeakList = getStore().thousandLive.forumSpeakList;
        // 总的列表
        let totalSpeakList = getStore().thousandLive.totalSpeakList;
        // 当前的列表位置
        let curSpeakIndex = getStore().thousandLive.curSpeakIndex;
        // 目标speak在总列表的位置
        let targetIndex = -1;

        for (let i=0; i< totalSpeakList.length; i++) {
            if (totalSpeakList[i].id == speakId) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) {
            return false;
        }

        let startIndex = targetIndex - 29 >= 0 ? targetIndex - 29 : 0;
        let endIndex = targetIndex + 30;

        // console.log('targetIndex: ', targetIndex, '  startIndex: ', startIndex, '  endIndex: ', endIndex);

        curSpeakList = totalSpeakList.slice(startIndex, endIndex);
        curSpeakIndex = startIndex;

        dispatch({
            type: SET_SPEAK_LIST,
            forumSpeakList: curSpeakList,
            totalSpeakList,
            curSpeakIndex
        });

        return true;
    };
}

// 插入消息流
export function addTopicListMsg(msgArr,isAppend = true){
	return (dispatch, getStore) => {
        try {
            let forumSpeakList = getStore().thousandLive.forumSpeakList;
            let totalSpeakList = getStore().thousandLive.totalSpeakList;
            dispatch({
                type: UPDATE_FORUM_SPEAK,
                ForumSpeakList: isAppend?[...forumSpeakList,...msgArr]:[...msgArr,...forumSpeakList],
                totalSpeakList: isAppend?[...totalSpeakList,...msgArr]:[...msgArr,...totalSpeakList],
            });

        }catch(err){
            console.log(err);
        }
        return true;
	}
}
// 更新消息流
export function updateTopicListMsg(msgItem,key){
	return async (dispatch, getStore) => {
        let totalSpeakList = getStore().thousandLive.totalSpeakList;

        let newList = totalSpeakList.map((item,index)=>{
            if (key && item[key] === msgItem[key]) {
                return {...item,...msgItem};
            } else {
                return item;
            }

        })

		dispatch({
            type: UPDATE_FORUM_SPEAK,
            totalSpeakList: [...newList],
        });
	}
}

// 删除消息流
export function delTopicListMsg(msgItem,key){
	return async (dispatch, getStore) => {
        let forumSpeakList = getStore().thousandLive.forumSpeakList;
        let totalSpeakList = getStore().thousandLive.totalSpeakList;
        let newList = forumSpeakList.filter((item,index)=>{
                return item[key] != msgItem[key];
        })

        let newTotalList = totalSpeakList.filter((item,index)=>{
                return item[key] != msgItem[key];
        })
        
		dispatch({
            type: UPDATE_FORUM_SPEAK,
            forumSpeakList: [...newList],
            totalSpeakList: [...newTotalList],
        });
	}
}


// 清空回复消息
export function clearReplySpeak(){
	return async (dispatch, getStore) => {
		dispatch({
			type: CLEAR_REPLY_SPEAK
		})
	}
}



/**
 * 话题发言
 *
 * @export
 * @param {any} topicId
 * @param {any} type
 * @param {any} content
 * @param {any} second
 * @param {any} isReplay
 * @param {any} relateId
 * @returns
 */
export function addTopicSpeak(topicId,liveId,type,content,fileId,second,isReplay,commentId,isShowLoading, imageTextCard) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/addTopicSpeak',
            method: 'POST',
            showLoading: isShowLoading,
            errorResolve:true,
            body: {
                topicId,
                liveId,
                type,
                content,
                fileId,
                second,
                isReplay,
                commentId,
                imageTextCard
            }
        });

        if (result && result.data) {
            dispatch(appendSpeak([result.data.liveSpeakView]));
        }

        return result;
    };
};


/**
 * 撤回话题发言
 *
 * @export
 * @param {any} createBy
 * @param {any} id
 * @param {any} liveId
 * @param {any} topicId
 * @returns
 */
export function revokeTopicSpeak(createBy, speakId, liveId, topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/revokeTopicSpeak',
            method: 'POST',
            showLoading: true,
            body: {
                createBy, speakId, liveId, topicId,
            }
        });

        if (result.state.code === 0) {
            dispatch({
                type: REVOKE_FORUM_SPEAK,
                id:speakId,
            });
        } else {
            window.toast(result.state.msg);
        }
        return result;
    };
};



/**
 * 正在发言
 *
 * @export
 * @param {any} topicId
 * @param {any} speaker
 * @param {any} status
 * @returns
 */
export function changeSpeaker(topicId, speaker, status) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/changeSpeaker',
            method: 'POST',
            showLoading: false,
            body: {
                topicId, speaker, status
            }
        });

        return result;
    };
};

// 正在输入
export function whoTyping(data) {
    return async (dispatch, getStore) => {
        let whoTyping = getStore().thousandLive.whoTyping;
        let myName = getStore().common.userInfo.user.name;
        if (data.status == "Y" && myName != data.speaker) {
            dispatch({
                type: CHANGE_SPEAKER,
                whoTyping:data.speaker,
            })
        } else if (data.status != "Y" && whoTyping == data.speaker) {
            dispatch({
                type: CHANGE_SPEAKER,
                whoTyping: '',
            })
        }
        return
    };
};



/**
 * 获取评论列表
 * @param {*} topicId
 * @param {*} liveId
 * @param {*} time
 * @param {*} beforeOrAfter
 */
export function fetchCommentList(topicId,liveId,time,beforeOrAfter) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getComment',
            method: 'GET',
            showLoading: false,
            body: {
                topicId,
                liveId,
                time: typeof time === 'object' ? time.time : time,
                beforeOrAfter,
            }
        });

        let commentList = getStore().thousandLive.commentList;
        // 排重
        let lastList = await messagelistDeDuplicate(commentList, getVal(result,'data.liveCommentViews',{}));
        // 过滤时间
        let filterTimeList = addTimestamp(lastList.reverse()).reverse();

         if (result.state.code === 0) {
             dispatch({
                type: SET_COMMENT_LIST,
                commentList: [...commentList,...filterTimeList],
            });
        } else {
            window.toast(result.state.msg);
        }

        return result.data.liveCommentViews;
    };
};

export function updateCommentIndex(idx) {
    return (dispatch, getStore) => {
        dispatch({
            type: UPDATE_COMMENT_INDEX,
            idx,
        });
    };
}

export function setCommentCacheModel(isCache) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_COMMENT_CACHE_MODEL,
            isCache,
        });
    };
}


export function initBarrageList(length) {
    return (dispatch, getStore) => {
        const barrageList = getStore().thousandLive.commentList.slice(0, length).reverse();
        dispatch({
            type: SET_BARRAGE_LIST,
            barrageList,
        });
    };
}


export function updateBarrageList(item) {
    return (dispatch, getStore) => {
        const originBarrageList = getStore().thousandLive.barrageList;
        if (item&&originBarrageList) {
            let newList;
            if (originBarrageList.length >= 3) {
                newList = originBarrageList.slice(1) || [];
            } else {
                newList = originBarrageList || [];
            }
            newList.push(item);
            dispatch ({
                type: SET_BARRAGE_LIST,
                barrageList: newList,
            });
        }
    };
}

export function deleteBarrageItem(id) {
    return (dispatch ,getStore) => {
        const originBarrageList = getStore().thousandLive.barrageList;
        if (id) {
            dispatch({
                type: SET_BARRAGE_LIST,
                barrageList: originBarrageList.filter((item) => item.id !== id),
            });
        }
    }
}

/**
 * 获取问题列表
 * @param {*} liveId
 * @param {*} time
 */
export function appendQuetionList(topicId,time) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getQuestionList',
            method: 'GET',
            showLoading: false,
            body: {
                topicId,
                time: typeof time === 'object' ? time.time : time,
            }
        });

        let questionList = getStore().thousandLive.questionList;
        // 排重
        let lastList = await messagelistDeDuplicate(questionList,getVal(result,'data.data',{}));
        // 过滤时间
        let filterTimeList = addTimestamp(lastList);

        if (result.state.code === 0) {
             dispatch({
                type: SET_QUESTION_LIST,
                questionList: [...questionList,...filterTimeList],
            });
        } else {
            window.toast(result.state.msg);
        }
        return result.data.data;
        // return {
        //     originList: result.data && result.data.liveSpeakViews,
        //     uniqListLength: filterTimeList.length,
        // };
    };
};

export function getQuestionList(topicId,time) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getQuestionList',
            method: 'GET',
            showLoading: false,
            body: {
                topicId,
                time: typeof time === 'object' ? time.time : time,
            }
        });

        if (result.state.code === 0) {
             dispatch({
                type: SET_QUESTION_LIST,
                questionList: [...result.data.data],
            });
        } else {
            window.toast(result.state.msg);
        }
        return result.data.data;
        // return {
        //     originList: result.data && result.data.liveSpeakViews,
        //     uniqListLength: filterTimeList.length,
        // };
    };
}




/**
 * 添加评论
 * @param {*} content
 * @param {*} isQuestion
 * @param {*} liveId
 * @param {*} topicId
 * @param {*} type
 */
export function addComment(content, isQuestion, liveId, topicId, type, playTime, parentId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/addComment',
            method: 'POST',
            showLoading: true,
            errorResolve:true,
            body: {
                content, isQuestion, liveId, topicId, type, playTime, parentId
            }
        });
        if (result.state.code !== 0) {
            window.toast(result.state.msg);
        } else {
            dispatch(appendComment([result.data.liveCommentView]));
            if ( result.data.liveCommentView.isQuestion === 'Y') {
                dispatch(appendQuestion([result.data.liveCommentView]));
            }
        }
        return result;
    };
};

/**
 * 删除评论
 * @param {c} commentId
 * @param {*} createBy
 * @param {*} topicId
 */
export function deleteComment(commentId, createBy, topicId) {
     return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/deleteComment',
            method: 'POST',
            showLoading: true,
            body: {
                commentId, createBy, topicId,
            }
        });
        

        if (result.state.code === 0) {
            window.toast(result.state.msg);

            dispatch({
                type: DELETE_COMMENT,
                commentId: commentId,
            });
        } else {
            window.toast(result.state.msg);
        }
        return result;
    };
}


/**
 * 更新评论列表数据
 */
export function updateCommentList(id,key,value) {
    return async (dispatch, getStore) => {
        let commentList = getStore().thousandLive.commentList;

        let lastList = commentList.map((item)=>{
            if( item.id == id ){
                item[key] = value;
                return {...item};
            }else{
                return item;
            }
        })

        dispatch({
            type: SET_COMMENT_LIST,
            commentList: [...lastList],
        });
    };
};



/**
 * 获取分享榜卡片数据
 * @param  {[type]} topicId [description]
 * @return {[type]}         [description]
 */
export function fetchShareRankCardItems(businessId,businessType) {
     return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/distribution/newRank',
            method: 'POST',
            body: {
                businessId,
                businessType,
                pageNum: 1,
                pageSize: 6,
            }
        });

        dispatch(initShareRankCardItems(result.data && result.data.list || []));

        return result;
    };
}

/**
 * 获取课程分销资格（统一接口）
 */
export function getMyQualify(businessId, businessType, isAutoApply = 'Y') {
    return async (dispatch, getStore) => {
       let result = await api({
           dispatch,
           getStore,
           showLoading: false,
           url: '/api/wechat/topic/getMyQualify',
           method: 'POST',
           body: {
                businessId,
                businessType,
                isAutoApply,
           }
       });

       return result;
   };
}

//获取话题自动分销信息
export async function getTopicAutoShare (params) {
    const result = await api({
        method: 'GET',
        url: '/api/wechat/topic/getTopicAutoShare',
        body: params
    });

    return result;
}

//获取系列课自动分销信息
export async function getChannelAutoShare (params) {
    const result = await api({
        method: 'GET',
        url: '/api/wechat/topic/getChannelAutoShare',
        body: params
    });

    return result;
}

export function sortUp(index){
	return (dispatch, getStore) => {

		dispatch({
			type: SORT_UP_MATERIAL,
			index
		});

	};
}

export function sortDown(index){
	return (dispatch, getStore) => {

		dispatch({
			type: SORT_DOWN_MATERIAL,
			index
		});

	};
}

export function resetMaterial(materialList){
	return (dispatch, getStore) => {

		dispatch({
			type: RESET_MATERIAL,
			materialList
		});

	};
}

//获取ppt列表
export function getPPT(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/pptList',
			method: 'POST',
			showLoading: false,
			body: params
		});

		dispatch({
			type: INIT_MATERIAL_LIST,
			materialList: result.data && result.data.files || []
		});

		return result;
	};
}

//新增ppt
export function addPPT(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/addppt',
			method: 'POST',
			showLoading: true,
			body: params
		});
        let materialList = getStore().thousandLive.materialList;

        if (result.state && result.state.code === 0) {
            //先排重
            let lastMaterialList = messagelistDeDuplicate(materialList, result.data.files);
            dispatch({
                type: ADD_MATERIAL,
                newMaterial: lastMaterialList
            });

        }

		return result;
	};
}
//ppt上墙
export function pushPPT(fileId) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/pptPush',
			method: 'POST',
			showLoading: true,
			body: {fileId}
		});
        let materialList = getStore().thousandLive.materialList;
        let pptList = getStore().thousandLive.pptList;

        if (result.state && result.state.code === 0) {
            //先排重
            let lastMaterialList = materialList.map((item) => { 
                if (item.id === updateItem.id) {
                    return updateItem;
                } else {
                    return item;
                }
            })

            lastPPTList = [...pptList, ...lastPPTList];

            dispatch({
                type: UPDATE_MATERIAL,
                newMaterial: lastMaterialList,
                newPPTList: lastPPTList,
            });

        }

		return result;
	};
}

//删除ppt
export function removePPT(id) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/removeppt',
			method: 'POST',
			showLoading: true,
			body: {
				id
			}
		});

		dispatch({
			type: REMOVE_MATERIAL,
			removedId: id
		});

		return result;
	};
}

//排序ppt
export function sortPPT(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/sortppt',
			method: 'POST',
			showLoading: true,
			body: params
		});

		dispatch({
			type: SORT_MATERIAL_LIST,

		})

		return result;
	};
}

/**
 * websocket同步ppt
 * 
 * @export
 * @param {any} updateItem 
 * @returns 
 */
export function updatePPT(updateItem) {
    return async (dispatch, getStore) => {
        let materialList = getStore().thousandLive.materialList;
        let pptList = getStore().thousandLive.pptList;
        let lastMaterialList;
        let lastPPTList;
        if (updateItem.status == 'Y') {
            lastMaterialList = messagelistDeDuplicate(materialList, [updateItem]);
            lastPPTList = messagelistDeDuplicate(pptList, [updateItem]);
            
            if ( lastMaterialList.length > 0 ) {
                lastMaterialList = [...materialList, ...lastMaterialList];
            } else {
                lastMaterialList = materialList.map((item) => { 
                    if (item.id === updateItem.id) {
                        return updateItem;
                    } else {
                        return item;
                    }
                })
            }

            lastPPTList = [...pptList, ...lastPPTList];


            dispatch({
                type: UPDATE_MATERIAL,
                newMaterial: lastMaterialList,
                newPPTList: lastPPTList,
            });
        } else if (updateItem.status == 'N') {
            lastMaterialList = materialList.filter((item) => {
                return item.fileId !== updateItem.fileId;
            })
            lastPPTList = pptList.filter((item) => {
                return item.fileId !== updateItem.fileId;
            })

            dispatch({
                type: UPDATE_MATERIAL,
                newMaterial: lastMaterialList,
                newPPTList: lastPPTList,
            });
        }
    };    
}


// 用户禁言
export function bannedToPost(bannedUserId, isEnable, liveId, showToast = true) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/ban',
            method: 'POST',
            showLoading: true,
            body: {
                bannedUserId, isEnable, liveId,
            }
        });
        if (result.state.code !== 0) {
           showToast && window.toast(result.state.msg);
        } else {
           showToast && window.toast(result.state.msg);
        }
        return result;
    };
};

// 获取今日推送次数
export function getPushNum(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
            showLoading: false,
			url: '/api/wechat/live/pushNum',
			method: 'POST',
			body: params
		});

		return result;
	};
}

// 请求音频合成
export function AssemblyAudio(topicId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getAssemblyAudio',
            method: 'POST',
            showLoading: true,
            body: {
                topicId,
            }
        });
        if (result.state.code !== 0) {
            window.confirmDialog(result.state.msg, null, null, null, 'confirm');
        }
        return result;
    };
};

// 上麦开关
export function textOrAudioSwitch(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/textOrAudioSwitch',
			method: 'POST',
			showLoading: true,
			body: params
		});

        if (result.state.code == 0) {
            if (params.isAudioOpen) {
                dispatch({
                    type: UPDATE_AUDIO_OPEN,
                    status : params.isAudioOpen,
                })
            } else {
                dispatch({
                    type: UPDATE_TEXT_OPEN,
                    status:params.isTextOpen,
                })
            }
        }

		return result;
	};
}


// 更新文字上麦
export function updateTextOpen (status) {
    return async (dispatch, getStore) => {
        dispatch({
            type: UPDATE_TEXT_OPEN,
            status,
        })
    };
};
// 更新音频上麦
export function updateAudioOpen (status) {
    return async (dispatch, getStore) => {
        dispatch({
            type: UPDATE_AUDIO_OPEN,
            status,
        })
    };
};



export function updateLikesNum(likesNum, id) {
    return {
        type: UPDATE_LIKES_NUM,
        likesNum,
        id
    }
}


export function removeLuckyMoney(status) {
    return (dispatch, getStore) => {
        if (status != 'Y') {
            return;
        }
        // 当前显示的列表
        let curSpeakList = getStore().thousandLive.forumSpeakList;
        // 总的列表
        let totalSpeakList = getStore().thousandLive.totalSpeakList;
        // id
        let curSpeakIndex = getStore().thousandLive.curSpeakIndex;


        for (let i = 0; i <= curSpeakIndex; i++){
            if (totalSpeakList[i].type == 'redpacket') {
                curSpeakIndex--;
            }
            
        }

        totalSpeakList = totalSpeakList.filter(item => item.type != 'redpacket')
        curSpeakList = curSpeakList.filter(item => item.type != 'redpacket')

        dispatch({
            type: SET_SPEAK_LIST,
            forumSpeakList: curSpeakList,
            totalSpeakList,
            curSpeakIndex
        });
    };
    
}


// 获取提纲列表
export function getOutlineList(params) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
			getStore,
			url: '/api/wechat/topic/getOutlineList',
			method: 'GET',
			showLoading: false,
			body: params
		});
        
        if (result.state.code == 0) {
            dispatch({
                type: UPDATE_OUTLINE_LIST,
                outlineList: result.data.outLineList,
            });
        }

		return result;
	};
}


// 添加提纲
export function addOrUpdateOutLine(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/addOrUpdateOutLine',
			method: 'POST',
			showLoading: false,
			body: params
		});
        if (result.state.code == 0) {
            let outlineList = getStore().thousandLive.outlineList;

            if (params.outlineId && params.outlineId !== '') {
                outlineList = outlineList.map(item => {
                    if (item.id == params.outlineId) {
                        item.content = result.data.outLinePo.content
                    }
                    return item;
                })
            } else {
                outlineList.push(result.data.outLinePo);
            }

            dispatch({
                type: UPDATE_OUTLINE_LIST,
                outlineList: outlineList,
            });

        }

		return result && result.state && result.state.code == 0;
	};
}

// 删除提纲
export function delOutLine(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/delOutLine',
			method: 'POST',
			showLoading: false,
			body: params
		});

        if (result.state.code == 0) {
            let outlineList = getStore().thousandLive.outlineList;

            outlineList = outlineList.filter(item => {
                return item.id != params.outlineId;
            })
            dispatch({
                type: UPDATE_OUTLINE_LIST,
                outlineList: outlineList,
            });
        }

		return result && result.state && result.state.code == 0;
	};
}

// 更新提纲状态
export function updateOutline(type,outlineItem){
    return async (dispatch, getStore) => {
        let outlineList = getStore().thousandLive.outlineList;
        let power = getStore().thousandLive.power;
        let itemIndex = outlineList.findIndex(item => {
            return item.id == outlineItem.id
        })
        if (type == 'send') {
            if (itemIndex > -1) {
                outlineList = outlineList.map(item => {
                    if (item.id == outlineItem.id) {
                        item.sendStatus = 'Y';
                        item.speakTime = outlineItem.speakTime;
                    }
                    return item;
                })
            } else {
                outlineList.push(outlineItem);
            }
        } else if (type == 'remove') {
            if (power.allowMGTopic) {
                outlineList = outlineList.map(item => {
                    if (item.id == outlineItem.id) {
                        item.sendStatus = 'N';
                    }
                    return item;
                })
            } else {
                outlineList = outlineList.filter(item => {
                    return item.id != outlineItem.id;
                })
            }
        }

        

        dispatch({
            type: UPDATE_OUTLINE_LIST,
            outlineList: outlineList,
        });

	};
}


/**
 * 获取音视频图文评论列表
 *
 * @export
 * @param {string} topicId
 * @param {string} type
 */
export function getGraphicCommentList({ businessId, time, page, size, position = 'before' }){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/topic/discussList',
			body: { businessId, time, page, size, position },
			method: 'POST',
		});

		return result;
	}
}

/**
 * 添加音视频图文新评论
 *
 * @export
 * @param {string} channelId
 * @param {string} type
 */
export function addGraphicComment({ businessId, content, parentId = 0, type = 'videoGraphic', playTime}){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			url: '/api/wechat/topic/addDiscuss',
			body: { businessId, content, parentId, type, playTime },
			method: 'POST',
		});

		return result;
	}
}

/**
 * 音视频图文评论点赞
 *
 * @export
 * @param {string} channelId
 * @param {string} type
 */
export function likeComment({ discussId, status = 'Y' }){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: true,
			url: '/api/wechat/topic/discussLike',
			body: {
				discussId,
				status,
			},
			method: 'POST',
		});

		return result;
	}
}

/**
 * 获取评论总数
 *
 * @export
 * @param {string} businessId
 * @returns
 */

export function graphicCommentCount({ businessId }){
	return async (dispatch, getStore) => {
		return await api({
			dispatch,
			getStore,
			url: '/api/wechat/topic/commentCount',
			method: 'POST',
			showLoading: false,
			body: {
				businessId
			}
		});
    };
}

/**
 * 获取课堂红包关注二维码
 * @export
 * @param {*} redEnvelopeId 红包Id
 * @param {*} redEnvelopeMoney 红包金额
 * @param {*} liveId 直播间Id
 * @param {*} topicId 话题Id
 * @param {string} [channelId=''] 系列课Id
 * @returns
 */
export async function getRedEnvelopeQrCode({redEnvelopeId, redEnvelopeMoney, liveId, topicId, channelId=''}){
    let appId = ''
    // 获取课堂红包关注公众号
    const redEnvelopeAppId = await api({
        url: '/api/wechat/topic/getRedEnvelopeAppId',
        method: 'POST',
        showLoading: false,
        body: {}
    });
    // 没有配置红包公众号直接返回false
    if(redEnvelopeAppId.state.code === 0){
        if(redEnvelopeAppId.data) {
            // let appId = redEnvelopeAppId.data.appId
            // 获取配置的公众号的关注状态
            const subscribeData = await api({
                url: '/api/wechat/user/is-subscribe',
                method: 'GET',
                body: {
                    liveId: redEnvelopeAppId.data.liveId
                }
            });
            // isQlAppId为Y是千聊的公众号，此时需要同时满足 isShowQl===false 和 subscribe===false 才表示未关注，为N时判断isFocusThree===false即可
            if(subscribeData.state.code === 0){
                if(redEnvelopeAppId.data.isQlAppId === 'Y'){
                    if(!subscribeData.data.isShowQl && !subscribeData.data.subscribe){
                        appId = redEnvelopeAppId.data.appId
                    }
                }else if(redEnvelopeAppId.data.isQlAppId === 'N'){
                    if(!subscribeData.data.isFocusThree){
                        appId = redEnvelopeAppId.data.appId
                    }
                }
            }
            if(appId){
                // 根据公众号appId获取公众号二维码
                const qrCodeData = await api({
                    url: '/api/wechat/live/get-qr',
                    method: 'GET',
                    body: {
                        liveId,
                        appId,
                        channel: 'redEnvelope',
                        showQl: 'N',
                        channelId,
                        topicId,
                        redEnvelopeId,
                        redEnvelopeMoney,
                    }
                });
                if(qrCodeData.state.code === 0){
                    return {qrUrl : qrCodeData.data.qrUrl, appId }
                }else {
                    return false
                }
            }else {
                return false
            }
        }else {
            return false
        }
    }

}

/**
 * 领取课堂红包
 * @export
 * @param {*} redEnvelopeId 红包id
 * @returns
 */
export async function receiveRedEnvelope(redEnvelopeId){
    const result = await api({
        url: '/api/wechat/topic/receiveRedEnvelope',
        method: 'POST',
        showLoading: false,
        body: {redEnvelopeId}
    });
    if(result.state.code === 0){
        return result.data
    }
}

/**
 * 获取课堂红包账户信息
 * @export
 * @param {*} redEnvelopeId 红包id
 * @returns
 */
export async function getMyReceiveDetail(redEnvelopeId){
    const result = await api({
        url: '/api/wechat/topic/getMyReceiveDetail',
        method: 'POST',
        showLoading: false,
        body: {redEnvelopeId}
    });
    if(result.state.code === 0){
        return result.data
    }
}

/* 获取独立域名 */
export async function getDomainUrl(params){
    return await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/getDomainUrl',
        body: params,
    });
}

/* 获取珊瑚课程信息 */
export async function getPersonCourseInfo(params){
    return await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/coral/getPersonCourseInfo',
        body: params,
    });
}

/**
 * 绑定直播间分销关系
 * @return {[type]} [description]
 */
export async function bindLiveShare(liveId, shareKey) {
    return await api({
        method: "POST",
        showLoading: false,
        url: '/api/wechat/channel/bind-live-share',
        body: {
            liveId,
            shareKey,
        }
    });
}

// 是否设置一次性订阅开播提醒，话题详情页调用
export async function oneTimePushSubcirbeStatus(topicId) {
    return await api({
        method: "POST",
        showLoading: false,
        url: '/api/wechat/topic/oneTimePushSubcirbeStatus',
        body: { returnUrl: window.location.href, topicId }
    });
}

/** 
 * 获取优惠券所有的优惠券数
*/
export async function getCouponAllCount(liveId,businessType, businessId) {
    return await api({
        method: "GET",
        showLoading: false,
        url: '/api/wechat/coupon/allCount',
        body: {
            liveId,
            businessType,
            businessId,
        }
    });
}



/** 分享完成添加评论 */
export function addShareComment ({userId,liveId,topicId}) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips: false,
            errorResolve:true,
            url: '/api/wechat/topic/addShareComment',
            body: {
                userId,
                liveId,
                topicId
            },
            method: 'POST'
        });
    }
}

