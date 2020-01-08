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

export const UPDATE_VIDEO_UPLOAD_STATUS = 'UPDATE_VIDEO_UPLOAD_STATUS';

export const UPDATE_VIDEO_UPLOAD_PROGRESS = 'UPDATE_VIDEO_UPLOAD_PROGRESS';

export const UPDATE_VIDEO_UPLOAD_SIZE = 'UPDATE_VIDEO_UPLOAD_SIZE';

export const UPDATE_VIDEO_UPLOAD_AUTH= 'UPDATE_VIDEO_UPLOAD_AUTH';


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
export function dataURLtoBlob(dataurl) {
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
 * 给图片添加居中的文字水印
 * @param {File} file HTML5 File对象 
 * @param {String} text 水印文字
 */
export function addTextWatermark(file, text) {
    const reader = new FileReader();
    const sourceImage = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return new Promise((resolve, reject) => {
        try {
            reader.onload = (event) => {
                sourceImage.onload = () => {
                    canvas.width = sourceImage.width;
                    canvas.height = sourceImage.height;
                    ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
                    ctx.font = 'bolder 58px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'center';
                    ctx.fillStyle = 'rgba(247,54,87,0.3)';
                    ctx.fillText(text, sourceImage.width / 2, sourceImage.height / 2);
                    const blob = dataURLtoBlob(canvas.toDataURL('image/jpeg'));
                    const resultFile = new File([blob], 'tmp.jpg', {
                        type: 'image/jpeg'
                    });
                    resolve(resultFile);
                }
                sourceImage.src = event.target.result;
            }
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('图片添加水印失败！');
        }
    });
}


/**
 * 给图片添加居中的图片水印
 * @param {File} file HTML5 File对象 
 * @param {String} watermarkImageUrl 水印图片的地址
 */
export function addImageWatermark(file, watermarkImageUrl) {
    const reader = new FileReader();
    const sourceImage = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return new Promise((resolve, reject) => {
        try {
            reader.onload = (event) => {
                sourceImage.onload = () => {
                    canvas.width = sourceImage.width;
                    canvas.height = sourceImage.height;
                    ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
                    const watermarkImage = new Image();
                    watermarkImage.crossOrigin = 'anonymous';
                    watermarkImage.src = `/api/wechat/image-proxy?url=${watermarkImageUrl}`;
                    watermarkImage.onload = () => {
                        const watermarkImageWidth = watermarkImage.width;
                        const watermarkImageHeight = watermarkImage.height;
                        ctx.drawImage(watermarkImage, 0, 0, watermarkImageWidth, watermarkImageHeight, 0, 0, canvas.width, canvas.width * watermarkImageHeight / watermarkImageWidth);
                        const blob = dataURLtoBlob(canvas.toDataURL('image/jpeg'));
                        const resultFile = new File([blob], 'tmp.jpg', {
                            type: 'image/jpeg'
                        });
                        resolve(resultFile);
                    }
                }
                sourceImage.src = event.target.result;
            }
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('图片添加水印失败！');
        }
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

        const client = await getOssClient(getStore, 'doc');
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
 * 上传图片
 */
export function uploadImage(file, folder = 'temp', fileType = '.jpg') {
    return async (dispatch, getStore) => {
        let isImage;
        if (!/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
            window.toast('图片格式只支持|JPG|PNG|GIF|BMP，请重新选择！', 2000);
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
        const client =await getOssClient(getStore,folder);//folder="realName"只有实名认证的照片可以用
        //const client = getOssClient(getStore);

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
            let domain = 'img.qlchat.com';
            if (folder == 'realName') {
                domain = 'ql-encrypt.oss-cn-hangzhou.aliyuncs.com';
            }
            return `http://${domain}/${key}`
        } else {
            throw new Error('文件上传失败 ->' + JSON.stringify(result));
        }
    }
}

// 更新视频上传状态
export function updateVideoUploadStatus(status) {
    return {
        type: UPDATE_VIDEO_UPLOAD_STATUS,
        status,
    }
}
// 更新视频上传进度
export function updateVideoUploadProgress(percent) {
    return {
        type: UPDATE_VIDEO_UPLOAD_PROGRESS,
        percent,
    }
}

// 更新上传视频大小
export function updateVideoUploadedSize(uploadedSize, totalSize) {
    return {
        type: UPDATE_VIDEO_UPLOAD_SIZE,
        uploadedSize,
        totalSize,
    }
}

// 更新上传视频信息
export function updateVideoUploadedInfo(videoAuth,duration) {
    return {
        type: UPDATE_VIDEO_UPLOAD_AUTH,
        videoAuth,
        duration
    }
}

/**
 * 上传视频
 *
 * @export
 * @param {any} file
 * @param {string} [folder='temp']
 * @param {string} [fileType='.mp3']
 * @param {number} [duration=0]
 * @returns
 */
export function uploadVideo (
    file,
    liveId,
    maxDuration,
    options={
        // 是否显示loading遮罩
        showLoading: true,
        // 开始回调
        startUpload: () => {},
        // 进度回调
        onProgress: (progress) => {},
        // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
        interruptUpload: () => false,
        // 上传完成
        finish: (data) => {},
        // 上传失败
        onError: (msg) => null,
    }
) {
    return async (dispatch, getStore) => {
        if (!/(3gp|avi|flv|mp4|mpg|asf|wmv|mkv|mov|webm)$/i.test(file.name.toLowerCase())) {
            window.toast('只支持3gp、avi、flv、mp4、mpg、asf、wmv、mkv、mov、webm文件上传，请重新选择！', 2000);
            return;
        }

        /**  获取 duration */
        const url = URL.createObjectURL(file);
        const mp4 = new Audio(url);
        let duration = 0;
        const hasDuration = () => {
            return !(duration === 0 || duration === 1);
        }
        mp4.volume = 0;
        mp4.onloadedmetadata = (data) => {
            duration = hasDuration() ? duration : mp4.duration;
        }
        mp4.ondurationchange =  (data) => {
            duration = hasDuration() ? duration : mp4.duration;
        }

        //  先播放 700ms， 确保触发 onloadedmetadata || onloadedmetadata;
        mp4.play();
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                mp4.pause();
                resolve();
            }, 700);
        });

        if(typeof maxDuration === 'number' && duration > maxDuration) {
            return false;
        }

        const videoAuth = await api({
            dispatch,
            getStore,
            method: 'GET',
            url: '/api/video/oss/video/get',
            body: {
                fileName: file.name,
                fileSize: file.size,
	            liveId: liveId
            },
        });

        const { requestId, uploadAddress, uploadAuth, videoId } = videoAuth.data
        const uploader = new VODUpload({
            // 开始上传
            'onUploadstarted': function (uploadInfo) {
                options.startUpload()
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
            },
            // 文件上传成功
            'onUploadSucceed':  function (uploadInfo) {
                window.toast('上传成功！');
                options.finish(videoAuth.data, duration)
            },
            // 文件上传失败
            'onUploadFailed': function (uploadInfo, code, msg) {
                options.onError(msg)
                window.toast(`视频上传失败, 原因: ${msg}`)
            },
            // 文件上传进度，单位：字节
            'onUploadProgress': function (uploadInfo, totalSize, uploadedSize) {
                if (options.interruptUpload()) {
                    uploader.cleanList()
                } else {
                    // 更新视频上传进度
                    const percent = (uploadedSize * 100 / totalSize).toFixed(2)
                    options.onProgress(percent)
                }
            },
            // 上传凭证超时
            'onUploadTokenExpired': async function () {
                console.log('onUploadTokenExpired');
                const refresh = await api({
                    dispatch,
                    getStore,
                    method: 'POST',
                    url: '/api/video/admin/oss/video/refresh',
                    body: { videoId },
                });
                const { requestId, uploadAuth } = refresh.data
                uploader.resumeUploadWithAuth(uploadAuth);
            },
        });
        const accessKeyId = ''
        const accessKeySecret = ''
        uploader.init(accessKeyId, accessKeySecret);

        const userData = '{"Vod":{"UserData":"{"IsShowWaterMark":"false","Priority":"7"}"}}';
        uploader.addFile(file, null, null, null, userData);
        uploader.startUpload()

        return uploader
        
        // console.log(folder);
        // const client =await getOssClient(getStore, folder);
        
        // const key = `qlLive/${folder}/${reName()}${fileType}`;
        // let checkpoint, fileName, uploadId;

        // window.loading(true)
        // let retryCount = 0;
        // let retryCountMax = 3;

        // const result = await client.multipartUpload(key, file, {
        //     checkpoint: checkpoint,
        //     partSize: 1000 * 1024, //设置分片大小
        //     timeout: 120000, //设置超时时间
        //     progress: function (p, cpt) {
        //         return function (done) {
        //             if (cpt !== undefined) {
        //                 checkpoint = cpt;
        //                 fileName = cpt.name;
        //                 uploadId = cpt.uploadId;
        //                 console.log(p, cpt)
        //             }
        //             done();
        //         }
        //     },
        // }).catch((err) => {
        //     if (client && client.isCancel()) {
        //         console.log('stop-upload!');
        //     } else {
        //         console.error(err);
        //         //retry
        //         if (retryCount < retryCountMax){
        //             retryCount++;
        //             console.error("retryCount : " + retryCount);
        //         }
        //     }
        // })

        // file = null;
        // window.loading(false);

        // if (result.res.status == 200) {
        //     window.toast('上传成功');
        //     return `https://video-public.qlchat.com/${key}`
        // } else {
        //     throw new Error('文件上传失败 ->' + JSON.stringify(result));
        // }
    }
}

