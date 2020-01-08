import {
    INIT_LIVE_INFO,
    INIT_LIVE_REALNAME,
    INIT_LIVE_SYMBOL,
    INIT_POWER,
    INIT_LIVE_TIMELINE,
    INIT_LIVE_FOCUS_STATES,
    SET_PREVIEW_COURSE_LIST,
    SET_PURCHASED_COURSE_LIST,

    CHANGE_TIMELINE_INDEX,
    CHANGE_CHANNEL_INDEX,
    CHANGE_TOPIC_INDEX,

    LOAD_TIMELINE,
    SET_BANNER_LIST,
    LOAD_BANNER_CHANNEL_LIST,
    LOAD_BANNER_TOPIC_LIST,
    FOCUS_LIVE,
    LIVE_LIKE_ACTION,
    LIVE_DELETE_TIMELINE,
    CHANNEL_AND_TOPIC_NUM,
    LIVE_GET_CHANNEL,
    LIVE_GET_TOPIC,
    GET_LIVE_INTRO_PHOTO_LIST,
    LIVE_SET_ALERT,
    SET_LIVE_FOCUS_STATES,
    LIVE_SET_FOLLOW_NUM,
    SET_AUDITED_STATUES,
    INIT_PUSH_NUM,

    UPDATE_LIVE_TOPIC_LIST,
    REMOVE_LIVE_TOPIC_ITEM,
    UPDATE_LIVE_CHANNEL_LIST,
    REMOVE_LIVE_CHANNEL_ITEM,
    SET_VIP_INFO,
    TOGGLE_DISPLAY_MENU,
    INIT_EXTEND_DATA,

    INIT_SHARE_QUALITY,
    CLEAN_LIVE_TIMELINE,
    FETCH_LIVE_ROLE
} from '../actions/live';

var initState = {
    live:[],
    // realNameInfo:{},
    realStatus:{},

    liveInfo:{
        entity: {
            id: 0
        }
    },
    liveSymbol: [],
    power:{
        allowMGLive: false,
    },

    auditedStatues: false,
    focusStatues: {},

    // 已购课程
    purchasedCourseList: [],
    // 课程预告列表
    previewCourseList: [],

    timeline: [],
    timelineIdx: 0,
    timelinePage: 1,
    noMoreTimeline: false,

    topicNum: 0,
    channelNum: 0,

    topicList: [],
    topicIdx: 0,
    topicPage: 1,
    noMoreTopic: false,

    mgrBannerList: [],
    liveBannerTypes: {
        channelList: [],
        topicList: [],
    },

    channelList: [],
    channelIdx: 0,
    channelPage: 1,
    noMoreChannel: false,

    liveIntroPhotoList: [],
    vipInfo: {},
    shareQualify: {},
    pushMaxNum: 0,
    todayPushNum: 0,
    role: ''
}

