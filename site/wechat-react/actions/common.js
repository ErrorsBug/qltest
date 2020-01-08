import { apiService } from "components/api-service";
import fetch from "isomorphic-fetch";
import { extname } from "path";
import { encode } from "querystring";
import Detect from "../components/detect";
import { getLocalStorage, getVal, isFromLiveCenter, locationTo, setLocalStorage } from "../components/util";
// import OSS from 'ali-oss'

//获取用户信息
export const USERINFO = "USERINFO";
// 处理中
export const LOADING = "LOADING";
// 处理成功
export const SUCCESS = "SUCCESS";
// 处理失败
export const ERROR = "ERROR";
// 处理完成
export const COMPLETE = "COMPLETE";
// 显示toast
export const TOAST = "TOAST";

export const SYSTIME = "SYSTIME";
export const FIRST_MSG_CODE = "FIRST_MSG_CODE";
// 关闭支付弹框
export const TOGGLE_PAYMENT_DIALOG = "TOGGLE_PAYMENT_DIALOG";

// 设置sts上传信息
export const SET_STS_AUTH = "SET_STS_AUTH";

export const SET_IS_LIVE_ADMIN = "SET_IS_LIVE_ADMIN";

export const GET_OFFICIAL_LIVE_IDS = "GET_OFFICIAL_LIVE_IDS";
// 初始化appOpenId
export const INIT_APP_OPENID = "INIT_APP_OPENID";

export const UPDATE_USERINFO = "UPDATE_USERINFO";

// 获取好友关系
export const GET_RELATIONINFO = 'GET_RELATIONINFO';
export const GET_THRID_CONF = 'GET_THRID_CONF';

export function loading(status) {
    return {
        type: LOADING,
        status
    };
}

let uploadClient = null;
let uploadClientDoc = null;
let inPay = false;

export function setIsLiveAdmin(data) {
    return {
        type: SET_IS_LIVE_ADMIN,
        data
    };
}

export function fetchSuccess() {
    return {
        type: SUCCESS
    };
}

export function updateSysTime(sysTime) {
    return {
        type: SYSTIME,
        sysTime
    };
}

export function toast(msg, timeout) {
    return async (dispatch, getStore) => {
        dispatch({
            type: TOAST,
            payload: {
                show: true,
                msg,
                timeout
            }
        });

        setTimeout(() => {
            dispatch({
                type: TOAST,
                payload: {
                    show: false
                }
            });
        }, timeout || 1000);
    };
}

// 上传文件命名
function reName() {
    var chars = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var res = "";
    for (var i = 0; i < 8; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    res += "-";
    for (var i = 0; i < 4; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    res += "-";
    for (var i = 0; i < 4; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    res += "-" + new Date().getTime() + "-";
    for (var i = 0; i < 12; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
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
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onload = event => {
            sourceImage.src = event.target.result;

            sourceImage.onload = () => {
                canvas.width = sourceImage.width;
                canvas.height = sourceImage.height;
                ctx.drawImage(
                    sourceImage,
                    0,
                    0,
                    sourceImage.width,
                    sourceImage.height
                );

                // setTimeout(() => {
                let resultFile = dataURLtoBlob(
                    canvas.toDataURL("image/jpeg", 0.5)
                );
                resultFile = new File([resultFile], "temp.jpg", {
                    type: "image/jpeg"
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
    folder = "audio",
    fileType = ".mp3",
    options = {
        // 是否显示loading遮罩
        showLoading: true,
        // 开始回调
        startUpload: () => {},
        // 进度回调
        onProgress: progress => {},
        // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
        interruptUpload: () => false,
        // 上传失败
        onError: () => null
    }
) {
    return async (dispatch, getStore) => {
        if (!/(mp3|MP3)$/i.test(file.name)) {
            window.toast("只支持MP3文件上传，请重新选择！", 2000);
            options.onError();
            return;
        }

        if (file.size > 31457280) {
            window.toast("请选择小于30M的音频文件！", 2000);
            options.onError();
            return;
        }

        const url = URL.createObjectURL(file);
        const mp3 = new Audio(url);
        let duration = 0;
        const hasDuration = () => {
            return !(duration === 0 || duration === 1);
        };
        mp3.volume = 0;
        mp3.onloadedmetadata = data => {
            duration = hasDuration() ? duration : mp3.duration;
        };
        mp3.ondurationchange = data => {
            duration = hasDuration() ? duration : mp3.duration;
        };

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
            console.log("get oss client error: ", error);
        }

        const key = `qlLive/${folder}/${reName()}${fileType}`;
        let checkpoint, fileName, uploadId;

        options.showLoading && window.loading(true);

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
            }
        });

        file = null;
        options.showLoading && window.loading(false);

        if (result.res.status == 200) {
            window.toast("上传成功");
            return {
                url: `https://media.qianliaowang.com/${key}`,
                duration: duration
            };
        } else {
            throw new Error("上传失败 ->" + JSON.stringify(result));
        }
    };
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
export function uploadDoc(
    file,
    folder = "document",
    fileType = ".pdf",
    options = {
        // 是否显示loading遮罩
        showLoading: false,
        // 进度回调
        onProgress: progress => {},
        // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
        interruptUpload: () => false,
        // 错误回调
        onError: () => null,
        // 最大值开关
        maxSizeSwitch: false
    }
) {
    return async (dispatch, getStore) => {
        let maxSize = options.maxSizeSwitch ? 63000000 : 20480000;
        if (!/(doc|xls|pdf|docx|xlsx|ppt|pptx)$/.test(file.name)) {
            window.toast("只支持doc,pdf,xls,ppt文件上传，请重新选择！", 2000);
            options.onError();
            throw new Error("只支持doc,pdf,xls,ppt文件上传，请重新选择!");
        }

        if (file.size > maxSize) {
            window.toast(
                `最大文件不能超过${options.maxSizeSwitch ? "60" : "20"}M!`,
                2000
            );
            options.onError();
            throw new Error(
                `最大文件不能超过${options.maxSizeSwitch ? "60" : "20"}M!`
            );
        }

        // 获取文件类型
        if (file.name) {
            fileType = extname(file.name);
        }

        const client = await getOssClient(getStore, dispatch, "doc");
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
                    return function(done) {
                        if (cpt !== undefined) {
                            checkpoint = cpt;
                            fileName = cpt.name;
                            uploadId = cpt.uploadId;

                            done();
                        }
                    };
                }
            }
        });

        file = null;
        window.loading(false);

        if (result.res.status == 200) {
            window.toast("上传成功");
            return `https://docs.qianliaowang.com/${key}`;
        } else {
            throw new Error("上传失败 ->" + JSON.stringify(result));
        }
    };
}

export function uploadRec(file, folder = "temp", fileType = "wav") {
    return async (dispatch, getStore) => {
        const client = await getOssClient(getStore, dispatch);

        const key = `qlLive/${folder}/${reName()}.${fileType}`;
        let checkpoint, fileName, uploadId;

        window.loading(true);

        const result = await client.multipartUpload(key, file, {
            checkpoint: checkpoint,
            progress: function(p, cpt) {
                return function(done) {
                    if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                    }
                    done();
                };
            }
        });

        file = null;
        window.loading(false);

        if (result.res.status == 200) {
            window.toast("上传成功");
            return `https://media.qlchat.com/${key}`;
        } else {
            throw new Error("上传失败 ->" + JSON.stringify(result));
        }
    };
}

