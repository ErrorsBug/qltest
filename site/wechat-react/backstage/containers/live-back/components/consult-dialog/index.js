import React from "react";
import { createPortal } from "react-dom";

export default function ConsultDialog({onClose}) {
    return createPortal(
        <div className="consult-dialog" onClick={onClose}>
            <div className="consult-dialog-inner" onClick={e => {
                e.stopPropagation();
            }}>
                <img className="icon-close" src={require('../../../../assets/icon-close.svg')} onClick={onClose} />
                <div className="consult-dialog-title">
                    遇到问题啦？
                </div>
                <ol className="consult-dialog-body">
                    <li>产品功能使用问题可直接点击此处查看超全的<a href="https://mp.weixin.qq.com/s/gC5ciBTT0vjeFjQXn4yO9Q" target="_blank">《产品使用教程》</a></li>
                    <li>在线咨询聊妹请扫描下方二维码，关注后直接在公众号里反馈问题即可，聊妹看到后会及时回复您的哦！</li>
                    <div className="consult-qrcode-wrap">
                        <img src="//open.weixin.qq.com/qr/code?username=qianliaoservice" />
                    </div>
                    <div className="feedback">长按二维码关注反馈问题</div>
                </ol>
            </div>
        </div>, document.querySelector('.portal-high')
    );
}
