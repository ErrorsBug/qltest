import { request } from 'common_actions/common'
import api from './request';

// 设置大学首页首屏信息

export function getUniversityStudentInfoData (data) { 
    return {
        type: UNIVERSITY_STUDENT_INFO_DATA,
        data
    }
}


export function getUniversityHomeFirstData (data) {
    return {
        type: UNIVERSITY_HOME_FIRST_DATA,
        data
    }
}


export function updateCommunity(data) {
    return {
        type: UPDATE_COMMUNITY,
        data
    }
}

// 获取子节点信息
export const listChildren = async (query) => {
    const params = {
        url: '/api/wechat/university/listChildren',
        body: { ...query }
    }
    const data = await api(params);
    return data;
}


// 获取用户信息
export const getStudentInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getStudentInfo',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || {};
}


// 更新个人档案
export const updateStudentInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/updateStudentInfo',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res  || {};
}
// 获取当前节点信息
export const getMenuNode = async (query) => {
    const params = {
        url: '/api/wechat/university/getMenuNode',
        body: { ...query }
    }
    const data = await api(params);
    return data;
}