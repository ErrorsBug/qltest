import {
    appendSpeak,
    appendBannedTip,
    removeSpeak,
    finishTopic,
    appendRewardTip,
    appendRewardBullet,
    setRewordDisplayStatus,
    updateMute,
    updateBrowseNum,
    updateGuestList,
    addGuest,
    appendFinishTopicTip,
    addCommentNum,
    decreaseCommentNum,
} from './thousand-live-common';

import {
    addComment,
    deleteComment,
    appendComment,
    appendQuestion,
    setCommentList,
    setQuestionList,
    whoTyping,
    updateTextOpen,
    updateAudioOpen,
    updatePPT,
    updateLikesNum,
    updateBarrageList,
    deleteBarrageItem,
    updateCommentIndex,
    removeLuckyMoney,
    updateOutline,
} from './thousand-live-normal'
import {
    updatePushStatus
} from './thousand-live-av'


import fetch from 'isomorphic-fetch';
import bufferQueue from 'components/buffer-queue';


// websocket请求链接
// let wsUrl = 'wss://ws-h5.qianliao.cn/websocket';
// if (typeof(window) !== 'undefined') {
//     if(!/(qlchat)/.test(window.location.href)|| /(dev\.m.qlchat)/.test(window.location.href)){
//         wsUrl = 'ws://h5ws.dev1.qlchat.com/websocket';
//     } else if(/(test.*\.m.qlchat)/.test(window.location.href)){
//         wsUrl = `ws://ws.${window.location.host}/websocket`;
//     }
// }

// websocket请求链接
let wsUrl = typeof window != 'undefined' && window.__WSURL__ || 'wss://ws-h5.qianliao.cn/websocket';

let socket = null;
// 连接类型
let pushType = 'WEISOCKET';
// websocket上次接受的时间
let prevTime = 0;
// websocket接收信息的id
let idx = 0;
// 重试次数
let errTime = 0;
// sessionId
let sid = '';
let topicId = undefined;
let userId = undefined;
let currentTimeMillis = 0;

let dispatch = null;
let getStore = null;


export function startSocket (_sid, _topicId, _userId, _currentTimeMillis) {

    return (_dispatch, _getStore) => {
        dispatch = _dispatch;
        getStore = _getStore;
        sid = _sid;
        topicId = _topicId;
        userId = _userId;
        currentTimeMillis = _currentTimeMillis;
        openSocket();

        // 初始化前先注销已有缓存, 防止单页面切换会重复注册
        bufferQueue.unregisterBuffer('normalSpeak');
	    bufferQueue.unregisterBuffer('comment');
	    bufferQueue.unregisterBuffer('comment-cache');
	    bufferQueue.unregisterBuffer('redpackBullet');
	    bufferQueue.unregisterBuffer('barrageList');

        // 初始化缓存
        bufferQueue.registerBuffer({
            type: 'normalSpeak',
            limit: 5,
            method: 'FLUSH',
            handler: (items) => {
                dispatch(appendSpeak(items));
            }
        });

        bufferQueue.registerBuffer({
            type: 'comment',
            limit: 5,
            method: 'FLUSH',
            handler: (items) => {

                const curIndex = getStore().thousandLive.commentIndex;
                if (getStore().thousandLive.openCacheModel) {
                    dispatch(updateCommentIndex(curIndex + items.length));
                }
                dispatch(appendComment(items.reverse()));
                dispatch(addCommentNum(items.length));
                const questions = items.filter((item) => {
                    return item.isQuestion === 'Y';
                })
                dispatch(appendQuestion(questions));
            }
        });


        bufferQueue.registerBuffer({
            type: 'comment-cache',
            limit: 5,
            method: 'FLUSH',
            handler: (items) => {
                dispatch(appendComment(items.reverse()));
                dispatch(addCommentNum(items.length));
                const questions = items.filter((item) => {
                    return item.isQuestion === 'Y';
                })
                dispatch(appendQuestion(questions));
            }
        });

        bufferQueue.registerBuffer({
            type: 'redpackBullet',
            limit: 5,
            method: 'FLUSH',
            handler:  (items) => {
                dispatch(appendRewardBullet(items));
            }
        });

        bufferQueue.registerBuffer({
            type: 'barrageList',
            limit: 20,
            method: 'AUTO_DEQUEUE',
            handler:  (item) => {
                dispatch(updateBarrageList(item));
            }
        });

        bufferQueue.setGlobalTimer(1000);

        return socket;
    }
}