/**
 * 加载oss-sdk.js，不会重复加载
 */
export function insertOssSdk() {
    insertOssSdk.promise =
        insertOssSdk.promise ||
        new Promise((resolve, reject) => {
            if (window.OSS) return resolve();
            const script = document.createElement("script");
            script.src =
                "//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js";
            script.onload = resolve;
            script.onerror = function() {
                insertOssSdk.promise = null;
                script.remove();
                reject(Error("加载oss.sdk失败"));
            };
            document.body.appendChild(script);
        });
    return insertOssSdk.promise;
}

/**
 * 上传图片
 */
export function uploadImage(file, folder = "temp", fileType = ".jpg") {
    return async (dispatch, getStore) => {
        let isImage;
        if (!/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
            window.toast(
                "图片格式只支持jpg|JPG|png|PNG|gif|GIF|bmp，请重新选择！",
                2000
            );
            return;
        } else {
            isImage = true;
        }

        if (file.size > 5242880) {
            window.toast("请选择小于5M的图片文件！", 2000);
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

        window.loading(true);

        const result = await client.multipartUpload(key, resultFile, {
            checkpoint: checkpoint,
            progress: function(p, cpt) {
                return function(done) {
                    if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                    }
                    done();
                };
            }
        });

        file = null;
        window.loading(false);

        if (result.res.status == 200) {
            if (isImage) {
                window.toast("图片上传成功");
            } else {
                window.toast("上传成功");
            }
            return `https://img.qlchat.com/${key}`;
        } else {
            throw new Error("文件上传失败 ->" + JSON.stringify(result));
        }
    };
}

/**
 * 获取上传组件
 */
async function getOssClient(getStore, dispatch, type = "common") {
    if (type === "common" && uploadClient) {
        return uploadClient;
    } else if (type === "doc" && uploadClientDoc) {
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

    let bucket = "ql-res";
    const region = "oss-cn-hangzhou";

    let stsAuth = getStore().common.stsAuth;

    if (!stsAuth) {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/common/getStsAuth"
        });
        dispatch({
            type: SET_STS_AUTH,
            stsAuth: result.data
        });
        stsAuth = getStore().common.stsAuth;
    }

    if (type == "doc") {
        bucket = "qianliao-doc-download-402-301";

        const stsResult = await fetch(
            "/api/wechat/common/getStsAuth?bucketName=" + bucket,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                credentials: "include"
            }
        ).then(res => res.json());

        if (stsResult.state.code == 0) {
            stsAuth = stsResult.data;
        } else {
            console.error("获取sts auth失败！");
        }
    }

    const client = new OSSW({
        region: region,
        accessKeyId: stsAuth.accessKeyId,
        secure: secure,
        accessKeySecret: stsAuth.accessKeySecret,
        stsToken: stsAuth.securityToken,
        bucket: bucket
    });

    if (type === "common") {
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
            url: "/api/wechat/common/getStsAuth"
        });
        dispatch({
            type: SET_STS_AUTH,
            stsAuth: result.data
        });
    };
}

export function initUserInfo(userInfo) {
    return {
        type: USERINFO,
        userInfo
    };
}

export function getUserInfo(userId, topicId) {
    var params = {
        topicId
    };
    if (userId) {
        params.userId = userId;
    }
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/user/info",
            body: params
        });

        dispatch({
            type: USERINFO,
            userInfo: result.data
        });

        return result;
    };
}

/**
 * 20190311
 * post方法getUser，避免缓存
 */
export function getUserInfoP() {
    return (dispatch, getStore) => {
        return request
            .post({
                url: "/api/wechat/transfer/h5/user/get"
            })
            .then(res => {
                const userInfo = res.data.user
                dispatch({
                    type: UPDATE_USERINFO,
                    userInfo 
                });
                return userInfo;
            })
            .catch(err => {});
    };
}

/**
 * 获取关注二维码(基础版)
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */
export function getFollowQr({
    channelCode = 204,
    channelId = "",
    liveId,
    topicId = "",
    isBindThird,
    isFocusThree,
    subscribe,
    isShowQl = true,
    showLoading = false,
    isFirstMsg = false,
    isLiveAdmin = "Y",
    //三方白名单
    isWhite = "N"
}) {
    return async (dispatch, getStore) => {
        // 如果是三方白名单，直接返回
        if (isWhite === "Y") {
            return false;
        }

        let showQl = "N";
        let channel = "101";
        // 是否首页和推荐页进来
        const isRecommend = /.*(recommend|subscribe\-period\-time).*/.test(
            sessionStorage.getItem("trace_page")
        );

        // 先判断是否关注千聊
        if (!subscribe && isShowQl) {
            showQl = "Y";
            channel = channelCode;
        }

        // 在判断是否关注第三方，优先第三方
        if (isBindThird && !isFocusThree) {
            showQl = "N";
            channel = 101;
        }

        // 从首页和推荐页或者三方进来，只获取千聊
        if (isRecommend) {
            channel = channelCode;
            showQl = "Y";
        }

        // 如果是专业版并且不是从三方进来
        if (isLiveAdmin === "Y") {
            // 有公众号并且未关注公众号则获取三方二维码
            if (isBindThird && !isFocusThree) {
                showQl = "N";
            }
            // 否则不获取二维码直接返回
            else {
                return false;
            }
        }
        // 如果即关注了千聊又关注了第三方就直接返回
        else {
            if (isRecommend) {
                if (subscribe) {
                    return false;
                }
            } else {
                if (
                    (subscribe && !isBindThird) ||
                    (subscribe && isBindThird && isFocusThree && isShowQl) ||
                    (isBindThird && isFocusThree && !isShowQl)
                ) {
                    return false;
                }
            }
        }

        let result = await dispatch(
            getQr({ channel, channelId, liveId, topicId, showQl, showLoading })
        );
        if (isFirstMsg && result && result.state.code == 0) {
            dispatch({
                type: FIRST_MSG_CODE,
                url: result.data.qrUrl
            });
        }

        return result;
    };
}

/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */
export function getQr({
    channel,
    channelId,
    liveId,
    toUserId = "",
    topicId,
    showQl,
    showLoading = false,
    ...others
}) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading,
            url: "/api/wechat/get-qrcode",
            body: {
                channel,
                channelId,
                liveId,
                toUserId,
                topicId,
                showQl,
                ...others
            }
        });
    };
}

/**
 * 根据话题获取千聊二维码
 *
 * @param {string} topicId
 * @returns
 */
export function getTopicQr(topicId, showQl) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/get-topic-qrcode",
            body: {
                topicId,
                showQl
            }
        });
    };
}


/**
 *  优化支付接口调用
 *  
 *  下单接口包含的参数：
 *  missionId,liveId,channelId,campId,topicId,userId,toUserId,
 *  channelNo,total_fee,totalCount,type,payType,chargeConfigId,
 *  docId,giftCount,ifboth,isWall,questionId,questionPerson,
 *  relayInviteId,shareKey,groupId,source,toRelayLiveId,couponId,
 *  couponType,ch,isFromWechatCouponPage,officialKey,description,
 *  redEnvelopeId,psKey,psCh,inviteMemberId
 * 
 */
