import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "CHECK_IN_LIST_"


// 请求动态离列表
// payload = { userId, campId, type, timeStamp, beforeOrAfer, pageSize,}
export const requestCheckInList = createAction(actionPrefix + "REQUEST_LIST")

// 将新数据插入到当前列表之前
// payload = { checkInList }
export const prependCheckInList = createAction(actionPrefix + "PREPEND");

// 将新数据插入到当前列表之后
// payload = { checkInList }
export const appendCheckInList = createAction(actionPrefix + "APEND");



// 请求删除动态
// payload = { affairId, liveId }
export const requestDeleteCheckInNews = createAction(actionPrefix + "REQUEST_DELETE");



// 删除动态
// payload = { affairId }
export const deleteCheckInNews = createAction(actionPrefix + "DELETE");



// 请求取消点赞
// payload = { affairId, nickName }
export const requestUnthumbCheckInNews = createAction(actionPrefix + "REQUEST_UNTUNMB");

// 取消点赞
// payload = { affairId, nickName }
export const unthumbCheckInNews = createAction(actionPrefix + "UNTHUMB");



// 请求点赞
// payload = { affairId, nickName }
export const requestThumbUpCheckInNews = createAction(actionPrefix + "REQUEST_TUNMBUP");

// 点赞
// payload = { affairId, nickName }
export const thumbUpCheckInNews = createAction(actionPrefix + "THUMBUP");



// 评论请求
// payload = { comment:{commentUserId, parentUserId, commentUserName, parentUserName, content } affairId, }
export const requestCommentCheckInNews = createAction(actionPrefix + "REQUEST_COMMENT");

// 评论
// payload = { comment:{commentUserId, parentUserId, commentUserName, parentUserName, content } affairId, }
export const commentCheckInNews = createAction(actionPrefix + "COMMENT");


// 请求评论列表
// payload = { affairId }
export const requestCheckInNewsCommentList = createAction(actionPrefix + "REQUEST_COMMENT_LIST");

// 更新评论列表
// payload = { affairId, commentList }
export const updateCheckInNewsCommentList = createAction(actionPrefix + "UPDATE_COMMENT_LIST");


// 请求删除评论
// payload = { affairId, commentId, liveId }
export const requestDeleteCommentCheckInNews = createAction(actionPrefix + "REQUEST_DELETE_COMMENT");
// 删除评论
// payload = { commentId }
export const deleteCommentCheckInNews = createAction(actionPrefix + "DELETE_COMMENT");



// 设置分页大小
// payload = { pageSize }
export const setCheckInListPageSize = createAction(actionPrefix + "SET_PAGE_SIZEa");

// 设置 loading 状态
// payload = { 
//    type: 'getNews' | 'deleteNews' | 'comment' | 'deleteComment' | 'thumbUp' | unthumb, 
//    loading: false | true
// }
export const setCheckInListLoadingState = createAction(actionPrefix + "SET_LOADING");

// 设置请求错误状态
// payload = { 
//    type: 'getNews' | 'deleteNews' | 'comment' | 'deleteComment' | 'thumbUp' | unthumb, 
//    error: { code, msg}
// }
export const setCheckInListErrorState = createAction(actionPrefix + "SET_ERROR");