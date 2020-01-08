import { GET_BUY_LISTS } from '../actions/buy'

const initState = {
  buyLists: [],
  noneData: false,
  isNoMoreCourse: false,
}

export function buy (state = initState, action) {
  switch (action.type) {
    case GET_BUY_LISTS:
      return { ...state, buyLists: [...state.buyLists, ...action.buyLists], noneData: action.noneData,isNoMoreCourse: action.isNoMoreCourse };
    default:
      return state;
  }
}