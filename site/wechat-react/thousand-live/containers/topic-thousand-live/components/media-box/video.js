import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Detect from 'components/detect';

// import StackBlur from 'components/stack-blur';
import { imgUrlFormat, updatePercentageComplete, updateLearningTime} from 'components/util';
import { autobind, throttle } from 'core-decorators';

import CountDown from './count-down';

import CanvasVideoPlayer from 'components/canvas-video-player';

@autobind
class Video extends Component {
    data = {
        // 视频过期重新初始化次数
        videoExpireReloadTimes: 0,
        isTouchMoveing:false,

        // 是否已经弹出过成就卡模态窗
        popCardModal: !!this.props.compliteStatus.status,

        startLogTime: 0,
    }

    state = {
        // 直播状态（plan-未开始；beginning-进行中；complete-已完成（直播完进入互动环节）；review-回看状态；ended-已结束
        liveStatus: 'plan',
        // 视频时长
        duration: 0,

        // 是否在播放
        playing: false,

        //成就卡：计算累计播放量
        curstartTimeStamp:0,
        curendTimeStamp:0,
        isComplite:false,

        // 是否播放完毕
        playStatus: '',

        // 视频资源链接
        videoSourceUrl: '',

    }
    componentDidMount() {
        this.setState({
            liveStatus: this.getLiveStatus()
        }, () => {
            if (this.state.liveStatus != 'plan') {
                this.initVideoPlayer();
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.volume != nextProps.volume) {
            if (this.videoPlayer) {
                this.videoPlayer.setVolume(nextProps.volume);
            }
        }
    }
    componentWillUnmount() {
        this.vedioHistoryTimer && clearInterval(this.vedioHistoryTimer);
    }

    addStackBlur() {
        setTimeout(() => {
            // StackBlur.image('bg-img', 'canvas', 32);
        }, 2000);
    }

    // 获取剩余秒数
    getLeftSeconds() {
        let { startTime } = this.props.topicInfo;

        let leftTime = parseInt((Number(startTime) - Number(this.props.sysTime)) / 1000);

        if (leftTime < 0) {
            leftTime = 0;
        }

        return leftTime;
    }

    // 获取直播状态
    getLiveStatus() {
        let { startTime, endTime, status, duration } = this.props.topicInfo;
        let { sysTime } = this.props;

        if (status === 'ended') {
            return 'ended';
        }

        if (Number(sysTime) < Number(startTime)) {
            return 'plan';
        }

        // 回看状态
        if ((Number(sysTime) >= Number(startTime) + Number(duration) * 1000) &&
        (Number(sysTime) < Number(endTime))) {
            // 若处于回看状态，且有上次的播放位置时，直接显示播放器
            // if (typeof localStorage != 'undefined') {
            //     const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {};
            //     const lastTime = videoPlayHistory[`${this.props.topicInfo.id}`];
            //     if (lastTime) {
            //         return 'review';
            //     }
            // }
            return 'review';
        }

        if (Number(sysTime) >= Number(endTime)) {
            return 'ended';
        }

        return 'beginning';

    }

    handleCountDownFinish() {
        this.setState({
            liveStatus: 'beginning'
        });

        this.initVideoPlayer();
    }

    // 回看按钮点击处理
    handleReplayBtnClick() {
        this.initVideoPlayer();

        this.setState({
            liveStatus: 'review',
        });

        this.videoPlayer.play();
    }

    // 音频播放完后的处理
    async handleVideoEnd() {

        let { endTime } = this.props.topicInfo;
        let sysTimeResult = await this.props.getSysTimeAction();

        // 判断是否到了结束时间
        // 没到结束时间则进入回放
        if (Number(sysTimeResult.data.sysTime) < Number(endTime)) {
            this.setState({
                liveStatus: 'review',
            });

        // 结束了则更新为结束状态
        } else {
            this.setState({
                liveStatus: 'ended',
            });
        }
        //播放结束时，检测累计完播量
        this.setState({
            curendTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
            playStatus: 'ended',
        });
        this.compliteCardPushFunc();

	    this.props.playCompleted && this.props.playCompleted();
    }

    // 更新直播播放位置（时间）
    async updateVideoCurrentTime() {
        let sysTimeResult = await this.props.getSysTimeAction();
        let { startTime } = this.props.topicInfo;

        let playTime = parseInt((Number(sysTimeResult.data.sysTime) - Number(startTime)) / 1000);

        if ((playTime > this.state.duration) && this.state.duration) {
            playTime = this.state.duration;
        }

        // this.videoPlayer.seek(playTime);
        let videos = document.getElementsByTagName('video');
        let video = videos && videos.length && videos[0];

        if (video) {
            video.currentTime = playTime;
            console.log('seekTo:', playTime);
        }
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
            let videoData = (mediaResut.data && mediaResut.data.video.length && mediaResut.data.video[0]) || {};
            this.setState({
                videoSourceUrl: videoData.playUrl,
                duration: videoData.duration
            });
            // 完播率提交间隔
            this.data.waitToTime = (this.state.duration > 300 ? this.state.duration / 100 : 3) * 1000;
            
            this.videoPlayer.on('ended', this.videoEnded);

            this.videoPlayer.on('play', (e) => {
                // 勿删，会导致无法完播率打点
                this.setState({
                    playing: true,
                });
                //缓存推送成就卡的完播率累计时长
                this.compliteCardPushFunc();
                if (this.state.liveStatus === 'beginning') {
                    this.updateVideoCurrentTime();
                }

                this.data.startLogTime = Date.now();
                this.data.waitToUp = true;
                let time = 3000 || this.data.waitToTime;
                clearTimeout(this.data.logTimer);
                this.data.logTimer = setTimeout(() => {
                    this.data.waitToUp = false;
                }, time);
            });

            this.videoPlayer.on('error', (e) => {
                console.error('video play error.', e);

                this.recordMediaReaded();

                // 视频过期后重试不行放弃重试，打印日志
                if (this.data.videoExpireReloadTimes >= 2) {
                    if (typeof _qla != 'undefined') {
                        let errData = e.paramData || {};

                        typeof _qla != 'undefined' && _qla('event', {
                            category: 'videoPlay',
                            action:'failure',
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
            });

            this.videoPlayer.on('timeupdate', this.timeUpdate);

            this.videoPlayer.on('pause', () => {
                this.recordMediaReaded();
            });

            this.videoPlayer.on('waiting', () => {
                this.recordMediaReaded();
            });

            this.videoPlayer.on('dragstart', (e) => {
                this.data.isTouchMoveing = true;
                this.compliteCardPushFunc();
            });

            this.videoPlayer.on('dragmove', (e) => {
                if(this.data.isTouchMoveing){
                    e.preventDefault();
                    e.stopPropagation();

                };
            });

            this.videoPlayer.on('dragend', () => {
                if(this.data.isTouchMoveing){
                    //拖动结束后，缓存推送成就卡的完播率累计时长
                    this.setState({
                        curstartTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
                        curendTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
                    });
                    this.compliteCardPushFunc();

                }
                this.data.isTouchMoveing  = false;
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
        }



        //初始化成就卡累计完播量
        if(!this.props.power.allowSpeak&&
            this.props.compliteStatus.status!="Y"&&
            this.props.compliteStatus.status!="C"
            ){
                this.setState({
                    curstartTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
                    curendTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
                });
                let listenRecordNums = {};
            let listenTimeLong = 0;
            if (localStorage.getItem(`listenRecordNum_audio_${this.props.userId}`)) {
                listenRecordNums = JSON.parse(localStorage[`listenRecordNum_audio_${this.props.userId}`]);
            };

            // 先删除再插入，保证插入时间排序正常
            if(listenRecordNums[`${this.props.topicInfo.id}`]){
                listenTimeLong = listenRecordNums[this.props.topicInfo.id];
                delete listenRecordNums[`${this.props.topicInfo.id}`];
            }

            listenRecordNums[this.props.topicInfo.id] = listenTimeLong;
            localStorage.setItem(`listenRecordNum_audio_${this.props.userId}`,JSON.stringify(listenRecordNums));

            // 最多保留9个话题记录;
            if(Object.keys(listenRecordNums).length > 9){
                let DeleteFirst = true;
                for (let key of Object.keys(listenRecordNums)) {
                    if(DeleteFirst){
                        delete listenRecordNums[key];
                        DeleteFirst = false;
                        break;
                    }
                }
            }
            if(Number(listenTimeLong)/Number(this.props.topicInfo.duration)>=0.5){
                this.setState({
                    isComplite:true,
                });
                console.log("push*********************");
                this.props.pushCompliteFun();
            }
        }

        // 如果之前已经推送过成就卡，则显示浮层按钮
        if (this.props.compliteStatus.status) {
            this.props.getArchivementCardBtn();
        }

    }


    timeUpdate(e) {
        this.timeUpdateHandle();
        this.updateMediaReaded();
    }

    timeUpdateHandle() {
        // 开始播放时，重置视频过期次数限制
        this.data.videoExpireReloadTimes = 0;

        if (this.state.liveStatus !== 'beginning' && this.state.liveStatus !== 'plan') {
            this.seekToHistoryTime();
        }
        this.updateVideoPlayHistory();

        if(!this.data.isTouchMoveing){
            this.setState({
                curendTimeStamp: this.videoPlayer && this.videoPlayer.currentTime,
            });
        }

        updatePercentageComplete({
            topicId: this.props.topicInfo.id,
            finished: this.videoPlayer ? this.videoPlayer.currentTime : 0,
            total: (this.videoPlayer && this.videoPlayer.duration) || this.props.topicInfo.duration,
        });
        // 学分任务达成触发点
        updateLearningTime({
            topicId: this.props.topicInfo.id,
            playStatus: 'playing',
            currentTime: this.videoPlayer ? this.videoPlayer.currentTime : 0
        })

        this.compliteCardPushFunc();
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
        let time = 3000 || this.data.waitToTime;
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


        // 新完播率
        typeof _qla != 'undefined' && _qla('commonlog', {
            logType:'event',
            category: 'mediaPlayCompletion',
            topicId:this.props.topicInfo.id,
            second:second,
            duration: (Date.now() - this.data.startLogTime) / 1000,
        });
    }


    videoEnded(e) {
        this.handleVideoEnd();
        this.clearVideoPlayHistory();

        // 播放结束默认要提交一条记录
        this.recordMediaReaded(this.videoPlayer.duration);
        updatePercentageComplete({
            topicId: this.props.topicInfo.id,
            rate: 1
        });
        updateLearningTime({
            topicId: this.props.topicInfo.id,
            currentTime: (this.videoPlayer && this.videoPlayer.duration) || this.props.topicInfo.duration
        })
    }

    compliteCardPushFunc(){
        if(!this.props.power.allowSpeak&&
            this.props.compliteStatus.status!=="Y"&&
            this.props.compliteStatus.status!=="C"&&
            !this.state.isComplite){
            //let listenTimeLong = Math.floor(this.state.curendTimeStamp - this.state.curstartTimeStamp);
            let listenTimeLong = this.state.curendTimeStamp - this.state.curstartTimeStamp;
            let listenRecordNums = {};
            if (localStorage.getItem(`listenRecordNum_audio_${this.props.userId}`)) {
                listenRecordNums = JSON.parse(localStorage[`listenRecordNum_audio_${this.props.userId}`]);
            };
            if(listenRecordNums[this.props.topicInfo.id]){
                listenTimeLong += Number(listenRecordNums[this.props.topicInfo.id]);
            }
            listenRecordNums[this.props.topicInfo.id] = listenTimeLong;
            this.setState({
                curstartTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
                curendTimeStamp:this.videoPlayer && this.videoPlayer.currentTime,
            });

            if((Number(listenTimeLong)/Number(this.state.duration)) >= 0.5){
                this.setState({
                    isComplite:true,
                });
                console.log("push*********************");
                this.props.pushCompliteFun();
                this.props.getArchivementCardBtn();
            }
            localStorage.setItem(`listenRecordNum_audio_${this.props.userId}`,JSON.stringify(listenRecordNums));
        }
        // 音频播放完毕，而且播放时长大于50%，弹出成就卡模态窗
        if (this.state.playStatus === 'ended' && this.state.isComplite && !this.data.popCardModal) {
            this.props.getArchivementCardModal(this.videoPlayer);
            // 确保成就卡模态窗只会弹出一次
            this.data.popCardModal = true;
        }
    };

    // initVideoX5Attributes () {
    //     let videos = document.getElementsByTagName('video');
    //     let video = videos && videos.length && videos[0];

    //     if (video) {
    //         video.setAttribute('x5-video-player-type', 'h5');
    //         video.style["object-position"]= "50% 50%";
    //     }
    // }

    @throttle(3000)
    updateVideoPlayHistory() {
        if (this.alreadySeeked) {
            const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {}
            const currentTime = this.videoPlayer && this.videoPlayer.currentTime;
            if( currentTime > 0 && (currentTime < this.state.duration)) {
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
        if(!this.alreadySeeked) {
            console.log('seeking.....');
            const videoPlayHistory = JSON.parse(localStorage.getItem('videoPlayHistory')) || {}
            const lastTime = videoPlayHistory[`${this.props.topicInfo.id}`]?.currentTime || 0;
            // this.videoPlayer.seek( lastTime ? lastTime : 0);
            let videos = document.getElementsByTagName('video');
            let video = videos && videos.length && videos[0];
            if (video && lastTime) {
                video.currentTime = lastTime;
                console.log('seekTo:', lastTime, video.currentTime);
            }

            console.log(`lastTime: ${lastTime}` , `currentTime ${video.currentTime}`)
            // 判断播放进度是否跳转成功
            if (!lastTime || video.currentTime >= lastTime) {
                this.alreadySeeked = true;
            }
        }
    }


    render() {
        return (
            <div className="video-wrap" ref="videoWrap">
                {
                    this.state.liveStatus === 'plan'? (
                        <div className="cover-wrap">
                            <img id="bg-img" crossOrigin="" className="bg-img" src={`${imgUrlFormat(this.props.topicInfo.backgroundUrl,'?x-oss-process=image/resize,h_420,w_750,m_fill')}`} />
                            <CountDown second={this.getLeftSeconds()} onFinish={this.handleCountDownFinish}/>
                        </div>
                    ):(
                        this.state.liveStatus === 'complete'? (
                            <div className="cover-wrap">
                                <img id="bg-img" crossOrigin="" className="bg-img" src={`${imgUrlFormat(this.props.topicInfo.backgroundUrl,'?x-oss-process=image/resize,h_420,w_750,m_fill')}`} />
                                <div className="tip-wrap">
                                    <div className="tip">互 动 时 间</div>
                                    <div className="audio-replay-btn" onClick={this.handleReplayBtnClick}>
                                        <div className="re-play-icon"></div>
                                        <div>点击回看</div>
                                    </div>
                                </div>
                            </div>
                        ): (
                            null
                        )
                    )

                }
                {
                    this.state.liveStatus != 'plan' &&
                    <CanvasVideoPlayer poster={imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750,m_fill,limit_0')} src={this.state.videoSourceUrl} duration={this.state.duration} ref="videoPlayer" />
                }
            </div>
        )
    }
}

Video.propTypes = {
    topicInfo: PropTypes.object,
};

export default Video;
