import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Detect from 'components/detect';

// import StackBlur from 'components/stack-blur';
import CanvasVideoPlayer from 'components/canvas-video-player';
import { imgUrlFormat, updatePercentageComplete, updateLearningTime } from 'components/util';
import { autobind, throttle } from 'core-decorators';

@autobind
class Video extends Component {

    static propTypes = {
        topicInfo: PropTypes.object.isRequired,
        // sysTime: PropTypes.number.isRequired,
        // volume: PropTypes.number.isRequired,

        // getSysTimeAction: PropTypes.func.isRequired,
        fetchMediaUrlAction: PropTypes.func.isRequired,
    };

    data = {
        // 视频过期重新初始化次数
        videoExpireReloadTimes: 0,
        isTouchMoving: false,
        startLogTime: 0,
    }

    state = {
       
        // 视频时长
        duration: 0,

        // 视频资源链接
        videoSourceUrl: '',

        // 是否在播放
        playing: false,

        // 小视频遮挡
        showMinCover:false,
    }
    async componentDidMount() {
        await this.initVideoPlayer();
        let videoWrap = document.querySelectorAll('.video-wrap');
        videoWrap[0].style.height = videoWrap[0].offsetHeight +'px';
    }

    async reInitVideoPlayer() {
        let mediaResut = await this.props.fetchMediaUrlAction(this.props.topicInfo.id, this.props.topicInfo.sourceTopicId);
        if (mediaResut && mediaResut.state && mediaResut.state.code !== 0) {
            window.toast(mediaResut.state.msg);
            return;
        }
        let videoData = (mediaResut.data && mediaResut.data.video.length && mediaResut.data.video[0]) || {};
        this.setState({
            videoSourceUrl: videoData.playUrl,
            duration: videoData.duration
        });
        
        // 完播率提交间隔
        this.data.waitToTime = (this.state.duration > 300 ? this.state.duration / 100 : 3) * 1000;
    }

    async initVideoPlayer() {
        if (!this.videoPlayer) {
            var videoWrapDom = findDOMNode(this.refs.videoWrap);

            // 禁止右键
            videoWrapDom.oncontextmenu = () => {
                return false;
            };

            this.videoPlayer = this.refs.videoPlayer;

            let mediaResut = await this.props.fetchMediaUrlAction(this.props.topicInfo.id, this.props.topicInfo.sourceTopicId);
            if (mediaResut && mediaResut.state && mediaResut.state.code != 0) {
                window.toast(mediaResut.state.msg);
                return;
            }
            // 初始化定时器间隔，总时长分成100段，最小3秒
            let videoData = (mediaResut.data && mediaResut.data.video.length && mediaResut.data.video[0]) || {};

            this.setState({
                videoSourceUrl: videoData.playUrl,
                duration: videoData.duration
            });

             // 完播率提交间隔
            this.data.waitToTime = (this.state.duration > 300 ? this.state.duration / 100 : 3) * 1000;

            this.videoPlayer.on('ended', this.videoEnded);

            this.videoPlayer.on('play', (e) => {
                this.setState({
                    playing: true
                })
                // 开始播放，隐藏分享按钮
                this.props.toogleShareTagShow(false);

                this.data.startLogTime = Date.now();
                this.data.waitToUp = true;
                let time = 3000||this.data.waitToTime;
                clearTimeout(this.data.logTimer);
                this.data.logTimer = setTimeout(() => {
                    this.data.waitToUp = false;
                }, time);
            });

            this.videoPlayer.on('pause', (e) => {
                this.setState({
                    playing: false
                })
                // 暂停播放，显示分享按钮
                this.props.toogleShareTagShow(true);
                this.recordMediaReaded();
            });

            this.videoPlayer.on('error', (e) => {
                console.error('video play error.', e);

                // 视频过期后重试不行放弃重试，打印日志
                if (this.data.videoExpireReloadTimes >= 2) {
                    if (typeof _qla != 'undefined') {
                        let errData = e.paramData || {};

                        typeof _qla != 'undefined' && _qla('event', {
                            category: 'videoPlay',
                            action: 'failure',
                            // 错误状态
                            statusValue: errData.statusValue,
                            // 发生错误的vid
                            mediaId: errData.mediaId,
                            // 错误码
                            error_code: errData.error_code,
                            // 错误信息
                            error_msg: errData.error_msg,
                        });
                    }
                    return;
                }

                this.data.videoExpireReloadTimes++;
                setTimeout(() => {
                    this.reInitVideoPlayer();
                }, 500);
                this.setState({
                    playing: false
                })
                // 暂停播放，显示分享按钮
                this.props.toogleShareTagShow(true);
            });

            this.videoPlayer.on('timeupdate', this.timeUpdate);

            this.videoPlayer.on('dragstart', (e) => {
                this.data.isTouchMoving = true;
            });

            this.videoPlayer.on('dragmove', (e) => {
                // 防止拖动时触发微信翻页的问题
                if (this.data.isTouchMoving) {
                    e.preventDefault();
                    e.stopPropagation();
                };
            });

            this.videoPlayer.on('dragend', () => {
                this.data.isTouchMoving = false;
            });

	        this.videoPlayer.on('requestfullscreen', () => {
		        // ios的浏览器和mac的safari浏览器，元素就算fixed了也会受最外层祖元素的overflow:hidden影响
		        if(Detect.os.ios || Detect.browser.safari){
			        const appWrap = document.querySelector('#app');
			        if(appWrap){
				        appWrap.style['overflow-x'] = 'visible';
			        }
		        }
	        });

	        this.videoPlayer.on('exitfullscreen', () => {
		        // ios的浏览器和mac的safari浏览器，元素就算fixed了也会受最外层祖元素的overflow:hidden影响
		        if(Detect.os.ios || Detect.browser.safari){
			        const appWrap = document.querySelector('#app');
			        if(appWrap){
				        appWrap.style['overflow-x'] = 'hidden';
			        }
		        }
            });
            
            this.videoPlayer.on('waiting', () => {
                this.recordMediaReaded();
            });
        }
    }

