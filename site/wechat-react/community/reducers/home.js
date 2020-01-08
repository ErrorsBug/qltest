import {
    UNIVERSITY_STUDENT_INFO_DATA,
    UNIVERSITY_HOME_FIRST_DATA, 
    UPDATE_COMMUNITY
  } from '../actions/home'
import {
  UNIVERSITY_FLAG_CARD_DATA
  } from '../actions/flag'

const initData = {
    studentInfoData: null,
    homeData: null,
    flagCardData: null,
  };
export function home (state = initData, action) {
    switch (action.type) {
  
        case UNIVERSITY_STUDENT_INFO_DATA:
            return { ...state, ...{ studentInfoData: action.data } };

        case UNIVERSITY_HOME_FIRST_DATA:
            return { ...state, ...{ homeData: action.data } };
  
        case UNIVERSITY_FLAG_CARD_DATA:
              return { ...state, ...{ flagCardData: action.data } };
  
        case UPDATE_COMMUNITY: 
            return { ...state, homeData: { ...state.homeData, markObj: action.data  } }
        default:
            return state
    }
}

