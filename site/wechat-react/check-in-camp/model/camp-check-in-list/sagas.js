import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { mockCheckInList, mockComment, mockRes, mockCommentList } from './mock';
import { mockableApiFactory } from '../../utils/api';
// import { mockApi } from '../../sagas/util';
import { 
    requestCheckInList,
    prependCheckInList,
    appendCheckInList,
    requestDeleteCheckInNews,
    deleteCheckInNews,
    requestUnthumbCheckInNews,
    unthumbCheckInNews,
    requestThumbUpCheckInNews,
    thumbUpCheckInNews,
    requestCommentCheckInNews,
    commentCheckInNews,
    requestDeleteCommentCheckInNews,
    requestCheckInNewsCommentList,
    updateCheckInNewsCommentList,
    deleteCommentCheckInNews,
    setCheckInListLoadingState,
    setCheckInListErrorState,
} from './actions';

// const fakeCheckInList = mockCheckInList();
// const fakeComment = mockComment();
// const fakeRes = { state: {code:0, msg: "操作成功"}};
// console.log(fakeComment);

// import { api, mockableApiFactory } from '../../utils/api';



const checkInListApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/checkInList',
    method: 'POST',
    mockFunc: mockCheckInList,
});

const deleteNewsApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/deleteCheckInNews',
    method: 'POST',
});

const thumbUpApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/thumbUp',
    method: 'POST',
});

const unThumbApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/unThumb',
    method: 'POST',
});

const commentApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/comment',
    method: 'POST',
    mockFunc: mockComment,
});

const deleteCommentApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/deleteComment',
    method: 'POST',
});

const commentListApi = mockableApiFactory({
    url:'/api/wechat/checkInCamp/getCommentList',
    method: 'POST',
    mockFunc: mockCommentList,
});



function* getCheckInList(action) {
    yield call(setCheckInListLoadingState, { type: 'getNews', loading: true })
    // userId, campId, type, timeStamp, beforeOrAfer, pageSize,
    const { campId, type, timeStamp, beforeOrAfter, pageSize, next } = action.payload;
    const res = yield call(checkInListApi, {params:{...action.payload}, mock: false})
    // console.log(res)
    if (res.state.code === 0) {
        yield call(setCheckInListLoadingState, { type: 'getNews', loading: false });
        yield call(setCheckInListErrorState, { type: 'getNews', error: null });
        const { beforeOrAfer } = action.payload;
        const { affairList } = res.data
        const hasMoreData = affairList.length === pageSize ? 'Y' : 'N'
        // console.log('hasMoreData: ', hasMoreData)
        if (beforeOrAfter === 'after') {
            const firstTimeStamp = affairList.length == 0 ? 1120752000000 : affairList[0].createTimeStamp
            console.log('hasmore', hasMoreData)
            yield call(prependCheckInList, {hasMoreData, firstTimeStamp, checkInList: affairList  || []})
        } else if (beforeOrAfter === 'before'){
            const lastTimeStamp = affairList.length == 0 ? 1120752000000 : affairList[affairList.length - 1].createTimeStamp
            yield call(appendCheckInList, {hasMoreData, lastTimeStamp, checkInList: affairList || [] })
        }     
    } else {
        yield call(setCheckInListErrorState, { type: 'getNews', error: res.state });
    }
    next&&next()
    // console.log(next)
    return res;
}

function* deleteNews(action) {
    yield call(setCheckInListLoadingState, { type: 'deleteNews', loading: true })
    const { affairId, liveId, campId } = action.payload;
    const res = yield call(deleteNewsApi, {params:{affairId, liveId, campId}, mock: false})
    // console.log(res)
    if (res.state.code === 0) {
        yield call(setCheckInListLoadingState, { type: 'deleteNews', loading: false });
        yield call(setCheckInListErrorState, { type: 'deleteNews', error: null });
        yield call(deleteCheckInNews, {  affairId });
    } else {
        yield call(setCheckInListErrorState, { type: 'deleteNews', error: res.state });
    }
    return res;
}


function* comment(action) {
    yield call(setCheckInListLoadingState, { type: 'comment', loading: true })
    const { comment, affairId, liveId} = action.payload;
    const { commentUserId, parentUserId, content, duration, contentType, audioId} = comment;
    console.log(comment);
    const res = yield call(commentApi, {params:{
        parentUserId,
        affairId,
        content,
        liveId,
        contentType, 
        audioId,
        duration
    }, mock: false})


// commentUserId	long	评论用户id， 用于判断当前评论是否自己评论，能否删除判断
// commentId	long	评论id
// commentUserName	string	当前评论的用户名称
// parentUserName

// commentId	Long	评论的id
// commentUserId	string	评论的用户id
// commentUserName	string	评论的用户名称
// parentUserName	string	评论的上级用户名称(如果是直接评论打卡的,则为空)，用于显示『菜菜回复静静：穿什么？』
// content	string	评论的内容


    if (res.state.code === 0) {
        const newComment = { ...res.data, content: decodeURIComponent(content)}
        console.log(newComment)
        yield call(setCheckInListLoadingState, { type: 'comment', loading: false });
        yield call(setCheckInListErrorState, { type: 'comment', error: null });
        yield call(commentCheckInNews, { comment: newComment, affairId });
    } else {
        yield call(setCheckInListErrorState, { type: 'comment', error: res.state });
    }

    return res;
}

