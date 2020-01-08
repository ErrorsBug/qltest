import { drawText, imageProxy, multiText, drawImage } from '@ql-feat/canvas-tools';
var proxy = imageProxy('/api/wechat/image-proxy?url=');

var shareData = null;
var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';
var moduleData = {};
var bgMap = {};
let center = 0;
let top = 1400;
let btm = 90;

export function clearData() {
    top = 1400;
}
 
/**
 * 画卡
 * @export
 * @param {*} bgUrl
 * @param {*} datas
 * @param {*} cb
 * @param {*} cardWidth
 * @param {*} cardHeight
 * @param {string} [styleModule='A']
 */
export async function initCard(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
    shareData = datas;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    canvas.width = cardWidth || 640;
    canvas.height = cardHeight || 1136;
    center = canvas.width / 2;
    
    var moduleList = {
        A: {
            dayObj: {
                top: 580,
                left: 80,
                lineHeight: 92,
                font: 240,
                color: "#fff",
                textAlign: "left",
                bolder: 'bold'
            },
            dayNameObj: {
                top: 580,
                lineHeight: 40,
                font: 80,
                color: "#fff",
                bolder: 'bold'
            },
            goldenObj: {
                top: 835,
                left: 80,
                lineHeight: 160,
                font: 92,
                color: "#fff",
                textAlign: "left",
                bolder: 'bold',
                width: cardWidth - (120 * 2)
            },
            goldenNameObj: {
                left: 80,
                lineHeight: 104,
                font: 72,
                color: "#fff",
                textAlign: "left",
                bolder: 'bold',
            },
            headImgObj: {
                top: 2100,
                left: 120,
                width: 192,
                height: 192,
                r: 96,
            },
            userObj: {
                top: 2175,
                left: 340,
                lineHeight: 80,
                font: 56,
                color: "#fff",
                textAlign: "left",
                bolder: 'bold',
            },
            campObj: {
                top: 2250,
                left: 340,
                lineHeight: 78,
                font: 48,
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
                bolder: 'bold',
            },
            noteCountObj:{
                top: 2470,
                left: 160,
                lineHeight: 160,
                font: 112,
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
                bolder: 'bold',
            },
            progressObj: {
                top: 2470,
                left: 600,
                lineHeight: 160,
                font: 112,
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
                bolder: 'bold',
            },
            actionObj: {
                top: 2470,
                left: 1060,
                lineHeight: 160,
                font: 112,
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
                bolder: 'bold',
            },
            qrObj: {
                top: 2760,
                left: 1130,
                width: 236,
                height: 236,
            }
        }
    }
    moduleData = moduleList[styleModule];
    const ctx = canvas.getContext('2d');
    // 绘制背景
    await genBg(ctx, bgUrl)
    // 绘制天数
    await drawAsyncTxt(ctx, shareData.day, moduleData.dayObj) 
    ctx.font = "240px Arial"
    const width = ctx.measureText(shareData.day).width
    // 绘制天数
    await drawAsyncTxt(ctx, shareData.dayName, { ...moduleData.dayNameObj, left: (100 + width) }) 
    // 绘制金句
    await drawAsyncTxt(ctx, shareData.golden, moduleData.goldenObj, true)
    const len = Math.ceil(shareData.golden .length / 12)
    // 绘制金句名字
    await drawAsyncTxt(ctx, shareData.goldenName, { ...moduleData.goldenNameObj, top: (850 + (len * 160))}) 
    // 绘制用户名
    await drawAsyncTxt(ctx, shareData.userName, moduleData.userObj)
    // 绘制学习营名称
    await drawAsyncTxt(ctx, shareData.campName, moduleData.campObj)
    // 绘制笔记片数
    await drawAsyncTxt(ctx, shareData.noteCount, moduleData.noteCountObj)
    // 绘制笔记进度
    await drawAsyncTxt(ctx, shareData.progress, moduleData.progressObj)
    // 绘制笔记行动力
    await drawAsyncTxt(ctx, shareData.action, moduleData.actionObj)
    // 绘制二维码
    await drawImg(ctx,shareData.qrUrl, moduleData.qrObj) 
    // 绘制头像
    await drawHeadImg(ctx, shareData.headImg, moduleData.headImgObj)

    cb(canvas.toDataURL('image/png'));
}

/**
 * 绘制头像
 * @param {*} ctx
 * @param {*} headImg
 * @param {*} headImgObj
 * @returns
 */
async function drawHeadImg(ctx, headImg, headImgObj) {
    const imgUrl = await loadImage(headImg);
    return new Promise((resolve, reject) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc((headImgObj.left + headImgObj.r), (headImgObj.top + headImgObj.r), headImgObj.r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
            imgUrl,
            headImgObj.left,
            headImgObj.top,
            headImgObj.width,
            headImgObj.height
        );
        ctx.restore();
        ctx.save();
        resolve();
    })
}

/**
 * 绘制文本兼容单双行
 * @param {*} ctx
 * @param {*} title
 * @param {*} decs
 * @param {*} titleObj
 * @param {*} decsObj
 * @param {boolean} [isMore=false]
 * @returns
 */
