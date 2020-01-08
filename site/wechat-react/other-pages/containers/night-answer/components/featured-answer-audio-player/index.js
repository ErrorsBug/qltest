import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {imgUrlFormat} from 'components/util';
import Detect from 'components/detect';
import { autobind, throttle } from 'core-decorators';
import classnames from 'classnames';

import { AudioPlayer } from 'components/audio-player';
import shallowCompare from 'react-addons-shallow-compare';



/**
 * 
 * 音频消息
 * @class AudioItem
 * @extends {Component}
 */
@autobind
class FeaturedAnswerAudioPlayer extends PureComponent {

    state = {
        moveDistance:0,
        startX: 0,
        isTouchMoving: false,

	    playStatus: '',
	    playSecond: 0,
	    audioDuration: this.props.second,

		showBtnLoading: false,
		
		barHide: true,

    };

    componentDidMount(){
        this.initProgressBtnTouch();
        this.initAudio()
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

	// shouldComponentUpdate(nextProps){
	// 	return shallowCompare(this,nextProps);
	// }

	/**
	 * 播放器初始化监听
	 */
	initAudio(){
		this.audioPlayer = new AudioPlayer();

		this.audioPlayer.on("timeupdate",this.audioTimeupdate);
		this.audioPlayer.on('ended',this.audioEnded);
		this.audioPlayer.on('pause',this.audioPause);
		this.audioPlayer.on('playing',this.audioPlaying);
		this.audioPlayer.on('loadedmetadata',this.audioLoadedmetadata);
		
	}
	@throttle(100)
	audioTimeupdate(e){
		this.setState({
			playSecond:this.audioPlayer.currentTime,
			audioDuration:this.audioPlayer.duration
		})
	}
	audioLoadedmetadata(e){
		this.setState({
			playSecond:this.audioPlayer.currentTime,
			audioDuration:this.audioPlayer.duration
		})
	}
	setAuto(){
		this.pauseAudio();
		setTimeout(()=>{
			this.setState({
				playStatus: ''
			})
		},0)
	}
	audioEnded(e){
		this.setState({
			playStatus:'pause',
			barHide: true,
		})
		this.props.autoPlay && this.props.autoPlay(this);
	}
	audioPause(e){
		this.setState({
			playStatus:'pause'
		})
	}
	audioPlaying(e){
		if(this.state.showBtnLoading){
			this.setState({
				showBtnLoading: false
			})
		}
	}
	// 播放音频
	playAudio(e){
		// let playUrl = await this.getPlayUrl(url);
		if(e && e.stopPropagation) e.stopPropagation();
		if(this.props.currentAudioUrl){
			if (!this.state.playStatus) {
				this.setState({
					playSecond:0,
					audioDuration:0,
					playStatus:'play',
					showBtnLoading: true,
				},() => {
					this.audioPlayer.volume=1;
					this.audioPlayer.play(this.props.currentAudioUrl);
				});

			} else {
				this.setState({
					playStatus:'play'
				});
				this.audioPlayer.resume();
			}
		}else{
			this.setState({
				playStatus:'play'
			});
			wx.playVoice({localId: this.props.recLocalId });
		}
		this.setState({
			barHide: false,
		})

		this.props.onPlay && this.props.onPlay(this);

	}

	// 暂停音频
	pauseAudio(e){
		if(e && e.stopPropagation) e.stopPropagation();
		if(this.props.recLocalId){
			wx.stopVoice({localId: this.props.recLocalId });
		}else{
			this.audioPlayer.pause();
		}
		this.setState({
			playStatus:'pause',
			barHide: true,
		});
	}

	// 拖放音频
	setAudioSeek(percent){
		if(this.state.playStatus != "play") {
			this.audioPlayer.play(this.props.currentAudioUrl);
		}
		let currentTime = parseInt((this.state.audioDuration||this.props.second) * percent / 100);
		this.audioPlayer.currentTime = currentTime;
		this.audioPlayer.seek(currentTime);
		this.audioPlayer.resume();

		this.setState({
			playStatus:'play',
			barHide: false,
		})
		this.props.onPlay && this.props.onPlay(this);
	}
    

    
    /**
     * 
     * 获取拖拽秒数展示
     * 
     * @memberof AudioItem
     */
    getSecond() {
        let dropSecond = this.convertSecond(this.state.audioDuration * Number(this.getSecondPercent()) / 100);
        return dropSecond;
    }

    // 获取秒数距离百分比
    getSecondPercent(){
        let leftDistance = (this.state.playSecond/this.state.audioDuration)*100;
        if (!leftDistance) {
            leftDistance = 0.1;
        }
        if(this.dragingFlag && this.lastMoveDistance){
            leftDistance = this.lastMoveDistance;
        }
        if(leftDistance > 100){
            leftDistance = 100;
        }else if(leftDistance < 0.01){
            leftDistance = 0.01;
        }

        return leftDistance;
    }

    // 初始化播放进度条拖动事件
    initProgressBtnTouch() {
        let starty = 0;
        this.dragingFlag = false;
        let audioBarWidth = 0.01;
        // this.lastMoveDistance = 0;
        if (Detect.os.phone) {
            document.addEventListener('touchmove', this.moveFn, false);
            document.addEventListener('touchend', this.endFn, false);
        } else {
            document.addEventListener('mousemove', this.moveFn, false);
            document.addEventListener('mouseup', this.endFn, false);
        }
    }

    endFn(e) {
        if(this.dragingFlag){
            this.setAudioSeek(this.lastMoveDistance);
		}
		const that = this
		setTimeout(() => {
			that.dragingFlag = false;
			that.setState({
				isTouchMoving: false,
			})
		}, 150);
    };


    moveFn(e) {
        let touch;
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
            let audioBar = this.refs.audioBar,
	            audioBarWidth = 0;
            if(audioBar){
                audioBarWidth = audioBar.offsetWidth;
            }
            if(audioBarWidth == 0) audioBarWidth = 0.01;
            this.lastMoveDistance = this.state.startWidth + (diff/audioBarWidth)*100;
        }
    };

