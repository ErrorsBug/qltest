import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "CAMP_USER_LIST_"


// 请求训练营用户列表
// payload = { campId, searchName, page }
export const requestCampUserList = createAction(actionPrefix + "REQUEST_CAMP_USER_LIST")


// 添加用户列表
// payload = { userList }
export const appendCampUserList = createAction(actionPrefix + "APEND_CAMP_USER_LIST");


// 请求训练营报名用户头像列表
// payload = { campId }
export const requestUserHeadList = createAction(actionPrefix + "REQUEST_USER_HEADLIST");

// 添加报名头像列表
// payload = { userHeadList }
export const appendUserHeadList = createAction(actionPrefix + "APPEND_USER_HEADLIST");


// 请求训练营打卡用户头像列表
// payload = { campId }
export const requestCheckInHeadList = createAction(actionPrefix + "REQUEST_CHECKIN_HEADLIST");

// 添加打卡头像列表
// payload = { checkInHeadList }
export const appendCheckInHeadList = createAction(actionPrefix + "APPEND_CHECKIN_HEADLIST");


// 请求训练营打卡用户头像列表
// payload = { campId }
export const requestCheckInTopNList = createAction(actionPrefix + "REQUEST_CHECKIN_TOPNLIST");

// 添加打卡头像列表
// payload = { checkInHeadList }
export const appendCheckInTopNList = createAction(actionPrefix + "APPEND_CHECKIN_TOPNLIST");


// 请求拉黑/解除拉黑
// payload = { liveId, targetUserId, status }
export const requestSetUserBlack = createAction(actionPrefix + "REQUST_SET_USER_BLACK");

// 设置拉黑/解除拉黑
// payload = { targetUserId, status}
export const setUserBlack = createAction(actionPrefix + "SET_USER_BLACK");



// 请求踢出/取消踢出
// payload = { campId， targetUserId, status }
export const requestSetUserKickout = createAction(actionPrefix + "REQUST_SET_USER_KICKOUT");

// 踢出/取消踢出
// payload = { targetUserId, status }
export const setUserKickout = createAction(actionPrefix + "SET_USER_KICKOUT");


// 设置 loading 状态
// payload = { 
//    type: 'userList' | 'userHeadList' | 'setUserBlack' | 'setUserKickout', 
//    loading: false | true
// }
export const setUserListLoadingState = createAction(actionPrefix + "SET_USERLIST_LOADING");

// 设置请求错误状态
// payload = { 
//    type: 'userList' | 'userHeadList' | 'setUserBlack' | 'setUserKickout',  
//    error: { code, msg}
// }
export const setUserListErrorState = createAction(actionPrefix + "SET_USERLIST_ERROR");


// 设置请求分页信息
// payload = { page, hasMore }
export const setUserListReqPage = createAction(actionPrefix + "SET_USERLIST_PAGE");

// 设置是否还要更多数据
// payload = { hasMoreData: Y / N }
export const setHasMoreUserList = createAction(actionPrefix + "SET_HAS_MORE_USER");