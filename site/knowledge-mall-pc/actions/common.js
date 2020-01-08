import fetch from 'isomorphic-fetch';
import { extname } from 'path';
import { encode, stringify } from 'querystring';
import { getVal, locationTo }from '../components/util';
import { apiService } from "../components/api-service";
import { isEmpty } from "lodash";

import { hasPortraitInfo } from '../actions/portrait';

// 获取用户信息
export const USERINFO = 'USERINFO';
// 处理中
export const LOADING = 'LOADING';
// 显示toast
export const TOAST = 'TOAST';
// 显示或隐藏直播间列表modal
export const SET_LIVE_LIST_MODAL_SHOW = 'SET_LIVE_LIST_MODAL_SHOW';
// 显示或隐藏登录modal
export const SET_LOGIN_MODAL_SHOW = 'SET_LOGIN_MODAL_SHOW';
// 显示或隐藏推广modal
export const SET_PROMOTION_MODAL_SHOW = 'SET_PROMOTION_MODAL_SHOW';
// 显示或隐藏转载modal
export const SET_REPRINT_MODAL_SHOW = 'SET_REPRINT_MODAL_SHOW';
// 初始化信息
export const INIT_STATE = 'INIT_STATE';
// 设置直播间信息
export const SET_LIVE_INFO = 'SET_LIVE_INFO';
// 设置用户信息
export const SET_USER_INFO = 'SET_LIVE_INFO';
// 设置用户身份
export const SET_USER_IDENTITY = 'SET_USER_IDENTITY';
// 更新用户直播间列表
export const UPDATA_CREATOR_LIVE_LIST = 'UPDATA_CREATOR_LIVE_LIST';
// 更新agentId
export const UPDATE_AGENT_INFO = 'UPDATE_AGENT_INFO'
// 推荐首页的课程模块导航
export const NAV_COURSE_MODULE = 'NAV_COURSE_MODULE'

export function updateCreatorLiveList(list) {
    return (dispatch, getStore) => {
        dispatch({
            type: UPDATA_CREATOR_LIVE_LIST,
            list: list,
        });
    }
}

export function setLiveListModalShow(show) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_LIVE_LIST_MODAL_SHOW,
            show: show,
        });
    }
}

export function setLoginModalShow(show) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_LOGIN_MODAL_SHOW,
            show: show,
        });
    }
}

export function setPromotionModalShow(show) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_PROMOTION_MODAL_SHOW,
            show: show,
        });
    }
}

export function setReprintModalShow(show) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_REPRINT_MODAL_SHOW,
            show: show,
        });
    }
}

export function setLiveInfo(liveInfo, relayAuth) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_LIVE_INFO,
            liveInfo,
            relayAuth,
        });
    }
}

export function setUserInfo(userInfo) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_USER_INFO,
            userInfo,
        });
    }
}

export function setUserIdentity(identity) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_USER_IDENTITY,
            identity,
        });
    }
}

export function updateNavCourseModule (moduleList) {
    return (dispatch, getStore) => {
        dispatch({
            type: NAV_COURSE_MODULE,
            moduleList
        })
    }
}

// 请求封装
export function api({
    dispatch,
    getStore,
    url,
    method = 'GET',
    body = {},
    showWarningTips = false,
}) {
    return new Promise((resolve, reject) => {

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
                // dispatch(fetchComplete(json))
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
                        showWarningTips && window.message.warning(json.state.msg);
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(fetchError(err));
            })
    });
}

export function getUserInfo(userId) {
    var params = {};
    if (userId) {
        params.userId = userId;
    }
    return async (dispatch, getStore) => {
        const result = await apiService.post({
            dispatch,
            getStore,
            url: '/h5/user/get',
            body: params,
        });
        // console.log(result.state.code)
        if (result.state.code === 0) {
            // console.log(result)
            dispatch({
                type: USERINFO,
                userInfo: result.data.user,
            });
        }


        return result
    }
}

export function getAgentInfo(agentId) {
    return async (dispatch, getStore) => {
        const result = await apiService.post({
            dispatch,
            getStore,
            url: '/h5/agent/info',
            body: { agentId },
        });
        return result
    }
}

export function updateAgentInfo(agentInfo) {
    return (dispatch, getStore) => {
        dispatch({
            type: UPDATE_AGENT_INFO,
            agentInfo,
        });
    }
}

