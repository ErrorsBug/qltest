import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { formatMoney,validLegal,normalFilter } from 'components/util';
import CommonInput from 'components/common-input';


@autobind
class CommentBar extends Component {
    state = {
        inputText: '',
        autoFocus: true,
    }


    inputOnChange(e){
        this.setState({
            inputText:e.target.value
        })
    }
    
    componentDidMount() {
        this.setState({
            autoFocus: true
        })
    }
    
    


    async sendText(){
        if(validLegal('text','评论内容',this.state.inputText,200,0)){
            let result = {}

            result = await this.props.addTopicComment(normalFilter(this.state.inputText));

            if (result && result.state && result.state.code == '0'){
                this.setState({
                    inputText:"",
                    focus: false,
                })
            }
        }

    }

    render() {
        return (
            <div className='comment-bar'>
                <span className="comment-input-container">
                        <CommonInput
                            className = "text-input"
                            placeholder = {this.props.replyName || "发表评论" }
                            value = {this.state.inputText }
                            onChange={this.inputOnChange}
                            ref='textInput'
                            autoFocus = { this.state.autoFocus }
                        />
                </span>     
                <span 
                    className="btn-send flex-other" 
                    onClick={this.sendText}
                
                >发送</span>        
            </div>
        );
    }
}

CommentBar.propTypes = {

};

export default CommentBar;