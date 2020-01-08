import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonTextarea from 'components/common-textarea';
import { autobind,} from 'core-decorators';
import { validLegal, normalFilter } from 'components/util';

@autobind
class SpeakInput extends Component {

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
     * @memberof SpeakInput
     */
    async sendText(){

        if(validLegal('text','发言内容',this.state.inputText,2000,0)){
            
            let result = await this.props.addForumSpeak("text", normalFilter(this.state.inputText));
            if(result && result.state && result.state.code == '0'){
                this.setState({
                    inputText:""
                })
            }
        }
    }


    render() {
        return (
            <div className='bottom-container-speak-client'>
                <div className="text-input-box">
                    <CommonTextarea
                        className = "text-input"
                        placeholder = {this.props.mute ? "本话题已被禁言" :(this.props.topicEnded && /(audio|video)$/.test(this.props.topicStyle))? "本话题已经结束": "来说点什么吧..." }
                        value = {this.state.inputText }
                        onChange = {this.inputOnChange }
                        onFocus = {this.inputOnFocus }
                        onBlur = { this.inputOnBlur }
                        onClick = { this.inputOnClick }
                        disabled = {this.props.mute || (this.props.topicEnded && /(audio|video)$/.test(this.props.topicStyle))}
                    />

                </div>
                {/* <p onClick={this.props.showBottomControl}>点击</p> */}
                {
                    (this.state.focus || this.state.inputText)
                    ?
                    <span className="btn-send-text on-log"
                        onClick={this.sendText}
                        data-log-region="bottom-container-speak-client"
                        data-log-pos="send-text-btn"
                        >
                        发送
                    </span>
                    :    
                    <span className="btn-back on-log on-visible"
                            onClick={this.props.changeMode}
                            data-log-name="返回课程列表"    
                            data-log-region="back-course-list"
                    >
                        关闭互动
                    </span>
                }
                {
                    !(this.state.focus || this.state.inputText)
                    ?
                    <span className="btn-opration on-log on-visible"
                        onClick={this.props.showBottomControl}
                        data-log-name="更多操作"
                            data-log-region="btn-opration"
                            data-log-pos="btn-opration-full"
                        />: null
                }

            </div>
        );
    }
}

SpeakInput.propTypes = {

};

export default SpeakInput;