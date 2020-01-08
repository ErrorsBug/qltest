import { drawText, imageProxy, multiText, drawImage } from '@ql-feat/canvas-tools';
import { imgUrlFormat } from 'components/util';
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
export async function invitationCard(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
    shareData = datas;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    canvas.width = cardWidth || 640;
    canvas.height = cardHeight || 1136;
    center = canvas.width / 2;
    
    var moduleList = {
        A: {
            headImgObj: {
                top: 0,
                left: 0,
                height: 381,
                width: canvas.width
            },
            nameObj: {
                top: 448,
                left: 30,
                width: canvas.width - (30*2),
                lineHeight: 36,
                font: 36,
                color: "#333333",
                textAlign: "left",
                maxLine:1,
                bolder: 'bold'
            },
            userNameObj: {
                top: 705+24,
                left: 115,
                width: 350,
                lineHeight: 33,
                font: 24,
                color: "rgba(51,51,51,1)",
                textAlign: "left",
                maxLine:1
            }, 
            descObj: {
                top: 492,
                left: 30,
                width: canvas.width - (30*2),
                lineHeight: 33,
                font: 24,
                color: "rgba(51,51,51,0.79)",
                textAlign: "left",
                maxLine:2
            },
            orderCountObj: {
                top: 578+22,
                left: 160,
                width: canvas.width,
                lineHeight: 28,
                font: 20,
                color: "#999999",
                textAlign: "left",
                maxLine:1
            }, 
            userHeadImgUrlObj: {
                left: 30,
                top: 705,
                width: 66,
                height: 66
            },
            qrObj: {
                left: 462,
                top: 705,
                width: 128,
                height: 128
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
            qrBgObj: {
                left: 0,
                top: shareData.isInfo ? (1300 + shareData.hei + 20) : (1300 + shareData.hei),
                width: cardWidth,
                height: 430
            }
        }
    }
    moduleData = moduleList[styleModule];
    const ctx = canvas.getContext('2d');
    // 绘制背景
    await genBg(ctx, bgUrl)
    // 绘制 
    await drawImg(ctx,imgUrlFormat(shareData.headImg,'?x-oss-process=image/resize,m_fill,limit_0,w_610,h_381','/0') , moduleData.headImgObj) 
    shareData.name&&multiText(ctx, shareData.name, moduleData.nameObj, fontFamiry); 
    shareData.userName&&multiText(ctx, shareData.userName, moduleData.userNameObj, fontFamiry); 
    shareData.desc&&multiText(ctx, shareData.desc, moduleData.descObj, fontFamiry); 
    if(moduleData.orderCountObj){
        drawText(ctx, `等`, moduleData.orderCountObj, fontFamiry);  
        moduleData.orderCountObj.left=moduleData.orderCountObj.left+20
        moduleData.orderCountObj.color= "#F73657"
        drawText(ctx, `${shareData.orderCount}+`, moduleData.orderCountObj, fontFamiry); 
        let width =ctx.measureText(`${shareData.orderCount}+`).width
        moduleData.orderCountObj.left=moduleData.orderCountObj.left+width
        moduleData.orderCountObj.color= "#999999"
        drawText(ctx, '人已报名，走上致富之路', moduleData.orderCountObj, fontFamiry); 
    } 
    
    // 绘制二维码
    await drawImg(ctx, shareData.qrUrl, moduleData.qrObj)
    // 绘制头像   
     
    const path = moduleData.userHeadImgUrlObj.width / 2
    ctx.arc(moduleData.userHeadImgUrlObj.left + path, moduleData.userHeadImgUrlObj.top + path, moduleData.userHeadImgUrlObj.width - path, 0, 2 * Math.PI);
    ctx.clip();
    await drawImg(ctx, shareData.userHeadImgUrl, moduleData.userHeadImgUrlObj)
    ctx.restore();
    ctx.save();
    
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
    if(!imgUlr)return false
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