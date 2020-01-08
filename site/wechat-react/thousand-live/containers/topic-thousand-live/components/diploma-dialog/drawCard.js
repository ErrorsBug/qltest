import * as QRCode from 'qrcode';

const CONFIG = {
    CANVAS_WIDTH: 500,
    CANVAS_HEIGHT: 889,
};

const fontFamiry = 'Source Han Sans CN';

let ctx

const drawCard = async(data) => {
    let canvas = document.createElement('canvas')
    canvas.width = CONFIG.CANVAS_WIDTH
    canvas.height = CONFIG.CANVAS_HEIGHT
    ctx = canvas.getContext('2d')

    await Promise.all([
        drawBg('https://img.qlchat.com/qlLive/liveComment/6BRCV5DX-K2OM-ZS4Q-1532572164364-L3121ZOSXZXV.png'),
        drawHeadImg(data.userInfo.user.headImgUrl),
        drawCourseImg(data.courseImg),
        drawQr(data.qrUrl)
    ])
    drawContent(data)

    return canvas.toDataURL('image/png', 0.9)
}

// 绘制背景图
const drawBg = async(bgImgUrl) => {
    const bgImg = await loadImg(imageProxy(bgImgUrl));
	ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
	ctx.drawImage(bgImg, 0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
	ctx.restore();
};

// 绘制头像
const drawHeadImg = async(img) => {
    const url= await loadImg(imageProxy(img));
    ctx.save()
    ctx.lineWidth = 2
    ctx.strokeStyle = "#dadada"
    ctx.beginPath();
    ctx.arc(250, 137, 67, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(url, 183, 70, 134, 134);
    ctx.restore();
}

//绘制课程头图
const drawCourseImg = async(img) => {
    const url= await loadImg(imageProxy(img));
    ctx.save()
    drawRoundedRectangle({
        x: 44,
        y: 310,
        r: 6,
        width: 167,
        height: 103
    })
    ctx.clip();
    ctx.drawImage(url, 44, 310, 167, 103);
    ctx.restore();
}

// 绘制二维码
const drawQr = async (url) => {
    try {
        const qrImg= await loadImg(imageProxy(url));
        ctx.save();
        ctx.drawImage(qrImg, 360, 698, 95, 95);
        ctx.restore();
    } catch (err) {
        console.error(err)
    }
}

const drawContent = (data)=> {
    // drawNick(data.cardData.nickName,54,274)
    // drawDesc(data.cardData.title, 44, 220)
    // drawFooter(data, 300, 810)
    // drawMes(data)
    // drawLongTap()
    // drawData(data.cardData)
    // 用户名
    ctx.save()
    ctx.font = '24px ' + fontFamiry
    ctx.fillStyle = '#E95F64'
    ctx.textAlign = 'center'
    ctx.fillText(data.userInfo.user.name, 250, 234)
    ctx.restore()

    // 完成时间提示
    ctx.save()
    let date = new Date(data.cardData.createTime)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let completeTimeTip = `于${year}年${month}月${day}日完成了课程`
    ctx.fillStyle = '#666'
    ctx.font = '20px ' + fontFamiry
    ctx.textAlign = 'center'
    ctx.fillText(completeTimeTip,250,286)
    ctx.restore()

    // 课程标题
    ctx.save()
    ctx.font = '19px ' + fontFamiry
    ctx.fillStyle = '#333'
    drawCourseTitle(data.title, 224, 326, 230, 3)
    ctx.restore()

    //课程热度
    ctx.save()
    ctx.font = '14px ' + fontFamiry
    ctx.fillStyle = '#999'
    ctx.fillText(browseNum(data.browseNum), 238, 408)
    ctx.restore()

    //成就卡相关数据
    ctx.save()
    ctx.font = '54px ' + fontFamiry
    ctx.fillStyle = '#E95F64'
    ctx.textAlign = 'center'
    ctx.fillText(Math.ceil(data.cardData.learningSeconds / 60), 110, 586)
    ctx.fillText(data.cardData.learningDays, 390, 586)
    ctx.textAlign = 'right'
    ctx.fillText(data.cardData.learningRate, 270, 586)
    ctx.font = '22px ' + fontFamiry
    ctx.fillText('%',292,582)
    ctx.restore()

    // footer
    ctx.save()
    let word = data.liveName.split('')
    let liveName = ''
    for(let i = 0, len = word.length; i < len; i++){
        liveName += word[i]
        if(ctx.measureText(liveName).width >= 180){
            break
        }
    }
    let footer = `${data.showQl? '千聊 x ' : ''}${liveName} 出品`
    ctx.font = '17px ' + fontFamiry
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.fillText(footer, 250, 860)
    ctx.restore()
}

const browseNum  = (num) => {
    if(num > 10000) {
        num = (num / 10000).toFixed(1)
        if(num.slice(-2) === '.0'){
            num = num.slice(0, num.length - 2)
        }
        num = num + '万'
    }
    return '课程热度：' + num + '次学习'
}

const drawCourseTitle = (title, x, y, lineWidth, maxLine) => {
    let line = ''
    let word = title.split('')
    let row = 1
    for(let i = 0, len = word.length; i < len; i++){
        line += word[i]
        if(i === len - 1){
            ctx.fillText(line, x, y, lineWidth)
            break
        }
        if(ctx.measureText(line).width >= lineWidth){
            if(row === maxLine){
                line = line.slice(0, line.length - 3) + ' ...'
            }
            ctx.fillText(line, x, y, lineWidth)
            if(row === maxLine){
                break
            }
            row ++
            y += 30
            line = ''
        }
    }
}

// 绘制圆角矩形背景
const drawRoundedRectangle = (roundedConfig) => {
    ctx.lineWidth = 0
    if(roundedConfig.fillStyle){
        ctx.fillStyle = roundedConfig.fillStyle
    }
    if(roundedConfig.strokeStyle){
        ctx.strokeStyle = roundedConfig.strokeStyle
    }
    ctx.beginPath()
    ctx.arc(roundedConfig.x + roundedConfig.r, roundedConfig.y + roundedConfig.r, roundedConfig.r, Math.PI, 3/2 * Math.PI, false);
    ctx.lineTo(roundedConfig.x + roundedConfig.width - roundedConfig.r, roundedConfig.y)
    ctx.arc(roundedConfig.x + roundedConfig.width - roundedConfig.r, roundedConfig.y + roundedConfig.r, roundedConfig.r,  3/2 * Math.PI, 2 * Math.PI, false)
    if(roundedConfig.r != roundedConfig.height / 2){
        ctx.lineTo(roundedConfig.x + roundedConfig.width, roundedConfig.y + roundedConfig.height - roundedConfig.r)
    }
    ctx.arc(roundedConfig.x + roundedConfig.width - roundedConfig.r, roundedConfig.y + roundedConfig.height - roundedConfig.r, roundedConfig.r,  0, 1/2 * Math.PI, false)
    ctx.lineTo(roundedConfig.x + roundedConfig.r, roundedConfig.y + roundedConfig.height)
    ctx.arc(roundedConfig.x + roundedConfig.r, roundedConfig.y + roundedConfig.height - roundedConfig.r, roundedConfig.r,  1/2 * Math.PI, Math.PI, false)
    if(roundedConfig.r != roundedConfig.height / 2){
        ctx.lineTo(roundedConfig.x, roundedConfig.y + roundedConfig.r)
    }
    ctx.closePath()
    if(roundedConfig.fillStyle){
        ctx.fill()
    }
    if(roundedConfig.strokeStyle){
        ctx.stroke()
    }
}

// 图片加载
const loadImg = (imgUrl) => {
	let img = new Image();
	img.setAttribute('crossOrigin', 'anonymous');
	return new Promise(function(resolve, reject){
		img.onload = function(){
			resolve(img);
		};
		img.onerror = function(){
			reject(`something wrong with ${imgUrl || 'undefined url'}`)
		};
		img.src = imgUrl;
	})
};

// 图片跨域处理
function imageProxy (url) {
	return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
}

export default drawCard