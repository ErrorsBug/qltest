var headImage = null;
var qrcode = null;
var headbg = null;
var numImfArray = [];
var shareData = null;
var canvas = null;
var fontFamiry = 'Source Han Sans CN';
var fingerprint = 'https://img.qlchat.com/qlLive/sharecard/fingerprint.png';
var businessImg="https://img.qlchat.com/qlLive/shareCard/zhang_pic.png";
var haibaopic ='';

var center=0;
var moduleData={};

var styleModule='';
var window = window || {}

window.bgMap = {};

    

/**
 * 生成sharecard图片
 */
module.exports = function (bgUrl, datas, cb, reset, stylemodule) {
    // if (!window) return;

    console.log(datas)
    shareData = datas;
    styleModule= stylemodule ;
    haibaopic =datas.headImgUrl;
    
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 1136;

    center=canvas.width / 2;
    
//模板ABC,Z代表自定义模板
    var moduleList={
        ACHIEVE_1:{
            headbg: {
                left: center - 210,
                top: 200,
                width: 440,
                height: 250,
                isClip: true,
                x: center - 210,
                y: 200,
                w: 440,
                h: 250,
                r_all: 10,
                r: {
                    r_top_left: 10,
                    r_top_right: 10,
                    r_bottom_right: 10,
                    r_bottom_left: 10
                },
                bdWidth: 4,
                bdColor: "#FF9400",
                bgcolor: "rgba(0,0,0,0.8)",
                lineNum: 1
            },
            courseNameObj:{
                top: 570,
                left: 110,
                font: 32,
                color: "#333",
                lineHeight: 50,
                width:440,
            },
            liveNameObj:{
                top: 510,
                left: 110,
                font: 28,
                color: "#333",
                lineHeight: 50,
            },
            numObj:{
                top: 750,
                left: 240,
                width: shareData.money.toString().split("").length>5?35:55,//每个数字的占位
                height: shareData.money.toString().split("").length>5?75:95,
            },
            qrObj:{
                left:430,
                top: 730,
                width:140,
                height:140,
            },
            qrMessage:{
                top: canvas.height-246,
                left: canvas.width -215,
                font: 18,
                color: "#333",
                text:'长按扫码领取优惠',
            },
            textAlign:"left",
        },
       
    }

    moduleData=moduleList[styleModule];

    if (reset === true) {
        headImage = null;
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
        //外框contentBorder
        if(moduleData.contentBorder){
            drawRoundedRect(ctx,moduleData.contentBorder.x,moduleData.contentBorder.y,moduleData.contentBorder.w,moduleData.contentBorder.h,moduleData.contentBorder.r,moduleData.contentBorder.bdWidth,moduleData.contentBorder.bdColor,moduleData.contentBorder.bgcolor,moduleData.contentBorder.isLinear,moduleData.contentBorder.linearColor);
            moduleData.contentBorder.lineNum>=2 &&drawRoundedRect(ctx,moduleData.contentBorder.x-6,moduleData.contentBorder.y-6,moduleData.contentBorder.w+12,moduleData.contentBorder.h+12,moduleData.contentBorder.r,moduleData.contentBorder.bdWidth,moduleData.contentBorder.bdColor,moduleData.contentBorder.bgcolor,moduleData.contentBorder.isLinear,moduleData.contentBorder.linearColor);
        }

        if (shareData.receiveDayNum > 0) {
            
            // 画导语
            ctx.save();
            ctx.font = '26'+'px ' + fontFamiry;        
            ctx.textAlign =  moduleData.textAlign;
            var tipText = "一起加入打卡，坚持" + shareData.receiveDayNum + '天瓜分奖金';
            var tipTextWidth = ctx.measureText(tipText).width;
            var tipTextLeft = center - tipTextWidth / 2;
            var textBoxWidth = tipTextWidth + 40;
            var textBoxLeft = center - textBoxWidth / 2;
            drawRoundedRect(ctx, textBoxLeft, 285, textBoxWidth, 50, 25, 2, '#ffffff', 'rgba(0,0,0,0.3)')
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle = '#fff';
            ctx.fillText(tipText, tipTextLeft, 320);
            // drawRoundedRect(ctx,x,y,w,h,r,bdWidth,bdColor,bgcolor,isLinear,linearColor)
        }

        /* 课程头图*/
        if (moduleData.headbg) {
            ctx.save();
            if (moduleData.headbg.isClip) {
                ctx.beginPath();
                moduleData.headbg.r && headBgClipRounded(ctx, moduleData.headbg.x, moduleData.headbg.y, moduleData.headbg.w, moduleData.headbg.h, moduleData.headbg.r, moduleData.headbg.bdWidth, moduleData.headbg.bdColor, moduleData.headbg.bgcolor, moduleData.headbg.isLinear, moduleData.headbg.linearColor);
                ctx.clip();
            } else if (moduleData.headbg.isClipDialog) {
                ctx.beginPath();
                moduleData.headbg.r_all && headBgClipDialog(ctx, moduleData.headbg.x, moduleData.headbg.y, moduleData.headbg.w, moduleData.headbg.h, moduleData.headbg.r_all, moduleData.headbg.bdWidth, moduleData.headbg.bdColor, moduleData.headbg.bgcolor, moduleData.headbg.isLinear, moduleData.headbg.linearColor);
                ctx.clip();
            }

            moduleData.headbg.rotate && ctx.rotate(moduleData.headbg.rotate * Math.PI / 180);

            ctx.drawImage(window.bgMap[encodeURIComponent(haibaopic)], moduleData.headbg.left, moduleData.headbg.top, moduleData.headbg.width, moduleData.headbg.height);
            ctx.restore();
            ctx.closePath();
        }

        

        // 课程标题文字
        ctx.font = 'bold '+moduleData.courseNameObj.font+'px ' + fontFamiry;
        var limitLenght = isChinese(shareData.courseName) ? 12 : 20
        var courseName = shareData.courseName.length > limitLenght ? shareData.courseName.slice(0,limitLenght) + '...' :  shareData.courseName;
        var titleText =  courseName;
        var titleWidth = ctx.measureText(titleText).width;
        var titleLeft = moduleData.courseNameObj.left;
        ctx.fillStyle = moduleData.courseNameObj.color;
        multiText(ctx, titleText,  titleLeft,  moduleData.courseNameObj.top, moduleData.courseNameObj.width||305, 2, 50)

        if (moduleData.liveNameObj) {
            ctx.font = moduleData.liveNameObj.font + 'px ' + fontFamiry;
            ctx.fillStyle = moduleData.liveNameObj.color;
            var liveName = shareData.liveName;
            if (liveName.length > 12) {
                liveName = liveName.slice(0, 12);
                liveName += '...';
            }
            ctx.fillText(liveName, moduleData.liveNameObj.left, moduleData.liveNameObj.top);
        }

        if(moduleData.qrMessage){
            ctx.font = moduleData.qrMessage.font + 'px ' + fontFamiry;
            ctx.fillStyle = moduleData.qrMessage.color;
            var liveName = shareData.liveName;
            if (liveName.length > 12) {
                liveName = liveName.slice(0, 12);
                liveName += '...';
            }
            ctx.fillText(moduleData.qrMessage.text, moduleData.qrMessage.left, moduleData.qrMessage.top);
        }



        // 绘制打卡天数
        ctx.save();
        var couponMoneyNumText = '￥'+shareData.money;
        showNumDraw(ctx,couponMoneyNumText);
        ctx.restore();

        /* 画二维码*/

        // ctx.save();
        // ctx.fillStyle = '#e5e5e5';
        // ctx.fillRect(
        //     moduleData.qrObj.left - 2,
        //     moduleData.qrObj.top - 2,            
        //     moduleData.qrObj.width + 4,
        //     moduleData.qrObj.height + 4
        // )
        // ctx.fileStyle =  "#000";
        // ctx.stroke();
        // ctx.clip();
        ctx.drawImage(
            qrcode,
            moduleData.qrObj.left,
            moduleData.qrObj.top,            
            moduleData.qrObj.width,
            moduleData.qrObj.height
        );
        // ctx.restore();
        // ctx.closePath();

        // if(moduleData.figerObj){
        //     /* 画指纹*/
        //     ctx.drawImage(
        //         window.bgMap[encodeURIComponent(fingerprint)],
        //         moduleData.figerObj.left,
        //         moduleData.figerObj.top,
        //         moduleData.figerObj.width,
        //         moduleData.figerObj.height
        //     )
        // };
        
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
        if (!/^data:image\/\w+;base64,/.test(shareData.shareUrl)) {
            qrcode.crossOrigin = 'Anonymous';
        }
        qrcode.src = imageProxy(shareData.shareUrl);
        qrcode.onload = function () {
            headbg = new Image();
            headbg.crossOrigin = 'Anonymous';
            headbg.src = imageProxy(shareData.headImgUrl + '?x-oss-process=image/resize,h_322,w_515,m_fill,limit_0');
            headbg.onload = function () {
                window.bgMap[encodeURIComponent(haibaopic)] = headbg;
                loadNumImg(cb);
            }
        };
    } else {
        cb();
    }
}

