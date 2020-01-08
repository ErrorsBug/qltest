import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { autobind } from 'core-decorators';

/**
 * 未购买弹窗
 */
@autobind
class IsBuyDialog extends Component {

    constructor (props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    show() {
        this.setState({
            show: true,
        });
    }

    hide() {
        this.setState({
            show: false,
        });
    }

    confirm () {
        this.props.onBtnClick({
            type: 'cancel'
        })
        this.hide()
    }

    cancel () {
        this.props.onBtnClick({
            type: 'cancel'
        })
        this.hide()
    }

    render () {
        const {
            title,
            desc,
            cancelText = this.props.cancelText || "取消",
            confirmText = this.props.confirmText || "确定",
            money
        } = this.props;

        const {
            show,
        } = this.state;

        return show && (
            <div className="is-buy-dialog co-dialog-container">
                <div className="co-dialog-bg">
                    <div className="co-dialog-content">
                        <p className="title">{title}</p>
                        <p className="desc">{desc}</p>

                        <div className="btn-group">
                            <div className="btn confirm" onClick={() => {this.confirm()}}>
                                <span>{confirmText}</span>
                                {/* {
                                    money && (
                                        <span className="money">{money}</span>
                                    )
                                } */}
                            </div>
                            {/* <div className="btn cancel" onClick={() => {this.cancel()}}>
                                <span>{cancelText}</span>
                            </div> */}
                        </div>

                        <span className="co-dialog-close normal-style" onClick={() => {this.hide()}}>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

IsBuyDialog.propTypes = {
    // 标题
    title: PropTypes.string,
    // 描述
    desc: PropTypes.string,
    // 按钮点击事件
    // 回调参数: (tag: ['cancel' | 'confirm']) => null
    onBtnClick: PropTypes.func,
    // 确认按钮文案
    confirmText: PropTypes.string,
    // 取消按钮文案
    cancelText: PropTypes.string,
    // 价格
    money: PropTypes.number
};

export default IsBuyDialog;
