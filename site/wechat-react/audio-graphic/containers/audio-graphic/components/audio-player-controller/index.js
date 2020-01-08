import React, { Component } from 'react';
import { AudioPlayer } from 'components/audio-player';
import { findDOMNode } from 'react-dom';
import { autobind, throttle } from 'core-decorators';
import Detect from 'components/detect';
import { 
    locationTo, 
    getAudioTimeShow, 
    updatePercentageComplete, 
    updateLearningTime,
} from 'components/util';

// 语音速度档次
const AUDIO_SPEED_RATE_MAP = [0.7, 1, 1.2, 1.5, 2];

@autobind
class AudioPlayerController extends Component {

    state = {
        // 音频时长
        duration :0,
        // 播放秒数
        currentTime:0,
        // 播放状态
        playStatus: 'pause',
        // 显示加载
        showLoading:false,

        //推送成就卡统计累计播放量
        curstartTimeStamp:0,
        curendTimeStamp:0,
        isComplite:false,
	    // 播放速度
	    audioSpeedRate: 1,
	    // 倍速按钮反馈动画
	    audioSpeedBtnAct: false,
    }
    
    data = {
        canPause:false,
        // 是否已经弹出过成就卡模态窗
        popCardModal: !!this.props.compliteStatus.status,
        startLogTime: 0,
    }

    componentDidMount(){
        // 播放器初始化
        this.initAudio();
        this.initProgressBtnTouch();
    }

    /**
     * 播放器初始化监听
     *
     *
     * @memberOf ThousandLive
     */
    async initAudio(){
        this.audioPlayer = new AudioPlayer();

        this.audioPlayer.on('timeupdate',this.audioTimeupdate);
        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);
        this.audioPlayer.on('canplaythrough',this.audioCanplayThrough);
        this.audioPlayer.on('waiting', this.audioWaiting);

        // 已购买或者免费试听可播放音频
        if (this.props.isAuth || this.props.topicInfo.isAuditionOpen == 'Y') {
            let mediaResut = await this.props.fetchMediaUrl(this.props.topicId, this.props.topicInfo.sourceTopicId);
        
            this.initAudioStatus(mediaResut);
        }

