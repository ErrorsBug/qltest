
import api from './request';
import { request } from 'common_actions/common'

// 根据用户ID获取亲友卡信息
export const getByInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/info',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 根据亲友卡id获取亲友卡信息
export const getByCardId = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/getByCardId',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 根据亲友卡id获取领取人列表
export const cardUserList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/cardUserList',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 领取亲友卡
export const postCard = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/getCard',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data  || null;
}

// 获取亲友卡的状态
export const userCardStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/userCardStatus',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 用户是否领取亲友卡
export const userCardRefInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/userCardRefInfo',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 学习进度
export const getRecentLearn = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/recentLearn',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 赠送体验营列表
export const getCampLists = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getIntentionCampList',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 亲友卡带来的购买用户
export const cardInviteBuyUser = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/cardInviteBuyUser',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}


// 亲友卡带来的国脉用户
export const delCardInviteBuyUser = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/card/delCardInviteBuyUser',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {};
}

// 亲友卡兑现学习营
export const cardExchange = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/university/cardExchange',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || null;
}
