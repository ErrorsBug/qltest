// 设置打卡
export const UNIVERSITY_FLAG_CARD_DATA = 'UNIVERSITY_FLAG_CARD_DATA'

// export const UNIVERSITY_HOME_ALL_LIST = 'UNIVERSITY_HOME_ALL_LIST'
// export const UNIVERSITY_ZB_LIST = 'UNIVERSITY_ZB_LIST'
// export const UNIVERSITY_CAMP_NODE = 'UNIVERSITY_CAMP_NODE'
// export const UNIVERSITY_NEW_NODE = 'UNIVERSITY_NEW_NODE'
// export const UNIVERSITY_HOME_NODE = 'UNIVERSITY_HOME_NODE'
// export const UNIVERSITY_HOME_ACADEMY_LIST = 'UNIVERSITY_HOME_ACADEMY_LIST'

// [ allObj , liveObj, campObj, newObj, universityObj, academyList ]

export function getUniversityFlagCardData (data) {
    return {
        type: UNIVERSITY_FLAG_CARD_DATA,
        data
    }
}

import api from './request';
import { request, selectPayResult, togglePayDialog } from 'common_actions/common'
// import { selectPayResult, togglePayDialog } from "./common";
import Detect from '../../components/detect';
import { getCookie,formatDate } from 'components/util';  
import { listChildren } from './home'

// 修改目标
export const universityFlagAdd = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagAdd',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
} 
// 提交目标
export const universityFlagUpdate = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagUpdate',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
} 

// FLAG获取
export const universityFlag  = async (params) => { 
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagGet', 
        body: {flagUserId:getCookie('userId'), ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })     
    return res && res.data  || {};
} 

// FLAG列表
export const universityFlagList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagList',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
} 

// FLAG打卡列表
export const universityFlagCardList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagCardList',
        body: {flagUserId:getCookie('userId'), ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
} 

// FLAG打卡补卡下单
export const universityFlagCardPay = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagCardPay',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
} 


/**
 *  FLAG 补卡支付方法
 * 参数：
 * cardDate  打卡日期时间，格式：yyyy-MM-dd
 * all=Y    是否全量补卡
 * callback,  支付成功回调
 * onCancel  取消支付回调
 * 
 * */
export function doPayForCard(params) {
    let defaultParams = {
        ch: "payForCard",
        channelNo: "qldefault",
        ifboth: "N",
        source:(Detect.os.weixin && (Detect.os.android || Detect.os.ios))?'h5':'web',

    };
    return async (dispatch, getStore) => {
        try {
            const res = await request.post({
                url: params?.orderDto?.url || '/api/wechat/transfer/baseApi/h5/pay/universityCardOrder',
                body: {...defaultParams,...params},
            });
            let callback = params.callback;
            let onCancel = params.onCancel;
            window.loading&&window.loading(false) 
            if (res.state.code == 0 && !!res.data) {
                const order = res.data.orderResult;
                if (!(Detect.os.weixin && (Detect.os.android || Detect.os.ios))) {
                    dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                    selectPayResult(order.qcodeId, () => {
                        typeof callback == 'function' && callback(order.qcodeId);
                        dispatch(togglePayDialog(false));
                    }, () => {
                        dispatch(togglePayDialog(false));
                    });

                } else {
                    const onBridgeReady = (data) => {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                'appId': data.appId,
                                'timeStamp': data.timeStamp,
                                'nonceStr': data.nonceStr,
                                'package': data.packageValue,
                                'signType': data.signType,
                                'paySign': data.paySign,
                            }, (result) => {
                                console.log('调起支付支付回调 == ', JSON.stringify(result));
                                console.log('result.err_msg', result.err_msg)
                                if (result.err_msg == 'get_brand_wcpay_request:ok') {
                                    selectPayResult(order.orderId, () => {
                                        typeof callback == 'function' && callback(order.orderId);
                                    }, () => {
                                        dispatch(togglePayDialog(false));
                                    });
                                } else if (result.err_msg == 'get_brand_wcpay_request:fail') {
                                    dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                                    selectPayResult(order.qcodeId, () => {
                                        dispatch(togglePayDialog(false));
                                        typeof callback == 'function' && callback(order.qcodeId);
                                    }, () => {
                                        dispatch(togglePayDialog(false));
                                    });
                                } else if (result.err_msg == 'get_brand_wcpay_request:cancel') {
                                    window.toast('已取消付费');
                                    if (typeof onCancel === 'function') {
                                        onCancel(order.orderId)
                                    }
                                }
                            })
                    }

                    // 监听付款回调
                    if (typeof window.WeixinJSBridge === 'undefined') {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                    } else {
                        onBridgeReady(order)
                    }
                }

            } else if (res.state.code == 20012) {
                onPayFree && onPayFree(res);
            }else{
                console.log(121212)
                window.toast(res.state.msg ||'下单失败 ');
            } 
        } catch (error) {
            window.toast(error.message)
        }
    }
}


