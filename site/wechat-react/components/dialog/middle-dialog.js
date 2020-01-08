import React, {Component} from 'react'
import PropTypes from 'prop-types';
import classnames from 'classnames';

MiddleDialog.propTypes = {
    // 是否显示弹框
    show: PropTypes.bool.isRequired,

    // 设置是否点击背景关闭弹框
    bghide: PropTypes.bool,

    // theme
    // empty: 一个空白弹框，啥都没有
    // primary: 一个蓝色背景的头部
    theme: PropTypes.oneOf(['empty', 'primary']),

    // 标题
    title: PropTypes.string,

    // 标题的样式
    // white: 白色的头部
    // blue: 蓝色的头部
    titleTheme: PropTypes.oneOf(['white', 'blue']),

    // buttons
    // none(default): 隐藏按钮栏
    // cancel: 取消按钮
    // confirm: 确认按钮
    // cancel-confirm: 左取消右确认按钮
    // confirm-cancel: 右取消左确认按钮
    buttons: PropTypes.oneOf(['none', 'cancel', 'confirm', 'cancel-confirm','confirm-cancel']),

    // 取消按钮文案
    cancelText: PropTypes.string,

    // 确认按钮文案
    confirmText: PropTypes.string,

    // buttonTheme
    // line: 线条隔开形式的按钮
    // block: 方块形式的按钮
    buttonTheme: PropTypes.oneOf(['line', 'block']),

    // 按钮点击事件
    // 回调参数: (tag: string) => null
    onBtnClick: PropTypes.func,

    // 是否显示关闭按钮
    close: PropTypes.bool,

    // 关闭事件(关闭按钮触发或者点击背景触发)
    onClose: PropTypes.func,

    closeStyle:PropTypes.string,

    className: PropTypes.string,

    contentClassName: PropTypes.string,

    confirmDisabled: PropTypes.bool, // confirm按钮是否无效

    // 关闭按钮埋点
    trackCloseBtnModel: PropTypes.objectOf(PropTypes.string),
};

MiddleDialog.defaultProps = {
    onClose: () => {},
};

/**
 * 中间弹框组件
 */
function MiddleDialog ({
    show,
    theme,
    titleTheme = 'white',
    buttons,
    buttonTheme,
    close,
    closeStyle="normal-style",
    closeProps,
    onClose,
    children,
    title,
    onBtnClick,
    className,
    contentClassName,
    cancelText = "取消",
    confirmText = "确定",
    bghide = true,
    confirmDisabled = false,
    trackCloseBtnModel = {},
}) {
    if (!show) {
        return null
    }

    let titleNode
    if (title) {
        titleNode = genTitle(title, titleTheme);
    }

    let buttonNode
    if (buttonTheme === 'line') {
        buttonNode = genLineButton(buttons,cancelText,confirmText, onBtnClick, confirmDisabled)
    } else if (buttonTheme === 'block') {
        buttonNode = genBlockButton(buttons,cancelText,confirmText, onBtnClick)
    }

    let closeNode
    if (close) {
        closeNode = genClose(onClose, closeStyle, closeProps, trackCloseBtnModel)
    }

    return (
        <div className={'co-dialog-container ' + className}>
            <div className='co-dialog-bg' onClick={ (e) => { e.nativeEvent.stopImmediatePropagation(); bghide && onClose(e); } } ></div>

            <div className='co-dialog-content'>
                { closeNode }

                { titleNode }

                <main className={ contentClassName }>
                    { children }
                </main>

                { buttonNode }
            </div>
        </div>
    )
}

export default MiddleDialog;

const dangerHtml = content => {
    return { __html: content }
};

/**
 * 生成头部标题
 */
function genTitle (title, titleTheme) {
    return (
        <div className={ classnames('co-dialog-title', titleTheme) } dangerouslySetInnerHTML={ dangerHtml(title) }></div>
    )
}

/**
 * 生成线条隔开的按钮
 */
