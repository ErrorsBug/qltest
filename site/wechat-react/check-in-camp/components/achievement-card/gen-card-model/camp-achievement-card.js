var headImage = null;
var qrcode = null;
var headbg = null;
var numImfArray = [];
var shareData = null;
var canvas = null;
var fontFamiry = 'Source Han Sans CN';
var fingerprint = 'https://img.qlchat.com/qlLive/sharecard/fingerprint.png';
var businessImg="https://img.qlchat.com/qlLive/shareCard/zhang_pic.png";


var center=0;
var moduleData={headObj:{},message1:{},userNameObj:{},compliteDate:{},liveNameObj:{},campNameObj:{},remarkObj:{},message6:{},qrObj:{},figerObj:{},startTimeObj:{},message_time:{},message_speaker:{},speakerObj:{},};

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
            headObj:{
                left:250,
                top:464,
                width:140,
                height:140,
                border:0,
                borderColor:"rgba(0,0,0,0)"
            },
            userNameObj:{
                top:582,
                left:'center',
                font:32,
                color:"#fff",
            },
            campNameObj:{
                top: 1016,
                left: 72,
                font: 32,
                color: "#333",
                lineHeight: 50,
                color: "#333"
            },
            days: {
                top: 725,
                left: 'center',
                font: 60,
                color: "#333",
                lineHeight: 50,
                color: "#fff"
            },
            qrObj:{
                left:430,
                top: 884,
                width:180,
                height:180,
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

        if (shareData.bonusStatus == 'Y') {
            
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

        // 画头像 和 昵称
        ctx.save();
        // 头像

        // var totalNameWidth = moduleData.headObj.width + 20 + userNameWidth;
        var headImageLeft = center
        
        ctx.beginPath();
        ctx.arc(headImageLeft ,moduleData.headObj.top ,moduleData.headObj.width/2, 0, 2 * Math.PI);
        ctx.strokeStyle =  moduleData.headObj.borderColor;
        ctx.lineWidth = moduleData.headObj.border;
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(
            headImage,
            headImageLeft - moduleData.headObj.width / 2, 
            moduleData.headObj.top-moduleData.headObj.width/2 ,
            moduleData.headObj.width,
            moduleData.headObj.height
        );
        ctx.restore();
        ctx.closePath();

         // 渲染用户名称昵称
        ctx.font = moduleData.userNameObj.font+'px ' + fontFamiry;        
        ctx.fillStyle = moduleData.userNameObj.color;
        ctx.textAlign =  moduleData.textAlign;
        var userNameText = shareData.userName.slice(0, 30);
        var userNameWidth = ctx.measureText(userNameText).width;
        var userNameLeft = center - userNameWidth / 2;
        ctx.fillText(userNameText, userNameLeft, moduleData.userNameObj.top);        



        // 课程标题文字
        ctx.font = 'bold '+moduleData.campNameObj.font+'px ' + fontFamiry;
        var limitLenght = isChinese(shareData.campName) ? 12 : 20
        var campName = shareData.campName.length > limitLenght ? shareData.campName.slice(0,limitLenght) + '...' :  shareData.campName;
        var titleText =  campName;
        console.log(titleText)
        var titleWidth = ctx.measureText(titleText).width;
        var titleLeft = moduleData.campNameObj.left;
        ctx.fillStyle = moduleData.campNameObj.color;
        multiText(ctx, titleText,  titleLeft,  moduleData.campNameObj.top, 305, 2, 50)


        // 绘制打卡天数
        ctx.save();
        ctx.font = 'bold '+moduleData.days.font+'px ' + fontFamiry;
        ctx.fillStyle = moduleData.days.color;
        ctx.textAlign =  moduleData.textAlign;
        var daysNumText = shareData.daysNum;
        var daysNumWidth = ctx.measureText(daysNumText).width;
        var daysNumLeft = center - daysNumWidth / 2;
        ctx.fillText(daysNumText, daysNumLeft, moduleData.days.top);
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
    if (!headImage) {
        headImage = new Image();
        headImage.src = imageProxy(shareData.headImgUrl + '?x-oss-process=image/resize,h_300,w_300,m_fill');
        headImage.crossOrigin = 'Anonymous';
        headImage.onload = function () {
            if (!qrcode) {
                qrcode = new Image();
                qrcode.crossOrigin = 'Anonymous';
                qrcode.src = imageProxy(shareData.shareUrl);
                qrcode.onload = function () {
                    if (window.bgMap[encodeURIComponent(fingerprint)]&&window.bgMap[encodeURIComponent(businessImg)]) {
                        headbg = new Image();
                        headbg.crossOrigin = 'Anonymous';
                        headbg.src = imageProxy(shareData.headImgUrl + '?x-oss-process=image/resize,h_322,w_515,m_fill,limit_0');
                        headbg.onload = function () {
                            loadNumImg(cb);
                        }
                    } else {
                        var fp = new Image()
                        fp.crossOrigin = 'Anonymous';
                        fp.src = imageProxy(fingerprint);
                        fp.onload = function () {
                            window.bgMap[encodeURIComponent(fingerprint)] = fp;

                            //businessImg
                            var zi = new Image()
                            zi.crossOrigin = 'Anonymous';
                            zi.src = imageProxy(businessImg);
                            zi.onload = function () {
                                window.bgMap[encodeURIComponent(businessImg)] = zi;
                                headbg = new Image();
                                headbg.crossOrigin = 'Anonymous';
                                headbg.src = imageProxy(shareData.headImgUrl + '?x-oss-process=image/resize,h_322,w_515,m_fill,limit_0');
                                headbg.onload = function () {
                                    loadNumImg(cb);
                                    
                                }
                            }

                            
                            // cb()
                        }
                    }
                };
            } else {
                cb();
            }
        }
        headImage.onerror = function (error) {
            console.log(error, '图片加载失败, 使用默认头像');
            headImage.src = imageProxy('https://img.qlchat.com/qlLive/liveCommon/defaultHeadn.png?x-oss-process=image/resize,h_300,w_300,m_fill');
        }
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

function loadNumImg(cb){
    var a=0;
    var numUrlObj=[
        "https://img.qlchat.com/qlLive/shareCard/new_0.png",
        "https://img.qlchat.com/qlLive/shareCard/new_1.png",
        "https://img.qlchat.com/qlLive/shareCard/new_2.png",
        "https://img.qlchat.com/qlLive/shareCard/new_3.png",
        "https://img.qlchat.com/qlLive/shareCard/new_4.png",
        "https://img.qlchat.com/qlLive/shareCard/new_5.png",
        "https://img.qlchat.com/qlLive/shareCard/new_6.png",
        "https://img.qlchat.com/qlLive/shareCard/new_7.png",
        "https://img.qlchat.com/qlLive/shareCard/new_8.png",
        "https://img.qlchat.com/qlLive/shareCard/new_9.png",
        "https://img.qlchat.com/qlLive/shareCard/new_plus.png"

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

function showNumDraw(ctx,num){
    if(num<=9){
        // drawNum(ctx,0,0);
        if (num == 1) {
            drawNum(ctx,num,0.07);
        } else {
            drawNum(ctx,num,0);
        }
    }else{
        if(num/100000>=1){
            drawNum(ctx,Math.floor(num/100000),-2.2);
            drawNum(ctx,Math.floor(num%100000/10000),-1.2);
            drawNum(ctx,Math.floor(num%10000/1000),-0.2);
            drawNum(ctx,Math.floor(num%1000/100),0.7);
            drawNum(ctx,Math.floor(num%100/10),1.6);
            drawNum(ctx,Math.floor(num%10),2.6);
        }else if(num%100000/10000>=1){
            drawNum(ctx,Math.floor(num%100000/10000),-1.8);
            drawNum(ctx,Math.floor(num%10000/1000),-0.8);
            drawNum(ctx,Math.floor(num%1000/100),0.2);
            drawNum(ctx,Math.floor(num%100/10),1.2);
            // drawNum(ctx,Math.floor(num%10),2);
            drawPlus(ctx,10,2.2)
        }else if(num%10000/1000>=1){
            if (num == 1111) {
                drawNum(ctx,Math.floor(num%10000/1000),-0.97);
                drawNum(ctx,Math.floor(num%1000/100),-0.27);
                drawNum(ctx,Math.floor(num%100/10),0.33);
                drawNum(ctx,Math.floor(num%10),1.03);
            } else {
                drawNum(ctx,Math.floor(num%10000/1000),-1.5);
                drawNum(ctx,Math.floor(num%1000/100),-0.5);
                drawNum(ctx,Math.floor(num%100/10),0.5);
                drawNum(ctx,Math.floor(num%10),1.5);
            }
        }else if(num%1000/100>=1){
            if (num == 111) {
                drawNum(ctx,Math.floor(num%1000/100),-0.7);
                drawNum(ctx,Math.floor(num%100/10),0.1);
                drawNum(ctx,Math.floor(num%10),0.9);
            } else {
                drawNum(ctx,Math.floor(num%1000/100),-1);
                drawNum(ctx,Math.floor(num%100/10),0);
                drawNum(ctx,Math.floor(num%10),1);
            }
        }else if(num%100/10>=1){
            drawNum(ctx,Math.floor(num%100/10),-0.46);
            drawNum(ctx,Math.floor(num%10),0.46);
        }
    }
}
function drawNum(ctx, n, p){

    ctx.drawImage(
            numImfArray[n],
            moduleData.numObj.left + moduleData.numObj.width*p,
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