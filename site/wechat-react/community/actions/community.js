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
// 获取所有话题类目
export const getListTopicCategory = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listTopicCategory',
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
// 获取话题列表
export const getTopicList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listTopicByCategory',
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

// 获取关注的人的信息流
export const getListFocusIdea = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listFocusIdea',
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
export const getIdeaListInit = async (list) => {
    let likeListParams=[]   
    list.map((item,index)=>{ 
        likeListParams.push(item.id)
    })
    if(likeListParams.length>0){ 
        const {speaks} = await interactLikesList({speakIds:likeListParams.join(',')})
        const {dataList} = await isCollectedList({businessIds:likeListParams.join(','),type:'UNIVERSITY_COMMUNITY_IDEA'})
        list.map((item,index)=>{ 
            speaks?.map((subItem,subIndex)=>{
                if(item.id==subItem.speakId){
                    item.isLike=subItem.isLikes?'Y':'N'
                    item.likedNum=subItem.likesNum
                } 
            }) 
            dataList?.map((subItem,subIndex)=>{
                if(item.id==subItem.businessId){
                    item.isCollected=subItem.isCollected
                } 
            }) 
            
            return item
        })  
    } 
    return list
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

// 是否已收藏列表
export const isCollectedList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/coll/isCollectedList',
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
/**
 * 点赞随机文案
 */
export const randomText = [ 
    'https://img.qlchat.com/qlLive/business/HTFKKWCP-668B-RK24-1564389516863-ICX7AJKVTLUV.png',
    'https://img.qlchat.com/qlLive/business/FMOLBS1M-KUBE-9UYC-1564389520636-9QKYF8XSLANO.png',
    'https://img.qlchat.com/qlLive/business/LC2B8651-1LOE-88A3-1564389523885-6KD41FNENCSN.png',
    'https://img.qlchat.com/qlLive/business/46VSSTTY-S2UN-HLZK-1564389527666-ED946O24JKAM.png',
    'https://img.qlchat.com/qlLive/business/YOAFHM14-4FL6-P5NH-1564389530330-KZVRYPP63AFB.png',
    'https://img.qlchat.com/qlLive/business/5ZAZ7XRS-HMO3-YDDM-1564389532328-PAMZ717XUIEN.png',
    'https://img.qlchat.com/qlLive/business/ZSWJ37X8-OQC6-AN2H-1564389534390-SCIVIOLA6KES.png', 
    'https://img.qlchat.com/qlLive/business/ZILCFNFR-3DJJ-OBAX-1564389536516-O2K6O1MFPGNB.png',
    'https://img.qlchat.com/qlLive/business/NIB5NLPP-BH1J-TYT7-1564389538565-LV8SQWCD5WJQ.png',
    'https://img.qlchat.com/qlLive/business/O63BYOVL-RPAK-CBE9-1564389541690-E7DNPOEBJBH6.png',
    'https://img.qlchat.com/qlLive/business/HL3ZKPX1-GPEQ-WL9Y-1564389543701-JMDZUNJVAZ6B.png' 
]

// 添加收藏
export const collAdd = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/coll/add',
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

// 取消收藏
export const collCancel = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/coll/cancel',
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
// 是否已收藏
export const collIsCollected = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/coll/isCollected',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    return res?.data  || {};
}
// 收藏列表
export const collList = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/coll/list',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    }) 
    if(res?.data?.collections){
         res.data.collections=await res?.data?.collections.map((item,index)=>{
            return item.dto
        })
        res.data.collections= await getIdeaListInit(res?.data?.collections)
    }
    return res?.data  || {};
}

// 获取优秀校友权重前十的数据
export const getListHomeStudent = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listHomeStudent',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        // window.toast(err.message);
    })  
    
    return res?.data  || {};
}

// 优秀校友-取消关注
export const excellentAlumniUnfocus = async (params) => {
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

// 优秀校友-关注
export const excellentAlumniFocus = async (params) => {
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

//优秀校友-获取所有校友类目
export const getListStudentCategory = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listStudentCategory',
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

//优秀校友-根据分类查询校友列表
export const getListStudentByCategory = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/listStudentByCategory',
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

//优秀校友-根据id获取单个用户数据状态
export const getSingleStudentInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/community/getStudent',
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