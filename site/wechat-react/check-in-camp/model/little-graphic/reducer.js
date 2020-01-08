import { createAction, createReducer } from 'redux-act';
import {
    updateLittleGraphicContentList,
    updateLittleGraphicContent,
    updateLittleGraphicBaseInfo,
    deleteLittleGraphicContent,
    setLittleGraphicPageSize,
    setLittleGraphicLoadingState,
    setLittleGraphicErrorState,
} from './actions';

/**
 * 初始状态
 */
const initState = {
     // 加载状态
     loadingState: {
        basicInfoLoading: false,
        contentListLoading: false,
        addOrUpdateLoading: false,
    },
    // 加载错误信息
    errorState: {
        basicInfoError: null,
        contentListError: null,
        addOrUpdateError: null,
    }, 
    // 加载分页大小
    pageSize: 9999,
    // String	图文id
    id: null,
    // String	直播间id
    liveId: null,
    // String	直播间名称
    liveName: null,
    // String	小图文话题名称
    topicName: null,
    // Long	小图文话题创建时间戳
    createTimeTamp: null,
    // 小图文内容列表
    // contentList 对象说明
    // 参数名	    类型	     说明
    // id	      String	发言id(可以为空)
    // fileId	  String	图片的id
    // content	  String	发言内容
    // type	      String	发言类型 image=图片，audio=音频，text文本
    // second	  int	    音频的秒数
    // sort	      int	    排序
    contentList: null,
}


const handleUpdateContentList = (state, { contentList = [] }) => {
    return { ...state, contentList: [...contentList]}
}

const handleUpdeteContent= (state, { index, content }) => {
    const newContentList = state.contentList.map((item, idx) => {
        if (index != idx) return item
        return {...item, content}
    })
    return { ...state, contentList: newContentList}
}

const handleUpdateBaseInfo = (state, { baseInfo }) => {
    return {...state, ...baseInfo}
}

const handleDelete = (state, { index }) => {
    const newContentList = state.contentList.filter((item, idx) => idx != index);
    return { ...state, contentList: [...newContentList]}
}

const handleSetPage = (state, { pageSize }) => ({...state, pageSize,});

const handleSetError = (state, { type, error }) => {
    const {errorState} = state;
    switch (type) {
        case 'basicInfo': return { ...state, errorState: { ...errorState, basicInfoError: error } }
        case 'contentList': return { ...state, errorState: { ...errorState, contentListError: error } }
        case 'addOrUpdate': return { ...state, errorState: { ...errorState, addOrUpdateError: error } }
        default: return state
    }
}

const handleSetLoading = (state, { type, loading }) => {
    const {loadingState} = state;
    switch (type) {
        case 'basicInfo': return { ...state, loadingState: { ...loadingState, basicInfoLoading: loading } }
        case 'contentList':return { ...state, loadingState: { ...loadingState, contentListLoading: loading } }
        case 'addOrUpdate':return { ...state, loadingState: { ...loadingState, addOrUpdateLoading: loading } }
        default: return state
    }
}

export const littleGraphic = createReducer({
    [updateLittleGraphicContentList]: handleUpdateContentList,
    [updateLittleGraphicContent]: handleUpdeteContent,
    [updateLittleGraphicBaseInfo]: handleUpdateBaseInfo,
    [deleteLittleGraphicContent]: handleDelete,
    [setLittleGraphicPageSize]: handleSetPage,
    [setLittleGraphicLoadingState]: handleSetError,
    [setLittleGraphicErrorState]: handleSetError,
}, initState);