export function live(state = initState, action) {
    let timeline ;
    switch (action.type) {
        case INIT_LIVE_INFO:
            return {
                ...state,
                liveInfo: action.data
            }
        case INIT_EXTEND_DATA:
            return {
                ...state,
                liveInfo: { ...state.liveInfo, ...action.data }
            }
        case LIVE_SET_FOLLOW_NUM: 
            return {
                ...state,
                liveInfo: {
                    ...state.liveInfo,
                    entity: {
                        ...state.liveInfo.entity,
                        fansNum: action.data
                    }
                }
            }
        case INIT_LIVE_REALNAME:
            return {
                ...state,
                realStatus: action.realStatus,
                // realNameInfo : action.realNameInfo,
                power : action.power,
            }
        case INIT_LIVE_SYMBOL:
            return {
                ...state,
                liveSymbol: action.data
            }
        case INIT_POWER:
            return {
                ...state,
                power: action.data
            }

        case INIT_LIVE_FOCUS_STATES:
            return {
                ...state,
                focusStatues: action.data
            }
        case INIT_SHARE_QUALITY:
            return {
                ...state,
                shareQualify: action.data
            }
        case SET_LIVE_FOCUS_STATES:
            return {
                ...state,
                focusStatues: {
                    ...state.focusStatues,
                    ...action.data
                }
            }
        
        case FOCUS_LIVE:
            return {
                ...state,
                focusStatues: {
                    ...state.focusStatues,
                    isFollow: action.data.isFollow,
                    isAlert: action.data.isAlert,
                },
                liveInfo: {
                    ...state.liveInfo,
                    entity: {
                        ...state.liveInfo.entity,
                        fansNum: action.data.isFollow ? state.liveInfo.entity.fansNum + 1 : state.liveInfo.entity.fansNum - 1
                    },
                    ...action.data
                }
            }
        
        case LIVE_LIKE_ACTION:
            timeline = [...state.timeline]

            timeline[action.data.index] = {
                ...state.timeline[action.data.index],
                likeNum: action.data.status == 'Y' ? state.timeline[action.data.index].likeNum + 1 : state.timeline[action.data.index].likeNum - 1,
                liked: action.data.status == 'Y' ? 1 : 0,
            }
            return {
                ...state,
                timeline
            }
        
        case CLEAN_LIVE_TIMELINE: 
            return {
                ...state,
                timeline: [],
                timelineIdx: 0,
                timelinePage: 1,
            }
        
        case LIVE_DELETE_TIMELINE: 
            state.timeline.splice(action.data.index, 1)
            timeline = [...state.timeline]

            return {
                ...state,
                timeline
            }
        case SET_AUDITED_STATUES:
            return {
                ...state,
                auditedStatues: action.data,
            }
        case INIT_LIVE_TIMELINE:
            return {
                ...state,
                timeline: action.data,
                noMoreTimeline: action.data.length < 20,
            }
        case CHANGE_TIMELINE_INDEX: 
            return {
                ...state,
                timelineIdx: action.idx,
            }
        case CHANGE_CHANNEL_INDEX: 
            return {
                ...state,
                channelIdx: action.idx,
            }
        case CHANGE_TOPIC_INDEX: 
            return {
                ...state,
                topicIdx: action.idx,
            }
        case SET_PREVIEW_COURSE_LIST:
            return {
                ...state,
                purchasedCourseList: [...state.purchasedCourseList, ...data]
            }
        case SET_PURCHASED_COURSE_LIST:
            return {
                ...state,
                previewCourseList: [...state.previewCourseList, ...data]
            }
        case LOAD_TIMELINE:
            return {
                ...state,
                timeline: [...state.timeline, ...action.data],
                noMoreTimeline: action.data.length < 20,
                timelinePage: state.timelinePage + 1 
            }
        case SET_BANNER_LIST:
            return {
                ...state,
                mgrBannerList: action.data
            }
        case CHANNEL_AND_TOPIC_NUM: 
            return {
                ...state,
                topicNum: action.data.topicNum || 0,
                channelNum: action.data.channelNum || 0,
            }

        case LIVE_GET_CHANNEL: 
            if(state.power.allowMGLive) {
                return {
                    ...state,
                    channelList: [...state.channelList, ...action.data],
                    noMoreChannel: action.data.length < 20,
                    channelPage: state.channelPage + 1 
                }
            } else {
                let tempChannelList = [...state.channelList]
                for (var index = 0; index < action.data.length; index++) {
                    if(action.data[index].displayStatus == "Y") {
                        tempChannelList.push(action.data[index])
                    }
                }
                return {
                    ...state,
                    channelList: tempChannelList,
                    noMoreChannel: action.data.length < 20,
                    channelPage: state.channelPage + 1 
                }
            }

        case LIVE_GET_TOPIC: 
            if(action.data) {
                return {
                    ...state,
                    topicList: [...state.topicList, ...action.data],
                    noMoreTopic: action.data.length < 20,
                    topicPage: state.topicPage + 1 
                }
            } else {
                return state
            }
        
        case LOAD_BANNER_CHANNEL_LIST: 
            if(action.data) {
                return {
                    ...state,
                    liveBannerTypes: {
                        ...state.liveBannerTypes,
                        channelList: [
                            ...state.liveBannerTypes.channelList,
                            ...action.data
                        ]
                    }
                }
            } else {
                return state
            }
        case LOAD_BANNER_TOPIC_LIST: 
            if(action.data) {
                return {
                    ...state,
                    liveBannerTypes: {
                        ...state.liveBannerTypes,
                        topicList: [
                            ...state.liveBannerTypes.topicList,
                            ...action.data
                        ]
                    }
                }
            } else {
                return state
            }
        case GET_LIVE_INTRO_PHOTO_LIST: 
            return {
                ...state,
                liveIntroPhotoList: action.data
            }

        case LIVE_SET_ALERT: 
            return {
                ...state,
                focusStatues: {
                    ...state.focusStatues,
                    isAlert: action.data,
                }
            }
            
        case UPDATE_LIVE_TOPIC_LIST:
            let tempTopicList = [...state.topicList];
            for(let i=0; i<tempTopicList.length; i++) {
                if (tempTopicList[i].id == action.topicItem.id) {
                    tempTopicList[i] = { ...tempTopicList[i], ...action.topicItem };
                    break;
                }
            }
            return {
                ...state,
                topicList: tempTopicList
            }

        case REMOVE_LIVE_TOPIC_ITEM:
            return {
                ...state,
                topicList: state.topicList.filter(item => item.id != action.topicItem.id),
                // topicNum: state.topicNum - 1,
            }
        
        case UPDATE_LIVE_CHANNEL_LIST:
            let tempChannelList = [...state.channelList];
            for(let i=0; i<tempChannelList.length; i++) {
                if (tempChannelList[i].id == action.channelItem.id) {
                    tempChannelList[i] = { ...tempChannelList[i], ...action.channelItem };
                    break;
                }
            }
            return {
                ...state,
                channelList: tempChannelList
            }
        case REMOVE_LIVE_CHANNEL_ITEM:
            return {
                ...state,
                channelList: state.channelList.filter(item => item.id != action.channelItem.id)
            }
        
        case SET_VIP_INFO:
            return {
                ...state,
                vipInfo: {...action.data}
            }
        case INIT_PUSH_NUM:
            return {
                ...state,
                topicList: state.topicList.map(item => {
                    if (item.id == action.data.topicId) {
                        item.pushNum = action.data.pushNum;
                        item.maxPushNum = action.data.pushMaxNum;
                    }

                    return item;
                })
            }
        case TOGGLE_DISPLAY_MENU:
            return {
                ...state,
                liveInfo: { ...state.liveInfo, entityExtend: {...state.liveInfo.entityExtend, funcMenuShow: action.showMenuStatus} }
            }
        case FETCH_LIVE_ROLE:
            return {
                ...state,
                role: action.payload.role
            }
        default:
            return state;
    }
};
