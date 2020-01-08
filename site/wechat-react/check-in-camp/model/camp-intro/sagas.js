import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockableApiFactory } from '../../utils/api';
import { mockCampIntroList } from './mock';
import {
    requestCampIntroList,
    appendCampIntroList,
    setCampInroListLoadingState,
    setCampInroListErrorState,
} from './actions';


const campIntroApi = mockableApiFactory({
    url: '/api/wechat/channel/get-channel-intro',
    method: 'GET',
    mockFunc: mockCampIntroList,
});


function* getCampIntroList(action) {
    yield call(setCampInroListLoadingState, { loading: true })
    const { campId } = action.payload
    // mock data
    const res = yield call(campIntroApi, {params:{channelId: campId, category: 'campDesc'}, mock: false});
    // console.log(res);
    if (res.state.code === 0) {
        yield call(appendCampIntroList, { introList: res.data.descriptions.campDesc});
        yield call(setCampInroListLoadingState, { loading: false })
        yield call(setCampInroListErrorState, { error: null });
    } else {
        yield call(setCampInroListErrorState, { error: res.state });
    }
    return res;
}


export function* watchGetCampIntroList() {
    yield takeEvery(requestCampIntroList, getCampIntroList);
}

export default [
    watchGetCampIntroList,
]