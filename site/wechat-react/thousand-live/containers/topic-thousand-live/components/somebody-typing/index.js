import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

class SomebodyTyping extends PureComponent {
    
    state = {
        hideTypingClass : 'hide',
    }

    componentWillReceiveProps(nextProps) {
        this.showTyping(nextProps);
    }

    showTyping( nextProps ){
        if (typeof(nextProps.name) == 'string' && nextProps.name != this.props.name ) {
            this.setState({
                hideTypingClass : nextProps.name == '' ? 'hide' : '', 
            })
        }

        if (nextProps.name != '') {
            clearTimeout(this.hideTyping);
            this.hideTyping = setTimeout(()=>{
                this.setState({
                    hideTypingClass :  'hide'
                })
            },10000);
        }

    }

    render() {
        return (
            <div className={`typing-box ${this.state.hideTypingClass}`}>
                <p>{this.props.name}</p>正在输入...
            </div>
        );
    }
}

SomebodyTyping.propTypes = {

};

export default SomebodyTyping;