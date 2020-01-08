import React, { Component, Fragment } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as styles from './style.scss';
import { YorN } from '../../models/course.model';
import { Icon } from 'antd';

interface cb {
    (e?: Object): any;
}

interface btn {
    onClick: cb;
    text: string;
    show: YorN;
}


interface header {
    title?: string;
    type?: 'SMALL' | 'BIG';
    tips?: string;
    showCloseBtn?: YorN;
    show: YorN;
    /* header背景图的样式，目前只有universe */
    backgroundImageStyle?: 'universe'
}
export interface ModalProps {
    show: string; //Y / N
    bgHide?: YorN;
    className?: string;
    onClose: cb;
    showCloseBtn?: YorN;
    header?: header;
    confirmBtn?: btn;
    cancelBtn?: btn;
}

@autobind
export default class Modal extends Component<ModalProps, any> {

    constructor(props) {
        super(props);
    }

    static defaultProps: Partial<ModalProps> = {
        header: {
            show: 'N',
            type: 'SMALL',
            showCloseBtn: 'Y',
        },
        confirmBtn: {
            show: 'N',
            text: '确认',
            onClick: () => {}
        },
        cancelBtn: {
            show: 'N',
            text: '取消',
            onClick: () => {}
        },
        bgHide: 'Y',
    }

    onClose(e) {
        this.props.onClose(e);
    }

    onConfirm(e) {
        this.props.onClose(e);
        this.props.confirmBtn.onClick(e);
    }

    onCancel(e) {
        this.props.onClose(e);
        this.props.cancelBtn.onClick(e);
    }

    render() {
        if (typeof window == "undefined") return null;
        let portalBody = null;
        portalBody =  document.querySelector("#modal-content");
        // console.log(portalBody)
        if (!portalBody) return null
        // console.log(portalBody);
        const { title, tips, type, showCloseBtn, backgroundImageStyle } = this.props.header
        const headerClass = classNames({
            [styles.header]: true,
            [styles.headerSmall]: type === 'SMALL',
            [styles.headerBig]: type === 'BIG',
        })
        let headerStyle = {} as any
        if (backgroundImageStyle) {
            let image=''
            switch (backgroundImageStyle) {
                case 'universe':
                    image = require('./img/universe.png')
                    break;
            }
            headerStyle.backgroundImage = image
        }

        return (
            <Fragment>
                {
                    ReactDOM.createPortal(
                        <ReactCSSTransitionGroup
                            transitionName="component-dialog-background"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                        >
                            {
                                this.props.show === 'Y'? 
                                <div 
                                    className={styles.componentDialogBg}
                                    onClick={this.props.bgHide === 'Y' ? this.onClose : undefined}
                                /> :
                                null
                            }
                        </ReactCSSTransitionGroup>,
                    portalBody)
                }
                {
                    ReactDOM.createPortal(
                        <ReactCSSTransitionGroup
                            transitionName="component-middle-dialog-content"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                        >  
                            {
                                this.props.show === 'Y'?
                                <div className={`${styles.componentMiddleDialogContent} ${this.props.className}`}>
                                {    
                                    this.props.header.show === 'Y' ?
                                    <div className={`${headerClass} `} style={headerStyle}>
                                        <div className={styles.modalTitle}>{title}</div>
                                        <div className={styles.modalTips}>{tips}</div>
                                        { 
                                            showCloseBtn === 'Y' ?
                                            <Icon className={styles.closeBtn} onClick={this.onClose} type="close"/> :
                                            null
                                        }
                                    </div> :
                                    null
                                }
                                    <div className={styles.content}>
                                        {this.props.children}
                                    </div>
                                    <div className={styles.btnArea}>
                                    {
                                        this.props.cancelBtn.show === 'Y'? 
                                        <div className={`${styles.btn} ${styles.cancelBtn}`} onClick={this.props.cancelBtn.onClick}>{this.props.cancelBtn.text}</div> :
                                        null
                                    }
                                    {
                                        this.props.confirmBtn.show === 'Y'? 
                                        <div className={`${styles.btn} ${styles.confirmBtn}`} onClick={this.props.confirmBtn.onClick}>{this.props.confirmBtn.text}</div> :
                                        null
                                    }
                                    </div>
                                </div> :
                                null
                            }
                        </ReactCSSTransitionGroup>,
                    portalBody)
                }
            </Fragment>
        )
    }
}

// Modal.defaultPorps = {
//     header: {
//         text: 'asdfas',
//         type: 'BIG'
//     }
// }