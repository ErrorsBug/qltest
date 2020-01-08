import { api } from './common';
import { get } from 'lodash';
// 更新数据
export const UPDATE_PROFIT_OVERVIEW = 'UPDATE_PROFIT_OVERVIEW'
export const UPDATE_PROFIT_RECORDS = 'UPDATE_PROFIT_RECORDS'
export const UPDATE_PROFIT_RECORD_CHANNEL = 'UPDATE_PROFIT_RECORD_CHANNEL'
export const UPDATE_PROFIT_RECORD_TOPIC = 'UPDATE_PROFIT_RECORD_TOPIC'
export const UPDATE_PROFIT_DETAIL_CHANNEL = 'UPDATE_PROFIT_DETAIL_CHANNEL'
export const INIT_PAGE_DATA = 'INIT_PAGE_DATA'
export const UPDATE_CHANNEL_DETAIL = 'UPDATE_CHANNEL_DETAIL'
export const UPDATE_MEDIA_PROFIT_RECORDS = 'UPDATE_MEDIA_PROFIT_RECORDS'

// 清除数据
export const CLEAR_PROFIT_OVERVIEW = 'CLEAR_PROFIT_OVERVIEW'
export const CLEAR_PROFIT_RECORDS = 'CLEAR_PROFIT_RECORDS'
export const CLEAR_PROFIT_RECORD_CHANNEL = 'CLEAR_PROFIT_RECORD_CHANNEL'
export const CLEAR_PROFIT_RECORD_TOPIC = 'CLEAR_PROFIT_RECORD_TOPIC'
export const CLEAR_PROFIT_DETAIL_CHANNEL = 'CLEAR_PROFIT_DETAIL_CHANNEL'
export const UPDATE_PROFIT_RECORD_TECHNO_CHANNEL = 'UPDATE_PROFIT_RECORD_TECHNO_CHANNEL'
export const UPDATE_PROFIT_RECOMMEND_CHANNEL = 'UPDATE_PROFIT_RECOMMEND_CHANNEL'
export const UPDATE_PROFIT_RECOMMEND_TOTAL = 'UPDATE_PROFIT_RECOMMEND_TOTAL'
export const UPDATE_PROFIT_RECOMMEND_TOPIC = 'UPDATE_PROFIT_RECOMMEND_TOPIC'
export const CLEAR_MEDIA_PROFIT_RECORDS = 'CLEAR_MEDIA_PROFIT_RECORDS'
export const UPDATE_PROFIT_DISPLAYSTATUS = 'UPDATE_PROFIT_DISPLAYSTATUS'

export function clearProfitOverview() { return { type: CLEAR_PROFIT_OVERVIEW } }
export function clearProfitRecords() { return { type: CLEAR_PROFIT_RECORDS } }
export function clearProfitRecordChannel() { return { type: CLEAR_PROFIT_RECORD_CHANNEL } }
export function clearProfitRecordTopic() { return { type: CLEAR_PROFIT_RECORD_TOPIC } }
export function clearProfitDetailChannel() { return { type: CLEAR_PROFIT_DETAIL_CHANNEL } }
export function clearProfitMediaRecord() {return { type: CLEAR_MEDIA_PROFIT_RECORDS }}

export function updateProfitOverview(data) {
    return {
        type: UPDATE_PROFIT_OVERVIEW,
        ...data,
    };
}

export function updateProfitRecords(data) {
    return {
        type: UPDATE_PROFIT_RECORDS,
        ...data,
    }
}

export function updateProfitDetailChannel(data) {
    return {
        type: UPDATE_PROFIT_DETAIL_CHANNEL,
        ...data,
    }
}

export function initAnalysisPageData(pageData) {
    return {
        type: INIT_PAGE_DATA,
        pageData
    }
}

export function profitRecordRecommendTotal(data) {
    return {
        type: UPDATE_PROFIT_RECOMMEND_TOTAL,
        data
    }
}

/* 收益统计*/
export function fetchProfitOverview(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/profit/total',
            body: { liveId },
        });
        dispatch({
            type: UPDATE_PROFIT_OVERVIEW,
            ...result.data,
        });

        return result;
    };
}


