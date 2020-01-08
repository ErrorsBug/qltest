import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { validLegal, normalFilter } from 'components/util';
import CommonInput from 'components/common-input';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

@autobind
class CommentInput extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        isQuestion: 'N',
        inputText: null,
	    showSendBtn: false,
    }

    inputOnChange(e){
        this.setState({
            inputText:e.target.value
        })
    }

    questionBoxOnClick(e) {
        if (!this.props.mute) {
            this.setState({
                isQuestion: this.state.isQuestion === 'Y' ? 'N' : 'Y',
            });
        }
            
    }


    async sendText() {
        this.props.enableTransition();
        let content = normalFilter(this.state.inputText);
        if(validLegal('text','评论内容',content,200,0)){
            if (/(听不到|听不见|没有声音|没声音|加载失败|无法播放)/g.test(this.state.inputText) && this.props.onReceiveAudioErrorMsg(true)) {

                this.props.onReceiveAudioErrorMsg();
                return;
            }
            let result = await this.props.addTopicComment(content, this.props.feedbackTarget ? 'N' : this.state.isQuestion);
            if(result && result.state && result.state.code == '0'){
                this.setState({
                    inputText:"",
                    isQuestion: 'N',
                });
	            this.props.clearFeedback();
                if ( this.props.openCacheModel) {
                    this.props.closeCacheModel();
                } else {       
                    this.props.scrollMsgToView(0, true);
                }

            }

        }

    }

	inputFocusHandle(){
        this.setState({
            showSendBtn: true
        })
    }

	inputBlurHandle(){
	    if(!this.state.inputText){
		    this.props.clearFeedback();
        }
		this.setState({
			showSendBtn: false
		})
    }

    focus(){
        this.inputRef.focus();
        setTimeout(() => {
            try {
                findDOMNode(this.inputRef).scrollIntoView(true);
            } catch (error) {
                console.error(error)
            }
        }, 200);
    }

    render() {
        const checkBoxClass = classNames({
            'check-box-selected needsclick': this.state.isQuestion === 'Y',
            'check-box-unselected needsclick': this.state.isQuestion === 'N',
        });

        return (
            <div className={`comment-input${this.state.showSendBtn || this.state.inputText ? '' : ' with-padding'}`}>
                <CommonInput
                    ref={r => this.inputRef = r}
                    className="input-area"
                    placeholder={this.props.mute ? "本话题已被禁言" : (this.props.feedbackTarget ? `回复：${this.props.feedbackTarget.name}` : "加入一起讨论")}
                    value={this.state.inputText}
                    onChange={this.inputOnChange}
                    onFocus={this.inputFocusHandle}
                    onBlur={this.inputBlurHandle}
                    disabled={this.props.mute}
                />
                    {
                        this.props.topicStatus !== 'ended' && !this.props.feedbackTarget &&
                        <div className={`question needsclick${this.state.showSendBtn || this.state.inputText ? ' adapt-send-btn' : ''}`}
                            onClick={this.questionBoxOnClick}
                            onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); return false}}
                            >
                            <div className={checkBoxClass}></div>
                            <span className="needsclick">提问</span>
                        </div>
                    }
                {
                    (this.state.showSendBtn || this.state.inputText) &&
                    <span className={`btn-send-text on-log${this.state.inputText ? '' : ' disable'}`}
                          onClick={this.sendText}
                          data-log-name="发送"
                          data-log-region="btn-send-text"
                    >发送</span>
                }
            </div>
        );
    }
}

CommentInput.propTypes = {
	onReceiveAudioErrorMsg: PropTypes.func
};

export default CommentInput;
