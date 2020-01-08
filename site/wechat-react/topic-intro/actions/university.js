import { request } from 'common_actions/common'
import api from './request';

// 话题或者系列课是否为女子大学课程，并且是否为女子大学用户
export const universityStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/university/universityStatus',
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


// 根据话题或者系列课ID获取女子大学学院信息
export const getUniversityCollege = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/university/getCollegeInfo',
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

// 批量查询学生是否加入课单
export const studentCourseMap = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/studentCourseMap',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
}

// 添加课单
export const addStudentCourse = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/addStudentCourse',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res;
}