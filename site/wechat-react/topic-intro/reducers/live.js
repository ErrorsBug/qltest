import { combineReducers } from 'redux';

import {
  INIT_CHANNEL_PAGE_DATA,
  
} from '../actions/channel-intro';

import {
  INIT_PAGE_DATA,
} from '../actions/topic-intro-edit'

import {
  UPDATE_FOLLOW_LIVE,
} from '../actions/common';

import {
    SET_LIVE_FOCUS_STATES,
} from '../actions/live';



export default combineReducers({
  liveInfo,
  isFollow,
  focusStatues
})


function focusStatues(state = {}, action) {
  switch (action.type) {

    case SET_LIVE_FOCUS_STATES:
    return {
        ...state,
        ...action.data
    }
    default:
      return state;
  }
}

function liveInfo(state = {}, action) {
  switch (action.type) {
    case INIT_PAGE_DATA:
      return { ...state, ...action.pageData.liveInfo };
    case INIT_CHANNEL_PAGE_DATA:
      return { ...state, ...action.pageData.liveInfo };
    case UPDATE_FOLLOW_LIVE:
      return { ...state, followNum: action.isFollow ? state.followNum + 1 : state.followNum - 1 }
    default:
      return state;
  }
}



function isFollow(state = {}, action) {
  switch (action.type) {
    case INIT_PAGE_DATA:
      return { ...state, ...action.pageData.isFollow };
    case INIT_CHANNEL_PAGE_DATA:
      return { ...state, ...action.pageData.isFollow };
    case UPDATE_FOLLOW_LIVE:
      return { ...state, isFollow: action.isFollow, isAlert: action.isAlert };
    default:
      return state;
  }
}