export function doPay(params) {
    
    return async (dispatch, getStore) => {
        let {
            total_fee = 0,
            channelNo = "qldefault",
            // 是否需要2种支付方式
            // ifboth = Detect.os.phone ? "Y" : "N",
            ifboth = (Detect.os.weixin && (Detect.os.android || Detect.os.ios)) ? "Y" : "N",
            source = "web",

            // 默认下单URL
            url = "/api/wechat/make-order",
            // 以下是回调
            callback = () => {},
            onPayFree = () => {},
            onCancel = () => {}
        } = params;
        
        // 删除不用传递的参数
        let bodys = params;
        delete(bodys.url)
        delete(bodys.callback)
        delete(bodys.onPayFree)
        delete (bodys.onCancel)
        
        bodys = {
            channelNo,
            ...bodys,
            total_fee: (total_fee * 100).toFixed(0),
            source,
            ifboth,
            
        }


        // 判断知否支付中
        if (inPay) {
            return false;
        }
        inPay = true;

        console.log("开始支付啦！！！！！！！");

        const res = await api({
            dispatch,
            getStore,
            showWarningTips: false,
            method: "POST",
            url: url,
            body: bodys,
            errorResolve:true
        });

        // 恢复可支付状态
        inPay = false;

        if (res.state.code == 0) {
            window._qla && _qla('event', {
                category: 'wechatPay',
                action:'start',
            });
            const order = res.data.orderResult;
            // 只有在安卓和ios下才能吊起微信支付
            console.log(order, "order=======");
            if (!(Detect.os.weixin && (Detect.os.android || Detect.os.ios))) {
                dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                selectPayResult(order.qcodeId, () => {
                    typeof callback == "function" && callback(order.qcodeId);
                    dispatch(togglePayDialog(false));
                });
            } else {
                const onBridgeReady = data => {
                    console.log(data, 'data')
                    WeixinJSBridge.invoke(
                        "getBrandWCPayRequest",
                        {
                            appId: data.appId,
                            timeStamp: data.timeStamp,
                            nonceStr: data.nonceStr,
                            package: data.packageValue,
                            signType: data.signType,
                            paySign: data.paySign
                        },
                        result => {
                            console.log(
                                "调起支付支付回调 == ",
                                JSON.stringify(result)
                            );

                            if (
                                result.err_msg == "get_brand_wcpay_request:ok"
                            ) {
                                selectPayResult(order.orderId, () => {
                                    typeof callback == "function" &&
                                        callback(order.orderId);
                                });
                            } else if (
                                result.err_msg == "get_brand_wcpay_request:fail"
                            ) {
                                dispatch(
                                    togglePayDialog(
                                        true,
                                        order.qcodeId,
                                        order.qcodeUrl
                                    )
                                );
                                selectPayResult(order.qcodeId, () => {
                                    dispatch(togglePayDialog(false));
                                    typeof callback == "function" &&
                                        callback(order.qcodeId);
                                });
                            } else if (
                                result.err_msg ==
                                "get_brand_wcpay_request:cancel"
                            ) {
                                window.toast("已取消付费");
                                onCancel && onCancel();
                                window._qla && _qla('event', {
                                    category: 'wechatPay',
                                    action:'fail',
                                });
                            }
                        }
                    );
                };

                // 监听付款回调
                if (typeof window.WeixinJSBridge === "undefined") {
                    console.log('回调1')
                    document.addEventListener(
                        "WeixinJSBridgeReady",
                        onBridgeReady,
                        false
                    );
                } else {
                    console.log('回调2')
                    onBridgeReady(order);
                }
            }
        } else if (res.state.code == 20012) {
            onPayFree && onPayFree(res);
        } else {
            if (res.state && res.state.msg) {
                window.toast(res.state.msg);
            }
            return res;
        }
    };
}




export function selectPayResult(orderId, done) {
    if (!window.selectPayResultCount) {
        window.selectPayResultCount = 1;
    }

    console.log("支付回调次数 ==== ", window.selectPayResultCount);

    fetch("/api/wechat/selectResult?orderId=" + orderId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        credentials: "include"
    })
        .then(res => res.json())
        .then(json => {
            console.log("支付回调 == ", JSON.stringify(json));

            if (json.state.code == 0) {
                window.selectPayResultCount = 1;
                done();

                window._qla && _qla('event', {
                    category: 'commonWechatPay',
                    action:'success',
                });
            } else {
                window.payDialogTimer = setTimeout(() => {
                    if (window.selectPayResultCount < 40) {
                        window.selectPayResultCount += 1;
                        selectPayResult(orderId, done);
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
        qcodeUrl
    };
}

// 手动关闭支付二维码弹框
export function cancelPayDialog() {
    if(window.payDialogTimer){
        clearTimeout(window.payDialogTimer);
    }
    window.selectPayResultCount = 1;
    window._qla && _qla('event', {
        category: 'wechatPay',
        action:'fail',
    });
    return async (dispatch, getStore) => {
        dispatch(togglePayDialog(false))
    };
}

// 获取系统时间
export function getSysTime() {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: "/api/base/sys-time",
            method: "GET",
            showLoading: false,
            body: {}
        });

        return result;
    };
}

export function getServerTime() {
    return request({
        url: "/api/base/sys-time"
    })
        .then(res => {
            if (res.state.code) throw Error(res.state.msg);
            return res.data.sysTime;
        })
        .catch(err => {
            return Date.now();
        });
}

export function fetchAndUpdateSysTime() {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: "/api/base/sys-time",
            method: "GET",
            showLoading: false,
            body: {}
        });
        dispatch({
            type: SYSTIME,
            sysTime: result.data.sysTime
        });
        return result;
    };
}

// 请求封装
export function api({
    dispatch = () => {},
    getStore = () => {},
    url,
    method = "GET",
    body = {},
    showWarningTips = true,
    showLoading = true,
    errorResolve = false
}) {
    return new Promise((resolve, reject) => {
        !!showLoading && dispatch(loading(true));

        url = method === "GET" ? `${url}?${encode(body)}` : url;

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            credentials: "include",
            body: method === "POST" ? JSON.stringify(body) : null
        })
            .then(res => res.json())
            .then(json => {
                !!showLoading && dispatch(loading(false));
                // console.log(json);

                if (!json.state || (!json.state.code && json.state.code != 0)) {
                    console.error("错误的返回格式");
                }

                switch (json.state.code) {
                    case 0:
                        resolve(json);
                        break;

                    case 110:
                        if (json.data && json.data.url) {
                            let redirect_url = window.location.href;
                            window.location.replace(
                                "/api/wx/login?redirect_url=" +
                                    encodeURIComponent(redirect_url)
                            );
                        }
                        break;

                    case 20001:
                        reject(json);
                        break;

                    case 10001:
                        resolve(json);
                        break;

                    case 20005:
                        // 未登录
                        break;

                    case 50004:
                        // 该CODE已被使用
                        resolve(json);
                        break;

                    case 20012:
                        // 免费支付
                        resolve(json);
                        break;

                    case 50005:
                        // 已经是管理员
                        resolve(json);
                        break;

                    default:
                        if (errorResolve) {
                            resolve(json);
                        }
                        showWarningTips && window.toast(json.state.msg);
                        break;
                }
            })
            .catch(err => {
                console.error(err);
                if (errorResolve) {
                    resolve(err);
                }
                !!showLoading && dispatch(loading(false));
            });
    });
}

export function getCreateLiveStatus(topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/user/getCreateLiveStatus",
            body: {
                topicId
            }
        });

        return result;
    };
}

export function isLiveAdmin(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/studio/is-live-admin",
            body: {
                liveId
            }
        });

        return result;
    };
}

/* 获取是否三方白名单 */
export function isThirdPartyWhite(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/thirdParty/isWhite",
            body: params
        });

        return result;
    };
}

