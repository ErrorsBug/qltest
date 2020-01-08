function imageProxy(url) {
    return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
}

function getImg(url) {
    return new Promise(resolve => {
        if (!url) {
            resolve(null)
        }
        let img = new Image()
        if (url.indexOf('base64') > -1) {
            img.src = url
        } else {
            img.crossOrigin = 'Anonymous'
            img.src = imageProxy(url)
        }
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function () {
            resolve(null)
        }
    })
    
}

async function drawBackground(canvas, ctx, backgroud) {
    let img = await getImg(backgroud)
    if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
}

async function drawHeadImg(canvas, ctx, headImg) {
    let img = await getImg(headImg)
    if (img) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(28 + 50 / 2, 28 + 50 / 2, 50 / 2, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(img, 28, 28, 50, 50)
        ctx.restore()
        
    }
}

async function drawNickName(canvas, ctx, nickName) {
    if (nickName) {
        nickName = nickName.substring(0, 14)
        ctx.save()
        ctx.font = '20px Source Han Sans CN'
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.fillText(nickName, 90, 26)
        ctx.restore()
    }
}

async function drawDesc(canvas, ctx, desc) {
    if (desc) {
        desc = desc.substring(0, 20)
        ctx.save()
        ctx.font = '16px Source Han Sans CN'
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.fillText(desc, 90, 56)
        ctx.restore()
    }
}

async function drawQrCode(canvas, ctx, qrCode) {
    let img = await getImg(qrCode)
    if (img) {
        ctx.drawImage(img, 318, 670, 106, 106)
    }
}

export default async function (options) {
    const canvas = document.createElement('canvas')
    canvas.width = 450
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    await drawBackground(canvas, ctx, options.background)
    await drawHeadImg(canvas, ctx, options.headImg)
    await drawNickName(canvas, ctx, options.nickName)
    await drawDesc(canvas, ctx, options.desc)
    await drawQrCode(canvas, ctx, options.qrCode)
    let imgUrl = canvas.toDataURL()
    return imgUrl
}