function drawAsyncTxt(ctx, text, decsObj, isMore = false){
    return new Promise((resolve, reject) => {
        ctx.save();
        if(isMore){
            multiText(ctx, text, decsObj, fontFamiry);
        } else {
            drawText(ctx, text, decsObj, fontFamiry);
        }
        ctx.restore();
        ctx.save();
        resolve();
    })
}

/**
 * 获取文本行数
 * @param {*} decs
 * @returns
 */
function getTxtOnline(decs) {
    let line = 0
    const value = ((moduleData.decsObj.font * decs.length) / moduleData.decsObj.width)
    line = line + ((value >= 2) ? Math.floor(value) : (value < 2 && value > 1) ? 2 : 1);
    return (line * moduleData.decsObj.lineHeight);
}

/**
 * 绘制图片
 * @param {*} ctx
 * @param {*} headBg
 * @param {*} data
 * @returns
 */
async function drawImg(ctx, imgUlr, data) {
    const imgUrl = await loadImage(imgUlr);
    return new Promise((resolve, reject) => {
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(
            imgUrl,
            data.left,
            data.top,
            data.width,
            data.height
        );
        ctx.restore();
        ctx.save();
        resolve()
    })
}


/**
 * 图片加载
 * @param {*} url
 * @param {boolean} [is_cors=true]
 * @returns
 */
function loadImage(url, is_cors = true) {
    return new Promise((resolve, reject) => {
        var img = new Image()
        if (is_cors) img.crossOrigin = 'Anonymous';
        var objectURL = null
        if (url.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
            objectURL = URL.createObjectURL(dataURL2blob(url))
            url = objectURL
        }
        img.onload = () => {
            objectURL && URL.revokeObjectURL(objectURL)
            resolve(img)
        }
        img.onerror = () => {
            reject(new Error('That image was not found.:' + url.length))
        }
        img.src = url
    })
}

/**
 * 画圆角矩形块，渐变色块
 *（可以用于画透明层色块，渐变层）
 *（可以设置上面是圆角，下面是直角 ）
 * headBgClipRounded 方法如果单独使用，填充请手动加上ctx.fill();
 * @param {any} ctx      canvas 的 getContext('2d')
 * @param {object}clipObj 图片显示样式设置
 * {
    x:number, 
    y:number, 
    w:number, 
    h:number, 
    r: number
 */
async function headBgClipRounded(ctx, clipObj) {
    return new Promise((resolve, reject) => {
        ctx.save();
        let { x, y, w, h, r } = clipObj;
        let r_all = '';
        if (typeof r === 'number' || typeof r === 'string') {
            r_all = r;
        }
        ctx.beginPath();
        ctx.moveTo(x + (r_all || r.r_top_left), y);
        ctx.strokeStyle = "transparent";
        ctx.fillStyle = '#fff'
        ctx.arcTo(x + w, y, x + w, y + h, r_all || r.r_top_right);
        ctx.arcTo(x + w, y + h, x, y + h, r_all || r.r_top_left);
        ctx.arcTo(x, y + h, x, y, r_all || r.r_top_left);
        ctx.arcTo(x, y, x + w, y, r_all || r.r_top_left);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.save();
        resolve();
    })
};

/**
 * 图片路径处理
 * @param {*} dataURL
 * @returns
 */
function dataURL2blob(dataURL) {
    let binaryString = atob(dataURL.split(',')[1]);
    let arrayBuffer = new ArrayBuffer(binaryString.length);
    let intArray = new Uint8Array(arrayBuffer);
    let mime = dataURL.split(',')[0].match(/:(.*?);/)[1]
    for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
    }
    let data = [intArray];
    let result;
    try {
        result = new Blob(data, { type: mime });
    } catch (error) {
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (error.name === 'TypeError' && window.BlobBuilder) {
            var builder = new BlobBuilder();
            builder.append(arrayBuffer);
            result = builder.getBlob(type);
        } else {
            throw new Error('没救了');
        }
    }
    return result;
}

/**
 * 绘制背景
 * @param {*} ctx
 * @param {*} bgUrl
 * @returns
 */
function genBg(ctx, bgUrl) {
    return new Promise((resolve, reject) => {
        if (bgUrl != "") {
            if (bgMap[encodeURIComponent(bgUrl)]) {
                __drawBg(ctx, bgMap[encodeURIComponent(bgUrl)]);
                resolve();
            } else {
                var bgImg = new Image();
                bgImg.crossOrigin = 'Anonymous';
                bgImg.src = proxy(bgUrl);
                bgImg.onload = function () {
                    bgMap[encodeURIComponent(bgUrl)] = bgImg;
                    __drawBg(ctx, bgImg);
                    resolve();
                }
            }
        } else {
            __drawBg(ctx, "");
            resolve();
        }
    })
}

/**
 * 绘制背景矩形
 * @param {*} ctx
 * @param {*} bgImg
 */
function __drawBg(ctx, bgImg) {
    if (bgImg != "") {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.fillStyle = "#fff";
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
}