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
var userInfoData = null;
var personCountBg = 'https://img.qlchat.com/qlLive/coral/push-card-count-bg.png';



var center=0;
var moduleData={};
var bgMap={};

var styleModule='';
/**
 * 生成sharecard图片
 */     
export function pushDistributionCardMaking (bgUrl, datas, userInfo, cb, reset,stylemodule,cardWidth,cardHeight,thisofficialKey,qrurl) {
    shareData = datas;
    officialKey = thisofficialKey;
    styleModule= stylemodule ;
    haibaopic = imgUrlFormat(shareData.businessImage,'@296h_480w_1e_1c_2o');
    userInfoData = userInfo;

    if(qrurl){shareData.qrurl=qrurl;}
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas.getContext('2d');

    canvas.width = cardWidth||640;
    canvas.height = cardHeight||1136;

    center=canvas.width / 2;
    //模板ABC,Z代表自定义模板
    var moduleList={
        PersonCount:{
            headObj: {
                left: 27,
                top: 27,
                width: 80,
                height: 80,
                isClip: true,
                x: 27,
                y: 27,
                w: 80,
                h: 80,
                r_all:40,
                r: {
                    r_top_right:40,
                    r_bottom_right:40,
                    r_bottom_left:40,
                    r_top_left:40,
                },
                bdWidth: 2,
                bdColor: "#CCCCCC",
                bgColor: "rgba(0,0,0,0.8)",
            },
            userNameObj: {
                top: 60,
                left: 230,
                font: 30,
                color: "#666",
                stringlength:8,
            },
            businessNameObj: {
                top: 505,
                left: 50,
                font: 30,
                color: "#333",
                width: shareData.browseNum && shareData.browseNum >= 500 ? 360: 500,
                lineHeight: 50,
                maxLine:2,
            },
            headbg: {
                left: center - 273,
                top: 120,
                width: 546,
                height: 341,
            },
            liveNameObj:{
                top: 620,
                left: 50,
                font: 22,
                color: "#666",
                text: "直播间："+ (shareData.liveName).substring(0,12),
            },
            qrObj: {
                left: 120,
                top: canvas.height - 220,
                width: 150,
                height: 150
            },
            icon_1:{
                left: 60,
                top: 664,
                width: 20,
                height: 20
            },
            browseNumObj:{
                top: 556,
                left: 510,
                font: 40,
                color: "#666",
                text: (shareData.browseNum && shareData.browseNum >10000? (shareData.browseNum/10000).toFixed(1) : shareData.browseNum),
                textAlign: 'center',
            },
            browseNumCiObj:{
                top: 608,
                left: 510,
                font: 24,
                color: "#999",
                text: (shareData.browseNum && shareData.browseNum >10000? '万' : '') + '人次',
            },
            browseNumBgObj:{
                left: 440,
                top: 480,
                width: 130,
                height: 138
            },
            messageGuide: {
                top: 100,
                left: 124,
                font: 26,
                color: "#666",
                text:'这个课程很赞，值得学习',
            },
            messageTitle:{
                top: 56,
                left: 126,
                font: 24,
                color: "#FF9F00",
                text:'好学不倦',
                bolder: true,
                x: 124,
                y: 30,
                w: 100,
                h: 36,
                r: 10,
                bdWidth: 2,
                bdColor: "#FF9F00",
                bgcolor: "#fff"
            },
            textAlign: "left"
        },
    }

    moduleData=moduleList[styleModule];
    if (reset === true) {
        qrcode = null;
    }

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
        //外框contentBorder
        if(moduleData.contentBorder){
            ctx.save();
            drawRoundedRect(ctx,moduleData.contentBorder);
            moduleData.contentBorder.lineNum>=2 &&drawRoundedRect(ctx,moduleData.contentBorder);
            ctx.save();
        }
        
        // 绘文字
        ctx.textAlign =  moduleData.textAlign;
        
        if(userInfoData.name&&moduleData.userNameObj){
            drawText(ctx, userInfoData.name , moduleData.userNameObj , fontFamiry);
        }
        if(moduleData.messageGuide){
            drawText(ctx, moduleData.messageGuide.text , moduleData.messageGuide , fontFamiry);
        }
        if(moduleData.messageTitle){
            ctx.save();
            moduleData.messageTitle.x && drawRoundedRect(ctx, moduleData.messageTitle);
            ctx.save();
            drawText(ctx, moduleData.messageTitle.text , moduleData.messageTitle , fontFamiry);
        }
        
        if(moduleData.liveNameObj){
            drawText(ctx, moduleData.liveNameObj.text , moduleData.liveNameObj , fontFamiry);
        }

        if(moduleData.browseNumObj && shareData.browseNum>=500){

            moduleData.browseNumObj.textAlign&&(ctx.textAlign = moduleData.browseNumObj.textAlign);
            drawText(ctx, moduleData.browseNumObj.text , moduleData.browseNumObj , fontFamiry);
            if(moduleData.browseNumCiObj){
                drawText(ctx, moduleData.browseNumCiObj.text , moduleData.browseNumCiObj , fontFamiry);
            }
            ctx.textAlign = moduleData.textAlign;
        }
            
        if(moduleData.businessNameObj){
            if(moduleData.businessNameObj.textAlign){ctx.textAlign = moduleData.businessNameObj.textAlign;}

            multiText(ctx, shareData.businessName,  moduleData.businessNameObj);
            if(moduleData.businessNameObj.textAlign){ctx.textAlign =  moduleData.textAlign;}
        }

        ctx.drawImage(
            qrcode,
            moduleData.qrObj.left,
            moduleData.qrObj.top,            
            moduleData.qrObj.width,
            moduleData.qrObj.height
        );
        
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
        if(shareData.qrurl){
            qrcode.src = imageProxy(shareData.qrurl);
        }else if(shareData.url){
            let url=(/(officialKey)/.test(shareData.url)?shareData.url:fillParams({officialKey},shareData.url));
            qrcode.src = imageProxy("http://qr.topscan.com/api.php?text="+encodeURIComponent(url));
            // qrcode.src = imageProxy(shareData.url); 
        }else{
            if(shareData.businessType==="CHANNEL"){
                qrcode.src = imageProxy("http://qr.topscan.com/api.php?text="+encodeURIComponent(window.location.origin+"/live/channel/channelPage/"+shareData.businessId+".htm?officialKey="+officialKey));
            }else{
                qrcode.src = imageProxy("http://qr.topscan.com/api.php?text="+encodeURIComponent(window.location.origin+"/wechat/page/topic-intro?topicId="+shareData.businessId+"&officialKey="+officialKey));
            }

        }
        qrcode.onload = function () {
            if(moduleData.headbg){//海报头图/* 话题头图*/
                drawStyleImage(ctx, haibaopic, moduleData.headbg, imageProxy, ()=>{
                    if(moduleData.headObj){//头像
                        drawStyleImage(ctx, imgUrlFormat(userInfoData.headImgUrl), moduleData.headObj, imageProxy, ()=>{
                            /* 画人次框框icon browseNumBgObj */
                            drawImage(ctx, (personCountBg&&moduleData.browseNumBgObj&&shareData.browseNum>=500&&!bgMap[encodeURIComponent(personCountBg)]?personCountBg: ''), moduleData.browseNumBgObj, imageProxy,function(pscbg){
                                pscbg&&(bgMap[encodeURIComponent(personCountBg)] = pscbg);

                                cb();

                            },moduleData.browseNumBgObj&&shareData.browseNum>=500&&bgMap[encodeURIComponent(personCountBg)]);
                            
                        })

                    }else{
                        cb();
                    }
                })
            }
            
        };
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