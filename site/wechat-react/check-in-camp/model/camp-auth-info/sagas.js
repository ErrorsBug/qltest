import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockableApiFactory } from '../../utils/api';
import { mockAuthRes, mockPayStatusRes } from './mock';
import {
    fetchAuthInfo,
    getLocalAuthInfo,
    setLocalAuthInfo,
    fetchAuthInfoSuccess,
    fetchAuthInfoError,
} from './actions';


const getAuthInfoApi = mockableApiFactory({
    url:'/api/wechat/user/power',
    method: 'GET',
    mockFunc: mockAuthRes,
})

// const getCheckPayStatusApi = mockableApiFactory({
//     url:'',
//     method: 'POST',
//     mockFunc: mockPayStatusRes,
// })


function* getAuthInfo(action) {
    // console.log(action)
    const { campId, userId, topicId } = action.payload
    // yield put(setLocalAuthInfo(action.payload));
    const params = {
        ...action.payload,
    }
    const [authRes] = yield all([
        call(getAuthInfoApi, {params:{campId,topicId}, mock: false}),
        // call(getCheckPayStatusApi, {params:{campId}, mock: false})
    ])
    // console.log(authRes)
    if (authRes.state.code === 0){
        yield call(fetchAuthInfoSuccess, {...authRes.data.powerEntity});
        yield call(setLocalAuthInfo, {userId, campId});
    } else {
        yield call(fetchAuthInfoError, {...authRes.state});
    }
    return authRes;
}
  
  
function* watchGetAuthInfo() {
    yield takeEvery(fetchAuthInfo, getAuthInfo);
}

export default [
    watchGetAuthInfo,
]