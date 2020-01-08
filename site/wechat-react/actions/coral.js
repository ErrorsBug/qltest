import { api } from './common';
import { getVal, locationTo } from '../components/util';

/* 获取珊瑚课程信息 */
export async function getPersonCourseInfo(params){
    return await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/coral/getPersonCourseInfo',
        body: params,
    });
}

/** 获取是否关注珊瑚公众号，并返回appId  */
export async function getFocusAppId(params){
    return await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/coral/getFocusAppId',
        body: params,
    });
}

/** 判断是否关注珊瑚公众号，获取珊瑚公众号二维码 */
export async function getCoralQRcode(params){
    let coralSubscribeResult = await getFocusAppId();
    if(coralSubscribeResult.state.code ===0 ){
        if(coralSubscribeResult.data.isFocus !=='Y'){
            let result = await api({
                method: 'GET',
                url: '/api/wechat/live/get-qr',
                body: {
                    ...params,
                    appId: coralSubscribeResult.data.appId,
                    showQl: 'N'
                },
            });
            return {
                qrUrl: result.data.qrUrl,
                appId: coralSubscribeResult.data.appId
            };
        }else{
            return false;
        }
    }
}
