import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Detect from 'components/detect';
// import StackBlur from 'components/stack-blur';
import { 
    imgUrlFormat, 
    getAudioTimeShow,
    getCookie,
    setCookie, 
    updatePercentageComplete,
    updateLearningTime,
    sortBy
} from 'components/util';
import { getQlchatVersion } from 'components/envi';
import { autobind, throttle } from 'core-decorators';
import { AudioPlayer } from 'components/audio-player';
import { isPc } from 'components/envi';

// import CountDown from './count-down';

@autobind
class Audio extends Component {

    state = {

        // 直播状态（plan-未开始；beginning-进行中；review-回看状态；ended-已结束
        liveStatus: 'plan',

        // 播放进度条位置（%）
        progressPercent: 0,

        // 已播放时间
        currentTime: 0,

        // 是否加载完媒体信息
        loadedmetadata: false,

        // 音频总时间
        duration: 0,

        // 是否展示顶部...提示框
        showTipBox: false,
        // 是否展示收藏及分享按钮
        showTipButton: false,
        // 顶闻...提示框消息类型
        tipBoxType: '',
        // 是否显示音频播放控制拖动条
        showAudioDragControlBar: true,
        // // 音频控制条旋转度数
        // controlBgRotateDeg: 0,

        // 音频状态
        audioStatus: 'paused',

        //成就卡：计算累计播放量
        curstartTimeStamp:0,
        curendTimeStamp:0,
        isComplite:false,

        // 是否播放完毕
        playStatus: '',

        // 未开播倒计时
	    day: 0,
	    hours: 0,
	    minutes: 0,
	    second: 0,

    }

    data = {
        progressBarDomWidth: 0,
        // 是否已经弹出过成就卡模态窗
        popCardModal: !!this.props.compliteStatus.status,
        startLogTime: 0,
    }

