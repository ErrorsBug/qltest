import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, throttle } from 'core-decorators';
import Detect from 'components/detect';
import { getAudioTimeShow } from 'components/util';

@autobind
class QlTcPlayer extends Component {

    state = {
		fullscreen: false,
		isPlaying: false,
		showController: true,
		showVideo: false,
		isLoading: false,
		duration: 0,
		currentTime: 0,
		progress: 0,
	};

    data = {
        
    }

    componentDidMount() {
        let videoDom = document.getElementById("ql-tencent-video-player");
        this.data.videoW = videoDom.offsetWidth;
        this.data.videoH = videoDom.offsetHeight;

        this.initTcPlayer();
    }
    

    // 初始化tc播放器
    initTcPlayer() {

        if (typeof TcPlayer == 'undefined') {
            setTimeout(() => {
                this.initTcPlayer();
            }, 1000);
            return false;
        }


        this.data.options = {
            autoplay : false,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
            coverpic : this.props.backgroundUrl ? this.props.backgroundUrl + '?x-oss-process=image/resize,m_fill,limit_0,h_360,w_640':'',
            controls: 'none',
            width :  this.data.videoW,//视频的显示宽度，请尽量使用视频分辨率宽度
            height: this.data.videoH,//视频的显示高度，请尽量使用视频分辨率高度
            listener: (msg) => {
                if (msg.type == 'timeupdate') {
                    this.timeupdateHandle();
                }
                if(msg.type == 'loadedmetadata'){
                    this.initPlayerInfo();
                }
                if(msg.type == 'play'){
                    this.playHandle()
                }
                if(msg.type == 'pause'){
                    this.pauseHandle();
                }
                if (msg.type == 'ended') {
                    this.endedHandle();
                }
                if (msg.type == 'waiting') {
                    console.log('waiting.............')
                }
                if (msg.type == 'error') {
                    console.log(msg)
                }
            }
        }

        if (this.props.liveStatus == 'beginning') {
            // let flvItem = this.props.urlList.find(item=>item.type == 'HLS');
            // this.data.options.m3u8 = flvItem.playUrl;
            // this.data.options.mp4 = '//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4';
            this.props.urlList.map(item => {
                let type = item.type.toLowerCase();
                if (type == 'hls') {
                    type = 'm3u8';
                }
                this.data.options[type] = item.playUrl;
                return item;
            })
            // 360浏览器使用rtmp播放会失败。
            if (this.check360()) {
                delete this.data.options.rtmp;
            }
        } else {
            let urlItem = this.props.urlList.find(item => item.type == 'END_VOD');
            if (urlItem && urlItem.playUrl) {
                this.data.options.m3u8 = urlItem.playUrl;
                // this.data.options.mp4 = '//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4';
            }
            console.log('this.data.options.m3u8:',this.data.options)
        }

        this.videoPlayer = new TcPlayer('ql-tencent-video-player', this.data.options);
        this.initProgressBtnTouch();


    }

    initPlayerInfo() {
        let duration = this.videoPlayer.duration();
        this.setState({
            duration
        })
    }

    playHandle() {
        this.hideControlBarInThreeSeconds();
        this.setState({
            isPlaying: true,
            isLoading: false,
        });
    }
    pauseHandle() {
        this.setState({
            isPlaying: false,
            isLoading: false,
            showController:true,
        });
    }

    endedHandle() {
        this.videoPlayer.currentTime(0)
    }