function genBg (canvas,bgUrl, cb) {
    var ctx = canvas.getContext('2d');
    
    
    // var bgUrl="https://img.qlchat.com/qlLive/liveCommon/adminImg-B.png";
    // https://img.qlchat.com/qlLive/liveCommon/adminImg-B.png
    // https://img.qlchat.com/qlLive/liveCommon/adminImg-C.png
    
    if (window.bgMap[encodeURIComponent(bgUrl)]) {
        __drawBg(ctx, window.bgMap[encodeURIComponent(bgUrl)]);
        cb();
    } else {
        var bgImg = new Image();
        bgImg.crossOrigin = 'Anonymous';

        bgImg.src = imageProxy(bgUrl);

        bgImg.onload = function () {
            window.bgMap[encodeURIComponent(bgUrl)] = bgImg;
            __drawBg(ctx, bgImg);
            cb();
        }
    }

}

function __drawBg(ctx, bgImg) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}





function timeParse (timeStamp) {
    var t = new Date(timeStamp);
    var week = '';

    switch (t.getDay()) {
        case 1: week = '一';break;
        case 2: week = '二';break;
        case 3: week = '三';break;
        case 4: week = '四';break;
        case 5: week = '五';break;
        case 6: week = '六';break;
        case 0: week = '日';break;
    }

    var month = t.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = t.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    // return t.getFullYear() + '年' + month + '月' + day + '日';
    return t.getFullYear() + '-' + month + '-' + day;
}