/*获取提现额度*/
export function fetchDepositLimit(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/profit/limit',
            body: { liveId },
        });
        return result;
    };
}

/**
 * 收益流水
 * 
 * @export
 * @param {string} liveId 直播间id
 * @param {string} profitType 类型
 * @param {string} startTime 开始时间 
 * @param {string} endTime 结束时间
 * @param {number} page 页码
 * @param {number} size 分页大小
 * @returns 
 */
export function fetchProfitRecords(options) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/profit/records',
            body: { ...options },
        });

        if (result.state.code === 0) {
            dispatch({
                type: UPDATE_PROFIT_RECORDS,
                ...result.data,
            });
        }

        return result;
    };
}


/**
 * 获取系列课收益列表
 * 
 * @export
 * @param {any} liveId 
 * @param {any} page 
 * @param {any} size 
 * @returns 
 */
export function fetchProfitRecordChannel(liveId) {
    return async (dispatch, getStore) => {
        let pageNum = getStore().profit.pageNum;
        let pageSize = getStore().profit.pageSize;
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/profit/record/channel',
            body: { liveId, pageNum, pageSize },
        });
        let channelList = get(result, 'data.channelList', []);
        if (channelList.length > 0) {
            dispatch({
                type: INIT_PAGE_DATA,
                pageData: { pageNum: ++pageNum }
            })
        }
        dispatch({
            type: UPDATE_PROFIT_RECORD_CHANNEL,
            channelList,
        });

        return result;
    };
}
export function profitRecordChannelUpdate(channelList) {
    return {
        type: UPDATE_PROFIT_RECORD_CHANNEL,
        channelList,
    }
};

/**
 * 获取话题收益列表
 * 
 * @export
 * @param {any} liveId 
 * @param {any} page 
 * @param {any} size 
 * @returns 
 */
export function fetchProfitRecordTopic(liveId) {
    return async (dispatch, getStore) => {
        let pageNum = getStore().profit.pageNum;
        let pageSize = getStore().profit.pageSize;
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/profit/record/topic',
            body: { liveId, pageNum, pageSize },
        });
        let topicList = get(result, 'data.topicList', []);
        if (topicList.length > 0) {
            dispatch({
                type: INIT_PAGE_DATA,
                pageData: { pageNum: ++pageNum }
            })
        }
        dispatch({
            type: UPDATE_PROFIT_RECORD_TOPIC,
            topicList,
        });

        return result;
    };
}

export function profitRecordTopicUpdate(topicList) {
    return {
        type: UPDATE_PROFIT_RECORD_TOPIC,
        topicList,
    }
};


/**
 * 获取系列课收益详情
 * 
 * @export
 * @param {any} channelId 
 * @param {any} type 
 * @param {number} page
 * @param {number} size
 * @returns 
 */
export function fetchProfitDetailChannel(channelId, type, page, size) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/profit/detail/channel',
            body: { channelId, type, pageNum: page, pageSize: size },
        });
        if (result && result.state && result.state.code === 0) {
            dispatch({
                type: UPDATE_PROFIT_DETAIL_CHANNEL,
                ...result.data,
            });
        }

        return result;
    };
}

export function doWithdraw(liveId, name, totalFee) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/profit/withdraw',
            body: { liveId, name, totalFee },
        });

        return result;
    };
}

export function fetchKnowledgeProfitList(liveId) {
    return async (dispatch, getStore) => {
        let pageNum = getStore().profit.pageTechnoNum;
        let pageSize = getStore().profit.pageTechnoSize;
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/profit/knowledgeProfitList',
            body: { 
                liveId, 
                page:{
                    page: pageNum,
                    size: pageSize,
                } 
            },
        });
        let knowledgeList = get(result, 'data.knowledgeList', []);
        if (knowledgeList.length > 0) {
            dispatch({
                type: INIT_PAGE_DATA,
                pageData: { pageTechnoNum: ++pageNum }
            })
        }
        dispatch({
            type: UPDATE_PROFIT_RECORD_TECHNO_CHANNEL,
            knowledgeList:get(result, 'data.knowledgeList', []),
        });

        return result;
    }
}

/**
 * 获取单个系列课详情
 * @param {any} channelId 
 */
