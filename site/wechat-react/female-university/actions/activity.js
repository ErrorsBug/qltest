import api from './request';
import { request } from 'common_actions/common'


// 获取当前课程是否购买
export const getBuyStatus = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/channel/isAuth',
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

// 用户购买金额记录
export const getActivityPayMoney = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/pay/getActivityPayMoney',
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

// 组合购买需求-获取用户头像
export const getActivityUserPic = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/pay/combineOrderUserList',
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