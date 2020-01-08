import React, { useState, useEffect } from "react";
export default function FocusLive({ qrUrl, onClose }) {
    const [imgData, setImgData] = useState(undefined);
    
    useEffect(() => {
        if (qrUrl) {
            let canvas = document.createElement("canvas");
            let getPasterBg = new Promise(resolve => {
                const img = new Image();
                img.onload = function() {
                    resolve(img);
                };
                img.src = imageProxy(qrUrl);
            });

            getPasterBg.then(qrcode => {
                const img = new Image();
                img.crossOrigin = "Anonymous"
                img.onload = function() {
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    ctx.drawImage(
                        qrcode,
                        0,
                        0,
                        qrcode.width,
                        qrcode.height,
                        20,
                        20,
                        img.height - 40,
                        img.height - 40
                    );
                    const res = canvas.toDataURL("image/png");
                    setImgData(res);
                };
                img.src = require("../../img/paster.png");
            });
        }
    }, [qrUrl]);

    return (
        <div className="focus-live">
            <span className="icon-close" onClick={onClose}></span>
            {imgData && <img className="paster-qr" src={imgData} />}
        </div>
    );
}

function imageProxy(url) {
    if (/^data:image\/\w+;base64,/.test(url)) {
        return url;
    } else {
        return "/api/wechat/image-proxy?url=" + encodeURIComponent(url);
    }
}
