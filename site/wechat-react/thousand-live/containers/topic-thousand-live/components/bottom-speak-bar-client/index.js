import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonInput from 'components/common-input';
import SpeakRecording from '../bottom-speak-bar/bottom-speak-recording';
import { autobind } from 'core-decorators';
import { validLegal,normalFilter} from 'components/util';
import ControlButton from '../control-button';
import classNames from 'classnames';
import OutlineListDialogClient from '../outline-list-dialog-client';

@autobind
class BottomSpeakBarClient extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        focus: false,
        showRecord : false,
        inputText: '',
        isQuestion: 'N',
        //是否点击过操作按钮
        clickOperation: false,
        showOutline: false,
    }

    inputOnFocus() {
        this.setState({
            focus: true,
        });
        this.hideRecording();
        // 发言的时候不允许底部二维码弹出
        this.props.closeBottomQrcodeLock && this.props.closeBottomQrcodeLock()
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
        // 发言完毕的时候允许底部二维码弹出
        this.props.openBottomQrcodeLock && this.props.openBottomQrcodeLock()
    }

    inputOnClick(e) {
        if (this.props.mute) {
            window.toast("本直播间已被禁言");
            e.preventDefault();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.refs.speakRecording &&
            this.refs.speakRecording.state.recordingStatus !== 'ready' &&
            this.props.isAudioOpen === 'Y' &&
            nextProps.isAudioOpen === 'N') {
            window.toast("用户语音发言已被关闭",3000);
        }
    }

    toggleOutlineDialog() {
        this.setState({
            showOutline:!this.state.showOutline
        })
    }


    async sendText(){
        if(validLegal('text','评论内容',this.state.inputText,200,0)){
            let result = {}

            // 此处共有 音视频C端发言、普通话题C端上墙 和 普通话题C端评论3种情况
            if (/(audio|video)$/.test(this.props.topicStyle) && !this.props.topicEnded) {
                result = await this.props.addForumSpeak("text",normalFilter(this.state.inputText));
            } else if (this.props.isTextOpen === 'Y' && !this.props.topicEnded) {
                result = await this.props.addForumSpeak("mic-text",normalFilter(this.state.inputText));
            } else {
                result = await this.props.addTopicComment(normalFilter(this.state.inputText), this.state.isQuestion);
            }

            if (result && result.state && result.state.code == '0'){
                this.setState({
                    inputText:"",
                    focus: false,
                    isQuestion: 'N'
                })
            }
        }

    }

    switchRecording( showRecord = !this.state.showRecord ) {
        if (this.props.mute) {
            window.toast('本话题已被禁言');
            return;
        }
        if (!this.refs.speakRecording){
            return;
        } 

        if (this.refs.speakRecording.state.recordingStatus != 'ready') {
            this.refs.speakRecording.resetRec();
            return;
        }else {
            this.props.onSwitchTab(showRecord?'audio':'');
            this.setState({
                showRecord : showRecord
            })
        }
    }

    hideRecording(showRecord) {
        this.switchRecording(false);

    }

    questionBoxOnClick(e) {
        this.setState({
            focus: true,
            isQuestion: this.state.isQuestion === 'Y' ? 'N' : 'Y',
        });
    }

    showControlDialog(e){
        if (this.refs.speakRecording && this.refs.speakRecording.state.recordingStatus != 'ready') {
            this.refs.speakRecording.resetRec();
            return;
        }else{
            this.props.showControlDialog();
            this.setState({clickOperation: true})
        }


    }
    showCommentList(e){
        if (this.refs.speakRecording && this.refs.speakRecording.state.recordingStatus != 'ready') {
            this.refs.speakRecording.resetRec();
            return;
        }else{
            this.props.showCommentList();
        }


    }

    render() {

        const checkBoxClass = classNames({
            'check-box-selected needsclick': this.state.isQuestion === 'Y',
            'check-box-unselected needsclick': this.state.isQuestion === 'N',
        });

        const focusGuidConfigs = this.props.incrFansFocusGuideConfigs;

        return (
            <div>
                <div className="bottom-container-speak-client">
                    {
                        focusGuidConfigs &&
                            <aside 
                                className='incr-fans-activity-btn on-log' 
                                onClick={ this.props.onIncrFansActivityBtnClick }
                                data-log-region='topicDetailFocusGuide'
                            >
                                <img src={ focusGuidConfigs.button } />
                            </aside>
                    }
                    

                    {
                        (this.props.isAudioOpen === 'Y' && !this.props.topicEnded)?
                        <span className="btn-audio on-log"
                            onClick={()=>{this.switchRecording()}}
                            data-log-region="bottom-container-speak-client"
                            data-log-pos="audio-btn"
                            >
                        </span> :
                        null
                    }
                    {
                        !/(audio|video)$/.test(this.props.topicStyle)?
                        <div
                            className='btn-outline-list'
                            onClick = { this.toggleOutlineDialog}
                        >
                        </div> :
                        null
                    }

                    

                    <div className="text-input-box">
                        <CommonInput
                            className = "text-input"
                            placeholder = {this.props.mute ? "本话题已被禁言" :(this.props.topicEnded && /(audio|video)$/.test(this.props.topicStyle))? "本话题已经结束": "来说点什么吧..." }
                            value = {this.state.inputText }
                            onChange = {this.inputOnChange }
                            onFocus = {this.inputOnFocus }
                            onBlur = { this.inputOnBlur }
                            onClick = { this.inputOnClick }
                            disabled = {this.props.mute || (this.props.topicEnded && /(audio|video)$/.test(this.props.topicStyle))}
                        />

                        {/*isTextOpen 可能为null  */}
                        {
                            (this.props.isTextOpen != 'Y' && (this.state.focus || this.state.inputText) && !this.props.topicEnded  && !/(audio|video)$/.test(this.props.topicStyle)) ?
                            <div className="question needsclick"
                                onClick={this.questionBoxOnClick}
                                onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); return false}}
                                >
                                <div className={checkBoxClass}></div>
                                <span className="needsclick">提问</span>
                            </div>
                            :null
                        }
                    </div>
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
                        <div className="control-area">
                            {
                                !(this.props.topicStyle === 'audio' || this.props.topicStyle === 'video') ?
                                <div className="btn-chat">
                                    <ControlButton
                                        icon = ""
                                        buttonType = "client"
                                        className = "barrage-btn-client"
                                        handleBtnClick = { this.props.controlBarrageList }
                                        text = { this.props.showBarrageList ? '关' : '弹'}
                                    />
                                    <ControlButton
                                        icon = ""
                                        buttonType = "client"
                                        className = "comment-btn-client"
                                        handleBtnClick = { this.showCommentList }
                                        text = ""
                                        isHasLive= {this.props.isHasLive}
                                    />
                                </div> :
                                null
                            }
                            <span className={`btn-opration on-log ${this.props.topicInfo.channelId && this.props.dot && !this.state.clickOperation ? 'red-dot' : ''}`}
                                onClick={this.showControlDialog}
                                  data-log-name="更多操作"
                                data-log-region="btn-opration"
                                />
                        </div>
                    }
                </div>
                {
                    (this.props.isAudioOpen === 'Y' && !this.props.topicEnded)?
                    <SpeakRecording
                        ref = 'speakRecording'
                        isShow={this.state.showRecord}
                        autoRec = {false}
                        isOnMic = {true}
                        {...this.props}
                    /> :
                    null
                }

                <OutlineListDialogClient
                    show={this.state.showOutline}
                    close={this.toggleOutlineDialog}
                    scrollToSpeak={this.props.scrollToSpeak}
                    getTopicSpeakList={this.props.getTopicSpeakList}
                    getOutlistMark={this.props.getOutlistMark}
                />

            </div>
        );
    }
}

BottomSpeakBarClient.propTypes = {

};

export default BottomSpeakBarClient;
