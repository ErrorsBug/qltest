

import api from './request';
import { request } from 'common_actions/common'
import { gethashcode } from './flag';

// 设置大学首页首屏信息
export const UNIVERSITY_HOME_FIRST_DATA = 'UNIVERSITY_HOME_FIRST_DATA'
export const UNIVERSITY_STUDENT_INFO_DATA = 'UNIVERSITY_STUDENT_INFO_DATA'
export const UPDATE_COMMUNITY = 'UPDATE_COMMUNITY'

// export const UNIVERSITY_HOME_ALL_LIST = 'UNIVERSITY_HOME_ALL_LIST'
// export const UNIVERSITY_ZB_LIST = 'UNIVERSITY_ZB_LIST'
// export const UNIVERSITY_CAMP_NODE = 'UNIVERSITY_CAMP_NODE'
// export const UNIVERSITY_NEW_NODE = 'UNIVERSITY_NEW_NODE'
// export const UNIVERSITY_HOME_NODE = 'UNIVERSITY_HOME_NODE'
// export const UNIVERSITY_HOME_ACADEMY_LIST = 'UNIVERSITY_HOME_ACADEMY_LIST'

// [ allObj , liveObj, campObj, newObj, universityObj, academyList ]

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

// 批量获取子节点列表
export const batchListChildren = async (query) => {
    const params = {
        url: '/api/wechat/university/batchListChildren',
        body: { ...query }
    }
    const data = await api(params);
    return data;
}
// 获取当前节点信息和子节点的数据
export const getWithChildren = async (query) => {
    const params = {
        url: '/api/wechat/university/getWithChildren',
        body: { ...query }
    }
    const data = await api(params);
    return data;
}

// 获取大学信息
export const getMenuNode = async (query) => {
    const params = {
        url: '/api/wechat/university/getMenuNode',
        body: { ...query }
    }
    const data = await api(params);
    return data;
}

// 根据节点集合获取多个集合数据
export const getMenuMapNode = async (query) => {
    const params = {
        url: '/api/wechat/university/batchListChildren',
        body: { ...query }
    }
    const data = await api(params);
    return data;
}

// 处理热门排行每天更新背景
export const handleRankBg = (rankObj) => {
    if(rankObj){
        const courseList = rankObj['QL_NZDX_SY_RANK_COURSE_BG'] || []
        const bookList = rankObj['QL_NZDX_SY_RANK_BOOK_BG'] || []
        const idx = gethashcode(courseList.length, '2000000000000000');
        const i = gethashcode(bookList.length, '1000000000000000');
        return {
            rankCourseBg: courseList[idx] || {},
            rankBookBg: bookList[i] || {}
        }
    }
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

// 批量添加课单
export const addStudentCourseBatch = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/addStudentCourseBatch',
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

// 获取学习营列表数据
 export const listStudyCamp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/listStudyCamp',
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

// 获取学习营购买记录列表数据
export const listSignUp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/listSignUp',
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

// 获取推荐学习营
export const listRecommend = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/listRecommend',
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
// 获取学习营状态 状态A报名时间未到，B报名中人数未满，C报名中人数已满，D报名结束
export const studyCampStatus=({sysTime,signupStartTime,signupEndTime,studentLimit,signUpNum,hasReservationNum})=>{
    let status
    if(sysTime<signupStartTime){
        status="A"
    }else if(sysTime<signupEndTime){
        status=studentLimit>signUpNum?"B":"C"
    }else{
        status="D"
    } 
    return status
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

// 获取听书列表
export const bookList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listBook',
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


// 勤学公告
export const listCurrentCourse = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listCurrentCourse',
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

// 获取学习详情
export const getCampInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/getStudyCamp',
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

// 加入学习营
export const joinStudyCamp = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/signUp',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res;
}
// 获取用户设置报名提醒状态
export const getSignUpRemainStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/getSignUpRemainStatus',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res?.data||{};
}
// 设置报名提醒
export const setSignUpRemain = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/setSignUpRemain',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res;
}

// 获取学院信息
export const getCollegeTag = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listChildrenTag',
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

// 获取标签下的课程
export const getListCourseByTag = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listCourseByTag',
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

// 根据学院标签获取课程
export const getTagCourseList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listCourse',
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

// 我的课单列表
export const getMyCourseList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listStudentCourse',
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
 

// 获取班级信息
export const getClassInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/classInfo',
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

// 获取最近学习详情
export const getLastCourse = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getLastCourse',
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

// 获取学习计划详情
export const getMyCoursePlan = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getStudentCoursePlan', 
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
  
// 获取系列课下的话题列表
export const getTopicListByChannel = async (params) => {
    const res = await request.post({
        url: '/api/wechat/channel/listTopic', 
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

//富文本介绍获取
export const getUeditorSummary = async (params) => {
    const res = await request.post({
        url: '/api/wechat/ueditor/getSummary',
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

// 获取系列课信息
export const getChannelProfile = async (channelId) => {
    const result = await request.get({
        url: '/api/wechat/channel/profile',
        body: {
            channelId
        }
    });

    return result && result.data  || {};
};


// 设置学习提醒  
export const setLearnRemind = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/setCourseAlert',
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

// 提现请求
export const postDraw = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/account/ufwDraw',
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

// 获取提现信息
export const getAccount = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/account/ufwAccount',
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
// 获取收费配置
export const initConfig = async (params) => {
    const res = await request({
        url: '/api/wechat/transfer/baseApi/h5/system/getConfigMap',
        method: 'POST', 
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

// 删除课单
export const removeCourseId = async (params) => {
    const res = await request({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/delStudentCourse',
        method: 'POST', 
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast("删除失败");
    })
    return res || {}; 
}

// 获取必须课的一级标签
export const courseTagMap = async (params) => {
    const res = await request({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/courseTagMap',
        method: 'POST', 
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast("删除失败");
    })
    return res && res.data  || {}; 
}


// 邀请列表
export const universityUserProfitList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/university/userProfitList',
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

// 根据classId获取班级信息二维码
export const getClassQr = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getClass',
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

// 大学统计数据信息
export const getUniversityStaticInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/staticInfo',
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

// 打卡榜单
export const getCardRank = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/listCardRank',
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

// 获取排行榜数据
export const getRankOverview = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/getRankOverview',
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

// 根据type获取听书和课程排行列榜
export const getRankList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/listCourseRank',
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

// 获取测验训练营结果
export const getExamCampList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/exam/getExamCampList',
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


// 活动导流页购买状态
export const getActStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getActStatus',
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


// 搜索
export const universitySearch = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/search',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res || {"data":{"courses":[]}};
}


// 
export const getTopicInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/topic/get',
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

// 渠道订单统计
export const orderStatics = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/orderStatics',
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


// 获取入群二维码
export const getSaleQr = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getSaleQr',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || null
}

// 获取下一期学习营的信息
export const getNextCampInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/getNextPeriodTime',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || null
}

