import fetch from 'isomorphic-fetch';
import { extname } from 'path';
import { encode, stringify } from 'querystring';
import Detect from '../../components/detect';
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

export const INIT_LIVE_LEVEL = 'INIT_LIVE_LEVEL'

export const SET_IS_LIVE_ADMIN = 'SET_IS_LIVE_ADMIN'

export const SET_IS_LIVE_MEDIA = 'SET_IS_LIVE_MEDIA'

export const SET_LIVE_PRICE = 'SET_LIVE_PRICE'

// 初始化stsAuth信息
export const INIT_STS_AUTH = 'INIT_STS_AUTH'
// 设置sts上传信息
export const SET_STS_AUTH = 'SET_STS_AUTH'

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
};

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
export function uploadAudio(
    file,
    folder = 'audio',
    fileType = '.mp3',
    options = {
        // 是否显示loading遮罩
        showLoading: true,
        // 开始回调
        startUpload: () => { },
        // 进度回调
        onProgress: (progress) => { },
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
        mp3.onloadedmetadata = (data) => {
            duration = mp3.duration;
        }

        let client = null;
        try {
            client = await getOssClient(getStore);
        } catch (error) {
            console.log('get oss client error: ', error);
        }


        const key = `qlLive/${folder}/${reName()}${fileType}`;
        let checkpoint, fileName, uploadId;

        options.showLoading && window.loading(true)

        options.startUpload();

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: async function (p, cpt) {

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
export function uploadDoc(file, folder = 'document', fileType = '.pdf', options = {
    // 是否显示loading遮罩
    showLoading: false,
    // 进度回调
    onProgress: (progress) => { },
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

        const client = await getOssClient(getStore, 'doc');
        const key = `qlLive/${folder}/${reName()}${fileType}`;

        let checkpoint, fileName, uploadId;

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: async function (p, cpt) {

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

        const client = await getOssClient(getStore);

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
 * 图片上传
 * @param {*object} file 
 * @param {*object} stsAuth
 * @param {*string} folder 
 * @param {*string} fileType 
 * @param {*number} maxSize 
 * @param {*array} accepts 
 */
export async function uploadImage(file, stsAuth, maxSize=2, folder='temp', fileType='.jpg', accepts=['jpeg', 'jpg', 'png', 'bmp', 'gif']){
    // 获取选择的图片的格式
    if (file.type) {
        fileType = file.type.split('/')[1];
    } else if (file.name) {
        fileType = extname(file.name).toLowerCase().substring(1);
    }
    // 图片格式的合法性检测
    if (accepts.indexOf(fileType) == -1) {
        window.toast(`只允许上传${accepts.join('/')}格式的图片`, 2000);
        return;
    }
    // 图片大小的合法性检测
    if (file.size > maxSize * 1024 * 1024) {
        window.toast(`请选择小于${maxSize}M的图片文件！`, 2000);
        return;
    }
    // 如果图片大于3M, 则进行压缩
    if (file.size > 3145728) {
        file = await imageCompress(file);
    }
    const client = await getOssClient(stsAuth, folder); // folder="realName"只有实名认证的照片可以用
    // 开启loading提示
    window.loading(true);
    const key = `qlLive/${folder}/${reName()}.${fileType}`;
    let checkpoint, fileName, uploadId;
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
    });
    // 关闭loading提示
    window.loading(false);
    if (result.res.status == 200) {
        return `https://img.qlchat.com/${key}`;
    } else {
        throw new Error('文件上传失败 ->' + JSON.stringify(result));
    }
}



/**
 * 获取上传组件
 */
async function getOssClient(stsAuth, type = 'common') {
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

    if (type == 'doc' || type == 'realName') {
        // folder="realName"和type="realName"只有实名认证的照片可以用
        bucket = type == 'realName' ? 'ql-encrypt' : 'qianliao-doc-download-402-301';

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

export function initUserInfo(userInfo) {
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

// 请求封装
export function api({
    url,
    body = {},
    method = 'GET',
    showLoading = true,
    showWarningTips = true,
    dispatch = () => {},
    getStore = () => {}
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
                        showWarningTips && window.toast(json.state.msg);
                        resolve(json)
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
                !!showLoading && dispatch(loading(false));
            })
    });

}

export function updateUserPower(power) {
    return {
        type: UPDATE_USER_POWER,
        power: power,
    }
}

/* 获取用户权限 */
export function fetchUserPower(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'GET',
            showLoading: false,
            url: '/api/wechat/user/power',
            body: params
        })
        if (result && result.state && result.state.code === 0) {
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

/**
 * 初始化stsAuth上传信息
 */
export function initStsAuth(){
    return {
        type: INIT_STS_AUTH
    }
}

/**
 * 初始化直播间的等级状态
 */
export function initLiveLevel(liveId){
    return {
        type: INIT_LIVE_LEVEL,
        liveId
    }
}

/**
 * 新建或者编辑打卡训练营
 * @param {*object} params 
 */
export async function createCheckInCamp(params){
    const result = await api({
        url: '/api/wechat/checkInCamp/newCamp',
        body: params,
        method: 'POST',
        showLoading: true
    });
    return result;
}

/**
 * 获取训练营的报名人数
 * @param {*long int} campId 
 */
export async function fetchCampAuthNum(campId){
    const result = await api({
        url: '/api/wechat/checkInCamp/campAuthNum',
        body: {campId},
        method: 'POST'
    });
    return result;
}

/**
 * 获取训练营详情
 * @param {*long int} campId 
 */
export async function fetchCampDetail(campId){
    const result = await api({
        url: '/api/wechat/checkInCamp/campDetail',
        body: {campId},
        method: 'POST'
    });
    return result;
}

