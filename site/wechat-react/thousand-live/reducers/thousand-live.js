
import {
    SET_LIVE_VOLUME,
    TOGGLE_TEACHER_ONLY,
    UPDATE_PUSH_STATUS,
} from '../actions/thousand-live-av';

import {
    SET_COMMENT_LIST,
    SET_QUESTION_LIST,
    APPEND_COMMENT,
    APPEND_QUESTION,
    SET_SHARE_RANK_ITEMS,
	INIT_MATERIAL_LIST,
	ADD_MATERIAL,
	REMOVE_MATERIAL,
	SORT_MATERIAL_LIST,
	SORT_UP_MATERIAL,
	SORT_DOWN_MATERIAL,
	RESET_MATERIAL,
    CHANGE_SPEAKER,
    UPDATE_TEXT_OPEN,
    UPDATE_AUDIO_OPEN,
    UPDATE_TOTAL_SPEAKLIST,
	UPDATE_REPLY_SPEAK,
	CLEAR_REPLY_SPEAK,
	UPDATE_MATERIAL,
    DELETE_COMMENT,
    UPDATE_LIKES_NUM,
    SET_BARRAGE_LIST,
    UPDATE_COMMENT_INDEX,
    SET_COMMENT_CACHE_MODEL,
    FIRST_MSG_CODE,
    SET_CAN_POP_DOWNLOAD_BAR,
    UPDATE_OUTLINE_LIST,
    UPDATE_REDENVELOPE,
} from '../actions/thousand-live-normal';


import {
    ADD_FORUM_SPEAK,
    UPDATE_FORUM_SPEAK,
    REVOKE_FORUM_SPEAK,
    INIT_PAGE_DATA,
    APPEND_SPEAK,
    SET_MUTE,
    SET_REWORD_DISPLAY,
    APPEND_BANNED_TIP,
    APPEND_FINISH_TOPIC_TIP,
    FINISH_TOPIC,
    APPEND_REWARD_TIP,
    REWARD_BULLET_SHIFT,
    SHOW_REWARD_BULLET,
    SHOOT_REWARD_BULLET,
    FOLLOW_LIVE,
    SET_CAN_ADD_SPEAK,
    UPDATE_BROWSE_NUM,
    UPDATE_GUEST_LIST,
    INSERT_NEW_MSG,
    SET_LIKE_SET,
    THOUSAND_LIVE_SET_LSHARE_KEY,
    INIT_FOCUS_INFO,
    UPDATE_LIKE_NUMBER,
    INIT_THOUSAND_LIVE_TOPIC_INFO,
    UPDATE_POWER,
    SET_SPEAK_LIST,
    UPDATE_NO_MORE_SPEAK,
    ADD_COMMENT_NUM,
    DECEREASE_COMMENT_NUM,
    APPEND_REWARD_BULLET,
    INIT_PUSH_COMPLITE,
    TOGGLE_APP_DOWNLOAD_OPEN,
    SET_TOPIC_PROFILE,
    SET_CHANNEL_PROFILE,
    ADD_DEL_SPEAK,
    UPDATE_CUR_TIME,
    GET_SHARE_COMMENT_CONFIG
} from '../actions/thousand-live-common';

// 话题详情页使用

var initState = {
    // sessionId
    sid: '',
    // 话题基本数据
    topicInfo: {},
    shareRankCardItems: [],
    //发言列表数据（当前显示的发言列表）
    forumSpeakList: [],
    // 全部的发言列表
    totalSpeakList: [],
    // 当前发言列表的头部在总发言列表的下标，0开始
    curSpeakIndex: 0,
    //最近一条被老师回复消息
    currentReplySpeak: '',
    // 评论列表数据
    commentList: [],
    // 问题列表数据
    questionList: [],
    // 弹幕列表
    barrageList: [],
    // 判断是否禁言
    mute: false,
    // 是否显示打赏
    showReword: true,
    // 是否只看讲师
    teacherOnly: false,
    // 是否设置了开课提醒
    isAlert: false,
    // 是否关注话题
    isFollow: false,
    // 直播声音控制（【0.0~1.0】）
    liveVolume: 1,

    isShowBullet:false,//弹幕显示
    isShootBullet:false,//弹幕发射
    // 弹幕红包
    rewardBulletList:[],
    // 是否可以从socket读取发言加入信息流
    canAddSpeak: false,
    // 是否有新消息插入了
    insertNewMsg: 1,
    // 消息流从哪里开始播放
    fromWhere: 'first',
    // 当前用户的userId
    currentUserId: null,
    // 当前浏览人数
    browseNum: 0,
    // 嘉宾列表
    inviteListArr:{},
    // 正在输入
    whoTyping: '',
    // 成为金句的点赞数
    likesSet: 50,
	// 素材库列表
    materialList: [],
	// PPT列表
    pptList: [],
    // 服务端渲染加载方式
    beforeOrAfter : 'after',
    // 用户分销关系
    lshareKey: {},
    // 是否开始文字上麦
    isTextOpen: 'N',
    // 是否开始音频上麦
    isAudioOpen: 'N',
    // 加载前50个speak item用到
    noMoreSpeakList: false,
    // 被删除的消息
    delMsg:null,
    // 是否登录
    isLogin: false,
    // 用户权限
    power: {
        allowSpeak:false,
        allowMGLive :false,
        allowDelComment:false,
    },
    // 是否关注
    isSubscribe: {
        isFocusThree:false,
        isShowQl :false,
        subscribe:false,
        isBindThird:false,
    },
    commentIndex: 0,
    openCacheModel: false,
    //推送成就卡的信息
    pushCompliteInfo:{},
    // 第一条消息的二维码
    firstMsgCode:'',
    // 这是是否弹出app下载的条条
    popAppDownloadBar: false,
    // 话题简介
    topicProfile:[],
    // 系列课简介
    channelProfile: [],
    // 提纲列表
    outlineList: [],
    // // 分享评论开关
    shareCommentConfigFlag: 'N'
}

