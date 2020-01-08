
import { imgUrlFormat } from "components/util";

var qrcode = null;
var headImage = null;
var shareData = null;
// var officialKey =null;
var canvas = null;
var fontFamiry = 'Source Han Sans CN';
var formateTime={
    date:'',
    day:'',
    time:'',
};
var shareData=null;



var center=0;
var moduleData={};
var bgMap={};

var styleModule='';
/**
 * 生成sharecard图片
 */     
export function coralThemeCardMaking (bgUrl,datas, cb, reset,stylemodule,cardWidth,cardHeight) {
    // officialKey = thisofficialKey;
    styleModule= stylemodule;
    shareData = datas;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas.getContext('2d');

    canvas.width = cardWidth||640;
    canvas.height = cardHeight||1136;

    center=canvas.width / 2;
    //模板ABC,Z代表自定义模板
    var moduleList={
        Z:{
            headObj:{
                left:70,
                top:80,
                width:80,
                height:80,
                border:0,
                borderColor:"rgba(0,0,0,0)",
            },
            userNameObj:{
                top:70,
                left:140,
                font:24,
                color:"#fff",
            },
            qrObj:{
                left:canvas.width-210,
                top:canvas.height-226,
                width:180,
                height:180,
            },
            contentBorder:{
                x:0,
                y:0,
                w:canvas.width,
                h:120,
                r:1,
                bdWidth:2,
                bdColor:"rgba(0,0,0,0.0)",
                bgcolor:'rgba(0, 0, 0, 0.4)',
                isLinear:true,
                linearColor:"rgba(0,0,0,0.0)",
                lineNum:1,
            },
            textAlign:"left",
        }
    }

    moduleData=moduleList[styleModule];
    if (reset === true) {
        qrcode = null;
        headImage = null;
    }

    genBg(canvas, bgUrl, function () {
        genContent(canvas, function () {
            cb(canvas.toDataURL('image/jpeg', 0.9));
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
    loadImage(function () {

        // 画头像
        ctx.save();
        ctx.beginPath();
        var userNameStr=moduleData.userNameObj.stringlength?shareData.userName.slice(0, moduleData.userNameObj.stringlength||30):shareData.userName;
        if(moduleData.headObj.isChangeposition){
            ctx.arc(moduleData.userNameObj.left - ctx.measureText(userNameStr).width-40 ,moduleData.headObj.top ,moduleData.headObj.width/2, 0, 2 * Math.PI);
        }else{
            ctx.arc(moduleData.headObj.left ,moduleData.headObj.top ,moduleData.headObj.width/2, 0, 2 * Math.PI);
            
        }
        ctx.strokeStyle =  moduleData.headObj.borderColor;
        ctx.lineWidth = moduleData.headObj.border;
        ctx.stroke();
        ctx.clip();
        if(moduleData.headObj.isChangeposition){
            console.log(ctx.measureText(userNameStr).width);
            ctx.drawImage(
                headImage,
                moduleData.userNameObj.left - moduleData.headObj.width/2- ctx.measureText(userNameStr).width-40, moduleData.headObj.top-moduleData.headObj.width/2 ,moduleData.headObj.width,moduleData.headObj.height
            );  
        }else{
            ctx.drawImage(
                headImage,
                moduleData.headObj.left - moduleData.headObj.width/2, moduleData.headObj.top-moduleData.headObj.width/2 ,moduleData.headObj.width,moduleData.headObj.height
            );
        }
        
        ctx.restore();
        
        ctx.textAlign =  moduleData.textAlign;

        // 绘文字
        moduleData.userNameObj.textAlign?ctx.textAlign = moduleData.userNameObj.textAlign:null;
        ctx.font = moduleData.userNameObj.font+'px ' + fontFamiry;
        ctx.fillStyle = moduleData.userNameObj.color;
        ctx.fillText(userNameStr, moduleData.userNameObj.left, moduleData.userNameObj.top);
        // ctx.fillText(shareData.userName.slice(0, 30), moduleData.userNameObj.left, moduleData.userNameObj.top);
        moduleData.userNameObj.textAlign?ctx.textAlign =  moduleData.textAlign :null;


      
        

        if(moduleData.message_qrcode){
            ctx.font = moduleData.message_qrcode.font+'px ' + fontFamiry;
            ctx.fillStyle = moduleData.message_qrcode.color;
            ctx.fillText(moduleData.message_qrcode.text?moduleData.message_qrcode.text:'长按识别二维码参加课程', moduleData.message_qrcode.left, moduleData.message_qrcode.top)
        }
        /* 画二维码*/
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
function loadImage (cb) {
    if (!headImage) {
        headImage = new Image();
        headImage.crossOrigin = 'Anonymous';
        headImage.src = imageProxy(imgUrlFormat(shareData.headImg));  
        // window.location.origin+"/wechat/page/coral/intro?officialKey="+officialKey     thisQrcodeUrl
        headImage.onload = function () {
            if (!qrcode) {
                qrcode = new Image();
                qrcode.crossOrigin = 'Anonymous';
                qrcode.src = imageProxy(shareData.qrcodeUrl);  
                // window.location.origin+"/wechat/page/coral/intro?officialKey="+officialKey     thisQrcodeUrl
                qrcode.onload = function () {
                    cb();
                };
            } else {
                cb();
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
            __drawBg(ctx, bgMap[encodeURIComponent(bgUrl)]);
            cb();
        } else {
            var bgImg = new Image();
            bgImg.crossOrigin = 'Anonymous';

            bgImg.src = imageProxy(bgUrl);
            
            bgImg.onload = function () {
                bgMap[encodeURIComponent(bgUrl)] = bgImg;
                __drawBg(ctx, bgImg);
                cb();
                
            }
        }
    }else{
        __drawBg(ctx,"");
        cb();
    }
    
    
}
function imageProxy (url) {
    return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
}

function __drawBg(ctx, bgImg) {    
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


