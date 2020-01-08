import { fillParams } from "components/url-utils";

var canvasFun = require("@ql-feat/canvas-tools");
var drawText = canvasFun.drawText;
var drawRoundedRect = canvasFun.headBgClipRounded;
var multiText = canvasFun.multiText;
var imageProxy = canvasFun.imageProxy("/api/wechat/image-proxy?url=");
var drawImage = canvasFun.drawImage;
var drawStyleImage = canvasFun.drawStyleImage;

var qrcode = null;
var shareData = null;
var officialKey = null;
var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';
var haibaopic = null;

var center = 0;
var moduleData = {};

var styleModule = "";
/**
 * 生成sharecard图片
 */

export function pushDistributionCardMaking(
    bgUrl,
    datas,
    cb,
    reset,
    stylemodule,
    cardWidth,
    cardHeight,
    thisofficialKey,
    qrCode
) {
    shareData = datas;
    officialKey = thisofficialKey;
    styleModule = stylemodule;
    haibaopic = shareData.sentenceImgUrl || 'https://img.qlchat.com/qlLive/liveTraining/achievementCard1.png';
    if (!shareData.qrCode) {
        shareData.qrCode = qrCode;
    }
    if (!canvas) {
        canvas = document.createElement("canvas");
    }
    var ctx = canvas.getContext("2d");

    canvas.width = cardWidth || 640;
    canvas.height = cardHeight || 1136;

    center = canvas.width / 2;

    //模板ABC,Z代表自定义模板
    var moduleList = {
        PersonCount: {
            headbg: {
                left: 0,
                top: 0,
                width: 610,
                height: 437
            },
            liveWordObj: {
                top: shareData.name.length > 12 ? 820 : 800,
                left: 50,
                font: 26,
                color: "#999999",
                text: "千聊训练营"
            },
            liveNameObj: {
                top: 735,
                left: 50,
                font: 30,
                width: 370,
                lineHeight: 40,
                maxLine: 2,
                color: "#333333",
                text: shareData.name,
            },
            qrObj: {
                left: 432,
                top: 700,
                width: 128,
                height: 128
            },

            checkinNumObj: {
                top: 600,
                left: 67,
                font: 40,
                color: "#333",
                text: shareData.affairNum || 0,
                textAlign: "center"
            },
            checkinWordObj: {
                top: 644,
                left: 70,
                font: 24,
                color: "#999",
                text: '打卡',
                textAlign: "center"
            },
            finishNumObj: {
                top: 600,
                left: 271,
                font: 40,
                color: "#333",
                text: shareData.courseNum || 0
            },
            finishwordObj: {
                top: 644,
                left: 255,
                font: 24,
                color: "#999",
                text: '完成课程'
            },
            finishHNumObj: {
                top: 600,
                left: 484,
                font: 40,
                color: "#333",
                text: shareData.homeworkNum || 0
            },
            finishHwordObj: {
                top: 644,
                left: 461,
                font: 24,
                color: "#999",
                text: '完成作业'
            },
            userHeaderObj: {
                left: 256,
                top: 390,
                width: 98,
                height: 98,
                isClip: true,
                x: 256,
                y: 390,
                w: 98,
                h: 98,
                r: {
                    r_top_left: 50,
                    r_top_right: 50,
                    r_bottom_right: 50,
                    r_bottom_left: 50
                },
                bdWidth: 1,
                bdColor: "#fff",
                bgcolor: "rgba(255,255,255)",
            },
            userNameObj: {
                top: 530,
                left: 305,
                font: 28,
                color: "#333",
                text: shareData.userName
            },
            icon_word_ci: {
                top: 600,
                left: shareData.affairNum > 9? 115 : 90,
                font: 28,
                color: "#333",
                text: '次'
            },
            icon_word_ke: {
                top: 600,
                left: shareData.courseNum > 9? 320 : 295,
                font: 28,
                color: "#333",
                text: '课'
            },
            icon_word_fen: {
                top: 600,
                left: shareData.homeworkNum > 9 ? 530 : 510,
                font: 28,
                color: "#333",
                text: '份'
            },
            textAlign: "left"
        }
    };

    moduleData = moduleList[styleModule];
    if (reset === true) {
        qrcode = null;
    }

    genContent(canvas, function() {
        cb(canvas.toDataURL("image/png", 0.9));
    });
}

/**
 * 生成canvas内容
 *
 * @param {any} canvas
 * @param {any} options
 */
function genContent(canvas, cb) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // 填充颜色为红色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    loadImage(ctx, function() {
        // 绘文字
        ctx.textAlign = moduleData.textAlign;
        ['liveWordObj', 'checkinNumObj', 'finishNumObj', 'finishHNumObj', 'checkinWordObj', 'finishwordObj', 'finishHwordObj',
    'icon_word_ci', 'icon_word_ke', 'icon_word_fen'].forEach(item => {
            drawText(
                ctx,
                moduleData[item].text,
                moduleData[item],
                fontFamiry
            );
        })

        multiText(
            ctx,
            moduleData['liveNameObj'].text,
            moduleData['liveNameObj']
        )

        // 居中显示昵称
        ctx.textAlign = 'center';
        drawText(
            ctx,
            moduleData['userNameObj'].text,
            moduleData['userNameObj'],
            fontFamiry
        );

        drawLine(ctx)

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
 * 画两条线
 * @param {*} ctx 
 */
function drawLine(ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle="#eee";
    ctx.beginPath();
    ctx.moveTo(200,600);
    ctx.lineTo(200,628);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(407,600);
    ctx.lineTo(407,628);
    ctx.closePath();
    ctx.stroke();
}
/**
 * 加载头像和二维码
 *
 * @param {any} cb
 */
function loadImage(ctx, cb) {
    if (!qrcode) {
        qrcode = new Image();
        qrcode.crossOrigin = "Anonymous";
        qrcode.src = imageProxy("http://qr.topscan.com/api.php?text="+encodeURIComponent(window.location.origin+"/wechat/page/training-intro?campId="+shareData.id));

        qrcode.onload = function() {
            if (moduleData.headbg) {
                //海报头图/* 话题头图*/
                drawStyleImage(
                    ctx,
                    haibaopic,
                    moduleData.headbg,
                    imageProxy,
                    () => {
                        drawStyleImage(
                            ctx,
                            shareData.headImgUrl,
                            moduleData.userHeaderObj,
                            imageProxy,
                            () => {
                                cb();
                            }
                        );
                    }
                );

            }
        };
    } else {
        cb();
    }
}
