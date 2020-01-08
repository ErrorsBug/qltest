import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonInput from 'components/common-input';
import { autobind,} from 'core-decorators';
import { validLegal, normalFilter } from 'components/util';

@autobind
class BottomCommentInput extends Component {

    state = {
        inputTex: '',
        focus:false,
    }

    inputOnFocus() {
        this.setState({
            focus: true,
        });
    }

    inputOnChange(e){
        this.setState({
            inputText:e.target.value
        })
    }

    inputOnBlur() {
        this.setState({
            focus: false,
        })
    }

    inputOnClick(e) {
        if (this.props.mute) {
            window.toast("本直播间已被禁言");
            e.preventDefault();
        }
    }

    /**
     * 
     * 发言发送
     * @memberof BottomCommentInput
     */
    async sendText(){

        if(validLegal('text','评论内容',this.state.inputText,200,0)){
            let result = {}

            result = await this.props.addComment(normalFilter(this.state.inputText), '', this.props.topicInfo.liveId, this.props.topicInfo.id, 'text');

            if (result && result.state && result.state.code == '0'){
                this.setState({
                    inputText:"",
                    focus: false,
                })
                this.props.scrollToLast && this.props.scrollToLast();
            }
        }
    }


    showControlDialog(e){
        this.props.showControlDialog();
        this.setState({clickOperation: true})
    }

    render() {
        let topicEnded = this.props.topicInfo.status == 'ended';
        let topicStyle = this.props.topicInfo.style;
        return (
            <div className='bottom-comment-input'>
                <div className="text-input-box">
                    <CommonInput
                        className = "text-input"
                        placeholder = {this.props.mute ? "本话题已被禁言" :(topicEnded && /(audio|video)$/.test(topicStyle))? "本话题已经结束": "来说点什么吧..." }
                        value = {this.state.inputText }
                        onChange = {this.inputOnChange }
                        onFocus = {this.inputOnFocus }
                        onBlur = { this.inputOnBlur }
                        onClick = { this.inputOnClick }
                        disabled = {this.props.mute || (topicEnded && /(audio|video)$/.test(topicStyle))}
                    />

                </div>
                {
                    this.props.topicInfo.isEnableReward == 'Y' && this.props.onOpenReward?
                    <span className="btn-tipping" onClick={this.props.onOpenReward}></span>
                    :null
                }
                {
                    (this.state.focus || this.state.inputText)
                    ?
                    <span className="btn-send-text"
                        onClick={this.sendText}
                        >
                        发送
                    </span>
                    :    
                    <span className="btn-menu"
                        onClick={this.showControlDialog}
                    >
                    </span>
                }

            </div>
        );
    }
}

BottomCommentInput.propTypes = {

};

export default BottomCommentInput;