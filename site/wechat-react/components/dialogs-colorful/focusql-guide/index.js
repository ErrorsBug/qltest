import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 顶部关注千聊引导弹框
class QlFocusGuideDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                closeStyle="icon_cancel"
                titleTheme={'white'}
                className="ql-focus-qrcode"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <div className="title">关注千聊获取更多优质课程</div>
                    <div className="qr-box">
                        <img src={this.props.qrCode}  className={`on-visible`}
							data-log-name="三方分销系列课顶部引导关注千聊"
							data-log-region="visible-three-channel-topguid"
							data-log-pos="112" alt=""/>
                    </div>
                    <div className="extrude">长按识别二维码并关注</div>
                </div>
            </MiddleDialog>
        );
    }
}


export default QlFocusGuideDialog;