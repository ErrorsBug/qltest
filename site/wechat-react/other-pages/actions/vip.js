import {
    api
} from './common';

export const GET_GENERAL_VIP_INFO = 'GET_GENERAL_VIP_INFO';
export const GET_CUSTOM_VIP_INFO = 'GET_CUSTOM_VIP_INFO';


/**
 * 获取通用vip详情
 */
export function getGeneralVipInfo(liveId) {
    return async (dispatch, getStore) => {
        dispatch({
            type: GET_GENERAL_VIP_INFO,
            data: {
                status: 'pending'
            }
        });

        let data = {
            status: 'success'
        }

        await api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getGeneralVipInfo',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: {
                liveId
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            if (res.data.isBuyTryout == 'Y') {
                res.data.vipChargeconfig = res.data.vipChargeconfig.filter(item => item.type != 'tryout');
            }
            data.data = res.data
            
        }).catch(err => {
            data.status = 'error';
            data.message = err.message
        })

        dispatch({
            type: GET_GENERAL_VIP_INFO,
            data
        });

        return data;
    }
}



/**
 * 获取通用vip列表
 */
export function getCustomVipList(liveId, page) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getCustomVipList',
            method: 'POST',
            showLoading: false,
            body: {
                liveId,
                source: 'h5',
                page,
            }
        });
    }
}

/**
 * 获取vip收费配置
 */
export function vipChargeInfo(liveId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/vipChargeInfo',
            method: 'POST',
            showLoading: false,
            body: {
                liveId,
            }
        });
    }
}



/**
 * 获取定制vip详情
 */
export function getCustomVipInfo(cVipId) {
    return async (dispatch, getStore) => {
        dispatch({
            type: GET_CUSTOM_VIP_INFO,
            data: {
                status: 'pending'
            }
        });

        let data = {
            status: 'success'
        }

        await api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getCustomVipInfo',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: {
                cVipId
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
    
            if (res.data.customVip.isBuyTryout == 'Y') {
                res.data.customVip.chargeConfigList = res.data.customVip.chargeConfigList.filter(item => item.type != 'tryout');
            }
            data.data = res.data.customVip
            
        }).catch(err => {
            data.status = 'error';
            data.message = err.message
        })

        dispatch({
            type: GET_CUSTOM_VIP_INFO,
            data
        });

        return data;
    }
}


/**
 * 获取定制vip报名用户
 */
export function getCustomVipAuthList(cVipId,status='N') {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getCustomVipAuthList',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: {
                cVipId,
                status
            }
        })
    }
}


/**
 * 获取定制vip下课程列表
 * @param type topic | channel
 */
export function getCustomVipCourseList(cVipId, type) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getCustomVipCourseList',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: {
                cVipId, type
            }
        })
    }
}



/**
 * 获取是否定制vip会员
 * @param type topic | channel
 */
export function getUserVipDetail(cVipId) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/getUserVipDetail',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: {
                cVipId
            }
        })

        if (result.state && result.state.code == 0) {
            dispatch({
                type: GET_CUSTOM_VIP_INFO,
                data:result.data
            });
        }
        

        return result.data;
    }
}


export function getPushInfo(cVipId, liveId) {
    return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/vip/getPushInfo',
			method: 'POST',
			showLoading: false,
			body: {
                cVipId, liveId
            }
		});

		return result;
	};
}



/* 推送vip */
export function pushVip(params) {
	return async (dispatch, getStore) => {
		let result = await api({
			dispatch,
			getStore,
			url: '/api/wechat/vip/push',
			method: 'POST',
			showLoading: true,
			body: params
		});

		return result;
	};
}

/**
 * 获取vip收益列表
 */
export function getVipIncomeRecord(liveId,type, page) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/incomeRecord',
            method: 'POST',
            showLoading: false,
            body: {
                liveId,
                type,
                page,
            }
        });
    }
}
/**
 * 获取vip收益信息
 */
export function getVipReward(liveId,type) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/reward',
            method: 'POST',
            showLoading: false,
            body: {
                liveId,
                type,
            }
        });
    }
}


/**
 * 获取是否通用vip信息
 */
export function getVipInfo(params) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/vipInfo',
            method: 'POST',
            showLoading: false,
            body: params
        });
    }
}



export function saveVipDesc(params) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/vip/saveVipDesc',
            method: 'POST',
            body: params
        });
    }
}



/* 查询学员是否填写过 */
export function checkUser(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:params,
            url: '/api/wechat/studio/check-user',
        });
        
        return result && result.data && result.data.config
    }
}