        //成就卡推送初始化
        if(!this.props.power.allowSpeak&&
            this.props.compliteStatus.status!="Y"&&
            this.props.compliteStatus.status!="C"){
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
    
    initAudioStatus(mediaResut){
        if(mediaResut.state.code != 0 ){
            return false;
        }

        this.setState({
            duration : mediaResut.data.audio.duration,
            playStatus:'playing',
            url: mediaResut.data.audio.playUrl,
            showLoading: true,
            curstartTimeStamp:this.audioPlayer.currentTime,
            curendTimeStamp:this.audioPlayer.currentTime,
        })
        // 开始播放，隐藏分享按钮
        this.props.toogleShareTagShow(false);
        
        this.data.canPause = false;
        setTimeout(() => {
            this.data.canPause = true;  
        }, 2000);
        
        // 完播率提交间隔
        this.data.waitToTime = (this.state.duration > 300 ? this.state.duration / 100 : 3) * 1000;
        this.audioPlayer.play(mediaResut.data.audio.playUrl);
    }

    audioTimeupdate(e) {
        this.timeUpdateHandle();
        this.updateMediaReaded();
    }
    
    // 时间更新默认处理
    @throttle(100)
    timeUpdateHandle() {
        let currentTime = this.audioPlayer.currentTime;
        this.setState({
            currentTime:currentTime,
            duration:this.audioPlayer.duration,
        })
        if (!this.dragingFlag && this.state.playStatus ==="playing") {
            this.setState({
                progressPercent: this.state.duration && (this.state.currentTime / this.state.duration * 100) || 0,
                curendTimeStamp: currentTime,
            }, () => {
                updatePercentageComplete({
                    topicId: this.props.topicId,
                    rate: this.state.progressPercent / 100
                });
                
                // 学分任务达成触发点
                updateLearningTime({
                    topicId: this.props.topicId,
                    playStatus: 'playing',
                    currentTime
                })
            });
        }
        this.updateAudioPlayHistory();
        // this.compliteCardPushFunc();
        
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
        let time = 3000|| this.data.waitToTime ;
        this.data.logTimer = setTimeout(() => {
            this.data.waitToUp = false;
        }, time);
        this.recordMediaReaded();
        this.data.startLogTime = Date.now();
    }

     /**
     * 完播率统计
     * @param {any} [second=this.audioPlayer.currentTime] 
     * @memberof AudioPlayerController
     */
    recordMediaReaded(second = this.audioPlayer.currentTime) {
        if (!second || typeof(second) != 'number') {
            return false;
        }
        // 最新完播率统计
        typeof _qla != 'undefined' && _qla('commonlog', {
            logType: 'event',
            category: 'mediaPlayCompletion',
            topicId: this.props.topicId,
            second: second,
            duration: (Date.now() - this.data.startLogTime) / 1000,
        });
    }

    audioWaiting() {
        console.log('waiting');
        this.recordMediaReaded();
    }

    audioCanplayThrough(e){
        console.log('canplaythrough');
        this.setState({
            showLoading: false
        });
    }

    /**
     * 记录上次播放位置
     * 
     * @memberof AudioPlayerController
     */
    @throttle(3000)
    updateAudioPlayHistory() {
        const audioPlayHistory = JSON.parse(localStorage.getItem('audioGraphicPlayHistory')) || {};

        if (this.audioPlayer.currentTime > 10) {
            // 先删除再插入，保证插入时间排序正常
            if (audioPlayHistory[`${this.props.topicInfo.id}`]) {
                delete audioPlayHistory[`${this.props.topicInfo.id}`];
            }
            audioPlayHistory[`${this.props.topicInfo.id}`] = this.audioPlayer.currentTime;
            // 最多保留3个话题记录;
            if(Object.keys(audioPlayHistory).length > 3){
                let DeleteFirst = true; 
                for (let key of Object.keys(audioPlayHistory)) {
                    if(DeleteFirst){
                        delete audioPlayHistory[key];
                        DeleteFirst = false;
                        break;
                    }
                }
            }
            localStorage.setItem('audioGraphicPlayHistory', JSON.stringify(audioPlayHistory));
        }
    }

    /**
     * 播放上次的位置
     * 
     * @memberof AudioPlayerController
     */
    seekToHistoryTime() {
        if(!this.alreadySeeked) {
            this.alreadySeeked = true;
            const audioPlayHistory = JSON.parse(localStorage.getItem('audioGraphicPlayHistory')) || {}
            const lastTime = audioPlayHistory[`${this.props.topicInfo.id}`];
            if (lastTime) {
                this.audioPlayer.currentTime = lastTime;
            }
        }
    }


    audioEnded(e){
        // //播放结束时，缓存推送成就卡的完播率累计时长
        // this.compliteCardPushFunc();
        this.setState({
            playStatus:'ended',
            progressPercent:0,
            currentTime:0,
        });

        this.audioPlayer.currentTime = 0;

        // 播放结束，显示分享按钮
        this.props.toogleShareTagShow(true);

        setTimeout(()=> {
            const audioPlayHistory = JSON.parse(localStorage.getItem('audioGraphicPlayHistory')) || {}
            audioPlayHistory[`${this.props.topicInfo.id}`] = 0;
            localStorage.setItem('audioGraphicPlayHistory', JSON.stringify(audioPlayHistory));
        }, 500);

        if (this.props.nextTopicId){
            this.props.showGotoNext();
        }
        

        // 播放结束默认要提交一条记录
        this.recordMediaReaded(this.audioPlayer.duration);

	    updatePercentageComplete({
		    topicId: this.props.topicId,
		    rate: 1
	    });
        updateLearningTime({
            topicId: this.props.topicId,
            currentTime: this.state.duration
        });
    }

    audioPause(e) {
        this.recordMediaReaded();
        if (!this.data.canPause) {
            return;
        }
    }

    audioPlaying(e) {
        console.log('playing');

        this.data.startLogTime = Date.now();
        this.data.waitToUp = true;
        let time = this.data.waitToTime || 3000;
        clearTimeout(this.data.logTimer);
        this.data.logTimer = setTimeout(() => {
            this.data.waitToUp = false;
        }, time);

        this.setState({
            playStatus: 'playing'
        });
        this.seekToHistoryTime();
    }

    // 播放按钮
    @throttle(1000)
    playAudio() {
        if (!this.props.isAuth) { 
            this.props.showPayTopic();
        }
        if(!this.state.url){
            return;
        }
        this.audioPlayer.resume();
        this.setState({
            playStatus: 'playing',
            curstartTimeStamp:this.audioPlayer.currentTime,
            curendTimeStamp:this.audioPlayer.currentTime,
        });

        // 开始播放，隐藏分享按钮
        this.props.toogleShareTagShow(false);

        // //缓存推送成就卡的完播率累计时长
        // this.compliteCardPushFunc();
    }
    // 暂停按钮
    @throttle(1000)
    pauseAudio() {
        this.setState({
            playStatus:'pause',
        })
        this.audioPlayer.pause();

        // 暂停播放, 显示分享按钮
        this.props.toogleShareTagShow(true);
    }


    // 初始化播放进度条拖动事件
    initProgressBtnTouch() {
        let progressBtnDom = findDOMNode(this.refs.progressBtn);
        let startx = 0;
        // 标识是否处于音频进度拖动状态
        this.dragingFlag = false;

        const startFn = (e) => {
            this.dragingFlag = true;
            let touch;
            if (e.touches) {
              touch = e.touches[0];
            } else {
              touch = e;
            }
            startx = touch.clientX;

            // 记录touhc开始时的播放时长（用于计算拖动位置定位）
            this.moveStartCurrentTime = this.state.currentTime;
            // //拖动前，缓存推送成就卡的完播率累计时长
            // this.compliteCardPushFunc();
        };

        const moveFn = (e) => {
            let touch;
            if (e.touches) {
              touch = e.touches[0];
            } else {
              touch = e;
            }

            let diff = touch.clientX - startx;

            if(this.dragingFlag){
                e.preventDefault();
                e.stopPropagation();
            }

            if (this.dragingFlag) {
                this.seekToByX(touch.clientX, diff);
            }
        };

        const endFn = (e) => {
            if (this.dragingFlag) {
                e.preventDefault();
                e.stopPropagation();                
                
                this.seekToPlay(this.state.progressPercent);

                //缓存推送成就卡的完播率累计时长
                // this.compliteCardPushFunc();
            }

            this.dragingFlag = false;

            // this.delayHideAudioControlBar();
        };

        if (Detect.os.phone) {
            progressBtnDom.addEventListener('touchstart', startFn, false);
            document.addEventListener('touchmove', moveFn, false);
            document.addEventListener('touchend', endFn, false);
        } else {
            progressBtnDom.addEventListener('mousedown', startFn, false);
            document.addEventListener('mousemove', moveFn, false);
            document.addEventListener('mouseup', endFn, false);
        }
    }

    compliteCardPushFunc(){
        if(!this.props.power.allowSpeak&&
            this.props.compliteStatus.status!="Y"&&
            this.props.compliteStatus.status!="C"&&
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
                curstartTimeStamp:this.audioPlayer.currentTime,
                curendTimeStamp:this.audioPlayer.currentTime,
            });
            if(Number(listenTimeLong)/Number(this.state.duration)>=0.5){
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
            this.props.getArchivementCardModal();
            // 确保成就卡模态窗只会弹出一次
            this.data.popCardModal = true;
        }
    };

