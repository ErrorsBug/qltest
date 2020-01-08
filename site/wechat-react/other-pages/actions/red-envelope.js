import { api } from './common';

// 课堂红包收益
export async function getProfitRecordList () {
    const result = await api({
        showLoading:false,
        method: 'POST',
        url: '/api/wechat/topic/getProfitRecordList',
        body: {}
    });
    return result
}

// 红包领取记录列表
export async function getReceiveDetailList (params) {
    const result = await api({
        showLoading:false,
        method: 'POST',
        url: '/api/wechat/topic/getReceiveDetailList',
        body: params
    });
    return result
}

// 获取红包账户信息
export async function getRedEnvelopeAccount () {
    const result = await api({
        showLoading:false,
        method: 'POST',
        url: '/api/wechat/topic/getRedEnvelopeAccount',
        body: {}
    });
    return result
}

// 用户信息
export async function getUserInfo() {
    return await api({
        showLoading: false,
        url: '/api/wechat/user/info',
        body: {},
    });
}