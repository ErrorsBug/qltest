import { createAction, createReducer } from 'redux-act';
import { findIndex } from 'lodash';
import { 
    prependCheckInList,
    appendCheckInList, 
    deleteCheckInNews,
    unthumbCheckInNews,
    thumbUpCheckInNews,
    commentCheckInNews,
    deleteCommentCheckInNews,
    updateCheckInNewsCommentList,
    setCheckInListPageSize,
    setCheckInListErrorState,
    setCheckInListLoadingState,
} from './actions';

/**
 * 初始状态
 */
const initState = {
    // 加载状态
    loadingState: {
        getNewsLoading: false,
        deleteNewsLoading: false,
        commentLoading: false,
        deleteCommentLoading: false,
        thumbUpLoading: false,
        unThumbLoading: false,
        getCommentListLoading: false,
    },
    // 加载错误信息
    errorState: {
        getNewsError: null,
        deleteNewsError: null,
        commentError: null,
        deleteCommentError: null,
        thumbUpError: null,
        unThumbError: null,
        getCommentListError: null,
    }, 

    // 加载分页大小
    pageSize: 10,

    // 是否有更多数据
    hasMoreData: 'Y',

    // 当前动态最后一条时间戳
    lastTimeStamp: null,
    // 当前动态第一条时间戳
    firstTimeStamp: null,
    // 数据列表
    data: [],
}

const handleAppend = (state, { checkInList = [], hasMoreData, lastTimeStamp}) => {
    let hasMore = hasMoreData || state.hasMoreData;
    return { ...state, hasMoreData: hasMore, lastTimeStamp, data: [...state.data, ...checkInList]}
}

const handlePrepend = (state, { checkInList = [], hasMoreData, firstTimeStamp}) => {
    // console.log(checkInList)
    const hasMore = hasMoreData || state.hasMoreData;
    return { ...state, hasMoreData: hasMore, firstTimeStamp, data: [...checkInList, ...state.data]}
}

const handleDeleteNews = (state, { affairId }) => {
    const newDataList = state.data.filter((item) => item.affairId !== affairId);
    return { ...state, data: [...newDataList]}
}

const handleThumbUp = (state, { affairId, nickName }) => {

    const { data } = state;
    const newData = [...data];
    const index = findIndex(newData, {affairId});
    const oldNews = newData[index];
    const thumbUpCount = oldNews.thumbUpCount + 1;
    const thumbUpList = [...oldNews.thumbUpList, {userName: nickName}];
    // console.log(thumbUpList)
    const news = { 
        ...oldNews, 
        thumbUpCount,
        thumbUpList,
        isThumbUp: 'Y',
    };

    newData.splice(index, 1, news);
    return { ...state, data: newData };
}

const handleUnThumb = (state, { affairId, nickName }) => {

    const { data } = state;
    const newData = [...data];
    const index = findIndex(newData, {affairId});

    const oldNews = newData[index];
    const thumbUpCount = oldNews.thumbUpCount - 1;
    const thumbUpList = oldNews.thumbUpList.filter(item => item.userName !== nickName);
    const news = { 
        ...data[index], 
        thumbUpCount,
        thumbUpList,
        isThumbUp: 'N',
    };

    newData.splice(index, 1, news);
    return { ...state, data: newData };
}

const handleComment = (state, { comment, affairId }) => {
    const { data } = state;
    const newData = [...data];
    const index = findIndex(newData, {affairId});
    // console.log(index)
    const oldNews = newData[index];
    // console.log(oldNews)
    const commentList = [...oldNews.commentList, comment];
    // console.log(commentList)
    const news = { 
        ...oldNews, 
        commentList,
    };
    // console.log(news)

    newData.splice(index, 1, news);
    return { ...state, data: newData };
}



const handleDeleteComment = (state, { commentId, affairId }) => {
    const { data } = state;
    const newData = [...data];
    const index = findIndex(newData, {affairId});

    const oldNews = newData[index];
    const commentList = oldNews.commentList.filter(item => item.commentId !== commentId);
    const news = { 
        ...oldNews, 
        commentList,
    };

    newData.splice(index, 1, news);
    return { ...state, data: newData };
}

const handleUpdateCommentList = (state, { affairId, commentList }) => {
    const { data } = state;
    const newData = [...data];
    const index = findIndex(newData, {affairId});

    const oldNews = newData[index];
    const news = { 
        ...oldNews, 
        commentList: [...commentList]
    };

    newData.splice(index, 1, news);
    return { ...state, data: newData };
}

const handleSetPage = (state, { pageSize }) => ({...state, pageSize,});

const handleSetError = (state, { type, error }) => {
    const {errorState} = state;
    switch (type) {
        case 'getNews': return { ...state, errorState: { ...errorState, getNewsError: error } }
        case 'deleteNews': return { ...state, errorState: { ...errorState, deleteNewsError: error } }
        case 'comment': return { ...state, errorState: { ...errorState, commentError: error } }
        case 'deleteComment': return { ...state, errorState: { ...errorState, deleteCommentError: error } }
        case 'thumbUp': return { ...state, errorState: { ...errorState, thumbUpError: error } }
        case 'unthumb': return { ...state, errorState: { ...errorState, unThumbError: error } }
        case 'getCommentList': return { ...state, errorState: { ...errorState, getCommentListError: error } }
        default: return state
    }
}

const handleSetLoading = (state, { type, loading }) => {
    const {loadingState} = state;
    // console.log(type)
    switch (type) {
        case 'getNews': return { ...state, loadingState: { ...loadingState, getNewsLoading: loading } }
        case 'deleteNews':return { ...state, loadingState: { ...loadingState, deleteNewsLoading: loading } }
        case 'comment':return { ...state, loadingState: { ...loadingState, commentLoading: loading } }
        case 'deleteComment':return { ...state, loadingState: { ...loadingState, deleteCommentLoading: loading } }
        case 'thumbUp':return { ...state, loadingState: { ...loadingState, thumbUpLoading: loading } }
        case 'unthumb': return { ...state, loadingState: { ...loadingState, unThumbLoading: loading } }
        case 'getCommentList': return { ...state, loadingState: { ...loadingState, getCommentListLoading: loading } }
        default: return state
    }
}


export const campCheckInList = createReducer({
    [appendCheckInList]: handleAppend,
    [prependCheckInList]: handlePrepend,
    [deleteCheckInNews]: handleDeleteNews,
    [thumbUpCheckInNews]: handleThumbUp,
    [unthumbCheckInNews]: handleUnThumb,
    [commentCheckInNews]: handleComment,
    [deleteCommentCheckInNews]: handleDeleteComment,
    [updateCheckInNewsCommentList]: handleUpdateCommentList,
    [setCheckInListPageSize]: handleSetPage,
    [setCheckInListErrorState]: handleSetError,
    [setCheckInListLoadingState]: handleSetLoading,
}, initState);