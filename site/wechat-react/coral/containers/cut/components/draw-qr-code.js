
var qrCodeUrl = null;
var qrcode= null;
var qrcanvas = null;
var fontFamiry = 'Source Han Sans CN';

var center=0;
var moduleData={};
var bgMap={};
 
var qrcodeModule = '';
export function cutQrCode (bgUrl,datas, cb, reset,stylemodule,cardWidth,cardHeight) {
    console.log(bgUrl)
    console.log(datas.qrCodeUrl);
    qrcodeModule= stylemodule;
    qrCodeUrl = datas.qrCodeUrl;
    if (!qrcanvas) {
        qrcanvas = document.createElement('canvas');
    }
    var ctx = qrcanvas.getContext('2d');

    qrcanvas.width = cardWidth||400;
    qrcanvas.height = cardHeight||200;

    center=qrcanvas.width / 2;
    //模板ABC,Z代表自定义模板
    var moduleList={
        A:{
            qrObj:{
                left:0,
                top:0,
                width:300,
                height:300,
            },
        }
    }

    moduleData=moduleList[qrcodeModule];
    if (reset === true) {
        qrcode = null;
    }

    genBg(qrcanvas, bgUrl, function () {
        
        genContent(qrcanvas, function () {
            
            cb(qrcanvas.toDataURL('image/jpeg', 0.9));
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
    console.log(qrCodeUrl);
    if (!qrcode) {
        qrcode = new Image();
        qrcode.crossOrigin = 'Anonymous';
        qrcode.src = imageProxy(qrCodeUrl);        
        qrcode.onload = function () {
            cb();
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
        ctx.drawImage(bgImg, 0, 0, qrcanvas.width, qrcanvas.height);
        ctx.restore();
    }else{
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.fillStyle="#fff";
        ctx.lineTo(qrcanvas.width,0);
        ctx.lineTo(qrcanvas.width,qrcanvas.height);
        ctx.lineTo(0,qrcanvas.height);
        ctx.closePath();
        ctx.fill();
    }
}