/* 官方课代表绑定临时关系 */
export function bindOfficialKey(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/coral/bindUserRef",
            body: params
        });

        return result;
    };
}
/**
 * 绑定直播间分销关系
 * @return {[type]} [description]
 */
export function bindLiveShare(liveId, shareKey) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/channel/bind-live-share",
            body: {
                liveId,
                shareKey
            }
        });

        return result;
    };
}

/* 获取官方课代表身份 */
export function getMyCoralIdentity(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/coral/getMyIdentity",
            body: params
        });

        return result;
    };
}

/**
 * 获取课程支付后跳转链接
 * @param {*} param0 {
 *  businessId: 系列课/话题Id
 *  type: channel/topic
 * }
 */
export function getCousePayPaster({ businessId, type }) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/getCousePayPaster",
            body: {
                businessId,
                type
            }
        });
    };
}

/**
 * 获取官方直播间列表
 */
export function getOfficialLiveIds() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/live/authorities",
            body: {}
        });

        if (result.state.code == 0) {
            dispatch({
                type: GET_OFFICIAL_LIVE_IDS,
                data: result.data
            });

            return result;
        }
    };
}

/**
 * 根据接口地址及参数构造本地缓存唯一健值
 * @param  {Object} opt                 request请求的option对象
 *   opt.cacheWithoutKeys    不作缓存健值生成策略参考的参数key的列表
 * @return {String}             请求的唯一标识字符串
 */
function getCacheKeyString(opt) {
    let cacheWithoutKeys = opt.cacheWithoutKeys || [],
        pairs = [];

    for (var key in opt.body) {
        var value = opt.body[key];
        if (cacheWithoutKeys.indexOf(key) < 0) {
            pairs.push(key + "=" + JSON.stringify(value));
        }
    }

    return `_request_data_${opt.url}?${pairs.join("&")}&${(
        opt.method || ""
    ).toLowerCase()}`;
}

export function request({
    url,
    method = "GET",
    body = {},
    throwWhenInvalid = false, // 请求错误或状态码不等于0时抛错
    memoryCache = false, // 使用内存缓存，会把fetch返回的Promise存着，刷新浏览器就会清掉
    sessionCache = false, // 使用sessionStorage缓存
    localCache = false, // 使用localStorage缓存：boolean | number
    refreshCache = false, // 刷新缓存
    signal = undefined // 用于中断请求
}) {
    let cacheKey = getCacheKeyString({
        url,
        method,
        body,
    });

    if (refreshCache) {
        // 暂时没有清空的需要，以后有再加
    } else {
        if(memoryCache){
            if(request.memoryCache[cacheKey]){
                return request.memoryCache[cacheKey];
            }
        }else if (sessionCache) {
            try {
                const data = JSON.parse(sessionStorage.getItem(cacheKey));
                if (data) {
                    return Promise.resolve(data);
                }
            } catch (e) {}
        } else if(localCache) {
            const data = getLocalStorage(cacheKey);
            if (data) {
                return Promise.resolve(data);
            }
        }
    }

    url = method === "GET" ? `${url}?${encode(body)}` : url;

    const fetchRes = fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        credentials: "include",
        body: method === "POST" ? JSON.stringify(body) : null,
        signal
    }).then(async res => {
        let resultText = await res.text();
        let resultJson = null;

        try {
            resultJson = JSON.parse(resultText);
        } catch (error) {
            console.warn("返回的格式不是json格式 --- ", resultText);
            if (throwWhenInvalid) {
                throw new Error("服务器返回错误");
            }
            return resultText;
        }
        switch (getVal(resultJson, "state.code")) {
            case 0:
                // code等于0时保存缓存
                if (sessionCache) {
                    try {
                        sessionStorage.setItem(
                            cacheKey,
                            JSON.stringify(resultJson)
                        );
                    } catch (e) {}
                } else if (localCache && isResponseCanCache(resultJson)) {
                    setLocalStorage(
                        cacheKey,
                        resultJson,
                        typeof localCache === "number" ? localCache : false
                    );
                }
                break;

            case 110:
                if (resultJson.data && resultJson.data.url) {
                    let redirect_url = window.location.href;
                    window.location.replace(
                        "/api/wx/login?redirect_url=" +
                        encodeURIComponent(redirect_url)
                    );
                }
                return false;
            default:
                if (throwWhenInvalid) {
                    throw new Error(
                        typeof resultJson === "string"
                            ? "服务器返回错误"
                            : resultJson.state.msg
                    );
                }
        }

        return resultJson;
    });

    if(memoryCache){
        // 如果使用内存缓存，把fetch返回的Promise存起来
        request.memoryCache[cacheKey] = fetchRes;
    }

    return fetchRes;
}

request.memoryCache = {};


request.post = function (options) {
    return request({
        method: "POST",
        throwWhenInvalid: true,
        ...options
    });
};

request.get = function(options) {
    return request({
        method: "GET",
        throwWhenInvalid: true,
        ...options
    });
};

function isResponseCanCache(json) {
    // 状态异常不缓存
    if (!json || !json.state || json.state.code != 0) {
        return false;
    }

    let data = json.data;

    if ("object" === typeof data) {
        if (!Object.keys(data).length) {
            return false;
        }
    }

    return true;
}

/**
 * 开放平台用户绑定
 *
 * @export
 * @param {any} params
 * @returns
 */
export function userBindKaiFang(params) {
    return async (dispatch, getStore) => {
        const result = await request({
            url: "/api/wechat/live/userBindKaiFang",
            body: params,
            method: "POST"
        });

        return result;
    };
}

/* 获取独立域名 */
export function getDomainUrl(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: "/api/wechat/getDomainUrl",
            body: params
        });

        return result;
    };
}

/**
 * 获取是否服务号白名单
 * @param {string} liveId 直播间ID
 */
export function isServiceWhiteLive(liveId) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            method: "GET",
            showLoading: false,
            url: "/api/wechat/live/isServiceWhiteLive",
            body: {
                liveId
            }
        });
    };
}

/**
 * 获取官方直播间列表
 * @param {string} liveId 直播间ID
 */
export function getQlLiveIds() {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            method: "GET",
            showLoading: false,
            url: "/api/wechat/live/getQlLiveIds",
            body: {}
        });
    };
}

/**
 * 初始化AppopenId
 * @param {string} appOpenId
 */
export function initAppOpenId(appOpenId) {
    return {
        type: INIT_APP_OPENID,
        appOpenId
    };
}

/**
 * 获取是否购买了vip会员可以访问该课程
 * @param type topic | channel
 */
export function userIsOrNotCustomVip(liveId, businessId) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: "/api/wechat/vip/userIsOrNotCustomVip",
            method: "POST",
            showLoading: false,
            isErrorReject: true,
            body: {
                liveId,
                businessId
            }
        });
    };
}
/**
 * 初始化订阅状态
 * @param {string} liveId 直播间ID
 * @param {string} auditStatus 第三方带过来的参数
 */
export function subscribeStatus(liveId, auditStatus) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: "/api/wechat/channel/live-focus",
            method: "GET",
            showLoading: false,
            body: {
                status: "Y",
                liveId,
                auditStatus
            }
        });
    };
}

// 是否关注直播间
export function isFollow(liveId) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: "/api/wechat/live/is-follow",
            method: "POST",
            showLoading: false,
            body: {
                liveId
            }
        });
    };
}

