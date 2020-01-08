import React, { Component } from 'react'

/**
 * 长按识别以及埋点
 */
export default class extends Component {
    timeOutEvent = null
    onTouchStart = () => {
        this.timeOutEvent = setTimeout(() => { 
            this.props.onPress && this.props.onPress()
            this.timeOutEvent = 0; 
            this.props.onPress && this.props.onPress();
            typeof _qla != 'undefined' && _qla('click', {
                region:this.props.region,
            });
        }, 300);
    }
    onTouchMove = () => {
        clearTimeout(this.timeOutEvent);  
        this.timeOutEvent = 0;  
    }
    onTouchEnd = () => {
        clearTimeout(this.timeOutEvent);  
        if (this.timeOutEvent != 0) {  
            console.log('你点击了');  
        }  
        return false;  
    }
    componentWillUnmount() {
        clearTimeout(this.timeOutEvent);  
        this.timeOutEvent = 0;  
    }
    render() {
        const { className = '' } = this.props;
        return <div 
            className={ className }
            onTouchStart={ this.onTouchStart }
            onTouchMove={ this.onTouchMove }
            onTouchEnd={ this.onTouchEnd }
            onMouseDown={ this.onTouchStart }
            onMouseMove={ this.onTouchMove }
            onMouseUp={ this.onTouchEnd }
            >
            { this.props.children }
        </div>
    }
}

