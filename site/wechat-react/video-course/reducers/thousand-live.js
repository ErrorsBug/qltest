import {
    SET_SPEAK_LIST,
    ADD_FORUM_SPEAK,
    UPDATE_FORUM_SPEAK,
    REVOKE_FORUM_SPEAK,
    APPEND_SPEAK,
    ADD_DEL_SPEAK,
    UPDATE_TOTAL_SPEAKLIST,
    UPDATE_GUEST_LIST,
    SET_MUTE,
    SET_CAN_ADD_SPEAK,
    INSERT_NEW_MSG,
    SET_TOPIC_PROFILE,
    SET_CHANNEL_PROFILE,
    INIT_FOCUS_INFO,
    APPEND_FINISH_TOPIC_TIP,
    FINISH_TOPIC
} from '../../thousand-live/actions/thousand-live-common';
import {
    UPDATE_REDENVELOPE,
} from '../../thousand-live/actions/thousand-live-normal';
import {
    TOGGLE_TEACHER_ONLY
} from '../../thousand-live/actions/thousand-live-av';
import {
    INIT_THOUSAND_LIVE_TOPIC_INFO,
    
} from '../actions/video';

// 话题详情页使用

var initState = {
    // sessionId
    sid: '',
    topicInfo:{},
    forumSpeakList: [],
    // 全部的发言列表
    totalSpeakList: [],
    // 当前发言列表的头部在总发言列表的下标，0开始
    curSpeakIndex: 0,
    // 是否只看讲师
    teacherOnly: false,
    // 是否可以从socket读取发言加入信息流
    canAddSpeak: false,
    // 是否有新消息插入了
    insertNewMsg: 1,
    // 话题简介
    topicProfile:[],
    // 系列课简介
    channelProfile: [],
    // 是否关注
    isSubscribe: {
        isFocusThree:false,
        isShowQl :false,
        subscribe:false,
        isBindThird:false,
    },

}

export function thousandLive(state = initState, action) {
    switch (action.type) {
        case INIT_THOUSAND_LIVE_TOPIC_INFO:
            return {
                ...state,
                topicInfo: action.topicInfo
            }
        case SET_SPEAK_LIST: 
            return {
                ...state,
                forumSpeakList: [...action.forumSpeakList],
                totalSpeakList: [...action.totalSpeakList],
                curSpeakIndex: action.curSpeakIndex,
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
        case APPEND_SPEAK:

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
        case TOGGLE_TEACHER_ONLY:
            return {
                ...state,
                teacherOnly: action.isOpen,
            }
        case SET_CAN_ADD_SPEAK:
            return {
                ...state,
                canAddSpeak: action.canAddSpeak
            }
        case INSERT_NEW_MSG:
            return {
                ...state,
                insertNewMsg: state.insertNewMsg  + 1,
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
        case INIT_FOCUS_INFO:
            return {
                ...state,
                isSubscribe: { ...state.isSubscribe, ...action.isSubscribe},
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