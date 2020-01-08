
import api from './request';
import { request } from 'common_actions/common'

// 我的测试列表
export const examMyExamList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/myExamList',
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

// 用户是否参加过测验
export const examIsJoin = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/isJoin',
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


// 测验首页信息
export const getExamInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/info',
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

// 测验题目
export const examQuestionList = async (params) => {  
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/questionList',
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

// 保存测验结果
export const saveExamResult = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/saveExamResult',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res  || {};
}
// 获取测验结果
export const getExamResult = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/getExamResult',
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

