import { drawText, imageProxy, multiText, drawImage } from '@ql-feat/canvas-tools';

var proxy = imageProxy('/api/wechat/image-proxy?url=');

var picUrl = null;
var shareData = null;
var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';

var moduleData = {};
var bgMap = {};
let qrcode = null;
let avatar = null;

let center = 0;
let width = 0;
/**
 * 
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
export function invitationCard(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
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
                top: 90,
                left: 102,
                lineHeight: 40,
                font: 28,
                color: "#fff",
                textAlign: "left",
            },
            decsObj: {
                top: 238,
                left:28 ,
                width: 576,
                lineHeight: 62,
                font: 44,
                color: "#fff",
                textAlign: "left",
                bolder: 'bold'
            },
            statusObj: {
                left: 46,
                lineHeight: 28,
                font: 20,
                color: "rgba(255,255,255,.7)",
                textAlign: "left",
            },
            dayObj: {
                left: 46,
                lineHeight: 50,
                font: 36,
                color: "#fff",
                textAlign: "left",
            },
            qrUrlObj:{
                left: 494,
                top: 650,
                width: 113,
                height: 113,
            },
            avatarObj:{
                left: 32,
                top: 50,
                width: 52,
                height: 52,
            }
        },
        B: {
            nameObj: {
                top: 110,
                left: 112,
                lineHeight: 42,
                font: 30,
                color: "#fff",
                textAlign: "left",
            },
            decsObj: {
                top: 294,
                left: 32,
                width: 576,
                lineHeight: 70,
                font: 48,
                color: "#fff",
                textAlign: "left",
                bolder: 'bold'
            },
            statusObj: {
                left: 48,
                lineHeight: 34,
                font: 24,
                color: "rgba(255,255,255,0.7)",
                textAlign: "left",
            },
            dayObj: {
                left: 48,
                lineHeight: 58,
                font: 40,
                color: "#fff",
                textAlign: "left",
            },
            qrUrlObj:{
                left: 526,
                top: 1034,
                width: 128,
                height: 128,
            },
            avatarObj:{
                left: 32,
                top: 68,
                width: 60,
                height: 60,
            },
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
 * 生成canvas内容
 * 
 * @param {any} canvas 
 * @param {any} options 
 */
async function  genContent(canvas, cb) {
    var ctx = canvas.getContext('2d');
    drawReat(ctx);
    loadQrImage(function () {
        drawText(ctx, shareData.name, moduleData.nameObj, fontFamiry);
        multiText(ctx, shareData.decs, moduleData.decsObj, "'Times New Roman', Times, serif");
        ctx.textAlign = moduleData.textAlign;
        // 绘制用户头像
        avatar = new Image();
        avatar.crossOrigin = 'Anonymous';
        avatar.src = proxy(shareData.picUrl);
        avatar.onload = function() {
            const avatarObj = moduleData.avatarObj;
            const path = avatarObj.width/2
            ctx.restore();
            ctx.save();
            ctx.beginPath(); 
            ctx.arc(avatarObj.left+path, avatarObj.top+path, avatarObj.width-path, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(avatar, avatarObj.left, avatarObj.top, avatarObj.width, avatarObj.height);
            ctx.restore();
            ctx.save();
            // 绘制二维码
            ctx.drawImage(
                qrcode,
                moduleData.qrUrlObj.left,
                moduleData.qrUrlObj.top,
                moduleData.qrUrlObj.width,
                moduleData.qrUrlObj.height
            );
            cb();
        }
    });
}

function getTxtOnline(decs) {
    let line = 0
    const value = ((moduleData.decsObj.font * decs.length) / moduleData.decsObj.width)
    line = line + ((value >= 1) ? Math.ceil(value) : 1);
    return ((line * moduleData.decsObj.lineHeight) + moduleData.decsObj.top);
}

/**
 * 绘制矩形
 * @param {*} ctx 
 */
function drawReat(ctx){
    const height = getTxtOnline(shareData.decs);
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    ctx.strokeStyle= 'rgba(255,255,255,0.3)';
    ctx.strokeRect(32,height,width + 42,142);
    ctx.stroke();
    ctx.save();
    moduleData.statusObj.top = height + 40;
    moduleData.dayObj.top = height + 40 + 70;
    drawText(ctx, shareData.status, moduleData.statusObj, fontFamiry);
    drawText(ctx, shareData.day, moduleData.dayObj, fontFamiry);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(46,height + 40 + 22);
    ctx.lineTo(width + 40,height + 40 + 22);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.stroke();
    ctx.save();
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

function genBg(canvas, bgUrl, cb) {
    var ctx = canvas.getContext('2d');
    width = getTxtWidth(ctx);
    ctx.font = "36px";
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


function getTxtWidth (ctx) {
    ctx.font = "36px Arial";
    const width = ctx.measureText(shareData.day).width;
    return width
}