function* deleteComment(action) {
    yield call(setCheckInListLoadingState, { type: 'deleteComment', loading: true })
    const { commentId, liveId, affairId } = action.payload
    const res = yield call(deleteCommentApi, {params:{commentId, liveId}, mock: false})
    console.log(res)
    if (res.state.code === 0) {
        yield call(setCheckInListLoadingState, { type: 'deleteComment', loading: false });
        yield call(setCheckInListErrorState, { type: 'deleteComment', error: null });

        yield call(deleteCommentCheckInNews, {  commentId, affairId });
    } else {
        yield call(setCheckInListErrorState, { type: 'deleteComment', error: res.state });
    }
    return res;
}

function* thumbUp(action) {
    yield call(setCheckInListLoadingState, { type: 'thumbUp', loading: true })
    const {  affairId, nickName } = action.payload
    yield call(thumbUpCheckInNews, {  affairId, nickName });

    const res = yield call(thumbUpApi, {params:{affairId}, mock: false})
    // console.log(res)
    // console.log(nickName)
    if (res.state.code === 0) {
        yield call(setCheckInListLoadingState, { type: 'thumbUp', loading: false });
        yield call(setCheckInListErrorState, { type: 'thumbUp', error: null });
        // yield call(thumbUpCheckInNews, {  affairId, nickName });
    } else {
        yield call(setCheckInListErrorState, { type: 'thumbUp', error: res.state });
        yield call(unthumbCheckInNews, {  affairId, nickName });
    }

    return res;
}

function* unThumb(action) {
    yield call(setCheckInListLoadingState, { type: 'unthumb', loading: true });
    const { affairId, nickName } = action.payload
    yield call(unthumbCheckInNews, {  affairId, nickName });
    const res = yield call(unThumbApi, {params:{affairId}, mock: false})

    if (res.state.code === 0) {
        yield call(setCheckInListLoadingState, { type: 'unthumb', loading: false });
        yield call(setCheckInListErrorState, { type: 'unthumb', error: null });
        // yield call(unthumbCheckInNews, {  affairId, nickName });
    } else {
        yield call(setCheckInListErrorState, { type: 'unthumb', error: res.state });
        yield call(thumbUpCheckInNews, {  affairId, nickName });
    }
    return res;
}

function* getCommentList(action) {
    yield call(setCheckInListLoadingState, { type: 'getCommentList', loading: true })
    const { affairId, nickName } = action.payload
    const res = yield call(commentListApi, {params:{affairId, page:{page:1, size:9999}}, mock: false})

    if (res.state.code === 0) {
        yield call(setCheckInListLoadingState, { type: 'getCommentList', loading: false });
        yield call(setCheckInListErrorState, { type: 'getCommentList', error: null });
        yield call(updateCheckInNewsCommentList, {  affairId, commentList: res.data.commentList });
    } else {
        yield call(setCheckInListErrorState, { type: 'getCommentList', error: res.state });
    }
    return res;
}

  
  
function* watchGetCheckInLists() {
    yield takeEvery(requestCheckInList, getCheckInList);
}

function* watchDeleteCheckInNews() {
    yield takeEvery(requestDeleteCheckInNews, deleteNews);
}

function* watchThumbUpCheckInNews() {
    yield takeEvery(requestThumbUpCheckInNews, thumbUp);
}

function* watchUnThumbCheckInNews() {
    yield takeEvery(requestUnthumbCheckInNews, unThumb);
}

function* watchCommentCheckInNews() {
    yield takeEvery(requestCommentCheckInNews, comment);
}

function* watchDeleteCommentCheckInNews() {
    yield takeEvery(requestDeleteCommentCheckInNews, deleteComment);
}

function* watchGetCheckInNewsCommentList() {
    yield takeEvery(requestCheckInNewsCommentList, getCommentList);
}


export default [
    watchGetCheckInLists,
    watchDeleteCheckInNews,
    watchThumbUpCheckInNews,
    watchUnThumbCheckInNews,
    watchCommentCheckInNews,
    watchDeleteCommentCheckInNews,
    watchGetCheckInNewsCommentList,

]