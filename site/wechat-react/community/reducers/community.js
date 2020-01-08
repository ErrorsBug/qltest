import {
  COMMUNITY_IDEA_DATA,
  COMMUNITY_TOPIC_DATA,
  COMMUNITY_LIST_IDEA_DATA,
  COMMUNITY_CENTER_DATA
  } from '../actions/community'
 
const initData = {
    communityIdea:null,
    topic:null,
    listIdeaObj:{
        listIdeaData:[],
        isNoMore:false,
        noData:false,
        page:1
    }
  };
export function community (state = initData, action) {
    switch (action.type) {
        
        case COMMUNITY_LIST_IDEA_DATA: 
            return { ...state, ...{ listIdeaObj: action.data.listIdeaObj } };
        case COMMUNITY_IDEA_DATA: 
            return { ...state, ...{ communityIdea: action.data.communityIdea } };
        case COMMUNITY_CENTER_DATA: 
            return { ...state, ...{ communityCenter: action.data } };
        case COMMUNITY_TOPIC_DATA: 
            return { ...state, ...{ topic: action.data.topic } }
        default:
            return state
    }
}

