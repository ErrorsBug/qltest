import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MiddleDialog from 'components/dialog/middle-dialog';
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import QRImg from 'components/qr-img';
import IntroQrCodeDialog from 'components/intro-qrCode-dialog'

/**
 * 关注弹框
 */
@autobind
class FollowDialog extends Component {

    constructor (props) {
        super(props);

        this.state = {
        };
    }
    
    componentDidMount(){
    }

    show() {
        this.introQrCodeDialogDom.show();
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e);
        this.introQrCodeDialogDom.hide();
    }

    focusLiveConfirm(){
        this.props.focusLiveConfirm();
        this.props.onClose && this.props.onClose(e);
    }

    joinCommunityConfirm() {
        this.props.joinCommunityConfirm && this.props.joinCommunityConfirm();
    }

    render () {
        if (typeof (document) == 'undefined') {
            return false;
        }

        const {
            qrUrl,
            option, // 统计配置
            qrcodeBoxType,
            focusNumber // 关注数量
        } = this.props;

        return createPortal(
            <IntroQrCodeDialog 
                ref={ dom => dom && (this.introQrCodeDialogDom = dom) }
                followDialogType = {qrcodeBoxType}
                qrUrl={qrUrl}
                option={ option }
                focusNumber={focusNumber}
                onClose={this.joinCommunityConfirm}
                focusLiveConfirm = {this.focusLiveConfirm}
                relationInfo = {this.props.relationInfo}
            />,
            document.getElementById('app')
        );
    }
}

FollowDialog.propTypes = {
    // 标题
    title: PropTypes.string,
    desc: PropTypes.string,
    onClose: PropTypes.func,
    // 自定义样式
    className: PropTypes.string,
    qrUrl: PropTypes.string,
    tips: PropTypes.string,
    option: PropTypes.object,
    focusLiveConfirm: PropTypes.func
};

export default FollowDialog;
