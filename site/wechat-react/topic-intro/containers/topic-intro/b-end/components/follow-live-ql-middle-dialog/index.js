import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import QRImg from 'components/qr-img';
import MiddleDialog from 'components/dialog/middle-dialog'

class FollowLiveQlMidDialog extends Component {
    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        
        return createPortal(
            <MiddleDialog
                className='follow-live-ql-middle-dialog'    
                show={ true }
                theme='empty'
                onClose={this.props.hide}
                close={ true }
            >
                <div className="main">
                    <span className="follow-title"><i className="icon_checked"></i>设置开播提醒</span>  
                    <QRImg 
                        src = {this.props.qrUrl}
                        traceData = "topicIntroFollowLiveQrcode"
                        channel = {this.props.channel}
                        appId = {this.props.appId}
                    />       
                    {/* <img src={this.props.qrUrl}/> */}
                    <span className="tips">长按识别二维码并关注</span>
                    <span className="tips">关注服务号即可收到开播通知</span>
                </div>    
            </MiddleDialog>,
            document.getElementById('app')
        );
    }
}

FollowLiveQlMidDialog.propTypes = {

};

export default FollowLiveQlMidDialog;