import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-swipe';


import { isPc } from 'components/envi';
import { AudioPlayer } from 'components/audio-player';
import {  imgUrlFormat, digitFormat } from "components/util";

class PptSwiper extends Component {
    state = {
        allDuration: 0,
        playing: false,
        resourceData: [],
        startSlide: 0,
        audioUrl: '',
        currentDuration: 0,
    }
    data = {
        thisSlide: 0,
        thisTouches:null,
        swiping: false,
        currentIndex: 0,
        currentAudioIndex: 0,
        isBegin: true,
        playingAudio : '',

        audioCurrentTime: 0,
        currentTime: 0,

        // nextIndex:0,
        audioArray:[],
    }

    get currentAudio() {
        let audio = this.state.resourceData[this.data.currentIndex].audioList[this.data.currentAudioIndex] && 
            this.state.resourceData[this.data.currentIndex].audioList[this.data.currentAudioIndex].audioPlayer;
        return audio;
    }
    get currentContent() {
        let content = (this.state.resourceData[this.data.currentIndex] && 
            this.state.resourceData[this.data.currentIndex].audioList[this.data.currentAudioIndex]&& 
            this.state.resourceData[this.data.currentIndex].audioList[this.data.currentAudioIndex].content)||'';
        return content;
    }
    componentDidMount(){
        this.initResourceData();
        this.initAudio();
        this.redBar = document.getElementsByClassName('red-bar')[0];
    }

    async initResourceData(){
        let duration = 0;
        const resourceList = this.props.resourceList||[];
        const resourceData = [];
        await resourceList.forEach(item => {
            const parentData = item.list;
            const ele = {
                textList:[],
                audioList:[],
                content: item.content,
            }
            parentData.forEach(element => {
                
                if(element.type === 'text'){
                    ele.textList.push(element);
                    
                }else if(element.type === 'audio'){
                    element.audioPlayer =  new AudioPlayer();
                    element.audioPlayer.preLoad(element.content);
                    element.audioPlayer.volume = 1;
                    element.audioPlayer.on('ended',this.audioEnded.bind(this));
                    element.audioPlayer.on('pause',this.audioPause.bind(this));
                    element.audioPlayer.on('timeupdate',this.audioTimeupdate.bind(this));

                    this.data.audioArray.push(element);
                    ele.audioList.push(element);
                    duration += element.duration;
                    this.hasAudio = true;
                }
                
            });
            if(ele.audioList.length <= 0){
                duration +=4;
            }
            resourceData.push(ele);
        });
        this.setState({
            resourceData,
            allDuration: duration,
        });

        
    }

    initAudio(){
        if(this.props.musicUrl){
            this.bgAudio = new AudioPlayer();
            if(this.hasAudio ){
                if( isPc){
                    this.bgAudio.volume = 0.4;//背景音乐音量
                }else{
                    this.bgAudio.volume = 0.01;//背景音乐音量
                }
                
            }else{
                this.bgAudio.volume = 1;//背景音乐音量
            }
            
            
        }
        
        if(this.props.musicUrl){
            this.bgAudio.on('ended',()=>{
                this.bgAudio.resume();
            });
            this.bgAudio.on('pause',()=>{
                this.data.currentTime = this.bgAudio.currentTime+0.1;
            });
            
        }
    }

    onStartPlay(event){
        event.preventDefault();
        event.stopPropagation();

        // 点击播放15秒后弹出绑定的课程卡片
        if (!this._timerShowGoods) {
            this._timerShowGoods = setTimeout(() => {
                this.props.showGoods && this.props.showGoods();
            }, 15000)
        }

        if(this.playing){return false}
        this.setState({
            playing: true,
        });
        this.playing = true;
        if(this.data.isBegin){
            this.data.isBegin = false;
            this.data.currentIndex = 0;
            this.data.currentAudioIndex = 0;
            if(this.bgAudio){
                this.bgAudio.play(this.props.musicUrl);
                this.bgAudio.seek(1);
            }
            this.initCurrentInfo(); 
        }else{
            if(this.bgAudio){
                this.bgAudio.resume();
            }
            //没有音频的ppt帧的逻辑,默认播放4秒
            if(this.state.currentMediaInfo.audioList.length<=0){
                //没有音频的ppt帧的逻辑,默认播放4秒
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    let thisCurrentDuration = this.state.currentDuration + 4;
                    this.setState({
                        currentDuration: thisCurrentDuration
                    });
                    this.redBar.style.width = (thisCurrentDuration / this.state.allDuration * 100) +'%';
                    this.changeSlide();
                },4000);
                
            }
            const audioPlayer = this.currentAudio;
        
