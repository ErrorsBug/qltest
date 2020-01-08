/**
 * 生成最后一个选项的卡
 */
module.exports = function commonShareCard (qrcodeUrl, cb) {
    if (window.qrcodeData) {
        cb(window.qrcodeData);
        return;
    }

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 1136;

    var bgImage = new Image();
    bgImage.src = '/api/wechat/image-proxy?url=https://img.qlchat.com/qlLive/liveCommon/template-11.jpg';
    bgImage.crossOrigin = 'Anonymous';
    bgImage.onload = function () {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        var qrcode = new Image();
        qrcode.src = imageProxy(qrcodeUrl);
        qrcode.crossOrigin = 'Anonymous';
        qrcode.onload = function () {
            ctx.drawImage(
                qrcode,
                canvas.width / 2 - 80,
                587,
                160,
                160
            );
            
            // 保存在页面上
            // saveToImage(canvas.toDataURL('image/png'));

            // draw logo
            if (!window.initData.IS_LIVE_ADMIN && !window.initData.IS_WHITE_LIST_LIVE) {
                var logo = new Image();
                logo.crossOrigin = 'anonymous';
                logo.src = imageProxy('https://img.qlchat.com/qlLive/business/4PB8HQJJ-UYNX-9G2T-1540970749958-T8913LQQQ9O5.png');
                logo.onload = function() {
                    ctx.save();
                    ctx.drawImage(logo, 201, 1020, 237, 26);
                    ctx.restore();
                    window.qrcodeData = canvas.toDataURL('image/png')
                    cb(window.qrcodeData);
                }
            } else {
                window.qrcodeData = canvas.toDataURL('image/png')
                cb(window.qrcodeData);
            }
        }

    }
}
function imageProxy (url) {
    return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
}