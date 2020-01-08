import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import { findDOMNode } from 'react-dom';
import Detect from 'components/detect';
// import StackBlur from 'components/stack-blur';
import { imgUrlFormat,getAudioTimeShow,getVal,formatDate } from 'components/util';
import { autobind, throttle } from 'core-decorators';
import CountDown from '../media-box/count-down';
// import PlayTips from './components/play-tips';
import LoadingSvg from './components/loading-svg';
import CanvasVideoPlayer from 'components/canvas-video-player';
import { isWeixin,isPc } from 'components/envi';
// import QlTcPlayer from './components/ql-tc-video-player';

@autobind
class Video extends Component {
    state = {
        // 直播状态（plan-未开始；beginning-进行中；ended-已结束
        liveStatus: 'plan',
        // 推流状态
        pushLiveStatus: 0,

        // 播放进度条位置（%）
        progressPercent: 0,

        // 是否在等待缓冲资源
        isWaiting:false,

        // 没有媒体
        noMedia: false,
        // 是否谷歌浏览器
        isChrome:false,
        // 是否android
        isAndroid:false,
        
        urlList:[]
    }

    data = {
        startLogTime: 0,
    }
    
    componentDidMount() {
        this.setState({
            liveStatus: this.getLiveStatus(),
            isChrome:Detect.browser.chrome,
            isAndroid:Detect.os.android,
        }, () => {
            if (this.state.liveStatus != 'plan') {
                this.initPlayer();
            }
        });
        
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.pushStatus != this.props.pushStatus) {
            this.setState({
                pushLiveStatus:this.props.pushStatus,
            }, () => {
                this.updateNoMedia(true);
            })
        }
        if (prevProps.topicInfo.status != this.props.topicInfo.status) {
            this.setState({
                liveStatus:this.props.topicInfo.status
            })
            this.topicIsEnded();
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


    // 获取推送流状态
    async getPushLiveStatus() {
        if (this.props.topicInfo == 'ended'){
            return false
        }
        let pushLiveStatus = await this.props.getLiveStatus(this.props.topicInfo.id);
        this.setState({
            pushLiveStatus: getVal(pushLiveStatus, 'data.status', 0)
        }, () => {
            this.updateNoMedia(true);
        })
    }


    // 更新没有媒体状态
    updateNoMedia(status = false) {
        if (this.state.liveStatus == 'ended') {
            return false;
        }
        let noMedia = false;
        if (this.state.pushLiveStatus != 1 && this.state.isWaiting) {
            noMedia = 'leave'
        } else if(status && this.state.pushLiveStatus == 1 && this.state.isWaiting) {
            // 如果老师恢复播放流，且之前因为播放流中断卡住，则需要重置播放器。
            this.setState({
                isWaiting:false
            })
            this.canvasVideoPlayer.reloadPlayer();
            this.autoPlay();
        }
        this.setState({
            noMedia
        })
    }


    // 倒计时结束处理方法
    handleCountDownFinish() {
        this.setState({
            liveStatus: 'beginning'
        }, () => {
	        this.initPlayer();
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
                noMedia: 'noMedia',
            })
            return false;
        }
        this.data.urlList = urlList;
        // 话题已结束，但没有转码后的视频文件
        if (this.state.liveStatus == 'ended') {
            let urlItem = this.data.urlList.find(item => item.type == 'END_VOD');
            if (!urlItem) {
                this.setState({
                    noMedia: 'conversion',
                })
                return false;
            } else {
                this.setState({
                    playUrl: urlItem.playUrl,
                    urlList:this.data.urlList
                })
            }
        } else {
            
            let urlItem = this.data.urlList.find(item => item.type == 'HLS');
            let flvItem = this.data.urlList.find(item => item.type == 'FLV');
            this.setState({
                playUrl:urlItem.playUrl,
                playFlvUrl:flvItem.playUrl
            })
        }

        this.canvasVideoPlayer && this.canvasVideoPlayer.on('error', (e) => {
            console.log('video-error:',e);
            this.recordMediaReaded();
        });
        this.canvasVideoPlayer && this.canvasVideoPlayer.on('timeupdate', this.timeUpdate);
        this.canvasVideoPlayer && this.canvasVideoPlayer.on('ended', this.videoEnded);

        this.canvasVideoPlayer && this.canvasVideoPlayer.on('waiting', (e) => {
            if (!this.state.isWaiting) {
                this.setState({
                    isWaiting:true,
                }, () => {
                    this.updateNoMedia();
                    this.recordMediaReaded();
                })
            }
        });

        this.canvasVideoPlayer && this.canvasVideoPlayer.on('play', () => {
            this.data.startLogTime = Date.now();
        });

        this.canvasVideoPlayer && setTimeout(() => {
            this.autoPlay();
        }, 1000)
        
    }