    timeUpdate(e) {
        this.timeUpdateHandle();
        this.updateMediaReaded();
    }

    timeUpdateHandle() {
        let currentTime = this.videoPlayer.currentTime;
        // 开始播放时，重置视频过期次数限制
        this.data.videoExpireReloadTimes = 0;

        this.seekToHistoryTime();
        this.updateVideoPlayHistory();

        updatePercentageComplete({
            topicId: this.props.topicInfo.id,
            finished: this.videoPlayer ? this.videoPlayer.currentTime : 0,
            total: this.videoPlayer ? this.videoPlayer.duration : 0,
        });

        // 学分任务达成触发点
        updateLearningTime({
            topicId: this.props.topicInfo.id,
            playStatus: 'playing',
            currentTime
        })
    }


     /**
     * 每3秒内只能提交一次，防止频繁提交
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
     * @param {any} [second=this.videoPlayer.currentTime] 
     */
    recordMediaReaded(second = this.videoPlayer.currentTime) {
        if (!second || typeof(second) != 'number') {
            return false;
        }
        
        // 新版完播率统计
        typeof _qla != 'undefined' && _qla('commonlog', {
            logType: 'event',
            category: 'mediaPlayCompletion',
            topicId: this.props.topicInfo.id,
            second: second,
            duration: (Date.now() - this.data.startLogTime) / 1000,
        });
    }

    videoEnded(e) {
        this.clearVideoPlayHistory();

        // 播放结束默认要提交一条记录
        this.recordMediaReaded(this.videoPlayer.duration);
        this.setState({
            playing: false
        });
        // 暂停播放，显示分享按钮
        this.props.toogleShareTagShow(true);
        updatePercentageComplete({
            topicId: this.props.topicInfo.id,
            rate: 1
        });
        updateLearningTime({
            topicId: this.props.topicInfo.id,
            currentTime: this.videoPlayer ? this.videoPlayer.duration : 0
        })
    }

    @throttle(3000)
    updateVideoPlayHistory() {
        if (this.alreadySeeked) {
            const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {}
            const currentTime = this.videoPlayer && this.videoPlayer.currentTime;

            if (currentTime > 0 && currentTime < this.state.duration) {
                const obj = {
                    currentTime: currentTime,
                    duration: this.state.duration
                }
                videoPlayHistory[`${this.props.topicInfo.id}`] = obj;
                localStorage.setItem('videoPlayHistory', JSON.stringify(videoPlayHistory));
            }
        }
    }

    clearVideoPlayHistory() {
        const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {};
        videoPlayHistory[`${this.props.topicInfo.id}`] = {
            currentTime: 0,
            duration: this.state.duration
        };
        localStorage.setItem('videoPlayHistory', JSON.stringify(videoPlayHistory));
    }

    seekToHistoryTime() {
        if (!this.alreadySeeked) {
            console.log('seeking.....');
            const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {}
            const lastTime = videoPlayHistory[`${this.props.topicInfo.id}`]?.currentTime || 0;
            // this.videoPlayer.seek( lastTime ? lastTime : 0);
            let videos = document.getElementsByTagName('video');
            let video = videos && videos.length && videos[0];
            if (video && lastTime) {
                setTimeout(() => {
                    // console.log('seekable length:', video.seekable.length);
                    // console.log('seekable Start:', video.seekable.start(0));
                    // console.log('seekable End:', video.seekable.end(0));
                    video.currentTime = lastTime;
                    console.log('seekTo:', lastTime);
                }, 300);
            }

            console.log(`lastTime: ${lastTime}`, `currentTime ${video.currentTime}`)
            this.alreadySeeked = true;
        }
    }


    // minVideoClick(e) {
    //     this.props.minVideoClick();
    // }

    render() {
        return (
            <div
                className={`video-wrap`}
                ref="videoWrap"
            >
                <CanvasVideoPlayer
                    ref="videoPlayer"
                    duration={this.state.duration}
                    src={this.state.videoSourceUrl}
                    poster={imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750,m_fill,limit_0')}
                />
            </div>
                   
        )
    }
}

export default Video;

