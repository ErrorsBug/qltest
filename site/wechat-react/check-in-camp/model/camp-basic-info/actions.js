import { createAsyncAction } from 'components/util';
import { createAction } from 'redux-act';

const actionPrefix = "CAMP_BASIC_INFO_";

// export const GET_CAMP_BASIC_INFO_ASYNC = createAsyncAction(actionPrefix);
// export const GET_STATIC_CAMP_BASIC_INFO_ASYNC = createAsyncAction(actionPrefix + "_STATIC");


export const fetchCampBasicInfo = createAction(actionPrefix + 'GET_BASIC_INFO');
export const fetchCampBasicInfoSuccess = createAction(actionPrefix + 'GET_BASIC_INFO_SUCCESS');
export const fetchCampBasicInfoError = createAction(actionPrefix + 'GET_BASIC_INFO_ERROR');
export const setCampBasicInfo = createAction(actionPrefix + "SET_BASIC_INFO");

// 绑定直播间课代表
export const fetchLshareKey = createAction(actionPrefix + "GET_LSHAREKEY");
export const requestLshareKeyBind = createAction(actionPrefix + "REQUEST_SHAREKEY_BIND");