function imageProxy (url) {
    if (/^data:image\/\w+;base64,/.test(url)) {
        return url
    } else {
        return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
    }
}

function multiText (ctx, text, distX, distY, width, maxLine, lineHeight) {
    ctx.save();
    var words = text.split('');
    var line = '';
    var lines = 1;
    for (var i = 0; i < words.length; i++) {
        line += words[i];
        /* 文字内容全部取完，直接绘制文字*/
        if (i === words.length - 1) {
            ctx.fillText(line, distX, distY, width);
            break;
        }
        if (ctx.measureText(line).width >= width) {
            /* 已经到达最大行数，用省略号代替后面的部分*/
            if (lines === maxLine) {
                line = line.slice(0, line.length - 3) + '...';
            }
            ctx.fillText(line, distX, distY, width);
            if (lines === maxLine) {
                break;
            }
            line = '';
            distY += lineHeight;
            lines += 1;
        }
    }
    ctx.restore();
};


function EllipseOne(context, x, y, a, b) {
    var step = (a > b) ? 1 / a : 1 / b;
    context.beginPath();
    context.moveTo(x + a, y);
    for(var i = 0; i < 2 * Math.PI; i += step) {
        context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
    }
    context.closePath();
    context.fill();
}



function drawRoundedRect(ctx,x,y,w,h,r,bdWidth,bdColor,bgcolor,isLinear,linearColor){
	ctx.beginPath();
	ctx.moveTo(x+r,y);
	ctx.lineWidth = bdWidth;
	ctx.strokeStyle = bdColor;
	
    if(isLinear){
        /* 指定渐变区域 */
        var grad  = ctx.createLinearGradient(-w*4, w*4, 0, h);
        /* 指定几个颜色 */
        grad.addColorStop(0,bgcolor); 
        grad.addColorStop(1,linearColor); 
        /* 将这个渐变设置为fillStyle */
        ctx.fillStyle = grad;
    }else{
        ctx.fillStyle = bgcolor;
    }
    
	ctx.arcTo(x+w,y,x+w,y+h,r);
	ctx.arcTo(x+w,y+h,x,y+h,r);
	ctx.arcTo(x,y+h,x,y,r);
	ctx.arcTo(x,y,x+w,y,r);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}


