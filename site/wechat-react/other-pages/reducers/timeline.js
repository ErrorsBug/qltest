import {
    INIT_CURRENT_LIVE,
    INIT_TIMELINE_LIST,
    INIT_LIVE_LIST,
    INIT_POWER,
    INIT_LIVEID,

    INIT_NEW_LIKE_NUM,
    INIT_NEW_LIKE_LIST,
    LIKE_ACTION,

    INIT_TIMELINE_CHANCE,
    INIT_CHOOSE_TIMELINE_TYPE,

    CREATE_TIMELINE,
    DELETE_TIMELINE,

    LOAD_TOPIC_LIST,
    LOAD_HOMEWORK_LIST,
    LOAD_CHANNEL_LIST,
    LOAD_FOCUS_LIVES_LIST,
    LOAD_TIMELINE_LIST,
    CLEAN_TIMELINE_LIST,
    INIT_LIVE_ID,

} from '../actions/timeline'

const initState = {

    myCurrentLiveId: 0,
    timelineList: [],
    liveList : [],
    // newLikeNum 新收获的点赞数量
    likeNum: 0,
    newLikeList: [],

    timelineChance: 0,

    timelineTypes: {
        channelList: [],
        topicList: [],
        homeworkList: [],
    },

    power: {},
    
}


export function timeline (state = initState, action) {
    var timelineList = []
    switch (action.type) {

        case INIT_CURRENT_LIVE:
            return {
                ...state,
                ...action.data
            }

        case INIT_LIVE_LIST:
            return { 
                ...state,
                liveList: action.data,
            };
        
        case INIT_POWER:
            return { 
                ...state,
                ...action.data,
            };

        case INIT_TIMELINE_LIST: 
            return {
                ...state,
                ...action.data,
            }

        case INIT_LIVEID:
            return { 
                ...state,
                myCurrentLiveId: action.data,
            };
        
        case INIT_CHOOSE_TIMELINE_TYPE:
            return {
                ...state,
                timelineTypes: {
                    ...action.data
                }
            }

        case LOAD_TOPIC_LIST: 
            return {
                ...state,
                timelineTypes: {
                    ...state.timelineTypes,
                    topicList: [
                        ...state.timelineTypes.topicList,
                        ...action.data
                    ]
                }
            }
        

        case LOAD_HOMEWORK_LIST: 
            return {
                ...state,
                timelineTypes: {
                    ...state.timelineTypes,
                    homeworkList: [
                        ...state.timelineTypes.homeworkList,
                        ...action.data
                    ]
                }
            }

        case LOAD_CHANNEL_LIST: 
            return {
                ...state,
                timelineTypes: {
                    ...state.timelineTypes,
                    channelList: [
                        ...state.timelineTypes.channelList,
                        ...action.data
                    ]
                }
            }

        case LOAD_TIMELINE_LIST:
            return {
                ...state,
                timelineList: [
                    ...state.timelineList,
                    ...action.data
                ]
            }

        case LOAD_FOCUS_LIVES_LIST: 
            return {
                ...state,
                ...action.data
            }

        case INIT_NEW_LIKE_NUM: 
            return {
                ...state,
                ...action.data
            }

        case LIKE_ACTION: 
            timelineList = [ ...state.timelineList ]

            timelineList[action.data.index] = {
                ...state.timelineList[action.data.index],
                likeNum : action.data.status == 'Y' ? state.timelineList[action.data.index].likeNum + 1 : state.timelineList[action.data.index].likeNum - 1,
                liked : action.data.status == 'Y' ? 1 : 0,
            }
            return {
                ...state,
                timelineList
            }
        
        case DELETE_TIMELINE: 
            // timelineList = [ ...state.timelineList.slice(0, action.data.index), ...state.timelineList.slice(action.data.index + 1) ]
            state.timelineList.splice(action.data.index, 1)
            timelineList = [ ...state.timelineList ]

            return {
                ...state,
                timelineList
            }

        case CLEAN_TIMELINE_LIST: 
            timelineList = []
            return {
                ...state,
                timelineList
            }


        default:
            return state;
    }
}