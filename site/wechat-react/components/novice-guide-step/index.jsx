import React from 'react';
import classnames from "classnames";

/**
 * 新手引导 多步骤 镂空用阴影实现，同时只能镂空一个位置
 * StepContainer 镂空容器 大小比例为图片实际大小 无图片则为页面大小 装载镂空点
 * StepBlock 额外贴片 可放置相关指引图 放在StepContainer内则按图片大小定位， 放StepContainer外则为当前组件大小定位
 */

const StepContainer = ({
    children,
    // 背景图
    bgUrl = '',
    // 是否显示
    show = false,
    // 偏移
    top = 0
}) => {
    return show ? (
        <div className="novice-guide-step-container">
            <div className="novice-guide-step-bg" style={{marginTop: top}}>
                { bgUrl ? <img src={bgUrl} className="" /> : null }
                <div className="novice-guide-step-content">
                    {children}
                </div>
            </div>
        </div>
    ) : null
}

const StepBlock = ({
    className = "",
    style = {},
    onClick = () => {},
    children
}) => {
    return (
        <div 
            className={classnames(
                'step-block', 
                className
            )} 
            style={style} 
            onClick={onClick}>{children}</div>
    )
}

const StepPoint = ({
    className = "",
    style = {},
    border = true
}) => {
    return (
        <div className={classnames(
            'step-point', 
            className, 
            border ? 'border' : ''
        )} style={style}></div>
    )
}

const StepFrame = ({
    children,
    show = false
}) => {
    return show ? children : null
}

const StepGuideSource = ({
    type = 'up',
    className = "",
    onClick = () => {},
    style = {}
}) => {
    return (
        <div className={classnames(
            'step-guide-source', 
            type,
            className
        )} style={style} onClick={onClick}></div>
    )
}

export default class NoviceGuideStep extends React.Component {

    static StepFrame = StepFrame;
    static StepContainer = StepContainer;
    static StepBlock = StepBlock;
    static StepPoint = StepPoint;
    static StepGuideSource = StepGuideSource;

    render () {
        const {
            className
        } = this.props
        return (
            <div 
                className={classnames(
                    'novice-guide-step',
                    className
                )}>
                {this.props.children}
            </div>
        )
    }
}