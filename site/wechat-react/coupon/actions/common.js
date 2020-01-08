import fetch from 'isomorphic-fetch';
import { extname } from 'path';
import { encode, stringify } from 'querystring';
import Detect from '../../components/detect';
import { getVal, getLocalStorage, setLocalStorage } from 'components/util';
// import OSS from 'ali-oss'

//获取用户信息
export const USERINFO = 'USERINFO';
// 处理中
export const LOADING = 'LOADING';
// 处理成功
export const SUCCESS = 'SUCCESS';
// 处理失败
export const ERROR = 'ERROR';
// 处理完成
export const COMPLETE = 'COMPLETE';
// 显示toast
export const TOAST = 'TOAST';

export const SYSTIME = 'SYSTIME';
// 关闭支付弹框
export const TOGGLE_PAYMENT_DIALOG = 'TOGGLE_PAYMENT_DIALOG'

export const UPDATE_USER_POWER = 'UPDATE_USER_POWER'

export const SET_IS_LIVE_ADMIN = 'SET_IS_LIVE_ADMIN'

// 自媒体版直播间
export const SET_IS_LIVE_MEDIA = 'SET_IS_LIVE_MEDIA'

export const SET_LIVE_PRICE = 'SET_LIVE_PRICE'

// 设置sts上传信息
export const SET_STS_AUTH = 'SET_STS_AUTH'

// 获取用户是否关注千聊公众号
export const IS_QLCHAT_SUBSCRIBE = 'IS_QLCHAT_SUBSCRIBE'
// 初始化关注信息
export const INIT_TOP_BANNER_SUBSCRIBE_INFO = 'INIT_TOP_BANNER_SUBSCRIBE_INFO';

export const SET_IS_SERVICE_WHITELIVE = 'SET_IS_SERVICE_WHITELIVE';

export const SET_IS_QL_LIVE = 'SET_IS_QL_LIVE';

export const SET_OFFICIAL_LIVE_ID = 'SET_OFFICIAL_LIVE_ID';


export function loading(status) {
    return {
        type: LOADING,
        status
    }
};

let uploadClient = null;
let uploadClientDoc = null;
let inPay = false;



export function fetchSuccess() {
    return {
        type: SUCCESS
    }
}

export function updateSysTime(sysTime) {
    return {
        type: SYSTIME,
        sysTime,
    };
};

export function setIsLiveAdmin (data) {
    return {
        type: SET_IS_LIVE_ADMIN,
        data
    }
}
export function setIsQlLive (data) {
    return {
        type: SET_IS_QL_LIVE,
        data
    }
}
export function setIsServiceWhiteLive (data) {
    return {
        type: SET_IS_SERVICE_WHITELIVE,
        data
    }
}


export function getOfficialLiveId (data) {
    return {
        type: SET_OFFICIAL_LIVE_ID,
        data
    }
}

export function fetchIsLiveAdmin ({ liveId, topicId, channelId }) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/studio/is-live-admin',
            body: {
                liveId,
                topicId,
                channelId,
            }
        })

        dispatch(setIsLiveAdmin(result.data))
        return result;
    }
}

export function setIsLiveMedia(data){
    return {
        type: SET_IS_LIVE_MEDIA,
        data
    }
}

export function setLivePrice(data){
    return {
        type: SET_LIVE_PRICE,
        data
    }
}

/**
 * 如果传了topicId, 就是获取基础的topicPo
 * 如果传了channelId，就是获取基础的channelPo
 * @param {*} param0
 */
export function fetchSimpleData ({ topicId, channelId }) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/studio/is-live-admin',
            body: {
                topicId,
                channelId,
            }
        })
    }
}

export function toast(msg, timeout, type) {
    return (dispatch, getStore) => {
        dispatch({
            type: TOAST,
            payload: {
                show: true,
                msg,
                timeout,
                type
            }
        })

        setTimeout(() => {
            dispatch({
                type: TOAST,
                payload: {
                    show: false
                }
            })
        }, timeout || 1000);
    }
};

// 上传文件命名
function reName() {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = '';
    for (var i = 0; i < 8; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    res += '-';
    for (var i = 0; i < 4; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    res += '-';
    for (var i = 0; i < 4; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    res += '-' + (new Date).getTime() + '-';
    for (var i = 0; i < 12; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

/**
 * 图片压缩
 * @param {File} file 文件
 * @returns Promise<File>
 */
function imageCompress(file) {
    const reader = new FileReader();
    const sourceImage = new Image();
    const filename = file.name;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            sourceImage.src = event.target.result;

            sourceImage.onload = () => {
                canvas.width = sourceImage.width;
                canvas.height = sourceImage.height;
                ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);

                // setTimeout(() => {
                let resultFile = dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.5));
                resultFile = new File([resultFile], 'temp.jpg', {
                    type: 'image/jpeg',
                });
                resolve(resultFile);
                // }, 1000);
            };
        };
    });
}