    componentDidMount() {
        this.setState({
            liveStatus: this.getLiveStatus()
        }, () => {
            if (this.state.liveStatus !== 'plan') {
                this.initAudioPlayer();
	            this.initProgressBarDomWidth();
	            if(this.state.liveStatus !== 'beginning') this.initProgressBtnTouch();
            }else{
	            this.initCountDown();
            }

            this.delayHideAudioControlBar();

            this.autoShowTipButtion();

        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.volume != nextProps.volume) {
            if (this.audio) {
                this.audio.volume = nextProps.volume;
            }
        }
	    if(nextProps.interactiveAudioPlayStatus === 'play' && nextProps.interactiveAudioPlayStatus !== this.props.interactiveAudioPlayStatus){
		    this.handlePauseBtnClick();
	    }
    }

    autoShowTipButtion() {
        if (getQlchatVersion()) {
            this.setState({
                showTipButton: false
            });
        } else {
            this.setState({
                showTipButton: true
            });
        }
    }

    // 获取剩余秒数
    getLeftSeconds() {
        let { startTime } = this.props.topicInfo;
        // let sysTimeResult = await this.props.getSysTimeAction();

        // return parseInt(Number(startTime) - Number(sysTimeResult.data.sysTime) / 1000);

        let leftTime = parseInt((Number(startTime) - Number(this.props.sysTime)) / 1000);

        if (leftTime < 0) {
            leftTime = 0;
        }

        return leftTime;
    }

    // 倒计时结束处理方法
    handleCountDownFinish() {
        this.setState({
            liveStatus: 'beginning'
        }, () => {
	        this.initAudioPlayer();
	        this.initProgressBarDomWidth();
        });

    }

    // 音频暂停按钮点击处理
    handlePauseBtnClick() {
        this.audio && this.audio.pause();

        // this.stopRotateControlBg();
    }

    // 音频播放按钮点击处理
    async handlePlayBtnClick() {
        if (!this.audio) {
            this.initAudioPlayer();
        }

        this.startPlay();
    }

    // 改变播放速率
    changePlaybackRate(rate) {
        this.audio.playbackRate = rate || 1;
    }

    // 开始旋转播放控制背景
    // startRotateControlBg() {
    //     let controlBgRotateDeg;
    //     let step = (timestamp) => {
    //         if (!this.conrtolBgRotating) {
    //             return;
    //         }
    //         this.setState({
    //             controlBgRotateDeg: (this.state.controlBgRotateDeg + 0.25) % 360,
    //         });
    //
    //         requestAnimationFrame(step);
    //     }
    //
    //     this.conrtolBgRotating = true;
    //     requestAnimationFrame(step);
    // }

    // 停止旋转播放控制背景
    // stopRotateControlBg() {
    //     this.conrtolBgRotating = false;
    // }

    startPlay() {
        if(this.audio.__statu === 'PAUSE'){
            this.audio.resume()
        }else{
            this.audio.play(this.data.src);
        }

        //缓存推送成就卡的完播率累计时长
        this.setState({
            curstartTimeStamp:this.audio.currentTime,
            curendTimeStamp:this.audio.currentTime,
        });
        this.compliteCardPushFunc();

        // 停掉互动区的音频播放
        this.props.pauseInteractiveAudio && this.props.pauseInteractiveAudio();

        // this.startRotateControlBg();
    }

    // 音频回放按钮点击处理
    handleReplayBtnClick() {
        if (!this.audio) {
            this.initAudioPlayer();
        }

        this.setState({
            liveStatus: 'review',
        }, () => {
            if (!this.data.progressBarDomWidth) {
                let progressBarDom = typeof findDOMNode != 'undefined' && findDOMNode(this.refs.progressBar) || {};
                this.data.progressBarDomWidth = progressBarDom.offsetWidth || 0;
            }
            this.startPlay();
        });
    }

    // 音频播放完后的处理
    async handleAudioEnd() {
        //播放结束时，缓存推送成就卡的完播率累计时长
        // this.compliteCardPushFunc();

        // this.stopRotateControlBg();

        await this.updateLiveStatus();
        let sysTimeResult = await this.props.getSysTimeAction();
        // 如果没有下一条音频，则需要判断
        // 1.音频互动
        // 2.是否已经结束 或者开课时间大于2小时
        // 满足以上条件就跳转到下一节课程
        if (this.props.topicInfo.style === 'audio' &&
            (this.props.topicInfo.status === 'ended' || Number(sysTimeResult.data.sysTime) > (Number(this.props.topicInfo.startTime) + 7200000))
        ) {
            console.log('是时候跳转去下一节课了');
            this.props.gotoNextCourse && this.props.gotoNextCourse();
        }
    }

    handleFavarateBtnClick() {
        this.setState({
            showTipBox: true,
            tipBoxType: 'favarate',
        });

        this.tipBoxTimer && clearTimeout(this.tipBoxTimer);
        this.tipBoxTimer = setTimeout(() => {
            this.setState({
                showTipBox: false,
            });
        }, 5000);
    }

    handleAudioBoxClick() {
        // 显示中且不处于拖动状态时取消显示
        if (this.state.showAudioDragControlBar && !this.dragingFlag) {
            this.setState({
                showAudioDragControlBar: false,
            });
        // 示显示则显示
        } else if (!this.state.showAudioDragControlBar) {
            this.setState({
                showAudioDragControlBar: true,
            });
        }

        if (this.state.showAudioDragControlBar) {
            this.delayHideAudioControlBar();
        }
    }

    handleShareBtnClick() {
        this.setState({
            showTipBox: true,
            tipBoxType: 'share'
        });

        this.tipBoxTimer && clearTimeout(this.tipBoxTimer);
        this.tipBoxTimer = setTimeout(() => {
            this.setState({
                showTipBox: false,
            });
        }, 5000);
    }

    // 延时3秒稳藏控制条
    delayHideAudioControlBar() {
        this.audioControlBoxShowTimer && clearTimeout(this.audioControlBoxShowTimer);
        this.audioControlBoxShowTimer = setTimeout(() => {
            if (!this.dragingFlag) {
                this.setState({
                    showAudioDragControlBar: false,
                });
            }
        }, 3000);
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

        if (duration && (Number(sysTime) >= Number(startTime) + Number(duration) * 1000) &&
        (Number(sysTime) < Number(endTime))) {
            return 'review';
        }

        if (Number(sysTime) >= Number(endTime)) {
            return 'ended';
        }

        return 'beginning';

    }

    async updateLiveStatus() {
        let { endTime } = this.props.topicInfo;
        let sysTimeResult = await this.props.getSysTimeAction();

        // 判断是否到了结束时间
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

    }

    async isLivePlayEnd() {
        let { startTime, endTime } = this.props.topicInfo;
        let sysTimeResult = await this.props.getSysTimeAction();

        // 判断是否到了结束时间

        if ((Number(sysTimeResult.data.sysTime) >= Number(startTime) + Number(this.state.duration) * 1000) &&
        (Number(sysTimeResult.data.sysTime) < Number(endTime)) && this.state.liveStatus === 'beginning') {
            this.setState({
                liveStatus: 'review',
            });
        }
    }



    // 初始化音频播放器
    async initAudioPlayer() {
        // this.audio = findDOMNode(this.refs.audio);
        this.audio = new AudioPlayer();

        let mediaResut = await this.props.fetchMediaUrlAction(this.props.topicInfo.id, this.props.topicInfo.sourceTopicId);

        if (mediaResut.state.code != 0) {
            window.toast(mediaResut.state.msg);
            return;
        }
        this.data.src = mediaResut.data && mediaResut.data.audio.playUrl;
        console.log('audio player src:', mediaResut.data && mediaResut.data.audio.playUrl);

        let loadedFn = async (e) => {

            let time = this.audio.duration;

            if (this.hasDuration || !time) {
                return;
            }

            if (time) {
                this.hasDuration = true;
            }

            if (time) {
                this.setState({
                    duration: time,
                });

                if (this.state.liveStatus === 'beginning') {
                    await this.isLivePlayEnd();
                }

                this.setState({
                    loadedmetadata: true,
                });
                
                // 完播率提交间隔
                this.data.waitToTime = (this.state.duration > 300 ? this.state.duration / 100 : 3) * 1000;
            }
        };
        this.audio.on('durationchange', loadedFn, false);
        // this.audio.on("loadedmetadata", loadedFn, false);
        // this.audio.on('loadeddata', loadedFn, false);
        // this.audio.on('canplaythrough', loadedFn, false);
        // this.audio.on('playing', loadedFn, false);
        // this.audio.on('timeupdate', loadedFn, false);




        this.audio.on("timeupdate", this.audioTimeupdate, false);
        this.audio.on("ended", this.audioEnded);
        this.audio.on("play", this.audioPlay);
        this.audio.on("playing", e => {
            this.setState({
                audioStatus: 'playing',
            });
            this.data.startLogTime = Date.now();
            this.data.waitToUp = true;
            let time = 3000 || this.data.waitToTime;
            clearTimeout(this.data.logTimer);
            this.data.logTimer = setTimeout(() => {
                this.data.waitToUp = false;
            }, time);
        });
        this.audio.on('waiting', e => {
            this.setState({
                audioStatus: 'loading',
            });

            this.recordMediaReaded();
        });
        this.audio.on("pause",this.audioPause);
        this.audio.on("error", (e) => {
            console.error(e);
            this.recordMediaReaded();
        });


        // this.audio.load();
        this.autoPlayAudio();

        //初始化完成卡推送

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
            if(Number(listenTimeLong)/Number(this.props.topicInfo.duration)>=0.95){

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


    /**
     * 音频timeupdate监听处理
     *
     * @param {any} e
     * @memberof Audio
     */
    audioTimeupdate(e){
        let currentTime = this.audio.currentTime;
        this.setState({
            currentTime: currentTime,
        });

        if (!this.dragingFlag&& this.state.audioStatus === 'playing') {
            this.setState({
                progressPercent: this.state.duration && (this.state.currentTime / this.state.duration * 100) || 0,
                curendTimeStamp: currentTime,
            }, () => {
	            updatePercentageComplete({
		            topicId: this.props.topicInfo.id,
		            rate: this.state.progressPercent / 100
	            });
                // 学分任务达成触发点
                updateLearningTime({
		            topicId: this.props.topicInfo.id,
                    playStatus: 'playing',
                    currentTime
                })
            });
        }

        this.updateMediaReaded();
        this.updateAudioPlayHistory();

        this.compliteCardPushFunc();

    }

    /**
     * 音频结束监听处理
     *
     * @param {any} e
     * @memberof Audio
     */
    audioEnded(e){
        // 毕业证
        this.props.diplomaShow()
        this.audio.currentTime = 0;
        this.audio.pause();
        this.setState({
            currentTime: 0,
            progressPercent: 0,
            audioStatus: 'ended',
            playStatus: 'ended',
        });
        this.updateAudioPlayHistory(true)
        
        // 播放结束默认要提交一条记录
        this.recordMediaReaded(this.audio.duration);
	    updatePercentageComplete({
            topicId: this.props.topicInfo.id,
		    rate: 1
        });
        updateLearningTime({
            topicId: this.props.topicInfo.id,
            currentTime: this.state.duration || 0
        })
        this.handleAudioEnd();

    }

    audioPause() {
        this.setState({
            audioStatus: 'paused'
        });

        this.recordMediaReaded();
    }

    async audioPlay(e){
        // 添加缓存逻辑，第一次playing时seek到历史播放记录，ended历史记录清零，timeupdate时更新历史记录
        if (this.state.liveStatus !== 'plan' && this.state.liveStatus !== 'beginning'){
            this.seekToHistoryTime();
        }else if(this.state.liveStatus === 'beginning'){
            const currentTime = await this.getAudioCurrentTime();
            this.audio.currentTime = currentTime;
        }
    }

    seekToHistoryTime() {
        if(!this.alreadySeeked) {
            this.alreadySeeked = true;
            try {
                let lastVisit = {};
                if (localStorage.getItem('localLastVisit')) {
                    lastVisit =  JSON.parse(localStorage.getItem('localLastVisit'));
                }


                if (lastVisit[this.props.topicInfo.id]) {
                    let currentTime = lastVisit[this.props.topicInfo.id].currentTime;
                    if (this.props.topicInfo.duration && this.props.topicInfo.duration - currentTime < 2) {
                        return;
                    }

                    setTimeout(() => {
                        this.audio.currentTime = currentTime;
                    },500)
                    
                }
    
    
            } catch (err) {
                console.error(err);
            }
        }
    }


    // 更新音频播放历史
    @throttle(3000)
    updateAudioPlayHistory(delEnded=false) {
        if(!this.audio.currentTime || !this.alreadySeeked){
            return;
        }
        let audioMsg = {}
        let lastVisit = {};
        let tempVisit = {};
        if ( localStorage.getItem('localLastVisit')) {
            lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
        };
        tempVisit['visitTime'] = Date.now();
        tempVisit['currentTime'] = this.audio.currentTime;
        tempVisit['duration'] = this.state.duration || this.props.topicInfo.duration;
        lastVisit[this.props.topicInfo.id] = tempVisit;

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


        // 已经听完，删除记录
        if (delEnded) {
            delete lastVisit[this.props.topicInfo.id]
        }

        localStorage.setItem('localLastVisit',JSON.stringify(lastVisit))
        // 记录当前用户的收听时间
        this.props.saveSecondRecord()

    }

    // 更新直播播放位置（时间）
    async getAudioCurrentTime() {
        let sysTimeResult = await this.props.getSysTimeAction();
        let duration = this.state.duration || this.props.topicInfo.duration;
        let { startTime } = this.props.topicInfo;

        let playTime = parseInt((Number(sysTimeResult.data.sysTime) - Number(startTime)) / 1000);
        if (playTime > duration && duration) {
            playTime = 0;
        }

        return playTime;
    }

    // 自动播放处理逻辑
    autoPlayAudio() {
        if(isPc()){
            this.startPlay();
        } else if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
                this.startPlay();
            }, false);
        } else {
            document.addEventListener("WeixinJSBridgeReady", (e) => {
                WeixinJSBridge.invoke('getNetworkType', {}, (e1) => {
                    this.startPlay();
                });
            }, false);
        }

        // let musicInBrowserHandler = () => {
        //      this.handlePlayBtnClick();
        //      document.body.removeEventListener('touchstart', musicInBrowserHandler);
        // }
        // document.body.addEventListener('touchstart', musicInBrowserHandler);

        // this.audio.autoplay = true;

        //计算完播率，推送邀请卡
        // this.startPlay(currentTime);
    }