    // 自动播放
    autoPlay() {
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

    // 直播中，话题忽然结束的提示与处理
    topicIsEnded() {
        if (this.props.topicInfo.status == 'ended') {
            setTimeout(() => {
                this.setState({
                    noMedia: 'ended',
                })
                if (this.player) {
                    this.player.destroy();
                } 
            }, 10000);
        }
    }

    timeUpdate(e) {
        this.updateMediaReaded();
    }

    videoEnded(e) {
        this.recordMediaReaded();
    }


    /**
     * 每3秒内只能提交一次，防止频繁提交
     */
    @throttle(3000)
    updateMediaReaded() {
        this.recordMediaReaded();
        this.data.startLogTime = Date.now();
    }


    /**
    * 完播率统计
    * @param {any} [second=this.canvasVideoPlayer.currentTime]
    * @memberof AudioPlayerController
    */
    recordMediaReaded(second = this.canvasVideoPlayer.currentTime) {
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
    
    render() {
        return (
            <div id='video-live-player-module' className="video-live-player-module">
                {
                    this.state.noMedia ?
                        <div className="cover-wrap">
                            <img id="bg-img" crossOrigin="" className="bg-img" src={`${imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750,m_fill,limit_0')}`} />
                            <span className="tips">
                                <LoadingSvg/>    
                                {
                                    this.state.noMedia == 'conversion' ?
                                        '视频转码中...'
                                        : this.state.noMedia == 'ended' ?
                                            '直播已结束,稍后刷新可以回放'
                                            : this.state.noMedia == 'leave' ?
                                                '主播暂时离开，稍后精彩继续'
                                                : '暂无视频源'
                                }
                            </span>
                        </div>
                        : null
                }
                {
                    this.state.liveStatus === 'plan'? 
                        <div className="cover-wrap">
                            <img id="bg-img" crossOrigin="" className="bg-img" src={`${imgUrlFormat(this.props.topicInfo.backgroundUrl,'?x-oss-process=image/resize,h_420,w_750,m_fill,limit_0')}`} />
                            <CountDown second={this.getLeftSeconds()} onFinish={this.handleCountDownFinish}/>
                        </div>
                    // :!this.state.isAndroid && this.state.isChrome && this.state.liveStatus === 'ended' && this.state.urlList.length ? 
                    //     // chrome无法播放m3u8，已结束话题只有m3u8地址。
                    //     // 某些安卓会检测isChrome = true
                    //     <QlTcPlayer
                    //         backgroundUrl={this.props.topicInfo.backgroundUrl}
                    //         liveStatus={this.state.liveStatus}
                    //         urlList={this.state.urlList}
                    //     />
                    :
                    this.state.playUrl ?
                        <CanvasVideoPlayer
                            poster={imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750')}
                            src={this.state.playUrl}
                            flvSrc={this.state.playFlvUrl}
                            isLive={this.state.liveStatus === 'beginning'}
                            hideTime={this.state.liveStatus === 'beginning'}
                            ref={el => (this.canvasVideoPlayer = el)}
                        />
                    :null
                }    
                

            </div>
        )
    }

}

Video.propTypes = {
    topicInfo: PropTypes.object,
};

export default Video;
