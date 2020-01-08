import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import QRImg from 'components/qr-img';

function ModalContent(props) {
    return <div className='co-share-success-modal'>
        <div className="bg" onClick={props.close}></div>
        <main className='share-success-modal'>
            <div className="icon"></div>
            <div className="title">分享成功</div>
            <div className="img-container">
            {
                // 有日志统计字段的引用QRImg组件
                props.traceData ? 
                <QRImg 
                    src = {props.url}
                    traceData = {props.traceData}
                    channel = {props.channel}
                    appId = {props.appId}
                />
                :<img src={props.url} alt="" />
            }         
            </div>
            <p className="tips">长按扫描关注公众号</p>
            <p className="tips">发现更多对你有用的知识！</p>

            <div className="close" onClick={props.close}></div>
        </main>
    </div>
}

export function showShareSuccessModal({url, traceData = '', channel = '', appId = ''}) {

    const $el = document.createElement('div')
    document.body.appendChild($el)

    function close() {
        $el.parentNode.removeChild($el)
    }

    ReactDOM.render(
        <ModalContent
            url={url}
            traceData={traceData}
            channel = {channel}
            close={close}
            appId = {appId}
        />,
        $el
    )

    return { close }
}
