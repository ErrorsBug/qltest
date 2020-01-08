import fetch from 'isomorphic-fetch';
import { extname } from 'path';
import { encode, stringify } from 'querystring';
import Detect from '../../components/detect';
// import OSS from 'ali-oss'

import { getVal } from '../../components/util';

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

// 设置sts上传信息
export const SET_STS_AUTH = 'SET_STS_AUTH';

export const SET_IS_LIVE_ADMIN = 'SET_IS_LIVE_ADMIN';

export const GET_IS_SUBSCRIBE = 'GET_IS_SUBSCRIBE';

export const GET_RELATIONINFO = 'GET_RELATIONINFO';

export const GET_SHARE_COMMENT_CONFIG = 'GET_SHARE_COMMENT_CONFIG';

export function initIsSubscribe (isSubscribe) {
    return {
        type: GET_IS_SUBSCRIBE,
        isSubscribe
    }
}

export function loading(status) {
    return {
        type: LOADING,
        status
    }
};

let uploadClient = null;
let uploadClientDoc = null;



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
}

export function setIsLiveAdmin (data) {
	return {
		type: SET_IS_LIVE_ADMIN,
		data
	}
}

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
        onError: () => null
    }) {
    return async (dispatch, getStore) => {

        if (!/(doc|xls|pdf|docx|xlsx|ppt|pptx)$/.test(file.name)) {
            window.toast('只支持doc,pdf,xls,ppt文件上传，请重新选择！', 2000);
            options.onError();
            throw new Error('只支持doc,pdf,xls,ppt文件上传，请重新选择!');
        }

        if (file.size > 20480000) {
            window.toast('最大文件不能超过20M!', 2000);
            options.onError();
            throw new Error('最大文件不能超过20M!');
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
export function uploadImage(file, folder = 'temp', fileType = '.jpg') {
    return async (dispatch, getStore) => {
        let isImage;
        if (!/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
            window.toast('图片格式只支持jpg|JPG|png|PNG|gif|GIF|bmp，请重新选择！', 2000);
            return;
        } else {
            isImage = true;
        }

        if (file.size > 5242880) {
            window.toast('请选择小于5M的图片文件！', 2000);
            return;
        }

        // 获取文件类型
        if (file.name) {
            fileType = extname(file.name);
        }


        let resultFile = file;
        if (file.size > 3145728) {
            resultFile = await imageCompress(file);
        }

        const client = await getOssClient(getStore, dispatch);

        const key = `qlLive/${folder}/${reName()}${fileType}`;
        let checkpoint, fileName, uploadId;

        window.loading(true)

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
        window.loading(false);

        if (result.res.status == 200) {
            if (isImage) {
                window.toast('图片上传成功');
            } else {
                window.toast('上传成功');
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

export function getUserInfo(userId) {
    var params = {};
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

export function request ({
	                         url,
	                         method = 'GET',
	                         body = {},
                         }) {
	url = method === 'GET' ? `${url}?${encode(body)}` : url;

	return fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		credentials: 'include',
		body: method === 'POST' ? JSON.stringify(body) : null,
	}).then(async res => {
		let resultText = await res.text()
		let resultJson = null;

		try {
			resultJson = JSON.parse(resultText);

		} catch (error) {
			console.warn('返回的格式不是json格式 --- ', resultText);
			return resultText;
		}
		switch (getVal(resultJson, 'state.code')) {

			case 110:
				if (resultJson.data && resultJson.data.url) {
					let redirect_url = window.location.href;
					window.location.replace('/api/wx/login?redirect_url=' + encodeURIComponent(redirect_url));
				}
				return false;
		}

		return resultJson;
	})
}

//获取系列课课程列表
export function fetchCourseList(channelId, liveId, page, size) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/channel/topic-list',
			body: {
				channelId,
				liveId,
				clientType: 'weixin',
				pageNum: page,
				pageSize: size,
			}
		});
		return result;
	};
};


// 获取系列课信息
export function getChannelInfo (param) {
	return (dispatch, getStore) => {
		return api({
			dispatch,
			getStore,
            showLoading:false,
			method: 'GET',
			url: '/api/wechat/channel/info',
			body: {...param}
		});
	}
}

/** 获取详情页引导关注配置 */
export function fetchQrImageConfig ({ topicId }) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips:false,
            errorResolve:true,
            url: '/api/wechat/topic/getFollowGuideInfo',
            body: {
                topicId
            }
        });
    }
}


/** 分享完成添加评论 */
export function addShareComment ({userId,liveId,topicId}) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            showWarningTips: false,
            errorResolve:true,
            url: '/api/wechat/topic/addShareComment',
            body: {
                userId,
                liveId,
                topicId
            },
            method: 'POST'
        });
    }
}

/**
 * 获取话题分享评论开关
 * @param {topicId: string} params 参数， 包含话题Id
 */
export function dispatchGetShareCommentConfig(params) {
    return async (dispatch, getStore) => {
        try {
            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                url: '/api/wechat/transfer/h5/courseExtend/getShareCommentConfig',
                body: params, 
                method: 'POST'
            });
            if(result.state.code === 0) {
                dispatch({type: GET_SHARE_COMMENT_CONFIG, flag: result.data && result.data.flag});
            } 
            return result && result.data;
        } catch (error) {
            console.log(error);
        }
    }
}