/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */
export function getQr({ channel, channelId, liveId, toUserId = '', topicId, showQl, showLoading = false, }) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/get-qrcode',
            body: {
                channel, channelId, liveId, toUserId, topicId, showQl
            }
        });
    }
}

/*
 * 获取千聊公众号关注二维码
 * http://showdoc.corp.qlchat.com/web/#/1?page_id=22
 */
export function getQlchatQrcode({channel = 'couponCenter', liveId = '100000081018489', showQl = 'Y'}) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/get-qrcode',
            body: {
                channel, liveId, showQl
            }
        })
        if (result && result.state && result.state.code === 0) {
            return result.data.qrUrl;
        } else {
            window.toast(result.state.msg);
        }
    }
}


// 开关二维码弹框
export function togglePayDialog(show, qcodeId, qcodeUrl) {
    return {
        type: TOGGLE_PAYMENT_DIALOG,
        show,
        qcodeId,
        qcodeUrl,
    }
}

// 获取系统时间
export function getSysTime() {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/base/sys-time',
            method: 'GET',
            showLoading: false,
            body: {

            }
        });

        return result;
    };
};

//获取微信config
export function getWxConfig() {
	return async (dispatch, getStore) => {
		dispatch(loading(true));
		let result = await fetch('/api/js-sdk/wx/config', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
			credentials: 'include'
		}).then((res) => res.json());

		dispatch(fetchComplete(result));
		dispatch(loading(false));

		return result;
	};
}

export function fetchAndUpdateSysTime() {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/base/sys-time',
            method: 'GET',
            showLoading: false,
            body: {},
        });
        dispatch({
            type: SYSTIME,
            sysTime: result.data.sysTime,
        })
        return result;
    };
}

/**
 * 根据接口地址及参数构造本地缓存唯一健值
 * @param  {Object} opt                 request请求的option对象
 *   opt.cacheWithoutKeys    不作缓存健值生成策略参考的参数key的列表
 * @return {String}             请求的唯一标识字符串
 */
const getCacheKeyString = (opt) => {

	let cacheWithoutKeys = opt.cacheWithoutKeys || [],
		pairs = [];

	for (var key in opt.body) {
		var value = opt.body[key];
		if (cacheWithoutKeys.indexOf(key) < 0) {
			pairs.push(key + '=' + JSON.stringify(value));
		}
	}

	return `_request_data_${opt.url}?${pairs.join('&')}&${(opt.method || '').toLowerCase()}`;
}

