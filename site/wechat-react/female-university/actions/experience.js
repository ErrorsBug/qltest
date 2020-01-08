import api from './request';
import { request } from 'common_actions/common'
import { locationTo } from 'components/util';

export const INVITE_DATA = 'INVITE_DATA'
export function getExperienceInviteData (data) { 
    return {
        type: INVITE_DATA,
        data
    }
}

// 理财训练营信息
export const getFinancialCamp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/get',
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

// 用户购买记录
export const getListUserCamp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/listUserCamp',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res && res.data  || { }
}

 

// 根据campId批量获取有效训练营期数
export const listPeriodByCampIds = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/h5/camp/new/listPeriodByCampIds',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    return res  && res.data || {};
}


// 获取课程信息
export const getCourseInfo = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/member/getCourseInfo',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    return res  && res.data || {}; 
}

// 获取课程话题列表
export async function getCourseTopicList(params) {
    const res = await request.post({ 
        url: '/api/wechat/member/getCourseTopicList',
        method: 'POST',
        body: params,
    }); 
    if (res.state.code === 0) {
        return res.data.topicList
    }
    
    return [];
}
// 用户购买记录
export const getShareMoney = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/getShareMoney',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res && res.data  || { }
}

// 是否曾经是分销员
export const campIsShareUserOnce = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/isShareUserOnce',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res && res.data  || {isShareUserOnce:'Y' }
}

// 获取奖学金明细
export const getFinancialCampShareMoneyDetail = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/fCampShareDetail/getMoneyDetail',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res && res.data  || { }
}

// 获取可得奖学金训练营
export const getShareCamp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/getShareCamp',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res && res.data  || { }
}

// 分销者提现
export const fCampShareDetailWithdraw = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/fCampShareDetail/withdraw',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res&&res.data  || { }
}


// 邀请明细
export const getInviteDetail = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/fCampShareDetail/getInviteDetail',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })    
    return res&&res.data  || { }
}


// 体验营导购页
export const getIntentionCamp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getIntentionCamp',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}

// 体验营分销配置信息
export const getDistributeConfig = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getDistributeConfig',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}

// 用户分销权限信息
export const getDistributePermission = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/distribute/getDistributePermission',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}

// 分销账户信息
export const ufwDistributeAccount = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/h5/distributeAccount/ufwDistributeAccount',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}

// 分销收益记录
export const userDistributeProfitList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/h5/distributeAccount/userDistributeProfitList',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}


// 分销提现
export const ufwDistributeDraw = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/distributeAccount/ufwDistributeDraw',
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
// 提现记录
export const getWithdrawRecordList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/distributeAccount/withdrawRecordList',
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


// 我的排名
export const getMyInvite = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/inviteGift/getMyLeaderBoard',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}
// 排行榜列表
export const getRankList = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/inviteGift/getLeaderBoard',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}
// 我的邀请列表
export const getInviteList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/woman/university/inviteGift/listInviteDetails',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data  || {};
}
// 保存分享邀请图片
export const updateActChargeShareUrl = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/updateActChargeShareUrl',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        //window.toast(err.message);
    }) 
    return res?.data || {};
}

// 体验营兑换码 
export const getExchage = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/redemptionCode/getIntentionCampByCode',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}
// 体验营兑换接口
export const redemptionCodeExchange = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/university/redemptionCodeExchange',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res || {};
}
// 归属方案查询
export const getCampBuyInfoByBelongId = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/ufw/intention/getCampBuyInfoByBelongId',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res?.data || {};
}