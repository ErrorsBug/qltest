import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames'

class FullWidthBtn extends Component {
    state = {}
    static propTypes = {
        // 跳转链接
        linkURL: PropTypes.string,
        // 按钮文本
        txt: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

        //日志
        logTxt:PropTypes.string,
        logOrigin:PropTypes.string,

        //非必须
        // 左侧文本的class
        txtClass: PropTypes.array,
        // 右侧关闭按钮的class
        closeClass: PropTypes.array,
        // 按纽外包的class
        containerClass: PropTypes.array,
        // 左侧icon class
        iconLeftClass: PropTypes.array,
        // 右侧icon class
        iconRightClass: PropTypes.array,
        // 中间文字 class
        wordClass: PropTypes.array,
        // 去除默认关闭按钮的样式
        closeCustomMade: PropTypes.bool,
        closeBtnFunc:PropTypes.func,
    }
    static defaultProps = {
        closeCustomMade: false,
        closeClass: [],
        txtClass: [],
        containerClass: [],
        iconLeftClass: [],
        iconRightClass: [],
        wordClass: []
    }
    txtOnClick() {

        location.href = this.props.linkURL;
    }
    closeOnClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.refs.btnContainer.style.display = 'none';
        this.props.closeBtnFunc();
    }
    componentDidMount() {
        // console.log(this.props);
        if (!this.props.closeCustomMade) {
            this.refs.btnClose.classList.add('icon_delete');
            this.refs.btnClose.classList.add('btn-close');
        }
    }
    render() {
        const {
            txt,
            txtClass,
            closeClass,
            containerClass,
            iconLeftClass,
            iconLeftTxt,
            iconRightClass,
            iconRightTxt,
            wordClass,
            logTxt,
            logOrigin,
            ...props
        } = this.props;

        return (
            <section className={classnames('full-width-btn', ...containerClass)} ref="btnContainer">
                <div
                    className={classnames('txt', ...txtClass)}
                    onClick={this.txtOnClick.bind(this)}
                    data-log-region={logOrigin}
                    data-log-name={logTxt}
                    data-log-business_type="btn-exist"
                >
                    <span className={classnames("icon-left", ...iconLeftClass)}>{iconLeftTxt}</span>
                    <span className={classnames("word", ...wordClass)}>{txt}</span>
                    <span className={classnames("icon-right", ...iconRightClass)}>{iconRightTxt}</span>
                </div>
                <div
                    ref="btnClose"
                    className={classnames(...closeClass)}
                    onClick={this.closeOnClick.bind(this)}
                    data-log-region={logOrigin}
                    data-log-name={logTxt}
                    data-log-business_type="btn-close"
                ></div>
            </section>
        );
    }
}

export default FullWidthBtn;
