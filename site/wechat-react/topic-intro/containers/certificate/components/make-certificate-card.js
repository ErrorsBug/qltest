import {
	fillParams,
} from 'components/url-utils';
// import { imgUrlFormat } from "components/util";

var canvasFun = require('@ql-feat/canvas-tools');
var drawText = canvasFun.drawText;
var drawRoundedRect = canvasFun.headBgClipRounded;
var multiText = canvasFun.multiText;
var imageProxy = canvasFun.imageProxy('/api/wechat/image-proxy?url=');
var drawImage = canvasFun.drawImage;
var drawStyleImage = canvasFun.drawStyleImage;
var imgUrlFormat = canvasFun.imgUrlFormat;


var qrcode = null;
var shareData = null;
var officialKey =null;
var canvas = null;
var fontFamiry = 'Source Han Sans CN';
var haibaopic= null;
var shareData = null;
var personCountBg = 'https://img.qlchat.com/qlLive/coral/push-card-count-bg.png';
var bg_ptbj = 'https://img.qlchat.com/qlLive/camp/certificate-card-pt.png',
    bg_yxbj = 'https://img.qlchat.com/qlLive/camp/certificate-card-yx.png';



var center=0;
var moduleData={};
var bgMap={};

var styleModule='Certificate';
var bgUrl = '';
/**
 * 生成sharecard图片
 */     
export function makeCertificateCard ( datas, cb, type) {
    shareData = datas;
        if (shareData.imageUrl) {
            bgUrl = shareData.imageUrl
        } else {
            bgUrl = (type === 'normal')? bg_ptbj : bg_yxbj;
        }

    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas.getContext('2d');

    canvas.width = 750;
    canvas.height = 1065;

    center=canvas.width / 2;
    //模板ABC,Z代表自定义模板
    var moduleList={
        Certificate:{
            headObj: {
                left: center - 40,
                top: 335,
                width: 80,
                height: 80,
                isClip: true,
                x: center - 40,
                y: 335,
                w: 80,
                h: 80,
                r_all:40,
                r: {
                    r_top_right:40,
                    r_bottom_right:40,
                    r_bottom_left:40,
                    r_top_left:40,
                },
                bdWidth: 0,
                bdColor: "rgba(0,0,0,0)",
                bgColor: "rgba(0,0,0,0)",
            },
            userNameObj: {
                top: 455,
                left: center,
                font: 30,
                color: "#333",
                stringlength:8,
            },
            messageTitle:{
                top: type ==='normal'? 280 : 305,
                left: center,
                font: 80,
                color: type ==='normal'? "#666":'#B59771',
                text: shareData.name,
                bolder: true,
            },
            messageTips:{
                top: 655,
                left: center,
                font: 24,
                color: "#333333",
                text: shareData.desc,
                width: 500,
                lineHeight: 40,
                maxLine:2,
            },
            praiseObj:{
                top: 536,
                left: 230,
                font: 32,
                color: "#333333",
                text: shareData.likedCount,
                bolder: true,
            },
            homeworkObj:{
                top: 536,
                left: 520,
                font: 32,
                color: "#333333",
                text: shareData.homeworkCount,
                bolder: true,
            },
            praiseTextObj:{
                top: 580,
                left: 230,
                font: 32,
                color: "#333333",
                text: '收获点赞数',
            },
            homeworkTextObj:{
                top: 580,
                left: 520,
                font: 32,
                color: "#333333",
                text: '完成作业数',
            },
            qrCodeObj: {
                top: 790,
                left: center - 85,
                width: 170,
                height: 170,
            },
            textAlign: "center"
        },
    }

    moduleData=moduleList[styleModule];

    genBg(canvas, bgUrl, function () {
        genContent(canvas, function () {
            cb(canvas.toDataURL('image/png', 0.9));
        });
    });
}

/**
 * 生成canvas内容
 * 
 * @param {any} canvas 
 * @param {any} options 
 */
