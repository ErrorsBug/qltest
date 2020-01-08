const isNode = typeof window == 'undefined';
require('intersection-observer');

import * as React from 'react';
import PropTypes from 'prop-types';
// import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux';
// import {wxUtils} from 'components/wx-utils';
import Toast from '@ql-feat/toast';
import Loading from '@ql-feat/loading';
import Detect from '@ql-feat/detect';
import QRCode from 'qrcode.react';

// import './style.scss'

import { toast, loading, togglePayDialog, cancelPayDialog } from './actions/common';
import { initCEndSourseInject, recordBrowseHistoryToStorage } from './components/util';
import { Confirm ,MiddleDialog} from '@ql-feat/react-dialog';
import ImageViewer from '@ql-feat/react-image-viewer';
// import FastClick from 'fastclick';
const FastClick = !isNode && require('fastclick');
if(!!FastClick) {
    FastClick.prototype.focus = function (targetElement) {
        let length;
        if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
            length = targetElement.value.length;
            targetElement.focus && targetElement.focus();
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus && targetElement.focus();
        }
    }
}

// import Perf from 'react-addons-perf';
// Perf.start();
const dangerHtml = content => {
    return { __html: content }
};
var _router;

const styleList = [];

class App extends React.Component {

    static contextTypes = {
        router: PropTypes.object,
    }

	static propTypes = {
		context: PropTypes.object,
	};

	static defaultProps = {
		context: {
			insertCss: (...styles) => {
				styles.forEach(style => {const css = style._getCss();
					if(styleList.indexOf(css) < 0){
						styleList.push(css);
						const styleDom = document.createElement('style');
						styleDom.type = 'text/css';
						style._getCss && (styleDom.innerHTML = style._getCss());
						document.querySelector('head').appendChild(styleDom);
					}
				})
			},
		},
	};

	static childContextTypes = {
		insertCss: PropTypes.func.isRequired,
	};

	getChildContext() {
		return this.props.context;
	}

    state = {
        confirmClassName: '',
        confirmContent: '',
        confirmTop: '',
        qrcodeUrl: '',
        qrCodeBase64: '',
        buttons:'none',
        confirmText: '确认',
        cancelText: '取消',
        titleTheme: 'blue',
    }

    componentWillMount() {
        _router = this.context.router;
        recordBrowseHistoryToStorage(_router.location)
        _router.listen(recordBrowseHistoryToStorage)
        
	    // 注入C端来源
	    initCEndSourseInject();
    }

