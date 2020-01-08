import { drawText, imageProxy ,multiText,  } from '@ql-feat/canvas-tools';

var proxy = imageProxy('/api/wechat/image-proxy?url=');

var shareData = null;
var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';

var moduleData = {};
var bgMap = {};
let qrcode = null;

var styleModule = 'A';

let center = 0;
/**
 * 生成sharecard图片
 * 
 * datas={
 * userName，
 * headImgUrl
 * businessId
 * businessType
 * userId
 * applyUserId
 * }
 */     
export function noticeCard(bgUrl, datas, cb, cardWidth, cardHeight) {
    shareData = datas;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    canvas.width = cardWidth || 640;
    canvas.height = cardHeight || 1136;
    center = canvas.width / 2;
    var moduleList = {
        A: {
            nameObj: {
                top: 510, // 310
                left: 155,
                width: 250,
                lineHeight: 50,
                font: 52,
                color: "#8A5D3B",
                textAlign: "left",
                bolder: 'bold'
            },
            decsObj: {
                left: 155,
                width: 700,
                lineHeight: 60,
                font: 38,
                textAlign: "left",
                color: '#A87C4F',
            },
            collegeObj: {
                top: 600,
                left: 346,
                width: 200,
                lineHeight: 28,
                font: 20,
                textAlign: "left",
                color: '#999'
            },
            dateObj: {
                top: 970,
                left: 660,
                width: 300,
                lineHeight: 28,
                font: 30,
                textAlign: "left",
                color: '#8A5D3B'
            },
            qrObj:{
                top: 1065,
                left: 665,
                width: 168,
                height: 168,
            }
        }
    }
    moduleData = moduleList[styleModule];
    genBg(canvas, bgUrl, function () {
        genContent(canvas, function () {
            cb(canvas.toDataURL('image/png'));
        });
    });
}


/**
 * 加载头像和二维码
 * 
 * @param {any} cb 
 */
async function loadQrImage(cb) {
    if (!qrcode) {
        qrcode = await loadImage(shareData.qrUrl);
        cb();
    } else {
        cb();
    }
}

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
 * 生成canvas内容
 * 
 * @param {any} canvas 
 * @param {any} options 
 */
function genContent(canvas, cb) {
    var ctx = canvas.getContext('2d');
    drawText(ctx, shareData.name, moduleData.nameObj, fontFamiry);
    loadQrImage(function(){
        let line = 0;
        let top = 590;
        if(shareData.decs instanceof Array ){
            shareData.decs.forEach((item, index) => {
                moduleData.decsObj.top = top + (line * 60) + ( !!line ? 10 : 0 )
                if((shareData.decs.length - 1) == index){
                    moduleData.decsObj.top += 10;
                }
                multiText(ctx, item, moduleData.decsObj, fontFamiry);
                const value = ((moduleData.decsObj.font * item.length) / moduleData.decsObj.width)
                line = line + ((value >= 1) ? Math.ceil(value) : 1);
            })
        }
        // drawText(ctx, shareData.college, moduleData.collegeObj, fontFamiry);
        drawText(ctx, shareData.date, moduleData.dateObj, fontFamiry);
        ctx.restore();
        ctx.save();
        ctx.drawImage(
            qrcode,
            moduleData.qrObj.left,
            moduleData.qrObj.top,
            moduleData.qrObj.width,
            moduleData.qrObj.height
        );
        cb();
    })
    
}

/**
 * 绘制背景
 */
function genBg(canvas, bgUrl, cb) {
    var ctx = canvas.getContext('2d');
    if (bgUrl != "") {
        if (bgMap[encodeURIComponent(bgUrl)]) {
            __drawBg(ctx, bgMap[encodeURIComponent(bgUrl)]);
            cb();
        } else {
            var bgImg = new Image();
            bgImg.crossOrigin = 'Anonymous';
            bgImg.src = proxy(bgUrl);
            bgImg.onload = function () {
                bgMap[encodeURIComponent(bgUrl)] = bgImg;
                __drawBg(ctx, bgImg);
                cb();
            }
        }
    } else {
        __drawBg(ctx, "");
        cb();
    }
}

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
