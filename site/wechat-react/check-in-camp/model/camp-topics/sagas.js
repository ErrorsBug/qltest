import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockableApiFactory } from '../../utils/api';
import { mockTodayTopicList, mockCampTopicList } from './mock';
import {
    requestCampTopicList,
    appendCampTopicList,
    requestTodayTopicList,
    appendTodayTopicList,
    requestSetDisplayCampTopic,
    setDisplayCampTopic,
    requestDeleteCampTopic,
    deleteCampTopic,
    setCampTopicsErrorState,
    setCampTopicsLoadingState,
    requestEndCampTopic,
    endCampTopic,
} from './actions';

// mount some important data
const data = {
    // current page of camp topic list
    topicListPage: 1,
    // page size of topic list
    topicListPageSize: 20 // for debug
}


const campTopicListApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getTopicList',
    method: 'POST',
    mockFunc: mockCampTopicList,
});

const todayTopicListApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getTodayTopic',
    method: 'POST',
    mockFunc: mockTodayTopicList,
});

const setTopicDisplayApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/setTopicDisplay',
    method: 'POST',
});

const deleteTopicApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/deleteTopic',
    method: 'POST',
});

const endTopicApi = mockableApiFactory({
    url: '/api/wechat/channel/end-topic',
    method: 'GET',
});

function* getCampTopicList(action) {
    yield call(setCampTopicsLoadingState, { type: 'campTopicList', loading: true })
    const { campId, next } = action.payload
    const { topicListPage, topicListPageSize } = data;
    // mock data
    const res = yield call(campTopicListApi, {params:{campId, page:{page: topicListPage, size: topicListPageSize}}, mock: false});
    // console.log(res)
    if (res.state.code === 0) {
        data.topicListPage += 1;
        const hasNoMoreTopics = res.data.campTopicList.length < topicListPageSize ? 'Y' : 'N';
        next && next();
        yield call(appendCampTopicList, {...res.data, hasNoMoreTopics});
        yield call(setCampTopicsLoadingState, { type: 'campTopicList', loading: false })
        yield call(setCampTopicsErrorState, { type: 'campTopicList', error: null });
    } else {
        yield call(setCampTopicsErrorState, { type: 'campTopicList', error: res.state });
    }
    return res;
}

function* getTodayTopicList(action) {
    yield call(setCampTopicsLoadingState, { type: 'todayTopicList', loading: true })
    const { campId } = action.payload
    // mock data
    const res = yield call(todayTopicListApi, {params:{campId}, mock: false});
    // console.log(res)
    if (res.state.code === 0) {
        yield call(appendTodayTopicList, { todayTopicList: res.data.topicList });
        yield call(setCampTopicsLoadingState, { type: 'todayTopicList', loading: false })
        yield call(setCampTopicsErrorState, { type: 'todayTopicList', error: null });
    } else {
        yield call(setCampTopicsErrorState, { type: 'todayTopicList', error: res.state });
    }
    return res;
}

function* deleteTopic(action) {
    yield call(setCampTopicsLoadingState, { type: 'deleteTopic', loading: true })
    const { topicId } = action.payload
    // mock data
    const res = yield call(deleteTopicApi, {params:{topicId}, mock: false});
    // console.log(res)
    if (res.state.code === 0) {
        yield call(deleteCampTopic, {topicId});
        yield call(setCampTopicsLoadingState, { type: 'deleteTopic', loading: false })
        yield call(setCampTopicsErrorState, { type: 'deleteTopic', error: null });
    } else {
        yield call(setCampTopicsErrorState, { type: 'deleteTopic', error: res.state });
    }
    return res;
}

function* setTopicDisplay(action) {
    yield call(setCampTopicsLoadingState, { type: 'setTopicDisplay', loading: true })
    const { topicId, status } = action.payload
    // mock data
    const res = yield call(setTopicDisplayApi, {params:{topicId, status}, mock: false});
    console.log(res)
    if (res.state.code === 0) {
        yield call(setDisplayCampTopic, { topicId, status });
        yield call(setCampTopicsLoadingState, { type: 'setTopicDisplay', loading: false })
        yield call(setCampTopicsErrorState, { type: 'setTopicDisplay', error: null });
    } else {
        yield call(setCampTopicsErrorState, { type: 'setTopicDisplay', error: res.state });
    }
    return res;
}

function* endTopic(action) {
    yield call(setCampTopicsLoadingState, { type: 'endTopic', loading: true })
    const { topicId } = action.payload
    // mock data
    const res = yield call(endTopicApi, {params:{topicId}, mock: false});
    console.log(res)
    if (res.state.code === 0) {
        yield call(endCampTopic, {topicId});
        yield call(setCampTopicsLoadingState, { type: 'endTopic', loading: false })
        yield call(setCampTopicsErrorState, { type: 'endTopic', error: null });
    } else {
        yield call(setCampTopicsErrorState, { type: 'endTopic', error: res.state });
    }
    return res;
}
  
  
export function* watchGetCampTopicList() {
    yield takeEvery(requestCampTopicList, getCampTopicList);
}

export function* watchGetTodayTopicList() {
    yield takeEvery(requestTodayTopicList, getTodayTopicList);
}

export function* watchSetTopicDisplay() {
    yield takeEvery(requestSetDisplayCampTopic, setTopicDisplay);
}

export function* watchDeleteCampTopic() {
    yield takeEvery(requestDeleteCampTopic, deleteTopic);
}

export function* watchEndCampTopic() {
    yield takeEvery(requestEndCampTopic, endTopic);
}

export default [
    watchGetCampTopicList,
    watchGetTodayTopicList,
    watchSetTopicDisplay,
    watchDeleteCampTopic,
    watchEndCampTopic,
]