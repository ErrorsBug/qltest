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
            headBgObj: {
                top: 120,
                left: (cardWidth / 2) - (594 / 2),
                height: 370,
                width: 594
            },
            noticeCardObj: {
                top: 600,
                left: 64,
                width: cardWidth - (64 * 2),
                height: 633
            },
            rectObj: {
                left: 64,
                top: 1300,
                width: cardWidth - (64 * 2),
                height: datas.hei,
                isClip: true,
                x: 64,
                y: 1300,
                w: cardWidth - (64 * 2),
                h: datas.hei,
                r: 20, 
            },
            titleObj: {
                left: 100,
                lineHeight: 84,
                font: 60,
                color: "#333",
                textAlign: "left",
                bolder: 'bold'
            },
            decsObj: {
                left: 100,
                lineHeight: 66,
                font: 42,
                color: "#666",
                textAlign: "left",
                width: cardWidth - (100 * 2),
            },
            qrBgObj: {
                left: 0,
                top: shareData.isInfo ? (1300 + shareData.hei + 20) : (1300 + shareData.hei),
                width: cardWidth,
                height: 430
            },
            qrObj: {
                left: 800,
                top: shareData.isInfo ? (1385 + shareData.hei + 20) : (1385 + shareData.hei),
                width: 240,
                height: 240
            }
        }
    }
    moduleData = moduleList[styleModule];
    const ctx = canvas.getContext('2d');
    // 绘制背景
    await genBg(ctx, bgUrl)
    // 绘制大学校徽
    await drawImg(ctx, shareData.headBg, moduleData.headBgObj)
    // 绘制通知书
    await drawImg(ctx, shareData.cardBg, moduleData.noticeCardObj)
    if(shareData.isInfo) {
        // 绘制矩形
        await headBgClipRounded(ctx,moduleData.rectObj);
        if(!!shareData.area){
            moduleData.titleObj.top = top;
            moduleData.decsObj.top = top + moduleData.titleObj.lineHeight
            await drawAsyncTxt(ctx,shareData.areaTitle, shareData.area, moduleData.titleObj, moduleData.decsObj);
        }
        if(!!shareData.mineArr){
            moduleData.titleObj.top = top;
            moduleData.decsObj.top = top + moduleData.titleObj.lineHeight
            await drawAsyncTxt(ctx,shareData.mineTitle, shareData.mineArr, moduleData.titleObj, moduleData.decsObj, true);
        }
        if(!!shareData.hobbyArr){
            moduleData.titleObj.top = top;
            moduleData.decsObj.top = top + moduleData.titleObj.lineHeight
            await drawAsyncTxt(ctx,shareData.hobbyTitle, shareData.hobbyArr, moduleData.titleObj, moduleData.decsObj, true);
        }
        if(!!shareData.coolThingArr){
            moduleData.titleObj.top = top;
            moduleData.decsObj.top = top + moduleData.titleObj.lineHeight
            await drawAsyncTxt(ctx,shareData.coolThingTitle, shareData.coolThingArr, moduleData.titleObj, moduleData.decsObj, true);
        }
        if(!!shareData.sayArr){
            moduleData.titleObj.top = top;
            moduleData.decsObj.top = top + moduleData.titleObj.lineHeight
            await drawAsyncTxt(ctx,shareData.sayTitle, shareData.sayArr, moduleData.titleObj, moduleData.decsObj, true);
        }
        if(!!shareData.remarkArr){
            moduleData.titleObj.top = top;
            moduleData.decsObj.top = top + moduleData.titleObj.lineHeight
            await drawAsyncTxt(ctx,shareData.remarkTitle, shareData.remarkArr, moduleData.titleObj, moduleData.decsObj, true);
        }
    }
    // 绘制二维码背景
    await drawImg(ctx, shareData.qrBg, moduleData.qrBgObj)

    // 绘制二维码
    await drawImg(ctx, shareData.qrUrl, moduleData.qrObj)
    
    cb(canvas.toDataURL('image/png'));
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
function drawAsyncTxt(ctx,title, decs, titleObj, decsObj, isMore = false){
    let newArr = ''
    if(typeof(decs) !== 'string') {
        newArr = decs.filter(Boolean);
    } else {
        newArr = decs;
    }
    return new Promise((resolve, reject) => {
        ctx.save();
        let h = 0
        if(title){
            drawText(ctx, title, titleObj, fontFamiry);
        }
        if(isMore){
            let i = 0
            newArr.forEach(item => {
                decsObj.top = decsObj.top + i;
                multiText(ctx, item, decsObj, fontFamiry);
                i = getTxtOnline(item)
                h = h + i;
            });
        } else {
            h = getTxtOnline(newArr)
            drawText(ctx, newArr, decsObj, fontFamiry);
        }
        top = top + btm + moduleData.titleObj.lineHeight + h;
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