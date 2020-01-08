/**
 *
 * @author Dylan
 * @date 2018/7/24
 */
import React, { Component, Fragment } from 'react';
import { autobind, throttle } from 'core-decorators';
import Detect from 'components/detect';
import { isQlchat, isWeixin } from 'components/envi';
import { getAudioTimeShow,getVal} from 'components/util';
import { CSSTransition } from 'react-transition-group';

const VIDEO_RATIO = 0.5625;

/**
 * @class
 * @extends React.Component
 */

@autobind
class CanvasVideoPlayer extends Component{

	events = {};

	state = {
		fullscreen: false,
		isPlaying: false,
		showController: true,
		showVideo: false,
		isLoading: false,
		duration: 0,
		currentTime: 0,
		progress: 0,
		playbackRate: undefined,
		playbackRateToast: undefined,

		// isUseCanvas: sessionStorage.getItem('isUseCanvas') !== 'N' && !Detect.os.ios && !isQlchat(),
		isUseCanvas: !Detect.os.phone && !Detect.os.tablet
	};

	data = {
		// isUseCanvas: !Detect.os.ios
		dragging: false,
		pixelDetectTimes: 0,
		emptyPixelDetectedTimes: 0
	};

	/**
	* @constructor
	* @param {Object} props
	 * @param {string} props.src 视频地址
	 * @param {string} props.poster 视频封面
	* */
	constructor(props){
		super(props);
	}

	async componentDidMount(){
		if(this.canvas){
			this.ctx = this.canvas.getContext('2d');
		}

		await this.init();

		// 初始化播放速率
		if (this.videoPlayer) {
			this.changePlaybackRate(this.props.playbackRate, true);
		}
	}

	componentDidUpdate(prevProps){
		// console.log('updated');
		if(this.props.src !== prevProps.src){
			this.reInit()
		}
	}

	/**
	 * @method on
	 * @description 给当前实例绑定事件
	 * @param {String} name 事件名
	 * @param {Function} callback 事件回调函数
	 * @return 当前实例
	 */
	on(name, callback){
		const list = this.events[name] || (this.events[name] = []);
		list.push(callback);
		return this;
	}

	emit(name, data) {
		const list = this.events[name];

		if (list && list.length) {
			list.forEach(l => l(data));
		}
	}

	async srcProcess(){
		// 按需引入：有flv地址需要引入flv.js后才能初始化播放器，目前用于直播流。
		try {
			if (this.props.flvSrc) {
				if(!this.flvjs){
					this.flvjs = await require.ensure([], (require) => {
						// 此处引用详细路径是因为该插件会优先选用ES6文件，编译会报错。
						return require('flv.js/dist/flv.min');
					}, 'flv');
				}
				if (!Detect.os.android && /(\.flv)/.test(this.props.flvSrc) && this.flvjs.isSupported() ) {
					this.setState({
						isFlv:true
					}, () => {
						this.flvLoad();
						this.flvPlayer.play();
					})
				}else{
					this.videoPlayer.src = this.props.src;
				}

			}else if(this.props.src.includes('m3u8')){

				if(this.videoPlayer.canPlayType('application/vnd.apple.mpegurl')){
					this.videoPlayer.src = this.props.src;
				}else{
					if(!this.Hls){
						this.Hls = await require.ensure([], (require) => {
							return require('hls.js');
						}, 'hls');
					}
					if(this.Hls.isSupported()){
						await new Promise(resolve => {
							const hls = new this.Hls();
							hls.loadSource(this.props.src);
							hls.attachMedia(this.videoPlayer);
							hls.on(this.Hls.Events.MANIFEST_PARSED, () => {
								resolve();
							});
							hls.on(this.Hls.Events.ERROR, (e,data) => {
								this.errorLog(e, data);
							});
						});
					}else{
						this.setState({
							m3u8NonsupportMsg: '此浏览器不支持视频流播放'
						})
					}
				}
			}else{
				this.videoPlayer.src = this.props.src;
			}

		} catch (error) {
			console.log(error);
		}
	}

