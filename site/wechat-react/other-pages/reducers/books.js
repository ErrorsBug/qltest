import { GET_BOOKS_LISTS, SET_BOOKS_LISTS_PAGE, CLEAR_BOOKS } from '../actions/books'

const initState = {
  bookLists: [],
  pageNumb: 1,
  noData: false,
  isNoMore: false,
  shareObj: {},
  bookSubjectHeadImage: ''
}

export function books (state = initState, action) {
  switch (action.type) {
    case GET_BOOKS_LISTS:
      return { ...state, 
        bookLists: [...state.bookLists, ...action.bookLists], 
        noneData: action.noneData, 
        isNoMore: action.isNoMoreCourse,
        shareObj: action.shareObj,
        bookSubjectHeadImage: action.bookSubjectHeadImage,
        pageNumb:action.pageNumb };
    default:
      return state;
  }
}
