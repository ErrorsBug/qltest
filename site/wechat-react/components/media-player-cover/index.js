import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AudioPlayer } from 'components/audio-player';
import { autobind,throttle } from 'core-decorators';


@autobind
export class MediaPlayerCover  {
    constructor(options) {
        this.data = {
            // playerType: 'audio',
            // 媒体列表
            mediaList: [],
            // 是否需要自动暂停
            autoStop: false,
            // 播放多少秒后暂停
            autoStopDuration: 0,
            // 正在播放的地址
            playingUrl: '',
            // 总时长
            duration:0,
            // 已播放总秒数
            prevAudioSecond: 0,
            playStatus:'stop',
        }

        this.options = options;

        this.initAudioPlayer();
        this.initVideoPlayer();
    }

    

    // 初始化音频播放器
    initAudioPlayer() {
        this.audioPlayer = new AudioPlayer();

		this.audioPlayer.on("timeupdate",this.audioTimeupdate);
		this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause', (e) => {
            this.data.playStatus = 'pause';
            if (this.options.updateStatus) {
                this.options.updateStatus('pause')
            }
        });
        this.audioPlayer.on('playing',(e) => {
            this.data.playStatus = 'playing';
        });
    }
    
    
    
    // 初始化视频播放器
    initVideoPlayer() {
        this.videoPlayer = document.createElement("VIDEO");
        this.videoPlayer.volume = 1;
        this.videoPlayer.playsInline = "true";
        this.videoPlayer.addEventListener("timeupdate", this.videoTimeupdate);
        this.videoPlayer.addEventListener('ended', (e) => {
            this.data.playStatus = 'stop';
            if (this.options.updateStatus) {
                this.options.updateStatus('ended')
            }
        });
        this.videoPlayer.addEventListener('pause', (e) => {
            this.data.playStatus = 'pause';
            if (this.options.updateStatus) {
                this.options.updateStatus('pause')
            }
        });
        this.videoPlayer.addEventListener('playing', (e) => {
            this.data.playStatus = 'playing';
            // if (this.options.updateStatus) {
            //     this.options.updateStatus('playing')
            // }
        });

        // 手机不能自动播放
        let touchHandle = (e) => {
            try {
                window.removeEventListener("touchstart",touchHandle)
                this.videoPlayer.play();
            } catch (error) {
                
            }
            return false;
        }
        window.addEventListener("touchstart", touchHandle);

    }


    // 更新播放器信息（音频列表，是否自动暂停）
    mediaPlayerUpdate(list,totalSeconds,autoStop,autoStopDuration) {
        this.data.mediaList = list ;
        this.data.duration = totalSeconds;
        if (autoStop) {
            this.data.autoStop = autoStop;
        }
        if (autoStopDuration) {
            this.data.autoStopDuration = autoStopDuration;
        }
    }

    // 开始播放
    async play() {
        if (!this.data.mediaList.length) {
            return false;
        }

        let url = this.data.mediaList[0];
        this.data.playingUrl = url;
        this.options.updateStatus('loading')
        if (/\.mp4/.test(url)) {
            this.pause();
            this.videoPlayer.src = url;
            this.videoPlayer.play();
        }else if(url.includes('.m3u8')){

            if(this.videoPlayer.canPlayType('application/vnd.apple.mpegurl')){
                this.videoPlayer.src = url;
                this.videoPlayer.play();
            }else{
                if(!this.Hls){
                    this.Hls = await require.ensure([], (require) => {
                        return require('hls.js');
                    }, 'hls');
                }
                if(this.Hls.isSupported()){
                    await new Promise(resolve => {
                        const hls = new this.Hls();
                        hls.loadSource(url);
                        hls.attachMedia(this.videoPlayer);
                        hls.on(this.Hls.Events.MANIFEST_PARSED, () => {
                            resolve();
                        });
                        this.videoPlayer.play();
                    });
                }else{
                    window.toast('此浏览器不支持视频流播放');
                }
            }
        } else {
            this.doPlayAudio(url) ;
        }

        
    }

    // 继续播放
    resume() {
        if (!this.data.playingUrl) {
            return false;
        }
        
        if (/\.mp4/.test(this.data.playingUrl)) {
            this.videoPlayer.play();
        } else {
            this.audioPlayer.resume();
        }

    }

    pause() {
        if (!this.data.playingUrl) {
            return false;
        }
        
        this.videoPlayer.pause();
        this.audioPlayer.pause();
        // if (this.options.updateStatus) {
        //     this.options.updateStatus('pause')
        // }
    }

    doPlayAudio(url) {
        this.data.playingUrl = url;
        this.audioPlayer.pause();
        this.audioPlayer.play(url);
    }

    // 音频播放器停止处理
    async audioEnded(e) {
        
        let nextAudioUrl = this.nextAudio();

        if (nextAudioUrl) {
            this.data.prevAudioSecond += this.audioPlayer.duration;
            this.doPlayAudio(nextAudioUrl)
        } else {
            this.data.playStatus = 'stop';
            if (this.options.updateStatus) {
                this.options.updateStatus('stop')
            }
        }
    }

    /**
     * 获取下一条音频
     *
     * @readonly
     *
     * @memberof ThousandLive
     */
    nextAudio(){
        let nextAudioUrl;
        let audioIndex = this.data.mediaList.findIndex((item, index, arr) => {
            return item == this.data.playingUrl;
        });

        // 如果找不到，audioIndex是为-1，就会又从第一条音频开始播放
        if(audioIndex < 0){
            return false
        }
        
        audioIndex++;
        
        if (audioIndex < this.data.mediaList.length) {
            nextAudioUrl = this.data.mediaList[audioIndex];
        }else{
            nextAudioUrl = false;
        }

        return nextAudioUrl;
    }

    @throttle(500)
    audioTimeupdate() {

        if (this.audioPlayer.currentTime > 0 && this.data.playStatus == 'playing' && this.options.updateStatus) {
            this.options.updateStatus('playing')
        }
        
        if (!this.data.autoStopDuration) {
            return false;
        }
        let currentTime = this.data.prevAudioSecond + this.audioPlayer.currentTime;
        if (this.data.autoStop && currentTime >= this.data.autoStopDuration) {
            this.audioPlayer.pause();
            this.audioPlayer.seek(0);
            this.audioPlayer.pause();
        }
    }
    @throttle(500)
    videoTimeupdate(e) {

        if (this.videoPlayer.currentTime > 0 && this.data.playStatus == 'playing' && this.options.updateStatus) {
            this.options.updateStatus('playing')
        }

        if (!this.data.autoStopDuration) {
            return false;
        }
        let currentTime = this.videoPlayer.currentTime;
        if (this.data.autoStop && currentTime >= this.data.autoStopDuration) {
            this.videoPlayer.pause();
            this.videoPlayer.seek(0);
            this.videoPlayer.pause();
        }
    }



}
