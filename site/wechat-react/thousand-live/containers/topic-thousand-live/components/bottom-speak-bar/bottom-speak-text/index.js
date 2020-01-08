import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import CommonTextarea from 'components/common-textarea';
import { validLegal,normalFilter} from 'components/util';
import { isChrome} from 'components/envi';


class SpeakTextInput extends PureComponent {
    state = {
        inputText:'',
    }

    componentDidMount(){
        this.initKeyDown();
        this.initPaste();
    }

    inputOnChange(e){
        this.setState({
            inputText:e.target.value
        })
    }



    async sendText(){

        if(validLegal('text','发言内容',this.state.inputText,2000,0)){
            
            const isQuestion = this.props.feedbackTarget !== null;
            let result = await this.props.addForumSpeak("text", normalFilter(this.state.inputText));
            if(result && result.state && result.state.code == '0'){
                if (isQuestion && this.props.getQuestionList) {
                    const res = await this.props.getQuestionList(this.props.topicId, '1120752000000');
                }
                this.setState({
                    inputText:""
                })
            }
        }
    }

    get placeholder() {
        if (this.props.feedbackTarget) {
            return `回复 ${this.props.feedbackTarget.name}: `
        } else if (isChrome() && !/(audio|video)/.test(this.props.topicStyle)) {
            return '截图后，在输入框粘贴即可发送截图'
        } else {
            return '来说点什么吧...'
        }
    }


    //回车
    initKeyDown(){
        document.onkeydown = (event) => {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13&&(e.ctrlKey||e.commandKey)){
                this.sendText();
            }
        };

    }

    readBlobAsDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {callback(e.target.result);};
        a.readAsDataURL(blob);
    }

    initPaste() {
        if (/(audio|video)/.test(this.props.topicStyle)) {
            return;
        }
        const textInput = findDOMNode(this.refs.textInput);
        textInput.addEventListener('paste',(evt) => {
            console.log(evt);
            var types = evt.clipboardData.types;

			if (types.length > 0 && types[0] === 'Files') {
				let file = evt.clipboardData.items[0].getAsFile();

				this.readBlobAsDataURL(file, (result) => {
                    this.props.showPasteBox(file,result);
				});
			}
        });
    }

    render() {
        return (
            <div className={`text-input-container ${!this.props.isShow?'hide':''}`}>
                <CommonTextarea
                    className = "text-input"
                    placeholder = {this.placeholder}
                    value = {this.state.inputText}
                    ref='textInput'
                    onChange={this.inputOnChange.bind(this)}
                    autoFocus = {true}
                />
                <span className="bnt-send-text on-log"
                    onClick={this.sendText.bind(this)}
                    data-log-region="tab-menu"
                    data-log-pos="send-text-btn"
                    data-log-name="发送"
                    >
                    发送
                </span>
            </div>
        );
    }
}

SpeakTextInput.propTypes = {
    // 回复评论的目标
    feedbackTarget: PropTypes.object,
    // 添加发言
    addForumSpeak: PropTypes.func,
};

export default SpeakTextInput;