    // seek播放到具体dom位置
    seekToByX(cx, diff) {
        // if (!this.audio) {
        //     this.initAudioPlayer();
        // }

        let progressBarDom = findDOMNode(this.refs.progressBar);

        let width = progressBarDom.offsetWidth;
        // let leftDis = progressBarDom.getBoundingClientRect && progressBarDom.getBoundingClientRect().left || 0;
        // let percent = (cx - leftDis) / width * 100;

        let percent = ((this.moveStartCurrentTime || 0) / this.state.duration + diff / width) * 100;

        if (percent > 100) {
            percent = 100;
        }

        if (percent < 0) {
            percent = 0;
        }

        this.setState({
            progressPercent: percent
        });
    }

    // seek播放到具体百分比位置
    seekToPlay(percent) {
        let currentTime = parseInt(this.state.duration * percent / 100);
        this.audioPlayer.seek(currentTime);
        this.setState({
            currentTime: currentTime,
            curstartTimeStamp:this.audioPlayer.currentTime,
            curendTimeStamp:this.audioPlayer.currentTime,
        });
    }


	@throttle(1000)
	audioSpeedBtnClickHandle(){
		let index = AUDIO_SPEED_RATE_MAP.indexOf(this.state.audioSpeedRate) + 1;
		if(index >= AUDIO_SPEED_RATE_MAP.length){
			index = 0;
		}
		this.audioPlayer.playbackRate = AUDIO_SPEED_RATE_MAP[index];
		this.setState({
			audioSpeedRate: AUDIO_SPEED_RATE_MAP[index],
			audioSpeedBtnAct: true,
		}, _=> {
			setTimeout(_=> {
				this.setState({
					audioSpeedBtnAct: false
				})
			},500);
		})
	}

