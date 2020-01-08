import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MiddleDialog from 'components/dialog/middle-dialog';
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import QRImg from 'components/qr-img';

/**
 * 关注弹框
 */
@autobind
class FollowDialog extends Component {

    constructor (props) {
        super(props);

        this.state = {
            show: false,
        };
    }
    
    componentDidMount(){
    }

    show() {
        this.setState({
            show: true,
        });
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }

    hide() {
        this.setState({
            show: false,
        });
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e);
        this.hide();
    }

    render () {
        
        if (typeof (document) == 'undefined') {
            return false;
        }

        const {
            title,
            desc,
            titleTheme = 'white',
            close= true,
            bghide= true,
            qrUrl,
            option, // 统计配置
            tips = '长按识别二维码关注',
            className,
            ...props
        } = this.props;

        const {
            show,
        } = this.state;

        return createPortal(
            <MiddleDialog
                title = { title }
                titleTheme = { titleTheme }
                show = { show }
                theme = 'empty'
                close = { close }
                onClose = { this.onClose }
                bghide={bghide}
                className="follow-qrcode-dialog"
            >
                <main className="follow-qrcode-dialog-container">
                    <p className="desc">{ desc }</p>

                    <div className="qr-box">
                        <div className="qr-container">
                            {
                                option && option.traceData ? 
                                <QRImg 
                                    src = { qrUrl }
                                    traceData = { option.traceData }
                                    channel = { option.channel }
                                    appId={ option.appId }
                                    className="qr"
                                    pos= { option.pos }
                                /> : <img className={`qr ${className}`} src={ qrUrl } alt="" { ...props } />
                            }
                            <img src={ require('./img/finger.png') } className="guide" />
                        </div>
                        {
                            tips && <p className="qr-tips"><span>{ tips }</span></p>
                        }
                    </div>
                </main>
            </MiddleDialog>,
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
    option: PropTypes.object
};

export default FollowDialog;