	async init() {
		await this.srcProcess();

		this.videoPlayer.addEventListener('durationchange', (e) => {
			this.emit('durationchange', e);
			this.setState({
				duration: this.videoPlayer.duration && this.videoPlayer.duration !== Infinity? this.videoPlayer.duration : 0
			});
		});

		this.videoPlayer.addEventListener('timeupdate', (e) => {
			// console.log('trigger timeupdate');
			if (!this.videoPlayer) {
				return false;
			}
			this.emit('timeupdate', e);
			if(!this.data.dragging && !this.videoPlayer.paused){
				this.updateProgress();
				if(this.state.isLoading || !this.drawing){
					// 有时候拖动进度条触发了waiting事件，可是正常播放后不会触发playing事件，在这里保证能正常播放
					this.startDrawingVideo();
					this.hideControlBarInThreeSeconds();
					this.setState({
						isPlaying: true,
						isLoading: false,
					})
				}
			}
		});

		this.videoPlayer.addEventListener('play', (e) => {
			console.log('trigger play');
			this.emit('play', e);
		});

		this.videoPlayer.addEventListener('playing', (e) => {
			console.log('trigger playing');
			if(!this.state.showVideo){
				this.setState({
					showVideo: true
				})
			}
			if(this.state.isLoading || !this.drawing){
				this.startDrawingVideo();
				this.hideControlBarInThreeSeconds();
				this.setState({
					isPlaying: true,
					isLoading: false,
				});
			}
			this.emit('playing', e);
		});

		this.videoPlayer.addEventListener('waiting', (e) => {
			console.log('trigger waiting');
			if(!this.state.isLoading || this.drawing){
				this.stopDrawingVideo();
				this.stopHidingControlBar();
				this.setState({
					isPlaying: false,
					isLoading: true,
					showController: true,
				});
			}
			this.emit('waiting', e);
		});

		this.videoPlayer.addEventListener('pause', (e) => {
			console.log('trigger pause')
			this.stopDrawingVideo();
			this.setState({
				isPlaying: false,
				isLoading: false,
			});
			this.emit('pause', e);
		});

		this.videoPlayer.addEventListener('ended', (e) => {
			console.log('trigger ended')
			this.stopDrawingVideo();
			this.videoPlayer.currentTime = 0;
			this.setState({
				// currentTime: 0,
				// progress: 0,
				showVideo: false,
			});
			this.emit('ended', e);
		});

		this.videoPlayer.addEventListener('error', (e) => {
			console.log('trigger error')
			this.stopDrawingVideo();
			this.emit('error', e);
			this.errorLog('error',e);
		});

		this.videoPlayer.addEventListener('loadeddata', (e) => {
			this.emit('loadeddata', e);
		});

		this.videoPlayer.addEventListener('abort', (e) => {
			this.stopDrawingVideo();
			this.emit('abort', e);
			this.errorLog('abort',e);
		});

		this.videoPlayer.addEventListener('ratechange', (e) => {
			this.emit('ratechange', e);
		});

		if(!this.canvas){
			this.videoPlayer.addEventListener("fullscreenchange", (e) => {
				console.log("fullscreenchange", e);
				if(this.state.fullscreen){
					this.emit('exitfullscreen')
					this.setState({
						fullscreen: false
					})
				}else{
					this.emit('requestfullscreen')
					this.setState({
						fullscreen: true
					})
				}
			});
			this.videoPlayer.addEventListener("mozfullscreenchange", (e) => {
				console.log("mozfullscreenchange ", e);
				if(this.state.fullscreen){
					this.emit('exitfullscreen')
					this.setState({
						fullscreen: false
					})
				}else{
					this.emit('requestfullscreen')
					this.setState({
						fullscreen: true
					})
				}
			});
			this.videoPlayer.addEventListener("webkitfullscreenchange", (e) => {
				console.log("webkitfullscreenchange", e);
				if(this.state.fullscreen){
					this.emit('exitfullscreen')
					this.setState({
						fullscreen: false
					})
				}else{
					this.emit('requestfullscreen')
					this.setState({
						fullscreen: true
					})
				}
			});
			this.videoPlayer.addEventListener("msfullscreenchange", (e) => {
				console.log("msfullscreenchange", e);
				if(this.state.fullscreen){
					this.emit('exitfullscreen')
					this.setState({
						fullscreen: false
					})
				}else{
					this.emit('requestfullscreen')
					this.setState({
						fullscreen: true
					})
				}
			});
			this.videoPlayer.addEventListener("x5videoenterfullscreen", (e) => {
				console.log("x5videoenterfullscreen", e);
				this.emit('requestfullscreen')
				this.setState({
					fullscreen: true
				})
			});
			this.videoPlayer.addEventListener("x5videoexitfullscreen", (e) => {
				console.log("x5videoexitfullscreen", e);
				this.emit('exitfullscreen')
				this.setState({
					fullscreen: false
				})
			});
		}

		window.addEventListener('resize', (event) => {
			setTimeout(_=> {
				this.adaptCanvas();
				// 一秒后再执行一次，保证尺寸正确(某些手机切横屏时卡顿，导致高宽获取不正确)
				setTimeout(_=> {
					this.adaptCanvas();
				}, 1000);
			}, 800);
		});

		this.initProgressBtnTouch();

		if (!Detect.os.phone) {
			// PC端监听播放器全屏
			this.canvasWrap.addEventListener('fullscreenchange', this.onPcFullscreenChange);
			this.canvasWrap.addEventListener('webkitfullscreenchange', this.onPcFullscreenChange);
			this.canvasWrap.addEventListener('mozfullscreenchange', this.onPcFullscreenChange);
			this.canvasWrap.addEventListener('MSFullscreenChange', this.onPcFullscreenChange);
		}

		// document.addEventListener('keydown',(e) => {
		// 	console.log('keydown');
		// 	console.log(e);
		// });
		//
		// document.addEventListener('keyup',(e) => {
		// 	console.log(e)
		// 	if(e.keyCode === 27 && this.state.fullscreen){
		// 		e.preventDefault();
		// 		// 全屏状态按ESC可以退出全屏
		// 		this.exitFullscreen();
		// 	}
		// })
	}

