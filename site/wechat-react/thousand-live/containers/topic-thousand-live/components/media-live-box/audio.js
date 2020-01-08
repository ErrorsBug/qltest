import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Detect from 'components/detect';
// import StackBlur from 'components/stack-blur';
import { imgUrlFormat,getAudioTimeShow,getVal,formatDate, locationTo } from 'components/util';
import { autobind, throttle } from 'core-decorators';
import PlayTips from './components/play-tips';
import TopicStatus from './components/topic-status';
import VoiceRipple from './components/bg-voice-ripple';



@autobind
class Audio extends Component {
    state = {
        // 直播状态（plan-未开始；beginning-进行中；ended-已结束
        liveStatus: 'plan',
        // 推流状态
        pushLiveStatus: 0,

        // 播放进度条位置（%）
        progressPercent: 0,

        // 已播放时间
        currentTime: 0,
        
        // 音频总时间
        duration: 0,
        
        // 拖放时间
        seekTime: 0,
        showSeekTime:false,
        
        // 音频是否播放
        isAudioPlay: false,

        // 音频加载中状态
        isAudioLoading: false,

        isPc: !Detect.os.phone && !Detect.os.tablet,
        
        // 音频控制条旋转度数
        controlBgRotateDeg: 0,
        // 已开播时间
        startingTime: '00:00:00',
        // 转码中
        conversion:false,
    }
    
    data = {
        progressBarDomWidth: 0,
        startLogTime: 0,
    }

    componentDidMount() {
        typeof _qla != 'undefined' && _qla.collectVisible();
        this.setState({
            liveStatus: this.getLiveStatus()
        }, () => {
            if (this.state.liveStatus != 'plan') {
                this.initPlayer();
                this.initProgressBarDomWidth();
            }else{
	            this.initCountDown();
            }
            if (this.state.liveStatus == 'ended') this.initProgressBtnTouch();
            this.initStartTimeInterval();
        });
    }
    componentDidUpdate(prevProps,prevState) {
        if (prevProps.pushStatus != this.props.pushStatus) {
            this.setState({
                pushLiveStatus:this.props.pushStatus,
            })
        }
        if (prevProps.topicInfo.status != this.props.topicInfo.status) {
            this.setState({
                liveStatus:this.props.topicInfo.status
            })
        }
    }

    // 获取直播状态
    getLiveStatus() {
        let { startTime, endTime, status } = this.props.topicInfo;
        let { sysTime } = this.props;

        if (status === 'ended') {
            return 'ended';
        }

        if (Number(sysTime) < Number(startTime)) {
            return 'plan';
        }

        return 'beginning';

    }


    // 获取推送流状态和在线人数
    async getPushLiveStatus() {
        let pushLiveStatus = await this.props.getLiveStatus(this.props.topicInfo.id);
        // let onLiveNum = await this.props.getLiveOnlineNum(this.props.topicInfo.id);
        this.setState({
            pushLiveStatus: getVal(pushLiveStatus, 'data.status', 0)
        })
    }

   

    // 初始化展示信息。
    initPlayerInfo() {
        let duration = this.player.duration();
        if (duration && typeof duration == 'number') {
            this.setState({
                duration
            })
        }
        // 安卓无法自动播放，故不调用
        if (!Detect.os.android) {
            this.doPlay();
        }
    }


    /**
     *  倒计时
     *
     * @memberof Audio
     */
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

