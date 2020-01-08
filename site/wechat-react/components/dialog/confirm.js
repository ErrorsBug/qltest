import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import MiddleDialog from './middle-dialog';
import { autobind } from 'core-decorators';

/**
 * 确认框，按钮可配置，状态自管理
 */
@autobind
class Confirm extends PureComponent {

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

    onClose(e) {
        this.props.onClose && this.props.onClose(e);
        this.hide();
    }

    onBtnClick(tag) {
        if (tag === 'cancel') {
            this.props.onClose && this.props.onClose();
            this.hide();
        }
        this.props.onBtnClick && this.props.onBtnClick(tag);
    }

    render () {
        const {
            buttons = 'cancel-confirm',
            title,
            children,
            buttonTheme = 'line',
            titleTheme = 'white',
            className,
            cancelText = this.props.cancelText || "取消",
            confirmText = this.props.confirmText || "确定",
            close = false,
            bghide=true,
            confirmDisabled,
        } = this.props;

        const {
            show,
        } = this.state;

        return (
            <MiddleDialog
                title = { title }
                titleTheme = { titleTheme }
                show = { show }
                theme = 'empty'
                close = { close }
                onClose = { this.onClose }
                buttons = { buttons }
                cancelText = { cancelText }
                confirmText = { confirmText }
                buttonTheme = { buttonTheme }
                onBtnClick = { this.onBtnClick}
                className={className}
                bghide={bghide}
                confirmDisabled={confirmDisabled}
            >
                <div className = 'co-dialog-confirm'>
                    { children }
                </div>
            </MiddleDialog>
        );
    }
}

Confirm.propTypes = {
    // 标题
    title: PropTypes.string,
    // buttons
    // cancel: 取消按钮
    // confirm: 确认按钮
    // cancel-confirm: 左取消右确认按钮 (默认)
    //confirm-cancel:右取消左确认确认按钮
    buttons: PropTypes.oneOf(['cancel', 'confirm', 'cancel-confirm','confirm-cancel', 'none', '']),
    // 按钮点击事件
    // 回调参数: (tag: ['cancel' | 'confirm']) => null
    onBtnClick: PropTypes.func,
    // 按钮样式
    buttonTheme: PropTypes.oneOf(['line', 'block']),
    // 确认按钮文案
    confirmText: PropTypes.string,
    // 取消按钮文案
    cancelText: PropTypes.string,
    // 标题的样式
    // white: 白色的头部
    // blue: 蓝色的头部
    titleTheme: PropTypes.oneOf(['white', 'blue', 'red']),
    // 自定义样式
    className: PropTypes.string,
};

export default Confirm;