    // seek播放到具体百分比位置
    seekToPlay(percent) {
        let currentTime = parseInt(this.state.duration * percent / 100);
        this.audio.currentTime = currentTime;
        this.setState({
            currentTime: currentTime,
            curstartTimeStamp:this.audio.currentTime,
            curendTimeStamp:this.audio.currentTime,
        });
    }

    // seek播放到具体dom位置
    seekToByX(cx, diff) {
        if (!this.audio) {
            this.initAudioPlayer();
        }

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

    initProgressBarDomWidth() {
        let progressBarDom = typeof findDOMNode != 'undefined' && findDOMNode(this.refs.progressBar) || {};
        this.data.progressBarDomWidth = progressBarDom.offsetWidth || 0;
    }

    // 获取播放位置x坐标值
    getPosBtnXByProgressPercent(percent) {
        return percent * this.data.progressBarDomWidth / 100;
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

            //缓存推送成就卡的完播率累计时长
            this.compliteCardPushFunc();
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

            this.delayHideAudioControlBar();
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
                curstartTimeStamp:this.audio.currentTime,
                curendTimeStamp:this.audio.currentTime,
            });

            if(Number(listenTimeLong)/Number(this.state.duration)>=0.5){
                this.setState({
                    isComplite:true,
                });
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

    getTransformStyle(transitionX) {
        let transformPrefix = ['', 'Moz', 'Webkit', 'O'];
        let style = {
            // transform: `translate(${transitionX}px,0,0)`,
        };

        for (let i =0, len = transformPrefix.length; i < len; i++) {
            let transformKey = transformPrefix[i] + 'Transform';
            let transformValue = `translate3d(${transitionX}px,0,0)`;
            style[transformKey] = transformValue;
        }

        return style;
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
     * @param {any} [second=this.audio.currentTime]
     * @memberof AudioPlayerController
     */
    recordMediaReaded(second = this.audio.currentTime) {
        if (!second || second < 2) {
            return false;
        }


        // 新完播率
        typeof _qla != 'undefined' && _qla('commonlog', {
            logType:'event',
            category: 'mediaPlayCompletion',
            topicId: this.props.topicInfo.id,
            second: second,
            duration: (Date.now() - this.data.startLogTime) / 1000,
        });
    }


	initCountDown(){
        let leftSecond = this.getLeftSeconds();

		this.setState({
			day: ~~(leftSecond / (3600 * 24)),
			hours: ~~(leftSecond % (3600 * 24) / 3600),
			minutes:  ~~(leftSecond % 3600 / 60),
			second: leftSecond % 60,
		});

        const countDownTimer = window.setInterval(_=> {
            if(leftSecond <= 0){
                clearInterval(countDownTimer);
                this.handleCountDownFinish();
                return false;
            }
	        leftSecond--;
	        this.setState({
		        day: ~~(leftSecond / (3600 * 24)),
		        hours: ~~(leftSecond % (3600 * 24) / 3600),
		        minutes:  ~~(leftSecond % 3600 / 60),
		        second: leftSecond % 60,
	        });
        }, 1000);

    }

    render() {
        return (
            <div className="audio2-wrap">
                <div className="poster">
                    <div className="content"
                         style={{
		                     backgroundImage: `url(${imgUrlFormat(this.props.topicInfo.backgroundUrl,'?x-oss-process=image/resize,h_420,w_750,m_fill')})`
	                     }}
                    >
                        {
                            this.state.liveStatus !== 'plan' &&
                            (
                                do {
                                    if(this.state.audioStatus === 'playing'){
                                        <div className={`control-btn on-log pause-btn`}
                                             onClick={this.handlePauseBtnClick}
                                             data-log-name="播放按钮"
                                             data-log-region="media-audio"
                                             data-log-pos="pause-btn"
                                        ></div>
                                    }else if(this.state.audioStatus === 'loading'){
                                        <div className={`control-btn on-log loading-icon`}
                                             onClick={this.handlePauseBtnClick}
                                             data-log-name="播放按钮"
                                             data-log-region="media-audio"
                                             data-log-pos="pause-btn"
                                        ></div>
                                    }else{
                                        <div className="control-btn play-btn on-log"
                                             onClick={this.handlePlayBtnClick}
                                             data-log-name="播放按钮"
                                             data-log-region="media-audio"
                                             data-log-pos="play-btn"
                                        ></div>
                                    }
                                }
                            )
                        }
                    </div>
                </div>
                <div className="panel-wrap">
                    <div className="title">{this.props.topicInfo.topic}</div>
                    <div className="desc">{this.props.topicInfo.name}</div>
                    {
	                    this.state.liveStatus === 'plan' ?
                            <div className="count-down-wrap">距开课还有：{this.state.day}天 {this.state.hours}时 {this.state.minutes}分 {this.state.second}秒</div>
                            :
		                    <Fragment>
                                <div className="progress-bar">
                                    <div ref="progressBar" className="drag-box">
                                        <div className="drag-progress" style={{width: `${this.state.liveStatus === 'beginning' ? '100' : this.state.progressPercent}%`}}></div>
					                    {
						                    this.state.liveStatus !== 'beginning' &&
                                            <div ref="progressBtn" className="drag-btn" style={this.getTransformStyle(this.getPosBtnXByProgressPercent(this.state.progressPercent))}></div>
					                    }
                                    </div>
                                </div>
                                <div className="time">
                                    <div className="current">{getAudioTimeShow(this.state.currentTime)}</div>
				                    {
					                    this.state.liveStatus !== 'beginning' &&
                                        <div className="duration">{getAudioTimeShow(this.state.duration)}</div>
				                    }
                                </div>
                            </Fragment>
                    }
                </div>
                <audio ref="audio" />
            </div>
        )
    }

    componentWillUnmount() {
        this.tipBoxTimer && clearTimeout(this.tipBoxTimer);
        this.audioHistorytimer && clearInterval(this.audioHistorytimer);
        this.audioControlBoxShowTimer && clearTimeout(this.audioControlBoxShowTimer);
    }
}

Audio.propTypes = {
    topicInfo: PropTypes.object,
};

export default Audio;