/**
 * 获取课程支付后跳转链接
 * @param {*} param0 {
 *  businessId: 系列课/话题Id
 *  type: channel/topic
 * }
 */
export function ifGetCousePayPasterLink({ businessId, type }) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/getCousePayPaster",
            body: {
                businessId,
                type
            }
        });

        if (result.state.code === 0 && result.data && result.data.link) {
            return result.data.link
        } else {
            return false;
        }
    };
}


async function handleBackgroundConf(channel, liveId, options) {
    // 是否有后台配置
    const result = await api({
        url: "/api/wechat/live/getOpsAppIdSwitchConf",
        method: "GET",
        body: {
            channel,
            liveId
        }
    });
    const resultData = result.data || {};
    if (resultData.isHasConf === "Y") {
        let qlLiveId = "";
        // 获取appId列表
        let appIdList = [];
        // 获取liveid列表
        let liveIdList = [];
        resultData.appBindLiveInfo.forEach(item => {
            if (item.isQlAppId == "Y") {
                qlLiveId = item.bindLiveId;
            }

            appIdList.push(item.appId);
            liveIdList.push(item.bindLiveId);
        });
        let appId = "";
        const res = await getIsSubscribe(liveIdList);
        const liveIdListResult = res.data.liveIdListResult;
        const liveIdObj = liveIdListResult.find((item, index) => {
            if (item.liveId == qlLiveId) {
                if (!item.isShowQl && !item.subscribe) {
                    appId = appIdList[index];
                    return true;
                }
            } else if (!item.isFocusThree) {
                appId = appIdList[index];
                return true;
            }
        });
        // 如果有未关注的三方导粉公众号
        if (liveIdObj != undefined) {
            const qrObj = await api({
                url: "/api/wechat/live/get-qr",
                method: "GET",
                body: {
                    ...options,
                    liveId,
                    appId,
                    channel,
                    showQl: "N"
                }
            });
            if (qrObj && qrObj.state.code === 0) {
                return qrObj.data;
            }
        }
    }
    return false;
}

/**
 * 支付报名成功后引导关注千聊
 * 1、首先判断是否为白名单，是白名单的再判断是否绑定三方，没绑定就不弹任何公众号，绑定的话就只弹三方。
 * 2、不是白名单的去判断是否是（千聊课程&&直播中心来源），是的话只弹千聊，不是的话先弹千聊，再去查配置。
 * 3、查配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程，有未关注的直接引导关注当前第一个未关注的配置公众号。
 * 4、必传参数为channel和liveId
 */
export async function subAterSign(
    channel,
    liveId,
    options = {
        channelId: undefined,
        topicId: undefined,
        toUserId: "",
        campId: "",
        communityCode: "",
        isCampAndHasPeriod: false,
        campLiveId: ""
    }
) {
    console.log("开始subater");

    // 是否配置链接，有就直接跳走
    await ifGetCousePayPasterLink({
        businessId: options.channelId ? options.channelId : options.topicId,
        type: options.channelId ? "channel" : "topic"
    });

    // 如果是训练营，则推送的channel为campAuth;
    if (options.isNewCamp) {
        channel = 'campAuth';
        options.pubBusinessId = options.channelId;
    }

    // 新训练营(如果是直播中心来源或者官方直播间)优先逻辑
    if (options.isNewCamp && ( options.isOfficialLive || isFromLiveCenter())) {
        return getCampQrcode(options)
    }

    //来自直播中心直接走后台配置
    if (isFromLiveCenter()) {
        return await handleBackgroundConf(channel, liveId, options);
    }

    const isWhite = await isServerWhite({
        liveId
    });

    const subscribeData = await fetchSubscribeStatus({ liveId });
    let isBindThird = convertType(
        getVal(subscribeData, "data.isBindThird", "N")
    );
    let isFocusThree = convertType(
        getVal(subscribeData, "data.isFocusThree", "N")
    );
    let isSubscribe = getVal(subscribeData, "data.subscribe", false);

    console.log(`
        白名单：${isWhite && isWhite.data.isWhite === "Y"}
        对接三方: ${isBindThird}
        关注三方: ${isFocusThree}
        关注大号: ${isSubscribe}
    `);

    // 首先判断是否是白名单，是白名单的话只弹出三方的码
    if (isWhite && isWhite.data.isWhite === "Y") {
        // 是否对接三方服务号
        if (isBindThird == "Y") {
            if (isFocusThree == "N") {
                let qr = await onlyThird(isFocusThree, {
                    ...options,
                    liveId,
                    channel,
                    subscribe: isSubscribe
                });
                return { qrUrl: qr && qr.url, appId: qr && qr.appId };
            } else {
                return false;
            }
        } else if (options.isNewCamp) {
            // 如果是训练营
            return getCampQrcode(options)
        } else {
            return false;
        }
    }

    const isLiveAdmin = await getLiveAdmin(liveId);
    if (isLiveAdmin == "Y"&&options.isNewCamp) {
        if (isBindThird == "Y") {
            if (isFocusThree == "N") {
                let qr = await onlyThird(isFocusThree, {
                    ...options,
                    liveId,
                    channel,
                    subscribe: isSubscribe
                });
                return { qrUrl: qr && qr.url, appId: qr && qr.appId };
            }else if (options.isNewCamp) {
                // 如果是训练营
                return getCampQrcode(options)
            }
        }else if (options.isNewCamp) {
            // 如果是训练营
            return getCampQrcode(options)
        }
        return await handleBackgroundConf(channel, liveId, options);
    } else {
        if (options.isNewCamp) {
            /**
             * 1.不是专业版
             * 2.如果是训练营且没关注
             */
            let qurl = await getCampQrcode(options);
            if (qurl) {
                return qurl;
            }
        }
        //非专业版优先走后台配置逻辑
        const backgroundConf = await handleBackgroundConf(
            channel,
            liveId,
            options
        );
        if (backgroundConf) return backgroundConf;
        if (isBindThird == "Y") {
            if (isFocusThree == "N") {
                let qr = await onlyThird(isFocusThree, {
                    ...options,
                    liveId,
                    channel,
                    subscribe: isSubscribe
                });
                return { qrUrl: qr && qr.url, appId: qr && qr.appId };
            }
            return false;
        }
    }
}


/**
 * 判断是否关注训练营公众号且返回二维码
 * 训练营公众号固定为某个直播间的三方公众号，所以通过三方公众号接口判断是否关注和请求二维码
 * 
 * @param {*} options
 * @returns
 */
async function getCampQrcode(options){
    const campSubscribeData = await fetchSubscribeStatus({
        liveId: options.campLiveId
    });
    let campIsFocusThree = convertType(
        getVal(campSubscribeData, "data.isFocusThree", "N")
    );

    if (campIsFocusThree === "N") {
        console.log("新训练营，没有关注三方号");
        const qrUrl = await api({
            url: "/api/wechat/live/get-qr",
            method: "GET",
            body: {
                pubBusinessId: options.channelId,
                liveId: options.campLiveId,
                channel: "campAuth",
                showQl: "N"
            }
        });
        if (qrUrl && qrUrl.state.code === 0) {
            return qrUrl.data;
        }
    } else {
        return false;
    }
}

async function getLiveAdmin(liveId) {
    const result = await apiService.post({
        url: "/h5/live/admin/admin-flag",
        body: {
            liveId
        }
    });
    if (result.state.code == 0) {
        return result.data && result.data.isLiveAdmin;
    } else {
        return "N";
    }
}

