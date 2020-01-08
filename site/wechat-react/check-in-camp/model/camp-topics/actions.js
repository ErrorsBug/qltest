import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "CAMP_TOPIC_LIST_"


// 请求课程列表
// payload = { campId }
export const requestCampTopicList = createAction(actionPrefix + "REQUEST_CAMP_TOPIC_LIST")


// 添加课程列表
// payload = { campTopicList }
export const appendCampTopicList = createAction(actionPrefix + "APEND_CAMP_TOPIC_LIST");


// 请求今日主题页表
// payload = { campId }
export const requestTodayTopicList = createAction(actionPrefix + "REQUEST_TODAY_TOPIC_LIST");

// 添加今日主题列表
// payload = { todayTopicList }
export const appendTodayTopicList = createAction(actionPrefix + "APPEND_TODAY_TOPIC_LIST");


// 请求设置课程显示状态
// payload = { topicId, status }
export const requestSetDisplayCampTopic = createAction(actionPrefix + "REQUST_SET_DISPLAY_CAMP_TOPIC");

// 设置课程显示状态
// payload = { topicId, status}
export const setDisplayCampTopic = createAction(actionPrefix + "SET_DISPLAY_CAMP_TOPIC");



// 请求删除课程
// payload = { topicId }
export const requestDeleteCampTopic = createAction(actionPrefix + "REQUST_DELETE_CAMP_TOPIC");

// 删除课程
// payload = { topicId }
export const deleteCampTopic = createAction(actionPrefix + "DELETE_CAMP_TOPIC");


// 请求结束课程
// payload = { topicId }
export const requestEndCampTopic = createAction(actionPrefix + "REQUST_END_CAMP_TOPIC");

// 删除课程
// payload = { topicId }
export const endCampTopic = createAction(actionPrefix + "END_CAMP_TOPIC");


// 设置 loading 状态
// payload = { 
//    type: 'campTopicList' | 'todayTopicList'| 'deleteTopic' | 'setTopicDisplay
//    loading: false | true
// }
export const setCampTopicsLoadingState = createAction(actionPrefix + "SET_CAMP_TOPICS_LOADING");

// 设置请求错误状态
// payload = { 
//    type: 'campTopicList' | 'todayTopicList'| 'deleteTopic' | 'setTopicDisplay  
//    error: { code, msg}
// }
export const setCampTopicsErrorState = createAction(actionPrefix + "SET_CAMP_TOPICS_ERROR");