function genContent (canvas, cb) {
    var ctx = canvas.getContext('2d');
    loadImage(ctx,function () {
        
        // 绘文字
        ctx.textAlign =  moduleData.textAlign;
        if(shareData.nickName&&moduleData.userNameObj){
            drawText(ctx, shareData.userName||shareData.nickName , moduleData.userNameObj , fontFamiry);
        }
        
        if(moduleData.messageTitle){
            ctx.save();
            moduleData.messageTitle.x && drawRoundedRect(ctx, moduleData.messageTitle);
            ctx.save();
            drawText(ctx, moduleData.messageTitle.text , moduleData.messageTitle , fontFamiry);
        }

        if(moduleData.messageTips){
            if(moduleData.messageTips.textAlign){ctx.textAlign = moduleData.messageTips.textAlign;}

            multiText(ctx, moduleData.messageTips.text,  moduleData.messageTips);
            if(moduleData.messageTips.textAlign){ctx.textAlign =  moduleData.textAlign;}
        }
        
        if(shareData.showVoteCount == 'Y' && shareData.showHomeworkCount == 'Y'){
            drawText(ctx, moduleData.praiseObj.text , moduleData.praiseObj , fontFamiry);
            drawText(ctx, moduleData.homeworkObj.text , moduleData.homeworkObj , fontFamiry);
            drawText(ctx, moduleData.homeworkTextObj.text , moduleData.homeworkTextObj , fontFamiry);
            drawText(ctx, moduleData.praiseTextObj.text , moduleData.praiseTextObj , fontFamiry);
            
        } else if (shareData.showVoteCount == 'N' && shareData.showHomeworkCount == 'Y') {
            moduleData.homeworkObj.left = canvas.width / 2
            moduleData.homeworkTextObj.left = canvas.width / 2
            drawText(ctx, moduleData.homeworkObj.text , moduleData.homeworkObj , fontFamiry);
            drawText(ctx, moduleData.homeworkTextObj.text , moduleData.homeworkTextObj , fontFamiry);

        } else if (shareData.showVoteCount == 'Y' && shareData.showHomeworkCount == 'N') {
            moduleData.praiseObj.left = canvas.width / 2
            moduleData.praiseTextObj.left = canvas.width / 2
            drawText(ctx, moduleData.praiseObj.text , moduleData.praiseObj , fontFamiry);
            drawText(ctx, moduleData.praiseTextObj.text , moduleData.praiseTextObj , fontFamiry);
        }

        cb();
    });
    
}

/**
 * 加载头像和二维码
 * 
 * @param {any} cb 
 */
function loadImage (ctx,cb) {
    if (!qrcode) {
        qrcode = new Image();
        qrcode.crossOrigin = 'Anonymous';
        qrcode.src = imageProxy("http://qr.topscan.com/api.php?text="+encodeURIComponent(window.location.origin+"/wechat/page/training-intro?campId="+shareData.campId));
        if(moduleData.headObj){//头像
            drawStyleImage(ctx, imgUrlFormat(shareData.headImgUrl), moduleData.headObj, imageProxy, ()=>{
                drawStyleImage(ctx, imgUrlFormat(qrcode.src || shareData.qrCode), moduleData.qrCodeObj, imageProxy, ()=>{
                    cb();
                })
            })
        }else{
            cb();
        }
    } else {
        cb();
    }

}

function genBg (canvas,bgUrl, cb) {
    var ctx = canvas.getContext('2d');
    if(bgUrl!=""){
        if (bgMap[encodeURIComponent(bgUrl)]) {
            __drawBgPic(ctx, bgMap[encodeURIComponent(bgUrl)]);
            cb();
        } else {
            var bgImg = new Image();
            bgImg.crossOrigin = 'Anonymous';

            bgImg.src = imageProxy(bgUrl);
            
            bgImg.onload = function () {
                bgMap[encodeURIComponent(bgUrl)] = bgImg;
                __drawBgPic(ctx, bgImg);
                cb();
                
            }
        }
    }else{
        __drawBgPic(ctx,"");
        cb();
    }
        

}

function __drawBgPic(ctx, bgImg) {    
    if(bgImg!=""){
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }else{
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.fillStyle="#fff";
        ctx.lineTo(canvas.width,0);
        ctx.lineTo(canvas.width,canvas.height);
        ctx.lineTo(0,canvas.height);
        ctx.closePath();
        ctx.fill();
    }
}