export async function getIsQlCourseFocus() {
    try {
        let result = await api({
            url: "/api/wechat/h5/live/getAppIdByType",
            method: "POST",
            body: {
                type: "ql_course"
            }
        });
        if (result.state.code == 0) {
            return result.data;
        }
        return;
    } catch (error) {
        console.error(error);
        return;
    }
}

/**
 * 三方导粉公众号获取二维码
 * @param {object} 参数对象（包括liveId, channel, subscribe等参数）
 * @param {boolean} isIrregular (是否是非常规流程，常规流程在查了配置之后需要判断时候关注千聊，未关注的话需要弹千聊的二维码)
 */
export async function tripartiteLeadPowder(options) {
    const settings = {
        localStrogeName: "__TRIPARTITE_LEAD_POWER",
        ...options
    };
    const result = await api({
        url: "/api/wechat/live/getOpsAppIdSwitchConf",
        method: "GET",
        body: {
            channel: options.channel,
            liveId: options.liveId
        }
    });

    const resultData = result.data;
    // 关注后再次弹码的间隔时间(毫秒)
    const expireTime = await getOpsAppIdSwitchTimeStep();
    const nowTime = new Date().getTime();

    // 如果有配置三方导粉公众号
    if (resultData.isHasConf === "Y") {
        let qlLiveId = "";
        // 获取appId列表
        let appIdList = [];
        // 获取liveid列表
        let liveIdList = [];
        resultData.appBindLiveInfo.forEach(item => {
            if (item.isQlAppId == "Y") {
                qlLiveId = item.bindLiveId;
            }

            appIdList.push(item.appId);
            liveIdList.push(item.bindLiveId);
        });
        // resultData.appBindLiveInfo.map((item)=>{liveIdList.push(item.bindLiveId)})

        let appId = "";
        const res = await getIsSubscribe(liveIdList);

        const liveIdListResult = res.data.liveIdListResult;
        const liveIdObj = liveIdListResult.find((item, index) => {
            if (item.liveId == qlLiveId) {
                if (!item.isShowQl && !item.subscribe) {
                    appId = appIdList[index];
                    return true;
                }
            } else if (!item.isFocusThree) {
                appId = appIdList[index];
                return true;
            }
        });
        // 如果有未关注的三方导粉公众号
        if (liveIdObj != undefined) {
            const local = JSON.parse(
                localStorage.getItem(settings.localStrogeName)
            );
            // 有三方导粉公众号绑定的liveId二维码弹出条件
            // 1、从未关注过有三方导粉公众号绑定的liveId二维码
            // 2、同一个二维码未被关注
            // 3、不同二维码需在前一个二维码被关注起指定时间后才弹出（具体时间由后台配置返回）
            if (
                local === null ||
                (local && local.liveId === liveIdObj.liveId) ||
                (local &&
                    nowTime - local.lastTime > expireTime &&
                    local.liveId !== liveIdObj.liveId)
            ) {
                localStorage.setItem(
                    settings.localStrogeName,
                    JSON.stringify({
                        liveId: liveIdObj.liveId,
                        lastTime: nowTime
                    })
                );
                const qrObj = await api({
                    url: "/api/wechat/live/get-qr",
                    method: "GET",
                    body: {
                        ...settings,
                        liveId: options.liveId,
                        appId,
                        channel: options.channel,
                        showQl: "N"
                    }
                });
                return {
                    appId: appId || getVal(qrObj, "data.appId") || '',
                    url: getVal(qrObj, "data.qrUrl")
                };
            }
        }
    }

    // 有配置则优先读取配置，没配置或者配置的都关注完了,并且未关注千聊的则弹千聊二维码
    const local = JSON.parse(localStorage.getItem(settings.localStrogeName));
    // 不同二维码需在前一个二维码被关注起指定时间后才弹出（具体时间由后台配置返回）
    if (local === null || (local && nowTime - local.lastTime > expireTime)) {
        // 如果未关注千聊
        if (options.subscribe == "N") {
            const qrObj = await api({
                url: "/api/wechat/live/get-qr",
                method: "GET",
                body: {
                    ...settings,
                    liveId: options.liveId,
                    channel: options.channel,
                    showQl: "Y"
                }
            });
            return {
                appId: "wx6b010e5ae2edae95",
                url: getVal(qrObj, "data.qrUrl")
            };
        }
    }
}

function convertType (param) {
    if (typeof param === "boolean") {
        param = param ? "Y" : "N";
    }

    return param;
};

/**
 * 传入用户和直播间状态，获取应该显示的二维码，如果获取到的是false，那么就不用显示二维码
 * @param {*} 参数对象
 *
 */
export async function whatQrcodeShouldIGet({
    isWhite, //是否是白名单
    isLiveAdmin, //是否是专业版
    isOfficialLive, //是否是官方直播间
    isBindThird, //是否绑定三方（必传）
    isFocusThree, //是否关注三方（必传）
    isQlCourseUser = "N", //是否千聊课程用户
    isRecommend, //是否是从推荐首页直接进来
    options = { liveId, topicId, channelId, subscribe, channel } //options中的liveId, subscribe, channel也是必传的
}) {
    // 是否直播中心类型
    if (isFromLiveCenter()) {
        return await tripartiteLeadPowder(options);
    }

    // 增加配置（isWhite, isLiveAdmin, isOfficialLive 三个参数有些页面不一定有，可以统一获取）
    if (
        isWhite === undefined ||
        isLiveAdmin === undefined ||
        isOfficialLive === undefined
    ) {
        const config = await getAllConfig({ liveId: options.liveId });
        isWhite = config.data.isWhite;
        isLiveAdmin = config.data.isLiveAdmin;
        isOfficialLive = config.data.isOfficialLive;
    }

    if (options.topicId || options.channelId) {
        const existData = await getIsQlCourseUser({
            businessId: options.topicId || options.channelId,
            businessType: options.topicId ? "TOPIC" : "CHANNEL"
        });

        isQlCourseUser = existData.data.status;
    }

    isWhite = convertType(isWhite);
    isLiveAdmin = convertType(isLiveAdmin);
    isOfficialLive = convertType(isOfficialLive);
    isBindThird = convertType(isBindThird);
    isFocusThree = convertType(isFocusThree);
    isRecommend = convertType(isRecommend);
    isQlCourseUser = convertType(isQlCourseUser);
    options.subscribe = convertType(options.subscribe);

    console.log(`
        isWhite: ${isWhite},
        isLiveAdmin: ${isLiveAdmin},
        isOfficialLive: ${isOfficialLive},
        isBindThird: ${isBindThird},
        isFocusThree: ${isFocusThree},
        isRecommend: ${isRecommend},
        subscribe: ${options.subscribe},
        isQlCourseUser: ${isQlCourseUser}
    `);

    if (isWhite == "Y") {
        if (isBindThird == "Y") {
            // #1
            if (isFocusThree == "N") {
                return await onlyThird(isFocusThree, options);
            } else {
                return false;
            }
        } else {
            // #2
            return false;
        }
    } else {
        let isLiveAdmin = await getLiveAdmin(options.liveId);
        if (isLiveAdmin == "Y") {
            if (isBindThird == "Y") {
                // #5
                if (/101|202|204|209|210/.test(options.channel)) { // 导粉逻辑 5.1 针对这五个触点 修改三方和后台配置的顺序 2019/11/30
                    return ((await thirdFirst(isFocusThree, options)) || (await tripartiteLeadPowder(options)))
                } else {
                    return (
                        (await tripartiteLeadPowder(options)) ||
                        (await thirdFirst(isFocusThree, options)) 
                    );
                }
            } else {
                // #6
                return await tripartiteLeadPowder(options);
            }
        } else {
            if (/101|202|204|209|210/.test(options.channel)) {
                if (isBindThird == "Y") return ((await thirdFirst(isFocusThree, options)) || (await tripartiteLeadPowder(options)))
                else return await tripartiteLeadPowder(options);
            }
            const backgroundConf = await tripartiteLeadPowder(options);
            if (backgroundConf) return backgroundConf;
            if (isBindThird == "Y") return await thirdFirst(isFocusThree, options);
            return false;
        }
    }
}

