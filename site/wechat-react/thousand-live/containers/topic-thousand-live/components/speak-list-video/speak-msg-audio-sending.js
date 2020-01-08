import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import SpeakMsgContainer from './speak-msg-container'
import { autobind } from 'core-decorators';


/**
 *
 * 音频消息
 * @class AudioItem
 * @extends {Component}
 */
@autobind
class SendingAudioItem extends PureComponent {


    componentDidMount(){
    }

    //时间格式化
    convertSecond(sec) {

		var second = Number(sec);
		if (second <= 60)
		{
			return String(second+'″');
		}
		var min = Math.floor(second / 60);
		var sec = second % 60;

		var secondStr = min + '′' + sec + '″';
		return secondStr;
	}

    async resendMsg() {
        let sendAudio = {
            serverId : this.props.serverId ,
            isFail : false,
        }
        this.props.updateTopicListMsg(sendAudio,'serverId');
        let reuslt = await this.props.addForumSpeak('audioId',this.props.serverId,this.props.second);
        if(reuslt.state && reuslt.state.code === 0){
            this.props.delTopicListMsg(sendAudio,'serverId');
        }else if(!reuslt || !reuslt.state || reuslt.state.code != 0){
            sendAudio.isFail = true;
            this.props.updateTopicListMsg(sendAudio,'serverId');
        }
    }

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
                isShowBottomBar = {false}
            >
                <div className="msg-audio isOld">
                     <span className='btn-play icon_audio_play' ></span>

                    <span className = 'audio-sendding-conent' >发送中...</span>
                    <span className = "audio-second">{this.convertSecond(this.props.second)}</span>
                    {
                        this.props.isFail ?
                        <span className = 'btn-resend icon_warning on-log'
                            onClick={this.resendMsg}
                            data-log-region="speak-list"
                            data-log-pos="audio-resending-btn"
                            >
                        </span>
                        :null
                    }
                </div>
            </SpeakMsgContainer>
        )
    };
}



export default SendingAudioItem
