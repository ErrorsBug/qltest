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
export function successCard(bgUrl, datas, cb, cardWidth, cardHeight, styleModule = 'A') {
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
                left: 274,
                top: 940,
                width: 610,
                maxLine:1,
                lineHeight: 60,
                font: 42,
                color: "#333",
                textAlign: "left", 
                bolder: 'bold'
            },
            moneyObj: {
                left: 678,
                top: 245,
                lineHeight: 39,
                font: 27,
                color: "#333",
                textAlign: "left", 
                bolder: 'bold'
            },
            decsObj: {
                left: 120,
                top: 598,
                width: 664,
                lineHeight: 57,
                font: 36,
                color: "#535E7F",
                textAlign: "left",
                maxLine:4 
            },
            statusObj: {
                left: 262,
                top: 870,
                lineHeight: 51,
                font: 36,
                color: "#BBBBBB",
                textAlign: "center",
            },
            statusNextObj: {
                left: 640,
                top: 870,
                lineHeight: 51,
                font: 36,
                color: "#BBBBBB",
                textAlign: "center",
            },
            dayObj: {
                left: 46,
                lineHeight: 50,
                font: 36,
                color: "#fff",
                textAlign: "left",
            },
            qrUrlObj: {
                left: 696,
                top: 1122,
                width: 160,
                height: 160,
            },
            avatarObj: {
                left: 594,
                top: 75,
                width: 170,
                height: 170,
            },
            maohaoObj: {
                left: 84,
                top: 382,
                width: 40,
                height: 26,
            },
            more: {
                left: 681,
                top: 897,
                width: 60,
                height: 60,
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
        {name:'more',url:'https://img.qlchat.com/qlLive/business/D64XF52P-JSZR-QLLZ-1559812604390-YR32MO6XM2ZV.png'},
        {name:'avatorBottom',url:'https://img.qlchat.com/qlLive/business/EZHBOAR7-MKKM-7H4H-1558955642969-LJQQVAZWDMEJ.png'},
        {name:'avatorTop',url:'https://img.qlchat.com/qlLive/business/O6KO8ZU7-YVOW-YSFR-1558955646040-IHUYSRLQY6NF.png'},
    ]
    for(let i=0;i<shareData.otherAvator.length;i++){
        imgList.push(
            {name:'otherAvator'+i,url:shareData.otherAvator[i]},
        )
    }
    if(shareData.name?.length>6){
        shareData.name=shareData.name.slice(0,6)+'...'
    }
    loadAllImage(imgList,function () { 
        ctx.textAlign="center";
        multiText(ctx, shareData.name, moduleData.nameObj, fontFamiry);
        ctx.textAlign="left";
        multiText(ctx, "        " + shareData.decs, moduleData.decsObj, "'Times New Roman', Times, serif");
        ctx.textAlign = moduleData.textAlign;
        ctx.drawImage(imgObj.avatorBottom, 537, 156, 285, 87);
        const avatarObj = moduleData.avatarObj;
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
        ctx.drawImage(imgObj.avatorTop, 573, 213, 210, 45); 
        ctx.textAlign="center";
        drawText(ctx, `获奖:￥${(shareData.money/100).toFixed(2)}`, moduleData.moneyObj, fontFamiry);  
        ctx.textAlign="left";
        // 绘制二维码
        ctx.drawImage(
            imgObj.qrcode,
            moduleData.qrUrlObj.left,
            moduleData.qrUrlObj.top,
            moduleData.qrUrlObj.width,
            moduleData.qrUrlObj.height
        );
        if(shareData.otherAvator.length>=3){ 
            //绘制更多
            ctx.drawImage(
                imgObj.more,
                moduleData.more.left,
                moduleData.more.top,
                moduleData.more.width,
                moduleData.more.height
                );
        }
        for(let i=0;i<4;i++){
            let left=537
            if(shareData.otherAvator.length==1){
                left=left+(3*36)
            }
            if(shareData.otherAvator.length==2){
                left=left+(2*36)
            }
            if(shareData.otherAvator.length==3){
                left=left+(1*36)
            }
            if(imgObj["otherAvator"+(3-i)]) {
                
                ctx.restore();
                ctx.save();
                ctx.beginPath(); 
                const r = 30
                ctx.arc(left+((3-i)*36) + r, 897 + r, 30, 0, 2 * Math.PI);
                ctx.clip(); 
                ctx.drawImage( 
                    imgObj["otherAvator"+(3-i)],left+((3-i)*36),
                    moduleData.more.top,
                    moduleData.more.width,
                    moduleData.more.height
                    ); 
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
    const height = 975;
    ctx.save();
    ctx.textAlign="center";
    drawText(ctx, shareData.status, moduleData.statusObj, fontFamiry); 
    drawText(ctx, shareData.statusNext, moduleData.statusNextObj, fontFamiry); 
    ctx.textAlign="left";
    ctx.save();
    ctx.beginPath();
    
    ctx.moveTo(141, height );
    ctx.lineTo(141 + 252, height );
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#DDDDDD";
    ctx.stroke();
    ctx.save();

    
    ctx.beginPath();
    
    ctx.moveTo(513, height  );
    ctx.lineTo(513 + 252, height  );
    ctx.lineWidth =3;
    ctx.strokeStyle = "#DDDDDD";
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