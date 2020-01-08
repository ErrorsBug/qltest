import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Redpoint from "components/redpoint";


class ControlButton extends PureComponent {
    state ={
        showRedPoint: true,
    }
    onClickCommentBtn(){
        this.setState({showRedPoint: false});
        this.props.handleBtnClick && this.props.handleBtnClick();
    }
    render() {
        const btnClass = classNames('on-log', {
            'btn-client': this.props.buttonType === 'client',
            'btn-business': this.props.buttonType === 'business',
            [`${this.props.className}`]: true,
        });

        const barrageClass = classNames({
            'close': this.props.text === '弹',
            'barrageBtn': true,
        });
        return (
            <div
                className= { btnClass }
                onClick = { this.onClickCommentBtn.bind(this) }
                data-log-region="btn-area"
                data-log-pos= {this.props.className || "control-btn"}
                data-log-name={this.props.text}
            >
               {
                    this.props.text === '弹' || this.props.text === '关' ? 
                    <span className={ barrageClass }></span> :
                    <span className={ this.props.icon ? this.props.icon : null}>{ this.props.text }</span>
               }
               {
                   this.props.className === 'comment-btn-client' && this.state.showRedPoint && !this.props.isHasLive &&
                    <Redpoint pointContent=''
                        pointStyle={'comment-new'}
                        pointWrapStyle="comment-new" 
                        pointNpval={`评论`} 
                        isNotLocalstorage="Y"
                    />
                }
            </div>
        );
    }
}

ControlButton.propTypes = {

};

export default ControlButton;
