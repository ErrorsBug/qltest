import { drawText, imageProxy, multiText } from '@ql-feat/canvas-tools';

var proxy = imageProxy('/api/wechat/image-proxy?url=');

var picUrl = null;
var shareData = null;
var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';

var moduleData = {};
var bgMap = {};

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
export function studentCardMake(bgUrl, datas, cb, cardWidth, cardHeight) {
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
                top: 180,
                left: 72,
                width: 300,
                lineHeight: 50,
                maxLine: 1,
                font: 46,
                color: "#fff",
                textAlign: "left",
            },
            classObj: {
                top: 294,
                left: 72,
                width: 250,
                lineHeight: 40,
                font: 28,
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
            },
            studentObj:{
                top: 340,
                left: 72,
                width: 250,
                lineHeight: 40,
                font: 28,
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
            },
            picUrl: {
                left: 478,
                top: 174,
                width: 140,
                height: 140,
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
function genContent(canvas, cb) {
    var ctx = canvas.getContext('2d');
    picUrl=null
    loadImage(function () {
        multiText(ctx, shareData.name, moduleData.nameObj, fontFamiry);
        drawText(ctx, shareData.class, moduleData.classObj, fontFamiry);
        drawText(ctx, shareData.studentId, moduleData.studentObj, fontFamiry);
        if(!!shareData.picUrl){
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle= "#eee"; 
            ctx.lineWidth = 2;  
            ctx.arc(548, 244, 70, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(
                picUrl,
                moduleData.picUrl.left,
                moduleData.picUrl.top,
                moduleData.picUrl.width,
                moduleData.picUrl.height
            );
            ctx.restore();
            ctx.save();
        }
        cb();
    });
}

/**
 * 加载头像和二维码
 * 
 * @param {any} cb 
 */
function loadImage(cb) {
    if (!picUrl && shareData.picUrl) {
        picUrl = new Image();
        picUrl.crossOrigin = 'Anonymous';
        picUrl.src = proxy(shareData.picUrl);
        picUrl.onload = function () {
            cb();
        };
    } else {
        cb();
    }
}

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
