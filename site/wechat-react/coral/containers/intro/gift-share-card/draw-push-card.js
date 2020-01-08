var qrcode = null;
var shareData = null;
// var officialKey =null;
var canvas = null;
var fontFamiry = 'Source Han Sans CN';
var formateTime={
    date:'',
    day:'',
    time:'',
};
var thisQrcodeUrl=null;



var center=0;
var moduleData={};
var bgMap={};

var styleModule='';
/**
 * 生成sharecard图片
 */     
export function pushDistributionCardMaking (bgUrl, cb, reset,stylemodule,cardWidth,cardHeight,qrcodeUrl) {
    // officialKey = thisofficialKey;
    styleModule= stylemodule;
    thisQrcodeUrl = qrcodeUrl;
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas.getContext('2d');

    canvas.width = cardWidth||640;
    canvas.height = cardHeight||1136;

    center=canvas.width / 2;
    //模板ABC,Z代表自定义模板
    var moduleList={
        A:{
            qrObj:{
                left:center-78,
                top:canvas.height-305,
                width:156,
                height:156,
            },
        }
    }

    moduleData=moduleList[styleModule];
    if (reset === true) {
        qrcode = null;
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
    if (!qrcode) {
        qrcode = new Image();
        qrcode.crossOrigin = 'Anonymous';
        qrcode.src = imageProxy(thisQrcodeUrl);  
        // window.location.origin+"/wechat/page/coral/intro?officialKey="+officialKey     thisQrcodeUrl
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


