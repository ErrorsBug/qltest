import { request } from 'common_actions/common'

//请求验证码
export const sendValidCode = async (params) => {
    const res = await request.post({
        url: '/api/wechat/sendValidCode',
        showLoading: false,
        body: { ...params }
    }).then(res => {
        if (res.state && res.state.code !== 0) {
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res 
}

//校验验证码
export const checkoutCode = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/validCode/check',
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

//注销账号
export const cancelId = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/user/invalidUser',
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

//获取用户信息
export const userInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/user/get',
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