            audioPlayer && audioPlayer.resume();
        }
        
        
        
        if(!this.playNumClicked){
            this.props.setStatNum('playNum')
            this.playNumClicked = true;
        }
        
    };

    audioEnded(){
        const audioPlayer = this.currentAudio;
        this.setState({
            currentDuration: this.state.currentDuration + audioPlayer.currentTime
        });
        this.data.currentAudioIndex++;
        const playingAudio = this.currentContent;
        if(playingAudio){
            this.startPlay();
        }else{
            this.changeSlide();
        }
    }

    audioPause () {
        const playingAudio = this.currentContent;
        if(playingAudio){
            this.data.audioCurrentTime = playingAudio.currentTime+0.1;
        }
    }

    audioTimeupdate(){
        const audioPlayer = this.currentAudio;
        if(audioPlayer.currentTime>=0.01){
            this.redBar.style.width = ((this.state.currentDuration + audioPlayer.currentTime) / this.state.allDuration * 100) +'%';
        }
    }
    

    initCurrentInfo(){
        const currentMediaInfo = this.state.resourceData[this.data.currentIndex];
        this.setState({
            currentMediaInfo,
        },()=>{
            if(currentMediaInfo.audioList.length<=0){
                //没有音频的ppt帧的逻辑,默认播放4秒
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    let thisCurrentDuration = this.state.currentDuration + 4;
                    this.setState({
                        currentDuration: thisCurrentDuration
                    });
                    this.redBar.style.width = (thisCurrentDuration / this.state.allDuration * 100) +'%';
                    this.changeSlide();
                },4000);
                
            }else {
                //有音频的ppt帧的逻辑
                const playingAudio = (currentMediaInfo.audioList[this.data.currentAudioIndex] && currentMediaInfo.audioList[this.data.currentAudioIndex].content)||'';
                if(playingAudio){
                    this.startPlay();
                }
            }
            
        });
    };

    stopPpt(event){
        event.preventDefault();
        event.stopPropagation();
        if(!this.playing){return false}
        this.setState({
            playing: false,
        });
        this.playing = false;
        this.timer && clearTimeout(this.timer);
        this.bgAudio && this.bgAudio.pause();
        const audioPlayer = this.currentAudio;
        if(audioPlayer){
            audioPlayer.pause();
        }
        

    }

    changeSlide(){
        this.data.currentIndex++;

        this.data.currentAudioIndex=0;
        this.data.audioCurrentTime = 0;
        
        //ppt播放完毕，重新播放
        if(!this.state.resourceData[this.data.currentIndex]){ 
            this.redBar.style.width = '100%';
            this.props.showGoods && this.props.showGoods();
            
            this.setState({
                currentDuration: 0,
            },()=>{
                setTimeout(()=>{
                    if(this.bgAudio){
                        this.bgAudio.resume();
                    }
                    this.data.currentIndex = 0;
                    this.initCurrentInfo();
                    this.startPlay();
                    this.swiperEl.slide(this.data.currentIndex);
                    this.redBar.style.width = "0%";
                },600)
                
            });
            
            return false;
        }else{
            this.initCurrentInfo();
            this.swiperEl.slide(this.data.currentIndex);
        }
        
    }
    
    onSwiped(){
        this.props.swiperFun && this.props.swiperFun();
    }

    startPlay(){
        
        const audioPlayer = this.currentAudio;
        const src = this.currentContent;
        if(audioPlayer && audioPlayer.__playSrc){
            audioPlayer.resume();
            audioPlayer.seek(this.data.audioCurrentTime||0);
        }else if(audioPlayer && src){
            audioPlayer.play(src);
            audioPlayer.seek(this.data.audioCurrentTime||0);
        }
    };

    render() {
        const { resourceData, currentMediaInfo } = this.state;
        return (
            <div className="ppt-pic-list" ref={r => this.swiperBox = r} onClick={this.stopPpt.bind(this)}>
            
            <div className="top-bar">
                <div className="view-count">
                    <span className="count">{digitFormat(this.props.playNum,10000,['千','w'])}次观看</span>
                    <div className="pic">
                        {
                            this.props.watchList && this.props.watchList.map((item, index)=>{
                                return <span key={`pic-${index}`}><img src={imgUrlFormat(item.headImage||"https://img.qlchat.com/qlLive/liveCommon/normalLogo.png")}/></span>
                            })
                        }
                    </div>
                </div>
                {
                    currentMediaInfo && currentMediaInfo.textList &&
                    <div className="text">
                    {
                        currentMediaInfo.textList.map((item,index)=>{
                            if(item.type === 'text' ){
                                return <div key={`text-${index}`} dangerouslySetInnerHTML={this.props.dangerHtml(item.content)} ></div>;
                            }else return null
                        })
                    }
                    </div>
                }
            </div>
            
            {
                resourceData.length>0 && 
                <Swiper ref={r => this.swiperEl = r}
                    swipeOptions={{
                        startSlide: this.state.startSlide,
                        auto: 0,
                        callback: this.onSwiped.bind(this),
                        stopPropagation: false,
                        disableScroll: true
                    }}  
                    
                    className="pic-list" >
                    {
                        resourceData.length>0 && resourceData.map((item,index)=>{
                            return <div key={`pic-${index}`}><img src={imgUrlFormat(item.content,'?x-oss-process=image/resize,limit_0,w_720')} /></div>
                        })
                    }
                </Swiper>
            }
            {
                this.props.transcodStatus === 'transcoding'?
                <div className="transcoding-bg">合成中</div>
                :
                ( resourceData.length>0 && !this.state.playing && <div className="start-bg" onClick={this.onStartPlay.bind(this)}></div>)
            }

                <div className="play-progress-bar"><div className="red-bar"></div></div>
            </div>
        );
    }
}

PptSwiper.propTypes = {
    resourceList: PropTypes.array.isRequired,
    musicUrl: PropTypes.string,
};

export default PptSwiper;