export function getUserIdentity({liveInfo, agentInfo, userMgrLiveList, relayAuth}) {
    return (dispatch, getStore) => {

        const { creatorList, managerList } = userMgrLiveList;
        // console.log(1)
        // 若为无直播间用户留在当前页面（知识通/代理商城）
        const isNoneLive = creatorList.length === 0 && isEmpty(liveInfo);
        if (isNoneLive) {
           dispatch(setUserIdentity('none-live'))
           dispatch(hasPortraitInfo('N'));
           return;
        }
        // console.log(liveInfo)
        const hasRelayChannel =  liveInfo.knowledgeAccountInfo.hasRelayChannel //当前直播间是否有转播过知识通商城
        const curLiveAgentId =  liveInfo.knowledgeAccountInfo.agentId; //当前直播间的一级代理id，若不为空，则前直播间为二级代理
        
        
        const curAgentId = agentInfo.agentId; //当前一级代理商城页面的 agentId，若不为空，则当前页面为一级代理商城，否则为知识通商城
        const isExist = agentInfo.isExist; //对应于 curAgentId 的一级代理的是否存在，若为 N ,则不存在。
        const isSelf = agentInfo.isSelf; //当前直播间是否为一级代理商本身
        
        const isAgentMall = !isEmpty(agentInfo) && isExist === 'Y';

        // 用户进入一级代理商城的处理逻辑
        if (isAgentMall) {
            // 一级代理本身
            if(isSelf === 'Y') {
                dispatch(setUserIdentity('super-agent'));
                return;
            }

            //是当前一级代理的二级代理
            if(curLiveAgentId && curAgentId === curLiveAgentId) {
                dispatch(setUserIdentity('agent'));
                return;
            } 

            // 是二级代理，但不是当前一级代理的二级代理
            if (curLiveAgentId){
                locationTo(`/pc/knowledge-mall/index?selectedLiveId=${liveInfo.liveId}&agentId=${curLiveAgentId}`)
                return;
            } 

            // 知识通用户
            if (hasRelayChannel === 'Y') {
                dispatch(setUserIdentity('knowledge'));
                return
            }

            // 普通用户
            dispatch(setUserIdentity('knowledge'));
            return;
       
        // 用户进入知识通商城逻辑
        } else {
            // 一级代理等同普通用户，不做处理

            // 二级代理跳到对应的一级代理商城
            if (curLiveAgentId){
                locationTo(`/pc/knowledge-mall/index?selectedLiveId=${liveInfo.liveId}&agentId=${curLiveAgentId}`)
                return;
            } 

            // 知识通用户
            if (hasRelayChannel === 'Y') {
                dispatch(setUserIdentity('knowledge'));
                return
            }

             // 普通用户
             dispatch(setUserIdentity('normal'));
             return;

        }
    }
}

export function initState({userId, liveId, agentId} = params) {
    return async (dispatch, getStore) => {
        // 请求初始用户/直播间/代理商城信息
        const result = await apiService.group([{
            url: '/h5/knowledge/checkPermission',
            body: {userId, liveId, agentId},
        },{
            url: '/h5/selfmedia/getPushStatus',
            body: {liveId},
        }])
        // console.log(result)
        if (result.state.code !== 0 ) return null;
        const [ permissonRes, pushStatusRes ] = result.data;
        if (permissonRes.state.code !==0 || pushStatusRes.state.code !== 0) return null;
        const { liveInfo, agentInfo, relayAuth, userMgrLiveList} = permissonRes.data;
        const { creatorList, managerList } = userMgrLiveList
        const pushStatus = localStorage.getItem("pushStatus") || pushStatusRes.data.openStatus;
        const initData = {
            liveInfo,
            agentInfo,
            relayAuth,
            userMgrLiveList,
            pushStatus,
            accountInfo: liveInfo.knwowledgeAccountInfo || {},
        }

        // 初始化默认数据
        dispatch({ 
            type: INIT_STATE,
            data: { ...initData }
        })

        // 若有直播间，则走以下选择直播间逻辑

        // 1.若没有liveInfo(即页面链接没有带上 selectedLiveId) 或有liveInfo但是没有该直播间的管理权限
        if( isEmpty(liveInfo) || relayAuth === 'N') {
            // 若有多个直播间显示弹窗
            if ((creatorList.length + managerList.length) > 1) {
                dispatch(setLiveListModalShow('Y'));
                return initData ;
            
            // 若只有一个自己的直播间，则选择该播间
            } else if (creatorList.length == 1) {
                let autoSelectedLiveInfo = creatorList[0];
                dispatch({ 
                    type: INIT_STATE,
                    data: { ...initData, liveInfo:  autoSelectedLiveInfo }
                })
                dispatch(getUserIdentity({liveInfo: autoSelectedLiveInfo, agentInfo,relayAuth,userMgrLiveList}))
                // 更新链接
                setLocation(autoSelectedLiveInfo.liveId, agentInfo.agentId)
                return { ...initData, liveInfo:  autoSelectedLiveInfo }   
            //若一个直播间都没有，或只有管理的直播间，直接返回
            } else {
                dispatch(getUserIdentity({liveInfo,agentInfo,relayAuth,userMgrLiveList}))
                return initData
            }
        }
        //2.若有LiveInfo ，则直接选择该直播间 
        dispatch(getUserIdentity({liveInfo,agentInfo,relayAuth,userMgrLiveList}))

        return initData
    }
}


function setLocation(liveId, agentId) {
    let baseUrl = window.location.pathname;
        
    let url = baseUrl + `?selectedLiveId=${liveId}${agentId? '&agentId='+ agentId : ''}`

    window.history.replaceState({liveId: liveId}, null, url);
}



/**
 * 获取上传组件
 */
