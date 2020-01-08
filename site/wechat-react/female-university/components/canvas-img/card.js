import { drawText, imageProxy, multiText, drawImage } from '@ql-feat/canvas-tools';
import QRCode from 'qrcode'

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
 * @param {*} cb
 * @param {*} cardWidth
 * @param {*} cardHeight
 */
export async function initCard({  moduleList=[], success, cardWidth, cardHeight, quality=0.7}) {
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    canvas.width = cardWidth || 640;
    canvas.height = cardHeight || 1136;
    center = canvas.width / 2;
     
    const ctx = canvas.getContext('2d');  
    canvasDraw(ctx, moduleList,()=>{
        typeof success=='function' && success(canvas.toDataURL('image/jpeg',quality));
        return
    })
}

async function canvasDraw(ctx, moduleList,cb,i=0){
    let item=moduleList[i]
     // 绘制文字
    if(item?.type=='text'&&item.value){
        ctx.restore();
        ctx.textAlign=item.params.textAlign||'left'
        item.params.top=item.params.top+item.params.font
        if(item.params.maxLine){
            await multiText(ctx, item.value, item.params, fontFamiry);
        }else{
            await drawText(ctx, item.value, item.params, fontFamiry); 
        }  
    }
    // 绘制图片
    if(item?.type=='img'&&item.value){
        ctx.restore();
        await drawStyleImage(ctx, item.value, item.params) 
    } 
    // 绘制二维码
    if(item?.type=='qrcode'&&item.value){
        ctx.restore();
        let qrUrl = await getQr(item.value);
        await drawStyleImage(ctx, qrUrl, item.params) 
    } 
    if(moduleList[i+1]){
        canvasDraw(ctx, moduleList,cb,i+1)
    }else{
        typeof cb=='function' && cb();
    }
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
function drawAsyncTxt({ctx,title, decs, titleObj, decsObj, isMore = false}){
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
    ctx.save();
    ctx.beginPath();
    await ctx.drawImage(
        imgUrl,
        data.left,
        data.top,
        data.width,
        data.height
    );
    ctx.restore();
    ctx.save();
    return true
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
    }).catch((error) => {
        console.error(error);
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

 // 生成二维码
 export async function getQr (url){ 
    const res=QRCode.toDataURL(url, {
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff" 
        })
        .then(url => {
            return url
        })
        .catch(err => {
            console.error(err)
        })     
    return res
} 

/**
 * 应用于画图圆角矩形图片
 * @param ctx          canvas 的 getContext('2d')
 * @param bgUrl        图片链接
 * @param imageObj     图片显示样式设置
 * {
    left:number, 
    top:number, 
    width:number, 
    height:number, 
    isClip?:boolean, 
    x?:number, 
    y?:number, 
    w?:number, 
    h?:number, 
    r?:number, 
    bdWidth?:number, 
    bdColor?:string, 
    bgcolor?:string, 
    isLinear?:boolean, 
    linearColor?:string}
 * @param imageProxyFunc:any
 * @param cb any
 * 画经过 clip 的图片（圆形，圆角矩形）
 * imageObj:{left, top, width, height, isClip, x, y, w, h, r, bdWidth, bdColor, bgcolor, isLinear, linearColor}
 */
async function drawStyleImage(ctx, imageUrl, imageObj) {
    imageUrl = await loadImage(imageUrl);
    var left = imageObj.left,
        top = imageObj.top,
        width = imageObj.width,
        height = imageObj.height,
        isClip = imageObj.isClip,
        x = imageObj.x,
        y = imageObj.y,
        w = imageObj.w,
        h = imageObj.h,
        r = imageObj.r,
        bdWidth = imageObj.bdWidth,
        bdColor = imageObj.bdColor,
        bgcolor = imageObj.bgcolor,
        isLinear = imageObj.isLinear,
        linearColor = imageObj.linearColor;

    ctx.save();

    if (isClip) {
        r && headBgClipRounded(ctx, { x: x, y: y, w: w, h: h, r: r, bdWidth: bdWidth, bdColor: bdColor, bgcolor: bgcolor, isLinear: isLinear, linearColor: linearColor });
        ctx.clip();
    }
    await ctx.drawImage(
        imageUrl,
        left,
        top,
        width,
        height
    )
    return true
}