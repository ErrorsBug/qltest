import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "CAMP_INTRO_LIST_"


// 请求训练营用户列表
// payload = { campId }
export const requestCampIntroList = createAction(actionPrefix + "REQUEST_CAMP_INTRO_LIST")


// 添加用户列表
// payload = { IntroList }
export const appendCampIntroList = createAction(actionPrefix + "APEND_CAMP_INTRO_LIST");


// 设置 loading 状态
// payload = { 
//    loading: false | true
// }
export const setCampInroListLoadingState = createAction(actionPrefix + "SET_LOADING");

// 设置请求错误状态
// payload = { 
//    error: { code, msg}
// }
export const setCampInroListErrorState = createAction(actionPrefix + "SET_ERROR");
