import fetch from 'isomorphic-fetch';
import { extname } from 'path';
import { encode, stringify } from 'querystring';
import Detect from '../../components/detect';
import { getUrlParams } from 'components/url-utils';
import { request } from 'common_actions/common'
import {  getVal } from 'components/util';
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
export const FIRST_MSG_CODE = 'FIRST_MSG_CODE';
// 关闭支付弹框
export const TOGGLE_PAYMENT_DIALOG = 'TOGGLE_PAYMENT_DIALOG'

// 设置sts上传信息
export const SET_STS_AUTH = 'SET_STS_AUTH'

export const SET_IS_LIVE_ADMIN = 'SET_IS_LIVE_ADMIN'

export function loading(status) {
    return {
        type: LOADING,
        status
    }
};

let uploadClient = null;
let uploadClientDoc = null;



export function setIsLiveAdmin (data) {
    return {
        type: SET_IS_LIVE_ADMIN,
        data
    }
}

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

export function toast(msg, timeout) {
    return (dispatch, getStore) => {
        dispatch({
            type: TOAST,
            payload: {
                show: true,
                msg,
                timeout
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
 * 上传音频文件（mp3）
 *
 * @export
 * @param {any} file
 * @param {string} [folder='temp']
 * @param {string} [fileType='.mp3']
 * @param {number} [duration=0]
 * @returns
 */
export function uploadAudio (
    file,
    folder = 'audio',
    fileType = '.mp3',
    options={
        // 是否显示loading遮罩
        showLoading: true,
        // 开始回调
        startUpload: () => {},
        // 进度回调
        onProgress: (progress) => {},
        // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
        interruptUpload: () => false,
        // 上传失败
        onError: () => null,
    }
) {
    return async (dispatch, getStore) => {
        if (!/(mp3|MP3)$/i.test(file.name)) {
            window.toast('只支持MP3文件上传，请重新选择！', 2000);
            options.onError();
            return;
        }

        if (file.size > 31457280) {
            window.toast('请选择小于30M的音频文件！', 2000);
            options.onError();
            return;
        }

        const url = URL.createObjectURL(file);
        const mp3 = new Audio(url);
        let duration = 0;
        const hasDuration = () => {
            return !(duration === 0 || duration === 1);
        }
        mp3.volume = 0;
        mp3.onloadedmetadata = (data) => {
            duration = hasDuration() ? duration : mp3.duration;
        }
        mp3.ondurationchange =  (data) => {
            duration = hasDuration() ? duration : mp3.duration;
        }

        //  先播放 700ms， 确保触发 onloadedmetadata || onloadedmetadata;
        mp3.play();
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                mp3.pause();
                resolve();
            }, 700);
        });

        let client = null;
        try {
            client = await getOssClient(getStore, dispatch);
        } catch (error) {
            console.log('get oss client error: ', error);
        }


        const key = `qlLive/${folder}/${reName()}${fileType}`;
        let checkpoint, fileName, uploadId;

        options.showLoading && window.loading(true)

        options.startUpload();

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: async function(p, cpt) {

                if (options.interruptUpload()) {
                    // 中断上传
                    return client.abortMultipartUpload(cpt.name, cpt.uploadId);
                } else {
                    options.onProgress(p);
                    if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                    }
                    return Promise.resolve();
                }
            },
        })

        file = null;
        options.showLoading && window.loading(false);

        if (result.res.status == 200) {
            window.toast('上传成功');
            return {
                url: `https://media.qianliaowang.com/${key}`,
                duration: duration
            }
        } else {
            throw new Error('上传失败 ->' + JSON.stringify(result));
        }
    }
}

/**
 * 文档上传
 *
 * @export
 * @param {any} file
 * @param {string} [folder='document']
 * @param {string} [fileType='.pdf']
 * @returns
 */