function getOssClient(getStore, isAudio) {
    let OSSW, STS;

    if (window.OSS && (!OSSW || !STS)) {
        OSSW = OSS.Wrapper;
        STS = OSS.STS;
    }

    let secure = false;
    if (/(https)/.test(window.location.href)) {
        secure = true;
    }

    const bucket = 'ql-res';
    const region = 'oss-cn-hangzhou';

    const audioBucket = 'qianliao-doc-download-402-301'
    // const docsBucket = 'ql-res';
    // const docsBucket = 'qianliao-doc-download-402-301';

    const stsAuth = isAudio ? getStore().common.audioStsAuth : getStore().common.stsAuth;

    const client = new OSSW({
        region: region,
        accessKeyId: stsAuth.accessKeyId,
        secure: secure,
        accessKeySecret: stsAuth.accessKeySecret,
        stsToken: stsAuth.securityToken,
        bucket: isAudio ? audioBucket : bucket,
    });

    return client;
}

/**
 * 上传图片
 */
export function uploadImage(file, folder = 'temp', fileType = '.jpg') {
    return async (dispatch, getStore) => {
        let isImage;
        if (!/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
            message.warning('图片格式只支持JPG|JPEG|PNG|GIF|BMP，请重新选择！');
            return;
        } else {
            isImage = true;
        }

        if (file.size > 5242880) {
            message.warning('请选择小于5M的图片文件！');
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

        const client = getOssClient(getStore);

        const key = `qlLive/${folder}/${reName()}${fileType}`;
        let checkpoint, fileName, uploadId;

        // window.loading(true)
        message.loading('上传中', 100000, )

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
        // window.loading(false);
        message.destroy()

        if (result.res.status == 200) {
            if (isImage) {
                message.success('图片上传成功');
            } else {
                message.success('上传成功');
            }
            return `https://img.qlchat.com/${key}`
        } else {
            throw new Error('文件上传失败 ->' + JSON.stringify(result));
        }
    }
}

// 上传音频
export function uploadAudio(file, topicId, duration = 0, folder = 'document', fileType = 'mp3') {
    return async (dispatch, getStore) => {

        const client = getOssClient(getStore, true);

        const key = `qlLive/${folder}/${reName()}.${fileType}`;
        let checkpoint, fileName, uploadId;

        // window.loading(true)
        message.loading('上传中', 100000)
        dispatch(updateAudioUploadStatus('uploading'))

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: function (p, cpt) {
                dispatch(updateAudioUploadProgress((p * 100).toFixed(2)))
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

        try {
            await saveMediaInfo({
                duration: duration,
                fileSize: file.size,
                fileName: file.name,
                // todo: 确认音频的mediaId是哪个
                mediaId: uploadId,
                // mediaId: 'a0485ffbbbc445c5b4400354e27461e9',
                topicId: topicId,
                type: 'audio',
                url: `https://docs.qianliaowang.com/${key}`,
                success: (res) => {
                    message.destroy()
                    if (res.status === 200) {
                        dispatch(updateAudioUploadStatus('uploaded'))
                    } else {
                        message.warning(res.statusText)
                    }
                },
                error: (err) => {
                    console.error(err)
                },
            })
        } catch (error) {
            console.error(error)
        }

        file = null;
    }
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

export function uploadVideo(file, topicId, liveId) {

    return async (dispatch, getStore) => {
        if (file.size > 3221225472) {
            message.warning('请选择小于3G的视频文件！');
            return;
        }

        const videoAuth = await api({
            dispatch,
            getStore,
            method: 'GET',
            url: '/api/video/admin/oss/video/get',
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
                dispatch(updateVideoUploadStatus('uploading'))
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
            },
            // 文件上传成功
            'onUploadSucceed': function (uploadInfo) {
                dispatch(updateVideoUploadStatus('uploaded'))
                const { bucket, endPoint, file, object, userData } = uploadInfo

                saveMediaInfo({
                    fileSize: file.size,
                    fileName: file.name,
                    mediaId: videoId,
                    // mediaId: 'a0485ffbbbc445c5b4400354e27461e9',
                    topicId: topicId,
                    type: 'video',
                    url: bucket + ',' + object,
                })
            },
            // 文件上传失败
            'onUploadFailed': function (uploadInfo, code, message) {
                dispatch(updateVideoUploadStatus('uploadFailed'))
                message.error('视频上传失败，请点击重试')
            },
            // 文件上传进度，单位：字节
            'onUploadProgress': function (uploadInfo, totalSize, uploadedSize) {
                // 更新视频上传进度
                const percent = (uploadedSize * 100 / totalSize).toFixed(2)
                dispatch(updateVideoUploadProgress(percent))
                dispatch(updateVideoUploadedSize(uploadedSize, totalSize))
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
                console.log('refresh auth:', refresh)
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
    }
}

export function saveMediaInfo(mediaInfo) {
    fetch('/api/video/admin/live/video/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        credentials: 'include',
        body: JSON.stringify(mediaInfo),
    }).then((res) => {
        if (mediaInfo.success) {
            mediaInfo.success(res)
        }
    }).catch((err) => {
        if (mediaInfo.error) {
            mediaInfo.error(err)
        }
    })
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}


