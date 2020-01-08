import { createAction, createReducer } from 'redux-act';
import { findIndex } from 'lodash';
import { 
    appendCampTopicList,
    appendTodayTopicList,
    setDisplayCampTopic,
    deleteCampTopic,
    endCampTopic,
    setCampTopicsErrorState,
    setCampTopicsLoadingState,
} from './actions';

/**
 * 初始状态
 */
const initState = {
    // 加载状态
    loadingState: {
        campTopicListLoading: false,
        todayTopicListLoading: false,
        deleteTopicLoading: false,
        setTopicDisplayLoading: false,

    },
    // 加载错误信息
    errorState: {
        campTopicListError: null,
        todayTopicListError: null,
        deleteTopicError: null,
        setTopicDisplayError: null,
    },
    
    campTopicList: [],
    todayTopicList: [],

    hasNoMoreTopics: 'N',
}


const handleAppendCampTopicList = (state, { campTopicList = [], hasNoMoreTopics }) => {
    return { 
        ...state,
        campTopicList: [...state.campTopicList, ...campTopicList],
        hasNoMoreTopics: hasNoMoreTopics
    }
};

const handleAppendTodayTopicList = (state, { todayTopicList = [] }) => {
    return { 
        ...state,
        todayTopicList: [...state.todayTopicList, ...todayTopicList],
    }
}

const handleSetDisplayTopic = (state, {topicId, status}) => {
    const { campTopicList } = state;
    const index = findIndex(campTopicList, {topicId});
    const oldTopic = campTopicList[index];

    const newTopic = {
        ...oldTopic,
        displayStatus: status
    }

    const newTopicList = [...campTopicList];
    newTopicList.splice(index, 1, newTopic);
    return { ...state, campTopicList: newTopicList };
}

const handleDeleteTopic = (state, {topicId}) => {
    // console.log(topicId)
    const { campTopicList } = state;
    const newTopicList = campTopicList.filter((item) => {
        // console.log(item.topicId)
        return item.topicId != topicId
    } );
    // console.log(newTopicList)
    return { ...state, campTopicList: newTopicList };
}

const handleEndTopic = (state, {topicId}) => {
    const { campTopicList } = state;
    const index = findIndex(campTopicList, {topicId});
    const oldTopic = campTopicList[index];

    const newTopic = {
        ...oldTopic,
        status: 'ended',
    }

    const newTopicList = [...campTopicList];
    newTopicList.splice(index, 1, newTopic);
    return { ...state, campTopicList: newTopicList };
}

const handleSetError = (state, { type, error }) => {
    const {errorState} = state;
    switch (type) {
        case 'campTopicList': return { ...state, errorState: { ...errorState, campTopicListError: error } }
        case 'todayTopicList': return { ...state, errorState: { ...errorState, todayTopicListError: error } }
        case 'deleteTopic': return { ...state, errorState: { ...errorState, deleteTopicError: error } }
        case 'setTopicDisplay': return { ...state, errorState: { ...errorState, setTopicDisplayError: error } }
        default: return state
    }
}

const handleSetLoading = (state, { type, loading }) => {
    const {loadingState} = state;
    switch (type) {
        case 'campTopicList': return { ...state, loadingState: { ...loadingState, campTopicListLoading: loading } }
        case 'todayTopicList':return { ...state, loadingState: { ...loadingState, todayTopicListLoading: loading } }
        case 'deleteTopic': return { ...state, loadingState: { ...loadingState, deleteTopicLoading: loading } }
        case 'setTopicDisplay': return { ...state, loadingState: { ...loadingState, setTopicDisplayLoading: loading } }
        default: return state
    }
}

export const campTopics = createReducer({
    [appendCampTopicList]: handleAppendCampTopicList,
    [appendTodayTopicList]: handleAppendTodayTopicList,
    [setDisplayCampTopic]: handleSetDisplayTopic, 
    [deleteCampTopic]: handleDeleteTopic,
    [endCampTopic]: handleEndTopic,
    [setCampTopicsErrorState]: handleSetError,
    [setCampTopicsLoadingState]: handleSetLoading,
}, initState);