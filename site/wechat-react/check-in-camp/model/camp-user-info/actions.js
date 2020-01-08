import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "CAMP_USER_INFO";

// payload = { campId }
export const requestCampUserInfo = createAction(actionPrefix + 'REQUEST_USER_INFO');

// payload = { name, userId, headImgUrl, payStatus }
export const setCampUserInfo = createAction(actionPrefix + "SET_USER_INFO");

// 设置 loading 状态
// payload = { 
//    loading: false | true
// }
export const setCampUserInfoLoadingState = createAction(actionPrefix + "SET_LOADING");

// 设置请求错误状态
// payload = { 
//    error: { code, msg}
// }
export const setCampUserInfoErrorState = createAction(actionPrefix + "SET_ERROR");