    // 倒计时结束处理方法
    handleCountDownFinish() {
        this.setState({
            liveStatus: 'beginning'
        }, () => {
	        this.initPlayer();
            this.initProgressBarDomWidth();
            this.props.updateCurrentTimeMillis && this.props.updateCurrentTimeMillis(this.props.topicInfo.startTime + 10);
        });

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


    // 请求播放地址 和 初始化音频直播播放器
    async initPlayer() {
        this.getPushLiveStatus();
        let result = await this.props.getLivePlayUrl(this.props.topicInfo.id, this.props.topicInfo.sourceTopicId);
        let urlList = getVal(result, 'data.list', []);
        
        if (!urlList.length) {
            this.setState({
                noMedia: true
            })
            return false;
        }
        this.data.urlList = urlList;

        if (this.state.liveStatus == 'ended') {
            let urlItem = this.data.urlList.find(item => item.type == 'END_VOD');
            if (!urlItem) {
                this.setState({
                    conversion:true
                })
            }
        }
        this.initNormalAudio();
        // if (Detect.os.android) {
        //     this.initNormalAudio();
        // } else {
        //     if (typeof TcPlayer != 'undefined') {
        //         this.initTcPlayer();
        //     } else {
        //         setTimeout(() => {
        //             this.initPlayer();
        //         }, 1000);
        //     }
        // }
        
    }


    // 初始化普通播放器
    async initNormalAudio() {
        let urlItem;
        if (this.state.liveStatus == 'beginning') {
            urlItem = this.data.urlList.find(item=>item.type == 'HLS');
        } else {
            urlItem = this.data.urlList.find(item => item.type == 'END_VOD');
        }

        this.player = document.createElement("audio");
        this.player.style.height = 0;
        this.player.style.width = 0;
        this.player.style.visibility = 'hidden';
        // this.player.preload = 'auto';
        this.player.autoplay = 'autoplay';

        // 测试使用的代码，保留
        // this.player.style.position = "absolute";
        // this.player.style.left = "0";
        // this.player.style.top = "50%";
        // this.player.style.zIndex = "999";
        // this.player.controls = true;
        // this.player.style.height = '100px';
        // this.player.style.width = '500px';
        // this.player.style.visibility = 'visible';

        
        document.body.appendChild(this.player);
        if(!Detect.os.phone){
            if(!this.Hls){
                this.Hls = await require.ensure([], (require) => {
                    return require('hls.js');
                }, 'hls');
            }
            if(this.Hls.isSupported()){
                await new Promise(resolve => {
                    const hls = new this.Hls();
                    hls.loadSource(urlItem.playUrl);
                    hls.attachMedia(this.player);
                    hls.on(this.Hls.Events.MANIFEST_PARSED, () => {
                        resolve();
                    });
                });
            }else{
                window.toast( '此浏览器不支持视频流播放')
            }

        }else{
            this.player.src = urlItem.playUrl;
        }

        this.player.addEventListener('play', this.playHandle, false);
        this.player.addEventListener('ended', this.endedHandle, false);
        this.player.addEventListener('pause', this.pauseHandle, false);
        this.player.addEventListener('timeupdate', () => { 
            if(this.state.duration != this.player.duration){
                this.setState({
                    duration:this.player.duration
                })
            }
            this.timeupdateHandle(this.player.currentTime);
        }, false);
        this.player.addEventListener('loadedmetadata', () => { 
            this.setState({
                duration:this.player.duration
            })
        }, false);

        this.player.destroy = () => {
            document.body.removeChild(this.player);
            this.player = null;
        }

        

    }


    // 初始化tc播放器
    // initTcPlayer() {
    //     this.data.options = {
    //         autoplay : false,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
    //         // coverpic : "http://www.test.com/myimage.jpg",
    //         // x5_type:'h5',
    //         // x5_fullscreen: false,
    //         // systemFullscreen: false,
    //         // controls: 'none',
    //         width :  '480',//视频的显示宽度，请尽量使用视频分辨率宽度
    //         height: '300',//视频的显示高度，请尽量使用视频分辨率高度
    //         listener: (msg) => {
    //             if (msg.type == 'timeupdate') {
    //                 let currentTime = this.player.currentTime();
    //                 this.timeupdateHandle(currentTime);
    //             }
    //             if(msg.type == 'loadedmetadata'){
    //                 this.initPlayerInfo();
    //             }
    //             if(msg.type == 'play'){
    //                 this.playHandle()
    //             }
    //             if(msg.type == 'pause'){
    //                 this.pauseHandle();
    //             }
    //             if (msg.type == 'ended') {
    //                 this.endedHandle();
    //             }
    //             if (msg.type == 'error') {
    //                 console.log(msg)
    //             }
    //         }
    //     }

    //     if (this.state.liveStatus == 'beginning') {
    //         // let flvItem = this.data.urlList.find(item=>item.type == 'HLS');
    //         // console.log(flvItem.playUrl);
    //         // this.data.options.m3u8 = flvItem.playUrl;
    //         // this.data.options.mp4 = '//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4';
    //         this.data.urlList.map(item => {
    //             let type = item.type.toLowerCase();
    //             if (type == 'hls') {
    //                 type = 'm3u8';
    //             }
    //             this.data.options[type] = item.playUrl;
    //             return item;
    //         })
    //         // 360浏览器使用rtmp播放会失败。
    //         if (this.check360()) {
    //             delete this.data.options.rtmp;
    //         }
    //     } else {
    //         let urlItem = this.data.urlList.find(item => item.type == 'END_VOD');
    //         if (urlItem.playUrl) {
    //             this.data.options.m3u8 = urlItem.playUrl;
    //         }
    //     }

    //     this.player = new TcPlayer('tencent_video', this.data.options);


    // }

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
    


    // 开始播放处理
    playHandle() {
        this.setState({
            isAudioPlay:true,
            clicked:true,
        })
        this.startRotateControlBg();

        this.data.startLogTime = Date.now();
    }
    // 暂停处理
    pauseHandle() {
        this.setState({
            isAudioPlay:false
        })
        this.stopRotateControlBg();
        
        this.recordMediaReaded();
    }
    // 结束处理
    endedHandle() {
        this.setCurrentTime(0);
        this.setState({
            isAudioPlay: false,
            currentTime: 0,
            progressPercent: 0,
            playStatus: 'ended',
        })
        this.stopRotateControlBg();
        this.recordMediaReaded();
    }
    // 时间更新
    timeupdateHandle(currentTime) {
        if (!this.dragingFlag && this.state.isAudioPlay) {
            let progressPercent = this.state.duration && (currentTime / this.state.duration * 100) || 0;
            if(progressPercent > 100){
                progressPercent = 100;
            }
            if(progressPercent <  0){
                progressPercent = 0;
            }
            this.setState({
                currentTime,
                progressPercent ,
            })
        }
        this.updateMediaReaded()
    }

    /**
     * 每5秒内只能提交一次，防止频繁提交
    */
    @throttle(3000)
    updateMediaReaded() {
        this.recordMediaReaded();
        this.data.startLogTime = Date.now();
    }

    /**
     * 完播率统计
     * @param {any} [second=this.player.currentTime]
     * @memberof AudioPlayerController
     */
    recordMediaReaded(second = this.player.currentTime) {
        if (!second || second < 2) {
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
        
    // 设置当前已播放时间
    setCurrentTime(time) {
        this.player.currentTime = time;
        // if (Detect.os.android) {
        // } else {
        //     this.player.currentTime(time);
        // }
    }

    // 开始旋转播放控制背景
    startRotateControlBg() {
        let step = (timestamp) => {
            if (!this.conrtolBgRotating) {
                return;
            }
            this.setState({
                controlBgRotateDeg: (this.state.controlBgRotateDeg + 0.25) % 360,
            });

            requestAnimationFrame(step);
        }

        this.conrtolBgRotating = true;
        requestAnimationFrame(step);
    }

    // 停止旋转播放控制背景
    stopRotateControlBg() {
        this.conrtolBgRotating = false;
    }




    /*************   按钮点击处理部分  *************/

    // 执行播放
    doPlay() {
        this.player.play();
    }

    // 音频播放按钮点击处理
    @throttle(300)
    async handlePlayBtnClick() {
        
        this.setState({
            clicked:true,
        })

        if (this.state.noMedia) {
            window.toast('没有媒体文件');
            return false;
        }

        if (this.state.liveStatus === 'beginning' && this.state.pushLiveStatus != 1) {
            window.toast('暂无数据源');
            return false;
        }

        if (this.state.liveStatus === 'ended') {
            this.doPlay();
        }else if (this.state.liveStatus === 'beginning') {
            // 销毁重置是为了直播进行时 保持时间一致
            if (this.player) {
                this.player.destroy();
                this.player = null;
            } 
            this.initNormalAudio();
            // if (Detect.os.android) {
            //     this.initNormalAudio();
            // } else {
            //     this.player = new TcPlayer('tencent_video', this.data.options);
            // }
            setTimeout(() => {
                this.doPlay();
            }, 500);
        } 


    }

    // 音频暂停按钮点击处理
    @throttle(300)
    async handlePauseBtnClick() {
        if(Detect.os.android){
            this.player.pause();
        }else if (this.player) {
            this.player.pause();
            if (this.state.liveStatus === 'beginning') {
                setTimeout(() => {
                    if (this.player) {
                        this.player.destroy();
                        this.player = null;
                    }    
                },500)
            }
        } else {
            this.pauseHandle();
        }
    }

    /*************   滚动条处理部分  *************/

    // 初始化进度条宽度
    initProgressBarDomWidth() {
        let progressBarDom = typeof findDOMNode != 'undefined' && findDOMNode(this.refs.progressBar) || {};
        this.data.progressBarDomWidth = progressBarDom.offsetWidth || 0;
    }

    // 获取播放位置x坐标值
    getPosBtnXByProgressPercent(percent) {
        return percent * this.data.progressBarDomWidth / 100;
    }
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

    // seek播放到具体dom位置
    seekToByX(cx, diff) {

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
            progressPercent: percent,
            seekTime : parseInt(this.state.duration * percent / 100)
        });
    }

    // seek播放到具体百分比位置
    seekToPlay(percent) {
        let currentTime = parseInt(this.state.duration * percent / 100);
        if (currentTime >= 0) {
            this.setCurrentTime(currentTime);
            this.setState({
                currentTime: currentTime,
            });
        }
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
            this.setState({
                showSeekTime:true
            })

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
            this.setState({
                showSeekTime:false
            })

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



    followLive() {
        
        this.props.followLive(this.props.topicInfo.liveId,this.props.isFollow?'N':'Y');
    }


    // 已开播时间计时器
    initStartTimeInterval(){
        if (this.props.topicInfo.status != 'ended') {
            let afterTime = parseInt((this.props.sysTime - this.props.topicInfo.startTime)/1000);
            this.startTimeInv = setInterval(() => {
                if (this.props.topicInfo.status == 'ended'){
                    clearInterval(this.startTimeInv);
                } else {
                    afterTime++;
                    this.setState({
                        startingTime:getAudioTimeShow(afterTime,true)
                    })
                }
            },1000)
            
        }
    }

    render() {
        return (
            <div className="audio-live-player-module">
                <VoiceRipple
                    pushLiveStatus = {this.state.pushLiveStatus}
                    isAudioPlay = {this.state.isAudioPlay}
                    liveStatus = {this.state.liveStatus}
                />     
                <div id="tencent_video" className={`tencent-video${this.state.isPc ? ' pc' : ''}`}></div>
                <div className="audio-live-wrap">
                    <div className="left-flex">    
                        <div className={`poster${this.state.isAudioPlay ? ' playing' : ''}`}>
                            <div className={`content${this.state.liveStatus != 'plan'? ' cover' : ''}`}
                                style={{
                                    backgroundImage: `url(${imgUrlFormat(this.props.topicInfo.backgroundUrl,'?x-oss-process=image/resize,h_200,w_200,m_fill')})`,
                                    transform: `rotate3d(0,0,1,${this.state.controlBgRotateDeg}deg)`,
                                    OTransform: `rotate3d(0,0,1,${this.state.controlBgRotateDeg}deg)`,
                                    MozTransform: `rotate3d(0,0,1,${this.state.controlBgRotateDeg}deg)`,
                                    WebkitTransform: `rotate3d(0,0,1,${this.state.controlBgRotateDeg}deg)`,
                                    MozTransform: `rotate3d(0,0,1,${this.state.controlBgRotateDeg}deg)`,
                                }}
                            >
                            </div>
                            {
                                this.state.liveStatus != 'plan' &&
                                (
                                    this.state.isAudioPlay ?
                                        <div className={`control-btn ${this.state.isAudioLoading ? ' loading-icon': ' pause-btn'}`}
                                            onClick={this.handlePauseBtnClick}
                                        ></div>
                                        :
                                        <div className="control-btn play-btn"
                                            onClick={this.handlePlayBtnClick}
                                        ></div>
                                )
                            }
                            <PlayTips
                                liveStatus = {this.state.liveStatus}
                                isAudioPlay = {this.state.isAudioPlay}
                                clicked = {this.state.clicked}
                                pushLiveStatus = {this.state.pushLiveStatus}
                                handlePlayBtnClick = {this.handlePlayBtnClick}
                                conversion = {this.state.conversion}
                            />
                        </div>
                        <TopicStatus
                            conversion = {this.state.conversion}
                            liveStatus = {this.state.liveStatus}
                            pushLiveStatus = {this.state.pushLiveStatus}
                        />
                    </div>
                        
                    <div className="panel-wrap">
                        <div className="title">
                            <span>{this.props.topicInfo.topic}</span>    
                        </div>
                        {/* <div className="online-num">在线：{this.props.browseNum}</div> */}
                        <div className="online-num">累计：{this.props.browseNum}</div>
                    </div>
                    {
                        (/(beginning|plan)/.test(this.state.liveStatus) || (!this.props.power.allowSpeak && !this.props.power.allowMGLive && !this.props.isFollow))?
                        <div className="right-flex">
                            <div className="main"> 
                                {
                                    this.state.liveStatus === 'plan' ?
                                    <div className="date-time">
                                        <span className="date">{formatDate(this.props.topicInfo.startTime, 'yyyy.MM.dd')}</span>
                                        <span className="starting-time">{formatDate(this.props.topicInfo.startTime, 'hh:mm')}</span>
                                    </div>
                                    : this.state.liveStatus === 'beginning' ?
                                    <div className="date-time">
                                        <span className="starting-time">{this.state.startingTime }</span>
                                            </div>        
                                    :null        
                                }
                                {
                                    (!this.props.power.allowSpeak && !this.props.power.allowMGLive && !this.props.isFollow) ?
                                    <div className="follow-box" onClick={this.followLive}>
                                        <span className="btn-follow icon_plus">关注</span>    
                                    </div>
                                    :null    
                                }
                            </div>       
                        </div>
                        :null
                    }
                    {
                        this.props.power.allowMGLive && this.props.showCourseDataCardEntrance && 
                        (
                            <div 
                                className="course-data-entrance on-log on-visible"
                                data-log-region="DataCard"
                                data-log-pos={`tap_${this.props.topicInfo.style}`}
                                onClick={() => locationTo(`/wechat/page/course-data-card/${this.props.topicInfo.id}`)}>直播数据
                            </div>
                        )
                    }
                </div>
                {
                    this.state.liveStatus == 'ended' ?
                    <div className="audio-live-controls">
                        <span className="time">{getAudioTimeShow(this.state.currentTime)}</span>        
                        <Fragment>
                            <div className="progress-bar">
                                <div ref="progressBar" className="drag-box">
                                    <div className="drag-progress" style={{width: `${this.state.progressPercent}%`}}></div>
                                    <div ref="progressBtn" className="drag-btn" style={this.getTransformStyle(this.getPosBtnXByProgressPercent(this.state.progressPercent))}>
                                        {
                                            this.state.showSeekTime?
                                            <span className="goto-time">{getAudioTimeShow(this.state.seekTime||0)}/{getAudioTimeShow(this.state.duration||0)}</span>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                            <span className="time">{getAudioTimeShow(this.state.duration||0)}</span>        
                    </div>
                    :null
               }

               
            </div>
        )
    }

}

Audio.propTypes = {
    topicInfo: PropTypes.object,
};

export default Audio;
