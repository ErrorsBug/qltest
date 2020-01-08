import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';
import Detect from 'components/detect';
@autobind
class CommonTextarea extends Component {
    state = {
        placeholder:'',
        value: this.props.value || '',
    }

    componentDidMount(){
        this.setPlacehoder();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.placeholder != nextProps.placeholder) {
            this.setState({
                placeholder : nextProps.placeholder
            })
        }

        if (this.state.value != nextProps.value) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    setPlacehoder(){
        if(this.props && this.props.placeholder) {
            this.setState({
                placeholder : this.props.placeholder
            })
        }
    }

    // 触发焦点时清除placehoder
    inputFocus(){
        let ui = typeof window == 'undefined' ? '' : (navigator.userAgent || '');
        if (!this.props.noIntoView && Detect.os.phone && !ui.match(/11_\d/)) {
            setTimeout( ()=> {
                let cInput = findDOMNode(this.commonTextarea);
                if (cInput) {
                    (function () {
                        var intervalTimes = 0;
                        var intervalId = setInterval(() => {
                            intervalTimes ++;
                            cInput.scrollIntoView(true);//自动滚动到视窗内

                            if (intervalTimes >= 3) {   
                                clearInterval(intervalId)
                            }
                        }, 500)
                    }) ()
                }
            }, 0)
            
        }
        this.props && this.props.onFocus && this.props.onFocus();
    }

    // 失去焦点时恢复placehoder
    inputBlur(e){
        this.setPlacehoder();
        this.props && this.props.onBlur && this.props.onBlur(e);
        // 解决iOS系统下收起键盘后页面被截断的问题
        window.scroll(0, 0);
    }

    inputOnChange(e){
        const val = e.target.value
        // 长度限制
        if (this.props.maxLength && this.props.maxLength > 0 && val.length > this.props.maxLength) return

        this.props && this.props.onChange && this.props.onChange(e);
        this.setState({
            value : val
        })
        if (val != ''){
            this.setState({
                placeholder : ''
            })
        }else{
            this.setPlacehoder();
        }
    }

    inputOnClick(e){
        this.props && this.props.onClick && this.props.onClick(e);
    }
    render() {
        return (
            <textarea
                ref = {dom => this.commonTextarea = dom}
                className = {`common-textarea ${this.props.className}`}
                placeholder = {this.state.placeholder}
                onFocus = {this.inputFocus}
                onBlur = {this.inputBlur}
                value = {this.state.value}
                onChange = {this.inputOnChange}
                onClick = { this.inputOnClick}
                disabled = {this.props.disabled || false}
                autoFocus = { this.props.autoFocus || false}
            />
        );
    }
}

CommonTextarea.propTypes = {

};

export default CommonTextarea;
