var headImage = null;
var qrcode = null;
var shareData = null;
var officialKey =null;
var qrcodeUrl = null;
var shareUrl = null;
var canvas = null;
var fontFamiry = 'Source Han Sans CN';
var fingerprint = 'https://img.qlchat.com/qlLive/sharecard/fingerprint.png';
var haibaopic= null;
var formateTime={
    date:'',
    day:'',
    time:'',
};



var center=0;
var moduleData={};
var bgMap={};

var styleModule='';
/**
 * 生成sharecard图片
 */     
export function pushDistributionCardMaking (bgUrl, datas, cb, reset, stylemodule, cardWidth, cardHeight, localQrcodeUrl) {
    shareData = datas;
    // officialKey = thisofficialKey;
    styleModule= stylemodule;
    qrcodeUrl = localQrcodeUrl;
    shareUrl = localQrcodeUrl;
    haibaopic = shareData.businessImage;
    // console.log(shareData);
    if (!canvas) {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas.getContext('2d');

    canvas.width = cardWidth||640;
    canvas.height = cardHeight||1136;

    center=canvas.width / 2;
    //模板ABC,Z代表自定义模板
    var moduleList={
        H:{
            headbg:{
                left:20,
                top:20,
                width:589,
                height:367,
            },
            businessNameObj:{
                top:canvas.height-20,
                left:center,
                font:32,
                color:"#333",
                width:canvas.width-100,
                textAlign:"center",
            },
            priceObj:{
                top:360,
                left:center+220,
                font:30,
                color:"#fff",
                x:center+205,
                y:310,
                w:210,
                h:75,
                r:1,
                bdWidth:1,
                bdColor:"#f86666",
                bgcolor:"#f86666",
            },
            priceObjLower:{
                top:360,
                left:center+350,
                font:20,
                color:"#fff",
                text_line:1,
                
            },
            message_qrcode:{
                top:290,
                left:center+190,
                font:20,
                color:"#333",
            },
            qrObj:{
                left:canvas.width-285,
                top:0,
                width:268,
                height:268,
            },
            contentBorder:{
                x:0,
                y:canvas.height-60,
                w:canvas.width,
                h:67,
                r:1,
                bdWidth:2,
                bdColor:"#ffd2d2",
                bgcolor:"#ffd2d2",
                lineNum:1,
                ju:6,
            },
            textAlign:"left",
        },
        W:{
            headbg:{
                left:0,
                top:0,
                width:canvas.width,
                height:410,
            },
            
            businessNameObj:{
                top:495,
                left:250,
                font:26,
                color:"#333",
                width:370,
                textAlign:"center",
            },
            // message_priceObj:{
            //     top:880,
            //     left:30,
            //     font:30,
            //     color:"#f86666",
            //     width:400,
            // },
            // priceObj:{
            //     top:885,
            //     left:120,
            //     font:50,
            //     color:"#f86666",
            //     x:1,
            //     y:canvas.height-60,
            //     w:canvas.width,
            //     h:60,
            //     r:1,
            //     bdWidth:2,
            //     bdColor:"#e9e6ff",
            //     bgcolor:"#e9e6ff",
            // },
            // priceObjLower:{
            //     top:880,
            //     left:center-60,
            //     font:30,
            //     color:"#333",
            //     text_line:1,
            //     messagetext:"原价",
            // },
            message_qrcode:{
                top:canvas.height-20,
                left:30,
                font:20,
                color:"#333",
                x:1,
                y:canvas.height-60,
                w:canvas.width,
                h:60,
                r:1,
                bdWidth:2,
                bdColor:"#e9e6ff",
                bgcolor:"#e9e6ff",
            },
            qrObj:{
                left:canvas.width-170,
                top:430,
                width:150,
                height:150,
            },
            contentBorder:{
                x:45,
                y:455,
                w:414,
                h:100,
                r:1,
                bdWidth:2,
                bdColor:"#ffdada",
                bgcolor:"rgba(0,0,0,0)",
                lineNum:2,
                ju:10,
            },
            textAlign:"left",
        }
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
            moduleData.contentBorder.lineNum>=2 &&drawRoundedRect(ctx,moduleData.contentBorder.x-moduleData.contentBorder.ju,moduleData.contentBorder.y-moduleData.contentBorder.ju,moduleData.contentBorder.w+moduleData.contentBorder.ju*2,moduleData.contentBorder.h+moduleData.contentBorder.ju*2,moduleData.contentBorder.r,moduleData.contentBorder.bdWidth,moduleData.contentBorder.bdColor,moduleData.contentBorder.bgcolor,moduleData.contentBorder.isLinear,moduleData.contentBorder.linearColor);
        }

        /* 话题头图*/
        if(moduleData.headbg){
            ctx.save();
            if(moduleData.headbg.isClip){
                ctx.beginPath();
                moduleData.headbg.r&&headBgClipRounded(ctx,moduleData.headbg.x,moduleData.headbg.y,moduleData.headbg.w,moduleData.headbg.h,moduleData.headbg.r,moduleData.headbg.bdWidth,moduleData.headbg.bdColor,moduleData.headbg.bgcolor,moduleData.headbg.isLinear,moduleData.headbg.linearColor);
                ctx.clip();
            }
            
            ctx.drawImage(
                bgMap[encodeURIComponent(haibaopic)],
                moduleData.headbg.left,
                moduleData.headbg.top,            
                moduleData.headbg.width,
                moduleData.headbg.height
            );
            ctx.restore();
            ctx.closePath();
        }
        // 绘文字
        ctx.textAlign =  moduleData.textAlign;

        if(moduleData.message_qrcode){
            moduleData.message_qrcode.x&&drawRoundedRect(ctx,moduleData.message_qrcode.x,moduleData.message_qrcode.y,moduleData.message_qrcode.w,moduleData.message_qrcode.h,moduleData.message_qrcode.r,moduleData.message_qrcode.bdWidth,moduleData.message_qrcode.bdColor,moduleData.message_qrcode.bgcolor);
            
            ctx.font = moduleData.message_qrcode.font+'px ' + fontFamiry;
            ctx.fillStyle = moduleData.message_qrcode.color;
            drawTextSpace(ctx,'长按识别二维码查看课程', moduleData.message_qrcode.left+90, moduleData.message_qrcode.top,40,moduleData.message_qrcode.font,moduleData.message_qrcode.color,fontFamiry);
            
        }
        
            
        if(moduleData.businessNameObj){
            if(moduleData.businessNameObj.textAlign){ctx.textAlign = moduleData.businessNameObj.textAlign;}
            ctx.font = (moduleData.businessNameObj.noBolder?null:'500 ')+moduleData.businessNameObj.font+'px ' + fontFamiry;
            ctx.fillStyle = moduleData.businessNameObj.color;

            multiText(ctx, shareData.businessName,  moduleData.businessNameObj.left,  moduleData.businessNameObj.top, moduleData.businessNameObj.width, 2, 45)
            if(moduleData.businessNameObj.textAlign){ctx.textAlign =  moduleData.textAlign;}
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
    if (!qrcode) {
        qrcode = new Image();
        qrcode.crossOrigin = 'Anonymous';
        // qrcode.src = imageProxy(qrcodeUrl);
        qrcode.src = imageProxy("http://qr.topscan.com/api.php?text="+encodeURIComponent(shareUrl));
        qrcode.onload = function () {
            // console.log(bgMap);
            if (bgMap[encodeURIComponent(fingerprint)]&&bgMap[encodeURIComponent(haibaopic)]) {
                cb()
            } else {
                var headbg = new Image();
                headbg.crossOrigin = 'Anonymous';
                headbg.src = imageProxy(haibaopic + '?x-oss-process=image/resize,h_469,w_750,m_fill,limit_0');
                headbg.onload = function () {
                    bgMap[encodeURIComponent(haibaopic)] = headbg;
                    cb();
                }
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


function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
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

    var hours = t.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }

    var monutes = t.getMinutes();
    if (monutes < 10) {
        monutes = '0' + monutes;
    }
    formateTime.date = t.getFullYear() + '-' + month + '-' + day;
    formateTime.day = '星期' + week + ' ';
    formateTime.time = hours + ':' + monutes ;
    return formateTime;
}
function imageProxy (url) {
    if (/^data:image\/\w+;base64,/.test(url)) {
        return url
    } else {
        return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
    }
}

function multiText (ctx, text, distX, distY, width, maxLine, lineHeight,spaceWidth) {
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
        var grad  = ctx.createLinearGradient(0, 0, 0, h);
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

function headBgClipRounded(ctx,x,y,w,h,r,bdWidth,bdColor,bgcolor,isLinear,linearColor){
    	ctx.moveTo(x+r.r_top_left,y);
	ctx.lineWidth = bdWidth;
	ctx.strokeStyle = bdColor;
	
    if(isLinear){
        /* 指定渐变区域 */
        var grad  = ctx.createLinearGradient(0, 0, 0, h);
        /* 指定几个颜色 */
        grad.addColorStop(0,bgcolor); 
        grad.addColorStop(1,linearColor); 
        /* 将这个渐变设置为fillStyle */
        ctx.fillStyle = grad;
    }else{
        ctx.fillStyle = bgcolor;
    }
    
	ctx.arcTo(x+w,y,x+w,y+h,r.r_top_right);
	ctx.arcTo(x+w,y+h,x,y+h,r.r_bottom_right);
	ctx.arcTo(x,y+h,x,y,r.r_bottom_left);
	ctx.arcTo(x,y,x+w,y,r.r_top_left);
	ctx.stroke();
};

function triangle(ctx,p1_x,p1_y,p2_x,p2_y,p3_x,p3_y,color){
    ctx.beginPath();
    ctx.moveTo(p1_x,p1_y);
    ctx.fillStyle=color;
    ctx.lineTo(p2_x,p2_y);
    ctx.lineTo(p3_x,p3_y);
    ctx.closePath();
    ctx.fill();
}
function drawLine(ctx,p1_x,p1_y,p2_x,p2_y,color){
    ctx.beginPath();
    ctx.moveTo(p1_x,p1_y);
    ctx.strokeStyle=color;
    ctx.lineTo(p2_x,p2_y);
    ctx.closePath();
    ctx.stroke();
}

function drawTextSpace(ctx,str,p1_x,p1_y,spaceWidth,font,color,fontFamiry){
    var strArray=str.split("");
    for(var i=0;i<strArray.length;i++){
        ctx.font = font+'px ' + fontFamiry;
        ctx.fillStyle = color;
        ctx.fillText(strArray[i], p1_x+spaceWidth*i , p1_y);
    }
    
}