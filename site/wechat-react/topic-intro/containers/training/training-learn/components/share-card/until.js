var canvasFun = require("@ql-feat/canvas-tools");
var drawText = canvasFun.drawText;
var multiText = canvasFun.multiText;
var imageProxy = canvasFun.imageProxy("/api/wechat/image-proxy?url=");
var drawStyleImage = canvasFun.drawStyleImage;

var canvas = null;
var fontFamiry = '"苹方 常规","微软雅黑"';

/**
 * 自定义海报
 * @param {*} param0 
 */
function drawCard ({
    bgUrl, // 海报背景
    cardWidth,
    cardHeight,
    multiContens = [],
    singleContens = [],
    imageContens  = [],
    cb
}) {
    
    if (!canvas) {
        canvas = document.createElement("canvas");
    }

    imageContens.unshift({
        url: bgUrl,
        style: {
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight
        }
    })

    var ctx = canvas.getContext("2d");

    canvas.width = cardWidth || 640;
    canvas.height = cardHeight || 1136;
    
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    generateImages(ctx, imageContens, () => {
        generateSingleText(ctx, singleContens)
        generateMultiText(ctx, multiContens)

        cb && cb(canvas.toDataURL("image/png", 0.9));
    })
}

function generateSingleText (ctx, singleContens) {
    if (!singleContens || singleContens.length === 0) return

    singleContens.forEach(textObj => {
        ctx.textAlign = textObj.textAlign;
        drawText(
            ctx,
            textObj.text,
            textObj.style,
            fontFamiry
        );
    });
}

function generateMultiText (ctx, multiContens) {
    if (!multiContens || multiContens.length === 0) return

    multiContens.forEach(textObj => {
        ctx.textAlign = textObj.textAlign;
        multiText(
            ctx,
            textObj.text,
            textObj.style,
        )
    });
}

/**
 * 生成图片
 * @param {*} imageContens 
 * @param {*} cb 
 */
function generateImages (ctx, imageContens, cb) {
    if (!imageContens || imageContens.length === 0) {
        cb()
        return
    }

    let i = 0;
    const recursion = () => {
        i += 1
        if (i < imageContens.length) {
            loadImage(ctx, imageContens[i], recursion)
        } else {
            cb()
        }
    }
    loadImage(ctx, imageContens[i], recursion)
}

/**
 * 加载图片
 * @param {any} cb
 */
function loadImage(ctx, image, cb) {
    drawStyleImage(
        ctx,
        image.url,
        image.style,
        imageProxy,
        () => {
            cb();
        }
    );
}

export default drawCard