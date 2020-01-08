/**
 * Created by dylanssg on 2017/11/27.
 */

function imageProxy (url) {
	return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
}

const loadImg = function(imgUrl){
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

let canvas;
let ctx;
const canvasWidth = 640;
const canvasHeight = 1136;
const horizontalCenter = canvasWidth / 2;

const drawBg = async function(bgImgUrl){
	const bgImg = await loadImg(imageProxy(bgImgUrl));
	ctx.save();
	ctx.globalCompositeOperation = 'destination-over';
	ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
	ctx.restore();
};

const drawAvatar = async function(avatarImgUrl){
	const avatarImg = await loadImg(imageProxy(avatarImgUrl));
	const arcCenter = horizontalCenter + 3;
	const r = 51;
	const y = 384;
	ctx.save();
	ctx.beginPath();
	ctx.arc(arcCenter, y, r, 0, 2 * Math.PI);
	ctx.clip();
	ctx.drawImage(avatarImg, arcCenter - r, y - r, 102, 102);
	ctx.restore();
};

const drawName = function(name){
	ctx.save();
	ctx.font = "bolder 34px STHeiti";
	ctx.fillStyle = '#333333';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	if(name.length > 9){
		name = name.substr(0,9) + '...'
	}
	ctx.fillText(name, horizontalCenter, 466);
	ctx.restore();
};

const drawClockInNum = async function(num){
	num = num.toString().split("").join(String.fromCharCode(8202));
	const unitImg = await loadImg(imageProxy('https://img.qlchat.com/qlLive/liveCommon/clock-in-unit.png'));
	const unitImgWidth = unitImg.width;
	// const unitImgWidth = 33;
	ctx.save();
	ctx.font = "normal 70px Arial";
	ctx.fillStyle = '#d24132';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	const numWidth = ctx.measureText(num).width;
	ctx.fillText(num, horizontalCenter - (unitImgWidth / 2 + 2), 695);
	ctx.drawImage(unitImg, horizontalCenter + (numWidth / 2 + 2), 680, 33, 34);
	ctx.restore();
};

const drawQrCode = async function(qrCodeUrl){
	const qrCodeImg = await loadImg(imageProxy(qrCodeUrl));
	ctx.save();
	ctx.drawImage(qrCodeImg, 167, 836, 146, 146);
	ctx.restore();
};

export default async function({
	bgImgUrl,
	name,
	avatarImgUrl,
	clockInNum,
	qrCodeUrl
}){
	canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx = canvas.getContext('2d');

	drawName(name);

	await Promise.all([
		drawBg(bgImgUrl),
		drawAvatar(avatarImgUrl),
		drawClockInNum(clockInNum),
		drawQrCode(qrCodeUrl)
	]);

	return canvas.toDataURL('image/jpeg');
}