async function thirdFirst(isFocusThree, options) {
    if (isFocusThree == "Y") {
        return await tripartiteLeadPowder(options);
    } else {
        return await onlyThird("N", options);
    }
}

/**
 * @param {boolean} save 是否需要存缓存做标记
 */
async function onlyThird(isFocusThree, options) {
    if (isFocusThree == "N") {
        const qrObj = await api({
            url: "/api/wechat/live/get-qr",
            method: "GET",
            body: {
                showQl: "N",
                ...options
            }
        });

        if (getVal(qrObj, "state.code") == 0) {
            // 需要存缓存
            const nowTime = new Date().getTime();
            // const expireTime = await getOpsAppIdSwitchTimeStep();
            // const local = JSON.parse(localStorage.getItem('_TRIPARTITE_LEAD_POWER'))
            // if((local === null) || (local && local.liveId === options.liveId) || (local && nowTime - local.lastTime > expireTime && local.liveId !== options.liveId)){
            // 每次请求都存储当前时间作为是否关注公众号的标志
            localStorage.setItem(
                "__TRIPARTITE_LEAD_POWER",
                JSON.stringify({
                    liveId: options.liveId,
                    lastTime: nowTime
                })
            );
            return {
                appId: getVal(qrObj, "data.appId") || '',
                url: getVal(qrObj, "data.qrUrl")
            };
        } else {
            return false;
        }
    }
}

// 获取三方导粉间隔时间
async function getOpsAppIdSwitchTimeStep() {
    const result = await api({
        showLoading: false,
        url: "/api/wechat/live/getOpsAppIdSwitchTimeStep",
        body: {}
    });
    return result.data.subTimeStep;
}
/**
 * 增加配置（isWhite, isLiveAdmin, isOfficialLive 三个参数有些页面不一定有，可以统一获取）
 * @param object params 目前传liveId就可以
 */
export function getAllConfig(params){
    return request({
        url: '/api/wechat/getLiveStudioTypes',
        memoryCache: true,
        method: 'GET',
        body: params
    });
}
export function getLiveStudioTypes(params){
    return getAllConfig(params)
}

/**
 * 是否千聊课程用户
 * @param object params 目前传liveId就可以
 */
export function getIsQlCourseUser(params) {
    return api({
        url: "/api/wechat/live/center/exist",
        method: "POST",
        body: params
    });
}

/**
 * 判断是否关注
 * isShowQl, subscribe, isFocusThree, isBindThird
 * @param {*} param0
 */
export function fetchSubscribeStatus({ liveId }) {
    return api({
        url: "/api/wechat/common/isSubscribe",
        method: "GET",
        body: {
            liveId
        }
    });
}

/**
 * 是否是服务号白名单
 */
export function isServerWhite(params) {
    return api({
        url: "/api/wechat/live/isServiceWhiteLive",
        method: "GET",
        body: params
    });
}
/**
 * 获取一批直播间ID列表的关注状态
 * @param {Array<Number>} liveIdList 直播间ID列表
 */
export function getIsSubscribe(liveIdList) {
    let body = {};
    // 列表的时候就传liveidList
    if (Array.isArray(liveIdList)) {
        body.liveIdList = liveIdList.join(",");
        // 字符串的时候传单个liveId
    } else if (typeof liveIdList === "string") {
        body.liveId = liveIdList;
    }
    return api({
        url: "/api/wechat/user/is-subscribe",
        method: "GET",
        body
    });
}

/** 获取标签对应的直播间id，嘛 反正就是获取到这个直播间ID然后就当千聊福利社的ID用了 */
export function getFocusLiveId(liveId) {
    return api({
        url: "/api/wechat/getLiveTagOfficialLiveId",
        method: "GET",
        body: {
            liveId
        }
    });
}

/**
 * 绑定直播间分销关系
 * @param  {[type]} liveId    [description]
 * @param  {[type]} lshareKey [description]
 * @return {[type]}           [description]
 */
export function bindShareKey(liveId, lshareKey) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: "POST",
            url: "/api/wechat/topic/bind-share-key",
            body: {
                liveId,
                shareKey: lshareKey
            }
        });
    };
}

// 老用户迎新活动时间获取
export function getActiveTime() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/activity/old-belt-new/getActiveTime",
            body: {}
        });

        return result;
    };
}

// 获取话题信息
export function getTopicInfo(topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/getInfo',
            method: 'GET',
            showLoading: true,
            body: {
                topicId
            }
        });

        return result;
    };
};

export function getUserTopicRole(topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: "POST",
            url: "/api/wechat/topic/getUserTopicRole",
            body: { topicId }
        });

        return result;
    };
}

export function getTopicRoleList(liveId, topicId) {
    return request({
        url: "/api/wechat/topic/getRoleList",
        method: "POST",
        body: {
            liveId,
            topicId
        }
    });
}

// 请好友免费听检验分享状态
export async function checkShareStatus(params) {
    return await api({
        url: "/api/wechat/inviteFriendsToListen/checkShareStatus",
        method: "POST",
        body: params,
        showWarningTips: false,
        errorResolve: true
    });
}

// 获取当前请好友免费听的分享id
export async function fetchShareRecord(params) {
    return await api({
        url: "/api/wechat/inviteFriendsToListen/fetchShareRecord",
        method: "POST",
        body: params
    });
}

// 获取当前请好友免费听的已领信息
export async function getReceiveInfo(params) {
    return await api({
        url: "/api/wechat/inviteFriendsToListen/getReceiveInfo",
        method: "POST",
        body: params
    });
}

/**
 * 获取课程分销资格（统一接口）
 */
export async function getMyQualify(
    businessId,
    businessType,
    isAutoApply = "N",
    shareUserId = ""
) {
    return await api({
        showLoading: false,
        url: "/api/wechat/topic/getMyQualify",
        method: "POST",
        body: {
            businessId,
            businessType,
            isAutoApply,
            shareUserId
        }
    });
}

// 是否报名该系列课
export async function isAuthChannel(channelId) {
    try {
        const result = await api({
            showLoading: false,
            url: "/api/wechat/channel/isAuthChannel",
            method: "POST",
            body: {
                channelId
            }
        });
        if (result.state.code === 0) {
            return result.data && result.data.status;
        }
    } catch (err) {
        console.error(err);
        return "N";
    }
}

// 是否报名该话题
export async function isAuthTopic(topicId) {
    try {
        const result = await api({
            showLoading: false,
            url: "/api/wechat/transfer/h5/topic/topicAuth",
            method: "POST",
            body: {
                topicId
            }
        });
        return result?.data?.isAuth ? 'Y' : 'N';
    } catch (err) {
        console.error(err);
        return "N";
    }
}

