
/**
 * 二维码图片组件，曝光统计，长按统计
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logQRCodeTouchTrace } from '../../utils/log-util';

class QRImg extends Component {
    // 是否正在进行touch事件
    isTouching = false

    componentDidMount(){
        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    touchStartHandle(){
        this.isTouching = true
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
                logQRCodeTouchTrace(this.props.traceData)
            }
        },700)
    }

    touchEndHandle(){
        if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
    }
    
    render() {
        let { src, className, traceData, channel, appId, pos } = this.props
        // 没有appid，则不打印index字段的日志
        if(appId){
            return (
                <img src={src} className={`on-visible ${className}`} onTouchStart = {this.touchStartHandle.bind(this)} onTouchEnd = {this.touchEndHandle.bind(this)} log-region={`visible-${traceData}`} log-pos = {pos || channel} log-index = {appId}/>
            );
        }else {
            return (
                <img src={src} className={`on-visible ${className}`} onTouchStart = {this.touchStartHandle.bind(this)} onTouchEnd = {this.touchEndHandle.bind(this)} log-region={`visible-${traceData}`} log-pos = {pos || channel}/>
            );
        }
    }
}

QRImg.propTypes = {
    // 二维码链接
    src: PropTypes.string,
    // 统计字段
    traceData: PropTypes.string,
    // 渠道名字
    channel: PropTypes.string,
    // 类名
    className: PropTypes.string,
    // appid
    appId: PropTypes.string,
    // 如需替换pos值
    pos: PropTypes.string,
};

export default QRImg;