    // 检查是否360
    check360() {
        //application/vnd.chromium.remoting-viewer 可能为360特有
        var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
        
        //检测是否是谷歌内核(可排除360及谷歌以外的浏览器)
        function isChrome(){
            var ua = navigator.userAgent.toLowerCase();

            return ua.indexOf("chrome") > 1;
        }
        
        function _mime(option, value) {
            var mimeTypes = navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                    return true;
                }
            }
            return false;
        }

        if (isChrome() && is360) { 
            return true;
        } else {
            return false;
        }
    }


    // 初始化播放进度条拖动事件
	initProgressBtnTouch() {

        const moveFn = (e) => {
			if(this.data.dragging){
				e.preventDefault();
				e.stopPropagation();
				const touch = e.touches ? e.touches[0] : e;
				const diff = touch.clientX - this.progressRef.getBoundingClientRect().left;
				let progress = diff / this.progressRef.clientWidth;
				progress = progress < 0 ? 0 : (progress > 1 ? 1 : progress);
				this.setState({
					progress,
					currentTime: this.state.duration * progress
                });
                this.stopHidingControlBar();
			}
		};

		const endFn = (e) => {

			if (this.data.dragging) {
				e.preventDefault();
				e.stopPropagation();
				this.videoPlayer.currentTime(this.state.progress * this.state.duration);
				if(this.state.isPlaying){
					this.hideControlBarInThreeSeconds();
					this.setState({
						isPlaying: false,
						isLoading: true,
						showController: true,
					}, () => {
						setTimeout(() => {
							this.data.dragging = false;
						}, 10);
					});
				}else{
					this.data.dragging = false;
				}

			}
		};

		if (Detect.os.phone) {
			document.addEventListener('touchmove', moveFn, false);
			document.addEventListener('touchend', endFn, false);
		} else {
			document.addEventListener('mousemove', moveFn, false);
			document.addEventListener('mouseup', endFn, false);
		}
	}

    progressBtnDragStartHandle(e){
		this.data.dragging = true;
    }
    
    controllerPlayBtnClickHandle(e){
		e.stopPropagation();
		if(this.state.isPlaying || this.state.isLoading){
			this.videoPlayer.pause();
		}else{
			this.videoPlayer.play();
			this.blurPoster();
		}
    }


    showControllerToggle(){
		if(!this.state.showController){
			this.hideControlBarInThreeSeconds();
		}else{
			this.stopHidingControlBar();
		}
		this.setState({
			showController: !this.state.showController
		});
    }
    
    hideControlBarInThreeSeconds(){
		if(this.data.hideControlBarTimer){
            clearTimeout(this.data.hideControlBarTimer);
		}
		this.data.hideControlBarTimer = setTimeout(() => {
			this.setState({
				showController: false
			});
		}, 3000);
	}

	stopHidingControlBar(){
		if(this.data.hideControlBarTimer){
            clearTimeout(this.data.hideControlBarTimer);
		}
	}
    
    blurPoster(){
		if(!this.state.blurPoster){
			this.setState({
				blurPoster: true
			});
		}
	}

    
    timeupdateHandle() {
        if (!this.videoPlayer) {
            return false;
        }
        if (!this.data.dragging && !this.videoPlayer.paused()) { 
            let currentTime = this.videoPlayer.currentTime();
            this.setState({
                currentTime: currentTime,
                progress: currentTime / this.state.duration
            });
            if(this.state.isLoading){
                // 有时候拖动进度条触发了waiting事件，可是正常播s放后不会触发playing事件，在这里保证能正常播放
                this.hideControlBarInThreeSeconds();
                this.setState({
                    isPlaying: true,
                    isLoading: false,
                })
            }
        }
    }
    


    fullscreenBtnClickHandle(){
        if(this.state.fullscreen){
           this.exitFullscreen();
       }else{
           this.requestFullscreen();
       }
   }

   requestFullscreen(){
        if(this.state.fullscreen){
            return true;
        }
        this.videoPlayer.fullscreen(true);

   }

   exitFullscreen(){
        if(!this.state.fullscreen){
            return false;
        }
      
        this.videoPlayer.fullscreen(false);
   }

    render() {
        return (
            <div id="ql-tencent-video-player"
                className={`ql-tencent-video-player`}
                onClick={this.showControllerToggle}
            >
                <div className="cover"></div>
                <div className={`play-btn on-log${this.state.isPlaying ? ' playing' : ''}${this.state.isLoading ? ' loading' : ''}${this.state.showController ? '' : ' leave'}`}
                        onClick={this.controllerPlayBtnClickHandle}
                        data-log-name="播放按钮"
                        data-log-region="play-btn"
                        data-log-pos={this.state.isPlaying ? 'pause' : 'play'}
                ></div>
                <div className={`video-controller${this.state.showController ? '' : ' hide'}`} onClick={e => e.stopPropagation()}>
                    {
                        !this.props.isLive ?
                            <div className="time">{getAudioTimeShow(this.state.currentTime)}/{getAudioTimeShow(this.state.duration)}</div>
                            :
                            <div className="time beginning">{getAudioTimeShow(this.state.currentTime)}</div>
                    }
                    <div className="progress" ref={el => (this.progressRef = el)}>
                        <div className="progress-played" style={{width: `${!this.props.isLive ? this.state.progress * 100 : 100}%`}}></div>
                        {
                            !this.props.isLive &&
                            <div className="progress-btn" style={{left: `${this.state.progress * 100}%`}}
                                    onTouchStart={this.progressBtnDragStartHandle}
                                    onMouseDown={this.progressBtnDragStartHandle}
                                    ref={el => (this.progressBtnRef = el)}
                            ></div>
                        }
                    </div>
                    <div className="fullscreen-btn on-log"
                            onClick={this.fullscreenBtnClickHandle}
                            data-log-name="全屏按钮"
                            data-log-region="fullscreen-btn"
                    ></div>
                </div>
            </div>
        );
    }
}

QlTcPlayer.propTypes = {

};

export default QlTcPlayer;