export function uploadDoc(file, folder = 'document', fileType = '.pdf', options={
        // 是否显示loading遮罩
        showLoading: false,
        // 进度回调
        onProgress: (progress) => {},
        // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
        interruptUpload: () => false,
        // 错误回调
        onError: () => null,
        // 最大值开关
        maxSizeSwitch: false,
        
    }) {
    return async (dispatch, getStore) => {
        let maxSize = options.maxSizeSwitch ? 63000000 : 20480000;
        if (!/(doc|xls|pdf|docx|xlsx|ppt|pptx)$/.test(file.name)) {
            window.toast('只支持doc,pdf,xls,ppt文件上传，请重新选择！', 2000);
            options.onError();
            throw new Error('只支持doc,pdf,xls,ppt文件上传，请重新选择!');
        }

        if (file.size > maxSize) {
            window.toast(`最大文件不能超过${options.maxSizeSwitch?'60':'20'}M!`, 2000);
            options.onError();
            throw new Error(`最大文件不能超过${options.maxSizeSwitch?'60':'20'}M!`);
        }

        // 获取文件类型
        if (file.name) {
            fileType = extname(file.name);
        }

        const client = await getOssClient(getStore, dispatch, 'doc');
        const key = `qlLive/${folder}/${reName()}${fileType}`;

        let checkpoint, fileName, uploadId;

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: async function(p, cpt) {

                if (options.interruptUpload()) {
                    // 中断上传
                    return client.abortMultipartUpload(cpt.name, cpt.uploadId);
                } else {
                    options.onProgress(p);
                    return function (done) {

                        if (cpt !== undefined) {
                            checkpoint = cpt;
                            fileName = cpt.name;
                            uploadId = cpt.uploadId;

                            done();
                        }
                    }
                }
            },
        })

        file = null;
        window.loading(false);

        if (result.res.status == 200) {
            window.toast('上传成功');
            return `https://docs.qianliaowang.com/${key}`
        } else {
            throw new Error('上传失败 ->' + JSON.stringify(result));
        }
    }
}

export function uploadRec(file, folder = 'temp', fileType = 'wav') {
    return async (dispatch, getStore) => {

        const client = await getOssClient(getStore, dispatch);

        const key = `qlLive/${folder}/${reName()}.${fileType}`;
        let checkpoint, fileName, uploadId;

        window.loading(true)

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: function (p, cpt) {
                return function (done) {
                    if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                    }
                    done();
                }
            },
        })

        file = null;
        window.loading(false);

        if (result.res.status == 200) {
            window.toast('上传成功');
            return `https://media.qlchat.com/${key}`
        } else {
            throw new Error('上传失败 ->' + JSON.stringify(result));
        }
    }
}

/**
 * 上传图片
 */
export function uploadImage(file, folder = 'temp', fileType = '.jpg',isHideTip=false) {
    return async (dispatch, getStore) => {
        let isImage;
        if (!/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
            !isHideTip&&window.toast('图片格式只支持jpg|JPG|png|PNG|gif|GIF|bmp，请重新选择！', 2000);
            return;
        } else {
            isImage = true;
        }

        if (file.size > 5242880) {
            !isHideTip&&window.toast('请选择小于5M的图片文件！', 2000);
            return;
        }

        // 获取文件类型
        if (file.name) {
            fileType = extname(file.name);
            console.log(fileType)
        }


        let resultFile = file;
        if (file.size > 3145728) {
            resultFile = await imageCompress(file);
        }

        const client = await getOssClient(getStore, dispatch);

        const key = `qlLive/${folder}/${reName()}${fileType}`;
        let checkpoint, fileName, uploadId;

        !isHideTip&&window.loading(true)

        const result = await client.multipartUpload(key, resultFile, {
            checkpoint: checkpoint,
            progress: function (p, cpt) {
                return function (done) {
                    if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                    }
                    done();
                }
            },
        })

        file = null;
        !isHideTip&&window.loading(false);

        if (result.res.status == 200) {
            if (isImage) {
                !isHideTip&&window.toast('图片上传成功');
            } else {
                !isHideTip&&window.toast('上传成功');
            }
            return `https://img.qlchat.com/${key}`
        } else {
            throw new Error('文件上传失败 ->' + JSON.stringify(result));
        }
    }
}



/**
 * 获取上传组件
 */
async function getOssClient (getStore, dispatch, type = 'common') {

    if (type === 'common' && uploadClient) {
        return uploadClient;
    } else if (type === 'doc' && uploadClientDoc) {
        return uploadClientDoc;
    }

    let OSSW, STS;

    if (window.OSS && (!OSSW || !STS)) {
        OSSW = OSS.Wrapper;
        STS = OSS.STS;
    }

    let secure = false;
    if (/(https)/.test(window.location.href)) {
        secure = true;
    }

    let bucket = 'ql-res';
    const region = 'oss-cn-hangzhou';

    let stsAuth = getStore().common.stsAuth;

    if (!stsAuth) {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/common/getStsAuth',
        });
        dispatch({
            type: SET_STS_AUTH,
            stsAuth: result.data,
        });
        stsAuth = getStore().common.stsAuth;
    }


    if (type == 'doc') {
        bucket = 'qianliao-doc-download-402-301';

        const stsResult = await fetch('/api/wechat/common/getStsAuth?bucketName=' + bucket, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            credentials: 'include'
        }).then((res) => res.json());

        if (stsResult.state.code == 0) {
            stsAuth = stsResult.data;
        } else {
            console.error('获取sts auth失败！');
        }
    }

    const client = new OSSW({
        region: region,
        accessKeyId: stsAuth.accessKeyId,
        secure: secure,
        accessKeySecret: stsAuth.accessKeySecret,
        stsToken: stsAuth.securityToken,
        bucket: bucket,
    });

    if (type === 'common') {
        uploadClient = client;
    } else {
        uploadClientDoc = client;
    }

    return client;
}

