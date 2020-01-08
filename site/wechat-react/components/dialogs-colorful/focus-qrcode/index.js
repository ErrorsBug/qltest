import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import QRImg from 'components/qr-img';

// 热心拥趸
class LiveFocusQrDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="live-focus-qrcode"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <QRImg 
                        src = {this.props.qrCode}
                        traceData = {this.props.traceData}
                        channel = {this.props.channel}
                        appId = {this.props.appId}
                    />
                    <div className="extrude">长按识别二维码</div>
                    <div className="common">长按二维码关注，下一次开课会通知你</div>
                </div>
            </MiddleDialog>
        );
    }
}


export default LiveFocusQrDialog;