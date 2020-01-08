import { api } from './common';

export const INIT_CHANNEL_GROUP = 'INIT_CHANNEL_GROUP';
export const SET_GROUP_PAY_LIST = 'SET_GROUP_PAY_LIST';

/**
 * 初始化拼课详情页内容
 * 
 * @export
 * @param {{}} initData 拼课详情页数据
 * @returns action
 */
export function initChannelGroup (initData) {
    return {
        type: INIT_CHANNEL_GROUP,
        initData
    }
}

/**
 * 设置拼团购买的用户列表
 * 
 * @export
 * @param {[]} list 
 * @returns 
 */
export function setGroupPayList (list) {
    return {
        type: SET_GROUP_PAY_LIST,
        list
    }
}

/**
 * 获取初始化信息
 * 
 * @export
 * @param {number} id 拼团ID
 * @returns 
 */
export function fetchInitData (id) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/group/init',
            body: {
                id
            }
        });

        dispatch(initChannelGroup({...result.groupInfo.channelGroupPo}))
        dispatch(setGroupPayList(result.groupPayList.payUserList))
    }
}

/**
 * 获取系列课的二维码
 * 
 * @export
 * @param {any} channelId 系列课Id
 * @returns 
 */
export function getChannelQr (channelId) {
    return (dispatch, getStore) => {
        console.log(channelId);
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/channel-qrcode',
            body: {
                channelId
            }
        });
    }
}

/**
 * 记录分享次数
 *
 */
export function countShareCache (groupId) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/group/countShareCache',
			body: {
				groupId
            }
		});
	}
}

/**
 * 记录分享访问次数
 *
 */
export function countVisitCache (groupId) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/group/countVisitCache',
			body: {
				groupId
			}
		});
	}
}


/**
 * 统计支付
 *
 */
export function countSharePayCache (payMoney) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/group/countSharePayCache',
			body: {
				payMoney
			}
		});
	}
}

/**
 * @argument [string] 获取介绍内容
 * 
 */
export function getEditorSummary(businessId, type){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips: false,
            url: '/api/wechat/ueditor/getSummary', 
            body: { 
                businessId,
                type
             },
            method: 'POST',
	        errorResolve: true,
        });

        return result
    }
}
