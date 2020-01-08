import { createAction, createReducer } from 'redux-act';
import { setCampUserInfo, setCampUserInfoErrorState, setCampUserInfoLoadingState} from './actions';

/**
 * 初始状态
 */
const initState = {
    loading: false,

    error: null,
    // 用户昵称
    nickName: null,
    // 用户ID
    userId: null,
    // 用户头像
    headImage: null,
    // 打卡次数
    affairCount: null,
    // 打卡名词
    affairRank: null,
    // 是否购买
    payStatus: null,
    // 分享奖金金额
    shareBonus: null,
    // 奖金池是否已经瓜分
    status: null,
    // 是否完成打卡训练营任务
    completeStatus: null,
    // 今日是否打卡
    affairStatus: null,
    // 是否是VIP用户
    isVip: 'N',
}

const handleSetUserInfo = (state, payload) => {
    // VIP用户相当于已购用户
    if (payload.isVip == 'Y') {
        payload.payStatus = 'Y';
    }
    
    return {
        ...state,
        ...payload,
    }
}

const handleSetError = (state, payload) => {
    return { ...state, error: {...payload}}
}

const handleSetLoading = (state, {loading}) => {
    return {...state, loading}
}

export const campUserInfo = createReducer({
    [setCampUserInfo]: handleSetUserInfo,
    [setCampUserInfoErrorState]: handleSetError,
    [setCampUserInfoLoadingState]: handleSetLoading, 
}, initState);