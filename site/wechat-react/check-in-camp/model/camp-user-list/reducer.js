import { createAction, createReducer } from 'redux-act';
import { findIndex } from 'lodash';
import { 
    appendCampUserList,
    appendUserHeadList,
    appendCheckInHeadList,
    appendCheckInTopNList,
    setHasMoreUserList,
    setUserBlack,
    setUserKickout,
    setUserListLoadingState,
    setUserListErrorState,
    setUserListReqPage,
} from './actions';

/**
 * 初始状态
 */
const initState = {
    // 加载状态
    loadingState: {
        userListLoading: false,
        userHeadListLoading: false,
        setUserBlackLoading: false,
        setUserKickOutLoading: false,

    },
    // 加载错误信息
    errorState: {
        userListError: null,
        userHeadListError: null,
        setUserBlackError: null,
        setUserKickOutError: null,
    },
    // 用户列表
    userList: [],
    // 报名用户头像列表
    userHeadList: [],
    // 打卡用户头像列表
    checkInHeadList: [],
    // 打卡排行榜用户信息
    topNList: [],

    hasMoreData: 'Y',

    page: {
        page: 1,
        size: 20,
    },

    hasMoreUserList: true,
}


const handleAppendUserList = (state, { userList = [] }) => {
    return { 
        ...state,
        userList: [...userList],
    }
};

const handleAppendUserHeadList = (state, { userHeadList = [] }) => {
    return { 
        ...state,
        userHeadList: [...userHeadList],
    }
}

const handleAppendCheckInHeadList = (state, { checkInHeadList = [] }) => {
    return { 
        ...state,
        checkInHeadList: [...checkInHeadList],
    }
}

const handleHasMoreData = (state, { hasMoreData }) => {
    return {
        ...state,
        hasMoreData,
    }
}

const handleAppendTopNList = (state, { topNList = [] }) => {
    return { 
        ...state,
        topNList: [...state.topNList, ...topNList],
    }
}

const handleSetUserBlack = (state, {targetUserId, status}) => {
    const { userList } = state;
    const index = findIndex(userList, {id: targetUserId});
    const oldUserState = userList[index];

    const newUserState = {
        ...oldUserState,
        blackListStatus: status
    }

    const newUserList = [...campTopicList];
    newUserList.splice(index, 1, newUserState);
    return { ...state, userList: newUserList };
}

const handleSetUserKickOut = (state, {targetUserId, status}) => {
    const { userList } = state;
    const index = findIndex(userList, {id: targetUserId});
    const oldUserState = userList[index];

    const newUserState = {
        ...oldUserState,
        payStatus: status === 'Y' ? 'D' : 'Y',
    }

    const newUserList = [...campTopicList];
    newUserList.splice(index, 1, newUserState);
    return { ...state, userList: newUserList };
}

const handleSetError = (state, { type, error }) => {
    const {errorState} = state;
    switch (type) {
        case 'userList': return { ...state, errorState: { ...errorState, userListError: error } }
        case 'userHeadList': return { ...state, errorState: { ...errorState, userHeadListError: error } }
        case 'setUserBlack': return { ...state, errorState: { ...errorState, setUserBlackError: error } }
        case 'setUserKickout': return { ...state, errorState: { ...errorState, setUserKickOutError: error } }
        default: return state
    }
}

const handleSetLoading = (state, { type, loading }) => {
    const {loadingState} = state;
    switch (type) {
        case 'userList': return { ...state, loadingState: { ...loadingState, userListLoading: loading } }
        case 'userHeadList':return { ...state, loadingState: { ...loadingState, userHeadListLoading: loading } }
        case 'setUserBlack': return { ...state, loadingState: { ...loadingState, setUserBlackLoading: loading } }
        case 'setUserKickout': return { ...state, loadingState: { ...loadingState, setUserKickOutLoading: loading } }
        default: return state
    }
}

const handleSetPage = (state, { page, hasMore}) => {
    return {
        ...state,
        page,
        hasMore,
    }
}

export const campUserList = createReducer({
    [appendCampUserList]: handleAppendUserList,
    [appendUserHeadList]: handleAppendUserHeadList,
    [setHasMoreUserList]: handleHasMoreData,
    [appendCheckInHeadList]: handleAppendCheckInHeadList,
    [appendCheckInTopNList]: handleAppendTopNList,
    [setUserBlack]: handleSetUserBlack, 
    [setUserKickout]: handleSetUserKickOut,
    [setUserListErrorState]: handleSetError,
    [setUserListLoadingState]: handleSetLoading,
    [setUserListReqPage]: handleSetPage
}, initState);