/**
 * 判断返回值是否可缓存
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
const isResponseCanCache = (json) => {
	let data;


	// 状态异常不缓存
	if (!json || !json.state || json.state.code != 0) {
		return false;
	}

	data = json.data;

	// 数据为空不缓存
	// 数组
	// if (Array.isArray(data)) {
	if (Object.prototype.toString.call(data) === '[object Array]') {
		if (!data.length) {
			return false;
		}

		return true;
	}

	// 对象
	if ('object' === typeof data) {
		if (!Object.keys(data).length) {
			return false;
		}

		return true;
	}

	return true;
};


// 请求封装
export function api({
    dispatch = () => {},
    getStore = () => {},
    url,
    method = 'GET',
    body = {},
    showWarningTips = true,
    showLoading = true,
    isErrorReject = false, // catch到的错误reject到外层
    cache = false,
    expires = 0,
}) {
    return new Promise((resolve, reject) => {
        !!showLoading && dispatch(loading(true));

	    const cacheKey = getCacheKeyString({
		    url,
		    method,
		    body,
	    });

        url = method === 'GET' ? `${url}?${encode(body)}` : url;

	    // 开启缓存
	    if (cache && expires > 0) {
		    const startTime = Date.now();
		    const data = getLocalStorage(cacheKey);

		    // 存在缓存
		    if (data) {
                resolve(data);
                console.info('缓存响应！res:', data, ' 耗时：',  Date.now() - startTime);
                return;
		    }

	    }

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            credentials: 'include',
            body: method === 'POST' ? JSON.stringify(body) : null,
        })
            .then((res) => res.json())
            .then((json) => {
                !!showLoading && dispatch(loading(false));
                // console.log(json);

                if (!json.state || !json.state.code && json.state.code != 0) {
                    console.error('错误的返回格式');
                }

                switch (json.state.code) {
                    case 0:
                        resolve(json);
	                    // 开启了缓存并且响应数据正常（非异常或为空）
	                    if (cache && expires > 0 && isResponseCanCache(json)) {
		                    console.info('开始设置缓存！');
		                    setLocalStorage(cacheKey, json, expires);
	                    }
                        break;

                    case 110:
                        if (json.data && json.data.url) {
                            let redirect_url = window.location.href;
                            window.location.replace('/api/wx/login?redirect_url=' + encodeURIComponent(redirect_url));
                        }
                        break;

                    case 20001:
                        reject(json)
                        break;

                    case 10001:
                        resolve(json)
                        break;

                    case 20005:
                        // 未登录
                        break;

                    case 50004:
                        // 该CODE已被使用
                        resolve(json)
                        break;
                    
                    case 20012:
                        // 免费支付
                        resolve(json)
                        break;

                    case 50005:
                        // 已经是管理员
                        resolve(json)
                        break;

                    default:
                        showWarningTips && window.toast(json.state.msg);
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
                !!showLoading && dispatch(loading(false));
                isErrorReject && reject(err);
            })
    });

}

export function updateUserPower(power){
    return {
        type: UPDATE_USER_POWER,
        power: power,
    }
}

/* 获取用户权限 */
export function fetchUserPower(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'GET',
            showLoading: false,
            url: '/api/wechat/user/power',
            body: params
        })
        if(result&&result.state&&result.state.code === 0){
            dispatch(updateUserPower(result.data.powerEntity))
        }
        return result;
    };
}


export const INIT_SUBSCRIBE = 'INIT_SUBSCRIBE';
// 初始化关注信息
export function initSubscribeInfo(subscribeInfo) {
	return {
		type: INIT_SUBSCRIBE,
		subscribeInfo
	}
}

/* 官方课代表绑定临时关系 */
export function bindOfficialKey(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/coral/bindUserRef',
			body: params
		});

		return result;
	};
}

/* 获取官方课代表身份 */
export function getMyCoralIdentity(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/coral/getMyIdentity',
			body: params
		});

		return result;
	};
}

/*  获取千聊直通车lshareKey  */
export function getQlShareKey(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'GET',
			showLoading: false,
			url: '/api/wechat/coral/getQlShareKey',
			body: params
		});

		return result;
	};
}

/**
 * 判断是否关注
 * http://showdoc.corp.qlchat.com/web/#/1?page_id=58
 * 
 * subscribe	boolean	是否关注千聊公众号true=关注
 * isFocusThree	boolean	是否关注三方平台如果liveId绑定三方，则true=关注
 */
export function getQlchatSubscribeStatus(liveId = "2000000645972374") {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'GET',
            showLoading: false,
            url: '/api/wechat/common/isSubscribe',
            body: {
                liveId
            }
        })

        // if (result && result.state && result.state.code === 0) {
        //     dispatch({
        //         type: IS_QLCHAT_SUBSCRIBE,
        //         payload: {
        //             isQlchatSubscribe: result.data.subscribe
        //         }
        //     })
        // }

        if (result && result.state && result.state.code === 0) {
            return result.data || {};
        } else {
            window.toast(result.state.msg);
            return false;
        }
    }
}

// kfAppId , kfOpenId 用户绑定三方平台
export function userBindKaiFang ({ kfAppId, kfOpenId }) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/live/userBindKaiFang',
            method: 'POST',
            showLoading: false,
            body: {
                kfAppId, kfOpenId
            }
        });
    }
}

export function isQlLive (liveId) {
	return async (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
			url: '/api/wechat/isQlLive',
			showLoading: false,
			body: {
				liveId
			}
		});
	}
}

// 获取是否重设显示app推广缓存规则，首页四个tab顶部广告条用的。一个时间字符串 eg: 2018/04/04
export function isResetAppGuideRule () {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/live/isResetAppGuideRule',
            showLoading: false,
            method: 'GET',
            body: {

            }
        });
    }
}


/**
 * 获取描述列表
 */
export function getDescriptList(channelId, category) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/getDesc',
            method: 'POST',
            showLoading: false,
            isErrorReject: true,
            body: {
                channelId,
                category
            }
        })
    }
}
