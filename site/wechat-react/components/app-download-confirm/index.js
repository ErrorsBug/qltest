import React from 'react';
import { MiddleDialog } from 'components/dialog';
import { locationTo } from 'components/util';


export default class AppDownloadConfirm extends React.Component {
    render() {
        return (
            <MiddleDialog
                className="co-app-download-confirm"
                closeStyle="icon_cross on-visible"
                closeProps={{
                    'data-log-region': 'app-download-confirm-close'
                }}
                show={true}
                close={true}
                onClose={this.onClose}
            >
                <div className="content">
                    使用千聊APP，享受三倍加载速度，拒绝卡顿延迟。独家离线听课功能，助你学习更流畅
                </div>
                <div className="btn-download on-log on-visible"
                    data-log-region="app-download-confirm-confirm"
                    data-log-name="app引导下载-下载"
                    onClick={this.onClickDownload}>立即下载</div>
            </MiddleDialog>
        )
    }

    componentDidMount() {
        // setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        // }, 10);
    }
   
    onClose = () => {
        this.props.onClose && this.props.onClose();
        typeof _qla != 'undefined' && _qla('click', {name: 'app引导下载-关闭', region: "app-download-confirm-close"});
    }

    onClickDownload = () => {
        locationTo(this.props.downloadUrl || 'http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live')
    }
}
