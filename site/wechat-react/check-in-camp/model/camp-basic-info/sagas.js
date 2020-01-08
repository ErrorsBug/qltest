import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockableApiFactory } from '../../utils/api';
import { mockCampInfo, mockCampBonus, mockCampUserInfo } from './mock';
import dayjs from 'dayjs';
import {
    fetchCampBasicInfo,
    fetchCampBasicInfoError,
    fetchCampBasicInfoSuccess,
    // fetchLshareKey,
    requestLshareKeyBind,
} from './actions';

// /api/wechat/checkInCamp/campInfo
const campInfoApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/campInfo',
    method: 'POST',
    mockFunc: mockCampInfo
});

// const campUserInfoApi = mockableApiFactory({
//     url: '',
//     method: 'POST',
//     mockFunc: mockCampUserInfo
// });

const sysTimeApi = mockableApiFactory({
    url: '/api/base/sys-time',
    method: 'GET',
});

const lshareKeyBindApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/bindLiveShare',
    method: 'POST',
});

// const campBonusApi = mockableApiFactory({
//     url: '',
//     method: 'GET',
//     mockFunc: mockCampBonus
// });

function* getCampBasicInfo(action) {
    const { campId, setDataType, callback } = action.payload
    // yield put(setLocalAuthInfo(action.payload));
    // console.log(action)
    const params = {...action.payload}
    // mock data
    const [res, sysRes] = yield all([
        call(campInfoApi, {params, mock: false}),
        call(sysTimeApi, {params, mock: false}),
        // call(campUserInfoApi, {params, mock: false})
    ])
    if (res.state.code === 0 && sysRes.state.code === 0) {
        let data = res.data.liveCamp;
        // console.log(bounsRes)
        const sysTime = sysRes.data.sysTime;

        const today = dayjs(dayjs(sysTime).format('YYYY-MM-DD'));//那天凌晨0点
        const startDate = dayjs(data.startTimeStamp).format('YYYY.MM.DD');
        const endDate = dayjs(data.endTimeStamp).format('YYYY.MM.DD');
        let currentDays = today.diff(dayjs(dayjs(data.startTimeStamp).format('YYYY-MM-DD')), 'day');//那天凌晨0点
        const isEnd = dayjs(data.endTimeStamp).diff(today, 'day') < 0 ? 'Y' :'N';
        const isBegin = currentDays < 0 ? "N" : "Y";
        const totalDays = dayjs(data.endTimeStamp).diff(dayjs(data.startTimeStamp), 'day') + 1;
        currentDays = currentDays < 0 ? currentDays : currentDays + 1;

        let dateInfo = {}
        if (setDataType === 'static') {
            dateInfo = { totalDays, startDate, endDate };
        } else {
            dateInfo = {
                totalDays, 
                startDate, 
                endDate, 
                currentDays,
                isBegin,
                isEnd,
                today: today.format('YYYY-MM-DD'),
            };
        }




            data = {...data, dateInfo};
        yield call(fetchCampBasicInfoSuccess, { data, setDataType, callback });
    } else {
        yield call(fetchCampBasicInfoError, { error: res.state, setDataType });
    }
    
    return { res, sysRes };
}


//直播间分销用户绑定
function* lshareKeyBind(action) {
    const { affairId, liveId, campId, shareKey, userId } = action.payload;
    const res = yield call(lshareKeyBindApi, {params:{affairId, liveId, campId, shareKey, userId }, mock: false})
    const data =res.data;
    if (res.state.code === 0) {
        yield call(fetchCampBasicInfoSuccess, { data });
    } else {
        yield call(fetchCampBasicInfoError, { error: res.state});
    }
    return res;
}
  
  
function* watchGetCampBasicInfo() {
    yield takeEvery(fetchCampBasicInfo, getCampBasicInfo);
}


function* watchLShareKeyBind() {
    yield takeEvery(requestLshareKeyBind, lshareKeyBind);
}


export default [
    watchGetCampBasicInfo,
    watchLShareKeyBind,
]