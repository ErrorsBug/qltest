import { drawText, imageProxy, multiText, drawImage } from '@ql-feat/canvas-tools';
import { loadUrl } from './index'

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
export function invitationCard(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
    shareData = datas;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    canvas.width = cardWidth || 604;
    canvas.height = cardHeight || 888;
    center = canvas.width / 2;
    var moduleList = {
        A: {
            nameObj: {
                top: 96,
                left: 156,
                lineHeight: 36,
                font: 26,
                color: "#333",
                textAlign: "left",
            },
            decsObj: {
                top: 282,
                left: 64,
                width: 476,
                lineHeight: 50,
                font: 28,
                color: "#333",
                textAlign: "left",
                bolder: 'bold',
                maxLine:4,
            },
            statusObj: {
                top: 514,
                left: 244,
                lineHeight: 34,
                font: 24,
                color: "rgba(255,255,255,1)",
                textAlign: "left",
            },
            dayObj: {
                left: 46,
                lineHeight: 50,
                font: 36,
                color: "#fff",
                textAlign: "left",
            },
            qrUrlObj: {
                left: 438,
                top: 710,
                width: 120,
                height: 120,
            },
            avatarObj: {
                left: 64,
                top: 52,
                width: 72,
                height: 72,
            },
            maohaoObj: {
                left: 64,
                top: 260,
                width: 40,
                height: 26,
            },
            more: {
                left: 364,
                top: 544,
                width: 44,
                height: 44,
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
        {name:'avatar',url:shareData.picUrl},
        {name:'qrcode',url:shareData.qrUrl},
        {name:'maohaoImg',url:'https://img.qlchat.com/qlLive/business/P1NX5HE7-VL2R-QZ7T-1559724202193-9PD31AVKL1JD.png'},
        {name:'more',url:'https://img.qlchat.com/qlLive/business/ZBY9YCJE-UZBR-QZ3Z-1558951425698-NZMDJRYHHZFX.png'},
        {name:'helpTitle',url:'https://img.qlchat.com/qlLive/business/Z5BHYC98-DDMS-2I33-1559724206473-YF3J5L2NHSCJ.png'},
    ]
    for(let i=0;i<shareData.otherAvator.length;i++){
        imgList.push(
            {name:'otherAvator'+i,url:shareData.otherAvator[i]},
        )
    }
    loadAllImage(imgList,function () {
        drawText(ctx, shareData.name, moduleData.nameObj, fontFamiry);
        multiText(ctx, "        " + shareData.decs, moduleData.decsObj, "'Times New Roman', Times, serif");
        ctx.textAlign = moduleData.textAlign;
        ctx.drawImage(
            imgObj.qrcode,
            moduleData.qrUrlObj.left,
            moduleData.qrUrlObj.top,
            moduleData.qrUrlObj.width,
            moduleData.qrUrlObj.height
        );
        const avatarObj = moduleData.avatarObj;
        const path = avatarObj.width / 2
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        // 绘制用户头像
        ctx.arc(avatarObj.left + path, avatarObj.top + path, avatarObj.width - path, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(imgObj.avatar, avatarObj.left, avatarObj.top, avatarObj.width, avatarObj.height);
        ctx.restore();
        ctx.save();
        // 绘制二维码
        ctx.drawImage(
            imgObj.qrcode,
            moduleData.qrUrlObj.left,
            moduleData.qrUrlObj.top,
            moduleData.qrUrlObj.width,
            moduleData.qrUrlObj.height
        );
        //绘制冒号
        ctx.drawImage(
            imgObj.maohaoImg,
            moduleData.maohaoObj.left,
            moduleData.maohaoObj.top,
            moduleData.maohaoObj.width,
            moduleData.maohaoObj.height
        );
        const height = getTxtOnline(shareData.decs)<480?getTxtOnline(shareData.decs):480; 
        if(shareData.otherAvator.length>=3){ 
            //绘制更多
            ctx.drawImage(
                imgObj.more,
                moduleData.more.left,
                height+80,
                moduleData.more.width,
                moduleData.more.height
                );
        }
        if(shareData.otherAvator.length>0){
             //绘制更多
             ctx.drawImage(
                imgObj.helpTitle,
                220,
                height+10,
                166,
                44
                );
        }
        for(let i=0,left=198;i<3;i++){
            if(shareData.otherAvator.length==1){
                left=282
            }
            if(shareData.otherAvator.length==2){
                left=254
            }
            if(imgObj["otherAvator"+i]) {
                
                ctx.restore();
                ctx.save();
                ctx.beginPath(); 
                const r = 20
                ctx.arc(left+(i*56) + r, height+80 + r, 20, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage( imgObj["otherAvator"+i],left+(i*56),height+80,40,40);  
            }
        }
        cb();



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
function drawReat(ctx) {
    const height = getTxtOnline(shareData.decs)<480?getTxtOnline(shareData.decs):480; 

    if(shareData.otherAvator.length>0){
        // ctx.lineJoin = "round";
        // ctx.fillStyle = "#B99B77"
        // ctx.fillRect(220, height+5, 166, 44);
        // moduleData.statusObj.top = height + 35; 
        // drawText(ctx, shareData.status, moduleData.statusObj, fontFamiry);
        // ctx.save();
        // ctx.beginPath();

    } 
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

function loadImg(url, is_cors = true) {
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


function getTxtWidth(ctx) {
    ctx.font = "36px Arial";
    const width = ctx.measureText(shareData.day).width;
    return width
}