export function getStsAuth() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/common/getStsAuth',
        });
        dispatch({
            type: SET_STS_AUTH,
            stsAuth: result.data,
        });
    }
}

export function initUserInfo (userInfo) {
	return {
		type: USERINFO,
		userInfo
	}
};

export function getUserInfo(userId, topicId) {
    var params = {
        topicId
    };
    if (userId) {
        params.userId = userId;
    };
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/user/info',
            body: params,
        });

        dispatch({
            type: USERINFO,
            userInfo: result.data,
        });

        return result
    }
}

export async function userUpdateInfo(params) {
    const result = await api({ 
        showLoading: false,
        url: '/api/wechat/transfer/h5/user/updateInfo',
        body: params,
    });  
    return result
}

/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */
export function getQr({appId, channel, channelId, liveId, toUserId = '', topicId, showQl, showLoading = false, pubBusinessId,pubBusinessId2}) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/get-qrcode',
            body: {
                appId,channel, channelId, liveId, toUserId, topicId, showQl,pubBusinessId,pubBusinessId2
            }
        });
    }
}

/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */
export function fetchQr({appId, channel, channelId, liveId, toUserId = '', topicId, showQl, showLoading = false, pubBusinessId,pubBusinessId2}) {
    return api({ 
        showLoading,
        url: '/api/wechat/get-qrcode',
        body: {
            appId,channel, channelId, liveId, toUserId, topicId, showQl,pubBusinessId,pubBusinessId2
        }
    });
}

/**
 * 根据话题获取千聊二维码
 *
 * @param {string} topicId
 * @returns
 */
export function getTopicQr(topicId,showQl) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading:false,
            url: '/api/wechat/get-topic-qrcode',
            body: {
                topicId,
                showQl,
            }
        });
    }
}



/**
 * 训练营支付
 */
export function doPayCamp({
        ifboth = Detect.os.phone ? 'Y' : 'N',
        type = 'TRAINCAMP',
        source = 'web',
        ch,
        couponId,
        couponType,
        channelNo,
        chargeConfigId,
        shareKey,
        officialKey,
        callback, 
        onCancel
    }) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/make-order',
            body: {
                ifboth,
                type,
                source,
                ch,
                couponId,
                couponType,
                channelNo,
                chargeConfigId,
                shareKey,
                officialKey,
            },
        });

        if (res.state.code == 0) {
            const order = res.data.orderResult;

            if (!Detect.os.phone) {
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
        }
    }
}


export function selectPayResult(orderId, done, timeout) {
    if (!window.selectPayResultCount) {
        window.selectPayResultCount = 1;
    }

    console.log('支付回调次数 ==== ', window.selectPayResultCount);

    fetch('/api/wechat/selectResult?orderId=' + orderId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        credentials: 'include',
    })
        .then((res) => res.json())
        .then((json) => {
            console.log('支付回调 == ', JSON.stringify(json));

            if (json.state.code == 0) {
                window.selectPayResultCount = 1;
                // if (json.state.msg == 'SUCCESS') {
                //     window.toast('支付成功');
                done();
                // } else if (json.state.msg == 'CANCEL') {
                //     window.toast('微信支付处理中，请稍后再看,\n或者联系管理员');
                // } else {
                //     window.toast('支付失败');
                // }
            } else {
                setTimeout(() => {
                    if (window.selectPayResultCount < 40) {
                        window.selectPayResultCount += 1;
                        selectPayResult(orderId, done, timeout);

                        if (window.selectPayResultCount == 40) {
                            timeout && timeout();
                        }
                    } else {
                        window.selectPayResultCount = 1;
                    }
                }, 3000);
            }
        });
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

// 请求封装
export function api({
    dispatch = () => {},
    getStore = () => {},
    url,
    method = 'GET',
    body = {},
    showWarningTips = true,
    showLoading = true,
    errorResolve = false,
}) {
    return new Promise((resolve, reject) => {
        !!showLoading && dispatch(loading(true));

        url = method === 'GET' ? `${url}?${encode(body)}` : url;

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
                        resolve(json)
                        break;

                    case 110:
                        if (json.data && json.data.url) {
                            let redirect_url = window.location.href;
                            window.location.replace('/api/wx/login?redirect_url=' + encodeURIComponent(redirect_url));
                        }
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

                    case 50005:
                        // 已经是管理员
                        resolve(json)
                        break;

                    default:
                        if (errorResolve) {
                            resolve(json);
                        }
                        showWarningTips && window.toast(json.state.msg);
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
                if (errorResolve) {
                    resolve(err);
                }
                !!showLoading && dispatch(loading(false));
            })
    });

}


