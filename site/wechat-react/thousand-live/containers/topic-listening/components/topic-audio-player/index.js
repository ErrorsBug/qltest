import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AudioPlayer } from 'components/audio-player';
import {
	getAudioTimeShow,
	getCookie,
	setCookie,
	locationTo,
    updatePercentageComplete,
    updateLearningTime,
} from 'components/util';
import { autobind, throttle } from 'core-decorators';
import Detect from 'components/detect';
import { findDOMNode } from 'react-dom';
import { getVal } from '../../../../../components/util';

// 语音速度档次
const AUDIO_SPEED_RATE_MAP = [0.7, 1, 1.2, 1.5, 2];

@autobind
class TopicAudioPlayer extends Component {
    state = {
        speakList: [],
        // 前面累计音频时长
        preDuration:0,
        // 音频时长
        duration :0,
        // 播放秒数
        currentTime:0,
        // 播放状态
        playStatus: 'pause',
        // 显示加载
        showLoading: false,
        // 正在播放中id
        audioMsgId: '',
        // 播放中的url
        audioUrl:'',
        // 播放速度
        audioSpeedRate: 1,
	    // 倍速按钮反馈动画
        audioSpeedBtnAct: false,
        // 标记已经init好了
        hasInit: false,
    }

    data = {
        startLogTime: 0,
    }

    async componentDidMount() {
        this.initAudio();

        if (/audio/.test(this.props.topicInfo.style)) {
            await this.initAudioTopicSource();
        } else {
            await this.initTotalSpeakList();
        }

        this.initAutoPlay();
    }

    updateState(state) {
        return new Promise(resolve => {
            this.setState(state, resolve);
        });
    }

    async initTotalSpeakList() {
        let result = await this.props.fetchTotalSpeakList({ type: 'audio', topicId: this.props.topicId });
        if (result.state && result.state.code == 0) {
            let duration = result.data.speakList.reduce((pre, cur, index) => {
                return pre + (cur.second ||0)
            }, 0)

            await this.updateState({
                speakList:result.data.speakList,
                duration
            });
        }

    }

    async initAudioTopicSource() {
        let mediaResut = await this.props.fetchMediaUrl(this.props.topicInfo.id, this.props.topicInfo.sourceTopicId);

        if (getVal(mediaResut, 'state.code') === 0) {
            await this.updateState({
                speakList: [{
                    id: 0,
                    content: getVal(mediaResut, 'data.audio.playUrl', ''),
                    second: getVal(mediaResut, 'data.audio.duration', 0),
                }],
                duration: getVal(mediaResut, 'data.audio.duration', 0)
            });

            let duration = getVal(mediaResut, 'data.audio.duration', 0);
            // 完播率提交间隔
            this.data.waitToTime = (duration > 300 ? duration / 100 : 3) * 1000;
            
        }
    }

