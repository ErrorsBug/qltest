/**
 *
 * @author Dylan
 * @date 2018/5/14
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import PropTypes from 'prop-types';

import Detect from 'components/detect';
import { imgUrlFormat ,locationTo, sleep, updatePercentageComplete, updateLearningTime} from 'components/util';
import { isPc } from 'components/envi';

import { getMediaActualUrl, getAuth } from '../../../../actions/video';
import { getSysTime } from '../../../../actions/common';
import {
    request,
} from 'common_actions/common';

import CanvasVideoPlayer from 'components/canvas-video-player';



function mapStateToProps (state) {
	return {
		sysTime: state.common.sysTime,
	}
}

const mapActionToProps = {
	getSysTime,
	getMediaActualUrl,
	getAuth
};

@autobind
class VideoPlayer extends Component {

	state = {
		// 直播状态（plan-未开始；beginning-直播中；complete-已完成（直播完进入互动环节; ended-已结束
		liveStatus: this.getLiveStatus(),
		showNextCourseTip: false,

		// 未开播倒计时
		day: 0,
		hours: 0,
		minutes: 0,
	};

	data = {
		videoExpireReloadTimes: 0,
		startLogTime: 0,
	};

	static contextTypes = {
		router: PropTypes.object
	};

	componentWillReceiveProps(nextProps){
		if(nextProps.reactiveAudioPlaying && !this.props.reactiveAudioPlaying && this.canvasVideoPlayer){
			this.canvasVideoPlayer.pause();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.topicId !== this.props.topicId) {
			clearInterval(this.countDownTimer);
			this.data.nextCourse = '';
			if(this.data.firstBeginningVideoCurrentTimeUpdated){
				this.data.firstBeginningVideoCurrentTimeUpdated = false;
			}
			this.setState({
				showNextCourseTip: false,
				liveStatus: this.getLiveStatus()
			}, () => {
				if(this.state.liveStatus === 'plan'){
					this.initCountDown();
				}else{
					if(this.state.playUrl){
						this.reInitVideoPlayer();
					}else{
						this.initVideoPlayer();
					}
				}
			});
		}
		if(prevProps.isPlaying !== this.state.isPlaying) {
			this.props.updateVideoPlayingStatus(this.state.isPlaying);
		}


		// 完播率提交间隔
        this.data.waitToTime = (this.props.topicInfo.duration > 300 ? this.props.topicInfo.duration / 100 : 3) * 1000;
	}

	componentWillUpdate(nextProps, nextState){
		if(nextState.liveStatus !== this.state.liveStatus){
			// 同步liveStatus到父组件
			this.props.updateLiveStatus(nextState.liveStatus);
		}
	}

	componentDidMount() {

        // 阻止视频区域右键菜单弹出
        this.videoPlayerWrapRef.oncontextmenu = function () {
            return false
        }

        clearInterval(this.countDownTimer);
		if(this.state.liveStatus === 'plan'){
			this.initCountDown();
		}else{
			this.initVideoPlayer();
		}
		// 同步liveStatus到父组件
		this.props.updateLiveStatus(this.state.liveStatus);
	}
	componentWillUnmount() {
		clearInterval(this.countDownTimer);
	}

	// 获取直播状态
	getLiveStatus() {
		const { startTime, endTime, status, duration, style } = this.props.topicInfo;
		const { sysTime } = this.props;
		if (sysTime < startTime) {
			return 'plan';
		}

		// 回看状态
		if (((sysTime >= startTime + duration * 1000) && sysTime < endTime) || style === 'videoGraphic') {
			return 'complete';
		}

		if (status === 'ended' || sysTime >= endTime) {
			return 'ended';
		}

		return 'beginning';

	}

	initCountDown(){
		let leftSecond = Math.floor((this.props.topicInfo.startTime - this.props.sysTime) / 1000);

		this.setState({
			day: ~~(leftSecond / (3600 * 24)),
			hours: ~~(leftSecond % (3600 * 24) / 3600),
			minutes:  ~~(leftSecond % 3600 / 60),
		});

		if(this.state.playUrl){
			this.setState({
				playUrl: ''
			})
		}

		this.countDownTimer = window.setInterval(_=> {
			if(leftSecond <= 0){
				clearInterval(this.countDownTimer);
				this.handleCountDownFinish();
				return false;
			}
			leftSecond--;
			if(leftSecond < 120 && leftSecond > 0){
				return false;
			}
			this.setState({
				day: ~~(leftSecond / (3600 * 24)),
				hours: ~~(leftSecond % (3600 * 24) / 3600),
				minutes:  ~~(leftSecond % 3600 / 60),
			});
		}, 1000);

	}

	handleCountDownFinish(){
		this.setState({
			liveStatus: this.props.topicInfo.style === 'videoGraphic' ? 'complete' : 'beginning'
		}, () => {
			this.initVideoPlayer();
		});
	}

	async initVideoPlayer(){
		const res = await this.props.getMediaActualUrl(this.props.topicId, this.props.topicInfo.sourceTopicId);
		const videoData = res.data.video;
		videoData[0].used = true;
		
		this.setState({
			playUrl: videoData[0].playUrl
		}, () => {

			this.canvasVideoPlayer.on('timeupdate', this.timeUpdate);

			this.canvasVideoPlayer.on('play', (e) => {
				this.props.playStatus(true)
				if(this.state.liveStatus === 'beginning'){
					this.updateBeginningVideoCurrentTime();
				}


				this.data.startLogTime = Date.now();
				this.data.waitToUp = true;
				let time = 3000 || this.data.waitToTime;
				clearTimeout(this.data.logTimer);
				this.data.logTimer = setTimeout(() => {
					this.data.waitToUp = false;
				}, time);
			});

			this.canvasVideoPlayer.on("pause",() => {
				console.log("暂停")
				this.props.playStatus(false);
				this.recordMediaReaded();
			})


			this.canvasVideoPlayer.on('ended', this.videoEnded);

			this.canvasVideoPlayer.on('requestfullscreen', () => {
				// ios的浏览器和mac的safari浏览器，元素就算fixed了也会受最外层祖元素的overflow:hidden影响
				if(Detect.os.ios || Detect.browser.safari){
					const appWrap = document.querySelector('#app');
					if(appWrap){
						appWrap.style['overflow-x'] = 'visible';
					}
				}
			});

			this.canvasVideoPlayer.on('exitfullscreen', () => {
				// ios的浏览器和mac的safari浏览器，元素就算fixed了也会受最外层祖元素的overflow:hidden影响
				if(Detect.os.ios || Detect.browser.safari){
					const appWrap = document.querySelector('#app');
					if(appWrap){
						appWrap.style['overflow-x'] = 'hidden';
					}
				}
			});

			this.canvasVideoPlayer.on('error', (e) => {
				console.error('video play error.', e);
				this.props.playStatus(false);
				this.recordMediaReaded();
				if(videoData.length > 1){
					videoData.some((v) => {
						if(!v.used){
							v.used = true;
							this.setState({
								playUrl: v.playUrl
							});
							return true;
						}
					});
				}
			});

			this.canvasVideoPlayer.on('playbackratechange', rate => {
				this.playbackRate = rate;
			});

			this.canvasVideoPlayer.on('waiting', () => {
				this.recordMediaReaded();
			});

			this.autoPlay();

		});

	}

	timeUpdate(e) {
        this.timeUpdateHandle();
        this.updateMediaReaded();
    }

    timeUpdateHandle() {
        if(this.canvasVideoPlayer && !this.canvasVideoPlayer.dragging){
			updatePercentageComplete({
				topicId: this.props.topicId,
				rate: this.canvasVideoPlayer.progress
			});
			// 学分任务达成触发点
			updateLearningTime({
				topicId: this.props.topicId,
				playStatus: 'playing',
				currentTime: this.canvasVideoPlayer.currentTime
			})
		}
		if(this.state.liveStatus === 'beginning' && !this.data.firstBeginningVideoCurrentTimeUpdated){
			// 直播中保证第一次播放的位置正确
			this.data.firstBeginningVideoCurrentTimeUpdated = true;
			this.updateBeginningVideoCurrentTime();
		}
		if(this.state.liveStatus !== 'beginning'){
			if(this.data.hasBackToHistoryPos){
				this.updateVideoPlayHistory();
			}else{
				this.goBackToHistoryPos();
				this.data.hasBackToHistoryPos = true;
			}
		}
    }

	/**
	 * 每5秒内只能提交一次，防止频繁提交
	 */
    // @throttle(10000)
	updateMediaReaded() {
		if (this.data.waitToUp) {
            return false
        }
        this.data.waitToUp = true;
        let time = 3000 || this.data.waitToTime ;
        this.data.logTimer = setTimeout(() => {
            this.data.waitToUp = false;
        }, time);
		this.recordMediaReaded();
		this.data.startLogTime = Date.now();
    }

     /**
     * 完播率统计
     * @param {any} [second=this.canvasVideoPlayer.currentTime] 
     */
    recordMediaReaded(second = this.canvasVideoPlayer.currentTime) {
        if (!second || typeof(second) != 'number') {
            return false;
		}
		// 新完播率
        typeof _qla != 'undefined' && _qla('commonlog', {
			logType:'event',
            category: 'mediaPlayCompletion',
            topicId:this.props.topicInfo.id,
			second: second,
			duration: (Date.now() - this.data.startLogTime) / 1000,
        });
	}
	
	videoEnded(e) {
		this.props.playStatus(false)
		if(this.state.liveStatus === 'beginning' && !this.getNextCourse()){
			this.setState({
				liveStatus: 'complete',
			})
		}
		this.canvasVideoPlayer.exitFullscreen();
		this.clearVideoPlayHistory();
		updatePercentageComplete({
			topicId: this.props.topicId,
			rate: 1
		});
		// 学分任务达成触发点
		updateLearningTime({
			topicId: this.props.topicId,
			currentTime: this.canvasVideoPlayer.duration || 0
		})
		this.recordMediaReaded(this.canvasVideoPlayer.duration);
		this._goToNextCourse();
	}

	async reInitVideoPlayer(){
		const res = await this.props.getMediaActualUrl(this.props.topicId, this.props.topicInfo.sourceTopicId);
		const videoData = res.data.video;
		videoData[0].used = true;
        
		this.setState({
			playUrl: videoData[0].playUrl,
		}, () => {
			setTimeout(() => {
				// 延迟设置hasBackToHistoryPos，不然视频自动切到上一次播放位置
				this.data.hasBackToHistoryPos = false;
				this.autoPlay();
			}, 500);
		});
	}

	autoPlay(){
		if(this.props.autoPlay){
			if(isPc){
				this.canvasVideoPlayer.play();
			}
			else if (window.WeixinJSBridge) {
				WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
					this.canvasVideoPlayer.play();
				}, false);
			} else {
				document.addEventListener("WeixinJSBridgeReady", (e) => {
					WeixinJSBridge.invoke('getNetworkType', {}, (e1) => {
						this.canvasVideoPlayer.play();
					});
				}, false);
			}

		}
	}

	// 更新直播播放位置（时间）
	async updateBeginningVideoCurrentTime() {
		const sysTimeResult = await this.props.getSysTime();
		const { startTime } = this.props.topicInfo;
		let currentTime =  Math.floor((sysTimeResult.data.sysTime - startTime) / 1000);
		if(currentTime > this.state.duration){
			currentTime = this.state.duration;
		}
		this.canvasVideoPlayer.currentTime = currentTime;
	}




	getIsEvaluated(noCache) {
		const topicId = this.props.topicInfo.id;
		const promiseName = `_isEvaluatedPromise_${topicId}`;

        if (!this[promiseName] || noCache) {
            this[promiseName] = request({
                url: '/api/wechat/transfer/h5/evaluate/getStatus',
                body: {
                    topicId,
                }
            }).then(res => {
                if (res.state.code) throw Error(res.state.msg);

                return res.data.evaluateStatus !== 'N';
            }).catch(err => {
                return true;
            })
        }
        return this[promiseName];
	}

	getIsOpenEvaluate() {
        if (!this._isOpenEvaluatePromise) {
            this._isOpenEvaluatePromise = request({
                url: '/api/wechat/transfer/h5/live/entity/getIsOpenEvaluate',
                body: {
                    liveId: this.props.topicInfo.liveId
                }
            }).then(res => {
                if (res.state.code) throw Error(res.state.msg);

                return res.data.isOpenEvaluate === 'Y';
            }).catch(err => {
                return false;
            })
        }
        return this._isOpenEvaluatePromise;
    }
	
	_goToNextCourse = async () => {
        return this.goToNextCourse();
	}

	getNextCourse(){
		if(this.data.nextCourse) return this.data.nextCourse;
		if(this.props.courseList.length){
			this.props.courseList.forEach((c, i) => {
				if(this.props.topicId === c.id && this.props.courseList[i + 1]){
					this.data.nextCourse = this.props.courseList[i + 1];
				}
			});
			return this.data.nextCourse;
		}
	}

	async goToNextCourse(){
		const nextCourse = this.getNextCourse();
		if(nextCourse){
			const res = await this.props.getAuth(nextCourse.id)
			const isAuth = res.data && res.data.isAuth
			if (!isAuth) {
				this.props.showDialog('IsBuyDialog')
				return
			}

			this.canvasVideoPlayer.blurPoster();
			this.canvasVideoPlayer.showPoster();

			this.setState({
				showNextCourseTip: true,
				showController: false,
			});
			await sleep(1000);

			// 判断下节课是否为所属系列课的第二节课，若是，则在跳转链接带上显示弹窗的参数
			const isSecondTopic = this.props.courseList.map(d => d.id).indexOf(nextCourse.id) === 1;

			if(/audio/.test(nextCourse.style)){
				locationTo(`/topic/details-listening?topicId=${nextCourse.id}${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`)
			}else if(/video/.test(nextCourse.style)){
				window.localStorage.setItem('_ROUTERPUSH', 'Y')
				this.context.router.push(`/wechat/page/topic-simple-video?topicId=${nextCourse.id}&autoPlay=1${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`);
			}else{
				locationTo(`/topic/details?topicId=${nextCourse.id}${isSecondTopic ? '&showDialogMoreInfo=Y' : ''}`)
			}
		}
	}

	@throttle(3000)
	updateVideoPlayHistory() {
		const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {};
		const currentTime = this.canvasVideoPlayer.currentTime;

		console.log(`update history to ${currentTime}`);

		if( currentTime > 0 && currentTime < this.canvasVideoPlayer.duration) {
			const obj = {
				currentTime: currentTime,
				duration: this.canvasVideoPlayer.duration
			}
			videoPlayHistory[`${this.props.topicInfo.id}`] = obj;
			localStorage.setItem('videoPlayHistory', JSON.stringify(videoPlayHistory));
		}
	}

	goBackToHistoryPos() {
		console.log('seeking.....');
		const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {};
		const lastTime = videoPlayHistory[`${this.props.topicInfo.id}`]?.currentTime || 0;
		// this.videoPlayer.seek( lastTime ? lastTime : 0);
		if(!lastTime) return;
		setTimeout(() => {
			console.log('seekable length:', this.canvasVideoPlayer.seekable.length);
			// console.log('seekable Start:', this.canvasVideoPlayer.seekable.start(0));
			// console.log('seekable End:', this.canvasVideoPlayer.seekable.end(0));
			this.canvasVideoPlayer.currentTime = lastTime;
			console.log('seekTo:', lastTime);

			if (lastTime !== 0) {
				// 添加进度设置提示
				this.showSeekTips()
			}

		}, 300);

		console.log(`lastTime: ${lastTime}` , `currentTime ${this.canvasVideoPlayer.currentTime}`)
	}

	clearVideoPlayHistory() {
		const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {};
		videoPlayHistory[`${this.props.topicInfo.id}`] = {
            currentTime: 0,
            duration: this.canvasVideoPlayer.duration
        };;
		localStorage.setItem('videoPlayHistory', JSON.stringify(videoPlayHistory));
	}

	showSeekTips () {
		const content = this.videoPlayerWrapRef
		const tips = document.createElement('p')
		tips.className = 'seek-tips'
		tips.innerText = '已自动从上次记忆位置播放'
		content.appendChild(tips)
		setTimeout(() => {
			content.removeChild(tips)
		}, 2000)
	}

	render() {
		return (
			<div className="video-player-wrap"
			     ref={el => (this.videoPlayerWrapRef = el)}
			>
				{
					this.state.liveStatus !== 'plan' ?
					<Fragment>
						{
							this.state.playUrl ?
							<CanvasVideoPlayer
								poster={imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750')}
								src={this.state.playUrl}
								isLive={this.state.liveStatus === 'beginning'}
								ref={el => (this.canvasVideoPlayer = el)}
								playbackRate={this.playbackRate}
							/>
							:
							<div className="placeholder" style={{backgroundImage: `url(${imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_42,w_75')})`}}></div>
						}
						{
							this.state.showNextCourseTip &&
							<div className="next-tip">即将播放下一节...</div>
						}

					</Fragment>
					:
					<div className="count-down-box-wrap">
						<div className="count-down-box-poster"
						     style={{backgroundImage: `url(${imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750')})`}}
						>
						</div>
						<div className="count-down-box">
							<div className="tip">距开课还有</div>
							<div className="clocking">
								<div className="block"><div className="c"><span>{this.state.day}</span>天</div></div>
								:
								<div className="block"><div className="c"><span>{this.state.hours}</span>时</div></div>
								:
								<div className="block"><div className="c"><span>{this.state.minutes}</span>分</div></div>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}



module.exports = connect(mapStateToProps, mapActionToProps, null, { withRef: true })(VideoPlayer);