export function getCreateLiveStatus(topicId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/user/getCreateLiveStatus',
			body: {
				topicId
			}
		});

		return result;
	};
}

export function isLiveAdmin(liveId){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/studio/is-live-admin',
            body: {
                liveId,
            }
        });

        return result
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

// 获取公众号关注
export function getIsSubscribe(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
            showLoading: false,
            method: 'POST',
			url: ' /api/wechat/live/isSubscribe',
			body: params
		});

		return result;
	};
}

// 获取公众号关注
export async function fetchIsSubscribe(params){
	const result = await api({ 
        showLoading: false,
        method: 'POST',
        url: ' /api/wechat/live/isSubscribe',
        body: params
    });

    return result;
}

// 获取收费配置
export const initConfig = async (params) => {
    const res = await request({
        url: '/api/wechat/transfer/baseApi/h5/system/getConfigMap',
        method: 'POST', 
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
// 获取女大公众号关注
export async function fetchIsSubscribeAndQr({channel='universityCourseExam',pubBusinessId='',isFocusThree,unFocusThree}){
	let res = await initConfig({businessType:'UFW_CONFIG_KEY'});
    let liveId =getVal(res, 'UFW_LIVE_ID', '')
    let appId = getVal(res, 'UFW_APP_ID', '')

    let subscribeResult = await fetchIsSubscribe({
        liveId: liveId,
        appId: appId
    });  
    if(!subscribeResult?.data?.isFocusThree){
        let qrResult = await fetchQr({ 
            appId,
            channel,
            pubBusinessId,
            liveId: liveId,
        });
        typeof unFocusThree=='function'&& unFocusThree((qrResult.data && qrResult.data.qrUrl) || '')
    }else{
        typeof isFocusThree=='function'&& isFocusThree() 
    }
}
// 获取媒体vid
export async function fetchMediaUrl(topicId) {
    const params = {
        topicId
    }
	let { data } = await api({
        url: '/api/wechat/topic/media-url',
        method: 'GET',
        showLoading: false,
        body: params
    })

    return data || {};
}




export async function getBaseUserInfo(userId, topicId) {
    var params = {
        topicId
    };
    if (userId) {
        params.userId = userId;
    };
	let { data } = await api({
        url: '/api/wechat/user/info',
        method: 'GET',
        showLoading: false,
        body: params
    })

    return data || {}; 
}


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
 
		dispatch(loading(false));

		return result;
	};
}

//绑定第三方
export async function  bindAppKaiFang(){ 
    const kfAppId = getUrlParams('kfAppId');
    const kfOpenId = getUrlParams('kfOpenId'); 
    if(kfOpenId && kfAppId){
        await request({
            url: "/api/wechat/live/userBindKaiFang",
            body: {
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            },
            method: "POST"
        }); 
    } 
    return true
}
 

// 获取直播间
export async function myLiveEntity(params){
    const res = await request.post({
        url: "/api/wechat/transfer/baseApi/h5/live/myLiveEntity",
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
/**
 * 查询旧版实名验证的认证状态
 * @param {String} liveId 直播间id
 * @param {String} type
 */
export async function getRealStatus(liveId, type) {
    const result = await api({ 
        url: '/api/wechat/live/getRealStatus',
        body: {liveId,type},
    });
    return result;
}

/**
 * 查询新版实名验证的状态
 * @param {Object} params 
 */
export async function getCheckUser(params={}){
    const result = await api({ 
        showLoading: true,
        url: '/api/wechat/live/checkUser',
        body: {...params},
    });
    return result;
}

/**
 * 获取旧版实名验证已经提交的认证信息
 * @param {Object} params 
 */
export async function getRealNameInfo(params){
    const result = await api({ 
        url: '/api/wechat/live/getRealNameInfo',
        body: {...params},
    });

    return result;
}
 

/**
 * 获取新版实名验证已经提交的认证信息
 */
export async function getVerifyInfo() {
    const result = await api({ 
        url: '/api/wechat/live/getVerifyInfo',
        body: {},
    });
    return result;
}

/**
 * //将base64转换为文件
 */
export async function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

// 通用广告接口
export const getCommonAd = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/ad/commonAd',
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
