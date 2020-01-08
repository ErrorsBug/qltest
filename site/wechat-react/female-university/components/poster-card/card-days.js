import { drawText, imageProxy, multiText, drawImage } from '@ql-feat/canvas-tools'; 
import { loadUrl,multiTextWithLine } from './index'
import { imgUrlFormat } from 'components/util';

var proxy = imageProxy('/api/wechat/image-proxy?url=');

var picUrl = null;
var shareData = null;
var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';

var moduleData = {};
var bgMap = {};
let qrcode = null;
let avatar = null;
let maohaoImg = null;
let imgIndex=0
let imgObj = {}

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
export function daysCard(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
    shareData = datas;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    canvas.width = cardWidth || 604;
    canvas.height = cardHeight || 888;
    center = canvas.width / 2;
    var moduleList = {
        A: {
            logo: {
                left: 46,
                top: 46,
                width: 120,
                height: 120,
            },
            nameObj: {
                left: 166,
                top: 677-218,
                lineHeight: 34,
                font: 24,
                color: "rgba(102,102,102,1)",
                textAlign: "left",
            },
            cardTimeObj: {
                left: 698,
                top: 824-218,
                lineHeight: 56,
                font: 40,
                color: "rgba(169,99,49,1)",
                textAlign: "right", 
                bolder: 'bold'
            }, 
            decsObj: {
                left: 60,
                top: 898-218,
                width: 630,
                lineHeight: 52,
                font: 28,
                color: "rgba(51,51,51,1)",
                textAlign: "left", 
                maxLine:3,
            },  
            qrUrlObj: {
                left: 562,
                top: 1172-218,
                width: 128,
                height: 128,
            },
            avatarObj: {
                left: 58,
                top: 592-218,
                width: 96,
                height: 96,
            }, 
            topBg: {
                left: 0,
                top: 0,
                width: 750,
                height: 422,
            }, 
            avatarBottom: {
                left: 32,
                top: 584-218,
                width: 152,
                height: 56,
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
    drawReat(ctx);
    let imgList = [
        {name:'logo',url:shareData.logo},
        {name:'avatar',url:shareData.picUrl},
        {name:'qrcode',url:shareData.qrUrl},  
        {name:'topBg',url:imgUrlFormat(shareData.topBg,'?x-oss-process=image/resize,m_fill,limit_0,h_422,w_750','/0')},
        {name:'avatarBottom',url:'https://img.qlchat.com/qlLive/business/BX7J5UYC-5OXZ-YRF8-1563441743922-DILHQU886R3G.png'}, 
    ]   
    imgIndex=0
    loadAllImage(imgList,function () {   
        const {logo,topBg,avatarBottom,cardTimeObj ,nameObj ,decsObj,avatarObj ,qrUrlObj} = moduleData
        ctx.drawImage(imgObj.topBg, topBg.left, topBg.top, topBg.width, topBg.height);
        ctx.drawImage(imgObj.logo, logo.left, logo.top, logo.width, logo.height);
        ctx.drawImage(imgObj.avatarBottom, avatarBottom.left, avatarBottom.top, avatarBottom.width, avatarBottom.height);
        ctx.fillStyle="#"
        ctx.textAlign=cardTimeObj.textAlign
        drawText(ctx, `${shareData.cardTime}天`, cardTimeObj, fontFamiry); 
        ctx.textAlign='left'
        drawText(ctx, shareData.name, nameObj, fontFamiry);  
        multiTextWithLine(ctx, `“${shareData.decs}”`, decsObj, "'Times New Roman', Times, serif"); 
        const path = avatarObj.width / 2
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarObj.left + path, avatarObj.top + path, avatarObj.width - path, 0, 2 * Math.PI);
        ctx.clip();
        // 绘制用户头像
        ctx.drawImage(imgObj.avatar, avatarObj.left, avatarObj.top, avatarObj.width, avatarObj.height);
        ctx.restore();
        ctx.save(); 
        // 绘制二维码
        ctx.drawImage(
            imgObj.qrcode,
            qrUrlObj.left,
            qrUrlObj.top,
            qrUrlObj.width,
            qrUrlObj.height
        );  
        cb();

    });
}

function getTxtOnline(decs) {
    let line = 0
    const value = ((decsObj.font * decs.length) / decsObj.width)
    line = line + ((value >= 1) ? Math.ceil(value) : 1);
    return ((line * decsObj.lineHeight) + decsObj.top);
}

/**
 * 绘制矩形
 * @param {*} ctx 
 */
function drawReat(ctx) { 
    ctx.save(); 
    ctx.save(); 
    ctx.stroke();
    ctx.save();
}


/**
 * 加载图片
 * 
 * @param {any} cb 
 */
async function loadImage(img, url, cb) {
    imgObj[img] = await loadUrl(url);
    cb(); 
}
 


/**
 * 加载全部图片
 * 
 * @param {any} cb 
 */
function loadAllImage(arr,cb) {  
    loadImage(arr[imgIndex].name, arr[imgIndex].url, () => {
        if(imgIndex<arr.length-1){
            imgIndex++
            loadAllImage(arr,cb)
        }else{
            cb();
        } 
    })
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


function getTxtWidth(ctx) {
    ctx.font = "36px Arial";
    const width = ctx.measureText(shareData.day).width;
    return width
}


