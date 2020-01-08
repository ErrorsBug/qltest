import { formatDate } from 'components/util';
const canvasFun = require("@ql-feat/canvas-tools")
const multiText = canvasFun.multiText

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

async function drawBackground(canvas, ctx, options) {

	let img = null

	if (options.isShort) {
		img = await getImg(options.backgroundShort)
	} else {
		img = await getImg(options.background)
	}

	if (img) {
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	}
}

async function drawDesc(canvas, ctx, options) {
	if (options.nickName) {
		let nickName = options.nickName.substring(0, 10)
		ctx.save()
		ctx.font = '26px Source Han Sans CN'
		ctx.fillStyle = '#333333'
		ctx.textBaseline = 'top'
		ctx.textAlign = 'left'
		ctx.fillText(nickName + ' 同学', 116, 175)
		ctx.restore()
	}
	if (options.campName && options.campStartTime) {
		let str = '恭喜你，已被录取为《' + options.campName + '》学生，请把通知书发给亲友，邀请他们监督你学习哦！开营时间为:' + formatDate(options.campStartTime, 'yyyy/MM/dd')
		ctx.save()
		ctx.font = '26px Source Han Sans CN'
		ctx.fillStyle = '#333333'
		ctx.textBaseline = 'top'
		ctx.textAlign = 'left'
		multiText(ctx, str, {
			left: 116,
			top: 230,
			width: 520,
			lineHeight: 40,
		})
		ctx.restore()
	}
	if (options.liveName) {
		ctx.save()
		ctx.font = '26px Source Han Sans CN'
		ctx.fillStyle = '#333333'
		ctx.textBaseline = 'top'
		ctx.textAlign = 'right'
		ctx.fillText(options.liveName, canvas.width - 116, 389)
		ctx.fillStyle = '#999999'
		ctx.fillText(formatDate(new Date(), 'yyyy/MM/dd'), canvas.width - 116, 433)
		ctx.restore()
	}
}

async function drawCourseList(canvas, ctx, options) {
	if (options.courseList && options.courseList.length >= 5) {
		let baseX = 66
		let baseY = 720
		ctx.save()
		ctx.font = '28px Source Han Sans CN'
		ctx.textBaseline = 'top'
		ctx.textAlign = 'left'
		ctx.fillStyle = '#ffffff'
		for (let i = 0; i < options.courseList.length; i++) {
			// let indexStr = i + 1 + '、'
			let indexStr = '●'
			let textStr = options.courseList[i].substring(0, 18)
			ctx.fillText(indexStr + textStr, baseX, baseY)
			baseY += 60
		}
		ctx.fillStyle = 'rgba(255,255,255,0.6)'
		ctx.fillText('… 扫二维码查看全部课表', baseX, baseY)
		ctx.restore()

	}
}

async function drawQrCode(canvas, ctx, options) {
	if(options.qrCode) {
		let img = await getImg(options.qrCode)
		if (img) {
			if(options.isShort) {
				ctx.drawImage(img, 313, 640, 127, 127)
			} else {
				ctx.drawImage(img, 565, 1157, 127, 127)
			}
		}
	}

}

export default async function (options) {
	const canvas = document.createElement('canvas')
	if (!options.courseList || options.courseList.length < 5) {
		options.isShort = true
		canvas.width = 750
		canvas.height = 993
	} else {
		canvas.width = 750
		canvas.height = 1334
	}
	const ctx = canvas.getContext('2d')

	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	await drawBackground(canvas, ctx, options)
	await drawDesc(canvas, ctx, options)
	await drawCourseList(canvas, ctx, options)
	await drawQrCode(canvas, ctx, options)
	let imgUrl = canvas.toDataURL()
	return imgUrl
}
