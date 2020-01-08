import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';
import Detect from 'components/detect';

@autobind
class CommonInput extends Component {
    state = {
        placeholder: '',
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
    inputFocus(e) {
        if(window.inputBlurResetTimeout){
            clearTimeout(window.inputBlurResetTimeout)
        }
        let ui = typeof window == 'undefined' ? '' : (navigator.userAgent || '');
        if (!this.props.noIntoView && Detect.os.phone && !ui.match(/11_\d/)) {
            setTimeout( ()=> {
                let cInput = findDOMNode(this.commonInput);
                if (cInput && !this.props.noscrollView) { // 不要自动滚动
                    setTimeout(() => {
                       cInput.scrollIntoView(true);//自动滚动到视窗内
                    }, 450)
                }
            }, 0)
        }

        this.props && this.props.onFocus && this.props.onFocus(e);
    }

    // 失去焦点时恢复placehoder
    inputBlur(){
        this.setPlacehoder();
        this.props && this.props.onBlur && this.props.onBlur();
        // 解决iOS系统下收起键盘后页面被截断的问题
        window.inputBlurResetTimeout = setTimeout(() => {
            window.scroll(0, 0);
        }, 200);
    }

    inputOnChange(e){
        this.props && this.props.onChange && this.props.onChange(e);
        this.setState({
            value : e.target.value
        })
        if ( e.target.value != ''){
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

    focus() {
        this.commonInput.focus();
    }

    render() {
        return (
            <input
                ref = {dom => this.commonInput = dom}
                className = {`common-input ${this.props.className}`}
                placeholder = {this.state.placeholder}
                onFocus = {this.inputFocus}
                onBlur = {this.inputBlur}
                value = {this.state.value||''}
                onChange = {this.inputOnChange}
                onClick = { this.inputOnClick}
                disabled = { this.props.disabled||false}
                autoFocus = { this.props.autoFocus || false}
                type = { this.props.type || ''}
            />
        );
    }
}

CommonInput.propTypes = {

};

export default CommonInput;
