import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind } from 'core-decorators';
import {createPortal} from 'react-dom'
@autobind
class ChannelName extends Component {

    state = {
        show: false,
        content: ''
    }

    constructor(props) {
        super(props);
    }

    show (content){
        
        this.setState({
            show: true,
            content,
        })
        
    }

    componentDidMount() {
        
    }

    // 点击完成按钮
    complete(){
        
        this.setState({show: false})
        this.props.fillChannelName(this.state.content)
    }

    textareaInput(e){
        // 去掉前后多余空白字符
        let value = e.currentTarget.value.trim()
        if(value.length <= 40){
            this.setState({
                content: e.target.value
            })
        }else{
            this.setState({
                content: value.substring(0, 40)
            })
        }
    }

    onBlurFunc(){
        window.scroll(0,0);
    }

    render() {
        const {
            show,
            content
        } = this.state
        return (
                <div className="channel-name-container">
                    <ReactCSSTransitionGroup
                        transitionName="black"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="black" onClick={()=>{this.setState({show: false})}}></div>
                    }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                        transitionName="channel-name-tst"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="channel-name">
                            <div className="header">系列课名称
                                <div className="complete" onClick={this.complete}>完成</div>
                            </div>
                            <textarea 
                                name="textarea" 
                                placeholder="请输入系列课名称，不超过40字。" 
                                ref={el => this.textareaEle = el} 
                                onChange={this.textareaInput}
                                value = {content}
                                onBlur={this.onBlurFunc}
                            />
                        </div>
                    }
                    </ReactCSSTransitionGroup>
                </div>
        )
    }
}

ChannelName.propTypes = {

};

export default ChannelName;