export function fetchChannelDetail({channelId}) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/selfmedia/channelDetail',
            body: {channelId},
        });
        const channelDetail = get(result, 'data.channelDetail') || {};
        dispatch({
            type: UPDATE_CHANNEL_DETAIL,
            channelDetail
        });

        return result;
    }   
}

/**
 * 获取单个系列课的媒体投放的收益流水
 * @param {any} channelId 
 * @param {Object} page 
 */
export function fetchMediaProfitRecords({channelId, page}) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/selfmedia/mediaProfitRecords',
            body: {channelId, page},
        });
        const mediaProfitRecords = get(result, 'data.list') || [];
        dispatch({
            type: UPDATE_MEDIA_PROFIT_RECORDS,
            mediaProfitRecords
        });

        return result;
    }
}

//获取嘉宾分成待发放金额
export function getBalanceData(liveId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
            url: '/api/wechat/guest-separate/getBalanceData',
            body: {liveId},
		});
		return result;
	};
}

/**
 * B端 - 获取直播间的打卡训练营收益记录
 */
export function fetchCheckinCampProfits({liveId, page}){
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/checkInCamp/campProfitList',
            body: {liveId, page},
            method: 'POST',
            showLoading: false,
        });
        return result;
    }
}

/**
 * B端 - 获取单个打卡训练营的收益详情
 */
export function fetchCheckinCampProfitDetail({campId, page}){
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/checkInCamp/campBuyersList',
            body: {campId, page},
            method: 'POST',
            showLoading: false,
        });
        return result;
    }
}

/**
 * 获取打卡训练营的详情 
 */
export async function fetchCheckinCampDetail(campId){
    const result = await api({
        url: '/api/wechat/checkInCamp/campDetail',
        body: {campId},
        method: 'POST',
    });
    return result;
}

/**
 * C端 - 获取学员的打卡契约金收益总额
 */
export async function fetchTotalCheckInProfit(){
    return await api({
        url: '/api/wechat/checkInCamp/checkinTotalProfit',
        body: {},
        method: 'POST',
        showLoading: false,
    });
}

/**
 * C端 - 获取学员的打卡契约金收益明细记录
 */
export function fetchCheckInProfitDetail(page){
    return async (dispatch, getStore) => {
        return await api({
            url: '/api/wechat/checkInCamp/checkinProfitList',
            body: {page},
            method: 'POST',
            showLoading: false,
        });
    }
}
// 修改是否显示直播间收益
export function updateDisplayStatus(data){
    return async (dispatch, getStore) => {
        let result = await api({
            url: '/api/wechat/profit/updateDisplayStatus',
            body: data,
            method: 'POST',
            showLoading: false,
        });
        dispatch({
            type: UPDATE_PROFIT_DISPLAYSTATUS,
            displayStatus: data.displayStatus
        });

        return result
    }
}

// 千聊推荐列表  我的系列课 话题
export function fetchRecommendProfitList(liveId, type = 'channel') {
    return async (dispatch, getStore) => { 
        let typePageName = type === 'channel' ? 'Channel' : 'Topic'
        let pageNum = getStore().profit[`recommend${typePageName}Page`];
        let pageSize = getStore().profit[`recommend${typePageName}Size`];
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/platformShare/getProfitList',
            body: { 
                liveId,
                type, // topic/channel
                page:{
                    page: pageNum,
                    size: pageSize,
                } 
            },
        });
        let resultList = get(result, 'data.resultList', []);
        if (resultList.length > 0) {
            dispatch({
                type: INIT_PAGE_DATA,
                pageData: { [`recommend${typePageName}Page`]: ++pageNum }
            })
        }
        dispatch({
            type: type === 'channel' ? UPDATE_PROFIT_RECOMMEND_CHANNEL : UPDATE_PROFIT_RECOMMEND_TOPIC,
            list: get(result, 'data.resultList', []),
        });

        return result;
    }
}

export function profitRecommendTopic(list) {
    return {
        type: UPDATE_PROFIT_RECOMMEND_TOPIC,
        list,
    }
};

/* 千聊推荐课程收益明细列表*/
export function getProfitDetailList(data) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/platformShare/getProfitDetailList',
            body: data,
        });

        return result;
    };
}