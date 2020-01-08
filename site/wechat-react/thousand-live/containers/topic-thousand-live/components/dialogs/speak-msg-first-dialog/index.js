import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import QRImg from 'components/qr-img';

// 首条信息流弹码
class SpeakMsgFirstQrDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="speak-msg-first-focus-qrcode"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <div className="extrude">长按识别二维码</div>
                    <div className="common">关注直播间，下次开课会通知你</div>
                    <div className="img-container">
                        <QRImg 
                            src = {this.props.qrCode}
                            traceData = {this.props.traceData}
                            channel = {this.props.channel}
                            appId = {this.props.appId}
                        />             
                    </div>
                </div>
            </MiddleDialog>
        );
    }
}


export default SpeakMsgFirstQrDialog;