    render() {
        return (
            <div className='audio-player-controller'>
                

                <div className="control-bar">   
                    <span className="playing-bar" style={{width: `${this.state.progressPercent}%`}}></span>
                    <div className="main" ref = 'progressBar'>
                        <span 
                            className="slider" 
                            style={{left: `${this.state.progressPercent}%`}}
                            ref="progressBtn" 
                        ></span>
                    </div>
                </div>

                <div className="control-buttons">
                    <span className="current-time">{getAudioTimeShow(this.state.currentTime)}</span>
                    <span className="duration">{getAudioTimeShow(this.state.duration)}</span>
                    {
                        this.props.lastTopicId ?
                        <span className="btn-previous"
                            onClick={()=>{locationTo(`/topic/details-audio-graphic?topicId=${this.props.lastTopicId}`)}}
                        ></span>
                        :
                        <span className="btn-previous disable"></span>

                    }
                    {
                        this.state.playStatus != 'playing'?
                            <span className="btn-play" onClick={this.playAudio}></span>
                        :
                            <span className={`btn-pause ${this.state.showLoading?'loading':''}`} onClick={this.pauseAudio}>
                                <span className="btn-loading"> 
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
                                </span>           
                            </span>
                    }
                    {
                        this.props.nextTopicId ?
                        <span className="btn-next"
                            onClick={()=>{locationTo(`/topic/details-audio-graphic?topicId=${this.props.nextTopicId}${this.props.shareKey?"&shareKey="+this.props.shareKey:""}`)}}
                        ></span>
                        :
                        <span className="btn-next disable"></span>

                    }
                    {
                        this.props.channelInfo ?
                            <div className={`on-log course-list-btn`}
                                    onClick={this.props.showCourseListDialog}
                                    data-log-name="课程列表"
                                    data-log-region="audio-player-controller"
                                    data-log-pos="course-list-btn"
                            >听课列表</div>
                        :
                            <div className="course-list-btn course-list-btn-disabled">听课列表</div>

                    }
                    <div className={`audio-speed-btn on-log${this.state.audioSpeedBtnAct ? ' act' : ''}`}
                         onClick={this.audioSpeedBtnClickHandle}
                         data-log-name="语速变更"
                         data-log-region="audio-speed-btn"
                         data-log-pos="audio-speed-btn"
                    >
                        <div className="rate">{this.state.audioSpeedRate % 1 === 0 ? `${this.state.audioSpeedRate}.0` : this.state.audioSpeedRate}x</div>
                        倍速播放
                    </div>
                </div>
            </div>
        );
    }
}

AudioPlayerController.propTypes = {

};

export default AudioPlayerController;