// FLAG见证人列表
export const flagHelpList = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagHelpList',
        body: { flagUserId:getCookie('userId'),...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res || {};
}
 
// FLAG见证人查询
export const flagHelpGet = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagHelpGet',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        } 
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res  || {};
}

// FLAG见证人添加  
export const flagHelpAdd = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagHelpAdd',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res  || {};
}



export const caseList = [
    "其实我表示怀疑，但挺你",
    "看好你哦！",
    "这是什么操作？好奇",
    "强势围观，祝你成功！",
    "我最欣赏像你这样有目标的人~",
    "你还能再优秀吗？",
    "哈哈哈祝你挑战自我成功",
    "好有意思的活动，我也要加入",    
]


// 设置正在学习课程
export const setUniversityCurrentCourse = async (params) => {
    return await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/setCurrentId',
        body: params,
    });
};


// FLAG 被见证人身份查询
export const flagShareTypeGet = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/shareType',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        console.log(res)
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res  || {};
}

// FLAG 单个flagCard
export const universityflagGetflagCard = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/getFlagCard',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        console.log(res)
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
}
// FLAG 打卡点赞
export const universityflagCardLike = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/cardLike',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        console.log(res)
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res  || {};
}
// FLAG 根据班级获取FLAG打卡列表
export const universityflagListClassCard = async (params)=>{
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/listClassCard',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        console.log(res)
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data  || {}
    
}

 

// FLAG 用户打卡相关信息
export const getUserFlagInfo = async (params)=>{ 
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/getUserFlagInfo',
        body: { ...params }
    }).then(res => {
        if(res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        console.log(res)
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {}
}
 


// FLAG 打卡背景
export const getFlagCardBg = async (params)=>{ 
    const {dataList=[]} =  await listChildren({nodeCode:"QL_NZDX_FLAG_WDMB"}); 
    let i = gethashcode(dataList.length,params?.fromUserId)
    return dataList[i]?.keyA
}

// 社区打卡背景
export const getCommunityCardBg = async (params)=>{ 
    const {dataList=[]} =  await listChildren({nodeCode:"QL_NZDX_FLAG_WDMB"}); 
    let num=Math.ceil(Math.random()*dataList.length)
    let i = gethashcode(dataList.length,params?.fromUserId,num)
    return dataList[i]?.keyA
}
export const hashCode = (str)=> {
    let h = 0;
    const len = str.length;
    const t = 2147483648;
    for (let i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(i);
        if (h > 2147483647) h %= t;
    }
    return h;
}

/**
 *获取随机数
 *
 * @param {*} len
 * @returns
 */
export const gethashcode = (len,fromUserId,num)=> { 
    const date = num|| new Date().getDate();
    const userId =(fromUserId|| getCookie("userId")) + date
    const hashcode = hashCode(userId);
    const h = hashcode ^ (hashcode >>> 16)
    const newLen = tableSizeFor(len)
    let index= newLen ? ((newLen - 1) & h) : 0;
    if (index >= len){
        index = index - len;
    }
    return index;
}
 
export const tableSizeFor = (cap)=> {  
    let n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    let MAXIMUM_CAPACITY = 1 << 30
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
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