function openSocket () {
    if (typeof WebSocket == 'undefined') {
        requestHTTPPush({sid, topicId, prevTime, idx});
        return;
    }

    socket = new WebSocket(wsUrl + '?_time=' + Date.now());
    // window.qlSocket = socket;
    socket.onerror = (event) => {
        console.error(event);
    };

    socket.onclose = (event) => {
        if (errTime > 3) {
            pushType = 'HTTP';
            requestHTTPPush({sid, topicId, prevTime, idx})
            return;
        }

        if (pushType != 'HTTP') {
            setTimeout(() => {
                errTime++;
                openSocket();
            }, 1000);
        }
    };

    socket.onopen = (event) => {
        socket.send(JSON.stringify({sid: sid, topicId: topicId, prevTime: prevTime, idx: idx}));
    };

    socket.onmessage = (event) => {

        const result = JSON.parse(event.data);

        if (result.status == 200) {
            errTime = 0;
            resultHandler(result);
        } else {
            console.log('ws message:', result);
        }

    };
}

function requestHTTPPush () {
    let baseUrl = '';

    if (window.location.origin.indexOf('m.qlchat.com') > -1) {
        baseUrl = 'https://rs.qlchat.com:8080';
    } else if (/(localhost)/gi.test(window.location.origin)) {
        baseUrl = 'http://m.dev1.qlchat.com';
    }

    Promise.race([
        new Promise((resolve, reject) => {
            setTimeout(reject, 3000);
        }),

        fetch(`${baseUrl}/push/receive.htm?sid=${sid}&id=${topicId}&prevTime=${prevTime ? prevTime : ''}&idx=${idx}&msgType=public&dir=LIVE`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            mode: 'cors',
            // credentials: 'include',

        })
    ])
    .then(async (res) => {
        let result = null;
        try {
            result = await res.text();
            result = result && JSON.parse(result);
        } catch (error) {
            console.error(error);
        }

        return result;
    })
    .then((json) => {
        if (json && json.status == 200) {
            prevTime = json.prevTime;
            idx = json.idx;
            resultHandler(json);
        }
        setTimeout(() => {
            requestHTTPPush();
        }, 3000);
    })
    .catch(err => {
        console.log(err);
        setTimeout(() => {
            requestHTTPPush();
        }, 3000);
    });

}

/**
 * socket接受信息的处理
 *
 * @param {any} result
 */
