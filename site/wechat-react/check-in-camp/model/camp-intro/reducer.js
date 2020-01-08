import { createAction, createReducer } from 'redux-act';
import {
    requestCampIntroList,
    appendCampIntroList,
    setCampInroListLoadingState,
    setCampInroListErrorState,
} from './actions';

/**
 * 初始状态
 */
const initState = {
    // 加载状态
    loading: false,
    // 加载错误信息
    error: null,
    // 用户列表
    introList: [],
}


const handleAppendIntroList = (state, { introList = [] }) => {
    // console.log(state)
    return { 
        ...state,
        introList: [...state.introList, ...introList],
    }
};


const handleSetError = (state, { error }) => {
    return {
        ...state,
        error,
    }
}

const handleSetLoading = (state, { loading }) => {
    return {
        ...state,
        loading,
    }
}


export const campIntroModel = createReducer({
    [appendCampIntroList]: handleAppendIntroList,
    [setCampInroListLoadingState]: handleSetError,
    [setCampInroListErrorState]: handleSetLoading,
}, initState);