import * as React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import * as styles from './style.scss';

export interface LoginQrProps {
    url: string;
}

// const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx485213694a978438&redirect_uri=https%3A%2F%2Fm.qlchat.com%2Fvideo%2Fadmin%2Flive%2Fselect%3FloginType%3DqrCode&response_type=code&scope=snsapi_login&state=1520849166591#wechat_redirect';

const url = window.QRCODE_URL;

class LoginQr extends React.Component<LoginQrProps, any> {

    state = {
        qrUrl: url,
    }

    render() {
        return (
            <div className={styles.loginQr}>
                <Spin spinning={!this.state.qrUrl}>
                    <iframe
                        src={this.state.qrUrl}
                        frameBorder="0"
                        scrolling="no"
                        width = "300px"
                        height = "400px"
                    /> 
                </Spin>
            </div>
        );
    }
}

const mapState2Props = state => {
  return {
      
  };
}

export default connect(mapState2Props)(LoginQr);
