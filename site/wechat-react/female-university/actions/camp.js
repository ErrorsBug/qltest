import { request } from 'common_actions/common'
import QRCode from 'qrcode'

// 打卡补卡
export const postCheckIn = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/checkIn',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 取消打卡
export const deleteCheckIn = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/deleteCheckIn',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取补卡券信息
export const getAppendCouponInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getAppendCouponInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取打卡日历
export const getCheckInCalendar = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getCheckInCalendar',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取打卡信息
export const getCheckInInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getCheckInInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取打卡海报信息
export const getCheckInPosterInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getCheckInPosterInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取礼包清单
export const getGiftList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getGiftList',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取毕业典礼奖励信息
export const getGraduationReward = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getGraduationReward',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取褪变笔记本目录
export const getNoteDirectory = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/listSignUp',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取褪变笔记本打卡主题列表
export const getNoteSubjectList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getNoteSubjectList',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取论文信息
export const getPaperInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getPaperInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取排行榜
export const getRankList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getRankList',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取排行榜规则
export const getRankRule = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getRankRule',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取学员报名记录
export const getSignUpRecord = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getSignUpRecord',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取学员基本信息
export const getStudentBasisInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getStudentBasisInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取学员课程信息
export const getStudentCourseInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getStudentCourseInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取打卡主题信息
export const getSubjectInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getSubjectInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 小目标数量
export const getTargetCount = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getTargetCount',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取设置小目标状态
export const getTargetStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getTargetStatus',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取打卡列表
export const listCheckIn = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/listCheckIn',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 设置毕业典礼奖励领取状态
export const setRewardStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/setRewardStatus',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 设置小目标
export const setTarget = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/setTarget',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 写论文
export const writePaper = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/writePaper',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

//获取相册信息
export const getAlbumInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getAlbumInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 当前一期学习营开始打卡日期
export const getFirstCheckInTime = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getFirstCheckInTime',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取打卡推荐小目标列表
export const getRecommendTargetList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getRecommendTargetList',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 生成二维码
export async function getQr(url) {
    const res = QRCode.toDataURL(url, {
        width: 500,
        height: 500,
        colorDark: "#000000",
        colorLight: "#ffffff"
    })
        .then(url => {
            return url
        })
        .catch(err => {
            console.error(err)
        })
    return res
}

// 获取学习时长
export const getGraduationLearnInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getGraduationLearnInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取蜕变笔记封面信息
export const getNoteCoverInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getNoteCoverInfo',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

// 获取笔记数量
export const getNoteCoverInfoByPeriodId = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getNoteCoverInfoByPeriodId',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

//点赞列表
export const getLikeList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getAlbumLikeList',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}
// 修改小目标
export const updateTarget = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/updateTarget',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

//点赞数量
export const getToTal = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getAlbumCount',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

//获取点赞状态
export const getAlbumLikeStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/getAlbumLikeStatus',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

//修改点赞状态
export const setAlbumLikeStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/setAlbumLikeStatus',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
}

//修改点赞数量
export const likeAlbum = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/ufwApi/gate/studyCampCheckIn/likeAlbum',
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data || res;
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

// 根据期数获取学习营信息
export const getStudyCampByPeriodId = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/studyCamp/getStudyCampByPeriodId',
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