function drawRoundedImg(ctx, x, y, w, h, r, img) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.clip()
    ctx.drawImage(
        img,
        x,
        y,            
        w,
        h
    );
    ctx.closePath();
    // ctx.fillStyle = pattern;
    // ctx.fill();
    ctx.restore();
}
//加载特殊样式的数字图片
function loadNumImg(cb){
    var a=0;
    var numUrlObj=[
        // "https://img.qlchat.com/qlLive/shareCard/new_0.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_1.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_2.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_3.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_4.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_5.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_6.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_7.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_8.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_9.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_plus.png",
        // "https://img.qlchat.com/qlLive/shareCard/new_plus.png"        
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-0.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-1.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-2.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-3.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-4.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-5.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-6.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-7.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-8.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-9.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-dian.png",
        "https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-money.png",

    ];
    for(var i=0;i<numUrlObj.length;i++){
        numImfArray[i] = new Image();
        numImfArray[i].crossOrigin = 'Anonymous';
        numImfArray[i].src = imageProxy(numUrlObj[i]);
        numImfArray[i].onload = function () {
            a++;
            if(a>=numUrlObj.length){
                cb();
            }
        };
    }
}
//画有图片特殊样式的数字
function showNumDraw(ctx,num){
    let numString = num.toString().split("");
    let numLen = numString.length;
    let allWidth = moduleData.numObj.width*numLen;
    for (let index = 0; index < numLen; index++) {
        const element = numString[index];
        if(element === '.'){
            drawNum(ctx,10,index,allWidth);
        }else if(element === '￥'){
            drawNum(ctx,11,index,allWidth);
        }else{
            drawNum(ctx,Number(element),index,allWidth);
        }
    }
}
function drawNum(ctx, n, p,allWidth){
    ctx.drawImage(
            numImfArray[n],
            moduleData.numObj.left + moduleData.numObj.width*p- (allWidth/2),
            moduleData.numObj.top,            
            moduleData.numObj.width,
            moduleData.numObj.height
        );
}

function drawPlus(ctx, n, p){
    
        ctx.drawImage(
                numImfArray[n],
                moduleData.numObj.left + moduleData.numObj.width*p,
                moduleData.numObj.top + 15,            
                50,
                50
            );
    }



function drawDetailText(ctx, centerX, y, text, unitText) {
    ctx.save();
    ctx.font = '50px PingFang-SC-Heavy';
    var textWidth = ctx.measureText(text).width;
    ctx.font = '26px PingFang-SC-Bold';
    var unitTextWidth = ctx.measureText(unitText).width;
    
    var totalWidth = textWidth + unitTextWidth + 8;
    var textLeft = centerX - totalWidth / 2;
    var unitTextLeft = textLeft + textWidth + 8
    ctx.restore();

    ctx.save();
    ctx.font = '50px PingFang-SC-Heavy';
    ctx.fillStyle = "#333";
    ctx.fillText(text, textLeft, y);
    ctx.restore();

    ctx.save();
    ctx.font = '26px PingFang-SC-Bold';
    ctx.fillStyle = "#333";
    ctx.fillText(unitText, unitTextLeft, y - 1 );
    ctx.restore();
}

function isChinese(s) {
    if (escape(s).indexOf('%u') >= 0) return true;
    return false;
}

function headBgClipRounded(ctx, x, y, w, h, r, bdWidth, bdColor, bgcolor, isLinear, linearColor) {
    ctx.moveTo(x + r.r_top_left, y);
    ctx.lineWidth = bdWidth;
    ctx.strokeStyle = bdColor;

    if (isLinear) {
        /* 指定渐变区域 */
        var grad = ctx.createLinearGradient(0, 0, 0, h);
        /* 指定几个颜色 */
        grad.addColorStop(0, bgcolor);
        grad.addColorStop(1, linearColor);
        /* 将这个渐变设置为fillStyle */
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = bgcolor;
    }

    ctx.arcTo(x + w, y, x + w, y + h, r.r_top_right);
    ctx.arcTo(x + w, y + h, x, y + h, r.r_bottom_right);
    ctx.arcTo(x, y + h, x, y, r.r_bottom_left);
    ctx.arcTo(x, y, x + w, y, r.r_top_left);
    ctx.stroke();
};