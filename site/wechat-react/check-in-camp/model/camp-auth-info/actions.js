import { createAction } from 'redux-act';

const actionPrefix = "CAMP_AUTH_";

export const fetchAuthInfo = createAction(actionPrefix + "REQUEST")
export const fetchAuthInfoSuccess = createAction(actionPrefix + "REQUEST_SUCCESS")
export const fetchAuthInfoError = createAction(actionPrefix + "REQUEST_ERROR")
export const getLocalAuthInfo = createAction(actionPrefix + "GET_LOCAL");
export const setLocalAuthInfo = createAction(actionPrefix + "SET_LOCAL");