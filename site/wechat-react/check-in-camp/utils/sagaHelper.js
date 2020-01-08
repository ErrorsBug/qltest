import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';

export function sagaHelper({
    reqFunc = (action) => {},
    onRequest = (action) => {},
    onSuccess = (res, action) => {},
    onError = (res, action) => {},
    mockData = null,
}) {
    return function* (action) {
        const params = {...action.payload};
        yield call(onRequest, action);
        const res = yield call(reqFunc, action);
        if (mockData) res.data = mockData;
        if (res.state.code === 0) {
            yield call(onSuccess, res, action);
        } else {
            yield call(onError, res, action);
        }
    }
}

export function* mockApi(mockData, isSuccess) {
    yield delay(1000);
    if (isSuccess) {
        return { state:{code:0, msg:'请求成功'}, data: mockData }
    }
    return { state:{code:99999, msg:'测试错误'}, data:null }
}