import { createReducer } from 'redux-act';
import { 
    fetchAuthInfo,
    fetchAuthInfoError,
    fetchAuthInfoSuccess, 
    getLocalAuthInfo,
    setLocalAuthInfo,
} from './actions';

/**
 * 初始状态
 */
const initState = {
    // 加载状态
    loading: false,
    // 加载错误信息
    error: null,
    // boolean 是否允许管理禁言
    allowMGBanned: false,
    // boolean 是否允许创建
    allowCreateTopic: false,
    // boolean 是否允许删除评论
    allowDelComment: false,
    // boolean 是否允许删除管理员
    allowDelInviteMg: false,
    // boolean 是否允许删除发言
    allowDelSpeak: false,
    // boolean 是否允许邀请管理员
    allowInviteMg: false,
    // boolean 是否允许管理直播间
    allowMGLive: false,
    // boolean 是否允许管理打赏
    allowMGReward: false,
    // boolean 是否允许管理话题
    allowMGTopic: false,
    // boolean 是否允许删除嘉宾或主持人
    allowMGTopicInvite: false,
    // boolean 是否允许上墙
    allowReplyComment: false,
    // boolean 是否允许查看打赏
    allowSearchReward: false,
    // boolean 是否允许发言
    allowSpeak: false,
    // boolean 是否允许邀请嘉宾或主持人
    allowTopicInvite: false,
}

const handleRequest = (state, payload) => ({...state, loading: true});

const handleSuccess = (state, payload) => {
    return {
        ...state,
        ...payload,
        loading:false,
    }
}

const handleError = (state, payload) => {
    return {
        ...state,
        error: payload,
        loading:false,
    }
}

const handleGetLocalAuthInfo = (state, payload) => {
    const { campId, userId } = payload;
    const storeId = campId + "_" + userId;
    // console.log(storeId)
    const localStoreData = localStorage.getItem(storeId);

    if (localStoreData) {
        const authInfo = JSON.parse(localStoreData);
        return { ...state, ...authInfo }
    }

    return { ...state }

} 

const handleSetLocalAuthInfo = (state, payload) => {
    const { campId, userId } = payload;
    const { payStatus, allowMGLive } = state;
    const storeId = campId + "_" + userId;
    if (localStorage) {
        localStorage.setItem(storeId, JSON.stringify({ payStatus, allowMGLive }));   
    }

    return { ...state}
}

export const campAuthInfo = createReducer({
    [fetchAuthInfo]: handleRequest,
    [fetchAuthInfoSuccess]: handleSuccess,
    [fetchAuthInfoError]: handleError,
    [getLocalAuthInfo]: handleGetLocalAuthInfo,
    [setLocalAuthInfo]: handleSetLocalAuthInfo,
}, initState);