    // 滑块滑动方法
    blockStartFn(e) {
		let startWidth = this.getSecondPercent();
        let touch;
        if (e.touches) {
            touch = e.touches[0];
        } else {
            touch = e;
        }

            
		this.setState({
			startX:touch.clientX,
			startWidth: startWidth,
			isTouchMoving: true,
		});
		this.dragingFlag = true;
		this.startX = touch.clientX;
        
	}
	
	audioBarClickHandle = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const targetWidth = e.target.offsetWidth
		const targetPositionX = e.target.getBoundingClientRect().left
		const clickX = e.clientX

		this.setAudioSeek((clickX - targetPositionX)/targetWidth * 100);
		this.props.onPlay && this.props.onPlay(this);
	}

    //时间格式化
    convertSecond(sec) {
		
		var second = Number(sec);
		
		var min = Math.floor(second / 60);
		var sec = parseInt(second % 60);

		min = min < 10 ? ("0" + min) : min 
		sec = sec < 10 ? ("0" + sec) : sec 

		var secondStr = min + ":" + sec;
		return secondStr;
	}

    render() {
        return (
            <div className='audio on-log'
            data-log-id={this.props.topicId}>
                {
                    this.state.playStatus == 'play' ?
                    <span className={`btn-play icon_audio_pause ${this.state.showBtnLoading ? ' loading' : ''}`} onClick={this.pauseAudio.bind(this)}>
					<svg version="1.1"
						className="btn-loading"
						x="0px" y="0px"
						viewBox="0 0 50 50" style={{'enableBackground':'new 0 0 50 50'}} xmlSpace="preserve">
						<path fill="#fff" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
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
					</span>
                    :
                    <span className={`btn-play icon_audio_play`} onClick={this.playAudio.bind(this)}></span>

                }
                {/*播放条*/}
                {
					!!this.props.currentAudioUrl &&
					<div className="audio-bar-container" onClick={this.audioBarClickHandle}>
						<div className={classnames('audio-bar',{'barHide': this.state.barHide})} ref="audioBar">
							<span className={`btn-play-block ${this.state.isTouchMoving?'active':''} `}
									style={{ left:this.getSecondPercent()+'%'}}
									onTouchStart={this.blockStartFn}
									onMouseDown={this.blockStartFn}
							></span>
							<span className="audio-bar-playing"
									style={{ width:this.getSecondPercent()+'%'}}
							></span>
						</div>
					</div>
                }
                <span className="audio-second">{this.convertSecond(this.state.audioDuration)}</span>
            </div>
        )
    };
}



export default FeaturedAnswerAudioPlayer

