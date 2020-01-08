import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockableApiFactory } from '../../utils/api';
import { mockCampUserList, mockUserHeadList, mockCheckInHeadList, mockCampTopNList } from './mock';
import {
    requestCampUserList,
    appendCampUserList,
    setHasMoreUserList,
    requestUserHeadList,
    appendUserHeadList,
    requestCheckInHeadList,
    appendCheckInHeadList,
    requestCheckInTopNList,
    appendCheckInTopNList,
    requestSetUserBlack,
    setUserBlack,
    requestSetUserKickout,
    setUserKickout,
    setUserListLoadingState,
    setUserListErrorState,
    setUserListReqPage,
} from './actions';


const userListApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getAuthUserList',
    method: 'POST',
    mockFunc: mockCampUserList,
});

const userHeadListApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getUserHeadList',
    method: 'POST',
    mockFunc: mockUserHeadList,
});

const checkInHeadListApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getCheckInHeadList',
    method: 'POST',
    mockFunc: mockCheckInHeadList,
});

const checkInTopNListApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getTopNList',
    method: 'POST',
    mockFunc: mockCampTopNList,
});

const setUserBlackApi = mockableApiFactory({
    url: '',
    method: 'POST',
});

const setUserKickoutApi = mockableApiFactory({
    url: '',
    method: 'POST',
});

function* getCampUserList(action) {
    yield call(setUserListLoadingState, { type: 'userList', loading: true })
    const { campId, page, searchName } = action.payload
    // mock data
    const res = yield call(userListApi, {params:{...action.payload}, mock: false});
    // console.log(res);
    if (res.state.code === 0) {
        const hasMoreData = res.data.userList.length >= page.size ? 'Y' : 'N';
        yield call(appendCampUserList, res.data);
        yield call(setHasMoreUserList, {hasMoreData });
        yield call(setUserListLoadingState, { type: 'userList', loading: false })
        yield call(setUserListErrorState, { type: 'userList', error: null });
    } else {
        yield call(setUserListErrorState, { type: 'userList', error: res.state });
    }
    return res;
}

function* getCampUserHeadList(action) {
    yield call(setUserListLoadingState, { type: 'userHeadList', loading: true })
    const { campId } = action.payload
    // mock data
    const res = yield call(userHeadListApi, {params:{campId}, mock: false});
    // console.log(res)
    if (res.state.code === 0) {
        yield call(appendUserHeadList, { userHeadList: res.data.headImageList });
        yield call(setUserListLoadingState, { type: 'userHeadList', loading: false })
        yield call(setUserListErrorState, { type: 'userHeadList', error: null });
    } else {
        yield call(setUserListErrorState, { type: 'userHeadList', error: res.state });
    }
    return res;
}

function* getCheckInHeadList(action) {
    yield call(setUserListLoadingState, { type: 'checkInHeadList', loading: true })
    const { campId } = action.payload
    // mock data
    const res = yield call(checkInHeadListApi, {params:{campId}, mock: false});
    // console.log(res)
    if (res.state.code === 0) {
        yield call(appendCheckInHeadList, { checkInHeadList: res.data.images });
        yield call(setUserListLoadingState, { type: 'checkInHeadList', loading: false })
        yield call(setUserListErrorState, { type: 'checkInHeadList', error: null });
    } else {
        yield call(setUserListErrorState, { type: 'checkInHeadList', error: res.state });
    }
    return res;
}

function* getCheckInTopNList(action) {
    yield call(setUserListLoadingState, { type: 'checkInTopNList', loading: true })
    const { campId ,page} = action.payload
    // mock data
    const res = yield call(checkInTopNListApi, {params:{campId, page}, mock: false});
    // console.log(res)
    if (res.state.code === 0) {
        yield call(appendCheckInTopNList, { topNList: res.data.topNList });
        yield call(setUserListLoadingState, { type: 'checkInTopNList', loading: false })
        yield call(setUserListErrorState, { type: 'checkInTopNList', error: null });
    } else {
        yield call(setUserListErrorState, { type: 'checkInTopNList', error: res.state });
    }
    return res;
}

function* setCampUserKickout(action) {
    yield call(setUserListLoadingState, { type: 'setUserBlack', loading: true })
    const { campId, targetUserId, status } = action.payload
    // mock data
    const res = yield call(setUserKickoutApi, {params:{...action.payload}, mock: false});
    
    if (res.state.code === 0) {
        yield call(setUserKickout, {targetUserId, status});
        yield call(setUserListLoadingState, { type: 'setUserBlack', loading: false })
        yield call(setUserListErrorState, { type: 'setUserBlack', error: null });
    } else {
        yield call(setUserListErrorState, { type: 'setUserBlack', error: res.state });
    }
    return res;
}

function* setCampUserBlack(action) {
    yield call(setUserListLoadingState, { type: 'setUserKickout', loading: true })
    const { liveId, targetUserId, status } = action.payload
    // mock data
    const res = yield call(setUserBlackApi, {params:{topicId, status}, mock: false});

    if (res.state.code === 0) {
        yield call(setUserBlack, { targetUserId, status });
        yield call(setUserListLoadingState, { type: 'setUserKickout', loading: false })
        yield call(setUserListErrorState, { type: 'setUserKickout', error: null });
    } else {
        yield call(setUserListErrorState, { type: 'setUserKickout', error: res.state });
    }
    return res;
}
  
  
export function* watchGetCampUserList() {
    yield takeEvery(requestCampUserList, getCampUserList);
}

export function* watchGetCampUserHeadList() {
    yield takeEvery(requestUserHeadList, getCampUserHeadList);
}

export function* watchGetCheckInHeadList() {
    yield takeEvery(requestCheckInHeadList, getCheckInHeadList);
}

export function* watchGetCheckInTopNList() {
    yield takeEvery(requestCheckInTopNList, getCheckInTopNList);
}

export function* watchSetCampUserBlack() {
    yield takeEvery(requestSetUserBlack, setCampUserBlack);
}

export function* watchSetCampUserKickout() {
    yield takeEvery(requestSetUserKickout, setCampUserKickout);
}

export default [
    watchGetCampUserList,
    watchGetCampUserHeadList,
    watchGetCheckInTopNList,
    watchSetCampUserBlack,
    watchSetCampUserKickout,
    watchGetCheckInHeadList,
]