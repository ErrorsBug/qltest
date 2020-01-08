import React from 'react';


/**
 * 组件渲染时记录曝光
 */
export default class CollectVisible extends React.Component {
    render() {
        return this.props.children;
    }

    componentDidMount() {
        if (typeof this.props.componentDidMount === 'function') {
            this.props.componentDidMount();
        } else {
            typeof _qla === 'undefined' || _qla.collectVisible();
        }
    }
}


/**
 * 收集曝光，默认100毫秒延时
 */
export function collectVisible(time) {
    if (time == 0) {
        typeof _qla === 'undefined' || _qla.collectVisible();
        return;
    }
    setTimeout(function () {
        typeof _qla === 'undefined' || _qla.collectVisible();
    }, time || 100)
}



export function bindVisibleScroll(className) {
    setTimeout(function () {
        typeof _qla !== 'undefined' && _qla.bindVisibleScroll(className);
    }, 100)
}