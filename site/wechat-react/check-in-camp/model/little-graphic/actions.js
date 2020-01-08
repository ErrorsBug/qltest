import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "LITTLE_GRAPHIC_"


// 请求小图文基础信息
// payload = { liveId, topicId }
export const requestLittleGraphicBasicInfo = createAction(actionPrefix + "REQUEST_BASIC_INFO")

// 请求小图文发言列表
// payload = { topicId, time, beforeOrAfter }
export const requestLittleGraphicContentList = createAction(actionPrefix + "REQUEST_CONTENT_LIST")

// 更新 contentlist
// payload = { contentList }
export const updateLittleGraphicContentList = createAction(actionPrefix + "UPDATE_CONTENT_LIST");


// 更新 baseInfo
// payload = { baseInfo }
export const updateLittleGraphicBaseInfo = createAction(actionPrefix + "UPDATE_BASIC_INFO");


// 更新 content
// payload = { index, content={ id, fileId, content, type, audio, text} }
export const updateLittleGraphicContent = createAction(actionPrefix + "UPDATE_CONTENT");

// 删除 content
// payload = { index }
export const deleteLittleGraphicContent = createAction(actionPrefix + "DELETE_CONTENT");


// 创建或编辑小图文
// payload = { campId, name, topicId, contentList }
export const requestAddOrUpdateLittleGraphic = createAction(actionPrefix + "REQUEST_ADD_OR_UPDATE_GRAPHIC");


// 设置分页大小
// payload = { pageSize }
export const setLittleGraphicPageSize = createAction(actionPrefix + "SET_PAGE_SIZE");

// 设置 loading 状态
// payload = { 
//    type: 'basicInfo' | 'contentList' | 'addOrUpdate' 
//    loading: false | true
// }
export const setLittleGraphicLoadingState = createAction(actionPrefix + "SET_LOADING");

// 设置请求错误状态
// payload = { 
//    type: 'basicInfo' | 'contentList' | 'addOrUpdate' 
//    error: { code, msg}
// }
export const setLittleGraphicErrorState = createAction(actionPrefix + "SET_ERROR");