	// 销毁flv播放器
	flvDestroy() {
		if (!this.flvPlayer) {
			return false;
		}
		this.flvPlayer.pause();
		this.flvPlayer.unload();
		this.flvPlayer.detachMediaElement();
		this.flvPlayer.destroy();
		this.flvPlayer = null;
	}


	// 加载flv播放器
	flvLoad() {
		let videoElement = document.getElementById('ql-video-player');
		this.flvPlayer = this.flvjs.createPlayer({
			type: 'flv',
			url: this.props.flvSrc
		});
		this.flvPlayer.attachMediaElement(videoElement);
		this.flvPlayer.load();
	}

	// 重新加载播放器
	// 直播流播放中断后重连需要重新加载
	reloadPlayer() {
        if (!Detect.os.android && /(\.flv)/.test(this.props.flvSrc) && this.flvjs && this.flvjs.isSupported() ) {
			this.flvDestroy();
			setTimeout(() => {
				this.flvLoad();
				this.videoPlayer.play();
			}, 500);
		}else{
			this.videoPlayer.pause();
			this.videoPlayer.src = '';
			this.videoPlayer.src = this.props.src;
			setTimeout(() => {
				this.videoPlayer.play();
			}, 800);
		}

    }

	async reInit() {
		this.videoPlayer.pause();
		this.videoPlayer.currentTime = 0;
		await this.srcProcess();
		this.setState({
			currentTime: 0,
			progress: 0,
			showVideo: false,
			showController: true,
			isPlaying: false,
			blurPoster: false,
		});
	}

	@throttle(500)
	updateProgress(){
		this.setState({
			currentTime: this.videoPlayer.currentTime,
			progress: this.videoPlayer.currentTime / this.videoPlayer.duration
		});
	}

