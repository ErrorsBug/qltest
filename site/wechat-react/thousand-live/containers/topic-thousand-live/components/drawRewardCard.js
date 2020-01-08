// 基础默认配置
let CANVAS_CONFIG = {
    height: 889,
    width: 500
}
let fontFamiry = 'Source Han Sans CN';
let ctx

let bgConfig = {
    reward: 'https://img.qlchat.com/qlLive/liveComment/DTBGMK2I-1X87-UBL2-1531983564666-64KBDIQWY6GT.png',//打赏后的背景
    none: 'https://img.qlchat.com/qlLive/liveComment/MXAS79EL-1Y76-MCGR-1531903497689-882Q89CMQCN8.png',//未打赏的背景
}

const drawRewardCard = async (userInfo,config,topicInfo,type, qrUrl) => {
    let canvas = document.createElement('canvas')
    if(config && config.width){
        CANVAS_CONFIG.width = config.width
    }
    if(config && config.height){
        CANVAS_CONFIG.height = config.height
    }
    canvas.width = CANVAS_CONFIG.width
    canvas.height = CANVAS_CONFIG.height
    ctx = canvas.getContext('2d')

    await Promise.all([
        drawBg(bgConfig[type]),
        drawHeadImg(userInfo.headImgUrl),
        drawCourseImg(topicInfo.backgroundUrl, type),
        drawQr(qrUrl, type)
    ])
    drawContent(userInfo, topicInfo, type)

    return canvas.toDataURL('image/png', 0.9)
}

// 绘制背景图
const drawBg = async(bgImgUrl) => {
    try{
        const bgImg = await loadImg(imageProxy(bgImgUrl));
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(bgImg, 0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
        ctx.restore();
    } catch(err){
        console.err(err)
    }
};

// 绘制头像
const drawHeadImg = async(img) => {
    try{
        const url= await loadImg(imageProxy(img));
        ctx.save()
        ctx.lineWidth = 1
        ctx.strokeStyle = "#fff"
        ctx.shadowBlur=7;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor="#000";
        ctx.beginPath();
        ctx.arc(250, 96, 49, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(url, 201, 47, 98, 98);
        ctx.restore();
    } catch(err){
        console.err(err)
    }
}

// 绘制二维码
const drawQr = async (img, type) => {
    try{
        if (!/^data:image\/\w+;base64,/.test(img)) {
            img = imageProxy(img)
        }
        const url = await loadImg(img);
        ctx.save()
        if(type === 'none'){
            drawRoundedRectangle({
                x: 133,
                y: 700,
                r: 4,
                width: 95,
                height: 95,
                strokeStyle: '#979797',
                lineWidth: 1,
                fillStyle: '#fff',
            })
            ctx.drawImage(url, 135, 702, 91, 91);
        }else if(type === 'reward'){
            drawRoundedRectangle({
                x: 133,
                y: 768,
                r: 4,
                width: 95,
                height: 95,
                strokeStyle: '#979797',
                lineWidth: 1,
                fillStyle: '#fff',
            })
            ctx.drawImage(url, 135, 770, 91, 91);
        }
        ctx.restore();
    } catch(err){
        console.err(err)
    }
}

const drawCourseImg = async(img, type) => {
    try{
        const courseImg = await loadImg(imageProxy(img));
        ctx.save();
        ctx.shadowBlur=2;
        ctx.shadowOffsetY = 2;
        ctx.shadowOffsetX = 2;
        if(type === 'none'){
            drawRoundedRectangle({
                x: 46,
                y: 247,
                r: 10,
                width: 407,
                height: 249,
                strokeStyle: '#fff',
                lineWidth: 1
            })
            ctx.clip();
            ctx.drawImage(courseImg, 46, 247, 407, 249);
        }else if(type === 'reward'){
            drawRoundedRectangle({
                x: 46,
                y: 623,
                r: 8,
                width: 157,
                height: 97,
                strokeStyle: '#fff',
                lineWidth: 1
            })
            ctx.clip();
            ctx.drawImage(courseImg, 46, 623, 157, 97);
        }
        ctx.restore();
    } catch(err){
        console.err(err)
    }
}

const drawContent = (userInfo, topicInfo, type) => {
    // 用户名
    ctx.save()
    ctx.font = '18px ' + fontFamiry
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'hanging'
    ctx.fillText(userInfo.name, 250, 156)
    ctx.restore()

    // 文案提示
    if(type === 'none'){
        ctx.save()
        ctx.font = '20px ' + fontFamiry
        ctx.fillStyle = '#666'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'hanging'
        ctx.fillText('老师讲得很好，易懂实用，值得推荐~', 250, 190)
        ctx.restore()
    }

    //课程标题
    ctx.save()
    ctx.fillStyle = '#333'
    if(type === 'none'){
        ctx.font = '23px ' + fontFamiry
        drawTitle(topicInfo.topic, 47, 555, 305, 3, 34)
    }else if(type === 'reward'){
        ctx.font = '19px ' + fontFamiry
        drawTitle(topicInfo.topic, 214, 640, 240, 3, 27)
    }
    ctx.restore()

    // 分数（8.1-9.0），前端伪造，8.1 + 课程id的最后一位数 / 10
    if(type === 'none'){
        ctx.save()
        ctx.font = '34px ' + fontFamiry
        ctx.fillStyle = '#333'
        drawScore(topicInfo.id, 390, 580)
        ctx.restore()
    }

    // 浏览人数
    ctx.save()
    ctx.fillStyle = '#999'
    if(type === 'none'){
        ctx.font = '12px ' + fontFamiry
        ctx.textAlign = 'center'
        ctx.fillText(browseNum(topicInfo.browseNum) + '人次', 414, 615)
    }else if (type === 'reward'){
        ctx.font = '15px ' + fontFamiry
        ctx.fillText('课程热度：' + browseNum(topicInfo.browseNum) + '次学习', 227, 716)
    }
    ctx.restore()

    // 长按识别二维码
    ctx.save()
    ctx.font = '19px ' + fontFamiry
    ctx.textBaseline = 'hanging'
    if(type === 'none'){
        ctx.fillStyle = '#333'
        ctx.fillText('长按识别二维码',235,724)
    }else if (type === 'reward'){
        ctx.fillStyle = '#fff'
        ctx.fillText('长按识别二维码',235,791)
    }
    ctx.font = '18px ' + fontFamiry
    if(type === 'none'){
        ctx.fillStyle = '#999'
        ctx.fillText('查看课程',235,750)
    }else if (type === 'reward'){
        ctx.fillText('查看课程',235,816)
    }
    ctx.restore()
}

const drawTitle = (title, x, y, lineWidth, maxLine, lineHeight) => {
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
            y += lineHeight
            line = ''
        }
    }
}

const drawScore = (userId, x, y) => {
    let userIdArr = userId.toString().split('')
    let score = (8.1 + Number(userIdArr[userIdArr.length - 1]) / 10).toFixed(1)
    ctx.fillText(score, x, y)
}

const browseNum = (num, x, y) => {
    if(num > 10000) {
        num = (num / 10000).toFixed(1)
        if(num.slice(-2) === '.0'){
            num = num.slice(0, num.length - 2)
        }
        num = num + '万'
    }
    return num
}

// 绘制圆角矩形背景
const drawRoundedRectangle = (roundedConfig) => {
    ctx.lineWidth = roundedConfig.lineWidth || 0
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

export default drawRewardCard;