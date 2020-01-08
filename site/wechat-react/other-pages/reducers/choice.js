import { GET_PUBLIC_COURSE, SET_FREE_COURSE_PAGE_NUM,CLEAR_COURSES } from '../actions/choice'

const initState = {
  courseList: [],
  pageNumb: 1,
  noData: false,
  isNoMore: false,
  title: '',
}

export function choice (state = initState, action) {
  switch (action.type) {
    case GET_PUBLIC_COURSE:
    console.log(action, 'state')
      return { ...state, courseList: [...state.courseList, ...action.courseList], title: action.title };
    case SET_FREE_COURSE_PAGE_NUM:
      return { ...state,pageNumb: action.page, noData:action.noData, isNoMore: action.isNoMore  };
    case CLEAR_COURSES:
      return initState;
    default:
      return state;
  }
}
