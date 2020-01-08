import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {imgUrlFormat} from 'components/util';
import Detect from 'components/detect';
import SpeakMsgContainer from './speak-msg-container'
import { autobind } from 'core-decorators';


/**
 *
 * 音频消息
 * @class AudioItem
 * @extends {Component}
 */
@autobind
class AudioItem extends PureComponent {

    state = {
        moveDistance:0,
        startX: 0,
        isTouchMoving: false,

    }

    componentDidMount(){
        this.initProgressBtnTouch();
    }

    componentWillUnmount() {
        if (Detect.os.phone) {
            document.removeEventListener('touchmove', this.moveFn);
            document.removeEventListener('touchend', this.endFn);
        } else {
            document.removeEventListener('mousemove', this.moveFn);
            document.removeEventListener('mouseup', this.endFn);
        }
    }



    /**
     *
     * 获取拖拽秒数展示
     *
     * @memberof AudioItem
     */
    getSecond() {
        let dropSecond = this.convertSecond(this.props.audioDuration * Number(this.getSecondPercent(this.props.id)) / 100);
        return dropSecond;
    }

    // 获取秒数距离百分比
    getSecondPercent(id){
        let leftDistance = (this.props.playSecond/this.props.audioDuration)*100;

        if(this.props.audioMsgId != id){
            leftDistance = 0;
        } else {
            if (!leftDistance) {
                leftDistance = 0.1;
            }
            if(this.dragingFlag){
                leftDistance = this.lastMoveDistance;
            }
            if(leftDistance > 100){
                leftDistance = 100;
            }else if(leftDistance < 0.01){
                leftDistance = 0.01;
            }
        }

        return leftDistance;
    }

    // 初始化播放进度条拖动事件
    initProgressBtnTouch() {
        let starty = 0;
        this.dragingFlag = false;
        let audioBarWidth = 0.01;
        this.lastMoveDistance = 0;
        if (Detect.os.phone) {
            document.addEventListener('touchmove', this.moveFn, false);
            document.addEventListener('touchend', this.endFn, false);
        } else {
            document.addEventListener('mousemove', this.moveFn, false);
            document.addEventListener('mouseup', this.endFn, false);
        }
    }

    async endFn(e) {
        if(this.dragingFlag){
            this.props.setAudioSeek(this.lastMoveDistance);
        }
        this.dragingFlag = false;
        this.setState({
            isTouchMoving: false,
        })
    };


    moveFn(e) {
        let touch;
        let audioBarWidth = 0.01;
        if (e.touches) {
            touch = e.touches[0];
        } else {
            touch = e;
        }

        let end = touch.clientX;
        let diff = touch.clientX - this.state.startX;

        if(this.dragingFlag){
            e.preventDefault();
            e.stopPropagation();
        }

        if (this.dragingFlag) {
            this.setState({
                moveDistance:diff
            })
            let audioBar = findDOMNode(this.refs.audioBar);
            if(audioBar){
                audioBarWidth = audioBar.offsetWidth;
            }
            if(audioBarWidth == 0) audioBarWidth = 0.01;
            this.lastMoveDistance = this.state.startWidth + (diff/audioBarWidth)*100;
        }
    };



    // 滑块滑动方法
    async blockStartFn(e) {
        let url = this.props.content;
        let startWidth = this.getSecondPercent(this.props.id);
        let touch;
        if (e.touches) {
            touch = e.touches[0];
        } else {
            touch = e;
        }

        if(this.props.playStatus == 'play' && this.props.audioMsgId == this.props.id){

            this.setState({
                startX:touch.clientX,
                startWidth: startWidth,
                isTouchMoving: true,
            })
            this.dragingFlag = true;
            this.startX = touch.clientX;
        }
    }

    //时间格式化
    convertSecond(sec) {

		var second = Number(sec);
		if (second <= 60)
		{
			return String(parseInt(second)+'″');
		}
		var min = Math.floor(second / 60);
		var sec = parseInt(second % 60);

		var secondStr = min + '′' + sec + '″';
		return secondStr;
	}

    onFeedback(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.onFeedback({
            name: this.props.name||this.props.speakCreateByName,
            id: this.props.id,
            type: 'replyMic',
            userId: this.props.createBy
        },true);
    }

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <div className={`msg-audio ${this.props.recordReaded && !this.props.recordReaded[this.props.id]?'':'isOld'}`}>
                    
                    {
                        !(this.props.playStatus == 'play' && this.props.audioMsgId == this.props.id)?
                        <div className="btn-play-cover on-log"
                            onClick={()=>{this.props.playAudio(this.props.id)}}
                            data-log-region="speak-list"
                            data-log-pos="cover-play-btn"
                            data-log-business_id={this.props.id}
                            >
                        </div>
                        :null
                    }
                    {
                        (this.props.audioLoading && this.props.audioMsgId == this.props.id)?
                        <span className='btn-loading' onClick={this.props.pauseAudio} >
                            <svg version="1.1" 
                                id="loader-1" 
                                x="0px" y="0px"
                                viewBox="0 0 50 50" style={{'enableBackground':'new 0 0 50 50'}} xmlSpace="preserve">
                                <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                                    <animateTransform 
                                    attributeType="xml"
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 25 25"
                                    to="360 25 25"
                                    dur="0.6s"
                                    repeatCount="indefinite"/>
                                    </path>
                            </svg>
                        </span>:
                        (this.props.playStatus == 'play' && this.props.audioMsgId == this.props.id)?
                        <span className='btn-play icon_audio_pause on-log'
                            onClick={this.props.pauseAudio}
                            data-log-region="speak-list"
                            data-log-pos="pause-btn"
                            data-log-business_id={this.props.id}
                            >
                        </span>
                        :<span className='btn-play icon_audio_play on-log'
                            onClick={()=>{this.props.playAudio(this.props.id)}}
                            data-log-region="speak-list"
                            data-log-pos="play-btn"
                            data-log-business_id={this.props.id}
                            >
                        </span>

                    }

                    <span className={`audio-bar ${this.getSecondPercent(this.props.id) == 0 ? 'hide' : ''} ${Number(this.props.second) > 40?'type-three':Number(this.props.second) > 20?'type-two':'type-one'}`}
                        ref = {`${this.props.audioMsgId == this.props.id?'audioBar':''}`}
                    >
                        <span className={`btn-play-block ${this.state.isTouchMoving?'active':''} `}
                            style={{ left:this.getSecondPercent(this.props.id)+'%'}}
                            onTouchStart={this.blockStartFn}
                            onMouseDown={this.blockStartFn}
                        >
                            <b>{this.getSecond()}</b>
                        </span>
                        <span className="audio-bar-playing"
                            style={{ width:this.getSecondPercent(this.props.id)+'%'}}

                        ></span>
                    </span>
                    <span className="audio-second">{this.convertSecond(this.props.second)}</span>
                    {
                        ( !this.props.power.allowSpeak && this.props.recordReaded && /(readed)/gi.test(this.props.recordReaded[this.props.id]))?
                        <span className="isReaded icon_checked"></span>
                        :null
                    }
                    {
                        (this.props.isMicMsg({type: this.props.type,creatorRole: this.props.creatorRole}) && this.props.power.allowSpeak) ?
                            <span className='feedback on-log' onClick={this.onFeedback}
                                data-log-region="speak-list"
                                data-log-pos="feedback-btn"
                                data-log-name="回复"
                                data-log-business_id={this.props.id}
                                >
                                回复
                            </span> :null
                    }
                </div>
            </SpeakMsgContainer>
        )
    };
}



export default AudioItem