function resultHandler (result) {
    // console.log('result.list dd --->', result.list, result.list && result.list.length > 0);


    if (result.onLineNum != 0) {
        // 更新线上人数
        dispatch(updateBrowseNum(result.onLineNum));
    }

    result.list.forEach((item) => {

        let __item = null;
        try {
            __item = typeof item === 'string' ? JSON.parse(item) : item;
        } catch (error) {
            console.error(error);
        }

        if (!__item) {
            return;
        }

        let createTime;
        if (typeof(__item.updateTime) == 'object' && __item.updateTime != null && typeof (__item.updateTime.time) != 'undefined') {
            createTime = __item.updateTime.time;
        } else if (typeof (__item.updateTime) == 'string' || typeof(__item.updateTime) == 'number' ) {
            createTime = __item.updateTime;
        } else if (typeof (__item.checkTime) == 'object' && __item.checkTime != null && typeof (__item.checkTime.time) != 'undefined') {
            // 此处兼容PPT推动对象
            createTime = __item.checkTime.time;
        } else if (typeof(__item.endTime) == 'object' &&  __item.endTime != null && typeof(__item.endTime.time) != 'undefined') {
            // 此处话题结束
            createTime = __item.endTime.time;
        } else if (typeof(__item.createTime) == 'object' &&  __item.createTime != null && typeof(__item.createTime.time) != 'undefined') {
            createTime = __item.createTime.time;
        } else if (typeof(__item.createTime) == 'string' || typeof(__item.createTime) == 'number' ) {
            createTime = __item.createTime;
        } else {
            createTime = false;
        }

        // 如果该推送是进入话题前的操作则不处理
        if (createTime && currentTimeMillis - createTime > 5000 && !/(deleteComment)/.test(__item.pushExp)) {
            // console.log('---------丢弃---------');
            // console.log('时间差：',currentTimeMillis - createTime);
            // console.log()
            return;
        }


        if (__item.pushExp === 'comment') {
            // console.log('----------评论---pass--------');
            // console.log('id: ', __item.id);
            // console.log('时间差', currentTimeMillis - createTime);
            // console.log('createTime: ',createTime);
        }
        if (pushType != 'HTTP') {
            prevTime = __item.dateStr;
        }
        // console.log('websocket push: ', __item.pushExp);
        switch (__item.pushExp) {
            case 'speak':
                if(__item.type === 'redpacket') {
                    // 赞赏
                    bufferQueue.enqueue('redpackBullet', __item);
                }
                if (!getStore().thousandLive.canAddSpeak) {
                    return;
                }
                if (getStore().thousandLive.teacherOnly && __item.creatorRole == 'visitor') {
                    return;
                }
                // 更新提纲
                if( __item.type === 'outline') {
                    dispatch(updateOutline('send',{...__item,id:__item.outlineId,speakTime:__item.createTime}));
                }
                if (__item.type === 'redpacket' && getStore().thousandLive.showReword) {
                    bufferQueue.enqueue('normalSpeak', __item);
                } else if (__item.type != 'redpacket') {
                    bufferQueue.enqueue('normalSpeak', __item);
                }
                break;

            case 'deleteSpeak':
                // 更新提纲
                if( __item.type === 'outline') {
                    dispatch(updateOutline('remove',{...__item,id:__item.outlineId}));
                }
                // 删除发言
                bufferQueue.remove('normalSpeak', __item.id)
                dispatch(removeSpeak(__item));
                // todo 删除缓存
                break;

            case 'liveEnd':
                // 直播结束
                dispatch(appendFinishTopicTip(__item));
                dispatch(finishTopic());
                break;

            case 'inviteAdd':
                dispatch(addGuest(__item));
                break;

            case 'changeSpeaker':
                if (__item.params) {
                    dispatch(whoTyping(__item.params));
                } else {
                    dispatch(whoTyping(__item));
                }
                break;

            case 'inviteModify':
                // 修改头衔
                dispatch(updateGuestList(__item));
                break;

            case 'banned':
                // 禁言
                dispatch(appendBannedTip(__item));
                dispatch(updateMute(__item.isBanned));
                break;

            case 'barrageFlag':
                // 关闭打开红包流
                dispatch(removeLuckyMoney(__item.barrageFlag));
                dispatch(setRewordDisplayStatus(__item.barrageFlag));
                break;
            case 'comment':
                bufferQueue.enqueue('comment', __item);
                bufferQueue.enqueue('barrageList', __item);
                break;
            case 'changePPTFile':
                dispatch(updatePPT(__item));
                break;
            case 'deleteComment':
                bufferQueue.remove('comment', __item.id);
                bufferQueue.remove('barrageList', __item.id);
                const commentList = getStore().thousandLive.commentList;
                const questionList = getStore().thousandLive.questionList;
                const filterCommentList = commentList.filter((comment) => __item.id !== comment.id);
                const filterQuestionList = questionList.filter((question) => __item.id !== question.id);
                dispatch(deleteBarrageItem(__item.id));
                dispatch(setCommentList(filterCommentList));
                dispatch(setQuestionList(filterQuestionList));
                dispatch(decreaseCommentNum());
                break;
            case 'isTextOpen':
                dispatch(updateTextOpen(__item.isTextOpen));
                break;
            case 'isAudioOpen':
                dispatch(updateAudioOpen(__item.isAudioOpen));
                break;

            case 'speakLikes':
                dispatch(updateLikesNum(__item.likesNum, __item.id));
                break;
            case 'liveStatus':
                dispatch(updatePushStatus(__item.pushStatus));
                break;

            default:
                break;
        }
    });
}
