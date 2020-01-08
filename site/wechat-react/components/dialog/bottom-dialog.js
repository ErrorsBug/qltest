import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Switch from '../switch';

const dangerHtml = content => {
    return { __html: content }
};

BottomDialog.propTypes = {
    // 是否显示组件
    show: PropTypes.bool.isRequired,

    // 是否点击背景关闭弹框
    bghide: PropTypes.bool,

    // 标题
    title: PropTypes.string,

    // 标题的标签
    titleLabel: PropTypes.string,

    className: PropTypes.string,

    // 弹框内容类型
    // list: 弹出一个类似action sheet的列表
    // empty: 一个空弹框，自由发挥
    theme: PropTypes.oneOf(['list', 'empty', 'scroll']),

    // 项目列表
    items: PropTypes.arrayOf(
        PropTypes.shape({
            // 列表项的键，用于识别点击事件
            key: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]).isRequired,

            // 图标，请用本项目自带的字体图标库中的图标，这里是传递一个class name而已
            icon: PropTypes.string,

            // 内容，本内容将以html形式插入item内容位置，意味着你可以自定义item里面的内容，包括样式，别乱来
            content: PropTypes.string,

            // 是否显示
            show: PropTypes.bool,

            // switch的状态，不传就不显示switch
            switchStatus: PropTypes.bool,

            // 主题样式
            // normal: 黑色的字体
            // danger: 红色的样式
            theme: PropTypes.oneOf(['normal', 'danger'])
        })
    ),

    // 是否显示关闭按钮,这个关闭按钮是底部的那个取消按钮
    close: PropTypes.bool,
    // 是否不显示埋点 false 要有埋点 true不用埋点
    notShowPoint: PropTypes.bool,

    // 关闭按钮内容
    closeText: PropTypes.string,

    // 关闭弹框事件(点击背景的时候，并且设置bghide=true时触发)
    onClose: PropTypes.func,

    // 列表项点击事件,
    onItemClick: PropTypes.func,
    // 表示是否选中
    activeString: PropTypes.string, 
    // 是否展示确定按钮
    showSure: PropTypes.bool,
};

/**
 * 底部弹框组件
 */
function BottomDialog (props) {
    const {
        show,
        bghide = true,
        title,
        titleLabel,
        className,
        theme,
        items,
        onClose,
        close = false,
        onItemClick,
        children,
        notShowPoint
    } = props;

    if (!show) {
        return null;
    }

    let contentNode
    if (theme === 'list') {
        contentNode = genList(props)
    } else if (theme === 'empty') {
        contentNode = children
    } else if (theme === 'scroll') {
        contentNode = genScrollList(props)
    }

    return (
        <div className={`co-dialog-container ${className}`}>
            <div className='co-dialog-bg' onClick={ () => bghide && onClose && onClose() }></div>

            <div className='co-dialog-bottom'>

                { contentNode }

            </div>
        </div>
    )
}

/**
 * 生成列表样式的action sheet
 */
function genList ({ title, titleLabel, items, close, onItemClick, ...props }) {
    return (
        <ul className='co-dialog-bottom-list'>
            {
                (title || titleLabel) && (
                    <li className='co-dialog-bottom-title'>
                        {titleLabel ? (<span className='co-dialog-bottom-title-label'>{ titleLabel }</span>): null }
                        <span className='co-dialog-bottom-title-content' dangerouslySetInnerHTML={ dangerHtml(title) } ></span>
                        {props.showSure ? 
                            (<span className="dialog-sure on-log" 
                                data-log-region={props.logSure && props.logSure.region}
                                data-log-pos={props.logSure && props.logSure.pos}
                            onClick={props.onSure}>{props.sure || '确定'}</span>)
                            : null
                        }
                    </li>
                )
            }

            {
                items.map((item, index) => {
                    if (item.show === true) {
                        if (item.switchStatus === true || item.switchStatus === false) {
                            return (
                                <li key={`co-dialog-bottom-item${index}`}
                                    hidden={!item.show}
                                    className={ classnames('co-dialog-bottom-item', item.icon, item.theme) }
                                     >
                                    {item.content}
                                    <Switch
                                        className='co-dialog-bottom-item-switch'
                                        active={item.switchStatus}
                                        onChange={() => {onItemClick && onItemClick(item.key, item.switchStatus)}}
                                    />
                                </li>
                            )
                        } else {
                            return (
                                <li key={`co-dialog-bottom-item${index}`}
                                    hidden={!item.show}
                                    className={ 
                                        classnames(
                                            'co-dialog-bottom-item', 
                                            item.icon, 
                                            item.theme, 
                                            item.topictype, 
                                            item.region && !props.notShowPoint ? 'on-log on-visible' : '', 
                                            props.activeString == item.key ? 'co-dialog-bottom-item-active' : ''
                                        ) 
                                    }
                                    data-log-region={item.region}
                                    data-log-pos={item.pos}
                                    onClick={ () => onItemClick && onItemClick(item.key, "",item.topictype) }
                                    type={item.topicType}
                                    dangerouslySetInnerHTML={ dangerHtml(item.content) } >
                                </li>
                            )
                        }
                    }
                })
            }

            { close && genClose({ ...props }) }
        </ul>
    )
}

/**
 * 生成可以滚动的列表样式的action sheet
 */
function genScrollList ({ title, titleLabel, items, close, onItemClick, scrollHeight = 400,  ...props }) {
    return (
        <ul className='co-dialog-bottom-list'>
            {
                (title || titleLabel) && (
                    <li className='co-dialog-bottom-title'>
                        {titleLabel ? (<span className='co-dialog-bottom-title-label'>{ titleLabel }</span>): null }
                        <span className='co-dialog-bottom-title-content' dangerouslySetInnerHTML={ dangerHtml(title) } ></span>
                    </li>
                )
            }
            <div className="scroll-warp" style={{"height": scrollHeight}}>
                {
                    items.map((item, index) => {
                        if (item.show === true) {
                            if (item.switchStatus === true || item.switchStatus === false) {
                                return (
                                    <li key={`co-dialog-bottom-item${index}`}
                                        hidden={!item.show}
                                        className={classnames('co-dialog-bottom-item', item.icon, item.theme)} >
                                        {item.content}
                                        <Switch
                                            className='co-dialog-bottom-item-switch'
                                            active={item.switchStatus}
                                            onChange={() => { onItemClick && onItemClick(item.key, item.switchStatus) }}
                                        />
                                    </li>
                                )
                            } else {
                                return (
                                    <li key={`co-dialog-bottom-item${index}`}
                                        hidden={!item.show}
                                        className={classnames('co-dialog-bottom-item', item.icon, item.theme, item.topictype)}
                                        onClick={() => onItemClick && onItemClick(item.key, "", item.topictype)}
                                        type={item.topicType}
                                        dangerouslySetInnerHTML={dangerHtml(item.content)} >
                                    </li>
                                )
                            }
                        }
                    })
                }
            </div>


            { close && genClose({ ...props }) }
        </ul>
    )
}

/**
 * 底部取消按钮
 */
function genClose ({ closeText, onClose, onDelete }) {
    return (
        <li className='co-dialog-bottom-close' onClick={ () => {onDelete ? onDelete() : onClose()} } >
            { closeText || '取消' }
        </li>
    )
}

export default BottomDialog;