    componentDidMount() {
        // window.Perf = Perf;
        FastClick && FastClick.attach(document.body);

        // 将toast注入window对象
        window.toast = this.props.toastAction;

        // 将loading注入window对象
        window.loading = this.props.loadingAction;

        window.confirmDialog = (msg, success, cancel, topmsg = '' , buttons, options={
            confirmText: '确认',
            cancelText: '取消',
            titleTheme: 'blue',
        }) => {
            this.refs.dialogConfirm.show();
            this.setState({
                confirmContent: msg,
                confirmTop: topmsg,
                buttons,
                confirmText: options.confirmText,
                cancelText: options.cancelText,
                titleTheme: options.titleTheme,
                confirmClassName: options.className,
            });
            this.successDialog = success;
            this.cancelDialog = cancel;
        };

        // 都别争了，用这个吧
        window.simpleDialog = (options = {
            title: null,
            msg: '',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            onConfirm: null,
            onCancel: null,
            titleTheme: 'blue',
        }) => {
            const {
                title = null,
                msg = '',
                buttons = 'cancel-confirm',
                confirmText = '确认',
                cancelText = '取消',
                onConfirm = null,
                onCancel = null,
                titleTheme = 'blue',
                className,
            } = options;

            if (onConfirm || onCancel) {
                window.confirmDialog(msg, onConfirm, onCancel, title, buttons, {
                    confirmText,
                    cancelText,
                    titleTheme,
                    className,
                });
            } else {
                return new Promise((resolve, reject) => {
                    window.confirmDialog(msg, resolve, reject, title, buttons, {
                        confirmText,
                        cancelText,
                        titleTheme,
                        className,
                    });
                });
            }
        }

        // 封装一下confirmDialog，让我可以写成同步执行，显得优雅一些
        window.confirmDialogPromise = (msg, topmsg, buttons) => {
	        return new Promise((resolve,reject) => {
		        window.confirmDialog(msg, () => {
			        resolve(true);
		        },() => {
			        resolve(false);
		        },topmsg, buttons);
	        });
        };

        // 图片预览器
        // 提供show(url, urls)方法开启预览
        // 提供close()方法关闭预览
        window.showImageViewer = (url, urls) => {
            this.refs.imageViewer.show(url, urls);
        };


    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.payment&&nextProps.payment.qcodeUrl) {
            this.setState({
                qrcodeUrl: nextProps.payment.qcodeUrl,
            }, () => {
                const canvas = this.refs['qr-canvas'].getElementsByTagName('canvas')[0]
                const qrCodeBase64 = canvas.toDataURL('image/png')
                this.setState({
                    qrCodeBase64
                })
            });
        }
    }


    onConfirmDialog(tag) {

        if (tag == 'confirm') {
            this.successDialog && this.successDialog();
            this.refs.dialogConfirm.hide();
        } else {
            this.cancelDialog && this.cancelDialog();
        }

        this.successDialog = null;
        this.cancelDialog = null;

    }

    onClosePayment() {
        this.props.cancelPayDialog();
    }

    /**
     * 二维码弹框点击判断
     * @param {Event} e
     */
    onQrCodeTouch (e) {
        const event = e.nativeEvent;
        const appDom = document.querySelector('#app');
        const qrConfirm = document.querySelector('.qrcode-wrap');

        const qrHeight = qrConfirm.clientHeight;
        const qrWidth = qrConfirm.clientWidth;
        const appHeight = appDom.clientHeight;
        const appWidth = appDom.clientWidth;
        const pointX = event.changedTouches[0].clientX;
        const pointY = event.changedTouches[0].clientY;

        const top = (appHeight - qrHeight) / 2;
        const bottom = (appHeight - qrHeight) / 2 + qrHeight;
        const left = (appWidth - qrWidth) / 2;
        const right = (appWidth - qrWidth) / 2 + qrWidth;

        if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
            this.onClosePayment();
        }
    }

    render() {
        return (
            <div className={`${this.props.showPaymentDialog?'main-f-box':''}`}>
                {this.props.children}
                
                {/* 用于弹框传送 */}
                <span className="portal-container" style={{zIndex: 15}}>
                    <span className="portal-high" style={{zIndex: 3}}></span>
                    <span className="portal-middle" style={{zIndex: 2}}></span>
                    <span className="portal-low" style={{zIndex: 1}}></span>
                </span>

                {/* z-index : 9999 */}
                <Toast
                    isOpen={ this.props.toast.show }
                    content={ this.props.toast.msg }
                    duration={ this.props.toast.timeout }
                    type={ this.props.toast.type }
                />

                {/* z-index : 99 */}
                {/*消息确认弹框*/}
                <Confirm
                    ref='dialogConfirm'
                    onBtnClick={this.onConfirmDialog.bind(this)}
                    buttons = { this.state.buttons || 'cancel-confirm' }
                    confirmText = { this.state.confirmText }
                    cancelText = { this.state.cancelText }
                    titleTheme = { this.state.titleTheme }
                    className={this.state.confirmClassName}
                >

                    <main className='dialog-main'>
                        <div className="confirm-top">
                            {this.state.confirmTop}
                        </div>
                        {
                            typeof this.state.confirmContent === 'object' ? (
                                <div className="confirm-content">{this.state.confirmContent}</div>
                            ):(
                                <div className="confirm-content" dangerouslySetInnerHTML={dangerHtml(this.state.confirmContent)}></div>
                            )
                        }
                    </main>
                </Confirm>

                <Loading show={ this.props.loading }/>


                 {/* 支付*/}
                 {/* z-index : 99 */}
                <MiddleDialog
                    show={this.props.showPaymentDialog}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="ql-pay-dialog"
                    title='使用微信扫码支付'
                    onClose={this.onClosePayment.bind(this)}
                >
                    <div className='qrcode-wrap' ref="qr-canvas">
                        <img
                            style={{pointerEvents: !Detect.os.phone && 'none'}}
                            className='qrcode-image'
                            onTouchStart={this.onQrCodeTouch.bind(this)}
                            src={this.state.qrCodeBase64} />

                        <QRCode
                            style={{display: 'none'}}
                            value={this.state.qrcodeUrl} />
                        <p className='qrcode-tip'>扫描二维码，识别图中二维码</p>
                    </div>
                </MiddleDialog>

                <ImageViewer ref="imageViewer"/>

                {
	                !!this.props.virtualQrcodeUrl &&
                    <div className='virtual-qrcode'>
                        <img src={this.props.virtualQrcodeUrl} alt=""/>
                    </div>
                }
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        toast: state.common.toast,
        loading: state.common.loading,
        payment: state.common.payment,
        showPaymentDialog: state.common.payment.showDialog,
        virtualQrcodeUrl: state.common.virtualQrcodeUrl
    }
}

const mapActionToProps = {
    toastAction: toast,
    loadingAction: loading,
    togglePayDialog,
    cancelPayDialog
}

export default connect(mapStateToProps, mapActionToProps)(App);

export function getRouter() {
    return _router;
};