/**
 * 获取上传组件
 */
async function getOssClient (getStore, type = 'common') {

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

    if (type == 'doc'||type == 'realName') {
        //folder="realName"和type="realName"只有实名认证的照片可以用
        bucket = type == 'realName'?'ql-encrypt':'qianliao-doc-download-402-301';


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
    const client =new OSSW({
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

export function getUserInfo(userId,otherUserId, otherParams) {
    var params = {};
    if (userId) {
        params.userId = userId;
    };
    if(otherUserId){
        params.otherUserId = otherUserId
    }
    if (otherParams) {
        params = {
            ...params,
            ...otherParams,
        }
    }
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
 * 判断是否关注
 * isShowQl, subscribe, isFocusThree, isBindThird
 * @param {*} param0 
 */
export function fetchSubscribeStatus ({ liveId }) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/common/isSubscribe',
            body: {
                liveId
            }
        });

        if (getVal(result, 'state.code') === 0) {
            dispatch({
                type: INIT_TOP_BANNER_SUBSCRIBE_INFO,
                data: getVal(result, 'data')
            });

            return getVal(result, 'data');
        }
    }
}

/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */
export function getQr({ channel, channelId, liveId, toUserId = '', topicId, showQl, showLoading = false, appId}) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/get-qrcode',
            body: {
                channel, channelId, liveId, toUserId, topicId, showQl, appId 
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

/**
 * 获取知识新闻数据
 */
export async function getNewsLists(params = {}) {
    const result = await api({
		showLoading: false,
		method: 'GET',
		url: '/api/wechat/news/list',
		body: {
            page: params.pageNum || 1,
            size: params.pageSize,
            type: params.type||'default',
        }
	});
	return result;
}

/**
 * 获取当前试听数据
 */
export async function getCourseAuditionList(params){
    const result = await api({
		showLoading: false,
		method: 'POST',
		url: '/api/wechat/getCourseAuditionList',
		body: params
	});
	return result;
}

// 获取点赞信息 
export function getLike(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/likesList',
            body: params
        });
        return result;
    };
}

//取消点赞 
export function cancelLikeIt(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/cancelLikes',
            body: params
        });
        return result;
    };
}


// 点赞 
export function addLikeIt(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/likes',
            body: params
        });
        return result;
    };
}

//获取评论 
export function getCourseComment(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/comment/getList',
            body: params
        });
        return result;
    };
}


// 添加评论
export function addCourseComment(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/topic/addComment',
            body: params
        });
        return result;
    };
}


/**
 * 获取用户是否创建直播间
 * @param {object} userId
 */
export function getMyLiveEntity(userId) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: "/api/wechat/transfer/h5/live/myLiveEntity",
            method: "POST",
            body: {
                userId,
                needSubscribe: 'Y'
            }
        });
        return result || [];
    }
}