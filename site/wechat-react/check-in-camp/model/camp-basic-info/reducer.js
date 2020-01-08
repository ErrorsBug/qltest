import { createAction, createReducer } from 'redux-act';
import { pick } from 'lodash';
import { 
    setCampBasicInfo,
    fetchCampBasicInfo,
    fetchCampBasicInfoError,
    fetchCampBasicInfoSuccess,
    fetchLshareKey,
    requestLshareKeyBind,
} from './actions';

/**
 * 初始状态
 */
const initState = {
    // 加载状态
    loading: false,
    // 加载错误信息
    error: null,
    // 训练营名称
    name: null,
    // 训练营Id
    campId: null,
    // 训练营头图
    headImage: null,
    // 报名人数
    authNum: null,
    // 报名价格
    price: null,
    // 契约金比例
    bonusPercent: null,
    // 实际收益
    actualAmount: null,
    // 开始时间 时间戳
    startTimeStamp: null,
    // 结束时间 时间戳
    endTimeStamp: null,
    // 总打卡次数
    allAffairNum: null,
    // 领取契约金需打卡次数
    receiveDayNum: null,
    // 所属直播间ID
    liveId: null,
    // 所属直播间的名称
    liveName: null,
    // 直播间头像
    liveHeadImage: null,
    // 是否关注当前直播间
    isFollow: null,
    // 奖金池总金额
    totalBonus: null,
    // 打卡完成人数
    completeNum: null,
    // 实际打卡完成人数（除去管理员与的创建者）
    realCompleteNum: null,
    // 打卡领取条件天数
    receiveDayNum: null,
    // 是否开启奖金返现
    bonusStatus: null,
    // 格式化日期时间信息
    dateInfo: {
        // 当前打卡天数, -n 为还有 n 天开始，n 为打卡第 n 天
        currentDays: null,
        // 打卡总天数
        totalDays: null,
        // 开始日期
        startDate: null,
        // 结束日期
        endDate: null,
        // 是否结束 Y/N
        isEnd: null,
        // 是否开始 Y/N
        isBegin: null,
        // 今日日期
        today: null,
    },
    //直播间shareKey
    lshareKey:null,
}


const handleRequest = (state, payload) => ({...state, loading: true});


const handleSuccess = (state, {data, setDataType, callback}) => {
    let newData = {}
    switch (setDataType) {
        case 'static':
            newData =  pick(data, ['name', 'campId', 'headImage', 'price', 'bonusPercent', 'startTimeStamp', 'endTimeStamp', 'liveId', 'dayNum', 'dateInfo']);
            break;
        default:
            newData = {...data}
            break;
    }
    // console.log(newData)
    callback && callback(newData);
    return {
        ...state,
        ...newData,
        loading: false,
    }
}

const handleError = (state, payload) => {
    return {
        ...state,
        error: payload,
        loading:false,
    }
}

const handleSetBasicInfo = (state, payload) => {
    return {
        ...state,
        ...payload,
    }
}

export const campBasicInfo = createReducer({
    [setCampBasicInfo]: handleSetBasicInfo,
    [fetchCampBasicInfo]: handleRequest,
    [fetchCampBasicInfoSuccess]: handleSuccess,
    [fetchCampBasicInfoError]: handleError,
    [fetchLshareKey]:handleSetBasicInfo,
    [requestLshareKeyBind]:handleRequest,
}, initState);