    initAutoPlay() {

        if(!this.state.speakList.length){
            return;
        }
        this.initProgressBtnTouch();

        try {
            let lastVisit = {};
            if ( localStorage.getItem('localLastVisit')) {
                lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
            };
            let seekTime = this.props.sysTime - this.props.topicInfo.startTime;

            if (this.isLiving) {
                this.audioPlayer.seek(seekTime);

                this.doPlayMsg(this.state.speakList[0].id);
                this.setState({hasInit: true});

            }else if (lastVisit[this.props.topicId]) {
                let getLastId = lastVisit[this.props.topicId].speakId;
                let speakMsg = this.state.speakList.filter(item => item.id == getLastId);
                if(speakMsg.length){
                    this.doPlayMsg(speakMsg[0].id);
                    if (lastVisit[this.props.topicId].currentTime && lastVisit[this.props.topicId].currentTime < speakMsg[0].second) {
                        setTimeout(() => {
                            this.audioPlayer.seek(lastVisit[this.props.topicId].currentTime);
                            this.setState({hasInit: true});
                        },500)
                    } else {
                        this.setState({hasInit: true});
                    }

                } else {
                    this.doPlayMsg(this.state.speakList[0].id);
                    this.setState({hasInit: true});
                }

            } else {
                this.doPlayMsg(this.state.speakList[0].id);
                this.setState({hasInit: true});
            }


        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 统一播放音频方法
     *
     * @param {any} src
     *
     * @memberof ThousandLive
     */
    doPlayMsg(id) {
        let audioIndex = this.state.speakList.findIndex((item, index, arr) => {
            return item.id == id;
        });

        if (audioIndex < 0) {
            return;
        }

        let audioMsg = this.state.speakList[audioIndex];
        let src = audioMsg.content;

        try {
            this.audioPlayer.pause();
        } catch (error) {
            console.log(error);
        }


        this.audioPlayer.volume = 1;

        // 计算音频累计时长
        let prevAudioSecond = 0
        this.state.speakList.find((item, index) => {
            if (index >= audioIndex) {
                return true
            }
            prevAudioSecond += item.second
            return false
        })

        this.setState({
            audioUrl:src,
            playStatus:'play',
            audioLoading : true,
            audioMsgId: id,
            preDuration:prevAudioSecond,
        }, () => {
            this.rememberImReaded();
            this.rememberLastVisit();
        });

        if (audioMsg.fileId) {
            this.props.scrollToImg(audioMsg.fileId);
        }

        this.audioPlayer.play(src);
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
        this.audioPlayer.on('waiting', this.audioWaiting);
        // this.audioPlayer.on('canplay',this.audioCanplay);

    }
        
    audioTimeupdate(e) {
        this.audioTimeupdateHandle();
        // 记录完播率
        this.updateMediaReaded();
    }

    // 音频播放基本处理
    @throttle(500)
    audioTimeupdateHandle() {
        let currentTime = this.audioPlayer.currentTime;
        this.setState({
            currentTime:currentTime||0,
        })
        if (!this.dragingFlag && this.state.playStatus ==="playing") {
            this.setState({
                progressPercent: this.state.duration && ((this.state.currentTime + this.state.preDuration) / this.state.duration * 100) || 0,
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
        if (currentTime) {
            this.updateLastVisit();
        }
        this.state.hasInit && this.props.onTimeUpdate && this.props.onTimeUpdate(this.state.currentTime + this.state.preDuration);
    }


    // 更新最后播放记录
    @throttle(2000)
    updateLastVisit() {
        this.rememberLastVisit();
    }

    async audioEnded(e){
        this.rememberImReaded(true);
	    updatePercentageComplete({
		    topicId: this.props.topicId,
		    rate: 1
	    });
        updateLearningTime({
            topicId: this.props.topicId,
            currentTime: this.state.duration || 0
        })

        if (this.props.isLogin) {
            // 记录完播率
            this.recordMediaReaded();
        }

        let nextAudioMsg = this.nextAudio();



        if (nextAudioMsg){
            this.doPlayMsg(nextAudioMsg.id);
        } else {
            this.props.onEnded && this.props.onEnded();

            this.audioPlayer.currentTime = 0;
            this.setState({
                currentTime: 0,
                preDuration:0
            }, () => {
                this.updateLastVisit();
                setTimeout(() => {
                    this.setState({
                        currentTime: 0,
                        playStatus:'ready',
                        showLoading:false,
                        audioUrl:'',
                        audioMsgId: '',
                        progressPercent:0,
                        preDuration:0
                    }, () => {
                        this.props.gotoNextCourse && this.props.gotoNextCourse();
                    })
                },2000);
            })

        }
    }

    audioPause(e){
        this.recordMediaReaded();
        this.rememberImReaded(false);
        if(this.audioPlayer.currentTime < this.audioPlayer.duration){
            this.props.onPause && this.props.onPause();
        }
    }

    audioPlaying(e){
        this.setState({
            playStatus: 'playing',
            showLoading : false,
        })

        let nextAudioMsg = this.nextAudio();
        if (nextAudioMsg) {
            this.audioPlayer.preLoad(nextAudioMsg.content)  //预加载
        }

        this.props.onPlaying && this.props.onPlaying();

        this.data.startLogTime = Date.now();
        this.data.waitToUp = true;
        let time = 3000 || this.data.waitToTime;
        clearTimeout(this.data.logTimer);
        this.data.logTimer = setTimeout(() => {
            this.data.waitToUp = false;
        }, time);
    }

    audioCanplay(e){
        this.setState({
            showLoading: false
        });
    }

    audioWaiting() {
        this.recordMediaReaded();
    }

    /**
     * 获取下一条音频
     *
     * @readonly
     *
     * @memberof ThousandLive
     */
    nextAudio(){
        let nextAudioMsg;
        let audioIndex = this.state.speakList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        // 如果找不到，audioIndex是为-1，就会又从第一条音频开始播放
        if(audioIndex < 0){
            return false
        }
        
        audioIndex++;
        
        if (audioIndex < this.state.speakList.length) {
            nextAudioMsg = this.state.speakList[audioIndex];
        }else{
            nextAudioMsg = false;
        }

        return nextAudioMsg;
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
     * 音频互动、音频图文话题  完播率统计
     * @param {any} [second=this.audioPlayer.currentTime] 
     * @memberof AudioPlayerController
     */
    recordMediaReaded(second = this.audioPlayer.currentTime) {
        if (!second || typeof(second) != 'number') {
            return false;
        }
        if (this.state.audioMsgId && /normal|ppt/.test(this.props.topicInfo.style)) {
            // @comment temporarily
            // 普通类型话题完播率统计
            typeof _qla != 'undefined' && _qla('commonlog', {
                logType:'event',
                category: 'mediaPlayCompletion',
                business_id: this.state.audioMsgId,
                topicId: this.props.topicId,
                second: second,
                duration: (Date.now() - this.data.startLogTime) / 1000,
            });
        } else {
            // 音频图文和音频互动完播率统计
            typeof _qla != 'undefined' && _qla('commonlog', {
                logType: 'event',
                category: 'mediaPlayCompletion',
                topicId: this.props.topicId,
                second: second,
                duration: (Date.now() - this.data.startLogTime) / 1000,
            });
        }
    }


    /**
     * 记录播放过音频
     *
     * @param {any} id
     *
     * @memberof ThousandLive
     */
    rememberImReaded(isRead = false){
        let audioIndex = this.state.speakList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        if (audioIndex < 0) {
            return false;
        }

        let audioMsg = this.state.speakList[audioIndex];

        let recordReaded = {};

        if ( localStorage.getItem('recordReaded') ) {
            recordReaded = JSON.parse(localStorage['recordReaded']);
        };


		if ( !recordReaded[audioMsg.id] ) {
			recordReaded[audioMsg.id] = new Date().getTime();
			localStorage.setItem('recordReaded',JSON.stringify(recordReaded));
		} else if (isRead) {
            recordReaded[audioMsg.id] = new Date().getTime() + 'readed';
			localStorage.setItem('recordReaded',JSON.stringify(recordReaded));
        }
	};

    /**
     * 记录最后播放的音频
     * 这里使用cookie是因为服务端渲染拿不到localstorage
     * @param {any} id
     *
     * @memberof ThousandLive
     */
    async rememberLastVisit() {
        let audioIndex = this.state.speakList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        if (audioIndex < 0) {
            return false;
        }

        let audioMsg = this.state.speakList[audioIndex];


        let lastVisit = {};
        let tempVisit = {};
        if ( localStorage.getItem('localLastVisit')) {
            lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
        };

        tempVisit['visitTime'] = Date.now();
        tempVisit['speakTime'] = audioMsg.createTime;
        tempVisit['speakId'] = audioMsg.id;
        tempVisit['currentTime'] = this.state.currentTime;
        tempVisit['duration'] = this.state.duration 
        lastVisit[this.props.topicId] = tempVisit;

        //最多保留100个
        let lastVisitArr = Object.entries(lastVisit);
        lastVisitArr = lastVisitArr.sort((a, b) => {
            let rev = -1;
            a = a[1]['visitTime'];
            b = b[1]['visitTime'];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        
        })
        if (lastVisitArr.length > 100) {
            let key = lastVisitArr[lastVisitArr.length - 1][0];
            delete lastVisit[key]
        }


        localStorage.setItem('localLastVisit', JSON.stringify(lastVisit))
	};



    // 播放按钮
    @throttle(1000)
    resumeAudio() {
        if (!this.state.speakList.length) {
            window.toast('暂无音频')
            return false;
        }

        if (this.state.audioUrl) {
            this.audioPlayer.resume();
            this.setState({
                playStatus: 'playing',
            });
        } else {
            this.doPlayMsg(this.state.speakList[0].id);
        }

    }

     // 暂停按钮
     @throttle(1000)
     pauseAudio() {
         this.setState({
             playStatus:'pause',
         })
         this.audioPlayer.pause();
     }


    // 初始化播放进度条拖动事件
    initProgressBtnTouch() {
        let progressBtnDom = findDOMNode(this.refs.progressBtn);
        if (!progressBtnDom) {
            return false;
        }
        //记录开始拖动的位置
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

            // 记录touch开始时的播放时长（用于计算拖动位置定位）
            this.moveStartCurrentTime = this.state.currentTime + this.state.preDuration;

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

            }

            this.dragingFlag = false;

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

    // seek播放到具体dom位置
    seekToByX(cx, diff) {

        let progressBarDom = findDOMNode(this.refs.progressBar);

        let width = progressBarDom.offsetWidth;

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
        console.log('curtime', currentTime);

        let prevAudioSecond = 0;
        let curId = '';
        this.state.speakList.find((item, index) => {
            if (prevAudioSecond + item.second > currentTime) {
                curId = item.id;
                return true
            }
            prevAudioSecond += item.second
            return false
        })
        if (curId == this.state.audioMsgId) {
            this.audioPlayer.seek(currentTime - prevAudioSecond);

        } else {
            this.doPlayMsg(curId);
            this.audioPlayer.seek(currentTime - prevAudioSecond);
        }
        this.setState({
            currentTime: currentTime - prevAudioSecond,
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
        });
	}

	@throttle(1000)
	prevBtnClickHandle(){
		if(this.props.courseList.length){
			const courseIdList = this.props.courseList.map((c) => {
				return c.id
			});
			const currentIndex = courseIdList.indexOf(this.props.topicInfo.id);
			if(currentIndex > 0){
                const prevIndex = currentIndex - 1;
				const prevCourse = this.props.courseList[prevIndex];
				if(/video/.test(prevCourse.style)){
					locationTo(`/wechat/page/topic-simple-video?topicId=${prevCourse.id}`);
				}else{
					locationTo(`/topic/details-listening?topicId=${prevCourse.id}`);
				}
			}
		}
	}

	@throttle(1000)
	nextBtnClickHandle(){
		if(this.props.courseList.length){
			const courseIdList = this.props.courseList.map((c) => {
				return c.id
			});
			const currentIndex = courseIdList.indexOf(this.props.topicInfo.id);
			if(currentIndex < courseIdList.length - 1){
                const nextIndex = currentIndex + 1;
				const nextCourse = this.props.courseList[nextIndex];
				if(/video/.test(nextCourse.style)){
					locationTo(`/wechat/page/topic-simple-video?topicId=${nextCourse.id}`);
				}else{
					locationTo(`/topic/details-listening?topicId=${nextCourse.id}`);
				}
			}
		}
	}

    get isLiving() {
        return this.props.topicInfo.style == 'audio' &&
            this.props.topicInfo.status == 'beginning' &&
            this.props.sysTime < (this.props.topicInfo.startTime + this.state.duration)
    }

    render() {
        return (
            <div className='listening-page-audio-player'>
                {/* <div className="audio-speed-wrap">
                    <div className={`audio-speed-btn on-log${this.state.audioSpeedBtnAct ? ' act' : ''}`}
                         onClick={this.audioSpeedBtnClickHandle}
                         data-log-name="语速变更"
                         data-log-region="audio-speed-btn"
                         data-log-pos="audio-speed-btn"
                    >倍速:{this.state.audioSpeedRate % 1 === 0 ? `${this.state.audioSpeedRate}.0` : this.state.audioSpeedRate}x</div>
                </div> */}

                <div className="duration-time-container">
                    <div className="control-bar"  ref = 'progressBar' >
                        <span className="playing-bar" style={{ width: `${this.state.progressPercent}%` }}></span>
                        {
                            this.isLiving ?
                                null
                            :
                            <span
                                className="slider"
                                style={{left: `${this.state.progressPercent}%`}}
                                ref="progressBtn"
                            ></span>
                        }
                    </div>
                    <div className="time">
                        <div>{getAudioTimeShow(this.state.preDuration + this.state.currentTime)}</div>
                        <div>{getAudioTimeShow(this.state.duration)}</div>
                    </div>
                </div>

                <div className="button-container">
                    {
                        this.props.topicInfo.channelId ?
                            <span className={`on-log btn-course-list`}
                                onClick={this.props.showCourseListDialog}
                                data-log-name="课程列表"
                                data-log-region="topic-audio-player"
                                data-log-pos="btn-course-list"
                            >
                                <img src={ require('./img/icon-course-list.png') } />
                                { this.props.isListenBook ? '听书列表' : this.props.isNewsTopic ? "播放列表" : '听课列表' }
                            </span>
                        :
                            <span className="btn-course-list btn-course-list-disabled">
                                <img src={ require('./img/icon-course-list-disbaled.png') } />
                                { this.props.isListenBook ? '听书列表' : this.props.isNewsTopic ? "播放列表" : '听课列表' }
                            </span>
                    }
                    <div className="main">

                        <div className={`btn-previous${!this.props.courseList.length || this.props.topicInfo.id === this.props.courseList[0].id ? ' disable' : ' on-log'}`}
                             onClick={this.prevBtnClickHandle}
                             data-log-name="上一条"
                             data-log-region="topic-audio-player"
                             data-log-pos="btn-previous"
                        ></div>

                        {
                            this.state.playStatus != 'playing'?
                                <span className="btn-play on-log"
                                      onClick={this.resumeAudio}
                                      data-log-name="播放"
                                      data-log-region="topic-audio-player"
                                      data-log-pos="btn-play"
                                >
                                </span>
                            :
                                this.state.showLoading ?
                                <span className={`btn-loading`} onClick={this.pauseAudio}>
                                    <span className="main"> 
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
                                :
                                <span className="btn-pause on-log"
                                      onClick={this.pauseAudio}
                                      data-log-name="暂停"
                                      data-log-region="topic-audio-player"
                                      data-log-pos="btn-pause"
                                >
                                </span>
                        }

                        <div className={`btn-next${!this.props.courseList.length || this.props.topicInfo.id === this.props.courseList[this.props.courseList.length - 1].id ? ' disable' : ' on-log'}`}
                             onClick={this.nextBtnClickHandle}
                             data-log-name="下一条"
                             data-log-region="topic-audio-player"
                             data-log-pos="btn-next"
                        ></div>
                    </div>

                    <span className="btn-goto-class on-log"
                          onClick={ this.audioSpeedBtnClickHandle }
                          data-log-name="语速变更"
                          data-log-region="audio-speed-btn"
                         data-log-pos="audio-speed-btn"
                    >
                        {/* <img src={require('./img/icon-audio-speed.png')} /> */}
                        <span className="icon-audio-speed">
                            <span>
                                {this.state.audioSpeedRate % 1 === 0 ? `${this.state.audioSpeedRate}.0` : this.state.audioSpeedRate}
                            </span>
                        </span>
                        倍速
                    </span>




                </div>

            </div>
        );
    }
}

TopicAudioPlayer.propTypes = {

};

export default TopicAudioPlayer;