import { drawText, imageProxy, multiText, drawImage , headBgClipRounded } from '@ql-feat/canvas-tools';
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
export function cardCommunity(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
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
                top: 678+67,
                left: 562.5,
                lineHeight: 96,
                font: 67,
                color: "#333",
                textAlign: "center",
                border:'bold'
            },
            decsObj: {
                top: 891+45-41,
                left: 72,
                width: 975,
                lineHeight: 75,
                font: 45,
                color: "rgba(102,102,102,1)",
                textAlign: "left", 
                maxLine:4,
            },
            statusObj: {
                top: 801+41,
                left: 562.5,
                lineHeight: 57,
                width: 900,
                font: 41,
                color: "rgba(224,65,79,1)",
                textAlign: "center",
                maxLine:1,
            },
            dayObj: {
                left: 46,
                lineHeight: 50,
                font: 36,
                color: "#fff",
                textAlign: "left",
            },
            qrUrlObj: {
                left: 864,
                top: 1434,
                width: 186,
                height: 186,
            },
            avatarObj: {
                left: 468,
                top: 462,
                width: 186,
                height: 186,
            },
            vlogoObj: {
                left: 562.5,
                top: 808,
                width: 42,
                height: 42,
            },
            more: {
                left: 364,
                top: 544,
                width: 44,
                height: 44,
            },  
            cateListObj:{
                left: 96,
                top: 1124+39,
                lineHeight: 54,
                font: 39,
                color: "rgba(153,153,153,1)",
                textAlign: "left", 
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
    
    let imgList = [
        {name:'avatar',url:shareData.picUrl},
        {name:'qrcode',url:shareData.qrUrl},
        {name:'vlogo',url:shareData.vlogo},
        {name:'more',url:'https://img.qlchat.com/qlLive/business/ZBY9YCJE-UZBR-QZ3Z-1558951425698-NZMDJRYHHZFX.png'},
        {name:'helpTitle',url:'https://img.qlchat.com/qlLive/business/Z5BHYC98-DDMS-2I33-1559724206473-YF3J5L2NHSCJ.png'},
    ] 
    loadAllImage(imgList,function () {
        
        ctx.textAlign="center"; 
        drawText(ctx, shareData.name, moduleData.nameObj, fontFamiry);
        console.log(shareData.status)
        if(shareData.status){ 
            drawText(ctx, shareData.status.slice(0,23), moduleData.statusObj, fontFamiry);
            let width =ctx.measureText(shareData.status.slice(0,23)).width
            width=width>moduleData.statusObj.width ?moduleData.statusObj.width:width 
            ctx.drawImage(
                imgObj.vlogo,
                moduleData.vlogoObj.left-width/2- moduleData.vlogoObj.width-20,
                moduleData.vlogoObj.top,
                moduleData.vlogoObj.width,
                moduleData.vlogoObj.height
            );  
            moduleData.decsObj.top=moduleData.decsObj.top+41
        }
        ctx.textAlign="left"; 
        let height=moduleData.decsObj.top
        if(shareData.decs){
            multiText(ctx, shareData.decs, moduleData.decsObj, "'Times New Roman', Times, serif");
            height = getTxtOnline(shareData.decs) > 1218?1218:getTxtOnline(shareData.decs)
        } 
        moduleData.cateListObj.top=height+50
        shareData.cateList?.map(async (item,index)=>{  
            drawText(ctx, item.name, {...moduleData.cateListObj,top:2000}, fontFamiry);  //获取宽
            let width =ctx.measureText(item.name).width   
            if(moduleData.cateListObj.left+width>1000){
                return false
            }
            headBgClipRounded(ctx,{
                x:moduleData.cateListObj.left-24, 
                y:height+3, 
                w:width+48, 
                h:66, 
                r:{
                    r_top_right:42,
                    r_bottom_right:42,
                    r_bottom_left:42,
                    r_top_left:42
                },  
                bdColor:'rgba(247,247,247,1)',
                bgcolor:'rgba(247,247,247,1)', //背景色（如果isLinear为true时，bgcolor作为渐变第一色） 
                })
            drawText(ctx, item.name, moduleData.cateListObj, fontFamiry);
            let left =moduleData.cateListObj.left+width+75
            moduleData.cateListObj.left=left
            console.log(moduleData.cateListObj,'shareData.cateList')
        })
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