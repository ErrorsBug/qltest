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
export function cardIdea(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
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
                left: 940,
                top: 0,
                width: 201,
                height: 156,
            },
            nameObj: {
                left: 192,
                top: 729+52,
                lineHeight: 72,
                font: 52,
                color: "rgba(51,51,51,1)",
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
            textObj: {
                left: 72,
                top: 843+52,
                width: 972,
                lineHeight: 82,
                font: 48,
                color: "rgba(102,102,102,1)",
                textAlign: "left", 
                maxLine:4,
            },  
            avatarBottom: {
                left: 945,
                top: 879,
                width: 87,
                height: 51,
            }, 
            qrUrlObj: {
                left: 861,
                top: 1398,
                width: 186,
                height: 186,
            },
            avatarObj: {
                left: 72,
                top: 717,
                width: 87,
                height: 87,
            },
            topBgObj:{
                left: 72,
                top: 72,
                width: 972,
                height: 561,

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
        {name:'topBg',url:imgUrlFormat(shareData.topBg,'?x-oss-process=image/resize,m_fill,limit_0,w_972,h_561','/0')}, 
        {name:'avatarBottom',url:'https://img.qlchat.com/qlLive/business/6HPTWOLN-QONC-N3ZO-1567752883033-BDXBU873T751.png'}, 
    ]   
    imgIndex=0
    loadAllImage(imgList,function () {   
        const {logo,topBgObj, avatarBottom,cardTimeObj ,nameObj ,textObj,avatarObj ,qrUrlObj} = moduleData 
        ctx.drawImage(imgObj.topBg, topBgObj.left, topBgObj.top, topBgObj.width, topBgObj.height);
        ctx.drawImage(imgObj.logo, logo.left, logo.top, logo.width, logo.height);
        ctx.fillStyle="#" 
        drawText(ctx, shareData.name, nameObj, fontFamiry);  
        multiText(ctx, `“${shareData.text}”`, textObj, "'Times New Roman', Times, serif"); 
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
        const height = getTxtOnline(shareData.text,textObj)  
        ctx.drawImage(imgObj.avatarBottom, avatarBottom.left, height, avatarBottom.width, avatarBottom.height);
        cb();

    });
}

function getTxtOnline(text,textObj) {
    let line = 0
    const value = ((textObj.font * text.length) / textObj.width) 
    line = line + ((value >= 1) ? Math.ceil(value) : 1);
    if(textObj.maxLine&&textObj.maxLine<line){
        return ((textObj.maxLine * textObj.lineHeight) + textObj.top);
    }
    return ((line * textObj.lineHeight) + textObj.top);
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


