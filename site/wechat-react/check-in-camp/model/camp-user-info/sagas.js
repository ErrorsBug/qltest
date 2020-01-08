import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockableApiFactory } from '../../utils/api';
import { mockTopUserInfo, mockCampUserInfo, mockIsFollowLive, } from './mock';
import {
    requestCampUserInfo,
    setCampUserInfo,
    setCampUserInfoLoadingState,
    setCampUserInfoErrorState,
} from './actions';


const topUserInfoApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/topUserInfo',
    method: 'POST',
    mockFunc: mockTopUserInfo
});

const campUserInfoApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/campUserInfo',
    method: 'POST',
    mockFunc: mockCampUserInfo
});

// const affairStatusApi = mockableApiFactory({
//     url: '',
//     method: 'POST',
//     mockFunc: mockAffairStatus
// });

function* getCampUserInfo(action) {
    yield call(setCampUserInfoLoadingState, {loading: true});
    const { campId, shareUserId } = action.payload

    const [topRes, campRes] = yield all([
        call(topUserInfoApi, {params:{campId, shareUserId}, mock: false}),
        call(campUserInfoApi, {params:{campId}, mock: false}),
    ])
    // console.log(campRes)
    if (topRes.state.code === 0 && campRes.state.code === 0)  {
        yield call(setCampUserInfo, {...topRes.data.userInfo, ...campRes.data.campUserInfo});
        yield call(setCampUserInfoLoadingState, {loading: false});
        yield call(setCampUserInfoErrorState, {error: null});
    } else {
        const error = topRes.state
        yield call(setCampUserInfoErrorState, { error, });
    }

    return {topRes, campRes};
}
  
  
function* watchGetCampUserInfo() {
    yield takeEvery(requestCampUserInfo, getCampUserInfo);
}

export default [
    watchGetCampUserInfo,
]