function genLineButton (buttons,cancelText,confirmText, onClick, confirmDisabled) {
    if (buttons === 'none') {
        return ''
    } else if (buttons === 'cancel') {
        return (
            <div className='co-dialog-btn-line'>
                <span className='co-dialog-btn-line-cancel'
                      onClick={ (e) => {e.nativeEvent.stopImmediatePropagation(); onClick('cancel');  } }>
                    { cancelText }
                </span>
            </div>
        )
    } else if (buttons === 'confirm') {
        return (
            <div className='co-dialog-btn-line'>
                <span className='co-dialog-btn-line-confirm'
                      onClick={ () => onClick('confirm') }>
                    { confirmText }
                </span>
            </div>
        )
    } else if (buttons === 'cancel-confirm') {
        return (
            <div className='co-dialog-btn-line'>
                <span className='co-dialog-btn-line-cancel'
                      onClick={ (e) => {e.nativeEvent.stopImmediatePropagation(); onClick('cancel');  } }>
                    { cancelText }
                </span>

                {
                    confirmDisabled ?
                    <span className='co-dialog-btn-line-confirm disabled'>
                        { confirmText }
                    </span> :
                    <span className='co-dialog-btn-line-confirm'
                        onClick={ () => onClick('confirm') }>
                        { confirmText }
                    </span>
                }
            </div>
        )
    } else if (buttons === 'confirm-cancel') {
        return (
            <div className='co-dialog-btn-line'>
                <span className='co-dialog-btn-line-confirm'
                      onClick={ () => onClick('confirm') }>
                    { confirmText }
                </span>
                <span className='co-dialog-btn-line-cancel'
                      onClick={ (e) => {e.nativeEvent.stopImmediatePropagation(); onClick('cancel');  } }>
                    { cancelText }
                </span>
            </div>
        )
    }
}

/**
 * 生成方块状的按钮
 */
function genBlockButton (buttons,cancelText,confirmText, onClick) {
    if (buttons === 'none') {
        return ''
    } else if (buttons === 'cancel') {
        return (
            <div className='co-dialog-btn-block'>
                <div className='co-dialog-btn-block-wrap'>
                    <span className='co-dialog-btn-block-cancel'
                        onClick={ (e) => {e.nativeEvent.stopImmediatePropagation(); onClick('cancel');  } }>
                        { cancelText }
                    </span>
                </div>
            </div>
        )
    } else if (buttons === 'confirm') {
        return (
            <div className='co-dialog-btn-block'>
                <div className='co-dialog-btn-block-wrap'>
                    <span className='co-dialog-btn-block-confirm'
                        onClick={ () => onClick('confirm') }>
                        { confirmText }
                    </span>
                </div>
            </div>
        )
    } else if (buttons === 'cancel-confirm') {
        return (
            <div className='co-dialog-btn-block'>
                <div className='co-dialog-btn-block-wrap'>
                    <span className='co-dialog-btn-block-cancel'
                        onClick={ (e) => {e.nativeEvent.stopImmediatePropagation(); onClick('cancel');  } }>
                        { cancelText }
                    </span>
                </div>

                <div className='co-dialog-btn-block-wrap'>
                    <span className='co-dialog-btn-block-confirm'
                        onClick={ () => onClick('confirm') }>
                        { confirmText }
                    </span>
                </div>
            </div>
        )
    } else if (buttons === 'confirm-cancel') {
        return (
            <div className='co-dialog-btn-block'>
                <div className='co-dialog-btn-block-wrap'>
                    <span className='co-dialog-btn-block-confirm'
                        onClick={ () => onClick('confirm') }>
                        { confirmText }
                    </span>
                </div>
                <div className='co-dialog-btn-block-wrap'>
                    <span className='co-dialog-btn-block-cancel'
                        onClick={ (e) => {e.nativeEvent.stopImmediatePropagation(); onClick('cancel');  } }>
                        { cancelText }
                    </span>
                </div>

            </div>
        )
    }
}

/**
 * 生成关闭按钮
 */
function genClose (onClose, closeStyle, closeProps, trackCloseBtnModel) {
    return (
        <div 
            className={`co-dialog-close ${closeStyle}`} 
            data-log-name={trackCloseBtnModel.name}
            data-log-region={trackCloseBtnModel.region}
            data-log-pos={trackCloseBtnModel.pos}
            onClick={ (e) => onClose(e) } 
            {...closeProps}
        ></div>
    )
}
