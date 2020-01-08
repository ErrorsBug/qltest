import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { formatMoney,validLegal,normalFilter } from 'components/util';
import CommonTextarea from 'components/common-textarea';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

@autobind
class CommentBar extends Component {
    state = {
        inputText: this.props.saveComment,
        autoFocus: true,
        send: false
    }


    inputOnChange(e){
        if(e.target.value){
            this.setState({
                inputText:e.target.value,
                send: true,
            })
        }
        else{
            this.setState({
                inputText:e.target.value,
                send: false,
            })
        }
    }
    
    componentDidMount() {
        this.setState({
            autoFocus: true,
        })
        if(this.state.inputText){
            this.setState({send: true})
        }
    }

    async sendText(e){
        let tar = e.currentTarget
        if(tar.classList.contains('can')){
            if(validLegal('text','评论内容',this.state.inputText,200,0)){
                this.props.complete(normalFilter(this.state.inputText))
                if(this.props.commentSuccess){
                    this.setState({
                        inputText: '',
                        send: false
                    });
                }
            }
        }else{
            e.preventDefault()
        }
    }
    hideComment(){
        this.props.hide(this.state.inputText)
    }
    render() {
        return (
            <div className="comment-container">
                <div className="comment-head">
                    <span>留言</span>
                    <div className="hideComment" onClick={this.hideComment}></div>
                </div>
                <CommonTextarea
                    className = "text-input"
                    placeholder = {this.props.replyName || "发表留言" }
                    value = {this.state.inputText }
                    onChange={this.inputOnChange}
                    ref='textInput'
                    autoFocus = { this.state.autoFocus }
                />     
                <span 
                    className={classnames('send',{'can': this.state.send})}
                    onClick={this.sendText}
                >发送</span>        
            </div>
        );
    }
}

CommentBar.propTypes = {

};

export default CommentBar;