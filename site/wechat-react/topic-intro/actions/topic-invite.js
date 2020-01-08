import { api } from './common';


/**
 *
 * 初始化请好友听领取状态
 * @export
 * @param {*} inviteFreeShareId 分享id
 * @returns
 */
export async function checkReceiveStatus(inviteFreeShareId){
    return await api({
        showLoading: false,
        url: '/api/wechat/inviteFriendsToListen/checkReceiveStatus', 
        body: { 
            inviteFreeShareId
        },
        method: 'POST',
    });
}

/**
 *
 * 领取 请好友听的课程
 * @export
 * @param {*} inviteFreeShareId 分享id
 * @returns
 */
export async function receive(inviteFreeShareId){
    return await api({
        showLoading: false,
        url: '/api/wechat/inviteFriendsToListen/receive', 
        body: { 
            inviteFreeShareId
        },
        method: 'POST',
    });
}