	// 初始化播放进度条拖动事件
	initProgressBtnTouch() {

		const startFn = (e) => {
			// you can add some logic at here.
			this.emit('dragstart', e);
		}

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
				this.emit('dragmove', e);
			}
		};

		const endFn = (e) => {

			if (this.data.dragging) {
				e.preventDefault();
				e.stopPropagation();
				this.videoPlayer.currentTime = this.state.progress * this.state.duration;
				if(this.state.isPlaying){
					this.stopDrawingVideo();
					this.stopHidingControlBar();
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
				this.emit('dragend', e);
			}
		};

		if (Detect.os.phone) {
			document.addEventListener('touchstart', startFn, false);
			document.addEventListener('touchmove', moveFn, false);
			document.addEventListener('touchend', endFn, false);
		} else {
			document.addEventListener('mousedown', startFn, false);
			document.addEventListener('mousemove', moveFn, false);
			document.addEventListener('mouseup', endFn, false);
		}
	}

	progressBtnDragStartHandle(e){
		this.data.dragging = true;
	}

	/**
	 * @get 获取视频地址
	 * @return {String}
	 */
	get src(){
		return this.videoPlayer.src;
	}

	/**
	 * @get 获取视频时长
	 * @return {Number}
	 */
	get duration(){
		return this.videoPlayer.duration;
	}

	/**
	 * @get 获取视频播放进度
	 * @return {Number}
	 */
	get progress(){
		return this.state.progress;
	}

	/**
	 * @get 获取当前播放时间
	 * @return {Number}
	 */
	get currentTime(){
		return this.videoPlayer.currentTime;
	}

	/**
	 * @set 设置视频播放时间
	 * @param {Number} value 播放时间
	 */
	set currentTime(value){
		this.videoPlayer.currentTime = value;
	}

	/**
	 * @get 获取视频音量
	 * @return {Number}
	 */
	get volume(){
		return this.videoPlayer.volume;
	}

	get seekable(){
		return this.videoPlayer.seekable;
	}

	/**
	 * @get 获取视频全屏状态
	 * @return {Boolean}
	 */
	get fullscreen(){
		return this.state.fullscreen;
	}

	/**
	 * @get 获取视频进度条拖拽状态
	 * @return {Boolean}
	 */
	get dragging(){
		return this.data.dragging;
	}

	get drawing(){
		return !!this.data.isDrawingVideo;
	}

	/**
	 * @method play 控制视频播放
	 */
	play(){
		this.videoPlayer.play();
	}

	/**
	 * @method pause 控制视频暂停
	 */
	pause(){
		this.videoPlayer.pause();
	}

	startDrawingVideo(){
		if(!this.videoPlayer || this.data.isDrawingVideo || !this.canvas) return false;
		this.data.isDrawingVideo = true;
		if(!this.state.showVideo){
			this.setState({
				showVideo: true
			})
		}
		this.adaptCanvas();
		this.drawVideo();
	}

	stopDrawingVideo(){
		this.data.isDrawingVideo = false;
		// this.testImg = document.createElement('img');
		// this.testImg.classList.add('video-test-img');
		// document.body.appendChild(this.testImg)
	}

	drawVideo(){
		if(!this.videoPlayer || !this.data.isDrawingVideo || !this.canvas) return false;
		requestAnimationFrame(_=> {
			if(!this.data.isDrawingVideo) return false;
			if(this.videoPlayer.paused || this.videoPlayer.ended || this.videoPlayer.error){
				this.stopDrawingVideo();
				return false;
			}

			this.canvas.width = this.videoPlayer.videoWidth;
			this.canvas.height = this.videoPlayer.videoHeight;
			this.ctx.drawImage(this.videoPlayer, 0, 0, this.canvas.width, this.canvas.height);
			// 安卓已不支持绘制canvas
			// this.pixelDataDetect();
			// if(this.canvas.toDataURL().length > 40){
			// 	this.testImg.src = this.canvas.toDataURL()
			// }
			// console.log(this.canvas.toDataURL().substr(0,40));
			this.drawVideo();
		});
	}

	@throttle(2000)
	async pixelDataDetect(){
		// 新版微信同层播放器有bug，某些机型的canvas获取不了视频画面
		if(!Detect.os.android || !isWeixin()){
			return false;
		}
		this.data.pixelDetectTimes += 1;
		if(this.data.pixelDetectTimes > 10){
			return false
		}
		const detectCanvas = document.createElement('canvas');
		detectCanvas.width = this.canvas.width;
		detectCanvas.height = this.canvas.height;
		const ctx = detectCanvas.getContext('2d');
		ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
		const rgba = ctx.getImageData(Math.floor(Math.random() * detectCanvas.width + 1), Math.floor(Math.random() * detectCanvas.height + 1), 1, 1).data;
		if(rgba.length && rgba.reduce((a, b) => (a + b)) === 0){
			this.data.emptyPixelDetectedTimes += 1;
			if(this.data.emptyPixelDetectedTimes > 3){
				this.stopDrawingVideo();
				// this.videoPlayer.removeAttribute('x5-video-player-type');
				sessionStorage.setItem('isUseCanvas', 'N');
				this.setState({
					isUseCanvas: false
				})
			}
		}
	}

	adaptCanvas(){
		if(!this.canvas) return false;
		console.log('adapt canvas');
		if(!this.videoPlayer.videoWidth || !this.canvasWrap.clientHeight){
			setTimeout(() => {
				this.adaptCanvas();
			}, 500);
			return false;
		}
		const videoRatio = (this.canvasWrap.clientHeight / this.canvasWrap.clientWidth) || VIDEO_RATIO
		if(this.videoPlayer.videoHeight / this.videoPlayer.videoWidth > videoRatio){
			this.canvas.style.height = '100%';
			this.canvas.style.width = this.canvasWrap.clientHeight * this.videoPlayer.videoWidth / this.videoPlayer.videoHeight + 'px';
		}else if(this.videoPlayer.videoHeight / this.videoPlayer.videoWidth <= videoRatio){
			this.canvas.style.width = '100%';
			this.canvas.style.height = this.canvasWrap.clientWidth * this.videoPlayer.videoHeight / this.videoPlayer.videoWidth + 'px';
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
		if(this.canvas){
			// PC端调用网页全屏
			if(!Detect.os.phone){
				// const docElm = document.documentElement;
				if (this.canvasWrap.requestFullscreen) {
					this.canvasWrap.requestFullscreen();
				}else if (this.canvasWrap.msRequestFullscreen) {
					this.canvasWrap.msRequestFullscreen();
				}else if (this.canvasWrap.mozRequestFullScreen) {
					this.canvasWrap.mozRequestFullScreen();
				}else if (this.canvasWrap.webkitRequestFullScreen) {
					this.canvasWrap.webkitRequestFullScreen();
				}
			}

			this.setState({
				fullscreen: true
			}, () => {
				setTimeout(_=> {
					this.adaptCanvas();
				}, 100)
			});

			this.emit('requestfullscreen');
		}else{
			this.videoPlayer.webkitEnterFullScreen && this.videoPlayer.webkitEnterFullScreen();
			this.videoPlayer.requestFullscreen && this.videoPlayer.requestFullscreen();
			this.videoPlayer.mozRequestFullScreen && this.videoPlayer.mozRequestFullScreen();
			this.videoPlayer.webkitRequestFullScreen && this.videoPlayer.webkitRequestFullScreen();
			this.videoPlayer.msRequestFullscreen && this.videoPlayer.msRequestFullscreen();
		}

	}

	onPcFullscreenChange(){
		if(!document.webkitFullscreenElement && this.state.fullscreen){
			this.exitFullscreen();
		}
	}

	exitFullscreen(){
		if(!this.state.fullscreen){
			return false;
		}
		if(this.canvas){
			// PC端退出网页全屏
			if(!Detect.os.phone){
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				}else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}

			this.setState({
				fullscreen: false
			}, () => {
				setTimeout(_=> {
					this.adaptCanvas();
				}, 100)
			});
			this.emit('exitfullscreen');
		}else{
			this.videoPlayer.webkitExitFullScreen && this.videoPlayer.webkitExitFullScreen();
			this.videoPlayer.exitFullscreen && this.videoPlayer.exitFullscreen();
			this.videoPlayer.mozCancelFullScreen && this.videoPlayer.mozCancelFullScreen();
			this.videoPlayer.webkitCancelFullScreen && this.videoPlayer.webkitCancelFullScreen();
			this.videoPlayer.msCancelFullscreen && this.videoPlayer.msCancelFullscreen();
		}
	}

	controllerPlayBtnClickHandle(e){
		e.stopPropagation();
		// if(this.state.isLoading){
		// 	return false;
		// }
		if(this.state.isPlaying || this.state.isLoading){
			this.videoPlayer.pause();
		}else{
			this.videoPlayer.play();
			this.blurPoster();
		}
	}

	blurPoster(){
		if(!this.state.blurPoster){
			this.setState({
				blurPoster: true
			});
		}
	}

	showPoster(){
		if(this.state.blurPoster) {
			this.setState({
				showVideo: false
			});
		}
	}

	allRate = ['0.7', '1.0', '1.2', '1.5', '2.0']

	onClickPlaybackRate = () => {
		if (Detect.os.android && Detect.os.weixin) {
			if (this.state.fullscreen){
				this.exitFullscreen();
			}
			return window.simpleDialog({
				msg: '安卓网页版暂不支持视频倍速播放功能，请下载App使用此功能',
				confirmText: '下载App',
				onConfirm: () => {
					location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1413567773069';
				}
			})
		}

		// 选择下一个速率
		let index = this.allRate.indexOf(this.state.playbackRate) + 1;

		if (index > 0) {
			// 循环切换
			if (index >= this.allRate.length) {
				index = 0;
			}
		} else {
			index = 1;
		}

		this.changePlaybackRate(this.allRate[index]);
	}

	changePlaybackRate = (rate, isInit = false) => {
		rate = (Number(rate) || 0).toFixed(1);

		let index = this.allRate.indexOf(rate);
		if (index === -1) {
			index = 1;
		}

		const newRateStr = this.allRate[index];

		typeof _qla !== 'undefined' && _qla('click', {region: 'video-playback-rate', pos: newRateStr});

		// 初始化时不需要toast提示
		if (isInit) {
			this.setState({
				playbackRate: newRateStr,
			}, () => {
				this.videoPlayer && (this.videoPlayer.playbackRate = Number(newRateStr));
				this.videoPlayer && (this.videoPlayer.defaultPlaybackRate = Number(newRateStr));
			})
			return;
		}

		this.setState({
			playbackRate: newRateStr,
			playbackRateToast: `倍速${newRateStr}x`,
		}, () => {
			this.videoPlayer && (this.videoPlayer.playbackRate = Number(newRateStr));
			this.videoPlayer && (this.videoPlayer.defaultPlaybackRate = Number(newRateStr));
			this.emit('playbackratechange', newRateStr);

			// 1秒后隐藏
			clearTimeout(this.playbackRateTimer);
			this.playbackRateTimer = setTimeout(() => {
				this.setState({playbackRateToast: ''})
			}, 1000)
		})
	}

	errorLog(e, data) {
		
		if(!this.props.src || getVal(data,'type')=='mediaError'){
			return;
		}
		
		let dataString = '';
		let eventString = e;
		if (data && typeof data == 'object') {
			data = {
				details:getVal(data,'details'),
				response:getVal(data,'response'),
				type:getVal(data,'type'),
				code:getVal(data,'target.error.code'),
				message:getVal(data,'target.error.message'),
			}
			dataString = JSON.stringify(data);
		}
		typeof _qla != 'undefined' && _qla('commonlog', {
			logType: 'error',
			category:'videoPlayerError',
            event:eventString,
			data:dataString,
			url:this.props.src
        });
	}

	render(){
		if(typeof window === 'undefined'){
			return null;
		}
		let videoWrapStyle = {};
		if(this.state.fullscreen && this.state.isUseCanvas){
			videoWrapStyle = {
				paddingTop: 0,
			}
		}else{
			videoWrapStyle = {
				paddingTop: `${VIDEO_RATIO * 100}%`
			}
		}
		return(
			<div className={`canvas-video-player-mask on-log${this.state.fullscreen && this.state.isUseCanvas && Detect.os.phone ? ' fullscreen' : ''} ${this.props.className ? this.props.className : ''}`}
			     onClick={this.showControllerToggle}
			     data-log-name="切换视频菜单"
			     data-log-region="toggle-video-control-bar"
			>
				<div className="canvas-video-player-wrapper" ref={el => (this.canvasWrap = el)} style={videoWrapStyle}>

					<div className={`course-poster${this.state.blurPoster ? ' filter-blur' : ''}`}
					     style={{backgroundImage: `url(${this.props.poster})`}}
					>
					</div>

					<div className={`canvas-video-player-container${this.state.showVideo ? ' show' : ''}`}>
						{
							this.state.isUseCanvas &&
							<canvas ref={el => (this.canvas = el)}></canvas>
						}
						{
							this.state.isFlv?
							<video id='ql-video-player' className={`${this.state.isUseCanvas ? 'hide' : ''}`}
								ref={el => (this.videoPlayer = el)}
								preload="auto"
								webkit-playsnline="true"
								x5-playsinline="true"
								x-webkit-airplay="true"
							></video>
							:
							<video id='ql-video-player' className={`${this.state.isUseCanvas ? 'hide' : ''}`}
								ref={el => (this.videoPlayer = el)}
								preload="auto"
								webkit-playsinline="true"
								x5-playsinline="true"
								playsinline="true"
								x-webkit-airplay="true"
								crossOrigin="anonymous"
							></video>
						}
					</div>
					
					{
						this.state.isLoading?
						<div className={`middle-loading`}></div>
						:null
					}

					<div className={`play-btn on-log${this.state.isPlaying||this.state.isLoading ? ' playing' : ''}${this.state.showController ? '' : ' leave'}`}
					     onClick={this.controllerPlayBtnClickHandle}
					     data-log-name="播放按钮"
					     data-log-region="play-btn"
					     data-log-pos={this.state.isPlaying ? 'pause' : 'play'}
					></div>
					{/* props.hideProgress是否显示进度条和全屏按钮 */}
					<div className={`video-controller${this.state.showController && (!this.props.hideProgress) ? '' : ' hide'}`} onClick={e => e.stopPropagation()}>
						{
							(!this.props.hidePlaybackRate && !this.props.isLive)?
							<div className="play-rate" onClick={this.onClickPlaybackRate}>{this.state.playbackRate}</div>:null
						}
						{
							!this.props.hideTime?
							<Fragment>	
								{
									!this.props.isLive ?
										<div className="time">{getAudioTimeShow(this.state.currentTime)} / {getAudioTimeShow(this.state.duration || this.props.duration)}</div>
										:
										<div className="time beginning">{getAudioTimeShow(this.state.currentTime)}</div>
								}
							</Fragment>
							:null	
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

					{
						this.state.playbackRateToast &&
						<CSSTransition
							classNames="playrate-toast"
							timeout={{enter: 300, exit: 300}}
						>
							<div className="playrate-toast">{this.state.playbackRateToast}</div>
						</CSSTransition>
					}

					{
						this.state.m3u8NonsupportMsg &&
							<div className="m3u8-nonsupport-msg">{this.state.m3u8NonsupportMsg}</div>
					}
				</div>
			</div>
		)
	}

}

CanvasVideoPlayer.defaultProps = {
	isLive: false,
	poster: '',
	duration: 0,
	// poster: 'https://img.qlchat.com/qlLive/channelLogo/7L71BZUJ-ZTIG-WZTK-1532490695754-T8HFIX745TUU.gif?x-oss-process=image/resize,h_420,w_750',
	// src: 'https://video.qianliaowang.com/6807a84693b14f9081efa4b3986c2b26/f519df87cb6d4bdba2d42e8986b9d41a-9a7b3f2109c5e4760601ca3b08b392d5-ld.mp4?auth_key=1532511586-1360993910-0-509e997f86aabc7e06e5c06d4080a93f',
};

CanvasVideoPlayer.propTypes = {
	// 必须传src，不能为空
	src: function(props, propName, componentName) {
		if (!props[propName] || Object.prototype.toString.call(props[propName]) !== '[object String]') {
			return new Error(
				'Invalid prop `' + propName + '` supplied to' +
				' `' + componentName + '`. Validation failed.'
			);
		}
	},
};

export default CanvasVideoPlayer;