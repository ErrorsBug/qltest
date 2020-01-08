import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockGraphicInfo, mockGraphicContentList } from './mock';
import { mockableApiFactory } from '../../utils/api';

import { 
    requestLittleGraphicBasicInfo,
    requestLittleGraphicContentList,
    requestAddOrUpdateLittleGraphic,
    updateLittleGraphicContentList,
    updateLittleGraphicBaseInfo,
    updateLittleGraphicContent,
    deleteLittleGraphicContent,
    setLittleGraphicPageSize,
    setLittleGraphicLoadingState,
    setLittleGraphicErrorState,
} from './actions';


const graphicBasicInfoApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/getInfo',
    method: 'POST',
    mockFunc: mockGraphicInfo,
});

const graphicContentListApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/contentList',
    method: 'POST',
    mockFunc: mockGraphicContentList,
});

const graphicAddOrUpdateApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/addOrUpdate',
    method: 'POST',
});



function* getLittleGraphicBasicInfo(action) {
    const {liveId, topicId} = action.payload;

    yield call(setLittleGraphicLoadingState, { type: 'basicInfo', loading: true })

    const res = yield call(graphicBasicInfoApi, {params:{liveId, topicId}, mock: false})
    // console.log(res)

    if (res.state.code === 0) {
        yield call(setLittleGraphicLoadingState, { type: 'basicInfo', loading: false });
        yield call(setLittleGraphicErrorState, { type: 'basicInfo', error: null });
        yield call(updateLittleGraphicBaseInfo, { baseInfo: res.data.baseInfo })
    
    } else {
        yield call(setLittleGraphicErrorState, { type: 'basicInfo', error: res.state });
    }
    return res;
}

function* getLittleGraphicContentList(action) {
    const { topicId, time } = action.payload;

    yield call(setLittleGraphicLoadingState, { type: 'contentList', loading: true })

    const res = yield call(graphicContentListApi, {params:{topicId,time,beforeOrAfter:'after', page:{page:1, size: 9999}}, mock: false})

    if (res.state.code === 0) {
        yield call(setLittleGraphicLoadingState, { type: 'contentList', loading: false });
        yield call(setLittleGraphicErrorState, { type: 'contentList', error: null });
        yield call(updateLittleGraphicContentList, {  contentList: res.data.contentList });
    } else {
        yield call(setLittleGraphicErrorState, { type: 'contentList', error: res.state });
    }
    return res;
}

function* addOrUpdateLittleGraphic(action) {
    const { campId, name, topicId, contentList,liveId } = action.payload
    yield call(setLittleGraphicLoadingState, { type: 'addOrUpdate', loading: true })
    window.loading(true);
    const res = yield call(graphicAddOrUpdateApi, {params:{...action.payload}, mock: false})

    if (res.state.code === 0) {
        yield call(setLittleGraphicLoadingState, { type: 'addOrUpdate', loading: false });
        yield call(setLittleGraphicErrorState, { type: 'addOrUpdate', error: null });
        window.toast('保存成功')
        // console.log(res)
        setTimeout(() => {
            window.location.href = `/wechat/page/detail-little-graphic?topicId=${topicId || res.data.graphic.topicId}`;
        }, 1000);
    } else {
        yield call(setLittleGraphicErrorState, { type: 'addOrUpdate', error: res.state });
    }
    window.loading(false);
    return res;
}

  
function* watchGetLittleGraphicBasicInfo() {
    yield takeEvery(requestLittleGraphicBasicInfo, getLittleGraphicBasicInfo);
}

function* watchGetLittleGraphicContentList() {
    yield takeEvery(requestLittleGraphicContentList, getLittleGraphicContentList);
}

function* watchAddOrUpdateLittleGraphic() {
    yield takeEvery(requestAddOrUpdateLittleGraphic, addOrUpdateLittleGraphic);
}


export default [
    watchGetLittleGraphicBasicInfo,
    watchGetLittleGraphicContentList,
    watchAddOrUpdateLittleGraphic,
]