// 统一查看是否报名课程
export async function isAuthCourse({ businessId, businessType }) {
    if(businessType === 'topic'){
        return await isAuthTopic(businessId);
    }else if(businessType === 'channel'){
        return await isAuthChannel(businessId);
    }else{
        console.error('wrong businessType')
    }
}

// 统一报名免费课程，包括系列课话题
export async function authFreeCourse({ businessId, businessType}) {
    try {
        const result = await api({
            showLoading: false,
            url: "/api/wechat/transfer/h5/topic/joinFreeCourse",
            method: "POST",
            body: {
                businessId,
                businessType,
            }
        });
        return result.state.code === 0 ? 'success' : 'fail';
    } catch (err) {
        console.error(err);
        return "fail";
    }
}

// 获取系列课第一节课程
export async function getFirstTopicInChannel(channelId){
    const result = await api({
        showLoading: false,
        url: "/api/wechat/transfer/h5/topic/list",
        method: "POST",
        body: {
            channelId: channelId,
            pageNum: 1,
            pageSize: 1
        }
    }).catch(e => {
        console.error(e)
    });
    const topicList = result.data?.topicList || [];
    return topicList[0];
}

// 学分任务达成触发
export async function uploadTaskPoint(params) {
    const result = await api({
        url: "/api/wechat/point/doAssignment",
        method: "POST",
        body: params
    });

    return result;
}

// 获取系列课单个单个话题作业数据
export async function topicJodLists(params) {
    const result = await api({
        url: "/api/wechat/channel/camp/listTopic",
        method: "POST",
        body: params
    });
    console.log("==========");
    return result;
}

// 获取社群信息
export async function getCommunity(liveId, type, businessId) {
    try {
        const res = await request({
            url: "/api/wechat/community/getByBusiness",
            method: "POST",
            body: { liveId, type, businessId }
        });
        if (res.state.code === 0) {
            return res.data;
        } else {
            window.toast(res.state.msg);
        }
    } catch (err) {
        console.error(err);
    }
}

// 同意讲师协议
export async function assignAgreement({ liveId, version, type = "live" }) {
    return await request({
        url: "/api/wechat/transfer/h5/live/assignAgreement",
        method: "POST",
        body: { liveId, version, type }
    });
}

// 讲师协议同意状态
export async function getAgreementStatus({ liveId, version, type = "live" }) {
    return await request({
        url: "/api/wechat/transfer/h5/live/agreementStatus",
        method: "POST",
        body: { liveId, version, type }
    });
}

// 获取讲师协议版本
export async function getAgreementVersion() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await request({
                url: "/api/wechat/transfer/h5/live/agreementVersion",
                method: "POST",
                body: {}
            });
            if (res.state.code === 0) {
                resolve(res.data && res.data.liveAgreementVersion);
            } else {
                reject(res.state, msg);
            }
        } catch (err) {
            reject(err);
        }
    });
}

// 解绑手机号
export function unbindPhone() {
    return async function(dispatch, getStore) {
        return api({
            dispatch,
            getStore,
            method: "POST",
            url: "/api/wechat/transfer/h5/user/mobileUnbind",
            errorResolve: true
        }).then(res => {
            if (!res.state.code) {
                dispatch({
                    type: UPDATE_USERINFO,
                    userInfo: {
                        mobile: undefined,
                        isBind: "N"
                    }
                });
                return true;
            }
        });
    };
}

export function updateUserInfo(userInfo) {
    return async function(dispatch, getStore) {
        dispatch({
            type: UPDATE_USERINFO,
            userInfo
        });
    };
}

// 获取功能白名单
export async function isFunctionWhite(liveId, functionType) {
    try {
        const res = await request({
            url: "/api/wechat/isFunctionWhite",
            method: "POST",
            body: {
                liveId,
                function: functionType
            }
        });
        if (res.state.code === 0) {
            return res.data;
        } else {
            window.toast(res.state.msg);
        }
    } catch (err) {
        console.error(err);
    }
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

// 获取企业信息
export async function checkEnterprise(params){
    return await api({
        url: '/api/wechat/live/checkEnterprise',
        body: params,
    });
}

// 获取考试成绩海报二维码
export async function getExamQrCode ({
    channel,
    liveId,
    pubBusinessId
}) {
    const subscribeData = await fetchSubscribeStatus({ liveId });
    let isBindThird = convertType(
        getVal(subscribeData, "data.isBindThird", "N")
    );
    let isFocusThree = convertType(
        getVal(subscribeData, "data.isFocusThree", "N")
    );

    // 对接三方服务号 并且 已关注 弹三方
    if (isBindThird == "Y" && isFocusThree == "Y") {
        let qr = await api({
            url: "/api/wechat/live/get-qr",
            method: "GET",
            body: {
                showQl: "N",
                pubBusinessId,
                liveId,
                channel,
                // subscribe: isSubscribe
            }
        });
        return { url: getVal(qr, "data.qrUrl") };
    }

    const qlCourse = await getIsQlCourseFocus()
    // 已关注千聊课程 弹千聊课程
    if (getVal(qlCourse, "isSubscribe", "N") === 'Y') {
        const qlCourseObj = await api({
            url: "/api/wechat/live/get-qr",
            method: "GET",
            body: {
                showQl: "N",
                pubBusinessId,
                // liveId,
                appId: qlCourse.appId,
                channel,
            }
        });
        return {
            appId: "",
            url: getVal(qlCourseObj, "data.qrUrl")
        };
    }

    // 弹千聊
    const qlObj = await api({
        url: "/api/wechat/live/get-qr",
        method: "GET",
        body: {
            pubBusinessId,
            liveId,
            channel,
            showQl: "Y"
        }
    });
    return {
        appId: "wx6b010e5ae2edae95",
        url: getVal(qlObj, "data.qrUrl")
    };
}

// 获取用户的好友关系
export function fetchRelationInfo({ userId }) {
    return api({
        url: "/api/wechat/transfer/h5/user/relation/relationInfo",
        method: "POST",
        body: {
            userId
        }
    });
}

// 获取用户的好友关系
export function dispatchFetchRelationInfo({ userId }) {

    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/transfer/h5/user/relation/relationInfo',
            body: {
                userId
            },
            method: 'POST'
        });
        if(res.state.code === 0) {
            dispatch({
                type: GET_RELATIONINFO,
                payload: res.data
            })
        }   
        return res;
    }
}


/**
 * 三方导粉公众号获取二维码
 * @param {object} 参数对象（包括liveId, channel, subscribe等参数）
 */
export function getThirdConf(options) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: "/api/wechat/transfer/h5/live/getOpsAppIdSwitchConf",
            method: "POST",
            body: {
                channel: '201',
                liveId: options.liveId
            }
        });
        dispatch({
            type: GET_THRID_CONF,
            payload: {
                ...result.data
            }
        })
        return result.data || [];
    }
}

/**
 * 获取节点信息
 * @param {object} 参数对象（包括liveId, channel, subscribe等参数）
 */
export const getNodeInfo = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/h5/menu/node/get',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
}

// 获取APP跳转路由
export const getAppGoUrl = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/common/parseUrl',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
}

// 获取目标用户微信昵称
export const getWechatNickName = async (findNameUserId) => {
    const res = await request.post({
        url: '/api/wechat/transfer/h5/user/getWechatUserName',
        body: { findNameUserId }
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

// 通用广告位
export const getAdSpace = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/ad/myCourse',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || null
}

// 是否为官方直播间
export const isQlLive = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/live/isQlLive',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || null
}
