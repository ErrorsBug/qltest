import fetch from 'isomorphic-fetch';
import { select, all, take, call, put, cps } from 'redux-saga/effects';
import { selectStsAuth } from './selector';
import { 
    api,
    INIT_STS_AUTH,
    SET_STS_AUTH,
    INIT_LIVE_LEVEL,
    SET_IS_LIVE_ADMIN,
 } from '../actions/common';
import { extname } from 'path';

/*===== Util functions =====*/


/*===== Redux Sagas to be exported =====*/

/**
 * 初始化阿里云的stsAuth信息
 */
export function* initStsAuth(){
    const action = yield take(INIT_STS_AUTH);
    const result = yield call(api, {
        url: '/api/wechat/common/getStsAuth'
    });
    yield put({
        type: SET_STS_AUTH,
        stsAuth: result.data,
    });
}

/**
 * 初始化直播间的等级状态
 */
export function* initLiveLevel(){
    const {liveId} = yield take(INIT_LIVE_LEVEL);
    const result = yield call(api, {
        url: '/api/wechat/studio/is-live-admin',
        body: {liveId}
    });
    yield put({
        type: SET_IS_LIVE_ADMIN,
        data: result.data
    });
}

export default [
    initStsAuth,
    initLiveLevel,
]