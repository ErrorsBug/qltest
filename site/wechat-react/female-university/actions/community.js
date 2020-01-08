import api from './request';
import { request } from 'common_actions/common'
import { locationTo } from 'components/util';
import {getStudentInfo} from './home'




export const COMMUNITY_IDEA_DATA = 'COMMUNITY_IDEA_DATA'
export const COMMUNITY_TOPIC_DATA = 'COMMUNITY_TOPIC_DATA'
export const COMMUNITY_LIST_IDEA_DATA = 'COMMUNITY_LIST_IDEA_DATA'
export const COMMUNITY_CENTER_DATA = 'COMMUNITY_CENTER_DATA'

export function getUniversityCommunityIdeaData (data) {
    return {
        type: COMMUNITY_IDEA_DATA,
        data
    }
}
export function getUniversityCommunityTopicData (data) {
    return {
        type: COMMUNITY_TOPIC_DATA,
        data
    }
}
export function getUniversityCommunityCenterData (data) {
    return {
        type: COMMUNITY_CENTER_DATA,
        data
    }
}

// 获取关注列表
export const getListFocus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listFocus',
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

// 获取粉丝列表
export const getListFans = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listFans',
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

// 点击关注
export const postFocus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/focus',
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

// 点击关注
export const postUnFocus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/unfocus',
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

// 获取用户标签列表
export const getTags = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listUserTag',
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

// 新增标签
export const addTag = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi//community/addUserTag',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || res;
}

// 删除标签
export const deleteTag = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/deleteUserTag',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data || res;
}

// 新增想法
export const addIdea = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/addIdea',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data  || res;
}

// 新增想法
export const deleteIdea = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/deleteIdea',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        window.toast('删除成功')
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res   || {};
    
}
// 获取话题列表
export const getTopicList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listTopic',
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


// 女子大学用户数据
export const getUfwUserInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/ufwUserInfo',
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

// 关注状态
export const getFocusStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/focusStatus',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    return res && res.data  || {isFocus:'N',isNotify:'Y'};
}

// 获取想法
export const getIdea = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/getIdea',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    if(res?.data?.communityIdea){
        res.data.communityIdea= (await getIdeaListInit([res?.data?.communityIdea]))[0]
    }
    return res && res.data  || {};
}
// 想法列表
export const getListIdea = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listIdea',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    if(res?.data?.dataList&&!params?.unLike){
        res.data.dataList= await getIdeaListInit(res?.data?.dataList)
    }
    return res && res.data  || {};
} 

//保存列表数据
export const saveListIdeaData = (params) => {
    return async (dispatch, getStore) => {
        let state=getStore()
        let {listIdeaObj} = state.community
        dispatch({
            type: COMMUNITY_LIST_IDEA_DATA,
            data:{listIdeaObj:{...listIdeaObj,...params}}
        });
    }
}

//想法的点赞
export const getIdeaListInit = async (dataList) => {
    let likeListParams=[]   
    dataList.map((item,index)=>{
        likeListParams.push(item.id)
    })
    if(likeListParams.length>0){ 
        const {speaks} = await interactLikesList({speakIds:likeListParams.join(',')})
        const arr = speaks || []
        dataList.map((item,index)=>{
            arr.map((subItem,subIndex)=>{
                if(item.id==subItem.speakId){
                    item.isLike=subItem.isLikes?'Y':'N'
                    item.likedNum=subItem.likesNum
                } 
            }) 
            return item
        })  
    } 
    return dataList
}
// 想法点赞
export const getIdeaLike = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/ideaLike',
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
// 关注
export const communityFocus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/focus',
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
// 取关
export const communityUnfocus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/unfocus',
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
// 修改通知状态
export const updateNotifyStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/updateNotifyStatus',
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
// 获取评论列表
export const getCommentList = async (params) => {
    let res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/comment/getCommentList',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    if(res?.data?.sourceId_ListMap){
        res.data.sourceId_ListMap= await getCommentListInit(res?.data?.sourceId_ListMap)
    }
    return res  && res.data || {};
}

//评论的点赞
export const getCommentListInit = async (sourceId_ListMap) => {
    let likeListParams=[]   
    Object.keys(sourceId_ListMap).forEach( (key, i) => {
        let value=sourceId_ListMap[key]
        value.map((item,index)=>{
            likeListParams.push(item.id)
        })
    }); 
    if(likeListParams.length>0){ 
        const {speaks} = await interactLikesList({speakIds:likeListParams.join(',')})
        
        Object.keys(sourceId_ListMap).forEach( (key, i) => {
            let value=sourceId_ListMap[key]
            value.map((item,index)=>{
                item= speaks.map((subItem,subIndex)=>{
                    if(item.id==subItem.speakId){
                        item.likes=subItem.isLikes
                        item.likesNum=subItem.likesNum
                    }
                    return item
                })
                return item
            }) 
            sourceId_ListMap[key]=value
        });
    }
    return sourceId_ListMap
}


// 获取话题
export const getTopic = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/getTopic',
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
// 增加评论
export const addComment = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/comment/addComment',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    return res  ||  {};
}
// 删除评论
export const deleteComment = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/comment/deleteComment',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        window.toast('删除成功')
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    return res  ||  {};
}
// 想法点赞列表
export const getListIdeaLike = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listIdeaLike',
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

// 是否大学用户
export const isStudent = async (cb,childHandleAppSecondary) => {
    const {studentInfo} = await getStudentInfo()
    if(studentInfo?.studentNo){
        cb()
        return 
    } 
    window.simpleDialog({
        title: null,
        msg: '加入女子大学才能完成此操作哦',
        buttons: 'cancel-confirm',
        confirmText: '去了解一下',
        cancelText: '',
        className: 'un-community-join-tip',
        onConfirm: async () => { 
            // 手动触发打点日志 
            typeof _qla != 'undefined' && _qla('click', {
                region:'un-community-join-tip',
            });
            let url='/wechat/page/university-experience-camp?campId=2000006375050478&wcl=university_pm_community_10t8yxyq_191127'
            if(childHandleAppSecondary){
                childHandleAppSecondary(url)
                return
            }
            locationTo(url)
        },
        onCancel: ()=>{ 
        },
    }) 
}

// 评论点赞
export const commentLike = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/comment/like',
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

// 金句点赞列表
export const interactLikesList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/interactApi/interact/sort/likesList',
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

// 社区体验营蒙层显示
export const getObscuration = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/camp/obscuration',
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