export function thousandLive(state = initState, action) {
    switch (action.type) {
        case SET_SPEAK_LIST: 
            return {
                ...state,
                forumSpeakList: [...action.forumSpeakList],
                totalSpeakList: [...action.totalSpeakList],
                curSpeakIndex: action.curSpeakIndex,
            }
        case INIT_THOUSAND_LIVE_TOPIC_INFO:
            return {
                ...state,
                topicInfo: action.topicInfo
            }
        case INIT_PUSH_COMPLITE:{
            return {
                ...state,
                pushCompliteInfo: action.pushCompliteInfo,
                getnowTopicVideoCount: action.getnowTopicVideoCount,
            }
        }
        case ADD_FORUM_SPEAK:
            const totalSpeakList = [...action.totalSpeakList];
            let forumSpeakList = state.forumSpeakList.length == 0 ? totalSpeakList : state.forumSpeakList;
            
            return {
                ...state,
                totalSpeakList,
                forumSpeakList: totalSpeakList.slice(state.curSpeakIndex, state.curSpeakIndex + forumSpeakList.length+1)
            }
        case UPDATE_FORUM_SPEAK:
            const thisTotalSpeakList = [...action.totalSpeakList];
            let thisForumSpeakList = action.forumSpeakList ? [...action.forumSpeakList] : state.forumSpeakList;
            
            return {
                ...state,
                totalSpeakList:thisTotalSpeakList,
                forumSpeakList: thisTotalSpeakList.slice(state.curSpeakIndex, state.curSpeakIndex + thisForumSpeakList.length+1)
            }
        case UPDATE_TOTAL_SPEAKLIST:
            return {
                ...state,
                totalSpeakList: [...action.totalSpeakList]
            }
        case INIT_PAGE_DATA:
            return {
                ...state,
                ...action.pageData,
            }
        case SET_SHARE_RANK_ITEMS:
            return {
                ...state,
                shareRankCardItems: action.cardItems,
            };
        case APPEND_SPEAK:
            // let resultSpeakList = [...state.totalSpeakList, ...action.speakPoList];
            // let curSpeakList = state.forumSpeakList;

            // // 判断是加载最后一块list，就可以往forumSpeakList里面添加数据
            // if (state.canAddSpeak) {
            //     // if (state.curSpeakIndex + state.forumSpeakList.length == state.totalSpeakList.length) {   
            //     // }
            //     curSpeakList = [...curSpeakList, ...action.speakPoList];
            // }

            return {
                ...state,
                forumSpeakList: [...action.curSpeakList],
                totalSpeakList: [...action.totalSpeakList],
            }
        case REVOKE_FORUM_SPEAK:
            return {
                ...state,
                forumSpeakList: state.forumSpeakList.filter(data => data.id !== action.id),
                totalSpeakList: state.totalSpeakList.filter(data => data.id !== action.id),
                delMsg:{type:action.speakType,id:action.id,content:action.content}
            }
        case SET_MUTE:
            return {
                ...state,
                mute: action.isBanned === 'Y',
            }
        case SET_REWORD_DISPLAY:
            return {
                ...state,
                showReword: action.status === 'N',
            }
        case TOGGLE_TEACHER_ONLY:
            return {
                ...state,
                teacherOnly: action.isOpen,
            }
        case APPEND_BANNED_TIP:
            return {
                ...state,
                forumSpeakList: [...state.forumSpeakList, action.tipContent],
                totalSpeakList: [...state.totalSpeakList, action.tipContent],
            }
        case APPEND_FINISH_TOPIC_TIP:
            return {
                ...state,
                forumSpeakList: [...state.forumSpeakList, action.tipContent],
                totalSpeakList: [...state.totalSpeakList, action.tipContent],
            }
        case FINISH_TOPIC:

            return {
                ...state,
                topicInfo: {...state.topicInfo, status:'ended'},
            }
        case APPEND_REWARD_TIP:
            return {
                ...state,
                forumSpeakList: [...state.forumSpeakList, action.tipContent],
                totalSpeakList: [...state.totalSpeakList, action.tipContent],
            };
        case APPEND_REWARD_BULLET:
            return {
                ...state,
                rewardBulletList: [...state.rewardBulletList, ...action.newBulletList]
            }
        case REWARD_BULLET_SHIFT:
            let rewardBulletList = state.rewardBulletList;
            rewardBulletList.shift();
            return {
                ...state,
                rewardBulletList: [...rewardBulletList]
            }
        case SHOW_REWARD_BULLET:
            return {
                ...state,
                isShowBullet: action.status,
            };
        case SHOOT_REWARD_BULLET:
            return {
                ...state,
                isShootBullet: action.status,
            };
        case FOLLOW_LIVE:
            return {
                ...state,
                isFollow: action.isFollow,
            }
        case SET_LIVE_VOLUME:
            return {
                ...state,
                liveVolume: action.volume,
            };
        case SET_CAN_ADD_SPEAK:
            return {
                ...state,
                canAddSpeak: action.canAddSpeak
            }
        case UPDATE_BROWSE_NUM:
            return {
                ...state,
                browseNum: action.browseNum
            }
        case UPDATE_GUEST_LIST:
            return {
                ...state,
                inviteListArr: { ...action.inviteListArr },
            }
        case INSERT_NEW_MSG:
            return {
                ...state,
                insertNewMsg: state.insertNewMsg  + 1,
            }
        case SET_COMMENT_LIST:
            return {
                ...state,
                commentList: [...action.commentList],
            }
        case SET_QUESTION_LIST:
            return {
                ...state,
                questionList: [...action.questionList],
            }
        case SET_BARRAGE_LIST:
            return {
                ...state,
                barrageList: [...action.barrageList],
            }
        case APPEND_COMMENT:
            return {
                ...state,
                commentList: [...action.commentList, ...state.commentList,],
            }
        case APPEND_QUESTION:
            return {
                ...state,
                questionList: [...state.questionList, ...action.questionList],
            }
        case SET_LIKE_SET:
            return {
                ...state,
                likesSet: action.likesSet
            }
	    case INIT_MATERIAL_LIST:
	    	return {
			    ...state,
			    materialList: action.materialList,
                pptList: action.materialList.filter((item) => { return item.status == 'Y' }),
            }
        case UPDATE_MATERIAL:
	    	return {
			    ...state,
                materialList: [...action.newMaterial],
                pptList: [...action.newPPTList],
		    }
        case ADD_MATERIAL:
            let addNewPPTList = action.pptList || action.newMaterial.filter((item) => { return item.status == 'Y' });
	    	return {
			    ...state,
                materialList: [...state.materialList, ...action.newMaterial],
                pptList: [...state.pptList, ...addNewPPTList],
		    }
	    case REMOVE_MATERIAL:
	    	return {
			    ...state,
			    materialList: state.materialList.filter((material) => {
				    return material.id !== action.removedId
			    }),
			    pptList: state.pptList.filter((material) => {
				    return material.id !== action.removedId
			    })
		    }
	    case SORT_UP_MATERIAL:
		    if(action.index === 0) return;
		    var materialList = [...state.materialList];
		    materialList[action.index - 1] = materialList.splice(action.index,1,materialList[action.index - 1])[0];
	    	return {
			    ...state,
			    materialList: materialList,
			    pptList: materialList.filter((item) => { return item.status == 'Y' }),
		    }
	    case SORT_DOWN_MATERIAL:
		    if(action.index === state.materialList.length - 1) return;
		    var materialList = [...state.materialList];
		    materialList[action.index + 1] = materialList.splice(action.index,1,materialList[action.index + 1])[0];
		    return {
			    ...state,
                materialList: materialList,
                pptList: materialList.filter((item) => { return item.status == 'Y' }),
		    }
	    case RESET_MATERIAL:
	    	return {
			    ...state,
                materialList: action.materialList,
                pptList:  action.materialList.filter((item) => { return item.status == 'Y' }),
		    }
	    case CHANGE_SPEAKER:
	    	return {
			    ...state,
			    whoTyping: action.whoTyping
		    }
        case THOUSAND_LIVE_SET_LSHARE_KEY:
            return {
                ...state,
                lshareKey: action.lshareKey,
            }
        case INIT_FOCUS_INFO:
            return {
                ...state,
                isSubscribe: { ...state.isSubscribe, ...action.isSubscribe},
            }
        case UPDATE_TEXT_OPEN:
            return {
                ...state,
                isTextOpen: action.status,
            }
        case UPDATE_AUDIO_OPEN:
            return {
                ...state,
                isAudioOpen: action.status,
            }
        case UPDATE_LIKE_NUMBER:
            return {
                ...state,
                forumSpeakList: state.forumSpeakList.map(item => {
                    if (item.id == action.speakId) {
                        item.likesNum = action.likesNum;
                        item.isLikes = true;
                    }

                    return item;
                }),
                totalSpeakList: state.totalSpeakList.map(item => {
                    if (item.id == action.speakId) {
                        item.likesNum = action.likesNum;
                        item.isLikes = true;
                    }

                    return item;
                }),
            }
        case UPDATE_NO_MORE_SPEAK:
            return {
                ...state,
                noMoreSpeakList: action.noMore,
            }
	    case UPDATE_REPLY_SPEAK:
	    	return {
			    ...state,
			    currentReplySpeak: action.currentReplySpeak
		    }
	    case CLEAR_REPLY_SPEAK:
	    	return {
			    ...state,
			    currentReplySpeak: ''
		    }
	    case UPDATE_POWER:
	    	return {
			    ...state,
			    power: {...state.power, ...action.parmas},
		    }
        case DELETE_COMMENT:
            return {
                ...state,
                commentList: state.commentList.filter(item => item.id != action.commentId),
                questionList: state.questionList.filter(item => item.id != action.commentId),
            }
        case UPDATE_LIKES_NUM:
            return {
                ...state,
                forumSpeakList: state.forumSpeakList.map(item => {
                    if (item.id == action.id) {
                        item.likesNum = action.likesNum;
                    }

                    return item;
                }),
                totalSpeakList: state.totalSpeakList.map(item => {
                    if (item.id == action.id) {
                        item.likesNum = action.likesNum;
                    }

                    return item;
                })
            }
        case ADD_COMMENT_NUM:
            return{
                ...state,
                topicInfo: {
                    ...state.topicInfo,
                    commentNum: state.topicInfo.commentNum + action.num,
                }
            }
        case DECEREASE_COMMENT_NUM:
            return {
                ...state,
                topicInfo: {
                    ...state.topicInfo,
                    commentNum: state.topicInfo.commentNum - action.num,
                }
            }
        
        case UPDATE_COMMENT_INDEX:
            return {
                ...state,
                commentIndex: action.idx,
            }
        case SET_COMMENT_CACHE_MODEL:
            return {
                ...state,
                openCacheModel: action.isCache,
            }
        case FIRST_MSG_CODE:
            return {
                ...state,
                firstMsgCode: action.url
            }
        case SET_CAN_POP_DOWNLOAD_BAR:
            return {
                ...state,
                popAppDownloadBar: action.popAppDownloadBar
            }
        case TOGGLE_APP_DOWNLOAD_OPEN:
            return {
                ...state,
                topicInfo: { ...state.topicInfo, isOpenAppDownload: action.isOpen }
            }
        case SET_TOPIC_PROFILE:
            return {
                ...state,
                topicProfile: action.profile
            }
        case SET_CHANNEL_PROFILE:
            return {
                ...state,
                channelProfile: action.profile
            }
        
        case ADD_DEL_SPEAK:
            return {
                ...state,
                delSpeakIdList: action.delSpeakIdList
            }
        case UPDATE_OUTLINE_LIST:
            return {
                ...state,
                outlineList: action.outlineList
            }
        case UPDATE_PUSH_STATUS:
            return {
                ...state,
                pushStatus: action.status
            }
        case UPDATE_CUR_TIME:
            return {
                ...state,
                topicInfo: {...action.topicInfo}
            }
        case UPDATE_REDENVELOPE:
            return {
                ...state,
                forumSpeakList: state.forumSpeakList.map((item) => {
                    if(item.commentId == action.id || item.relateId == action.id){
                        return {
                            ...item,
                            desc: action.status
                        }
                    }else {
                        return item
                    }
                })
            }
        case GET_SHARE_COMMENT_CONFIG:
            return {
                ...state,
                shareCommentConfigFlag: action.flag
            }
        default:
            return state;
    }
};

/**
 * 兼容一个后端问题，就是speak列表的头部可能还会有其他发言
 * @param {Array} speakList 发言列表
 */
function fixStartSpeak(speakList) {
    if (speakList.length > 2 && 
        speakList[speakList.length - 2].type == 'start'
    ) {
            const temp = speakList[speakList.length - 1];
            speakList[speakList.length - 1] = speakList[speakList.length - 2];
            speakList[speakList.length - 2] = temp;
    }

    return speakList;
}